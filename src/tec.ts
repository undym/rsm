import { Unit, Prm, PUnit, EUnit } from "./unit.js";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Force, Dmg, Targeting, Action, PhaseStartForce } from "./force.js";
import { Condition, ConditionType, InvisibleCondition } from "./condition.js";
import { Color } from "./undym/type.js";
import { FX_Str, FX_格闘, FX_魔法, FX_神格, FX_暗黒, FX_鎖術, FX_過去, FX_銃, FX_回復, FX_吸収, FX_弓, FX_ナーガ, FX_Poison, FX_Buff, FX_RotateStr, FX_PetDie, FX_機械, FX_BOM, FX_ナーガ着弾 } from "./fx/fx.js";
import { Font } from "./graphics/graphics.js";
import { Battle } from "./battle.js";
import { Num } from "./mix.js";
import { Item } from "./item.js";
import { randomInt } from "./undym/random.js";
import { Sound } from "./sound.js";
import { Pet } from "./pet.js";



export class TecSort{
    private static _values:TecSort[] = [];
    static get values():ReadonlyArray<TecSort>{return this._values;}

    static readonly 格闘　 = new TecSort("格闘");
    static readonly 魔法 　= new TecSort("魔法");
    static readonly 神格 　= new TecSort("神格");
    static readonly 暗黒 　= new TecSort("暗黒");
    static readonly 鎖術 　= new TecSort("鎖術");
    static readonly 過去 　= new TecSort("過去");
    static readonly 銃   　= new TecSort("銃");
    static readonly 弓   　= new TecSort("弓");
    static readonly 強化　 = new TecSort("強化");
    static readonly 弱体 　= new TecSort("弱体");
    static readonly 回復 　= new TecSort("回復");
    static readonly その他 = new TecSort("その他");
    
    private _tecs:Tec[];
    get tecs():ReadonlyArray<Tec>{
        if(!this._tecs){
            let actives = ActiveTec.values.filter(tec=> tec.sortType === this);
            let passives = PassiveTec.values.filter(tec=> tec.sortType === this);
            let tmp:Tec[] = [];
            this._tecs = tmp.concat( actives, passives );
        }
        return this._tecs;
    }

    private constructor(private name:string){
        TecSort._values.push(this);
    }

    toString(){return this.name;}
}


export abstract class TecType{
    private static _values:TecType[] = [];
    static get values():ReadonlyArray<TecType>{return this._values;}
    
    // private _tecs:Tec[];
    // get tecs():ReadonlyArray<Tec>{
    //     if(!this._tecs){
    //         let actives = ActiveTec.values.filter(tec=> tec.type === this);
    //         let passives = PassiveTec.values.filter(tec=> tec.type === this);
    //         let tmp:Tec[] = [];
    //         this._tecs = tmp.concat( actives, passives );
    //     }
    //     return this._tecs;
    // }

    protected constructor(private name:string){
        TecType._values.push(this);
    }

    toString(){return this.name;}

    abstract createDmg(attacker:Unit, target:Unit):Dmg;
    abstract effect(attacker:Unit, target:Unit, dmg:Dmg):void;
    abstract sound():void;

    /**一つでも当てはまればtrue. */
    any(...types:TecType[]){
        for(const t of types){
            if(this === t){return true;}
        }
        return false;
    }
}



export namespace TecType{
    export const             格闘 = new class extends TecType{
        constructor(){super("格闘");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.STR).total + attacker.prm(Prm.LV).total * 0.3,
                def:target.prm(Prm.MAG).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_格闘(target.imgBounds.center);}
        sound(){Sound.PUNCH.play();}
    };
    export const             槍 = new class extends TecType{
        constructor(){super("槍");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.STR).total + attacker.prm(Prm.ARR).total + attacker.prm(Prm.LV).total * 0.3,
                def:target.prm(Prm.MAG).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_格闘(target.imgBounds.center);}
        sound(){Sound.PUNCH.play();}
    };
    export const             魔法 = new class extends TecType{
        constructor(){super("魔法");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.MAG).total + attacker.prm(Prm.LV).total * 0.3,
                def:target.prm(Prm.STR).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_魔法(target.imgBounds.center);}
        sound(){Sound.MAGIC.play();}
    };
    export const             神格 = new class extends TecType{
        constructor(){super("神格");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.LIG).total * 0.85 + attacker.prm(Prm.LV).total * 0.3,
                def:target.prm(Prm.DRK).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_神格(target.imgBounds.center);}
        sound(){Sound.sin.play();}
    };
    export const             暗黒 = new class extends TecType{
        constructor(){super("暗黒");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.DRK).total + attacker.prm(Prm.LV).total * 0.5,
                def:target.prm(Prm.LIG).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_暗黒(target.imgBounds.center);}
        sound(){Sound.KEN.play();}
    };
    export const             怨霊 = new class extends TecType{
        constructor(){super("怨霊");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            const pow = attacker.tecs.some(tec=> tec === Tec.怨霊使い)
                        ? attacker.prm(Prm.GHOST).total * 0.1
                        : attacker.prm(Prm.GHOST).total * 0.01
                        ;
            return new Dmg({
                pow:pow,
                def:target.prm(Prm.LIG).total * 3,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_暗黒(target.imgCenter);}
        sound(){Sound.KEN.play();}
    };
    export const             鎖術 = new class extends TecType{
        constructor(){super("鎖術");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.CHN).total + attacker.prm(Prm.LV).total * 0.3,
                def:target.prm(Prm.PST).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_鎖術(attacker.imgBounds.center, target.imgBounds.center);}
        sound(){Sound.chain.play();}
    };
    export const             過去 = new class extends TecType{
        constructor(){super("過去");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.PST).total + attacker.prm(Prm.LV).total * 0.3,
                def:target.prm(Prm.CHN).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_過去(target.imgBounds.center);}
        sound(){Sound.kako.play();}
    };
    export const             銃 = new class extends TecType{
        constructor(){super("銃");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.GUN).total + attacker.prm(Prm.LV).total * 0.3,
                def:target.prm(Prm.ARR).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_銃(attacker.imgBounds.center, target.imgBounds.center);}
        sound(){Sound.gun.play();}
    };
    export const             機械 = new class extends TecType{
        constructor(){super("機械");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.GUN).total * 0.4 + attacker.prm(Prm.LV).total * 1,
                def:target.prm(Prm.ARR).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_機械(attacker.imgBounds.center, target.imgBounds.center);}
        sound(){Sound.lazer.play();}
    };
    export const             弓 = new class extends TecType{
        constructor(){super("弓");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                pow:attacker.prm(Prm.ARR).total * 2 + attacker.prm(Prm.LV).total * 0.2,
                def:target.prm(Prm.GUN).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_弓(attacker.imgBounds.center, target.imgBounds.center);}
        sound(){Sound.ya.play();}
    };
    export const             状態 = new class extends TecType{
        constructor(){super("状態");}
        createDmg(attacker:Unit, target:Unit):Dmg{return new Dmg();}
        effect(attacker:Unit, target:Unit, dmg:Dmg){}
        sound(){}
    };
    export const             回復 = new class extends TecType{
        constructor(){super("回復");}
        createDmg(attacker:Unit, target:Unit):Dmg{
            return new Dmg({
                absPow:attacker.prm(Prm.LIG).total + attacker.prm(Prm.LV).total,
            });
        }
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_回復(target.imgBounds.center);}
        sound(){}
    };
    export const             その他 = new class extends TecType{
        constructor(){super("その他");}
        createDmg(attacker:Unit, target:Unit):Dmg{return new Dmg();}
        effect(attacker:Unit, target:Unit, dmg:Dmg){}
        sound(){}
    };
    // export const             ペット = new class extends TecType{
    //     constructor(){super("ペット");}
    //     createDmg(attacker:Unit, target:Unit):Dmg{return new Dmg({pow:attacker.prm(Prm.LV).total});}
    //     effect(attacker:Unit, target:Unit, dmg:Dmg){}
    //     sound(){}
    // };
}


export class Tec extends Force{
    private static _empty:Tec;
    static get empty():Tec{
        return this._empty ? this._empty : (this._empty = new Tec("empty", "", TecSort.格闘, TecType.格闘));
    }
    
    constructor(
        readonly uniqueName:string, 
        readonly info:string, 
        readonly sortType:TecSort, 
        readonly type:TecType
    ){
        super();
    }
}



export abstract class PassiveTec extends Tec{
    private static _values:PassiveTec[] = [];
    static get values():ReadonlyArray<PassiveTec>{return this._values;}
    private static _valueOf = new Map<string,PassiveTec>();
    static valueOf(uniqueName:string):PassiveTec|undefined{
        return this._valueOf.get(uniqueName);
    }
    

    protected constructor(
        private args:{
            uniqueName:string,
            info:string,
            sort:TecSort,
            type:TecType,
        }
    ){
        super(args.uniqueName, args.info, args.sort, args.type);

        PassiveTec._values.push(this);
        if(PassiveTec._valueOf.has(this.uniqueName)){
            console.log(`PassiveTec already has uniqueName "${this.uniqueName}".`);
        }else{
            PassiveTec._valueOf.set( this.uniqueName, this );
        }
    }

    toString():string{return `-${this.uniqueName}-`;}
}



export abstract class ActiveTec extends Tec implements Action{
    private static _values:ActiveTec[] = [];
    static get values():ReadonlyArray<ActiveTec>{return this._values;}
    
    private static _valueOf = new Map<string,ActiveTec>();
    static valueOf(uniqueName:string):ActiveTec|undefined{return this._valueOf.get(uniqueName);}
    
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    get mpCost():number{return this.args.mp ? this.args.mp : 0;}
    get tpCost():number{return this.args.tp ? this.args.tp : 0;}
    get epCost():number{return this.args.ep ? this.args.ep : 0};
    get itemCost():{item:Item, num:number}[]{
        if(this.args.item){
            let res:{item:Item, num:number}[] = [];
            for(const set of this.args.item()){
                res.push( {item:set[0], num:set[1]} );
            }
            return res;
        }
        return [];
    }
    
    /**攻撃倍率 */
    get mul():number{return this.args.mul;}
    /**攻撃回数生成 */
    rndAttackNum():number{return this.args.num;}
    get hit():number{return this.args.hit;}
    get targetings():number{return this.args.targetings;}

    get flags():("ペット")[]{return this.args.flags ? this.args.flags : [];}
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    protected constructor(
        private args:{
            uniqueName:string,
            info:string,
            sort:TecSort,
            type:TecType,
            targetings:number,
            mul:number,
            num:number,
            hit:number,
            mp?:number,
            tp?:number,
            ep?:number,
            item?:()=>[Item,number][],
            flags?:("ペット")[],
    }){
        super(args.uniqueName, args.info, args.sort, args.type);

        ActiveTec._values.push(this);
        if(ActiveTec._valueOf.has(this.uniqueName)) {console.log(`!!ActiveTec already has uniqueName "${this.uniqueName}".`);}
        else                                        {ActiveTec._valueOf.set( this.uniqueName, this );}
    }

    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    checkCost(u:Unit):boolean{
        if(u instanceof PUnit){       
            for(const set of this.itemCost){
                if(set.item.remainingUseNum < set.num){
                    return false;
                }
            }
        }

        return (
                       u.mp >= this.mpCost
                    && u.tp >= this.tpCost
                    && u.ep >= this.epCost
               );
    }

    payCost(u:Unit):void{
        u.mp -= this.mpCost;
        u.tp -= this.tpCost;
        u.ep -= this.epCost;

        if(u instanceof PUnit){       
            for(const set of this.itemCost){
                set.item.remainingUseNum -= set.num;
            }
        }
    }

    effect(attacker:Unit, target:Unit, dmg:Dmg):void{
        this.type.effect(attacker, target, dmg);
    }
    sound():void{
        this.type.sound();
    }

