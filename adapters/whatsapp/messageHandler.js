const Whisper = require("../../core/whisper");
const Policy = require("../../core/policy/PolicyManager");
const Modes = require("../../core/policy/PolicyModes");
const bus = require("../../core/eventBus");
const { Actors } = require("../../core/events");
const { shouldIgnore } = require("./filters");
const { buildContext } = require("../../core/perception/contextBuilder");
const identityResolver = require("../../core/identity/IdentityResolver");
const logger = require("./logger");

async function handle(event) {
    console.log("➡️ TRACE 1: WA Message -> handle() INIZIO");
    const msg = event.payload.raw;

    if ((msg.type === "ptt" || msg.type === "audio") && !event.payload.text) {
        console.log("🎤 Avvio Whisper per trascrizione audio...");
        try {
            const text = await Whisper.transcribe(msg);
            event.payload.text = text;
            console.log("📝 TESTO TRASCRITTO:", text);
        } catch (err) {
            console.error("Whisper:", err);
        }
    }

    if (!msg) {
        throw new Error("Evento senza payload.raw");
    }

    try {
        if (shouldIgnore(msg)) {
            console.log("🛑 MessageHandler: shouldIgnore = true, ignore event");
            return;
        }

        const context = await buildContext(event);
        context.identity = identityResolver.resolve(context);
        context.contact = context.identity.contact;

        console.log("\n========== IDENTIFICATORI ==========");
        console.log({
            contactName: context.contactName,
            sender: context.sender,
            chatId: context.chatId,
            chatName: context.chat?.name,
            isGroup: context.isGroup,
            origin: context.origin
        });
        console.log("====================================\n");

        const policyType = context.isGroup ? "groups" : "contacts";
        const policyId = context.isGroup
            ? (context.chat.name || context.chatId)
            : (context.contactName || context.sender);

        const policy = Policy.get(policyType, policyId);
        console.log(`🛡 Policy [${policyType}:${policyId}] -> ${policy.mode}`);

        if (policy.mode === Modes.OFF) {
            console.log(`🚫 Policy OFF - ${policyType}:${policyId}`);
            return;
        }

        console.log("➡️ TRACE 2: handle() -> bus.emit('message.received')");
        bus.emit("message.received", context);
    } catch (err) {
        console.error("❌ Errore in messageHandler:", err);
    }
}

module.exports = {
    handle
};
