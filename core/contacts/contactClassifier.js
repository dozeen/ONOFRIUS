class ContactClassifier {

    classify(contact) {

        if (!contact) {

            return {
                relationship: "unknown",
                confidence: 0,
                style: "professional",
                reason: ["no_contact"]
            };

        }

        // Contatto configurato manualmente
        if (contact.source === "contacts") {

            return {
                relationship: contact.relationship || "known",
                confidence: 1,
                style: contact.style || {},
                reason: ["manual_configuration"]
            };

        }

        // Contatto presente in rubrica
        if (contact.source === "addressBook") {

            return {
                relationship: "known",
                confidence: 0.60,
                style: "friendly",
                reason: ["address_book"]
            };

        }

        // Numero sconosciuto
        return {

            relationship: "unknown",
            confidence: 0.20,
            style: "professional",
            reason: ["unknown_number"]

        };

    }

}

module.exports = ContactClassifier;
