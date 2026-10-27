# Plancia Progetti

Web app personale per seguire progetti, fasi e sottofasi annidate senza limite, con scadenze, priorità a codici colore e avvisi. Funziona anche senza connessione e si installa sul telefono e sul computer come un'app.

I dati restano salvati sul dispositivo che usi e non vengono inviati a nessun servizio.

## Contenuto della cartella

| File | A cosa serve |
|---|---|
| `index.html` | L'app vera e propria |
| `manifest.webmanifest` | Nome, colori e icone per l'installazione |
| `sw.js` | Funzionamento senza connessione e notifiche |
| `icons/` | Icone dell'app |
| `LEGGIMI.md` | Queste istruzioni |

## 1. Mettere l'app online con GitHub Pages (gratuito)

1. Crea un account gratuito su **github.com** (se non lo hai già).
2. In alto a destra premi **+** e poi **New repository**.
3. Come nome scrivi `plancia`, lascia selezionato **Public** e premi **Create repository**.
4. Nella pagina che si apre, premi il collegamento **uploading an existing file**.
5. Trascina nella finestra **tutto il contenuto** della cartella estratta dallo zip (i file e la cartella `icons`, non la cartella esterna). Premi **Commit changes**.
6. Vai su **Settings**, poi nel menu a sinistra su **Pages**.
7. In **Branch** scegli `main` e la cartella `/ (root)`, poi premi **Save**.
8. Dopo uno o due minuti, in cima alla stessa pagina compare l'indirizzo dell'app, nella forma
   `https://tuonomeutente.github.io/plancia/`

Il repository è pubblico: chiunque potrebbe vedere il **codice** dell'app, ma **non i tuoi dati**, che restano nel browser del tuo dispositivo.

## 2. Installare l'app

**Android (Chrome):** apri l'indirizzo, premi il pulsante **Installa sul dispositivo** in alto, oppure il menu ⋮ e poi **Installa app**.

**iPhone e iPad (Safari):** apri l'indirizzo, tocca **Condividi** e poi **Aggiungi alla schermata Home**. Le notifiche su iPhone funzionano solo dopo questo passaggio (iOS 16.4 o successivo).

**Computer (Chrome o Edge):** apri l'indirizzo e premi l'icona di installazione nella barra degli indirizzi, oppure il pulsante **Installa sul dispositivo**.

## 3. Portare i progetti dal Cruscotto su Claude

1. Apri il Cruscotto progetti su Claude e, nel riquadro **Copie di sicurezza**, premi **Backup dati (.json)**.
2. Apri Plancia, vai nel riquadro **Dispensa** e premi **Importa backup**, scegliendo il file appena scaricato.

Al primo import il progetto di esempio viene rimosso automaticamente.

## 4. Avvisi e scadenze

- **Notifiche dell'app:** premi **Attiva notifiche** e scegli con quanto anticipo essere avvisato. Le notifiche arrivano quando apri l'app e mentre è aperta; un'app pubblicata gratuitamente senza un server non può inviarle quando è completamente chiusa.
- **Avvisi garantiti:** premi **Tutte le scadenze nel calendario (.ics)** e apri il file scaricato: le scadenze vengono aggiunte al calendario del telefono o di Outlook/Google Calendar con un promemoria alle 9:00 del giorno scelto. Ogni voce con una data ha anche un'icona calendario per aggiungere solo quella. Se modifichi le date, esporta di nuovo: le voci già presenti vengono aggiornate.

## 5. Priorità

I codici seguono la logica del triage:

1. **Rosso**: immediata
2. **Arancione**: urgente
3. **Azzurro**: differibile
4. **Verde**: minore
5. **Bianco**: non urgente

Il colore del progetto compare sulla banda laterale della sua scheda; le voci con priorità mostrano il colore anche nel tabellone delle partenze.

## 6. Conservare i dati

- I dati vivono nel browser del dispositivo. Se cancelli i dati di navigazione del sito, li perdi: per questo conviene esportare un **Backup (.json)** con regolarità, ad esempio una volta a settimana.
- Telefono e computer non si sincronizzano da soli. Per spostare i dati usa **Backup** su un dispositivo e **Importa backup** sull'altro (l'import aggiunge i progetti a quelli presenti).
- **Elenco per Excel (.csv)** produce una tabella con codice, progetto, livello, voce, priorità, stato, avanzamento e scadenza, apribile direttamente in Excel.

## 7. Aggiornare l'app in futuro

Se ricevi una nuova versione dei file, caricala nello stesso repository sostituendo quelli vecchi (stesso procedimento del punto 1, passaggi 4 e 5). Nel file `sw.js` aumenta il numero nella riga `const VERSIONE = 'plancia-v1';` (ad esempio `plancia-v2`) così i dispositivi scaricano subito la versione nuova. I dati salvati non vengono toccati.
