// Plancia Progetti: raccolta di icone e scelta automatica in base alle parole.
// Ogni icona ha: chiave, nome, disegno (tracciati SVG 24×24) e parole italiane che la richiamano.
// Le parole che finiscono con * valgono anche per le loro varianti (infermier* = infermiere, infermieristica…).
// L'ordine conta: le icone più specifiche stanno prima di quelle generiche.
(function (root) {
  'use strict';
  const SET = [
    ['emergenza', 'Emergenza', '<path d="M3 17h2l1-5h9l3 3h3v2h-2"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/><path d="M10 8V4M8 6h4"/>',
      ['emergenz*', 'urgenz*', '118', '112', 'pronto soccorso', 'ps', 'dea', 'soccorso', 'ambulanz*', 'triage', 'maxiemergenz*', 'elisoccorso']],
    ['critica', 'Area critica', '<path d="M3 12h4l2-5 3 10 3-8 2 3h4"/>',
      ['terapia intensiva', 'rianimazion*', 'intensiv*', 'area critica', 'critica', 'cardio*', 'ecg', 'monitoraggio', 'utic', 'shock']],
    ['ostetricia', 'Ostetricia', '<circle cx="12" cy="6" r="3"/><path d="M8 21v-5a4 4 0 0 1 8 0v5"/><circle cx="12" cy="15" r="2.2"/>',
      ['ostetric*', 'neonat*', 'parto', 'gravidanz*', 'pediatri*', 'maternit*', 'nascita', 'consultorio']],
    ['farmaco', 'Terapia e farmaci', '<path d="M18 2l4 4M15 5l4 4M17 7L8 16l-3 1 1-3 9-9M9 9l2 2M12 6l2 2"/><path d="M3 21l3-3"/>',
      ['farmac*', 'terapi*', 'vaccin*', 'somministrazion*', 'infusion*', 'prescrizion*']],
    ['mente', 'Salute mentale', '<path d="M9 4a4 4 0 0 0-4 4 3.5 3.5 0 0 0-1 6.5A3.5 3.5 0 0 0 9 20h1V4z"/><path d="M15 4a4 4 0 0 1 4 4 3.5 3.5 0 0 1 1 6.5A3.5 3.5 0 0 1 15 20h-1V4z"/>',
      ['psicolog*', 'psichiatr*', 'salute mentale', 'neuro*', 'mindfulness', 'stress', 'burnout']],
    ['clinica', 'Clinica', '<path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v3a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>',
      ['clinic*', 'reparto', 'reparti', 'ospedal*', 'tirocini*', 'pazient*', 'assistenz*', 'infermier*', 'sanit*', 'ambulatori*', 'corsia', 'degenza', 'medicina', 'chirurgi*', 'turni', 'turno', 'asl', 'usl', 'aou', 'careggi']],
    ['procedura', 'Procedure', '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
      ['protocoll*', 'procedur*', 'linee guida', 'pdta', 'checklist', 'istruzion*', 'buone pratiche', 'evidence']],
    ['sicurezza', 'Sicurezza e rischio', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
      ['sicurezz*', 'rischio', 'rischi', 'prevenzion*', 'privacy', 'infezion*', 'igiene', 'incident*', 'eventi avversi']],
    ['qualita', 'Qualità e dati', '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
      ['qualit*', 'indicator*', 'kpi', 'dati', 'statistic*', 'audit', 'miglioramento', 'analisi', 'report', 'monitoraggi*', 'valutazion*', 'performance', 'outcome', 'esiti']],
    ['logistica', 'Acquisti e logistica', '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
      ['outsourcing', 'appalt*', 'acquist*', 'magazzin*', 'consumi', 'fornitur*', 'logistic*', 'dispositivi', 'approvvigionament*', 'gara', 'gare']],
    ['management', 'Management', '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>',
      ['management', 'coordinament*', 'direzion*', 'organizzazion*', 'gestion*', 'leadership', 'governance', 'manageriale', 'project work', 'risorse umane', 'strategi*']],
    ['congresso', 'Congressi', '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
      ['congress*', 'convegn*', 'conferenz*', 'relazion*', 'simposi*', 'webinar', 'podcast', 'aniarti', 'siiet', 'intervento', 'abstract', 'meeting']],
    ['presentazione', 'Presentazioni', '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8M7 12l3-3 2 2 4-4"/>',
      ['presentazion*', 'slide', 'poster', 'seminari*', 'pitch', 'keynote', 'powerpoint']],
    ['ricerca', 'Ricerca', '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5"/><path d="M14 3l4 4v3"/><circle cx="16.5" cy="16.5" r="3.5"/><path d="M19 19l2.5 2.5"/>',
      ['ricerc*', 'revisione', 'review', 'articol*', 'pubblicazion*', 'rivista', 'paper', 'scoping', 'sistematica', 'pubmed', 'cinahl', 'manoscritto']],
    ['laboratorio', 'Laboratorio', '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7 15h10"/>',
      ['laborator*', 'sperimentazion*', 'trial', 'campion*', 'esperiment*', 'studio clinico', 'rct']],
    ['formazione', 'Formazione', '<circle cx="8" cy="7" r="3"/><path d="M3 20v-2a5 5 0 0 1 10 0v2"/><path d="M14 5h7v8h-7M17 13l2 3"/>',
      ['formazion*', 'didattic*', 'insegnament*', 'docenz*', 'tutor*', 'ecm', 'aggiornament*', 'simulazion*', 'addestrament*', 'blsd', 'bls', 'als', 'phtls']],
    ['universita', 'Università', '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
      ['universit*', 'unifi', 'ateneo', 'magistrale', 'triennale', 'laurea', 'tesi', 'esame', 'esami', 'corso', 'corsi', 'lezion*', 'master', 'dottorato', 'phd', 'cfu', 'appello', 'studio', 'studiare', 'cdl']],
    ['lettura', 'Lettura', '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
      ['lettur*', 'libro', 'libri', 'letteratura', 'bibliografi*', 'manuale', 'bibliotec*', 'leggere']],
    ['scrittura', 'Scrittura', '<path d="M4 20l4-1L19 8l-3-3L5 16z"/><path d="M14 7l3 3"/>',
      ['scrittur*', 'scrivere', 'bozz*', 'blog', 'appunti', 'idee', 'diario', 'stesura', 'redazione', 'testo']],
    ['premio', 'Premi e bandi', '<circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/>',
      ['premi*', 'concors*', 'band*', 'selezion*', 'certificazion*', 'borsa', 'borse', 'candidatur*', 'graduatori*']],
    ['comunicazione', 'Comunicazione', '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
      ['comunicazion*', 'social', 'divulgazion*', 'marketing', 'instagram', 'linkedin', 'newsletter', 'stampa', 'campagna']],
    ['team', 'Persone e gruppi', '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
      ['team', 'grupp*', 'equipe', 'colleg*', 'riunion*', 'associazion*', 'collaborazion*', 'rete', 'commission*', 'comitato', 'sindacat*']],
    ['internazionale', 'Internazionale', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
      ['internazional*', 'erasmus', 'estero', 'ingles*', 'lingu*', 'europe*', 'global*']],
    ['digitale', 'Digitale', '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M9 9l-2 2 2 2M15 9l2 2-2 2"/>',
      ['informatic*', 'software', 'app', 'digital*', 'sito', 'programmazion*', 'plancia', 'computer', 'excel', 'database', 'intelligenza artificiale', 'ia']],
    ['soldi', 'Finanze', '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
      ['soldi', 'spes*', 'finanz*', 'tasse', 'bollett*', 'pagament*', 'budget', 'fattur*', 'stipendi*', 'rimbors*', 'risparmi*']],
    ['viaggio', 'Viaggi', '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>',
      ['viagg*', 'vacanz*', 'volo', 'voli', 'volare', 'aviazion*', 'aereo', 'aerei', 'trasferta', 'pilot*', 'aeroport*']],
    ['cucina', 'Cucina', '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 3c-2 2-2 6 0 8v10"/>',
      ['cucin*', 'ricett*', 'ristorant*', 'cena', 'pranzo', 'gastronomi*', 'food', 'chef', 'vino', 'menu']],
    ['sport', 'Sport', '<path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/>',
      ['sport', 'palestra', 'allenament*', 'corsa', 'fitness', 'maratona', 'nuoto', 'bici', 'calcio', 'running']],
    ['salute', 'Salute e benessere', '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
      ['salute', 'benessere', 'cura', 'volontariat*', 'donazion*', 'croce rossa', 'misericordia', 'pubblica assistenza', 'anpas']],
    ['casa', 'Casa', '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/>',
      ['casa', 'famigli*', 'traslocc*', 'trasloco', 'affitto', 'personale', 'personali', 'privato', 'condominio']],
    ['musica', 'Musica', '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      ['music*', 'concert*', 'chitarr*', 'canto', 'coro', 'pianoforte']],
    ['calendario', 'Scadenze ed eventi', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
      ['scadenz*', 'agenda', 'eventi', 'evento', 'appuntament*', 'calendario', 'pianificazion*']],
    ['documenti', 'Documenti e pratiche', '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18"/>',
      ['lavoro', 'ufficio', 'amministrazion*', 'pratic*', 'burocrazi*', 'document*', 'contratt*', 'domanda', 'modulo', 'moduli', 'firma']],
    ['obiettivo', 'Obiettivi', '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      ['obiettiv*', 'traguard*', 'sogn*', 'piano', 'progett*', 'carriera']]
  ];
  const byKey = {}; SET.forEach(([k, label, d]) => { byKey[k] = { label, d }; });
  const fold = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const prepared = SET.map(([k, , , kws]) => [k, kws.map(w => w.endsWith('*')
    ? new RegExp('(^|\\s)' + fold(w.slice(0, -1)).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    : new RegExp('(^|\\s)' + fold(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)'))]);
  // icona suggerita per un testo (titolo o ambito); stringa vuota se nessuna parola è riconosciuta
  const GENERICHE = new Set(['obiettivo', 'documenti', 'casa', 'calendario']);
  // vince la parola che compare per prima; a parità di posizione, l'icona più specifica.
  // Le icone generiche si usano solo se non c'è nulla di più preciso.
  function guess(text) {
    const t = ' ' + fold(text).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
    let best = null, fallback = null;
    prepared.forEach(([k, res], order) => {
      res.forEach(r => {
        const m = r.exec(t); if (!m) return;
        const pos = m.index;
        const cand = { k, pos, order };
        if (GENERICHE.has(k)) { if (!fallback || pos < fallback.pos) fallback = cand; return; }
        if (!best || pos < best.pos || (pos === best.pos && order < best.order)) best = cand;
      });
    });
    return (best || fallback || {}).k || '';
  }
  const api = { SET, byKey, guess };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PlanciaIcone = api;
})(typeof window !== 'undefined' ? window : globalThis);
