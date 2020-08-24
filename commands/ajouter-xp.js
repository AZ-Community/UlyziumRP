const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "ajouter-xp",
    alias: [ "aj-xp" ],
    usage: "[tag membre du serveur] [valeur]",
    description: "Commande réservée au staff ! Permet l'ajout d'un montant d'XP à un joueur.",
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
                let amount = parseInt(rows[0].xp) + parseInt(args[1]);
                let xpToLevelUp = 5 * (rows[0].lvl ^ 2) + 50 * rows[0].lvl + 100;

                if(amount > xpToLevelUp){
                    if(rows[0].overAmount != null){
                        var xp = parseInt(args[1]) + parseInt(rows[0].overAmount);
                        client.con.query(`UPDATE stats SET overAmount = ? WHERE id = '${member.id}'`, [xp], console.log);
                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "M I S E - A - J O U R",
                            ":white_check_mark: Donnée correctement mise à jour, l'XP a été ajouté à la réserve XP+."
                        ));
                    }else{
                        amount -= xpToLevelUp;
                        client.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${member.id}'`, [xpToLevelUp, amount], console.log);
                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "M I S E - A - J O U R",
                            ":white_check_mark: Donnée correctement mise à jour."
                        ));
                    }
                }else{
                    if(rows[0].overAmount != null){
                        amount += rows[0].overAmount;
                        if(amount > xpToLevelUp){
                            amount -= xpToLevelUp;
                            client.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${member.id}'`, [xpToLevelUp, amount], console.log);
                        }elseclient.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${member.id}'`, [amount, null], console.log);
                    }else client.con.query(`UPDATE stats SET xp = ? WHERE id = '${member.id}'`, [amount], console.log);

                    message.channel.send(addEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "M I S E - A - J O U R",
                        ":white_check_mark: Donnée correctement mise à jour."
                    ));
                }
            }
        });

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=ajouter-xp [tag membre du serveur] [valeur]``";
};
