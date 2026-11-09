function isMentioned(context) {
    const text = (context.text || "").toLowerCase();

    return (
        text.includes("@onofrius") ||
        text.includes("onofrius") ||
        text.includes("@assistant") ||
        text.includes("assistant") ||
        text.includes("@gordon") ||
        text.includes("gordon")
    );
}

function shouldReply(context) {
    if (!context.chat?.isGroup) return true;
    return isMentioned(context);
}

module.exports = {
    shouldReply,
    isMentioned
};
