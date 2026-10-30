# Plancia

Web app per seguire progetti, fasi e sottofasi annidate senza limite, con scadenze e orari, urgenze, note, link, voci ricorrenti, condivisione e sincronizzazione tra dispositivi. Funziona anche senza connessione e si installa sul telefono e sul computer come un'app. Ogni persona può creare il proprio account e avere i propri progetti, separati da quelli degli altri.

## Contenuto della cartella

| File | A cosa serve |
|---|---|
| `index.html` | L'app vera e propria |
| `modello.js` | Gestione dei dati e unione delle modifiche |
| `sync.js` | Sincronizzazione e condivisione |
| `icone.js` | Icone automatiche di ambiti e progetti |
| `config.js` | Collegamento al progetto Firebase (già compilato) |
| `sw.js` | Funzionamento senza connessione e notifiche |
| `manifest.webmanifest` | Nome, colori, icone e scorciatoie per l'installazione |
| `icons/` | Icone dell'app (anche le sei varianti) |
| `manifest-*.webmanifest` | Dati di installazione per ciascuna icona |
| `regole-firestore.txt` | Regole di sicurezza da copiare in Firebase |
| `LEGGIMI.md` | Queste istruzioni |

## 1. Aggiornare l'app su GitHub

1. Apri il repository `plancia` su github.com.
2. Premi **Add file** e poi **Upload files**.
3. Trascina i file ricevuti, compresa la cartella `icons` se è nel pacchetto. Quelli con lo stesso nome vengono sostituiti.
4. Premi **Commit changes** e attendi uno o due minuti.
5. Su ogni dispositivo chiudi del tutto l'app e riaprila due volte: la prima scarica la versione nuova, la seconda la mostra.

Il repository è pubblico: si vede il codice dell'app, non i dati. **Non caricare mai** nel repository i backup (.json) o gli elenchi per Excel (.csv).

## 2. Aggiornare le regole di sicurezza di Firebase

Necessario con questa versione, perché ora ogni persona può avere il proprio account. Si fa una sola volta.

1. Apri **console.firebase.google.com** ed entra nel progetto **Plancia**.
2. Menu a sinistra: **Firestore Database**, scheda **Regole**.
3. Apri il file `regole-firestore.txt`, copia tutto il testo e incollalo al posto di quello presente. Non c'è più nessuna email da sostituire.
4. Premi **Pubblica**.

Queste regole stabiliscono che:
- i progetti di ogni account li vede e li modifica solo chi lo possiede;
- chi riceve una condivisione vede soltanto la voce condivisa con lui, e solo dopo aver confermato la propria email;
- chi ha il permesso di modifica può cambiare le voci di quel ramo, ma non i permessi né la condivisione.

## 3. Far usare la Plancia ad amici e compagni di corso

L'indirizzo è lo stesso. Ognuno:
1. apre l'indirizzo della Plancia sul telefono e la aggiunge alla schermata Home (su iPhone: Condividi, poi «Aggiungi alla schermata Home»);
2. segue il tutorial iniziale;
3. in **Impostazioni → Account** preme **Crea account** con la propria email e una password;
4. conferma l'email con il link ricevuto (serve per vedere ciò che altri condividono con lui).

Ognuno ha i propri progetti. Il primo account resta il tuo: i tuoi dati non cambiano.

Da sapere prima di invitare altre persone:
- **Riservatezza.** I dati sono conservati su Firebase, nel tuo progetto. Come amministratore puoi tecnicamente vederli dalla console. Va detto a chi usa l'app, e nessuno deve inserire dati di pazienti o informazioni sanitarie che permettano di identificare qualcuno (è scritto anche nel tutorial).
- **Costi.** Il piano gratuito di Firebase (Spark) basta per un gruppo di amici: decine di migliaia di letture e scritture al giorno. Se un giorno il limite venisse superato, la sincronizzazione si ferma fino al giorno dopo; l'app continua a funzionare sul dispositivo e non viene addebitato nulla, perché il piano gratuito non ha una carta collegata.
- **Password dimenticata.** Ognuno la reimposta da solo con «Password dimenticata?» nelle impostazioni.

