const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Undead",
            "Wesey",
            "D",
            "Un homme squelette portant une cape à capuchon et toute source de vie la quitter, il vous glacera le sang.",
            1250, // HP
            300, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Dévoreur d'âmes**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852221950885898/Core24images24portraits24undead24transparent24ghost.webp"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Lévitant tel un fantôme, le Undead vous envoie quelques âmes absorbées auparavant, elles bloquent tous vos mouvements durant ``2`` tours.\n\n__** / ! \ **__\n1 | Les items contrant l'attaque des esprits prennent effet !";
        else msg = "Le Undead tente d'absorber votre âme, il vous inflige "+math.floor(this.power-(this.power*0.5*math.random()))+" de dégâts.";

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
                "title":"Matériau :gear: [ Os ]",
                "icon":":gear:",
                "prob":0.2,
                "default":10
            },
            {
                "title":"Matériau :gear: [ Tissu ]",
                "icon":":gear:",
                "prob":0.3,
                "default":8
            },
            {
                "title":"Matériau :gear: [ Crâne d'Undead ]",
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
