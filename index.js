const { Client, Collection } = require("discord.js");
const client = new Client({ disableEveryone: true });
const { token, prefix } = require("./config.json");
const { addEmbed, addWarnEmbed } = require("./tools/embed.js");

client.prefix = prefix;

// Start of connection code
	const mysql = require("mysql");
	
	// Connection to DB
	 var con = mysql.createConnection({
		host: "eu-cdbr-west-02.cleardb.net",
		user: "b7a21d605e4cee",
		password: "49225510",
		database: "heroku_705890aacb271b7",
		multipleStatements: true
	});
	//Connexion Db tets
	/*var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "ulizium",
		multipleStatements: true
	});*/

	// Advert when connected to DB
	con.connect(function(err) {
		if(err) return console.log('DB : Error when connecting', err);
			console.log("DB : Connected to database !");
	});

	/*con.query(`DROP TABLE compagnon;`, err => { if(err) throw err; });*/
	/*con.query(`CREATE TABLE compagnon( id VARCHAR(30) PRIMARY KEY, level INT, xp INT, overXP INT);`, err => { if(err) throw err; });*/

	// Keep connection function because of DB force timeout
	setInterval(function () {
		con.query('SELECT 1', (err) => { 
			if(!err){
				return console.log("DB : Keep connection alive !");
			}else{
				console.log("Erreur à la connexion de la DB");
				client.user.setPresence({
        			game: {
           		 	name: 'Erreur avec la base de donnée',
            		type: 0
        			}
    			});
			}
		});
	}, 57000);

	// Save connection on bot object to manipulate it in others functions
	client.con = con;
// End of connection code

