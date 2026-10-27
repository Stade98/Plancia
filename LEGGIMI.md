# Plancia Progetti

Web app personale per seguire progetti, fasi e sottofasi annidate senza limite, con stato (Da fare, In corso, Completato), scadenze, priorità a codici colore, avvisi e sincronizzazione tra dispositivi. Funziona anche senza connessione e si installa sul telefono e sul computer come un'app.

## Contenuto della cartella

| File | A cosa serve |
|---|---|
| `index.html` | L'app vera e propria |
| `config.js` | Collegamento al tuo progetto Firebase per la sincronizzazione |
| `sync.js` | Sincronizzazione tra dispositivi |
| `sw.js` | Funzionamento senza connessione e notifiche |
| `manifest.webmanifest` | Nome, colori e icone per l'installazione |
| `icons/` | Icone dell'app |
| `LEGGIMI.md` | Queste istruzioni |

## 1. Aggiornare i file su GitHub

1. Apri il repository `plancia` su github.com.
2. Premi **Add file** e poi **Upload files**.
3. Trascina **tutto il contenuto** della cartella estratta dallo zip (i file e la cartella `icons`, non la cartella esterna). I file con lo stesso nome vengono sostituiti.
4. Premi **Commit changes**.
5. Attendi uno o due minuti. Sul telefono chiudi del tutto l'app e riaprila due volte: la prima scarica la versione nuova, la seconda la mostra.

Il repository è pubblico: si vede il codice dell'app, non i tuoi dati. **Non caricare mai** nel repository i backup (.json) o gli elenchi per Excel (.csv).

## 2. Sincronizzazione tra computer e telefono (Firebase, gratuito)

Si fa una sola volta, in circa dieci minuti. Il piano gratuito di Firebase non richiede carta di credito; se un giorno si superassero i limiti gratuiti, il servizio si sospende fino al giorno o al mese successivo, senza alcun addebito. Un uso personale resta molto al di sotto.

La console di Firebase può essere in italiano o in inglese: tra parentesi trovi il nome inglese delle voci.

### a) Crea il progetto
1. Vai su **console.firebase.google.com** e accedi con un account Google.
2. Premi **Crea un progetto** (*Create a project*), chiamalo `plancia` e prosegui.
3. Quando chiede di Google Analytics, **disattivalo** (non serve) e premi **Crea progetto**.

### b) Attiva l'accesso con email e password
1. Nel menu a sinistra apri **Build → Authentication** e premi **Inizia** (*Get started*).
2. Nella scheda **Metodo di accesso** (*Sign-in method*) scegli **Email/password**, attiva il primo interruttore e premi **Salva**.

