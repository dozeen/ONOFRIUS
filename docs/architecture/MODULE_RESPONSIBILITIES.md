# ONOFRIUS OS — MAPPA DELLE RESPONSABILITÀ DEI MODULI

Version: v1.2.0 (Alpha 0.5 — Identity Abstraction & Cognitive Architecture)

---

## Mappatura Architetturale dei Moduli Cognitivi per Stage

| Stage Pipeline | Modulo / Cartella | Responsabilità Principale | Input | Output / Eventi |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1: Perception** | `core/perception/` | Estrazione metadati, mittente, canale, contesto e trascrizione audio via Whisper STT. | `Stimulus` (WA, Audio, CLI) | `Context` |
| **Stage 2: Fact & Thought Engine** | `core/cognition/facts/` & `memory/thoughts/` | Riconoscimento entità ed isolamento tra fatti oggettivi (`FactRegistry`) e mondo interiore (`ThoughtStream`). | `Context`, `Stimulus` | `FactExtractPayload`, `ThoughtPayload` |
| **Stage 3: Attention Engine v2** | `core/cognition/attention/` | Monitoraggio multi-fonte per anomalie nei log, segnali di emergenza o trend conversazionali. | `SystemEvent`, `Stimulus` | `AttentionAlertEvent` |
| **Stage 4: Interaction & Tone Engine** | `core/cognition/interaction/` & `ToneEngine.js` | Definizione del registro relazionale (`ROMANTIC`, `IRONIC`, `FAMILY`, `TECHNICAL`, `BUSINESS`) ed applicazione Direttiva Anti-Assistenziale. | `Context`, `InteractionProfile` | `InteractionStyle`, `SocialEvent` |
| **Stage 5: Prompt Builder 2.0** | `core/prompt/PromptBuilder2.js` | Assemblaggio Documento Cognitivo strutturato pre-LLM (FACTS, AGENDA, THOUGHTS, MEMORY, STYLE, TASK, CONSTRAINTS). | `Context`, `Facts`, `Thoughts` | `CognitiveDocument` |
| **Stage 6: LLM Execution** | `core/llm/` | Generazione testo o piano da modello di linguaggio locale (Ollama). | `CognitiveDocument` | `RawLLMResponse` |
| **Stage 7: Fact & Privacy Verifier** | `core/cognition/facts/FactVerifier.js` & `FamilyPrivacyManager.js` | Gatekeeper Zero-Trust: verifica assenza di allucinazioni su orari/date e blocco violazioni privacy familiare (`PRIVACY_VIOLATION`). | `RawLLMResponse`, `ExtractedFacts` | `VerificationResult` (`VALID` / `BLOCKED`) |
| **Stage 8: Decision Engine** | `core/decision/DecisionEngine.js` | Selezione ed autorizzazione delle capacità e degli agenti operativi. | `VerificationResult` | `ActionPlan` |
| **Stage 9: Action Execution** | `agents/` & `adapters/` | Esecuzione fisica dell'azione (invio messaggi WA, comandi shell via `BashAgent`). | `ActionPlan` | `SystemEvent` |
| **Stage 10: Learning Engine** | `core/learning/LearningEngine.js` | Job notturno di analisi eventi e consolidamento differito di conoscenza e preferenze. | Daily `EventStore` | `KnowledgeConsolidatedEvent` |

---

## Modori Deterministici a 0 Token LLM

| Modulo | Responsabilità | Beneficio |
| :--- | :--- | :--- |
| `AgendaEngine.js` | Parsing deterministico ed interrogazione agenda locale. | 0 Token LLM, 0 ms latenza, 0 allucinazioni su appuntamenti. |
| `FamilyPrivacyManager.js` | Segregazione dati riservati per cerchi di fiducia familiare. | Garanzia matematica di riservatezza pre-trasmissione. |
| `ToneEngine.js` | Corrispondenza pattern conversazionali per determinare il tono relazionale. | Risposta empatica e naturale senza appiattimento servile. |

---

## Regole di Contaminazione e Dipendenza

1. `facts` non deve mai importare `thoughts`.
2. `FactVerifier` ed `FamilyPrivacyManager` operano in sola lettura pre-invio.
3. Gli Agenti (`agents/*`) comunicano con il sistema unicamente tramite l'**Event Bus**.
4. Nessun componente può chiamare direttamente `exec()` o shell senza passare per il `DecisionEngine`.
