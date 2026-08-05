function isSelfChat(msg) {

    if (!msg) return false;

    return (
        msg.fromMe === true &&
        msg.from === msg.to
    );

}

module.exports = {
    isSelfChat
};
