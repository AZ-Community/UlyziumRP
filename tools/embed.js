const Discord = require("discord.js");

const math = Math;

function addMobDesc(userName, userAvatar, mob){
	var ret = new Discord.RichEmbed()
	//.setTitle("")
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	//.setDescription("")
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	//.setThumbnail("http://i.imgur.com/p2qNFag.png")
	.setTimestamp() //Afficher la date du message
	//.setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
	.addField("┊ ✧ ೃ༄ ┊__**"+mob.getName()+"**__ : ``"+mob.getKind()+"``"," ꒱ ˊˎ-")
	.addField("|   B e s t i a i r e ~  "+mob.getLevel()+"   |", '\u200B')
	.addField("| :scroll: | ~ > __**INFOS**__","_**"+mob.getDesc()+"**_")
	.addField('\u200B', '\u200B', true)
	.addField("__**S t a t i s t i q u e s**__","**╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮**\n    [ **Points de vie** ]   :heart_exclamation:      | "+mob.getHP()+"\n    [ **Puissance** ]        :boom:      | "+mob.getPower()+"\n**╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯**")
	.addField('\u200B', '\u200B', true)
	.addField("__**C o m p é t e n c e s**__",mob.getCap())
	.addField('\u200B', '\u200B', true)
	.setImage(mob.getPic())
	
	/*let tips = ""
	let tipsTable = mob.getTips()
	for(let i = 0; i < tipsTable.length; i++){
		tips += `\`\`${i+1}\`\` | ${tipsTable[i]}\n`
	}

	ret.addField(`[ ${tipsTable.length} ] __** / ! \\ **__`,tips)*/

	return ret;
};

function addMobActionEmbed(userName, userAvatar, level, name, msg){
	var ret = new Discord.RichEmbed()
		.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
		.setColor(0x00AE86) //Couleur de la ligne verticale
		.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
		.setTimestamp() //Afficher la date du message
		.addField("[ :dragon: ] ``"+name+"``\n[ Rang ] ~ "+level,"╭────── ♢ ──── ⋅ ⋅ ──\n°•\n[ :crossed_swords: ] => "+msg+"\n•°\n╰────── ♢ ──── ⋅ ⋅ ──")
	
	return ret;
};

function addWarnEmbed(userName, userAvatar, kind, msg){
	return addEmbed(userName, userAvatar, kind, msg, null, 'RED');
};

function addEmbed(userName, userAvatar, title, msg, gif, color){
	var ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(color || 0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+title+"`` ~ **U l y z i u m**\n ꒱ ˊˎ-",msg)
	
	if(gif) ret.setImage(gif);

	return ret;
};

function addCombatDesc(userName, userAvatar, mob){
	var ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+mob.getName()+"`` ~ **U l y z i u m**\n ꒱ ˊˎ-", "\u200B")
	.addField("[ B e s t i a i r e ] ~ "+mob.getLevel(), `${mob.getDesc()}\n\n__**Statistiques :**__\nHP : ${mob.getHP()} :heart:\nPuissance : ${mob.getPower()} :boom:`)
	.setImage(mob.getPic());

	return ret;
};

function addLootDesc(userName, userAvatar, mob, table){
	var msg = "";

	var ret = new Discord.RichEmbed()
	//.setTitle("")
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	//.setDescription("")
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	//.setThumbnail("http://i.imgur.com/p2qNFag.png")
	.setTimestamp() //Afficher la date du message
	//.setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
	.addField("**L o O t**", ":sparkles:")
	.addField("----------", "| ``"+mob+"``")
	
	for(let i = 0; i < table.length; i++){
		const prob = math.random();
		const probApparition = table[i].prob;
		const def = table[i].default;
		var nb = 0;

		if(prob>=probApparition){
			if(table[i].title === "ziums") nb = math.floor(def-def*0.1*math.random())
			else nb = math.floor(1 + def * math.random());
		}

		if( nb > 0 ) msg = msg + "\n " + table[i].icon + " " + table[i].title + " : " + nb;
	}

	ret.addField("----------", msg)

	return ret; //addEmbed(userName, userAvatar, "R E C O M P E N S E S - "+mob, msg);
};

