const fs = require("fs");
const path = require("path");

const MEMORY = path.join(
    __dirname,
    "../../memory/groups"
);

function today() {

    return new Date().toISOString().slice(0,10);

}

function load(chatId){

    fs.mkdirSync(MEMORY,{recursive:true});

    const file = path.join(

        MEMORY,

        encodeURIComponent(chatId)+".json"

    );

    if(!fs.existsSync(file)){

        return {

            lastGreeting:null

        };

    }

    return JSON.parse(

        fs.readFileSync(file,"utf8")

    );

}

function save(chatId,data){

    const file = path.join(

        MEMORY,

        encodeURIComponent(chatId)+".json"

    );

    fs.writeFileSync(

        file,

        JSON.stringify(data,null,4)

    );

}

module.exports={

    name:"DailyGreeting",

    priority:95,

    canHandle(message){

        if(!message.chat?.isGroup)
            return false;

        if(!message.text)
            return false;

        const txt=message.text
            .trim()
            .toLowerCase();

        return(

            txt==="buongiorno" ||

            txt==="buongiorno a tutti" ||

            txt==="buondì" ||

            txt.startsWith("buongiorno ")

        );

    },

    async execute(message){

        const hour=new Date().getHours();

        if(hour<5 || hour>12){

            return null;

        }

        const memory=load(

            message.chat.id

        );

        if(memory.lastGreeting===today()){

            return null;

        }

        memory.lastGreeting=today();

        save(

            message.chat.id,

            memory

        );

        return "Buongiorno ☀️";

    }

};
