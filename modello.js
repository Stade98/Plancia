// Plancia Progetti: modello dei dati.
// Nell'app le voci sono un albero (ogni voce ha le sue sottofasi in "children").
// Per la sincronizzazione l'albero viene "appiattito": ogni voce diventa un elemento
// con il riferimento alla voce superiore (parent) e la posizione (order).
// Così i livelli di sottofasi sono illimitati e le modifiche si uniscono voce per voce.
(function (root) {
  'use strict';
  const uid = () => Math.random().toString(36).slice(2, 10);
  const STATI = ['todo', 'doing', 'wait', 'done'];
  const RIPETI = ['', 'daily', 'weekly', 'monthly', 'yearly'];
  const toPrio = v => (+v === 1 || +v === 2) ? 1 : 0;
  const ROOT = '__root';
  // una data è valida se è completa e con un anno plausibile
  const okDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && +v.slice(0, 4) >= 1900 && +v.slice(0, 4) <= 2200;

  function normalizeNode(n, fallbackU) {
    let status = n.done ? 'done' : (STATI.includes(n.status) ? n.status : 'todo');
    const kids = Array.isArray(n.children) ? n.children : (Array.isArray(n.tasks) ? n.tasks : []);
    const out = {
      id: n.id || uid(), title: String(n.title || ''), status, done: status === 'done',
      deadline: okDate(n.deadline) ? n.deadline : '', time: /^\d{2}:\d{2}$/.test(n.time || '') ? n.time : '',
      priority: toPrio(n.priority), note: String(n.note || ''), link: String(n.link || ''),
      assignee: String(n.assignee || ''), repeat: RIPETI.includes(n.repeat) ? n.repeat : '',
      completedAt: status === 'done' ? (n.completedAt || Date.now()) : 0,
      lastDone: n.lastDone || 0,
      u: n.u || fallbackU || Date.now(),
      children: kids.map(k => normalizeNode(k, n.u || fallbackU))
    };
    if (n.share && n.share.sid) out.share = { sid: String(n.share.sid), members: Object.assign({}, n.share.members || {}) };
    return out;
  }

  function normalize(p) {
    const base = p.updatedAt || p.createdAt || Date.now();
    let items;
    if (Array.isArray(p.nodes)) items = unflatten(p.nodes, ROOT);
    else items = Array.isArray(p.items) ? p.items : (Array.isArray(p.phases) ? p.phases : []);
    return {
      title: String(p.title || 'Senza titolo'), category: String(p.category || ''), priority: toPrio(p.priority),
      deadline: okDate(p.deadline) ? p.deadline : '', note: String(p.note || ''),
      example: !!p.example, archived: !!p.archived, template: !!p.template, pinned: !!p.pinned, inbox: !!p.inbox,
      order: p.order || 0, createdAt: p.createdAt || base, updatedAt: base, mu: p.mu || base,
      deletedNodes: Object.assign({}, p.deletedNodes || {}),
      items: items.map(n => normalizeNode(n, base))
    };
  }

  // albero → elenco piatto
  function flatten(nodes, parent = ROOT, out = []) {
    nodes.forEach((n, i) => {
      const rec = Object.assign({}, n, { parent, order: i });
      delete rec.children; delete rec.done;
      out.push(rec);
      flatten(n.children || [], n.id, out);
    });
    return out;
  }
  // elenco piatto → albero (le voci rimaste senza superiore tornano al primo livello)
  function unflatten(list, rootParent = ROOT) {
    const byId = {}, kids = {};
    list.forEach(r => { byId[r.id] = Object.assign({}, r, { children: [] }); });
    list.forEach(r => {
      let par = r.parent;
      if (par !== rootParent && !byId[par]) par = rootParent;
      if (par === r.id) par = rootParent;
      (kids[par] = kids[par] || []).push(byId[r.id]);
    });
    // protezione dai cicli: una voce non può stare sotto una sua discendente
    const seen = new Set();
    function build(par) {
      const arr = (kids[par] || []).sort((a, b) => (a.order - b.order) || String(a.id).localeCompare(String(b.id)));
      return arr.filter(n => { if (seen.has(n.id)) return false; seen.add(n.id); return true; })
        .map(n => { n.children = build(n.id); delete n.parent; delete n.order; return n; });
    }
    const tree = build(rootParent);
    // voci finite in un ciclo: recuperate al primo livello
    Object.values(byId).forEach(n => { if (!seen.has(n.id)) { seen.add(n.id); n.children = []; delete n.parent; delete n.order; tree.push(n); } });
    return tree;
  }

  // unione di due elenchi piatti: per ogni voce vince la modifica più recente
  function mergeFlat(a, b, delA = {}, delB = {}) {
    const del = Object.assign({}, delA);
    Object.entries(delB || {}).forEach(([k, t]) => { if (!del[k] || t > del[k]) del[k] = t; });
    const m = {};
    [...a, ...b].forEach(r => { const cur = m[r.id]; if (!cur || (r.u || 0) > (cur.u || 0)) m[r.id] = r; });
    const list = Object.values(m).filter(r => !(del[r.id] && del[r.id] >= (r.u || 0)));
    // eliminazioni ormai superate da una modifica successiva: si possono dimenticare
    Object.keys(del).forEach(k => { if (m[k] && (m[k].u || 0) > del[k]) delete del[k]; });
    return { list, del };
  }

  function toRecord(p) {
    const r = Object.assign({}, p);
    r.nodes = flatten(p.items || []);
    delete r.items;
    return JSON.parse(JSON.stringify(r));
  }
  function fromRecord(r) { return normalize(r); }

  function mergeProject(x, y) {
    const rx = x.nodes ? x : toRecord(normalize(x)), ry = y.nodes ? y : toRecord(normalize(y));
    const meta = (ry.mu || 0) > (rx.mu || 0) ? ry : rx;
    const { list, del } = mergeFlat(rx.nodes || [], ry.nodes || [], rx.deletedNodes, ry.deletedNodes);
    const out = Object.assign({}, meta, { nodes: list, deletedNodes: del, updatedAt: Math.max(rx.updatedAt || 0, ry.updatedAt || 0) });
    return out;
  }

  // stato completo: { projects: {id: record}, deleted: {id: ts}, prefs: {...} }
  function mergeState(a, b) {
    const del = Object.assign({}, a.deleted || {});
    Object.entries(b.deleted || {}).forEach(([k, t]) => { if (!del[k] || t > del[k]) del[k] = t; });
    const out = {};
    new Set([...Object.keys(a.projects || {}), ...Object.keys(b.projects || {})]).forEach(id => {
      const x = (a.projects || {})[id], y = (b.projects || {})[id];
      let w = x && y ? mergeProject(x, y) : (x || y);
      if (!w.nodes) w = toRecord(normalize(w));
      if (del[id] && del[id] >= (w.updatedAt || 0)) return;
      out[id] = w;
    });
    const pa = a.prefs || {}, pb = b.prefs || {};
    const prefs = (pb.u || 0) > (pa.u || 0) ? pb : pa;
    return { projects: out, deleted: del, prefs };
  }

  // stato di una voce: per le voci con sottofasi si calcola da quelle interne
  function statusOf(n) {
    if (!n.children || !n.children.length) return n.status;
    const st = n.children.map(statusOf);
    if (st.every(s => s === 'done')) return 'done';
    if (st.some(s => s === 'doing' || s === 'done')) return 'doing';
    if (st.some(s => s === 'wait')) return 'wait';
    return 'todo';
  }

  // forma canonica per confrontare due stati: chiavi ordinate, voci ordinate per id,
  // campi vuoti ignorati. Due stati con lo stesso contenuto danno lo stesso testo.
  function canon(v) {
    if (Array.isArray(v)) {
      const arr = v.map(canon);
      if (v.length && v.every(x => x && typeof x === 'object' && 'id' in x)) arr.sort((a, b) => String(a.id).localeCompare(String(b.id)));
      return arr;
    }
    if (v && typeof v === 'object') {
      const o = {};
      Object.keys(v).sort().forEach(k => { const x = v[k]; if (x === undefined || x === null || x === '' ) return; o[k] = canon(x); });
      return o;
    }
    return v;
  }
  const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
  // toglie i valori non accettati da Firebase (undefined) prima dell'invio
  const clean = v => JSON.parse(JSON.stringify(v));

  const api = { okDate, uid, ROOT, normalize, normalizeNode, flatten, unflatten, mergeFlat, mergeProject, mergeState, toRecord, fromRecord, statusOf, canon, same, clean };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PlanciaModel = api;
})(typeof window !== 'undefined' ? window : globalThis);
