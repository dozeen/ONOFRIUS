# GORDON 3 & ONOFRIUS — COSTITUZIONE COGNITIVA

Version: 1.2 (Cognitive Evolution & Cognitive-Not-Personal Rule)

---

## Principio Guida Supremo

> **"Questa implementazione aumenta una capacità cognitiva oppure aggiunge solo codice?"**

Ogni modulo, funzione, evento o modifica architetturale DEVE rispondere positivamente a questo principio. Il codice privo di valore cognitivo è considerato debito architetturale e deve essere rifiutato.

---

## Gli Assiomi Inviolabili

### 1. Primato del Valore Cognitivo
Il sistema non è un chatbot o un semplice script di automazione. È un Sistema Cognitivo Modulare progettato per percepire, estrarre fatti, mantenere un mondo interiore, interagire in modo adattivo, verificare la verità ed eseguire azioni nel mondo reale.

### 2. Separazione Tassativa tra Fatti e Mondo Interiore
- **Fatti (Fact Engine)**: Informazioni oggettive ed empiriche estratte dal contesto o dagli stimoli (orari, persone, date, importi, azioni avvenute). I fatti risiedono nel `FactRegistry`.
- **Mondo Interiore (Thought Stream)**: Stati soggettivi, intenzioni, preferenze, pensieri e obiettivi ("Vorrei comprare una moto", "Mi piacerebbe vivere al mare", "Fabio è molto preciso"). Essi risiedono in `memory/thoughts/` e NON devono mai essere confusi con i fatti oggettivi.

### 3. Modello di Verità Zero-Trust (Fact Verifier)
Nessuna risposta o decisione generata da un Modello di Linguaggio (LLM) può essere inviata all'esterno se altera o contamina i fatti accertati presenti nel contesto (date, orari, numeri, persone, luoghi, importi). Il `FactVerifier` ha potere di veto assoluto ed intercetta qualsiasi allucinazione prima della trasmissione.

### 4. Architettura Event-Driven e Disaccoppiamento Assoluto
- Tutti i moduli comunicano esclusivamente tramite l'**Event Bus**.
- Nessun modulo possiede dipendenze dirette da altri moduli cognitivi o da adattatori di rete specifici.
- Ogni azione o cambiamento di stato interno produce un `SystemEvent`.

### 5. Indipendenza dagli Adattatori (Adapter Independence)
Il Core Cognitivo è del tutto ignaro del canale di comunicazione (WhatsApp, CLI, Email, REST API, Discord, Voce). Gli Adattatori convertono i protocolli esterni in `Stimulus` ed emettono eventi standardizzati.

### 6. Singola Responsabilità Coordinata
Ogni classe ed ogni modulo esegue un'unica funzione cognitiva ben delimitata (es. `FactExtractor` estrae entità e intenzioni, `AttentionEngine` monitora le anomalie, `PromptBuilder` assembla il documento cognitivo).

### 7. Sicurezza dell'Agente di Esecuzione (Bash & System Agents)
Gli agenti con capacità di esecuzione del sistema operativo (es. `BashAgent`) non agiscono MAI in autonomia diretta. Ogni azione deve passare attraverso il `DecisionEngine` ed emettere preventivamente un `SystemEvent`.

### 8. Evoluzione e Apprendimento Differito
Il sistema osserva costantemente gli eventi e le interazioni. Tuttavia, l'aggiornamento della conoscenza, dello stile e delle preferenze avviene tramite processi di consolidamento validati (es. `LearningEngine` notturno), evitando mutazioni istantanee o instabili dello stato mentale.

### 9. Cognitivo ma non Personale
ONOFRIUS / Gordon è cognitivo ma non personale. Il software contiene esclusivamente il motore cognitivo, gli algoritmi e la logica. Tutta la conoscenza personale, le identità, i contatti, la memoria, gli eventi, le preferenze e le configurazioni vengono create o importate esclusivamente durante il bootstrap sul computer dell'utente. Nessun dato personale deve essere distribuito insieme al software.

### 10. Trasparenza e Diagnostica Continuativa
Lo stato mentale, il flusso dei pensieri, le anomalie e l'attenzione devono essere sempre ispezionabili in tempo reale (tramite Dashboard, System Observer e Cognitive Profiler).

### 11. Evoluzione tramite Ciclo Cognitivo Continuo
Il sistema opera secondo un ciclo organico ed ininterrotto:
$$\text{OSSERVARE} \rightarrow \text{PERCEPIRE} \rightarrow \text{ESTRARRE FATTI} \rightarrow \text{RICORDARE} \rightarrow \text{PENSARE} \rightarrow \text{COMPRENDERE} \rightarrow \text{DECIDERE} \rightarrow \text{COMUNICARE} \rightarrow \text{AGIRE} \rightarrow \text{IMPARARE}$$

### 12. Assioma della Conversazione e Intenzione Comunicativa
> **"La prima responsabilità cognitiva non è classificare l'informazione, ma riconoscere l'intenzione comunicativa dell'interlocutore."**

Ogni messaggio o stimolo in ingresso viene prima valutato per la sua intenzione comunicativa (es. domanda informativa, emotiva, ironica, organizzativa, retorica) e solo successivamente scomposto ed elaborato per l'estrazione di fatti, agenda, pensieri e conoscenza.