    async use(attacker:Unit, targets:Unit[]){

        Util.msg.set(`${attacker.name}の[${this}]`, Color.D_GREEN.bright); await wait();

        if(targets.length === 0){return;}

        if(!this.checkCost(attacker)){
            Util.msg.set("コストを支払えなかった"); await wait();
            return;
        }

        this.payCost(attacker);

        for(let t of targets){
            await this.run(attacker, t);
        }
    }

    async run(attacker:Unit, target:Unit){
        let dmg = this.createDmg(attacker, target);
        await attacker.beforeDoAtk(this, target, dmg);
        await target.beforeBeAtk(this, attacker, dmg);

        await this.runInner(attacker, target, dmg);

        await attacker.afterDoAtk(this, target, dmg);
        await target.afterBeAtk(this, attacker, dmg);
    }

    async runInner(attacker:Unit, target:Unit, dmg:Dmg){
        await target.doDmg(dmg); 
        this.effect(attacker, target, dmg);
        this.sound();
        await wait();
    }

    createDmg(attacker:Unit, target:Unit):Dmg{
        let dmg = this.type.createDmg(attacker, target);
        dmg.pow.mul = this.mul;
        dmg.hit.base = this.hit;
        return dmg;
    }

    toString(){return this.uniqueName;}
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
}


export namespace Tec{

