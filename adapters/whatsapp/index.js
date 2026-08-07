const createClient = require("./client");
const registerEvents = require("./events");
const registerReplyHandler = require("./replyHandler");
const fs = require("fs");
const path = require("path");

let client = null;
let isReady = false;
let isAuthenticated = false;
let readyPromise = null;
let resolveReady = null;

function getClient() {
    if (!client) {
        client = createClient();
        registerEvents(client);
        registerReplyHandler(client);

        readyPromise = new Promise((resolve) => {
            resolveReady = resolve;
        });

        client.on("authenticated", () => {
            isAuthenticated = true;
        });

        client.on("ready", () => {
            isReady = true;
            if (resolveReady) resolveReady();
        });
    }
    return client;
}

async function start() {
    const c = getClient();
    try {
        await c.initialize();
    } catch (err) {
        console.error("⚠️ WhatsApp client init error:", err.message);
        if (err.message.includes("Execution context was destroyed") || err.message.includes("Protocol error")) {
            console.log("🧹 Session Cache corrotta rilevata. Bonifica della sessione...");
            const authDir = path.resolve(__dirname, "../../.wwebjs_auth");
            if (fs.existsSync(authDir)) {
                try {
                    fs.rmSync(authDir, { recursive: true, force: true });
                    console.log("✅ Session Cache rimossa. Riavvio client...");
                } catch (rmErr) {
                    console.error("Errore rimozione cache:", rmErr.message);
                }
            }
            client = null;
            const newC = getClient();
            await newC.initialize();
        } else {
            throw err;
        }
    }
}

async function waitForReady() {
    if (isReady) return true;
    if (readyPromise) {
        await readyPromise;
    }
    return true;
}

module.exports = {
    get client() { return getClient(); },
    start,
    waitForReady
};
