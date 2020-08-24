const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Dolcyus",
            "Polar",
            "C",
            "Créature splendide de par sa puissance mais également la beauté rayonnante que'elle possède, elle possède des cornes ayant une particularité très unique de plus la couleur de ces dernières est d'un rosé sakura, ces créatures vivent généralement paisiblement parmi les montagnes enneigées elles sont très grandes est elles possèdent une forme serpentine.",
            3300, // HP
            410, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Realm**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://www.zastavki.com/pictures/originals/2014/Fantasy_Ice_dragon_067780_.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.8;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Dolcyus prend une allure plutôt élégante et charme sa cible, celle-ci attaquera l'un de ses alliés au tour suivant.\n\n__** / ! \ **__\n1 | Au lieu d'attaquer, ses alliés peuvent tenter de le retenir en effectuant chacun un roll ( !roll 100 ). Si l'un des résultats est supérieur à 70, alors la personne réussit mais ne pourra pas attaquer au prochain tour.";
        else msg = "La créature des glaces bondit dans votre direction, vous mettant un coup de bec, elle vous inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Bec givré ]",
                "icon":":gear:",
                "prob":0.4,
                "default":1
            },
            {
                "title":"Matériau :gear: [ Corne de Dolcyus ]",
                "icon":":gear:",
                "prob":0.5,
                "default":6
            },
            {
                "title":"Matériau :gear: [ Coeur de Dolcyus ]",
                "icon":":gear:",
                "prob":0.8,
                "default":1
            },
            {
                "title":"Matériau :gear: [ Fourrure ]",
                "icon":":gear:",
                "prob":0.2,
                "default":12
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
