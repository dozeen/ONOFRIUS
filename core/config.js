require("dotenv").config();

function getOllamaHost() {
    let rawHost = process.env.OLLAMA_HOST || "http://localhost:11434";
    rawHost = String(rawHost).trim().replace(/[\r\n]+/g, "");
    if (!rawHost.startsWith("http://") && !rawHost.startsWith("https://")) {
        rawHost = `http://${rawHost}`;
    }
    try {
        const urlObj = new URL(rawHost);
        if (!urlObj.port) {
            urlObj.port = "11434";
        }
        return urlObj.toString().replace(/\/+$/, "");
    } catch (e) {
        return "http://localhost:11434";
    }
}

module.exports = {
    ollama: {
        host: getOllamaHost(),
        model: (process.env.OLLAMA_MODEL || "qwen2.5:latest").trim().replace(/[\r\n]+/g, "")
    },
    logLevel: process.env.LOG_LEVEL || "INFO",
    whatsapp: {
        clientId: process.env.WHATSAPP_CLIENT_ID || "onofrius"
    },
    memoryPath: process.env.MEMORY_PATH || "./memory",
    debug: process.env.DEBUG === "true"
};
