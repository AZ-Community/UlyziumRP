const { addWarnEmbed, addLootDesc } = require('../tools/embed.js');
const { Collection } = require("discord.js");

module.exports = {
    name: "loot",
    alias: [ "l" ],
    usage: "[nom du mob]",
    description: "Retourne aléatoirement des récompenses spécifiques au mob spécifié.",
    run: (client, message, args) => {
        var nom = args[0];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 1; i < args.length; i++){
            if(args[i]) nom = nom + " " + args[i];
        }

        // Start of error report
        if(!client.mobs.has(nom)){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Nous n'avons pas trouvé le type de créature demandé, prenez connaissance des mobs utilisables dans ``=bestiaire [zone] <numéro de page>``." + commandUsage()
            ));
            return;
        }
        // End of error report

        // Execution
        client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}';`, (err, rows) => {
            const loot = (client.mobs.get(nom)).getLoots();
            var msg = "**L o O t**\n:sparkles:\n----------\n| ``"+ nom +"``\n----------";
            const math = Math;

            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer le contenu de l'inventaire de <@${message.author.id}>.`
                ));

                msg = msg+"\nFaites une demande pour recevoir vos loots.";

                for(let i = 0; i < loot.length; i++){
                    const prob = math.random();
                    const probApparition = loot[i].prob;
                    const def = loot[i].default;
                    var nb = 0;
            
                    if(prob>=probApparition){
                        if(loot[i].title === "ziums") nb = math.floor(def-def*0.1*math.random())
                        else nb = math.floor(1 + def * math.random());
                    }
            
                    if( nb > 0 ) msg = msg + "\n " + loot[i].title + " : " + nb;
                }

                message.channel.send(msg);

                throw err;
            }

            var sql = "";
            var isQuery = false;

            if(rows.length < 1) {
                for(let i = 0; i < loot.length; i++){
                    const prob = math.random();
                    const probApparition = loot[i].prob;
                    const def = loot[i].default;
            
                    if(prob>=probApparition){
                        if(loot[i].title === "ziums") {
                            var nbMoney = math.floor(def-def*0.1*math.random());
                            msg = msg + "\n " + loot[i].icon + " " + loot[i].title + " : " + nbMoney;

                            // Ajout de l'argent au porte monnaie du joueur
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
                                    client.con.query(`INSERT INTO argent VALUES('${message.author.id}', ${nbMoney}, 0);`, err => {
                                        if(err) {
                                            message.channel.send(addWarnEmbed(
                                                message.author.username,
                                                message.author.avatarURL,
                                                "E R R E U R",
                                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter de l'argent dans le porte monnaie de <@${message.author.id}>.`
                                            ));

                                            throw err;
                                        }
                                    });
                                }else {
                                    client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) + parseInt(nbMoney)} WHERE id = '${message.author.id}';`, err => {
                                        if(err) {
                                            message.channel.send(addWarnEmbed(
                                                message.author.username,
                                                message.author.avatarURL,
                                                "E R R E U R",
                                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter de l'argent dans le porte monnaie de <@${message.author.id}>.`
                                            ));

                                            throw err;
                                        }
                                    })
                                }
                            });
                        }else{ 
                            var nb = math.floor(1 + def * math.random());

                            if( nb > 0 ) {
                                sql = `${sql}INSERT INTO inventaire VALUES('${message.author.id}', '${loot[i].title}', ${nb}); `;
                                msg = msg + "\n " + loot[i].title + " : " + nb;
                                isQuery = true;
                            }
                        }
                    }
                }
            }else{
                var tabNameItem = new Collection();
                rows.forEach(row => {
                    tabNameItem.set(row.item, row.nb);
                })

                for(let i = 0; i < loot.length; i++){
                    const prob = math.random();
                    const probApparition = loot[i].prob;
                    const def = loot[i].default;
            
                    if(prob>=probApparition){
                        if(loot[i].title === "ziums") {
                            var nbMoney = math.floor(def-def*0.1*math.random());
                            msg = msg + "\n " + loot[i].icon + " " + loot[i].title + " : " + nbMoney;

                            // Ajout de l'argent au porte monnaie du joueur
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
                                    client.con.query(`INSERT INTO argent VALUES('${message.author.id}', ${nbMoney}, 0);`, err => {
                                        if(err) {
                                            message.channel.send(addWarnEmbed(
                                                message.author.username,
                                                message.author.avatarURL,
                                                "E R R E U R",
                                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter de l'argent dans le porte monnaie de <@${message.author.id}>.`
                                            ));

                                            throw err;
                                        }
                                    })
                                }else {
                                    client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) + parseInt(nbMoney)} WHERE id = '${message.author.id}';`, err => {
                                        if(err) {
                                            message.channel.send(addWarnEmbed(
                                                message.author.username,
                                                message.author.avatarURL,
                                                "E R R E U R",
                                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter de l'argent dans le porte monnaie de <@${message.author.id}>.`
                                            ));

                                            throw err;
                                        }
                                    })
                                }
                            });
                        }else {
                            var nb = math.floor(1 + def * math.random());

                            if( nb > 0 ) {
                                if(tabNameItem.has(loot[i].title)) sql = `${sql}UPDATE inventaire SET nb = ${parseInt(tabNameItem.get(loot[i].title)) + parseInt(nb)} WHERE id = '${message.author.id}' AND item = '${loot[i].title}'; `;
                                else sql = `${sql}INSERT INTO inventaire VALUES('${message.author.id}', '${loot[i].title}', ${nb}); `;
                                msg = msg + "\n " + loot[i].title + " : " + nb;
                                isQuery = true;
                            }
                        }
                    }
                }
            }
            
            if(isQuery) {
                client.con.query(sql, (err, rows) => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter et/ou de mettre à jour l'inventaire de <@${message.author.id}> avec les loots.`
                        ));

                        throw err;
                    }
                });
            }

            message.channel.send(msg);
        });

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=loot [nom du mob]``";
};