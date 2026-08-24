# ADR-0003: Group Dynamics & Social Silence (`Participation: SILENT`)

- **Status**: Accettato
- **Data**: 2026-08-21
- **Versione**: v1.2.0 (Alpha 0.5)

---

## Contestazione e Problema
Intervenire automaticamente su ogni messaggio all'interno dei gruppi WhatsApp causa spam, disturbo ed appiattimento conversazionale.

## Decisione
Integrare il `GroupDynamicsEngine` ed il meccanismo del **Silenzio Sociale (`Participation: SILENT`)**. L'agente valuta l'Indice di Convenienza Sociale in base alla frequenza dei messaggi, alla presenza di menzioni ed al contesto. Se l'indice è inferiore a 0, l'agente sceglie di rimanere in silenzio, registrando le informazioni pertinenti senza inviare risposte.

## Conseguenze
- **Pro**: Comportamento sociale naturale e discreto nei gruppi.
- **Pro**: Risparmio di risorse computazionali e chiamate LLM.
- **Contro**: L'agente potrebbe non rispondere a messaggi informali non direttamente indirizzati a lui.
