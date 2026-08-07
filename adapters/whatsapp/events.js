const qrcode = require("qrcode-terminal");

const {
    EventBuilder,
    EventBus
} = require("../../core/events");

const EventStore =
    require("../../core/events/EventStore").instance;

const { validate } = require("./messageValidator");
const { isSelfChat } = require("./selfChat");
const logger = require("./logger");

function registerEvents(client) {

    client.on("qr", qr => {

        console.log("");
        console.log("══════════════════════════════════════");
        console.log("📱 QR CODE");
        console.log("══════════════════════════════════════");

        qrcode.generate(qr, {
            small: true
        });

    });

    client.on("authenticated", () => {

        console.log("✅ WhatsApp authenticated");

    });

    client.on("ready", () => {

        console.log("🚀 WhatsApp Ready");

    });

    client.on("loading_screen", (percent, message) => {

        console.log(percent + "%", message);

    });

    client.on("auth_failure", err => {

        console.error(err);

    });

    client.on("disconnected", reason => {

        console.log("Disconnected:", reason);

    });

    client.on("change_state", state => {

        console.log("STATE:", state);

    });

    client.on("message_ack", (msg, ack) => {

        console.log("ACK:", ack);

    });

    client.on("message_create", msg => {

        if (msg.from === "status@broadcast" || msg.to === "status@broadcast" || msg.id?.remote === "status@broadcast")
            return;

        const personalChat = isSelfChat(msg);

        if (msg.fromMe && personalChat)
            return;

        if (!validate(msg))
            return;

        const event = EventBuilder.fromWhatsApp(msg);

        const added = EventStore.add(event);

        if (added) {
            EventBus.emit("message.received", added);
        }

    });

}

module.exports = registerEvents;
