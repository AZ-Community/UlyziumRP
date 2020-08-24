const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Shyva",
            "Donjon",
            "Shyva, il est dis dans les mythologies ancestrales qu'une bête des plus majestueuse vivrait dans les Steppes.\nCette monstrueuse chose porterait le surnom de \"The sand disaster\" et à vrai dire elle le porte bien.\nL'apparence de celle-ci est presque impossible à distinguer car une épaisse brume cache le bestiaire.\nCeci fait d'elle l'une des créatures les plus mystérieuses existantes dans le monde d'Ulyzium.",
            23567, // HP
            1600, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n| ``Sand Eater`` | ~ Puissant sable mouvant     \n| créer par Shyva, vous recevrez 2 attaques\n| du bestiaire, c'est une attaque de zone !\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯\n╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n| ``Morph`` | ~ Mutation de la peaux en sable    \n| de Shyva, il devient alors insensible \n| pendant 2 prochaines attaques !\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯\n╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n| ``Blaze`` | ~ Eh bien, en vous attaquant\n| Shyva vous inflige 250 💥 pendant \n| les 3 tours à venir à cause de l'inflammation.\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "(     Magie : :no_entry_sign: | Armure : :no_entry_sign: | Heal : :no_entry_sign:   )",
            "http://orig09.deviantart.net/03da/f/2014/025/1/d/sand_monster_by_atenx-d73r4sn.jpg"
        );
    }
    
    getDescAtk() {
        var probFail = 0.2;
        var probEater = 0.95;
        var probMorph = 0.8;
        var probBlaze = 0.55;
        var prob = math.random();
        var msg = null;
        
        if(prob > probFail){
            if(prob > probEater){
                msg = "~ :crossed_swords: | Shyva vient d'user de ça capacité \"Sand Eater\" c'est ainsi que la zone entière viendra à prendre une tout autre forme, oui de multiples sables mouvant viendront à paraître & engloutir toutes les personnes présentes dans la zone, serez vous assez fort pour luter face à celle ci ? Si ce n'est pas le cas, vous resterez coincé & vous subirez "+math.floor(3-(2*math.random()))+" attaque(s) consécutive(s) !";
            }else if(prob > probMorph){
                msg = "Une couche de sable recouvre l'épaisse peau de la bête, formant une carapace indestructible durant "+math.floor(4-(2*math.random()))+" tour(s).";
            }else if(prob > probBlaze){
                msg = "Shyva ouvre sa cavité buccale dont sortent des flammes ardentes, touchant toutes les personnes aux alentours, et inflige "+math.floor(350-(350*0.2*math.random()))+" dégâts durant 2 tours consécutifs.";
            }else msg = "Shyva, de la paume de sa patte droite, vous hurte de plein fouet, vous infligeant "+math.floor(1290-(1290*0.2*math.random()))+" dégâts.";
        }else{
            msg = "Heureusement pour vous, la créature semble se contenter d'un hurlement mais cela ne durera pas, profitez-en.";
        }

        return msg;
    }

    getDescDef() {
        var probFail = 0.55;
        var probReverse = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob > probFail){
            if(prob > probReverse){
                msg = "Alors que vous tentez de l'attaquer, la créature vous pare et vous inflige "+math.floor(1290*0.3-(1290*0.2*math.random()))+" dégâts.";
            }else msg = "Shyva dresse un mur devant vous, vous stoppant dans votre lancée, toutefois vous ne prenez aucun dégât en retour.";
        }else{
            msg = "Distrait, le monstre surnommé Shyva se prend dans son intégralité votre attaque.";
        }

        return msg;
    }

    getLoots() {
        return [
            {
                "title":"ziums",
                "icon":":Zium:",
                "prob":0,
                "default":8000
            },
            {
                "title":"Cuir",
                "icon":":scales:",
                "prob":0.19,
                "default":23
            },
            {
                "title":"Zuryth",
                "icon":":fleur_de_lis:",
                "prob":0.62,
                "default":6
            },
            {
                "title":"Ambryum",
                "icon":":fleur_de_lis:",
                "prob":0.63,
                "default":7
            },
            {
                "title":"Ruby",
                "icon":":fleur_de_lis:",
                "prob":0.76,
                "default":4
            },
            {
                "title":"Pure scale",
                "icon":":fleur_de_lis:",
                "prob":0.81,
                "default":2
            },
            {
                "title":"Plume d'Syx",
                "icon":":fleur_de_lis:",
                "prob":0.87,
                "default":2
            }
        ]
    }
}

module.exports = new Mob();