module.exports = {
    name: "ping",
    alias: [ "p" ],
    description: "Retourne le temps de réponse du bot.",
    run: async (client, message, args) => {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! La latence est de ${m.createdTimestamp - message.createdTimestamp}ms et celle du bot est de ${Math.round(client.ping)}ms`);
        return;
    }
}