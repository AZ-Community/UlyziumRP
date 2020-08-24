const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Sahin",
            "Steppes",
            "E/D",
            "Le sahin est une petite bête pas trop dangereuse de nos mer.",
            200, // HP
            40, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Je mord pas je griffe.*\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://media.discordapp.net/attachments/609113776582688778/717805283656728672/059-Aquatic01.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Il vous tire un mucus qui attire tous les sahin présent sur vous pendant deux tour. Il viseront que vous.";
        else msg = "Il griffe rapidement votre torse et inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":gem:",
                "prob":0,
                "default":100
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
