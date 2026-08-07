module.exports = function detectRelationship(ctx) {

    if (!ctx.contact)
        return "unknown";

    if (ctx.contact.relation)
        return ctx.contact.relation;

    return "unknown";

};
