import { Unit, Prm } from "./unit.js";
import { choice } from "./undym/random.js";


export class Force{
    equip(unit:Unit){};
    /**死亡していても通る.死亡時発動させたくない場合は、ガードする。*/
    async battleStart(unit:Unit){}
    async phaseStart(unit:Unit, pForce:PhaseStartForce){}
    async deadPhaseStart(unit:Unit){}
    attackNum(action:Action, unit:Unit, aForce:AttackNumForce){}
    async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    /**ダメージを受ける直前、calc()された後に通る. */
    async beDamage(unit:Unit, dmg:Dmg){}
    async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async memberAfterDoAtk(me:Unit, action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async whenDead(unit:Unit){}
    /**
     * 自分以外の死亡時.
     * 他のキャラクターのwhenAnyoneDeadによって死亡が回避された場合でも、残りの全ての生存キャラクター分呼ばれるので、
     * deadUnitが本当に死亡しているかはdeadUnit.deadで確認されなければならない。
     * */
    async whenAnyoneDead(me:Unit, deadUnit:Unit){}
    async phaseEnd(unit:Unit){}
}


export class PhaseStartForce{
    phaseSkip:boolean = false;
}

export class AttackNumForce{
    add = 0;

    constructor(public base:number){

    }

    get total(){return (this.base + this.add)|0;}
}

export type DmgType = "毒"|"反射"|"反撃"|"ペット"|"罠";

export class Dmg{
    //0     1
    //60    0.85
    //300   0.55
    //1,050 0.3
    //2,100 0.2125
    private static calcDefCut(def:number):number{
        return (3000.0 + def * 1) / (3000.0 + def * 10);
    }
    private static calcDmgElm(elm:{base:number, add:number, mul:number}){
        let res = (elm.base + elm.add) * elm.mul;
        return res > 0 ? res : 0;
    }
    /**攻撃力。*/
    pow:{base:number, add:number, mul:number};
    /**防御力。 */
    def:{base:number, add:number, mul:number};
    /**命中率.1で必中. */
    hit:{base:number, add:number, mul:number};
    /**絶対攻撃値。*/
    abs:{base:number, add:number, mul:number};
    /**calc()で出された結果のbak. */
    result = {value:0, isHit:false};
    /**追加ダメージ値を返す。 */
    additionalAttacks:((dmg:Dmg,index:number)=>number)[] = [];
    /** */
    types:DmgType[] = [];
    /**一つでも持っていたらtrue. */
    hasType(...checkTypes:DmgType[]):boolean{
        for(const t of this.types){
            for(const c of checkTypes){
                if(t === c){return true;}
            }
        }
        return false;
    }

    constructor(args?:{
        pow?:number,
        mul?:number,
        hit?:number,
        def?:number,
        absPow?:number,
        absMul?:number,
        types?:DmgType[],
    }){
        this.clear();

        if(args){
            if(args.pow)    {this.pow.base = args.pow;}
            if(args.mul)    {this.pow.mul  = args.mul;}
            if(args.hit)    {this.hit.base = args.hit;}
            if(args.def)    {this.def.base = args.def;}
            if(args.absPow) {this.abs.base = args.absPow;}
            if(args.absMul) {this.abs.mul  = args.absMul;}
            if(args.types)  {this.types = args.types;}
        }
    }

    clear(){
        this.pow = {
            base:0,
            add:0,
            mul:1,
        };
        this.def = {
            base:0,
            add:0,
            mul:1,
        };
        this.hit = {
            base:1,
            add:0,
            mul:1,
        };
        this.abs = {
            base:0,
            add:0,
            mul:1,
        };

        this.result.value = 0;
        this.result.isHit = false;

        this.additionalAttacks = [];

        this.types = [];
    }

    calc():{value:number, isHit:boolean}{
        const _pow = Dmg.calcDmgElm( this.pow );
        const _def = Dmg.calcDmgElm( this.def );
        const _hit = Dmg.calcDmgElm( this.hit );
        const _abs = Dmg.calcDmgElm( this.abs );

        let value = 0;

        let isHit = Math.random() < _hit;
        if(isHit){
            value = _pow * Dmg.calcDefCut(_def);
            value = value * (0.75 + Math.random() * 0.5);
        }else{
            value = 0;
        }

        if(_abs > 0){
            isHit = true;
            value += _abs|0;
        }

        this.result.value = value > 0 ? value|0 : 0;
        this.result.isHit = isHit;
        return this.result;
    }
}


export abstract class Action{
    abstract use(attacker:Unit, targets:Unit[]):void;
}

export enum Targeting{
    SELECT      = 1 << 0,
    SELF        = 1 << 1,
    ALL         = 1 << 2,
    WITH_DEAD   = 1 << 3,
    DEAD_ONLY   = 1 << 4,
    WITH_FRIEND = 1 << 5,
    FRIEND_ONLY = 1 << 6,
    RANDOM      = 1 << 7,
}
export namespace Targeting{
    export const filter = (targetings:Targeting, attacker:Unit, targets:Unit[]|ReadonlyArray<Unit>, num:number):Unit[] => {
        
        if(targetings & Targeting.SELF){
            return new Array<Unit>(num).fill(attacker);
        }


        let filtered = targets.filter(t=> t.exists);
             if(targetings & Targeting.WITH_DEAD){}
        else if(targetings & Targeting.DEAD_ONLY){filtered = filtered.filter(t=> t.dead);}
        else                                     {filtered = filtered.filter(t=> !t.dead);}

             if(targetings & Targeting.WITH_FRIEND){}
        else if(targetings & Targeting.FRIEND_ONLY){filtered = filtered.filter(t=> t.isFriend(attacker));}
        else                                       {filtered = filtered.filter(t=> !t.isFriend(attacker));}

        if(filtered.length === 0){return [];}

        if(targetings & Targeting.RANDOM){
            let res:Unit[] = [];
            for(let i = 0; i < num; i++){
                res.push( choice(filtered) );
            }
            return res;
        }
        
        if(targetings & Targeting.SELECT){
            return new Array<Unit>(num).fill( choice(filtered) );
        }
        //all
        let res:Unit[] = [];
        for(let i = 0; i < num; i++){
            res = res.concat( filtered );
        }
        return res;
    }
}