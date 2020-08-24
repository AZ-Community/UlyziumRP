const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "SalterGob",
            "Wesey",
            "D",
            "Les satlergob sont des monstres appartenant à la famille des gobelins, ils sont vicieux malgré la petite taille qu'ils ont, ils portent généralement deux dagues avec eux et ils vivent dans les profonds creux des montagnes.",
            1600, // HP
            400, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Tranchant spiral**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852215306846208/purepng.com-goblingoblincreatureeuropean-folkloredemonghost-1701527776574l2avs.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.9;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le SalterGob saisit ses dagues et tourbillonne en s'approchant rapidement vers vous, en vous touchant ``3`` fois de suite il vous ôte [ 3× -10% ] de vos points de vie.\n\n__** / ! \ **__\n1 | Il vous ôte donc un total de 30% de Pv ! Attaque inévitable.";
        else msg = "Vicieux qu'il est, le SalterGob jette de faux ziums pour vous distraire puis il vous assène un coup de dague, faisant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Tissu ]",
                "icon":":gear:",
                "prob":0.4,
                "default":6
            },
            {
                "title":"Matériau :gear: [ Fer ]",
                "icon":":gear:",
                "prob":0.3,
                "default":10
            },
            {
                "title":"Consommable :potion2: [ Potion-Puissance ] ``D`` +10% :boom:",
                "icon":":boom:",
                "prob":0.35,
                "default":2
            },
            {
                "title":"Consommable :test_tube: [ Potion-Santé ] ``C`` +400 :heart_exclamation:",
                "icon":":heart:",
                "prob":0.5,
                "default":3
            },
            {
                "title":"Matériau :gear: [ Dague de Saltergob ]",
                "icon":":gear:",
                "prob":0.8,
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
