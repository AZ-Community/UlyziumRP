const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "retirer-xp",
    alias: [ "ret-xp" ],
    usage: "[tag membre du serveur] [valeur]",
    description: "Commande réservée au staff ! Permet le retrait d'un montant d'XP à un joueur.",
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
        // End of error report

        // Execution
        client.con.query(`SELECT * FROM stats WHERE id = '${member.id}'`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: La personne sélectionnée n'a pas d'emplacement réservé dans la Database."
                ));
            }else{
                let amount = parseInt(rows[0].xp) - parseInt(args[1]);
                
                if(rows[0].overAmount != null){
                    amount += rows[0].overAmount;
                    let xpMax = 5 * (rows[0].lvl ^ 2) + 50 * rows[0].lvl + 100;

                    if(amount < 0){
                        if(rows[0].lvl > 1){
                            let lvl = rows[0].lvl-1
                            let xpMaxPredLvl = 5 * (lvl ^ 2) + 50 * lvl + 100;
                            amount += xpMaxPredLvl;

                            while(amount < 0){
                                if(lvl == 1){
                                    xpMaxPredLvl = 5 * (lvl ^ 2) + 50 * lvl + 100;
                                    amount += xpMaxPredLvl;
                                    if(amount < 0){
                                        amount = 0;
                                        break;
                                    }
                                }else{
                                    lvl--;
                                    xpMaxPredLvl = 5 * (lvl ^ 2) + 50 * lvl + 100;
                                    amount += xpMaxPredLvl;
                                }
                            }

                            client.con.query(`UPDATE stats SET xp = ?, lvl = ?, overAmount = ? WHERE id = '${member.id}'`, [amount, lvl, null], (err, rows) => {
                                if(err) throw err;
                            });
                        }else{
                            client.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${member.id}'`, [0, null], (err, rows) => {
                                if(err) throw err;
                            });
                        }
                    }else{
                        if(amount > xpMax){
                            amount -= xpMax;

                            client.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${member.id}'`, [xpMax, amount], (err, rows) => {
                                if(err) throw err;
                            });
                        }else{
                            client.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${member.id}'`, [amount, null], (err, rows) => {
                                if(err) throw err;
                            });
                        }
                    }
                }else{
                    if(amount < 0){
                        if(rows[0].lvl > 1){
                            let lvl = rows[0].lvl-1
                            let xpMaxPredLvl = 5 * (lvl ^ 2) + 50 * lvl + 100;
                            amount += xpMaxPredLvl;

                            while(amount < 0){
                                if(lvl == 1){
                                    xpMaxPredLvl = 5 * (lvl ^ 2) + 50 * lvl + 100;
                                    amount += xpMaxPredLvl;
                                    if(amount < 0){
                                        amount = 0;
                                        break;
                                    }
                                }else{
                                    lvl--;
                                    xpMaxPredLvl = 5 * (lvl ^ 2) + 50 * lvl + 100;
                                    amount += xpMaxPredLvl;
                                }
                            }

                            client.con.query(`UPDATE stats SET xp = ?, lvl = ? WHERE id = '${member.id}'`, [amount, lvl], (err, rows) => {
                                if(err) throw err;
                            });
                        }else{
                            client.con.query(`UPDATE stats SET xp = ? WHERE id = '${member.id}'`, [0], (err, rows) => {
                                if(err) throw err;
                            });
                        }
                    }else{
                        client.con.query(`UPDATE stats SET xp = ? WHERE id = '${member.id}'`, [amount], (err, rows) => {
                            if(err) throw err;
                        });
                    }
                }

                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "M I S E - A - J O U R",
                    ":white_check_mark: Donnée correctement mise à jour."
                ));
            }
        });

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=retirer-xp [tag membre du serveur] [valeur]``";
};
