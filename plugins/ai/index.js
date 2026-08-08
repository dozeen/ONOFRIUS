const ai = require("../../core/ai");
const promptBuilder = require("../../core/promptBuilder");
const AgendaCapability = require("../../core/capability/AgendaCapability");

module.exports = {
    name: "AI",
    priority: 0,

    async canHandle() {
        return true;
    },

    async handle(context) {
        try {
            const text = context.text || (context.event && context.event.text) || "";

            // Intercettazione deterministica dell'agenda prima dell'LLM (sia da CLI che da adattatori)
            if (AgendaCapability.isAgendaQuery(text)) {
                const agendaRes = await AgendaCapability.execute(context);
                if (agendaRes && agendaRes.handled) {
                    console.log("📅 [AI Plugin] Intercettazione deterministica agenda eseguita (0 Token LLM)");
                    return agendaRes.reply;
                }
            }

            if (context.profiler) context.profiler.start("Prompt");

            const prompt = promptBuilder.build(context);
            context.prompt = prompt;
            context.promptLength = prompt ? prompt.length : 0;

            if (context.profiler) context.profiler.end("Prompt");

            console.log("\n========== PROMPT ==========");
            console.log(prompt);
            console.log("============================\n");
            console.log("✅ PromptBuilder OK");

            if (context.profiler) context.profiler.start("LLM");

            const response = await ai.ask(prompt);

            console.log("LLM RAW =", response);
            console.log("LLM TYPE =", typeof response);
            console.log("LLM LENGTH =", response?.length);

            if (context.profiler) context.profiler.end("LLM");

            console.log("✅ AI OK");
            return response;
        } catch (err) {
            console.error("❌ AI Plugin Error");
            console.error(err);
            throw err;
        }
    }
};
