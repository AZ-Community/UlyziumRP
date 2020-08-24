const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Kraken",
            "Steppes",
            "E/D",
            "Le Kraken pas besoin de présenter la bête je pense que vous savez tous c'est quoi...Bonne chance ?! Il est bien plus grand que sur l'image il fait une taille bien immence qui entour le bateau",
            9000, // HP
            300, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Pas de japonaise, merci.**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://media.discordapp.net/attachments/609113776582688778/717805297749721148/061-Aquatic03.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Kraken entoure une partie du bateau avec deux tentacule qui va être détruit au prochain tour si personne ne fais rien ! ";
        else msg = "Il fait un balayage sur tout le monde qui inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts MAIS vous pouvez esquivez en réussisant un roll de 100.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":gem:",
                "prob":0,
                "default":5000
            },
            {
                "title":"Consommable :candy:  [ Friandise ] ``E`` +5 :sparkles:",
                "icon":":gear:",
                "prob":0.94,
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
