class ConversationEngine {

    build(context) {

        if (!context.history || context.history.length === 0)
            return "";

        const history = context.history

            .filter(m => m.id !== context.id)

            .filter(m => {

                if (!m.text)
                    return false;

                if (m.text.startsWith("/"))
                    return false;

                if (m.text === "clear")
                    return false;

                return true;

            })

            .slice(-8);

        if (history.length === 0)
            return "";

        const out = [];

        out.push("========================");
        out.push("CONVERSAZIONE RECENTE");
        out.push("========================");
        out.push("");

        for (const msg of history) {

            const speaker =
                msg.role === "assistant"
                    ? "Gordon"
                    : (context.contact?.name || "Utente");

            out.push(`${speaker}:`);
            out.push(msg.text);
            out.push("");

        }

        return out.join("\n");

    }

}

module.exports = new ConversationEngine();
