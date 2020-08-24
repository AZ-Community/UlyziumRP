const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "retirer-item",
    alias: [ "rm-item" ],
    usage: "[tag joueur] [quantité] [nom de l'item]",
    description: "Commande réservée au staff ! Elle permet de retirer un item de l'inventaire d'un joueur.",
    run: (client, message, args) => {
        // Start of error report
        if(!message.guild.member(message.author).hasPermission('KICK_MEMBERS')){ 
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Vous n'avez pas la permission d'utiliser cette commande."
            ));
            return;
        }
        
        if(!args[0]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le tag du joueur."+commandUsage()
            ));
            return;
        }

        // Check if amount is defined
        if(!args[1]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque la quantité à donner au joueur."+commandUsage()
            ));
            return;
        }

        // Check if amount is an integer
        if(!isFinite(args[1]) || args[1] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La quantité de l'item à ajouter est erronée."+commandUsage()
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

        var name = args[2];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 3; i < args.length; i++){
            if(args[i]) name = name + " " + args[i];
        }

        // On retire les emojis et espaces du texte recherché
        name = client.removeInvalidChars(name);

        client.con.query(`SELECT * FROM inventaire WHERE id = '${member.id}';`, async (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer la liste d'items de l'inventaire de <@${member.id}>.`
                ));

                throw err;
            }

            if(rows.length < 1){
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "R E T R A I T - I N V E N T A I R E",
                    `:warning: L'inventaire de <@${member.id}> est vide, impossible de lui retirer un item.`
                ));
            }else{
                var itemsFound = new Array();
                rows.forEach(i => {
                    let itemName = client.removeInvalidChars(i.item);
                    if(itemName.includes(name) || itemName.localeCompare(name) == 0) itemsFound.push({ item: i.item, nb: i.nb });
                });

                var stop = false;

                if(itemsFound.length < 1) {
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        `:warning: La recherche de l'item '${name}' n'a rien trouvé dans l'inventaire de <@${member.id}>, vérifiez votre saisie ou contactez un membre du staff.`
                    ));
                    stop = true;
                }else if(itemsFound.length > 23) {
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        `:warning: La liste d'item trouvée depuis l'inventaire de <@${member.id}> contient trop d'éléments, veuillez affiner votre recherche.`
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
                
                var nb = parseInt(itemChoose.nb) - parseInt(args[1]);

                if(nb < 0) {
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "R E T R A I T - I N V E N T A I R E",
                        `:warning: La quantité de l'item '${itemChoose.item}' que vous tentez de retirer de l'inventaire de <@${member.id}> est trop importante, impossible de le lui retirer.`
                    ));
                }else if(nb == 0) {
                    client.con.query(`DELETE FROM inventaire WHERE id = '${member.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter cet item dans l'inventaire de <@${member.id}>.`
                            ));
            
                            throw err;
                        }

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "R E T R A I T - I N V E N T A I R E",
                            `:white_check_mark: L'item '${itemChoose.item}' a été correctement retiré de l'inventaire de <@${member.id}>.`
                        ));
                    });
                }else{
                    client.con.query(`UPDATE inventaire SET nb = ${nb} WHERE id = '${member.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter cet item dans l'inventaire de <@${member.id}>.`
                            ));
            
                            throw err;
                        }

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "R E T R A I T - I N V E N T A I R E",
                            `:white_check_mark: La quantité de l'item '${itemChoose.item}' a été correctement mise à jour dans l'inventaire de <@${member.id}>.`
                        ));
                    });
                }
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=ajouter-item [tag membre du serveur] [quantité] [nom de l'item]``";
};