    //--------------------------------------------------------------------------
    //
    //格闘Active
    //
    //--------------------------------------------------------------------------
    export const                          殴る:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"殴る", info:"一体に格闘攻撃",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1,
        });}
        createDmg(attacker:Unit, target:Unit):Dmg{
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += 1 + Math.random() * 4;
            return dmg;
        }
    }
    /**訓練生. */
    export const                          タックル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"タックル", info:"一体に格闘攻撃x1.5",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1.5, num:1, hit:1, tp:1,
        });}
    }
    /**剣士. */
    export const                          斬る:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"斬る", info:"一体に格闘攻撃x2　反撃有",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:2, num:1, hit:1, tp:1,
        });}
        async run(attacker:Unit, target:Unit){
            await super.run(attacker, target);
            Util.msg.set("＞反撃");
            await Tec.格闘カウンター.run( target, attacker );
        }
    }
    /**訓練生. */
    export const                          大いなる動き:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"大いなる動き", info:"敵全体に格闘攻撃",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, ep:1,
        });}
    }
    /**剣士. */
    export const                          閻魔の笏:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"閻魔の笏", info:"一体に格闘攻撃5回　反撃有",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:5, hit:1, ep:1,
        });}
        async run(attacker:Unit, target:Unit){
            await super.run(attacker, target);
            Util.msg.set("＞反撃");
            await Tec.格闘カウンター.run( target, attacker );
        }
    }
    /**ドラゴン. */
    export const                          龍撃:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"龍撃", info:"一体に格闘攻撃　相手の防御値を半減して計算",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, tp:1,
        });}
        async runInner(attacker:Unit, target:Unit, dmg:Dmg){
            dmg.def.mul *= 0.5;
            await super.runInner(attacker, target, dmg);
        }
    }
    /**ドラゴン. */
    export const                          ドラゴンテイル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ドラゴンテイル", info:"敵全体に格闘攻撃",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, tp:4,
        });}
    }
    /**格闘家. */
    export const                          涅槃寂静:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"涅槃寂静", info:"一体に[力+現在HP]分のダメージの格闘攻撃",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, ep:1,
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = 0;
            dmg.abs.base = attacker.prm(Prm.STR).total + attacker.hp;
            return dmg;
        }
    }
    /**カリストコウモリ. */
    export const                          ひっかく:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ひっかく", info:"一体に格闘攻撃　確率で相手を＜毒＞化　反撃有",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, tp:1,
        });}
        async run(attacker:Unit, target:Unit){
            await super.run(attacker, target);

            if(Math.random() < 0.7){
                await Tec.ポイズンバタフライ.run(attacker, target);
            }

            Util.msg.set("＞反撃");
            await Tec.格闘カウンター.run( target, attacker );
        }
    }
    /**テンプルナイト. */
    export const                          聖剣:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"聖剣", info:"一体に光値を加算して格闘攻撃",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:2, tp:1,
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.abs.base += attacker.prm(Prm.LIG).total;
            return dmg;
        }
    }
    /**侍. */
    export const                          時雨:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"時雨", info:"一体に格闘攻撃x2",
                            sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                            mul:2, num:1, hit:1, tp:2,
        });}
    }
    /**侍. */
    export const                          五月雨:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"五月雨", info:"一体に格闘攻撃2～4回",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, tp:4,
        });}
        rndAttackNum(){return randomInt(2, 4, "[]");}
    }
    /**魔獣ドンゴ. */
    export const                          体当たり:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"体当たり", info:"一体に格闘攻撃x2 確率で相手を＜眠1＞化　反撃有",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:2, num:1, hit:1, tp:2,
        });}
        async run(attacker:Unit, target:Unit){
            await super.run(attacker, target);

            if(Math.random() < 0.7){
                Unit.setCondition( target, Condition.眠, 1 );
            }

            Util.msg.set("＞反撃");
            await Tec.格闘カウンター.run( target, attacker );
        }
    }
    /**月狼. */
    export const                          噛みつく:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"噛みつく", info:"一体に格闘攻撃 MP3とTP1を吸収",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, tp:1,
        });}
        async run(attacker:Unit, target:Unit){
            await super.run(attacker, target);


            Sound.drain.play();
            FX_吸収( attacker.imgCenter, target.imgCenter );

            const drainMP = target.mp < 3 ? target.mp : 3;
            const drainTP = target.tp < 1 ? target.tp : 1;
            target.mp -= drainMP;
            target.tp -= drainTP;
            attacker.mp += drainMP;
            attacker.tp += drainTP;
            Util.msg.set(`MP${drainMP}とTP${drainTP}吸収！`); await wait();            
        }
    }
    /**無習得技. */
    export const                          格闘カウンター:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"格闘カウンター", info:"！カウンター技用",
                              sort:TecSort.格闘, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:0.5, num:1, hit:1,
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.counter = true;
            return dmg;
        }
    }
    //--------------------------------------------------------------------------
    //
    //格闘Passive
    //
    //--------------------------------------------------------------------------
    /**格闘家. */
    export const                         格闘攻撃UP:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"格闘攻撃UP", info:"格闘攻撃x1.2",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                dmg.pow.mul *= 1.2;
            }
        }
    };
    /**格闘家. */
    export const                         格闘防御UP:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"格闘防御UP", info:"被格闘攻撃-20%",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                dmg.pow.mul *= 0.8;
            }
        }
    };
    /**剣士. */
    export const                         パワーファクト:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"パワーファクト", info:"行動開始時力+1%",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            let value = (unit.prm(Prm.STR).base + unit.prm(Prm.STR).eq) * 0.01;
            if(value < 1){value = 1;}
            unit.prm(Prm.STR).battle += value;
        }
    };
    /**ホークマン. */
    export const                         空中浮遊:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"空中浮遊", info:"被格闘攻撃-50%　被銃・弓攻撃命中+50%",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec){
                if(action.type.any(TecType.格闘)){
                    dmg.pow.mul *= 0.5;
                    return;
                }
                if(action.type.any(TecType.銃, TecType.弓)){
                    dmg.hit.mul *= 1.5;
                    return;
                }
            }
        }
    };
    /**未設定. */
    export const                         カウンター:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"カウンター", info:"被格闘攻撃時反撃",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof Tec && action.type.any(TecType.格闘) && !dmg.counter){
                Util.msg.set("＞カウンター"); await wait();
                await Tec.格闘カウンター.run( target, attacker );
            }
        }
    };
    /**忍者. */
    export const                         二刀流:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"二刀流", info:"追加格闘攻撃",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                dmg.additionalAttacks.push((dmg,i)=>{
                    return dmg.result.value / 2;
                });
            }
        }
    };
    export const                         我慢:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"我慢", info:"被格闘・神格・鎖術・銃攻撃-20%",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.神格, TecType.鎖術, TecType.銃)){
                dmg.pow.mul *= 0.80;
            }
        }
    };
    /**侍. */
    export const                         格闘能力UP:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"格闘能力UP", info:"格闘攻撃+20%　被格闘攻撃-20%",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                dmg.pow.mul *= 1.2;
            }
        }
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                dmg.pow.mul *= 0.8;
            }
        }
    };
    /**侍. */
    export const                         格闘連携:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"格闘連携", info:"格闘連携をセットしている味方の格闘攻撃時、連携攻撃",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async memberAfterDoAtk(me:Unit, action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘) && !dmg.counter && attacker.tecs.some(tec=> tec === Tec.格闘連携)){
                Util.msg.set(`${me.name}の連携攻撃`); await wait();
                await Tec.格闘カウンター.run(me, target);
            }
        }
    };
    /**敵:チルナノーグ. */
    export const                         チルナノーグ:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"チルナノーグ", info:"被格闘攻撃-90%",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                Util.msg.set("＞チルナノーグ");
                dmg.pow.mul *= 0.1;
            }
        }
    };
    /**鬼. */
    export const                         渾身:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"渾身", info:"格闘攻撃時、稀にダメージ+50%",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘) && Math.random() < 0.5){
                Util.msg.set("＞渾身");
                dmg.pow.mul *= 1.5;
            }
        }
    };
    /**鬼. */
    export const                         痛恨:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"痛恨", info:"格闘攻撃時、稀にダメージ+100%",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘) && Math.random() < 0.5){
                Util.msg.set("＞痛恨");
                dmg.pow.mul *= 2;
            }
        }
    };
    /**鬼. */
    export const                         修羅:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"修羅", info:"戦闘開始時、力+50% ＜防↓4＞化",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async battleStart(unit:Unit){
            unit.prm(Prm.STR).battle += (unit.prm(Prm.STR).base + unit.prm(Prm.STR).eq) * 0.5;
            Unit.setCondition( unit, Condition.防御低下, 4 );
        }
    };
    /**鬼. */
    export const                         我を忘れる:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"我を忘れる", info:"戦闘開始時、＜暴＞（勝手に格闘攻撃）化",
                                sort:TecSort.格闘, type:TecType.格闘,
        });}
        async battleStart(unit:Unit){
            Unit.setCondition( unit, Condition.暴走, 3, true );
        }
    };
    //--------------------------------------------------------------------------
    //
    //槍Active
    //
    //--------------------------------------------------------------------------
    /**ホークマン. */
    export const                          槍:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"槍", info:"一体に槍攻撃",
                              sort:TecSort.格闘, type:TecType.槍, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, tp:2,
        });}
    }
    //--------------------------------------------------------------------------
    //
    //魔法Active
    //
    //--------------------------------------------------------------------------
    /**魔法使い. */
    export const                          ヴァハ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ヴァハ", info:"一体に魔法攻撃",
                              sort:TecSort.魔法, type:TecType.魔法, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1.2, mp:1,
        });}
    }
    /**魔法使い. */
    export const                          エヴィン:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"エヴィン", info:"一体に魔法攻撃x1.5",
                              sort:TecSort.魔法, type:TecType.魔法, targetings:Targeting.SELECT,
                              mul:1.5, num:1, hit:1.2, mp:2,
        });}
    }
    /**ウィザード. */
    export const                          オグマ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"オグマ", info:"一体に魔法攻撃x2",
                              sort:TecSort.魔法, type:TecType.魔法, targetings:Targeting.SELECT,
                              mul:2, num:1, hit:1.2, mp:4,
        });}
    }
    /**ウィザード. */
    export const                          ルー:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ルー", info:"一体に魔法攻撃x2.5",
                              sort:TecSort.魔法, type:TecType.魔法, targetings:Targeting.SELECT,
                              mul:2.5, num:1, hit:1.2, mp:7,
        });}
    }
    /**未設定. */
    export const                          エヴァ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"エヴァ", info:"一体に暗黒値を加えて魔法攻撃",
                              sort:TecSort.魔法, type:TecType.魔法, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1.2, mp:5,
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.abs.add += attacker.prm(Prm.DRK).total;
            return dmg;
        }
    }
    export const                          ファイアボール:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ファイアボール", info:"一体とその両脇に魔法攻撃",
                              sort:TecSort.魔法, type:TecType.魔法, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1.2, mp:8,
        });}
        async run(attacker:Unit, target:Unit){
            super.run( attacker, target );

            for(const u of target.searchUnits("top","bottom").filter(u=> !u.dead)){
                super.run( attacker, u );
            }
        }
    }
    // export const                          ルー:ActiveTec = new class extends ActiveTec{
    //     constructor(){super({ uniqueName:"ルー", info:"一体に魔法攻撃x3",
    //                           type:TecType.魔法, targetings:Targeting.SELECT,
    //                           mul:3, num:1, hit:1.2, mp:4,
    //     });}
    // }
    /**無習得技. */
    export const                          魔法カウンター:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"魔法カウンター", info:"！カウンター・連携用",
                              sort:TecSort.魔法, type:TecType.魔法, targetings:Targeting.SELECT,
                              mul:0.5, num:1, hit:1,
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.counter = true;
            return dmg;
        }
    }
    //--------------------------------------------------------------------------
    //
    //魔法Passive
    //
    //--------------------------------------------------------------------------
    /**ウィザード. */
    export const                         魔法攻撃UP:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"魔法攻撃UP", info:"魔法攻撃x1.2",
                                sort:TecSort.魔法, type:TecType.魔法,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type === TecType.魔法){
                dmg.pow.mul *= 1.2;
            }
        }
    };
    /**ウィザード. */
    export const                         魔道連携:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"魔道連携", info:"魔道連携をセットしている味方の魔法攻撃時、連携攻撃",
                                sort:TecSort.魔法, type:TecType.魔法,
        });}
        async memberAfterDoAtk(me:Unit, action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.魔法) && !dmg.counter && attacker.tecs.some(tec=> tec === Tec.魔道連携)){
                Util.msg.set(`${me.name}の連携攻撃`); await wait();
                await Tec.魔法カウンター.run(me, target);
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //神格Active
    //
    //--------------------------------------------------------------------------
    /**天使.僧兵. */
    export const                          天籟:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"天籟", info:"一体に神格攻撃 自分を＜雲＞（魔法・暗黒・過去・弓軽減）化",
                              sort:TecSort.神格, type:TecType.神格, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:1,
        });}
        async run(attacker:Unit, target:Unit){
            await super.run(attacker, target);

            Unit.setCondition(attacker, Condition.雲, 1);
        }
    }
    /**僧兵. */
    export const                          光命:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"光命", info:"一体に神格攻撃 相手の暗黒値分ダメージを加える",
                              sort:TecSort.神格, type:TecType.神格, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:4,
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.abs.base += target.prm(Prm.DRK).total;
            return dmg;
        }
    }
    // export const                          光の護封剣:ActiveTec = new class extends ActiveTec{
    //     constructor(){super({ uniqueName:"光の護封剣", info:"一体に神格攻撃　相手を＜攻↓＞化",
    //                           type:TecType.神格, targetings:Targeting.SELECT,
    //                           mul:1, num:1, hit:1, tp:1,
    //     });}
    //     async run(attacker:Unit, target:Unit){
    //         await super.run(attacker, target);

    //         Unit.setCondition(target, Condition.攻撃低下, 1);
    //     }
    // }
    // export const                          プレッシャー:ActiveTec = new class extends ActiveTec{
    //     constructor(){super({ uniqueName:"プレッシャー", info:"一体に神格絶対攻撃x5",
    //                           type:TecType.神格, targetings:Targeting.SELECT,
    //                           mul:5, num:1, hit:1, mp:1, tp:3,
    //     });}
    //     createDmg(attacker:Unit, target:Unit){
    //         const dmg = super.createDmg(attacker, target);
    //         dmg.pow.base = 0;
    //         dmg.abs.base = attacker.prm(Prm.LIG).total * 5;
    //         return dmg;
    //     }
    // }
    // export const                          炎の鞭:ActiveTec = new class extends ActiveTec{
    //     constructor(){super({ uniqueName:"炎の鞭", info:"一体に鎖値を加算した神格攻撃",
    //                           type:TecType.神格, targetings:Targeting.SELECT,
    //                           mul:1, num:1, hit:1, mp:1, tp:1,
    //     });}
    //     createDmg(attacker:Unit, target:Unit){
    //         const dmg = super.createDmg(attacker, target);
    //         dmg.pow.add += attacker.prm(Prm.CHN).total;
    //         return dmg;
    //     }
    // }
    //--------------------------------------------------------------------------
    //
    //神格Passive
    //
    //--------------------------------------------------------------------------
    // export const                         神格攻撃UP:PassiveTec = new class extends PassiveTec{
    //     constructor(){super({uniqueName:"神格攻撃UP", info:"神格攻撃x1.2",
    //                             type:TecType.神格,
    //     });}
    //     beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type.any(TecType.神格)){
    //             dmg.pow.mul *= 1.2;
    //         }
    //     }
    // };
    // export const                         神格防御UP:PassiveTec = new class extends PassiveTec{
    //     constructor(){super({uniqueName:"神格防御UP", info:"被神格攻撃-30%",
    //                             type:TecType.神格,
    //     });}
    //     beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type.any(TecType.神格)){
    //             dmg.pow.mul *= 0.7;
    //         }
    //     }
    // };
    // export const                         神の見えざる手:PassiveTec = new class extends PassiveTec{
    //     constructor(){super({uniqueName:"神の見えざる手", info:"神格攻撃ダメージ＋",
    //                             type:TecType.神格,
    //     });}
    //     beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type.any(TecType.神格)){
    //             dmg.abs.add += attacker.prm(Prm.LIG).total;
    //         }
    //     }
    // };
    //--------------------------------------------------------------------------
    //
    //暗黒Active
    //
    //--------------------------------------------------------------------------
    export const                          暗黒剣:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"暗黒剣", info:"一体に暗黒攻撃　攻撃後反動ダメージ",
                              sort:TecSort.暗黒, type:TecType.暗黒, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1,
        });}
        async run(attacker:Unit, target:Unit){
            await super.run(attacker, target);

            Util.msg.set("＞反動");
            const cdmg = new Dmg({
                            absPow:target.prm(Prm.LIG).total + target.prm(Prm.LV).total * 0.1 + 1,
                            counter:true,
                        });
            FX_格闘( attacker.imgCenter );
            await attacker.doDmg(cdmg); await wait();
        }
    }
    export const                          吸血:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"吸血", info:"相手からHPを吸収　暗黒依存",
                              sort:TecSort.暗黒, type:TecType.暗黒, targetings:Targeting.SELECT,
                              mul:0.5, num:1, hit:1.1, mp:2,
        });}
        sound(){Sound.drain.play();}
        effect(attacker:Unit, target:Unit, dmg:Dmg){FX_吸収(target.imgCenter, attacker.imgCenter);}
        async runInner(attacker:Unit, target:Unit, dmg:Dmg){
            await super.runInner(attacker, target, dmg);

            if(dmg.result.isHit){
                attacker.hp += dmg.result.value;
            }
        }
    }
    export const                          VAMPIRE_VLOODY_STAR:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"VAMPIRE_VLOODY_STAR", info:"敵全体からHPを吸収　暗黒依存",
                              sort:TecSort.暗黒, type:TecType.暗黒, targetings:Targeting.SELECT,
                              mul:0.5, num:1, hit:1.1, ep:1,
        });}
        toString(){return "VAMPIRE VLOODY STAR";}
        async run(attacker:Unit, target:Unit){
            await Tec.吸血.run(attacker, target);
        }
    }
    //--------------------------------------------------------------------------
    //
    //暗黒Passive
    //
    //--------------------------------------------------------------------------
    export const                         衝動:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"衝動", info:"防御値-10%　行動開始時、暗黒+5",
                                sort:TecSort.暗黒, type:TecType.暗黒,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            dmg.def.mul *= 0.9;
        }
        async phaseStart(u:Unit, pForce:PhaseStartForce){
            u.prm(Prm.DRK).battle += 5;
        }
    };
    export const                         宵闇:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"宵闇", info:"暗黒攻撃+100%　最大HP-50%",
                                sort:TecSort.暗黒, type:TecType.暗黒,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.暗黒)){
                dmg.pow.mul *= 2;
            }
        }
        async equip(u:Unit){
            u.prm(Prm.MAX_HP).eq -= u.prm(Prm.MAX_HP).base * 0.5;
        }
    };
    // export const                         天秤:PassiveTec = new class extends PassiveTec{
    //     constructor(){super({uniqueName:"天秤", info:"自分と相手の暗黒値に応じて与・被ダメージが増減　高い側に有利に働く",
    //                             type:TecType.暗黒,
    //     });}
    //     beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type.any( TecType.暗黒 )){
    //             let mul = 1 + attacker.prm(Prm.DRK).total / target.prm(Prm.DRK).total * 0.05;
    //             if(mul < 0.5){mul = 0.5;}
    //             if(mul > 1.5){mul = 1.5;}
    //             dmg.pow.mul *= mul;
    //         }
    //     }
    //     beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type.any( TecType.暗黒 )){
    //             let mul = 1 + target.prm(Prm.DRK).total / attacker.prm(Prm.DRK).total * 0.05;
    //             if(mul < 0.5){mul = 0.5;}
    //             if(mul > 1.5){mul = 1.5;}
    //             dmg.pow.mul *= mul;
    //         }
    //     }
    // };
    //--------------------------------------------------------------------------
    //
    //怨霊Active
    //
    //--------------------------------------------------------------------------
    /**霊術戦士. */
    export const                          鎌:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"鎌", info:"一体に怨霊攻撃 怨霊-10% -怨霊使い-をセットしている必要がある",
                              sort:TecSort.暗黒, type:TecType.怨霊, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:1,
        });}
        async run(attacker:Unit, target:Unit){
            super.run(attacker, target);
            attacker.prm(Prm.GHOST).base *= 0.9;
        }
    }
    /**落武者. */
    export const                          武者鎌:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"武者鎌", info:"一体に怨霊攻撃x2 怨霊使いのセットが必要",
                              sort:TecSort.暗黒, type:TecType.怨霊, targetings:Targeting.SELECT,
                              mul:2, num:1, hit:1, tp:1,
        });}
        async run(attacker:Unit, target:Unit){
            super.run(attacker, target);
            attacker.prm(Prm.GHOST).base *= 0.9;
        }
    }
    /**敵:霊術戦士. */
    export const                          死神の鎌:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"死神の鎌", info:"一体のHPを1にする",
                              sort:TecSort.暗黒, type:TecType.怨霊, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:10,
        });}
        async run(attacker:Unit, target:Unit){
            FX_PetDie( target.imgCenter );
            FX_暗黒( target.imgCenter );
            FX_RotateStr(Font.def, "HP=1", target.imgCenter, Color.WHITE);
            Sound.DARK.play();
            target.hp = 1;
        }
    }
    /**落武者. */
    export const                          成仏:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"成仏", info:"自分の怨霊値の10%分のダメージを敵に与える HP=0 怨霊使いのセットが必要",
                              sort:TecSort.暗黒, type:TecType.怨霊, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, ep:1,
        });}
        createDmg(attacker:Unit, target:Unit){
            if(!attacker.tecs.some(tec=> tec === Tec.怨霊使い)){
                return new Dmg({absPow:attacker.ghost * 0.01});
            }
            return new Dmg({absPow:attacker.ghost * 0.1});
        }
        async use(attacker:Unit, targets:Unit[]){
            const canUse = this.checkCost(attacker);
            super.use(attacker, targets);

            if(canUse){
                attacker.hp = 0;
                attacker.ghost *= 0.9;
            }
        }
        async run(attacker:Unit, target:Unit){
            const value = attacker.tecs.some(tec=> tec === Tec.怨霊使い) 
                            ? attacker.ghost * 0.1 
                            : attacker.ghost * 0.01
                            ;
            target.hp -= value;
            FX_RotateStr(Font.def, ""+value, target.imgCenter, Color.WHITE);
        }
    }
    //--------------------------------------------------------------------------
    //
    //怨霊Passive
    //
    //--------------------------------------------------------------------------
    /**霊術戦士. */
    export const                         怨霊使い:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"怨霊使い", info:"倒した相手のHPを怨霊として吸収できるようになる 行動開始時、HP-<怨霊値÷500+1>",
                                sort:TecSort.暗黒, type:TecType.怨霊,
        });}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            const value = unit.ghost / 500 + 1
            FX_RotateStr(Font.def, `${value}`, unit.imgCenter, Color.WHITE);

            unit.hp -= value;
        }
        async whenAnyoneDead(me:Unit, deadUnit:Unit){
            if(me.isFriend( deadUnit )){return;}
            if(Battle.getPhaseUnit() !== me){return;}

            const value = deadUnit.prm(Prm.MAX_HP).total * 0.334;
            me.ghost += value;

            deadUnit.prm(Prm.MAX_HP).battle -= value;
        }
    };
    /**霊術戦士. */
    export const                         怨霊回復:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"怨霊回復", info:"行動開始時怨霊+20",
                                sort:TecSort.暗黒, type:TecType.怨霊,
        });}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            unit.ghost += 20;
        }
    };
    /**落武者. */
    export const                         怨霊回復3:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"怨霊回復3", info:"行動開始時怨霊+50 HP-5%",
                                sort:TecSort.暗黒, type:TecType.怨霊,
        });}
        toString(){return "怨霊回復Ⅲ";}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            unit.ghost += 50;
            const value = unit.prm(Prm.MAX_HP).total * 0.05;
            unit.hp -= value;
            FX_RotateStr(Font.def, ""+value, unit.imgCenter, Color.WHITE);
        }
    };
    /**落武者. */
    export const                         アンデッド:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"アンデッド", info:"死亡時、4ターン後に生き返る",
                                sort:TecSort.暗黒, type:TecType.怨霊,
        });}
        async whenDead(unit:Unit){
            let turnCount = 4;
            unit.addInvisibleCondition(new class extends InvisibleCondition{
                readonly uniqueName = Tec.アンデッド.uniqueName;
                async phaseStart(u:Unit){
                    u.removeInvisibleCondition(this);
                }
                async deadPhaseStart(u:Unit){
                    if(!u.dead){return;}

                    if(--turnCount <= 0){
                        u.dead = false;
                        u.hp = 1;
                        FX_回復( u.imgCenter );
                        Util.msg.set(`${u.name}は生き返った！`); await wait();
                        u.removeInvisibleCondition(this);
                    }else{
                        Util.msg.set(`${u.name}蘇りまで残り${turnCount}ターン...`); await wait();
                    }
                }
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //鎖術Active
    //
    //--------------------------------------------------------------------------
    /**鎖使い. */
    export const                          スネイク:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"スネイク", info:"全体に鎖術攻撃",
                              sort:TecSort.鎖術, type:TecType.鎖術, targetings:Targeting.ALL,
                              mul:1, num:1, hit:0.8, tp:1,
        });}
    }
    export const                          ホワイトスネイク:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ホワイトスネイク", info:"一体に鎖術攻撃x2",
                              sort:TecSort.鎖術, type:TecType.鎖術, targetings:Targeting.SELECT,
                              mul:2, num:1, hit:0.85, tp:2,
        });}
    }
    //--------------------------------------------------------------------------
    //
    //過去Active
    //
    //--------------------------------------------------------------------------
    /**ダウザー. */
    export const                          念力:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"念力", info:"全体に過去攻撃",
                              sort:TecSort.過去, type:TecType.過去, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1.2, mp:6,
        });}
    }
    /**ダウザー. */
    export const                          念:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"念", info:"ランダムな一体に過去攻撃",
                              sort:TecSort.過去, type:TecType.過去, targetings:Targeting.RANDOM,
                              mul:1, num:1, hit:1.2, mp:1,
        });}
    }
    //--------------------------------------------------------------------------
    //
    //過去Passive
    //
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //
    //銃Active
    //
    //--------------------------------------------------------------------------
    /**カウボーイ. */
    export const                          撃つ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"撃つ", info:"ランダムに銃攻撃1～2回",
                    　        sort:TecSort.銃, type:TecType.銃, targetings:Targeting.RANDOM,
                              mul:0.9, num:1, hit:0.8,
        });}
        rndAttackNum():number{return randomInt(1,2,"[]");}
    }
    /**魔砲士. */
    export const                          乱射:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"乱射", info:"ランダムに3回銃攻撃",
                              sort:TecSort.銃, type:TecType.銃, targetings:Targeting.RANDOM,
                              mul:0.9, num:3, hit:0.8, tp:3,
        });}
    }
    /**カウボーイ. */
    export const                          弐丁拳銃:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"弐丁拳銃", info:"一体に2回銃攻撃",
                              sort:TecSort.銃, type:TecType.銃, targetings:Targeting.SELECT,
                              mul:0.9, num:2, hit:0.8, tp:1,
        });}
    }
    /**カウボーイ. */
    export const                          あがらない雨:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"あがらない雨", info:"敵全体に銃攻撃",
                              sort:TecSort.銃, type:TecType.銃, targetings:Targeting.ALL,
                              mul:0.9, num:1, hit:0.8, ep:1,
        });}
    }
    /**魔砲士. */
    export const                          羊飼いの銃:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"羊飼いの銃", info:"魔値x2を加えてランダムに銃攻撃1～2回",
                              sort:TecSort.銃, type:TecType.銃, targetings:Targeting.RANDOM,
                              mul:0.9, num:1, hit:0.8, mp:3, item:()=>[[Item.魔弾, 2]],
        });}
        rndAttackNum():number{return randomInt(1,2,"[]");}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.MAG).total * 2;
            return dmg;
        }
    }
    /**魔砲士. */
    export const                          大砲:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"大砲", info:"一体に銃攻撃x2",
                              sort:TecSort.銃, type:TecType.銃, targetings:Targeting.RANDOM,
                              mul:2, num:1, hit:0.8, tp:1, item:()=>[[Item.砲弾, 1]],
        });}
    }
    //--------------------------------------------------------------------------
    //
    //銃Passive
    //
    //--------------------------------------------------------------------------
    /**魔砲士. */
    export const                         魔砲:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"魔砲", info:"銃攻撃に現在MP値を加える 行動開始時MP-2",
                                sort:TecSort.銃, type:TecType.機械,
        });}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            unit.mp -= 2;
        }
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃)){
                dmg.pow.add += attacker.mp;
            }
        }
    };
    /**霊弾の射手. */
    export const                         霊砲:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"霊砲", info:"銃攻撃に怨霊値の5%を加える 銃攻撃時、怨霊-5% 怨霊使いのセットが必要 霊弾-1(持っていなかった場合、発動しない)",
                                sort:TecSort.銃, type:TecType.銃,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃) && Item.霊弾.remainingUseNum > 0 && attacker.tecs.some(tec=> tec === Tec.怨霊使い)){
                Item.霊弾.remainingUseNum--;
                const value = attacker.ghost * 0.05;
                dmg.pow.add += value;
                attacker.ghost -= value;
            }
        }
    };
    /**霊弾の射手. */
    export const                         銃痕:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"銃痕", info:"銃攻撃時、相手の弓の5%を吸収",
                                sort:TecSort.銃, type:TecType.銃,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃)){
                const value = target.prm(Prm.ARR).total * 0.05;
                dmg.pow.add += value;
                target.prm(Prm.ARR).battle -= value;
            }
        }
    };
    /**霊弾の射手. */
    export const                         暗黒砲:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"暗黒砲", info:"銃攻撃に暗黒値を加算 銃攻撃時、HP-5%",
                                sort:TecSort.銃, type:TecType.銃,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃)){
                dmg.pow.add += attacker.prm(Prm.GUN).total;
                
                const value = attacker.prm(Prm.MAX_HP).total * 0.05;
                FX_Str(Font.def, ""+value, attacker.imgCenter, Color.WHITE);
                attacker.hp -= value;
            }
        }
    };
    /**霊弾の射手. */
    export const                         ブラッドブレッド:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"ブラッドブレッド", info:"銃攻撃後、与えたダメージの1%をHPとして吸収",
                                sort:TecSort.銃, type:TecType.銃,
        });}
        async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃)){
                const value = dmg.result.value * 0.01;
                Unit.healHP( attacker, value );
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //機械Active
    //
    //--------------------------------------------------------------------------
    export const                          レーザー:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"レーザー", info:"一体とその両脇に機械攻撃",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1.1, tp:1, item:()=>[[Item.バッテリー, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            super.run( attacker, target );

            for(const u of target.searchUnits("top","bottom")){
                super.run( attacker, u );
            }
        }
    }
    export const                          メガトン:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"メガトン", info:"一体に力x2を加えて機械攻撃",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1.1, tp:3,
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.STR).total;
            dmg.abs.base += attacker.prm(Prm.STR).total;
            return dmg;
        }
    }
    /**雷鳥. */
    export const                          雷撃:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"雷撃", info:"一体に機械攻撃x1.5",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                              mul:1.5, num:1, hit:1.1, mp:2,
        });}
    }
    /**ロボット. */
    export const                          ショック:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ショック", info:"一体に機械攻撃",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1.1,
        });}
    }
    /**ロボット. */
    export const                          バベル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"バベル", info:"敵全体に機械攻撃",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1.1, mp:1, tp:1, item:()=>[[Item.パワータンク, 4]],
        });}
    }
    /**ミサイリスト. */
    export const                          林式ミサイルう:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"林式ミサイルう", info:"次の行動時、一体に力値を加えた機械攻撃x6",
                              sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                              mul:3, num:1, hit:1.1, item:()=>[[Item.林式ミサイル, 1]],
        });}
        
        inner:ActiveTec = new class extends ActiveTec{
            constructor(){super({ uniqueName:"林式ミサイルうinner", info:"",
                        　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                                  mul:6, num:1, hit:1.1,
            });}
            createDmg(attacker:Unit, target:Unit){
                const dmg = super.createDmg(attacker, target);
                dmg.pow.base += attacker.prm(Prm.STR).total;
                return dmg;
            }
            sound(){Sound.bom2.play();}
            effect(attacker:Unit, target:Unit, dmg:Dmg){FX_ナーガ着弾(attacker.imgCenter, target.imgCenter);}
        }

        async run(attacker:Unit, target:Unit){
            const tec = this;
            attacker.addInvisibleCondition(new class extends InvisibleCondition{
                readonly uniqueName = tec.uniqueName;
                async phaseStart(u:Unit){
                    if(target.dead){
                        attacker.removeInvisibleCondition(this);
                        return;
                    }
                    Util.msg.set("空からミサイルが降り注ぐ！"); await wait();

                    tec.inner.run(attacker, target);

                    attacker.removeInvisibleCondition(this);
                }
            });

            FX_ナーガ(attacker.imgCenter, target.imgCenter);
            Sound.ya.play();
            Util.msg.set(`${attacker.name}はミサイルを打ち上げた`); await wait();
        }
    }
    /**ミサイリスト. */
    export const                          エボリ製悪魔のミサイル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"エボリ製悪魔のミサイル", info:"次の行動時、一体に鎖値を加えた機械攻撃x6",
                              sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                              mul:3, num:1, hit:1.1, item:()=>[[Item.エボリ製悪魔のミサイル, 1]],
        });}
        
        inner:ActiveTec = new class extends ActiveTec{
            constructor(){super({ uniqueName:"エボリ製悪魔のミサイルinner", info:"",
                                  sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                                  mul:6, num:1, hit:1.1,
            });}
            createDmg(attacker:Unit, target:Unit){
                const dmg = super.createDmg(attacker, target);
                dmg.pow.base += attacker.prm(Prm.CHN).total;
                return dmg;
            }
            sound(){Sound.bom2.play();}
            effect(attacker:Unit, target:Unit, dmg:Dmg){FX_ナーガ着弾(attacker.imgCenter, target.imgCenter);}
        }

        async run(attacker:Unit, target:Unit){
            const tec = this;
            attacker.addInvisibleCondition(new class extends InvisibleCondition{
                readonly uniqueName = tec.uniqueName;
                async phaseStart(u:Unit){
                    if(target.dead){
                        attacker.removeInvisibleCondition(this);
                        return;
                    }
                    Util.msg.set("空からミサイルが降り注ぐ！"); await wait();

                    tec.inner.run(attacker, target);

                    attacker.removeInvisibleCondition(this);
                }
            });

            FX_ナーガ(attacker.imgCenter, target.imgCenter);
            Sound.ya.play();
            Util.msg.set(`${attacker.name}はミサイルを打ち上げた`); await wait();
        }
    }
    /**ミサイリスト. */
    export const                          メフィスト製悪魔のミサイル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"メフィスト製悪魔のミサイル", info:"次の行動時、一体に過去値を加えた機械攻撃x6",
                              sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                              mul:9, num:1, hit:1.1, item:()=>[[Item.メフィスト製悪魔のミサイル, 1]],
        });}
        
        inner:ActiveTec = new class extends ActiveTec{
            constructor(){super({ uniqueName:"メフィスト製悪魔のミサイルinner", info:"",
                        　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.SELECT,
                                  mul:6, num:1, hit:1.1,
            });}
            createDmg(attacker:Unit, target:Unit){
                const dmg = super.createDmg(attacker, target);
                dmg.pow.base += attacker.prm(Prm.PST).total;
                return dmg;
            }
            sound(){Sound.bom2.play();}
            effect(attacker:Unit, target:Unit, dmg:Dmg){FX_ナーガ着弾(attacker.imgCenter, target.imgCenter);}
        }

        async run(attacker:Unit, target:Unit){
            const tec = this;
            attacker.addInvisibleCondition(new class extends InvisibleCondition{
                readonly uniqueName = tec.uniqueName;
                async phaseStart(u:Unit){
                    if(target.dead){
                        attacker.removeInvisibleCondition(this);
                        return;
                    }
                    Util.msg.set("空からミサイルが降り注ぐ！"); await wait();

                    tec.inner.run(attacker, target);

                    attacker.removeInvisibleCondition(this);
                }
            });

            FX_ナーガ(attacker.imgCenter, target.imgCenter);
            Sound.ya.play();
            Util.msg.set(`${attacker.name}はミサイルを打ち上げた`); await wait();
        }
    }
    /**軍人. */
    export const                          原子爆弾:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"原子爆弾", info:"敵全体に魔値を加えた機械攻撃",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1.1, item:()=>[[Item.原子爆弾, 1]],
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.MAG).total;
            return dmg;
        }
    }
    /**軍人. */
    export const                          水素爆弾:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"水素爆弾", info:"敵全体に光値を加えた機械攻撃",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1.1, item:()=>[[Item.水素爆弾, 1]],
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.LIG).total;
            return dmg;
        }
    }
    /**軍人. */
    export const                          重力子爆弾:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"重力子爆弾", info:"敵全体に闇値を加えた機械攻撃",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1.1, item:()=>[[Item.重力子爆弾, 1]],
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.DRK).total;
            return dmg;
        }
    }
    /**軍人. */
    export const                          lucifer製量子爆弾:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"lucifer製量子爆弾", info:"敵全体に弓値を加えた機械攻撃",
                    　        sort:TecSort.銃, type:TecType.機械, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1.1, item:()=>[[Item.lucifer製量子爆弾, 1]],
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.ARR).total;
            return dmg;
        }
    }
    //--------------------------------------------------------------------------
    //
    //機械Passive
    //
    //--------------------------------------------------------------------------
    /**機械士. */
    export const                         機械仕掛け:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"機械仕掛け", info:"毎ターン銃+1%",
                                sort:TecSort.銃, type:TecType.機械,
        });}
        async phaseEnd(unit:Unit){
            unit.prm(Prm.GUN).battle += unit.prm(Prm.GUN).base * 0.01 + 1;
        }
    };
    /**機械士. */
    export const                         増幅回路:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"増幅回路", info:"機械攻撃+20%",
                                sort:TecSort.銃, type:TecType.機械,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.機械)){
                dmg.pow.mul *= 1.2;
            }
        }
    };
    /**機械士. */
    export const                         トマホーク:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"トマホーク", info:"機械攻撃+20%",
                                sort:TecSort.銃, type:TecType.機械,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.機械)){
                dmg.pow.mul *= 1.2;
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //弓Active
    //
    //--------------------------------------------------------------------------
    /**アーチャー. */
    export const                          射る:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"射る", info:"一体に弓攻撃",
                              sort:TecSort.弓, type:TecType.弓, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:0.85,
        });}
    }
    /**アーチャー. */
    export const                          アスラの矢:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"アスラの矢", info:"全体に弓攻撃",
                              sort:TecSort.弓, type:TecType.弓, targetings:Targeting.ALL,
                              mul:1, num:1, hit:0.85, ep:1,
        });}
    }
    /**忍者. */
    export const                          手裏剣:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"手裏剣", info:"ランダムに2～3回弓攻撃",
                              sort:TecSort.弓, type:TecType.弓, targetings:Targeting.RANDOM,
                              mul:1, num:1, hit:0.8, tp:2,
        });}
        rndAttackNum(){return randomInt(2,3,"[]");}
    }
    /**クピド. */
    export const                          ヤクシャ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ヤクシャ", info:"一体に2回弓攻撃",
                              sort:TecSort.弓, type:TecType.弓, targetings:Targeting.RANDOM,
                              mul:1, num:2, hit:0.8, tp:1, item:()=>[[Item.夜叉の矢, 2]],
        });}
    }
    /**クピド. */
    export const                          ナーガ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ナーガ", info:"次の行動時、敵全体に弓攻撃",
                              sort:TecSort.弓, type:TecType.弓, targetings:Targeting.ALL,
                              mul:1, num:1, hit:0.8, tp:2, item:()=>[[Item.降雨の矢, 4]],
        });}
        
        inner:ActiveTec = new class extends ActiveTec{
            constructor(){super({ uniqueName:"ナーガinner", info:"",
                                  sort:TecSort.弓, type:TecType.弓, targetings:Targeting.SELECT,
                                  mul:1, num:1, hit:0.8,
            });}
            effect(attacker:Unit, target:Unit, dmg:Dmg){FX_ナーガ着弾(attacker.imgCenter, target.imgCenter);}
        };

        async use(attacker:Unit, fakeTargets:Unit[]){
            const canUse = this.checkCost(attacker);
            
            await super.use(attacker, fakeTargets);

            if(canUse){
                const tec = this;
                attacker.addInvisibleCondition(new class extends InvisibleCondition{
                    readonly uniqueName = Tec.ナーガ.uniqueName;
                    async phaseStart(u:Unit){
                        Util.msg.set("空から矢が降り注ぐ！"); await wait();

                        const realTargets = Targeting.filter(tec.targetings, attacker, Unit.all, tec.rndAttackNum());
                        realTargets.filter(t=> t.exists && !t.dead)
                            .forEach(t=>{
                                tec.inner.run(attacker, t);
                            });

                        attacker.removeInvisibleCondition(this);
                    }
                });

                for(const t of fakeTargets){
                    FX_ナーガ(attacker.imgCenter, t.imgCenter);
                }
                Sound.ya.play();
                Util.msg.set(`${attacker.name}は空高く矢を放った`); await wait();
            }
        }
        async run(attacker:Unit, target:Unit){}
    }
    /**クピド. */
    export const                          ガルダ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ガルダ", info:"一体に弓攻撃x2",
                              sort:TecSort.弓, type:TecType.弓, targetings:Targeting.SELECT,
                              mul:2, num:1, hit:0.8, tp:1, item:()=>[[Item.金翅鳥の矢, 1]],
        });}
    }
    /**クピド. */
    export const                          キンナラ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"キンナラ", info:"次の行動時、ランダムに6回弓攻撃",
                              sort:TecSort.弓, type:TecType.弓, targetings:Targeting.SELF,
                              mul:1, num:1, hit:0.8, tp:2, item:()=>[[Item.歌舞の矢, 6]],
        });}

        inner:ActiveTec = new class extends ActiveTec{
            constructor(){super({ uniqueName:"キンナラinner", info:"",
                                  sort:TecSort.弓, type:TecType.弓, targetings:Targeting.SELECT,
                                  mul:1, num:1, hit:0.8,
            });}
            effect(attacker:Unit, target:Unit, dmg:Dmg){FX_ナーガ着弾(attacker.imgCenter, target.imgCenter);}
        };

        async use(attacker:Unit, fakeTargets:Unit[]){
            const canUse = this.checkCost(attacker);
            
            await super.use(attacker, fakeTargets);

            if(canUse){
                const tec = this;
                attacker.addInvisibleCondition(new class extends InvisibleCondition{
                    readonly uniqueName = Tec.キンナラ.uniqueName;
                    async phaseStart(u:Unit){
                        Util.msg.set("空から矢が降り注ぐ！"); await wait();

                        const realTargets = Targeting.filter(tec.targetings, attacker, Unit.all, tec.rndAttackNum());
                        realTargets.filter(t=> t.exists && !t.dead)
                            .forEach(t=>{
                                tec.inner.run(attacker, t);
                            });

                        attacker.removeInvisibleCondition(this);
                    }
                });

                for(const t of fakeTargets){
                    FX_ナーガ(attacker.imgCenter, t.imgCenter);
                }
                Sound.ya.play();
                Util.msg.set(`${attacker.name}は空高く矢を放った`); await wait();
            }
        }
        async run(attacker:Unit, target:Unit){}
    }
    /**月弓子. */
    export const                          キャンドラ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"キャンドラ", info:"一体に弓攻撃x10",
                              sort:TecSort.弓, type:TecType.弓, targetings:Targeting.SELECT,
                              mul:1, num:10, hit:0.8, ep:1, item:()=>[[Item.月夜の矢, 1]],
        });}
    }
    //--------------------------------------------------------------------------
    //
    //弓Passive
    //
    //--------------------------------------------------------------------------
    export const                         一点集中:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"一点集中", info:"弓攻撃+20%",
                                sort:TecSort.弓, type:TecType.弓,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.弓)){
                dmg.pow.mul *= 1.2;
            }
        }
    };
    export const                         中庸の悟り:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"中庸の悟り", info:"弓攻撃時、MP+3・TP+1",
                                sort:TecSort.弓, type:TecType.弓,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.弓)){
                Unit.healMP( attacker, 3 );
                Unit.healTP( attacker, 1 );
            }
        }
    };
    export const                         摩喉羅我:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"摩喉羅我", info:"弓攻撃に暗黒を加算、行動開始時HP-5%",
                                sort:TecSort.弓, type:TecType.弓,
        });}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            const value = unit.prm(Prm.MAX_HP).total * 0.05;
            FX_RotateStr(Font.def, `${value}`, unit.imgCenter, Color.WHITE);
            unit.hp -= value;
        }
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.弓)){
                dmg.pow.add += attacker.prm(Prm.DRK).total;
            }
        }
    };
    export const                         乾闥婆:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"乾闥婆", info:"弓攻撃時、相手の弓値の5%を吸収",
                                sort:TecSort.弓, type:TecType.弓,
        });}
        async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.弓)){
                const value = target.prm(Prm.ARR).total * 0.05;
                target.prm(Prm.ARR).battle -= value;
                attacker.prm(Prm.ARR).battle += value;
                FX_RotateStr(Font.def, `弓+${value}`, attacker.imgCenter, Color.WHITE);
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //強化Active
    //
    //--------------------------------------------------------------------------
    export const                          練気:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"練気", info:"自分を＜練＞（格闘・神格・鎖術・銃攻撃UP）化",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1,
        });}
        async run(attacker:Unit, target:Unit){
            if(!target.hasCondition(Condition.練)){
                Sound.up.play();
                Unit.setCondition( target, Condition.練, 1 ); await wait();
            }else if(target.getConditionValue(Condition.練) > 0){
                let limit = target.prm(Prm.LV).total / 50 + 1;
                if(limit > 4){limit = 4;}
                let value = target.getConditionValue(Condition.練) + 1;
                value = value <= limit ? value : limit;
                
                Sound.up.play();
                FX_Buff( target.imgCenter );
                Unit.setCondition( target, Condition.練, value, true ); await wait();
            }

        }
    }
    export const                          癒しの風:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"癒しの風", info:"一体を<癒10>(毎ターン回復)状態にする",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:1,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.up.play();
            Unit.setCondition(target, Condition.癒, 10); await wait();
        }
    }
    export const                          光合成:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"光合成", info:"一体を<治10>(毎ターン強回復)状態にする",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:6,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.up.play();
            FX_Buff( target.imgCenter );
            Unit.setCondition(target, Condition.治, 10); await wait();
        }
    }
    export const                          セル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"セル", info:"自分を＜吸収＞状態にする",
                            　sort:TecSort.強化, type:TecType.状態, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:1, tp:1,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.up.play();
            FX_Buff( target.imgCenter );
            Unit.setCondition( target, Condition.吸収, 1 ); await wait();
        }
    }
    /**シーフ. */
    export const                          風:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"風", info:"味方全員を＜回避2＞（回避UP）状態にする",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, ep:1,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.up.play();
            FX_Buff( target.imgCenter );
            Unit.setCondition( target, Condition.回避, 2 ); await wait();
        }
    }
    /**格闘家. */
    export const                          防御:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"防御", info:"自分を＜盾＞（一部攻撃軽減）化",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1,
        });}
        async run(attacker:Unit, target:Unit){
            let value = 1;
            if(attacker.prm(Prm.LIG).total >= 25){value++;}
            if(attacker.prm(Prm.LIG).total >= 50){value++;}
            Sound.up.play();
            FX_Buff( target.imgCenter );
            Unit.setCondition( target, Condition.盾, value ); await wait();
        }
    }
    /**テンプルナイト. */
    export const                          聖なる守護:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"聖なる守護", info:"味方全体を＜盾＞化",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:4,
        });}
        async run(attacker:Unit, target:Unit){
            Tec.防御.run(attacker, target);
        }
    }
    /**鎖使い. */
    export const                          アンドロメダ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"アンドロメダ", info:"味方全員の防御値+20%　重ねがけ不可",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, ep:1,
        });}
        async run(attacker:Unit, target:Unit){
            if(!target.getInvisibleConditions().some(inv=> inv.uniqueName === Tec.アンドロメダ.uniqueName)){
                target.addInvisibleCondition(new class extends InvisibleCondition{
                    readonly uniqueName = Tec.アンドロメダ.uniqueName;
                    async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
                        if(action instanceof ActiveTec){
                            dmg.def.mul *= 1.2;
                        }
                    }
                });
                Sound.seikou.play();
                FX_Buff( target.imgCenter );
                Util.msg.set(`${target.name}は頑丈になった！`, Color.WHITE.bright); await wait();
            }
        }
    }
    /**ガーディアン. */
    export const                          ガブリエル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ガブリエル", info:"一体を＜格闘・鎖術無効5＞状態にする",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:6, item:()=>[[Item.聖水, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            Sound.up.play();
            FX_Buff( target.imgCenter );
            Unit.setCondition( target, Condition.格鎖無効, 5 );
        }
    }
    /**ガーディアン. */
    export const                          ラファエル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ラファエル", info:"一体を＜魔法・過去無効5＞状態にする",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:6, item:()=>[[Item.聖水, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            Sound.up.play();
            FX_Buff( target.imgCenter );
            Unit.setCondition( target, Condition.魔過無効, 5 );
        }
    }
    /**ガーディアン. */
    export const                          ウリエル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ウリエル", info:"一体を＜銃・弓無効5＞状態にする",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:6, item:()=>[[Item.聖水, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            Sound.up.play();
            FX_Buff( target.imgCenter );
            Unit.setCondition( target, Condition.銃弓無効, 5 );
        }
    }
    /**チルナノーグ. */
    export const                          スモッグ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"スモッグ", info:"味方全体を＜雲3＞状態にする",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:5,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.up.play();
            FX_Buff( target.imgCenter );
            Unit.setCondition( target, Condition.雲, 3 );
        }
    }
    /**勇者. */
    export const                          さよならみんな:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"さよならみんな", info:"味方全体を＜約＞化 自分の状態解除 自分のHP=0",
                              sort:TecSort.強化, type:TecType.状態, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:5,
        });}
        toString(){return "さよなら、みんな";}
        async use(attacker:Unit, targets:Unit[]){
            const canUse = this.checkCost(attacker);
            if(canUse){
                FX_PetDie( attacker.imgCenter );
                Sound.sin.play();
            }
            super.use( attacker, targets );
            if(canUse){
                Sound.KAIFUKU.play();
                for(const type of ConditionType.goodConditions()){
                    attacker.removeCondition(type);
                }
                attacker.hp = 0;
            }
        }
        async run(attacker:Unit, target:Unit){
            FX_回復( target.imgCenter );
            Unit.setCondition( target, Condition.約束, 1 );
        }
    }
    //--------------------------------------------------------------------------
    //
    //強化Passive
    //
    //--------------------------------------------------------------------------
    export const                         毒吸収:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"毒吸収", info:"＜毒＞を吸収する",
                                sort:TecSort.強化, type:TecType.状態,
        });}
        async phaseEnd(unit:Unit){
            if(unit.hasCondition(Condition.毒)){
                const value = unit.getConditionValue(Condition.毒);
                Unit.healHP(unit, value);
                unit.removeCondition(Condition.毒);
            }
        }
    };
    /**カウボーイ. */
    export const                         スコープ:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"スコープ", info:"銃・弓・機械攻撃命中率+10%",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.機械, TecType.銃, TecType.弓)){
                dmg.hit.mul *= 1.1;
            }
        }
    };
    /**シーフ. */
    export const                         回避UP:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"回避UP", info:"格闘・銃・弓攻撃回避UP",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.銃, TecType.弓)){
                dmg.hit.mul *= 0.9;
            }
        }
    };
    /**アメーバ. */
    export const                         被膜:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"被膜", info:"被魔法・神格・過去攻撃-20%",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.神格, TecType.過去)){
                dmg.pow.mul *= 0.8;
            }
        }
    };
    /**ロボット. */
    export const                         メタルボディ:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"メタルボディ", info:"被銃・弓攻撃-50%",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃, TecType.弓)){
                dmg.pow.mul *= 0.5;
            }
        }
    };
    /**チルナノーグ. */
    export const                         雲隠れ:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"雲隠れ", info:"魔法・神格・過去回避率+15%",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.神格, TecType.過去)){
                dmg.hit.mul *= 0.85;
            }
        }
    };
    /**テンプルナイト. */
    export const                         かばう:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"かばう", info:"味方の死亡時、自分のHPの半分を分け与えて死を回避する（最大HPの半分以上のHPが必要）",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async whenAnyoneDead(me:Unit, deadUnit:Unit){
            if(deadUnit.dead && deadUnit.isFriend(me) && me.hp >= me.prm(Prm.MAX_HP).total / 2){
                deadUnit.dead = false;
                deadUnit.hp = 0;
                Unit.healHP(deadUnit, me.hp / 2);
                me.hp /= 2;
                Util.msg.set(`${me.name}は${deadUnit.name}をかばった！`); await wait();
            }
        }
    };
    /**体術士. */
    export const                         合気道:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"合気道", info:"格闘反撃時、過去値を加算",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘) && dmg.counter){
                dmg.abs.add += attacker.prm(Prm.PST).total;
            }
        }
    };
    /**体術士. */
    export const                         太極拳:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"太極拳", info:"＜盾＞状態時、格闘攻撃を受けると反射",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘) && target.hasCondition(Condition.盾) && !dmg.counter){
                target.addInvisibleCondition(new class extends InvisibleCondition{
                    readonly uniqueName = "反射";
                    async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
                        const result = dmg.calc();
                        if(result.isHit){
                            Util.msg.set("＞反射"); await wait();
                            const dmg = new Dmg({absPow:result.value});
                            await attacker.doDmg(dmg);
                        };
                        target.removeInvisibleCondition(this);
                    }
                });
            }
        }
    };
    /**体術士. */
    export const                         身体器:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"身体器", info:"戦闘開始時、最大HP・現在HP+20%",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async battleStart(unit:Unit){
            const value = unit.prm(Prm.MAX_HP).total * 0.2;
            unit.prm(Prm.MAX_HP).battle += value;
            Unit.healHP( unit, value );
        }
    };
    /**勇者. */
    export const                         結束の陣形:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"結束の陣形", info:"戦闘開始時、自分以外の味方の最大HP・現在HP+10%",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async battleStart(unit:Unit){
            const targets = unit.searchUnits("party").filter(u=> u !== unit);
            for(const t of targets){
                const value = t.prm(Prm.MAX_HP).total * 0.1;
                t.prm(Prm.MAX_HP).battle += value;
                Unit.healHP( t, value );
                t.hp += value;
            }
        }
    };
    /**勇者. */
    export const                         勇気:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"勇気", info:"格闘・槍・怨霊・銃・弓攻撃時、稀にクリティカルⅡ～Ⅳ発動",
                                sort:TecSort.強化, type:TecType.その他,
        });}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.槍, TecType.怨霊, TecType.銃, TecType.弓)){
                if(Math.random() < 0.2){
                    Util.msg.set("＞クリティカルⅡ");
                    dmg.pow.mul *= 1.5;
                }
                if(Math.random() < 0.2){
                    Util.msg.set("＞クリティカルⅢ");
                    dmg.pow.mul *= 1.5;
                }
                if(Math.random() < 0.2){
                    Util.msg.set("＞クリティカルⅣ");
                    dmg.pow.mul *= 1.5;
                }
            }
        }
    };
    
    
    //--------------------------------------------------------------------------
    //
    //弱体Active
    //
    //--------------------------------------------------------------------------
    /**毒使い. */
    export const                          ポイズンバタフライ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ポイズンバタフライ", info:"一体を＜毒＞化",
                              sort:TecSort.弱体, type:TecType.状態, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:1,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.awa.play();
            FX_Poison( target.imgCenter );
            const value = attacker.prm(Prm.DRK).total * 2 + 1;
            Unit.setCondition(target, Condition.毒, value); await wait();
        }
    }
    /**毒使い. */
    export const                          恵まれし者:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"恵まれし者", info:"味方全体を＜癒＞化、敵全体を＜毒＞化",
                              sort:TecSort.弱体, type:TecType.状態, targetings:Targeting.ALL | Targeting.WITH_FRIEND,
                              mul:1, num:1, hit:1, ep:1,
        });}
        async use(attacker:Unit, targets:Unit[]){
            if(this.checkCost(attacker)){
                Sound.up.play();
                Sound.awa.play();
            }
            await super.use(attacker, targets);

        }
        async run(attacker:Unit, target:Unit){
            if(target.isFriend( attacker )){
                Unit.setCondition(target, Condition.癒, 3);
            }else{
                const value = attacker.prm(Prm.DRK).total * 2 + 1;
                FX_Poison( target.imgCenter );
                Unit.setCondition(target, Condition.毒, value);
            }
        }
    }
    /**アメーバ. */
    export const                          弱体液:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"弱体液", info:"一体を＜防↓2＞状態にする",
                              sort:TecSort.弱体, type:TecType.状態, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:1,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.awa.play();
            Unit.setCondition( target, Condition.防御低下, 2 ); await wait();
        }
    }
    /**テンプルナイト. */
    export const                          光の護封剣:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"光の護封剣", info:"敵全体を＜攻↓5＞状態にする",
                              sort:TecSort.弱体, type:TecType.状態, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, mp:9,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.sin.play();
            Unit.setCondition( target, Condition.攻撃低下, 5 ); await wait();
        }
    }
    /**ダウザー. */
    export const                          SORRYCSTEF:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"SORRYCSTEF", info:"敵全体を＜眠1＞状態にする",
                              sort:TecSort.弱体, type:TecType.状態, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, ep:1,
        });}
        toString(){return "SORRY, C･STEF";}
        async run(attacker:Unit, target:Unit){
            Sound.sin.play();
            Unit.setCondition( target, Condition.眠, 1 ); await wait();
        }
    }
    /**ホークマン. */
    export const                          煙幕:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"煙幕", info:"敵全体を＜命中↓5＞化",
                              sort:TecSort.弱体, type:TecType.状態, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, mp:3,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.awa.play();
            Unit.setCondition(target, Condition.命中低下, 5); await wait();
        }
    }
    //--------------------------------------------------------------------------
    //
    //弱体Passive
    //
    //--------------------------------------------------------------------------
    /**密猟ハンター. */
    export const                         捕獲:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"捕獲", info:"銃・弓攻撃時、相手が獣ジョブでHP30%未満の場合、＜鎖1＞化させる",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃, TecType.弓) && target.job.beast && target.hp < target.prm(Prm.MAX_HP).total * 0.3){
                Unit.setCondition( target, Condition.鎖, 1 );
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //回復Active
    //
    //--------------------------------------------------------------------------
    /**天使. */
    export const                          数珠:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"数珠", info:"一体を光依存で回復",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:3,
        });}
        async run(attacker:Unit, target:Unit){
            
            const dmg = this.createDmg(attacker, target);
            const value = dmg.calc().value;
            Unit.healHP(target, value);

            Sound.KAIFUKU.play();
            this.effect( attacker, target, new Dmg() );
            Util.msg.set(`${target.name}のHPが${value}回復した`, Color.GREEN.bright); await wait();
        }
    }
    /**ノーム.医師. */
    export const                          良き占い:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"良き占い", info:"味方全体を光依存で回復",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:6,
        });}
        async run(attacker:Unit, target:Unit){
            
            Tec.数珠.run(attacker, target);
        }
    }
    /**魔法使い. */
    export const                          ジョンD:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ジョンD", info:"自分の最大MPを倍加　MP回復　魔x2",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, ep:1,
        });}
        async run(attacker:Unit, target:Unit){

            Sound.sin.play();
            Util.msg.set(`${target.name}に魔力が満ちる...！`); await wait();
            
            if(target.prm(Prm.MAX_MP).battle < target.prm(Prm.MAX_MP).base + target.prm(Prm.MAX_MP).eq){
                target.prm(Prm.MAX_MP).battle = target.prm(Prm.MAX_MP).base + target.prm(Prm.MAX_MP).eq;
            }
            if(target.prm(Prm.MAG).battle < target.prm(Prm.MAG).base + target.prm(Prm.MAG).eq){
                target.prm(Prm.MAG).battle = target.prm(Prm.MAG).base + target.prm(Prm.MAG).eq;
            }
            
            target.mp = target.prm(Prm.MAX_MP).total;

            Sound.up.play();
            Util.msg.set(`MP全回復 & 魔力x2！！`); await wait();
        }
    }
    /**天使. */
    export const                          ユグドラシル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ユグドラシル", info:"味方全員を蘇生・全回復",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.ALL | Targeting.FRIEND_ONLY | Targeting.WITH_DEAD,
                              mul:1, num:1, hit:1, ep:1,
        });}
        async use(attacker:Unit, targets:Unit[]){
            if(this.checkCost(attacker)){
                Sound.sin.play();
            }
            await super.use(attacker, targets);

        }
        async run(attacker:Unit, target:Unit){
            target.dead = false;
            
            Unit.healHP( target, target.prm(Prm.MAX_HP).total );
            Unit.healMP( target, target.prm(Prm.MAX_MP).total );
            Unit.healTP( target, target.prm(Prm.MAX_TP).total );
            target.clearConditions();

            Sound.KAIFUKU.play();
            this.effect( attacker, target, new Dmg() );
            Util.msg.set(`${target.name}は全回復した！`, Color.GREEN.bright); await wait();
        }
    }
    /**忍者. */
    export const                          ジライヤ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ジライヤ", info:"自分のHPMPTP回復　ステータス+30%　＜風3＞化",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, ep:1,
        });}
        async run(attacker:Unit, target:Unit){
            this.effect( attacker, target, new Dmg() );
            
            Unit.healHP( target, target.prm(Prm.MAX_HP).total );
            Unit.healMP( target, target.prm(Prm.MAX_MP).total );
            Unit.healTP( target, target.prm(Prm.MAX_TP).total );
            Sound.KAIFUKU.play();
            Util.msg.set("全回復！"); await wait();

            for(const prm of [Prm.STR, Prm.MAG, Prm.LIG, Prm.DRK, Prm.CHN, Prm.PST, Prm.GUN, Prm.ARR]){
                const battleValueMax = (target.prm(prm).base + target.prm(prm).eq) * 0.3;
                if(target.prm(prm).battle < battleValueMax){
                    target.prm(prm).battle = battleValueMax;
                }
            }
            Sound.up.play();
            Util.msg.set("ステータス増加！！"); await wait();

            if(!target.hasCondition(Condition.回避.type)){
                Sound.up.play();
                Unit.setCondition(target, Condition.回避, 3); await wait();
            }
        }
    }
    /**天使. */
    export const                          妖精の粉:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"妖精の粉", info:"味方全体のTP+1",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:3,
        });}
        async run(attacker:Unit, target:Unit){
            
            const value = 1;
            Unit.healTP(target, value);

            Sound.KAIFUKU.play();
            Util.msg.set(`${target.name}のTPが${value}回復した`, Color.GREEN.bright); await wait();
        }
    }
    /**格闘家. */
    export const                          印:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"印", info:"自分のHP+10%",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:2,
        });}
        async run(attacker:Unit, target:Unit){
            
            const value = (target.prm(Prm.MAX_HP).total * 0.1 + 1)|0;
            Unit.healHP(target, value);

            Sound.KAIFUKU.play();
            Util.msg.set(`${target.name}のHPが${value}回復した`, Color.GREEN.bright); await wait();
        }
    }
    /**医師. */
    export const                          解毒:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"解毒", info:"一体の＜毒＞を解除",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:3,
        });}
        async run(attacker:Unit, target:Unit){
            if(target.hasCondition(Condition.毒)){
                Sound.KAIFUKU.play();
                FX_Buff(target.imgCenter);
                target.removeCondition(Condition.毒);
                Util.msg.set(`${target.name}の毒が解除された`, Color.GREEN); await wait();
            }
        }
    }
    /**医師. */
    export const                          エリス:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"エリス", info:"一体を10%のHPで蘇生",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.SELECT | Targeting.DEAD_ONLY | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:10, tp:1,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.KAIFUKU.play();
            FX_Buff(target.imgCenter);
            if(target.dead){
                target.dead = false;
                target.hp = 1;

                Unit.healHP( target, target.prm(Prm.MAX_HP).total * 0.1 );
                Util.msg.set(`${target.name}は蘇った！`, Color.GREEN.bright); await wait();
            }else{
                Unit.healHP( target, target.prm(Prm.MAX_HP).total * 0.1 );
            }
        }
    }
    /**僧兵. */
    export const                          五体投地:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"五体投地", info:"味方の死者を2ターン後に蘇生",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.ALL | Targeting.DEAD_ONLY | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:7,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.sin.play();
            FX_神格(target.imgCenter);

            if(target.dead){
                const tec = this;
                let turnCount = 2;
                target.addInvisibleCondition(new class extends InvisibleCondition{
                    readonly uniqueName = tec.uniqueName;
                    async phaseStart(u:Unit){
                        u.removeInvisibleCondition(this);
                    }
                    async deadPhaseStart(u:Unit){
                        if(!u.dead){
                            u.removeInvisibleCondition(this);
                            return;
                        }

                        if(--turnCount <= 0){
                            u.dead = false;
                            u.hp = u.prm(Prm.MAX_HP).total * 0.3;
                            FX_回復( u.imgCenter );
                            Util.msg.set(`${u.name}は生き返った！`); await wait();
                            u.removeInvisibleCondition(this);
                        }else{
                            Util.msg.set(`${u.name}蘇りまで残り${turnCount}ターン...`); await wait();
                        }
                    }
                });
            }
        }
    }
    /**体術士. */
    export const                          三法印:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"三法印", info:"自分のHPMPTPを20%回復する",
                              sort:TecSort.回復, type:TecType.回復, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1,
        });}
        async run(attacker:Unit, target:Unit){
            Sound.KAIFUKU.play();
            FX_回復( target.imgCenter );
            Unit.healHP( target, target.prm(Prm.MAX_HP).total * 0.2 );
            Unit.healMP( target, target.prm(Prm.MAX_MP).total * 0.2 );
            Unit.healTP( target, target.prm(Prm.MAX_TP).total * 0.2 );
        }
    }
    //--------------------------------------------------------------------------
    //
    //回復Passive
    //
    //--------------------------------------------------------------------------
    /**訓練生. */
    export const                         HP自動回復:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"HP自動回復", info:"行動開始時HP+1%",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async phaseStart(unit:Unit){
            Unit.healHP(unit, 1 + unit.prm(Prm.MAX_HP).total * 0.01);
        }
    };
    /**医師. */
    export const                         衛生:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"衛生", info:"行動開始時味方全体のHP+5%",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async phaseStart(unit:Unit){
            Sound.KAIFUKU.play();
            for(const u of unit.searchUnits("party")){
                Unit.healHP(u, 1 + unit.prm(Prm.MAX_HP).total * 0.05);
            }
        }
    };
    // export const                         体力機関:PassiveTec = new class extends PassiveTec{
    //     constructor(){super({uniqueName:"体力機関", info:"戦闘開始時最大HP･HP+10%",
    //                             type:TecType.回復,
    //     });}
    //     battleStart(unit:Unit){
    //         const value = unit.prm(Prm.MAX_HP).total * 0.1;
    //         unit.prm(Prm.MAX_HP).battle += value;
    //         Unit.healHP(unit, value);
    //     }
    // };
    /**天使・妖精. */
    export const                         MP自動回復:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"MP自動回復", info:"行動開始時MP+1",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async phaseStart(unit:Unit){
            Unit.healMP(unit, 1);
        }
    };
    /**ガーディアン. */
    export const                         HPMP回復:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"HPMP回復", info:"行動開始時HP+1%MP+1",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async phaseStart(unit:Unit){
            Unit.healHP( unit, unit.prm(Prm.MAX_HP).total * 0.01 + 1 );
            Unit.healMP( unit, 1 );
        }
    };
    export const                         TP自動回復:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"TP自動回復", info:"行動開始時TP+1　HPMP-1",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async phaseStart(unit:Unit){
            unit.hp--;
            unit.mp--;
            Unit.healTP(unit, 1);
        }
    };
    export const                         血技の技巧:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"血技の技巧", info:"敵から攻撃を受けた時、稀にHP5を吸収",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && Math.random() < 0.5){
                const value = 5;
                attacker.hp -= value;
                target.hp += value;
                
                Sound.drain.play();
                FX_吸収(target.imgCenter, attacker.imgCenter);
                Util.msg.set("＞血技の技巧");
                Util.msg.set(`HPを${value}吸収した`); await wait();
            }
        }
    };
    /**ドラゴン. */
    export const                         自然治癒:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"自然治癒", info:"行動開始時HP+5%",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async phaseStart(unit:Unit){
            Unit.healHP(unit, 1 + unit.prm(Prm.MAX_HP).total * 0.05);
        }
    };
    /**勇者. */
    export const                         友情の陣形:PassiveTec = new class extends PassiveTec{
        constructor(){super({uniqueName:"友情の陣形", info:"行動開始時、自分を除く味方のTP+1",
                                sort:TecSort.回復, type:TecType.回復,
        });}
        async phaseStart(unit:Unit){
            const targets = unit.searchUnits("party").filter(u=> u !== unit && !u.dead);
            for(const t of targets){
                Unit.healTP( t, 1 );
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //その他Active
    //
    //--------------------------------------------------------------------------
    export const                          何もしない:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"何もしない", info:"何もしないをする",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1,
        });}
        async use(attacker:Unit, targets:Unit[]){
            Sound.exp.play();
            Util.msg.set(`${attacker.name}は空を眺めている...`); await wait();
        }
    }
    export const                          自爆:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"自爆", info:"敵全体に自分のHP分のダメージを与える　HP=0",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, ep:1,
        });}

        dmgValue = 0;
        soundAndFX:boolean;

        async use(attacker:Unit, targets:Unit[]){
            const canUse = this.checkCost(attacker);

            Util.msg.set(`${attacker.name}の体から光が溢れる...`); await wait();

            if(canUse){
                this.dmgValue = attacker.hp;
                this.soundAndFX = true;
            }
            super.use(attacker, targets);
            
            if(!canUse){
                Util.msg.set(`光に吸い寄せられた虫が体にいっぱいくっついた...`); await wait();
            }
        }
        async run(attacker:Unit, target:Unit){
            if(this.soundAndFX){
                this.soundAndFX = false;
                Sound.bom2.play();
                FX_BOM( attacker.imgCenter );
            }
            const dmg = new Dmg({absPow:this.dmgValue});
            attacker.hp = 0;
            await target.doDmg(dmg); await wait();
        }
    }
    export const                          ドラゴンブレス:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ドラゴンブレス", info:"敵全体に[最大HP-現在HP]のダメージを与える",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, ep:1,
        });}
        async run(attacker:Unit, target:Unit){
            const dmg = new Dmg({absPow:attacker.prm(Prm.MAX_HP).total - attacker.hp});
            await target.doDmg(dmg); await wait();
        }
    }
    export const                          ドゥエルガル:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ドゥエルガル", info:"ドゥエルガルを召喚する",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:5, item:()=>[[Item.絵画母なる星の緑の丘, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            const hp = randomInt(1,2,"[]");
            attacker.pet = Pet.ドゥエルガル.create(hp);

            FX_Buff( attacker.imgCenter );
            Sound.warp.play();
            Util.msg.set("ドゥエルガルが召喚された！"); await wait();
        }
    }
    export const                          ネーレイス:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ネーレイス", info:"ネーレイスを召喚する",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:5, item:()=>[[Item.絵画シェイクスピアの涙, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            const hp = randomInt(1,2,"[]");
            attacker.pet = Pet.ネーレイス.create(hp);
            
            FX_Buff( attacker.imgCenter );
            Sound.warp.play();
            Util.msg.set("ネーレイスが召喚された！"); await wait();
        }
    }
    export const                          ヴァルナ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ヴァルナ", info:"ヴァルナを召喚する",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:10, item:()=>[[Item.絵画彼女の髪, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            const hp = randomInt(1,2,"[]");
            attacker.pet = Pet.ヴァルナ.create(hp);
            
            FX_Buff( attacker.imgCenter );
            Sound.warp.play();
            Util.msg.set("ヴァルナが召喚された！"); await wait();
        }
    }
    export const                          イリューガー:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"イリューガー", info:"イリューガーを召喚する",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:10, item:()=>[[Item.絵画我が情熱の日, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            const hp = randomInt(1,2,"[]");
            attacker.pet = Pet.イリューガー.create(hp);
            
            FX_Buff( attacker.imgCenter );
            Sound.warp.play();
            Util.msg.set("イリューガーが召喚された！"); await wait();
        }
    }
    export const                          マーメイド:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"マーメイド", info:"マーメイドを召喚する",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:10, item:()=>[[Item.マーメイド, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            const hp = randomInt(1,2,"[]");
            attacker.pet = Pet.マーメイド.create(hp);
            
            FX_Buff( attacker.imgCenter );
            Sound.warp.play();
            Util.msg.set("マーメイドが召喚された！"); await wait();
        }
    }
    export const                          ホムンクルス:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ホムンクルス", info:"ホムンクルスを召喚する",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:10, item:()=>[[Item.ホムンクルス, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            const hp = randomInt(1,2,"[]");
            attacker.pet = Pet.ホムンクルス.create(hp);
            
            FX_Buff( attacker.imgCenter );
            Sound.warp.play();
            Util.msg.set("ホムンクルスが召喚された！"); await wait();
        }
    }
    export const                          フランケンシュタイン:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"フランケンシュタイン", info:"フランケンシュタインを召喚する",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELF,
                              mul:1, num:1, hit:1, mp:10, item:()=>[[Item.フランケンシュタイン, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            const hp = randomInt(1,2,"[]");
            attacker.pet = Pet.フランケンシュタイン.create(hp);
            
            FX_Buff( attacker.imgCenter );
            Sound.warp.play();
            Util.msg.set("フランケンシュタインが召喚された！"); await wait();
        }
    }
    export const                          死体除去:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"死体除去", info:"死亡した人間型ユニット一体を除去する",
                              sort:TecSort.その他, type:TecType.その他, targetings:Targeting.SELECT | Targeting.DEAD_ONLY,
                              mul:1, num:1, hit:1, mp:1, item:()=>[[Item.Dフラスコ, 1]],
        });}
        async run(attacker:Unit, target:Unit){
            if(target instanceof EUnit && target.dead && !target.job.beast){
                target.exists = false;
                FX_神格( target.imgCenter );
                Sound.sin.play();

                Util.msg.set(`${target.name}の死体が消滅した...`); await wait();
            }
        }
    }
    //--------------------------------------------------------------------------
    //
    //その他Passive
    //
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //
    //ペットActive
    //
    //--------------------------------------------------------------------------
    /**ペット:ネーレイス. */
    export const                          キュア:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"キュア", info:"味方一体のHP回復",
                              sort:TecSort.その他, type:TecType.回復, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:4,
                              flags:["ペット"],
        });}
        async run(attacker:Unit, target:Unit){
            const value = attacker.prm(Prm.LV).total;
            Unit.healHP(target, value);

            Sound.KAIFUKU.play();
            Util.msg.set(`${target.name}のHPが${value}回復した`, Color.GREEN.bright); await wait();
        }
    }
    /**ペット:ネーレイス. */
    export const                          ラクサスキュア:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ラクサスキュア", info:"味方一体のTP+1",
                              sort:TecSort.その他, type:TecType.回復, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:4,
                              flags:["ペット"],
        });}
        async run(attacker:Unit, target:Unit){
            const value = 1;
            Unit.healTP(target, value);

            Sound.KAIFUKU.play();
            Util.msg.set(`${target.name}のTPが${value}回復した`, Color.GREEN.bright); await wait();
        }
    }
    /**ペット:強化ネーレイス. */
    export const                          イスキュア:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"イスキュア", info:"味方全体のHP回復",
                              sort:TecSort.その他, type:TecType.回復, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:4,
                              flags:["ペット"],
        });}
        async run(attacker:Unit, target:Unit){
            Tec.キュア.run(attacker, target);
        }
    }
    /**ペット:ドゥエルガル. */
    export const                          パンチ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"パンチ", info:"一体に格闘攻撃",
                              sort:TecSort.その他, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:1,
                              flags:["ペット"],
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.counter = true;
            return dmg;
        }
    }
    /**ペット:ヴァルナ. */
    export const                          シルフ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"シルフ", info:"一体を＜回避＞化",
                              sort:TecSort.その他, type:TecType.格闘, targetings:Targeting.SELECT | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, mp:3,
                              flags:["ペット"],
        });}
        async run(attacker:Unit, target:Unit){
            Unit.setCondition( target, Condition.回避, 1 ); await wait();
        }
    }
    /**ペット:ヴァルナ. */
    export const                          レヴィーナの歌声:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"レヴィーナの歌声", info:"一体を＜眠＞化",
                              sort:TecSort.その他, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:3,
                              flags:["ペット"],
        });}
        async run(attacker:Unit, target:Unit){
            Unit.setCondition( target, Condition.眠, 1 ); await wait();
        }
    }
    /**ペット:ヴァルナ. */
    export const                          ヴァルナパンチ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ヴァルナパンチ", info:"一体に格闘攻撃",
                              sort:TecSort.その他, type:TecType.格闘, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, mp:3,
                              flags:["ペット"],
        });}
        toString(){return "殴る";}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.counter = true;
            return dmg;
        }
    }
    /**ペット:イリューガー. */
    export const                          ファイアブレス:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ファイアブレス", info:"敵全体に魔法攻撃",
                              sort:TecSort.その他, type:TecType.魔法, targetings:Targeting.ALL,
                              mul:1, num:1, hit:1, mp:6,
                              flags:["ペット"],
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.counter = true;
            return dmg;
        }
    }
    /**ペット:マーメイド. */
    export const                          人魚の歌:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"人魚の歌", info:"一体を＜眠1＞化",
                              sort:TecSort.その他, type:TecType.状態, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, tp:1,
                              flags:["ペット"],
        });}
        async run(attacker:Unit, target:Unit){
            Sound.sin.play();
            Unit.setCondition( target, Condition.眠, 1 ); await wait();
        }
    }
    /**ペット:マーメイド. */
    export const                          生命の歌:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"生命の歌", info:"自分以外の味方のHP回復",
                              sort:TecSort.その他, type:TecType.回復, targetings:Targeting.ALL | Targeting.FRIEND_ONLY,
                              mul:1, num:1, hit:1, tp:2,
                              flags:["ペット"],
        });}
        async run(attacker:Unit, target:Unit){
            if(attacker === target){return;}

            FX_回復( target.imgCenter );
            Sound.KAIFUKU.play();
            const value = attacker.prm(Prm.LV).total * 0.5 + 1;
            Unit.healHP( target, value );
            Util.msg.set(`${target.name}のHPが${value}回復した`, Color.GREEN.bright); await wait();
        }
    }
    /**ペット:ホムンクルス. */
    export const                          ブラッドパンチ:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"ブラッドパンチ", info:"一体に格闘攻撃 ダメージの半分をHPとして吸収",
                              sort:TecSort.その他, type:TecType.状態, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, tp:1,
                              flags:["ペット"],
        });}
        async runInner(attacker:Unit, target:Unit, dmg:Dmg){
            super.runInner(attacker, target, dmg);

            if(dmg.result.isHit){
                Sound.drain.play();
                FX_吸収(attacker.imgCenter, target.imgCenter);
                const result = dmg.result.value;
                Unit.healHP( attacker, result );
            }
        }
    }
    /**ペット:フランケンシュタイン. */
    export const                          サイクロン:ActiveTec = new class extends ActiveTec{
        constructor(){super({ uniqueName:"サイクロン", info:"敵全体に過去攻撃",
                              sort:TecSort.その他, type:TecType.過去, targetings:Targeting.SELECT,
                              mul:1, num:1, hit:1, tp:2,
                              flags:["ペット"],
        });}
        createDmg(attacker:Unit, target:Unit){
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.counter = true;
            return dmg;
        }
    }
}