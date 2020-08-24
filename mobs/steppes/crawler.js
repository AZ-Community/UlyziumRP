const { DefaultMob } = require('../defaultMob.js');

// Optimisation
const math = Math;

// La classe hérite des fonctions de DefaultMob, évite les duplicats de code.
class Mob extends DefaultMob {
    constructor(){
        super(
            "Crawler",
            "Steppes",
            "E",
            "Vous avez la phobie des araignées ? Eh bien vous êtes tombé sur l'une des pires possibles, les Crawler vivent en terrain désertique pour une raison, le climat & également la propagation d'infection qui devient + puissante chez elles, ces bêtes sont vraiment giganstesques, elles mesurent à peu près 2,5 Demi Chameaux empiliés l'un sur lautre.",
            1300, // HP
            75, // Puissance
            "╭── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╮\n|  **Cocon**\n╰── ⋅ ⋅ ─────── ✩ ─────── ⋅ ⋅ ──╯",
            "https://i.pinimg.com/564x/36/f0/fa/36f0fa5e6f4748ee4931cacfd446ee6d.jpg"
        );
    }

    getDescAtk() {
        var probCrit = 0.85;
        var prob = math.random();
        var msg = null;

        if(prob >= probCrit) msg = "Le Crawler vous saute dessus mais se projette en arrière pour vous envelopper dans un cocon de toile, vous empêchant tout mouvement durant ``2`` tours. De plus il vous draine 25 de vie par tour et ce pendant ``2`` tours, régénérant alors sa vie.\n\n__** / ! \\ **__\n1 | Si vous êtes plusieurs il attaque le plus faible d'entre vous au niveau des PV !";
        else msg = "Le Crawler étend ses pates, ces dernières infligeront un total de "+math.floor(this.power-(this.power*0.5*math.random()))+" dégâts.";

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
                "title":"Matériau :gear: [ Griffe ]",
                "icon":":gear:",
                "prob":0.6,
                "default":4
            },
            {
                "title":"Matériau :gear: [ Mandibule ]",
                "icon":":gear:",
                "prob":0.7,
                "default":2
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
