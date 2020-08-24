const { addQuestEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "quête-grade",
    alias: [ "q-grade", "q-g" ],
    usage: "[id]",
    description: "Retourne les informations sur la quête pour obtenir le grade.",
    run: (client, message, args) => {
        if(!args[0] || !isFinite(args[0])){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "Q U E T E - G R A D E",
                ":warning: Impossible d'exécuter cette commande, aucune valeur numérique repérée."+commandUsage()
            ));
            return;
        }

        const tab = client.questsRank.array();
        const max = tab.length;
        if(args[0]<=0 || args[0] > max ){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "Q U E T E - G R A D E",
                `:warning: Impossible d'exécuter cette commande, la valeur numérique doit être comprise entre 0 et ${max}`+commandUsage()
            ));
            return;
        }

        const info = tab[args[0]-1];
        var rewards = "";
        for(let i = 0; i < info.reward.length; i ++)
            rewards += `\n ${info.reward[i]}`;
        message.channel.send(`:scroll: ***~ Quête pour le grade : ${info.title}***\n*Approche . . . Approche . . . N'ai pas peur.. tu peux me faire confiance. Je sais tout ! La preuve... Je sais que tu souhaites acquérir depuis un moment le rôle de ${info.title}  Tu n'as aucune inquiétude à te faire, je vais t'aider jolie créature. ~ Il te suffit simplement de réaliser ces quelques tâches et ton rêve se réalisera enfin. __Il faudra donc que tu ${info.mission}__. Ce n'est rien de bien complexe, il te faudra simplement de la détermination et une bonne dose de courrage, hé-hé ! Eh oui.. le courage de faire tout ceci sans abandonner ! Je te souhaite bonne chance en espérant que tu puisses te montrer à la hauteur du rôle ${info.title} que tu souhaites tant obtenir. Si tu y crois, tu y arriveras, sois en certains !*\n\n:moneybag: ***~ Récompenses :*** ${rewards}`);
        return;
    }
}

function commandUsage(){
    return "\n\n:gear: __Utilisation :__  ``=quête-grade [id]``";
}