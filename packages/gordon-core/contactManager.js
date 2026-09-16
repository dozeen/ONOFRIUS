const ContactResolver = require("./contacts/contactResolver");
const ContactClassifier = require("./contacts/contactClassifier");
const ContactStatistics = require("./contacts/contactStatistics");
const ContactLearning = require("./contacts/contactLearning");

const classifier = new ContactClassifier();
const statistics = new ContactStatistics();
const learning = new ContactLearning();

/**
 * Normalizza un identificatore WhatsApp.
 *
 * Esempi:
 *
 * 393000000128@c.us
 * -> 393000000128
 *
 * 217535983173871@lid
 * -> 217535983173871
 *
 * 62225536577647:70@lid
 * -> 62225536577647
 */

function normalize(phone) {

    if (!phone) {
        return "";
    }

    return String(phone)
        .trim()
        .replace(/@c\.us$/i, "")
        .replace(/@lid$/i, "")
        .replace(/:\d+$/, "")
        .replace(/:\d+(?=@)/, "");

}

function load(phone) {

    const normalized =
        normalize(phone);

    const contact =
        ContactResolver.resolve(normalized);

    const profile =
        classifier.classify(contact);

    return {

        ...contact,

        relationship: profile.relationship,

        confidence: profile.confidence,

        socialStyle: profile.style,

        socialReason: profile.reason

    };

}

function update(phone, profile) {

    learning.update(
        normalize(phone),
        profile
    );

}

function buildStatistics(message) {

    return statistics.build(message);

}

module.exports = {

    normalize,

    load,

    update,

    buildStatistics

};
