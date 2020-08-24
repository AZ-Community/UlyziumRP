const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Bandit des Glaces",
            "Polar",
            "C",
            "Ce bandit, contrairement à celui des steppes, n'a que faire de votre argent par contre votre équipement nous ne pourrons pas en dire autant. Ce mort-vivant chevauche un loup géant aussi féroce que démoniaque, sa lame, quant à elle assez vieille, est toutefois assez solide pour vous trancher en 2.",
            3200, // HP
            500, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Attaques synchrones**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://i.pinimg.com/564x/15/39/33/1539334c42aaf32f248e60cf6596449d.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.8;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Bandit des Glaces ordonne à son loup de vous chopper par la jambe, celui-ci vous inflige "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" de dégâts. Le chevaucheur, quant à lui, vous assène un coup avec son arme de "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" de dégâts.\n\n__** / ! \ **__\n1 | Si vous disposez d'arme légère ou à distance, vous pouvez effectuer un roll ( !roll 100 ), si le résultat est supérieur à 60 vous esquivez la morsure du loup.";
        else msg = "Le mort vivant fonce droit sur vous et vous assène un coup, vous infligeant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Argent ]",
                "icon":":gear:",
                "prob":0.1,
                "default":24
            },
            {
                "title":"Matériau :gear: [ Os ]",
                "icon":":gear:",
                "prob":0.2,
                "default":16
            },
            {
                "title":"[ ``Potion-Puissance`` ] __**B**__",
                "icon":":boom:",
                "prob":0.35,
                "default":2
            },
            {
                "title":"[ ``Potion-Santé`` ] __**A**__",
                "icon":":heart:",
                "prob":0.5,
                "default":3
            },
            {
                "title":"[ ``Armure`` ] __**Fer**__",
                "icon":":shield:",
                "prob":0.85,
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
                "prob":0.990,
                "default":1
            }
        ];
    }
}

module.exports = new Mob();
