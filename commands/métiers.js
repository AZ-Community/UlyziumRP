const { addWarnEmbed, addListEmbed } = require('../tools/embed.js');

module.exports = {
    name: "métiers",
    alias: [ "mts" ],
    usage: "<numéro de la page>",
    description: "Retourne la liste des métiers disponibles.",
    run: (client, message, args) => {
        // Start of error report
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
            "M E T I E R S",
            Array.from(client.métiers.values()),
            nb,
            "https://cdn.discordapp.com/attachments/602887779206168716/615677927941603361/giphy5.gif"
        ));
        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=métiers [numéro de la page]``";
};