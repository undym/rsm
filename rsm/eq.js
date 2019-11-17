var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Dmg } from "./force.js";
import { Unit, Prm, PUnit } from "./unit.js";
import { Num } from "./mix.js";
import { ActiveTec, TecType, Tec } from "./tec.js";
import { Condition } from "./condition.js";
import { PlayData } from "./util.js";
import { choice } from "./undym/random.js";
import { wait } from "./undym/scene.js";
import { Player } from "./player.js";
import { Sound } from "./sound.js";
export class EqPos {
    constructor(name) {
        this.toString = () => name;
        this.ordinal = EqPos.ordinalNow++;
        EqPos._values.push(this);
    }
    static values() { return this._values; }
    get eqs() {
        if (!this._eqs) {
            this._eqs = Eq.values.filter(eq => eq.pos === this);
        }
        return this._eqs;
    }
}
EqPos._values = [];
EqPos.ordinalNow = 0;
EqPos.頭 = new EqPos("頭");
EqPos.武 = new EqPos("武");
EqPos.盾 = new EqPos("盾");
EqPos.体 = new EqPos("体");
EqPos.腰 = new EqPos("腰");
EqPos.手 = new EqPos("手");
EqPos.指 = new EqPos("指");
EqPos.脚 = new EqPos("脚");
export class Eq {
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    constructor(args) {
        this.args = args;
        this.num = 0;
        this.totalGetCount = 0;
        Eq._values.push(this);
        Eq._valueOf.set(args.uniqueName, this);
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
    static posValues(pos) {
        if (!this._posValues) {
            this._posValues = new Map();
            for (let p of EqPos.values()) {
                this._posValues.set(p, []);
            }
            for (let eq of this.values) {
                this._posValues.get(eq.pos).push(eq);
            }
        }
        return this._posValues.get(pos);
    }
    /**各装備箇所のデフォルト装備を返す.*/
    static getDef(pos) {
        if (pos === EqPos.頭) {
            return this.髪;
        }
        if (pos === EqPos.武) {
            return this.恋人;
        }
        if (pos === EqPos.盾) {
            return this.板;
        }
        if (pos === EqPos.体) {
            return this.襤褸切れ;
        }
        if (pos === EqPos.腰) {
            return this.ひも;
        }
        if (pos === EqPos.手) {
            return this.手;
        }
        if (pos === EqPos.指) {
            return this.肩身の指輪;
        }
        if (pos === EqPos.脚) {
            return this.きれいな靴;
        }
        return this.髪;
    }
    static rnd(pos, lv) {
        const _posValues = this.posValues(pos);
        for (let i = 0; i < 8; i++) {
            const eq = choice(_posValues);
            if (eq.appearLv !== this.NO_APPEAR_LV && eq.appearLv <= lv) {
                return eq;
            }
        }
        return this.getDef(pos);
    }
    get uniqueName() { return this.args.uniqueName; }
    get info() { return this.args.info; }
    get pos() { return this.args.pos; }
    /**敵が装備し始めるレベル. */
    get appearLv() { return this.args.lv; }
    toString() { return this.args.uniqueName; }
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    equip(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    battleStart(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    phaseStart(unit, pForce) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    beforeDoAtk(action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    beforeBeAtk(action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterDoAtk(action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterBeAtk(action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    phaseEnd(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    add(v) {
        Num.add(this, v);
        PlayData.gotAnyEq = true;
    }
}
Eq.NO_APPEAR_LV = -1;
Eq._values = [];
Eq._valueOf = new Map();
export class EqEar {
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    constructor(args) {
        this.args = args;
        this.num = 0;
        this.totalGetCount = 0;
        EqEar._values.push(this);
        EqEar._valueOf.set(args.uniqueName, this);
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
    static getDef() { return EqEar.耳たぶ; }
    get uniqueName() { return this.args.uniqueName; }
    get info() { return this.args.info; }
    /**敵が装備し始めるレベル. */
    get appearLv() { return this.args.lv; }
    toString() { return this.args.uniqueName; }
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    equip(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    battleStart(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    phaseStart(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    beforeDoAtk(action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    beforeBeAtk(action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterDoAtk(action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterBeAtk(action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    phaseEnd(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    add(v) {
        Num.add(this, v);
        PlayData.gotAnyEq = true;
    }
}
EqEar._values = [];
EqEar._valueOf = new Map();
(function (Eq) {
    //--------------------------------------------------------------------------
    //
    //頭
    //
    //--------------------------------------------------------------------------
    Eq.髪 = new class extends Eq {
        constructor() {
            super({ uniqueName: "髪", info: "はげてない、まだはげてない",
                pos: EqPos.頭, lv: 0 });
        }
    };
    Eq.月代 = new class extends Eq {
        constructor() {
            super({ uniqueName: "月代", info: "「斬る」威力+25%",
                pos: EqPos.頭, lv: 0 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action === ActiveTec.斬る) {
                    dmg.pow.mul *= 1.25;
                }
            });
        }
    };
    // export const                         魔女のとんがり帽:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"魔女のとんがり帽", info:"最大MP+10", 
    //                             pos:EqPos.頭, lv:3});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_MP).eq += 10;
    //     }
    // }
    // export const                         山男のとんかつ帽:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"山男のとんかつ帽", info:"最大TP+10", 
    //                             pos:EqPos.頭, lv:3});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_TP).eq += 10;
    //     }
    // }
    // export const                         千里ゴーグル:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"千里ゴーグル", info:"銃・弓攻撃時稀にクリティカル", 
    //                             pos:EqPos.頭, lv:120});}
    //     beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type.any(TecType.格闘) && Math.random() < 0.2){
    //             Util.msg.set("＞千里ゴーグル");
    //             dmg.pow.mul *= 1.5;
    //         }
    //     }   
    // }
    // export const                         勾玉:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"勾玉", info:"", 
    //                             pos:EqPos.頭, lv:Eq.NO_APPEAR_LV});}
    // }
    // export const                         メガネ:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"メガネ", info:"", 
    //                             pos:EqPos.頭, lv:Eq.NO_APPEAR_LV});}
    // }
    // export const                         マーザンの角:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"マーザンの角", info:"防御値+200", 
    //                             pos:EqPos.頭, lv:30});}
    //     beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         dmg.def.add += 200;
    //     }
    // }
    //--------------------------------------------------------------------------
    //
    //武
    //
    //--------------------------------------------------------------------------
    Eq.恋人 = new class extends Eq {
        constructor() {
            super({ uniqueName: "恋人", info: "",
                pos: EqPos.武, lv: 0 });
        }
    };
    Eq.ミルテの棍 = new class extends Eq {
        constructor() {
            super({ uniqueName: "ミルテの棍", info: "攻撃時、確率でHP+5%",
                pos: EqPos.武, lv: 5 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Math.random() < 0.8) {
                    Unit.healHP(attacker, 1 + attacker.prm(Prm.MAX_HP).total * 0.05);
                }
            });
        }
    };
    Eq.レティシアsガン = new class extends Eq {
        constructor() {
            super({ uniqueName: "レティシア'sガン", info: "銃攻撃時、稀に相手を＜防↓＞化",
                pos: EqPos.武, lv: 5 });
        }
        afterDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.銃術) && Math.random() < 0.7) {
                    Unit.setCondition(target, Condition.防御低下, 1);
                }
            });
        }
    };
    /**リテの門財宝. */
    Eq.忍者ソード = new class extends Eq {
        constructor() {
            super({ uniqueName: "忍者ソード", info: "格闘攻撃時、稀に追加攻撃",
                pos: EqPos.武, lv: 105 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘) && Math.random() < 0.75) {
                    dmg.additionalAttacks.push((dmg, i) => {
                        return dmg.result.value / 2;
                    });
                }
            });
        }
    };
    /**クラウンボトルEX. */
    Eq.コスモガン = new class extends Eq {
        constructor() {
            super({ uniqueName: "コスモガン", info: "銃術攻撃時稀に追加攻撃",
                pos: EqPos.武, lv: 95 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.銃術) && dmg.result.isHit && Math.random() < 0.5) {
                    dmg.additionalAttacks.push((dmg, i) => {
                        return dmg.result.value / 2;
                    });
                }
            });
        }
    };
    /**クラウンボトル財宝. */
    Eq.呪縛の弓矢 = new class extends Eq {
        constructor() {
            super({ uniqueName: "呪縛の弓矢", info: "弓術攻撃時、稀に相手を＜鎖＞化",
                pos: EqPos.武, lv: 95 });
        }
        afterDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.弓術) && dmg.result.isHit && Math.random() < 0.5) {
                    Unit.setCondition(target, Condition.鎖, 1);
                    yield wait();
                }
            });
        }
    };
    /**テント樹林EX. */
    Eq.アリランナイフ = new class extends Eq {
        constructor() {
            super({ uniqueName: "アリランナイフ", info: "攻撃時、稀に相手を＜毒＞化",
                pos: EqPos.武, lv: 95 });
        }
        afterDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && dmg.result.isHit && Math.random() < 0.8) {
                    Sound.awa.play();
                    const value = attacker.prm(Prm.DRK).total + 1;
                    Unit.setCondition(target, Condition.毒, value);
                    yield wait();
                }
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //盾
    //
    //--------------------------------------------------------------------------
    Eq.板 = new class extends Eq {
        constructor() {
            super({ uniqueName: "板", info: "",
                pos: EqPos.盾, lv: 0 });
        }
    };
    Eq.銅板 = new class extends Eq {
        constructor() {
            super({ uniqueName: "銅板", info: "防御値+100",
                pos: EqPos.盾, lv: 12 });
        }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                dmg.def.add += 100;
            });
        }
    };
    /**リテの門EX. */
    Eq.反精霊の盾 = new class extends Eq {
        constructor() {
            super({ uniqueName: "反精霊の盾", info: "防御値+200",
                pos: EqPos.盾, lv: 52 });
        }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                dmg.def.add += 200;
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //体
    //
    //--------------------------------------------------------------------------
    Eq.襤褸切れ = new class extends Eq {
        constructor() {
            super({ uniqueName: "襤褸切れ", info: "",
                pos: EqPos.体, lv: 0 });
        }
    };
    Eq.草の服 = new class extends Eq {
        constructor() {
            super({ uniqueName: "草の服", info: "最大HP+20",
                pos: EqPos.体, lv: 15 });
        }
        equip(unit) {
            return __awaiter(this, void 0, void 0, function* () { unit.prm(Prm.MAX_HP).eq += 20; });
        }
    };
    /**はじまりの丘財宝. */
    Eq.オールマント = new class extends Eq {
        constructor() {
            super({ uniqueName: "オールマント", info: "全ステータス+20",
                pos: EqPos.体, lv: 55 });
        }
        equip(unit) {
            return __awaiter(this, void 0, void 0, function* () {
                [Prm.STR, Prm.MAG, Prm.LIG, Prm.DRK, Prm.CHN, Prm.PST, Prm.GUN, Prm.ARR].forEach(prm => unit.prm(prm).eq += 20);
            });
        }
    };
    /**予感の街レEX. */
    Eq.いばらの鎧 = new class extends Eq {
        constructor() {
            super({ uniqueName: "いばらの鎧", info: "被格闘攻撃時、稀に格闘反撃",
                pos: EqPos.体, lv: 55 });
        }
        afterBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘) && !dmg.counter && Math.random() < 0.4) {
                    yield Tec.格闘カウンター.run(target, attacker);
                }
            });
        }
    };
    /**黒平原財宝. */
    Eq.魔性のマント = new class extends Eq {
        constructor() {
            super({ uniqueName: "魔性のマント", info: "被攻撃時、MP+1",
                pos: EqPos.体, lv: 15 });
        }
        afterBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec) {
                    target.mp++;
                }
            });
        }
    };
    /**黒遺跡財宝. */
    Eq.ダークネスロード = new class extends Eq {
        constructor() {
            super({ uniqueName: "ダークネスロード", info: "攻撃倍率+10%　防御倍率-20%",
                pos: EqPos.体, lv: 35 });
        }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                dmg.def.mul *= 0.8;
            });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                dmg.pow.mul *= 1.1;
            });
        }
    };
    /**トトの郊外EX. */
    Eq.猛者の鎧 = new class extends Eq {
        constructor() {
            super({ uniqueName: "猛者の鎧", info: "格闘攻撃+15%　被格闘攻撃+15%",
                pos: EqPos.体, lv: 35 });
        }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘)) {
                    dmg.def.mul *= 1.15;
                }
            });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘)) {
                    dmg.def.mul *= 1.15;
                }
            });
        }
    };
    /**テント樹林財宝. */
    Eq.鎖のマント = new class extends Eq {
        constructor() {
            super({ uniqueName: "鎖のマント", info: "鎖術攻撃+20%",
                pos: EqPos.体, lv: 15 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.鎖術)) {
                    dmg.def.mul *= 1.20;
                }
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //腰
    //
    //--------------------------------------------------------------------------
    Eq.ひも = new class extends Eq {
        constructor() {
            super({ uniqueName: "ひも", info: "",
                pos: EqPos.腰, lv: 0 });
        }
    };
    Eq.ライダーベルト = new class extends Eq {
        constructor() {
            super({ uniqueName: "ライダーベルト", info: "攻撃+10",
                pos: EqPos.腰, lv: 35 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                dmg.pow.add += 10;
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //手
    //
    //--------------------------------------------------------------------------
    Eq.手 = new class extends Eq {
        constructor() {
            super({ uniqueName: "手", info: "",
                pos: EqPos.手, lv: 0 });
        }
    };
    /**黒平原EX. */
    Eq.妖魔の手 = new class extends Eq {
        constructor() {
            super({ uniqueName: "妖魔の手", info: "被魔法・過去攻撃時、稀に魔法反撃",
                pos: EqPos.手, lv: 65 });
        }
        afterBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.過去) && !dmg.counter && Math.random() < 0.7) {
                    yield Tec.魔法カウンター.run(target, attacker);
                }
            });
        }
    };
    /**黒い丘財宝. */
    Eq.魔ヶ玉の手首飾り = new class extends Eq {
        constructor() {
            super({ uniqueName: "魔ヶ玉の手首飾り", info: "毎ターンMP+1",
                pos: EqPos.手, lv: 55 });
        }
        phaseStart(unit) {
            return __awaiter(this, void 0, void 0, function* () {
                Unit.healMP(unit, 1);
            });
        }
    };
    /**雪の初期装備. */
    Eq.ハルのカフス = new class extends Eq {
        constructor() {
            super({ uniqueName: "ハルのカフス", info: "毎ターンTP+1　雪以外が装備するとダメージ",
                pos: EqPos.手, lv: 65 });
        }
        phaseStart(unit) {
            return __awaiter(this, void 0, void 0, function* () {
                Unit.healTP(unit, 1);
                if (unit instanceof PUnit && unit.player !== Player.雪) {
                    unit.doDmg(new Dmg({ absPow: unit.prm(Prm.MAX_HP).total * 0.1 }));
                    yield wait();
                }
            });
        }
    };
    //--------------------------------------------------------------------------
    //
    //指
    //
    //--------------------------------------------------------------------------
    Eq.肩身の指輪 = new class extends Eq {
        constructor() {
            super({ uniqueName: "肩身の指輪", info: "",
                pos: EqPos.指, lv: 0 });
        }
    };
    Eq.アカデミーバッヂ = new class extends Eq {
        constructor() {
            super({ uniqueName: "アカデミーバッヂ", info: "全ステータス+10",
                pos: EqPos.指, lv: 30 });
        }
        equip(u) {
            return __awaiter(this, void 0, void 0, function* () {
                u.prm(Prm.STR).base += 10;
                u.prm(Prm.MAG).base += 10;
                u.prm(Prm.LIG).base += 10;
                u.prm(Prm.DRK).base += 10;
                u.prm(Prm.CHN).base += 10;
                u.prm(Prm.PST).base += 10;
                u.prm(Prm.GUN).base += 10;
                u.prm(Prm.ARR).base += 10;
            });
        }
    };
    Eq.機工の指輪 = new class extends Eq {
        constructor() {
            super({ uniqueName: "機工の指輪", info: "銃術攻撃+20%",
                pos: EqPos.指, lv: 1 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.銃術)) {
                    dmg.pow.mul *= 1.2;
                }
            });
        }
    };
    // export const                         魔ヶ玉の指輪:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"魔ヶ玉の指輪", info:"行動開始時MP+10%",
    //                             pos:EqPos.指, lv:20});}
    //     phaseStart(unit:Unit){
    //         Unit.healMP(unit, unit.prm(Prm.MAX_MP).total * 0.1 + 1);
    //     }
    // }
    // export const                         瑠璃:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"瑠璃", info:"戦闘開始時TP+10%",
    //                             pos:EqPos.指, lv:50});}
    //     battleStart(unit:Unit){
    //         Unit.healTP(unit, unit.prm(Prm.MAX_TP).total * 0.1 + 1);
    //     }
    // }
    // export const                         キャットネイル:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"キャットネイル", info:"攻撃時追加攻撃",
    //                             pos:EqPos.指, lv:50});}
    //     async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && dmg.result.isHit){
    //             dmg.additinalAttacks.push((dmg,index)=>{
    //                 return dmg.result.value / (index + 2);
    //             });
    //         }
    //     }
    // }
    //--------------------------------------------------------------------------
    //
    //脚
    //
    //--------------------------------------------------------------------------
    Eq.きれいな靴 = new class extends Eq {
        constructor() {
            super({ uniqueName: "きれいな靴", info: "",
                pos: EqPos.脚, lv: 0 });
        }
    };
    Eq.安全靴 = new class extends Eq {
        constructor() {
            super({ uniqueName: "安全靴", info: "戦闘開始時<盾>化",
                pos: EqPos.脚, lv: 10 });
        }
        battleStart(unit) {
            return __awaiter(this, void 0, void 0, function* () {
                unit.setCondition(Condition.盾, 1);
            });
        }
    };
    Eq.無色の靴 = new class extends Eq {
        constructor() {
            super({ uniqueName: "無色の靴", info: "格闘攻撃+20%",
                pos: EqPos.脚, lv: 15 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.格闘)) {
                    dmg.pow.mul *= 1.2;
                }
            });
        }
    };
    /**トトの郊外財宝. */
    Eq.悪夢 = new class extends Eq {
        constructor() {
            super({ uniqueName: "悪夢", info: "過去攻撃+20%　被過去攻撃+20%",
                pos: EqPos.脚, lv: 0 });
        }
        beforeDoAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.過去)) {
                    dmg.pow.mul *= 1.2;
                }
            });
        }
        beforeBeAtk(action, attacker, target, dmg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (action instanceof ActiveTec && action.type.any(TecType.過去)) {
                    dmg.pow.mul *= 1.2;
                }
            });
        }
    };
    // export const                         安全靴:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"安全靴", info:"被攻撃時稀に<盾>化",
    //                             pos:EqPos.脚, lv:40});}
    //     afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type !== TecType.状態 && Math.random() < 0.6){
    //             Unit.setCondition(target, Condition.盾, 1);
    //         }
    //     }
    // }
    // export const                         鉄下駄:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"鉄下駄", info:"攻撃命中率x0.9 防御値x2",
    //                             pos:EqPos.脚, lv:21});}
    //     beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec){
    //             dmg.def.mul *= 2;
    //         }
    //     }
    //     beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec){
    //             dmg.hit.mul *= 0.9;
    //         }
    //     }
    // }
})(Eq || (Eq = {}));
//耳は全て店売りにする
(function (EqEar) {
    EqEar.耳たぶ = new class extends EqEar {
        constructor() { super({ uniqueName: "耳たぶ", info: "", lv: 0 }); }
    };
    // export const                         おにく:EqEar = new class extends EqEar{//店
    //     constructor(){super({uniqueName:"おにく", info:"最大HP+29", lv:29});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_HP).eq += 29;
    //     }
    // }
    // export const                         水晶のピアス:EqEar = new class extends EqEar{//店
    //     constructor(){super({uniqueName:"水晶のピアス", info:"行動開始時HP+1%", lv:29});}
    //     phaseStart(unit:Unit){
    //         Unit.healHP( unit, unit.prm(Prm.MAX_HP).total * 0.01 + 1 );
    //     }
    // }
    // export const                         魔ヶ玉のピアス:EqEar = new class extends EqEar{//店
    //     constructor(){super({uniqueName:"魔ヶ玉のピアス", info:"最大MP+10", lv:29});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_MP).eq += 10;
    //     }
    // }
    // export const                         エメラルドのピアス:EqEar = new class extends EqEar{//店
    //     constructor(){super({uniqueName:"エメラルドのピアス", info:"最大TP+10", lv:29});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_TP).eq += 10;
    //     }
    // }
})(EqEar || (EqEar = {}));
