const { addWarnEmbed, addMissionLevelUpEmbed } = require('../tools/embed.js');
const missions = require("../missions/missions.json");

module.exports = {
    name: "mission-xp",
    alias: [ "m-xp" ],
    description: "Vous informe de votre mission pour passer votre level.",
    run: (client, message, args) => {
        client.con.query(`SELECT * FROM stats WHERE id = '${message.author.id}';`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1) {
                client.con.query(`INSERT INTO stats id = '${message.author.id}';`, console.error);
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Nous venons de créer votre emplacement dans la base de données, veuillez refaire la commande."
                ));
            }else{
                let xpToLevelUp = 5 * (rows[0].lvl ^ 2) + 50 * rows[0].lvl + 100;

                if(parseInt(rows[0].xp) == xpToLevelUp){
                    let nextLvl = parseInt(rows[0].lvl) + 1;

                    message.channel.send(addMissionLevelUpEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        nextLvl,
                        missions[nextLvl]
                    ));
                }else{
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: Vous n'avez encore aucune mission, il vous faut avoir 100% du quota demandé pour monter de level afin d'y accéder."
                    ));
                }
            }
        });
        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=métiers [numéro de la page]``";
};