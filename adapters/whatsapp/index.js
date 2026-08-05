const createClient = require("./client");
const registerEvents = require("./events");
const registerReplyHandler = require("./replyHandler");

const client = createClient();

registerEvents(client);
registerReplyHandler(client);

async function start() {
    await client.initialize();
}

module.exports = {
    client,
    start
};
