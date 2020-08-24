const { addWarnEmbed, addMobActionEmbed } = require('../tools/embed.js');

module.exports = {
    name: "attaque",
    alias: [ "atk" ],
    usage: "[nom du mob]",
    description: "Permet de faire attaquer un mob sélectionné.",
    run: (client, message, args) => {
        // Error report
        var nom = args[0];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 1; i < args.length; i++){
            if(args[i]) nom = nom + " " + args[i];
        }

        if(!client.mobs.has(nom)){
            message.channel.send(addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Nous n'avons pas trouvé le type de créature demandé, prenez connaissance des mobs utilisables dans ``=bestiaire [zone] <numéro de page>``."+commandUsage()
            ));
            return;
        }

        // Execution
        const mob = client.mobs.get(nom);

        message.channel.send(addMobActionEmbed(
            message.author.username, 
            message.author.avatarURL,
            mob.getKind(),
            mob.getName(),
            mob.getDescAtk()
        ));
        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=attaque [nom du mob]``";
};