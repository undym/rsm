export class PartySkillWin {
    constructor() {
        this.exp = { base: 0, mul: 1 };
        this.jobExp = { base: 0, mul: 1 };
        this.yen = { base: 0, mul: 1 };
    }
}
export class PartySkillOpenBox {
    constructor() {
        /**float. */
        this.addRank = 0;
        /**float. */
        this.chain = 0;
    }
}
export class PartySkill {
    constructor(args) {
        this.args = args;
        this.has = false;
        PartySkill._values.push(this);
        if (PartySkill._valueOf.has(args.uniqueName)) {
            console.log(`!!PartySkill already has uniqueName "${args.uniqueName}".`);
        }
        else {
            PartySkill._valueOf.set(args.uniqueName, this);
        }
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
    get uniqueName() { return this.args.uniqueName; }
    get info() { return this.args.info; }
    toString() { return this.args.uniqueName; }
    win(arg) { }
    openBox(arg, dropType) { }
}
PartySkill._values = [];
PartySkill._valueOf = new Map();
PartySkill.DEF_PARTY_SKILL_NUM = 3;
PartySkill.skills = [];
(function (PartySkill) {
    PartySkill.empty = new class extends PartySkill {
        constructor() { super({ uniqueName: "empty", info: "" }); }
        toString() { return ""; }
        win(arg) {
            arg.exp.mul += 1;
        }
    };
    PartySkill.センス = new class extends PartySkill {
        constructor() { super({ uniqueName: "センス", info: "入手経験値x2" }); }
        win(arg) {
            arg.exp.mul += 1;
        }
    };
    // export const                         入手BP増加:PartySkill = new class extends PartySkill{
    //     constructor(){super({uniqueName:"入手BP増加", info:"入手BP+1"});}
    //     win(arg:PartySkillWin){
    //         arg.bp.base += 1;
    //     }
    // }
    PartySkill.金玉 = new class extends PartySkill {
        constructor() { super({ uniqueName: "金玉", info: "入手金x2" }); }
        win(arg) {
            arg.yen.mul += 1;
        }
    };
    // export const                         マトリョーシカ:PartySkill = new class extends PartySkill{
    //     constructor(){super({uniqueName:"マトリョーシカ", info:"宝箱アイテムチェーン+0.3"});}
    //     openBox(arg:PartySkillOpenBox, dropType:ItemDrop){
    //         if(dropType & ItemDrop.BOX){arg.chain += 0.3;}
    //     }
    // }
    // export const                         メモラック:PartySkill = new class extends PartySkill{
    //     constructor(){super({uniqueName:"メモラック", info:"宝箱アイテムランク+0.5"});}
    //     openBox(arg:PartySkillOpenBox, dropType:ItemDrop){
    //         if(dropType & ItemDrop.BOX){arg.addRank += 0.5;}
    //     }
    // }
    // export const                         かぐや姫:PartySkill = new class extends PartySkill{
    //     constructor(){super({uniqueName:"かぐや姫", info:"伐採チェーン+0.6"});}
    //     openBox(arg:PartySkillOpenBox, dropType:ItemDrop){
    //         if(dropType & ItemDrop.TREE){arg.chain += 0.6;}
    //     }
    // }
})(PartySkill || (PartySkill = {}));