### c) Crea l'archivio dei dati
1. Nel menu a sinistra apri **Build → Firestore Database** e premi **Crea database** (*Create database*).
2. Se chiede l'edizione, lascia **Standard**. Come posizione scegli una sede europea (ad esempio `eur3 (europe-west)`).
3. Scegli **Avvia in modalità di produzione** (*Start in production mode*) e premi **Crea**.
4. Apri la scheda **Regole** (*Rules*), cancella tutto il testo presente e incolla questo, **sostituendo la tua email** (tutta in minuscolo, la stessa che userai per accedere all'app):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /utenti/{uid} {
      allow read, write: if request.auth != null
                         && request.auth.uid == uid
                         && request.auth.token.email == "la-tua-email@esempio.it";
    }
  }
}
```

5. Premi **Pubblica** (*Publish*).

Queste regole fanno sì che solo tu, dopo aver fatto l'accesso, possa leggere e scrivere i tuoi progetti. Nessun altro, anche conoscendo l'indirizzo dell'app, può vederli.

### d) Collega l'app al progetto
1. Premi la **rotella** accanto a "Panoramica del progetto" (*Project Overview*) e poi **Impostazioni progetto** (*Project settings*).
2. In fondo, alla voce **Le tue app** (*Your apps*), premi l'icona **`</>`** (Web).
3. Come nome scrivi `plancia`, **non** spuntare Firebase Hosting e premi **Registra app**.
4. Compare un riquadro di codice che contiene `const firebaseConfig = { ... };`. Copia la parte tra le parentesi graffe, compresi `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` e `appId`.
5. Su GitHub apri il file `config.js` del repository, premi la **matita** (*Edit*) e sostituisci `null` nell'ultima riga con l'oggetto copiato, in questo modo:

```
window.PLANCIA_FIREBASE = {
  apiKey: "AIza...",
  authDomain: "plancia-xxxx.firebaseapp.com",
  projectId: "plancia-xxxx",
  storageBucket: "plancia-xxxx.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. Premi **Commit changes**. In alternativa, incolla questi valori nella chat con Claude e ti verrà restituito il file già compilato.

I valori di `firebaseConfig` identificano il progetto e non sono una password: possono stare in un repository pubblico. La protezione dei dati è data dalle regole del punto c.

### e) Accedi da ogni dispositivo
1. Apri la Plancia e scorri fino al riquadro **Sincronizzazione**.
2. Sul primo dispositivo scrivi email e password e premi **Crea account**. I progetti presenti vengono caricati sul tuo account.
3. Sugli altri dispositivi usa le stesse credenziali e premi **Accedi**. I progetti del tuo account compaiono e da quel momento restano allineati.

In alto compare un indicatore: **Sincronizzato**, **In sincronizzazione** oppure **Non sincronizzato**. Senza connessione l'app continua a funzionare: le modifiche restano sul dispositivo e vengono inviate appena torni online. Se modifichi lo stesso progetto su due dispositivi mentre sono scollegati, prevale la modifica più recente.

Il progetto di esempio non viene mai sincronizzato e scompare quando il tuo account contiene già dei progetti.

## 3. Installare l'app

**Android (Chrome):** apri l'indirizzo, premi **Installa sul dispositivo** in alto, oppure il menu ⋮ e poi **Installa app**.

**iPhone e iPad (Safari):** apri l'indirizzo, tocca **Condividi** e poi **Aggiungi alla schermata Home**. Le notifiche su iPhone funzionano solo dopo questo passaggio (iOS 16.4 o successivo).

**Computer (Chrome o Edge):** premi l'icona di installazione nella barra degli indirizzi, oppure il pulsante **Installa sul dispositivo**.

## 4. Stati delle voci

Ogni voce può essere **Da fare**, **In corso** o **Completato**. Scegliendo "Completato" la voce si spunta da sola; spuntandola diventa "Completato"; togliendo la spunta torna "Da fare".

Le fasi che contengono sottofasi calcolano lo stato da sole: sono "In corso" appena una sottofase è avviata o conclusa, e "Completato" quando lo sono tutte. Lo stesso vale per il progetto.

## 5. Priorità

I codici seguono la logica del triage: **1 Rosso** immediata, **2 Arancione** urgente, **3 Azzurro** differibile, **4 Verde** minore, **5 Bianco** non urgente. Il colore del progetto compare sulla banda laterale della sua scheda.

## 6. Avvisi

- **Notifiche dell'app:** premi **Attiva notifiche** e scegli con quanto anticipo essere avvisato. Arrivano quando apri l'app e mentre è aperta.
- **Avvisi garantiti:** premi **Tutte le scadenze nel calendario (.ics)** e apri il file: le scadenze entrano nel calendario del telefono con un promemoria alle 9:00 del giorno scelto. Ogni voce con una data ha anche un'icona calendario. Se cambi le date, esporta di nuovo: le voci già presenti vengono aggiornate.

## 7. Copie di sicurezza

Anche con la sincronizzazione attiva, conviene scaricare ogni tanto un **Backup (.json)** dal riquadro **Dispensa** e conservarlo sul computer. **Importa backup** aggiunge i progetti di un backup a quelli presenti. **Elenco per Excel (.csv)** produce una tabella apribile direttamente in Excel.

## 8. Aggiornamenti futuri

Per una nuova versione dei file, ripeti il punto 1. Il file `config.js` già compilato **non va sostituito**: se lo zip ne contiene uno vuoto, escludilo dal caricamento. I dati salvati non vengono toccati.
