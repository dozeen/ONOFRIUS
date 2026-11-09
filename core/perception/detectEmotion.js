module.exports = function detectEmotion(ctx){

    const txt = (ctx.message || "").toLowerCase();

    if(txt.includes("😂") || txt.includes("🤣"))
        return "fun";

    if(txt.includes("❤️"))
        return "love";

    if(txt.includes("😭"))
        return "sad";

    if(txt.includes("😡"))
        return "anger";

    if(txt.includes("disgust"))
        return "disgust";

    return "neutral";

}
