const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "nouveau",
    alias: [ "new", "nv" ],
    description: "Permet de générer un emplacement de sauvegarde pour l'envoyeur du message.",
    run: (client, message, args) => {
        client.con.query(`SELECT * FROM stats WHERE id = '${message.author.id}'`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1) {
                client.con.query(`INSERT INTO stats (id) VALUES ('${message.author.id}')`, console.log);

                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "S A U V E G A R D E",
                    ":white_check_mark: Votre compte a correctement été créé, félicitation."
                ));
            }else{
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Vous disposez déjà d'un compte, il a probablement été créé lors de l'envoi d'un message dans un channel où le gain d'XP est activé."
                ));
            }
        });

        return;
    }
}