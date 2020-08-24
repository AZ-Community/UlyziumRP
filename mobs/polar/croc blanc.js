const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Croc Blanc",
            "Polar",
            "C",
            "Le croc blanc est le cousin germain du croc glacier, il est bien plus petit et léger que le croc glacier, 2~3 mètres de haut pour 800~900 kilos. Le croc blanc a une certaine intelligence au combat et a pour tendance de mordre 1 à 1 les membres de ses proies.",
            4000, // HP
            480, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Morsures**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://i.pinimg.com/originals/49/31/49/493149e9779eed11c8ed967c7a1459c0.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.9;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Croc Blanc bondit sur sa cible, la mordant à pusieurs reprises et à diverses endroits. Il lui inflige "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+", "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" et "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" de dégâts.\n\n__** / ! \ **__\n1 | Si vous disposez d'une arme défensive ou d'une arme lourde, vous empêchez la troisième morsure de se produire.";
        else msg = "Le loup des glaces se jette sur vous, usant de ses griffes pour vous infliger "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Canine givrée ]",
                "icon":":gear:",
                "prob":0.4,
                "default":6
            },
            {
                "title":"Matériau :gear: [ Griffe givrée ]",
                "icon":":gear:",
                "prob":0.6,
                "default":4
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
