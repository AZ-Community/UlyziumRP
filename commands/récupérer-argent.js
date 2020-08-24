const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "récupérer-argent",
    alias: [ "get-money" ],
    description: "Permet de récupérer les gains de vos ventes à l'hôtel des ventes.",
    run: (client, message, args) => {
        client.con.query(`SELECT * FROM offreArgent WHERE id = '${message.author.id}';`, (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Le bot a rencontré un problème, il est dans l'incapacité de récupérer l'argent de <@${message.author.id}> gagné par les offres.`
                ));

                throw err;
            }

            if(rows.length < 1) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Aucun gain d'argent n'est enregistré pour <@${message.author.id}> dans l'hôtel des ventes.`
                ));
            }else{
                var money = rows[0].money;

                client.con.query(`SELECT * FROM argent WHERE id = '${message.author.id}';`, (err, rows) => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Le bot a rencontré un problème, il est dans l'incapacité de récupérer l'argent de <@${message.author.id}>.`
                        ));
        
                        throw err;
                    }

                    if(rows.length < 1) {
                        client.con.query(`INSERT INTO argent(id, pm, banque) VALUES('${message.author.id}', ${money}, 0)`, err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Le bot a rencontré un problème, il est dans l'incapacité d'insérer l'argent dans le porte monnaies de <@${message.author.id}>.`
                                ));
                
                                throw err;
                            }

                            client.con.query(`DELETE FROM offreArgent WHERE id = '${message.author.id}';`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Le bot a rencontré un problème, il est dans l'incapacité de supprimer la somme d'argent de <@${message.author.id}> dans l'hôtel des ventes.`
                                    ));
                    
                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "R E C U P E R E R - A R G E N T",
                                    `:white_check_mark: <@${message.author.id}> a récupéré ${money} :gem: grâce aux gains des offres vendues.`
                                ));
                            });
                        });
                    }else{
                        client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) + parseInt(money)} WHERE id = '${message.author.id}';`, err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Le bot a rencontré un problème, il est dans l'incapacité de mettre à jour l'argent dans le porte monnaies de <@${message.author.id}>.`
                                ));
                
                                throw err;
                            }

                            client.con.query(`DELETE FROM offreArgent WHERE id = '${message.author.id}';`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Le bot a rencontré un problème, il est dans l'incapacité de supprimer la somme d'argent de <@${message.author.id}> dans l'hôtel des ventes.`
                                    ));
                    
                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "R E C U P E R E R - A R G E N T",
                                    `:white_check_mark: <@${message.author.id}> a récupéré ${money} :gem: grâce aux gains des offres vendues.`
                                ));
                            });
                        });
                    }
                });
            }
        });
    }
};