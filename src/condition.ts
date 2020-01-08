import { Force, Dmg, Action, PhaseStartForce, AttackNumForce, ForceIns, Heal } from "./force.js";
import { Tec, TecType, ActiveTec } from "./tec.js";
import { Unit, Prm } from "./unit.js";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Color } from "./undym/type.js";
import { FX_BOM, FX_格闘 } from "./fx/fx.js";
import { Sound } from "./sound.js";



export class ConditionType{
    private static _values:ConditionType[] = [];
    static get values():ReadonlyArray<ConditionType>{
        return ConditionType._values;
    }

    private static _goodConditions:ConditionType[];
    static goodConditions():ReadonlyArray<ConditionType>{
        if(!this._goodConditions){
            this._goodConditions = [
                this.GOOD_LV1,
                this.GOOD_LV2,
                this.GOOD_LV3,
            ];
        }
        return this._goodConditions;                        
    }
    private static _badConditions:ConditionType[];
    static badConditions():ReadonlyArray<ConditionType>{
        if(!this._badConditions){
            this._badConditions = [
                this.BAD_LV1,
                this.BAD_LV2,
                this.BAD_LV3,
            ];
        }
        return this._badConditions;
    }

    private static ordinalNow = 0;

    readonly ordinal:number;

    private constructor(public readonly uniqueName:string, public readonly color:(cnt:number)=>Color){
        this.ordinal = ConditionType.ordinalNow++;
        ConditionType._values.push(this);
    }

    static readonly GOOD_LV1 = new ConditionType("GOOD_LV1", Color.CYAN.bright);
    static readonly GOOD_LV2 = new ConditionType("GOOD_LV2", Color.CYAN.bright);
    static readonly GOOD_LV3 = new ConditionType("GOOD_LV3", Color.CYAN.bright);
    static readonly BAD_LV1  = new ConditionType("BAD_LV1", Color.RED.bright);
    static readonly BAD_LV2  = new ConditionType("BAD_LV2", Color.RED.bright);
    static readonly BAD_LV3  = new ConditionType("BAD_LV3", Color.RED.bright);
}


export abstract class Condition implements ForceIns{
    private static _values:Condition[] = [];
    static get values():ReadonlyArray<Condition>{return this._values;}

    private static _valueOf = new Map<string,Condition>();
    static valueOf(uniqueName:string):Condition|undefined{
        return this._valueOf.get(uniqueName);
    }

    constructor(
        public readonly uniqueName:string,
        public readonly type:ConditionType
    ){
        Condition._values.push(this);
        if(Condition._valueOf.has(this.uniqueName)) {console.log(`Condition already has uniqueName "${this.uniqueName}".`);}
        else                                        {Condition._valueOf.set( this.uniqueName, this );}
    }

    toString():string{return `${this.uniqueName}`;}
    /**`${condition}になった`の文字列表示時の色。 */
    color(cnt:number){return this.type.color(cnt);}
    
    private forceIns:Force;
    get force():Force{return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this));}
    protected abstract createForce(_this:Condition):Force;
}


