const CommercialPolicy =
    require("./CommercialPolicy");
class CommercialGuard {

/**
 * Rileva una possibile conferma economica.
 *
 * Esempio:
 *
 * Cliente:
 * "Mi avevi detto 300 euro, giusto?"
 *
 * Gordon:
 * "Sì, giusto."
 *
 * La risposta non contiene denaro,
 * ma sta comunque confermando un prezzo.
 */
isPriceConfirmation(incoming, response) {

    if (
        typeof incoming !== "string" ||
        typeof response !== "string"
    ) {
        return false;
    }

    const question = incoming.toLowerCase();
    const answer = response.toLowerCase();

    const incomingContainsMoney =
        /€\s*\d+/i.test(incoming) ||
        /\d+(?:[.,]\d{1,2})?\s*€/i.test(incoming) ||
        /\d+(?:[.,]\d{1,2})?\s*euro/i.test(incoming);

    if (!incomingContainsMoney) {
        return false;
    }

    const confirmationPatterns = [

        "sì",
        "si",
        "giusto",
        "esatto",
        "confermo",
        "corretto",
        "va bene",
        "d'accordo",
        "è quello",
        "era quello",
        "sono quelli",
        "facciamo"

    ];

    return confirmationPatterns.some(pattern =>
        answer.includes(pattern)
    );
}
containsUnverifiedCommercialAction(response) {

    if (!response || typeof response !== "string") {
        return false;
    }

    const text = response.toLowerCase();

    const patterns = [

        "ti invio la ricevuta",
        "ti mando la ricevuta",

        "ti invio la fattura",
        "ti mando la fattura",

        "ti mando il preventivo",
        "ti invio il preventivo",

        "ho fatto il bonifico",
        "ho effettuato il bonifico",

        "ho confermato la prenotazione",
        "ti ho prenotato",

        "ho applicato lo sconto",
        "ti ho fatto lo sconto"

    ];

    return patterns.some(pattern =>
        text.includes(pattern)
    );
}
    // =====================================================
    // CLIENTE
    // =====================================================

    isClient(context) {

        const contact = context?.contact;

        if (!contact) {
            return false;
        }

        const type =
            String(contact.type || "").toLowerCase();

        const relationship =
            String(contact.relationship || "").toLowerCase();

        return (
            type === "client" ||
            relationship === "cliente"
        );
    }


    // =====================================================
    // NORMALIZZAZIONE
    // =====================================================

    normalize(text) {

        if (typeof text !== "string") {
            return "";
        }

        return text
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }


    // =====================================================
    // CHIUSURA CONVERSAZIONE
    // =====================================================

    isClosingMessage(text) {

        const normalized = this.normalize(text)
            .replace(/[.!?]+$/g, "");

        if (!normalized) {
            return false;
        }

        const closingMessages = [

            "ok",
            "okay",
            "va bene",
            "perfetto",
            "grazie",
            "grazie mille",
            "bene",
            "d'accordo",
            "accordo",
            "a domani",
            "ci vediamo domani",
            "a presto",
            "ci sentiamo",
            "ci sentiamo dopo"

        ];

        return closingMessages.includes(normalized);
    }


    // =====================================================
    // RAGIONAMENTO INTERNO
    // =====================================================

    containsInternalReasoning(response) {

        const text = this.normalize(response);

        if (!text) {
            return false;
        }

        const patterns = [

            "devo controllare",
            "devo verificare",
            "fammi vedere",
            "fammi controllare",
            "vediamo cosa",
            "vediamo se",
            "non so se",
            "forse dovrei",
            "devo verificare la lista",
            "devo controllare la lista",
            "fammi controllare cosa",
            "cosa ho in memoria",
            "cos'ho in memoria",
            "prima di controllare",
            "prima controllo",
            "controllo nella memoria"

        ];

        return patterns.some(pattern =>
            text.includes(pattern)
        );
    }


    // =====================================================
    // DOMANDA COMMERCIALE
    // =====================================================

    isCommercialQuestion(text) {

        const normalized = this.normalize(text);

        if (!normalized) {
            return false;
        }

        const patterns = [

            // Prezzi

            "quanto ti devo",
            "quanto devo",
            "quanto costa",
            "quanto viene",
            "quanto sarebbe",
            "quanto mi costa",
            "quanto ci costa",
            "che prezzo",
            "il prezzo",
            "prezzo",
            "costo",

            // Preventivi

            "preventivo",
            "offerta",

            // Pagamenti

            "pagamento",
            "pagare",
            "pago",
            "pagarti",
            "saldo",
            "saldare",
            "acconto",
            "caparra",
            "totale",

            // Modifiche economiche

            "sconto",
            "extra",
            "aggiunto",
            "aggiungere",
            "compreso",
            "compresa",
            "compresi",
            "incluse",
            "incluso",
            "inclusa"

        ];

        return patterns.some(pattern =>
            normalized.includes(pattern)
        );
    }


    // =====================================================
    // IMPORTI
    // =====================================================

    containsMoney(response) {

        if (typeof response !== "string") {
            return false;
        }

        const patterns = [

            // 250€
            /\b\d+(?:[.,]\d{1,2})?\s*€/i,

            // €250
            /€\s*\d+(?:[.,]\d{1,2})?/i,

            // 250 euro
            /\b\d+(?:[.,]\d{1,2})?\s*euro\b/i,

            // euro 250
            /\beuro\s*\d+(?:[.,]\d{1,2})?/i

        ];

        return patterns.some(regex =>
            regex.test(response)
        );
    }


