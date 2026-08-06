const axios = require("axios");
const config = require("./config");

function getOllamaUrl() {
    let host = (config.ollama && config.ollama.host) ? String(config.ollama.host).trim().replace(/[\r\n]+/g, "") : "http://localhost:11434";
    if (!host.startsWith("http://") && !host.startsWith("https://")) {
        host = `http://${host}`;
    }
    try {
        const urlObj = new URL(host);
        if (!urlObj.port) {
            urlObj.port = "11434";
        }
        host = urlObj.toString().replace(/\/+$/, "");
    } catch (e) {}

    return `${host}/api/generate`;
}

async function ask(prompt, model = (config.ollama && config.ollama.model) || "qwen2.5:latest") {
    const host = (config.ollama && config.ollama.host) || "http://localhost:11434";
    const url = getOllamaUrl();
    const promptStr = String(prompt || "");

    try {
        console.log(`🧠 Modello: ${model}`);
        console.log(`HOST = ${host}`);
        console.log(`URL  = ${url}`);
        console.log(`MODEL = ${model}`);
        console.log(`PROMPT LENGTH = ${promptStr.length}`);
        console.log(`PROMPT SLICE = ${JSON.stringify(promptStr.slice(0, 300))}`);
        console.log(`📤 Invio richiesta a Ollama (${url})...`);

        const response = await axios.post(
            url,
            {
                model,
                prompt: promptStr,
                stream: false,
                think: false
            },
            {
                timeout: 300000
            }
        );

        console.log(`OLLAMA STATUS = ${response.status}`);
        if (response.data && response.data.thinking) {
            console.log("🧠 Thinking ricevuto ma ignorato.");
            delete response.data.thinking;
        }

        let text = "";

        if (response.data) {
            if (typeof response.data.response === "string") {
                text = response.data.response;
            } else if (response.data.message && typeof response.data.message.content === "string") {
                text = response.data.message.content;
            } else if (typeof response.data.content === "string") {
                text = response.data.content;
            } else if (typeof response.data.output === "string") {
                text = response.data.output;
            }
        }

        text = text.trim();
        console.log(`OLLAMA RESPONSE = ${text}`);
        console.log("✅ Ollama ha risposto con successo.\n");

        return text;

    } catch (err) {
        console.error("❌ Errore Ollama:");

        if (err.response) {
            console.dir(err.response.data, { depth: null });
        } else {
            console.error(err.message);
        }

        return null;
    }
}

module.exports = {
    ask
};
