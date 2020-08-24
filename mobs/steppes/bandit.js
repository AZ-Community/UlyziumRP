const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Bandit",
            "Steppes",
            "E",
            "Dire que ces scélérats existent toujours malgré le fait qu'il y ait des monstres la dehors, m'enfin, les pires monstres sont ceux doté d'une conscience à première vue.",
            655, // HP
            80, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Offre en or**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852697001689088/Bandit.webp"
        );
    }

    getDescAtk() {
        var probCrit = 0.9;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Eh bien . . Un dilemme s'offre à vous, soit vous acceptez l'offre du bandit et vous avez une chance d'obtenir une large somme de zium. Soit vous refusez et vous l'attaquez sans hésitation. Pour accepter il suffit de faire ``=offre-bandit``.\n\n__** / ! \\ **__\n1 | Si vous acceptez l'offre, il y'a une chance de vous faire berner et vous en payerai le prix cher, donc attention ! C'est 50/50, bonne chance !";
        else msg = "En usant de sa masse faite de pique, le bandit tente de vous assener "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":gem:",
                "prob":0,
                "default":400
            },
            {
                "title":"Matériau :gear: [ Ferraille ]",
                "icon":":gear:",
                "prob":0.1,
                "default":18
            },
            {
                "title":"Consommable :candy:  [ Friandise ] ``E`` +5 :sparkles:",
                "icon":":gear:",
                "prob":0.94,
                "default":2
            },
            {
                "title":"__**Crytal Ancestrale**__",
                "icon":":gem:",
                "prob":0.995,
                "default":1
            }
        ];
    }
}

module.exports = new Mob();
