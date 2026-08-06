const createClient = require("./client");
const registerEvents = require("./events");
const registerReplyHandler = require("./replyHandler");

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
    await c.initialize();
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
