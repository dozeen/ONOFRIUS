/**
 * FactRegistry.js - Registro ed indicizzazione dei fatti empirici di Gordon 3
 */

const fs = require("fs");
const path = require("path");

class FactRegistry {
    constructor(storagePath) {
        this.storagePath = storagePath || path.join(__dirname, "../../../memory/knowledge/facts.json");
        this.facts = [];
        this._load();
    }

    _load() {
        try {
            const dir = path.dirname(this.storagePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (fs.existsSync(this.storagePath)) {
                const data = fs.readFileSync(this.storagePath, "utf8");
                this.facts = JSON.parse(data);
            } else {
                this.facts = [];
            }
        } catch (err) {
            console.error("⚠️ [FactRegistry] Errore durante il caricamento fatti:", err.message);
            this.facts = [];
        }
    }

    _save() {
        try {
            fs.writeFileSync(this.storagePath, JSON.stringify(this.facts, null, 2), "utf8");
        } catch (err) {
            console.error("❌ [FactRegistry] Errore durante il salvataggio fatti:", err.message);
        }
    }

    /**
     * Registra un nuovo fatto confermato
     * @param {Object} factItem - Fatto da registrare
     */
    register(factItem) {
        if (!factItem || !factItem.statement) return null;

        const record = {
            id: `fact_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            statement: factItem.statement,
            entities: factItem.entities || [],
            source: factItem.source || "system",
            timestamp: factItem.extracted_at || new Date().toISOString()
        };

        this.facts.push(record);
        this._save();
        return record;
    }

    /**
     * Cerca fatti per entità o parola chiave
     * @param {string} query
     * @returns {Array} List of matching facts
     */
    search(query) {
        if (!query) return this.facts;
        const q = query.toLowerCase();
        return this.facts.filter(f =>
            f.statement.toLowerCase().includes(q) ||
            f.entities.some(e => String(e.value).toLowerCase().includes(q))
        );
    }

    /**
     * Restituisce tutti i fatti recenti
     * @param {number} [limit=20]
     */
    getRecent(limit = 20) {
        return this.facts.slice(-limit);
    }
}

module.exports = FactRegistry;
