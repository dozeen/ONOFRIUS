class ContactStatistics {

    build(message) {

        const history = message.mind?.history || [];

        return {

            messages: history.length,

            firstSeen:
                history.length > 0
                    ? history[0].timestamp || null
                    : null,

            lastSeen:
                history.length > 0
                    ? history[history.length - 1].timestamp || null
                    : null

        };

    }

}

module.exports = ContactStatistics;
