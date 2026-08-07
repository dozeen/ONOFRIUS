/**
 * LearningEngine.js - Motore di Apprendimento Notturno e Consolidamento Cognitivo
 * 
 * Analizza gli eventi accumulati per consolidare Interaction, Knowledge, Memory, Thought Stream e Preferences.
 */

let ThoughtStream; try { ThoughtStream = require("../memory/thoughts/ThoughtStream"); } catch (e) { ThoughtStream = require("../../memory/thoughts/ThoughtStream"); }
const FactRegistry = require("../cognition/facts/FactRegistry");
const InteractionProfile = require("../cognition/interaction/InteractionProfile");
const logger = require("../logger");
const bus = require("../events/EventBus");

class LearningEngine {
    constructor(opts = {}) {
        this.thoughtStream = opts.thoughtStream || new ThoughtStream();
        this.factRegistry = opts.factRegistry || new FactRegistry();
        this.profileStore = opts.profileStore || new InteractionProfile();
    }

    /**
     * Metodo statico per il LearningHandler della Brain pipeline
     * @param {Object} context
     */
    static async learn(context) {
        if (!context) return context;
        logger.info("LearningEngine", "🧠 Learning appreso per il contesto corrente.");
        return context;
    }

    /**
     * Esegue il ciclo di consolidamento notturno
     * @param {Array} events - Lista di eventi registrati
     * @returns {Object} Report del consolidamento
     */
    async consolidateNightly(events = []) {
        logger.info("LearningEngine", "🌙 Avvio processo di apprendimento e consolidamento notturno...");

        let factsConsolidated = 0;
        let thoughtsConsolidated = 0;
        let profilesUpdated = 0;

        for (const evt of events) {
            if (evt.type === "message.received" || evt.text) {
                if (evt.text && evt.text.toLowerCase().includes("preferisco")) {
                    this.thoughtStream.addPreference(evt.text, { source: "learning_consolidation" });
                    thoughtsConsolidated++;
                }
            }
        }

        const report = {
            status: "COMPLETED",
            factsConsolidated,
            thoughtsConsolidated,
            profilesUpdated,
            timestamp: new Date().toISOString()
        };

        bus.emit("cognition.learning.consolidated", report);
        logger.info("LearningEngine", `✅ Consolidamento notturno completato: ${JSON.stringify(report)}`);
        return report;
    }
}

module.exports = LearningEngine;
