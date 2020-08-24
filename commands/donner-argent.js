const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "donner-argent",
    alias: [ "give-money" ],
    usage: "[tag joueur] [quantité]",
    description: "Elle permet de donner une partie ou l'intégralité de votre argent dans votre porte monnaie à autrui.",
    run: (client, message, args) => {
        if( !args[0] ) {
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le tag d'un joueur."+commandUsage()
            ));
            return;
        }

        if( !args[1] ){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il manque le montant à donner."+commandUsage()
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

        if(member.id == message.author.id) {
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Vous ne pouvez vous donner de l'argent."+commandUsage()
            ));
            return;
        }

        client.con.query(`SELECT * FROM argent WHERE id = '${message.author.id}';`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1) {
                client.con.query(`INSERT INTO argent VALUES('${message.author.id}', 0, 0);`, err => { if(err) throw err; });
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Un problème a été rencontré, le bot a créé un compte bancaire pour <@${message.author.id}>. Veuillez réitérer votre commande.`
                ));
            }else{
                if(rows[0].pm < args[1]){
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: Le montant que vous souhaitez donner dépasse l'argent que vous avez dans votre porte monnaie, allez retirer à la banque."
                    ));
                }else{
                    var giverPM = rows[0].pm

                    client.con.query(`SELECT * FROM argent WHERE id = '${member.id}';`, (err, rows) => {
                        if(err) throw err;

                        if(rows.length < 1) {
                            client.con.query(`INSERT INTO argent VALUES('${member.id}', 0, ${parseInt(args[1])});`, err => { if(err) throw err; });
                        }else{
                            client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) + parseInt(args[1])} WHERE id = '${member.id}';`, err => { if(err) throw err; });
                        }
                        client.con.query(`UPDATE argent SET pm = ${parseInt(giverPM) - parseInt(args[1])} WHERE id = '${message.author.id}';`, err => { if(err) throw err; });

                        message.channel.send(addEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "T R A N S A C T I O N",
                            `:white_check_mark: <@${message.author.id}> a donné ${args[1]} :gem: à <@${member.id}>.`
                        ));
                    })
                }
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=donner-argent [tag membre du serveur] [montant]``";
};