const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = (client, messageReaction, user) => {
    if(user.bot) return;
    var message = messageReaction.message;
    if(!client.offres.has(message.id)) return;
    var messageID = client.offres.get(message.id).msgID;

    client.con.query(`SELECT * FROM offres WHERE msgID = '${messageID}'`, (err, rows) => {
        if(err) throw err;

        if(rows.length >= 1) {
            if(messageReaction.emoji == "✅") {
                if(user.id === rows[0].authorID){
                    user.send(addWarnEmbed(
                        client.user.username,
                        client.user.avatarURL,
                        "O F F R E",
                        `:warning: Vous ne pouvez pas acheter votre offre.`
                    ));

                    messageReaction.remove();
                }else{
                    var offer = rows[0];

                    client.con.query(`SELECT * FROM argent WHERE id = '${user.id}';`, (err, rows) => {
                        if(err) {
                            user.send(addWarnEmbed(
                                client.user.username,
                                client.user.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer l'argent de <@${user.id}>.`
                            ));

                            throw err;
                        }

                        if(rows.length < 1) {
                            client.con.query(`INSERT INTO argent VALUES('${user.id}', 0, 0)`, err => { if(err) throw err; });

                            user.send(addWarnEmbed(
                                client.user.username,
                                client.user.avatarURL,
                                "O F F R E",
                                `:warning: Le contenu du porte monnaies de <@${user.id}> est insuffisant pour procéder à l'achat, veuillez retirer de l'argent à la banque.`
                            ));
                        }else{
                            if(parseInt(rows[0].pm) < parseInt(offer.price)) {
                                user.send(addWarnEmbed(
                                    client.user.username,
                                    client.user.avatarURL,
                                    "O F F R E",
                                    `:warning: Le contenu du porte monnaies de <@${user.id}> est insuffisant pour procéder à l'achat, veuillez retirer de l'argent à la banque.`
                                ));
                            }else{
                                client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) - parseInt(offer.price)} WHERE id = '${user.id}';`, err => {
                                    if(err) {
                                        user.send(addWarnEmbed(
                                            client.user.username,
                                            client.user.avatarURL,
                                            "E R R E U R",
                                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour le contenu du porte monnaie de <@${user.id}>.`
                                        ));

                                        throw err;
                                    }

                                    client.con.query(`SELECT * FROM inventaire WHERE id = '${user.id}' AND item = '${offer.item}';`, (err, rows) => {
                                        if(err) {
                                            user.send(addWarnEmbed(
                                                client.user.username,
                                                client.user.avatarURL,
                                                "E R R E U R",
                                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer le contenu de l'inventaire de <@${user.id}>.`
                                            ));
    
                                            throw err;
                                        }

                                        if(rows.length < 1) {
                                            client.con.query(`INSERT INTO inventaire VALUES('${user.id}', '${offer.item}', ${offer.nb});`, err => {
                                                if(err) {
                                                    user.send(addWarnEmbed(
                                                        client.user.username,
                                                        client.user.avatarURL,
                                                        "E R R E U R",
                                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'insérer l'item dans l'inventaire de <@${user.id}>.`
                                                    ));
            
                                                    throw err;
                                                }

                                                message.delete()
                                                    .then(msg => {
                                                        msg.guild.members.get(offer.authorID).send(addEmbed(
                                                            client.user.username,
                                                            client.user.avatarURL,
                                                            "O F F R E",
                                                            `:white_check_mark: **Félicitations !**\nVotre offre contenant l'item {\`\`${offer.nb}\`\`} - '${offer.item}' vient d'être achetée, vous pourrez récupérer votre argent en vous rendant à l'hôtel des ventes.\nIl faudra utiliser la commande \`\`=récupérer-argent\`\``
                                                        ));

                                                        user.send(addEmbed(
                                                            client.user.username,
                                                            client.user.avatarURL,
                                                            "O F F R E",
                                                            `:white_check_mark: **Félicitations !**\nVous venez d'acheter l'offre {\`\`${offer.nb}\`\`} - '${offer.item}', les items sont dorénavant dans votre inventaire.`
                                                        ));
                                                    })
                                                    .catch(console.error);

                                                client.con.query(`DELETE FROM offres WHERE msgID = '${messageID}';`, err => { if(err) throw err; });
                                                client.con.query(`SELECT * FROM offreArgent WHERE id = '${offer.authorID}';`, (err, rows) => {
                                                    if(err) throw err;

                                                    if(rows.length < 1) client.con.query(`INSERT INTO offreArgent VALUES('${offer.authorID}', ${offer.price});`, err => { if(err) throw err; });
                                                    else client.con.query(`UPDATE offreArgent SET money = ${parseInt(rows[0].money) + parseInt(offer.price)} WHERE id = '${offer.authorID}';`, err => { if(err) throw err; });
                                                });

                                                const channel = client.guilds.get("591030658898329639").channels.get("698891700822736967");

                                                channel.send(addEmbed(
                                                    client.user.username,
                                                    client.user.avatarURL,
                                                    "A C H A T - O F F R E",
                                                    `:pencil: L'offre {\`\`${offer.nb}\`\`} - '${offer.item}' de <@${offer.authorID}> a été achetée par <@${user.id}>.`
                                                ));
                                            })
                                        }else{
                                            client.con.query(`UPDATE inventaire SET nb = ${parseInt(rows[0].nb) + parseInt(offer.nb)} WHERE id = '${user.id}' AND item = '${offer.item}';`, err => {
                                                if(err) {
                                                    user.send(addWarnEmbed(
                                                        client.user.username,
                                                        client.user.avatarURL,
                                                        "E R R E U R",
                                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour la quantité de l'item dans l'inventaire de <@${user.id}>.`
                                                    ));
            
                                                    throw err;
                                                }

                                                message.delete()
                                                    .then(msg => {
                                                        msg.guild.members.get(offer.authorID).send(addEmbed(
                                                            client.user.username,
                                                            client.user.avatarURL,
                                                            "O F F R E",
                                                            `:white_check_mark: **Félicitations !**\nVotre offre contenant l'item {\`\`${offer.nb}\`\`} - '${offer.item}' vient d'être achetée, vous pourrez récupérer votre argent en vous rendant à l'hôtel des ventes.\nIl faudra utiliser la commande \`\`=récupérer-argent\`\``
                                                        ));

                                                        user.send(addEmbed(
                                                            client.user.username,
                                                            client.user.avatarURL,
                                                            "O F F R E",
                                                            `:white_check_mark: **Félicitations !**\nVous venez d'acheter l'offre {\`\`${offer.nb}\`\`} - '${offer.item}', les items sont dorénavant dans votre inventaire.`
                                                        ));
                                                    })
                                                    .catch(console.error);

                                                client.con.query(`DELETE FROM offres WHERE msgID = '${messageID}';`, err => { if(err) throw err; });
                                                client.con.query(`SELECT * FROM offreArgent WHERE id = '${offer.authorID}';`, (err, rows) => {
                                                    if(err) throw err;

                                                    if(rows.length < 1) client.con.query(`INSERT INTO offreArgent VALUES('${offer.authorID}', ${offer.price});`, err => { if(err) throw err; });
                                                    else client.con.query(`UPDATE offreArgent SET money = ${parseInt(rows[0].money) + parseInt(offer.price)} WHERE id = '${offer.authorID}';`, err => { if(err) throw err; });
                                                });

                                                const channel = client.guilds.get("591030658898329639").channels.get("698891700822736967");

                                                channel.send(addEmbed(
                                                    client.user.username,
                                                    client.user.avatarURL,
                                                    "A C H A T - O F F R E",
                                                    `:pencil: L'offre {\`\`${offer.nb}\`\`} - '${offer.item}' de <@${offer.authorID}> a été achetée par <@${user.id}>.`
                                                ));
                                            }); 
                                        }
                                    });
                                });
                            }
                        }
                    })
                }
            }else if(messageReaction.emoji == "❌") {
                if(user.id !== rows[0].authorID){
                    user.send(addWarnEmbed(
                        client.user.username,
                        client.user.avatarURL,
                        "O F F R E",
                        `:warning: Seul le joueur <@${user.id}> peut annuler son offre.`
                    ));
                }else{
                    var offer = rows[0];

                    client.con.query(`DELETE FROM offres WHERE msgID = '${messageID}';`, err => {
                        if(err) {
                            user.send(addWarnEmbed(
                                client.user.username,
                                client.user.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de supprimer l'offre de <@${user.id}>.`
                            ));

                            throw err;
                        }

                        client.con.query(`SELECT * FROM inventaire WHERE id = '${user.id}' AND item = '${offer.item}';`, (err, rows) => {
                            if(err) {
                                user.send(addWarnEmbed(
                                    client.user.username,
                                    client.user.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer le contenu de l'inventaire de <@${user.id}>.`
                                ));
    
                                throw err;
                            }

                            if(rows.length < 1) {
                                client.con.query(`INSERT INTO inventaire VALUES('${user.id}', '${offer.item}', ${offer.nb});`, err => { 
                                    if(err) {
                                        user.send(addWarnEmbed(
                                            client.user.username,
                                            client.user.avatarURL,
                                            "E R R E U R",
                                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'insérer l'item dans l'inventaire de <@${user.id}>.`
                                        ));

                                        throw err;
                                    }

                                    user.send(addEmbed(
                                        client.user.username,
                                        client.user.avatarURL,
                                        "A N N U L A T I O N - O F F R E",
                                        `:white_check_mark: L'offre {\`\`${offer.nb}\`\`} - '${offer.item}' de <@${offer.authorID}> a bien été supprimée, vous avez bien récupéré vos items.`
                                    ));

                                    message.delete()
                                        .catch(console.error);

                                    const channel = client.guilds.get("591030658898329639").channels.get("698891700822736967");

                                    channel.send(addEmbed(
                                        client.user.username,
                                        client.user.avatarURL,
                                        "A N N U L A T I O N - O F F R E",
                                        `:x: <@${offer.authorID}> a annulé son offre {\`\`${offer.nb}\`\`} - '${offer.item}'.`
                                    ));
                                });
                            }else{
                                client.con.query(`UPDATE inventaire SET nb = ${parseInt(rows[0].nb) + parseInt(offer.nb)} WHERE id = '${user.id}' AND item = '${offer.item}';`, err => { 
                                    if(err) {
                                        user.send(addWarnEmbed(
                                            client.user.username,
                                            client.user.avatarURL,
                                            "E R R E U R",
                                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour la quantité de l'item dans l'inventaire de <@${user.id}>.`
                                        ));

                                        throw err;
                                    }

                                    user.send(addEmbed(
                                        client.user.username,
                                        client.user.avatarURL,
                                        "A N N U L A T I O N - O F F R E",
                                        `:white_check_mark: L'offre {\`\`${offer.nb}\`\`} - '${offer.item}' de <@${offer.authorID}> a bien été supprimée, vous avez bien récupéré vos items.`
                                    ));

                                    message.delete()
                                        .catch(console.error);

                                    const channel = client.guilds.get("591030658898329639").channels.get("698891700822736967");

                                    channel.send(addEmbed(
                                        client.user.username,
                                        client.user.avatarURL,
                                        "A N N U L A T I O N - O F F R E",
                                        `:x: <@${offer.authorID}> a annulé son offre {\`\`${offer.nb}\`\`} - '${offer.item}'.`
                                    ));
                                });
                            }
                        })
                    });
                }
            }
        }
    });
}