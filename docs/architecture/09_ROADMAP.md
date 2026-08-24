# ONOFRIUS OS — TECHNICAL ARCHITECTURE ROADMAP

Version: v1.2.0 (Alpha 0.5)

---

## 🗺️ Sintesi dello Sviluppo Tecnico

### Phase 1: Event Infrastructure & Adapter Decoupling ✅
- Implementazione dell'EventBus centralizzato.
- Disaccoppiamento di WhatsApp Adapter e CLI.

### Phase 2: Fact Engine & 3-Tier Knowledge ✅
- Isolamento dei fatti oggettivi (`FactRegistry`) rispetto ai pensieri soggettivi (`ThoughtStream`).
- Gestione della memoria 3-Tier (Observed Facts, Inferred Context, Ambient Memory).

### Phase 3: Zero-Trust Verification & Privacy Matrix ✅
- Implementazione di `FactVerifier` pre-trasmissione.
- Gestione della privacy familiare Zero-Trust con `FamilyPrivacyManager`.

### Phase 4: Tone Matching & Deterministic Agenda Engine ✅
- Integrazione di `ToneEngine` a 5 registri relazionali e Direttiva Anti-Assistenziale.
- Integrazione dell' `AgendaEngine` deterministico a 0 Token LLM.

### Phase 5: Voice Autonomy & Offline STT ✅
- Trascrizione offline di note vocali con `faster-whisper` e segmentazione episodica.

### Phase 6: Vector RAG & Consolidamento Notturno ⏳ (Prossimo Step)
- Indicizzazione vettoriale via `EmbeddingIndex.js` per RAG compatto.
- Warmup automatico di Ollama (`keep_alive: "24h"`).
- Job notturno automatico delle ore 03:00 per consolidamento rete di conoscenza.

### Phase 7: Realtime Cognitive Dashboard ⏳
- Dashboard Web/CLI per monitoraggio live dello stato mentale e dell'Attention Engine.
