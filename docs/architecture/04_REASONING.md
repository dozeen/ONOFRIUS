# GORDON SMITH & ONOFRIUS OS — REASONING & COGNITIVE PIPELINE

Version: v1.2.0 (Alpha 0.5 — Identity Abstraction & Cognitive Evolution)

---

## Panoramica

Il motore di ragionamento di ONOFRIUS OS trasforma stimoli grezzi provenienti dal mondo esterno (messaggi WhatsApp, note vocali Whisper, eventi di sistema, log, comandi CLI, segnali temporali) in decisioni ponderate ed azioni verificate per l'agente **Gordon Smith**.

Non si tratta di una singola chiamata LLM, bensì di una pipeline cognitiva sequenziale, ibrida (deterministica + probabilistica) e modulare divisa in 10 stage.

---

## Flusso della Pipeline Cognitiva a 10 Stage

```text
STIMULUS
   │
   ▼
[1] Perception & ContextEnrichment
   │
   ▼
[2] FactExtractor ──► Estrazione Entità e Categorizzazione
   │
   ├──► FactRegistry (Fatti Oggettivi)
   └──► ThoughtStream (Mondo Interiore / Intenzioni / Preferenze)
   │
   ▼
[3] AttentionEngine v2 ──► Rilevamento Anomalie, Trend, Segnali (0-100 Priority)
   │
   ▼
[4] InteractionEngine & ToneEngine ──► Analisi Tono (5 Registri), Energia, Direttiva Anti-Assistenziale
   │
   ▼
[5] PromptBuilder 2.0 ──► Assemblaggio Documento Cognitivo Strutturato
   │                       (FACTS + AGENDA + THOUGHTS + MEMORY + STYLE + TASK + CONSTRAINTS)
   ▼
[6] LLM Execution (Ollama / Local LLM)
   │
   ▼
[7] FactVerifier & FamilyPrivacyManager ──► Validazione Zero-Trust (Blocco Allucinazioni & Privacy Violation)
   │
   ▼
[8] DecisionEngine & CapabilityRegistry
   │
   ▼
[9] Action Execution (WhatsApp, BashAgent, System Events)
   │
   ▼
[10] LearningEngine (Apprendimento Differito & Consolidamento Notturno)
```

---

## Dettaglio dei 10 Stage Sequenziali

### 1. Perception & Context Enrichment
Raccoglie lo stimolo in ingresso, carica lo storico conversazionale immediato, identifica il mittente, il gruppo ed il canale.

### 2. Fact Engine & Thought Isolation
- **`FactExtractor`**: Riconosce persone, luoghi, date, orari, importi, telefoni, email.
- **Classificazione**: Categorizza lo stimolo in `Intention`, `Future Event`, `Reminder`, `Fact`, o `Preference`.
- **Instradamento**: I fatti oggettivi vengono indicizzati in `FactRegistry`; pensieri ed intenzioni vengono registrati nel `ThoughtStream`.

### 3. Attention Engine v2
Valuta se lo stimolo fa parte di un trend di anomalia (es. picchi di eventi, parole emergenza, errori critici di sistema nei log).

### 4. Interaction Engine & ToneEngine
Analizza l'energia relazionale e determina lo stile in base a 5 registri (`ROMANTIC`, `IRONIC`, `FAMILY`, `TECHNICAL`, `BUSINESS`). Applica la direttiva anti-assistenziale: se l'interlocutore scherza, risponde con complicità senza spiegare la battuta.

### 5. Prompt Builder 2.0
Genera un **Documento Cognitivo** prima dell'invocazione LLM, strutturato nelle seguenti sezioni esplicite: `FACTS`, `AGENDA`, `THOUGHTS`, `MEMORY`, `STYLE`, `TASK`, `CONSTRAINTS`.

### 6. LLM Execution
Invocazione del modello locale per la sintesi probabilistica, il ragionamento profondo e la formulazione del testo finale.

### 7. FactVerifier & FamilyPrivacyManager (Zero-Trust Gatekeeper)
Analizza la risposta grezza dell'LLM prima della trasmissione. Se l'LLM ha allucinato dati oggettivi dell'agenda o violato i cerchi di privacy familiare (`PRIVACY_VIOLATION`), l'output viene **bloccato ed intercettato**.

### 8. Decision Engine & Capability Registry
Pianifica le azioni necessarie verificando le autorizzazioni dei comandi e delle capability (es. `BashAgent`, `WhatsAppCapability`).

### 9. Action Execution
L'azione viene eseguita (invio messaggio WhatsApp, comando shell via `BashAgent`) producendo sempre un `SystemEvent` per l'EventBus.

### 10. Learning Engine
I risultati alimentano l'EventStore per il ciclo di apprendimento e consolidamento notturno del `LearningEngine` (ore 03:00).
