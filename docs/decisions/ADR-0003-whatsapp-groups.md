# ADR-0003: Group Dynamics & Knowledge-Maturity Autonomy Transition (`Participation: SILENT` -> `ACTIVE`)

- **Status**: Accettato / Aggiornato
- **Data**: 2026-08-25
- **Versione**: v1.2.0 (Alpha 0.5)

---

## Contestazione e Problema
Intervenire automaticamente su ogni messaggio all'interno dei gruppi causa spam e rumore. Tuttavia, rimanere in silenzio indefinito anche quando l'agente ha acquisito la conoscenza completa sui fatti limiterebbe la sua utilità.

## Decisione
Integrare nel `GroupDynamicsEngine` la **Regola di Transizione per Maturità della Conoscenza (Knowledge Maturity Transition Rule)**:
1. **Fase Silente (Apprendimento)**: Finché l'agente sta apprendendo ed accumulando fatti sul contesto ($Confidence < 0.90$), mantiene il Silenzio Sociale (`Participation: SILENT`).
2. **Fase Attiva (Intervento Certo)**: Quando l'agente accumula fatti confermati con alto livello di certezza ($Confidence \ge 0.90$ / `CERTAINTY`), il punteggio di partecipazione cresce ($+25$), consentendo all'agente di **abbandonare la modalità silente e rispondere in autonomia con certezza**.

## Conseguenze
- **Pro**: Zero allucinazioni ed assenza di spam nelle fasi iniziali di conversazione.
- **Pro**: Transizione naturale ed autonoma verso interventi utili e certi non appena la conoscenza è matura.
