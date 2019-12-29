import { Unit, Prm } from "./unit.js";
import { choice } from "./undym/random.js";
import { Font, Graphics } from "./graphics/graphics.js";
import { DrawSTBox } from "./scene/sceneutil.js";
import { FX_Shake, FX_RotateStr, FX_PetDie } from "./fx/fx.js";
import { Color, Point } from "./undym/type.js";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Sound } from "./sound.js";



export interface ForceIns{
    // 
    readonly force:Force;
    /*
        private forceIns:Force;
        get force(){return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this));}
        protected createForce(_this:ForceIns):Force{return emptyForce();}
     */
}

export class Force{
    private static _empty:Force;
    static get empty(){return this._empty ? this._empty : (this._empty = new Force());}

    equip(unit:Unit){}
    /**死亡していても通る.死亡時発動させたくない場合は、ガードする。*/
    async battleStart(unit:Unit){}
    async phaseStart(unit:Unit, pForce:PhaseStartForce){}
    async deadPhaseStart(unit:Unit){}
    attackNum(action:Action, unit:Unit, aForce:AttackNumForce){}
    async beforeDoAtk(dmg:Dmg){}
    async beforeBeAtk(dmg:Dmg){}
    /**ダメージを受ける直前、calc()された後に通る. */
    async beDamage(dmg:Dmg){}
    async afterDoAtk(dmg:Dmg){}
    async afterBeAtk(dmg:Dmg){}
    async memberAfterDoAtk(me:Unit, dmg:Dmg){}
    async whenDead(unit:Unit){}
    /**
     * 自分以外の死亡時.
     * 他のキャラクターのwhenAnyoneDeadによって死亡が回避された場合でも、残りの全ての生存キャラクター分呼ばれるので、
     * deadUnitが本当に死亡しているかはdeadUnit.deadで確認されなければならない。
     * */
    async whenAnyoneDead(me:Unit, deadUnit:Unit){}
    
    async doHeal(heal:Heal){}
    async beHeal(heal:Heal){}

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

export type DmgType = 
                 "格闘"|"槍"|"魔法"|"神格"|"暗黒"|"怨霊"|"鎖術"|"過去"|"銃"|"機械"|"弓"
                |"毒"|"ペット"|"罠"
                ;

export class Dmg{
    private static _empty:Dmg;
    static get empty():Dmg{
        if(!this._empty){
            this._empty = new Dmg({
                attacker:Unit.all[0],
                target:Unit.all[0],
            });
        }
        return this._empty;
    }
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

    attacker:Unit;
    target:Unit;
    action:Action|undefined;
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
    /**カウンター可能かどうか。自傷技にもつける。 */
    canCounter = true;

