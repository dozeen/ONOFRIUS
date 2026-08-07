/**
 * StatusHandler.js - Gestore della Percezione Passiva degli Status Broadcast
 * Trasforma gli status WhatsApp in eventi del mondo (WORLD_EVENT) per la cognizione di Gordon.
 */

const FactExtractor = require("../../cognition/facts/FactExtractor");
const FactRegistry = require("../../cognition/facts/FactRegistry");
const bus = require("../../events/EventBus");
const logger = require("../../logger");

class StatusHandler {
    constructor(opts = {}) {
        this.factExtractor = opts.factExtractor || new FactExtractor();
        this.factRegistry = opts.factRegistry || new FactRegistry();
    }

    async process(context) {
        if (!context.isStatus && !context.isPassivePerception) {
            return context;
        }

        console.log("\n👁 STATUS BROADCAST DETECTED (Percezione Passiva)");
        console.log("-----------------------------------------------");

        const text = context.text || context.message || "";
        const author = context.contactName || context.senderName || context.author || context.sender || "Contatto";

        logger.info("StatusHandler", `👁 Processing status update from [${author}]: "${text}"`);

        // Estrazione fatti e informazioni osservate
        const extracted = this.factExtractor.extract(text, {
            timestamp: context.timestamp || Date.now(),
            source: `WhatsApp Status (${author})`
        });

        // Crea Evento del Mondo (WORLD_EVENT)
        const worldEvent = {
            id: `world_event_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: "WORLD_EVENT",
            source: "WhatsApp Status",
            author: author,
            sender: context.sender || context.author,
            factObserved: text,
            confidence: "media",
            confidenceScore: 0.70,
            extractedFacts: extracted.facts || [],
            extractedEntities: extracted.entities || [],
            timestamp: context.timestamp || Date.now()
        };

        context.worldEvent = worldEvent;

        // Registra i fatti estratti nel FactRegistry
        if (extracted.facts && extracted.facts.length > 0) {
            for (const fact of extracted.facts) {
                fact.confidence = 0.70;
                fact.source = `Status di ${author}`;
                this.factRegistry.register(fact);
            }
        }

        // Emetti l'evento sul bus per la memoria a lungo termine / Event System
        bus.emit("world.event.created", worldEvent);

        // NESSUNA RISPOSTA WHATSAPP
        context.skipLLM = true;
        context.isCognitiveNote = true;
        context.response = undefined;

        console.log(`✅ WORLD_EVENT creato da Status [${author}]: "${text.slice(0, 50)}..."`);
        console.log("-----------------------------------------------\n");

        return context;
    }
}

module.exports = StatusHandler;
