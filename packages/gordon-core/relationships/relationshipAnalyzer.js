module.exports = function analyze(contact) {

    if (!contact) {

        return {
            relationship: "unknown",
            confidence: 0.2
        };

    }

    if (contact.relationship) {

        return {
            relationship: contact.relationship,
            confidence: 1
        };

    }

    return {
        relationship: "known",
        confidence: 0.5
    };

};
