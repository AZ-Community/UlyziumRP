const { addWarnEmbed, addCoffreEmbed } = require('../tools/embed.js');

module.exports = {
    name: "coffre",
    alias: [ "safe" ],
    usage: "[type du coffre]",
    description: "Permet d'ouvrir un coffre avec une clé.",
    run: (client, message, args) => {
        if(!args[0]){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Le nom du coffre est incorrect, voici la liste :\népique,\nlégendaire,\nmythique"
            ));
            return;
        }

        if(!client.coffres.has(args[0])){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Le nom du coffre est incorrect, voici la liste :\népique,\nlégendaire,\nmythique"
            ));
            return;
        }

        const itemName = {
            "épique": "[ :key2: ] Clé-Épique :purple_circle:",
            "mythique": "[ :key2: ] Clé-Mythique :yellow_circle:",
            "légendaire": "[ :key2: ] Clé-Légendaire :orange_circle:"
        };

        client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}' AND item = '${itemName[args[0]]}';`, (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Le bot a rencontré un problème, il est dans l'incapacité de vérifier l'inventaire de <@${message.author.id}>.`
                ));

                throw err;
            }

            if(rows.length < 1) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: L'inventaire de <@${message.author.id}> n'a pas l'item permettant d'ouvrir ce type de coffre '${itemName[args[0]]}'.`
                ));
            }else{
                const info = client.coffres.get(args[0]);
                var prob = Math.random();
                var reward;
                var item;
        
                for(let i = 0; i < info.rewards.length; i++){
                    if(prob >= info.rewards[i].prob){
                        item = info.rewards[i];
                        reward = `꒱ ˊˎ- | 🎲 | L O O T  ~ > {${item.amount}} ${item.title}`;
                    }
                }

                if((item.title.toLowerCase()).includes("zium-pure")) {
                    client.con.query(`SELECT * FROM argent WHERE id = '${message.author.id}';`, (err, rows) => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer le contenu du porte monnaie de <@${message.author.id}>.`
                            ));
        
                            throw err;
                        }
        
                        if(rows.length < 1) {
                            client.con.query(`INSERT INTO argent VALUES('${message.author.id}', ${parseInt(item.amount) * 1000}, 0)`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'insérer le montant dans le porte monnaie de <@${message.author.id}>.`
                                    ));
        
                                    throw err;
                                }
                            });
                        }else{
                            client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) + parseInt(item.amount) * 1000} WHERE id = '${message.author.id}';`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter le montant dans le porte monnaie de <@${message.author.id}>.`
                                    ));
        
                                    throw err;
                                }
                            });
                        }
                    });
                }else{
                    client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}' AND item = '${item.title}';`, (err, rows) => {
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
                            client.con.query(`INSERT INTO inventaire VALUES('${message.author.id}', '${item.title}', ${item.amount});`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'insérer l'item dans l'inventaire de <@${message.author.id}>.`
                                    ));
                
                                    throw err;
                                }
                            });
                        }else{
                            client.con.query(`UPDATE inventaire SET nb = ${parseInt(rows[0].nb) + parseInt(item.amount)} WHERE id = '${message.author.id}' AND item = '${item.title}';`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter l'item dans l'inventaire de <@${message.author.id}>.`
                                    ));
                
                                    throw err;
                                }
                            });
                        }
                    });
                }

                if(rows[0].nb == 1) {
                    client.con.query(`DELETE FROM inventaire WHERE id = '${message.author.id}' AND item = '${itemName[args[0]]}';`, err => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de supprimer l'item '${itemName[args[0]]}' de l'inventaire de <@${message.author.id}>.`
                            ));

                            throw err;
                        }

                        message.channel.send(addCoffreEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            info.title,
                            reward
                        ));
                    });
                }else{
                    client.con.query(`UPDATE inventaire SET nb = ${parseInt(rows[0].nb) - 1} WHERE id = '${message.author.id}' AND item = '${itemName[args[0]]}';`, err => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour la quantité de l'item '${itemName[args[0]]}' de l'inventaire de <@${message.author.id}>.`
                            ));

                            throw err;
                        }

                        message.channel.send(addCoffreEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            info.title,
                            reward
                        ));
                    });
                }
            }
        })

        return;
    }
}