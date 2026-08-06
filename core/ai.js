const axios = require("axios");
const config = require("./config");

function getOllamaUrl() {
    let host = (config.ollama && config.ollama.host) ? String(config.ollama.host).trim().replace(/[\r\n]+/g, "") : "http://localhost:11434";
    if (!host.startsWith("http://") && !host.startsWith("https://")) {
        host = `http://${host}`;
    }
    return `${host.replace(/\/+$/, "")}/api/generate`;
}

async function ask(prompt, model = (config.ollama && config.ollama.model) || "qwen2.5:latest") {
    const url = getOllamaUrl();

    try {
        console.log(`🧠 Modello: ${model}`);
        console.log(`📤 Invio richiesta a Ollama (${url})...`);

        const response = await axios.post(
            url,
            {
                model,
                prompt,
                stream: false,
                think: false
            },
            {
                timeout: 300000
            }
        );

        console.log("✅ Ollama ha risposto.");
        if (response.data && response.data.thinking) {
            console.log("🧠 Thinking ricevuto ma ignorato.");
            delete response.data.thinking;
        }

        console.log("");
        console.log("========== RAW OLLAMA ==========");
        console.dir(response.data, { depth: null });
        console.log("================================");
        console.log("");

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

        return text.trim();

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
