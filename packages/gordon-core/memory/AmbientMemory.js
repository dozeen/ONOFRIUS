/**
 * AmbientMemory.js - Conserva le Narrazioni Sociali nel tempo (Tier 3: Ambient Memory)
 * Decadimento naturale (confidence *= 0.99/giorno) ed archiviazione dopo 90 giorni di inattività.
 */

const fs = require("fs");
const path = require("path");

class AmbientMemory {
    constructor() {
        this.filePath = path.resolve(__dirname, "../memory/social/ambientNarratives.json");
        this.archivePath = path.resolve(__dirname, "../memory/social/ambientArchive.json");
        this.narratives = [];
        this.archive = [];
        this.load();
    }

    load() {
        try {
            if (fs.existsSync(this.filePath)) {
                this.narratives = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
            }
            if (fs.existsSync(this.archivePath)) {
                this.archive = JSON.parse(fs.readFileSync(this.archivePath, "utf8"));
            }
        } catch (e) {
            console.error("⚠️ Errore caricamento ambientNarratives.json:", e.message);
        }
    }

    save() {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(this.filePath, JSON.stringify(this.narratives, null, 2), "utf8");
            fs.writeFileSync(this.archivePath, JSON.stringify(this.archive, null, 2), "utf8");
        } catch (e) {
            console.error("⚠️ Errore salvataggio ambientNarratives.json:", e.message);
        }
    }

    /**
     * Aggiunge o aggiorna una narrazione sociale sostenuta nel tempo
     */
    addNarrative(narrativeText, initialConfidence = 0.85) {
        if (!narrativeText) return;

        const now = Date.now();
        const existing = this.narratives.find(n => n.narrative === narrativeText);

        if (existing) {
            existing.lastUpdated = now;
            existing.confidence = Math.min(1.0, existing.confidence + 0.05);
        } else {
            this.narratives.unshift({
                id: now.toString(),
                startDate: now,
                lastUpdated: now,
                narrative: narrativeText,
                confidence: initialConfidence
            });
        }
        this.save();
        console.log(`🌌 [AmbientMemory] Narrazione aggiornata: "${narrativeText}" (Confidence: ${initialConfidence})`);
    }

    /**
     * Esegue il Decadimento Naturale quotidiano (0.99/giorno) ed l'archiviazione (90 giorni)
     */
    applyDailyDecay() {
        const now = Date.now();
        const NinetyDaysMs = 90 * 24 * 60 * 60 * 1000;
        const activeNarratives = [];

        for (const n of this.narratives) {
            // Decadimento naturale della confidenza
            n.confidence = parseFloat((n.confidence * 0.99).toFixed(3));

            const daysSilent = (now - n.lastUpdated) / (24 * 60 * 60 * 1000);

            if (daysSilent >= 90 || n.confidence < 0.20) {
                // Archiviazione narrazione dopo 90 giorni di inattività
                n.archivedAt = now;
                this.archive.unshift(n);
                console.log(`📦 [AmbientMemory] Archiviata narrazione per inattività (90+ giorni): "${n.narrative}"`);
            } else {
                activeNarratives.push(n);
            }
        }

        this.narratives = activeNarratives;
        this.save();
    }

    getNarratives() {
        return this.narratives;
    }
}

module.exports = new AmbientMemory();