## 4. Come si usa

**Sezioni.** Sul telefono la barra in basso porta a *Tabellone*, *Oggi*, *Calendario* e *Impostazioni*; il tasto **+** al centro aggiunge. Sul computer le stesse sezioni sono nella barra a sinistra, con l'elenco degli ambiti, e il progetto aperto compare nel pannello a destra.

**Tabellone.** I progetti sono raccolti per ambito, ciascuno con la linea di avanzamento e l'indicazione più importante (ritardo, urgenza, prossima scadenza). Gli ambiti e i progetti si ordinano da soli in base alla scadenza più vicina; con **Riordina** puoi trascinarli e scegliere un ordine personale. Tirando verso il basso il Tabellone si apre la ricerca.

**Progetto.** Tocca un progetto per aprirlo. In alto trovi ambito, titolo, avanzamento e nota; sotto, le fasi con le sottofasi. Il campo in fondo aggiunge una fase. Con **Riordina** sposti le voci; con **⋯** trovi le azioni sul progetto (urgente, fissa in alto, scadenza, ambito, icona, nota, duplica, modello, archivia, elimina). Per tornare indietro tocca la freccia o scorri dal bordo sinistro dello schermo.

**Stato delle voci.** Il cerchio indica solo se una voce è fatta o no. Una voce con sottofasi è completata quando lo sono tutte; toccando il suo cerchio si completano (o si riaprono) tutte insieme. Due etichette facoltative si attivano solo dove servono:
- **In corso**, per ciò su cui stai lavorando (compare anche nel Tabellone accanto al progetto);
- **In attesa**, per ciò che dipende da altri.

**Gesti sul telefono:**
- **Scorri una voce verso destra**: fatta (o riaperta).
- **Scorri verso sinistra**: compaiono *In corso* e *Altro*; scorrendo fino in fondo si attiva *In corso*.
- **Tieni premuta** una voce o un progetto: menu con tutte le azioni (completa, in corso, in attesa, urgente, scadenza e orario, sottofase, nota, link, assegna, concentrazione, al calendario, condividi, elimina).
- **Tocca il titolo** o la nota per modificarli.

Sul computer: tasto destro o i tre puntini che compaiono passando sopra una voce.

**Inserimento rapido.** Scrivendo un titolo puoi aggiungere «oggi», «domani», «dopodomani», un giorno della settimana, una data («12/11») o un orario («14:30», «ore 9») per la scadenza, e «!» per l'urgenza. Esempio: `Prova generale venerdì 15:00 !`.

**Tasto +.** Crea un *Progetto* (con ambito, scadenza e modello), una *Voce* in un progetto esistente o un *Appunto*. Gli appunti compaiono in cima al Tabellone; con **Sposta** li porti nel progetto giusto.

**Calendario.** La scheda *Calendario* (sul telefono nella barra in basso, sul computer nella barra laterale) mostra tutto il mese, nello stile del Calendario di Apple: in ogni giorno compaiono i titoli degli impegni come piccole etichette (azzurre le scadenze, piene quelle dei progetti, rosse quelle in ritardo, barrate le completate); oggi è il cerchio colorato. Tocca un giorno per vederne gli impegni sotto il calendario; senza selezione compaiono tutte le scadenze del mese. Si cambia mese con le frecce o scorrendo di lato. La ricerca si apre con la lente accanto al titolo del Tabellone o tirando il Tabellone verso il basso.

**Proposte.** In *Impostazioni → Proposte* chiunque usi l'app può inviare un'idea, un problema o un progetto. Il messaggio arriva per email all'autore tramite FormSubmit (servizio gratuito, senza account); se chi scrive indica la propria email, basta premere «Rispondi».

