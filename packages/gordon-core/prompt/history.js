const conversation =
    require("../conversation/conversationEngine");

module.exports = function (context) {

    return conversation.build(context);

};
