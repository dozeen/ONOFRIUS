const OwnerProfile = require("../identity/OwnerProfile");
const { detectMedia } = require("./media");
const { Actors } = require("../events");
const logger = require("../logger");

async function buildContext(event) {
    const owner = OwnerProfile.get();

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

    // =====================================================
    // CHAT
    // =====================================================

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

    // =====================================================
    // CONTACT
    // =====================================================

    try {

        contact = await msg.getContact();

    } catch (err) {

        // Limite noto di whatsapp-web.js:
        // gli identificativi @lid possono non essere risolti da getContact().
        // Non è un errore: il sistema continua usando l'Identity Engine
        // e le informazioni presenti nella memoria dei contatti.

        logger.debug(
            "Context",
            `getContact() non disponibile per ${sender}, uso Identity Engine`
        );

    }

    // =====================================================
    // MEDIA
    // =====================================================

    const media = await detectMedia(msg);

    // =====================================================
    // ORIGIN
    // =====================================================

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

    // =====================================================
    // OWNER
    // =====================================================

    const isOwner =
        event.actor === Actors.GORDON ||
        event.actor === Actors.OWNER ||
        sender === owner.id;

    // =====================================================
    // NOMI
    // =====================================================

    const pushname = msg.pushname || msg._data?.notifyName || metadata.pushname || metadata.senderName || metadata.contactName || event.contactName || event.senderName || "";

    const senderName =
        contact?.pushname ||
        contact?.name ||
        pushname ||
        contact?.number ||
        sender ||
        "";

    const contactName =
        contact?.pushname ||
        contact?.name ||
        pushname ||
        contact?.number ||
        "";

    // =====================================================
    // CONTEXT
    // =====================================================

    return {

        // Event

        event,

        id: event.id,

        timestamp,

        // Chat

        chatId,

        isGroup,

        chat: {

            id: chatId,

            name: chat?.name || "",

            isGroup

        },

        // Identità

        sender,

        senderName,

        contactName,

        origin,

        isOwner,

        role:
            isOwner
                ? owner.role
                : "user",

        permissions:
            isOwner
                ? owner.permissions
                : [],

        // Messaggio

        text:
            event.payload?.text ??
            msg.body ??
            "",

        type: msg.type,

        quoted: !!msg.hasQuotedMsg,

        media,

        // Oggetto WhatsApp originale

        raw: msg

    };

}

module.exports = {

    buildContext

};
