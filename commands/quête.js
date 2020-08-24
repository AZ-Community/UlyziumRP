const { addQuestEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "",
    alias: [ "q" ],
    usage: "[id]",
    description: "Retourne les informations sur la quête.",
    run: (client, message, args) => {
        if(!args[0] || !isFinite(args[0])){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "Q U E T E",
                ":warning: Impossible d'exécuter cette commande, aucune valeur numérique repérée."+commandUsage()
            ));
            return;
        }

        const tab = client.quests.array();
        const max = tab.length;
        if(args[0]<=0 || args[0] > max ){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "Q U E T E",
                `:warning: Impossible d'exécuter cette commande, la valeur numérique doit être comprise entre 0 et ${max}`+commandUsage()
            ));
            return;
        }

        message.channel.send(addQuestEmbed(
            message.author.username,
            message.author.avatarURL,
            tab[args[0]-1]
        ));
        return;
    }
}

function commandUsage(){
    return "\n\n:gear: __Utilisation :__  ``=quête [id]``";
}