const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "donner-item-test",
    alias: [ "give-item" ],
    usage: "[tag joueur] [quantité] [nom de l'item]",
    description: "Elle permet de donner une partie ou l'intégralité d'un item se trouvant dans votre inventaire à autrui.",
    run: (client, message, args) => {
        if( !args[0] ) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le tag d'un joueur."+commandUsage()
            ));
            return;
        }

        if( !args[1] ){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque la quantité à donner."+commandUsage()
            ));
            return;
        }

        if( !args[2] ){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le nom de l'item à donner."+commandUsage()
            ));
            return;
        }

        // Check if is a real user
        const user = message.mentions.users.first();
        if(!user){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Ceci n'est pas un joueur."+commandUsage()
            ));
            return;
        }

        // Check if user is a guild member
        const member = message.guild.member(user);
        if(!member){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Ce joueur n'est pas un membre du serveur."+commandUsage()
            ));
            return;
        }

        if(member.id == message.author.id) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Vous ne pouvez vous donner d'item à vous-même."+commandUsage()
            ));
            return;
        }

        if(!isFinite(args[1]) || args[1] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Le montant à ajouter est erroné."+commandUsage()
            ));
            return;
        }

        var name = args[2];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 3; i < args.length; i++){
            if(args[i]) name = name + " " + args[i];
        }

        // On retire les emojis et espaces du texte recherché
        name = client.removeInvalidChars(name);

        client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}';`, async (err, rows) => {
            if(err){
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot n'a pas pu récupérer le contenu de l'inventaire de '${message.author.id}'.`
                ));

                throw err;
            }

            if(rows.length < 1) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "D O N A T I O N - I N V E N T A I R E",
                    `:warning: L'inventaire de '${message.author.id}' est vide, impossible de donner un item.`
                ));
            }else{
                var itemsFound = [];
                var itemChoose;
                rows.forEach(inventaire => {
                    let itemName = client.removeInvalidChars(inventaire.item);
                    if(itemName.includes(name) || itemName.localeCompare(name) == 0) itemsFound.push({ item: inventaire.item, nb: inventaire.nb });
                });

                if(itemsFound.length < 1){
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: Nous n'avons trouvé aucun item correspondant à votre demande dans votre inventaire."
                    ));
                    return;
                }else if(itemsFound.length > 23){
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: Nous avons trouvé trop d'items correspondant à votre demande dans votre inventaire, veuillez affiner votre recherche."
                    ));
                    return;
                }else if(itemsFound.length == 1){
                    itemChoose = itemsFound[0];
                }else if(itemsFound.length > 1){
                    //TODO faire la liste avec choix que l'on sauvegarde dans itemChoose
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

                            rows.forEach(i => {
                                if( itemsFound[nbChoose-1].item == i.item) {
                                    itemChoose = i;
                                    return
                                }
                            })

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

                if( itemChoose.nb < args[1] ){
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: La quantité que vous tentez de donner est supérieure à celle que vous avez dans votre inventaire."
                    ));
                    return;
                }

                var amount = parseInt(itemChoose.nb) - parseInt(args[1])
                if( amount == 0 ) {
                    client.con.query(`DELETE FROM inventaire WHERE id = '${message.author.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                        if(err){
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot n'a pas pu retirer les items de l'inventaire de <@${message.author.id}>.`
                            ));

                            throw err;
                        }
                    });
                }else{
                    client.con.query(`UPDATE inventaire SET nb = ${amount} WHERE id = '${message.author.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                        if(err){
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot n'a pas pu mettre à jour le nombre d'items de l'inventaire de <@${message.author.id}>.`
                            ));

                            throw err;
                        }
                    });
                }

                client.con.query(`SELECT * FROM inventaire WHERE id = '${member.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                    if(err){
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Un problème a été rencontré, le bot n'a pas pu retrouver les items de l'inventaire de <@${member.id}>.`
                        ));

                        throw err;
                    }

                    if(rows.length < 1){
                        client.con.query(`INSERT INTO inventaire VALUES('${member.id}', '${itemChoose.item}', ?)`, [args[1]], (err, rows) => {
                            if(err){
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot n'a pas pu ajouté les items dans l'inventaire de <@${member.id}>.`
                                ));

                                throw err;
                            }
                        });
                    }else{
                        var amount = parseInt(rows[0].nb) + parseInt(args[1])
                        client.con.query(`UPDATE inventaire SET nb = ${amount} WHERE id = '${member.id}' AND item ='${itemChoose.item}';`, (err, rows) => {
                            if(err){
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot n'a pas pu mettre à jour la quantité de l'item dans l'inventaire de <@${member.id}>.`
                                ));

                                throw err;
                            }
                        });
                    }

                    message.channel.send(addEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "D O N A T I O N - I N V E N T A I R E",
                        `:white_check_mark: <@${message.author.id}> a donné ${args[1]} ${itemChoose.item} à <@${member.id}>.`
                    ));
                });
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=donner-item [tag membre du serveur] [quantité] [nom de l'item]``";
};
