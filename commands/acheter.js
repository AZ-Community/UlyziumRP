const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "acheter",
    alias: [ "buy" ],
    usage: "[quantité] [nom de l'item]",
    description: "Elle permet d'acheter des items au marchand.",
    run: async (client, message, args) => {
        if(!args[0]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque la quantité à acheter."+commandUsage()
            ));
            return;
        }

        // Check if amount is an integer
        if(!isFinite(args[0]) || args[0] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La quantité de l'item à acheter est erronée."+commandUsage()
            ));
            return;
        }

        // Check if amount is defined
        if(!args[1]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le nom de l'item à acheter."+commandUsage()
            ));
            return;
        }

        var name = args[1];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 3; i < args.length; i++){
            if(args[i]) name = name + " " + args[i];
        }

        // On retire les emojis et espaces du texte recherché
        name = client.removeInvalidChars(name);

        var itemsFound = new Array();
        const itemsName = Array.from(client.items.keys());
        itemsName.forEach(itemName => {
            if(itemName.includes(name) || itemName.localeCompare(name) == 0) {
                let itemInfo = client.items.get(itemName);

                // On ne garde dans la liste que les items pouvant être achetés aux marchands
                if(itemInfo.purchasable) {
                    itemInfo.item = itemInfo.name;
                    itemsFound.push(itemInfo);
                }
            }
        });

        var itemChoose = itemsFound[0];
        var stop = false;

        if(itemsFound.length < 1) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: L'item recherché n'existe pas dans notre liste ou n'est pas achetable, vérifiez votre saisie ou contactez un membre du staff."
            ));
            stop = true;
        }else if(itemsFound.length > 23) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La liste d'items trouvée contient trop d'éléments, veuillez affiner votre recherche."
            ));
            stop = true;
        }else if(itemsFound.length > 1){
            const filter = m => m.author.id === message.author.id;
            client.wait.set("chooseItem"+message.author.id, new Date());

            var msg = "**Veuillez choisir un item à acheter ( pour annuler, marquez stop ) :**\n";
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
                            ":white_check_mark: L'achat a été annulé."
                        ));
                        stop = true;
                        client.wait.delete("buyItem"+message.author.id);
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
                        client.wait.delete("buyItem"+message.author.id);
                        return;
                    }

                    itemChoose = itemsFound[nbChoose-1];

                    client.wait.delete("buyItem"+message.author.id);
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
                    client.wait.delete("buyItem"+message.author.id);
                    return;
                });
        }

        if(stop) return;

        client.con.query(`SELECT * FROM argent WHERE id = '${message.author.id}';`, (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer l'argent de <@${message.author.id}>.`
                ));

                throw err;
            }

            if(rows.length < 1) {
                client.con.query(`INSERT INTO argent VALUES('${message.author.id}', 0, 0);`, err => { if(err) throw err; });
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot a créé un compte bancaire pour <@${message.author.id}>. Veuillez réitérer votre commande.`
                ));
            }else{
                if(itemChoose.price * parseInt(args[0]) > rows[0].pm) {
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        `:warning: Vous n'avez pas assez d'argent dans votre porte monnaies, allez en retirer à la banque.`
                    ));
                }else{
                    client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) - parseInt(args[0]) * parseInt(itemChoose.price)} WHERE id = '${message.author.id}';`, (err, rows) => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de déduire le prix de l'achat de l'argent de <@${message.author.id}>.`
                            ));

                            throw err;
                        }

                        client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer le contenu de l'inventaire de <@${message.author.id}>.`
                                ));

                                throw err;
                            }

                            if(rows.length < 1) {
                                client.con.query(`INSERT INTO inventaire VALUES('${message.author.id}', '${itemChoose.item}', ?)`, [args[0]], (err, rows) => {
                                    if(err) {
                                        message.channel.send(addWarnEmbed(
                                            message.author.username,
                                            message.author.avatarURL,
                                            "E R R E U R",
                                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajoutr l'item acheté dans l'inventaire de <@${message.author.id}>.`
                                        ));

                                        throw err;
                                    }

                                    message.channel.send(addEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "A C H A T",
                                        `:white_check_mark: <@${message.author.id}> a acheté ${args[0]} - '${itemChoose.item}'.`
                                    ));
                                });
                            }else{
                                client.con.query(`UPDATE inventaire SET nb = ${parseInt(rows[0].nb) + parseInt(args[0])} WHERE id = '${message.author.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                                    if(err) {
                                        message.channel.send(addWarnEmbed(
                                            message.author.username,
                                            message.author.avatarURL,
                                            "E R R E U R",
                                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour la quantité achetée de l'item dans l'inventaire de <@${message.author.id}>.`
                                        ));

                                        throw err;
                                    }

                                    message.channel.send(addEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "A C H A T",
                                        `:white_check_mark: <@${message.author.id}> a acheté ${args[0]} - '${itemChoose.item}'.`
                                    ));
                                });
                            }
                        });
                    });
                }
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=acheter [quantité] [nom de l'item]``";
};
