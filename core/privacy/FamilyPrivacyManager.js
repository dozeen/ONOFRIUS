/**
 * FamilyPrivacyManager.js - Gestore della Riservatezza Familiare e Personale Astratta
 * 
 * Carica le politiche di privacy in modo dinamico dal profilo owner (config/owner.json).
 */

const fs = require('fs');
const path = require('path');

function getOwnerConfig() {
    const ownerPath = path.resolve(__dirname, '../../config/owner.json');
    if (fs.existsSync(ownerPath)) {
        try {
            return JSON.parse(fs.readFileSync(ownerPath, 'utf8'));
        } catch (e) {}
    }
    return {
        name: "Owner",
        aliases: ["owner", "me"],
        familyMembers: [],
        confidentialSubjects: []
    };
}

class FamilyPrivacyManager {
    static getPolicies() {
        const owner = getOwnerConfig();
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

    static checkPrivacy(text, metaOrName = "") {
        if (!text) return { allowed: true };

        const lowerText = text.toLowerCase();
        const lowerRecipient = FamilyPrivacyManager.resolveRecipientString(metaOrName);
        const policies = FamilyPrivacyManager.getPolicies();

        for (const policy of policies) {
            const matchesSubject = policy.subjectKeywords.some(kw => lowerText.includes(kw));

            if (matchesSubject) {
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
