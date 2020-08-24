const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "ajouter-xp-animal",
    alias: [ "add-xp-mate" ],
    usage: "[tag membre du serveur] [valeur]",
    description: "Commande réservée au staff ! Permet l'ajout d'un montant d'XP au compagnon ou au familier d'un joueur.",
    run: (client, message, args) => {
        // Start of error report
        if(!message.guild.member(message.author).hasPermission('KICK_MEMBERS')){ 
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Vous n'avez pas la permission de changer les valeurs d'un joueur."
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
                ":warning: La donnée numérique est incorrecte."+commandUsage()
            ));
            return;
        }

        if(!member.roles.has("674067242555801653") && !member.roles.has("674067375552856095")) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La personne concernée n'est ni un humain ni un elfe, celle-ci n'a donc aucun animal."
            ));
            return;
        }
        // End of error report

        // Execution
        client.con.query(`SELECT * FROM compagnon WHERE id = '${member.id}'`, (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de récupérer les informations du compagon ou du familier de <@${member.id}>.`
                ));

                throw err;
            }

            let xpToLevelUp = 25 * rows[0].level * ( Math.floor(rows[0].level / 5) + 1 );

            if(rows.length < 1) {
                var overXP = 0;
                var xp = parseInt(args[1]);

                if(xp > xpToLevelUp) {
                    overXP = xp - xpToLevelUp;
                    xp = xpToLevelUp;
                }

                client.con.query(`INSERT INTO compagnon VALUES('${member.id}', 1, ${xp}, ${overXP});`, err => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité d'insérer l'XP au compagon ou au familier de <@${member.id}>.`
                        ));

                        throw err;
                    }

                    message.channel.send(addEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "A J O U T - X P - A N I M A L",
                        `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a obtenu ${args[1]} :sparkles:. Félicitations !`
                    ));
                })
            }else{
                let amount = parseInt(rows[0].xp) + parseInt(args[1]);

                if(amount > xpToLevelUp){
                    if(rows[0].overXP != null){
                        var xp = parseInt(args[1]) + parseInt(rows[0].overXP);

                        client.con.query(`UPDATE compagnon SET overXP = ? WHERE id = '${member.id}'`, [xp], err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour l'XP du compagon ou du familier de <@${member.id}>.`
                                ));

                                throw err;
                            }

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "A J O U T - X P - A N I M A L",
                                `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a obtenu ${args[1]} :sparkles:. Félicitations !`
                            ));
                        });
                    }else{
                        amount -= xpToLevelUp;
                        client.con.query(`UPDATE compagnon SET xp = ?, overXP = ? WHERE id = '${member.id}'`, [xpToLevelUp, amount], err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour l'XP du compagon ou du familier de <@${member.id}>.`
                                ));

                                throw err;
                            }

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "A J O U T - X P - A N I M A L",
                                `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a obtenu ${args[1]} :sparkles:. Félicitations !`
                            ));
                        });
                    }
                }else{
                    if(rows[0].overXP != null){
                        amount += rows[0].overXP;
                        if(amount > xpToLevelUp){
                            amount -= xpToLevelUp;
                            client.con.query(`UPDATE compagnon SET xp = ?, overXP = ? WHERE id = '${member.id}'`, [xpToLevelUp, amount], err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour l'XP du compagon ou du familier de <@${member.id}>.`
                                    ));

                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "A J O U T - X P - A N I M A L",
                                    `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a obtenu ${args[1]} :sparkles:. Félicitations !`
                                ));
                            });
                        }else{
                            client.con.query(`UPDATE compagnon SET xp = ?, overXP = ? WHERE id = '${member.id}'`, [amount, null], err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour l'XP du compagon ou du familier de <@${member.id}>.`
                                    ));

                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "A J O U T - X P - A N I M A L",
                                    `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a obtenu ${args[1]} :sparkles:. Félicitations !`
                                ));
                            });
                        }
                    }else{
                        client.con.query(`UPDATE compagnon SET xp = ? WHERE id = '${member.id}'`, [amount], err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de mettre à jour l'XP du compagon ou du familier de <@${member.id}>.`
                                ));

                                throw err;
                            }

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "A J O U T - X P - A N I M A L",
                                `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a obtenu ${args[1]} :sparkles:. Félicitations !`
                            ));
                        });
                    }
                }
            }
        });

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=ajouter-xp-animal [tag membre du serveur] [valeur]``";
};
