const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Mudur",
            "Steppes",
            "E",
            "Une créature boueuse, c'est plutôt dérangeant pour les attaques, pour le coup . . Vous devrez agir prudemment face à de la boue, mais pas d'inquiétude il ne fait pas grand nombre de dégâts.",
            840, // HP
            50, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Liquéfaction**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852380659154957/coreimagesportraitsmonsterstransparentgiant-mudcrawler.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.9;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le monstre change d'état physique, il est tout liquide . . Durant ``3`` tours __**aucune attaque physique**__ n'aura d'effet sur lui.\n\n__** / ! \\ **__\n1 | Toutes sources magiques offensives pourra être utilisées à l'égard du monstre !";
        else msg = "Le Mudur utilise sa constitution corporelle pour vous envoyer un projectile infligeant un total de "+math.floor(this.power-(this.power*0.5*math.random()))+" dégâts.";

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
                "title":"Matériau :gear: [ Perle-Rougeâtre ]",
                "icon":":gear:",
                "prob":0.8,
                "default":1
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
