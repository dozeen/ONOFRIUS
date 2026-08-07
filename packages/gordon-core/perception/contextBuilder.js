let owner;
try {
    owner = require("../config/owner");
} catch (e1) {
    try {
        owner = require("../../config/owner");
    } catch (e2) {
        owner = { id: "owner", role: "owner", permissions: ["all"] };
    }
}
const { detectMedia } = require("./media");
const { Actors } = require("../events");
const logger = require("../logger");

async function buildContext(event) {
    if (!event) {
        throw new Error("Evento mancante");
    }

    const msg = event.payload?.raw;

    if (!msg) {
        throw new Error("Evento senza payload.raw");
    }

    const metadata = event.metadata || {};

    const chatId = metadata.chatId || null;
    const sender = metadata.sender || null;
    const isGroup = metadata.isGroup || false;
    const timestamp = metadata.timestamp || msg.timestamp;

    let chat = null;
    let contact = null;

    if (!metadata.fromMe) {
        try {
            chat = await msg.getChat();
        } catch (err) {
            logger.debug(
                "Context",
                `Impossibile recuperare la chat (${chatId}), uso i dati dell'evento`
            );
        }
    }

    try {
        contact = await msg.getContact();
    } catch (err) {
        logger.debug(
            "Context",
            `getContact() non disponibile per ${sender}, uso Identity Engine`
        );
    }

    const media = await detectMedia(msg);

    let origin;
    switch (event.actor) {
        case Actors.GORDON:
            origin = "gordon";
            break;
        case Actors.OWNER:
            origin = "owner";
            break;
        case Actors.HUMAN:
            origin = "contact";
            break;
        default:
            origin = "unknown";
    }

    const isOwner =
        event.actor === Actors.GORDON ||
        event.actor === Actors.OWNER ||
        sender === owner.id;

    const senderName =
        contact?.pushname ||
        contact?.name ||
        contact?.number ||
        sender ||
        "";

    const contactName =
        contact?.pushname ||
        contact?.name ||
        contact?.number ||
        "";

    const fromStr = String(msg.from || "").toLowerCase();
    const remoteStr = String(msg.id?.remote || "").toLowerCase();
    const isStatus = fromStr === "status@broadcast" || remoteStr === "status@broadcast" || chatId === "status@broadcast" || msg.isStatus === true;
    const author = msg.author || metadata.sender || sender;

    return {
        event,
        id: event.id,
        timestamp,
        chatId,
        isGroup,
        isStatus,
        isPassivePerception: isStatus,
        author,
        chat: {
            id: chatId,
            name: chat?.name || "",
            isGroup
        },
        sender,
        senderName,
        contactName,
        origin: isStatus ? "status" : origin,
        isOwner,
        role: isOwner ? owner.role : "user",
        permissions: isOwner ? owner.permissions : [],
        text: event.payload?.text ?? msg.body ?? "",
        type: msg.type,
        quoted: !!msg.hasQuotedMsg,
        media,
        raw: msg
    };
}

module.exports = {
    buildContext
};