function addEquipementDesc(userName, userAvatar, table){
	var armor = "";
	var cristaux = "";
	var minerais = "";
	var stats = "";

	for(let i = 0; i < table.prérequis[0].length; i++){
		armor = armor + "| ``] "+table.prérequis[0][i].quantité+" [`` "+table.prérequis[0][i].title+"\n";
	}

	for(let i = 0; i < table.prérequis[1].length; i++){
		cristaux = cristaux + "| ``] "+table.prérequis[1][i].quantité+" [`` "+table.prérequis[1][i].title+"\n";
	}

	for(let i = 0; i < table.prérequis[2].length; i++){
		minerais = minerais + "| ``] "+table.prérequis[2][i].quantité+" [`` "+table.prérequis[2][i].title+"\n";
	}

	for(let i = 0; i < table.stats.length; i++){
		stats = stats + table.stats[i] +"\n";
	}

	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+table.title+"`` ~ **U l y z i u m**", " ꒱ ˊˎ-")
	.addField("__**Description :**__", table.desc)
	.addBlankField(true)
	
	if(table.prérequis[1][0]) ret.addField("__**L'obtention :**__ :hammer_pick:\n\n", table.obtention+"\n\n╭── ⋅ ⋅ ───:gear:─── ⋅ ⋅ ──╮\n"+armor+"╰── ⋅ ⋅ ───  ♢  ─── ⋅ ⋅ ──╯\n\n╭── ⋅ ⋅ ───:gem:─── ⋅ ⋅ ──╮\n"+cristaux+"╰── ⋅ ⋅ ───  ♢  ─── ⋅ ⋅ ──╯\n\n╭── ⋅ ⋅ ───:pick:─── ⋅ ⋅ ──╮\n"+minerais+"╰── ⋅ ⋅ ───  ♢  ─── ⋅ ⋅ ──╯\n\n")
	else ret.addField("__**L'obtention :**__ :hammer_pick:\n\n", table.obtention+"\n\n╭── ⋅ ⋅ ───:gear:─── ⋅ ⋅ ──╮\n"+armor+"╰── ⋅ ⋅ ───  ♢  ─── ⋅ ⋅ ──╯\n\n╭── ⋅ ⋅ ───:pick:─── ⋅ ⋅ ──╮\n"+minerais+"╰── ⋅ ⋅ ───  ♢  ─── ⋅ ⋅ ──╯\n\n")
	ret.addBlankField(false)
	ret.addField("__**Statistiques & Compétences :**__ :diamond_shape_with_a_dot_inside:\n\n", stats+"\n\n")
	//.addField("***| "+table.capacité.title+" |***","*"+table.capacité.desc+"*")
	ret.setImage(table.image)
	ret.addBlankField(false)

	for(let i = 0; i < table.capacité.length; i++){
		ret.addField(`***| ${table.capacité[i].title} |***`,`*${table.capacité[i].desc}*`);
	}

	return ret;
};

function addListEmbed(userName, userAvatar, title, table, pageNumber, gif, option){
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+title+" - "+pageNumber+"``", " ꒱ ˊˎ-")
	var i = 0;

	if(option){
		var tab = [];
		var y = 0;
		for(let i = 0; i<table.length; i++){
			let zone = table[i].getKind().toLowerCase();
			if(zone === option){
				tab[y] = table[i];
				y++;
			}
		}

		while(i < 24 && i+24*(pageNumber-1) < tab.length){
			let zone = tab[i+24*(pageNumber-1)].getKind().toLowerCase();

			if(zone === option){
				let cmd = tab[i+24*(pageNumber-1)].getCommand();
				ret.addField(tab[i+24*(pageNumber-1)].getName(),":gear: __Utilisation :__ ``="+cmd+"``");
			}
			
			i++;
		}
	}else{
		while(i < 24 && i+24*(pageNumber-1) < table.length){
			let cmd = table[i+24*(pageNumber-1)].command || table[i+24*(pageNumber-1)].getCommand();
			ret.addField(table[i+24*(pageNumber-1)].title || table[i+24*(pageNumber-1)].getName(),":gear: __Utilisation :__ ``="+cmd+"``");
			i++;
		}
	}

	if(gif) {
		ret.setImage(gif);
	}

	return ret;
};

