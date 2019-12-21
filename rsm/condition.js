var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Force, Dmg, Targeting } from "./force.js";
import { Tec, TecType, ActiveTec } from "./tec.js";
import { Unit, Prm } from "./unit.js";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Color } from "./undym/type.js";
export class ConditionType {
    constructor(uniqueName) {
        this.uniqueName = uniqueName;
        this.ordinal = ConditionType.ordinalNow++;
        ConditionType._values.push(this);
    }
    static get values() {
        return ConditionType._values;
    }
    static goodConditions() {
        if (!this._goodConditions) {
            this._goodConditions = [
                this.GOOD_LV1,
                this.GOOD_LV2,
                this.GOOD_LV3,
            ];
        }
        return this._goodConditions;
    }
    static badConditions() {
        if (!this._badConditions) {
            this._badConditions = [
                this.BAD_LV1,
                this.BAD_LV2,
                this.BAD_LV3,
            ];
        }
        return this._badConditions;
    }
}
ConditionType._values = [];
ConditionType.ordinalNow = 0;
ConditionType.GOOD_LV1 = new ConditionType("GOOD_LV1");
ConditionType.GOOD_LV2 = new ConditionType("GOOD_LV2");
ConditionType.GOOD_LV3 = new ConditionType("GOOD_LV3");
ConditionType.BAD_LV1 = new ConditionType("BAD_LV1");
ConditionType.BAD_LV2 = new ConditionType("BAD_LV2");
ConditionType.BAD_LV3 = new ConditionType("BAD_LV3");
export class Condition extends Force {
    constructor(uniqueName, type) {
        super();
        this.uniqueName = uniqueName;
        this.type = type;
        Condition._values.push(this);
        Condition._valueOf.set(this.uniqueName, this);
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
    toString() { return `${this.uniqueName}`; }
}
Condition._values = [];
Condition._valueOf = new Map();
(function (Condition) {
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    Condition.empty = new class extends Condition {
        constructor() { super("empty", ConditionType.GOOD_LV1); }
        toString() { return ""; }
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV1
    //
    //--------------------------------------------------------------------------
    Condition.練 = new class extends Condition {
        constructor() { super("練", ConditionType.GOOD_LV1); }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.神格, TecType.鎖術, TecType.銃)) {
                    Util.msg.set("＞練");
                    dmg.pow.mul *= (1 + attacker.getConditionValue(this) * 0.5);
                    attacker.addConditionValue(this, -1);
                }
            });
        }
    };
    Condition.格鎖無効 = new class extends Condition {
        constructor() { super("格鎖無効", ConditionType.GOOD_LV1); }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.鎖術)) {
                    Util.msg.set("＞無効");
                    dmg.pow.base = 0;
                    attacker.addConditionValue(this, -1);
                }
            });
        }
    };
    Condition.魔過無効 = new class extends Condition {
        constructor() { super("魔過無効", ConditionType.GOOD_LV1); }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.過去)) {
                    Util.msg.set("＞無効");
                    dmg.pow.base = 0;
                    attacker.addConditionValue(this, -1);
                }
            });
        }
    };
    Condition.銃弓無効 = new class extends Condition {
        constructor() { super("銃弓無効", ConditionType.GOOD_LV1); }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.銃, TecType.弓)) {
                    Util.msg.set("＞無効");
                    dmg.pow.base = 0;
                    attacker.addConditionValue(this, -1);
                }
            });
        }
    };
    /**操作不能、勝手に殴る。格闘攻撃倍率x2。*/
    Condition.暴走 = new class extends Condition {
        constructor() { super("暴走", ConditionType.GOOD_LV1); }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                pForce.phaseSkip = true;
                Util.msg.set(`${unit.name}は暴走している...`);
                yield wait();
                const targets = Targeting.filter(Tec.殴る.targetings, unit, Unit.all, Tec.殴る.rndAttackNum());
                yield Tec.殴る.use(unit, targets);
                unit.addConditionValue(this, -1);
            });
        }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘)) {
                    dmg.pow.mul *= 2;
                }
            });
        }
    };
    /**行動開始時最大HP+10% */
    Condition.体力上昇 = new class extends Condition {
        constructor() { super("体力上昇", ConditionType.GOOD_LV1); }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                unit.prm(Prm.MAX_HP).battle += unit.prm(Prm.MAX_HP).get("base", "eq") * 0.1;
                unit.addConditionValue(this, -1);
            });
        }
    };
    // export const             狙:Condition = new class extends Condition{
    //     constructor(){super("狙", ConditionType.GOOD_LV1);}
    //     async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec){
    //             dmg.hit.mul *= 1.2;
    //             attacker.addConditionValue(this, -1);
    //         }
    //     }
    // };
    // export const             闇:Condition = new class extends Condition{
    //     constructor(){super("闇", ConditionType.GOOD_LV1);}
    //     async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec){
    //             Util.msg.set("＞闇"); await wait();
    //             dmg.pow.add += attacker.prm(Prm.DRK).total;
    //             attacker.addConditionValue(this, -1);
    //         }
    //     }
    // };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV2
    //
    //--------------------------------------------------------------------------
    Condition.盾 = new class extends Condition {
        constructor() { super("盾", ConditionType.GOOD_LV2); }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.神格, TecType.鎖術, TecType.銃)) {
                    Util.msg.set("＞盾");
                    dmg.pow.mul /= (1 + target.getConditionValue(this) * 0.5);
                    target.addConditionValue(this, -1);
                }
            });
        }
    };
    Condition.雲 = new class extends Condition {
        constructor() { super("雲", ConditionType.GOOD_LV2); }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.暗黒, TecType.過去, TecType.弓)) {
                    Util.msg.set("＞雲");
                    dmg.pow.mul /= (1 + target.getConditionValue(this) * 0.5);
                    target.addConditionValue(this, -1);
                }
            });
        }
    };
    Condition.回避 = new class extends Condition {
        constructor() { super("回避", ConditionType.GOOD_LV2); }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.槍, TecType.鎖術, TecType.銃, TecType.弓, TecType.怨霊)) {
                    dmg.hit.mul = 0;
                    target.addConditionValue(this, -1);
                }
            });
        }
    };
    Condition.吸収 = new class extends Condition {
        constructor() { super("吸収", ConditionType.GOOD_LV2); }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.神格, TecType.鎖術, TecType.銃)) {
                    const value = dmg.calc().value;
                    Unit.healHP(target, value);
                    Util.msg.set(`＞${value}のダメージを吸収`, Color.GREEN);
                    yield wait();
                    dmg.pow.mul = 0;
                    target.addConditionValue(this, -1);
                }
            });
        }
    };
    Condition.バリア = new class extends Condition {
        constructor() { super("バリア", ConditionType.GOOD_LV2); }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && !action.type.any(TecType.槍, TecType.怨霊)) {
                    Util.msg.set("＞バリア");
                    dmg.pow.mul = 0;
                    target.addConditionValue(this, -1);
                }
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV3
    //
    //--------------------------------------------------------------------------
    Condition.癒 = new class extends Condition {
        constructor() { super("癒", ConditionType.GOOD_LV3); }
        phaseStart(unit) {
            return __awaiter(this, void 0, void 0, function* () {
                Unit.healHP(unit, unit.prm(Prm.MAX_HP).total * 0.1);
                unit.addConditionValue(this, -1);
            });
        }
    };
    Condition.治 = new class extends Condition {
        constructor() { super("治", ConditionType.GOOD_LV3); }
        phaseStart(unit) {
            return __awaiter(this, void 0, void 0, function* () {
                Unit.healHP(unit, unit.prm(Prm.MAX_HP).total * 0.2);
                unit.addConditionValue(this, -1);
            });
        }
    };
    Condition.約束 = new class extends Condition {
        constructor() { super("約束", ConditionType.GOOD_LV3); }
        toString() { return "約"; }
        whenDead(unit) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!unit.dead) {
                    return;
                }
                unit.dead = false;
                Unit.healHP(unit, unit.prm(Prm.MAX_HP).total * 0.45);
                Util.msg.set(`${unit.name}は生き返った！`);
                yield wait();
                unit.addConditionValue(this, -1);
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV1
    //
    //--------------------------------------------------------------------------
    Condition.攻撃低下 = new class extends Condition {
        constructor() { super("攻撃低下", ConditionType.BAD_LV1); }
        toString() { return "攻↓"; }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                unit.addConditionValue(this, -1);
            });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec) {
                    Util.msg.set("＞攻↓");
                    dmg.pow.mul *= 0.5;
                }
            });
        }
    };
    Condition.防御低下 = new class extends Condition {
        constructor() { super("防御低下", ConditionType.BAD_LV1); }
        toString() { return "防↓"; }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec) {
                    Util.msg.set("＞防↓");
                    dmg.def.mul *= 0.5;
                    target.addConditionValue(this, -1);
                }
            });
        }
    };
    Condition.命中低下 = new class extends Condition {
        constructor() { super("命中低下", ConditionType.BAD_LV1); }
        toString() { return "命中↓"; }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                unit.addConditionValue(this, -1);
            });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec) {
                    dmg.hit.mul *= 0.8;
                }
            });
        }
    };
    Condition.毒 = new class extends Condition {
        constructor() { super("毒", ConditionType.BAD_LV1); }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                const value = unit.getConditionValue(this);
                Util.msg.set("＞毒", Color.RED);
                yield unit.doDmg(new Dmg({ absPow: value, types: ["毒"] }));
                yield wait();
                unit.setCondition(this, value * 0.666);
                if (unit.getConditionValue(this) < unit.prm(Prm.DRK).total + 1) {
                    unit.removeCondition(this);
                    Util.msg.set(`${unit.name}の＜毒＞が解除された`);
                    yield wait();
                }
            });
        }
    };
    Condition.契約 = new class extends Condition {
        constructor() { super("契約", ConditionType.BAD_LV1); }
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV2
    //
    //--------------------------------------------------------------------------
    Condition.眠 = new class extends Condition {
        constructor() { super("眠", ConditionType.BAD_LV2); }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                pForce.phaseSkip = true;
                Util.msg.set(`${unit.name}は眠っている...`);
                yield wait();
                unit.addConditionValue(this, -1);
            });
        }
        afterBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘, TecType.鎖術, TecType.過去, TecType.銃) && Math.random() < 0.5) {
                    target.removeCondition(this);
                    Util.msg.set(`${target.name}は目を覚ました！`);
                    yield wait();
                }
            });
        }
    };
    Condition.石 = new class extends Condition {
        constructor() { super("石", ConditionType.BAD_LV2); }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                pForce.phaseSkip = true;
                Util.msg.set(`${unit.name}は動けない...`);
                yield wait();
                unit.addConditionValue(this, -1);
            });
        }
    };
    /**一定確率で行動不能になる。 */
    Condition.鎖 = new class extends Condition {
        constructor() { super("鎖", ConditionType.BAD_LV2); }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Math.random() < 0.5) {
                    pForce.phaseSkip = true;
                    Util.msg.set(`${unit.name}は鎖に縛られている...`);
                    yield wait();
                    unit.addConditionValue(this, -1);
                }
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV3
    //
    //--------------------------------------------------------------------------
    /** */
    Condition.病気 = new class extends Condition {
        constructor() { super("病気", ConditionType.BAD_LV3); }
        phaseStart(unit, pForce) {
            return __awaiter(this, void 0, void 0, function* () {
                Util.msg.set("＞病気", Color.RED);
                const value = unit.getConditionValue(this);
                for (const t of unit.searchUnits("party")) {
                    yield t.doDmg(new Dmg({ absPow: value, types: ["毒"] }));
                    yield wait();
                }
                unit.setCondition(this, value * 0.666);
                if (unit.getConditionValue(this) < unit.prm(Prm.DRK).total + 1) {
                    unit.removeCondition(this);
                    Util.msg.set(`${unit.name}の＜病気＞が解除された`);
                    yield wait();
                }
            });
        }
    };
})(Condition || (Condition = {}));
export class InvisibleCondition extends Force {
}
