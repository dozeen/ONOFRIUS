const commercialGuard = require("./CommercialGuard");

class ResponseGuard {

    evaluate(context, response) {

        // =====================================================
        // RISPOSTA VUOTA
        // =====================================================

        if (
            response === null ||
            response === undefined ||
            response === ""
        ) {

            return {
                action: "SILENT",
                response: null,
                reason: "Risposta vuota"
            };
        }

        // =====================================================
        // COMMERCIAL GUARD
        // =====================================================

        const commercial =
            commercialGuard.evaluate(
                context,
                response
            );

        if (commercial.action !== "ALLOW") {
            return commercial;
        }

        // =====================================================
        // FUTURI GUARD
        //
        // Qui potremo aggiungere:
        //
        // PrivacyGuard
        // GroupGuard
        // SafetyGuard
        // HallucinationGuard
        // PaymentGuard
        //
        // =====================================================

        return {
            action: "ALLOW",
            response: commercial.response,
            reason: commercial.reason || "Risposta autorizzata"
        };
    }


    /**
     * Restituisce direttamente la risposta finale.
     *
     * Utile per CLI e altri adapter che non hanno bisogno
     * di gestire manualmente tutte le azioni.
     */
    apply(context, response) {

        const result =
            this.evaluate(context, response);

        switch (result.action) {

            case "ALLOW":
            case "REPLACE":
                return result.response;

            case "BLOCK":
            case "SILENT":
                return null;

            default:

                console.error(
                    "❌ ResponseGuard: azione sconosciuta:",
                    result.action
                );

                return null;
        }
    }

}

module.exports = new ResponseGuard();
