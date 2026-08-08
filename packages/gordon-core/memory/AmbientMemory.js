/**
 * AmbientMemory.js - Salva i Fenomeni Sociali e gli Eventi Ambientali (Non frasi grezze)
 */

const fs = require("fs");
const path = require("path");

class AmbientMemory {
    constructor() {
        this.filePath = path.resolve(__dirname, "../memory/social/ambientEvents.json");
        this.events = [];
        this.load();
    }

    load() {
        try {
            if (fs.existsSync(this.filePath)) {
                this.events = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
            }
        } catch (e) {
            console.error("⚠️ Errore caricamento ambientEvents.json:", e.message);
        }
    }

    save() {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(this.filePath, JSON.stringify(this.events, null, 2), "utf8");
        } catch (e) {
            console.error("⚠️ Errore salvataggio ambientEvents.json:", e.message);
        }
    }

    /**
     * Registra un nuovo fenomeno o evento sociale in memoria ambientale
     */
    addPhenomenon(phenomenon) {
        if (!phenomenon || !phenomenon.title) return;

        const entry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            title: phenomenon.title,
            confidence: phenomenon.confidence || 0.80,
            category: phenomenon.category || "social_phenomenon",
            summary: phenomenon.summary || ""
        };

        // Evita duplicati recenti
        const exists = this.events.find(e => e.title === entry.title);
        if (!exists) {
            this.events.unshift(entry);
            if (this.events.length > 50) this.events.pop();
            this.save();
            console.log(`🌌 [AmbientMemory] Registrato fenomeno sociale: "${entry.title}" (Confidence: ${entry.confidence})`);
        }
    }

    getRecentPhenomena() {
        return this.events.slice(0, 10);
    }
}

module.exports = new AmbientMemory();
