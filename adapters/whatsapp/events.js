const {
    EventBuilder,
    EventBus
} = require("../../core/events");

const EventStore =
    require("../../core/events/EventStore").instance;
const { handle } = require("./messageHandler");
const { isSelfChat } = require("./selfChat");
const { validate } = require("./messageValidator");
const logger = require("./logger");

function registerEvents(client) {

    /*
     * Messaggi ricevuti normalmente.
     */
client.on("message_create", async msg => {

    console.log("✉️ CREATE", msg.from, "fromMe:", msg.fromMe);

    const personalChat = isSelfChat(msg);

    console.log("1️⃣ PersonalChat =", personalChat);

    if (msg.fromMe && personalChat) {

        console.log("⏸ Chat personale temporaneamente disabilitata");
        return;

    }

    console.log("2️⃣ validate =", validate(msg));

    if (!validate(msg)) {
        console.log("❌ BLOCCATO da validate");
        return;
    }

    console.log("3️⃣ Chiamo handle()");

const event = EventBuilder.fromWhatsApp(msg);

EventStore.add(event);
console.log(
    "🟢 EVENT",
    event.id,
    event.kind,
    event.actor
);

EventBus.emit("message.received", event);
    console.log("4️⃣ Handle terminato");

});


    client.on("qr", () => {

        logger.event("📱 QR CODE");

    });

    client.on("loading_screen", (percent, message) => {

        console.log(percent + "%", message);

    });

    client.on("authenticated", () => {

        logger.event("✅ AUTHENTICATED");

    });

    client.on("ready", () => {

        logger.event("🚀 GORDON ONLINE");

    });

    client.on("auth_failure", err => {

        logger.error("AUTH FAILURE", err);

    });

    client.on("disconnected", reason => {

        logger.error("DISCONNECTED", reason);

    });

    client.on("message_ack", (msg, ack) => {

        console.log("📬 ACK", ack);

    });

    client.on("change_state", state => {

        console.log("📡 STATE", state);

    });

}

module.exports = registerEvents;
