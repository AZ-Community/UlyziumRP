const { addEmbed } = require('../tools/embed.js');

module.exports = {
    name: "wiki",
    alias: [ "w" ],
    description: "Retourne une liste d'information pour vous aider.",
    run: (client, message, args) => {
        message.channel.send(addEmbed(
            message.author.username,
            message.author.avatarURL,
            "W I K I",
            "__**Déesse des oracles**__ 🎋 > ~ 💬 Vous semblez être en quête de réponses, je me trompe ? Si c'est le cas, je vous servirai de guide.\n\n╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n[ __**Informations utilitaire pour obtenir un renseignement.**__ ]\n📜 | ``=Quêtes <numéro de la page>``\n📜 | ``=Quêtes-grade <numéro de la page>``\n💎 | ``=Ressources <numéro de la page>``\n🔨 | ``=Métiers <numéro de la page>``\n🐉 | ``=Bestiaire [zone] <numéro de la page>``\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://66.media.tumblr.com/9d376be60c9ad9db10aaa31006fccb5b/tumblr_p5phweSJVd1tg1izto1_1280.gif"        
        ));
        return;
    }
}