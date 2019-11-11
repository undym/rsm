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
import { FX_Str } from "./fx/fx.js";
import { Targeting, Dmg } from "./force.js";
import { choice } from "./undym/random.js";
import { Font } from "./graphics/graphics.js";
import { Num } from "./mix.js";
import { DungeonEvent } from "./dungeon/dungeonevent.js";
import { SaveData } from "./savedata.js";
import DungeonScene from "./scene/dungeonscene.js";
import { Condition } from "./condition.js";
import { Sound } from "./sound.js";
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
ItemType.固有素材 = new ItemType("固有素材");
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
    ItemType.メモ, ItemType.固有素材, ItemType.素材,
]);
export var ItemDrop;
(function (ItemDrop) {
    ItemDrop[ItemDrop["NO"] = 0] = "NO";
    ItemDrop[ItemDrop["BOX"] = 1] = "BOX";
    ItemDrop[ItemDrop["TREE"] = 2] = "TREE";
    ItemDrop[ItemDrop["STRATUM"] = 4] = "STRATUM";
    ItemDrop[ItemDrop["LAKE"] = 8] = "LAKE";
    ItemDrop[ItemDrop["FISHING"] = 16] = "FISHING";
})(ItemDrop || (ItemDrop = {}));
// export const ItemDrop = {
//     get NO()  {return 0;},
//     get BOX() {return 1 << 0;},
//     get TREE(){return 1 << 1;},
//     get DIG() {return 1 << 2;},
// }
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
    const itemHealHP = (target, value) => __awaiter(this, void 0, void 0, function* () {
        value = value | 0;
        Unit.healHP(target, value);
        Sound.KAIFUKU.play();
        if (SceneType.now === SceneType.BATTLE) {
            Util.msg.set(`${target.name}のHPが${value}回復した`, Color.GREEN.bright);
            yield wait();
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
                    if (target.dead) {
                        target.dead = false;
                        target.hp = 0;
                        Unit.healHP(target, 1);
                        if (SceneType.now === SceneType.BATTLE) {
                            Util.msg.set(`${target.name}は生き返った`);
                            yield wait();
                        }
                    }
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
    Item.霊水 = new class extends Item {
        constructor() {
            super({ uniqueName: "霊水", info: "HP+300",
                type: ItemType.HP回復, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 300); }),
            });
        }
    };
    Item.聖水 = new class extends Item {
        constructor() {
            super({ uniqueName: "聖水", info: "HP+400",
                type: ItemType.HP回復, rank: 8, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 400); }),
            });
        }
    };
    Item.ドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ドラッグ", info: "HP+5%",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.05 + 1); }),
            });
        }
    };
    Item.LAドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "LAドラッグ", info: "HP+10%",
                type: ItemType.HP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.10 + 1); }),
            });
        }
    };
    Item.ロシアドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ロシアドラッグ", info: "HP+15%",
                type: ItemType.HP回復, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.15 + 1); }),
            });
        }
    };
    Item.ビタミンドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグ", info: "HP+20%",
                type: ItemType.HP回復, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.20 + 1); }),
            });
        }
    };
    Item.高ビタミンドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "高ビタミンドラッグ", info: "HP+25%",
                type: ItemType.HP回復, rank: 4, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.25 + 1); }),
            });
        }
    };
    Item.濃密ビタミンドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "濃密ビタミンドラッグ", info: "HP+30%",
                type: ItemType.HP回復, rank: 5, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.30 + 1); }),
            });
        }
    };
    Item.ビタミンドラッグA = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグA", info: "HP+35%",
                type: ItemType.HP回復, rank: 6, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.35 + 1); }),
            });
        }
    };
    Item.ビタミンドラッグFINAL = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグFINAL", info: "HP+40%",
                type: ItemType.HP回復, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.40 + 1); }),
            });
        }
    };
    Item.シェイクスピア分子 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子", info: "全員のHP+30",
                type: ItemType.HP回復, rank: 3, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 30); }),
            });
        }
    };
    Item.シェイクスピア分子1 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子+1", info: "全員のHP+50",
                type: ItemType.HP回復, rank: 4, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 50); }),
            });
        }
    };
    Item.シェイクスピア分子2 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子+2", info: "全員のHP+100",
                type: ItemType.HP回復, rank: 5, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 100); }),
            });
        }
    };
    Item.シェイクスピア分子3 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子+3", info: "全員のHP+130",
                type: ItemType.HP回復, rank: 6, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 130); }),
            });
        }
    };
    Item.シェイクスピア分子4 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子+4", info: "全員のHP+150",
                type: ItemType.HP回復, rank: 7, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 150); }),
            });
        }
    };
    Item.シェイクスピア分子5 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子+5", info: "全員のHP+200",
                type: ItemType.HP回復, rank: 8, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 200); }),
            });
        }
    };
    Item.シェイクスピア分子6 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子+6", info: "全員のHP+300",
                type: ItemType.HP回復, rank: 9, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 300); }),
            });
        }
    };
    Item.シェイクスピア分子7 = new class extends Item {
        constructor() {
            super({ uniqueName: "シェイクスピア分子+7", info: "全員のHP+500",
                type: ItemType.HP回復, rank: 10, drop: ItemDrop.BOX, targetings: Targeting.FRIEND_ONLY | Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealHP(target, 500); }),
            });
        }
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
            super({ uniqueName: "赤い水", info: "MP+5",
                type: ItemType.MP回復, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield itemHealMP(target, 5); }),
            });
        }
    };
    //-----------------------------------------------------------------
    //
    //状態
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
    Item.火の尻尾 = new class extends Item {
        constructor() {
            super({ uniqueName: "火の尻尾", info: "一体を＜練＞状態にする",
                type: ItemType.状態, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return Unit.setCondition(target, Condition.練, 1); }),
            });
        }
    };
    Item.燃える髪 = new class extends Item {
        constructor() {
            super({ uniqueName: "燃える髪", info: "一体を＜練2＞状態にする",
                type: ItemType.状態, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return Unit.setCondition(target, Condition.練, 2); }),
            });
        }
    };
    Item.赤き髪の目 = new class extends Item {
        constructor() {
            super({ uniqueName: "赤き髪の目", info: "一体を＜練3＞状態にする",
                type: ItemType.状態, rank: 5, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return Unit.setCondition(target, Condition.練, 3); }),
            });
        }
    };
    Item.ジルの血 = new class extends Item {
        constructor() {
            super({ uniqueName: "ジルの血", info: "一体を＜練4＞状態にする",
                type: ItemType.状態, rank: 7, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return Unit.setCondition(target, Condition.練, 4); }),
            });
        }
    };
    //-----------------------------------------------------------------
    //
    //ダメージ
    //
    //-----------------------------------------------------------------
    Item.呪素 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪素", info: "戦闘時、10ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield target.doDmg(new Dmg({ absPow: 10 })); }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.呪 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪", info: "戦闘時、50ダメージを与える",
                type: ItemType.ダメージ, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield target.doDmg(new Dmg({ absPow: 50 })); }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.呪詛 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪詛", info: "戦闘時、150ダメージを与える",
                type: ItemType.ダメージ, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield target.doDmg(new Dmg({ absPow: 150 })); }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.鬼火 = new class extends Item {
        constructor() {
            super({ uniqueName: "鬼火", info: "戦闘時、敵全体に10ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield target.doDmg(new Dmg({ absPow: 10 })); }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.ウィルスα = new class extends Item {
        constructor() {
            super({ uniqueName: "ウィルスα", info: "戦闘時、敵全体に25ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield target.doDmg(new Dmg({ absPow: 25 })); }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.手榴弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "手榴弾", info: "戦闘時、敵全体に100ダメージを与える",
                type: ItemType.ダメージ, rank: 1, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () { return yield target.doDmg(new Dmg({ absPow: 100 })); }),
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
            super({ uniqueName: "動かない映写機", info: "ダンジョン内で使用するとセーブできる",
                type: ItemType.ダンジョン, rank: 10, drop: ItemDrop.NO,
                consumable: true,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    //-------------------------
                    //この関数の後に使用回数が減らされるため、このままセーブするとロード時に回数が減っていないままになる。
                    //なのでremainingUseNumを--してセーブし、セーブ後に++する。
                    this.remainingUseNum--;
                    SaveData.save();
                    this.remainingUseNum++;
                    //-------------------------
                    FX_Str(Font.def, `セーブしました`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.DUNGEON; }
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
            super({ uniqueName: "侍プリッツ・迅速", info: "10AU進む",
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
    };
    Item.侍プリッツ神速一歩手前 = new class extends Item {
        constructor() {
            super({ uniqueName: "侍プリッツ・神速一歩手前", info: "20AU進む",
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
    };
    Item.侍プリッツ神速 = new class extends Item {
        constructor() {
            super({ uniqueName: "侍プリッツ・神速", info: "30AU進む",
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
    };
    //-----------------------------------------------------------------
    //
    //弾
    //
    //-----------------------------------------------------------------
    // export const                         散弾:Item = new class extends Item{
    //     constructor(){super({uniqueName:"散弾", info:"ショットガンに使用",
    //                             type:ItemType.弾, rank:3, drop:ItemDrop.BOX})}
    // };
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
    Item.灰色のまぼろし = new class extends Item {
        constructor() {
            super({ uniqueName: "灰色のまぼろし", info: "対象の経験値+10",
                type: ItemType.ドーピング, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.exp.play();
                    target.exp += 20;
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
    Item.黒色のまぼろし = new class extends Item {
        constructor() {
            super({ uniqueName: "黒色のまぼろし", info: "対象の経験値+40",
                type: ItemType.ドーピング, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Sound.exp.play();
                    target.exp += 40;
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
    Item.アーク素子 = new class extends Item {
        constructor() {
            super({ uniqueName: "アーク素子", info: "",
                type: ItemType.ドーピング, rank: 1, drop: ItemDrop.BOX,
            });
        }
    };
    //-----------------------------------------------------------------
    //
    //書
    //
    //-----------------------------------------------------------------
    // const createAddTecNumBook = (uniqueName:string, tecNum:number)=>{
    //     return new class extends Item{
    //         constructor(){super({uniqueName:uniqueName, info:`技のセット可能数を${tecNum}に増やす`,
    //                                 type:ItemType.書, rank:10, drop:ItemDrop.NO,
    //                                 use:async(user,target)=>{
    //                                     target.tecs.push( Tec.empty );
    //                                     FX_Str(Font.def, `${target.name}の技セット可能数が${tecNum}になった`, Point.CENTER, Color.WHITE);
    //                                 },
    //         })}
    //         canUse(user:Unit, targets:Unit[]){
    //             for(const u of targets){
    //                 if(!(u instanceof PUnit && u.tecs.length === tecNum-1) ){return false;}
    //             }
    //             return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;
    //         }
    //     };
    // };
    // export const                         兵法指南の書:Item = 
    //                 createAddTecNumBook("兵法指南の書", 6);
    // export const                         五輪の書:Item = 
    //                 createAddTecNumBook("五輪の書", 7);
    // export const                         天地創造の書:Item = 
    //                 createAddTecNumBook("天地創造の書", 8);
    //-----------------------------------------------------------------
    //
    //メモ
    //
    //-----------------------------------------------------------------
    Item.消耗品のメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "消耗品のメモ", info: "一部の消耗品はダンジョンに入る度に補充される",
                type: ItemType.メモ, rank: 0, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.セーブのメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "セーブのメモ", info: "このゲームに自動セーブの機能はないらしい...",
                type: ItemType.メモ, rank: 0, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.夏のメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "夏のメモ", info: "夏はいつ終わるの？",
                type: ItemType.メモ, rank: 1, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.ジスカルドのメモ = new class extends Item {
        constructor() {
            super({ uniqueName: "ジスカルドのメモ", info: "じすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさん",
                type: ItemType.メモ, rank: 9, drop: ItemDrop.BOX, numLimit: 1 });
        }
    };
    Item.合成許可証 = new class extends Item {
        constructor() {
            super({ uniqueName: "合成許可証", info: "合成してもいいよ",
                type: ItemType.メモ, rank: 10, drop: ItemDrop.NO, numLimit: 1 });
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
    Item.つる = new class extends Item {
        constructor() {
            super({ uniqueName: "つる", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX });
        }
    };
    Item.退魔の十字架 = new class extends Item {
        constructor() {
            super({ uniqueName: "退魔の十字架", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX });
        }
    };
    Item.うんち = new class extends Item {
        constructor() {
            super({ uniqueName: "うんち", info: "",
                type: ItemType.素材, rank: 4, drop: ItemDrop.BOX });
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
    Item.エデン樹 = new class extends Item {
        constructor() {
            super({ uniqueName: "エデン樹", info: "エデンに生える細く長い木",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.TREE });
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
    Item.銅 = new class extends Item {
        constructor() {
            super({ uniqueName: "銅", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.鉄 = new class extends Item {
        constructor() {
            super({ uniqueName: "鉄", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.STRATUM });
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
    Item.オムナイト = new class extends Item {
        constructor() {
            super({ uniqueName: "オムナイト", info: "おおむかし うみに すんでいた こだい ポケモン。10ぽんの あしを くねらせて およぐ。",
                type: ItemType.素材, rank: 9, drop: ItemDrop.BOX | ItemDrop.STRATUM });
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
    Item.石溶け水 = new class extends Item {
        constructor() {
            super({ uniqueName: "石溶け水", info: "",
                type: ItemType.素材, rank: 3, drop: ItemDrop.BOX | ItemDrop.LAKE });
        }
    };
    Item.精霊の涙 = new class extends Item {
        constructor() {
            super({ uniqueName: "精霊の涙", info: "",
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
    // //-----------------------------------------------------------------
    // //
    // //FISHING
    // //
    // //-----------------------------------------------------------------
    // export const                         コイキング:Item = new class extends Item{
    //     constructor(){super({uniqueName:"コイキング", info:"",
    //                             type:ItemType.素材, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         かに:Item = new class extends Item{
    //     constructor(){super({uniqueName:"かに", info:"",
    //                             type:ItemType.素材, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         ルアー:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ルアー", info:"",
    //                             type:ItemType.素材, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         あむ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"あむ", info:"",
    //                             type:ItemType.素材, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         はねこ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"はねこ", info:"",
    //                             type:ItemType.素材, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         おじさん:Item = new class extends Item{
    //     constructor(){super({uniqueName:"おじさん", info:"",
    //                             type:ItemType.素材, rank:1, drop:ItemDrop.FISHING})}
    // };
    // export const                         緑亀:Item = new class extends Item{
    //     constructor(){super({uniqueName:"緑亀", info:"",
    //                             type:ItemType.素材, rank:1, drop:ItemDrop.FISHING})}
    // };
    // export const                         タイヤクラゲ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"タイヤクラゲ", info:"タイヤみたいなクラゲ。けっこう丈夫、食べるとお腹+4",
    //                             type:ItemType.素材, rank:1, drop:ItemDrop.FISHING})}
    // };
    // export const                         RANK2:Item = new class extends Item{
    //     constructor(){super({uniqueName:"RANK2", info:"",
    //                             type:ItemType.素材, rank:2, drop:ItemDrop.FISHING})}
    // };
    // export const                         ミソヅケ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ミソヅケ", info:"",
    //                             type:ItemType.素材, rank:2, drop:ItemDrop.FISHING})}
    // };
    // export const                         ブレインうさぎ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ブレインうさぎ", info:"",
    //                             type:ItemType.素材, rank:2, drop:ItemDrop.FISHING})}
    // };
    // export const                         魂のない子:Item = new class extends Item{
    //     constructor(){super({uniqueName:"魂のない子", info:"魂が宿っていない人造人間の子....食べるとお腹+28",
    //                             type:ItemType.素材, rank:3, drop:ItemDrop.FISHING})}
    // };
    // export const                         ウェーブコイラバタフラ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ウェーブコイラバタフラ", info:"宇宙がビックバンとビッククランチを繰り返す史中を超",
    //                             type:ItemType.素材, rank:3, drop:ItemDrop.FISHING})}
    // };
    // export const                         ウェーブコイラバタフライ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ウェーブコイラバタフライ", info:"宇宙がビックバンとビッククランチを繰り返す史中を超えて生き続ける超生物....食べるとお腹+26",
    //                             type:ItemType.素材, rank:4, drop:ItemDrop.FISHING})}
    // };
    // export const                         メモ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"メモ", info:"かつてアールエスというゲームで最強と言われたキャラクター",
    //                             type:ItemType.素材, rank:4, drop:ItemDrop.FISHING})}
    // };
    // export const                         MMMMM:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ＭＭＭＭＭ", info:"ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ",
    //                             type:ItemType.素材, rank:5, drop:ItemDrop.FISHING})}
    // };
    // export const                         ペガサス:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ペガサス", info:"奇妙な踊りを踊る馬",
    //                             type:ItemType.素材, rank:5, drop:ItemDrop.FISHING})}
    // };
    // export const                         ドラゴン:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ドラゴン", info:"VEGA",
    //                             type:ItemType.素材, rank:5, drop:ItemDrop.FISHING})}
    // };
    // export const                         ウェポン:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ウェポン", info:"",
    //                             type:ItemType.素材, rank:6, drop:ItemDrop.FISHING})}
    // };
    // export const                         一号:Item = new class extends Item{
    //     constructor(){super({uniqueName:"一号", info:"",
    //                             type:ItemType.素材, rank:6, drop:ItemDrop.FISHING})}
    // };
    // export const                         零号:Item = new class extends Item{
    //     constructor(){super({uniqueName:"零号", info:"",
    //                             type:ItemType.素材, rank:6, drop:ItemDrop.FISHING})}
    // };
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
})(Item || (Item = {}));
