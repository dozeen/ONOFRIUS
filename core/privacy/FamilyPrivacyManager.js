/**
 * FamilyPrivacyManager.js - Gestore della Riservatezza Familiare e Personale
 * 
 * Regole applicate:
 * 1. Dolly: visibile ed utilizzabile ESCLUSIVAMENTE nelle chat con Dolly o Onofrio.
 * 2. Silvana Inglese (Moglie): visibile ed utilizzabile ESCLUSIVAMENTE nelle chat con Silvana Inglese, Roberta Cannone (Figlia) o Onofrio.
 */

const PRIVACY_POLICIES = [
    {
        name: "Dolly Confidentiality",
        subjectKeywords: ["dolly"],
        allowedRecipients: ["dolly", "onofrio", "me", "217535983173871"]
    },
    {
        name: "Silvana Inglese Confidentiality",
        subjectKeywords: ["silvana", "silvana inglese"],
        allowedRecipients: ["silvana", "silvana inglese", "roberta", "roberta cannone", "onofrio", "me"]
    }
];

class FamilyPrivacyManager {
    /**
     * Risolve tutte le possibili rappresentazioni del destinatario dal contesto
     */
    static resolveRecipientString(metaOrName) {
        if (!metaOrName) return "";
        if (typeof metaOrName === "string") return metaOrName.toLowerCase();

        const candidates = [
            metaOrName.recipient,
            metaOrName.contactName,
            metaOrName.senderName,
            metaOrName.contact?.name,
            metaOrName.identity?.contact?.name,
            metaOrName.chat?.name,
            metaOrName.sender,
            metaOrName.chatId
        ].filter(Boolean).join(" ").toLowerCase();

        return candidates;
    }

    /**
     * Verifica se una frase o risposta rispetta le politiche di riservatezza familiare in base al destinatario reale
     * @param {string} text - Testo da analizzare
     * @param {string|Object} metaOrName - Nome del destinatario o oggetto di contesto
     * @returns {Object} { allowed: boolean, violation?: Object }
     */
    static checkPrivacy(text, metaOrName = "") {
        if (!text) return { allowed: true };

        const lowerText = text.toLowerCase();
        const lowerRecipient = FamilyPrivacyManager.resolveRecipientString(metaOrName);

        for (const policy of PRIVACY_POLICIES) {
            const matchesSubject = policy.subjectKeywords.some(kw => lowerText.includes(kw));

            if (matchesSubject) {
                // Controlla se il destinatario effettivo della chat fa parte dei destinatari autorizzati
                const isAllowedRecipient = policy.allowedRecipients.some(allowed => lowerRecipient.includes(allowed));
                
                if (!isAllowedRecipient) {
                    return {
                        allowed: false,
                        violation: {
                            policy: policy.name,
                            subject: policy.subjectKeywords[0],
                            recipient: lowerRecipient,
                            message: `Violazione di Riservatezza: Informazioni su '${policy.subjectKeywords[0]}' non possono essere condivise nella chat con '${lowerRecipient || "sconosciuto"}'`
                        }
                    };
                }
            }
        }

        return { allowed: true };
    }

    /**
     * Filtra una lista di elementi (fatti, pensieri, intenzioni) consentendo solo quelli ammessi per il destinatario della chat
     * @param {Array} items
     * @param {string|Object} metaOrName
     * @returns {Array} Array di elementi consentiti
     */
    static filterAllowed(items, metaOrName = "") {
        if (!items || !Array.isArray(items)) return [];
        return items.filter(item => {
            const textStr = typeof item === "string" ? item : (item.content || item.statement || JSON.stringify(item));
            const result = FamilyPrivacyManager.checkPrivacy(textStr, metaOrName);
            return result.allowed;
        });
    }
}

module.exports = FamilyPrivacyManager;
