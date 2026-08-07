const resolver = require("./contactResolver");

function load(chatId) {

    return resolver.resolve(chatId);

}

module.exports = {

    load

};
