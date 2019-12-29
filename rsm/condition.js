var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Force, Dmg, Heal } from "./force.js";
import { Tec } from "./tec.js";
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
export class Condition {
    constructor(uniqueName, type) {
        this.uniqueName = uniqueName;
        this.type = type;
        Condition._values.push(this);
        if (Condition._valueOf.has(this.uniqueName)) {
            console.log(`Condition already has uniqueName "${this.uniqueName}".`);
        }
        else {
            Condition._valueOf.set(this.uniqueName, this);
        }
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
    toString() { return `${this.uniqueName}`; }
    get force() { return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this)); }
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
        createForce(_this) { return new Force(); }
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV1
    //
    //--------------------------------------------------------------------------
    Condition.練 = new class extends Condition {
        constructor() { super("練", ConditionType.GOOD_LV1); }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "神格", "鎖術", "銃", "弓")) {
                            Util.msg.set("＞練");
                            dmg.pow.mul *= (1 + dmg.attacker.getConditionValue(_this) * 0.5);
                            dmg.attacker.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    Condition.格鎖無効 = new class extends Condition {
        constructor() { super("格鎖無効", ConditionType.GOOD_LV1); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "鎖術")) {
                            Util.msg.set("＞無効");
                            dmg.pow.base = 0;
                            dmg.attacker.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    Condition.魔過無効 = new class extends Condition {
        constructor() { super("魔過無効", ConditionType.GOOD_LV1); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("魔法", "過去")) {
                            Util.msg.set("＞無効");
                            dmg.pow.base = 0;
                            dmg.attacker.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    Condition.銃弓無効 = new class extends Condition {
        constructor() { super("銃弓無効", ConditionType.GOOD_LV1); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃", "弓")) {
                            Util.msg.set("＞無効");
                            dmg.pow.base = 0;
                            dmg.attacker.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    /**操作不能、勝手に殴る。格闘攻撃倍率x2。*/
    Condition.暴走 = new class extends Condition {
        constructor() { super("暴走", ConditionType.GOOD_LV1); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        pForce.phaseSkip = true;
                        Util.msg.set(`${unit.name}は暴走している...`);
                        yield wait();
                        const targets = unit.searchUnits(Tec.殴る.targetings, Tec.殴る.rndAttackNum(unit));
                        yield Tec.殴る.use(unit, targets);
                        unit.addConditionValue(_this, -1);
                    });
                }
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘")) {
                            dmg.pow.mul *= 2;
                        }
                    });
                }
            };
        }
    };
    /**行動開始時最大HP+10% */
    Condition.体力上昇 = new class extends Condition {
        constructor() { super("体力上昇", ConditionType.GOOD_LV1); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.prm(Prm.MAX_HP).battle += unit.prm(Prm.MAX_HP).get("base", "eq") * 0.1;
                        unit.addConditionValue(_this, -1);
                    });
                }
            };
        }
    };
    /**行動開始時TP+1 */
    Condition.風 = new class extends Condition {
        constructor() { super("風", ConditionType.GOOD_LV1); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.tp += 1;
                        unit.addConditionValue(_this, -1);
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV2
    //
    //--------------------------------------------------------------------------
    Condition.盾 = new class extends Condition {
        constructor() { super("盾", ConditionType.GOOD_LV2); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "神格", "鎖術", "銃", "弓")) {
                            Util.msg.set("＞盾");
                            dmg.pow.mul /= (1 + dmg.target.getConditionValue(_this) * 0.5);
                            dmg.target.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    Condition.雲 = new class extends Condition {
        constructor() { super("雲", ConditionType.GOOD_LV2); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("魔法", "神格", "過去")) {
                            Util.msg.set("＞雲");
                            dmg.pow.mul /= (1 + dmg.target.getConditionValue(_this) * 0.5);
                            dmg.target.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    Condition.回避 = new class extends Condition {
        constructor() { super("回避", ConditionType.GOOD_LV2); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "槍", "鎖術", "銃", "弓", "怨霊")) {
                            dmg.hit.mul = 0;
                            dmg.target.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    Condition.吸収 = new class extends Condition {
        constructor() { super("吸収", ConditionType.GOOD_LV2); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "神格", "怨霊", "鎖術", "銃", "弓")) {
                            Unit.set吸収Inv(dmg.target, () => dmg.target.addConditionValue(_this, -1));
                        }
                    });
                }
            };
        }
    };
    Condition.バリア = new class extends Condition {
        constructor() { super("バリア", ConditionType.GOOD_LV2); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!dmg.hasType("槍", "怨霊")) {
                            Util.msg.set("＞バリア");
                            dmg.pow.mul = 0;
                            dmg.target.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    Condition.反射 = new class extends Condition {
        constructor() { super("反射", ConditionType.GOOD_LV2); }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("魔法", "神格", "過去")) {
                            Unit.set反射Inv(dmg.target);
                            dmg.target.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //GOOD_LV3
    //
    //--------------------------------------------------------------------------
    Condition.癒 = new class extends Condition {
        constructor() { super("癒", ConditionType.GOOD_LV3); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Heal.run("HP", unit.prm(Prm.MAX_HP).total * 0.1, unit, unit, Condition.癒, false);
                        unit.addConditionValue(_this, -1);
                    });
                }
            };
        }
    };
    Condition.治 = new class extends Condition {
        constructor() { super("治", ConditionType.GOOD_LV3); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Heal.run("HP", unit.prm(Prm.MAX_HP).total * 0.2, unit, unit, Condition.治, false);
                        unit.addConditionValue(_this, -1);
                    });
                }
            };
        }
    };
    Condition.約束 = new class extends Condition {
        constructor() { super("約束", ConditionType.GOOD_LV3); }
        toString() { return "約"; }
        createForce(_this) {
            return new class extends Force {
                whenDead(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!unit.dead) {
                            return;
                        }
                        unit.dead = false;
                        Heal.run("HP", unit.prm(Prm.MAX_HP).total * 0.45, unit, unit, Condition.約束, false);
                        Util.msg.set(`${unit.name}は生き返った！`);
                        yield wait();
                        unit.addConditionValue(_this, -1);
                    });
                }
            };
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
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.addConditionValue(_this, -1);
                    });
                }
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Util.msg.set("＞攻↓");
                        dmg.pow.mul *= 0.5;
                    });
                }
            };
        }
    };
    Condition.防御低下 = new class extends Condition {
        constructor() { super("防御低下", ConditionType.BAD_LV1); }
        toString() { return "防↓"; }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Util.msg.set("＞防↓");
                        dmg.def.mul *= 0.5;
                        dmg.target.addConditionValue(_this, -1);
                    });
                }
            };
        }
    };
    Condition.命中低下 = new class extends Condition {
        constructor() { super("命中低下", ConditionType.BAD_LV1); }
        toString() { return "命中↓"; }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.addConditionValue(_this, -1);
                    });
                }
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        dmg.hit.mul *= 0.8;
                    });
                }
            };
        }
    };
    Condition.毒 = new class extends Condition {
        constructor() { super("毒", ConditionType.BAD_LV1); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const value = unit.getConditionValue(_this);
                        Util.msg.set("＞毒", Color.RED);
                        const dmg = new Dmg({
                            attacker: unit,
                            target: unit,
                            absPow: value,
                            types: ["毒"],
                        });
                        yield dmg.run();
                        yield wait();
                        unit.setCondition(_this, value * 0.666);
                        if (unit.getConditionValue(_this) < unit.prm(Prm.DRK).total + 1) {
                            unit.removeCondition(_this);
                            Util.msg.set(`${unit.name}の＜毒＞が解除された`);
                            yield wait();
                        }
                    });
                }
            };
        }
    };
    Condition.契約 = new class extends Condition {
        constructor() { super("契約", ConditionType.BAD_LV1); }
        createForce(_this) { return new Force(); }
    };
    Condition.疲労 = new class extends Condition {
        constructor() { super("疲労", ConditionType.BAD_LV1); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.tp -= unit.prm(Prm.MAX_TP).total * 0.1;
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //BAD_LV2
    //
    //--------------------------------------------------------------------------
    Condition.眠 = new class extends Condition {
        constructor() { super("眠", ConditionType.BAD_LV2); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        pForce.phaseSkip = true;
                        Util.msg.set(`${unit.name}は眠っている...`);
                        yield wait();
                        unit.addConditionValue(_this, -1);
                    });
                }
                afterBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "鎖術", "過去", "銃") && Math.random() < 0.5) {
                            dmg.target.removeCondition(_this);
                            Util.msg.set(`${dmg.target.name}は目を覚ました！`);
                            yield wait();
                        }
                    });
                }
            };
        }
    };
    Condition.石 = new class extends Condition {
        constructor() { super("石", ConditionType.BAD_LV2); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        pForce.phaseSkip = true;
                        Util.msg.set(`${unit.name}は動けない...`);
                        yield wait();
                        unit.addConditionValue(_this, -1);
                    });
                }
            };
        }
    };
    /**一定確率で行動不能になる。 */
    Condition.鎖 = new class extends Condition {
        constructor() { super("鎖", ConditionType.BAD_LV2); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (Math.random() < 0.5) {
                            pForce.phaseSkip = true;
                            Util.msg.set(`${unit.name}は鎖に縛られている...`);
                            yield wait();
                            unit.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    /**1/2の確率で味方を殴る。 */
    Condition.混乱 = new class extends Condition {
        constructor() { super("混乱", ConditionType.BAD_LV2); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (Math.random() < 0.5) {
                            pForce.phaseSkip = true;
                            Util.msg.set(`${unit.name}は混乱している...`);
                            yield wait();
                            const targets = unit.searchUnits(Tec.混乱殴り.targetings, Tec.混乱殴り.rndAttackNum(unit));
                            yield Tec.混乱殴り.use(unit, targets);
                            unit.addConditionValue(_this, -1);
                        }
                    });
                }
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "槍", "鎖術", "機械", "怨霊") && Math.random() < 0.5) {
                            dmg.target.addConditionValue(_this, -1);
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-BAD_LV2
    //BAD_LV3
    //
    //--------------------------------------------------------------------------
    /** */
    Condition.病気 = new class extends Condition {
        constructor() { super("病気", ConditionType.BAD_LV3); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Util.msg.set("＞病気", Color.RED);
                        const value = unit.getConditionValue(_this);
                        for (const t of unit.searchUnitsEx("party")) {
                            const dmg = new Dmg({
                                attacker: unit,
                                target: t,
                                absPow: value,
                                types: ["毒"],
                            });
                            yield dmg.run();
                            yield wait();
                        }
                        unit.setCondition(_this, value * 0.666);
                        if (unit.getConditionValue(_this) < unit.prm(Prm.DRK).total + 1) {
                            unit.removeCondition(_this);
                            Util.msg.set(`${unit.name}の＜病気＞が解除された`);
                            yield wait();
                        }
                    });
                }
            };
        }
    };
    Condition.衰弱 = new class extends Condition {
        constructor() { super("衰弱", ConditionType.BAD_LV3); }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Util.msg.set("＞衰弱", Color.RED);
                        const lim = 3999;
                        let value = unit.prm(Prm.MAX_HP).total * 0.1;
                        if (value > lim) {
                            value = lim;
                        }
                        unit.prm(Prm.MAX_HP).battle -= value;
                        unit.addConditionValue(_this, -1);
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-BAD_LV3
    //
    //--------------------------------------------------------------------------
})(Condition || (Condition = {}));
export class InvisibleCondition {
    get force() { return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this)); }
    createForce(_this) { return new Force(); }
}
