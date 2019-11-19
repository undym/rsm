import { Force, Dmg, Action, PhaseStartForce } from "./force.js";
import { Tec, TecType, ActiveTec } from "./tec.js";
import { Unit, Prm } from "./unit.js";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Color } from "./undym/type.js";



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

    private constructor(public readonly uniqueName:string){
        this.ordinal = ConditionType.ordinalNow++;
        ConditionType._values.push(this);
    }

    static readonly GOOD_LV1 = new ConditionType("GOOD_LV1");
    static readonly GOOD_LV2 = new ConditionType("GOOD_LV2");
    static readonly GOOD_LV3 = new ConditionType("GOOD_LV3");
    static readonly BAD_LV1  = new ConditionType("BAD_LV1");
    static readonly BAD_LV2  = new ConditionType("BAD_LV2");
    static readonly BAD_LV3  = new ConditionType("BAD_LV3");
}


export abstract class Condition extends Force{
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
        super();
        Condition._values.push(this);
        Condition._valueOf.set( this.uniqueName, this );
    }

    toString():string{return `${this.uniqueName}`;}
    
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
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV1
    //
    //--------------------------------------------------------------------------
    export const             練:Condition = new class extends Condition{
        constructor(){super("練", ConditionType.GOOD_LV1);}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type === TecType.格闘){
                
                Util.msg.set("＞練"); await wait();
                dmg.pow.mul *= (1 + attacker.getConditionValue(this) * 0.5)

                attacker.addConditionValue(this, -1);
            }
        }
    };
    export const             狙:Condition = new class extends Condition{
        constructor(){super("狙", ConditionType.GOOD_LV1);}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec){
                dmg.hit.mul *= 1.2;

                attacker.addConditionValue(this, -1);
            }
        }
    };
    export const             闇:Condition = new class extends Condition{
        constructor(){super("闇", ConditionType.GOOD_LV1);}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec){
                
                Util.msg.set("＞闇"); await wait();
                dmg.pow.add += attacker.prm(Prm.DRK).total;

                attacker.addConditionValue(this, -1);
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV2
    //
    //--------------------------------------------------------------------------
    export const             盾:Condition = new class extends Condition{
        constructor(){super("盾", ConditionType.GOOD_LV2);}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.神格, TecType.鎖術, TecType.銃術)){
                
                Util.msg.set("＞盾"); await wait();
                dmg.pow.mul /= (1 + target.getConditionValue(this) * 0.5);

                target.addConditionValue(this, -1);
            }
        }
    };
    export const             雲:Condition = new class extends Condition{
        constructor(){super("雲", ConditionType.GOOD_LV2);}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.暗黒, TecType.過去, TecType.弓術)){
                
                Util.msg.set("＞雲"); await wait();
                dmg.pow.mul /= (1 + target.getConditionValue(this) * 0.5);

                target.addConditionValue(this, -1);
            }
        }
    };
    export const             風:Condition = new class extends Condition{
        constructor(){super("風", ConditionType.GOOD_LV2);}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec){
                dmg.hit.mul *= 0.5;

                target.addConditionValue(this, -1);
            }
        }
    };
    export const             吸収:Condition = new class extends Condition{
        constructor(){super("吸収", ConditionType.GOOD_LV2);}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.神格, TecType.鎖術, TecType.銃術)){
                const value = dmg.calc().value;
                target.addInvisibleCondition(new class extends InvisibleCondition{
                    async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
                        Unit.healHP( target, value );
                        target.removeInvisibleCondition(this);
                    }
                });

                dmg.pow.add -= dmg.pow.base;

                target.addConditionValue(this, -1);
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV3
    //
    //--------------------------------------------------------------------------
    export const             癒:Condition = new class extends Condition{
        constructor(){super("癒", ConditionType.GOOD_LV3);}
        
        async phaseStart(unit:Unit){
            const value = unit.prm(Prm.MAX_HP).total * 0.1;

            Util.msg.set("＞癒", Color.CYAN.bright);
            unit.hp += value;
            
            unit.addConditionValue(this, -1);
        }
    };
    export const             治:Condition = new class extends Condition{
        constructor(){super("治", ConditionType.GOOD_LV3);}
        
        async phaseStart(unit:Unit){
            const value = unit.prm(Prm.MAX_HP).total * 0.2;

            Util.msg.set("＞癒", Color.CYAN.bright);
            unit.hp += value;
            
            unit.addConditionValue(this, -1);
        }
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV1
    //
    //--------------------------------------------------------------------------
    export const             攻撃低下:Condition = new class extends Condition{
        constructor(){super("攻↓", ConditionType.BAD_LV1);}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec){
                Util.msg.set("＞攻↓"); await wait();
                dmg.pow.mul *= 0.5;

                attacker.addConditionValue(this, -1);
            }
        }
    };
    export const             防御低下:Condition = new class extends Condition{
        constructor(){super("防↓", ConditionType.BAD_LV1);}
        async beforeBeoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec){
                Util.msg.set("＞防↓"); await wait();
                dmg.def.mul *= 0.5;

                target.addConditionValue(this, -1);
            }
        }
    };
    export const             毒:Condition = new class extends Condition{
        constructor(){super("毒", ConditionType.BAD_LV1);}
        async phaseEnd(unit:Unit){
            const value = unit.getConditionValue(this);
            if(value < unit.prm(Prm.DRK).total + 1){
                unit.removeCondition(this);
                Util.msg.set(`${unit.name}の<毒>が解除された`); await wait();
                return;
            }

            let dmg = new Dmg({absPow:value});

            Util.msg.set("＞毒", Color.RED);

            unit.doDmg(dmg); await wait();

            unit.setCondition(this, value * 0.666);
        }
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV2
    //
    //--------------------------------------------------------------------------
    export const             眠:Condition = new class extends Condition{
        constructor(){super("眠", ConditionType.BAD_LV2);}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            pForce.phaseSkip = true;
            Util.msg.set(`${unit.name}は眠っている...`); await wait();
            
            unit.addConditionValue(this, -1);
        }

        async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.鎖術, TecType.過去, TecType.銃術) && Math.random() < 0.5){
                target.removeCondition(this);
                Util.msg.set(`${target.name}は目を覚ました！`); await wait();
            }
        }
    };
    export const             石:Condition = new class extends Condition{
        constructor(){super("石", ConditionType.BAD_LV2);}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            pForce.phaseSkip = true;
            Util.msg.set(`${unit.name}は動けない...`); await wait();
            
            unit.addConditionValue(this, -1);
        }
    };
    /**一定確率で行動不能になる。 */
    export const             鎖:Condition = new class extends Condition{
        constructor(){super("鎖", ConditionType.BAD_LV2);}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            if(Math.random() < 0.5){
                pForce.phaseSkip = true;
                Util.msg.set(`${unit.name}は鎖に縛られている...`); await wait();
                
                unit.addConditionValue(this, -1);
            }
        }
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV3
    //
    //--------------------------------------------------------------------------
}



export class InvisibleCondition extends Force{
}