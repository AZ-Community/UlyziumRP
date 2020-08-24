const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Naga",
            "Steppes",
            "E",
            "Une femme . . Un serpent ? . . Hum, peu importe c'est un ennemi, du moins pour le moment alors vois devriez pas y aller doucement. Ces créatures sont assez rare qui plus est.",
            1400, // HP
            95, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Séduction**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://cdn.discordapp.com/attachments/674851527776796682/674852704027410462/d81cely-d9ef3413-c7c3-463f-af30-490adfaa3096.png"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Si vous êtes un homme . . Ayant un rang E, vous êtes dans la moise. Les nagas sont de bonnes voleuses. Le Naga vous volera, après un enchantement de charme, ``25%`` de vos Ziums et prendra la fuite !\n\n__** / ! \\ **__\n1 | Vous pouvez acheter des items contre des charmes, cependant ils doivent être supérieurs au rang de l'ennemi et ils doivent être appliqués avant et non après !\n\n2 | Si vous perdez votre argent et bien la prochaine fois que vous ferez la rencontre d'une Naga, ce sera la même Naga, et donc en la tuant vous obtenez votre argent perdu en retour !";
        else msg = "La naga ouvre anormalement sa gueule, elle vous fonce dessus et tente de vous déchiqueter la peau à l'aide de sa mâchoire infligeant un total de "+math.floor(this.power-(this.power*0.5*math.random()))+" dégâts.";

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
