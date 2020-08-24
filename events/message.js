const { addMissionLevelUpEmbed } = require('../tools/embed.js');
const missions = require('../missions/missions.json');

module.exports = (client, message) => {
    if(message.author.bot) return; //Si le message provient d'un bot, on ne l'analyse pas.
	if(message.channel.type == "dm" || message.channel.type == "group") return; //Empêche le traitement des message en messages privés.
	if(!message.content.startsWith(client.prefix)){ //Si le message ne débute pas avec le prefix, on ne l'analyse pas pour les cmds.
		var canXP = false;

		if(client.wait.has("msgXP"+message.author.id)){
			var canXPAt = new Date(client.wait.get("msgXP"+message.author.id));
			canXPAt = new Date(canXPAt.setMinutes(canXPAt.getMinutes()+5)); // Ajout de 5 minutes

			if(canXPAt <= message.createdAt){
				client.wait.delete("msgXP"+message.author.id);
				canXP = true;
			}
		}else canXP = true;

		if(canXP) {
			message.content = client.removeEmojis(message.content);

			client.con.query(`SELECT * FROM channelxp_ban WHERE idServer = '${message.guild.id}' AND idChannel = '${message.channel.id}';`, (err, rows) => {
				if(err) throw err;

				if(rows.length < 1){
					let XPPerMsg = 5;
					XPPerMsg += message.content.trim().length/100;

					client.con.query(`SELECT * FROM stats WHERE id = '${message.author.id}'`, (err, rows) => {
						if(err) throw err;

						if(rows.length < 1) {
							client.con.query(`INSERT INTO stats (id) VALUES ('${message.author.id}')`, console.log);
						}else{
							let amount = parseInt(rows[0].xp) + XPPerMsg;
							let xpToLevelUp = 5 * (rows[0].lvl ^ 2) + 50 * rows[0].lvl + 100;

							if(amount > xpToLevelUp){
								if(rows[0].overAmount == null){
									amount -= xpToLevelUp;
									client.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${message.author.id}'`, [xpToLevelUp, amount], console.log);
									client.wait.set("msgXP"+message.author.id, new Date());
									let nextLvl = parseInt(rows[0].lvl)+1;
									message.author.send(addMissionLevelUpEmbed(
										message.author.username,
										message.author.avatarURL,
										nextLvl,
										missions[nextLvl]
									));
								}
							}else{
								if(rows[0].overAmount != null){
									amount += rows[0].overAmount;

									if(amount > xpToLevelUp){
										amount -= xpToLevelUp;
										client.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${message.author.id}'`, [xpToLevelUp, amount], console.log);
										client.wait.set("msgXP"+message.author.id, new Date());
									}else{
										client.con.query(`UPDATE stats SET xp = ?, overAmount = ? WHERE id = '${message.author.id}'`, [amount, null], console.log);
										client.wait.set("msgXP"+message.author.id, new Date());
									}
								}else{
									client.con.query(`UPDATE stats SET xp = ? WHERE id = '${message.author.id}'`, [amount], console.log);
									client.wait.set("msgXP"+message.author.id, new Date());
								}
							}
						}
					});
				}
			});
		}
	}else{
		console.log(`Checking message : ${message.content}; source : ${message.author.username}`);

		const args = message.content.slice(client.prefix.length).trim().split(/ +/g); //On récupère les arguments donnés avec la commande
		const command = args.shift().toLowerCase(); //On met le message analysé en minuscule

		for(let i = 0; i < args.length; i++)
			args[i] = args[i].toLowerCase();

		let cmd = (client.commands.get(command) || client.aliases.get(command));

		if(cmd) cmd.run(client, message, args);

		console.log("Check finished!");
	}
}

//