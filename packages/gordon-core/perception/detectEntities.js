const people = [

    "papà",
    "mamma",
    "alice",
    "martina",
    "professore",
    "nonna"

];

module.exports = function detectEntities(ctx){

    const txt = (ctx.message || "").toLowerCase();

    return people.filter(p=>txt.includes(p));

}
