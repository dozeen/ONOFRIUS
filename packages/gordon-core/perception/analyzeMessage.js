const detectIntent = require("./detectIntent");
const detectEmotion = require("./detectEmotion");
const detectEntities = require("./detectEntities");
const detectRelationship = require("./detectRelationship");
const summarizeContext = require("./summarizeContext");

module.exports = async function analyzeMessage(ctx) {

    return {

        intent: detectIntent(ctx),

        emotion: detectEmotion(ctx),

        entities: detectEntities(ctx),

        relationship: detectRelationship(ctx),

        summary: summarizeContext(ctx),

        confidence: 0.80,

        timestamp: new Date().toISOString()

    };

};