    constructor(args:{
        attacker:Unit,
        target:Unit,
        action?:Action,
        pow?:number,
        mul?:number,
        hit?:number,
        def?:number,
        absPow?:number,
        absMul?:number,
        types?:DmgType[],
        canCounter?:boolean,
    }){
        this.clear();

        this.attacker = args.attacker;
        this.target = args.target;
        this.action = args.action;
        if(args.pow)    {this.pow.base = args.pow;}
        if(args.mul)    {this.pow.mul  = args.mul;}
        if(args.hit)    {this.hit.base = args.hit;}
        if(args.def)    {this.def.base = args.def;}
        if(args.absPow) {this.abs.base = args.absPow;}
        if(args.absMul) {this.abs.mul  = args.absMul;}
        if(args.types)  {this.types = args.types;}
        if(args.canCounter !== undefined){this.canCounter = args.canCounter;}
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

    private calc():void{
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
    }


    async run():Promise<void>{
        if(!this.target.exists || this.target.dead){return;}

        
        const font = new Font(Font.def.size * 2, Font.BOLD);
        const point =   {
                        x:this.target.imgBounds.cx + Graphics.dotW * 60 * (Math.random() * 2 - 1),
                        y:this.target.imgBounds.cy + Graphics.dotH * 60 * (Math.random() * 2 - 1),
                    };
        const effect = (value:number)=>{
            const stbox = new DrawSTBox(()=>this.target);
            FX_Shake(this.target.boxBounds, bounds=>{
                Graphics.fillRect(bounds, Color.BLACK);
                stbox.draw(bounds)
            });
            FX_RotateStr(font, `${value}`, point, Color.WHITE);
        };

        this.calc();

        this.target.beDamage(this);

        if(this.result.isHit){
            const _doDmg = async(value:number)=>{
                effect(value);
                if(this.target.pet && value >= this.target.hp){
                    Util.msg.set(`${this.target.pet}が${value}のダメージを引き受けた`); await wait(1);

                    this.target.pet.hp--;
                    if(this.target.pet.hp <= 0){
                        const petName = this.target.pet.toString();
                        this.target.pet = undefined;
                        Sound.pet_die.play();
                        FX_PetDie( this.target.imgCenter );
                        Util.msg.set(`${petName}は砕け散った...`); await wait();
                    }
                }else{
                    this.target.hp -= value;
                }
            };

            const value = this.result.value;
            await _doDmg(value);
            Util.msg.set(`${this.target.name}に${value}のダメージ`, Color.RED.bright);

            for(let i = 0; i < this.additionalAttacks.length; i++){
                await wait(1);

                const value = this.additionalAttacks[i]( this, i );
                await _doDmg(value);
                Util.msg.set(`+${value}`, Color.RED.bright);
            }
        }else{
            FX_RotateStr(font, "MISS", point, Color.L_GRAY);
            Util.msg.set("MISS", Color.L_GRAY);
        }

        this.target.tp += 1;
    }
}


type HealType = "HP"|"MP"|"TP";

export class Heal{
    private static font:Font;

    static run(
        type:HealType,
        value:number,
        healer:Unit,
        target:Unit,
        action:Object|undefined,
        msg:boolean,
    ):number{
        if(!target.exists || target.dead){return 0;}

        const heal = new Heal(type, value, healer, target, action);
        heal.healer.doHeal(heal);
        heal.target.beHeal(heal);

        switch(heal.type){
            case "HP":{
                heal.target.hp += heal.value;
        
                const p = new Point(heal.target.imgBounds.cx, heal.target.imgBounds.cy - heal.target.imgBounds.h / 2);
                FX_RotateStr(Heal.font, `${heal.value}`, p, Color.GREEN);

                if(msg){Util.msg.set(`${heal.target.name}のHPが${heal.value}回復した！`, Color.GREEN.bright);}
                }break;
            case "MP":{
                heal.target.mp += heal.value;
        
                const p = new Point(heal.target.imgBounds.cx, heal.target.imgBounds.cy);
                FX_RotateStr(Heal.font, `${heal.value}`, p, Color.PINK);

                if(msg){Util.msg.set(`${heal.target.name}のMPが${heal.value}回復した！`, Color.GREEN.bright);}
                }break;
            case "TP":{
                heal.target.tp += heal.value;
        
                const p = new Point(heal.target.imgBounds.cx, heal.target.imgBounds.cy + heal.target.imgBounds.h / 2);
                FX_RotateStr(Heal.font, `${heal.value}`, p, Color.CYAN);

                if(msg){Util.msg.set(`${heal.target.name}のTPが${heal.value}回復した！`, Color.GREEN.bright);}
                }break;
        }
        return heal.value;
    }

    healer:Unit;
    target:Unit;

    type:HealType;

    private _value:number;
    get value(){return this._value|0;}
    set value(v:number){this._value = v;}

    action:Object|undefined;

