const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "utiliser",
    alias: [ "use" ],
    usage: "[quantité] [nom de l'item]",
    description: "Elle permet d'utiliser un item se situant dans votre inventaire",
    run: (client, message, args) => {
        if(!args[0]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque la quantité à utiliser."+commandUsage()
            ));
            return;
        }

        // Check if amount is defined
        if(!args[1]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le nom de l'item à utiliser."+commandUsage()
            ));
            return;
        }

        // Check if amount is an integer
        if(!isFinite(args[0]) || args[9] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La quantité de l'item à utiliser est erronée."+commandUsage()
            ));
            return;
        }

        var name = args[1];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 3; i < args.length; i++){
            if(args[i]) name = name + " " + args[i];
        }

        // On retire les emojis, les espaces et on remplace les majuscules par des minuscules de ce texte
        name = client.removeInvalidChars(name);

        client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}';`, async (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer la liste d'items de l'inventaire de <@${message.author.id}>.`
                ));

                throw err;
            }

            if(rows.length < 1){
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "U T I L I S E R - I T E M",
                    `:warning: L'inventaire de <@${message.author.id}> est vide, impossible de lui retirer un item.`
                ));
            }else{
                var itemsFound = new Array();
                rows.forEach(i => {
                    let itemNameWithoutEmoji = client.removeInvalidChars(i.item);

                    if(itemNameWithoutEmoji.includes(name)){
                        let itemInfo = client.items.get(itemNameWithoutEmoji);

                        if(itemInfo !== undefined){
                            itemInfo.nb = i.nb;
                            itemInfo.item = i.item;
                            itemsFound.push(itemInfo);
                        }else itemsFound.push({ item: i.item, nb: i.nb});
                    }
                });

                var stop = false;

                if(itemsFound.length < 1) {
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        `:warning: La recherche de l'item '${name}' n'a rien trouvé dans l'inventaire de <@${message.author.id}>, vérifiez votre saisie ou contactez un membre du staff.`
                    ));
                    stop = true;
                }else if(itemsFound.length > 23) {
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        `:warning: La liste d'item trouvée depuis l'inventaire de <@${message.author.id}> contient trop d'éléments, veuillez affiner votre recherche.`
                    ));
                    stop = true;
                }else if(itemsFound.length > 1){
                    const filter = m => m.author.id === message.author.id;
                    client.wait.set("chooseItem"+message.author.id, new Date());

                    var msg = "**Veuillez choisir un item à donner ( pour annuler, marquez stop ) :**\n";
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
                }else if(itemsFound.length == 1) itemChoose = itemsFound[0];

                if(stop) return;

                var nb = parseInt(itemChoose.nb) - parseInt(args[0]);

                if(nb < 0) {
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "U T I L I S E R - I T E M",
                        `:warning: La quantité de l'item '${itemChoose.item}' que vous tentez d'utiliser est trop importante, impossible de le faire.`
                    ));
                }else if(nb == 0) {
                    client.con.query(`DELETE FROM inventaire WHERE id = '${message.author.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer cet item dans l'inventaire de <@${message.author.id}>.`
                            ));

                            throw err;
                        }

                        var msg;
                        if(itemChoose.answer) msg = itemChoose.answer;
                        else msg = `:white_check_mark: L'item '${itemChoose.item}' a été utilisé par <@${message.author.id}>.`;
                        if(itemChoose.roleToGiveID) {
                            if(!message.member.roles.find(r => r.id == itemChoose.roleToGiveID)) message.member.addRole(itemChoose.roleToGiveID).catch(console.error);
                        }
                        if(itemChoose.roleToRemoveID) {
                            if(message.member.roles.find(r => r.id == itemChoose.roleToRemoveID)) message.member.removeRole(itemChoose.roleToRemoveID).catch(console.error);
                        }
                        if(message.member.roles.has("674067242555801653") || message.member.roles.has("674067375552856095")) {
                            if(itemChoose.xp) {
                                let xpToAdd = parseInt(args[0]) * itemChoose.xp;
                                client.addXPToMate(message.author.id, xpToAdd);
                            }
                        }

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "U T I L I S E R - I T E M",
                            msg
                        ));
                    });
                }else{
                    client.con.query(`UPDATE inventaire SET nb = ${nb} WHERE id = '${message.author.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter cet item dans l'inventaire de <@${message.author.id}>.`
                            ));

                            throw err;
                        }

                        var msg;
                        if(itemChoose.answer) msg = itemChoose.answer;
                        else msg = `:white_check_mark: L'item '${itemChoose.item}' a été utilisé par <@${message.author.id}>.`;
                        if(itemChoose.roleToGiveID) {
                            if(!message.member.roles.find(r => r.id == itemChoose.roleToGiveID)) message.member.addRole(itemChoose.roleToGiveID).catch(console.error);
                        }
                        if(itemChoose.roleToRemoveID) {
                            if(message.member.roles.find(r => r.id == itemChoose.roleToRemoveID)) message.member.removeRole(itemChoose.roleToRemoveID).catch(console.error);
                        }
                        if(message.member.roles.has("674067242555801653") || message.member.roles.has("674067375552856095")) {
                            if(itemChoose.xp) {
                                let xpToAdd = parseInt(args[0]) * itemChoose.xp;
                                client.addXPToMate(message.author.id, xpToAdd);
                            }
                        }

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "U T I L I S E R - I T E M",
                            msg
                        ));
                    });
                }
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=utiliser [quantité] [nom de l'item]``";
};