**Sorprese.** La Plancia nasconde qualche easter egg. Non sono elencati da nessuna parte: si trovano per caso.

**Data e orario.** Dal menu di una voce, *Data e orario* permette di indicare un solo giorno oppure, con *Più giorni*, un intervallo dal… al…; l'orario può essere *dalle… alle…*, oppure si attiva *Tutto il giorno*. Gli impegni su più giorni compaiono in ogni giorno del calendario e nella scheda Oggi finché sono in corso; il ritardo si calcola sulla data di fine.

**Disposizione libera (computer).** In alto nel Tabellone scegli *Griglia* oppure *Libera*. Con *Libera* prendi un ambito dal titolo e trascinalo in qualunque punto: si solleva, si inclina seguendo il movimento, si aggancia ai bordi degli altri ambiti e, se lo posi sopra un altro, quello scivola più in basso. Le posizioni restano salvate su quel computer; *Metti in ordine* le risistema in automatico. Sul telefono, in modalità *Riordina*, ciò che trascini segue il dito e gli altri elementi scivolano al loro posto.

**Ambiti richiudibili.** Nel Tabellone tocca il nome di un ambito per chiuderlo o riaprirlo: da chiuso mostra una riga di riepilogo (avanzamento, urgenze, prossima scadenza). L'app ricorda la scelta anche dopo giorni. *Chiudi tutti* / *Apri tutti* agisce su tutti insieme; l'interruttore *Ambiti richiudibili* in *Impostazioni → Aspetto* attiva o disattiva la funzione.

