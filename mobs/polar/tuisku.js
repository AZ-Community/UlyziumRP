const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Tuisku",
            "Polar",
            "C",
            "Cette boule de poils dispose de bon nombre d'avantages qui en énerveront plus d'un ! Rapide, féroce, un spécialiste de la dissimulation, ... En outre, le Tuisku est un traqueur hors du commun, alors ne le sous-estimez pas.",
            3700, // HP
            390, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Avalanche**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://i.pinimg.com/564x/f5/75/80/f57580582f477b94395e3dccf873a595.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.75;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Tuisku frappe le sol à plusieurs reprises avec sa queue et hule de toutes ses forces. Soudainement, quelques plaques neiges se détachent et une avalanche se forme. L'animal disparait dans le nuage de flocons tandis que vous vous retrouvez très vite ensevelit, vous empêchant d'attaquer durant ``2`` tours.\n\n__** / ! \ **__\n1 | Cette attaque peut être contrée avec un item de l'élément du feu.";
        else msg = "La bête sauvage saute dans votre direction, vous assénant un coup de griffe qui vous infige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":gem:",
                "prob":0,
                "default":2500
            },
            {
                "title":"Matériau :gear: [ Fourrure ]",
                "icon":":gear:",
                "prob":0.2,
                "default":24
            },
            {
                "title":"Matériau :gear: [ Canine givrée ]",
                "icon":":gear:",
                "prob":0.4,
                "default":6
            },
            {
                "title":"Matériau :gear: [ Queue givrée ]",
                "icon":":gear:",
                "prob":0.7,
                "default":1
            },
            {
                "title":"Consommable :candy:  [ Friandise ] ``B`` +50 :sparkles:",
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
