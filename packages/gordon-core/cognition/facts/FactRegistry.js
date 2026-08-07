/**
 * FactRegistry.js - Registro ed indicizzazione dei fatti empirici di Gordon 3
 * Integrate con KnowledgeFusionEngine (Confidence Dinamica) e MemoryDecayEngine (Decadimento Temporale).
 */

const fs = require("fs");
const path = require("path");
const KnowledgeFusionEngine = require("./KnowledgeFusionEngine");
const MemoryDecayEngine = require("./MemoryDecayEngine");

class FactRegistry {
    constructor(storagePath) {
        this.storagePath = storagePath || path.join(__dirname, "../../../memory/knowledge/facts.json");
        this.fusionEngine = new KnowledgeFusionEngine();
        this.decayEngine = new MemoryDecayEngine();
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
     * Registra o fonde un fatto confermato
     */
    register(factItem) {
        if (!factItem || !factItem.statement) return null;

        const { merged, fact } = this.fusionEngine.fuse(this.facts, factItem);

        if (!merged) {
            fact.id = fact.id || `fact_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            this.facts.push(fact);
        }

        this._save();
        return fact;
    }

    /**
     * Cerca fatti attivi per entità o parola chiave con decadimento temporale applicato
     */
    search(query) {
        const activeFacts = this.decayEngine.processFacts(this.facts);
        if (!query) return activeFacts;
        const q = query.toLowerCase();
        return activeFacts.filter(f =>
            f.statement.toLowerCase().includes(q) ||
            (f.entities && f.entities.some(e => String(e.value || e).toLowerCase().includes(q)))
        );
    }

    /**
     * Restituisce tutti i fatti recenti attivi
     */
    getRecent(limit = 20) {
        const activeFacts = this.decayEngine.processFacts(this.facts);
        return activeFacts.slice(-limit);
    }
}

module.exports = FactRegistry;