**Icona.** Al primo accesso, nella scheda *Il tuo stile*, e poi da *Impostazioni → Personale → Icona* si sceglie l'icona tra sei scene e una serie di simboli; compare all'apertura e nell'app. Sulla schermata Home del telefono possono andare le sei scene: per cambiarla lì, togli l'app dalla Home e aggiungila di nuovo (su iPhone accedi prima al tuo account, perché l'app reinstallata riparte vuota).

**Schermata Home.** Al primo accesso dal telefono una guida illustrata (iPhone o Android) mostra come aggiungere la Plancia alla schermata Home; si riapre da *Impostazioni → Guida*.

**Colore del tema.** In *Impostazioni → Aspetto → Colore* scegli tra blu, azzurro, verde, arancione, rosso, rosa, viola e grafite; cambiano anche gli aloni dello sfondo. Il colore si sincronizza con l'account.

**Guida passo passo.** Al primo avvio, dopo le schede introduttive, una guida accompagna sull'app vera: illumina il punto da toccare e spiega ogni passaggio, dalla creazione del primo progetto al menu delle azioni. Si può riavviare quando si vuole da *Impostazioni → Guida*.

**Tocco sugli ambiti.** Tutta la bolla di un ambito è cliccabile: si apre il progetto più vicino al punto toccato.

**Altre funzioni:** voci ricorrenti (si ripianificano quando le completi), modalità Concentrazione con timer, riepilogo della settimana, modelli, duplica, archivio, annulla dopo un'eliminazione, scorciatoie tenendo premuta l'icona dell'app.

**Suoni.** Brevi e discreti; si disattivano in Impostazioni. Su iPhone seguono l'interruttore silenzioso e la vibrazione non è disponibile per le app web.

## 5. Condividere

Nella pagina di ogni progetto c'è il pulsante **Condividi** (le due persone, in alto accanto a ⋯). Da lì condividi **tutto il progetto** con un'email, scegliendo *Può modificare* o *Solo lettura*, oppure **una sola fase**. Serve aver fatto l'accesso all'account; chi riceve deve accedere con la stessa email e confermarla. Si può condividere anche tenendo premuta una voce e scegliendo *Condividi*.

### Dettagli

1. Accedi al tuo account in Impostazioni.
2. Tieni premuta la voce da condividere, a qualunque livello, e scegli **Condividi**.
3. Scrivi l'email della persona, scegli **Può modificare** oppure **Solo lettura** e premi **Invita**.
4. La persona crea un account con quella stessa email (punto 3), lo conferma e ricarica la pagina: la voce compare in **Condivisi con me**.

La persona vede solo quel ramo (la voce e le sue sottofasi). Con il permesso di modifica può cambiare stati, note e date, e aggiungere o eliminare sottofasi, ma non può eliminare la voce condivisa né condividerla a sua volta. Le modifiche si uniscono voce per voce, quindi più persone possono lavorare insieme senza sovrascriversi. Nella pagina del ramo compare l'ultima modifica fatta e da chi.

## 6. Plancia amministratore

Solo l'account **stade1998@gmail.com** vede in *Impostazioni* la voce **Plancia amministratore**. Mostra: numero di account, attivi oggi, in 7 e in 30 giorni, nuovi account, quanti tornano dopo la prima settimana, utenti attivi giorno per giorno divisi fra PC e smartphone, aperture, minuti e persone per tipo di dispositivo, ore di utilizzo, funzioni più usate, numeri dei contenuti, versioni in uso, colori scelti e l'elenco degli account (esportabile per Excel).

Per ogni account si registrano solo statistiche d'uso: aperture, minuti, giorni di utilizzo, tipo di dispositivo, se l'app è installata e quanti progetti e voci ci sono. Mai il contenuto dei progetti. I dati partono dalla versione 24. Per vederli serve aver incollato in Firebase le regole aggiornate di `regole-firestore.txt` (punto 2).

## 6b. Impostazioni

**Account** (accesso, sincronizzazione, uscita), **Personale** (nome per il saluto, titolo dell'animazione di apertura), **Aspetto** (tema, suoni), **Ambiti** (icona di ogni ambito), **Modelli**, **Avvisi** (notifiche, anticipo, scadenze nel calendario), **Copie di sicurezza**, **Aspetto** comprende anche il colore del tema; **Guida** (guida passo passo, schede introduttive, installa).

## 7. Avvisi

- **Notifiche dell'app:** arrivano quando apri l'app e mentre è aperta.
- **Avvisi garantiti:** *Aggiungi le scadenze al calendario* scarica un file che inserisce le scadenze nel calendario del telefono con un promemoria. Ogni voce con una data ha anche *Al calendario* nel suo menu. Se cambi le date, esporta di nuovo: le voci già presenti vengono aggiornate.

## 8. Copie di sicurezza

Anche con la sincronizzazione attiva, conviene scaricare ogni tanto un **backup (.json)** e conservarlo sul computer. **Importa un backup** aggiunge i progetti del backup a quelli presenti. **Elenco per Excel** produce una tabella con tutte le voci.

## 9. Attivare le proposte (una sola volta)

La prima proposta inviata dall'app non arriva subito (l'app lo segnala): FormSubmit manda all'indirizzo dell'autore un'email intitolata «Action Required: Activate FormSubmit». Apri quella email e premi **Activate Form**. Da quel momento le proposte arrivano normalmente. Conviene fare tu stesso la prima prova da *Impostazioni → Proposte*. Se l'email di attivazione non arriva, controlla Spam e Promozioni; se l'invio non riesce (per esempio per un blocco delle pubblicità nel browser), l'app offre il pulsante *Invia con l'app di posta*, che prepara lo stesso messaggio.

Se un domani preferisci che l'indirizzo non compaia nel codice pubblico, dopo l'attivazione FormSubmit fornisce un codice alternativo da usare al posto dell'email: basta chiederlo nella prossima versione.

## 10. Aggiornamenti futuri

Per una nuova versione ripeti il punto 1. Il file `config.js` contiene il collegamento a Firebase: se un pacchetto futuro ne contenesse uno vuoto, non caricarlo. I dati salvati non vengono toccati.
