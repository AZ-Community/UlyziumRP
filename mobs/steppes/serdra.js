const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Serdra",
            "Steppes",
            "E/D",
            "Le Serdra ressemble bien à une hydre mais elle est aquatique..",
            1500, // HP
            220, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Je mange crue.**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://media.discordapp.net/attachments/609113776582688778/717805266170806282/057-Snake03.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Serdra vous avale, non je rigole pas et vous allez devoir attendre qu'une personne coupe la tête du monstre qui vous commence à vous avaler. Faut roll l'attaquer et faire au dessus de 150.";
        else msg = "Il mord 2 personne en même temps et inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":gem:",
                "prob":0,
                "default":800
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
