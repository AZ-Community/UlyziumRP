const { addWarnEmbed, addEmbed } = require("../tools/embed");

module.exports = {
    name: "monter-niveau-animal",
    alias: [ "levelup-mate" ],
    usage: "[tag membre du serveur]",
    description: "Commande réservée au staff ! Permet de faire monter d'un niveau le compagnon ou le famileir du joueur sélectionné.",
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

        if(!member.roles.has("674067242555801653") && !member.roles.has("674067375552856095")) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: La personne concernée n'est ni un humain ni un elfe, celle-ci n'a donc aucun animal."
            ));
            return;
        }

        client.con.query(`SELECT * FROM compagnon WHERE id = '${member.id}';`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1){
                client.con.query(`INSERT INTO compagnon VALUES('${member.id}', 1, 0, 0)`, err => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité de monter de niveau le compagon ou le familier de <@${member.id}>.`
                        ));

                        throw err;
                    }
                })
            }else{
                if(rows[0].overXP != null){
                    const xpMax = 25 * ( rows[0].level + 1 ) * ( Math.floor(( rows[0].level + 1) / 5) + 1 );
                    let amount = rows[0].overXP;
                    if(amount > xpMax){
                        amount -= xpMax;
                        client.con.query(`UPDATE compagnon SET level = ?, xp = ?, overXP = ? WHERE id = ${member.id};`, [rows[0].level + 1, xpMax, amount], err => {
                            if(err) {
                                message.channel.send(addWarnEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "E R R E U R",
                                    `:warning: Un problème a été rencontré, le bot est dans l'incapacité de monter de niveau le compagon ou le familier de <@${member.id}>.`
                                ));
        
                                throw err;
                            }

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "L E V E L - U P - A N I M A L",
                                `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a level-up, il est désormais niveau ${rows[0].level + 1}. Félicitations !`
                            ));
                        });
                    }else client.con.query(`UPDATE compagnon SET level = ?, xp = ?, overXP = ? WHERE id = ${member.id};`, [rows[0].level + 1, amount, null],err => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Un problème a été rencontré, le bot est dans l'incapacité de monter de niveau le compagon ou le familier de <@${member.id}>.`
                            ));
    
                            throw err;
                        }

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "L E V E L - U P - A N I M A L",
                            `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a level-up, il est désormais niveau ${rows[0].level + 1}. Félicitations !`
                        ));
                    });
                }else client.con.query(`UPDATE compagnon SET level = ?, xp = ? WHERE id = ${member.id};`, [rows[0].level + 1, 0], err => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Un problème a été rencontré, le bot est dans l'incapacité de monter de niveau le compagon ou le familier de <@${member.id}>.`
                        ));

                        throw err;
                    }

                    message.channel.send(addEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "L E V E L - U P - A N I M A L",
                        `:white_check_mark: Le familier ou le compagnon de <@${member.id}> a level-up, il est désormais niveau ${rows[0].level + 1}. Félicitations !`
                    ));
                });
            }
        });
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=monter-niveau-animal [tag membre du serveur]``";
};
