const store = require("./relationshipStore");

module.exports = function update(phone, analysis) {

    const current = store.load(phone) || {};

    const updated = {

        ...current,

        relationship: analysis.relationship,

        confidence: analysis.confidence,

        updatedAt: new Date().toISOString()

    };

    store.save(phone, updated);

    return updated;

};