function addRessourceDesc(userName, userAvatar, table){
	var obtention = "";
	var utilisation = "";

	for(let i = 0; i < table.obtention.length; i++){
		obtention = obtention + table.obtention[i]+"\n\n";
	}

	for(let i = 0; i < table.useTo.length; i++){
		utilisation = utilisation + table.useTo[i]+"\n\n";
	}

	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+table.title+"`` ~ **U l y z i u m**", " ꒱ ˊˎ-")
	.addField("**| :scroll: | ~ __INFOS__**","**"+table.desc+"**")
	.addBlankField(true)
	.addField("**| :tools: | __Composant :__**","__╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮__\n\n"+utilisation/*+"╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯"*/)
	.addBlankField(true)
	.addField("**| :tools: | __L'obtention :__**","__╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮__\n\n"+obtention/*+"╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯"*/)
	.setImage(table.image)

	return ret;
};

function addArmeDesc(userName, userAvatar, table){
	var stats = "";
	var prérequis = "";

	for(let i = 0; i < table.stats.length; i++){
		stats = stats + table.stats[i] + "\n";
	}

	for(let i = 0; i < table.prérequis.length; i++){
		prérequis = prérequis + "| "+table.prérequis[i].quantité+" "+table.prérequis[i].title+"\n";
	}

	const ret = new Discord.RichEmbed() 
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+table.title+"`` ~ **U l y z i u m**"," ꒱ ˊˎ-")
	.addField("**| :scroll: | ~ __INFOS__**","**"+table.desc+"**")
	.addBlankField(true)
	.addField("__**Statistiques :**__\n__╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮__", stats)
	.addBlankField(true)
	.addField("__**Prérequis :**__\n__╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮__", prérequis)
	.setImage(table.image)

	return ret;
};

function addWorkEmbed(userName, userAvatar, table){
	const ret = new Discord.RichEmbed() 
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊ **U l y z i u m**\n ꒱ ˊˎ-","╭── ⋅ ⋅ ──────────────────── ⋅ ⋅ ──╮\n		『 :moneybag: __**"+table.title+"**__ ``Métiers`` :moneybag: 』\n╰── ⋅ ⋅ ──────────────────── ⋅ ⋅ ──╯")
	.addField("**| :scroll: | ~ __INFOS__**","**"+table.desc+"**")
	.setImage(table.pic)

	for(let i = 0; i < table.détails.length; i++ ){
		ret.addBlankField(true)
		ret.addField(`__**${table.détails[i].title}**__`,`**${table.détails[i].desc}**`)
	}

	return ret;
};

function addQuestEmbed(userName, userAvatar, table){
	let prérequis = "";
	let rewards = "";

	for(let i = 0; i < table.requires.length; i++ ){
		if(table.requires[i].icon) prérequis = prérequis + table.requires[i].icon;

		prérequis = prérequis + ` ${table.requires[i].title} : ${table.requires[i].number}\n`;
	}

	for(let i = 0; i < table.rewards.length; i++ ){
		rewards = rewards + `| ${table.rewards[i]}\n`;
	}

	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+table.title+"`` ~ **U l y z i u m**", " ꒱ ˊˎ-")
	.addField("**| :scroll: | ~ __INFOS__**","**"+table.desc+"**")
	.setImage(table.picture)

	for(let i = 0; i < table.dialog.length; i++){
		ret.addField("\u200B",`*《 ${table.dialog[i]} 》*`);
	}

	ret.addBlankField(true);
	ret.addField("**| :moneybag: | ~ __PREREQUIS__**", prérequis);

	ret.addBlankField(true);
	if(!table.choice) ret.addField("**| :moneybag: | ~ __RECOMPENSES__**", rewards);
	else ret.addField("**| :moneybag: | ~ __RECOMPENSES__ (à choisir !)**", rewards);

	return ret;
};

