# GORDON 3 — MAPPA DELLE RESPONSABILITÀ DEI MODULI

Version: 1.0 (Cognitive Evolution)

---

## Mappatura Architetturale dei Moduli Cognitivi

| Fase Roadmap | Modulo / Cartella | Responsabilità Principale | Input | Output / Eventi |
| :--- | :--- | :--- | :--- | :--- |
| **Fase 1: Fact Engine** | `core/cognition/facts/` | Riconoscimento entità (persone, orari, date, importi, mail, telefoni) e classificazione intenzioni/fatti. | `Context`, `Stimulus` | `FactExtractPayload`, `FactEvent` |
| **Fase 2: Thought Stream** | `memory/thoughts/` | Gestione del mondo interiore di Gordon: intenzioni, preferenze, note, pensieri, obiettivi. | `ThoughtExtractPayload` | Persistence in `memory/thoughts/*` |
| **Fase 3: Interaction Engine** | `core/cognition/interaction/` | Apprendimento automatico stile, tono, formalità, emoji, energia conversazionale e opportunità di risposta. | `Context`, `InteractionProfile` | `InteractionStyle`, `SocialEvent` |
| **Fase 4: Prompt Builder 2.0** | `core/prompt/PromptBuilder2.js` | Assemblaggio documento cognitivo strutturato pre-LLM (FACTS, AGENDA, THOUGHTS, MEMORY, STYLE, TASK, CONSTRAINTS). | `Context`, `Facts`, `Thoughts` | `CognitiveDocument` |
| **Fase 5: Fact Verifier** | `core/cognition/facts/FactVerifier.js` | Validazione zero-trust dell'output LLM contro i fatti estratti. Blocco assoluto di allucinazioni su orari/nomi/date. | `LLMResponse`, `ExtractedFacts` | `VerificationResult` (`VALID` / `BLOCKED`) |
| **Fase 6: Attention Engine v2** | `core/cognition/attention/` | Monitoraggio continuo stimoli multi-fonte (WhatsApp, Syslog, Email, CLI, Event Store) per rilevare anomalie/trend. | All `SystemEvents` | `AttentionAlertEvent` |
| **Fase 7: Bash Agent** | `agents/bash/` | Agente operativo per comandi di sistema (`systemctl`, `docker`, `git`, `cron`, `top`). Agisce solo tramite `DecisionEngine`. | `ActionCommand` | `SystemEvent` |
| **Fase 8: System Observer** | `core/observers/SystemObserver.js` | Osservazione e baseline di `journalctl`, `syslog`, `docker`, `kernel` per alert immediati su deviazioni. | System Logs | `SystemAnomalyAlert` |
| **Fase 9: Social Observer** | `core/observers/SocialObserver.js` | Analisi frequenza argomenti WhatsApp per identificare eventi improvvisi (es. notizie, emergenze). | WhatsApp `EventStore` | `SocialTrendAlert` |
| **Fase 10: Learning Engine** | `core/learning/LearningEngine.js` | Job notturno di analisi eventi e aggiornamento differito di interazioni, conoscenza, pensieri e preferenze. | Daily `EventStore` | `KnowledgeConsolidatedEvent` |
| **Fase 11: Dashboard** | `dashboard/` / REST API | Visualizzazione in tempo reale dello stato mentale, agenda, memoria, pensieri, agenti ed errori. | Internal State | Realtime UI Dashboard |
| **Fase 12: Multi Agent OS** | `agents/` | Coordinamento di agenti autonomi specializzati (Bash, Browser, Vision, Voice, Mail, Calendar) tramite EventBus. | `TaskEvent` | `TaskResultEvent` |
| **Fase 13: Cognitive OS** | `core/kernel/` & `Brain` | Orchestrazione del ciclo continuo: Osservare $\rightarrow$ Percepire $\rightarrow$ Estrarre $\rightarrow$ Ricordare $\rightarrow$ Pensare $\rightarrow$ Agire. | Global Loop | System State Evolution |

---

## Regole di Contaminazione e Dipendenza

1. `facts` non deve mai importare `thoughts`.
2. `FactVerifier` opera in sola lettura sui fatti estratti nel contesto corrente.
3. Gli Agenti (`agents/*`) comunicano con il sistema unicamente tramite l'**Event Bus**.
4. Nessun componente può chiamare direttamente `exec()` o shell senza passare per il `DecisionEngine`.
