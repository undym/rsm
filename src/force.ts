import { Unit, Prm } from "./unit.js";
import { choice } from "./undym/random.js";


export class Force{
    async equip(unit:Unit){};
    async battleStart(unit:Unit){}
    async phaseStart(unit:Unit, pForce:PhaseStartForce){}
    async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async memberAfterDoAtk(me:Unit, action:Action, attacker:Unit, target:Unit, dmg:Dmg){}
    async whenDead(unit:Unit){}
    /**
     * 自分以外の死亡時.
     * 他のキャラクターのwhenAnyoneDeadによって死亡が回避された場合でも、残りの全ての生存キャラクター分呼ばれるので、
     * deadUnitが本当に死亡しているかはdeadUnit.deadで確認されなければならない。
     * */
    async whenAnyoneDead(deadUnit:Unit, me:Unit){}
    async phaseEnd(unit:Unit){}
}


export class PhaseStartForce{
    phaseSkip:boolean = false;
}


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
        res = res;
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
    /** */
    counter = false;
    /**追加ダメージ値を返す。 */
    additionalAttacks:((dmg:Dmg,index:number)=>number)[] = [];

    constructor(args?:{
        pow?:number,
        mul?:number,
        hit?:number,
        def?:number,
        absPow?:number,
        absMul?:number,
        counter?:boolean,
    }){
        this.clear();

        if(args){
            if(args.pow)    {this.pow.base = args.pow;}
            if(args.mul)    {this.pow.mul  = args.mul;}
            if(args.hit)    {this.hit.base = args.hit;}
            if(args.def)    {this.def.base = args.def;}
            if(args.absPow) {this.abs.base = args.absPow;}
            if(args.absMul) {this.abs.mul  = args.absMul;}
            if(args.counter){this.counter  = args.counter;}
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

        this.counter = false;

        this.additionalAttacks = [];
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
            value += _abs;
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