const { addWarnEmbed, addListEmbed } = require('../tools/embed.js');

module.exports = {
    name: "bestiaire",
    alias: [ "mobs", "best" ],
    usage: "[zone] <numéro de page>",
    description: "Retourne la liste des créatures pouvent être rencontrées dans la zone sélectionnée.",
    run: (client, message, args) => {
        // Vars
        const zones = ["steppes","wesey","polar"];

        // Start of error report
        if(!args[0] || !hasValue(zones,args[0].toLowerCase())){
            var msg = ":warning: La zone est erronnée, veuillez choisir entre :"
            for(let i = 0; i < zones.length; i++) msg = msg + "\n" + zones[i];
            msg = msg + commandUsage();

            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                msg
            ));
            return;
        }

        var nb;
        if(!args[1]) nb = 1;
        else if(!isFinite(args[1]) || args[1] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La donnée numérique est erronnée."+commandUsage()
            ));
            return;
        }else nb = args[1];
        // End of error report

        // Execution
        message.channel.send(addListEmbed(
            message.author.username, 
            message.author.avatarURL,
            "B E S T I A I R E",
            client.mobs.array(),
            nb,
            "https://cdn.discordapp.com/attachments/591030658898329641/612669913487769603/baron.gif",
            args[0].toLowerCase()
        ));

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=bestiaire [zone] <numéro de page>``";
};

function hasValue(table,val){
    var ret = false;

    for(let i = 0; i < table.length; i++ ){
        if(table[i]===val) ret = true;
    }

    return ret;
};