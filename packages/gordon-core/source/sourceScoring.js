class SourceScoring {

    score(source) {

        switch (source.type) {

            case "creator":
                return 100;

            case "family":
                return 95;

            case "contact":
                return 90;

            case "assistant":
                return 40;

            case "summary":
                return 25;

            default:
                return 10;

        }

    }

}

module.exports = SourceScoring;
