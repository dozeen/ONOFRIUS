const ai = require("../../core/ai");
const promptBuilder = require("../../core/promptBuilder");

module.exports = {
    name: "AI",
    priority: 0,

    async canHandle() {
        return true;
    },

    async handle(context) {
        try {
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
