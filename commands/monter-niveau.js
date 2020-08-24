const { addWarnEmbed, addEmbed } = require("../tools/embed");

module.exports = {
    name: "monter-niveau",
    alias: [ "lvl" ],
    usage: "[tag membre du serveur]",
    description: "Commande réservée au staff ! Permet de faire monter d'un niveau le joueur sélectionné.",
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

        client.con.query(`SELECT * FROM stats WHERE id = '${member.id}';`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1){
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: La personne sélectionnée n'a pas de compte dans la base de données."
                ));
            }else{
                if(rows[0].overAmount != null){
                    const xpMax = 5 * ((rows[0].lvl + 1) ^ 2) + 50 * (rows[0].lvl + 1) + 100;
                    let amount = rows[0].overAmount;
                    if(amount > xpMax){
                        amount -= xpMax;
                        client.con.query(`UPDATE stats SET lvl = ?, xp = ?, overAmount = ? WHERE id = ${member.id};`, [rows[0].lvl + 1, xpMax, amount], console.log);
                    }else client.con.query(`UPDATE stats SET lvl = ?, xp = ?, overAmount = ? WHERE id = ${member.id};`, [rows[0].lvl + 1, amount, null], console.log);
                }else client.con.query(`UPDATE stats SET lvl = ?, xp = ? WHERE id = ${member.id};`, [rows[0].lvl + 1, 0], console.log);

                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "L E V E L - U P",
                    `:white_check_mark: <@${member.id}> a level-up, félicitations !`
                ));
            }
        });
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=monter-niveau [tag membre du serveur]``";
};
