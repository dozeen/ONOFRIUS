module.exports = {

    enabled: true,

    privateChats: {

        alwaysReply: true

    },

    groups: {

        passive: true,

        replyOnlyIf: {

            mentioned: true,

            replyToMe: true,

            directQuestion: true,

            owner: true,

            command: true,

            calledByName: true

        }

    }

};
