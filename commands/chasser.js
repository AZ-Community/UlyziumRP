const { addWarnEmbed } = require('../tools/embed.js');
//const { isFileExist, readJSON } = require('../tools/fs.js');

module.exports = {
    name: "chasser",
    alias: [ "hunt" ],
    usage: "[nom de l'animal]",
    description: "Permet de chasser un animal afin d'en récupérer des loots.",
    run: (client, message, args) => {
        const hunt = {
            "vache": { max: 5, loot: "Matériau :gear: [ Cuir-Vache ]" },
            "cochon": { max: 4, loot: "Matériau :gear: [ Cuir-Cochon ]" },
            "cheval": { max: 3, loot: "Matériau :gear: [ Cuir-Cheval ]" },
            "minotaur": { max: 2, loot: "Matériau :gear: [ Cuir-Minotaur ]" }
        };

        // Start of error report
        if(!args[0]){
            var msg = ":warning: Nom de l'animal incorrect, veuillez choisir entre :\nvache,\ncochon,\ncheval,\nminotaur.";

            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                msg + commandUsage()
            ));

            return;
        }

        const nom = args[0].toLowerCase();

        if(!hunt[nom]){
            var msg = ":warning: Nous n'avons pas trouvé le type d'animal demandé, veuillez choisir entre :\nvache,\ncochon,\ncheval,\nminotaur.";
            for(let i = 0; i < hunt.length; i++){
                msg = msg + hunt[i] + "\n";
            }

            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                msg + commandUsage()
            ));

            return;
        }
        // End of error report

        // Execution
        var canHunt = false;

        if(client.wait.has("hunt"+message.author.id)){
            var canHuntAt = new Date(client.wait.get("hunt"+message.author.id));
            canHuntAt = new Date(canHuntAt.setHours(canHuntAt.getHours()+2)); // Ajout de 2 heures

            if(canHuntAt <= message.createdAt){
                canHunt = true;
                client.wait.delete("hunt"+message.author.id);
            }
        }else canHunt = true;

        if(canHunt){
            client.wait.set("hunt"+message.author.id, new Date());
            var nb = Math.floor(hunt[nom].max-(hunt[nom].max*0.5*Math.random()));
            var msg = "**C h a s s e**\n:sparkles:\n----------\n| ``"+ nom +"``\n----------"+"\n\n {"+ nb +"} - "+ hunt[nom].loot;

            client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}' AND item = '${hunt[nom].loot}';`, (err, rows) => {
                if(err) {
                    message.channel.send(addWarnEmbed(
                        message.author.username, 
                        message.author.avatarURL,
                        "E R R E U R",
                        `:warning: Une erreur a été rencontrée, le bot est dans l'incapacité de récupérer le contenu de l'inventaire de <@${message.author.id}> pour y ajouter '{${nb}} - ${hunt[nom].loot}'. Veuillez contacter un admin pour obtenir votre loot.`
                    ));

                    throw err;
                }

                if(rows.length < 1) {
                    client.con.query(`INSERT INTO inventaire VALUES('${message.author.id}', '${hunt[nom].loot}', ${nb});`, err => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username, 
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Une erreur a été rencontrée, le bot est dans l'incapacité d'insérer l'item '{${nb}} - ${hunt[nom].loot}' dans l'inventaire de <@${message.author.id}>. Veuillez contacter un admin pour obtenir votre loot.`
                            ));

                            throw err;
                        }

                        message.channel.send(msg);
                    });
                }else{
                    client.con.query(`UPDATE inventaire SET nb = ${parseInt(rows[0].nb) + parseInt(nb)} WHERE id = '${message.author.id}' AND item = '${hunt[nom].loot}';`, err => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username, 
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Une erreur a été rencontrée, le bot est dans l'incapacité d'ajouter l'item '{${nb}} - ${hunt[nom].loot}' dans l'inventaire de <@${message.author.id}>. Veuillez contacter un admin pour obtenir votre loot.`
                            ));

                            throw err;
                        }

                        message.channel.send(msg);
                    });
                }
            });
        }else{
            var canHuntAt = new Date(client.wait.get("hunt"+message.author.id));
            canHuntAt = new Date(canHuntAt.setHours(canHuntAt.getHours()+2));

            const timeLeft = new Date(canHuntAt - message.createdAt);

            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                `:warning: Vous devez attendre encore ${timeLeft.getUTCHours()}:${timeLeft.getUTCMinutes()}:${timeLeft.getUTCSeconds()} avant votre prochaine chasse.`
            ));
        }

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=chasser [nom de l'animal]``";
};