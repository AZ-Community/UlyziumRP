const { addWarnEmbed } = require('../tools/embed.js');
//const { isFileExist, readJSON } = require('../tools/fs.js');

module.exports = {
    name: "miner",
    alias: [ "mine" ],
    usage: "[nom du minerais]",
    description: "Permet d'extraire des minerais afin d'en récupérer des loots.",
    run: (client, message, args) => {
        const mine = {
            "or": { max: 2, loot: "Matériau :gear: [ Pépite-Or ]" },
            "argent": { max: 3, loot: "Matériau :gear: [ Pépite-Argent ]" },
            "fer": { max: 4, loot: "Matériau :gear: [ Pépite-Fer ]" },
            "charbon": { max: 5, loot: "Matériau :gear: [ Charbon ]" },
            "ferraille": { max: 6, loot: "Matériau :gear: [ Ferraille ]" }
        };

        // Start of error report
        if(!args[0]){
            var msg = ":warning: Nom du minerais incorrect, veuillez choisir entre :\nor,\nargent,\nfer,\ncharbon,\nferraille.";
            for(let i = 0; i < mine.length; i++){
                msg = msg + mine[i] + "\n";
            }

            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                msg + commandUsage()
            ));

            return;
        }

        const nom = args[0].toLowerCase();

        if(!mine[nom]){
            var msg = ":warning: Nous n'avons pas trouvé le type de minerais demandé, veuillez choisir entre :\nor,\nargent,\nfer,\ncharbon,\nferraille.";
            for(let i = 0; i < mine.length; i++){
                msg = msg + mine[i] + "\n";
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
        var canMine = false;

        if(client.wait.has("mine"+message.author.id)){
            var canMineAt = new Date(client.wait.get("mine"+message.author.id));
            canMineAt = new Date(canMineAt.setHours(canMineAt.getHours()+2)); // Ajout de 2 heures

            if(canMineAt <= message.createdAt){
                canMine = true;
                client.wait.delete("mine"+message.author.id);
            }
        }else canMine = true;

        if(canMine){
            client.wait.set("mine"+message.author.id, new Date());
            var nb = Math.floor(mine[nom].max-(mine[nom].max*0.5*Math.random()));
            var msg = "**C h a s s e**\n:sparkles:\n----------\n| ``"+ nom +"``\n----------"+"\n\n {"+ nb +"} - "+ mine[nom].loot;

            client.con.query(`SELECT * FROM inventaire WHERE id = '${message.author.id}' AND item = '${mine[nom].loot}';`, (err, rows) => {
                if(err) {
                    message.channel.send(addWarnEmbed(
                        message.author.username, 
                        message.author.avatarURL,
                        "E R R E U R",
                        `:warning: Une erreur a été rencontrée, le bot est dans l'incapacité de récupérer le contenu de l'inventaire de <@${message.author.id}> pour y ajouter '{${nb}} - ${mine[nom].loot}'. Veuillez contacter un admin pour obtenir votre loot.`
                    ));

                    throw err;
                }

                if(rows.length < 1) {
                    client.con.query(`INSERT INTO inventaire VALUES('${message.author.id}', '${mine[nom].loot}', ${nb});`, err => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username, 
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Une erreur a été rencontrée, le bot est dans l'incapacité d'insérer l'item '{${nb}} - ${mine[nom].loot}' dans l'inventaire de <@${message.author.id}>. Veuillez contacter un admin pour obtenir votre loot.`
                            ));

                            throw err;
                        }

                        message.channel.send(msg);
                    });
                }else{
                    client.con.query(`UPDATE inventaire SET nb = ${parseInt(rows[0].nb) + parseInt(nb)} WHERE id = '${message.author.id}' AND item = '${mine[nom].loot}';`, err => {
                        if(err) {
                            message.channel.send(addWarnEmbed(
                                message.author.username, 
                                message.author.avatarURL,
                                "E R R E U R",
                                `:warning: Une erreur a été rencontrée, le bot est dans l'incapacité d'ajouter l'item '{${nb}} - ${mine[nom].loot}' dans l'inventaire de <@${message.author.id}>. Veuillez contacter un admin pour obtenir votre loot.`
                            ));

                            throw err;
                        }

                        message.channel.send(msg);
                    });
                }
            });
        }else{
            var canMineAt = new Date(client.wait.get("mine"+message.author.id));
            canMineAt = new Date(canMineAt.setHours(canMineAt.getHours()+2));

            const timeLeft = new Date(canMineAt - message.createdAt);

            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                `:warning: Vous devez attendre encore ${timeLeft.getUTCHours()}:${timeLeft.getUTCMinutes()}:${timeLeft.getUTCSeconds()} avant votre prochaine extraction de minerais.`
            ));
        }

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=miner [nom du minerais]``";
};