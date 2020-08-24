const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "LoupGarou",
            "Wesey",
            "D",
            "Des bêtes ayant été autrefois humain, malheureusement le destin à fait d'eux ce qu'ils sont à présent. Ils possèdent une soif de sang sans pareil chose tout à fait normal car ils s'apparentent à des loups ayant une forme humaine, pire combinaison possible.",
            2000, // HP
            150, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Rage hormonale**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852040416952320/31f51c587241bde8e4e2ad6fec54b470.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.8;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le LoupGarou, assoiffé de chair fraîche et de sang, bondit dans votre direction et vous mord violement. Cette attaque vous inflige "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" de dégâts ainsi qu'un saignement durant ``3`` tours qui vous retire ``-5%`` de vos HP à chaque tour.\n\n__** / ! \ **__\n1 | Le saignement peut être estompé à l'aide de bandages ou de potions de soin.";
        else msg = "Cette créature velue s'approche rapidement de vous. De ses griffes acérées, elle vous assène un coup, vous infligeant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts. Si vous saignez, de par sa rage, celle-ci vous inflige un second coup de "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" dégâts.";

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
                "default":5
            },
            {
                "title":"Matériau :gear: [ Canine ]",
                "icon":":gear:",
                "prob":0.5,
                "default":4
            },
            {
                "title":"Matériau :gear: [ Fourrure ]",
                "icon":":gear:",
                "prob":0.3,
                "default":10
            },
            {
                "title":"Matériau :gear: [ Sang de Loupgarou ]",
                "icon":":gear:",
                "prob":0.2,
                "default":10
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
