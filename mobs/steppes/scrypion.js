const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Scrypion",
            "Steppes",
            "E",
            "De vraies saloperies mouvantes - . . Un lance fl- . . Alors oui, ce sont des scorpions en apparence mais des tueurs au fond, surtout avec la dose paralysante qu'elle peut vous injecter.",
            370, // HP
            95, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Paralysie**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852703842730024/scorpion_PNG12117.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Il approche, d'une précipitation sans équivaut, et vous pique à l'aide de son dard. Vous recevrez ``- 25%`` :broken_heart:, de plus vos dégâts recevront un affaiblissement de ``- 50%`` :crossed_swords: !\n\n__** / ! \\ **__\n1 | Vous pouvez bien évidement user d'une capacité ou d'un breuvage vous permettant de vous rétablir de cette infection !";
        else msg = "Le scrypion vous prendra pour cible et tentera à l'aide de ses pinces de vous infliger "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Dard-Empoisonné ]",
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
