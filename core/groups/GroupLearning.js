class GroupLearning {

    async update(context) {

        if (!context.isGroup)
            return;

        console.log("👥 GroupLearning");

    }

}

module.exports = new GroupLearning();
