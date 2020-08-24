const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Croc Glacier",
            "Polar",
            "C",
            "Le croc glacier est un monstre aveugle dénué de toutes intelligences ~ il est très primitif. Il est d’ailleurs monstrueusement grand et lourd. Il mesure environ 9 mètres de haut et pèse entre 14 et 16 tonnes. Le croc glacier étant aveugle utilise l’écholocalisation. Il se sert de la tempête de vent permanente qui l’entoure (si il n’y a pas de tempête de vent il utilisera alors sa langue ) pour connaître précisément votre position.",
            5100, // HP
            220, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Rugissement primaire**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://tse4.mm.bing.net/th?id=OIP.lhAdY2vYKNoShctlBjtMZwHaHa&pid=Api&P=0&w=300&h=300"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Croc Glacier s'agrippe au sol et rugit soudainement dans la direction de ses ennemis. Tous son affectés d'un malus de puissance de ``-25%``, les bonus sont quant à eux annulés sur le moment.\n\n__** / ! \ **__\n1 | Ce malus ne se cumule pas.";
        else msg = "Le Croc Glacier fonce droit dans votre direction, il vous piétinne sans même prêter attention et vous inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Canine givrée ]",
                "icon":":gear:",
                "prob":0.4,
                "default":6
            },
            {
                "title":"Matériau :gear: [ Griffe givrée ]",
                "icon":":gear:",
                "prob":0.6,
                "default":4
            },
            {
                "title":"Matériau :gear: [ Queue givrée ]",
                "icon":":gear:",
                "prob":0.7,
                "default":1
            },
            {
                "title":"Matériau :gear: [ Coeur givré ]",
                "icon":":gear:",
                "prob":0.9,
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
