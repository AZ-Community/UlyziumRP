const { addWarnEmbed, addEmbed } = require("../tools/embed.js");

module.exports = {
    name: "aide",
    alias: [ "a", "help", "h" ],
    usage: "[commande ou abréviation]",
    description: "Retourne les informations d'une commande.",
    run: (client, message, args) => {
        if(!args[0]){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Il faut renseigner le nom ou l'abréviation d'une commande.\n\n**Utilisation :** ``=aide [commande ou abrévation]``"
            ));
            return;
        }

        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        let info = `:warning: Aucune information n'a été trouvée pour la commande : **${args[0].toLowerCase()}**`;
        
        if(cmd){
            if(cmd.name) info = `**Commande :** \`\`=${cmd.name}\`\``;
            if(cmd.alias) info += `\n**Abréviation(s) :** ${cmd.alias.map(a => `\`${a}\``).join(", ")}`;
            if(cmd.name && cmd.usage) info += `\n**Utilisation :** ${cmd.name} ${cmd.usage}`;
            if(cmd.description) info += `\n**Description :** ${cmd.description}`;

            message.channel.send(addEmbed(
                message.author.username,
                message.author.avatarURL,
                "A I D E",
                info
            ));
        }else{
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                info
            ));
        }

        return;
    }
}