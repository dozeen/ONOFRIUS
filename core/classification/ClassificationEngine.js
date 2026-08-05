const Engine = require("../cognition/Engine");
const Classifier = require("./MessageClassifier");

class ClassificationEngine extends Engine {

    constructor() {
        super("Classification", 20);
    }

    async process(context) {

        context.classification = Classifier.classify(context);

        console.log("🧠 CLASSIFICATION");
        console.dir(context.classification, { depth: null });

        return context;
    }

}

module.exports = ClassificationEngine;
