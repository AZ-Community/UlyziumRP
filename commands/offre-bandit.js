const { addWarnEmbed, addEmbed } = require('../tools/embed.js');

module.exports = {
    name: "offre-bandit",
    alias: [ "bandit-offer" ],
    description: "Permet d'accepter l'offre du bandit.",
    run: (client, message, args) => {
        client.con.query(`SELECT * FROM argent WHERE id = '${message.author.id}';`, (err, rows) => {
            if(err) {
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    `:warning: Le bot a rencontré un problème, il est dans l'incapacité de récupérer le contenu du porte monnaie de <@${message.author.id}>.`
                ));

                throw err;
            }

            var moneyToAdd = Math.floor( 500 - Math.random() * 250 );

            if(rows.length < 1) {
                client.con.query(`INSERT INTO argent(id, pm, banque) VALUES('${message.author.id}', ${moneyToAdd}, 0);`, err => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Le bot a rencontré un problème, il est dans l'incapacité d'insérer la somme d'argent dans le porte monnaie de <@${message.author.id}>.`
                        ));
        
                        throw err;
                    }

                    message.channel.send(addEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "O F F R E - B A N D I T",
                        `:white_check_mark: <@${message.author.id}> a reçu ${moneyToAdd} :gem: en acceptant l'offre du bandit.`
                    ));
                });
            }else{
                client.con.query(`UPDATE argent SET pm = ${parseInt(rows[0].pm) + moneyToAdd} WHERE id = '${message.author.id}';`, err => {
                    if(err) {
                        message.channel.send(addWarnEmbed(
                            message.author.username,
                            message.author.avatarURL,
                            "E R R E U R",
                            `:warning: Le bot a rencontré un problème, il est dans l'incapacité de mettre à jour la somme d'argent du porte monnaie de <@${message.author.id}>.`
                        ));
        
                        throw err;
                    }

                    message.channel.send(addEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "O F F R E - B A N D I T",
                        `:white_check_mark: <@${message.author.id}> a reçu ${moneyToAdd} :gem: en acceptant l'offre du bandit.`
                    ));
                });
            }
        })

        return;
    }
}