const { addWarnEmbed, addItemEmbed, addEmbed } = require('../tools/embed.js');

module.exports = {
    name: "item-information",
    alias: [ "item-info" ],
    usage: "[nom de l'item]",
    description: "Retourne les informations demandées à propos d'un item.",
    run: async (client, message, args) => {
        if(!args[0]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le nom de l'item à rechercher."+commandUsage()
            ));
            return;
        }

        var name = args[0];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 1; i < args.length; i++){
            if(args[i]) name = name + " " + args[i];
        }

        // On retire les emojis et espaces du texte recherché
        name = client.removeInvalidChars(name);

        var itemsFound = new Array();
        const itemsName = Array.from(client.items.keys());
        itemsName.forEach(itemName => {
            if(itemName.includes(name) || itemName.localeCompare(name) == 0) {
                let itemInfo = client.items.get(itemName);
                itemInfo.item = itemInfo.name;
                itemsFound.push(itemInfo);
            }
        });

        var itemChoose = itemsFound[0];
        var stop = false;

        if(itemsFound.length < 1) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: L'item recherché n'existe pas dans notre liste, vérifiez votre saisie ou contactez un membre du staff."
            ));
            stop = true;
        }else if(itemsFound.length > 23) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La liste d'item trouvée contient trop d'éléments, veuillez affiner votre recherche."
            ));
            stop = true;
        }else if(itemsFound.length > 1){
            const filter = m => m.author.id === message.author.id;
            client.wait.set("chooseItem"+message.author.id, new Date());

            var msg = "**Veuillez choisir un item ( pour annuler, marquez stop ) :**\n";
            for(let i = 0; i < itemsFound.length; i++) {
                msg = `${msg} ${i+1}- ${itemsFound[i].item}\n`;
            };

            message.channel.send(addEmbed(
                message.author.username,
                message.author.avatarURL,
                "C H O I X - I T E M S",
                msg
            ));

            await message.channel.awaitMessages(filter, {max:2, time:180000})
                .then(collected => {
                    let nbChoose = collected.first().content;

                    if(nbChoose.toLowerCase() == "stop") {
                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "A N N U L A T I O N",
                            ":white_check_mark: L'ajout a été annulé."
                        ));
                        stop = true;
                        client.wait.delete("chooseItem"+message.author.id);
                        return;
                    }

                    if(!isFinite(nbChoose) || nbChoose <= 0 || nbChoose > itemsFound.length){
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            ":warning: La valeur du choix est incorrecte, elle doit être située entre 1 et "+itemsFound.length+". Annulation de la saisie."
                        ));
                        stop = true;
                        client.wait.delete("chooseItem"+message.author.id);
                        return;
                    }

                    itemChoose = itemsFound[nbChoose-1];

                    client.wait.delete("chooseItem"+message.author.id);
                    return;
                })
                .catch(err => {
                    console.error(err);
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: Le temps de saisie est écoulé, annulation de la commande."
                    ));
                    stop = true;
                    client.wait.delete("chooseItem"+message.author.id);
                    return;
                });
        }

        /*
        else if(itemsFound.length == 1){
            message.channel.send(addItemEmbed(
                message.author.username,
                message.author.avatarURL,
                client.items.get(itemsFound[0]),
                message.guild.member(message.author).hasPermission('KICK_MEMBERS')
            ));
        }
        */

        if(stop) return;

        message.channel.send(addItemEmbed(
            message.author.username,
            message.author.avatarURL,
            itemChoose,
            message.guild.member(message.author).hasPermission('KICK_MEMBERS')
        ));

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=item-information [nom de l'item]``";
};
