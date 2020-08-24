const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "activer-xp-salon",
    alias: [ "axp" ],
    description: "Commande réservée au staff ! Permet de réactiver le gain d'XP par le biais de message dans un salon.",
    run: (client, message, args) => {
        if(!message.guild.member(message.author).hasPermission('KICK_MEMBERS')){ 
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Vous n'avez pas les permissions nécessaires pour utiliser cette commande."
            ));
            return;
        }

        client.con.query(`SELECT * FROM channelxp_ban WHERE idServer = '${message.guild.id}' AND idChannel = '${message.channel.id}';`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1){
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Le gain d'XP par le biais de message est déjà activé dans ce salon."
                ))
            }else{
                client.con.query(`DELETE FROM channelxp_ban WHERE idServer = '${message.guild.id}' AND idChannel = '${message.channel.id}';`, console.log);

                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "R E A C T I V A T I O N - X P",
                    ":white_check_mark: Le gain d'XP par le biais de message est désormais réactivé dans ce salon, utilisez ``=desactiver-xp-salon`` pour le désactiver."
                ));
            }
        });
        
    }
}