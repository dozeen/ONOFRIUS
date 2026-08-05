const sleep = ms => new Promise(r => setTimeout(r, ms));

async function step(title, body) {

    console.log("");
    console.log("────────────────────────────────────────");
    console.log(title);
    console.log("────────────────────────────────────────");

    console.log(body);

    await sleep(800);

}

async function main() {

    console.clear();

    console.log("");
    console.log("══════════════════════════════════════════════");
    console.log("               ONOFRIUS");
    console.log("         Your Invisible Friend");
    console.log("══════════════════════════════════════════════");

    await step(

        "Incoming Event",

        "\"Hello ONOFRIUS\""

    );

    await step(

        "Perception",

        "Greeting detected"

    );

    await step(

        "Fact Extraction",

        "User started a conversation"

    );

    await step(

        "Attention Engine",

        "Priority: 82"

    );

    await step(

        "Working Memory",

        "Conversation context created"

    );

    await step(

        "Decision Engine",

        "Reply"

    );

    await step(

        "Prompt Builder",

        "Context assembled"

    );

    await step(

        "Verifier",

        "No contradictions"

    );

    await step(

        "Response",

        "Hello! Nice to meet you."

    );

    console.log("");

    console.log("══════════════════════════════════════════════");
    console.log(" Cognitive Cycle Completed");
    console.log("══════════════════════════════════════════════");

}

main();
