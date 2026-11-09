const IdentityResolver =
    require("../../identity/IdentityResolver");

const contactManager =
    require("../../contactManager");

class IdentityHandler {

    async process(context) {

        // =====================================================
        // Recupera sender/chatId se mancanti
        // =====================================================

        if (!context.chatId && context.chat?.id) {
            context.chatId = context.chat.id;
        }

        if (!context.sender && context.chatId) {
            context.sender = context.chatId;
        }

        // =====================================================
        // Conserva gli identificatori originali
        // (servono agli adapter per rispondere)
        // =====================================================

        context.transport = {

            sender: context.sender,

            chatId: context.chatId

        };

        // =====================================================
        // Normalizza gli identificatori
        // (servono al Brain)
        // =====================================================

        context.sender =
            contactManager.normalize(context.sender);

        context.chatId =
            contactManager.normalize(context.chatId);

        // =====================================================
        // Risoluzione identità
        // =====================================================

        context.identity =
            IdentityResolver.resolve(context);

        context.contact =
            context.identity?.contact ?? {};

        return context;

    }

}

module.exports = IdentityHandler;
