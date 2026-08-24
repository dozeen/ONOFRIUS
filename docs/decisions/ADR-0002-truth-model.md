# ADR-0002: Zero-Trust Truth Model & Pre-Send Fact Verification

- **Status**: Accettato
- **Data**: 2026-08-21
- **Versione**: v1.2.0 (Alpha 0.5)

---

## Contestazione e Problema
I modelli di linguaggio (LLM) soffrono di allucinazioni: possono inventare o alterare orari di appuntamenti, nomi di persone, date o numeri di telefono durante la generazione del testo, compromettendo laffidabilità dell'agente.

## Decisione
Implementare un **Modello di Verità Zero-Trust** tramite l'algoritmo `FactVerifier`. Nessun testo generato dall'LLM viene trasmesso verso l'esterno senza prima essere stato analizzato dal `FactVerifier` rispetto ai fatti oggettivi certificati in `FactRegistry` ed `AgendaEngine`.

## Conseguenze
- **Pro**: Azzeramento delle allucinazioni su dati critici ed operativi.
- **Pro**: Protezione deterministica pre-trasmissione.
- **Contro**: Necessità di un ulteriore stage di validazione nella pipeline (Stage 7).
