const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Sagahouin",
            "Steppes",
            "E/D",
            "Le Sagahouin est une bête aquatique avec une fouche.",
            600, // HP
            60, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Fourche toi bien**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://vignette.wikia.nocookie.net/forgottenrealms/images/d/d9/Sahuagin-5e.png/revision/latest/scale-to-width-down/350?cb=20171010173723"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Sagahouin vous envoie sa fourche dans votre torse qui fait 40 de dégat perce armure sauf si UNE personne roll pour attraper la fourche avant. +50 pour réussir!";
        else msg = "Il envoie la fourche sur vous et vous inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
