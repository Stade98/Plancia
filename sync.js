// Plancia Progetti: sincronizzazione tra dispositivi con Firebase.
// I dati di ogni utente stanno in un solo documento: utenti/<id utente>.

const P = window.Plancia;
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
  'permission-denied': 'Firebase ha rifiutato l’accesso ai dati: controlla le regole di sicurezza indicate nel LEGGIMI.',
  'unavailable': 'Nessuna connessione: le modifiche restano su questo dispositivo e verranno inviate appena torni online.'
};
const msg = e => MESSAGGI[e && e.code] || ('Errore imprevisto' + (e && e.code ? ` (${e.code})` : '') + '. Riprova.');
const ora = () => new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

async function avvia() {
  if (!P) return;
  if (!cfg || !cfg.apiKey) { P.sync({ state: 'off' }); return; }

  let app, auth, db, A, F;
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
    ]);
    A = authMod; F = fsMod;
    app = appMod.initializeApp(cfg);
    auth = A.getAuth(app);
    db = F.getFirestore(app);
  } catch (e) {
    P.sync({ state: 'err', message: 'Sincronizzazione non disponibile senza connessione: le modifiche restano su questo dispositivo.' });
    window.addEventListener('online', () => location.reload(), { once: true });
    return;
  }

  let utente = null, ref = null, stopSnap = null, timer = null, inCorso = false, ripeti = false, primoAllineamento = false;

  function stato(state, message) { P.sync({ state, email: utente && utente.email, message }); }

  async function invia() {
    if (!ref) return;
    if (inCorso) { ripeti = true; return; }
    inCorso = true; stato('wait', 'Invio delle modifiche…');
    try {
      const unito = await F.runTransaction(db, async tx => {
        const snap = await tx.get(ref);
        const remoto = snap.exists() ? snap.data() : { projects: {}, deleted: {} };
        const u = P.merge(P.getState(), { projects: remoto.projects || {}, deleted: remoto.deleted || {} });
        tx.set(ref, { projects: u.projects, deleted: u.deleted, updatedAt: Date.now() });
        return u;
      });
      P.apply(unito);
      stato('ok', `Ultima sincronizzazione alle ${ora()}.`);
    } catch (e) {
      stato('err', msg(e));
    } finally {
      inCorso = false;
      if (ripeti) { ripeti = false; programma(300); }
    }
  }
  function programma(ms = 900) { clearTimeout(timer); timer = setTimeout(invia, ms); }

  P.onLocalChange(() => { if (ref) programma(); });
  window.addEventListener('online', () => { if (ref) programma(100); });

  A.onAuthStateChanged(auth, u => {
    if (stopSnap) { stopSnap(); stopSnap = null; }
    utente = u; ref = null;
    if (!u) { stato('out'); return; }
    ref = F.doc(db, 'utenti', u.uid);
    primoAllineamento = true;
    stato('wait', 'Allineamento con il tuo account…');
    stopSnap = F.onSnapshot(ref, snap => {
      if (snap.metadata.hasPendingWrites) return;
      const remoto = snap.exists() ? snap.data() : { projects: {}, deleted: {} };
      const r = { projects: remoto.projects || {}, deleted: remoto.deleted || {} };
      const u2 = P.merge(P.getState(), r);
      // se il dispositivo ha qualcosa che l'account non ha ancora, lo invia
      const daInviare = JSON.stringify(u2.projects) !== JSON.stringify(P.merge(r, { projects: {}, deleted: {} }).projects);
      P.apply(u2);
      if (daInviare || primoAllineamento && !snap.exists()) programma(200);
      else stato('ok', `Ultima sincronizzazione alle ${ora()}.`);
      primoAllineamento = false;
    }, e => stato('err', msg(e)));
  });

  // modulo di accesso
  const email = document.getElementById('au-email');
  const pass = document.getElementById('au-pass');
  document.getElementById('authform').addEventListener('submit', async e => {
    e.preventDefault();
    stato('out', 'Accesso in corso…');
    try { await A.signInWithEmailAndPassword(auth, email.value.trim(), pass.value); pass.value = ''; }
    catch (err) { stato('out', msg(err)); }
  });
  document.getElementById('au-create').addEventListener('click', async () => {
    if (!email.value.trim() || pass.value.length < 6) { stato('out', 'Scrivi email e una password di almeno 6 caratteri, poi premi di nuovo “Crea account”.'); return; }
    stato('out', 'Creazione dell’account…');
    try { await A.createUserWithEmailAndPassword(auth, email.value.trim(), pass.value); pass.value = ''; }
    catch (err) { stato('out', msg(err)); }
  });
  document.getElementById('au-reset').addEventListener('click', async () => {
    if (!email.value.trim()) { stato('out', 'Scrivi prima la tua email nel campo qui sopra.'); return; }
    try { await A.sendPasswordResetEmail(auth, email.value.trim()); stato('out', 'Ti abbiamo inviato un’email per scegliere una nuova password.'); }
    catch (err) { stato('out', msg(err)); }
  });
  document.getElementById('sync-now').addEventListener('click', () => programma(0));
  document.getElementById('sync-logout').addEventListener('click', async () => {
    await A.signOut(auth);
    stato('out', 'Sei uscito: i progetti restano su questo dispositivo, ma non si sincronizzano più finché non accedi di nuovo.');
  });
}

avvia();
