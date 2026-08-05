const fs = require("fs");
const axios = require("axios");
const config = require("./config");
const logger = require("./logger");

async function checkFolders() {

    const folders = [
        "logs",
        "memory",
        "plugins",
        "personality"
    ];

    for (const folder of folders) {

        if (!fs.existsSync(folder)) {

            logger.error(`Cartella mancante: ${folder}`);
            return false;

        }

    }

logger.info(
    "Startup",
    "✔ Cartelle OK"
);
    return true;

}

async function checkOllama() {

    try {

        const r = await axios.get(`${config.ollama.host}/api/tags`);

        if (!r.data.models) {

            logger.error("Ollama non risponde.");

            return false;

        }

logger.info(
    "Startup",
    "✔ Ollama raggiungibile"
);
        return true;

    }

    catch {

        logger.error("Impossibile raggiungere Ollama.");

        return false;

    }

}

async function runChecks() {

    const folders = await checkFolders();

    const ollama = await checkOllama();

    return folders && ollama;

}

module.exports = {

    runChecks

};
