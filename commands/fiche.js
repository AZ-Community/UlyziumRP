const { addWarnEmbed } = require('../tools/embed.js');

module.exports = {   
    name: "fiche",
    alias: [ "f" ],
    usage: "<mention du joueur>",
    description: "Retourne les informations de votre fiche ou de la fiche d'un autre joueur.",
    run: (client, message, args) => {
        var id;
        
        if(args[0]){
            const user = message.mentions.users.first();
            if(!user){
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Ceci n'est pas un joueur."+commandUsage()
                ));
                return;
            }

            // Check if user is a guild member
            const member = message.guild.member(user);
            if(!member){
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "E R R E U R",
                    ":warning: Ce joueur n'est pas un membre du serveur."+commandUsage()
                ));
                return;
            }

            id = member.id;
        }else id = message.author.id;
        
        client.con.query(`SELECT * FROM profil WHERE id = '${id}';`, (err, rows) =>{
            if(err) throw err;
            
            if(rows.length < 1){
                message.channel.send(addWarnEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "Erreur",
                    ":warning: Aucune fiche trouvée pour l'id du joueur dans la Database, utilisez ``=créer-fiche``."
                ));
            }else{
                let tab = rows[0];

                message.channel.send(`:scroll: ~ ***Identité de votre personnage***\n|	**Nom & prénom :** ${tab.nom}\n|	**Âge :** ${tab.âge}\n|	**Race :** ${tab.race}\n|	**Sexe :** ${tab.sexe}\n\n:scroll: ~ ***Informations supplémentaires***`);
                message.channel.send(`|	**Caractère :** ${tab.caractère}`);

                if(tab.histoire)
                    message.channel.send(`|	**Histoire :** ${tab.histoire}`);

                if(isValidURL(tab.image)) message.channel.send(tab.image);
                else message.channel.send("**:warning: L'URL de l'image fournie est incorrecte !**");
            }
        });
        return;
    }
}

const isValidURL = (string) => {
	try {
	  new URL(string);
	  return true;
	} catch (_) {
	  return false;  
	}
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=fiche [tag membre du serveur]``";
};