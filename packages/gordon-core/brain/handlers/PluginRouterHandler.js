const pluginManager = require("../../pluginManager");

class PluginRouterHandler {
    async process(context) {
        // nei gruppi WhatsApp Gordon deve rimanere in ascolto (listen only) e non attivare plugin di auto-risposta
        if (context.isGroup) {
            return context;
        }

        // Se una capability ha già prodotto una risposta o context.response è già valorizzato,
        // non sovrascriviamo con i plugin.
        if (context.capability?.handled) {
            context.response = context.capability.reply || context.capability.response || context.response;
            if (context.capability.sendMediaFilePath) {
                context.sendMediaFilePath = context.capability.sendMediaFilePath;
            }
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
