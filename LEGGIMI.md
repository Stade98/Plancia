# Plancia Progetti

Web app personale per seguire progetti, fasi e sottofasi annidate senza limite, con stati, scadenze e orari, urgenze, note, link, voci ricorrenti, condivisione e sincronizzazione tra dispositivi. Funziona anche senza connessione e si installa sul telefono e sul computer come un'app.

## Contenuto della cartella

| File | A cosa serve |
|---|---|
| `index.html` | L'app vera e propria |
| `modello.js` | Gestione dei dati e unione delle modifiche |
| `sync.js` | Sincronizzazione e condivisione |
| `config.js` | Collegamento al tuo progetto Firebase (già compilato) |
| `sw.js` | Funzionamento senza connessione e notifiche |
| `manifest.webmanifest` | Nome, colori, icone e scorciatoie per l'installazione |
| `icons/` | Icone dell'app |
| `regole-firestore.txt` | Regole di sicurezza da copiare in Firebase |
| `LEGGIMI.md` | Queste istruzioni |

## 1. Aggiornare l'app su GitHub

1. Apri il repository `plancia` su github.com.
2. Premi **Add file** e poi **Upload files**.
3. Trascina **tutto il contenuto** della cartella estratta dallo zip (i file e la cartella `icons`, non la cartella esterna). I file con lo stesso nome vengono sostituiti.
4. Premi **Commit changes** e attendi uno o due minuti.
5. Su ogni dispositivo chiudi del tutto l'app e riaprila due volte: la prima scarica la versione nuova, la seconda la mostra.

Il repository è pubblico: si vede il codice dell'app, non i tuoi dati. **Non caricare mai** nel repository i backup (.json) o gli elenchi per Excel (.csv).

## 2. Aggiornare le regole di sicurezza di Firebase (necessario per la condivisione)

Si fa una sola volta, subito dopo aver caricato la nuova versione.

1. Apri **console.firebase.google.com**, entra nel progetto **Plancia**.
2. Menu a sinistra: **Crea → Firestore Database**, scheda **Regole**.
3. Apri il file `regole-firestore.txt`, copia tutto il testo e incollalo al posto di quello presente.
4. Alla riga `request.auth.token.email == "LA-TUA-EMAIL"` scrivi la tua email, la stessa con cui accedi alla Plancia, tutta in minuscolo e tra virgolette.
5. Premi **Pubblica**.

Queste regole stabiliscono che:
- i tuoi progetti li vedi solo tu;
- chi riceve una condivisione vede soltanto la voce condivisa con lui, e solo dopo aver confermato la propria email;
- chi ha il permesso di modifica può cambiare le voci di quel ramo, ma non i permessi né la condivisione.

## 3. Come si usa

**Tabellone e Oggi.** In alto scegli la vista. Il *Tabellone* mostra una riga per progetto, divisa per ambito, con stato, percentuale e l'indicazione più importante; il numero rosso conta urgenze e ritardi. *Oggi* mostra la settimana (tocca un giorno per vederne le scadenze) e ciò che è in ritardo, in scadenza, urgente, in corso, in arrivo e in attesa, da tutti i progetti.

**Stato.** Tocca il cerchio accanto a una voce:
- vuoto = *Da fare*
- mezzo pieno = *In corso*
- pieno con la spunta = *Completato*
- tratteggiato = *In attesa* (si imposta dal menu ⋯, per ciò che dipende da altri)

Le voci con sottofasi e i progetti calcolano lo stato da soli.

**Inserimento rapido.** Scrivendo un titolo puoi aggiungere «oggi», «domani», «dopodomani», un giorno della settimana, una data («12/11») o un orario («14:30», «ore 9») per la scadenza, e «!» per segnarla urgente. Esempio: `Prova generale venerdì 15:00 !`.

**Menu ⋯ delle voci:** Urgente, In attesa, Scadenza e orario, Ripeti, Sottofase, Nota, Link, Assegna, Concentrazione, Al calendario, Condividi, Elimina.

**Menu ⋯ dei progetti:** Urgente, Fissa in alto, Scadenza, Ambito, Nota, Duplica, Salva come modello, Archivia, Elimina.

