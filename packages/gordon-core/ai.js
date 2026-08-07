const axios = require("axios");
const config = require("./config");

const OLLAMA_URL = `${config.ollama.host}/api/generate`;
const DEFAULT_MODEL = config.ollama.model;

async function ask(prompt, model = DEFAULT_MODEL) {

    try {

        console.log(`🧠 Modello: ${model}`);
        console.log("📤 Invio richiesta a Ollama...");

        const response = await axios.post(
    OLLAMA_URL,
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
if (response.data.thinking) {

    console.log(
        "🧠 Thinking ricevuto ma ignorato."
    );

    delete response.data.thinking;

}
        console.log("");
        console.log("========== RAW OLLAMA ==========");
        console.dir(response.data, { depth: null });
        console.log("================================");
        console.log("");

        // Compatibilità con diverse versioni di Ollama
        let text = "";

        if (typeof response.data.response === "string") {
            text = response.data.response;
        }
        else if (
            response.data.message &&
            typeof response.data.message.content === "string"
        ) {
            text = response.data.message.content;
        }
        else if (typeof response.data.content === "string") {
            text = response.data.content;
        }
        else if (typeof response.data.output === "string") {
            text = response.data.output;
        }

        return text.trim();

    }
    catch (err) {

        console.error("❌ Errore Ollama:");

        if (err.response) {
            console.dir(err.response.data, { depth: null });
        }
        else {
            console.error(err.message);
        }

        return null;

    }

}

module.exports = {
    ask
};
