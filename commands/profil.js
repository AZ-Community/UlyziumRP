const { addWarnEmbed, addProfilEmbed } = require('../tools/embed.js');

module.exports = {
	name: "profil",
	alias: [ "pro" ],
	usage: "<tag membre du serveur>",
	description: "Retourne le profil du jouer sélectionné, sinon cela retourne le vôtre.",
	run: (client, message, args) => {
		var id;
		var member;

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
			member = message.guild.member(user);
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
		}else{
			id = message.author.id;
			member = message.member;
		}
		
		client.con.query(`SELECT * FROM stats WHERE id = '${id}';`, (err, rows) => {
			if(err) throw err;

			if(rows.length < 1) {
				client.con.query(`INSERT INTO stats(id) VALUES('${id}');`, err => { 
					if(err) {
						message.channel.send(addWarnEmbed(
							message.author.username,
							message.author.avatarURL,
							"E R R E U R",
							`:warning: Un problème a été recontré, le bot est dans l'incapacité de créer les statistiques de <@${id}>`
						));

						throw err;
					}

					var stats = { xp: 0, lvl: 1, overAmount: 0 };

					client.con.query(`SELECT * FROM compagnon WHERE id = '${id}';`, (err, rows) => {
						if(err) throw err;

						if(rows.length >= 1) {
							stats.compagnon = { lvl: rows[0].level, xp: rows[0].xp, overXP: rows[0].overXP};
						}else{
							if(member.roles.has("674067242555801653") || member.roles.has("674067375552856095")) {
								client.con.query(`INSERT INTO compagnon VALUES('${id}', 1, 0, 0);`, err => { if(err) throw err; });
								stats.compagnon = { lvl: 1, xp: 0, overXP: 0};
							}
						}

						message.channel.send(addProfilEmbed(
							message.author.username,
							message.author.avatarURL,
							stats
						));
					});
				});
			}else{
				var stats = { xp: rows[0].xp, lvl: rows[0].lvl, overAmount: rows[0].overAmount };

				client.con.query(`SELECT * FROM compagnon WHERE id = '${id}';`, (err, rows) => {
					if(err) throw err;

					if(rows.length >= 1) {
						stats.compagnon = { lvl: rows[0].level, xp: rows[0].xp, overXP: rows[0].overXP};
					}else{
						if(member.roles.has("674067242555801653") || member.roles.has("674067375552856095")) {
							client.con.query(`INSERT INTO compagnon VALUES('${id}', 1, 0, 0);`, err => { if(err) throw err; });
							stats.compagnon = { lvl: 1, xp: 0, overXP: 0};
						}
					}

					message.channel.send(addProfilEmbed(
						message.author.username,
						message.author.avatarURL,
						stats
					));
				});
				
			}
		});
		
		return;
	}
}

function commandUsage() {
    return "\n\n:gear: __Utilisation :__ ``=profil <tag membre du serveur>``";
};