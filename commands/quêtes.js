const { addListEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "quêtes",
    alias: [ "qs" ],
    usage: "<numéro de page>",
    description: "Retourne la liste des quêtes disponibles.",
    run: (client, message, args) => {
        var nb;
        if(!args[0]) nb = 1
        else if(!isFinite(args[0]) || args[0] < 1){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La valeur attendue est incorrecte."+commandUsage()
            ));
            return;
        }else nb = args[0];

        message.channel.send(addListEmbed(
            message.author.username,
            message.author.avatarURL,
            "Q U E T E S",
            client.quests.array(),
            nb,
            "https://cdnb.artstation.com/p/assets/images/images/009/222/569/original/michelle-neumann-sonibean-bearded-vulture-icon-big.gif?1517792437"
        ));
        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=quêtes <numéro de page>``";
};