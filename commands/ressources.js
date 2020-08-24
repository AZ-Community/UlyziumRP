const { addWarnEmbed, addListEmbed } = require('../tools/embed.js');

module.exports = {
    name: "ressources",
    alias: [ "res" ],
    usage: "<numéro de page>",
    description: "Retourne la liste des ressources permettant la construction d'équipements.",
    run: (client, message, args) => {
        // Start of error report
        var nb;
        if(!args[0]) nb = 1;
        else if(!isFinite(args[0]) || args[0] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La donnée numérique est erronnée."+commandUsage()
            ));
            return;
        }else nb = args[0];
        // End of error report

        // Execution
        message.channel.send(addListEmbed(
            message.author.username, 
            message.author.avatarURL,
            "R E S S O U R C E S",
            Array.from(client.ressources.values()),
            nb,
            "https://cdn.discordapp.com/attachments/609113776582688778/612672374432858125/lazul.gif"
        ));
        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=ressources <numéro de page>``";
};