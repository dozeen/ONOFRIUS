/**
 * test-eventbus-reply-flow.js - Test dell'intero flusso EventBus tra Adapters, Kernel e ReplyHandler
 */

const { EventBus } = require("./core/events");
const kernel = require("./core/kernel");
const registerReplyHandler = require("./adapters/whatsapp/replyHandler");

let replySent = false;
let replyDestination = "";
let replyContent = "";

// Mock WhatsApp Client
const mockClient = {
    async sendMessage(to, text) {
        replySent = true;
        replyDestination = to;
        replyContent = text;
        console.log(`💬 Mock WhatsApp Client Sent to [${to}]: "${text}"`);
    }
};

registerReplyHandler(mockClient);

async function runTest() {
    console.log("=========================================");
    console.log("TEST EVENTBUS UNIFICATION & REPLY FLOW");
    console.log("=========================================\n");

    const testEvent = {
        id: "evt_12345",
        chatId: "393000000000@c.us",
        senderId: "393000000000@c.us",
        text: "Ciao ONOFRIUS!",
        response: "Ciao! Sono ONOFRIUS."
    };

    console.log("1. Emissione evento 'message.received' da Adapter WhatsApp...");
    EventBus.emit("message.received", testEvent);

    // Attendi l'elaborazione asincrona
    await new Promise(resolve => setTimeout(resolve, 500));

    if (replySent && replyDestination.includes("393000000000")) {
        console.log("\n✅ SUCCESS: L'evento 'message.received' è stato processato dal Kernel ed inviato al ReplyHandler!");
        console.log("Contenuto risposta:\n" + replyContent);
    } else {
        console.error("\n❌ FAIL: Risposta non ricevuta da ReplyHandler!");
        process.exit(1);
    }
}

runTest();