**Altre funzioni:**
- **Trascinamento:** tieni premuti i sei puntini a sinistra di una voce o di un progetto e spostali.
- **Note:** sempre visibili sotto il titolo, a ogni livello. Se un ramo è compresso, un'etichetta indica quante note contiene.
- **Voci ricorrenti:** quando completi una voce che si ripete, la Plancia la ripianifica alla data successiva.
- **Concentrazione:** apre la voce a schermo intero con un timer da 15, 25 o 50 minuti; alla fine suona e vibra.
- **Appunti:** il campo in cima al Tabellone serve per annotare un'idea al volo; poi la sposti nel progetto giusto con *Sposta in…*.
- **Riepilogo della settimana:** compare all'inizio di ogni settimana; lo riapri quando vuoi dal fondo della vista *Oggi*.
- **Modelli, Duplica, Archivio, Ricerca (lente in alto), Annulla dopo un'eliminazione.**
- **Scorciatoie:** tenendo premuta l'icona dell'app sul telefono compaiono *Nuovo progetto*, *Appunto veloce* e *Oggi*.

**Gesti sul telefono:**
- **Scorri una voce verso destra** per farla avanzare di stato (Da fare → In corso → Completato); mentre scorri, compare lo stato che otterrai.
- **Scorri una voce verso sinistra** per aprire il suo menu.
- **Tieni premuti i sei puntini** a sinistra di una voce o di un progetto e trascinali per riordinarli.

**Suoni e vibrazione:** ogni azione ha un suono breve e discreto (avvio, completamento, aggiunta, eliminazione, apertura, riordino); il completamento di un intero progetto ha una piccola melodia. Si disattivano da **Impostazioni → Aspetto**. Su iPhone i suoni seguono l'interruttore silenzioso del telefono e la vibrazione non è disponibile per le app web; su Android funzionano entrambi.

## 4. Condividere una voce

1. Accedi al tuo account dalle impostazioni (pulsante in alto a destra).
2. Nel menu ⋯ della voce da condividere, a qualunque livello, premi **Condividi**.
3. Scrivi l'email della persona, scegli **Può modificare** oppure **Solo lettura** e premi **Invita**.
4. Comunica alla persona l'indirizzo della tua Plancia. Lei deve:
   - aprirlo e, nelle impostazioni, premere **Crea account** con quella stessa email;
   - confermare l'email con il link che riceve;
   - ricaricare la pagina: la voce compare in **Condivisi con me**.

La persona vede solo quel ramo (la voce e le sue sottofasi). Con il permesso di modifica può cambiare stati, note e date, e aggiungere o eliminare sottofasi, ma non può eliminare la voce condivisa né condividerla a sua volta. Puoi cambiare il permesso o rimuovere la persona dallo stesso riquadro **Condividi**. Le modifiche si uniscono voce per voce, quindi due persone possono lavorare insieme senza sovrascriversi. Sotto il titolo compare l'ultima modifica fatta e da chi.

## 5. Impostazioni

Il pulsante in alto a destra apre: **Aspetto** (tema automatico, chiaro o scuro; nome per il saluto), **Sincronizzazione e condivisione**, **Ambiti** (icona per ogni ambito), **Modelli**, **Avvisi** (notifiche, anticipo, scadenze nel calendario), **Copie di sicurezza** (backup, elenco per Excel, importazione).

## 6. Avvisi

- **Notifiche dell'app:** arrivano quando apri l'app e mentre è aperta.
- **Avvisi garantiti:** *Scadenze nel calendario* scarica un file che inserisce le scadenze nel calendario del telefono con un promemoria (alle 9:00 per le voci senza orario, all'orario indicato per le altre). Ogni voce con una data ha anche *Al calendario* nel menu ⋯. Se cambi le date, esporta di nuovo: le voci già presenti vengono aggiornate.

## 7. Copie di sicurezza

Anche con la sincronizzazione attiva, conviene scaricare ogni tanto un **Backup (.json)** e conservarlo sul computer. **Importa backup** aggiunge i progetti del backup a quelli presenti. **Elenco per Excel** produce una tabella con tutte le voci.

## 8. Aggiornamenti futuri

Per una nuova versione, ripeti il punto 1. Il file `config.js` contiene il collegamento al tuo Firebase: se uno zip futuro ne contenesse uno vuoto, non caricarlo. I dati salvati non vengono toccati.
