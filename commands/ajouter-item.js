const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "ajouter-item",
    alias: [ "add-item" ],
    usage: "[tag joueur] [quantité] [nom de l'item]",
    description: "Commande réservée au staff ! Elle permet d'ajouter un item à l'inventaire d'un joueur.",
    run: async (client, message, args) => {
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

        var itemsFound = new Array();
        const itemsName = Array.from(client.items.keys());
        itemsName.forEach(itemName => {
            if(itemName.includes(name) || itemName.localeCompare(name) == 0) {
                let itemInfo = client.items.get(itemName);
                itemInfo.item = itemInfo.name;
                itemsFound.push(itemInfo);
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
        }

        if(stop) return;

        client.con.query(`SELECT * FROM inventaire WHERE id = '${member.id}' AND item = '${itemChoose.item}';`, (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter cet item à l'inventaire de <@${member.id}>.`
                ));

                throw err;
            }

            if(rows.length < 1){
                client.con.query(`INSERT INTO inventaire VALUES('${member.id}', '${itemChoose.item}', ?)`, [args[1]], (err, rows) => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter cet item à l'inventaire de <@${member.id}>.`
                        ));

                        throw err;
                    }

                    message.channel.send(addEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "A J O U T - I N V E N T A I R E",
                        `:white_check_mark: L'item '${itemChoose.item}' a bien été ajouté dans l'inventaire de <@${member.id}>.`
                    ));
                });
            }else{
                var nb = parseInt(rows[0].nb) + parseInt(args[1]);
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
                        "A J O U T - I N V E N T A I R E",
                        `:white_check_mark: La quantité de l'item '${itemChoose.item}' a été correctement mise à jour dans l'inventaire de <@${member.id}>.`
                    ));
                });
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=ajouter-item [tag membre du serveur] [quantité] [nom de l'item]``";
};
