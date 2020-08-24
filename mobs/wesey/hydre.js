const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Hydre",
            "Wesey",
            "D",
            "Un monstre a plusieurs tête de serpent qui quand vous coupez une tête deux autre repousse, il a perdu la tête pour en retrouvez deux autres.",
            1800, // HP
            200, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Malédiction de l'hydre**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852384639418379/Hydra.webp"
        );
    }

    getDescAtk() {
        var probCrit = 0.9;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "L'Hydre active sa capacité spéciale, rendant à ce dernier pendant 5 tours 20% de ses points de vie ♥️.\n\n__** / ! \ **__\n1 | Ça compétence à la priorité sur vos attaques ! Donc il se regen avant que vous ne puissiez l'attaquer.\n\n2 | Si vous avez un soucis avec les pourcentages, veuillez contacter un membre du staff.";
        else msg = "L'hydre, sans hésitation, tente de vous asséner à l'aide de sa queue un total de dégâts de "+math.floor(this.power-(this.power*0.5*math.random()));

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
                "title":"Matériau :gear: [ Oeil ]",
                "icon":":gear:",
                "prob":0.5,
                "default":10
            },
            {
                "title":"Matériau :gear: [ Venin ]",
                "icon":":gear:",
                "prob":0.6,
                "default":5
            },
            {
                "title":"Matériau :gear: [ Queue ]",
                "icon":":gear:",
                "prob":0.7,
                "default":1
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