function addProfilEmbed(userName, userAvatar, row){
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.setImage("https://i.imgur.com/QqkfZuC.png")
	.addField("__**﹛ㄩｌｙ乙ｉｕｍ﹜**__:bamboo:","╭    ∙    −    ﹣    ⎯      ﹣    −    ∙    ╮\n  |           E x p é r i e n c e          |\n⎯   :black_small_square:     ─    °    ▔    °    ─     :black_small_square: ⎯")
	.addField("\u200B", `	:sparkles: [ Lvl ] ~ > \`\`${row.lvl}\`\`\n□========□\n| ${row.xp} / ${5 * (row.lvl ^ 2) + 50 * row.lvl + 100}\n□========□\n:small_blue_diamond: [ XP+ ] ~ > \`\`${row.overAmount || 0}\`\``);

	if(row.compagnon) {
		var mate = row.compagnon;
		var msg = `:dragon: **~ __Familier / Compagnon__**\n[ Lvl ] ~> ${mate.lvl}\n□========□\n[`;
		var lvl = parseInt(mate.lvl);
		var xpMax = 25 * lvl * (1 + math.floor(lvl / 5));
		var ratio = math.floor(10 * parseInt(mate.xp) / xpMax);

		for(let i = 0; i < ratio; i++) {
			msg = msg + "●";
		}

		for(let i = 0; i < 10 - ratio; i++) {
			msg = msg + "○";
		}

		msg = `${msg}] ~> ${mate.xp}/${xpMax}\n□========□\n[XP+] ~> ${mate.overXP || 0}`;

		ret.addField("\u200B", msg);
	}

	return ret;
}

const isValidURL = (string) => {
	try {
	  new URL(string);
	  return true;
	} catch (_) {
	  return false;  
	}
}

function addCreateEmbed(userName, userAvatar, tab, nb){
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	
	.addField(`~ [ **${tab.title}** ] ~`, "\u200B")
	.addField(`< ${nb}° Étape >`, "\u200B")

	for(let i = 0; i < tab.msg.length; i++ )
		ret.addField(tab.msg[i], "\u200B");

	if(tab.picture) ret.setImage(tab.picture);

	return ret;
}

/*function addFamiliaEmbed(userName, userAvatar, tab) {
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("**U l y z i u m**", `╭── ⋅ ⋅ ─────────────── ⋅ ⋅ ──╮\n	『 :scroll: FAMILIA :scroll: 』\n╰── ⋅ ⋅ ─────────────── ⋅ ⋅ ──╯`)
	
	.addField(`***Nom :*** ${tab.nom}`, "\u200B")
	.addField(`***Date de création :*** ${tab.date}`, "\u200B")
	.addField(`***Description :*** ${tab.description}`, "\u200B")
	.addField(`***Pour plus d'informations :*** ${tab.lien}`, "\u200B")

	if(isValidURL(tab.image)) ret.setThumbnail(tab.image);

	return ret;
}*/

function addCoffreEmbed(userName, userAvatar, title, reward) {
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField(`[ 🎁 ] 💠\n__**Ouverture coffre**__ ~ • • • [ ${title} ]`, reward)

	return ret;
}

function addListMembresEmbed(userName, userAvatar, title, table, pageNumber, msg) {
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+title+" - "+pageNumber+"``", " ꒱ ˊˎ-")

	var i = 0;
	while(i < 24 && i+24*(pageNumber-1) < table.length){
		ret.addField(`Nom : ${table[i+24*(pageNumber-1)].name}`,"> __Rang :__ ``"+table[i+24*(pageNumber-1)].rang+"``");
		i++;
	}

	return ret;
}

function addListFamiliaEmbed(userName, userAvatar, title, table, pageNumber) {
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊``"+title+" - "+pageNumber+"``", " ꒱ ˊˎ-")

	var i = 0;
	while(i < 24 && i+24*(pageNumber-1) < table.length){
		let nom = table[i+24*(pageNumber-1)].nom;
		ret.addField(`Familia : ${nom}`,`> __Informations :__ \`\`=familia ${nom}\`\``);
		i++;
	}

	return ret;
}

function addMissionLevelUpEmbed(userName, userAvatar, lvl, mission) {
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("\u200B", "__**F é l i c i t a t i o n s**__ [ ⚠ ]")
	.addField("``| Vous êtes en droit de franchir un niveau | ``", "\u200B")
	.addField("[ **Quête de Croissance** - > Niveau ``"+lvl+"`` ]", mission)

	return ret;
}

