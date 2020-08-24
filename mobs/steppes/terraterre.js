const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "TerraTerre",
            "Steppes",
            "E",
            "Plusieurs âmes qui ont fusionné avec des roches se sont formé pour faire qu'un et ainsi pourvoir manipuler des roches a leur guise. Le terraterre est un monstre très terre a terre fuyez terriens.",
            500, // HP
            80, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Solidification**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852205135921182/5042c74b2a89a3a0105d29a262a81b99878e6c6233981-qvdTzm_fw658.webp"
        );
    }

    getDescAtk() {
        var probCrit = 0.8;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Les ``2`` prochains tours réduiront les dégâts physiques sur le monstre de 50% !\n\n__** / ! \\ **__\n1 | Les dégâts magiques sont efficace et ne seront pas réduite de 50%\n\n2 | Le pourcentage de réduction de dégâts est non cumulable.";
        else msg = "En contrôlant le terrain il vous transperce quelques membres infligeant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :crystal: [ Pierique-Faible ] ``E``",
                "icon":":gear:",
                "prob":0.7,
                "default":2
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
