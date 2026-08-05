# GORDON 3 — REASONING & COGNITIVE PIPELINE

Version: 2.0 (Cognitive Evolution)

---

## Panoramica

Il motore di ragionamento di Gordon 3 trasforma stimoli grezzi provenienti dal mondo esterno (messaggi, eventi di sistema, log, segnali temporali) in decisioni ponderate ed azioni verificate.

Non si tratta di una singola chiamata LLM, bensì di una pipeline cognitiva sequenziale e modulare.

---

## Flusso della Pipeline Cognitiva

```
STIMULUS
   │
   ▼
[1] Perception & ContextEnrichment
   │
   ▼
[2] FactExtractor (Fase 1) ──► Estrazione Entità e Categorizzazione
   │
   ├──► FactRegistry (Fatti Oggettivi)
   └──► ThoughtStream (Mondo Interiore / Intenzioni / Preferenze)
   │
   ▼
[3] AttentionEngine v2 ──► Rilevamento Anomalie, Trend, Segnali
   │
   ▼
[4] InteractionEngine ──► Analisi Tono, Energia, Opportunità di Risposta
   │
   ▼
[5] PromptBuilder 2.0 ──► Assemblaggio Documento Cognitivo Strutturato
   │                       (FACTS + AGENDA + THOUGHTS + MEMORY + STYLE + TASK + CONSTRAINTS)
   ▼
[6] LLM Execution
   │
   ▼
[7] FactVerifier (Fase 5) ──► Validazione Zero-Trust (Blocco se i fatti sono stati alterati)
   │
   ▼
[8] DecisionEngine & CapabilityEngine
   │
   ▼
[9] Action Execution (WhatsApp, BashAgent, System Events)
   │
   ▼
[10] Learning Engine (Apprendimento Differito & Consolidamento)
```

---

## Fasi di Pipeline nel Dettaglio

### 1. Perception & Context Enrichment
Raccoglie lo stimolo in ingresso, carica lo storico conversazionale immediato, identifica il mittente, il gruppo e l'ambiente.

### 2. Fact Engine & Thought Isolation
- **`FactExtractor`**: Riconosce persone, luoghi, date, orari, importi, telefoni, email.
- **Classificazione**: Categorizza lo stimolo in `Intention` ("Vorrei..."), `Future Event` ("Domani..."), `Reminder` ("Ricordami..."), `Fact` ("Fabio mi ha chiamato"), o `Preference` ("Mi piace...").
- **Instradamento**: I fatti oggettivi vengono indicizzati in `FactRegistry`; pensieri ed intenzioni vengono registrati nel `ThoughtStream`.

### 3. Attention Engine v2
Valuta se lo stimolo fa parte di un trend di anomalia (es. picchi di eventi, parole ricorrenti come "terremoto", errori critici di sistema).

### 4. Interaction Engine
Analizza l'energia relazionale e determina stile, formalità, uso di emoji, livello di ironia/romanticismo e velocità di risposta ottimale in base al profilo dell'interlocutore (`InteractionProfile`).

### 5. Prompt Builder 2.0
Genera un vero e proprio **Documento Cognitivo** prima dell'invocazione LLM, strutturato nelle seguenti sezioni esplicite:
1. `FACTS`
2. `AGENDA`
3. `THOUGHTS`
4. `MEMORY`
5. `STYLE`
6. `TASK`
7. `CONSTRAINTS`

### 6. Fact Verifier (Gatekeeper di Verità)
Analizza la risposta grezza dell'LLM prima della trasmissione. Se l'LLM ha allucinato o modificato dati critici (es. orari da `18:00` a `17:30`, o nomi da `Fabio` a `Marco`), l'output viene immediatamente **bloccato** ed eventualmente rigenerato.

### 7. Execution & Learning
L'azione viene eseguita (invio messaggio, comando bash gestito tramite `DecisionEngine`) producendo sempre un `SystemEvent`. I risultati alimentano il log per il ciclo di apprendimento notturno del `LearningEngine`.
