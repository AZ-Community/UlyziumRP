const { addEmbed, addWarnEmbed } = require('../tools/embed.js');

module.exports = {
    name: "valider-quête",
    alias: [ "val-q" ],
    usage: "[tag membre du serveur] [nom de la quête]",
    description: "Commande réservée au staff ! Permet de valider une quête pour un joueur.",
    run: (client, message, args) => {
        // Start of error report
        if(!message.guild.member(message.author).hasPermission('KICK_MEMBERS')){ 
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Vous n'avez pas la permission d'user de cette commande."
            ));
            return;
        }
        
        // Check if is a real user
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

        if(args[1]) var q = args[1];

        for(let i = 2; i < args.length; i++){
            q = q + " " + args[i];
        }

        if(!client.quests.has(q)){
            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                ":warning: Ce nom de quête n'existe pas, utilisez ``=quêtes`` pour prendre connaissance de celles créées."+commandUsage()
            ));
            return;
        }
        // End of error report

        // Execution
        client.con.query(`SELECT * FROM quest WHERE id = '${member.id}'`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1) {
                client.con.query(`INSERT INTO quest (id,quest) VALUES ('${member.id}', ?)`, [q], console.log);
            
                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "Validation-quête",
                    ":white_check_mark: Quête correctement validée."
                ));
            }else{
                var find = false;

                for(let i = 0; i < rows.length; i++){
                    if(rows[i].quest == q){
                        find = true;
                        break;
                    }
                }

                if(!find){
                    client.con.query(`INSERT INTO quest (id,quest) VALUES ('${member.id}', ?)`, [q], console.log);
                    
                    message.channel.send(addEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "Validation-quête",
                        ":white_check_mark: Quête correctement validée."
                    ));
                }else{
                    message.channel.send(addWarnEmbed(
                        message.author.username,
                        message.author.avatarURL,
                        "E R R E U R",
                        ":warning: Cette personne a déjà validé cette quête."
                    ));
                }
            }
        });
        return;
    }
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=valider-quête [tag membre du serveur] [nom de la quête]``";
};