const pluginManager =
    require("../../pluginManager");
class PluginRouterHandler {

    async process(context) {

        // Se una capability ha già prodotto una risposta,
        // non chiamiamo i plugin.

        if (context.capability?.handled) {

            context.response =
                context.capability.reply;

            return context;

        }

        // Fallback identico al kernel del 28 luglio

context.response =
    await pluginManager.route(context);

        return context;

    }

}

module.exports = PluginRouterHandler;