function addListItemsEmbed(userName, userAvatar, search, tab) {
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("\u200B", "__**L i s t e - d ' i t e m s**__ [ ⚠ ]")
	.addField(`*Résultats trouvés pour la recherche suivante:* ${search}`, "\u200B")

	for(let i = 0; i < tab.length; i++) {
		ret.addField(`Nom de l'item: ${tab[i]}`, `Obtenir plus de détails sur cet item: \`\`=item-information ${tab[i]}\`\``);
	}

	return ret;
}

function addItemEmbed(userName, userAvatar, item, isStaff) {
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	.addField("\u200B", "__**I n f o r m a t i o n s - i t e m **__ [ :page_with_curl: ]")
	.addField("Nom", item.name)
	
	if(item.description) ret.addField("Description", item.description, true);
	if(item.purchasable) {
		ret.addField("Achetable ?", "Oui", true);
		ret.addField("Prix", item.price, true);
	}else ret.addField("Achetable ?", "Non");
	if(item.craftable) {
		ret.addField("Fabricable ?", "Oui", true);

		var msg = "";
		for(let i = 0; i < item.craft.length; i++) {
			msg = `${msg}{${item.craft[i].amount}} - ${item.craft[i].item}\n`;
		}

		ret.addField("Items requis :", msg, true);
	}
	if(isStaff){
		if(item.visible) ret.addField("Visible dans l'inventaire ?", "Oui", true);
		if(item.roleToGiveID) ret.addField("Rôle à donner après utilisation", item.roleToGiveID, true);
		if(item.roleToRemoveID) ret.addField("Rôle à retirer après utilisation", item.roleToRemoveID, true);
		if(item.answer) ret.addField("Réponse de l'utilisation", item.answer, true);
	}

	return ret;
}

function addInventoryEmbed(userName, userAvatar, table, pageNumber, gif){
	const ret = new Discord.RichEmbed()
	.setAuthor(userName, userAvatar) //Nom et avatar de l'auteur du message
	.setColor(0x00AE86) //Couleur de la ligne verticale
	.setFooter("Made by Ben for ULYZIUM RP", "https://cdn.discordapp.com/attachments/591030658898329641/612664395608358917/3a5ee9feea132b9edb68f215b741b27f.png")
	.setTimestamp() //Afficher la date du message
	
	var totalPageDecimal = table.length / 10;
	var totalPage = math.floor(totalPageDecimal);

	if(totalPage < totalPageDecimal) totalPage = totalPage + 1;

	var msg = `__**Inventaire**__ ~ {page ${pageNumber}/${totalPage}}\n\n`;
	var firstElem = 10 * (pageNumber - 1);
	for(let i = firstElem; i < firstElem + 10 && i < table.length; i++) {
		msg = `${msg} {\`\`${table[i].nb}\`\`} - ${table[i].item}\n`;
	}

	ret.addField("\u200B", msg);

	if(gif) {
		ret.setImage(gif);
	}

	return ret;
};

module.exports.addMobDesc = addMobDesc;
module.exports.addMobActionEmbed = addMobActionEmbed;
module.exports.addWarnEmbed = addWarnEmbed;
module.exports.addEmbed = addEmbed;
module.exports.addCombatDesc = addCombatDesc;
module.exports.addLootDesc = addLootDesc;
module.exports.addEquipementDesc = addEquipementDesc;
module.exports.addListEmbed = addListEmbed;
module.exports.addRessourceDesc = addRessourceDesc;
module.exports.addArmeDesc = addArmeDesc;
module.exports.addWorkEmbed = addWorkEmbed;
module.exports.addQuestEmbed = addQuestEmbed;
module.exports.addProfilEmbed = addProfilEmbed;
//module.exports.ficheEmbed = ficheEmbed;
module.exports.addCreateEmbed = addCreateEmbed;
//module.exports.addFamiliaEmbed = addFamiliaEmbed;
module.exports.addCoffreEmbed = addCoffreEmbed;
module.exports.addListMembresEmbed =addListMembresEmbed;
module.exports.addListFamiliaEmbed = addListFamiliaEmbed;
module.exports.addMissionLevelUpEmbed = addMissionLevelUpEmbed;
module.exports.addListItemsEmbed = addListItemsEmbed;
module.exports.addItemEmbed = addItemEmbed;
module.exports.addInventoryEmbed = addInventoryEmbed;