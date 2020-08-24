const { addCombatDesc, addWarnEmbed } = require('../tools/embed.js');
//const { isFileExist, readJSON } = require('../tools/fs.js');

module.exports = {
    name: "combat",
    alias: [ "cb" ],
    usage: "[nom de la zone] <tags partenaires de combat>",
    description: "Permet de débuter un combat contre une créature.",
    run: (client, message, args) => {
        // Vars
        const combats = client.combats;
        const combatsKey = combats.keyArray();

        // Start of error report
        if(!args[0]){
            var msg = ":warning: Nom de zone incorrecte, veuillez choisir entre :\n";
            for(let i = 0; i < combatsKey.length; i++){
                msg = msg + combatsKey[i] + "\n";
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

        if(!combats.has(nom)){
            var msg = ":warning: Nous n'avons pas trouvé le type de zone demandé, veuillez choisir entre :\n";
            for(let i = 0; i < combatsKey.length; i++){
                msg = msg + combatsKey[i] + "\n";
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
        var canFight = true;
        var membersCombat = message.mentions.members;
        var isAuthorInCollection = false;
        var msg = "Le ou les joueurs suivants ne peuvent pas participer au combat :";

        // Vérification si l'auteur de la commande est dans les mentions
        if(membersCombat.has(message.author.id)) isAuthorInCollection = true;

        // Tableau contenant les ID des joueurs mentionnés
        membersCombat = membersCombat.keyArray();

        // Ajout de l'ID de celui qui a fait la commande
        if(!isAuthorInCollection) membersCombat.push(message.author.id);

        membersCombat.forEach(memberID => {
            if(client.wait.has("combat"+memberID)){
                var canFightAt = new Date(client.wait.get("combat"+memberID));
                canFightAt = new Date(canFightAt.setMinutes(canFightAt.getMinutes()+10)); // Ajout de 10 minutes
    
                if(canFightAt <= message.createdAt){ client.wait.delete("combat"+memberID);
                }else{ 
                    canFight = false;
                    var timeLeft = new Date(canFightAt - message.createdAt);
                    msg = `${msg}\n<@${memberID}> -> Temps restant pour ce joueur : ${timeLeft.getUTCMinutes()}:${timeLeft.getUTCSeconds()}`;
                }
            }
        });

        if(canFight){
            membersCombat.forEach(memberID => {
                client.wait.set("combat"+memberID, new Date());
            });

            const content = combats.get(nom);
            var tabMobs = [];

            client.mobs.forEach(mob => {
               if( mob.kind.toLowerCase() == nom ) {
                   tabMobs.push(mob);
               } 
            });

            message.channel.send(addCombatDesc(
                message.author.username, 
                message.author.avatarURL,
                tabMobs[Math.floor(Math.random() * tabMobs.length)]
            ));
        }else{
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                `:warning: ${msg}`
            ));
        }

        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=combat [nom de la zone] <tags partenaires de combat>``";
};