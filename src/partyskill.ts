import { ItemDrop } from "./item.js";



export class PartySkillWin{
    exp     = {base:0, mul:1};
    jobExp  = {base:0, mul:1};
    yen     = {base:0, mul:1};
}

export class PartySkillOpenBox{
    /**float. */
    addRank = 0;
    /**float. */
    chain = 0;
}

export class PartySkill{
    private static _values:PartySkill[] = [];
    static get values():ReadonlyArray<PartySkill>{return this._values;}
    private static _valueOf = new Map<string, PartySkill>();
    static valueOf(uniqueName:string):PartySkill|undefined{
        return this._valueOf.get(uniqueName);
    }

    static DEF_PARTY_SKILL_NUM = 3;

    static skills:PartySkill[] = [];


    get uniqueName():string{return this.args.uniqueName;}
    get info():string{return this.args.info;}

    has = false;


    constructor(
        private args:{
            uniqueName:string,
            info:string,
        }
    ){
        PartySkill._values.push(this);
        if(PartySkill._valueOf.has(args.uniqueName)){
            console.log(`!!PartySkill already has uniqueName "${args.uniqueName}".`);
        }else{
            PartySkill._valueOf.set(args.uniqueName, this);
        }
    }

    toString(){return this.args.uniqueName;}

    win(arg:PartySkillWin):void{}
    openBox(arg:PartySkillOpenBox, dropType:ItemDrop):void{}
}


export namespace PartySkill{
    export const                         empty:PartySkill = new class extends PartySkill{
        constructor(){super({uniqueName:"empty", info:""});}
        toString(){return "";}
        win(arg:PartySkillWin){
            arg.exp.mul += 1;
        }
    }
    export const                         センス:PartySkill = new class extends PartySkill{
        constructor(){super({uniqueName:"センス", info:"入手経験値x2"});}
        win(arg:PartySkillWin){
            arg.exp.mul += 1;
        }
    }
    // export const                         入手BP増加:PartySkill = new class extends PartySkill{
    //     constructor(){super({uniqueName:"入手BP増加", info:"入手BP+1"});}
    //     win(arg:PartySkillWin){
    //         arg.bp.base += 1;
    //     }
    // }
    export const                         金玉:PartySkill = new class extends PartySkill{
        constructor(){super({uniqueName:"金玉", info:"入手金x2"});}
        win(arg:PartySkillWin){
            arg.yen.mul += 1;
        }
    }
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
}