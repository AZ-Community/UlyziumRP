const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Anthys",
            "Steppes",
            "E",
            "Un prédateur hors du commun, vous devriez être méfiant face à cette chose. Il est même préférable de ne pas l'attaquer de face si vous souhaitez ne pas à faire face à cette mâchoire effrayante.",
            780, // HP
            30, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Mâchoire saisissante**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852763695448074/6b85d7702240c2c9a02c579d3a933883.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.9;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Attention ! L'Anthys se rue sur vous et vous attrape avec sa mâchoire, celle-ci viendra à faire pression sur votre corps en vous infligeant ``- 80`` :broken_heart:, suite à ça vous ne pourrez pas attaquer durant ``1`` tour.\n\n__** / ! \\ **__\n1 | Une seule condition est requise pour échapper à cette prise : Les compétences permettant une contre-attaque pourront étourdir l'ennemi !";
        else msg = "L'Anthys ne perd pas de temps et vous foncera dessus afin que vous puissiez être victime d'un coup infligeant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Mandibule ]",
                "icon":":gear:",
                "prob":0.3,
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
