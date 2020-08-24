const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Disise",
            "Polar",
            "C",
            "Cette créature ailée saura vous faire comprendre à quel point avoir une paire d'ailes est un avantage considérable. Une blancheur a en faire pâlir la neige, des cornes chassées par de nombreux aventuriers et une férocité sans égal... C'est bien à cela que nous pouvons reconnaître un Disise.",
            3600, // HP
            450, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Flammes bleues**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://i.pinimg.com/564x/c3/63/28/c36328c360464d20a7f635f7c9249fda.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.75;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le dragon prend peu à peu de l'altitude et soudainement il crache de géantes flammes d'un bleu étincellant dans votre direction. La cible perdra "+math.floor(this.power*0.25-(this.power*0.125*math.random()))+" de HP et ce durant ``3`` tours.\n\n__** / ! \ **__\n1 | Cette attaque est inévitable.";
        else msg = "Le Disise déploie ses ailes et brasse l'air environnant, projettant de multiples morceaux de glace sur vous, il vous inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Griffe givrée ]",
                "icon":":gear:",
                "prob":0.6,
                "default":4
            },
            {
                "title":"Matériau :gear: [ Corne de Disise ]",
                "icon":":gear:",
                "prob":0.5,
                "default":3
            },
            {
                "title":"Matériau :gear: [ Plume ]",
                "icon":":gear:",
                "prob":0.3,
                "default":10
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
