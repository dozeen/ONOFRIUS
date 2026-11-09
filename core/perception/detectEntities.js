const people = [
    "papà",
    "mamma",
    "figlio",
    "figlia",
    "fratello",
    "sorella",
    "professore",
    "nonna",
    "nonno"
];

module.exports = function detectEntities(ctx) {
    const txt = (ctx.message || "").toLowerCase();
    return people.filter(p => txt.includes(p));
};
