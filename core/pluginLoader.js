const fs = require("fs");
const path = require("path");
const pluginManager = require("./pluginManager");
const logger = require("./logger");

function loadPlugins() {
    let pluginsDir = path.join(__dirname, "..", "plugins");
    if (!fs.existsSync(pluginsDir)) {
        pluginsDir = path.join(__dirname, "..", "..", "plugins");
    }

    if (!fs.existsSync(pluginsDir)) {
        logger.warn("Plugin", `Directory plugin non trovata: ${pluginsDir}`);
        return;
    }

    const folders = fs.readdirSync(pluginsDir);

    for (const folder of folders) {
        const pluginPath = path.join(pluginsDir, folder, "index.js");

        if (!fs.existsSync(pluginPath))
            continue;

        try {
            const plugin = require(pluginPath);
            logger.debug("Plugin", `Registrazione: ${plugin.name}`);
            pluginManager.register(plugin);
        } catch (err) {
            logger.error(`Errore caricando ${folder}: ${err.message}`);
        }
    }
}

module.exports = {
    loadPlugins
};
