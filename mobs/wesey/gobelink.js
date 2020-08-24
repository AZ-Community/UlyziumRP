const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Gobelink",
            "Wesey",
            "D",
            "Un gobelin faisant de la magie c'est pas sorcier !... Enfin si ça l'est, il peut faire toutes sortes de magies de feu.",
            1200, // HP
            485, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Brasier**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852708913512449/goblin-mage-wow.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.9;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Gobelink charge une puissante attaque, celui-ci viendra à relâcher une vague brûlante infligeant durant ``3`` tours -15% de vies à cause des dégâts de feu !\n\n__** / ! \ **__\n1 | Les items permettant l'immunité aux dégâts de feu sont permis !";
        else msg = "Le Gobelink utilise son arme afin de vous projeter une boule de feu, celui-ci vous inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":Zium:",
                "prob":0,
                "default":1200
            },
            {
                "title":"Matériau :gear: [ Tissu ]",
                "icon":":gem:",
                "prob":0.5,
                "default":10
            },
            {
                "title":"Matériau :gear: [ Coeur de Gobelink ]",
                "icon":":gear:",
                "prob":0.8,
                "default":1
            },
            {
                "title":"Consommable :potion1: [Potion-Résistance ] ``D`` +10% :shield:",
                "icon":":boom:",
                "prob":0.35,
                "default":3
            },
            {
                "title":"Consommable :petri_dish: [ Potion-Vengeance ] ``C`` +15% :hotsprings:",
                "icon":":heart:",
                "prob":0.5,
                "default":2
            },
            {
                "title":"Matériau :gear: [ Sceptre magique ]",
                "icon":":gear:",
                "prob":0.95,
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
