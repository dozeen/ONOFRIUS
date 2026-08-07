module.exports = function (context) {

    if (!context.analysis)
        return "";

    const a = context.analysis;

    const out = [];

    out.push("========================");
    out.push("RAGIONAMENTO");
    out.push("========================");

    if (a.summary)
        out.push(a.summary);

    if (a.constraints.length) {

        out.push("");
        out.push("VINCOLI");

        a.constraints.forEach(v =>
            out.push("- " + v)
        );

    }

    if (a.decisions.length) {

        out.push("");
        out.push("DECISIONI");

        a.decisions.forEach(v =>
            out.push("- " + v)
        );

    }

    return out.join("\n");

};
