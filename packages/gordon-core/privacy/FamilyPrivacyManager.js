/**
 * FamilyPrivacyManager.js - Gestore della Riservatezza Familiare e Personale
 * 
 * Regole applicate:
 * 1. VIP / Confidential: visibile ed utilizzabile ESCLUSIVAMENTE nelle chat con il soggetto stesso o con Owner.
 * 2. Spouse: visibile ed utilizzabile ESCLUSIVAMENTE nelle chat con Spouse, Child o Owner.
 */

const PRIVACY_POLICIES = [
    {
        name: "VIP Confidentiality",
        subjectKeywords: ["vip", "dolly"],
        allowedRecipients: ["vip", "dolly", "owner", "me"]
    },
    {
        name: "Family Confidentiality",
        subjectKeywords: ["family", "spouse", "silvana"],
        allowedRecipients: ["spouse", "silvana", "child", "owner", "me"]
    }
];

class FamilyPrivacyManager {
    static resolveRecipientString(metaOrName) {
        if (!metaOrName) return "";
        if (typeof metaOrName === "string") return metaOrName.toLowerCase();

        const candidateList = [
            metaOrName.recipient,
            metaOrName.contactName,
            metaOrName.senderName,
            metaOrName.contact?.name,
            ...(Array.isArray(metaOrName.contact?.aliases) ? metaOrName.contact.aliases : []),
            metaOrName.identity?.displayName,
            metaOrName.identity?.contact?.name,
            ...(Array.isArray(metaOrName.identity?.contact?.aliases) ? metaOrName.identity.contact.aliases : []),
            metaOrName.chat?.name,
            metaOrName.sender,
            metaOrName.chatId
        ].filter(Boolean);

        try {
            const IdentityResolver = require("../identity/IdentityResolver");
            const res = IdentityResolver.resolve(metaOrName);
            if (res && res.displayName && res.displayName !== "Utente") {
                candidateList.push(res.displayName);
            }
            if (res && res.contact && res.contact.name) {
                candidateList.push(res.contact.name);
            }
        } catch (e) {}

        return candidateList.join(" ").toLowerCase();
    }

    static checkPrivacy(text, metaOrName = "") {
        if (!text) return { allowed: true };

        const lowerText = text.toLowerCase();
        const lowerRecipient = FamilyPrivacyManager.resolveRecipientString(metaOrName);

        for (const policy of PRIVACY_POLICIES) {
            const matchesSubject = policy.subjectKeywords.some(kw => lowerText.includes(kw));

            if (matchesSubject) {
                // Se la chat corrente è con la persona stessa (es. parliamo con Dolly di Dolly), è SEMPRE consentito!
                const isSelfRecipient = policy.subjectKeywords.some(kw => lowerRecipient.includes(kw));

                // Controlla se il destinatario effettivo della chat fa parte dei destinatari autorizzati
                const isAllowedRecipient = isSelfRecipient || policy.allowedRecipients.some(allowed => lowerRecipient.includes(allowed));
                
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
