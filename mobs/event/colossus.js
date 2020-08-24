const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Colossus",
            "Donjon",
            "Colossus, une vraie montagne vivante du moins selon les descriptions des aventuriers, faisant d'elle une terreur.\nSelon les personnes ayant fait sa rencontre, le bestiaire serait du genre à être calme.\nOui apparemment il attaquera que si on le lui oblige, c'est donc une créature assez neutre.\nHeureusement qu'elle ne représente aucun danger pour les villes voisines ou même les débutants.",
            26961, // HP
            1588, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|``Stone commandment`` ~ Un ordre terrestre\n| Des pics viendront à vous faire des blessures\n| Si vous ne parvenez pas à bloquer et bien\n| vous aurez un effet de saignements infligeant\n| -250 ❣ de 1 à 5 tours, espérez être chanceux\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯\n╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|``Sysmic`` ~Un énorme tremblement massif\n| Un tremblement affectant vos attaques\n| Oui pendant 1 à 4 tours, vous recevez un malus\n| Malus de -600 à peu près, ça dépendra.\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯\n╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|``Unbreakable`` Il devient indestructible\n| sa carapace se renforce, la durée indéterminée\n| Mais bon, cela va de 1 à 4 tours.\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "(     Magie : :no_entry_sign: | Armure : :no_entry_sign: | Heal : :white_check_mark:   )",
            "http://www.meh.ro/wp-content/uploads/2012/09/meh.ro10372.jpg"
        );
    }
   
    getDescAtk() {
        var probFail = 0.43;
        var probStone = 0.9;
        var probUnbreakable = 0.95;
        var probSysmic = 0.85;
        var prob = math.random();
        var msg = null;
        
        if(prob > probFail){
            if(prob > probUnbreakable){
                msg = "La créature charge une capacité spéciale, soudainement sa structure externe se solidifie la rendant indestructible durant "+math.floor(6-(3*math.random()))+" tour(s).";
            }else if(prob > probStone){
                msg = "L'oeil du Colossus devient alors rougeâtre, quelques cailloux lévitent désormais dans les airs puis ils sont projetés dans toutes les directions, il inflige à ses cibles "+math.floor(1300-(1300*0.1*math.random()))+" dégâts.";
            }else if(prob > probSysmic){
                msg = "Un silence déconcertant règne au beau milieu du combat présageant de mauvais augures, tout à coup il écrase sa partie centrale sur le sol, provoquant un séisme tout autour de lui qui paralyse ses ennemis durant "+math.floor(3-(2*math.random()))+" tour(s).";
            }else msg = "Le Colossus vous lance quelques piques de pierre dans votre direction, il inflige "+math.floor(1588-(1588*0.45*math.random()))+" dégâts.";
        }else{
            msg = "La montagne de pierre semble réfléchir, profitez-en pour l'attaquer.";
        }

        return msg;
    }

    getDescDef() {
        var probFail = 0.65;
        var probReverse = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob > probFail){
            if(prob > probReverse){
                msg = "Le Colossus anticipe votre attaque, il vous pare en faisant sortir du sol un mur de pierre, vous donnant par la suite un coup de patte rocailleuse qui vous inflige "+math.floor(this.power*0.5-(this.power*0.25*math.random()))+" dégâts.";
            }else msg = "Le Colossus bloque votre tentative en dressant quelques pics de pierre sur votre chemin, vous empêchant donc de l'atteindre et de lui faire un quelconque dégât.";
        }else{
            msg = "Le Colossus ne réagit que trop tard, votre coup l'atteind et il se prend donc l'intégralité des dégâts reçus.";
        }

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":Zium:",
                "prob":0,
                "default":9000
            },
            {
                "title":"Gelury",
                "icon":":scales:",
                "prob":0.44,
                "default":10
            },
            {
                "title":"Ezurith",
                "icon":":scales:",
                "prob":0.51,
                "default":8
            },
            {
                "title":"Amethys",
                "icon":":fleur_de_lis:",
                "prob":0.64,
                "default":7
            },
            {
                "title":"Oryust",
                "icon":":fleur_de_lis:",
                "prob":0.65,
                "default":6
            },
            {
                "title":"Cleryum",
                "icon":":fleur_de_lis:",
                "prob":0.71,
                "default":4
            }
        ];
    }
}

module.exports = new Mob();