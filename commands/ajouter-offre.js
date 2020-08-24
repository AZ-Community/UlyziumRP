const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "ajouter-offre",
    alias: [ "add-offer" ],
    usage: "[prix] [quantité] [nom de l'item]",
    description: "Permet de créer une offre dans l'hôtel des ventes.",
    run: (client, message, args) => {
        if(!args[0]){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le prix des items."+commandUsage()
            ));
            return;
        }

        // Check if amount is an integer
        if(!isFinite(args[0]) || args[0] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Le prix de l'item à mettre en offre est erronée."+commandUsage()
            ));
            return;
        }

        if(!args[1]){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque la quantité de l'item."+commandUsage()
            ));
            return;
        }

        // Check if amount is an integer
        if(!isFinite(args[1]) || args[1] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La quantité de l'item à mettre en offre est erronée."+commandUsage()
            ));
            return;
        }
        

        if(!args[2]){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le nom de l'item."+commandUsage()
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
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Le bot a rencontré un problème, il est dans l'incapacité de récupérer l'inventaire de <@${message.author.id}>.`
                ));

                throw err;
            }

            if(rows.length < 1) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "I N V E N T A I R E - V I D E",
                    `:warning: L'inventaire de <@${message.author.id}> est vide, impossible de créer une offre.`
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

                    await message.channel.awaitMessages(filter, {max:1, time:180000})
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
                        ":warning: La quantité que vous tentez de mettre dans cette offre est supérieure à celle que vous avez dans votre inventaire."
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

                const channel = client.guilds.get("591030658898329639").channels.get("696874799074639872");
                
                channel.send(addEmbed(
                        client.user.username,
                        client.user.avatarURL,
                        "O F F R E",
                        `:page_facing_up: <@${message.author.id}> a mit en vente {\`\`${args[1]}\`\`} - '${itemChoose.item}' pour ${args[0]} :gem:.\n\n**Instructions :**\n✅ -> Cette réaction permet d'acheter l'offre.\n❌ -> Celle-ci permet au propriétaire de l'offre de l'annuler.`
                    ))
                    .then(msg => {
                        client.con.query(`INSERT INTO offres VALUES('${msg.id}', '${message.author.id}', ${args[0]}, '${itemChoose.item}', ${args[1]});`, err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot n'a pas pu insérer l'offre de <@${message.author.id}>.`
                                ));
        
                                throw err;
                            }

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "O F F R E",
                                `:white_check_mark: L'offre {\`\`${args[1]}\`\`} - '${itemChoose.item}' pour ${args[0]} :gem: de <@${message.author.id}> a bien été créée.`
                            ));
                            
                            msg.react("✅");
                            msg.react("❌");

                            client.offres.set(msg.id, { msgID: msg.id, authorID: message.author.id, price: args[0], item: itemChoose.item, nb: args[1] });
                        });
                    })
                    .catch(err => {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Un problème a été rencontré, le bot n'a pas pu créer le message de l'offre de <@${message.author.id}>.`
                        ));
                        console.error(err);
                    });
            }
        });
    }
}

function commandUsage() {
    return "\n\n**Utilisation :** ``=ajouter-offre [prix] [quantité] [nom de l'item]``";
}