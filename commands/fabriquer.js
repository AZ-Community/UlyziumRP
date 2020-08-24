const { addWarnEmbed, addEmbed } = require('../tools/embed.js');
const { Collection } = require("discord.js");

module.exports = {
    name: "fabriquer",
    alias: [ "craft" ],
    usage: "[quantité] [nom de l'item]",
    description: "Permet de fabriquer un item à partir d'objets de votre inventaire.",
    run: async (client, message, args) => {
        if(!args[0]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque la quantité de l'item à créer."+commandUsage()
            ));
            return;
        }

        // Check if amount is an integer
        if(!isFinite(args[0]) || args[0] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La quantité de l'item à créer est erronée."+commandUsage()
            ));
            return;
        }

        if(!args[1]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le nom de l'item à créer."+commandUsage()
            ));
            return;
        }

        var name = args[1];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 2; i < args.length; i++){
            if(args[i]) name = name + " " + args[i];
        }

        // On retire les emojis et espaces du texte recherché
        name = client.removeInvalidChars(name);

        var itemsFound = new Array();
        const itemsName = Array.from(client.items.keys());
        itemsName.forEach(itemName => {
            if(itemName.includes(name) || itemName.localeCompare(name) == 0) {
                let itemInfo = client.items.get(itemName);
                if(itemInfo.craftable) {
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

            var collected = await message.channel.awaitMessages(filter, { max:1, time: 10000, errors: ['time'] })
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

            console.log(collected);
            
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
        }

        if(stop) return;

        client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}';`, (err, rows) => {
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
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "I N V E N T A I R E - V I D E",
                    `:warning: L'inventaire de <@${message.author.id}> est vide, il ne dispose pas des items requis pour fabriquer l'objet demandé.`
                ));
            }else{
                var hasItems = true;
                var playerItems = new Collection();
                for(let i = 0; i < rows.length; i++) {
                    playerItems.set(rows[i].item, rows[i].nb);
                }

                for(let i = 0; i < itemChoose.craft.length && hasItems; i++) {
                    let nb = playerItems.get(itemChoose.craft[i].item);
                    if( ( nb === undefined ) || parseInt(nb) < (parseInt(itemChoose.craft[i].amount)*parseInt(args[0])) ) hasItems = false; 
                }

                if(!hasItems) {
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "R E F U S - F A B R I C A T I O N",
                        `:warning: L'inventaire de <@${message.author.id}> ne contient pas tous les items requis par la fabrication de l'objet demandé.`
                    ));
                }else{
                    for(let i = 0; i < itemChoose.craft.length; i++) {
                        var nb = playerItems.get(itemChoose.craft[i].item);
                        var nbItemNeeded = parseInt(itemChoose.craft[i].amount)*parseInt(args[0]);

                        if(parseInt(nb) == nbItemNeeded) {
                            client.con.query(`DELETE FROM inventaire WHERE id = '${message.author.id}' AND item = '${itemChoose.craft[i].item}';`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de supprimer l'item '${itemChoose.craft[i].item}' de l'inventaire de <@${message.author.id}>.`
                                    ));

                                    throw err;
                                }
                            });
                        }else{
                            client.con.query(`UPDATE inventaire SET nb = ${parseInt(nb) - nbItemNeeded} WHERE id = '${message.author.id}' AND item = '${itemChoose.craft[i].item}';`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer la quantité de l'item '${itemChoose.craft[i].item}' de l'inventaire de <@${message.author.id}>.`
                                    ));

                                    throw err;
                                }
                            });
                        }
                    }

                    if(playerItems.has(itemChoose.item)) {
                        var nbItem = playerItems.get(itemChoose.item);

                        client.con.query(`UPDATE inventaire SET nb = ${parseInt(nbItem) + parseInt(args[0])} WHERE id = '${message.author.id}' AND item = '${itemChoose.item}';`, err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter l'item '${itemChoose.item}' dans l'inventaire de <@${message.author.id}>.`
                                ));

                                throw err;
                            }

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "F A B R I C A T I O N",
                                `:white_check_mark: <@${message.author.id}> a utilisé des items de son inventaire pour fabriquer {${args[0]}} - '${itemChoose.item}'.`
                            ));
                        });
                    }else{
                        client.con.query(`INSERT INTO inventaire VALUES('${message.author.id}', '${itemChoose.item}', ${parseInt(args[0])})`, err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'insérer l'item '${itemChoose.item}' dans l'inventaire de <@${message.author.id}>.`
                                ));

                                throw err;
                            }

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "F A B R I C A T I O N",
                                `:white_check_mark: <@${message.author.id}> a utilisé des items de son inventaire pour fabriquer {${args[0]}} - '${itemChoose.item}'.`
                            ));
                        });
                    }
                }
            }
        });
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=fabriquer [quantité] [nom de l'item]``";
};