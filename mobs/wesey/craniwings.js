const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Craniwings",
            "Wesey",
            "D",
            "Un monstre ailé qui a un crâne bien dur et s'en sert pour attaquer les formes humanoïdes, il a des pattes bien résistante qui lui permette de maîtriser ses proie.",
            1560, // HP
            350, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Coup crânien**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852219383840778/Creatures-PNG-Photos.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Craniwings s'envole et fonce violemment dans votre direction, il vous percute et vous met dans l'incapacité d'attaquer durant ``1`` tour et vous vous prenez 150 de dégats.\n\n__** / ! \ **__\n1 | Il ne vous sera pas possible d'échapper au malus de l'ennemi, mais vous pourriez tout à fait contrer si vous avez un Shielder [ Homme au bouclier ] dans vos rangs, il sera le seul à se prendre les dégats si il le décide..";
        else msg = "Le Craniwings fonce dans votre direction et vous attaque à l'aide d'une de ses paires d'ailes ! Infligeant donc "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":gem:",
                "prob":0,
                "default":1200
            },
            {
                "title":"Matériau :gear: [ Os ]",
                "icon":":gear:",
                "prob":0.5,
                "default":4
            },
            {
                "title":"Matériau :gear: [ Plume ]",
                "icon":":gear:",
                "prob":0.4,
                "default":10
            },
            {
                "title":"Consommable :candy:  [ Friandise ] ``C`` +25 :sparkles:",
                "icon":":gear:",
                "prob":0.95,
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
