require("dotenv").config();

module.exports = {

    ollama: {

        host: process.env.OLLAMA_HOST,
        model: process.env.OLLAMA_MODEL

    },

    logLevel: process.env.LOG_LEVEL,

    whatsapp: {

        clientId: process.env.WHATSAPP_CLIENT_ID

    },

    memoryPath: process.env.MEMORY_PATH,

    debug: process.env.DEBUG === "true"

};
