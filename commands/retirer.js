const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "retirer",
    alias: [ "r" ],
    usage: "<quantité>",
    description: "Elle permet de retirer une somme d'argent à la banque.",
    run: (client, message, args) => {
        if(args[0]){
            if(!isFinite(args[0]) || args[0] <= 0){
                message.channel.send(addWarnEmbed(
                    message.author.username, 
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Le montant à retirer est erroné."+commandUsage()
                ));
                return;
            }
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
                if(rows[0].banque <= 0){
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: Vous n'avez pas d'argent dans votre compte bancaire."
                    ));
                }else{
                    if(args[0]){
                        if(args[0] > parseInt(rows[0].banque)) {
                            message.channel.send(addWarnEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "E R R E U R",
                                ":warning: Vous n'avez pas cette somme dans votre porte monnaie."
                            ));
                        }else{
                            client.con.query(`UPDATE argent SET banque = ${parseInt(rows[0].banque) - parseInt(args[0])}, pm = ${parseInt(rows[0].pm) + parseInt(args[0])} WHERE id = '${message.author.id}';`, err => { 
                                if(err) throw err; 

                                message.channel.send(addEmbed(
                                    message.author.username,
                                    message.author.avatarURL,
                                    "D E P Ô T",
                                    `:white_check_mark: <@${message.author.id}> a rétiré ${args[0]} :gem: depuis son compte bancaire.`
                                ));
                            });
                        }
                    }else{
                        client.con.query(`UPDATE argent SET banque = 0, pm = ${parseInt(rows[0].pm) + parseInt(rows[0].banque)} WHERE id = '${message.author.id}';`, err => { 
                            if(err) throw err; 

                            message.channel.send(addEmbed(
                                message.author.username,
                                message.author.avatarURL,
                                "D E P Ô T",
                                `:white_check_mark: <@${message.author.id}> a rétiré ${rows[0].banque} :gem: depuis son compte bancaire.`
                            ));
                        });
                    }
                }
            }
        })

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=retirer <montant>``";
};