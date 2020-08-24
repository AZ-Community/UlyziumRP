const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Serpensad",
            "Steppes",
            "E",
            "Un serpent complètement banal rien de bien extraordinaire, il vit sa petite vie en se baladant dans le désert, il est généralement la proie des oiseaux, triste vie.",
            260, // HP
            85, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Venin**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852764358148124/580b57fbd9996e24bc43bced.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Un poison très nocif ! Vous devriez rapidement traiter ce poison car vous perdrez ``- 5%`` 💔des hp actuel à __**chaque action**__.\n\n__** / ! \\ **__\n1 | Il vous faudra utiliser le plus rapidement possible une potion pour y remédier, ou même à l'aide d'une compétence de ``purification.``\n\n2 | Toutes vos actions compteront ! Même en écrivant un petit mot, donc soyez intelligent et utiliser le peu d'action que vous avez pour votre traitement.\n\n3 | Le poison se cumule, faites attention !";
        else msg = "Le Serpensad serpente sur la terre en direction de sa proie et infligera un total de "+math.floor(this.power-(this.power*0.5*math.random()))+" dégâts.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":gem:",
                "prob":0,
                "default":400
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