export namespace Condition{
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    export const             empty:Condition = new class extends Condition{
        constructor(){super("empty", ConditionType.GOOD_LV1);}
        toString():string{return "";}
        createForce(_this:Condition){return new Force();}
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV1
    //
    //--------------------------------------------------------------------------
    export const             練:Condition = new class extends Condition{
        constructor(){super("練", ConditionType.GOOD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("格闘","神格","鎖術","銃","弓")){
                    
                    Util.msg.set("＞練");
                    dmg.pow.mul *= (1 + dmg.attacker.getConditionValue(_this) * 0.5)
    
                    dmg.attacker.addConditionValue(_this, -1);
                }
            }
        };}
    };
    export const             格鎖無効:Condition = new class extends Condition{
        constructor(){super("格鎖無効", ConditionType.GOOD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘","鎖術")){
                    Util.msg.set("＞無効");
                    dmg.pow.base = 0;

                    dmg.attacker.addConditionValue(_this, -1);
                }
            }
        };}
    };
    export const             魔過無効:Condition = new class extends Condition{
        constructor(){super("魔過無効", ConditionType.GOOD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("魔法","過去")){
                    Util.msg.set("＞無効");
                    dmg.pow.base = 0;
    
                    dmg.attacker.addConditionValue(_this, -1);
                }
            }
        };}
    };
    export const             銃弓無効:Condition = new class extends Condition{
        constructor(){super("銃弓無効", ConditionType.GOOD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("銃","弓")){
                    Util.msg.set("＞無効");
                    dmg.pow.base = 0;
    
                    dmg.attacker.addConditionValue(_this, -1);
                }
            }
        };}
    };
    /**操作不能、勝手に殴る。格闘攻撃倍率x2。*/
    export const             暴走:Condition = new class extends Condition{
        constructor(){super("暴走", ConditionType.GOOD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                pForce.phaseSkip = true;
    
                Util.msg.set(`${unit.name}は暴走している...`); await wait();
                const targets = unit.searchUnits( Tec.殴る.targetings, Tec.殴る.rndAttackNum( unit ) );
                await Tec.殴る.use(unit, targets);
    
                unit.addConditionValue(_this, -1);
            }
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘")){
                    dmg.pow.mul *= 2;
                }
            }
        };}
    };
    /**行動開始時最大HP+10% */
    export const             体力上昇:Condition = new class extends Condition{
        constructor(){super("体力上昇", ConditionType.GOOD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                unit.prm(Prm.MAX_HP).battle += unit.prm(Prm.MAX_HP).get("base","eq") * 0.1;
                
                unit.addConditionValue(_this, -1);
            }
        };}
    };
    /**行動開始時TP+1 */
    export const             風:Condition = new class extends Condition{
        constructor(){super("風", ConditionType.GOOD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                unit.tp += 1;
    
                unit.addConditionValue(_this, -1);
            }
        };}
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV2
    //
    //--------------------------------------------------------------------------
    export const             盾:Condition = new class extends Condition{
        constructor(){super("盾", ConditionType.GOOD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘","神格","鎖術","銃","弓")){
                    
                    Util.msg.set("＞盾");
                    dmg.pow.mul /= (1 + dmg.target.getConditionValue(_this) * 0.5);
    
                    dmg.target.addConditionValue(_this, -1);
                }
            }
        };}
    };
    export const             雲:Condition = new class extends Condition{
        constructor(){super("雲", ConditionType.GOOD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("魔法","神格","過去")){
                    
                    Util.msg.set("＞雲");
                    dmg.pow.mul /= (1 + dmg.target.getConditionValue(_this) * 0.5);
    
                    dmg.target.addConditionValue(_this, -1);
                }
            }
        };}
    };
    export const             回避:Condition = new class extends Condition{
        constructor(){super("回避", ConditionType.GOOD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘","槍","鎖術","銃","弓","怨霊")){
                    dmg.hit.mul = 0;
    
                    dmg.target.addConditionValue(_this, -1);
                }
            }
        };}
    };
    export const             吸収:Condition = new class extends Condition{
        constructor(){super("吸収", ConditionType.GOOD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘","神格","怨霊","鎖術","銃","弓")){
                    Unit.set吸収Inv(dmg.target, ()=>dmg.target.addConditionValue(_this, -1));
                }
            }
        };}
    };
    export const             バリア:Condition = new class extends Condition{
        constructor(){super("バリア", ConditionType.GOOD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(!dmg.hasType("槍","怨霊")){
                    Util.msg.set("＞バリア");
                    dmg.pow.mul = 0;
    
                    dmg.target.addConditionValue(_this, -1);
                }
            }
        };}
    };
    export const             反射:Condition = new class extends Condition{
        constructor(){super("反射", ConditionType.GOOD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("魔法","神格","過去")){
                    Unit.set反射Inv(dmg.target);
                    dmg.target.addConditionValue(_this, -1);
                }
            }
        };}
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV3
    //
    //--------------------------------------------------------------------------
    export const             癒:Condition = new class extends Condition{
        constructor(){super("癒", ConditionType.GOOD_LV3);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit){
                Heal.run("HP", unit.prm(Prm.MAX_HP).total * 0.1, unit, unit, Condition.癒, false);
                
                unit.addConditionValue(_this, -1);
            }
        };}
    };
    export const             治:Condition = new class extends Condition{
        constructor(){super("治", ConditionType.GOOD_LV3);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit){
                Heal.run("HP", unit.prm(Prm.MAX_HP).total * 0.2, unit, unit, Condition.治, false);
                
                unit.addConditionValue(_this, -1);
            }
        };}
    };
    export const             約束:Condition = new class extends Condition{
        constructor(){super("約束", ConditionType.GOOD_LV3);}
        toString(){return "約";}
        createForce(_this:Condition){return new class extends Force{
            async whenDead(unit:Unit){
                if(!unit.dead){return;}
    
                unit.dead = false;
                Heal.run("HP", unit.prm(Prm.MAX_HP).total * 0.45, unit, unit, Condition.約束, false);
                
                Sound.KAIFUKU.play();
                Util.msg.set(`${unit.name}は生き返った！`); await wait();
                
                unit.addConditionValue(_this, -1);
            }
        };}
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV1
    //
    //--------------------------------------------------------------------------
    export const             攻撃低下:Condition = new class extends Condition{
        constructor(){super("攻撃低下", ConditionType.BAD_LV1);}
        toString(){return "攻↓";}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                unit.addConditionValue(_this, -1);
            }
            async beforeDoAtk(dmg:Dmg){
                Util.msg.set("＞攻↓");
                dmg.pow.mul *= 0.5;
            }
        };}
    };
    export const             防御低下:Condition = new class extends Condition{
        constructor(){super("防御低下", ConditionType.BAD_LV1);}
        toString(){return "防↓";}
        createForce(_this:Condition){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                Util.msg.set("＞防↓");
                dmg.def.mul *= 0.5;
    
                dmg.target.addConditionValue(_this, -1);
            }
        };}
    };
    export const             命中低下:Condition = new class extends Condition{
        constructor(){super("命中低下", ConditionType.BAD_LV1);}
        toString(){return "命中↓";}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                unit.addConditionValue(_this, -1);
            }
            async beforeDoAtk(dmg:Dmg){
                dmg.hit.mul *= 0.8;
            }
        };}
    };
    export const             毒:Condition = new class extends Condition{
        constructor(){super("毒", ConditionType.BAD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                
                const value = unit.getConditionValue(_this);
    
                Util.msg.set("＞毒", Color.RED);
    
                const dmg = new Dmg({
                    attacker:unit,
                    target:unit,
                    absPow:value,
                    types:["毒"],
                });
                await dmg.run(); await wait();
    
                unit.setCondition(_this, value * 0.666);
                if(unit.getConditionValue(_this) < unit.prm(Prm.DRK).total + 1){
                    unit.removeCondition(_this);
                    Util.msg.set(`${unit.name}の＜毒＞が解除された`); await wait();
                }
            }
        };}
    };
    export const             契約:Condition = new class extends Condition{
        constructor(){super("契約", ConditionType.BAD_LV1);}
        createForce(_this:Condition){return new Force();}
    };
    export const             疲労:Condition = new class extends Condition{
        constructor(){super("疲労", ConditionType.BAD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                unit.tp -= unit.prm(Prm.MAX_TP).total * 0.1;
            }
        };}
    };
    /**毎ターンHP半減.最大999. */
    export const             呪:Condition = new class extends Condition{
        constructor(){super("呪", ConditionType.BAD_LV1);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                await new Dmg({
                    attacker:unit,
                    target:unit,
                    absPow:unit.hp * 0.5,
                    action:_this,
                }).run(false);

                unit.addConditionValue(_this, -1);
            }
        };}
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV2
    //
    //--------------------------------------------------------------------------
    export const             眠:Condition = new class extends Condition{
        constructor(){super("眠", ConditionType.BAD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                pForce.phaseSkip = true;
                Util.msg.set(`${unit.name}は眠っている...`); await wait();
                
                unit.addConditionValue(_this, -1);
            }
    
            async afterBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘","鎖術","過去","銃") && Math.random() < 0.5){
                    dmg.target.removeCondition(_this);
                    Util.msg.set(`${dmg.target.name}は目を覚ました！`); await wait();
                }
            }
        };}
    };
    export const             石:Condition = new class extends Condition{
        constructor(){super("石", ConditionType.BAD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                pForce.phaseSkip = true;
                Util.msg.set(`${unit.name}は動けない...`); await wait();
                
                unit.addConditionValue(_this, -1);
            }
        };}
    };
    /**一定確率で行動不能になる。 */
    export const             鎖:Condition = new class extends Condition{
        constructor(){super("鎖", ConditionType.BAD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                if(Math.random() < 0.5){
                    pForce.phaseSkip = true;
                    Util.msg.set(`${unit.name}は鎖に縛られている...`); await wait();
                    
                    unit.addConditionValue(_this, -1);
                }
            }
        };}
    };
    /**1/2の確率で味方を殴る。 */
    export const             混乱:Condition = new class extends Condition{
        constructor(){super("混乱", ConditionType.BAD_LV2);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                if(Math.random() < 0.5){
                    pForce.phaseSkip = true;
                    
                    Util.msg.set(`${unit.name}は混乱している...`); await wait();
                    const targets = unit.searchUnits( Tec.混乱殴り.targetings, Tec.混乱殴り.rndAttackNum(unit) );
                    await Tec.混乱殴り.use( unit, targets );
                    
                    unit.addConditionValue(_this, -1);
                }
            }
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘","槍","鎖術","機械","怨霊") && Math.random() < 0.5){
                    dmg.target.addConditionValue(_this, -1);
                }
            }
        };}
    };
    //--------------------------------------------------------------------------
    //
    //-BAD_LV2
    //BAD_LV3
    //
    //--------------------------------------------------------------------------
    /** */
    export const             病気:Condition = new class extends Condition{
        constructor(){super("病気", ConditionType.BAD_LV3);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                Util.msg.set("＞病気", Color.RED);
                const value = unit.getConditionValue(_this);
    
                for(const t of unit.searchUnitsEx("party")){
                    const dmg = new Dmg({
                        attacker:unit,
                        target:t,
                        absPow:value,
                        types:["毒"],
                    });
                    await dmg.run(); await wait(1);
                }
    
                unit.setCondition(_this, value * 0.666);
                if(unit.getConditionValue(_this) < unit.prm(Prm.DRK).total + 1){
                    unit.removeCondition(_this);
                    Util.msg.set(`${unit.name}の＜病気＞が解除された`); await wait();
                }
            }
        };}
    };
    export const             衰弱:Condition = new class extends Condition{
        constructor(){super("衰弱", ConditionType.BAD_LV3);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                Util.msg.set("＞衰弱", Color.RED);
    
                const lim = 3999;
                let value = unit.prm(Prm.MAX_HP).total * 0.1;
                if(value > lim){value = lim;}
                unit.prm(Prm.MAX_HP).battle -= value;
    
                unit.addConditionValue(_this, -1);
            }
        };}
    };
    export const             時限:Condition = new class extends Condition{
        constructor(){super("時限", ConditionType.BAD_LV3);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                if(unit.getConditionValue(_this) === 1){
                    Util.msg.set(`${unit.name}に終わりの鐘が鳴り響く...`); await wait();
                    Unit.setCondition(unit, Condition.爆弾, 1, true); await wait();

                }else{
                    unit.addConditionValue(_this, -1);
                }
            }
        };}
    };
    export const             爆弾:Condition = new class extends Condition{
        constructor(){super("爆弾", ConditionType.BAD_LV3);}
        createForce(_this:Condition){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                FX_BOM(unit.imgCenter);
                Util.msg.set(`${unit.name}は爆発した！`); await wait();
                
                const lim = 9999;
                const value = unit.hp < lim ? unit.hp : lim;

                for(const t of unit.searchUnits(["all"],1)){
                    FX_格闘( t.imgCenter );
                    await new Dmg({
                        attacker:unit,
                        target:t,
                        absPow:value,
                        canCounter:false,
                        action:_this,
                    }).run(true);
                    await wait(1);
                }
                unit.addConditionValue(_this, -1);
            }
        };}
    };
    //--------------------------------------------------------------------------
    //
    //-BAD_LV3
    //
    //--------------------------------------------------------------------------
}



export abstract class InvisibleCondition implements ForceIns{
    abstract readonly uniqueName:string;

    private forceIns:Force;
    get force():Force{return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this));}
    protected createForce(_this:InvisibleCondition):Force{return new Force();}
}