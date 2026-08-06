require("dotenv").config();

module.exports = {

    ollama: {

        host: process.env.OLLAMA_HOST || "http://localhost:11434",
        model: process.env.OLLAMA_MODEL || "qwen2.5:latest"

    },

    logLevel: process.env.LOG_LEVEL || "INFO",

    whatsapp: {

        clientId: process.env.WHATSAPP_CLIENT_ID || "gordon3"

    },

    memoryPath: process.env.MEMORY_PATH || "./memory",

    debug: process.env.DEBUG === "true"

};
