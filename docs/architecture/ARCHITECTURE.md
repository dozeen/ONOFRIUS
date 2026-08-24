# ONOFRIUS OS — ARCHITECTURE DOCUMENTATION

Version: v1.2.0 (Alpha 0.5 — Identity Abstraction & Cognitive Architecture)

---

# 🏛️ Cos'è ONOFRIUS OS

ONOFRIUS OS non è un chatbot o un wrapper LLM.

ONOFRIUS OS è un **Sistema Operativo Cognitivo Ibrido (Deterministico + Probabilistico)** progettato per:
- percepire il mondo esterno da molteplici canali (WhatsApp, Voce Offline, Log, REST, CLI);
- separare fatti oggettivi (`FactRegistry`) da pensieri soggettivi (`ThoughtStream`);
- proteggere la riservatezza tramite privacy Zero-Trust a cerchi concentrici (`FamilyPrivacyManager`);
- adattare il tono relazionale con complicità ed evitare l'appiattimento assistenziale (`ToneEngine`);
- garantire zero allucinazioni sulle informazioni deterministiche (`AgendaEngine`, `FactVerifier`);
- mantenere memoria episodica, semantica e relazionale;
- pianificare ed eseguire azioni verificate tramite agenti operativi (`BashAgent`).

L'istanza di agente cognitivo creata sopra ONOFRIUS OS prenderà il nome di **Gordon Smith** (o Gordon) al momento del Bootstrap dell'utente.

---

# ⚙️ Architettura del Ciclo Cognitivo a 10 Stage

```text
                      STIMULUS (WhatsApp, Audio, CLI, Logs)
                                │
                                ▼
                   [1] PERCEPTION & CONTEXT BUILD
                                │
                                ▼
               [2] FACT EXTRACTOR & THOUGHT STREAM ISOLATION
                   ├──► FactRegistry (Fatti Oggettivi)
                   └──► ThoughtStream (Mondo Interiore)
                                │
                                ▼
                   [3] ATTENTION ENGINE V2 (Anomalie/Trend)
                                │
                                ▼
                   [4] INTERACTION ENGINE & TONE ENGINE
                                │
                                ▼
                   [5] PROMPT BUILDER 2.0 (Documento Cognitivo)
                                │
                                ▼
                   [6] LLM EXECUTION (Ollama / Local LLM)
                                │
                                ▼
                   [7] FACT & PRIVACY VERIFIER (Zero-Trust Gate)
                                │
                                ▼
                   [8] DECISION ENGINE & CAPABILITY REGISTRY
                                │
                                ▼
                   [9] ACTION EXECUTION (WhatsApp, Bash, Events)
                                │
                                ▼
                   [10] LEARNING ENGINE (Consolidamento Notturno)
```

---

# Componenti Architetturali

## 1. Adapters Layer
Convertitori di protocolli esterni (WhatsApp Client, Audio Whisper STT, CLI, REST API) in `Stimulus` standardizzati per l'Event Bus. Gli Adattatori NON prendono decisioni cognitive.

## 2. Perception Engine
Analizza lo stimolo, recupera la cronologia recente, identifica il contatto, la dinamica di gruppo e costruisce il `Context`.

## 3. Fact Engine & Thought Isolation
- **`FactExtractor`**: Riconosce persone, orari, date, importi, telefoni, email.
- **Isolamento**: Instrada i fatti oggettivi in `FactRegistry` ed i pensieri/intenzioni in `ThoughtStream`.

## 4. Attention Engine v2
Monitora gli eventi multi-fonte per calcolare l'indice di priorità (0-100), evidenziando anomalie nei log o trend di emergenza.

## 5. Interaction Engine & ToneEngine
Determina lo stile conversazionale in base a 5 registri relazionali (`ROMANTIC`, `IRONIC`, `FAMILY`, `TECHNICAL`, `BUSINESS`) ed applica la Direttiva Anti-Assistenziale per risposte empatiche e naturali.

## 6. Prompt Builder 2.0
Assembla il **Documento Cognitivo** pre-LLM composto da sezioni strutturate: `FACTS`, `AGENDA`, `THOUGHTS`, `MEMORY`, `STYLE`, `TASK`, `CONSTRAINTS`.

## 7. LLM Execution
Modello di Linguaggio locale (es. Ollama `qwen3.5:latest`) responsabile della generazione del testo o del piano.

## 8. FactVerifier & FamilyPrivacyManager (Zero-Trust Layer)
Filtro deterministico che analizza l'output LLM prima della trasmissione. Blocca allucinazioni operative e violazioni di privacy familiare (`PRIVACY_VIOLATION`).

## 9. Decision Engine & Capability Registry
Trasforma la decisione approvata in azioni concrete (invio messaggi, comandi shell via `BashAgent`) pubblicando sempre un `SystemEvent`.

## 10. Memory & Learning Engine
- **Memory**: Memoria a breve termine, 3-Tier Knowledge (Observed Facts, Inferred Context, Ambient Memory) e memoria relazionale.
- **Learning**: Apprendimento notturno differito che consolida la conoscenza senza destabilizzare lo stato in tempo reale.

---

# Regole dell'Architettura
1. **Event First**: Tutto inizia da un Evento.
2. **Cognitivo ma non Personale**: Zero dati personali nel codebase.
3. **Single Responsibility & Loose Coupling**: I moduli comunicano unicamente via EventBus.
4. **Zero Trust Fact & Privacy**: Nessun output LLM viene inviato senza passare il `FactVerifier`.
