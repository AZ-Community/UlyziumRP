const { addWorkEmbed, addWarnEmbed, addMobDesc, addEquipementDesc, addRessourceDesc, addArmeDesc } = require('../tools/embed.js');

module.exports = {
    name: "information",
    alias: [ "info", "i" ],
    usage: "[nom du mob, de la ressource ou du métier]",
    description: "Retourne les informations demandées.",
    run: (client, message, args) => {
        var embed = null;
        var name = args[0];

        // Si le nom de ce que l'on cherche est composé, on prend en compte les autres arguments.
        for(let i = 1; i < args.length; i++){
            if(args[i]) name = name + " " + args[i];
        }

        if(client.mobs.has(name)){
            const mob = client.mobs.get(name);

            embed = addMobDesc(
                message.author.username, 
                message.author.avatarURL,
                mob
            );
        }else if(client.ressources.has(name)){
            const ressource = client.ressources.get(name);

            embed = addRessourceDesc(
                message.author.username, 
                message.author.avatarURL,
                ressource
            );
        }else if(client.métiers.has(name)){
            const work = client.métiers.get(name);

            embed = addWorkEmbed(
                message.author.username, 
                message.author.avatarURL,
                work
            );
        }else{
            embed = addWarnEmbed(
                message.author.username, 
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Nous n'avons pas trouvé le type de créature ou équipement demandé, prenez connaissance des commandes utilisables dans ``=bestiaire [zone] <numéro de page>``, ``=ressources <numéro de page>`` ou ``=métiers <numéro de page>``."+commandUsage()
            );
        }

        message.channel.send({embed});
        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=info [nom du mob, de la resssource ou du métier]``";
};