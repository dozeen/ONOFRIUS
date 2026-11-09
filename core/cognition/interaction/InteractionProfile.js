/**
 * InteractionProfile.js - Gestione dei profili di interazione sociali e relazionali
 */

const fs = require("fs");
const path = require("path");

class InteractionProfile {
    constructor(storagePath) {
        this.storagePath = storagePath || path.join(__dirname, "../../../memory/style/profiles.json");
        this.profiles = {};
        this._load();
    }

    _load() {
        try {
            const dir = path.dirname(this.storagePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (fs.existsSync(this.storagePath)) {
                this.profiles = JSON.parse(fs.readFileSync(this.storagePath, "utf8"));
            } else {
                this.profiles = {};
            }
        } catch (err) {
            console.error("⚠️ [InteractionProfile] Errore lettura profili:", err.message);
            this.profiles = {};
        }
    }

    _save() {
        try {
            fs.writeFileSync(this.storagePath, JSON.stringify(this.profiles, null, 2), "utf8");
        } catch (err) {
            console.error("❌ [InteractionProfile] Errore salvataggio profili:", err.message);
        }
    }

    /**
     * Ottiene o crea il profilo per un determinato contatto/interlocutore
     * @param {string} contactId
     * @param {Object} [defaults={}]
     */
    getProfile(contactId, defaults = {}) {
        if (!contactId) contactId = "default";

        if (!this.profiles[contactId]) {
            this.profiles[contactId] = {
                contactId: contactId,
                role: defaults.role || "unknown", // client, friend, family, owner, unknown
                formality: defaults.formality ?? 0.5, // 0.0 (informale) -> 1.0 (formale)
                emojiUsage: defaults.emojiUsage ?? 0.3, // 0.0 (nessuna) -> 1.0 (frequenti)
                irony: defaults.irony ?? 0.2, // 0.0 (serio) -> 1.0 (ironico)
                affection: defaults.affection ?? 0.3, // 0.0 (professionale) -> 1.0 (affettuoso)
                messageLength: defaults.messageLength || "concise", // concise, medium, detailed
                updatedAt: new Date().toISOString()
            };
            this._save();
        }

        return this.profiles[contactId];
    }

    /**
     * Aggiorna il profilo di un contatto
     */
    updateProfile(contactId, updates = {}) {
        const current = this.getProfile(contactId);
        this.profiles[contactId] = {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        this._save();
        return this.profiles[contactId];
    }
}

module.exports = InteractionProfile;