    // =====================================================
    // AFFERMAZIONI COMMERCIALI SOSPETTE
    // =====================================================

    containsUnverifiedCommercialClaim(response) {

        const text = this.normalize(response);

        if (!text) {
            return false;
        }

        const patterns = [

            "come al solito",
            "come sempre",
            "come concordato",
            "come stabilito",
            "come pattuito",
            "come avevamo concordato",
            "come avevamo detto",
            "il prezzo concordato",
            "il prezzo stabilito"

        ];

        return patterns.some(pattern =>
            text.includes(pattern)
        );
    }


    // =====================================================
    // DATO COMMERCIALE VERIFICATO
    //
    // Preparato per il futuro CommercialMemory.
    //
    // Potremo impostare:
    //
    // context.commercial.verified = true
    //
    // soltanto quando prezzo/preventivo/pagamento
    // proviene da una fonte affidabile.
    // =====================================================

    hasVerifiedCommercialData(context) {

        return (
            context?.commercial?.verified === true ||
            context?.metadata?.commercialVerified === true
        );
    }


    // =====================================================
    // RISPOSTA SICURA
    // =====================================================

    safeCommercialReply(context) {

        const name =
            context?.contact?.name;

        if (
            name &&
            name !== "Sconosciuto" &&
            name !== "unknown"
        ) {

            return `${name}, controllo un attimo e ti confermo l'importo.`;
        }

        return "Controllo un attimo e ti confermo l'importo.";
    }


    safeGenericReply() {

        return "Controllo e ti faccio sapere.";
    }


    // =====================================================
    // RISULTATI
    // =====================================================

    allow(response, reason) {

        return {
            action: "ALLOW",
            response,
            reason
        };
    }


    replace(response, reason) {

        return {
            action: "REPLACE",
            response,
            reason
        };
    }


    silent(reason) {

        return {
            action: "SILENT",
            response: null,
            reason
        };
    }


    block(reason) {

        return {
            action: "BLOCK",
            response: null,
            reason
        };
    }


    // =====================================================
    // VALUTAZIONE
    // =====================================================

    evaluate(context, response) {

        // -------------------------------------------------
        // Non cliente
        // -------------------------------------------------

        if (!this.isClient(context)) {

            return this.allow(
                response,
                "Contatto non cliente"
            );
        }


        // -------------------------------------------------
        // Risposta inesistente
        // -------------------------------------------------

        if (
            typeof response !== "string" ||
            !response.trim()
        ) {

            return this.silent(
                "Risposta vuota"
            );
        }


        const incoming =
            context?.text || "";
// -------------------------------------------------
// AZIONI COMMERCIALI NON VERIFICATE
// -------------------------------------------------

if (this.containsUnverifiedCommercialAction(response)) {

    return {
        action: "REPLACE",
        response:
            `${context?.contact?.name || ""}`.trim()
                ? `${context.contact.name}, verifico e ti faccio sapere.`
                : "Verifico e ti faccio sapere.",
        reason:
            "Azione commerciale non verificata"
    };
}


// -------------------------------------------------
// CONFERMA DI PREZZO PROPOSTO DAL CLIENTE
// -------------------------------------------------

if (
    CommercialPolicy.ownerDecidesPrices &&
    this.isPriceConfirmation(incoming, response)
) {

    return {
        action: "REPLACE",
        response:
            `${context?.contact?.name || ""}`.trim()
                ? `${context.contact.name}, controllo l'accordo e ti confermo.`
                : "Controllo l'accordo e ti confermo.",
        reason:
            "Conferma economica riservata a Onofrio"
    };
}

        const commercialQuestion =
            this.isCommercialQuestion(incoming);

        const containsMoney =
            this.containsMoney(response);

        const verified =
            this.hasVerifiedCommercialData(context);


        // -------------------------------------------------
        // 1. DOMANDA COMMERCIALE + IMPORTO NON VERIFICATO
        //
        // Deve venire PRIMA del controllo sul ragionamento
        // interno.
        // -------------------------------------------------

        if (
            commercialQuestion &&
            containsMoney &&
            !verified
        ) {

            return this.replace(
                this.safeCommercialReply(context),
                "Importo economico non verificato"
            );
        }


        // -------------------------------------------------
        // 2. AFFERMAZIONI COMMERCIALI INVENTATE
        // -------------------------------------------------

        if (
            commercialQuestion &&
            this.containsUnverifiedCommercialClaim(response) &&
            !verified
        ) {

            return this.replace(
                this.safeCommercialReply(context),
                "Affermazione commerciale non verificata"
            );
        }


        // -------------------------------------------------
        // 3. RAGIONAMENTO INTERNO
        // -------------------------------------------------

        if (this.containsInternalReasoning(response)) {

            if (commercialQuestion) {

                return this.replace(
                    this.safeCommercialReply(context),
                    "Ragionamento interno rimosso dalla risposta commerciale"
                );
            }

            return this.replace(
                this.safeGenericReply(),
                "Ragionamento interno rimosso dalla risposta"
            );
        }


        // -------------------------------------------------
        // 4. CONVERSAZIONE CONCLUSA
        // -------------------------------------------------

        if (this.isClosingMessage(incoming)) {

            return this.silent(
                "Messaggio di chiusura del cliente"
            );
        }


        // -------------------------------------------------
        // OK
        // -------------------------------------------------

        return this.allow(
            response,
            "Risposta cliente consentita"
        );
    }

}

module.exports = new CommercialGuard();
