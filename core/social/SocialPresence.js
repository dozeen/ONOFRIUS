class SocialPresence {

    evaluate(context) {

        if (!context.isGroup) {

            return {
                shouldReply: false
            };

        }

        const text =
            (context.text || "").toLowerCase();

        const greetings = [
            "buongiorno",
            "buona domenica",
            "buonasera"
        ];

        const ritual =
            greetings.some(g =>
                text.includes(g)
            );

        if (!ritual) {

            return {
                shouldReply: false
            };

        }

        return {

            shouldReply: true,

            debug: true,

            reply: "Buongiorno ☀️",

            reason: "ritual_greeting"

        };

    }

}

module.exports = new SocialPresence();
