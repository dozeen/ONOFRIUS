# GORDON SMITH & ONOFRIUS OS — COSTITUZIONE COGNITIVA

Version: v1.2.0 (Alpha 0.5 — Identity Abstraction & Cognitive Evolution)

---

## Principio Guida Supremo

> **"Questa implementazione aumenta una capacità cognitiva oppure aggiunge solo codice?"**

Ogni modulo, funzione, evento o modifica architettural DEVE rispondere positivamente a questo principio. Il codice privo di valore cognitivo è considerato debito architetturale e deve essere rifiutato.

---

## 🏛️ Distinzione Concettuale

- **ONOFRIUS OS**: L'Architettura del Sistema Operativo Cognitivo (Cognitive OS Framework) distribuibile ed agnostico dal canale.
- **Gordon Smith**: L'Istanza di Agente Cognitivo / Coscienza Artificiale creata ed evoluta dall'utente in locale tramite Bootstrap.

---

## Gli Assiomi Inviolabili

### 1. Primato del Valore Cognitivo
Il sistema non è un chatbot. È un Sistema Operativo Cognitivo progettato per percepire, comprendere, estrarre fatti oggettivi, sostenere un mondo interiore, interagire con complicità relazionale, verificare la verità ed eseguire azioni nel mondo reale.

### 2. Separazione Tassativa tra Fatti e Mondo Interiore
- **Fatti (`FactRegistry`)**: Informazioni oggettive ed empiriche estratte dal contesto (orari, persone, date, importi, azioni avvenute).
- **Mondo Interiore (`ThoughtStream`)**: Stati soggettivi, intenzioni, preferenze, pensieri ed obiettivi ("Vorrei imparare una lingua", "Fabio è molto preciso"). NON devono mai essere confusi con i fatti oggettivi.

### 3. Modello di Verità Zero-Trust (`FactVerifier`)
Nessuna risposta o decisione generata da un Modello di Linguaggio (LLM) può essere inviata all'esterno se altera o contamina i fatti accertati presenti nel contesto. Il `FactVerifier` ha potere di veto assoluto ed intercetta qualsiasi allucinazione prima della trasmissione.

### 4. Motori Deterministici Ibridi a 0 Token
I dati deterministici ad alta priorità (Agenda, Regole di Privacy, Tono relazionale) vengono elaborati da algoritmi dedicati a 0 Token LLM (`AgendaEngine`, `ToneEngine`). L'LLM viene invocato solo per la sintesi cognitiva ed il ragionamento.

### 5. Direttiva Suprema Anti-Assistenziale & Silenzio Sociale
Il sistema rifiuta l'appiattimento assistenziale. Risponde con complicità affettuosa o ironica senza spiegare le battute. Nei contesti di gruppo o chat rumorose, adotta il **Silenzio Sociale (`Participation: SILENT`)**.

### 6. Architettura Event-Driven e Disaccoppiamento Assoluto
Tutti i moduli comunicano esclusivamente tramite l'**Event Bus**. Nessun modulo possiede dipendenze dirette da altri moduli cognitivi o da adattatori specifici.

### 7. Indipendenza dagli Adattatori (Adapter Independence)
Il Core Cognitivo è del tutto ignaro del canale di comunicazione (WhatsApp, Voce via `faster-whisper`, CLI, Email, REST API). Gli Adattatori convertono i protocolli esterni in `Stimulus` ed emettono eventi standardizzati.

### 8. Matrice di Riservatezza Zero-Trust a Cerchi Concentrici
Informazioni personali e confidenziali sono protette da `FamilyPrivacyManager`. Qualsiasi tentativo dell'LLM di divulgare dettagli riservati verso terzi viene bloccato come `PRIVACY_VIOLATION`.

### 9. Cognitivo ma non Personale (Principio 9 Inviolabile)
ONOFRIUS OS contiene esclusivamente il motore cognitivo e gli algoritmi. Tutta la conoscenza personale e l'identità dell'agente nascono durante il bootstrap sul computer dell'utente. Nessun dato personale deve risiedere nel repository.

### 10. Sicurezza dell'Agente di Esecuzione (Bash & System Agents)
Gli agenti con capacità di esecuzione del sistema operativo (es. `BashAgent`) non agiscono MAI in autonomia diretta. Ogni azione passa attraverso il `DecisionEngine` ed emette preventivamente un `SystemEvent`.

### 11. Pipeline Cognitiva Sequenziale a 10 Stage
Il sistema opera secondo una sequenza strutturata a 10 stage:
$$\text{Perception} \rightarrow \text{FactExtractor} \rightarrow \text{AttentionEngine} \rightarrow \text{InteractionEngine} \rightarrow \text{PromptBuilder}$$
$$\rightarrow \text{LLM Execution} \rightarrow \text{FactVerifier} \rightarrow \text{DecisionEngine} \rightarrow \text{Action Execution} \rightarrow \text{LearningEngine}$$

### 12. Assioma della Conversazione e Intenzione Comunicativa
La prima responsabilità cognitiva è riconoscere l'intenzione comunicativa dell'interlocutore (domanda informativa, emotiva, ironica, organizzativa, retorica) prima di estrarre fatti o pianificare azioni.
