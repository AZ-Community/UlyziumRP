const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Colosse",
            "Wesey",
            "D",
            "Ces monstres portent à la perfection leur nom, ils sont gigantesque et n'hésiteront pas à vous détruire à l'aide de leur lourde arme. Ne restez pas sous leurs pâtes si vous ne voulez pas mourir \"accidentellement\".",
            2400, // HP
            300, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Frappe piétinante**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852043957207083/ColossusGreenVSPortrait_EnemyBoss_Sprite.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.8;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Colosse soulève l'un de ses pieds puis il fracasse violement le sol, créant une onde de choc qui vous étourdit durant ``2`` tours, réduisant votre puissance d'attaque de 10%.\n\n__** / ! \ **__\n1 | Cette attaque est inévitable.\n\n2 | Elle ne se cumule pas.";
        else msg = "De son marteau géant, le Colosse tente de vous faire valser sur plusieurs mètres, vous infligeant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Pierique-Standard ] ``E``",
                "icon":":gear:",
                "prob":0.7,
                "default":2
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
