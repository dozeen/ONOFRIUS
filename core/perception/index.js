const analyzeMessage = require("./analyzeMessage");

async function perceive(context) {
    return analyzeMessage(context);
}

module.exports = perceive;
