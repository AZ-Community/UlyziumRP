const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "argent",
    alias: [ "money" ],
    usage: "<tag joueur>",
    description: "Elle permet d'avoir un aperçu de l'argent d'un joueur.",
    run: (client, message, args) => {
        var id = message.author.id;

        if(args[0]){
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

            id = member.id;
        }

        client.con.query(`SELECT * FROM argent WHERE id = '${id}';`, (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot a été dans l'incapacité de récupérer les informations relatives au compte bancaire de <@${id}>.`
                ));

                throw err;
            }

            if(rows.length < 1) {
                client.con.query(`INSERT INTO argent VALUES('${id}', 0, 0);`, err => { if(err) throw err; });
                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "B A N Q U E",
                    "Solde bancaire : 0\nPorte monnaie : 0"
                ));
            }else{
                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "B A N Q U E",
                    "Solde bancaire : "+ rows[0].banque +"\nPorte monnaie : "+ rows[0].pm
                ));
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=banque <tag membre du serveur>``";
};