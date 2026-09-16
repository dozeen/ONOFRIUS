const logger = require("./logger");

const plugins = [];

function list() {
    return plugins;
}

function register(plugin) {
    if (!plugin) return;
    plugin.priority ??= 0;
    plugins.push(plugin);
    plugins.sort((a, b) => b.priority - a.priority);

    logger.info("Plugin", `Plugin caricato: ${plugin.name || 'sconosciuto'} (prio ${plugin.priority})`);
}

async function execute(context) {
    logger.debug("Plugin", `Plugin disponibili: ${plugins.map(p => p.name || 'sconosciuto').join(", ")}`);

    for (const plugin of plugins) {
        if (typeof plugin.canHandle === "function") {
            const can = await plugin.canHandle(context);
            if (!can) continue;
        }

        logger.debug("Plugin", `Esecuzione: ${plugin.name || 'sconosciuto'}`);
        logger.time(plugin.name || "Plugin");

        let result = null;
        try {
            if (typeof plugin.handle === "function") {
                result = await plugin.handle(context);
            } else if (typeof plugin.execute === "function") {
                result = await plugin.execute(context);
            } else if (typeof plugin.process === "function") {
                result = await plugin.process(context);
            } else if (typeof plugin === "function") {
                result = await plugin(context);
            } else {
                logger.warn("Plugin", `⚠️ Il plugin ${plugin.name || 'sconosciuto'} non ha un metodo di gestione valido.`);
                continue;
            }
        } catch (err) {
            logger.error("Plugin", `❌ Errore durante l'esecuzione del plugin ${plugin.name}: ${err.message}`);
            continue;
        } finally {
            logger.timeEnd(plugin.name || "Plugin", "Plugin");
        }

        if (!result) continue;

        if (typeof result === "string") {
            return result;
        }

        if (result.handled) {
            return result.response ?? null;
        }
    }

    logger.debug("Plugin", "Nessun plugin ha gestito il messaggio.");
    return null;
}

async function route(context) {
    return await execute(context);
}

module.exports = {
    register,
    execute,
    route,
    list
};
