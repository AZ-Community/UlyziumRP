const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Leviathan",
            "Steppes",
            "A",
            "Le Leviathan est une bête aquatique mythique ! Je vous conseille de partir mais c'est juste un conseille.",
            14000, // HP
            700, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Fourche toi bien**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://media.discordapp.net/attachments/609113776582688778/717805312635174972/062-Aquatic04.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.5;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Leviathan s'envole dans les air et prépare une attaque toute personne qui était sur lui et ejecter,, il ne peut pas être cibler. Après votre action il va donc fait un jet d'eau puissant et coupant qui va détruire 2 partie du bateau.";
        else msg = "Le Leviathan s'envole dans les air et prépare une attaque toute personne qui était sur lui et ejecter, il ne peut pas être cibler. Après votre action il va donc fait un jet d'eau puissant et coupant qui va détruire 2 partie du bateau.";

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":gem:",
                "prob":0,
                "default":6000
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
