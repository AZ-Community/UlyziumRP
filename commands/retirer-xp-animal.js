const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "retirer-xp-animal",
    alias: [ "rm-xp-mate" ],
    usage: "[tag membre du serveur] [valeur]",
    description: "Commande réservée au staff ! Permet le retrait d'un montant d'XP au compagnon ou au familier d'un joueur.",
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

            if(rows.length < 1) {
                client.con.query(`INSERT INTO compagnon VALUES('${member.id}', 1, 0, 0);`, err => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer l'XP au compagon ou au familier de <@${member.id}>.`
                        ));

                        throw err;
                    }

                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        `:warning: Impossible de retirer de l'XP au familier ou au compagnon de <@${member.id}>, celui-ci est niveau 1 avec 0 XP.`
                    ));
                })
            }else{
                let amount = parseInt(rows[0].xp) - parseInt(args[1]);
                
                if(rows[0].overXP != null){
                    amount += rows[0].overXP;
                    let xpMax = 25 * rows[0].level * ( Math.floor(rows[0].level / 5) + 1 );

                    if(amount < 0){
                        if(rows[0].level > 1){
                            let lvl = rows[0].level - 1;
                            let xpMaxPredLvl = 25 * lvl * ( Math.floor(lvl / 5) + 1 );
                            amount += xpMaxPredLvl;

                            while(amount < 0){
                                if(lvl == 1){
                                    xpMaxPredLvl = 25 * lvl * ( Math.floor(lvl / 5) + 1 );
                                    amount += xpMaxPredLvl;
                                    if(amount < 0){
                                        amount = 0;
                                        break;
                                    }
                                }else{
                                    lvl--;
                                    xpMaxPredLvl = 25 * lvl * ( Math.floor(lvl / 5) + 1 );
                                    amount += xpMaxPredLvl;
                                }
                            }

                            client.con.query(`UPDATE compagnon SET xp = ?, level = ?, overXP = ? WHERE id = '${member.id}'`, [amount, lvl, null], err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer l'XP au compagon ou au familier de <@${member.id}>.`
                                    ));
            
                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "R E T R A I T - X P - A N I M A L",
                                    `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a perdu ${args[1]} :sparkles:.`
                                ));
                            });
                        }else{
                            client.con.query(`UPDATE compagnon SET xp = ?, overXP = ? WHERE id = '${member.id}'`, [0, null], err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer l'XP au compagon ou au familier de <@${member.id}>.`
                                    ));
            
                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "R E T R A I T - X P - A N I M A L",
                                    `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a perdu ${args[1]} :sparkles:.`
                                ));
                            });
                        }
                    }else{
                        if(amount > xpMax){
                            amount -= xpMax;

                            client.con.query(`UPDATE compagnon SET xp = ?, overXP = ? WHERE id = '${member.id}'`, [xpMax, amount], err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer l'XP au compagon ou au familier de <@${member.id}>.`
                                    ));
            
                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "R E T R A I T - X P - A N I M A L",
                                    `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a perdu ${args[1]} :sparkles:.`
                                ));
                            });
                        }else{
                            client.con.query(`UPDATE compagnon SET xp = ?, overXP = ? WHERE id = '${member.id}'`, [amount, null], err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer l'XP au compagon ou au familier de <@${member.id}>.`
                                    ));
            
                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "R E T R A I T - X P - A N I M A L",
                                    `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a perdu ${args[1]} :sparkles:.`
                                ));
                            });
                        }
                    }
                }else{
                    if(amount < 0){
                        if(rows[0].level > 1){
                            let lvl = rows[0].level - 1;
                            let xpMaxPredLvl = 25 * lvl * ( Math.floor(lvl / 5) + 1 );
                            amount += xpMaxPredLvl;

                            while(amount < 0){
                                if(lvl == 1){
                                    xpMaxPredLvl = 25 * lvl * ( Math.floor(lvl / 5) + 1 );
                                    amount += xpMaxPredLvl;
                                    if(amount < 0){
                                        amount = 0;
                                        break;
                                    }
                                }else{
                                    lvl--;
                                    xpMaxPredLvl = 25 * lvl * ( Math.floor(lvl / 5) + 1 );
                                    amount += xpMaxPredLvl;
                                }
                            }

                            client.con.query(`UPDATE compagnon SET xp = ?, level = ? WHERE id = '${member.id}'`, [amount, lvl], err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer l'XP au compagon ou au familier de <@${member.id}>.`
                                    ));
            
                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "R E T R A I T - X P - A N I M A L",
                                    `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a perdu ${args[1]} :sparkles:.`
                                ));
                            });
                        }else{
                            client.con.query(`UPDATE compagnon SET xp = 0 WHERE id = '${member.id}'`, err => {
                                if(err) {
                                    message.channel.send(addWarnEmbed(
                                        message.author.username,
                                        message.author.avatarURL,
                                        "E R R E U R",
                                        `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer l'XP au compagon ou au familier de <@${member.id}>.`
                                    ));
            
                                    throw err;
                                }

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "R E T R A I T - X P - A N I M A L",
                                    `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a perdu ${args[1]} :sparkles:.`
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
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de retirer l'XP au compagon ou au familier de <@${member.id}>.`
                                ));
        
                                throw err;
                            }

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "R E T R A I T - X P - A N I M A L",
                                `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a perdu ${args[1]} :sparkles:.`
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
    return "\n\n:gear: __Utilisation :__ ``=retirer-xp-animal [tag membre du serveur] [valeur]``";
};
