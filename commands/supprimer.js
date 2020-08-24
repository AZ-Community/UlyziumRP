const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "supprimer",
    alias: [ "sup" ],
    usage: "[tag membre du serveur]",
    description: "Permet de supprimer l'emplacement de sauvegarde dédié au joueur.",
    run: (client, message, args) => {
        // Start of error report
        if(!message.guild.member(message.author).hasPermission('KICK_MEMBERS')){ 
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Vous n'avez pas la permission de supprimer l'emplacement d'un joueur de la Database."
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
                client.con.query(`DELETE FROM stats WHERE id = ${member.id}`, console.log);
                client.con.query(`DELETE FROM quest WHERE id = ${member.id}`, console.log);

                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "S U P P R E S S I O N",
                    ":white_check_mark: Données correctement supprimées."
                ));
            }
        });
        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=supprimer [tag membre du serveur]``";
};