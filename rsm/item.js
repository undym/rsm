var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Dungeon } from "./dungeon/dungeon.js";
import { Util, SceneType } from "./util.js";
import { Color, Point } from "./undym/type.js";
import { Scene, wait } from "./undym/scene.js";
import { Unit, Prm, PUnit } from "./unit.js";
import { FX_Str, FX_回復, FX_Buff } from "./fx/fx.js";
import { Targeting, Dmg } from "./force.js";
import { choice } from "./undym/random.js";
import { Font } from "./graphics/graphics.js";
import { Num } from "./mix.js";
import { DungeonEvent } from "./dungeon/dungeonevent.js";
import DungeonScene from "./scene/dungeonscene.js";
import { Tec } from "./tec.js";
import { Condition, ConditionType } from "./condition.js";
import { Sound } from "./sound.js";
import { Job } from "./job.js";
export class ItemType {
    constructor(name) {
        this.toString = () => name;
    }
    get values() {
        if (!this._values) {
            this._values = Item.values
                .filter(item => item.itemType === this);
        }
        return this._values;
    }
    ;
}
ItemType.蘇生 = new ItemType("蘇生");
ItemType.HP回復 = new ItemType("HP回復");
ItemType.MP回復 = new ItemType("MP回復");
ItemType.状態 = new ItemType("状態");
ItemType.ダンジョン = new ItemType("ダンジョン");
ItemType.弾 = new ItemType("弾");
ItemType.鍵 = new ItemType("鍵");
ItemType.ダメージ = new ItemType("ダメージ");
ItemType.ドーピング = new ItemType("ドーピング");
ItemType.書 = new ItemType("書");
ItemType.メモ = new ItemType("メモ");
ItemType.素材 = new ItemType("素材");
export class ItemParentType {
    constructor(name, children) {
        this.children = children;
        this.toString = () => name;
        ItemParentType._values.push(this);
    }
    static get values() { return this._values; }
}
ItemParentType._values = [];
ItemParentType.回復 = new ItemParentType("回復", [ItemType.蘇生, ItemType.HP回復, ItemType.MP回復]);
ItemParentType.状態 = new ItemParentType("状態", [ItemType.状態]);
ItemParentType.ダンジョン = new ItemParentType("ダンジョン", [ItemType.ダンジョン, ItemType.弾, ItemType.鍵]);
ItemParentType.戦闘 = new ItemParentType("戦闘", [ItemType.ダメージ]);
ItemParentType.強化 = new ItemParentType("強化", [ItemType.ドーピング, ItemType.書]);
ItemParentType.その他 = new ItemParentType("その他", [
    ItemType.メモ, ItemType.素材,
]);
export var ItemDrop;
(function (ItemDrop) {
    ItemDrop[ItemDrop["NO"] = 0] = "NO";
    ItemDrop[ItemDrop["BOX"] = 1] = "BOX";
    ItemDrop[ItemDrop["TREE"] = 2] = "TREE";
    ItemDrop[ItemDrop["STRATUM"] = 4] = "STRATUM";
    ItemDrop[ItemDrop["LAKE"] = 8] = "LAKE";
    ItemDrop[ItemDrop["FISHING"] = 16] = "FISHING";
    ItemDrop[ItemDrop["FOSSIL"] = 32] = "FOSSIL";
})(ItemDrop || (ItemDrop = {}));
class ItemValues {
    constructor(items) {
        this.values = new Map();
        for (const item of items) {
            if (!this.values.has(item.rank)) {
                this.values.set(item.rank, []);
            }
            this.values.get(item.rank).push(item);
        }
    }
    get(rank) {
        return this.values.get(rank);
    }
}
export class Item {
    constructor(args) {
        this.args = args;
        this.num = 0;
        this.totalGetCount = 0;
        /**残り使用回数。*/
        this.remainingUseNum = 0;
        if (args.consumable) {
            Item._consumableValues.push(this);
        }
        Item._values.push(this);
    }
    static get values() { return this._values; }
    static consumableValues() {
        return this._consumableValues;
    }
    /**
     * 指定のタイプの指定のランクのアイテムを返す。そのランクにアイテムが存在しなければランクを一つ下げて再帰する。
     * @param dropType
     * @param rank
     */
    static rndItem(dropType, rank) {
        rank = rank | 0;
        if (!this._dropTypeValues.has(dropType)) {
            const typeValues = this.values.filter(item => item.dropTypes & dropType);
            this._dropTypeValues.set(dropType, new ItemValues(typeValues));
        }
        const itemValues = this._dropTypeValues.get(dropType);
        if (itemValues) {
            const rankValues = itemValues.get(rank);
            if (rankValues) {
                for (let i = 0; i < 10; i++) {
                    let tmp = choice(rankValues);
                    if (tmp.num < tmp.numLimit) {
                        return tmp;
                    }
                }
            }
            if (rank <= 0) {
                return Item.石;
            }
            return this.rndItem(dropType, rank - 1);
        }
        return Item.石;
    }
    /**
     * return res > 0 ? res : 0;
     * */
    static fluctuateRank(baseRank, rankFluctuatePassProb = 0.25) {
        let add = 0;
        while (Math.random() <= rankFluctuatePassProb) {
            add += 0.5 + Math.random() * 0.5;
        }
        if (Math.random() < 0.5) {
            add *= -1;
        }
        const res = (baseRank + add) | 0;
        return res > 0 ? res : 0;
    }
    get uniqueName() { return this.args.uniqueName; }
    get info() { return this.args.info; }
    get itemType() { return this.args.type; }
    get rank() { return this.args.rank; }
    get targetings() { return this.args.targetings ? this.args.targetings : Targeting.SELECT; }
    get consumable() { return this.args.consumable ? this.args.consumable : false; }
    /**所持上限. */
    get numLimit() { return this.args.numLimit ? this.args.numLimit : Item.DEF_NUM_LIMIT; }
    get dropTypes() { return this.args.drop; }
    toString() { return this.uniqueName; }
    add(v) {
        if (v > 0) {
            if (this.num + v > this.numLimit) {
                v = this.numLimit - this.num;
                if (v <= 0) {
                    Util.msg.set(`[${this}]はこれ以上入手できない`, Color.L_GRAY);
                    return;
                }
            }
        }
        Num.add(this, v);
    }
    use(user, targets) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canUse(user, targets)) {
                return;
            }
            for (let t of targets) {
                yield this.useInner(user, t);
            }
            if (this.consumable) {
                this.remainingUseNum--;
            }
            else {
                this.num--;
            }
        });
    }
    useInner(user, target) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.args.use) {
                yield this.args.use(user, target);
            }
        });
    }
    canUse(user, targets) {
        if (!this.args.use) {
            return false;
        }
        if (this.consumable && this.remainingUseNum <= 0) {
            return false;
        }
        if (!this.consumable && this.num <= 0) {
            return false;
        }
        return true;
    }
}
Item._values = [];
Item._consumableValues = [];
Item._dropTypeValues = new Map();
Item.DEF_NUM_LIMIT = 9999;
(function (Item) {
    const itemRevive = (target, hp) => __awaiter(this, void 0, void 0, function* () {
        if (!target.dead) {
            return;
        }
        target.dead = false;
        target.hp = 0;
        Unit.healHP(target, hp);
        Sound.KAIFUKU.play();
        if (SceneType.now === SceneType.BATTLE) {
            FX_回復(target.imgCenter);
            Util.msg.set(`${target.name}は生き返った`);
            yield wait();
        }
        else {
            FX_回復(target.boxCenter);
        }
    });
    const itemHealHP = (target, value) => __awaiter(this, void 0, void 0, function* () {
        value = value | 0;
        Unit.healHP(target, value);
        Sound.KAIFUKU.play();
        if (SceneType.now === SceneType.BATTLE) {
            FX_回復(target.imgCenter);
            Util.msg.set(`${target.name}のHPが${value}回復した`, Color.GREEN.bright);
            yield wait();
        }
        else {
            FX_回復(target.boxCenter);
        }
    });
    const itemHealMP = (target, value) => __awaiter(this, void 0, void 0, function* () {
        value = value | 0;
        Unit.healMP(target, value);
        Sound.KAIFUKU.play();
        if (SceneType.now === SceneType.BATTLE) {
            Util.msg.set(`${target.name}のMPが${value}回復した`, Color.PINK.bright);
            yield wait();
        }
    });
    const itemHealTP = (target, value) => __awaiter(this, void 0, void 0, function* () {
        value = value | 0;
        Unit.healTP(target, value);
        Sound.KAIFUKU.play();
        if (SceneType.now === SceneType.BATTLE) {
            Util.msg.set(`${target.name}のTPが${value}回復した`, Color.CYAN.bright);
            yield wait();
        }
    });
    //-----------------------------------------------------------------
    //
    //蘇生
    //
    //-----------------------------------------------------------------
    Item.サンタクララ薬 = new class extends Item {
        constructor() {
            super({ uniqueName: "サンタクララ薬", info: "一体をHP1で蘇生",
                type: ItemType.蘇生, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemRevive(target, 1);
                })
            });
        }
    };
    //-----------------------------------------------------------------
    //
    //HP回復
    //
    //-----------------------------------------------------------------
    Item.スティック = new class extends Item {
        constructor() {
            super({ uniqueName: "スティック", info: "HP+5",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 5); }),
            });
        }
    };
    Item.スティックパ = new class extends Item {
        constructor() {
            super({ uniqueName: "スティックパ", info: "HP+10",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 10); }),
            });
        }
    };
    Item.スティックパン = new class extends Item {
        constructor() {
            super({ uniqueName: "スティックパン", info: "HP+20",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 20); }),
            });
        }
    };
    Item.ダブルスティックパン = new class extends Item {
        constructor() {
            super({ uniqueName: "ダブルスティックパン", info: "HP+30",
                type: ItemType.HP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 30); }),
            });
        }
    };
    Item.硬化スティックパン = new class extends Item {
        constructor() {
            super({ uniqueName: "硬化スティックパン", info: "HP+50",
                type: ItemType.HP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 50); }),
            });
        }
    };
    Item.マーラーカオ = new class extends Item {
        constructor() {
            super({ uniqueName: "マーラーカオ", info: "HP+70",
                type: ItemType.HP回復, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 70); }),
            });
        }
    };
    Item.霊水 = new class extends Item {
        constructor() {
            super({ uniqueName: "霊水", info: "HP+300",
                type: ItemType.HP回復, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 300); }),
            });
        }
    };
    Item.清水 = new class extends Item {
        constructor() {
            super({ uniqueName: "清水", info: "HP+400",
                type: ItemType.HP回復, rank: 8, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 400); }),
            });
        }
    };
    Item.超聖水 = new class extends Item {
        constructor() {
            super({ uniqueName: "超聖水", info: "HP+500",
                type: ItemType.HP回復, rank: 9, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 500); }),
            });
        }
    };
    Item.ドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ドラッグ", info: "HP+10%",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.10 + 1); }),
            });
        }
    };
    Item.LAドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "LAドラッグ", info: "HP+20%",
                type: ItemType.HP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.20 + 1); }),
            });
        }
    };
    Item.ロシアドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ロシアドラッグ", info: "HP+30%",
                type: ItemType.HP回復, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.30 + 1); }),
            });
        }
    };
    Item.ビタミンドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグ", info: "HP+40%",
                type: ItemType.HP回復, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.40 + 1); }),
            });
        }
    };
    Item.高ビタミンドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "高ビタミンドラッグ", info: "HP+50%",
                type: ItemType.HP回復, rank: 4, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.50 + 1); }),
            });
        }
    };
    Item.濃密ビタミンドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "濃密ビタミンドラッグ", info: "HP+60%",
                type: ItemType.HP回復, rank: 5, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.60 + 1); }),
            });
        }
    };
    Item.ビタミンドラッグA = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグA", info: "HP+70%",
                type: ItemType.HP回復, rank: 6, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.70 + 1); }),
            });
        }
    };
    Item.ビタミンドラッグFINAL = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグFINAL", info: "HP+80%",
                type: ItemType.HP回復, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.80 + 1); }),
            });
        }
    };
    Item.ビタミンドラッグFF = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグFF", info: "HP+90%",
                type: ItemType.HP回復, rank: 8, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.90 + 1); }),
            });
        }
    };
    Item.ビタミンドラッグFFF = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグFFF", info: "HP+100%",
                type: ItemType.HP回復, rank: 9, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total); }),
            });
        }
    };
    Item.シェイクスピア分子 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子", info: "全員のHP+30",
                type: ItemType.HP回復, rank: 2, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 30); }),
            });
        }
    };
    Item.シェイクスピア分子1 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子1", info: "全員のHP+50",
                type: ItemType.HP回復, rank: 3, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 50); }),
            });
        }
        toString() { return "シェイクスピア分子+1"; }
    };
    Item.シェイクスピア分子2 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子2", info: "全員のHP+100",
                type: ItemType.HP回復, rank: 4, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 100); }),
            });
        }
        toString() { return "シェイクスピア分子+2"; }
    };
    Item.シェイクスピア分子3 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子3", info: "全員のHP+130",
                type: ItemType.HP回復, rank: 5, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 130); }),
            });
        }
        toString() { return "シェイクスピア分子+3"; }
    };
    Item.シェイクスピア分子4 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子4", info: "全員のHP+150",
                type: ItemType.HP回復, rank: 6, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 150); }),
            });
        }
        toString() { return "シェイクスピア分子+4"; }
    };
    Item.シェイクスピア分子5 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子5", info: "全員のHP+200",
                type: ItemType.HP回復, rank: 7, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 200); }),
            });
        }
        toString() { return "シェイクスピア分子+5"; }
    };
    Item.シェイクスピア分子6 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子6", info: "全員のHP+300",
                type: ItemType.HP回復, rank: 8, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 300); }),
            });
        }
        toString() { return "シェイクスピア分子+6"; }
    };
    Item.シェイクスピア分子7 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子7", info: "全員のHP+500",
                type: ItemType.HP回復, rank: 9, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 500); }),
            });
        }
        toString() { return "シェイクスピア分子+7"; }
    };
    Item.じすたま = new class extends Item {
        constructor() {
            super({ uniqueName: "じすたま", info: "",
                type: ItemType.HP回復, rank: 12, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, target.prm(Prm.MAX_HP).total);
                    yield itemHealMP(target, target.prm(Prm.MAX_MP).total);
                    yield itemHealTP(target, target.prm(Prm.MAX_TP).total);
                }),
            });
        }
    };
    //-----------------------------------------------------------------
    //
    //MP回復
    //
    //-----------------------------------------------------------------
    Item.蛍草 = new class extends Item {
        constructor() {
            super({ uniqueName: "蛍草", info: "MP+1",
                type: ItemType.MP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 1); }),
            });
        }
    };
    Item.赤葉草 = new class extends Item {
        constructor() {
            super({ uniqueName: "赤葉草", info: "MP+2",
                type: ItemType.MP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 2); }),
            });
        }
    };
    Item.蛍草のエキス = new class extends Item {
        constructor() {
            super({ uniqueName: "蛍草のエキス", info: "MP+3",
                type: ItemType.MP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 3); }),
            });
        }
    };
    Item.赤い水 = new class extends Item {
        constructor() {
            super({ uniqueName: "赤い水", info: "MP+4",
                type: ItemType.MP回復, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 4); }),
            });
        }
    };
    Item.赤蛍草 = new class extends Item {
        constructor() {
            super({ uniqueName: "赤蛍草", info: "MP+6",
                type: ItemType.MP回復, rank: 4, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 6); }),
            });
        }
    };
    Item.インパチェンス = new class extends Item {
        constructor() {
            super({ uniqueName: "インパチェンス", info: "MP+7",
                type: ItemType.MP回復, rank: 4, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 7); }),
            });
        }
    };
    Item.アウラレッドグラス = new class extends Item {
        constructor() {
            super({ uniqueName: "アウラレッドグラス", info: "MP+10",
                type: ItemType.MP回復, rank: 5, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 10); }),
            });
        }
    };
    Item.紫死草 = new class extends Item {
        constructor() {
            super({ uniqueName: "紫死草", info: "MP+20",
                type: ItemType.MP回復, rank: 6, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 20); }),
            });
        }
    };
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    Item.ヴァイスドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ヴァイスドラッグ", info: "HP+20 MP+2",
                type: ItemType.MP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 20);
                    yield itemHealMP(target, 2);
                }),
            });
        }
    };
    Item.ヴァイスドラッグ2 = new class extends Item {
        constructor() {
            super({ uniqueName: "ヴァイスドラッグ2", info: "HP+30 MP+3",
                type: ItemType.MP回復, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 30);
                    yield itemHealMP(target, 3);
                }),
            });
        }
        toString() { return "ヴァイスドラッグⅡ"; }
    };
    Item.ヴァイスドラッグ3 = new class extends Item {
        constructor() {
            super({ uniqueName: "ヴァイスドラッグ3", info: "HP+50 MP+5",
                type: ItemType.MP回復, rank: 4, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 50);
                    yield itemHealMP(target, 5);
                }),
            });
        }
        toString() { return "ヴァイスドラッグⅢ"; }
    };
    Item.ヴァイスドラッグ4 = new class extends Item {
        constructor() {
            super({ uniqueName: "ヴァイスドラッグ4", info: "HP+100 MP+10",
                type: ItemType.MP回復, rank: 6, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 100);
                    yield itemHealMP(target, 10);
                }),
            });
        }
        toString() { return "ヴァイスドラッグⅣ"; }
    };
    Item.ヴァイスドラッグ5 = new class extends Item {
        constructor() {
            super({ uniqueName: "ヴァイスドラッグ5", info: "HP+200 MP+20",
                type: ItemType.MP回復, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 200);
                    yield itemHealMP(target, 20);
                }),
            });
        }
        toString() { return "ヴァイスドラッグⅤ"; }
    };
    Item.ヴァイスドラッグ6 = new class extends Item {
        constructor() {
            super({ uniqueName: "ヴァイスドラッグ6", info: "HP+400 MP+40",
                type: ItemType.MP回復, rank: 8, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 400);
                    yield itemHealMP(target, 40);
                }),
            });
        }
        toString() { return "ヴァイスドラッグⅥ"; }
    };
    //-----------------------------------------------------------------
    //
    //-回復
    //状態回復
    //
    //-----------------------------------------------------------------
    Item.血清 = new class extends Item {
        constructor() {
            super({ uniqueName: "血清", info: "＜毒＞状態を解除する",
                type: ItemType.状態, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return target.removeCondition(Condition.毒); }),
            });
        }
    };
    Item.目覚まし時計 = new class extends Item {
        constructor() {
            super({ uniqueName: "目覚まし時計", info: "＜眠＞状態を解除する",
                type: ItemType.状態, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return target.removeCondition(Condition.眠); }),
            });
        }
    };
    Item.レンチ = new class extends Item {
        constructor() {
            super({ uniqueName: "レンチ", info: "＜鎖＞状態を解除する",
                type: ItemType.状態, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return target.removeCondition(Condition.鎖); }),
            });
        }
    };
    Item.石溶け水 = new class extends Item {
        constructor() {
            super({ uniqueName: "石溶け水", info: "＜石＞状態を解除する",
                type: ItemType.状態, rank: 3, drop: ItemDrop.BOX | ItemDrop.LAKE,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return target.removeCondition(Condition.石); }),
            });
        }
    };
    Item.ワクチン = new class extends Item {
        constructor() {
            super({ uniqueName: "ワクチン", info: "＜病気＞状態を解除する",
                type: ItemType.状態, rank: 3, drop: ItemDrop.BOX | ItemDrop.LAKE,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return target.removeCondition(Condition.病気); }),
            });
        }
    };
    Item.攻撃力回復薬 = new class extends Item {
        constructor() {
            super({ uniqueName: "攻撃力回復薬", info: "＜攻撃低下＞状態を解除する",
                type: ItemType.状態, rank: 4, drop: ItemDrop.BOX | ItemDrop.LAKE,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return target.removeCondition(Condition.攻撃低下); }),
            });
        }
    };
    Item.防御力回復薬 = new class extends Item {
        constructor() {
            super({ uniqueName: "防御力回復薬", info: "＜防御低下＞状態を解除する",
                type: ItemType.状態, rank: 4, drop: ItemDrop.BOX | ItemDrop.LAKE,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return target.removeCondition(Condition.防御低下); }),
            });
        }
    };
    Item.パーフェクトパフォーマンス = new class extends Item {
        constructor() {
            super({ uniqueName: "パーフェクトパフォーマンス", info: "＜暴走・契約＞以外の強化・弱体状態を解除する",
                type: ItemType.状態, rank: 6, drop: ItemDrop.BOX | ItemDrop.LAKE,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    for (const type of ConditionType.values) {
                        const c = target.getCondition(type);
                        if (c !== Condition.暴走 && c !== Condition.契約) {
                            target.removeCondition(type);
                        }
                    }
                }),
            });
        }
    };
    //-----------------------------------------------------------------
    //
    //-状態回復
    //強化付与
    //
    //-----------------------------------------------------------------
    Item.火の尻尾 = new class extends Item {
        constructor() {
            super({ uniqueName: "火の尻尾", info: "一体を＜練＞状態にする",
                type: ItemType.状態, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.up.play();
                    Unit.setCondition(target, Condition.練, 1);
                }),
            });
        }
    };
    Item.燃える髪 = new class extends Item {
        constructor() {
            super({ uniqueName: "燃える髪", info: "一体を＜練2＞状態にする",
                type: ItemType.状態, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.up.play();
                    Unit.setCondition(target, Condition.練, 2);
                }),
            });
        }
    };
    Item.赤き髪の目 = new class extends Item {
        constructor() {
            super({ uniqueName: "赤き髪の目", info: "一体を＜練3＞状態にする",
                type: ItemType.状態, rank: 5, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.up.play();
                    Unit.setCondition(target, Condition.練, 3);
                }),
            });
        }
    };
    Item.ジルの血 = new class extends Item {
        constructor() {
            super({ uniqueName: "ジルの血", info: "一体を＜練4＞状態にする",
                type: ItemType.状態, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.up.play();
                    Unit.setCondition(target, Condition.練, 4);
                }),
            });
        }
    };
    Item.ゆかちゃん保険 = new class extends Item {
        constructor() {
            super({ uniqueName: "ゆかちゃん保険", info: "一体を＜約1＞状態にする",
                type: ItemType.状態, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.up.play();
                    Unit.setCondition(target, Condition.約束, 1);
                }),
            });
        }
    };
    Item.天使のファンデュ = new class extends Item {
        constructor() {
            super({ uniqueName: "天使のファンデュ", info: "味方全体を＜癒10＞状態にする",
                type: ItemType.状態, rank: 5, drop: ItemDrop.BOX, targetings: Targeting.ALL | Targeting.FRIEND_ONLY,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.up.play();
                    FX_Buff(target.imgCenter);
                    Unit.setCondition(target, Condition.癒, 10);
                }),
            });
        }
    };
    Item.悪魔のファンデュ = new class extends Item {
        constructor() {
            super({ uniqueName: "悪魔のファンデュ", info: "味方全体を＜体↑10＞(行動開始時最大HP+10%)状態にする",
                type: ItemType.状態, rank: 5, drop: ItemDrop.BOX, targetings: Targeting.ALL | Targeting.FRIEND_ONLY,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.up.play();
                    FX_Buff(target.imgCenter);
                    Unit.setCondition(target, Condition.体力上昇, 10);
                }),
            });
        }
    };
    Item.恒星型リュスティック = new class extends Item {
        constructor() {
            super({ uniqueName: "恒星型リュスティック", info: "戦闘時、味方全体の最大HP・HPを50増加させる",
                type: ItemType.状態, rank: 5, drop: ItemDrop.BOX, targetings: Targeting.ALL | Targeting.FRIEND_ONLY,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.up.play();
                    FX_Buff(target.imgCenter);
                    const value = 50;
                    target.prm(Prm.MAX_HP).battle += value;
                    target.hp += value;
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    //-----------------------------------------------------------------
    //
    //-強化付与
    //弱体付与
    //
    //-----------------------------------------------------------------
    Item.ネクロマンス法 = new class extends Item {
        constructor() {
            super({ uniqueName: "ネクロマンス法", info: "一体の最大HPを10%消滅させる(最大99999)",
                type: ItemType.状態, rank: 4, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    const lim = 99999;
                    let value = target.prm(Prm.MAX_HP).total * 0.1;
                    if (value > lim) {
                        value = lim;
                    }
                    target.prm(Prm.MAX_HP).battle -= value;
                    Sound.DARK.play();
                    Util.msg.set(`${target.name}の最大HPが${value | 0}消滅した`);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.ネクロマンス真法 = new class extends Item {
        constructor() {
            super({ uniqueName: "ネクロマンス真法", info: "一体の最大HPを20%消滅させる(最大99999)",
                type: ItemType.状態, rank: 5, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    const lim = 99999;
                    let value = target.prm(Prm.MAX_HP).total * 0.2;
                    if (value > lim) {
                        value = lim;
                    }
                    target.prm(Prm.MAX_HP).battle -= value;
                    Sound.DARK.play();
                    Util.msg.set(`${target.name}の最大HPが${value | 0}消滅した`);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.八ノ地教裏禁呪 = new class extends Item {
        constructor() {
            super({ uniqueName: "八ノ地教裏禁呪", info: "一体の最大HPを33%消滅させる(最大99999)",
                type: ItemType.状態, rank: 6, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    const lim = 99999;
                    let value = target.prm(Prm.MAX_HP).total * 0.33;
                    if (value > lim) {
                        value = lim;
                    }
                    target.prm(Prm.MAX_HP).battle -= value;
                    Sound.DARK.play();
                    Util.msg.set(`${target.name}の最大HPが${value | 0}消滅した`);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.エリの願い = new class extends Item {
        constructor() {
            super({ uniqueName: "エリの願い", info: "一体の最大HPを50%消滅させる(最大99999)",
                type: ItemType.状態, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    const lim = 99999;
                    let value = target.prm(Prm.MAX_HP).total * 0.5;
                    if (value > lim) {
                        value = lim;
                    }
                    target.prm(Prm.MAX_HP).battle -= value;
                    Sound.DARK.play();
                    Util.msg.set(`${target.name}の最大HPが${value | 0}消滅した`);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.子守歌 = new class extends Item {
        constructor() {
            super({ uniqueName: "子守歌", info: "一体を50%の確率で＜眠2＞状態にする",
                type: ItemType.状態, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    if (Math.random() < 0.5) {
                        Unit.setCondition(target, Condition.眠, 2);
                    }
                    else {
                        Util.msg.set("MISS");
                    }
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    //-----------------------------------------------------------------
    //
    //-弱体付与
    //ダメージ
    //
    //-----------------------------------------------------------------
    Item.呪素 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪素", info: "戦闘時、10ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom.play();
                    yield target.doDmg(new Dmg({ absPow: 10 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.呪 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪", info: "戦闘時、50ダメージを与える",
                type: ItemType.ダメージ, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom.play();
                    yield target.doDmg(new Dmg({ absPow: 50 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.呪詛 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪詛", info: "戦闘時、150ダメージを与える",
                type: ItemType.ダメージ, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom.play();
                    yield target.doDmg(new Dmg({ absPow: 150 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.旧式ミサイル = new class extends Item {
        constructor() {
            super({ uniqueName: "旧式ミサイル", info: "戦闘時、250ダメージを与える",
                type: ItemType.ダメージ, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom2.play();
                    yield target.doDmg(new Dmg({ absPow: 250 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.帝国式ミサイル = new class extends Item {
        constructor() {
            super({ uniqueName: "帝国式ミサイル", info: "戦闘時、350ダメージを与える",
                type: ItemType.ダメージ, rank: 4, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom2.play();
                    yield target.doDmg(new Dmg({ absPow: 350 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.ハル式ミサイル = new class extends Item {
        constructor() {
            super({ uniqueName: "ハル式ミサイル", info: "戦闘時、450ダメージを与える",
                type: ItemType.ダメージ, rank: 5, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom2.play();
                    yield target.doDmg(new Dmg({ absPow: 450 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.バスターミサイル = new class extends Item {
        constructor() {
            super({ uniqueName: "バスターミサイル", info: "戦闘時、1000ダメージを与える",
                type: ItemType.ダメージ, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom2.play();
                    yield target.doDmg(new Dmg({ absPow: 1000 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.鬼火 = new class extends Item {
        constructor() {
            super({ uniqueName: "鬼火", info: "戦闘時、敵全体に10ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom.play();
                    yield target.doDmg(new Dmg({ absPow: 10 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.ウィルスα = new class extends Item {
        constructor() {
            super({ uniqueName: "ウィルスα", info: "戦闘時、敵全体に25ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom.play();
                    yield target.doDmg(new Dmg({ absPow: 25 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.手榴弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "手榴弾", info: "戦闘時、敵全体に100ダメージを与える",
                type: ItemType.ダメージ, rank: 1, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom2.play();
                    yield target.doDmg(new Dmg({ absPow: 100 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.鬼火のダイナマイト = new class extends Item {
        constructor() {
            super({ uniqueName: "鬼火のダイナマイト", info: "戦闘時、敵全体に200ダメージを与える",
                type: ItemType.ダメージ, rank: 3, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom2.play();
                    yield target.doDmg(new Dmg({ absPow: 200 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.セクシーダイナマイツ = new class extends Item {
        constructor() {
            super({ uniqueName: "セクシーダイナマイツ", info: "戦闘時、敵全体に1000ダメージを与える",
                type: ItemType.ダメージ, rank: 8, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom2.play();
                    yield target.doDmg(new Dmg({ absPow: 1000 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.バスターマシン3号 = new class extends Item {
        constructor() {
            super({ uniqueName: "バスターマシン3号", info: "戦闘時、敵味方全体に30000ダメージを与える",
                type: ItemType.ダメージ, rank: 10, drop: ItemDrop.BOX, targetings: Targeting.ALL | Targeting.WITH_FRIEND,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.bom2.play();
                    yield target.doDmg(new Dmg({ absPow: 3000 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    //-----------------------------------------------------------------
    //
    //ダンジョン
    //
    //-----------------------------------------------------------------
    Item.動かない映写機 = new class extends Item {
        constructor() {
            super({ uniqueName: "動かない映写機", info: "壊れている...",
                type: ItemType.ダンジョン, rank: 10, drop: ItemDrop.NO,
            });
        }
    };
    Item.脱出ポッド = new class extends Item {
        constructor() {
            super({ uniqueName: "脱出ポッド", info: "ダンジョンから脱出する。なくならない。",
                type: ItemType.ダンジョン, rank: 10, drop: ItemDrop.NO,
                consumable: true,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Scene.load(DungeonScene.ins);
                    yield DungeonEvent.ESCAPE_DUNGEON.happen();
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.DUNGEON; }
    };
    Item.侍プリッツ迅速 = new class extends Item {
        constructor() {
            super({ uniqueName: "侍プリッツ迅速", info: "10AU進む",
                type: ItemType.ダンジョン, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Dungeon.auNow += 10;
                    if (Dungeon.auNow > Dungeon.now.au) {
                        Dungeon.auNow = Dungeon.now.au;
                    }
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.DUNGEON; }
        toString() { return "侍プリッツ・迅速"; }
    };
    Item.侍プリッツ神速一歩手前 = new class extends Item {
        constructor() {
            super({ uniqueName: "侍プリッツ神速一歩手前", info: "20AU進む",
                type: ItemType.ダンジョン, rank: 5, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Dungeon.auNow += 20;
                    if (Dungeon.auNow > Dungeon.now.au) {
                        Dungeon.auNow = Dungeon.now.au;
                    }
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.DUNGEON; }
        toString() { return "侍プリッツ・神速一歩手前"; }
    };
    Item.侍プリッツ神速 = new class extends Item {
        constructor() {
            super({ uniqueName: "侍プリッツ神速", info: "30AU進む",
                type: ItemType.ダンジョン, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Dungeon.auNow += 30;
                    if (Dungeon.auNow > Dungeon.now.au) {
                        Dungeon.auNow = Dungeon.now.au;
                    }
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.DUNGEON; }
        toString() { return "侍プリッツ・神速"; }
    };
    Item.釣り竿 = new class extends Item {
        constructor() {
            super({ uniqueName: "釣り竿", info: "ダンジョン内の湖で釣りができるようになる",
                type: ItemType.ダンジョン, rank: 11, drop: ItemDrop.NO,
                consumable: true,
            });
        }
    };
    Item.つるはし = new class extends Item {
        constructor() {
            super({ uniqueName: "つるはし", info: "ダンジョン内の地層で発掘ができるようになる",
                type: ItemType.ダンジョン, rank: 11, drop: ItemDrop.NO,
                consumable: true,
            });
        }
    };
    //-----------------------------------------------------------------
    //
    //弾
    //
    //-----------------------------------------------------------------
    Item.降雨の矢 = new class extends Item {
        constructor() {
            super({ uniqueName: "降雨の矢", info: "ナーガに使用",
                type: ItemType.弾, rank: 7, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.夜叉の矢 = new class extends Item {
        constructor() {
            super({ uniqueName: "夜叉の矢", info: "ヤクシャに使用",
                type: ItemType.弾, rank: 8, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.金翅鳥の矢 = new class extends Item {
        constructor() {
            super({ uniqueName: "金翅鳥の矢", info: "ガルダに使用",
                type: ItemType.弾, rank: 9, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.歌舞の矢 = new class extends Item {
        constructor() {
            super({ uniqueName: "歌舞の矢", info: "キンナラに使用",
                type: ItemType.弾, rank: 9, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.月夜の矢 = new class extends Item {
        constructor() {
            super({ uniqueName: "月夜の矢", info: "キャンドラに使用",
                type: ItemType.弾, rank: 9, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.手裏剣 = new class extends Item {
        constructor() {
            super({ uniqueName: "手裏剣", info: "手裏剣に使用",
                type: ItemType.弾, rank: 10, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.バッテリー = new class extends Item {
        constructor() {
            super({ uniqueName: "バッテリー", info: "レーザーに使用",
                type: ItemType.弾, rank: 11, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.絵画母なる星の緑の丘 = new class extends Item {
        constructor() {
            super({ uniqueName: "絵画母なる星の緑の丘", info: "ドゥエルガルに使用",
                type: ItemType.弾, rank: 12, drop: ItemDrop.NO,
                consumable: true });
        }
        toString() { return "絵画『母なる星の緑の丘』"; }
    };
    Item.絵画シェイクスピアの涙 = new class extends Item {
        constructor() {
            super({ uniqueName: "絵画シェイクスピアの涙", info: "ネーレイスに使用",
                type: ItemType.弾, rank: 12, drop: ItemDrop.NO,
                consumable: true });
        }
        toString() { return "絵画『シェイクスピアの涙』"; }
    };
    Item.絵画彼女の髪 = new class extends Item {
        constructor() {
            super({ uniqueName: "絵画彼女の髪", info: "ヴァルナに使用",
                type: ItemType.弾, rank: 12, drop: ItemDrop.NO,
                consumable: true });
        }
        toString() { return "絵画『彼女の髪』"; }
    };
    Item.絵画我が情熱の日 = new class extends Item {
        constructor() {
            super({ uniqueName: "絵画我が情熱の日", info: "イリューガーに使用",
                type: ItemType.弾, rank: 12, drop: ItemDrop.NO,
                consumable: true });
        }
        toString() { return "絵画『我が情熱の日』"; }
    };
    Item.聖水 = new class extends Item {
        constructor() {
            super({ uniqueName: "聖水", info: "ガブリエル・ラファエル・ウリエルに使用",
                type: ItemType.弾, rank: 9, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.Dフラスコ = new class extends Item {
        constructor() {
            super({ uniqueName: "Dフラスコ", info: "死体除去に使用",
                type: ItemType.弾, rank: 8, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.マーメイド = new class extends Item {
        constructor() {
            super({ uniqueName: "マーメイド", info: "マーメイドに使用",
                type: ItemType.弾, rank: 7, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.ホムンクルス = new class extends Item {
        constructor() {
            super({ uniqueName: "ホムンクルス", info: "ホムンクルスに使用",
                type: ItemType.弾, rank: 7, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.フランケンシュタイン = new class extends Item {
        constructor() {
            super({ uniqueName: "フランケンシュタイン", info: "フランケンシュタインに使用",
                type: ItemType.弾, rank: 7, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.魔弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "魔弾", info: "羊飼いの銃に使用",
                type: ItemType.弾, rank: 6, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.砲弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "砲弾", info: "大砲に使用",
                type: ItemType.弾, rank: 6, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.霊弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "霊弾", info: "-霊砲-に使用",
                type: ItemType.弾, rank: 6, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.パワータンク = new class extends Item {
        constructor() {
            super({ uniqueName: "パワータンク", info: "バベルに使用",
                type: ItemType.弾, rank: 6, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.林式ミサイル = new class extends Item {
        constructor() {
            super({ uniqueName: "林式ミサイル", info: "林式ミサイルうに使用",
                type: ItemType.弾, rank: 5, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.エボリ製悪魔のミサイル = new class extends Item {
        constructor() {
            super({ uniqueName: "エボリ製悪魔のミサイル", info: "エボリ製悪魔のミサイルに使用",
                type: ItemType.弾, rank: 5, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.メフィスト製悪魔のミサイル = new class extends Item {
        constructor() {
            super({ uniqueName: "メフィスト製悪魔のミサイル", info: "メフィスト製悪魔のミサイルに使用",
                type: ItemType.弾, rank: 5, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.原子爆弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "原子爆弾", info: "原子爆弾に使用",
                type: ItemType.弾, rank: 11, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.水素爆弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "水素爆弾", info: "水素爆弾に使用",
                type: ItemType.弾, rank: 11, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.重力子爆弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "重力子爆弾", info: "重力子爆弾に使用",
                type: ItemType.弾, rank: 11, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    Item.lucifer製量子爆弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "lucifer製量子爆弾", info: "lucifer製量子爆弾に使用",
                type: ItemType.弾, rank: 11, drop: ItemDrop.NO,
                consumable: true });
        }
    };
    //-----------------------------------------------------------------
    //
    //鍵
    //
    //-----------------------------------------------------------------
    Item.丸い鍵 = new class extends Item {
        constructor() {
            super({ uniqueName: "丸い鍵", info: "丸い箱を開ける",
                type: ItemType.鍵, rank: 2, drop: ItemDrop.BOX });
        }
    };
    Item.三角鍵 = new class extends Item {
        constructor() {
            super({ uniqueName: "三角鍵", info: "三角形の箱を開ける",
                type: ItemType.鍵, rank: 3, drop: ItemDrop.BOX });
        }
    };
    Item.トゲトゲ鍵 = new class extends Item {
        constructor() {
            super({ uniqueName: "トゲトゲ鍵", info: "トゲトゲの箱を開ける",
                type: ItemType.鍵, rank: 4, drop: ItemDrop.BOX });
        }
    };
    Item.ツルツル鍵 = new class extends Item {
        constructor() {
            super({ uniqueName: "ツルツル鍵", info: "ツルツルした箱を開ける",
                type: ItemType.鍵, rank: 5, drop: ItemDrop.BOX });
        }
    };
    Item.ヘンテコ鍵 = new class extends Item {
        constructor() {
            super({ uniqueName: "ヘンテコ鍵", info: "ヘンテコな箱を開ける",
                type: ItemType.鍵, rank: 6, drop: ItemDrop.BOX });
        }
    };
    //-----------------------------------------------------------------
    //
    //ドーピング
    //
    //-----------------------------------------------------------------
    Item.いざなみの命 = new class extends Item {
        constructor() {
            super({ uniqueName: "いざなみの命", info: "最大HP+2",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.MAX_HP).base += 2;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の最大HP+2`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.林ライス = new class extends Item {
        constructor() {
            super({ uniqueName: "林ライス", info: "最大HP+3",
                type: ItemType.ドーピング, rank: 12, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.MAX_HP).base += 3;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の最大HP+3`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.おおげつ姫 = new class extends Item {
        constructor() {
            super({ uniqueName: "おおげつ姫", info: "最大MP+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.MAX_MP).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の最大MP+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.アラハバキ神 = new class extends Item {
        constructor() {
            super({ uniqueName: "アラハバキ神", info: "最大TP+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.MAX_TP).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の最大TP+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.この花咲くや姫 = new class extends Item {
        constructor() {
            super({ uniqueName: "この花咲くや姫", info: "力+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.STR).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の力+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.つくよみの命 = new class extends Item {
        constructor() {
            super({ uniqueName: "つくよみの命", info: "魔+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.MAG).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の魔+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.よもつおお神 = new class extends Item {
        constructor() {
            super({ uniqueName: "よもつおお神", info: "光+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.LIG).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の光+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.わたつみの神 = new class extends Item {
        constructor() {
            super({ uniqueName: "わたつみの神", info: "闇+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.DRK).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の闇+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.へつなぎさびこの神 = new class extends Item {
        constructor() {
            super({ uniqueName: "へつなぎさびこの神", info: "鎖+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.CHN).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の鎖+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.ほのかぐつちの神 = new class extends Item {
        constructor() {
            super({ uniqueName: "ほのかぐつちの神", info: "過+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.PST).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の過+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.たけみかづちの命 = new class extends Item {
        constructor() {
            super({ uniqueName: "たけみかづちの命", info: "銃+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.GUN).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の銃+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.すさのおの命 = new class extends Item {
        constructor() {
            super({ uniqueName: "すさのおの命", info: "弓+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.prm(Prm.ARR).base += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}の弓+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.ささやかな贈り物 = new class extends Item {
        constructor() {
            super({ uniqueName: "ささやかな贈り物", info: "BP+1",
                type: ItemType.ドーピング, rank: 10, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.bp += 1;
                    Sound.bpup.play();
                    FX_Str(Font.def, `${target.name}のBP+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.列なりの思い出 = new class extends Item {
        constructor() {
            super({ uniqueName: "列なりの思い出", info: "Lv-1",
                type: ItemType.ドーピング, rank: 12, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    if (target.prm(Prm.LV).base > 0) {
                        target.prm(Prm.LV).base--;
                        Sound.bpup.play();
                        FX_Str(Font.def, `${target.name}のLv-1`, Point.CENTER, Color.WHITE);
                    }
                }),
            });
        }
        canUse(user, targets) {
            for (const t of targets) {
                if (t.prm(Prm.LV).base <= 0) {
                    return false;
                }
            }
            return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE;
        }
    };
    const createMaborosi = (uniqueName, rank, value) => {
        return new class extends Item {
            constructor() {
                super({ uniqueName: uniqueName, info: "対象の経験値+" + value,
                    type: ItemType.ドーピング, rank: rank, drop: ItemDrop.BOX,
                    use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                        Sound.exp.play();
                        target.exp += value;
                    }),
                });
            }
            canUse(user, targets) {
                for (const t of targets) {
                    if (t instanceof PUnit && t.exp >= t.getNextLvExp()) {
                        return false;
                    }
                }
                return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE;
            }
        };
    };
    Item.灰色のまぼろし = createMaborosi("灰色のまぼろし", /*rank*/ 0, /*value*/ 30);
    Item.黒色のまぼろし = createMaborosi("黒色のまぼろし", /*rank*/ 2, /*value*/ 50);
    Item.白色のまぼろし = createMaborosi("白色のまぼろし", /*rank*/ 4, /*value*/ 70);
    Item.金色のまぼろし = createMaborosi("金色のまぼろし", /*rank*/ 6, /*value*/ 90);
    Item.緋色のまぼろし = createMaborosi("緋色のまぼろし", /*rank*/ 8, /*value*/ 110);
    Item.アーク素子 = new class extends Item {
        constructor() {
            super({ uniqueName: "アーク素子", info: "",
                type: ItemType.ドーピング, rank: 1, drop: ItemDrop.BOX,
            });
        }
    };
    const createBlood = (uniqueName, jobName, job) => {
        return new class extends Item {
            constructor() {
                super({ uniqueName: uniqueName, info: jobName + "に転職できるようになる",
                    type: ItemType.ドーピング, rank: 6, drop: ItemDrop.NO,
                    use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                        if (target instanceof PUnit) {
                            Sound.exp.play();
                            target.setJobLv(job(), 1);
                        }
                    }),
                });
            }
            canUse(user, targets) {
                for (const t of targets) {
                    if (!(t instanceof PUnit && t.getJobLv(job()) === 0)) {
                        return false;
                    }
                }
                return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE;
            }
        };
    };
    Item.ヴァンパイアの血 = createBlood("ヴァンパイアの血", "ヴァンパイア", () => Job.ヴァンパイア);
    Item.霊術戦士の血 = createBlood("霊術戦士の血", "霊術戦士", () => Job.霊術戦士);
    Item.ホークマンの血 = createBlood("ホークマンの血", "ホークマン", () => Job.ホークマン);
    Item.精霊使いの血 = createBlood("精霊使いの血", "精霊使い", () => Job.精霊使い);
    //-----------------------------------------------------------------
    //
    //書
    //
    //-----------------------------------------------------------------
    const createAddTecNumBook = (uniqueName, tecNum) => {
        return new class extends Item {
            constructor() {
                super({ uniqueName: uniqueName, info: `技のセット可能数を${tecNum}に増やす`,
                    type: ItemType.書, rank: 13, drop: ItemDrop.NO,
                    use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                        target.tecs.push(Tec.empty);
                        FX_Str(Font.def, `${target.name}の技セット可能数が${tecNum}になった`, Point.CENTER, Color.WHITE);
                    }),
                });
            }
            canUse(user, targets) {
                for (const u of targets) {
                    if (!(u instanceof PUnit && u.tecs.length === tecNum - 1)) {
                        return false;
                    }
                }
                return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE;
            }
        };
    };
    Item.兵法指南の書 = createAddTecNumBook("兵法指南の書", 6);
    Item.五輪の書 = createAddTecNumBook("五輪の書", 7);
    // export const                         天地創造の書:Item = 
    //                 createAddTecNumBook("天地創造の書", 8);
    //-----------------------------------------------------------------
    //
    //メモ
    //
    //-----------------------------------------------------------------
    Item.消耗品のメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "消耗品のメモ", info: "「ごく一部の消耗品はダンジョンに入る度に補充される。脱出ポッドなどがそれに該当する」と書かれている",
                type: ItemType.メモ, rank: 0, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.夏のメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "夏のメモ", info: "「夏はいつ終わるの？」と書かれている",
                type: ItemType.メモ, rank: 1, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.冬のメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "冬のメモ", info: "「いつまでもこの冬が続けばいいのに」と書かれている",
                type: ItemType.メモ, rank: 7, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.EPのメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "EPのメモ", info: "「EPはダンジョンに侵入する時に回復する。なので、EPを消費する技は基本的に一度の侵入で一回しか使えない」と書かれている",
                type: ItemType.メモ, rank: 1, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.SPのメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "SPのメモ", info: "「SPは戦闘開始時に回復する。なので、SPを消費する技は基本的に一度の戦闘で一回しか使えない」と書かれている",
                type: ItemType.メモ, rank: 5, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.HP至上主義のメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "HP至上主義のメモ", info: "「とりあえずHPを上げれば間違いはない。俺は詳しいんだ」と書かれている",
                type: ItemType.メモ, rank: 0, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.HP懐疑主義のメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "HP懐疑主義のメモ", info: "「何も考えずにHPを上げるのは危険だ。騙されないぞ」と書かれている",
                type: ItemType.メモ, rank: 1, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.ジスカルドのメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "ジスカルドのメモ", info: "「じすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさん」と書かれている",
                type: ItemType.メモ, rank: 9, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.練盾のメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "練盾のメモ", info: "「＜練＞状態は格闘・神格・鎖術・銃攻撃を強化する。＜盾＞状態はそれらを軽減する」と書かれている",
                type: ItemType.メモ, rank: 1, drop: ItemDrop.BOX, numLimit: 1 });
        }
        toString() { return "＜練＞＜盾＞のメモ"; }
    };
    Item.合成許可証 = new class extends Item {
        constructor() {
            super({ uniqueName: "合成許可証", info: "「合成してもいいよ」と書かれている",
                type: ItemType.メモ, rank: 10, drop: ItemDrop.NO, numLimit: 1 });
        }
    };
    Item.リュサンデールの絵筆 = new class extends Item {
        constructor() {
            super({ uniqueName: "リュサンデールの絵筆", info: "これでぬってあげるわね、すごく！",
                type: ItemType.メモ, rank: 10, drop: ItemDrop.NO, numLimit: 1 });
        }
    };
    Item.レレシピ = new class extends Item {
        constructor() {
            super({ uniqueName: "レレシピ", info: "予感の街・レに伝わる秘伝の装備レシピ",
                type: ItemType.メモ, rank: 8, drop: ItemDrop.NO, numLimit: 1 });
        }
    };
    Item.イスレシピ = new class extends Item {
        constructor() {
            super({ uniqueName: "イスレシピ", info: "水の都・イスに伝わる秘伝の装備レシピ",
                type: ItemType.メモ, rank: 8, drop: ItemDrop.NO, numLimit: 1 });
        }
    };
    // export const                         パーティースキル取り扱い許可証:Item = new class extends Item{
    //     constructor(){super({uniqueName:"パーティースキル取り扱い許可証", info:"パーティースキルが解放される", 
    //                             type:ItemType.メモ, rank:10, drop:ItemDrop.NO, numLimit:1})}
    // };
    //-----------------------------------------------------------------
    //
    //素材
    //
    //-----------------------------------------------------------------
    Item.石 = new class extends Item {
        constructor() {
            super({ uniqueName: "石", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.かんな = new class extends Item {
        constructor() {
            super({ uniqueName: "かんな", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.少女の心を持ったおっさん = new class extends Item {
        constructor() {
            super({ uniqueName: "少女の心を持ったおっさん", info: "いつもプリキュアの話をしている",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.草 = new class extends Item {
        constructor() {
            super({ uniqueName: "草", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.肉 = new class extends Item {
        constructor() {
            super({ uniqueName: "肉", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.バッタ = new class extends Item {
        constructor() {
            super({ uniqueName: "バッタ", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX });
        }
    };
    Item.たんぽぽ = new class extends Item {
        constructor() {
            super({ uniqueName: "たんぽぽ", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX });
        }
    };
    Item.エレタクレヨン = new class extends Item {
        constructor() {
            super({ uniqueName: "エレタクレヨン", info: "おえかきしようね",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX });
        }
        toString() { return "エレ・タ・クレヨン"; }
    };
    Item.ファーストキス = new class extends Item {
        constructor() {
            super({ uniqueName: "ファーストキス", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX });
        }
    };
    Item.退魔の十字架 = new class extends Item {
        constructor() {
            super({ uniqueName: "退魔の十字架", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX });
        }
    };
    Item.エレタの絵の具 = new class extends Item {
        constructor() {
            super({ uniqueName: "エレタの絵の具", info: "ぬりぬりしようね",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX });
        }
        toString() { return "エレ・タの絵の具"; }
    };
    Item.うんち = new class extends Item {
        constructor() {
            super({ uniqueName: "うんち", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX });
        }
    };
    Item.太陽の欠片 = new class extends Item {
        constructor() {
            super({ uniqueName: "太陽の欠片", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX });
        }
    };
    Item.血粉末 = new class extends Item {
        constructor() {
            super({ uniqueName: "血粉末", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX });
        }
    };
    Item.思い出そのもの = new class extends Item {
        constructor() {
            super({ uniqueName: "思い出そのもの", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX });
        }
    };
    Item.あらくれ剣 = new class extends Item {
        constructor() {
            super({ uniqueName: "あらくれ剣", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX });
        }
    };
    Item.烈火 = new class extends Item {
        constructor() {
            super({ uniqueName: "烈火", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX });
        }
    };
    Item.清龍 = new class extends Item {
        constructor() {
            super({ uniqueName: "清龍", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX });
        }
    };
    Item.失った思い出 = new class extends Item {
        constructor() {
            super({ uniqueName: "失った思い出", info: "",
                type: ItemType.素材, rank: 6, drop: ItemDrop.BOX });
        }
    };
    Item.火と水と土と風と光と闇のアニムス = new class extends Item {
        constructor() {
            super({ uniqueName: "火と水と土と風と光と闇のアニムス", info: "",
                type: ItemType.素材, rank: 6, drop: ItemDrop.BOX });
        }
    };
    Item.鳥使い達の誓い = new class extends Item {
        constructor() {
            super({ uniqueName: "鳥使い達の誓い", info: "",
                type: ItemType.素材, rank: 7, drop: ItemDrop.BOX });
        }
    };
    Item.遠い約束 = new class extends Item {
        constructor() {
            super({ uniqueName: "遠い約束", info: "",
                type: ItemType.素材, rank: 8, drop: ItemDrop.BOX });
        }
    };
    Item.カンバス = new class extends Item {
        constructor() {
            super({ uniqueName: "カンバス", info: "",
                type: ItemType.素材, rank: 8, drop: ItemDrop.BOX });
        }
    };
    Item.セカンドチャンス = new class extends Item {
        constructor() {
            super({ uniqueName: "セカンドチャンス", info: "",
                type: ItemType.素材, rank: 9, drop: ItemDrop.BOX });
        }
    };
    Item.きゅうせん = new class extends Item {
        constructor() {
            super({ uniqueName: "9000", info: "",
                type: ItemType.素材, rank: 10, drop: ItemDrop.BOX });
        }
    };
    Item.セルダンの危機 = new class extends Item {
        constructor() {
            super({ uniqueName: "セルダンの危機", info: "",
                type: ItemType.素材, rank: 11, drop: ItemDrop.BOX });
        }
    };
    Item.フロントミッション = new class extends Item {
        constructor() {
            super({ uniqueName: "フロントミッション", info: "",
                type: ItemType.素材, rank: 11, drop: ItemDrop.BOX });
        }
    };
    Item.獣神イリューガ = new class extends Item {
        constructor() {
            super({ uniqueName: "獣神イリューガ", info: "",
                type: ItemType.素材, rank: 12, drop: ItemDrop.BOX });
        }
    };
    //-----------------------------------------------------------------
    //
    //TREE
    //
    //-----------------------------------------------------------------
    Item.杉 = new class extends Item {
        constructor() {
            super({ uniqueName: "杉", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.ヒノキ = new class extends Item {
        constructor() {
            super({ uniqueName: "ヒノキ", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.竹 = new class extends Item {
        constructor() {
            super({ uniqueName: "竹", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.松 = new class extends Item {
        constructor() {
            super({ uniqueName: "松", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.クワ = new class extends Item {
        constructor() {
            super({ uniqueName: "クワ", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.エデン樹 = new class extends Item {
        constructor() {
            super({ uniqueName: "エデン樹", info: "エデンに生える細く長い木",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.桜 = new class extends Item {
        constructor() {
            super({ uniqueName: "桜", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.発砲ツル = new class extends Item {
        constructor() {
            super({ uniqueName: "発砲ツル", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.桐 = new class extends Item {
        constructor() {
            super({ uniqueName: "桐", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.梅 = new class extends Item {
        constructor() {
            super({ uniqueName: "梅", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.三木 = new class extends Item {
        constructor() {
            super({ uniqueName: "三木", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.クヌギ = new class extends Item {
        constructor() {
            super({ uniqueName: "クヌギ", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.高野槙 = new class extends Item {
        constructor() {
            super({ uniqueName: "高野槙", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.杜松 = new class extends Item {
        constructor() {
            super({ uniqueName: "杜松", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.翌檜 = new class extends Item {
        constructor() {
            super({ uniqueName: "翌檜", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.テント木 = new class extends Item {
        constructor() {
            super({ uniqueName: "テント木", info: "",
                type: ItemType.素材, rank: 6, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.ヒュム = new class extends Item {
        constructor() {
            super({ uniqueName: "ヒュム", info: "ジャスライク星系に生息する歩く生きた巨木",
                type: ItemType.素材, rank: 7, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.霊樹 = new class extends Item {
        constructor() {
            super({ uniqueName: "霊樹", info: "",
                type: ItemType.素材, rank: 8, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.バーナード原木 = new class extends Item {
        constructor() {
            super({ uniqueName: "バーナード原木", info: "",
                type: ItemType.素材, rank: 9, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.日立の木 = new class extends Item {
        constructor() {
            super({ uniqueName: "日立の木", info: "この木なんの木",
                type: ItemType.素材, rank: 10, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    //-----------------------------------------------------------------
    //
    //加工木材
    //
    //-----------------------------------------------------------------
    Item.杉材 = new class extends Item {
        constructor() {
            super({ uniqueName: "杉材", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX });
        }
    };
    Item.ヒノキ材 = new class extends Item {
        constructor() {
            super({ uniqueName: "ヒノキ材", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX });
        }
    };
    Item.竹材 = new class extends Item {
        constructor() {
            super({ uniqueName: "竹材", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX });
        }
    };
    Item.合板 = new class extends Item {
        constructor() {
            super({ uniqueName: "合板", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX });
        }
    };
    Item.サクラ材 = new class extends Item {
        constructor() {
            super({ uniqueName: "サクラ材", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX });
        }
    };
    Item.松材 = new class extends Item {
        constructor() {
            super({ uniqueName: "松材", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX });
        }
    };
    //-----------------------------------------------------------------
    //
    //STRATUM
    //
    //-----------------------------------------------------------------
    Item.砂 = new class extends Item {
        constructor() {
            super({ uniqueName: "砂", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.地球のひも = new class extends Item {
        constructor() {
            super({ uniqueName: "地球のひも", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.STRATUM });
        }
    };
    Item.銅 = new class extends Item {
        constructor() {
            super({ uniqueName: "銅", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX | ItemDrop.STRATUM | ItemDrop.FOSSIL });
        }
    };
    Item.鉄 = new class extends Item {
        constructor() {
            super({ uniqueName: "鉄", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.STRATUM | ItemDrop.FOSSIL });
        }
    };
    Item.土 = new class extends Item {
        constructor() {
            super({ uniqueName: "土", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.粘土 = new class extends Item {
        constructor() {
            super({ uniqueName: "粘土", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.バーミキュライト = new class extends Item {
        constructor() {
            super({ uniqueName: "バーミキュライト", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.銀 = new class extends Item {
        constructor() {
            super({ uniqueName: "銀", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.錫 = new class extends Item {
        constructor() {
            super({ uniqueName: "錫", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.クリスタル = new class extends Item {
        constructor() {
            super({ uniqueName: "クリスタル", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.金 = new class extends Item {
        constructor() {
            super({ uniqueName: "金", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.イズミジュエリー = new class extends Item {
        constructor() {
            super({ uniqueName: "イズミジュエリー", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.良い土 = new class extends Item {
        constructor() {
            super({ uniqueName: "良い土", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.白金 = new class extends Item {
        constructor() {
            super({ uniqueName: "白金", info: "",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.サングラス = new class extends Item {
        constructor() {
            super({ uniqueName: "サングラス", info: "",
                type: ItemType.素材, rank: 6, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.重力 = new class extends Item {
        constructor() {
            super({ uniqueName: "重力", info: "",
                type: ItemType.素材, rank: 7, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.ジスカルド = new class extends Item {
        constructor() {
            super({ uniqueName: "ジスカルド", info: "",
                type: ItemType.素材, rank: 8, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.オムナイト = new class extends Item {
        constructor() {
            super({ uniqueName: "オムナイト", info: "おおむかし うみに すんでいた こだい ポケモン。10ぽんの あしを くねらせて およぐ。",
                type: ItemType.素材, rank: 9, drop: ItemDrop.BOX | ItemDrop.FOSSIL | ItemDrop.FISHING });
        }
    };
    //-----------------------------------------------------------------
    //
    //加工金属
    //
    //-----------------------------------------------------------------
    Item.針金 = new class extends Item {
        constructor() {
            super({ uniqueName: "針金", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX });
        }
    };
    Item.ガラス = new class extends Item {
        constructor() {
            super({ uniqueName: "ガラス", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX });
        }
    };
    Item.銅板 = new class extends Item {
        constructor() {
            super({ uniqueName: "銅板", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX });
        }
    };
    Item.エレクトラム = new class extends Item {
        constructor() {
            super({ uniqueName: "エレクトラム", info: "",
                type: ItemType.素材, rank: 7, drop: ItemDrop.BOX });
        }
    };
    //-----------------------------------------------------------------
    //
    //FOSSIL
    //
    //-----------------------------------------------------------------
    Item.アステロイド = new class extends Item {
        constructor() {
            super({ uniqueName: "アステロイド", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.アリラン型岩石 = new class extends Item {
        constructor() {
            super({ uniqueName: "アリラン型岩石", info: "おっきないしっころ",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.エーテルトカゲ = new class extends Item {
        constructor() {
            super({ uniqueName: "エーテルトカゲ", info: "宇宙空間のエーテル間を連続的にワープし移動するトカゲ",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.カリストコウモリ = new class extends Item {
        constructor() {
            super({ uniqueName: "カリストコウモリ", info: "木星衛星カリストに生息する青いコウモリ",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.スカイフェアリーの死体 = new class extends Item {
        constructor() {
            super({ uniqueName: "スカイフェアリーの死体", info: "魔獣ドンゴの胃袋から発見される事が多い",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.ドルバン粉末 = new class extends Item {
        constructor() {
            super({ uniqueName: "ドルバン粉末", info: "精霊の威力を500p上げる",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.ドンゴの鱗 = new class extends Item {
        constructor() {
            super({ uniqueName: "ドンゴの鱗", info: "多目獣ドンゴの鱗",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.ドンゴの骨 = new class extends Item {
        constructor() {
            super({ uniqueName: "ドンゴの骨", info: "多目獣ドンゴの骨の一部",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.ヒルトン石 = new class extends Item {
        constructor() {
            super({ uniqueName: "ヒルトン石", info: "",
                type: ItemType.素材, rank: 6, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.ムーンストーン = new class extends Item {
        constructor() {
            super({ uniqueName: "ムーンストーン", info: "月でとれる不思議な石",
                type: ItemType.素材, rank: 6, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.家康の生首 = new class extends Item {
        constructor() {
            super({ uniqueName: "家康の生首", info: "fromNIPPON",
                type: ItemType.素材, rank: 7, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.大型隕石 = new class extends Item {
        constructor() {
            super({ uniqueName: "大型隕石", info: "",
                type: ItemType.素材, rank: 7, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.永久月磁石 = new class extends Item {
        constructor() {
            super({ uniqueName: "永久月磁石", info: "月で産出する特殊な磁場を持つ永久磁石",
                type: ItemType.素材, rank: 8, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.巨人の肉片君 = new class extends Item {
        constructor() {
            super({ uniqueName: "巨人の肉片君", info: "ペルセポネの肉片、食べるとお腹+20",
                type: ItemType.素材, rank: 8, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.真空蛇 = new class extends Item {
        constructor() {
            super({ uniqueName: "真空蛇", info: "真空中で生息可能な謎の蛇、小さいものでも全長250kmを越える",
                type: ItemType.素材, rank: 9, drop: ItemDrop.BOX | ItemDrop.FOSSIL });
        }
    };
    Item.空亀 = new class extends Item {
        constructor() {
            super({ uniqueName: "空亀", info: "木星核付近に生息する巨大亀、この亀の動作によって木星雲の模様が変化すると言われている",
                type: ItemType.素材, rank: 10, drop: ItemDrop.FOSSIL });
        }
    };
    Item.燃える脳 = new class extends Item {
        constructor() {
            super({ uniqueName: "燃える脳", info: "",
                type: ItemType.素材, rank: 10, drop: ItemDrop.FOSSIL });
        }
    };
    Item.にっく = new class extends Item {
        constructor() {
            super({ uniqueName: "にっく", info: "うちゅうのおにく、LOVE ＆ NIKU",
                type: ItemType.素材, rank: 10, drop: ItemDrop.FOSSIL });
        }
    };
    Item.ゆかり = new class extends Item {
        constructor() {
            super({ uniqueName: "ゆかり", info: "？？？？",
                type: ItemType.素材, rank: 11, drop: ItemDrop.FOSSIL });
        }
    };
    Item.Wにっく = new class extends Item {
        constructor() {
            super({ uniqueName: "Wにっく", info: "うちゅうのおにく、NIKU ＆ NIKU",
                type: ItemType.素材, rank: 12, drop: ItemDrop.FOSSIL });
        }
    };
    Item.あの頃 = new class extends Item {
        constructor() {
            super({ uniqueName: "あの頃", info: "",
                type: ItemType.素材, rank: 13, drop: ItemDrop.FOSSIL });
        }
    };
    //-----------------------------------------------------------------
    //
    //LAKE
    //
    //-----------------------------------------------------------------
    Item.水 = new class extends Item {
        constructor() {
            super({ uniqueName: "水", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.イズミミズ = new class extends Item {
        constructor() {
            super({ uniqueName: "イズミミズ", info: "みみずっぽい",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.呪い水 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪い水", info: "野山などに転がる獣の霊が宿る水",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.カゼミズ = new class extends Item {
        constructor() {
            super({ uniqueName: "カゼミズ", info: "サラサラとした水",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.円形ハゲミミズの油 = new class extends Item {
        constructor() {
            super({ uniqueName: "円形ハゲミミズの油", info: "油",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.ジェリーの粘液 = new class extends Item {
        constructor() {
            super({ uniqueName: "ジェリーの粘液", info: "ねばねば",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.ロウ = new class extends Item {
        constructor() {
            super({ uniqueName: "ロウ", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.精霊の涙 = new class extends Item {
        constructor() {
            super({ uniqueName: "精霊の涙", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.王子の素 = new class extends Item {
        constructor() {
            super({ uniqueName: "王子の素", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.テント樹液 = new class extends Item {
        constructor() {
            super({ uniqueName: "テント樹液", info: "テント樹から取れる樹液、ゴム状",
                type: ItemType.素材, rank: 5, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.ストュクス川の水 = new class extends Item {
        constructor() {
            super({ uniqueName: "ストュクス川の水", info: "精霊値を800上昇させる",
                type: ItemType.素材, rank: 6, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.ガゼルの血液 = new class extends Item {
        constructor() {
            super({ uniqueName: "ガゼルの血液", info: "上空でのみ生きる事ができた有翼人のガゼル、彼の全身から吹き出た血。",
                type: ItemType.素材, rank: 7, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.はなみず = new class extends Item {
        constructor() {
            super({ uniqueName: "はなみず", info: "",
                type: ItemType.素材, rank: 8, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.ミダスの水 = new class extends Item {
        constructor() {
            super({ uniqueName: "ミダスの水", info: "",
                type: ItemType.素材, rank: 9, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.ドンゴのミルク = new class extends Item {
        constructor() {
            super({ uniqueName: "ドンゴのミルク", info: "",
                type: ItemType.素材, rank: 10, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    //-----------------------------------------------------------------
    //
    //FISHING
    //
    //-----------------------------------------------------------------
    Item.コイキング = new class extends Item {
        constructor() {
            super({ uniqueName: "コイキング", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.FISHING });
        }
    };
    Item.かに = new class extends Item {
        constructor() {
            super({ uniqueName: "かに", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.FISHING });
        }
    };
    Item.うに = new class extends Item {
        constructor() {
            super({ uniqueName: "うに", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.FISHING });
        }
    };
    Item.ルアー = new class extends Item {
        constructor() {
            super({ uniqueName: "ルアー", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.FISHING });
        }
    };
    Item.宇宙魚 = new class extends Item {
        constructor() {
            super({ uniqueName: "宇宙魚", info: "宇宙を浮遊移動し、エーテルを食らう不思議な生物",
                type: ItemType.素材, rank: 1, drop: ItemDrop.FISHING });
        }
    };
    Item.ミヂンコ = new class extends Item {
        constructor() {
            super({ uniqueName: "ミヂンコ", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.FISHING });
        }
    };
    Item.シュ = new class extends Item {
        constructor() {
            super({ uniqueName: "シュ", info: "少し素早い魚",
                type: ItemType.素材, rank: 2, drop: ItemDrop.FISHING });
        }
    };
    Item.おじさん = new class extends Item {
        constructor() {
            super({ uniqueName: "おじさん", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.FISHING });
        }
    };
    Item.RANK2 = new class extends Item {
        constructor() {
            super({ uniqueName: "RANK2", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.FISHING });
        }
    };
    Item.緑亀 = new class extends Item {
        constructor() {
            super({ uniqueName: "緑亀", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.FISHING });
        }
    };
    Item.タイヤクラゲ = new class extends Item {
        constructor() {
            super({ uniqueName: "タイヤクラゲ", info: "タイヤみたいなクラゲ。けっこう丈夫、食べるとお腹+4",
                type: ItemType.素材, rank: 3, drop: ItemDrop.FISHING });
        }
    };
    Item.ミソヅケ = new class extends Item {
        constructor() {
            super({ uniqueName: "ミソヅケ", info: "おいしそう、食べるとお腹+13",
                type: ItemType.素材, rank: 4, drop: ItemDrop.FISHING });
        }
    };
    Item.ブレインうさぎ = new class extends Item {
        constructor() {
            super({ uniqueName: "ブレインうさぎ", info: "あたまのいいうさぎちゃん....食べるとお腹+27",
                type: ItemType.素材, rank: 4, drop: ItemDrop.FISHING });
        }
    };
    Item.幽霊猫 = new class extends Item {
        constructor() {
            super({ uniqueName: "幽霊猫", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.FISHING });
        }
    };
    Item.魂のない子 = new class extends Item {
        constructor() {
            super({ uniqueName: "魂のない子", info: "魂が宿っていない人造人間の子....食べるとお腹+28",
                type: ItemType.素材, rank: 5, drop: ItemDrop.FISHING });
        }
    };
    Item.ウェーブコイラバタフラ = new class extends Item {
        constructor() {
            super({ uniqueName: "ウェーブコイラバタフラ", info: "宇宙がビックバンとビッククランチを繰り返す史中を超",
                type: ItemType.素材, rank: 5, drop: ItemDrop.FISHING });
        }
    };
    Item.ウェーブコイラバタフライ = new class extends Item {
        constructor() {
            super({ uniqueName: "ウェーブコイラバタフライ", info: "宇宙がビックバンとビッククランチを繰り返す史中を超えて生き続ける超生物....食べるとお腹+26",
                type: ItemType.素材, rank: 6, drop: ItemDrop.FISHING });
        }
    };
    Item.MMMMM = new class extends Item {
        constructor() {
            super({ uniqueName: "MMMMM", info: "ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ",
                type: ItemType.素材, rank: 6, drop: ItemDrop.FISHING });
        }
        toString() { return "ＭＭＭＭＭ"; }
    };
    Item.ペガサス = new class extends Item {
        constructor() {
            super({ uniqueName: "ペガサス", info: "YUKI",
                type: ItemType.素材, rank: 7, drop: ItemDrop.FISHING });
        }
    };
    Item.ドラゴン = new class extends Item {
        constructor() {
            super({ uniqueName: "ドラゴン", info: "VEGA",
                type: ItemType.素材, rank: 7, drop: ItemDrop.FISHING });
        }
    };
    Item.重子力艦ソラ = new class extends Item {
        constructor() {
            super({ uniqueName: "重子力艦ソラ", info: "",
                type: ItemType.素材, rank: 8, drop: ItemDrop.FISHING });
        }
    };
    Item.ウェポン = new class extends Item {
        constructor() {
            super({ uniqueName: "ウェポン", info: "",
                type: ItemType.素材, rank: 8, drop: ItemDrop.FISHING });
        }
    };
    Item.一号 = new class extends Item {
        constructor() {
            super({ uniqueName: "一号", info: "",
                type: ItemType.素材, rank: 9, drop: ItemDrop.FISHING });
        }
    };
    Item.零号 = new class extends Item {
        constructor() {
            super({ uniqueName: "零号", info: "",
                type: ItemType.素材, rank: 10, drop: ItemDrop.FISHING });
        }
    };
    Item.テルウィング = new class extends Item {
        constructor() {
            super({ uniqueName: "テルウィング", info: "非常に高度な人口翼だが、ピクピクと動いている。食べるとお腹+32",
                type: ItemType.素材, rank: 11, drop: ItemDrop.FISHING });
        }
        toString() { return "テル・ウィング"; }
    };
    Item.モナト = new class extends Item {
        constructor() {
            super({ uniqueName: "モナト", info: "？？？？",
                type: ItemType.素材, rank: 11, drop: ItemDrop.FISHING });
        }
    };
    Item.チュルホロ = new class extends Item {
        constructor() {
            super({ uniqueName: "チュルホロ", info: "",
                type: ItemType.素材, rank: 12, drop: ItemDrop.FISHING });
        }
    };
    Item.シスミン = new class extends Item {
        constructor() {
            super({ uniqueName: "シスミン", info: "",
                type: ItemType.素材, rank: 13, drop: ItemDrop.FISHING });
        }
    };
    //-----------------------------------------------------------------
    //
    //エリア素材
    //
    //-----------------------------------------------------------------
    Item.月の石 = new class extends Item {
        constructor() {
            super({ uniqueName: "月の石", info: "月地域で稀に採れる石",
                type: ItemType.素材, rank: 3, drop: ItemDrop.NO });
        }
    };
    Item.肉まん = new class extends Item {
        constructor() {
            super({ uniqueName: "肉まん", info: "中央島地域で稀に採れる肉まん",
                type: ItemType.素材, rank: 3, drop: ItemDrop.NO });
        }
    };
    Item.地球塔粉末 = new class extends Item {
        constructor() {
            super({ uniqueName: "地球塔粉末", info: "中央島地域で稀に採れる地球塔粉末",
                type: ItemType.素材, rank: 4, drop: ItemDrop.NO });
        }
    };
    Item.タンホイザーの砂飯 = new class extends Item {
        constructor() {
            super({ uniqueName: "タンホイザーの砂飯", info: "黒地域で稀に採れる料理、全員のお腹を4回復",
                type: ItemType.素材, rank: 3, drop: ItemDrop.NO });
        }
    };
    Item.黒色火薬 = new class extends Item {
        constructor() {
            super({ uniqueName: "黒色火薬", info: "黒地域で稀に採れる火薬",
                type: ItemType.素材, rank: 4, drop: ItemDrop.NO });
        }
    };
    Item.B火薬 = new class extends Item {
        constructor() {
            super({ uniqueName: "B火薬", info: "黒地域で稀に採れる火薬",
                type: ItemType.素材, rank: 5, drop: ItemDrop.NO });
        }
    };
    Item.マーザン = new class extends Item {
        constructor() {
            super({ uniqueName: "マーザン", info: "古マーザン地域で稀に採れるマーザン",
                type: ItemType.素材, rank: 3, drop: ItemDrop.NO });
        }
    };
    Item.冥石 = new class extends Item {
        constructor() {
            super({ uniqueName: "冥石", info: "冥界地域で稀に採れる石",
                type: ItemType.素材, rank: 4, drop: ItemDrop.NO });
        }
    };
})(Item || (Item = {}));
