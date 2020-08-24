const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Terreur des Glaces",
            "Polar",
            "C",
            "Le Terreur des Glaces doit son surnom à sa facheuse habitude de pointer le bout de son nez lorsqu'il n'est guère attendu, terrifiant bon nombre d'aventuriers. Un sourire démoniaque, un regard perçant et une taille démesurée pour le commun des mortels... Saurez-vous lui faire face ?",
            4500, // HP
            400, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Dystopie**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://i.pinimg.com/564x/ca/4c/f9/ca4cf9f1247d4f3213b37c5afb1e6ae9.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.8;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "La Terreur des Glaces s'empare de vous avec une force incommensurable, elle vous force à la regarder droit dans les yeux.\n\n__** / ! \ **__\n1 | Faites un !roll 100, si le résultat est supérieur à 50 alors vous en réchappez, sinon vous êtes terrorisé durant 1 tour.";
        else msg = "Ce géant des glaces tente de vous piétiner, vous infligeant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Corne givrée ]",
                "icon":":gear:",
                "prob":0.5,
                "default":4
            },
            {
                "title":"Matériau :gear: [ Fourrure ]",
                "icon":":gear:",
                "prob":0.2,
                "default":24
            },
            {
                "title":"Matériau :gear: [ Canine givrée ]",
                "icon":":gear:",
                "prob":0.4,
                "default":6
            },
            {
                "title":"Matériau :gear: [ Oeil de Terreur des Glaces ]",
                "icon":":gear:",
                "prob":0.7,
                "default":2
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
