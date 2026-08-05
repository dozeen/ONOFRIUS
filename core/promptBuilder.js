const prompts = require("./prompt/PromptLoader");

function build(context) {

    const sections = [];
console.log("\n===== DEBUG CONTEXT =====");
console.log("context.text =", JSON.stringify(context.text));
console.log("=========================\n");
    for (const prompt of prompts) {

        if (typeof prompt !== "function")
            continue;

        const section = prompt(context);

        if (section)
            sections.push(section);

    }

    return sections
        .filter(Boolean)
        .map(s => s.trim())
        .filter(s => s.length)
        .join("\n\n");

}

module.exports = {

    build

};
