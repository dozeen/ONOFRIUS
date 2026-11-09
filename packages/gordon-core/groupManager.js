function isMentioned(context) {

    const text = (context.text || "").toLowerCase();

    return (
        text.includes("@gordon") ||
        text.includes("gordon")
    );

}

function shouldReply(context) {

    // Chat privata
    if (!context.chat?.isGroup)
        return true;

    // Gruppo
    return isMentioned(context);

}

module.exports = {

    shouldReply,
    isMentioned

};
