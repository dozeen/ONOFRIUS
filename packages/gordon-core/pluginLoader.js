const fs = require("fs");
const path = require("path");
const pluginManager = require("./pluginManager");
const logger = require("./logger");

function loadPlugins() {

    const pluginsDir = path.join(__dirname, "..", "plugins");

    const folders = fs.readdirSync(pluginsDir);

    for (const folder of folders) {

        const pluginPath = path.join(pluginsDir, folder, "index.js");

        if (!fs.existsSync(pluginPath))
            continue;

        try {

            const plugin = require(pluginPath);
logger.debug(
    "Plugin",
    `Registrazione: ${plugin.name}`
);
            pluginManager.register(plugin);

        } catch (err) {
            logger.error(
                `Errore caricando ${folder}: ${err.message}`
            );

        }

    }

}

module.exports = {

    loadPlugins

};
