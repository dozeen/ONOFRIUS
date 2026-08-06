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
                return "🤖 ONOFRIUS 0.5.0-alpha";

            case "/status":
                return [
                    "🟢 ONOFRIUS ONLINE",
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
