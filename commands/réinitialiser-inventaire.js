const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "reinitialiser-inventaire",
    alias: [ "r-inventory" ],
    usage: "[tag joueur]",
    description: "Commande réservée au staff ! Elle permet de réinitialiser l'inventaire d'un joueur.",
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

        client.con.query(`DELETE FROM inventaire WHERE id = '${member.id}';`, (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Un problème a été rencontré, le bot a créé un compte bancaire pour le joueur ciblé. Veuillez réitérer votre commande."
                ));

                throw err;
            }

            message.channel.send(addEmbed(
                message.author.username,
                message.author.avatarURL,
                "R E S E T - I N V E N T A I R E",
                `:white_check_mark: L'inventaire de <@${member.id}> a été réinitialisé.`
            ));
        });

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=réinitialiser-inventaire [tag membre du serveur]``";
};