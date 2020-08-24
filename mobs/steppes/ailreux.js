const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Ailreux",
            "Steppes",
            "E",
            "L’Ailreux n’est autre qu’un griffon immature, il reste tout de même redoutable surtout si vous n’êtes qu’un aventurier lambda.",
            800, // HP
            40, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Élan désespéré**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852439207182356/408px-Summon_b_2030003000.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "L'Ailreux prend bien son envole et de ses deux majestueuses ailes, il vous envoie de fortes bourrasques de vent qui vous projetteront en arrière, vous empêchant d'attaquer durant ``1`` tour et inflige 25 dégats à tous le monde.\n\n__** / ! \\ **__\n1 | C'est inévitable !";
        else msg = "S'envolant dans les airs il plane en votre direction et tente de vous infliger plusieurs entailles causant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Plume ]",
                "icon":":gear:",
                "prob":0.3,
                "default":7
            },
            {
                "title":"Matériau :gear: [ Queue ]",
                "icon":":gear:",
                "prob":0.7,
                "default":1
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
