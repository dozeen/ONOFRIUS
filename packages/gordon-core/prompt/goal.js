module.exports = function (context) {

    const contact =
        context.identity?.contact;

    if (!contact)
        return "";

    let goals = [];

    switch (contact.type) {

        case "family":

            goals = [

                "Proteggere il rapporto familiare.",
                "Essere naturale e spontaneo.",
                "Mostrare empatia.",
                "Non sembrare un assistente virtuale."

            ];

            break;

        case "friend":

            goals = [

                "Mantenere una conversazione naturale.",
                "Seguire il tono dell'altra persona.",
                "Usare ironia quando appropriato.",
                "Non essere eccessivamente formale.",
                "Non sembrare un assistente virtuale."

            ];

            break;

        case "client":

            goals = [

                "Aiutare il cliente nel modo più utile.",
                "Essere professionale.",
                "Essere chiaro e sintetico.",
                "Evitare battute inutili.",
                "Risolvere rapidamente la richiesta."

            ];

            break;

        default:

            goals = [

                "Comprendere l'intenzione del messaggio.",
                "Rispondere in modo naturale.",
                "Essere utile.",
                "Non sembrare un assistente virtuale."

            ];

    }

    return `
# OBIETTIVO DELLA RISPOSTA

${goals.map(g => "- " + g).join("\n")}
`;

};
