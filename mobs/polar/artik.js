const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Artik",
            "Polar",
            "C",
            "Eh bien cette créature n'est autre qu'un Artik, plus communément appeler \"Golem des glaces\" dans la région, car oui en effet elle possède une forme assez humanoide & une taille assez . . Whow, m'enfin ces bêtes colossales détestent les visites étrangères donc si vous avez le malheur d'en croiser une vous devriez fuir, enfin sauf si vous êtes à la hauteur. :p",
            5600, // HP
            300, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Blizzard**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "http://img13.deviantart.net/1885/i/2012/111/6/6/ice_behemoth_by_stormtitan-d4x1vgh.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "L'Artik fait soudainement sortir une multitude de stalagmites qui empêchent toutes les attaques à distance durant ``1`` tour.\n\n__** / ! \ **__\n1 | Cette attaque est inévitable.";
        else msg = "Le colosse des glaces tente de vous applatir, vous infligeant "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "prob":0.990,
                "default":1
            }
        ];
    }
}

module.exports = new Mob();