// Start of tables code
	const fs = require("fs");

	// Vars
	const comDir = './commands/';
	const steppesDir = './mobs/steppes/';
	const weseyDir = './mobs/wesey/';
	const polarDir = './mobs/polar/';
	const eventsDir = './mobs/event/';
	const resDir = './ressources/';
	const combDir = './combat/';
	const workDir = './métiers/';
	const questDir = './quêtes/';
	//const staffDir = './staff/';
	const coffresDir = './coffres/';
	const questsRankDir = './quêtes/quêtes-grade/';

	const zonesDir = [ steppesDir, weseyDir, polarDir, eventsDir ];

	// Tables
	client.commands = new Collection();
	fs.readdir(comDir, (err, files) => {
		files.forEach(file => {
			client.commands.set(file.replace('.js',''), require(comDir+file));
		});
	});

	client.aliases = new Collection();
	fs.readdir(comDir, (err, files) => {
		files.forEach(file => {
			let content = require(comDir+file);

			if(content.alias){
				content.alias.forEach(al => {
					client.aliases.set(al, require(comDir+file));
					console.log(`<Alias: ${al}; File: ${comDir+file}>`);
				});
			}
		});
	});

	client.mobs = new Collection();
	for(let i = 0; i < zonesDir.length; i++){
		let zone = zonesDir[i];
		fs.readdir(zone, (err, files) => {
			files.forEach(file => {
				if(fs.existsSync(zone+file) && fs.lstatSync(zone+file).isFile())
					client.mobs.set(file.replace('.js',''), require(zone+file));
			});
		});
	}

	client.ressources = new Collection();
	fs.readdir(resDir, (err, files) => {
		files.forEach(file => {
			client.ressources.set(file.replace('.json',''), require(resDir+file));
		});
	});

	/*client.staff = new Collection();
	fs.readdir(staffDir, (err, files) => {
		files.forEach(file => {
			client.staff.set(file.replace('.json',''), require(staffDir+file));
		});
	});*/

	client.wait = new Collection();

	client.combats = new Collection();
	fs.readdir(combDir, (err, files) => {
		files.forEach(file => {
			client.combats.set(file.replace('.json',''), require(combDir+file));
		});
	});

	client.métiers = new Collection();
	fs.readdir(workDir, (err, files) => {
		files.forEach(file => {
			client.métiers.set(file.replace('.json',''), require(workDir+file));
		});
	});

	client.quests = new Collection();
	fs.readdir(questDir, (err, files) => {
		files.forEach(file => {
			if(fs.existsSync(questDir+file) && fs.lstatSync(questDir+file).isFile())
				client.quests.set(file.replace('.json',''), require(questDir+file));
		});
	});

	client.coffres = new Collection();
	fs.readdir(coffresDir, (err, files) => {
		files.forEach(file => {
			client.coffres.set(file.replace('.json',''), require(coffresDir+file));
		});
	});

	client.questsRank = new Collection();
	fs.readdir(questsRankDir, (err, files) => {
		files.forEach(file => {
			client.questsRank.set(file.replace('.json',''), require(questsRankDir+file));
		});
	});

	client.removeInvalidChars = string => {
		return (string.replace(/(\:.*?\:)|(\s|`|\*|~|>|_)|(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '')).toLowerCase();
	}

	client.removeEmojis = string => {
		return string.replace(/(\:([a-zA-Z0-9\#\~\'\&\/\`\"\(\@\)\[\]\{\°\}\\\^\$\|\?\*\+\.\<\>\-\=\!\_\*\$\£\¤\µ\¨\%\?\!\;\,\§]*)\:)/g, '');
	}

	console.log("\n=================[ DEBUT - ITEMS ]=================");

	client.itemsTemp = require('./items/items.json');
	client.items = new Collection();
	client.itemsTemp.forEach(item => {
		let itemName = client.removeInvalidChars(item.name)
		console.log(`Item '${item.name}' succesfully registered as '${itemName}'.`)
		client.items.set(itemName, item);
	});
	client.itemsTemp = null;

	console.log("=================[ FIN - ITEMS ]=================\n");
// End of table codes

// Start of events code
	const events = {
		"1": {
			"hour": "18",
			"minute": "0",
			"second": "0",
			"mobs": [
				{ "mob": "shyva", "channelID": "609055942599901267" },
				{ "mob": "colossus", "channelID": "609084044130516993" } // Test channel id : 609113776582688778
			]
		},
		"5": {
			"hour": "21",
			"minute": "0",
			"second": "0",
			"mobs": [
				{ "mob": "shyva", "channelID": "609055942599901267" },
				{ "mob": "colossus", "channelID": "609084044130516993" } // Test channel id : 609113776582688778
			]
		},
		"0": {
			"hour": "18",
			"minute": "0",
			"second": "0",
			"mobs": [
				{ "mob": "shyva", "channelID": "609055942599901267" }, // Donjon steppes : 609055942599901267
				{ "mob": "colossus", "channelID": "609084044130516993" } // Donjon wesey : 609084044130516993
			]
		}
	};

	const scheduleSystem = [
		{hour: 6, minute:0, second:0, msg: "> 🌙 | _**À l'horizon . . l'astre solaire se fond dans les océans et les montagnes, laissant donc place à sa consoeur, la Lune !**_\n\n__** / ! \\ **__ : Des changements vinrent à paraître, les bêtes hurlent à la lueur de l'astre lunaire.\n\nhttps://i.pinimg.com/originals/84/f5/a3/84f5a3c8cda55302464f059d903c266a.png"},
		{hour: 12, minute:0, second:0, msg: "> ☀️  | _**La lune se retire laissant derrière elle une traînée fantomatique de sa lueur dans les cieux, le soleil quant à lui impose sa lumière aux êtres de la terre, bénissant les récoltes, réchauffant les eaux et délivrant les faibles des ténèbres**_\n\n__** / ! \\ **__ : Les monstres perdront tout bonus, ils redeviennent ce qu'ils étaient à leur état premier !\n\nhttps://clipartart.com/images/afternoon-sun-clipart-11.png"},
		{hour: 18, minute:0, second:0, msg: "> 🌙 | _**À l'horizon . . l'astre solaire se fond dans les océans et les montagnes, laissant donc place à sa consoeur, la Lune !**_\n\n__** / ! \\ **__ : Des changements vinrent à paraître, les bêtes hurlent à la lueur de l'astre lunaire.\n\nhttps://i.pinimg.com/originals/84/f5/a3/84f5a3c8cda55302464f059d903c266a.png"},
		{hour: 23, minute:00, second:00,  msg: "> ☀️  | _**La lune se retire laissant derrière elle une traînée fantomatique de sa lueur dans les cieux, le soleil quant à lui impose sa lumière aux êtres de la terre, bénissant les récoltes, réchauffant les eaux et délivrant les faibles des ténèbres**_\n\n__** / ! \\ **__ : Les monstres perdront tout bonus, ils redeviennent ce qu'ils étaient à leur état premier !\n\nhttps://clipartart.com/images/afternoon-sun-clipart-11.png"}
	];

	client.on("ready", () => {
		console.log(`INIT : Bot has started !`);
		client.user.setActivity("Obtenir aide : =wiki");

		const now = new Date(Date.now());
		console.log(`Maintenant : ${now}`);

		// Set time out for auto-events
		/*if(events[new Date(Date.now()).getDay()]){
			const row = events[new Date(Date.now()).getDay()];
			const time = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), row.hour, row.minute, row.second);
			console.log(`Event-auto : ${time}`);

			if(now<=time){
				const timeLeft = time - now;
				console.log(`Temps restant : ${timeLeft}`);
				setTimeout(spawnEvent,timeLeft,row);
			}
		}*/

		// Set timers of day/night system
		const hour = now.getUTCHours();
		for( let i = 0; i < scheduleSystem.length; i++ ){
			if( scheduleSystem[i].hour >= hour ){
				let time = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), scheduleSystem[i].hour, scheduleSystem[i].minute, scheduleSystem[i].second);
				if(now <= time){
					console.log(`Temps restant avant schedule n°${i+1} : ${time - now}`);
					setTimeout( scheduleEvent, time - now, scheduleSystem[i] );
				}
			}
		}

		// Set auto-restart function
		const timeRestart = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 1);
		timeRestart.setDate(timeRestart.getDate()+1);

		console.log(`Restart : ${timeRestart}`);

		if(now<=timeRestart){
			const timeLeftRestart = timeRestart - now;
			console.log(`Temps restant : ${timeLeftRestart}`);
			setTimeout(resetBot,timeLeftRestart);
		}

		addOfferToCache();
	});

	function resetBot(){
		console.log(`AUTO-RESTART : Bot is restarting`);
		client.destroy();
		client.login(token);
	}

	function spawnEvent(row){
		//const id = "554035742959993030"; // Test serveur ID.
		const id = "591030658898329639"; // Uly server
		const guilds = client.guilds;

		if(!guilds.has(id)) return console.log(`EVENT : Didn't found guild with id -> ${id}`);
		const guild = guilds.get(id);
		if(!guild.available) return console.log("EVENT : Guild isn't available !");
		const chans = guild.channels;

		for(let i = 0; i < row.mobs.length; i++){
			const arg = row.mobs[i];

			if(!chans.has(arg.channelID)) return console.log(`EVENT : The event hasn't a valide channel ID !\nDetails : ${arg}`);
			const chan = chans.get(arg.channelID);
			if(!client.mobs.has(arg.mob)) return console.log(`EVENT : The event hasn't a valide mob !\nDetails : ${arg}`);
			const mob = client.mobs.get(arg.mob);

			chan.send(addEmbed(
				client.user.username,
				client.user.avatarURL,
				`EVENT : ${mob.getName()}`,
				`${mob.getDesc()}\n\n__**Statistiques :**__\nHP : ${mob.getHP()}\nPuissance : ${mob.getPower()}`,
				mob.getPic()
			));
		}
	};

	function scheduleEvent(row){
		//const id = "554035742959993030"; // Test vooxo serveur ID.
		const id = "591030658898329639"; // Uly server
		//const id = "712781365518794812" //Serveur id
		const guilds = client.guilds; 

   
		//const channelID = "614130224279584778"; // Test channel ID.
		const channelID = "690620010196107294"; // Uly chan
		//const channelID = "714906781612113930" //Test voxoo channel id

		if(!guilds.has(id)) return console.log(`SCHEDULESYS : Didn't found guild with id -> ${id}`);
		const guild = guilds.get(id);
		if(!guild.available) return console.log("SCHEDULESYS : Guild isn't available !");
		const chans = guild.channels;
		if(!chans.has(channelID)) return console.log(`SCHEDULESYS : The schedule system hasn't a valide channel ID !\nDetails : ${channelID}`);
		const chan = chans.get(channelID);

		if( row.hour == 23 || row.hour == 12 ) {
			client.con.query("SELECT * FROM nbjour WHERE id = 0", (err, rows) => {
				if (err) throw err;
				const nbJour = rows[0].nbJour + 1;

				client.con.query(`UPDATE nbjour SET nbJour = ${nbJour} WHERE id = 0;`, err => {
					if (err) throw err;
					chan.send("<@691680822196961310>\n\n~°•L'an `` 1 4 3 0`` - Jour [ ``"+ nbJour +"`` ]\n\n"+ row.msg);
				
				});
			});
		}else{
			client.con.query("SELECT * FROM nbjour WHERE id = 0", (err, rows) => {
				if (err) throw err;

				chan.send("<@691680822196961310>\n\n~°•L'an `` 1 4 3 0`` - Jour [ ``"+ rows[0].nbJour +"`` ]\n\n"+ row.msg);
			});
		}
	}

	async function addOfferToCache(){
		const channel = client.guilds.get("591030658898329639").channels.get("696874799074639872");
		const fetched = await channel.fetchMessages({limit: 99});
		channel.bulkDelete(fetched);

		client.offres = new Collection();

		client.con.query(`SELECT * FROM offres;`, (err, rows) => {
			if(err) throw err;

			if(rows.length >= 1) {
				rows.forEach(row => {
					channel.send(addEmbed(
						client.user.username,
						client.user.avatarURL,
						"O F F R E",
						`:page_facing_up: <@${row.authorID}> a mit en vente {\`\`${row.nb}\`\`} - '${row.item}' pour ${row.price} :gem:.\n\n**Instructions :**\n✅ -> Cette réaction permet d'acheter l'offre.\n❌ -> Celle-ci permet au propriétaire de l'offre de l'annuler.`
					)).then(msg => {
						msg.react("✅");
						msg.react("❌");

						client.offres.set(msg.id, row);
					}).catch(console.error);
				});
			}
		});
	}

	client.addXPToMate = (authorID, xp) => {
		client.con.query(`SELECT * FROM compagnon WHERE id = '${authorID}';`, (err, rows) => {
			if(err) throw err;

			console.log("TEST");

			if(rows.length < 1) {
				var overAmount = 0;
				if(xp > 25) overAmount = xp - 25;
				client.con.query(`INSERT INTO compagnon VALUES('${authorID}', 1, ${xp}, ${overAmount});`, err => { if(err)throw err; });
			}else{
				xp = parseInt(xp) + parseInt(rows[0].xp);
				var overAmount = 0;
				var lvl = parseInt(rows[0].level);
				var xpMax = 25 * lvl * (1 + Math.floor(lvl / 5));
				if(xp > xpMax){
					overAmount = xp - xpMax;
					xp = xpMax;
				}
				var overXP = parseInt(rows[0].overXP) || 0;
				client.con.query(`UPDATE compagnon SET xp = ${xp}, overXP = ${overXP + parseInt(overAmount)} WHERE id = '${authorID}';`, err => { if(err) throw err; });
			}
		});
	}
// End of events code

// Start of fonctions code
	// Check message
	client.on("message", msg => require("./events/message.js")(client, msg));
	client.on("messageReactionAdd", (messageReaction, user) => require("./events/messageReactionAdd.js")(client, messageReaction, user));
// End of fonctions code

// Make code connect to bot
client.login(token);
