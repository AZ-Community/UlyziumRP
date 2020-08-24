const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Qwiline",
            "Polar",
            "C",
            "Souvent surnommé le bélier des glaciers, le Qwiline est une créature téméraire et qui n'abandonnera jamais l'un de ses combats. Son être surplombé de 2 cornes, de véritables armes de combat, et sa peau recouverte d'une véritable armure naturelle font de lui un redoutable ennemi.",
            2500, // HP
            300, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Coup crânien**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://i.pinimg.com/564x/92/a5/13/92a5137b232ea7ea336be74744c9d230.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.8;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Qwiline charge tête baissée dans votre direction, vous vous prenez un voup violent vous infligeant "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" de dégâts et vous empêchant d'attaquer durant ``2`` tours.\n\n__** / ! \ **__\n1 | Si la cible dispose d'une arme défensive, cette attaque ne l'empêchera d'attaquer que durant ``1`` tour.";
        else msg = "Le bélier des glaces vous assène un violent coup de queue, vous infligeant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Cuir de Qwiline ]",
                "icon":":gear:",
                "prob":0.2,
                "default":14
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
                "default":8
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
