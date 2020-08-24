const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Yian-Rata",
            "Wesey",
            "D",
            "Les Yian-Ratha sont catégorisé comme étant des monstres appartenant à la famille des dragons si vous en croisez un attention à ne pas finir en cendre. Ils sont plutôt discret et ne sortent pas trop des montagnes sauf dans les occasions rares !",
            2100, // HP
            350, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Embrasement**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852083693780993/855-Flederjaw.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le dragon prend légèrement son envole, il inspire un grand coup avant de rejeter dans votre direction d'innombrables flammes. Dès lors, vous devenez une véritable torche humaine durant ``2`` tours, vous infligeant à chaque tour "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" de dégâts.\n\n__** / ! \ **__\n1 | Un seau d'eau peut être très utile.";
        else msg = "Le Yian-Ratha recule de quelques mètres puis il vous envoie quelques unes de ses épines, celles-ci vous inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Griffe ]",
                "icon":":gear:",
                "prob":0.3,
                "default":8
            },
            {
                "title":"Matériau :gear: [ Cuir ]",
                "icon":":gear:",
                "prob":0.1,
                "default":12
            },
            {
                "title":"Matériau :gear: [ Coeur de Yian-Rata ]",
                "icon":":gear:",
                "prob":0.8,
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
