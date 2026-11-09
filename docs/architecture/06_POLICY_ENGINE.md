# ONOFRIUS OS — POLICY ENGINE & PRIVACY ARCHITECTURE

Version: v1.2.0 (Alpha 0.5)

---

## 1. Architettura della Privacy Zero-Trust

La protezione dei dati personali e riservati in ONOFRIUS OS non è basata su semplici raccomandazioni nel prompt, ma è applicata in modo deterministico dal **Policy Engine** e dal **FamilyPrivacyManager**.

---

## 2. Cerchi Concentrici di Riservatezza (`FamilyPrivacyManager.js`)

Le informazioni memorizzate nel sistema sono suddivise in cerchi di fiducia:

1. **Inner Circle (Owner & Persona Confidential)**:
   - Dettagli personali ed annotazioni del `ThoughtStream` visibili **esclusivamente** nelle chat private tra l'utente ed il suo agente.
2. **Family Circle (Cerchio Familiare Riservato)**:
   - Informazioni riguardanti la sfera familiare (es. dati dei congiunti/partner). Visibili **soltanto** nelle conversazioni con membri accreditati del cerchio familiare.
3. **Public / Business Circle (Esterno / Clienti)**:
   - Contatti di lavoro, richieste di preventivo ed interazioni pubbliche. 

---

## 3. Veto Deterministico di Riservatezza

Al settimo stage della pipeline (`Fact & Privacy Verifier`), l'output generato dall'LLM viene sottoposto al test di segregazione:
- Se l'interlocutore appartiene al cerchio *Business/Public* e la risposta contiene riferimenti a soggetti del cerchio *Family* o *Inner*, il Policy Engine emette un veto immediato (`PRIVACY_VIOLATION`).
- La risposta viene intercettata, cancellata ed inviata una formulazione generica di cortesia.
