# ONOFRIUS OS — TRUTH MODEL & FACT VERIFIER ARCHITECTURE

Version: v1.2.0 (Alpha 0.5)

---

## 1. Architettura dei 3 Livelli di Conoscenza (3-Tier Knowledge)

ONOFRIUS OS suddivide la conoscenza in tre livelli rigorosamente separati:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣ OBSERVED FACTS (FactRegistry.js)                         │
│ Fatti oggettivi osservati e registrati (Zero inferenze)     │
├─────────────────────────────────────────────────────────────┤
│ 2️⃣ INFERRED CONTEXT (InferredContext.js)                    │
│ Ipotesi ed inferenze (emergent_hypothesis + evidenze)       │
├─────────────────────────────────────────────────────────────┤
│ 3️⃣ AMBIENT MEMORY (AmbientMemory.js)                        │
│ Narrazioni sociali sostenute con decadimento (0.99/giorno)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Modello di Verità Zero-Trust (`FactVerifier.js`)

Il `FactVerifier` è il Gatekeeper di Verità che agisce al settimo stage della pipeline cognitiva:

1. **Estrazione Pre-LLM**: Il `FactExtractor` identifica tutte le entità oggettive nello stimolo e nell'agenda (orari, date, persone, importi, telefoni).
2. **Generazione LLM**: L'LLM produce la risposta probabilistica grezza.
3. **Intercettazione Zero-Trust**: Il `FactVerifier` confronta le entità presenti nella risposta LLM con i fatti certificati in `FactRegistry` ed `AgendaEngine`.
4. **Veto e Riscrittura**: Se l'LLM ha allucinato (es. modificato l'orario di un appuntamento o inventato una persona), la risposta viene immediatamente **bocciata** e sostituita con i dati oggettivi reali a 0 token.
