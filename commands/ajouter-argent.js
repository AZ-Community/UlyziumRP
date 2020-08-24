const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "ajouter-argent",
    alias: [ "add-money" ],
    usage: "[tag joueur] [quantité] <banque ou pm>",
    description: "Commande réservée au staff ! Elle permet d'ajouter de l'argent par défaut dans le porte monnaie du joueur.",
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

        if(!args[1]) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le montant."+commandUsage()
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

        if(!isFinite(args[1]) || args[1] <= 0){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Le montant à ajouter est erroné."+commandUsage()
            ));
            return;
        }

        client.con.query(`SELECT * FROM argent WHERE id = '${member.id}';`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1) {
                if(args[2] && args[2].toLowerCase() == "banque") { 
                    client.con.query(`INSERT INTO argent VALUES('${member.id}', ${args[1]}, 0);`, err => { 
                        if(err){
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter le montant sur le compte bancaire de <@${member.id}>.`
                            ));

                            throw err; 
                        }

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "A J O U T - A R G E N T",
                            `:white_check_mark: La somme d'argent '${args[1]}' a bien été ajoutée dans la banque de <@${member.id}>.`
                        ));
                    });
                }else{
                    client.con.query(`INSERT INTO argent VALUES('${member.id}', 0, ${args[1]});`, err => { 
                        if(err){
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'ajouter le montant sur le porte monnaie de <@${member.id}>.`
                            ));

                            throw err; 
                        } 

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "A J O U T - A R G E N T",
                            `:white_check_mark: La somme d'argent '${args[1]}' a bien été ajoutée dans le pote monnaie de <@${member.id}>.`
                        ));
                    });
                }
            }else{
                if(args[2] && args[2].toLowerCase() == "banque") {
                    client.con.query(`UPDATE argent SET banque = ${parseInt(rows[0].banque) + parseInt(args[1])} WHERE id = '${member.id}';`, err => { 
                        if(err){
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour le compte bancaire de <@${member.id}>.`
                            ));

                            throw err;
                        }
                        
                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "A J O U T - A R G E N T",
                            `:white_check_mark: La somme d'argent '${args[1]}' a bien été ajoutée dans la banque de <@${member.id}>.`
                        ));
                    });
                }else{
                    client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) + parseInt(args[1])} WHERE id = '${member.id}';`, err => { 
                        if(err){
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour le porte monnaie de <@${member.id}>.`
                            ));

                            throw err;
                        } 

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "A J O U T - A R G E N T",
                            `:white_check_mark: La somme d'argent '${args[1]}' a bien été ajoutée dans le porte monnaie de <@${member.id}>.`
                        ));
                    });
                }
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=ajouter-argent [tag membre du serveur] [montant] <banque ou pm>``";
};