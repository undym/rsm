var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Unit, Prm, PUnit, EUnit } from "./unit.js";
import { Util, Place } from "./util.js";
import { wait } from "./undym/scene.js";
import { Force, Dmg, AttackNumForce, Heal } from "./force.js";
import { Condition, ConditionType, InvisibleCondition } from "./condition.js";
import { Color } from "./undym/type.js";
import { FX_Str, FX_格闘, FX_魔法, FX_神格, FX_暗黒, FX_鎖術, FX_過去, FX_銃, FX_回復, FX_吸収, FX_弓, FX_ナーガ, FX_Poison, FX_Buff, FX_RotateStr, FX_PetDie, FX_機械, FX_BOM, FX_ナーガ着弾, FX_Debuff, FX_RemoveCondition, FX_槍, FX_XP, FX_EP, FX_約束 } from "./fx/fx.js";
import { Font } from "./graphics/graphics.js";
import { Battle } from "./battle.js";
import { Item } from "./item.js";
import { randomInt } from "./undym/random.js";
import { Sound } from "./sound.js";
import { Pet } from "./pet.js";
import { Player } from "./player.js";
export class TecSort {
    constructor(name) {
        this.name = name;
        TecSort._values.push(this);
    }
    static get values() { return this._values; }
    get tecs() {
        if (!this._tecs) {
            let actives = ActiveTec.values.filter(tec => tec.sortType === this);
            let passives = PassiveTec.values.filter(tec => tec.sortType === this);
            let tmp = [];
            this._tecs = tmp.concat(actives, passives);
        }
        return this._tecs;
    }
    toString() { return this.name; }
}
TecSort._values = [];
TecSort.格闘 = new TecSort("格闘");
TecSort.魔法 = new TecSort("魔法");
TecSort.神格 = new TecSort("神格");
TecSort.暗黒 = new TecSort("暗黒");
TecSort.鎖術 = new TecSort("鎖術");
TecSort.過去 = new TecSort("過去");
TecSort.銃 = new TecSort("銃");
TecSort.弓 = new TecSort("弓");
TecSort.強化 = new TecSort("強化");
TecSort.弱体 = new TecSort("弱体");
TecSort.回復 = new TecSort("回復");
TecSort.その他 = new TecSort("その他");
export class TecType {
    constructor(name) {
        this.name = name;
        TecType._values.push(this);
    }
    static get values() { return this._values; }
    toString() { return this.name; }
    /**一つでも当てはまればtrue. */
    any(...types) {
        for (const t of types) {
            if (this === t) {
                return true;
            }
        }
        return false;
    }
}
TecType._values = [];
(function (TecType) {
    TecType.格闘 = new class extends TecType {
        constructor() { super("格闘"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.STR).total + attacker.prm(Prm.LV).total * 0.3,
                def: target.prm(Prm.MAG).total,
                types: ["格闘"],
            });
        }
        effect(attacker, target) { FX_格闘(target.imgBounds.center); }
        sound() { Sound.PUNCH.play(); }
        getCounterTec() { return Tec.格闘反撃; }
    };
    TecType.槍 = new class extends TecType {
        constructor() { super("槍"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.STR).total + attacker.prm(Prm.ARR).total + attacker.prm(Prm.LV).total * 0.3,
                def: target.prm(Prm.MAG).total,
                types: ["槍"],
            });
        }
        effect(attacker, target) { FX_槍(target.imgBounds.center); }
        sound() { Sound.yari.play(); }
        getCounterTec() { return Tec.格闘反撃; }
    };
    TecType.魔法 = new class extends TecType {
        constructor() { super("魔法"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.MAG).total + attacker.prm(Prm.LV).total * 0.3,
                def: target.prm(Prm.STR).total,
                types: ["魔法"],
            });
        }
        effect(attacker, target) { FX_魔法(target.imgBounds.center); }
        sound() { Sound.MAGIC.play(); }
        getCounterTec() { return Tec.魔法反撃; }
    };
    TecType.神格 = new class extends TecType {
        constructor() { super("神格"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.LIG).total * 0.85 + attacker.prm(Prm.LV).total * 0.3,
                def: target.prm(Prm.DRK).total,
                types: ["神格"],
            });
        }
        effect(attacker, target) { FX_神格(target.imgBounds.center); }
        sound() { Sound.sin.play(); }
        getCounterTec() { return Tec.神格反撃; }
    };
    TecType.暗黒 = new class extends TecType {
        constructor() { super("暗黒"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.DRK).total + attacker.prm(Prm.LV).total * 0.5,
                def: target.prm(Prm.LIG).total,
                types: ["暗黒"],
            });
        }
        effect(attacker, target) { FX_暗黒(target.imgBounds.center); }
        sound() { Sound.KEN.play(); }
        getCounterTec() { return Tec.暗黒反撃; }
    };
    //ghost/500
    //be30dmg = 15000ghost
    //15000ghost -> do300dmg
    //300 / 15000 = 3 / 150 = 1 / 50
    TecType.怨霊 = new class extends TecType {
        constructor() { super("怨霊"); }
        createDmg(attacker, target) {
            const pow = attacker.tecs.some(tec => tec === Tec.怨霊使い)
                ? attacker.prm(Prm.GHOST).total * 0.02
                : attacker.prm(Prm.GHOST).total * 0.002;
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: pow,
                def: target.prm(Prm.LIG).total * 3,
                types: ["怨霊"],
            });
        }
        effect(attacker, target) { FX_暗黒(target.imgCenter); }
        sound() { Sound.KEN.play(); }
        getCounterTec() { return Tec.暗黒反撃; }
    };
    TecType.鎖術 = new class extends TecType {
        constructor() { super("鎖術"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.CHN).total + attacker.prm(Prm.LV).total * 0.3,
                def: target.prm(Prm.PST).total,
                types: ["鎖術"],
            });
        }
        effect(attacker, target) { FX_鎖術(attacker.imgBounds.center, target.imgBounds.center); }
        sound() { Sound.chain.play(); }
        getCounterTec() { return Tec.鎖術反撃; }
    };
    TecType.過去 = new class extends TecType {
        constructor() { super("過去"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.PST).total + attacker.prm(Prm.LV).total * 0.3,
                def: target.prm(Prm.CHN).total,
                types: ["過去"],
            });
        }
        effect(attacker, target) { FX_過去(attacker.imgCenter, target.imgCenter); }
        sound() { Sound.kako.play(); }
        getCounterTec() { return Tec.過去反撃; }
    };
    TecType.銃 = new class extends TecType {
        constructor() { super("銃"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.GUN).total + attacker.prm(Prm.LV).total * 0.3,
                def: target.prm(Prm.ARR).total,
                types: ["銃"],
            });
        }
        effect(attacker, target) { FX_銃(attacker.imgBounds.center, target.imgBounds.center); }
        sound() { Sound.gun.play(); }
        getCounterTec() { return Tec.銃反撃; }
    };
    TecType.機械 = new class extends TecType {
        constructor() { super("機械"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.GUN).total * 0.4 + attacker.prm(Prm.LV).total * 1,
                def: target.prm(Prm.ARR).total,
                types: ["機械"],
            });
        }
        effect(attacker, target) { FX_機械(attacker.imgBounds.center, target.imgBounds.center); }
        sound() { Sound.lazer.play(); }
        getCounterTec() { return Tec.銃反撃; }
    };
    TecType.弓 = new class extends TecType {
        constructor() { super("弓"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                pow: attacker.prm(Prm.ARR).total * 2 + attacker.prm(Prm.LV).total * 0.2,
                def: target.prm(Prm.GUN).total,
                types: ["弓"],
            });
        }
        effect(attacker, target) { FX_弓(attacker.imgBounds.center, target.imgBounds.center); }
        sound() { Sound.ya.play(); }
        getCounterTec() { return Tec.弓反撃; }
    };
    TecType.状態 = new class extends TecType {
        constructor() { super("状態"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
            });
        }
        effect(attacker, target) { }
        sound() { }
        getCounterTec() { return Tec.格闘反撃; }
    };
    TecType.回復 = new class extends TecType {
        constructor() { super("回復"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
                absPow: attacker.prm(Prm.LIG).total + attacker.prm(Prm.LV).total,
            });
        }
        effect(attacker, target) { FX_回復(target.imgBounds.center); }
        sound() { }
        getCounterTec() { return Tec.格闘反撃; }
    };
    TecType.その他 = new class extends TecType {
        constructor() { super("その他"); }
        createDmg(attacker, target) {
            return new Dmg({
                attacker: attacker,
                target: target,
            });
        }
        effect(attacker, target) { }
        sound() { }
        getCounterTec() { return Tec.格闘反撃; }
    };
    // export const             ペット = new class extends TecType{
    //     constructor(){super("ペット");}
    //     createDmg(attacker:Unit, target:Unit):Dmg{return new Dmg({pow:attacker.prm(Prm.LV).total});}
    //     effect(attacker:Unit, target:Unit, dmg:Dmg){}
    //     sound(){}
    // };
})(TecType || (TecType = {}));
export class Tec {
    constructor(uniqueName, info, sortType, type) {
        this.uniqueName = uniqueName;
        this.info = info;
        this.sortType = sortType;
        this.type = type;
    }
    static get empty() {
        return this._empty ? this._empty : (this._empty = new class extends Tec {
            constructor() { super("empty", "", TecSort.格闘, TecType.格闘); }
            get force() { return Force.empty; }
            createForce(_this) { return Force.empty; }
        });
    }
    get force() { return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this)); }
}
export class PassiveTec extends Tec {
    constructor(args) {
        super(args.uniqueName, args.info, args.sort, args.type);
        PassiveTec._values.push(this);
        if (PassiveTec._valueOf.has(this.uniqueName)) {
            console.log(`PassiveTec already has uniqueName "${this.uniqueName}".`);
        }
        else {
            PassiveTec._valueOf.set(this.uniqueName, this);
        }
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
    toString() { return `-${this.uniqueName}-`; }
}
PassiveTec._values = [];
PassiveTec._valueOf = new Map();
export class ActiveTec extends Tec {
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    constructor(args) {
        super(args.uniqueName, args.info, args.sort, args.type);
        this.args = args;
        ActiveTec._values.push(this);
        if (ActiveTec._valueOf.has(this.uniqueName)) {
            console.log(`!!ActiveTec already has uniqueName "${this.uniqueName}".`);
        }
        else {
            ActiveTec._valueOf.set(this.uniqueName, this);
        }
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) { return this._valueOf.get(uniqueName); }
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    get costs() {
        const res = [];
        if (this.args.mp) {
            res.push({ prm: Prm.MP, value: this.args.mp });
        }
        if (this.args.tp) {
            res.push({ prm: Prm.TP, value: this.args.tp });
        }
        if (this.args.ep) {
            res.push({ prm: Prm.EP, value: this.args.ep });
        }
        if (this.args.sp) {
            res.push({ prm: Prm.SP, value: this.args.sp });
        }
        if (this.args.xp) {
            res.push({ prm: Prm.XP, value: this.args.xp });
        }
        return res;
    }
    get itemCost() {
        if (this.args.item) {
            let res = [];
            for (const set of this.args.item()) {
                res.push({ item: set[0], num: set[1] });
            }
            return res;
        }
        return [];
    }
    /**攻撃倍率 */
    get mul() { return this.args.mul; }
    /**固定の基礎攻撃回数を得る。実際の攻撃回数はrndAttackNum()で得る。 */
    get baseAttackNum() { return this.args.num; }
    /**攻撃回数生成.継承禁止。継承する場合はrndAttackNumInner()を継承する。*/
    rndAttackNum(unit) { return this.rndAttackNumInner(unit); }
    /**攻撃回数生成 */
    rndAttackNumInner(unit) {
        const aForce = new AttackNumForce(this.args.num);
        unit.attackNum(this, aForce);
        return aForce.total;
    }
    get hit() { return this.args.hit; }
    get targetings() { return this.args.targetings; }
    get counter() { return this.args.counter ? true : false; }
    createForce(_this) { return Force.empty; }
    ;
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    checkCost(u) {
        if (u instanceof PUnit) {
            for (const set of this.itemCost) {
                if (set.item.remainingUseNum < set.num) {
                    return false;
                }
            }
        }
        for (const cost of this.costs) {
            if (cost.value > u.prm(cost.prm).base) {
                return false;
            }
        }
        return true;
    }
    payCost(u) {
        for (const cost of this.costs) {
            u.prm(cost.prm).base -= cost.value;
        }
        if (u instanceof PUnit) {
            for (const set of this.itemCost) {
                set.item.remainingUseNum -= set.num;
            }
        }
    }
    effect(attacker, target) {
        this.type.effect(attacker, target);
    }
    sound() {
        this.type.sound();
    }
    useMessage(attacker) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.args.ep) {
                FX_EP(attacker.imgCenter);
                Sound.ep.play();
            }
            if (this.args.xp) {
                FX_XP(Place.MAIN);
                Sound.xp.play();
            }
            Util.msg.set(`${attacker.name}の[${this}]`, Color.D_GREEN.bright);
            yield wait();
        });
    }
    use(attacker, targets) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.useMessage(attacker);
            if (targets.length === 0) {
                return;
            }
            if (!this.checkCost(attacker)) {
                Util.msg.set("コストを支払えなかった");
                yield wait();
                return;
            }
            this.payCost(attacker);
            for (let t of targets) {
                yield this.run(attacker, t);
            }
        });
    }
    run(attacker, target) {
        return __awaiter(this, void 0, void 0, function* () {
            let dmg = this.createDmg(attacker, target);
            yield attacker.beforeDoAtk(dmg);
            yield target.beforeBeAtk(dmg);
            yield this.runInner(dmg);
            yield attacker.afterDoAtk(dmg);
            yield target.afterBeAtk(dmg);
        });
    }
    runInner(dmg) {
        return __awaiter(this, void 0, void 0, function* () {
            const _wait = () => __awaiter(this, void 0, void 0, function* () {
                if (this.targetings.some(t => t === "all")) {
                    yield wait(1);
                }
                else {
                    yield wait();
                }
            });
            this.effect(dmg.attacker, dmg.target);
            this.sound();
            yield dmg.run();
            yield _wait();
            if (this.counter) {
                yield this.type.getCounterTec().run(dmg.target, dmg.attacker);
                yield _wait();
            }
        });
    }
    createDmg(attacker, target) {
        let dmg = this.type.createDmg(attacker, target);
        dmg.pow.mul = this.mul;
        dmg.hit.base = this.hit;
        dmg.action = this;
        return dmg;
    }
    toString() { return this.uniqueName; }
}
ActiveTec._values = [];
ActiveTec._valueOf = new Map();
(function (Tec) {
    //--------------------------------------------------------------------------
    //
    //格闘Active
    //
    //--------------------------------------------------------------------------
    Tec.殴る = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "殴る", info: "一体に格闘攻撃",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += 1 + Math.random() * 4;
            return dmg;
        }
    };
    /**訓練生. */
    Tec.タックル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "タックル", info: "一体に格闘攻撃x1.5",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1.5, num: 1, hit: 1, tp: 1,
            });
        }
    };
    /**訓練生. */
    Tec.掌覇 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "掌覇", info: "一体とその下のキャラクターに格闘攻撃",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1.5, num: 1, hit: 1, tp: 1,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                for (const u of target.searchUnitsEx("bottom").filter(u => !u.dead)) {
                    yield _super.run.call(this, attacker, u);
                }
            });
        }
    };
    /**剣士. */
    Tec.斬る = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "斬る", info: "一体に格闘攻撃x2　反撃有",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 2, num: 1, hit: 1, tp: 1,
                counter: true,
            });
        }
    };
    /**訓練生. */
    Tec.大いなる動き = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "大いなる動き", info: "敵全体に格闘攻撃",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["all"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
    };
    /**訓練生二年生. */
    Tec.静かなる動き = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "静かなる動き", info: "一体に格闘攻撃 相手の防御値無視 対象の強化状態解除",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.add += target.prm(Prm.STR).total;
            dmg.def.mul = 0;
            return dmg;
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                for (const type of ConditionType.goodConditions()) {
                    target.removeCondition(type);
                }
                yield _super.run.call(this, attacker, target);
            });
        }
    };
    /**剣士. */
    Tec.閻魔の笏 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "閻魔の笏", info: "一体に格闘攻撃5回　反撃有",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 5, hit: 1, ep: 1,
                counter: true,
            });
        }
    };
    /**ドラゴン. */
    Tec.龍撃 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "龍撃", info: "一体に格闘攻撃　相手の防御値を無視",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.def.mul = 0;
            return dmg;
        }
    };
    /**ドラゴン. */
    Tec.ドラゴンテイル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ドラゴンテイル", info: "敵全体に格闘攻撃",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["all"],
                mul: 1, num: 1, hit: 1, tp: 4,
            });
        }
    };
    /**格闘家. */
    Tec.涅槃寂静 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "涅槃寂静", info: "一体に[力+現在HP]分のダメージの格闘攻撃",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = 0;
            dmg.abs.base = attacker.prm(Prm.STR).total + attacker.hp;
            return dmg;
        }
    };
    /**カリストコウモリ. */
    Tec.ひっかく = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ひっかく", info: "一体に格闘攻撃　確率で相手を＜毒＞化　反撃有",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 1,
                counter: true,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                if (Math.random() < 0.7) {
                    yield Tec.ポイズンバタフライ.run(attacker, target);
                }
            });
        }
    };
    /**テンプルナイト. */
    Tec.聖剣 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "聖剣", info: "一体に光値を加算して格闘攻撃",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 2, tp: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.abs.base += attacker.prm(Prm.LIG).total;
            return dmg;
        }
    };
    /**侍. */
    Tec.時雨 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "時雨", info: "一体に格闘攻撃x2",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 2, num: 1, hit: 1, tp: 2,
            });
        }
    };
    /**侍. */
    Tec.五月雨 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "五月雨", info: "一体に格闘攻撃2～4回",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 4,
            });
        }
        rndAttackNumInner(unit) { return randomInt(2, 4, "[]"); }
    };
    /**魔獣ドンゴ. */
    Tec.体当たり = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "体当たり", info: "一体に格闘攻撃x2 確率で相手を＜眠1＞化　反撃有",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 2, num: 1, hit: 1, tp: 2,
                counter: true,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                if (Math.random() < 0.7) {
                    Unit.setCondition(target, Condition.眠, 1);
                }
            });
        }
    };
    /**月狼. */
    Tec.噛みつく = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "噛みつく", info: "一体に格闘攻撃 MP3とTP1を吸収",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 1,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                Sound.drain.play();
                FX_吸収(attacker.imgCenter, target.imgCenter);
                const drainMP = target.mp < 3 ? target.mp : 3;
                const drainTP = target.tp < 1 ? target.tp : 1;
                target.mp -= drainMP;
                target.tp -= drainTP;
                attacker.mp += drainMP;
                attacker.tp += drainTP;
                Util.msg.set(`MP${drainMP}とTP${drainTP}吸収！`);
                yield wait();
            });
        }
    };
    /**ペガサス. */
    Tec.角 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "角", info: "一体に鎖値を加えた格闘攻撃x2",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 2, num: 1, hit: 1, tp: 2,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.CHN).total;
            return dmg;
        }
    };
    /**朱雀. */
    Tec.暴れる = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "暴れる", info: "敵全体に力値分のダメージ  自分にその10%の反動ダメージ",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["all"],
                mul: 1, num: 1, hit: 1, mp: 1, tp: 7,
            });
        }
        use(attacker, targets) {
            const _super = Object.create(null, {
                use: { get: () => super.use }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const check = this.checkCost(attacker);
                _super.use.call(this, attacker, targets);
                if (check) {
                    const dmg = new Dmg({
                        attacker: attacker,
                        target: attacker,
                        absPow: attacker.prm(Prm.STR).total * 0.1
                    });
                    yield dmg.run();
                    yield wait();
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Tec.殴る.sound();
                Tec.殴る.effect(attacker, target);
                const dmg = new Dmg({
                    attacker: attacker,
                    target: target,
                    absPow: attacker.prm(Prm.STR).total
                });
                yield dmg.run();
                yield wait();
            });
        }
    };
    /**朱雀. */
    Tec.踏み潰す = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "踏み潰す", info: "対象に格闘攻撃x3  稀に＜衰弱5＞(毎ターン最大HP-10%)化  反撃有",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 3, num: 1, hit: 1, tp: 7,
                counter: true,
            });
        }
        runInner(dmg) {
            const _super = Object.create(null, {
                runInner: { get: () => super.runInner }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.runInner.call(this, dmg);
                if (dmg.result.isHit && Math.random() < 0.7) {
                    Unit.setCondition(dmg.target, Condition.衰弱, 5);
                }
            });
        }
    };
    /**魔剣士. */
    Tec.魔剣 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "魔剣", info: "一体に格闘攻撃と魔法攻撃  反撃有",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 1, tp: 1,
            });
            this.魔剣格闘Inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "魔剣Inner1", info: "一体に格闘攻撃",
                        sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                        mul: 1, num: 1, hit: 1,
                        counter: true,
                    });
                }
                createDmg(attacker, target) {
                    const dmg = super.createDmg(attacker, target);
                    dmg.action = Tec.魔剣;
                    return dmg;
                }
            };
            this.魔剣魔法Inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "魔剣Inner2", info: "一体に魔法攻撃",
                        sort: TecSort.格闘, type: TecType.魔法, targetings: ["select"],
                        mul: 1, num: 1, hit: 1,
                        counter: true,
                    });
                }
                createDmg(attacker, target) {
                    const dmg = super.createDmg(attacker, target);
                    dmg.action = Tec.魔剣;
                    return dmg;
                }
            };
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.魔剣格闘Inner.run(attacker, target);
                yield this.魔剣魔法Inner.run(attacker, target);
            });
        }
    };
    /**魔剣士. */
    Tec.二人の悲歌 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "二人の悲歌", info: "敵全体に格闘攻撃と魔法攻撃  反撃有",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
            this.二人の悲歌格闘Inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "二人の悲歌Inner1", info: "一体に格闘攻撃",
                        sort: TecSort.格闘, type: TecType.格闘, targetings: ["select"],
                        mul: 1, num: 1, hit: 1,
                        counter: true,
                    });
                }
                createDmg(attacker, target) {
                    const dmg = super.createDmg(attacker, target);
                    dmg.action = Tec.二人の悲歌;
                    return dmg;
                }
            };
            this.二人の悲歌魔法Inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "二人の悲歌Inner2", info: "一体に魔法攻撃",
                        sort: TecSort.格闘, type: TecType.魔法, targetings: ["select"],
                        mul: 1, num: 1, hit: 1,
                        counter: true,
                    });
                }
                createDmg(attacker, target) {
                    const dmg = super.createDmg(attacker, target);
                    dmg.action = Tec.二人の悲歌;
                    return dmg;
                }
            };
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.二人の悲歌格闘Inner.run(attacker, target);
                yield this.二人の悲歌魔法Inner.run(attacker, target);
            });
        }
    };
    /**無習得技. */
    Tec.混乱殴り = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "混乱殴り", info: "！混乱用",
                sort: TecSort.格闘, type: TecType.格闘, targetings: ["random", "friendOnly"],
                mul: 0.5, num: 1, hit: 1,
            });
        }
        toString() { return "殴る"; }
    };
    //--------------------------------------------------------------------------
    //
    //-格闘Active
    //格闘Passive
    //
    //--------------------------------------------------------------------------
    /**格闘家. */
    Tec.格闘攻撃UP = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "格闘攻撃UP", info: "格闘攻撃x1.2",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘")) {
                            dmg.pow.mul *= 1.2;
                        }
                    });
                }
            };
        }
    };
    /**格闘家. */
    Tec.格闘防御UP = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "格闘防御UP", info: "被格闘攻撃-20%",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘")) {
                            dmg.pow.mul *= 0.8;
                        }
                    });
                }
            };
        }
    };
    /**剣士. */
    Tec.パワーファクト = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "パワーファクト", info: "毎ターン力+1%",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let value = (unit.prm(Prm.STR).base + unit.prm(Prm.STR).eq) * 0.01;
                        if (value < 1) {
                            value = 1;
                        }
                        unit.prm(Prm.STR).battle += value;
                    });
                }
            };
        }
    };
    /**ホークマン. */
    Tec.空中浮遊 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "空中浮遊", info: "被格闘攻撃-50%　被銃・弓攻撃命中+50%",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘")) {
                            dmg.pow.mul *= 0.5;
                        }
                        if (dmg.hasType("銃", "弓")) {
                            dmg.hit.mul *= 1.5;
                        }
                    });
                }
            };
        }
    };
    /**未設定. */
    Tec.カウンター = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "カウンター", info: "被格闘攻撃時反撃",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘") && dmg.canCounter) {
                            Util.msg.set("＞カウンター");
                            yield wait();
                            yield Tec.格闘反撃.run(dmg.target, dmg.attacker);
                        }
                    });
                }
            };
        }
    };
    /**忍者. */
    Tec.二刀流 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "二刀流", info: "追加格闘攻撃",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.result.isHit && dmg.hasType("格闘")) {
                            yield new Dmg({
                                attacker: dmg.attacker,
                                target: dmg.target,
                                absPow: dmg.result.value / 2,
                                types: ["追加攻撃"],
                            }).run();
                            yield wait(1);
                        }
                    });
                }
            };
        }
    };
    Tec.我慢 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "我慢", info: "被格闘・神格・鎖術・銃攻撃-20%",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "神格", "鎖術", "銃")) {
                            dmg.pow.mul *= 0.80;
                        }
                    });
                }
            };
        }
    };
    /**侍. */
    Tec.格闘能力UP = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "格闘能力UP", info: "格闘攻撃+20%　被格闘攻撃-20%",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘")) {
                            dmg.pow.mul *= 1.2;
                        }
                    });
                }
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘")) {
                            dmg.pow.mul *= 0.8;
                        }
                    });
                }
            };
        }
    };
    /**侍. */
    Tec.格闘連携 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "格闘連携", info: "格闘連携をセットしている味方の格闘攻撃時、連携攻撃",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                memberAfterDoAtk(me, dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.canCounter && dmg.hasType("格闘") && dmg.attacker.tecs.some(tec => tec === Tec.格闘連携)) {
                            Util.msg.set(`${me.name}の連携攻撃`);
                            yield wait();
                            yield Tec.格闘反撃.run(me, dmg.target);
                        }
                    });
                }
            };
        }
    };
    /**敵:チルナノーグ. */
    Tec.チルナノーグ = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "チルナノーグ", info: "被格闘攻撃-90%",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘")) {
                            Util.msg.set("＞チルナノーグ");
                            dmg.pow.mul *= 0.1;
                        }
                    });
                }
            };
        }
    };
    /**鬼. */
    Tec.渾身 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "渾身", info: "格闘攻撃時、稀にダメージ+50%",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘") && Math.random() < 0.5) {
                            Util.msg.set("＞渾身");
                            dmg.pow.mul *= 1.5;
                        }
                    });
                }
            };
        }
    };
    /**鬼. */
    Tec.痛恨 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "痛恨", info: "格闘攻撃時、稀にダメージ+100%",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘") && Math.random() < 0.5) {
                            Util.msg.set("＞痛恨");
                            dmg.pow.mul *= 2;
                        }
                    });
                }
            };
        }
    };
    /**鬼. */
    Tec.修羅 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "修羅", info: "戦闘開始時、力+50% ＜防↓4＞化",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                battleStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (unit.dead) {
                            return;
                        }
                        unit.prm(Prm.STR).battle += (unit.prm(Prm.STR).base + unit.prm(Prm.STR).eq) * 0.5;
                        Unit.setCondition(unit, Condition.防御低下, 4);
                    });
                }
            };
        }
    };
    /**鬼. */
    Tec.我を忘れる = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "我を忘れる", info: "戦闘開始時、＜暴＞（勝手に格闘攻撃）化",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                battleStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (unit.dead) {
                            return;
                        }
                        Unit.setCondition(unit, Condition.暴走, 10, true);
                    });
                }
            };
        }
    };
    /**ブラッド. */
    Tec.受容 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "受容", info: "稀に格闘攻撃を吸収",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘") && Math.random() < 0.15) {
                            Unit.set吸収Inv(dmg.target);
                        }
                    });
                }
            };
        }
    };
    /**魔剣士. */
    Tec.トロスの魔力 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "トロスの魔力", info: "格闘・魔法攻撃に現在MP値を加算  毎ターンMP-1",
                sort: TecSort.格闘, type: TecType.格闘,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.mp--;
                    });
                }
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "魔法")) {
                            dmg.pow.add += dmg.attacker.mp;
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-格闘Passive
    //槍Active
    //
    //--------------------------------------------------------------------------
    /**ホークマン. */
    Tec.槍 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "槍", info: "一体に槍攻撃",
                sort: TecSort.格闘, type: TecType.槍, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 2,
            });
        }
    };
    /**鳥. */
    Tec.ホワイトランス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ホワイトランス", info: "一体に槍攻撃  暗黒+1  攻撃後暗黒値分のダメージ(最大99)",
                sort: TecSort.格闘, type: TecType.槍, targetings: ["select"],
                mul: 1, num: 1, hit: 1,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                const lim = 99;
                let pow = (attacker.prm(Prm.DRK).total - attacker.prm(Prm.LIG).total);
                if (pow < 0) {
                    pow = 0;
                }
                if (pow > lim) {
                    pow = lim;
                }
                const selfHarm = new Dmg({
                    attacker: attacker,
                    target: attacker,
                    absPow: pow,
                    canCounter: false,
                });
                yield selfHarm.run();
                attacker.prm(Prm.DRK).battle += 1;
            });
        }
    };
    /**鳥. */
    Tec.ロンギヌブ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ロンギヌブ", info: "敵全体に槍攻撃",
                sort: TecSort.格闘, type: TecType.槍, targetings: ["all"],
                mul: 1, num: 1, hit: 1, tp: 4,
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-槍Active
    //槍Passive
    //
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //
    //-槍Passive
    //魔法Active
    //
    //--------------------------------------------------------------------------
    /**魔法使い. */
    Tec.ヴァハ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ヴァハ", info: "一体に魔法攻撃",
                sort: TecSort.魔法, type: TecType.魔法, targetings: ["select"],
                mul: 1, num: 1, hit: 1.2, mp: 1,
            });
        }
    };
    /**魔法使い. */
    Tec.エヴィン = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "エヴィン", info: "一体に魔法攻撃x1.5",
                sort: TecSort.魔法, type: TecType.魔法, targetings: ["select"],
                mul: 1.5, num: 1, hit: 1.2, mp: 2,
            });
        }
    };
    /**ウィザード. */
    Tec.オグマ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "オグマ", info: "一体に魔法攻撃x2",
                sort: TecSort.魔法, type: TecType.魔法, targetings: ["select"],
                mul: 2, num: 1, hit: 1.2, mp: 4,
            });
        }
    };
    /**ウィザード. */
    Tec.ルー = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ルー", info: "一体に魔法攻撃x2.5",
                sort: TecSort.魔法, type: TecType.魔法, targetings: ["select"],
                mul: 2.5, num: 1, hit: 1.2, mp: 7,
            });
        }
    };
    /**未設定. */
    Tec.エヴァ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "エヴァ", info: "一体に暗黒値を加えて魔法攻撃",
                sort: TecSort.魔法, type: TecType.魔法, targetings: ["select"],
                mul: 1, num: 1, hit: 1.2, mp: 5,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.abs.add += attacker.prm(Prm.DRK).total;
            return dmg;
        }
    };
    /**鬼火. */
    Tec.ファイアボール = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ファイアボール", info: "一体とその両脇に魔法攻撃",
                sort: TecSort.魔法, type: TecType.魔法, targetings: ["select"],
                mul: 1, num: 1, hit: 1.2, mp: 8,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                for (const u of target.searchUnitsEx("top", "bottom").filter(u => !u.dead)) {
                    yield _super.run.call(this, attacker, u);
                }
            });
        }
    };
    /**メイガス. */
    Tec.ヘルメス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ヘルメス", info: "一体に魔法攻撃x3",
                sort: TecSort.魔法, type: TecType.魔法, targetings: ["select"],
                mul: 3, num: 1, hit: 1.2, mp: 11,
            });
        }
    };
    // export const                          ルー:ActiveTec = new class extends ActiveTec{
    //     constructor(){super({ uniqueName:"ルー", info:"一体に魔法攻撃x3",
    //                           type:TecType.魔法, targetings:["select"],
    //                           mul:3, num:1, hit:1.2, mp:4,
    //     });}
    // }
    //--------------------------------------------------------------------------
    //
    //-魔法Active
    //魔法Passive
    //
    //--------------------------------------------------------------------------
    /**ウィザード. */
    Tec.魔法攻撃UP = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "魔法攻撃UP", info: "魔法攻撃x1.2",
                sort: TecSort.魔法, type: TecType.魔法,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("魔法")) {
                            dmg.pow.mul *= 1.2;
                        }
                    });
                }
            };
        }
    };
    /**ウィザード. */
    Tec.魔道連携 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "魔道連携", info: "魔道連携をセットしている味方の魔法攻撃時、連携攻撃",
                sort: TecSort.魔法, type: TecType.魔法,
            });
        }
        createForce(_this) {
            return new class extends Force {
                memberAfterDoAtk(me, dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("魔法") && dmg.canCounter && dmg.attacker.tecs.some(tec => tec === Tec.魔道連携)) {
                            Util.msg.set(`${me.name}の連携攻撃`);
                            yield wait();
                            yield Tec.魔法反撃.run(me, dmg.target);
                        }
                    });
                }
            };
        }
    };
    /**メイガス. */
    Tec.メイガス = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "メイガス", info: "魔法攻撃+50%  ターン経過毎に効果減少",
                sort: TecSort.魔法, type: TecType.魔法,
            });
        }
        createForce(_this) {
            return new class extends Force {
                battleStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let mul = 1.5;
                        unit.addInvisibleCondition(new class extends InvisibleCondition {
                            constructor() {
                                super(...arguments);
                                this.uniqueName = Tec.メイガス.uniqueName;
                            }
                            createForce(_this) {
                                return new class extends Force {
                                    beforeDoAtk(dmg) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            if (dmg.hasType("魔法")) {
                                                dmg.pow.mul *= mul;
                                            }
                                        });
                                    }
                                    phaseEnd(unit) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            mul = mul * 0.9 + 1 * 0.1;
                                        });
                                    }
                                };
                            }
                        });
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //神格Active
    //
    //--------------------------------------------------------------------------
    /**天使.僧兵. */
    Tec.天籟 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "天籟", info: "一体に神格攻撃 自分を＜雲＞（魔法・暗黒・過去・弓軽減）化",
                sort: TecSort.神格, type: TecType.神格, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 1,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                Unit.setCondition(attacker, Condition.雲, 1);
            });
        }
    };
    /**僧兵. */
    Tec.光命 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "光命", info: "一体に神格攻撃 相手の暗黒値分ダメージを加える",
                sort: TecSort.神格, type: TecType.神格, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 4,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.abs.base += target.prm(Prm.DRK).total;
            return dmg;
        }
    };
    // export const                          光の護封剣:ActiveTec = new class extends ActiveTec{
    //     constructor(){super({ uniqueName:"光の護封剣", info:"一体に神格攻撃　相手を＜攻↓＞化",
    //                           type:TecType.神格, targetings:["select"],
    //                           mul:1, num:1, hit:1, tp:1,
    //     });}
    //     async run(attacker:Unit, target:Unit){
    //         await super.run(attacker, target);
    //         Unit.setCondition(target, Condition.攻撃低下, 1);
    //     }
    // }
    // export const                          プレッシャー:ActiveTec = new class extends ActiveTec{
    //     constructor(){super({ uniqueName:"プレッシャー", info:"一体に神格絶対攻撃x5",
    //                           type:TecType.神格, targetings:["select"],
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
    //                           type:TecType.神格, targetings:["select"],
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
    //-神格Passive
    //暗黒Active
    //
    //--------------------------------------------------------------------------
    Tec.暗黒剣 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "暗黒剣", info: "一体に暗黒攻撃  攻撃後反動ダメージ",
                sort: TecSort.暗黒, type: TecType.暗黒, targetings: ["select"],
                mul: 1, num: 1, hit: 1,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                Util.msg.set("＞反動");
                FX_格闘(attacker.imgCenter);
                const selfHarm = new Dmg({
                    attacker: attacker,
                    target: attacker,
                    absPow: target.prm(Prm.LV).total,
                    canCounter: false,
                });
                yield selfHarm.run();
                yield wait();
            });
        }
    };
    Tec.吸血 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "吸血", info: "相手からHPを吸収  暗黒依存",
                sort: TecSort.暗黒, type: TecType.暗黒, targetings: ["select"],
                mul: 0.5, num: 1, hit: 1.1, mp: 2,
            });
        }
        sound() { Sound.drain.play(); }
        effect(attacker, target) { FX_吸収(attacker.imgCenter, target.imgCenter); }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.types.push("吸収");
            return dmg;
        }
        runInner(dmg) {
            const _super = Object.create(null, {
                runInner: { get: () => super.runInner }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.runInner.call(this, dmg);
                if (dmg.result.isHit) {
                    dmg.attacker.hp += dmg.result.value;
                }
            });
        }
    };
    Tec.VAMPIRE_VLOODY_STAR = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "VAMPIRE_VLOODY_STAR", info: "敵全体からHPを吸収  暗黒依存",
                sort: TecSort.暗黒, type: TecType.暗黒, targetings: ["all"],
                mul: 0.5, num: 1, hit: 1.1, ep: 1,
            });
        }
        toString() { return "VAMPIRE VLOODY STAR"; }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Tec.吸血.run(attacker, target);
            });
        }
    };
    /**敵:孤独のクグワ. */
    Tec.死のエネルギー = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "死のエネルギー", info: "一体に暗黒攻撃  HP-10%",
                sort: TecSort.暗黒, type: TecType.暗黒, targetings: ["select"],
                mul: 1, num: 1, hit: 1,
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                Util.msg.set("＞反動");
                FX_格闘(attacker.imgCenter);
                const cdmg = new Dmg({
                    attacker: attacker,
                    target: attacker,
                    absPow: attacker.hp * 0.1,
                    canCounter: false,
                });
                yield cdmg.run();
                yield wait();
            });
        }
    };
    /**敵:絶望のクグワ. */
    Tec.自虐 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "自虐", info: "自分に暗黒値x2のダメージを与え、相手一体に同ダメージを与える",
                sort: TecSort.暗黒, type: TecType.暗黒, targetings: ["select"],
                mul: 1, num: 1, hit: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const _run = (unit) => __awaiter(this, void 0, void 0, function* () {
                    const dmg = new Dmg({
                        attacker: attacker,
                        target: unit,
                        absPow: attacker.prm(Prm.DRK).total * 2,
                        canCounter: false,
                    });
                    Sound.DARK.play();
                    FX_格闘(unit.imgCenter);
                    yield dmg.run();
                });
                yield _run(attacker);
                yield _run(target);
                yield wait();
            });
        }
    };
    /**阿修羅. */
    Tec.ナイトインナイツ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ナイトインナイツ", info: "敵全体に暗黒攻撃",
                sort: TecSort.暗黒, type: TecType.暗黒, targetings: ["all"],
                mul: 1, num: 1, hit: 1, xp: 1,
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-暗黒Active
    //暗黒Passive
    //
    //--------------------------------------------------------------------------
    Tec.衝動 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "衝動", info: "防御値-10%　毎ターン暗黒+5",
                sort: TecSort.暗黒, type: TecType.暗黒,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        dmg.def.mul *= 0.9;
                    });
                }
                phaseStart(u, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        u.prm(Prm.DRK).battle += 5;
                    });
                }
            };
        }
    };
    Tec.宵闇 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "宵闇", info: "暗黒攻撃+100%  最大HP-50%",
                sort: TecSort.暗黒, type: TecType.暗黒,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("暗黒")) {
                            dmg.pow.mul *= 2;
                        }
                    });
                }
                equip(u) {
                    return __awaiter(this, void 0, void 0, function* () {
                        u.prm(Prm.MAX_HP).eq -= u.prm(Prm.MAX_HP).base * 0.5;
                    });
                }
            };
        }
    };
    /**敵:絶望のクグワ. */
    Tec.憑依 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "憑依", info: "攻撃してきた相手のHPを10%削る",
                sort: TecSort.暗黒, type: TecType.暗黒,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Util.msg.set("＞憑依");
                        const counter = new Dmg({
                            attacker: dmg.target,
                            target: dmg.attacker,
                            absPow: dmg.attacker.hp * 0.1 + 1,
                            canCounter: false,
                        });
                        yield counter.run();
                        yield wait();
                    });
                }
            };
        }
    };
    /**阿修羅. */
    Tec.恐怖を超えて = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "恐怖を超えて", info: "戦闘開始時、光・過去値を暗黒値に変換",
                sort: TecSort.暗黒, type: TecType.暗黒,
            });
        }
        createForce(_this) {
            return new class extends Force {
                battleStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.prm(Prm.DRK).battle += unit.prm(Prm.LIG).total;
                        unit.prm(Prm.LIG).battle -= unit.prm(Prm.LIG).total;
                        unit.prm(Prm.DRK).battle += unit.prm(Prm.PST).total;
                        unit.prm(Prm.PST).battle -= unit.prm(Prm.PST).total;
                    });
                }
            };
        }
    };
    /**阿修羅. */
    Tec.闇そのもの = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "闇そのもの", info: "戦闘開始時＜呪3＞化、暗黒攻撃x2",
                sort: TecSort.暗黒, type: TecType.暗黒,
            });
        }
        createForce(_this) {
            return new class extends Force {
                battleStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Unit.setCondition(unit, Condition.呪, 3, true);
                    });
                }
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("暗黒")) {
                            dmg.pow.mul *= 2;
                        }
                    });
                }
            };
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
    //-暗黒Passive
    //怨霊Active
    //
    //--------------------------------------------------------------------------
    /**霊術戦士. */
    Tec.鎌 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "鎌", info: "一体に怨霊攻撃  怨霊-10%  -怨霊使い-をセットしている必要がある",
                sort: TecSort.暗黒, type: TecType.怨霊, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            if (!attacker.tecs.some(tec => tec === Tec.怨霊使い)) {
                dmg.pow.base *= 0.01;
            }
            return dmg;
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                attacker.ghost *= 0.9;
            });
        }
    };
    /**落武者. */
    Tec.武者鎌 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "武者鎌", info: "一体に怨霊攻撃x2  怨霊-10%  怨霊使いのセットが必要",
                sort: TecSort.暗黒, type: TecType.怨霊, targetings: ["select"],
                mul: 2, num: 1, hit: 1, tp: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            if (!attacker.tecs.some(tec => tec === Tec.怨霊使い)) {
                dmg.pow.base *= 0.01;
            }
            return dmg;
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                attacker.ghost *= 0.9;
            });
        }
    };
    /**ネクロマンサー. */
    Tec.大鎌 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "大鎌", info: "一体とそれに隣接したユニットに怨霊攻撃  怨霊-10%  怨霊使いのセットが必要",
                sort: TecSort.暗黒, type: TecType.怨霊, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            if (!attacker.tecs.some(tec => tec === Tec.怨霊使い)) {
                dmg.pow.base *= 0.01;
            }
            return dmg;
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                for (const u of target.searchUnitsEx("top", "bottom")) {
                    yield _super.run.call(this, attacker, u);
                }
                attacker.ghost *= 0.9;
            });
        }
    };
    /**敵:霊術戦士. */
    Tec.死神の鎌 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "死神の鎌", info: "一体のHPを1にする",
                sort: TecSort.暗黒, type: TecType.怨霊, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 10,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                FX_PetDie(target.imgCenter);
                FX_暗黒(target.imgCenter);
                FX_RotateStr(Font.def, "HP=1", target.imgCenter, Color.WHITE);
                Sound.DARK.play();
                target.hp = 1;
            });
        }
    };
    /**落武者. */
    Tec.成仏 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "成仏", info: "自分の怨霊値の10%分のダメージを敵に与える HP=0  怨霊使いのセットが必要",
                sort: TecSort.暗黒, type: TecType.怨霊, targetings: ["all"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        createDmg(attacker, target) {
            if (attacker.tecs.some(tec => tec === Tec.怨霊使い)) {
                return new Dmg({
                    attacker: attacker,
                    target: target,
                    absPow: attacker.ghost * 0.1
                });
            }
            return new Dmg({
                attacker: attacker,
                target: target,
                absPow: attacker.ghost * 0.001
            });
        }
        use(attacker, targets) {
            const _super = Object.create(null, {
                use: { get: () => super.use }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const canUse = this.checkCost(attacker);
                yield _super.use.call(this, attacker, targets);
                if (canUse) {
                    attacker.hp = 0;
                    attacker.ghost *= 0.9;
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const value = attacker.tecs.some(tec => tec === Tec.怨霊使い)
                    ? attacker.ghost * 0.1
                    : attacker.ghost * 0.01;
                target.hp -= value;
                FX_RotateStr(Font.def, "" + value, target.imgCenter, Color.WHITE);
            });
        }
    };
    /**ゾンビ. */
    Tec.ゾンビタッチ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ゾンビタッチ", info: "一体に怨霊攻撃  稀に相手を＜病気＞化  怨霊-10%  怨霊使いのセットが必要",
                sort: TecSort.暗黒, type: TecType.怨霊, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            if (!attacker.tecs.some(tec => tec === Tec.怨霊使い)) {
                dmg.pow.base *= 0.01;
            }
            return dmg;
        }
        runInner(dmg) {
            const _super = Object.create(null, {
                runInner: { get: () => super.runInner }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.runInner.call(this, dmg);
                if (dmg.result.isHit && Math.random() < 0.5) {
                    Unit.setCondition(dmg.target, Condition.病気, dmg.attacker.prm(Prm.DRK).total * 2 + 1);
                    yield wait();
                }
                dmg.attacker.ghost *= 0.9;
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-怨霊Active
    //怨霊Passive
    //
    //--------------------------------------------------------------------------
    /**霊術戦士. */
    Tec.怨霊使い = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "怨霊使い", info: "倒した相手のLvを怨霊として吸収できるようになる 毎ターン、HP-<怨霊値÷500+1>",
                sort: TecSort.暗黒, type: TecType.怨霊,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const value = (unit.ghost / 500 + 1) | 0;
                        FX_RotateStr(Font.def, `${value}`, unit.imgCenter, Color.WHITE);
                        unit.hp -= value;
                    });
                }
                whenAnyoneDead(me, deadUnit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (me.isFriend(deadUnit)) {
                            return;
                        }
                        if (Battle.getPhaseUnit() !== me) {
                            return;
                        }
                        const value = deadUnit.prm(Prm.LV).total * 10;
                        me.ghost += value;
                    });
                }
            };
        }
    };
    /**霊術戦士. */
    Tec.怨霊回復 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "怨霊回復", info: "毎ターン怨霊+20",
                sort: TecSort.暗黒, type: TecType.怨霊,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.ghost += 20;
                    });
                }
            };
        }
    };
    /**落武者. */
    Tec.怨霊回復3 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "怨霊回復3", info: "毎ターン怨霊+50 HP-5%",
                sort: TecSort.暗黒, type: TecType.怨霊,
            });
        }
        toString() { return "怨霊回復Ⅲ"; }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.ghost += 50;
                        const value = unit.prm(Prm.MAX_HP).total * 0.05;
                        unit.hp -= value;
                        FX_RotateStr(Font.def, "" + value, unit.imgCenter, Color.WHITE);
                    });
                }
            };
        }
    };
    /**落武者. */
    Tec.アンデッド = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "アンデッド", info: "死亡時、4ターン後に生き返る",
                sort: TecSort.暗黒, type: TecType.怨霊,
            });
        }
        createForce(_this) {
            return new class extends Force {
                whenDead(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let turnCount = 4;
                        unit.addInvisibleCondition(new class extends InvisibleCondition {
                            constructor() {
                                super(...arguments);
                                this.uniqueName = Tec.アンデッド.uniqueName;
                            }
                            createForce(_this) {
                                return new class extends Force {
                                    phaseStart(u) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            u.removeInvisibleCondition(_this);
                                        });
                                    }
                                    deadPhaseStart(u) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            if (!u.dead) {
                                                return;
                                            }
                                            if (--turnCount <= 0) {
                                                u.dead = false;
                                                u.hp = 1;
                                                FX_回復(u.imgCenter);
                                                Util.msg.set(`${u.name}は生き返った！`);
                                                yield wait();
                                                u.removeInvisibleCondition(_this);
                                            }
                                            else {
                                                Util.msg.set(`${u.name}蘇りまで残り${turnCount}ターン...`);
                                                yield wait();
                                            }
                                        });
                                    }
                                };
                            }
                        });
                    });
                }
            };
        }
    };
    /**ネクロマンサー. */
    Tec.生き血 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "生き血", info: "怨霊攻撃後、自分の最大HPの5%分吸収",
                sort: TecSort.暗黒, type: TecType.怨霊,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("怨霊") && dmg.result.isHit) {
                            const value = dmg.attacker.prm(Prm.MAX_HP).total * 0.05;
                            yield new Dmg({
                                attacker: dmg.attacker,
                                target: dmg.target,
                                absPow: value,
                                canCounter: false,
                                types: ["吸収"],
                            }).run(false);
                            Heal.run("HP", value, dmg.attacker, dmg.attacker, Tec.生き血, false);
                        }
                    });
                }
            };
        }
    };
    /**ネクロマンサー. */
    Tec.マゾ = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "マゾ", info: "被攻撃時、受けたダメージx2の怨霊を得る  ただしLvの2倍を超えない",
                sort: TecSort.暗黒, type: TecType.怨霊,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.result.isHit) {
                            const lim = dmg.target.prm(Prm.LV).total * 2;
                            const value = dmg.result.value < lim ? dmg.result.value : lim;
                            dmg.target.ghost += value;
                        }
                    });
                }
            };
        }
    };
    /**ネクロマンサー. */
    Tec.霊族意識 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "霊族意識", info: "暗黒・怨霊攻撃を吸収  吸血を無効化  毎ターンHP-10%",
                sort: TecSort.暗黒, type: TecType.怨霊,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield new Dmg({
                            attacker: unit,
                            target: unit,
                            absPow: unit.prm(Prm.MAX_HP).total * 0.1,
                            types: ["怨霊"],
                        }).run(false);
                    });
                }
                beDamage(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("吸収")) {
                            dmg.result.value = 0;
                            return;
                        }
                        if (dmg.result.isHit && dmg.hasType("暗黒", "怨霊")) {
                            Util.msg.set("＞霊族意識");
                            Heal.run("HP", dmg.result.value, dmg.attacker, dmg.attacker, Tec.霊族意識, true);
                            dmg.result.isHit = false;
                        }
                    });
                }
            };
        }
    };
    /**ゾンビ. */
    Tec.腐敗 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "腐敗", info: "怨霊攻撃+50%  毎ターンHP-5%",
                sort: TecSort.暗黒, type: TecType.怨霊,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield new Dmg({
                            attacker: unit,
                            target: unit,
                            absPow: unit.prm(Prm.MAX_HP).total * 0.05,
                            types: ["怨霊"],
                        }).run(false);
                    });
                }
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("怨霊")) {
                            dmg.pow.mul *= 1.5;
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-怨霊Passive
    //鎖術Active
    //
    //--------------------------------------------------------------------------
    /**鎖使い. */
    Tec.スネイク = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "スネイク", info: "全体に鎖術攻撃",
                sort: TecSort.鎖術, type: TecType.鎖術, targetings: ["all"],
                mul: 1, num: 1, hit: 0.8, tp: 1,
            });
        }
    };
    Tec.ホワイトスネイク = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ホワイトスネイク", info: "一体に鎖術攻撃x2",
                sort: TecSort.鎖術, type: TecType.鎖術, targetings: ["select"],
                mul: 2, num: 1, hit: 0.85, tp: 2,
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-鎖術Active
    //練術Passive
    //
    //--------------------------------------------------------------------------
    /**ペガサス. */
    Tec.練ファクト = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "練ファクト", info: "毎ターン鎖+3%",
                sort: TecSort.鎖術, type: TecType.鎖術,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.prm(Prm.CHN).battle += unit.prm(Prm.CHN).get("base", "eq");
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-鎖術Passive
    //過去Active
    //
    //--------------------------------------------------------------------------
    /**ダウザー. */
    Tec.念力 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "念力", info: "全体に過去攻撃",
                sort: TecSort.過去, type: TecType.過去, targetings: ["all"],
                mul: 1, num: 1, hit: 1.2, mp: 6,
            });
        }
    };
    /**ダウザー. */
    Tec.念力2 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "念力2", info: "全体に過去攻撃x2",
                sort: TecSort.過去, type: TecType.過去, targetings: ["all"],
                mul: 2, num: 1, hit: 1.2, mp: 12,
            });
        }
        toString() { return "念力Ⅱ"; }
    };
    /**ダウザー. */
    Tec.念 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "念", info: "ランダムな一体に過去攻撃",
                sort: TecSort.過去, type: TecType.過去, targetings: ["random"],
                mul: 1, num: 1, hit: 1.2, mp: 1,
            });
        }
    };
    /**アイス. ＜凍結＞未実装.*/
    Tec.コールドブレス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "コールドブレス", info: "一体に過去攻撃x2",
                sort: TecSort.過去, type: TecType.過去, targetings: ["select"],
                mul: 1, num: 1, hit: 1.2, mp: 5, tp: 1,
            });
        }
    };
    /**羅文騎士. */
    Tec.インフレーション = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "インフレーション", info: "全体に過去攻撃x2",
                sort: TecSort.過去, type: TecType.過去, targetings: ["all"],
                mul: 2, num: 1, hit: 1.2, tp: 5, sp: 1,
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-過去Active
    //過去Passive
    //
    //--------------------------------------------------------------------------
    /**ペガサス. */
    Tec.パワーストーン = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "パワーストーン", info: "過去攻撃+25%",
                sort: TecSort.過去, type: TecType.過去,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("過去")) {
                            dmg.pow.mul *= 1.25;
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-過去Passive
    //銃Active
    //
    //--------------------------------------------------------------------------
    /**カウボーイ. */
    Tec.撃つ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "撃つ", info: "ランダムに銃攻撃1～2回",
                sort: TecSort.銃, type: TecType.銃, targetings: ["random"],
                mul: 0.9, num: 1, hit: 0.8,
            });
        }
        rndAttackNum() { return randomInt(1, 2, "[]"); }
    };
    /**魔砲士. */
    Tec.乱射 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "乱射", info: "ランダムに3回銃攻撃",
                sort: TecSort.銃, type: TecType.銃, targetings: ["random"],
                mul: 0.9, num: 3, hit: 0.8, tp: 3,
            });
        }
    };
    /**カウボーイ. */
    Tec.弐丁拳銃 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "弐丁拳銃", info: "一体に2回銃攻撃",
                sort: TecSort.銃, type: TecType.銃, targetings: ["select"],
                mul: 0.9, num: 2, hit: 0.8, tp: 1,
            });
        }
    };
    /**カウボーイ. */
    Tec.あがらない雨 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "あがらない雨", info: "敵全体に銃攻撃",
                sort: TecSort.銃, type: TecType.銃, targetings: ["all"],
                mul: 0.9, num: 1, hit: 0.8, ep: 1,
            });
        }
    };
    /**魔砲士. */
    Tec.羊飼いの銃 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "羊飼いの銃", info: "魔値x2を加えてランダムに銃攻撃1～2回",
                sort: TecSort.銃, type: TecType.銃, targetings: ["random"],
                mul: 0.9, num: 1, hit: 0.8, mp: 3, item: () => [[Item.魔弾, 2]],
            });
        }
        rndAttackNum() { return randomInt(1, 2, "[]"); }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.MAG).total * 2;
            return dmg;
        }
    };
    /**魔砲士. */
    Tec.大砲 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "大砲", info: "一体に銃攻撃x2",
                sort: TecSort.銃, type: TecType.銃, targetings: ["random"],
                mul: 2, num: 1, hit: 0.8, tp: 1, item: () => [[Item.砲弾, 1]],
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //銃Passive
    //
    //--------------------------------------------------------------------------
    /**魔砲士. */
    Tec.魔砲 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "魔砲", info: "銃攻撃に現在MP値を加える 毎ターンMP-2",
                sort: TecSort.銃, type: TecType.機械,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.mp -= 2;
                    });
                }
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃")) {
                            dmg.pow.add += dmg.attacker.mp;
                        }
                    });
                }
            };
        }
    };
    /**霊弾の射手. */
    Tec.霊砲 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "霊砲", info: "銃攻撃に怨霊値の5%を加える 銃攻撃時、怨霊-5% 怨霊使いのセットが必要 霊弾-1(持っていなかった場合、発動しない)",
                sort: TecSort.銃, type: TecType.銃,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃") && Item.霊弾.remainingUseNum > 0 && dmg.attacker.tecs.some(tec => tec === Tec.怨霊使い)) {
                            Item.霊弾.remainingUseNum--;
                            const value = dmg.attacker.ghost * 0.05;
                            dmg.pow.add += value;
                            dmg.attacker.ghost -= value;
                        }
                    });
                }
            };
        }
    };
    /**霊弾の射手. */
    Tec.銃痕 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "銃痕", info: "銃攻撃時、相手の弓の5%を吸収",
                sort: TecSort.銃, type: TecType.銃,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃")) {
                            const value = dmg.target.prm(Prm.ARR).total * 0.05;
                            dmg.pow.add += value;
                            dmg.target.prm(Prm.ARR).battle -= value;
                        }
                    });
                }
            };
        }
    };
    /**霊弾の射手. */
    Tec.暗黒砲 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "暗黒砲", info: "銃攻撃に闇値を加算 銃攻撃時、HP-5% 闇値-10%",
                sort: TecSort.銃, type: TecType.銃,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃")) {
                            dmg.pow.add += dmg.attacker.prm(Prm.GUN).total;
                            const value = dmg.attacker.prm(Prm.MAX_HP).total * 0.05;
                            FX_Str(Font.def, "" + value, dmg.attacker.imgCenter, Color.WHITE);
                            dmg.attacker.hp -= value;
                            dmg.attacker.prm(Prm.DRK).battle -= dmg.attacker.prm(Prm.DRK).total * 0.1;
                        }
                    });
                }
            };
        }
    };
    /**霊弾の射手. */
    Tec.ブラッドブレッド = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "ブラッドブレッド", info: "銃攻撃後、与えたダメージの1%分のHPを回復",
                sort: TecSort.銃, type: TecType.銃,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃")) {
                            Heal.run("HP", dmg.result.value * 0.01, dmg.attacker, dmg.attacker, Tec.ブラッドブレッド, false);
                        }
                    });
                }
            };
        }
    };
    /**コールドシリーズ. */
    Tec.装甲 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "装甲", info: "被銃・弓攻撃半減",
                sort: TecSort.銃, type: TecType.銃,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃", "弓")) {
                            dmg.pow.mul /= 2;
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //機械Active
    //
    //--------------------------------------------------------------------------
    Tec.レーザー = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "レーザー", info: "一体とその両脇に機械攻撃",
                sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                mul: 1, num: 1, hit: 1.1, tp: 1, item: () => [[Item.バッテリー, 1]],
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                for (const u of target.searchUnitsEx("top", "bottom")) {
                    yield _super.run.call(this, attacker, u);
                }
            });
        }
    };
    /**コールドシリーズ. */
    Tec.コールドレーザー = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "コールドレーザー", info: "一体とその両脇に機械攻撃x1.5",
                sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                mul: 1.5, num: 1, hit: 1.1, tp: 1, item: () => [[Item.高出力バッテリー, 1]],
            });
        }
        run(attacker, target) {
            const _super = Object.create(null, {
                run: { get: () => super.run }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.run.call(this, attacker, target);
                for (const u of target.searchUnitsEx("top", "bottom")) {
                    yield _super.run.call(this, attacker, u);
                }
            });
        }
    };
    Tec.メガトン = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "メガトン", info: "一体に力x2を加えて機械攻撃",
                sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                mul: 1, num: 1, hit: 1.1, tp: 3,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.STR).total;
            dmg.abs.base += attacker.prm(Prm.STR).total;
            return dmg;
        }
    };
    /**雷鳥. */
    Tec.雷撃 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "雷撃", info: "一体に機械攻撃x1.5",
                sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                mul: 1.5, num: 1, hit: 1.1, mp: 2,
            });
        }
    };
    /**ロボット. */
    Tec.ショック = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ショック", info: "一体に機械攻撃",
                sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                mul: 1, num: 1, hit: 1.1,
            });
        }
    };
    /**ロボット. */
    Tec.バベル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "バベル", info: "敵全体に機械攻撃",
                sort: TecSort.銃, type: TecType.機械, targetings: ["all"],
                mul: 1, num: 1, hit: 1.1, mp: 1, tp: 1, item: () => [[Item.パワータンク, 4]],
            });
        }
    };
    /**ミサイリスト. */
    Tec.林式ミサイルう = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "林式ミサイルう", info: "次の行動時、一体に力値を加えた機械攻撃x6",
                sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                mul: 3, num: 1, hit: 1.1, item: () => [[Item.林式ミサイル, 1]],
            });
            this.inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "林式ミサイルうinner", info: "",
                        sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                        mul: 6, num: 1, hit: 1.1,
                    });
                }
                createDmg(attacker, target) {
                    const dmg = super.createDmg(attacker, target);
                    dmg.pow.base += attacker.prm(Prm.STR).total;
                    return dmg;
                }
                sound() { Sound.bom2.play(); }
                effect(attacker, target) { FX_ナーガ着弾(attacker.imgCenter, target.imgCenter); }
            };
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const tec = this;
                attacker.addInvisibleCondition(new class extends InvisibleCondition {
                    constructor() {
                        super(...arguments);
                        this.uniqueName = tec.uniqueName;
                    }
                    createForce(_this) {
                        return new class extends Force {
                            phaseStart(u) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (target.dead) {
                                        attacker.removeInvisibleCondition(_this);
                                        return;
                                    }
                                    Util.msg.set("空からミサイルが降り注ぐ！");
                                    yield wait();
                                    yield tec.inner.run(attacker, target);
                                    attacker.removeInvisibleCondition(_this);
                                });
                            }
                        };
                    }
                });
                FX_ナーガ(attacker.imgCenter, target.imgCenter);
                Sound.ya.play();
                Util.msg.set(`${attacker.name}はミサイルを打ち上げた`);
                yield wait();
            });
        }
    };
    /**ミサイリスト. */
    Tec.エボリ製悪魔のミサイル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "エボリ製悪魔のミサイル", info: "次の行動時、一体に鎖値を加えた機械攻撃x6",
                sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                mul: 3, num: 1, hit: 1.1, item: () => [[Item.エボリ製悪魔のミサイル, 1]],
            });
            this.inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "エボリ製悪魔のミサイルinner", info: "",
                        sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                        mul: 6, num: 1, hit: 1.1,
                    });
                }
                createDmg(attacker, target) {
                    const dmg = super.createDmg(attacker, target);
                    dmg.pow.base += attacker.prm(Prm.CHN).total;
                    return dmg;
                }
                sound() { Sound.bom2.play(); }
                effect(attacker, target) { FX_ナーガ着弾(attacker.imgCenter, target.imgCenter); }
            };
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const tec = this;
                attacker.addInvisibleCondition(new class extends InvisibleCondition {
                    constructor() {
                        super(...arguments);
                        this.uniqueName = tec.uniqueName;
                    }
                    createForce(_this) {
                        return new class extends Force {
                            phaseStart(u) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (target.dead) {
                                        attacker.removeInvisibleCondition(_this);
                                        return;
                                    }
                                    Util.msg.set("空からミサイルが降り注ぐ！");
                                    yield wait();
                                    yield tec.inner.run(attacker, target);
                                    attacker.removeInvisibleCondition(_this);
                                });
                            }
                        };
                    }
                });
                FX_ナーガ(attacker.imgCenter, target.imgCenter);
                Sound.ya.play();
                Util.msg.set(`${attacker.name}はミサイルを打ち上げた`);
                yield wait();
            });
        }
    };
    /**ミサイリスト. */
    Tec.メフィスト製悪魔のミサイル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "メフィスト製悪魔のミサイル", info: "次の行動時、一体に過去値を加えた機械攻撃x6",
                sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                mul: 9, num: 1, hit: 1.1, item: () => [[Item.メフィスト製悪魔のミサイル, 1]],
            });
            this.inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "メフィスト製悪魔のミサイルinner", info: "",
                        sort: TecSort.銃, type: TecType.機械, targetings: ["select"],
                        mul: 6, num: 1, hit: 1.1,
                    });
                }
                createDmg(attacker, target) {
                    const dmg = super.createDmg(attacker, target);
                    dmg.pow.base += attacker.prm(Prm.PST).total;
                    return dmg;
                }
                sound() { Sound.bom2.play(); }
                effect(attacker, target) { FX_ナーガ着弾(attacker.imgCenter, target.imgCenter); }
            };
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const tec = this;
                attacker.addInvisibleCondition(new class extends InvisibleCondition {
                    constructor() {
                        super(...arguments);
                        this.uniqueName = tec.uniqueName;
                    }
                    createForce(_this) {
                        return new class extends Force {
                            phaseStart(u) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (target.dead) {
                                        attacker.removeInvisibleCondition(_this);
                                        return;
                                    }
                                    Util.msg.set("空からミサイルが降り注ぐ！");
                                    yield wait();
                                    yield tec.inner.run(attacker, target);
                                    attacker.removeInvisibleCondition(_this);
                                });
                            }
                        };
                    }
                });
                FX_ナーガ(attacker.imgCenter, target.imgCenter);
                Sound.ya.play();
                Util.msg.set(`${attacker.name}はミサイルを打ち上げた`);
                yield wait();
            });
        }
    };
    /**軍人. */
    Tec.原子爆弾 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "原子爆弾", info: "敵全体に魔値を加えた機械攻撃",
                sort: TecSort.銃, type: TecType.機械, targetings: ["all"],
                mul: 1, num: 1, hit: 1.1, item: () => [[Item.原子爆弾, 1]],
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.MAG).total;
            return dmg;
        }
    };
    /**軍人. */
    Tec.水素爆弾 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "水素爆弾", info: "敵全体に光値を加えた機械攻撃",
                sort: TecSort.銃, type: TecType.機械, targetings: ["all"],
                mul: 1, num: 1, hit: 1.1, item: () => [[Item.水素爆弾, 1]],
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.LIG).total;
            return dmg;
        }
    };
    /**軍人. */
    Tec.重力子爆弾 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "重力子爆弾", info: "敵全体に闇値を加えた機械攻撃",
                sort: TecSort.銃, type: TecType.機械, targetings: ["all"],
                mul: 1, num: 1, hit: 1.1, item: () => [[Item.重力子爆弾, 1]],
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.DRK).total;
            return dmg;
        }
    };
    /**軍人. */
    Tec.lucifer製量子爆弾 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "lucifer製量子爆弾", info: "敵全体に弓値を加えた機械攻撃",
                sort: TecSort.銃, type: TecType.機械, targetings: ["all"],
                mul: 1, num: 1, hit: 1.1, item: () => [[Item.lucifer製量子爆弾, 1]],
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base += attacker.prm(Prm.ARR).total;
            return dmg;
        }
    };
    //--------------------------------------------------------------------------
    //
    //-機械Active
    //機械Passive
    //
    //--------------------------------------------------------------------------
    /**機械士. */
    Tec.機械仕掛け = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "機械仕掛け", info: "毎ターン銃+1%",
                sort: TecSort.銃, type: TecType.機械,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseEnd(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.prm(Prm.GUN).battle += unit.prm(Prm.GUN).base * 0.01 + 1;
                    });
                }
            };
        }
    };
    /**機械士. */
    Tec.増幅回路 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "増幅回路", info: "機械攻撃+20%",
                sort: TecSort.銃, type: TecType.機械,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("機械")) {
                            dmg.pow.mul *= 1.2;
                        }
                    });
                }
            };
        }
    };
    /**機械士. */
    Tec.トマホーク = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "トマホーク", info: "機械攻撃+20%",
                sort: TecSort.銃, type: TecType.機械,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("機械")) {
                            dmg.pow.mul *= 1.2;
                        }
                    });
                }
            };
        }
    };
    /**コールドシリーズ. */
    Tec.VIRGINリンク = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "VIRGINリンク", info: "機械攻撃時追加攻撃",
                sort: TecSort.銃, type: TecType.機械,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("機械")) {
                            yield new Dmg({
                                attacker: dmg.attacker,
                                target: dmg.target,
                                absPow: dmg.result.value / 2,
                                types: ["追加攻撃"],
                            }).run();
                            yield wait(1);
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-機械Passive
    //弓Active
    //
    //--------------------------------------------------------------------------
    /**アーチャー. */
    Tec.射る = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "射る", info: "一体に弓攻撃",
                sort: TecSort.弓, type: TecType.弓, targetings: ["select"],
                mul: 1, num: 1, hit: 0.85,
            });
        }
    };
    /**アーチャー. */
    Tec.アスラの矢 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "アスラの矢", info: "全体に弓攻撃",
                sort: TecSort.弓, type: TecType.弓, targetings: ["all"],
                mul: 1, num: 1, hit: 0.85, ep: 1,
            });
        }
    };
    /**忍者. */
    Tec.手裏剣 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "手裏剣", info: "ランダムに2～3回弓攻撃",
                sort: TecSort.弓, type: TecType.弓, targetings: ["random"],
                mul: 1, num: 1, hit: 0.8, tp: 2,
            });
        }
        rndAttackNum() { return randomInt(2, 3, "[]"); }
    };
    /**クピド. */
    Tec.ヤクシャ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ヤクシャ", info: "一体に2回弓攻撃",
                sort: TecSort.弓, type: TecType.弓, targetings: ["select"],
                mul: 1, num: 2, hit: 0.8, tp: 1, item: () => [[Item.夜叉の矢, 2]],
            });
        }
    };
    /**クピド. */
    Tec.ナーガ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ナーガ", info: "次の行動時、敵全体に弓攻撃",
                sort: TecSort.弓, type: TecType.弓, targetings: ["all"],
                mul: 1, num: 1, hit: 0.8, tp: 2, item: () => [[Item.降雨の矢, 4]],
            });
            this.inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "ナーガinner", info: "",
                        sort: TecSort.弓, type: TecType.弓, targetings: ["select"],
                        mul: 1, num: 1, hit: 0.8,
                    });
                }
                sound() { Sound.ya.play(); }
                effect(attacker, target) { FX_ナーガ着弾(attacker.imgCenter, target.imgCenter); }
            };
        }
        use(attacker, fakeTargets) {
            const _super = Object.create(null, {
                use: { get: () => super.use }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const canUse = this.checkCost(attacker);
                yield _super.use.call(this, attacker, fakeTargets);
                if (canUse) {
                    const tec = this;
                    attacker.addInvisibleCondition(new class extends InvisibleCondition {
                        constructor() {
                            super(...arguments);
                            this.uniqueName = Tec.ナーガ.uniqueName;
                        }
                        createForce(_this) {
                            return new class extends Force {
                                phaseStart(u) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        Util.msg.set("空から矢が降り注ぐ！");
                                        yield wait();
                                        const realTargets = attacker.searchUnits(tec.targetings, tec.rndAttackNum(attacker));
                                        realTargets.filter(t => t.exists && !t.dead)
                                            .forEach((t) => __awaiter(this, void 0, void 0, function* () {
                                            yield tec.inner.run(attacker, t);
                                        }));
                                        attacker.removeInvisibleCondition(_this);
                                    });
                                }
                            };
                        }
                    });
                    for (const t of fakeTargets) {
                        FX_ナーガ(attacker.imgCenter, t.imgCenter);
                    }
                    Sound.ya.play();
                    Util.msg.set(`${attacker.name}は空高く矢を放った`);
                    yield wait();
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () { });
        }
    };
    /**クピド. */
    Tec.ガルダ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ガルダ", info: "一体に弓攻撃x2",
                sort: TecSort.弓, type: TecType.弓, targetings: ["select"],
                mul: 2, num: 1, hit: 0.8, tp: 1, item: () => [[Item.金翅鳥の矢, 1]],
            });
        }
    };
    /**クピド. */
    Tec.キンナラ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "キンナラ", info: "次の行動時、ランダムに6回弓攻撃",
                sort: TecSort.弓, type: TecType.弓, targetings: ["self"],
                mul: 1, num: 1, hit: 0.8, tp: 2, item: () => [[Item.歌舞の矢, 6]],
            });
            this.inner = new class extends ActiveTec {
                constructor() {
                    super({ uniqueName: "キンナラinner", info: "",
                        sort: TecSort.弓, type: TecType.弓, targetings: ["select"],
                        mul: 1, num: 1, hit: 0.8,
                    });
                }
                sound() { Sound.ya.play(); }
                effect(attacker, target) { FX_ナーガ着弾(attacker.imgCenter, target.imgCenter); }
            };
        }
        use(attacker, fakeTargets) {
            const _super = Object.create(null, {
                use: { get: () => super.use }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const canUse = this.checkCost(attacker);
                yield _super.use.call(this, attacker, fakeTargets);
                if (canUse) {
                    const tec = this;
                    attacker.addInvisibleCondition(new class extends InvisibleCondition {
                        constructor() {
                            super(...arguments);
                            this.uniqueName = Tec.キンナラ.uniqueName;
                        }
                        createForce(_this) {
                            return new class extends Force {
                                phaseStart(u) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        Util.msg.set("空から矢が降り注ぐ！");
                                        yield wait();
                                        const realTargets = attacker.searchUnits(tec.targetings, tec.rndAttackNum(attacker));
                                        realTargets.filter(t => t.exists && !t.dead)
                                            .forEach((t) => __awaiter(this, void 0, void 0, function* () {
                                            yield tec.inner.run(attacker, t);
                                        }));
                                        attacker.removeInvisibleCondition(_this);
                                    });
                                }
                            };
                        }
                    });
                    for (const t of fakeTargets) {
                        FX_ナーガ(attacker.imgCenter, t.imgCenter);
                    }
                    Sound.ya.play();
                    Util.msg.set(`${attacker.name}は空高く矢を放った`);
                    yield wait();
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () { });
        }
    };
    /**月弓子. */
    Tec.キャンドラ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "キャンドラ", info: "一体に弓攻撃x10",
                sort: TecSort.弓, type: TecType.弓, targetings: ["select"],
                mul: 1, num: 10, hit: 0.8, ep: 1, item: () => [[Item.月夜の矢, 1]],
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //弓Passive
    //
    //--------------------------------------------------------------------------
    Tec.一点集中 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "一点集中", info: "弓攻撃+20%",
                sort: TecSort.弓, type: TecType.弓,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("弓")) {
                            dmg.pow.mul *= 1.2;
                        }
                    });
                }
            };
        }
    };
    Tec.中庸の悟り = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "中庸の悟り", info: "弓攻撃時、MP+3・TP+1",
                sort: TecSort.弓, type: TecType.弓,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("弓")) {
                            Heal.run("MP", 3, dmg.attacker, dmg.attacker, Tec.中庸の悟り, false);
                            Heal.run("TP", 1, dmg.attacker, dmg.attacker, Tec.中庸の悟り, false);
                        }
                    });
                }
            };
        }
    };
    Tec.摩喉羅我 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "摩喉羅我", info: "弓攻撃に暗黒を加算、毎ターンHP-5%",
                sort: TecSort.弓, type: TecType.弓,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const value = unit.prm(Prm.MAX_HP).total * 0.05;
                        FX_RotateStr(Font.def, `${value}`, unit.imgCenter, Color.WHITE);
                        unit.hp -= value;
                    });
                }
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("弓")) {
                            dmg.pow.add += dmg.attacker.prm(Prm.DRK).total;
                        }
                    });
                }
            };
        }
    };
    Tec.乾闥婆 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "乾闥婆", info: "弓攻撃時、相手の弓値の5%を吸収",
                sort: TecSort.弓, type: TecType.弓,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("弓")) {
                            const value = dmg.target.prm(Prm.ARR).total * 0.05;
                            dmg.target.prm(Prm.ARR).battle -= value;
                            dmg.attacker.prm(Prm.ARR).battle += value;
                            FX_RotateStr(Font.def, `弓+${value}`, dmg.attacker.imgCenter, Color.WHITE);
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //強化Active
    //
    //--------------------------------------------------------------------------
    Tec.練気 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "練気", info: "自分を＜練＞（格闘・神格・鎖術・銃攻撃UP）化",
                sort: TecSort.強化, type: TecType.状態, targetings: ["self"],
                mul: 1, num: 1, hit: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!target.hasCondition(Condition.練)) {
                    Sound.up.play();
                    FX_Buff(target.imgCenter);
                    Unit.setCondition(target, Condition.練, 1);
                    yield wait();
                }
                else if (target.getConditionValue(Condition.練) > 0) {
                    let limit = target.prm(Prm.LV).total / 50 + 1;
                    if (limit > 4) {
                        limit = 4;
                    }
                    let value = target.getConditionValue(Condition.練) + 1;
                    value = value <= limit ? value : limit;
                    Sound.up.play();
                    FX_Buff(target.imgCenter);
                    Unit.setCondition(target, Condition.練, value, true);
                    yield wait();
                }
            });
        }
    };
    Tec.癒しの風 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "癒しの風", info: "一体を<癒10>(毎ターン回復)状態にする",
                sort: TecSort.強化, type: TecType.状態, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                Unit.setCondition(target, Condition.癒, 10);
                yield wait();
            });
        }
    };
    Tec.光合成 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "光合成", info: "一体を<治10>(毎ターン強回復)状態にする",
                sort: TecSort.強化, type: TecType.状態, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 6,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.治, 10);
                yield wait();
            });
        }
    };
    Tec.セル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "セル", info: "自分を＜吸収＞状態にする",
                sort: TecSort.強化, type: TecType.状態, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 1, tp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.吸収, 1);
                yield wait();
            });
        }
    };
    /**シーフ. */
    Tec.風 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "風", info: "味方全員を＜回避2＞（一部攻撃を回避）状態にする",
                sort: TecSort.強化, type: TecType.状態, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.回避, 2);
                yield wait(1);
            });
        }
    };
    /**格闘家. */
    Tec.防御 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "防御", info: "自分を＜盾＞（一部攻撃軽減）化",
                sort: TecSort.強化, type: TecType.状態, targetings: ["self"],
                mul: 1, num: 1, hit: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                let value = 1;
                if (attacker.prm(Prm.LIG).total >= 25) {
                    value++;
                }
                if (attacker.prm(Prm.LIG).total >= 50) {
                    value++;
                }
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.盾, value);
                yield wait();
            });
        }
    };
    /**テンプルナイト. */
    Tec.聖なる守護 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "聖なる守護", info: "味方全体を＜盾＞化",
                sort: TecSort.強化, type: TecType.状態, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 4,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Tec.防御.run(attacker, target);
            });
        }
    };
    /**鎖使い. */
    Tec.アンドロメダ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "アンドロメダ", info: "味方全員の防御値+20%　重ねがけ不可",
                sort: TecSort.強化, type: TecType.状態, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!target.getInvisibleConditions().some(inv => inv.uniqueName === Tec.アンドロメダ.uniqueName)) {
                    target.addInvisibleCondition(new class extends InvisibleCondition {
                        constructor() {
                            super(...arguments);
                            this.uniqueName = Tec.アンドロメダ.uniqueName;
                        }
                        createForce(_this) {
                            return new class extends Force {
                                beforeBeAtk(dmg) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        dmg.def.mul *= 1.2;
                                    });
                                }
                            };
                        }
                    });
                    Sound.seikou.play();
                    FX_Buff(target.imgCenter);
                    Util.msg.set(`${target.name}は頑丈になった！`, Color.WHITE.bright);
                    yield wait(1);
                }
            });
        }
    };
    /**ガーディアン. */
    Tec.ガブリエル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ガブリエル", info: "一体を＜格闘・鎖術無効5＞状態にする",
                sort: TecSort.強化, type: TecType.状態, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 6, item: () => [[Item.聖水, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.格鎖無効, 5);
            });
        }
    };
    /**ガーディアン. */
    Tec.ラファエル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ラファエル", info: "一体を＜魔法・過去無効5＞状態にする",
                sort: TecSort.強化, type: TecType.状態, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 6, item: () => [[Item.聖水, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.魔過無効, 5);
            });
        }
    };
    /**ガーディアン. */
    Tec.ウリエル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ウリエル", info: "一体を＜銃・弓無効5＞状態にする",
                sort: TecSort.強化, type: TecType.状態, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 6, item: () => [[Item.聖水, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.銃弓無効, 5);
            });
        }
    };
    /**チルナノーグ. */
    Tec.スモッグ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "スモッグ", info: "味方全体を＜雲3＞状態にする",
                sort: TecSort.強化, type: TecType.状態, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 5,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.雲, 3);
            });
        }
    };
    /**勇者. */
    Tec.さよならみんな = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "さよならみんな", info: "味方全体を＜約＞化 自分の状態解除 自分のHP=0",
                sort: TecSort.強化, type: TecType.状態, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 5,
            });
        }
        toString() { return "さよなら、みんな"; }
        use(attacker, targets) {
            const _super = Object.create(null, {
                use: { get: () => super.use }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const canUse = this.checkCost(attacker);
                if (canUse) {
                    FX_PetDie(attacker.imgCenter);
                    Sound.sin.play();
                }
                yield _super.use.call(this, attacker, targets);
                if (canUse) {
                    Sound.KAIFUKU.play();
                    for (const type of ConditionType.goodConditions()) {
                        attacker.removeCondition(type);
                    }
                    attacker.hp = 0;
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                FX_回復(target.imgCenter);
                Unit.setCondition(target, Condition.約束, 1);
            });
        }
    };
    /**羅文騎士. */
    Tec.バリア = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "バリア", info: "自分を＜バリア2＞(多くの攻撃を無効化)化する",
                sort: TecSort.強化, type: TecType.状態, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 5,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.バリア, 2);
            });
        }
    };
    /**鳥. */
    Tec.天の紋 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "天の紋", info: "自分を＜反射2＞化する",
                sort: TecSort.強化, type: TecType.状態, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 5, tp: 2,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.BELL.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.反射, 2);
            });
        }
    };
    /**エスパー. */
    Tec.封印回路 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "封印回路", info: "味方全員を＜反射2＞(魔法・神格・過去攻撃反射)化する",
                sort: TecSort.強化, type: TecType.状態, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, xp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.BELL.play();
                FX_Buff(target.imgCenter);
                Unit.setCondition(target, Condition.反射, 2);
            });
        }
    };
    /**ゾンビ. */
    Tec.金切り声 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "金切り声", info: "敵全体のHPを10%削り、自分の最大HPに加算",
                sort: TecSort.強化, type: TecType.状態, targetings: ["all"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        useMessage(attacker) {
            const _super = Object.create(null, {
                useMessage: { get: () => super.useMessage }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.useMessage.call(this, attacker);
                if (this.checkCost(attacker)) {
                    Sound.DARK.play();
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                FX_吸収(attacker.imgCenter, target.imgCenter);
                Sound.drain.play();
                const lv = attacker.prm(Prm.LV).total;
                let value = target.hp * 0.1;
                value = value < lv ? value : lv;
                const dmg = new Dmg({
                    attacker: attacker,
                    target: target,
                    absPow: value,
                    types: ["吸収"],
                });
                yield dmg.run(false);
                attacker.prm(Prm.MAX_HP).battle += dmg.result.value;
                Heal.run("HP", dmg.result.value, attacker, attacker, this, false);
                Util.msg.set(`${target.name}からHP${dmg.result.value}を吸収した！`);
            });
        }
    };
    /**プリースト. */
    Tec.約束 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "約束", info: "一体を＜約＞化する",
                sort: TecSort.強化, type: TecType.状態, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 19,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                FX_回復(target.imgCenter);
                Sound.sin.play();
                Unit.setCondition(target, Condition.約束, 1);
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-強化Active
    //強化Passive
    //
    //--------------------------------------------------------------------------
    Tec.毒吸収 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "毒吸収", info: "＜毒＞を吸収する",
                sort: TecSort.強化, type: TecType.状態,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beDamage(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("毒")) {
                            Heal.run("HP", dmg.result.value, dmg.attacker, dmg.target, Tec.毒吸収, false);
                        }
                    });
                }
            };
        }
    };
    Tec.トラップガーダー = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "トラップガーダー", info: "罠ダメージを無効化する",
                sort: TecSort.強化, type: TecType.状態,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beDamage(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("罠")) {
                            dmg.pow.mul = 0;
                            dmg.abs.mul = 0;
                        }
                    });
                }
            };
        }
    };
    /**カウボーイ. */
    Tec.スコープ = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "スコープ", info: "銃・弓・機械攻撃命中率+10%",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("機械", "銃", "弓")) {
                            dmg.hit.mul *= 1.1;
                        }
                    });
                }
            };
        }
    };
    /**シーフ. */
    Tec.回避UP = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "回避UP", info: "格闘・銃・弓攻撃回避UP",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "銃", "弓")) {
                            dmg.hit.mul *= 0.9;
                        }
                    });
                }
            };
        }
    };
    /**アメーバ. */
    Tec.被膜 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "被膜", info: "被魔法・神格・過去攻撃-20%",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("魔法", "神格", "過去")) {
                            dmg.pow.mul *= 0.8;
                        }
                    });
                }
            };
        }
    };
    /**ロボット. */
    Tec.メタルボディ = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "メタルボディ", info: "被銃・弓攻撃-50%",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃", "弓")) {
                            dmg.pow.mul *= 0.5;
                        }
                    });
                }
            };
        }
    };
    /**チルナノーグ. */
    Tec.雲隠れ = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "雲隠れ", info: "魔法・神格・過去回避率+15%",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("魔法", "神格", "過去")) {
                            dmg.hit.mul *= 0.85;
                        }
                    });
                }
            };
        }
    };
    /**テンプルナイト. */
    Tec.かばう = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "かばう", info: "味方の死亡時、自分のHPの半分を分け与えて死を回避する（最大HPの半分以上のHPが必要）",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                whenAnyoneDead(me, deadUnit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (deadUnit.dead && deadUnit.isFriend(me) && me.hp >= me.prm(Prm.MAX_HP).total / 2) {
                            deadUnit.dead = false;
                            deadUnit.hp = 0;
                            Heal.run("HP", me.hp / 2, me, deadUnit, Tec.かばう, false);
                            me.hp /= 2;
                            Util.msg.set(`${me.name}は${deadUnit.name}をかばった！`);
                            yield wait();
                        }
                    });
                }
            };
        }
    };
    /**羅文騎士. */
    Tec.ナナ命 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "ナナ命", info: "かばう付与  戦闘開始時、味方にナナがいる場合、ステータス+10",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                battleStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (unit.dead) {
                            return;
                        }
                        for (const u of Unit.players) {
                            if (u.player === Player.ナナ) {
                                [Prm.STR, Prm.MAG, Prm.LIG, Prm.DRK, Prm.CHN, Prm.PST, Prm.GUN, Prm.ARR].forEach(prm => unit.prm(prm).battle += 10);
                                break;
                            }
                        }
                    });
                }
                whenAnyoneDead(me, deadUnit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Tec.かばう.force.whenAnyoneDead(me, deadUnit);
                    });
                }
            };
        }
    };
    /**体術士. */
    Tec.合気道 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "合気道", info: "格闘反撃時、過去値を加算",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘") && !dmg.canCounter) {
                            dmg.abs.add += dmg.attacker.prm(Prm.PST).total;
                        }
                    });
                }
            };
        }
    };
    /**体術士. */
    Tec.太極拳 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "太極拳", info: "＜盾＞状態時、格闘攻撃を受けると反射",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.canCounter && dmg.hasType("格闘") && dmg.target.hasCondition(Condition.盾)) {
                            Unit.set反射Inv(dmg.target);
                        }
                    });
                }
            };
        }
    };
    /**体術士. */
    Tec.身体器 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "身体器", info: "戦闘開始時、最大HP・現在HP+20%",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                battleStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (unit.dead) {
                            return;
                        }
                        const value = unit.prm(Prm.MAX_HP).total * 0.2;
                        unit.prm(Prm.MAX_HP).battle += value;
                        Heal.run("HP", value, unit, unit, Tec.身体器, false);
                    });
                }
            };
        }
    };
    /**勇者. */
    Tec.結束の陣形 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "結束の陣形", info: "戦闘開始時、自分以外の味方の最大HP・現在HP+10%",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                battleStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (unit.dead) {
                            return;
                        }
                        const targets = unit.searchUnitsEx("party").filter(u => u !== unit);
                        for (const t of targets) {
                            const value = t.prm(Prm.MAX_HP).total * 0.1;
                            t.prm(Prm.MAX_HP).battle += value;
                            Heal.run("HP", value, unit, t, Tec.結束の陣形, false);
                        }
                    });
                }
            };
        }
    };
    /**勇者. */
    Tec.勇気 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "勇気", info: "格闘・槍・怨霊・銃・弓攻撃時、稀にクリティカルⅡ～Ⅳ発動",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("格闘", "槍", "怨霊", "銃", "弓")) {
                            if (Math.random() < 0.2) {
                                Util.msg.set("＞クリティカルⅡ");
                                dmg.pow.mul *= 1.5;
                            }
                            if (Math.random() < 0.2) {
                                Util.msg.set("＞クリティカルⅢ");
                                dmg.pow.mul *= 1.5;
                            }
                            if (Math.random() < 0.2) {
                                Util.msg.set("＞クリティカルⅣ");
                                dmg.pow.mul *= 1.5;
                            }
                        }
                    });
                }
            };
        }
    };
    /**敵:お化け*/
    Tec.すりぬけ = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "すりぬけ", info: "被攻撃時稀に回避",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                beforeBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (Math.random() < 0.2) {
                            Util.msg.set("＞すりぬけ");
                            dmg.hit.base = 0;
                        }
                    });
                }
            };
        }
    };
    /**魔剣士. */
    Tec.ミルテの魔壁 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "ミルテの魔壁", info: "HPが0になった時、稀にMPを0にすることで死を逃れる  MP10以上必要  毎ターンMP-1",
                sort: TecSort.強化, type: TecType.その他,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.mp--;
                    });
                }
                whenDead(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!unit.dead) {
                            return;
                        }
                        if (unit.mp >= 10 && Math.random() < 0.33) {
                            unit.dead = false;
                            unit.hp = 0;
                            Heal.run("HP", unit.mp, unit, unit, Tec.ミルテの魔壁, false);
                            unit.mp = 0;
                            Util.msg.set(`${unit.name}は死を逃れた`);
                            yield wait();
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-強化Passive
    //弱体Active
    //
    //--------------------------------------------------------------------------
    /**毒使い. */
    Tec.ポイズンバタフライ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ポイズンバタフライ", info: "一体を＜毒＞化",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.awa.play();
                FX_Poison(target.imgCenter);
                const value = attacker.prm(Prm.DRK).total * 2 + 1;
                Unit.setCondition(target, Condition.毒, value);
                yield wait();
            });
        }
    };
    /**毒使い. */
    Tec.恵まれし者 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "恵まれし者", info: "味方全体を＜癒＞化、敵全体を＜毒＞化",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["all", "withFriend"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        useMessage(attacker) {
            const _super = Object.create(null, {
                useMessage: { get: () => super.useMessage }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.useMessage.call(this, attacker);
                if (this.checkCost(attacker)) {
                    Sound.up.play();
                    Sound.awa.play();
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                if (target.isFriend(attacker)) {
                    Unit.setCondition(target, Condition.癒, 3);
                }
                else {
                    const value = attacker.prm(Prm.DRK).total * 2 + 1;
                    FX_Poison(target.imgCenter);
                    Unit.setCondition(target, Condition.毒, value);
                }
            });
        }
    };
    /**アメーバ. */
    Tec.弱体液 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "弱体液", info: "一体を＜防↓2＞状態にする",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.awa.play();
                Unit.setCondition(target, Condition.防御低下, 2);
                yield wait();
            });
        }
    };
    /**テンプルナイト. */
    Tec.光の護封剣 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "光の護封剣", info: "敵全体を＜攻↓5＞状態にする",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["all"],
                mul: 1, num: 1, hit: 1, mp: 9,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.sin.play();
                Unit.setCondition(target, Condition.攻撃低下, 5);
                yield wait();
            });
        }
    };
    /**ダウザー. */
    Tec.SORRYCSTEF = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "SORRYCSTEF", info: "敵全体を＜眠1＞状態にする",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["all"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        toString() { return "SORRY, C･STEF"; }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.sin.play();
                Unit.setCondition(target, Condition.眠, 1);
                yield wait(1);
            });
        }
    };
    /**ホークマン. */
    Tec.煙幕 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "煙幕", info: "敵全体を＜命中↓5＞化",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["all"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.awa.play();
                Unit.setCondition(target, Condition.命中低下, 5);
                yield wait();
            });
        }
    };
    /**アングラ. */
    Tec.感染 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "感染", info: "一体を＜病気＞(毎ターン、味方全体にダメージ)化",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.awa.play();
                FX_Poison(target.imgCenter);
                Unit.setCondition(target, Condition.病気, attacker.prm(Prm.DRK).total * 2 + 1);
                yield wait();
            });
        }
    };
    /**ブルージェリー. */
    Tec.罪 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "罪", info: "一体を＜攻↓5＞状態にする",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 1, tp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.awa.play();
                FX_Debuff(target.imgCenter);
                Unit.setCondition(target, Condition.攻撃低下, 5);
                yield wait();
            });
        }
    };
    /**ブルージェリー. */
    Tec.心 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "心", info: "一体の攻撃力と自分の攻撃力を相殺する",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.awa.play();
                FX_Debuff(target.imgCenter);
                FX_Debuff(attacker.imgCenter);
                const astr = attacker.prm(Prm.STR).total;
                const tstr = target.prm(Prm.STR).total;
                let value = astr < tstr ? astr : tstr;
                attacker.prm(Prm.STR).battle -= value;
                target.prm(Prm.STR).battle -= value;
                Util.msg.set(`${attacker.name}と${target.name}の力が相殺された`);
                yield wait();
            });
        }
    };
    /**エスパー. */
    Tec.オルゴン = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "オルゴン", info: "一体を＜疲労10＞(TP-10%)状態にし、自分を＜風10＞(TP+1)状態にする",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 6, tp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.down.play();
                FX_Debuff(target.imgCenter);
                Unit.setCondition(target, Condition.疲労, 10);
                Sound.up.play();
                FX_Buff(attacker.imgCenter);
                Unit.setCondition(attacker, Condition.風, 10);
            });
        }
    };
    /**鳥. */
    Tec.妖艶なる目 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "妖艶なる目", info: "敵全体を＜混乱1＞化する",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["all"],
                mul: 1, num: 1, hit: 1, mp: 6, ep: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.down.play();
                FX_Debuff(target.imgCenter);
                Unit.setCondition(target, Condition.混乱, 1);
                yield wait(1);
            });
        }
    };
    /**敵:ゾンビ. */
    Tec.断末魔 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "断末魔", info: "一体の力を1/10にする",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, sp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.DARK.play();
                FX_Debuff(target.imgCenter);
                target.prm(Prm.STR).battle -= target.prm(Prm.STR).total * 0.9;
                Util.msg.set(`${target.name}の力が1/10になった！`);
                yield wait();
            });
        }
    };
    /**阿修羅. */
    Tec.明日世界が終わる = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "明日世界が終わる", info: "敵全体を＜時3＞（3ターン後に＜爆弾＞化）化する",
                sort: TecSort.弱体, type: TecType.状態, targetings: ["all"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        toString() { return "明日、世界が終わる"; }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.DARK.play();
                FX_Debuff(target.imgCenter);
                Unit.setCondition(target, Condition.時限, 3, true);
                yield wait(1);
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-弱体Active
    //弱体Passive
    //
    //--------------------------------------------------------------------------
    /**密猟ハンター. */
    Tec.捕獲 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "捕獲", info: "銃・弓攻撃時、相手が獣ジョブでHP30%未満の場合、＜鎖1＞化させる",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterDoAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (dmg.hasType("銃", "弓") && dmg.target.job.beast && dmg.target.hp < dmg.target.prm(Prm.MAX_HP).total * 0.3) {
                            Unit.setCondition(dmg.target, Condition.鎖, 1);
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-弱体Passive
    //回復Active
    //
    //--------------------------------------------------------------------------
    /**天使. */
    Tec.数珠 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "数珠", info: "一体を光依存で回復",
                sort: TecSort.回復, type: TecType.回復, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                this.effect(attacker, target);
                Heal.run("HP", attacker.prm(Prm.LIG).total + attacker.prm(Prm.LV).total, attacker, target, this, true);
                yield wait();
            });
        }
    };
    /**ノーム.医師. */
    Tec.良き占い = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "良き占い", info: "味方全体を光依存で回復",
                sort: TecSort.回復, type: TecType.回復, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 6,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Tec.数珠.run(attacker, target);
            });
        }
    };
    /**未習得技. */
    Tec.無我 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "無我", info: "自分のTPを2回復",
                sort: TecSort.回復, type: TecType.回復, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Heal.run("TP", 2, target, target, this, true);
                yield wait();
            });
        }
    };
    /**魔法使い. */
    Tec.ジョンD = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ジョンD", info: "自分の最大MPを倍加　MP回復　魔x2",
                sort: TecSort.回復, type: TecType.回復, targetings: ["self"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.sin.play();
                Util.msg.set(`${target.name}に魔力が満ちる...！`);
                yield wait();
                if (target.prm(Prm.MAX_MP).battle < target.prm(Prm.MAX_MP).base + target.prm(Prm.MAX_MP).eq) {
                    target.prm(Prm.MAX_MP).battle = target.prm(Prm.MAX_MP).base + target.prm(Prm.MAX_MP).eq;
                }
                if (target.prm(Prm.MAG).battle < target.prm(Prm.MAG).base + target.prm(Prm.MAG).eq) {
                    target.prm(Prm.MAG).battle = target.prm(Prm.MAG).base + target.prm(Prm.MAG).eq;
                }
                target.mp = target.prm(Prm.MAX_MP).total;
                Sound.up.play();
                FX_Buff(target.imgCenter);
                Util.msg.set(`MP全回復 & 魔力x2！！`);
                yield wait();
            });
        }
    };
    /**天使. */
    Tec.ユグドラシル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ユグドラシル", info: "味方全員を蘇生・全回復",
                sort: TecSort.回復, type: TecType.回復, targetings: ["all", "friendOnly", "withDead"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        useMessage(attacker) {
            const _super = Object.create(null, {
                useMessage: { get: () => super.useMessage }
            });
            return __awaiter(this, void 0, void 0, function* () {
                if (this.checkCost(attacker)) {
                    Sound.sin.play();
                }
                yield _super.useMessage.call(this, attacker);
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                target.dead = false;
                Heal.run("HP", target.prm(Prm.MAX_HP).total, attacker, target, this, false);
                Heal.run("MP", target.prm(Prm.MAX_MP).total, attacker, target, this, false);
                Heal.run("TP", target.prm(Prm.MAX_TP).total, attacker, target, this, false);
                target.clearConditions();
                Sound.KAIFUKU.play();
                this.effect(attacker, target);
                Util.msg.set(`${target.name}は全回復した！`, Color.GREEN.bright);
                yield wait();
            });
        }
    };
    /**プリースト. */
    Tec.ヨトゥンヘイム = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ヨトゥンヘイム", info: "第2ユグドラシル",
                sort: TecSort.回復, type: TecType.回復, targetings: ["all", "friendOnly", "withDead"],
                mul: 1, num: 1, hit: 1, xp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Tec.ユグドラシル.run(attacker, target);
            });
        }
    };
    /**忍者. */
    Tec.ジライヤ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ジライヤ", info: "自分のHPMPTP回復　ステータス+30%　＜回避3＞化",
                sort: TecSort.回復, type: TecType.回復, targetings: ["self"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Heal.run("HP", target.prm(Prm.MAX_HP).total, attacker, target, this, false);
                Heal.run("MP", target.prm(Prm.MAX_MP).total, attacker, target, this, false);
                Heal.run("TP", target.prm(Prm.MAX_TP).total, attacker, target, this, false);
                Sound.KAIFUKU.play();
                this.effect(attacker, target);
                Util.msg.set("全回復！");
                yield wait();
                for (const prm of [Prm.STR, Prm.MAG, Prm.LIG, Prm.DRK, Prm.CHN, Prm.PST, Prm.GUN, Prm.ARR]) {
                    const battleValueMax = (target.prm(prm).base + target.prm(prm).eq) * 0.3;
                    if (target.prm(prm).battle < battleValueMax) {
                        target.prm(prm).battle = battleValueMax;
                    }
                }
                Sound.up.play();
                Util.msg.set("ステータス増加！！");
                yield wait();
                if (!target.hasCondition(Condition.回避.type)) {
                    Sound.up.play();
                    Unit.setCondition(target, Condition.回避, 3);
                    yield wait();
                }
            });
        }
    };
    /**天使. */
    Tec.妖精の粉 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "妖精の粉", info: "味方全体のTP+1",
                sort: TecSort.回復, type: TecType.回復, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                Heal.run("TP", 1, attacker, target, this, true);
                yield wait();
            });
        }
    };
    /**格闘家. */
    Tec.印 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "印", info: "自分のHP+10%",
                sort: TecSort.回復, type: TecType.回復, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 2,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                Heal.run("HP", target.prm(Prm.MAX_HP).total * 0.1 + 1, attacker, target, this, true);
                yield wait();
            });
        }
    };
    /**医師. */
    Tec.解毒 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "解毒", info: "一体の＜毒＞を解除",
                sort: TecSort.回復, type: TecType.回復, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                if (target.hasCondition(Condition.毒)) {
                    Sound.KAIFUKU.play();
                    FX_Buff(target.imgCenter);
                    target.removeCondition(Condition.毒);
                    Util.msg.set(`${target.name}の毒が解除された`, Color.GREEN);
                    yield wait();
                }
            });
        }
    };
    /**医師. */
    Tec.エリス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "エリス", info: "一体を10%のHPで蘇生",
                sort: TecSort.回復, type: TecType.回復, targetings: ["select", "deadOnly", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 10, tp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                FX_約束(target.imgCenter);
                if (target.dead) {
                    target.dead = false;
                    target.hp = 1;
                    Heal.run("HP", target.prm(Prm.MAX_HP).total * 0.1 + 1, attacker, target, this, false);
                    Util.msg.set(`${target.name}は蘇った！`, Color.GREEN.bright);
                    yield wait();
                }
                else {
                    Heal.run("HP", target.prm(Prm.MAX_HP).total * 0.1 + 1, attacker, target, this, true);
                }
            });
        }
    };
    /**僧兵. */
    Tec.五体投地 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "五体投地", info: "味方の死者を2ターン後に蘇生",
                sort: TecSort.回復, type: TecType.回復, targetings: ["all", "deadOnly", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 7,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.sin.play();
                FX_神格(target.imgCenter);
                if (target.dead) {
                    const tec = this;
                    let turnCount = 2;
                    target.addInvisibleCondition(new class extends InvisibleCondition {
                        constructor() {
                            super(...arguments);
                            this.uniqueName = tec.uniqueName;
                        }
                        createForce(_this) {
                            return new class extends Force {
                                phaseStart(u) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        u.removeInvisibleCondition(_this);
                                    });
                                }
                                deadPhaseStart(u) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if (!u.dead) {
                                            u.removeInvisibleCondition(_this);
                                            return;
                                        }
                                        if (--turnCount <= 0) {
                                            u.dead = false;
                                            u.hp = u.prm(Prm.MAX_HP).total * 0.3;
                                            FX_回復(u.imgCenter);
                                            Util.msg.set(`${u.name}は生き返った！`);
                                            yield wait();
                                            u.removeInvisibleCondition(_this);
                                        }
                                        else {
                                            Util.msg.set(`${u.name}蘇りまで残り${turnCount}ターン...`);
                                            yield wait();
                                        }
                                    });
                                }
                            };
                        }
                    });
                }
            });
        }
    };
    /**体術士. */
    Tec.三法印 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "三法印", info: "自分のHPMPTPを20%回復する",
                sort: TecSort.回復, type: TecType.回復, targetings: ["self"],
                mul: 1, num: 1, hit: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                FX_回復(target.imgCenter);
                Heal.run("HP", target.prm(Prm.MAX_HP).total * 0.2, attacker, target, this, true);
                Heal.run("MP", target.prm(Prm.MAX_MP).total * 0.2, attacker, target, this, true);
                Heal.run("TP", target.prm(Prm.MAX_TP).total * 0.2, attacker, target, this, true);
                yield wait();
            });
        }
    };
    /**羅文騎士. */
    Tec.羅文彗星 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "羅文彗星", info: "最大HPMPTPx2 HPMPTP回復",
                sort: TecSort.回復, type: TecType.回復, targetings: ["self"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        useMessage(attacker) {
            const _super = Object.create(null, {
                useMessage: { get: () => super.useMessage }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.useMessage.call(this, attacker);
                if (attacker instanceof PUnit && attacker.player === Player.ジスロフ && this.checkCost(attacker)) {
                    Player.jisrofUsedRamonsuisei = true;
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                target.prm(Prm.MAX_HP).battle = target.prm(Prm.MAX_HP).base + target.prm(Prm.MAX_HP).eq;
                target.prm(Prm.MAX_MP).battle = target.prm(Prm.MAX_MP).base + target.prm(Prm.MAX_MP).eq;
                target.prm(Prm.MAX_TP).battle = target.prm(Prm.MAX_TP).base + target.prm(Prm.MAX_TP).eq;
                Heal.run("HP", target.prm(Prm.MAX_HP).total, attacker, target, this, false);
                Heal.run("MP", target.prm(Prm.MAX_MP).total, attacker, target, this, false);
                Heal.run("TP", target.prm(Prm.MAX_TP).total, attacker, target, this, false);
                this.effect(attacker, target);
                Sound.KAIFUKU.play();
                Util.msg.set("最大HPMPTPx2！");
                yield wait();
            });
        }
    };
    /**ペガサス. */
    Tec.ペガサスダンス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ペガサスダンス", info: "味方全員のHP+10%  対面の敵にその回復値分のダメージ",
                sort: TecSort.回復, type: TecType.回復, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 5,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                Sound.chain.play();
                for (const party of attacker.searchUnitsEx("party")) {
                    const value = Heal.run("HP", party.prm(Prm.MAX_HP).total * 0.1, attacker, party, this, false);
                    for (const enemy of party.searchUnitsEx("faceToFace")) {
                        FX_鎖術(party.imgCenter, enemy.imgCenter);
                        const dmg = new Dmg({
                            attacker: attacker,
                            target: enemy,
                            absPow: value,
                        });
                        yield dmg.run();
                        yield wait(1);
                    }
                }
            });
        }
    };
    /**プリースト. */
    Tec.エンジェル1 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "エンジェル1", info: "対象の＜契約＞以外のLv1状態異常を解除",
                sort: TecSort.回復, type: TecType.回復, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 8,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                FX_RemoveCondition(target.imgCenter);
                if (!target.hasCondition(Condition.契約)) {
                    target.removeCondition(ConditionType.BAD_LV1);
                }
            });
        }
    };
    /**プリースト. */
    Tec.スピリット2 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "スピリット2", info: "対象のLv2状態異常を解除",
                sort: TecSort.回復, type: TecType.回復, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 8,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                FX_RemoveCondition(target.imgCenter);
                target.removeCondition(ConditionType.BAD_LV2);
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-回復Active
    //回復Passive
    //
    //--------------------------------------------------------------------------
    /**訓練生. */
    Tec.HP自動回復 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "HP自動回復", info: "毎ターンHP+1%",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Heal.run("HP", 1 + unit.prm(Prm.MAX_HP).total * 0.01, unit, unit, Tec.HP自動回復, false);
                    });
                }
            };
        }
    };
    /**医師. */
    Tec.衛生 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "衛生", info: "毎ターン味方全体のHP+5%",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Sound.KAIFUKU.play();
                        for (const u of unit.searchUnitsEx("party")) {
                            Heal.run("HP", 1 + u.prm(Prm.MAX_HP).total * 0.05, unit, u, Tec.衛生, false);
                        }
                    });
                }
            };
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
    Tec.MP自動回復 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "MP自動回復", info: "毎ターンMP+1",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Heal.run("MP", 1, unit, unit, this, false);
                    });
                }
            };
        }
    };
    /**メイガス. */
    Tec.MP自動回復2 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "MP自動回復2", info: "毎ターンMP+2",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        toString() { return "MP自動回復Ⅱ"; }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Heal.run("MP", 1, unit, unit, this, false);
                    });
                }
            };
        }
    };
    /**ガーディアン. */
    Tec.HPMP回復 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "HPMP回復", info: "毎ターンHP+1%MP+1",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Heal.run("HP", 1 + unit.prm(Prm.MAX_HP).total * 0.01, unit, unit, Tec.HPMP回復, false);
                        Heal.run("MP", 1, unit, unit, Tec.HPMP回復, false);
                    });
                }
            };
        }
    };
    Tec.TP自動回復 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "TP自動回復", info: "毎ターンTP+1　HPMP-1",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        unit.hp--;
                        unit.mp--;
                        Heal.run("TP", 1, unit, unit, this, false);
                    });
                }
            };
        }
    };
    Tec.血技の技巧 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "血技の技巧", info: "敵から攻撃を受けた時、稀にHP5を吸収",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                afterBeAtk(dmg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (Math.random() < 0.33) {
                            Sound.drain.play();
                            FX_吸収(dmg.target.imgCenter, dmg.attacker.imgCenter);
                            Util.msg.set("＞血技の技巧");
                            const value = 5;
                            const _dmg = new Dmg({
                                attacker: dmg.target,
                                target: dmg.attacker,
                                absPow: value,
                                canCounter: false,
                                types: ["吸収"],
                            });
                            yield _dmg.run(false);
                            Heal.run("HP", _dmg.result.value, dmg.target, dmg.attacker, Tec.血技の技巧, true);
                        }
                    });
                }
            };
        }
    };
    /**ドラゴン. */
    Tec.自然治癒 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "自然治癒", info: "毎ターンHP+5%",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        Heal.run("HP", 1 + unit.prm(Prm.MAX_HP).total * 0.05, unit, unit, Tec.自然治癒, false);
                    });
                }
            };
        }
    };
    /**勇者. */
    Tec.友情の陣形 = new class extends PassiveTec {
        constructor() {
            super({ uniqueName: "友情の陣形", info: "毎ターン、自分を除く味方のTP+1",
                sort: TecSort.回復, type: TecType.回復,
            });
        }
        createForce(_this) {
            return new class extends Force {
                phaseStart(unit) {
                    return __awaiter(this, void 0, void 0, function* () {
                        for (const t of unit.searchUnitsEx("party").filter(u => u !== unit && !u.dead)) {
                            Heal.run("TP", 1, unit, t, Tec.友情の陣形, false);
                        }
                    });
                }
            };
        }
    };
    //--------------------------------------------------------------------------
    //
    //-回復Passive
    //その他Active
    //
    //--------------------------------------------------------------------------
    Tec.何もしない = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "何もしない", info: "何もしないをする",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1,
            });
        }
        use(attacker, targets) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.exp.play();
                Util.msg.set(`${attacker.name}は空を眺めている...`);
                yield wait();
            });
        }
    };
    Tec.自爆 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "自爆", info: "敵全体に自分のHP分のダメージを与える　HP=0",
                sort: TecSort.その他, type: TecType.その他, targetings: ["all"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        useMessage(attacker) {
            const _super = Object.create(null, {
                useMessage: { get: () => super.useMessage }
            });
            return __awaiter(this, void 0, void 0, function* () {
                Util.msg.set(`${attacker.name}の体から光が溢れる...`);
                yield wait();
                yield _super.useMessage.call(this, attacker);
                if (this.checkCost(attacker)) {
                    Sound.bom2.play();
                    FX_BOM(attacker.imgCenter);
                }
            });
        }
        use(attacker, targets) {
            const _super = Object.create(null, {
                use: { get: () => super.use }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const canUse = this.checkCost(attacker);
                yield _super.use.call(this, attacker, targets);
                if (canUse) {
                    attacker.hp = 0;
                }
                else {
                    Util.msg.set(`光に吸い寄せられた虫が体にいっぱいくっついた...`);
                    yield wait();
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const dmg = new Dmg({
                    attacker: attacker,
                    target: target,
                    absPow: attacker.hp,
                    canCounter: false,
                });
                yield dmg.run();
                yield wait(1);
            });
        }
    };
    /**ドラゴン. */
    Tec.ドラゴンブレス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ドラゴンブレス", info: "敵全体に[最大HP-現在HP]のダメージを与える",
                sort: TecSort.その他, type: TecType.その他, targetings: ["all"],
                mul: 1, num: 1, hit: 1, ep: 1,
            });
        }
        useMessage(attacker) {
            const _super = Object.create(null, {
                useMessage: { get: () => super.useMessage }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.useMessage.call(this, attacker);
                Sound.dragon.play();
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const dmg = new Dmg({
                    attacker: attacker,
                    target: target,
                    absPow: attacker.prm(Prm.MAX_HP).total - attacker.hp,
                });
                yield dmg.run();
                yield wait(1);
            });
        }
    };
    /**メイガス. */
    Tec.魔力開放 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "魔力開放", info: "敵全体に魔+現在MPのダメージ",
                sort: TecSort.その他, type: TecType.その他, targetings: ["all"],
                mul: 1, num: 1, hit: 1, xp: 1,
            });
        }
        useMessage(attacker) {
            const _super = Object.create(null, {
                useMessage: { get: () => super.useMessage }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.useMessage.call(this, attacker);
                if (this.checkCost(attacker)) {
                    Sound.bom2.play();
                    FX_BOM(attacker.imgCenter);
                }
            });
        }
        use(attacker, targets) {
            const _super = Object.create(null, {
                use: { get: () => super.use }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const canUse = this.checkCost(attacker);
                yield _super.use.call(this, attacker, targets);
                if (canUse) {
                    attacker.mp = 0;
                }
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                FX_格闘(target.imgCenter);
                TecType.格闘.sound();
                const dmg = new Dmg({
                    attacker: attacker,
                    target: target,
                    absPow: attacker.mp,
                    canCounter: false,
                });
                yield dmg.run();
                yield wait(1);
            });
        }
    };
    Tec.ドゥエルガル = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ドゥエルガル", info: "ドゥエルガルを召喚する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 5, item: () => [[Item.絵画母なる星の緑の丘, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const hp = randomInt(1, 2, "[]");
                attacker.pet = Pet.ドゥエルガル.create(hp);
                FX_Buff(attacker.imgCenter);
                Sound.warp.play();
                Util.msg.set("ドゥエルガルが召喚された！");
                yield wait();
            });
        }
    };
    Tec.ネーレイス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ネーレイス", info: "ネーレイスを召喚する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 5, item: () => [[Item.絵画シェイクスピアの涙, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const hp = randomInt(1, 2, "[]");
                attacker.pet = Pet.ネーレイス.create(hp);
                FX_Buff(attacker.imgCenter);
                Sound.warp.play();
                Util.msg.set("ネーレイスが召喚された！");
                yield wait();
            });
        }
    };
    Tec.ヴァルナ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ヴァルナ", info: "ヴァルナを召喚する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 10, item: () => [[Item.絵画彼女の髪, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const hp = randomInt(1, 2, "[]");
                attacker.pet = Pet.ヴァルナ.create(hp);
                FX_Buff(attacker.imgCenter);
                Sound.warp.play();
                Util.msg.set("ヴァルナが召喚された！");
                yield wait();
            });
        }
    };
    Tec.イリューガー = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "イリューガー", info: "イリューガーを召喚する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 10, item: () => [[Item.絵画我が情熱の日, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const hp = randomInt(1, 2, "[]");
                attacker.pet = Pet.イリューガー.create(hp);
                FX_Buff(attacker.imgCenter);
                Sound.warp.play();
                Util.msg.set("イリューガーが召喚された！");
                yield wait();
            });
        }
    };
    Tec.マーメイド = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "マーメイド", info: "マーメイドを召喚する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 10, item: () => [[Item.マーメイド, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const hp = randomInt(1, 2, "[]");
                attacker.pet = Pet.マーメイド.create(hp);
                FX_Buff(attacker.imgCenter);
                Sound.warp.play();
                Util.msg.set("マーメイドが召喚された！");
                yield wait();
            });
        }
    };
    Tec.ホムンクルス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ホムンクルス", info: "ホムンクルスを召喚する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 10, item: () => [[Item.ホムンクルス, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const hp = randomInt(1, 2, "[]");
                attacker.pet = Pet.ホムンクルス.create(hp);
                FX_Buff(attacker.imgCenter);
                Sound.warp.play();
                Util.msg.set("ホムンクルスが召喚された！");
                yield wait();
            });
        }
    };
    Tec.フランケンシュタイン = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "フランケンシュタイン", info: "フランケンシュタインを召喚する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 10, item: () => [[Item.フランケンシュタイン, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const hp = randomInt(1, 2, "[]");
                attacker.pet = Pet.フランケンシュタイン.create(hp);
                FX_Buff(attacker.imgCenter);
                Sound.warp.play();
                Util.msg.set("フランケンシュタインが召喚された！");
                yield wait();
            });
        }
    };
    /**コールドシリーズ. */
    Tec.VIRGINデルタ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "VIRGINデルタ", info: "宇宙戦艦VIRGIN-⊿を召喚する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["self"],
                mul: 1, num: 1, hit: 1, mp: 10, item: () => [[Item.VIRGINデルタ, 1]],
            });
        }
        toString() { return "VIRGIN-⊿"; }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                const hp = randomInt(1, 2, "[]");
                attacker.pet = Pet.VIRGINデルタ.create(hp);
                FX_Buff(attacker.imgCenter);
                Sound.warp.play();
                Util.msg.set("VIRGIN-⊿が召喚された！");
                yield wait();
            });
        }
    };
    Tec.死体除去 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "死体除去", info: "死亡した人間型ユニット一体を除去する",
                sort: TecSort.その他, type: TecType.その他, targetings: ["select", "deadOnly"],
                mul: 1, num: 1, hit: 1, mp: 1, item: () => [[Item.Dフラスコ, 1]],
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                if (target instanceof EUnit && target.dead && !target.job.beast) {
                    target.exists = false;
                    FX_神格(target.imgCenter);
                    Sound.sin.play();
                    Util.msg.set(`${target.name}の死体が消滅した...`);
                    yield wait();
                }
            });
        }
    };
    Tec.溶ける = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "溶ける", info: "自分のHPを10%を削り、その倍の値をダメージとして一体に与える",
                sort: TecSort.その他, type: TecType.その他, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 4,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.awa.play();
                const value = attacker.prm(Prm.MAX_HP).total * 0.1;
                attacker.hp -= value;
                const dmg = new Dmg({
                    attacker: attacker,
                    target: target,
                    absPow: value * 2,
                });
                yield dmg.run();
                yield wait();
            });
        }
    };
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
    Tec.キュア = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "キュア", info: "味方一体のHP回復",
                sort: TecSort.その他, type: TecType.回復, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 4,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                Heal.run("HP", attacker.prm(Prm.LV).total, attacker, target, this, true);
                yield wait();
            });
        }
    };
    /**ペット:ネーレイス. */
    Tec.ラクサスキュア = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ラクサスキュア", info: "味方一体のTP+1",
                sort: TecSort.その他, type: TecType.回復, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 4,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.KAIFUKU.play();
                Heal.run("TP", 1, attacker, target, this, true);
                yield wait();
            });
        }
    };
    /**ペット:強化ネーレイス. */
    Tec.イスキュア = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "イスキュア", info: "味方全体のHP回復",
                sort: TecSort.その他, type: TecType.回復, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 4,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Tec.キュア.run(attacker, target);
            });
        }
    };
    /**ペット:ドゥエルガル. */
    Tec.パンチ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "パンチ", info: "一体に格闘攻撃",
                sort: TecSort.その他, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 1,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.types.push("ペット");
            return dmg;
        }
    };
    /**ペット:ヴァルナ. */
    Tec.シルフ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "シルフ", info: "一体を＜回避＞化",
                sort: TecSort.その他, type: TecType.格闘, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Unit.setCondition(target, Condition.回避, 1);
                yield wait();
            });
        }
    };
    /**ペット:ヴァルナ. */
    Tec.レヴィーナの歌声 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "レヴィーナの歌声", info: "一体を＜眠＞化",
                sort: TecSort.その他, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Unit.setCondition(target, Condition.眠, 1);
                yield wait();
            });
        }
    };
    /**ペット:ヴァルナ. */
    Tec.ヴァルナパンチ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ヴァルナパンチ", info: "一体に格闘攻撃",
                sort: TecSort.その他, type: TecType.格闘, targetings: ["select"],
                mul: 1, num: 1, hit: 1, mp: 3,
            });
        }
        toString() { return "殴る"; }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.types.push("ペット");
            return dmg;
        }
    };
    /**ペット:イリューガー. */
    Tec.ファイアブレス = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ファイアブレス", info: "敵全体に魔法攻撃",
                sort: TecSort.その他, type: TecType.魔法, targetings: ["all"],
                mul: 1, num: 1, hit: 1, mp: 6,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.types.push("ペット");
            return dmg;
        }
    };
    /**ペット:マーメイド. */
    Tec.人魚の歌 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "人魚の歌", info: "一体を＜眠1＞化",
                sort: TecSort.その他, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 1,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                Sound.sin.play();
                Unit.setCondition(target, Condition.眠, 1);
                yield wait();
            });
        }
    };
    /**ペット:マーメイド. */
    Tec.生命の歌 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "生命の歌", info: "自分以外の味方のHP回復",
                sort: TecSort.その他, type: TecType.回復, targetings: ["all", "friendOnly"],
                mul: 1, num: 1, hit: 1, tp: 2,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                if (attacker === target) {
                    return;
                }
                FX_回復(target.imgCenter);
                Sound.KAIFUKU.play();
                Heal.run("HP", attacker.prm(Prm.LV).total * 0.5 + 1, attacker, target, this, true);
                yield wait();
            });
        }
    };
    /**ペット:ホムンクルス. */
    Tec.ブラッドパンチ = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "ブラッドパンチ", info: "一体に格闘攻撃 ダメージの半分をHPとして吸収",
                sort: TecSort.その他, type: TecType.状態, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 1,
            });
        }
        runInner(dmg) {
            const _super = Object.create(null, {
                runInner: { get: () => super.runInner }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.runInner.call(this, dmg);
                if (dmg.result.isHit) {
                    Sound.drain.play();
                    FX_吸収(dmg.attacker.imgCenter, dmg.target.imgCenter);
                    Heal.run("HP", dmg.result.value, dmg.target, dmg.attacker, this, false);
                    yield wait();
                }
            });
        }
    };
    /**ペット:フランケンシュタイン. */
    Tec.サイクロン = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "サイクロン", info: "敵全体に過去攻撃",
                sort: TecSort.その他, type: TecType.過去, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 2,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.types.push("ペット");
            return dmg;
        }
    };
    /**ペット:VIRGIN. */
    Tec.VIRGINレーザー = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "VIRGINレーザー", info: "敵全体に機械攻撃",
                sort: TecSort.その他, type: TecType.機械, targetings: ["select"],
                mul: 1, num: 1, hit: 1, tp: 3,
            });
        }
        createDmg(attacker, target) {
            const dmg = super.createDmg(attacker, target);
            dmg.pow.base = attacker.prm(Prm.LV).total;
            dmg.types.push("ペット");
            return dmg;
        }
    };
    /**ペット:VIRGIN. */
    Tec.VIRGINバリア = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "VIRGINバリア", info: "味方一体を＜バリア＞化",
                sort: TecSort.その他, type: TecType.機械, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, tp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                FX_Buff(target.imgCenter);
                Sound.baria2.play();
                Unit.setCondition(target, Condition.バリア, 1, true);
                yield wait();
            });
        }
    };
    /**ペット:VIRGIN. */
    Tec.補給 = new class extends ActiveTec {
        constructor() {
            super({ uniqueName: "補給", info: "味方一体のMPとTPを10%回復",
                sort: TecSort.その他, type: TecType.機械, targetings: ["select", "friendOnly"],
                mul: 1, num: 1, hit: 1, tp: 3,
            });
        }
        run(attacker, target) {
            return __awaiter(this, void 0, void 0, function* () {
                FX_回復(target.imgCenter);
                Sound.KAIFUKU.play();
                Heal.run("MP", target.prm(Prm.MAX_MP).total * 0.1, attacker, target, this, true);
                Heal.run("TP", target.prm(Prm.MAX_TP).total * 0.1, attacker, target, this, true);
                yield wait();
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //-ペットActive
    //カウンター（無習得）
    //
    //--------------------------------------------------------------------------
    const createCounter = (type) => {
        return new class extends ActiveTec {
            constructor() {
                super({ uniqueName: type.toString() + "反撃", info: "反撃",
                    sort: TecSort.その他, type, targetings: ["select"],
                    mul: 1, num: 1, hit: 1,
                });
            }
            createDmg(attacker, target) {
                const dmg = super.createDmg(attacker, target);
                dmg.canCounter = false;
                return dmg;
            }
        };
    };
    Tec.格闘反撃 = createCounter(TecType.格闘);
    Tec.魔法反撃 = createCounter(TecType.魔法);
    Tec.神格反撃 = createCounter(TecType.神格);
    Tec.暗黒反撃 = createCounter(TecType.暗黒);
    Tec.鎖術反撃 = createCounter(TecType.鎖術);
    Tec.過去反撃 = createCounter(TecType.過去);
    Tec.銃反撃 = createCounter(TecType.銃);
    Tec.弓反撃 = createCounter(TecType.弓);
})(Tec || (Tec = {}));
