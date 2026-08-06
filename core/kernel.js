const logger = require("./logger");
const pluginLoader = require("./pluginLoader");
const CognitiveOrchestrator = require("./cognition/CognitiveOrchestrator");
const BootManager = require("./boot/BootManager");
const pluginManager = require("./pluginManager");
const bus = require("./events/EventBus");

const orchestrator = new CognitiveOrchestrator();

logger.debug("Kernel", "Registro listener message.received");

bus.on("event.created", (event) => {
    logger.debug("EventBus", `Evento creato: ${event.type}`);
});

// MESSAGE RECEIVED (INTEGRATED COGNITIVE PIPELINE)
bus.on("message.received", async (context) => {
    try {
        console.log("➡️ TRACE 3: Kernel -> bus.on('message.received') RICEVUTO");
        logger.info("Cognition", `🧠 Avvio ciclo cognitivo [${context.id}]`);
        
        console.log("➡️ TRACE 4: Kernel -> orchestrator.processEvent()");
        context = await orchestrator.processEvent(context);
        logger.info("Cognition", "🧠 Fine ciclo cognitivo");

        console.log("➡️ TRACE KERNEL CHECK:", {
            hasResponse: !!context.response,
            response: context.response,
            responseBlocked: context.responseBlocked,
            skipLLM: context.skipLLM,
            isCognitiveNote: context.isCognitiveNote
        });

        if (context.skipLLM || context.isCognitiveNote) {
            console.log("➡️ TRACE 8-SKIP: Nota Cognitiva appresa. Nessun reply inviato.");
            logger.info("Kernel", "📝 Nota Cognitiva appresa. Nessun messaggio WhatsApp da inviare.");
            return;
        }

        if (!context.response || context.responseBlocked === true) {
            console.log("➡️ TRACE 8-BLOCKED: context.response mancante o bloccato da FactVerifier");
            if (context.responseBlocked) {
                logger.warn("Kernel", `Risposta bloccata da FactVerifier: ${context.responseError}`);
            }
            return;
        }

        console.log("DISPATCH =", context.response);
        console.log("➡️ TRACE 8: Kernel -> bus.emit('message.reply')");
        bus.emit("message.reply", {
            context,
            response: context.response
        });
    } catch (err) {
        logger.error("Kernel", err);
    }
});

// BOOT
async function boot() {

    pluginLoader.loadPlugins();

    logger.info("Kernel", "Kernel avviato");

    const plugins = pluginManager.list();

    logger.info("Kernel", `Plugin caricati: ${plugins.length}`);

    for (const plugin of plugins) {

        logger.info(
            "Kernel",
            `✔ ${plugin.name || plugin.__filename}`
        );

    }

    await BootManager.boot();

    logger.info(
        "Kernel",
        "Kernel pronto."
    );

}

async function start() {
    await boot();
}

module.exports = {
    boot,
    start,
    orchestrator
};
