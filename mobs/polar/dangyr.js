const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Dangyr",
            "Polar",
            "C",
            "Bon . . En voyant une telle bête c'est une certitude qu'elle ne veut pas simplement vous faire un câlin, du moins . . Elle vous en fera peut-être un mais vous finiriez sûrement dans son intestin après quelques minutes, les Dangyr sont des créatures gigantesques & très résistantes, elles ne possèdent pas une très grande puissance malgré la taille imposante qu'il leur est due mais au débit de la puissance, elles possèdent une agilité assez extraordinaire.",
            3900, // HP
            500, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Souffle givré**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://images5.alphacoders.com/301/301255.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le féroce Dangyr prend une inspiration puis, contre toute attente, il laisse un souffle glaciale s'échapper de ses crocs pour congeler sa cible sur place. Celle-ci servira désormais de décoration durant ``3`` tours.\n\n__** / ! \ **__\n1 | La personne viser pourra à chaque tour effectuer un roll ( !roll 100 ), si le résultat est supérieur à 70 alors il réussira à briser la glace.";
        else msg = "La géante créature tente de vous chopper dans sa gueule, vous infligeant avec ses crocs "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Epine givrée ]",
                "icon":":gear:",
                "prob":0.8,
                "default":3
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
