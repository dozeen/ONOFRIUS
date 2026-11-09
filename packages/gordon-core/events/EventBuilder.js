const Event = require("./Event");

const Sources = require("./Sources");
const EventTypes = require("./EventTypes");
const Actors = require("./Actors");
const Directions = require("./Directions");

const { isRecentReply } = (() => { try { return require("../../adapters/whatsapp/recentReplies"); } catch(e) { return { isRecentReply: () => false }; } })();

class EventBuilder {

    static create(data) {

        return new Event(data);

    }

    static fromWhatsApp(msg) {

        const text = (msg.body || "").trim();
        const isEcho = msg.fromMe && isRecentReply(text);

        const actor =
            msg.fromMe
                ? (isEcho ? Actors.GORDON : Actors.OWNER)
                : Actors.HUMAN;

        const direction =
            msg.fromMe
                ? Directions.OUTGOING
                : Directions.INCOMING;

        const chatId =
            msg.fromMe
                ? msg.to
                : msg.from;

        const sender =
            msg.author ||
            (msg.fromMe ? msg.to : msg.from);

        const recipient =
            msg.fromMe
                ? msg.to
                : null;

        const isGroup =
            typeof chatId === "string" &&
            chatId.endsWith("@g.us");

        return new Event({

            source: Sources.WHATSAPP,

            kind: EventTypes.MESSAGE,

            actor,

            direction,

            payload: {

                text: msg.body || "",

                raw: msg

            },

            metadata: {

                chatId,

                sender,

                recipient,

                isGroup,

                timestamp: msg.timestamp,

                fromMe: msg.fromMe,

                from: msg.from,

                to: msg.to,

                author: msg.author || null,

                hasMedia: msg.hasMedia

            }

        });

    }

}

module.exports = EventBuilder;
