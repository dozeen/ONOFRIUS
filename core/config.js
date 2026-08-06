require("dotenv").config();

function getOllamaHost() {
    let rawHost = process.env.OLLAMA_HOST || "http://localhost:11434";
    rawHost = String(rawHost).trim().replace(/[\r\n]+/g, "");
    if (!rawHost.startsWith("http://") && !rawHost.startsWith("https://")) {
        rawHost = `http://${rawHost}`;
    }
    return rawHost.replace(/\/+$/, "");
}

module.exports = {
    ollama: {
        host: getOllamaHost(),
        model: (process.env.OLLAMA_MODEL || "qwen2.5:latest").trim().replace(/[\r\n]+/g, "")
    },
    logLevel: process.env.LOG_LEVEL || "INFO",
    whatsapp: {
        clientId: process.env.WHATSAPP_CLIENT_ID || "gordon3"
    },
    memoryPath: process.env.MEMORY_PATH || "./memory",
    debug: process.env.DEBUG === "true"
};
