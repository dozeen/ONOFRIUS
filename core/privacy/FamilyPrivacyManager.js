/**
 * FamilyPrivacyManager.js - Gestore della Riservatezza Familiare e Personale Astratta
 * 
 * Carica le politiche di privacy in modo dinamico dal profilo owner (config/owner.json) e dai contatti.
 */

const OwnerProfile = require('../identity/OwnerProfile');

class FamilyPrivacyManager {
    static getPolicies() {
        const owner = OwnerProfile.get();
        const policies = [];

        const ownerAllowed = [
            "owner",
            "me",
            (owner.name || "").toLowerCase(),
            ...(owner.aliases || []).map(a => a.toLowerCase())
        ].filter(Boolean);

        if (Array.isArray(owner.confidentialSubjects)) {
            for (const subj of owner.confidentialSubjects) {
                if (subj.keywords && subj.keywords.length > 0) {
                    policies.push({
                        name: `${subj.name || subj.keywords[0]} Confidentiality`,
                        subjectKeywords: subj.keywords.map(k => k.toLowerCase()),
                        allowedRecipients: Array.from(new Set([
                            ...ownerAllowed,
                            ...(subj.allowedRecipients || []).map(r => r.toLowerCase())
                        ]))
                    });
                }
            }
        }

        if (Array.isArray(owner.familyMembers)) {
            for (const member of owner.familyMembers) {
                if (member.privacyLevel === "confidential" && member.name) {
                    const memberKeywords = [member.name.toLowerCase(), ...(member.aliases || []).map(a => a.toLowerCase())];
                    policies.push({
                        name: `${member.name} Confidentiality`,
                        subjectKeywords: memberKeywords,
                        allowedRecipients: Array.from(new Set([
                            ...ownerAllowed,
                            ...memberKeywords
                        ]))
                    });
                }
            }
        }

        return policies;
    }

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

        // Prova a rinfrescare l'identità se è presente un ID o un numero di telefono
        try {
            const IdentityResolver = require('../identity/IdentityResolver');
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
        const policies = FamilyPrivacyManager.getPolicies();

        for (const policy of policies) {
            const matchesSubject = policy.subjectKeywords.some(kw => lowerText.includes(kw));

            if (matchesSubject) {
                // Se la chat corrente è con il soggetto stesso (es. parliamo con il soggetto dei suoi dati), è SEMPRE consentito!
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
