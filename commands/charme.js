const { addEmbed, addWarnEmbed } = require("../tools/embed.js");

module.exports = {
    name: "charme",
    description: "Permet aux serveurs et serveuses d'avoir une chance de doubler leurs mises.",
    run: (client, message, args) => {
        var canUse = false;

        if(client.wait.has("charme"+message.author.id)){
            var canUseAt = new Date(client.wait.get("charme"+message.author.id));
            canUseAt = new Date(canUseAt.setDate(canUseAt.getDate()+1)); // Ajout de 1 jour = 1 charme/jour.

            if(canUseAt <= message.createdAt){
                canUse = true;
                client.wait.delete("charme"+message.author.id);
            }
        }else canUse = true;
            
        if(canUse){
            client.wait.set("charme"+message.author.id, message.createdAt);
            
            if(Math.random >= 0.65){
                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "C H A R M E",
                    "Suite à la fin de votre service, vous obtenez comme d'habitude votre salaire, toutefois vous usez de votre charme pour coubler la mise."
                ));
            }else{
                message.channel.send(addEmbed(
                    message.author.username,
                    message.author.avatarURL,
                    "C H A R M E",
                    "Suite à la fin de votre service, vous obtenez comme d'habitude votre salaire, toutefois vous n'arrivez pas à user de votre charme."
                ));
            }
        }else{
            var canUseAt = new Date(client.wait.get("charme"+message.author.id));
            canUseAt = new Date(canUseAt.setDate(canUseAt.getDate()+1));
            const timeLeft = new Date(canUseAt - message.createdAt);

            message.channel.send(addWarnEmbed(
                message.author.username,
                message.author.avatarURL,
                "E R R E U R",
                `:warning: Vous devez attendre encore ${timeLeft.getUTCHours()}:${timeLeft.getUTCMinutes()}:${timeLeft.getUTCSeconds()} avant la prochaine utilisation.`
            ));
        }

        return;
    }
}