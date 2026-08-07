/**
 * ThoughtStream.js - Gestione del Mondo Interiore di Gordon 3
 * Supporta il ciclo di vita delle intenzioni (ACTIVE, COMPLETED, CANCELLED, ARCHIVED).
 */

const fs = require("fs");
const path = require("path");

class ThoughtStream {
    constructor(baseDir) {
        this.baseDir = baseDir || path.join(__dirname, "../");
        this.paths = {
            thoughts: path.join(this.baseDir, "thoughts/thoughts.json"),
            intentions: path.join(this.baseDir, "intentions/intentions.json"),
            preferences: path.join(this.baseDir, "preferences/preferences.json"),
            notes: path.join(this.baseDir, "notes/notes.json"),
            goals: path.join(this.baseDir, "goals/goals.json")
        };
        this._ensureDirectories();
    }

    _ensureDirectories() {
        for (const p of Object.values(this.paths)) {
            const dir = path.dirname(p);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
    }

    _readJson(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, "utf8"));
            }
        } catch (err) {
            console.error(`⚠️ [ThoughtStream] Errore lettura ${filePath}:`, err.message);
        }
        return [];
    }

    _writeJson(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
        } catch (err) {
            console.error(`❌ [ThoughtStream] Errore scrittura ${filePath}:`, err.message);
        }
    }

    /**
     * Registra una nuova intenzione nello stato ACTIVE
     */
    addIntention(content, meta = {}) {
        const items = this._readJson(this.paths.intentions);
        const entry = {
            id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            content: content,
            status: "ACTIVE", // ACTIVE | COMPLETED | CANCELLED | ARCHIVED
            meta: meta,
            timestamp: new Date().toISOString()
        };
        items.push(entry);
        this._writeJson(this.paths.intentions, items);
        return entry;
    }

    /**
     * Aggiorna lo stato di un'intenzione (ACTIVE -> COMPLETED / CANCELLED / ARCHIVED)
     */
    updateIntentionStatus(idOrContent, newStatus) {
        const validStatuses = ["ACTIVE", "COMPLETED", "CANCELLED", "ARCHIVED"];
        if (!validStatuses.includes(newStatus)) return false;

        const items = this._readJson(this.paths.intentions);
        let updated = false;

        for (const item of items) {
            if (item.id === idOrContent || item.content === idOrContent || (typeof item.content === "string" && item.content.includes(idOrContent))) {
                item.status = newStatus;
                item.updatedAt = new Date().toISOString();
                updated = true;
            }
        }

        if (updated) {
            this._writeJson(this.paths.intentions, items);
            console.log(`🎯 INTENTION UPDATED: [${idOrContent}] -> ${newStatus}`);
        }

        return updated;
    }

    completeIntention(idOrContent) {
        return this.updateIntentionStatus(idOrContent, "COMPLETED");
    }

    cancelIntention(idOrContent) {
        return this.updateIntentionStatus(idOrContent, "CANCELLED");
    }

    archiveIntention(idOrContent) {
        return this.updateIntentionStatus(idOrContent, "ARCHIVED");
    }

    addPreference(content, meta = {}) {
        const items = this._readJson(this.paths.preferences);
        const entry = {
            id: `pref_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            content: content,
            meta: meta,
            timestamp: new Date().toISOString()
        };
        items.push(entry);
        this._writeJson(this.paths.preferences, items);
        return entry;
    }

    addThought(content, category = "thought", meta = {}) {
        const items = this._readJson(this.paths.thoughts);
        const entry = {
            id: `th_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: category,
            content: content,
            meta: meta,
            timestamp: new Date().toISOString()
        };
        items.push(entry);
        this._writeJson(this.paths.thoughts, items);
        return entry;
    }

    getInnerWorld() {
        const allIntentions = this._readJson(this.paths.intentions);
        const activeIntentions = allIntentions.filter(i => !i.status || i.status === "ACTIVE");

        return {
            thoughts: this._readJson(this.paths.thoughts),
            intentions: activeIntentions,
            allIntentions: allIntentions,
            preferences: this._readJson(this.paths.preferences),
            notes: this._readJson(this.paths.notes),
            goals: this._readJson(this.paths.goals)
        };
    }
}

module.exports = ThoughtStream;
