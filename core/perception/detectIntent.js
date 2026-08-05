module.exports = function detectIntent(ctx){

    const txt = (ctx.message || "").toLowerCase();

    if(txt.includes("?"))
        return "question";

    if(txt.startsWith("ciao"))
        return "greeting";

    if(txt.startsWith("grazie"))
        return "thanks";

    if(txt.includes("per favore"))
        return "request";

    if(txt.includes("papà"))
        return "request";

    return "statement";

}
