const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "retirer-argent",
    alias: [ "rm-money" ],
    usage: "[tag joueur] [quantité] <banque ou pm>",
    description: "Commande réservée au staff ! Elle permet de retirer de l'argent par défaut dans le porte monnaie du joueur.",
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
                client.con.query(`INSERT INTO argent VALUES('${member.id}', 0, 0);`, err => { if(err) throw err; });
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Un problème a été rencontré, le bot a créé un compte bancaire pour le joueur ciblé. Veuillez réitérer votre commande."
                ));
            }else{
                if(args[2] && args[2].toLowerCase() == "banque") {
                    client.con.query(`UPDATE argent SET banque = ${parseInt(rows[0].banque) - parseInt(args[1])} WHERE id = '${member.id}';`, err => { 
                        if(err) throw err; 
                        
                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "R E T R A I T - A R G E N T",
                            `:white_check_mark: La somme d'argent ${args[1]} a été retirée du compte bancaire de <@${member.id}>.`
                        ));
                    });
                }else{
                    client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) - parseInt(args[1])} WHERE id = '${member.id}';`, err => { 
                        if(err) throw err; 

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "R E T R A I T - A R G E N T",
                            `:white_check_mark: La somme d'argent ${args[1]} a été retirée du porte monnaie de <@${member.id}>.`
                        ));
                    });
                }
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=retirer-argent [tag membre du serveur] [montant] <banque ou pm>``";
};