const logger = require("./logger");

const plugins = [];
function list() {

    return plugins;

}
function register(plugin) {

    plugin.priority ??= 0;

    plugins.push(plugin);

    plugins.sort((a, b) => b.priority - a.priority);

logger.info(
    "Plugin",
    `Plugin caricato: ${plugin.name} (prio ${plugin.priority})`
);
}

async function execute(context) {

logger.debug(
    "Plugin",
    `Plugin disponibili: ${plugins.map(p => p.name).join(", ")}`
);
    for (const plugin of plugins) {

        if (!(await plugin.canHandle(context)))
            continue;

logger.debug(
    "Plugin",
    `Esecuzione: ${plugin.name}`
);

logger.time(plugin.name);

const result = await plugin.handle(context);

logger.timeEnd(plugin.name, "Plugin");
        if (!result)
            continue;

        if (typeof result === "string") {

            return result;

        }

        if (result.handled) {

            return result.response ?? null;

        }

    }

logger.debug(
    "Plugin",
    "Nessun plugin ha gestito il messaggio."
);
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
