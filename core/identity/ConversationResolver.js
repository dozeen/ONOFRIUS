class ConversationResolver {

    resolve(context, identity) {

        return {

            id: context.chatId,

            adapter: "whatsapp",

            provider: context.chatId.includes("@lid")
                ? "lid"
                : "c.us",

            participants: [

                identity

            ]

        };

    }

}

module.exports = ConversationResolver;
