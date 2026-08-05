async function detectMedia(msg) {

    return {

        hasMedia: msg.hasMedia || false,

        type: msg.type || "chat",

        mime: null,

        filename: null,

        data: null

    };

}

module.exports = {

    detectMedia

};
