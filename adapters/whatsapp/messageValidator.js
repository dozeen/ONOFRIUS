const ALLOWED_TYPES = new Set([
    "chat",
    "image",
    "video",
    "audio",
    "ptt",
    "document"
]);

function validate(msg) {

    if (!msg)
        return false;

    if (!ALLOWED_TYPES.has(msg.type))
        return false;

    if (!msg.from)
        return false;

    return true;
}

module.exports = {
    validate
};
