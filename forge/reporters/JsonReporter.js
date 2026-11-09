const fs = require("fs");

module.exports = {

    save(results) {

        fs.writeFileSync(

            "forge-report.json",

            JSON.stringify(results, null, 4)

        );

    }

};