    // constructor(args:{
    //     healer:Unit,
    //     target:Unit,
    //     type:HealType,
    //     value:number,
    //     action?:Object,
    // }){
    private constructor(
        type:HealType,
        value:number,
        healer:Unit,
        target:Unit,
        action?:Object,
    ){
        this.healer = healer;
        this.target = target;
        this.type   = type;
        this.value  = value;
        this.action = action;

        if(!Heal.font){
            Heal.font = new Font( Font.def.size * 2 );
        }
    }
    /**
     * @return 回復値を返す.
     */
    // run(msg:boolean):number{
    //     if(!this.target.exists || this.target.dead){return 0;}

    //     this.healer.doHeal(this);
    //     this.target.beHeal(this);

    //     switch(this.type){
    //         case "HP":{
    //             this.target.hp += this.value;
        
    //             const p = new Point(this.target.imgBounds.cx, this.target.imgBounds.cy - this.target.imgBounds.h / 2);
    //             FX_RotateStr(Heal.font, `${this.value}`, p, Color.GREEN);

    //             if(msg){Util.msg.set(`${this.target.name}のHPが${this.value}回復した！`, Color.GREEN.bright);}
    //             }break;
    //         case "MP":{//TODO
    //             this.target.mp += this.value;
        
    //             const p = new Point(this.target.imgBounds.cx, this.target.imgBounds.cy);
    //             FX_RotateStr(Heal.font, `${this.value}`, p, Color.PINK);

    //             if(msg){Util.msg.set(`${this.target.name}のMPが${this.value}回復した！`, Color.GREEN.bright);}
    //             }break;
    //         case "TP":{
    //             this.target.tp += this.value;
        
    //             const p = new Point(this.target.imgBounds.cx, this.target.imgBounds.cy + this.target.imgBounds.h / 2);
    //             FX_RotateStr(Heal.font, `${this.value}`, p, Color.CYAN);

    //             if(msg){Util.msg.set(`${this.target.name}のTPが${this.value}回復した！`, Color.GREEN.bright);}
    //             }break;
    //     }
    //     return this.value;
    // }
}


export abstract class Action{
    abstract use(attacker:Unit, targets:Unit[]):void;
}

// export type Targeting = number;
// export namespace Targeting{
//     export const SELECT      = 1 << 0;
//     export const SELF        = 1 << 1;
//     export const ALL         = 1 << 2;
//     export const WITH_DEAD   = 1 << 3;
//     export const DEAD_ONLY   = 1 << 4;
//     export const WITH_FRIEND = 1 << 5;
//     export const FRIEND_ONLY = 1 << 6;
//     export const RANDOM      = 1 << 7;


//     export const filter = (targetings:Targeting, attacker:Unit, targets:Unit[]|ReadonlyArray<Unit>, num:number):Unit[] => {
        
//         if(targetings & Targeting.SELF){
//             return new Array<Unit>(num).fill(attacker);
//         }


//         let filtered = targets.filter(t=> t.exists);
//              if(targetings & Targeting.WITH_DEAD){}
//         else if(targetings & Targeting.DEAD_ONLY){filtered = filtered.filter(t=> t.dead);}
//         else                                     {filtered = filtered.filter(t=> !t.dead);}

//              if(targetings & Targeting.WITH_FRIEND){}
//         else if(targetings & Targeting.FRIEND_ONLY){filtered = filtered.filter(t=> t.isFriend(attacker));}
//         else                                       {filtered = filtered.filter(t=> !t.isFriend(attacker));}

//         if(filtered.length === 0){return [];}

//         if(targetings & Targeting.RANDOM){
//             let res:Unit[] = [];
//             for(let i = 0; i < num; i++){
//                 res.push( choice(filtered) );
//             }
//             return res;
//         }
        
//         if(targetings & Targeting.SELECT){
//             return new Array<Unit>(num).fill( choice(filtered) );
//         }
//         //all
//         let res:Unit[] = [];
//         for(let i = 0; i < num; i++){
//             res = res.concat( filtered );
//         }
//         return res;
//     }
// }