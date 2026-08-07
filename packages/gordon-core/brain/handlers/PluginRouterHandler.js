const pluginManager = require("../../pluginManager");

class PluginRouterHandler {
    async process(context) {
        // Se una capability ha già prodotto una risposta o context.response è già valorizzato,
        // non sovrascriviamo con i plugin.
        if (context.capability?.handled) {
            context.response = context.capability.reply;
            return context;
        }

        if (context.response) {
            return context;
        }

        context.response = await pluginManager.route(context);
        return context;
    }
}

module.exports = PluginRouterHandler;
