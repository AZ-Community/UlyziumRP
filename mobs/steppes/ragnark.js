const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Ragnark",
            "Steppes",
            "E",
            "Un lézard gigantesque se baladant généralement en zone Steppes pour s'alimenter de toutes les choses avant croiser son chemin, même les semblables de ce dernier, alors méfiance !",
            905, // HP
            140, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Laceration**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852728593448960/ambush-drake-5e-2.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.8;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Ragnark use de sa compétence, un coup de queue tranchant. Il vous inflige ``- 65`` 💔 ! Et __**réduira**__ votre prochaine attaque de __**- 25%**__ de sa puissance.";
        else msg = "Le Ragnark s'empresse de vous attraper à l'aide de ses crocs, l'attaque inflige un total de "+math.floor(this.power-(this.power*0.5*math.random()))+" dégâts.";

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
                "title":"Matériau :gear: [ Griffe ]",
                "icon":":gear:",
                "prob":0.6,
                "default":4
            },
            {
                "title":"Matériau :gear: [ Canine ]",
                "icon":":gear:",
                "prob":0.4,
                "default":6
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
