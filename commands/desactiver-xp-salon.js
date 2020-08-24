const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "desactiver-xp-salon",
    alias: [ "dxp" ],
    description: "Commande réservée au staff ! Permet de désactiver le gain d'XP par le biais de message dans un salon.",
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
                client.con.query(`INSERT INTO channelxp_ban VALUES('${message.guild.id}', '${message.channel.id}');`, console.log);

                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "D E S A C T I V A T I O N - X P",
                    ":white_check_mark: Le gain d'XP par le biais de message est désormais désactivé dans ce salon, utilisez ``=activer-xp-salon`` pour le réactiver."
                ));
            }else{
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Le gain d'XP par le biais de message est déjà désactivé dans ce salon."
                ))
            }
        });
        
    }
}