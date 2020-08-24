const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Cizamite",
            "Wesey",
            "D",
            "Ces bêtes sont de vraies mystères, génétiquement ce sont des crustacés . . Mais pourtant ils vivent dans les montagnes et ne supporteront pas l'eau, c'est vraiment ironique.",
            1600, // HP
            200, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Enfouissement**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852210684723200/ambush-drake-5e-5.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.7;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Cizamite disparît de votre champ de vision, il s'enfouit soudainement dans le sol pour réapparaître derrière vous. Par surprise, il vous assène un coup de pince, vous infligeant "+math.floor(this.power-(this.power*0.25*math.random()))+" de dégâts.\n\n__** / ! \ **__\n1 | Cette attaque est inévitable.";
        else msg = "Le crustacé se déplace vivement sur ses petites pattes, il vous percute pour vous infliger "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Carapace ]",
                "icon":":gear:",
                "prob":0.4,
                "default":6
            },
            {
                "title":"Matériau :gear: [ Sécrétion ]",
                "icon":":gear:",
                "prob":0.5,
                "default":10
            },
            {
                "title":"Matériau :gear: [ Oeil ]",
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
