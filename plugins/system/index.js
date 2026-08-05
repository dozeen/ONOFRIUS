module.exports = {

    name: "System",

    priority: 100,


    async canHandle(context) {

        const cmd = context.text.trim().toLowerCase();

        return (
            cmd === "/ping" ||
            cmd === "/version" ||
            cmd === "/status"
        );

    },

    async handle(context) {

        const cmd = context.text.trim().toLowerCase();

        switch (cmd) {

            case "/ping":
                return "🏓 Pong!";

            case "/version":
                return "🤖 Gordon 2.0.0-alpha.1";

            case "/status":
                return [
                    "🟢 Gordon ONLINE",
                    "",
                    "AI: OK",
                    "Router: OK",
                    "Plugin Manager: OK",
                    "Ollama: OK"
                ].join("\n");

            default:
                return "Comando sconosciuto.";

        }

    }

};
