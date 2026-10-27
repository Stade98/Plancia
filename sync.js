// Plancia Progetti: sincronizzazione e condivisione con Firebase.
// - utenti/<id>          i progetti dell'autore (solo l'autore può leggerli)
// - condivisi/<id>       un ramo condiviso (una voce con le sue sottofasi)
// - inviti/<email>       l'elenco dei rami condivisi con quella persona

const P = window.Plancia;
const M = window.PlanciaModel;
const cfg = window.PLANCIA_FIREBASE;
const V = '10.12.2';

const MESSAGGI = {
  'auth/invalid-email': 'L’indirizzo email non è valido.',
  'auth/missing-password': 'Inserisci la password.',
  'auth/weak-password': 'La password deve avere almeno 6 caratteri.',
  'auth/email-already-in-use': 'Esiste già un account con questa email: usa “Accedi”.',
  'auth/invalid-credential': 'Email o password non corrette.',
  'auth/wrong-password': 'Email o password non corrette.',
  'auth/user-not-found': 'Nessun account con questa email: usa “Crea account”.',
  'auth/too-many-requests': 'Troppi tentativi. Attendi qualche minuto e riprova.',
  'auth/network-request-failed': 'Nessuna connessione. Riprova quando sei online.',
  'auth/operation-not-allowed': 'L’accesso con email e password non è attivo nel progetto Firebase (vedi LEGGIMI).',
  'permission-denied': 'Firebase ha rifiutato l’operazione: controlla le regole di sicurezza indicate nel LEGGIMI.',
  'unavailable': 'Nessuna connessione: le modifiche restano su questo dispositivo e verranno inviate appena torni online.'
};
const msg = e => MESSAGGI[e && e.code] || ('Errore imprevisto' + (e && e.code ? ` (${e.code})` : '') + '. Riprova.');
const ora = () => new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

