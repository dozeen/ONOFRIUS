let gordonCore;

try {
    gordonCore = require("gordon-core");
} catch (e1) {
    try {
        gordonCore = require("../../Gordon3/core");
    } catch (e2) {
        try {
            gordonCore = require("../index");
        } catch (e3) {
            console.error("❌ Errore caricamento Gordon Core:", e1.message);
            throw new Error("Impossibile trovare il modulo 'gordon-core' o la cartella '../../Gordon3/core'. Assicurati che Gordon3 sia posizionato a fianco di ONOFRIUS.");
        }
    }
}

const logger = gordonCore.logger;
const bus = gordonCore.EventBus;
const orchestrator = new gordonCore.CognitiveOrchestrator();

logger.info("Kernel", "ONOFRIUS Kernel avviato su Gordon Core Engine");

bus.on("event.created", (event) => {
    logger.debug("EventBus", `Evento creato: ${event.type}`);
});

bus.on("message.received", async (context) => {
    try {
        logger.info("Cognition", `🧠 [ONOFRIUS Kernel] Avvio ciclo cognitivo [${context.id}]`);
        context = await orchestrator.processEvent(context);
        logger.info("Cognition", "🧠 [ONOFRIUS Kernel] Fine ciclo cognitivo");

        if (context.skipLLM || context.isCognitiveNote) {
            logger.info("Kernel", "📝 Nota Cognitiva / Percezione Passiva registrata. Nessun invio.");
            return;
        }

        if (!context.response || context.responseBlocked === true) {
            if (context.responseBlocked) {
                logger.warn("Kernel", `Risposta bloccata da FactVerifier: ${context.responseError}`);
            }
            return;
        }

        bus.emit("message.reply", {
            context,
            response: context.response
        });
    } catch (err) {
        logger.error("Kernel", err);
    }
});

async function boot() {
    logger.info("Kernel", "ONOFRIUS Kernel pronto ed unificato con Gordon Core.");
}

async function start() {
    await boot();
}

module.exports = {
    boot,
    start,
    orchestrator,
    gordonCore
};
