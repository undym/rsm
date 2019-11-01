var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
ItemType.植物 = new ItemType("植物");
ItemType.土 = new ItemType("土");
ItemType.水 = new ItemType("水");
ItemType.魚 = new ItemType("魚");
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
ItemParentType.状態 = new ItemParentType("戦闘", [ItemType.状態]);
ItemParentType.ダンジョン = new ItemParentType("ダンジョン", [ItemType.ダンジョン, ItemType.弾, ItemType.鍵]);
ItemParentType.戦闘 = new ItemParentType("戦闘", [ItemType.ダメージ]);
ItemParentType.強化 = new ItemParentType("強化", [ItemType.ドーピング, ItemType.書]);
ItemParentType.その他 = new ItemParentType("その他", [
    ItemType.メモ, ItemType.素材, ItemType.固有素材,
    ItemType.植物, ItemType.土, ItemType.水,
    ItemType.魚,
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
    static fluctuateRank(baseRank, rankFluctuatePassProb = 0.4) {
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
        if (SceneType.now === SceneType.BATTLE) {
            Util.msg.set(`${target.name}のHPが${value}回復した`, Color.GREEN.bright);
            yield wait();
        }
    });
    const itemHealMP = (target, value) => __awaiter(this, void 0, void 0, function* () {
        value = value | 0;
        Unit.healMP(target, value);
        if (SceneType.now === SceneType.BATTLE) {
            Util.msg.set(`${target.name}のMPが${value}回復した`, Color.GREEN.bright);
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
    Item.ドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ドラッグ", info: "HP+5%",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.05 + 1);
                }),
            });
        }
    };
    Item.LAドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "LAドラッグ", info: "HP+10%",
                type: ItemType.HP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.10 + 1);
                }),
            });
        }
    };
    Item.ロシアドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ロシアドラッグ", info: "HP+15%",
                type: ItemType.HP回復, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.15 + 1);
                }),
            });
        }
    };
    Item.ビタミンドラッグ = new class extends Item {
        constructor() {
            super({ uniqueName: "ビタミンドラッグ", info: "HP+20%",
                type: ItemType.HP回復, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.20 + 1);
                }),
            });
        }
    };
    Item.スティック = new class extends Item {
        constructor() {
            super({ uniqueName: "スティック", info: "HP+5",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 5);
                }),
            });
        }
    };
    Item.スティックパ = new class extends Item {
        constructor() {
            super({ uniqueName: "スティックパ", info: "HP+10",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 10);
                }),
            });
        }
    };
    Item.スティックパン = new class extends Item {
        constructor() {
            super({ uniqueName: "スティックパン", info: "HP+20",
                type: ItemType.HP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 20);
                }),
            });
        }
    };
    Item.ダブルスティックパン = new class extends Item {
        constructor() {
            super({ uniqueName: "ダブルスティックパン", info: "HP+30",
                type: ItemType.HP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, 30);
                }),
            });
        }
    };
    Item.硬化スティックパン = new class extends Item {
        constructor() {
            super({ uniqueName: "硬化スティックパン", info: "HP+50",
                type: ItemType.HP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealHP(target, target.prm(Prm.MAX_HP).total * 0.05 + 50);
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
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealMP(target, 1);
                }),
            });
        }
    };
    Item.赤葉草 = new class extends Item {
        constructor() {
            super({ uniqueName: "赤葉草", info: "MP+2",
                type: ItemType.MP回復, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealMP(target, 2);
                }),
            });
        }
    };
    Item.蛍草のエキス = new class extends Item {
        constructor() {
            super({ uniqueName: "蛍草のエキス", info: "MP+3",
                type: ItemType.MP回復, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealMP(target, 3);
                }),
            });
        }
    };
    Item.赤い水 = new class extends Item {
        constructor() {
            super({ uniqueName: "赤い水", info: "MP+5",
                type: ItemType.MP回復, rank: 3, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield itemHealMP(target, 5);
                }),
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
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.clearCondition(Condition.毒);
                }),
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
            super({ uniqueName: "呪素", info: "戦闘時、1ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield target.doDmg(new Dmg({ absPow: 1 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.呪 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪", info: "戦闘時、5ダメージを与える",
                type: ItemType.ダメージ, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield target.doDmg(new Dmg({ absPow: 5 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.呪詛 = new class extends Item {
        constructor() {
            super({ uniqueName: "呪詛", info: "戦闘時、10ダメージを与える",
                type: ItemType.ダメージ, rank: 2, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield target.doDmg(new Dmg({ absPow: 10 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.鬼火 = new class extends Item {
        constructor() {
            super({ uniqueName: "鬼火", info: "戦闘時、敵全体に1ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield target.doDmg(new Dmg({ absPow: 1 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.ウィルスα = new class extends Item {
        constructor() {
            super({ uniqueName: "ウィルスα", info: "戦闘時、敵全体に3ダメージを与える",
                type: ItemType.ダメージ, rank: 0, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield target.doDmg(new Dmg({ absPow: 3 }));
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now === SceneType.BATTLE; }
    };
    Item.手榴弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "手榴弾", info: "戦闘時、敵全体に10ダメージを与える",
                type: ItemType.ダメージ, rank: 3, drop: ItemDrop.BOX, targetings: Targeting.ALL,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    yield target.doDmg(new Dmg({ absPow: 10 }));
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
            super({ uniqueName: "動かない映写機", info: "ダンジョン内で使用するとセーブできる",
                type: ItemType.ダンジョン, rank: 10,
                consumable: true, drop: ItemDrop.NO,
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
                type: ItemType.ダンジョン, rank: 10,
                consumable: true, drop: ItemDrop.NO,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    Scene.load(DungeonScene.ins);
                    yield DungeonEvent.ESCAPE_DUNGEON.happen();
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
    Item.散弾 = new class extends Item {
        constructor() {
            super({ uniqueName: "散弾", info: "ショットガンに使用",
                type: ItemType.弾, rank: 3, drop: ItemDrop.BOX });
        }
    };
    Item.夜叉の矢 = new class extends Item {
        constructor() {
            super({ uniqueName: "夜叉の矢", info: "ヤクシャに使用",
                type: ItemType.弾, rank: 3, drop: ItemDrop.BOX });
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
                    FX_Str(Font.def, `${target.name}のBP+1`, Point.CENTER, Color.WHITE);
                }),
            });
        }
        canUse(user, targets) { return super.canUse(user, targets) && SceneType.now !== SceneType.BATTLE; }
    };
    Item.灰色のまぼろし = new class extends Item {
        constructor() {
            super({ uniqueName: "灰色のまぼろし", info: "対象の経験値+10。レベルアップはしない。",
                type: ItemType.ドーピング, rank: 0, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
                    target.exp += 10;
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
            super({ uniqueName: "黒色のまぼろし", info: "対象の経験値+20。レベルアップはしない。",
                type: ItemType.ドーピング, rank: 1, drop: ItemDrop.BOX,
                use: (user, target) => __awaiter(this, void 0, void 0, function* () {
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
    // export const                         技習得許可証:Item = new class extends Item{
    //     constructor(){super({uniqueName:"技習得許可証", info:"技のセットが解放される", 
    //                             type:ItemType.メモ, rank:10, drop:ItemDrop.NO, numLimit:1})}
    // };
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
    //素材BoxRank0
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
    Item.砂 = new class extends Item {
        constructor() {
            super({ uniqueName: "砂", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.原木 = new class extends Item {
        constructor() {
            super({ uniqueName: "原木", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.草 = new class extends Item {
        constructor() {
            super({ uniqueName: "草", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.水 = new class extends Item {
        constructor() {
            super({ uniqueName: "水", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    Item.肉 = new class extends Item {
        constructor() {
            super({ uniqueName: "肉", info: "",
                type: ItemType.素材, rank: 0, drop: ItemDrop.BOX });
        }
    };
    //-----------------------------------------------------------------
    //
    //素材BoxRank1
    //
    //-----------------------------------------------------------------
    Item.銅 = new class extends Item {
        constructor() {
            super({ uniqueName: "銅", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.土 = new class extends Item {
        constructor() {
            super({ uniqueName: "土", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    Item.杉 = new class extends Item {
        constructor() {
            super({ uniqueName: "杉", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.TREE });
        }
    };
    Item.ヒノキ = new class extends Item {
        constructor() {
            super({ uniqueName: "ヒノキ", info: "",
                type: ItemType.素材, rank: 1, drop: ItemDrop.BOX | ItemDrop.TREE });
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
    // export const                         消えない炎:Item = new class extends Item{
    //     constructor(){super({uniqueName:"消えない炎", info:"たまに消える",
    //                             type:ItemType.素材, rank:1, drop:ItemDrop.BOX})}
    // };
    //-----------------------------------------------------------------
    //
    //素材BoxRank2
    //
    //-----------------------------------------------------------------
    Item.粘土 = new class extends Item {
        constructor() {
            super({ uniqueName: "粘土", info: "",
                type: ItemType.素材, rank: 2, drop: ItemDrop.BOX | ItemDrop.STRATUM });
        }
    };
    // export const                         He:Item = new class extends Item{
    //     constructor(){super({uniqueName:"He", info:"",
    //                             type:ItemType.素材, rank:2, drop:ItemDrop.BOX})}
    // };
    // export const                         Li:Item = new class extends Item{
    //     constructor(){super({uniqueName:"Li", info:"",
    //                             type:ItemType.素材, rank:2, drop:ItemDrop.BOX})}
    // };
    // export const                         黒い枝:Item = new class extends Item{
    //     constructor(){super({uniqueName:"黒い枝", info:"とても黒い！！！！！",
    //                             type:ItemType.素材, rank:2, drop:ItemDrop.BOX})}
    // };
    // export const                         黒い青空:Item = new class extends Item{
    //     constructor(){super({uniqueName:"黒い青空", info:"",
    //                             type:ItemType.素材, rank:2, drop:ItemDrop.BOX})}
    // };
    // //-----------------------------------------------------------------
    // //
    // //素材BoxRank3
    // //
    // //-----------------------------------------------------------------
    // export const                         鋼鉄:Item = new class extends Item{
    //     constructor(){super({uniqueName:"鋼鉄", info:"とてもかたい",
    //                             type:ItemType.素材, rank:3, drop:ItemDrop.BOX})}
    // };
    // export const                         おにく:Item = new class extends Item{
    //     constructor(){super({uniqueName:"おにく", info:"",
    //                             type:ItemType.素材, rank:3, drop:ItemDrop.BOX})}
    // };
    // //-----------------------------------------------------------------
    // //
    // //素材BoxRank4
    // //
    // //-----------------------------------------------------------------
    // export const                         チタン:Item = new class extends Item{
    //     constructor(){super({uniqueName:"チタン", info:"",
    //                             type:ItemType.素材, rank:4, drop:ItemDrop.BOX})}
    // };
    // //-----------------------------------------------------------------
    // //
    // //固有素材
    // //
    // //-----------------------------------------------------------------
    // export const                         はじまりの丘チール:Item = new class extends Item{
    //     constructor(){super({uniqueName:"はじまりの丘チール", info:"はじまりの丘をクリアするともらえる記念チール", 
    //                             type:ItemType.固有素材, rank:10, drop:ItemDrop.NO,})}
    // };
    // export const                         リテの門チール:Item = new class extends Item{
    //     constructor(){super({uniqueName:"リ・テの門チール", info:"リテの門をクリアするともらえる記念チール", 
    //                             type:ItemType.固有素材, rank:10, drop:ItemDrop.NO,})}
    // };
    // export const                         マーザンの鱗:Item = new class extends Item{
    //     constructor(){super({uniqueName:"マーザンの鱗", info:"なんやーーーーー！！！", 
    //                             type:ItemType.固有素材, rank:10, drop:ItemDrop.NO,})}
    // };
    // //-----------------------------------------------------------------
    // //
    // //合成素材
    // //
    // //-----------------------------------------------------------------
    // export const                         布:Item = new class extends Item{
    //     constructor(){super({uniqueName:"布", info:"",
    //                             type:ItemType.合成素材, rank:4, drop:ItemDrop.NO})}
    // };
    // //-----------------------------------------------------------------
    // //
    // //木
    // //
    // //-----------------------------------------------------------------
    // export const                         枝:Item = new class extends Item{
    //     constructor(){super({uniqueName:"枝", info:"",
    //                             type:ItemType.植物, rank:0, drop:ItemDrop.BOX | ItemDrop.TREE})}
    // };
    // export const                         葉っぱ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"葉っぱ", info:"",
    //                             type:ItemType.植物, rank:0, drop:ItemDrop.BOX | ItemDrop.TREE})}
    // };
    // export const                         竹:Item = new class extends Item{
    //     constructor(){super({uniqueName:"竹", info:"",
    //                             type:ItemType.植物, rank:0, drop:ItemDrop.TREE})}
    // };
    // export const                         松:Item = new class extends Item{
    //     constructor(){super({uniqueName:"松", info:"",
    //                             type:ItemType.植物, rank:0, drop:ItemDrop.TREE})}
    // };
    // export const                         スギ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"スギ", info:"",
    //                             type:ItemType.植物, rank:1, drop:ItemDrop.TREE})}
    // };
    // export const                         赤松:Item = new class extends Item{
    //     constructor(){super({uniqueName:"赤松", info:"",
    //                             type:ItemType.植物, rank:1, drop:ItemDrop.TREE})}
    // };
    // export const                         ヒノキ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ヒノキ", info:"",
    //                             type:ItemType.植物, rank:2, drop:ItemDrop.TREE})}
    // };
    // export const                         無法松:Item = new class extends Item{
    //     constructor(){super({uniqueName:"無法松", info:"通りすがりのたい焼き屋サン",
    //                             type:ItemType.植物, rank:8, drop:ItemDrop.TREE})}
    // };
    // //-----------------------------------------------------------------
    // //
    // //土
    // //
    // //-----------------------------------------------------------------
    // export const                         イズミミズ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"イズミミズ", info:"",
    //                             type:ItemType.土, rank:0, drop:ItemDrop.STRATUM})}
    // };
    // export const                         土:Item = new class extends Item{
    //     constructor(){super({uniqueName:"土", info:"",
    //                             type:ItemType.土, rank:0, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    // };
    // export const                         銅:Item = new class extends Item{
    //     constructor(){super({uniqueName:"銅", info:"",
    //                             type:ItemType.土, rank:1, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    // };
    // export const                         黒い石:Item = new class extends Item{
    //     constructor(){super({uniqueName:"黒い石", info:"",
    //                             type:ItemType.土, rank:2, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    // };
    // export const                         黒い砂:Item = new class extends Item{
    //     constructor(){super({uniqueName:"黒い砂", info:"",
    //                             type:ItemType.土, rank:2, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    // };
    // export const                         鉄:Item = new class extends Item{
    //     constructor(){super({uniqueName:"鉄", info:"かたい",
    //                             type:ItemType.土, rank:2, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    // };
    // export const                         オニキス:Item = new class extends Item{
    //     constructor(){super({uniqueName:"オニキス", info:"",
    //                             type:ItemType.土, rank:2, drop:ItemDrop.STRATUM})}
    // };
    // export const                         岩:Item = new class extends Item{
    //     constructor(){super({uniqueName:"岩", info:"",
    //                             type:ItemType.土, rank:3, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    // };
    // export const                         イズミジュエリー:Item = new class extends Item{
    //     constructor(){super({uniqueName:"イズミジュエリー", info:"",
    //                             type:ItemType.土, rank:3, drop:ItemDrop.STRATUM})}
    // };
    // export const                         クリスタル:Item = new class extends Item{
    //     constructor(){super({uniqueName:"クリスタル", info:"",
    //                             type:ItemType.土, rank:4, drop:ItemDrop.STRATUM})}
    // };
    // export const                         サファイア:Item = new class extends Item{
    //     constructor(){super({uniqueName:"サファイア", info:"",
    //                             type:ItemType.土, rank:4, drop:ItemDrop.STRATUM})}
    // };
    // export const                         血粉末:Item = new class extends Item{
    //     constructor(){super({uniqueName:"血粉末", info:"",
    //                             type:ItemType.土, rank:5, drop:ItemDrop.STRATUM})}
    // };
    // //-----------------------------------------------------------------
    // //
    // //水
    // //
    // //-----------------------------------------------------------------
    // export const                         水:Item = new class extends Item{
    //     constructor(){super({uniqueName:"水", info:"",
    //                             type:ItemType.水, rank:0, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    // };
    // export const                         血:Item = new class extends Item{
    //     constructor(){super({uniqueName:"血", info:"",
    //                             type:ItemType.水, rank:0, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    // };
    // export const                         ほぐし水:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ほぐし水", info:"",
    //                             type:ItemType.水, rank:1, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    // };
    // //-----------------------------------------------------------------
    // //
    // //魚
    // //
    // //-----------------------------------------------------------------
    // export const                         コイキング:Item = new class extends Item{
    //     constructor(){super({uniqueName:"コイキング", info:"",
    //                             type:ItemType.魚, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         かに:Item = new class extends Item{
    //     constructor(){super({uniqueName:"かに", info:"",
    //                             type:ItemType.魚, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         ルアー:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ルアー", info:"",
    //                             type:ItemType.魚, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         あむ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"あむ", info:"",
    //                             type:ItemType.魚, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         はねこ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"はねこ", info:"",
    //                             type:ItemType.魚, rank:0, drop:ItemDrop.FISHING})}
    // };
    // export const                         おじさん:Item = new class extends Item{
    //     constructor(){super({uniqueName:"おじさん", info:"",
    //                             type:ItemType.魚, rank:1, drop:ItemDrop.FISHING})}
    // };
    // export const                         緑亀:Item = new class extends Item{
    //     constructor(){super({uniqueName:"緑亀", info:"",
    //                             type:ItemType.魚, rank:1, drop:ItemDrop.FISHING})}
    // };
    // export const                         タイヤクラゲ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"タイヤクラゲ", info:"タイヤみたいなクラゲ。けっこう丈夫、食べるとお腹+4",
    //                             type:ItemType.魚, rank:1, drop:ItemDrop.FISHING})}
    // };
    // export const                         RANK2:Item = new class extends Item{
    //     constructor(){super({uniqueName:"RANK2", info:"",
    //                             type:ItemType.魚, rank:2, drop:ItemDrop.FISHING})}
    // };
    // export const                         ミソヅケ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ミソヅケ", info:"",
    //                             type:ItemType.魚, rank:2, drop:ItemDrop.FISHING})}
    // };
    // export const                         ブレインうさぎ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ブレインうさぎ", info:"",
    //                             type:ItemType.魚, rank:2, drop:ItemDrop.FISHING})}
    // };
    // export const                         魂のない子:Item = new class extends Item{
    //     constructor(){super({uniqueName:"魂のない子", info:"魂が宿っていない人造人間の子....食べるとお腹+28",
    //                             type:ItemType.魚, rank:3, drop:ItemDrop.FISHING})}
    // };
    // export const                         ウェーブコイラバタフラ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ウェーブコイラバタフラ", info:"宇宙がビックバンとビッククランチを繰り返す史中を超",
    //                             type:ItemType.魚, rank:3, drop:ItemDrop.FISHING})}
    // };
    // export const                         ウェーブコイラバタフライ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ウェーブコイラバタフライ", info:"宇宙がビックバンとビッククランチを繰り返す史中を超えて生き続ける超生物....食べるとお腹+26",
    //                             type:ItemType.魚, rank:4, drop:ItemDrop.FISHING})}
    // };
    // export const                         メモ:Item = new class extends Item{
    //     constructor(){super({uniqueName:"メモ", info:"かつてアールエスというゲームで最強と言われたキャラクター",
    //                             type:ItemType.魚, rank:4, drop:ItemDrop.FISHING})}
    // };
    // export const                         MMMMM:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ＭＭＭＭＭ", info:"ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ",
    //                             type:ItemType.魚, rank:5, drop:ItemDrop.FISHING})}
    // };
    // export const                         ペガサス:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ペガサス", info:"奇妙な踊りを踊る馬",
    //                             type:ItemType.魚, rank:5, drop:ItemDrop.FISHING})}
    // };
    // export const                         ドラゴン:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ドラゴン", info:"VEGA",
    //                             type:ItemType.魚, rank:5, drop:ItemDrop.FISHING})}
    // };
    // export const                         ウェポン:Item = new class extends Item{
    //     constructor(){super({uniqueName:"ウェポン", info:"",
    //                             type:ItemType.魚, rank:6, drop:ItemDrop.FISHING})}
    // };
    // export const                         一号:Item = new class extends Item{
    //     constructor(){super({uniqueName:"一号", info:"",
    //                             type:ItemType.魚, rank:6, drop:ItemDrop.FISHING})}
    // };
    // export const                         零号:Item = new class extends Item{
    //     constructor(){super({uniqueName:"零号", info:"",
    //                             type:ItemType.魚, rank:6, drop:ItemDrop.FISHING})}
    // };
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
})(Item || (Item = {}));
