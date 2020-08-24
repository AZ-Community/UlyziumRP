class DefaultMob {
    constructor(name, kind, lvl, desc, hp, power, cap, pic){
        this.name = name;
        this.kind = kind;
        this.level = lvl;
        this.desc = desc;
        this.hp = hp;
        this.power = power;
        this.cap = cap;
        this.pic = pic;
    }

    getName() {
        return this.name;
    }

    getCommand() {
        return "info "+this.name.toLowerCase();
    }

    getKind() {
        return this.kind;
    }

    getLevel() {
        return this.level;
    }

    getDesc() {
        return this.desc;
    }

    getHP() {
        return this.hp;
    }

    getPower() {
        return this.power;
    }

    getCap() {
        return this.cap;
    }

    getPic() {
        return this.pic;
    }
}

module.exports.DefaultMob = DefaultMob;