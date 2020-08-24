const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Kitsu",
            "Wesey",
            "D",
            "De belles et séduisantes créatures, elles sont faites pour vous plonger dans des rêves mas également des cauchemars pouvant s'emparer de votre âme, donc ne vous laisser pas trop charmer par les Kitsu car elles peuvent être féroce et sans pitié.",
            1850, // HP
            200, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Rêitopia**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852764081324035/f826bcae67086e72c6afa11714120fd1.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le magnifique et irréel Kitsu vous plaque au sol puis vous fait rentrer dans l'un de vos pires cauchemars durant ``2`` tours, vous empêchant d'attaquer.\n\n__** / ! \ **__\n1 | Cette attaque est inévitable.";
        else msg = "La fascinante créature bondit dans votre direction, vous assénant plusieurs coups de griffes. Elle vous inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Plume ]",
                "icon":":gear:",
                "prob":0.6,
                "default":5
            },
            {
                "title":"Matériau :gear: [ Fourrure ]",
                "icon":":gear:",
                "prob":0.5,
                "default":10
            },
            {
                "title":"Matériau :gear: [ Canine ]",
                "icon":":gear:",
                "prob":0.6,
                "default":4
            },
            {
                "title":"Matériau :gear: [ Coeur de Kitsu ]",
                "icon":":gear:",
                "prob":0.9,
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
