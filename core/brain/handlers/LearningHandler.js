const LearningEngine =
    require("../../learning/LearningEngine");

class LearningHandler {

    async process(context) {

        await LearningEngine.learn(context);

        return context;

    }

}

module.exports = LearningHandler;