async function avvia() {
  if (!P || !M) return;
  if (!cfg || !cfg.apiKey) { P.sync({ state: 'off' }); return; }

  let A, F, auth, db;
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
    ]);
    A = authMod; F = fsMod;
    const app = appMod.initializeApp(cfg);
    auth = A.getAuth(app);
    db = F.getFirestore(app);
  } catch (e) {
    P.sync({ state: 'err', message: 'Sincronizzazione non disponibile senza connessione: le modifiche restano su questo dispositivo.' });
    window.addEventListener('online', () => location.reload(), { once: true });
    return;
  }

  let utente = null, email = '', ref = null, autore = true;
  let stopUser = null, stopInviti = null;
  const subsShare = {}, ultimoShare = {}, subsOspite = {};
  const timers = {}, inCorso = {}, ripeti = {};

  const stato = (state, message) => P.sync({ state, email, message, guest: !autore });

  // un'operazione alla volta per documento, con raccolta delle richieste ravvicinate
  function programma(key, fn, ms = 900) {
    clearTimeout(timers[key]);
    timers[key] = setTimeout(async () => {
      if (inCorso[key]) { ripeti[key] = true; return; }
      inCorso[key] = true;
      try { await fn(); } catch (e) { stato('err', msg(e)); }
      finally { inCorso[key] = false; if (ripeti[key]) { ripeti[key] = false; programma(key, fn, 300); } }
    }, ms);
  }

  /* ---------- progetti dell'autore ---------- */
  async function inviaUtente() {
    if (!ref || !autore) return;
    stato('wait', 'Invio delle modifiche…');
    const unito = await F.runTransaction(db, async tx => {
      const snap = await tx.get(ref);
      const remoto = snap.exists() ? snap.data() : {};
      const u = M.mergeState(P.getState(), { projects: remoto.projects || {}, deleted: remoto.deleted || {}, prefs: remoto.prefs || {} });
      tx.set(ref, M.clean({ projects: u.projects, deleted: u.deleted, prefs: u.prefs || {}, updatedAt: Date.now() }));
      return u;
    });
    P.apply(unito);
    // se nel frattempo sono state fatte altre modifiche, si inviano subito dopo
    if (!M.same(P.getState().projects, unito.projects)) programma('utente', inviaUtente, 300);
    stato('ok', `Ultima sincronizzazione alle ${ora()}.`);
    allineaCondivisi();
  }

  /* ---------- rami condivisi dall'autore ---------- */
  function membri(info) {
    const editors = [], readers = [];
    Object.entries(info.members || {}).forEach(([e, perm]) => (perm === 'edit' ? editors : readers).push(e));
    return { editors, readers };
  }
  async function inviaRamo(sid) {
    const info = P.ownedShares().find(s => s.sid === sid);
    if (!info || !utente) return;
    const rref = F.doc(db, 'condivisi', sid);
    const loc = P.subtree(info.pid, info.nodeId);
    if (!loc) return;
    const { editors, readers } = membri(info);
    const unito = await F.runTransaction(db, async tx => {
      const snap = await tx.get(rref);
      const r = snap.exists() ? snap.data() : null;
      const rNodes = r ? (r.nodes || []) : [], rDel = r ? (r.deletedNodes || {}) : {};
      const ids = new Set(rNodes.map(n => n.id).concat(Object.keys(rDel)));
      const locDel = {}; Object.entries(loc.deletedNodes).forEach(([k, t]) => { if (ids.has(k)) locDel[k] = t; });
      const m = M.mergeFlat(loc.nodes, rNodes, locDel, rDel);
      tx.set(rref, M.clean({ owner: utente.uid, ownerEmail: email, projTitle: loc.projTitle, rootId: info.nodeId,
        editors, readers, nodes: m.list, deletedNodes: m.del, updatedAt: Date.now(), log: r ? (r.log || []) : [] }));
      return m;
    });
    P.applyShareOwner(sid, { nodes: unito.list, deletedNodes: unito.del });
  }
  // tiene allineati gli ascolti dei rami condivisi con quelli presenti nei dati
  function allineaCondivisi() {
    if (!utente || !autore) return;
    const attuali = P.ownedShares();
    const ids = new Set(attuali.map(s => s.sid));
    attuali.forEach(s => {
      if (subsShare[s.sid]) return;
      const rref = F.doc(db, 'condivisi', s.sid);
      subsShare[s.sid] = F.onSnapshot(rref, snap => {
        if (snap.metadata.hasPendingWrites) return;
        if (!snap.exists()) {
          // ramo ripristinato dopo un'eliminazione annullata: si ricrea con i suoi inviti
          programma('ramo:' + s.sid, async () => {
            await inviaRamo(s.sid);
            const info = P.ownedShares().find(x => x.sid === s.sid);
            if (info) await Promise.all(Object.keys(info.members || {}).map(e => F.setDoc(F.doc(db, 'inviti', e), { shares: F.arrayUnion(s.sid), da: email }, { merge: true })));
          }, 200);
          return;
        }
        const d = snap.data(); ultimoShare[s.sid] = d;
        P.applyShareOwner(s.sid, { nodes: d.nodes || [], deletedNodes: d.deletedNodes || {}, log: d.log || [] });
      }, e => stato('err', msg(e)));
    });
    // rami non più presenti (voce eliminata): si chiude la condivisione
    Object.keys(subsShare).forEach(async sid => {
      if (ids.has(sid)) return;
      subsShare[sid](); delete subsShare[sid];
      const d = ultimoShare[sid]; delete ultimoShare[sid];
      try {
        await F.deleteDoc(F.doc(db, 'condivisi', sid));
        const persone = d ? [...(d.editors || []), ...(d.readers || [])] : [];
        await Promise.all(persone.map(e => F.setDoc(F.doc(db, 'inviti', e), { shares: F.arrayRemove(sid) }, { merge: true })));
      } catch (e) { /* nessun problema se era già stato rimosso */ }
    });
  }

  window.PlanciaSync = {
    get user() { return utente ? { email, uid: utente.uid, owner: autore, verified: utente.emailVerified } : null; },
    async share(pid, nodeId, e, perm) {
      e = String(e || '').trim().toLowerCase();
      if (!utente || !autore) throw { code: 'not-owner' };
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw { code: 'auth/invalid-email' };
      const sid = utente.uid + '_' + nodeId;
      P.setShareMember(pid, nodeId, sid, e, perm);
      await inviaRamo(sid);
      await F.setDoc(F.doc(db, 'inviti', e), { shares: F.arrayUnion(sid), da: email }, { merge: true });
      allineaCondivisi();
    },
    async setPerm(pid, nodeId, e, perm) {
      const info = P.ownedShares().find(s => s.nodeId === nodeId); if (!info) return;
      P.setShareMember(pid, nodeId, info.sid, e, perm);
      await inviaRamo(info.sid);
    },
    async remove(pid, nodeId, e) {
      const info = P.ownedShares().find(s => s.nodeId === nodeId); if (!info) return;
      const rimasti = P.removeShareMember(pid, nodeId, e);
      await F.setDoc(F.doc(db, 'inviti', e), { shares: F.arrayRemove(info.sid) }, { merge: true });
      if (rimasti) await inviaRamo(info.sid);
      else { await F.deleteDoc(F.doc(db, 'condivisi', info.sid)).catch(() => {}); if (subsShare[info.sid]) { subsShare[info.sid](); delete subsShare[info.sid]; } }
    },
    pushGuest(sid) { programma('ospite:' + sid, () => inviaOspite(sid), 700); }
  };

  /* ---------- rami condivisi con me ---------- */
  async function inviaOspite(sid) {
    const loc = P.guestState(sid); if (!loc || loc.perm !== 'edit') return;
    const rref = F.doc(db, 'condivisi', sid);
    stato('wait', 'Invio delle modifiche…');
    const unito = await F.runTransaction(db, async tx => {
      const snap = await tx.get(rref);
      if (!snap.exists()) throw { code: 'not-found' };
      const r = snap.data();
      const m = M.mergeFlat(loc.nodes, r.nodes || [], loc.deletedNodes, r.deletedNodes || {});
      const log = (r.log || []).slice(-19);
      if (loc.action) log.push({ t: Date.now(), who: email, what: loc.action });
      tx.update(rref, M.clean({ nodes: m.list, deletedNodes: m.del, updatedAt: Date.now(), log }));
      return m;
    });
    P.applyGuest(sid, { nodes: unito.list, deletedNodes: unito.del });
    stato('ok', `Ultima sincronizzazione alle ${ora()}.`);
  }
  function ascoltaInviti() {
    if (stopInviti) stopInviti();
    if (!utente.emailVerified) {
      P.sync({ state: 'err', email, guest: !autore, message: 'Conferma la tua email con il link che ti abbiamo inviato, poi ricarica la pagina per vedere ciò che è condiviso con te.' });
      return;
    }
    stopInviti = F.onSnapshot(F.doc(db, 'inviti', email), snap => {
      const sids = snap.exists() ? (snap.data().shares || []) : [];
      sids.forEach(sid => {
        if (subsOspite[sid]) return;
        subsOspite[sid] = F.onSnapshot(F.doc(db, 'condivisi', sid), s => {
          if (s.metadata.hasPendingWrites) return;
          if (!s.exists()) { P.setGuestShare(sid, null); return; }
          const d = s.data();
          if (d.owner === utente.uid) return;
          P.setGuestShare(sid, Object.assign({}, d, { perm: (d.editors || []).includes(email) ? 'edit' : 'read' }));
        }, () => P.setGuestShare(sid, null));
      });
      Object.keys(subsOspite).forEach(sid => { if (!sids.includes(sid)) { subsOspite[sid](); delete subsOspite[sid]; P.setGuestShare(sid, null); } });
    }, () => {});
  }

  /* ---------- accesso ---------- */
  P.onLocalChange(pids => {
    if (!ref) return;
    if (autore) programma('utente', inviaUtente);
    P.ownedShares().filter(s => !pids || pids.includes(s.pid)).forEach(s => programma('ramo:' + s.sid, () => inviaRamo(s.sid)));
  });
  window.addEventListener('online', () => { if (ref && autore) programma('utente', inviaUtente, 100); });

  A.onAuthStateChanged(auth, u => {
    if (stopUser) { stopUser(); stopUser = null; }
    if (stopInviti) { stopInviti(); stopInviti = null; }
    Object.values(subsShare).forEach(f => f()); Object.keys(subsShare).forEach(k => delete subsShare[k]);
    Object.values(subsOspite).forEach(f => f()); Object.keys(subsOspite).forEach(k => delete subsOspite[k]);
    utente = u; email = u ? String(u.email || '').toLowerCase() : ''; ref = null; autore = true;
    P.syncUser(u ? { email, uid: u.uid } : null);
    if (!u) { P.clearGuest(); stato('out'); return; }
    ref = F.doc(db, 'utenti', u.uid);
    stato('wait', 'Allineamento con il tuo account…');
    let primo = true;
    stopUser = F.onSnapshot(ref, snap => {
      if (snap.metadata.hasPendingWrites) return;
      const remoto = snap.exists() ? snap.data() : {};
      const r = { projects: remoto.projects || {}, deleted: remoto.deleted || {}, prefs: remoto.prefs || {} };
      const loc = P.getState();
      const unito = M.mergeState(loc, r);
      const daInviare = !M.same(M.mergeState(r, { projects: {} }).projects, unito.projects) || (primo && !snap.exists());
      P.apply(unito);
      primo = false;
      if (daInviare) programma('utente', inviaUtente, 200);
      else stato('ok', `Ultima sincronizzazione alle ${ora()}.`);
      allineaCondivisi();
    }, e => {
      if (e && e.code === 'permission-denied') {
        // account ospite: si vedono solo i rami condivisi con questa persona
        autore = false; ref = F.doc(db, 'utenti', u.uid);
        P.syncUser({ email, uid: u.uid, guest: true });
        stato('ok', 'Account ospite: vedi e modifichi solo ciò che è condiviso con te. I tuoi progetti personali restano su questo dispositivo.');
      } else stato('err', msg(e));
    });
    ascoltaInviti();
  });

  // modulo di accesso
  const emailEl = document.getElementById('au-email');
  const pass = document.getElementById('au-pass');
  document.getElementById('authform').addEventListener('submit', async e => {
    e.preventDefault();
    stato('out', 'Accesso in corso…');
    try { await A.signInWithEmailAndPassword(auth, emailEl.value.trim(), pass.value); pass.value = ''; }
    catch (err) { stato('out', msg(err)); }
  });
  document.getElementById('au-create').addEventListener('click', async () => {
    if (!emailEl.value.trim() || pass.value.length < 6) { stato('out', 'Scrivi email e una password di almeno 6 caratteri, poi premi di nuovo “Crea account”.'); return; }
    stato('out', 'Creazione dell’account…');
    try {
      const cred = await A.createUserWithEmailAndPassword(auth, emailEl.value.trim(), pass.value); pass.value = '';
      try { await A.sendEmailVerification(cred.user); } catch (e) {}
    } catch (err) { stato('out', msg(err)); }
  });
  document.getElementById('au-reset').addEventListener('click', async () => {
    if (!emailEl.value.trim()) { stato('out', 'Scrivi prima la tua email nel campo qui sopra.'); return; }
    try { await A.sendPasswordResetEmail(auth, emailEl.value.trim()); stato('out', 'Ti abbiamo inviato un’email per scegliere una nuova password.'); }
    catch (err) { stato('out', msg(err)); }
  });
  document.getElementById('sync-now').addEventListener('click', () => { if (autore) programma('utente', inviaUtente, 0); else location.reload(); });
  document.getElementById('sync-logout').addEventListener('click', async () => {
    await A.signOut(auth);
    stato('out', 'Sei uscito: i progetti restano su questo dispositivo, ma non si sincronizzano più finché non accedi di nuovo.');
  });
}

avvia();
