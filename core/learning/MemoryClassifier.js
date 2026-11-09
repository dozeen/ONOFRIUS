class MemoryClassifier {

    classify(context) {

        const text =
            (context.text || "")
                .trim();

        if (!text)
            return null;

        return {

            important:
                text.length > 10,

            score:
                text.length

        };

    }

}

module.exports = new MemoryClassifier();
