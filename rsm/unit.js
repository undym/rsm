var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Player } from "./player.js";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Color, Rect } from "./undym/type.js";
import { Tec, ActiveTec, PassiveTec } from "./tec.js";
import { Dmg, Force, Heal } from "./force.js";
import { Job } from "./job.js";
import { FX_Str, FX_LVUP, FX_反射 } from "./fx/fx.js";
import { ConditionType, Condition, InvisibleCondition } from "./condition.js";
import { Eq, EqPos, EqEar } from "./eq.js";
import { choice } from "./undym/random.js";
import { Font } from "./graphics/graphics.js";
import { Img } from "./graphics/texture.js";
// import { DrawSTBox } from "./scene/sceneutil.js";
import { Sound } from "./sound.js";
class PrmSet {
    constructor() {
        this._base = 0;
        this._eq = 0;
        this._battle = 0;
    }
    get base() { return this._base; }
    set base(value) { this._base = value | 0; }
    get eq() { return this._eq; }
    set eq(value) { this._eq = value | 0; }
    get battle() { return this._battle; }
    set battle(value) { this._battle = value | 0; }
    get total() {
        let res = this.base + this.eq + this.battle;
        if (res < 0) {
            return 0;
        }
        return res;
    }
    get(...type) {
        let res = 0;
        for (const t of type) {
            switch (t) {
                case "base":
                    res += this.base;
                    break;
                case "eq":
                    res += this.eq;
                    break;
                case "battle":
                    res += this.battle;
                    break;
            }
        }
        return res > 0 ? res : 0;
    }
}
export class Prm {
    constructor(_toString) {
        this.toString = () => _toString;
        this.ordinal = Prm.ordinalNow++;
        Prm._values.push(this);
    }
    static get values() { return this._values; }
}
Prm._values = [];
Prm.ordinalNow = 0;
Prm.HP = new Prm("HP");
Prm.MAX_HP = new Prm("最大HP");
Prm.MP = new Prm("MP");
Prm.MAX_MP = new Prm("最大MP");
Prm.TP = new Prm("TP");
Prm.MAX_TP = new Prm("最大TP");
Prm.STR = new Prm("力");
Prm.MAG = new Prm("魔");
Prm.LIG = new Prm("光");
Prm.DRK = new Prm("闇");
Prm.CHN = new Prm("鎖");
Prm.PST = new Prm("過");
Prm.GUN = new Prm("銃");
Prm.ARR = new Prm("弓");
Prm.LV = new Prm("Lv");
Prm.EXP = new Prm("Exp");
Prm.BP = new Prm("BP");
Prm.EP = new Prm("EP");
Prm.MAX_EP = new Prm("最大EP");
Prm.XP = new Prm("XP");
Prm.MAX_XP = new Prm("最大XP");
Prm.SP = new Prm("SP");
Prm.GHOST = new Prm("GHOST");
export class Unit {
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    constructor() {
        this.name = "";
        this.exists = false;
        this.dead = false;
        this.tecs = [];
        /**戦闘時の。 */
        this.tecListScroll = 0;
        // protected prmSets = new Map<Prm,PrmSet>();
        this.prmSets = [];
        this.equips = [];
        this.eqEars = [];
        this.conditions = [];
        this.invisibleConditions = [];
        this.boxBounds = Rect.ZERO;
        this.imgBounds = Rect.ZERO;
        this.img = Img.empty;
        for (const prm of Prm.values) {
            this.prmSets.push(new PrmSet());
        }
        this.prm(Prm.MAX_EP).base = Unit.DEF_MAX_EP;
        this.prm(Prm.MAX_XP).base = Unit.DEF_MAX_XP;
        for (let type of ConditionType.values) {
            this.conditions.push({ condition: Condition.empty, value: 0 });
        }
        for (const pos of EqPos.values) {
            this.equips.push(Eq.getDef(pos));
        }
        for (let i = 0; i < Unit.EAR_NUM; i++) {
            this.eqEars.push(EqEar.getDef());
        }
        this.job = Job.訓練生;
    }
    static get players() { return this._players; }
    static get enemies() { return this._enemies; }
    static get all() { return this._all; }
    static init() {
        let player_num = 4;
        let enemy_num = 4;
        this._players = [];
        for (let i = 0; i < player_num; i++) {
            this._players.push(Player.empty.ins);
        }
        this._enemies = [];
        for (let i = 0; i < enemy_num; i++) {
            this._enemies.push(new EUnit());
        }
        this.resetAll();
    }
    static setPlayer(index, p) {
        this._players[index] = p.ins;
        this.resetAll();
    }
    /** */
    static getFirstPlayer() {
        for (let p of this._players) {
            if (p.exists) {
                return p;
            }
        }
        return this._players[0];
    }
    static resetAll() {
        this._all = [];
        for (let p of this._players) {
            this._all.push(p);
        }
        for (let e of this._enemies) {
            this._all.push(e);
        }
    }
    get boxCenter() { return this.boxBounds.center; }
    get imgCenter() { return this.imgBounds.center; }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    prm(p) { return this.prmSets[p.ordinal]; }
    get hp() { return this.prm(Prm.HP).base; }
    set hp(value) {
        this.prm(Prm.HP).base = value | 0;
        this.fixPrm(Prm.HP, Prm.MAX_HP);
    }
    get mp() { return this.prm(Prm.MP).base; }
    set mp(value) {
        this.prm(Prm.MP).base = value | 0;
        this.fixPrm(Prm.MP, Prm.MAX_MP);
    }
    get tp() { return this.prm(Prm.TP).base; }
    set tp(value) {
        this.prm(Prm.TP).base = value | 0;
        this.fixPrm(Prm.TP, Prm.MAX_TP);
    }
    get ep() { return this.prm(Prm.EP).base; }
    set ep(value) {
        this.prm(Prm.EP).base = value | 0;
        this.fixPrm(Prm.EP, Prm.MAX_EP);
    }
    get sp() { return this.prm(Prm.SP).base; }
    set sp(value) {
        if (value >= 1) {
            this.prm(Prm.SP).base = 1;
        }
        else {
            this.prm(Prm.SP).base = 0;
        }
    }
    get xp() { return this.prm(Prm.XP).base; }
    set xp(value) {
        this.prm(Prm.XP).base = value | 0;
        this.fixPrm(Prm.XP, Prm.MAX_XP);
    }
    get exp() { return this.prm(Prm.EXP).base; }
    set exp(value) { this.prm(Prm.EXP).base = value | 0; }
    get bp() { return this.prm(Prm.BP).base; }
    set bp(value) { this.prm(Prm.BP).base = value | 0; }
    get ghost() { return this.prm(Prm.GHOST).base; }
    set ghost(value) {
        const lim = 999999;
        this.prm(Prm.GHOST).base = value < lim ? value : lim;
    }
    fixPrm(checkPrm, maxPrm) {
        if (this.prm(checkPrm).base > this.prm(maxPrm).total) {
            this.prm(checkPrm).base = this.prm(maxPrm).total;
        }
        if (this.prm(checkPrm).base < 0) {
            this.prm(checkPrm).base = 0;
        }
    }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    judgeDead() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists || this.dead) {
                return;
            }
            if (this.prm(Prm.HP).base > 0) {
                return;
            }
            Sound.death.play();
            this.dead = true;
            Util.msg.set(`${this.name}は死んだ`, Color.RED);
            yield wait();
            for (const u of Unit.all.filter(u => u.exists && !u.dead && u !== this)) {
                yield u.whenAnyoneDead(this);
            }
            if (!this.dead) {
                return;
            }
            yield this.whenDead();
            if (!this.dead) {
                return;
            }
            for (const set of this.conditions) {
                set.condition = Condition.empty;
                set.value = 0;
            }
            this.pet = undefined;
        });
    }
    //---------------------------------------------------------
    //
    //force
    //
    //---------------------------------------------------------
    equip() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const prm of Prm.values) {
                this.prm(prm).eq = 0;
            }
            yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return f.equip(this); }));
        });
    }
    battleStart() {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.battleStart(this); })); });
    }
    deadPhaseStart() {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.deadPhaseStart(this); })); });
    }
    phaseStart(pForce) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.phaseStart(this, pForce); })); });
    }
    attackNum(action, aForce) { this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.attackNum(action, this, aForce); })); }
    beforeDoAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.beforeDoAtk(dmg); })); });
    }
    beforeBeAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.beforeBeAtk(dmg); })); });
    }
    beDamage(dmg) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.beDamage(dmg); })); });
    }
    afterDoAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.afterDoAtk(dmg); })); });
    }
    afterBeAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.afterBeAtk(dmg); })); });
    }
    memberAfterDoAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.memberAfterDoAtk(this, dmg); })); });
    }
    whenDead() {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.whenDead(this); })); });
    }
    whenAnyoneDead(deadUnit) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.whenAnyoneDead(this, deadUnit); })); });
    }
    beHeal(heal) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.beHeal(heal); })); });
    }
    doHeal(heal) {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.doHeal(heal); })); });
    }
    phaseEnd() {
        return __awaiter(this, void 0, void 0, function* () { yield this.force((f) => __awaiter(this, void 0, void 0, function* () { return yield f.phaseEnd(this); })); });
    }
    force(forceDlgt) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const tec of this.tecs) {
                yield forceDlgt(tec.force);
            }
            for (const eq of this.equips.values()) {
                yield forceDlgt(eq.force);
            }
            for (const ear of this.eqEars.values()) {
                yield forceDlgt(ear.force);
            }
            for (const cond of this.conditions.values()) {
                yield forceDlgt(cond.condition.force);
            }
            if (this.pet) {
                yield forceDlgt(this.pet.force);
            }
            for (const inv of this.invisibleConditions.values()) {
                yield forceDlgt(inv.force);
            }
        });
    }
    //---------------------------------------------------------
    //
    //Condition
    //
    //---------------------------------------------------------
    hasCondition(condition) {
        if (condition instanceof Condition) {
            return this.conditions[condition.type.ordinal].condition === condition;
        }
        if (condition instanceof ConditionType) {
            return this.conditions[condition.ordinal].condition !== Condition.empty;
        }
        return false;
    }
    /**指定の状態を解除.その状態でなければ何もしない. */
    removeCondition(condition) {
        if (condition instanceof Condition) {
            const set = this.conditions[condition.type.ordinal];
            if (set.condition === condition) {
                set.condition = Condition.empty;
            }
            return;
        }
        if (condition instanceof ConditionType) {
            this.conditions[condition.ordinal].condition = Condition.empty;
            return;
        }
    }
    clearConditions() {
        for (const set of this.conditions) {
            set.condition = Condition.empty;
            set.value = 0;
        }
    }
    /**valueが1未満ならemptyをセットする。 */
    setCondition(condition, value) {
        const set = this.conditions[condition.type.ordinal];
        if (value < 1) {
            set.condition = Condition.empty;
            set.value = 0;
            return;
        }
        set.condition = condition;
        set.value = value | 0;
    }
    getCondition(type) {
        return this.conditions[type.ordinal].condition;
    }
    /**その状態でなければ0を返す。 */
    getConditionValue(condition) {
        if (condition instanceof Condition) {
            const set = this.conditions[condition.type.ordinal];
            if (set.condition === condition) {
                return set.value;
            }
        }
        if (condition instanceof ConditionType) {
            return this.conditions[condition.ordinal].value;
        }
        return 0;
    }
    /**返り値は変更しても影響なし。 */
    getConditionSet(type) {
        const set = this.conditions[type.ordinal];
        return { condition: set.condition, value: set.value };
    }
    /**1未満になるとemptyをセットする。 */
    addConditionValue(condition, value) {
        value = value | 0;
        if (condition instanceof Condition) {
            const set = this.conditions[condition.type.ordinal];
            if (set.condition === condition) {
                set.value += value;
                if (set.value < 1) {
                    set.condition = Condition.empty;
                }
            }
            return;
        }
        if (condition instanceof ConditionType) {
            const set = this.conditions[condition.ordinal];
            set.value += value;
            if (set.value < 1) {
                set.condition = Condition.empty;
            }
            return;
        }
    }
    //---------------------------------------------------------
    //
    //InvisibleCondition
    //
    //---------------------------------------------------------
    clearInvisibleConditions() { this.invisibleConditions = []; }
    removeInvisibleCondition(remove) {
        this.invisibleConditions = this.invisibleConditions.filter(c => c !== remove);
    }
    addInvisibleCondition(iCondition) {
        this.invisibleConditions.push(iCondition);
    }
    getInvisibleConditions() { return this.invisibleConditions; }
    hasInvisibleCondition(uniqueName) {
        return this.invisibleConditions.some(inv => inv.uniqueName === uniqueName);
    }
    //---------------------------------------------------------
    //
    //Eq
    //
    //---------------------------------------------------------
    getEq(pos) { return this.equips[pos.ordinal]; }
    setEq(pos, eq) { this.equips[pos.ordinal] = eq; }
    //---------------------------------------------------------
    //
    //EqEar
    //
    //---------------------------------------------------------
    getEqEar(index) { return this.eqEars[index]; }
    setEqEar(index, ear) { this.eqEars[index] = ear; }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    /**
     *
     */
    searchUnits(who, num) {
        if (who.some(w => w === "self")) {
            return new Array(num).fill(this);
        }
        let filtered = Unit.all.filter(t => t.exists);
        if (who.some(w => w === "withDead")) { }
        else if (who.some(w => w === "deadOnly")) {
            filtered = filtered.filter(t => t.dead);
        }
        else {
            filtered = filtered.filter(t => !t.dead);
        }
        if (who.some(w => w === "withFriend")) { }
        else if (who.some(w => w === "friendOnly")) {
            filtered = filtered.filter(t => t.isFriend(this));
        }
        else {
            filtered = filtered.filter(t => !t.isFriend(this));
        }
        if (filtered.length === 0) {
            return [];
        }
        if (who.some(w => w === "random")) {
            let res = [];
            for (let i = 0; i < num; i++) {
                res.push(choice(filtered));
            }
            return res;
        }
        if (who.some(w => w === "select")) {
            return new Array(num).fill(choice(filtered));
        }
        //all
        let res = [];
        for (let i = 0; i < num; i++) {
            res = res.concat(filtered);
        }
        return res;
    }
    /**
     * !existsとdeadは含めない.
     * @party 本人を含める.
     * @withDead deadを含める.
     */
    searchUnitsEx(...who) {
        const withDead = who.some(w => w === "withDead");
        const top = who.some(w => w === "top");
        const bottom = who.some(w => w === "bottom");
        const ftf = who.some(w => w === "faceToFace");
        const party = who.some(w => w === "party");
        const searchOwnIndex = (units) => {
            for (let i = 0; i < units.length; i++) {
                if (units[i] === this) {
                    return i;
                }
            }
            return 0;
        };
        const search = (units, others) => {
            const map = new Map();
            const index = searchOwnIndex(units);
            if (top && index > 0) {
                map.set(units[index - 1], true);
            }
            if (bottom && index < units.length - 1) {
                map.set(units[index + 1], true);
            }
            if (ftf) {
                map.set(others[index], true);
            }
            if (party) {
                units.forEach(u => map.set(u, true));
            }
            let res = [];
            for (const key of map.keys()) {
                res.push(key);
            }
            if (!withDead) {
                res = res.filter(u => !u.dead);
            }
            return res.filter(u => u.exists);
        };
        if (this instanceof PUnit) {
            return search(Unit.players, Unit.enemies);
        }
        if (this instanceof EUnit) {
            return search(Unit.enemies, Unit.players);
        }
        return [];
    }
    ;
}
Unit.DEF_MAX_EP = 1;
Unit.DEF_MAX_XP = 1;
Unit.EAR_NUM = 2;
export class PUnit extends Unit {
    constructor(player) {
        super();
        this.player = player;
        this.jobLvs = new Map();
        this.masteredTecs = new Map();
        for (let job of Job.values) {
            this.jobLvs.set(job, { lv: 0, exp: 0 });
        }
        for (let tec of ActiveTec.values) {
            this.masteredTecs.set(tec, false);
        }
        for (let tec of PassiveTec.values) {
            this.masteredTecs.set(tec, false);
        }
    }
    isFriend(u) { return (u instanceof PUnit); }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    addExp(exp) {
        return __awaiter(this, void 0, void 0, function* () {
            this.prm(Prm.EXP).base += exp;
            if (this.prm(Prm.EXP).base >= this.getNextLvExp()
                && this.prm(Prm.LV).base < 99
                //&& (this.prm(Prm.LV).base < 99 && Mix.上限突破99.count === 0)
                && this.prm(Prm.LV).base < 999) {
                this.prm(Prm.LV).base++;
                this.prm(Prm.EXP).base = 0;
                Sound.lvup.play();
                FX_LVUP(this.img, this.imgBounds, Color.BLACK, true);
                Util.msg.set(`${this.name}はLv${this.prm(Prm.LV).base}になった`, Color.ORANGE.bright);
                yield wait();
                const growHP = (this.prm(Prm.LV).base + 100) / (100 + (this.prm(Prm.LV).base % 2) * 100);
                this.growPrm(Prm.MAX_HP, growHP);
                for (const gp of this.job.growthPrms) {
                    this.growPrm(gp.prm, gp.value);
                }
                const addBP = (1 + this.prm(Prm.LV).base / 100) | 0;
                this.bp += addBP;
                Util.msg.set(`BP+${addBP}`, Color.GREEN.bright);
            }
        });
    }
    getNextLvExp() {
        const lv = this.prm(Prm.LV).base;
        const grade = (lv / 100 + 1) | 0;
        return (lv * grade * 7) | 0;
    }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    getJobLvSet(job) { return this.jobLvs.get(job); }
    setJobExp(job, exp) { this.getJobLvSet(job).exp = exp; }
    getJobExp(job) { return this.getJobLvSet(job).exp; }
    addJobExp(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isMasteredJob(this.job)) {
                return;
            }
            const set = this.getJobLvSet(this.job);
            set.exp += value;
            if (set.exp >= this.job.lvupExp) {
                set.lv += 1;
                set.exp = 0;
                Sound.lvup.play();
                Util.msg.set(`${this.name}の${this.job}Lvが${set.lv}になった`, Color.ORANGE.bright);
                yield wait();
                const learnings = this.job.learningTecs;
                const ratio = set.lv / this.job.maxLv;
                for (let i = 0; i < learnings.length; i++) {
                    if (i + 1 > ((learnings.length * ratio) | 0)) {
                        break;
                    }
                    if (learnings[i] === Tec.empty) {
                        continue;
                    }
                    if (this.isMasteredTec(learnings[i])) {
                        continue;
                    }
                    this.setMasteredTec(learnings[i], true);
                    Util.msg.set(`[${learnings[i]}]を習得した！`, Color.GREEN.bright);
                    yield wait();
                    //技スロットに空きがあれば覚えた技をセット
                    for (let ei = 0; ei < this.tecs.length; ei++) {
                        if (this.tecs[ei] === Tec.empty) {
                            this.tecs[ei] = learnings[i];
                            this.equip();
                            break;
                        }
                    }
                }
                if (set.lv >= this.job.maxLv) {
                    Util.msg.set(`${this.job}を極めた！`, Color.ORANGE.bright);
                    yield wait();
                }
            }
        });
    }
    setJobLv(job, lv) { this.getJobLvSet(job).lv = lv; }
    getJobLv(job) { return this.getJobLvSet(job).lv; }
    isMasteredJob(job) { return this.getJobLvSet(job).lv >= job.maxLv; }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    setMasteredTec(tec, b) { this.masteredTecs.set(tec, b); }
    isMasteredTec(tec) {
        const b = this.masteredTecs.get(tec);
        return b ? b : false;
    }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    /**1未満の値は無視される。 */
    growPrm(prm, value) {
        return __awaiter(this, void 0, void 0, function* () {
            value = value | 0;
            if (value <= 0) {
                return;
            }
            this.prm(prm).base += value;
            Util.msg.set(`[${prm}]+${value}`, Color.GREEN.bright);
            yield wait();
        });
    }
}
export class EUnit extends Unit {
    constructor() {
        super();
        this.yen = 0;
        this.ai = EUnit.DEF_AI;
    }
    isFriend(u) { return (u instanceof EUnit); }
}
EUnit.DEF_AI = (attacker, targetCandidates) => __awaiter(this, void 0, void 0, function* () {
    let activeTecs = attacker.tecs.filter(tec => tec instanceof ActiveTec);
    if (activeTecs.length === 0) {
        yield Tec.何もしない.use(attacker, [attacker]);
        return;
    }
    for (let i = 0; i < 10; i++) {
        let tec = choice(activeTecs);
        if (tec.checkCost(attacker)) {
            const targets = attacker.searchUnits(tec.targetings, tec.rndAttackNum(attacker));
            if (targets.length === 0) {
                continue;
            }
            yield tec.use(attacker, targets);
            return;
        }
    }
    yield Tec.殴る.use(attacker, attacker.searchUnits(Tec.殴る.targetings, Tec.殴る.rndAttackNum(attacker)));
});
(function (Unit) {
    class FXFont {
        static get def() { return this.font ? this.font : (this.font = new Font(60)); }
    }
    /***/
    Unit.setCondition = (target, condition, value, overwrite = false) => {
        value = value | 0;
        if (value <= 0) {
            return;
        }
        if (condition === Condition.empty) {
            return;
        }
        if (!overwrite && target.getCondition(condition.type) !== Condition.empty) {
            return;
        }
        target.setCondition(condition, value);
        FX_Str(FXFont.def, `<${condition}>`, target.boxBounds.center, Color.WHITE);
        Util.msg.set(`${target.name}は<${condition}${value}>になった`, Color.CYAN.bright);
    };
    /** */
    Unit.set反射Inv = (unit) => {
        unit.addInvisibleCondition(new class extends InvisibleCondition {
            constructor() {
                super(...arguments);
                this.uniqueName = "反射";
            }
            createForce(_this) {
                return new class extends Force {
                    beDamage(dmg) {
                        return __awaiter(this, void 0, void 0, function* () {
                            dmg.target.removeInvisibleCondition(_this);
                            if (!dmg.canCounter || dmg.attacker === dmg.target) {
                                return;
                            }
                            if (dmg.result.isHit) {
                                FX_反射(dmg.target.imgCenter, dmg.attacker.imgCenter);
                                Util.msg.set("＞反射");
                                const refDmg = new Dmg({
                                    attacker: dmg.target,
                                    target: dmg.attacker,
                                    absPow: dmg.result.value,
                                    canCounter: false,
                                });
                                yield refDmg.run();
                                yield wait();
                                dmg.result.value = 0;
                            }
                            ;
                        });
                    }
                };
            }
        });
    };
    /** */
    Unit.set吸収Inv = (unit, drainSuccessAction) => {
        const name = "吸収";
        if (unit.hasInvisibleCondition(name)) {
            return;
        }
        unit.addInvisibleCondition(new class extends InvisibleCondition {
            constructor() {
                super(...arguments);
                this.uniqueName = name;
            }
            createForce(_this) {
                return new class extends Force {
                    beDamage(dmg) {
                        return __awaiter(this, void 0, void 0, function* () {
                            dmg.target.removeInvisibleCondition(_this);
                            if (dmg.result.isHit) {
                                const value = Heal.run("HP", dmg.result.value, dmg.attacker, unit, this, false);
                                Util.msg.set(`＞${value}のダメージを吸収`, Color.GREEN);
                                yield wait();
                                dmg.result.value = 0;
                                if (drainSuccessAction) {
                                    drainSuccessAction();
                                }
                            }
                        });
                    }
                };
            }
        });
    };
    // /** */
    // export const removeCondition = (unit:Unit, condition:Condition)=>{
    //     if(unit.hasCondition(condition)){
    //         unit.removeCondition(condition);
    //         FX_RemoveCondition( unit.imgCenter );
    //     }
    // };
})(Unit || (Unit = {}));
