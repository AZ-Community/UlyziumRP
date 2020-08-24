const { addWarnEmbed, addEmbed, addInventoryEmbed } = require("../tools/embed.js");

module.exports = {
    name: "inventaire",
    alias: [ "inv" ],
    usage: "<tag joueur> <numéro page>",
    description: "Elle permet d'avoir un aperçu de l'inventaire d'un joueur.",
    run: (client, message, args) => {
        var id = message.author.id;
        var nb = 1;

        if( args[0] ){
            if( Number.isInteger(parseInt(args[0])) ) {
                if( args[0] <= 0 ){
                    message.channel.send(addWarnEmbed(
                        message.author.username, 
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: Le numéro de page est erronné."+commandUsage()
                    ));
                    return;
                }else nb = args[0];
            }else{
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

                if( args[1] ) {
                    if( Number.isInteger(parseInt(args[1])) ) {
                        if( args[1] <= 0 ) {
                            message.channel.send(addWarnEmbed(
                                message.author.username, 
                                message.author.avatarURL,
                                "E R R E U R",
                                ":warning: Le numéro de page est erronné."+commandUsage()
                            ));
                            return;
                        }else nb = args[1];
                    }else{
                        message.channel.send(addWarnEmbed(
                            message.author.username, 
                            message.author.avatarURL,
                            "E R R E U R",
                            ":warning: Le numéro de page est erronné."+commandUsage()
                        ));
                        return;
                    }
                }
            }
        }

        client.con.query(`SELECT * FROM inventaire WHERE id = '${id}';`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1) {
                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "I N V E N T A I R E",
                    ":page_with_curl: L'inventaire de cette personne est vide."
                ));
            }else{
                message.channel.send(addInventoryEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    rows,
                    nb
                ));
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=inventaire <tag membre du serveur> <numéro de page>``";
};