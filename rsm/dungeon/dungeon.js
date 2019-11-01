var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DungeonEvent } from "./dungeonevent.js";
import { Color } from "../undym/type.js";
import { Job } from "../job.js";
import { Unit, Prm } from "../unit.js";
import { Item } from "../item.js";
import { Eq } from "../eq.js";
import { Util } from "../util.js";
import { cwait, wait } from "../undym/scene.js";
import { choice } from "../undym/random.js";
import { Img } from "../graphics/graphics.js";
import { Story } from "../story.js";
export class Dungeon {
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    // private constructor(name:string, protected rank:number, protected enemyLv:number, protected au:number){
    constructor(args) {
        this.args = args;
        //-----------------------------------------------------------------
        //
        //
        //
        //-----------------------------------------------------------------
        this.treasureKey = 0;
        this.dungeonClearCount = 0;
        this.exKillCount = 0;
        Dungeon._values.push(this);
        if (Dungeon._valueOf.has(this.uniqueName)) {
            console.log(`Dungeon already has uniqueName "${this.uniqueName}".`);
        }
        else {
            Dungeon._valueOf.set(this.uniqueName, this);
        }
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) { return this._valueOf.get(uniqueName); }
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    get uniqueName() { return this.args.uniqueName; }
    get rank() { return this.args.rank; }
    /** クリア回数による補正をかけていないもの。*/
    get originalEnemyLv() { return this.args.enemyLv; }
    /**クリア回数の補正をかけたもの。 */
    get enemyLv() {
        const _clearCount = this.dungeonClearCount < 20 ? this.dungeonClearCount : 20;
        const res = this.args.enemyLv * (1 + _clearCount * 0.05) + _clearCount / 2;
        return res | 0;
    }
    get au() { return this.args.au; }
    get treasures() { return this.args.treasures(); }
    rndTreasure() {
        if (this.treasures.length === 0) {
            return undefined;
        }
        return choice(this.treasures);
    }
    /**Exエネミーを倒した時に入手。 */
    get exItems() { return this.args.exItems(); }
    get trendItems() { return this.args.trendItems(); }
    toString() { return this.args.uniqueName; }
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    rndEvent() {
        if (Math.random() < 0.002) {
            if (this.treasureKey === 0) {
                if (Math.random() < 0.8) {
                    return DungeonEvent.GET_TREASURE_KEY;
                }
                else {
                    return DungeonEvent.TREASURE;
                }
            }
            else {
                if (Math.random() < 0.8) {
                    return DungeonEvent.TREASURE;
                }
                else {
                    return DungeonEvent.GET_TREASURE_KEY;
                }
            }
        }
        if (Dungeon.now.dungeonClearCount > 0 && Math.random() < 0.001) {
            return DungeonEvent.EX_BATTLE;
        }
        if (Math.random() < 0.15) {
            return DungeonEvent.BOX;
        }
        if (Math.random() < 0.15) {
            return DungeonEvent.BATTLE;
        }
        if (Math.random() < 0.04) {
            return DungeonEvent.TRAP;
        }
        if (this.rank >= 1 && Math.random() < 0.01) {
            return DungeonEvent.TREE;
        }
        if (this.rank >= 2 && Math.random() < 0.01) {
            return DungeonEvent.STRATUM;
        }
        if (this.rank >= 3 && Math.random() < 0.01) {
            return DungeonEvent.LAKE;
        }
        //(10 + rank * 1) / (10 + rank * 6)
        //[rank = 0,  1 / 1] [rank = 1,  11 / 16] [rank = 5,  15 / 40] [rank = 10, 20 / 70 = 2 / 7]
        if (Math.random() < 0.02 * (10 + this.rank) / (10 + this.rank * 6)) {
            return DungeonEvent.REST;
        }
        return DungeonEvent.empty;
    }
    rndEnemyNum() {
        const prob = 1.0 - (this.rank + 4) / (this.rank * this.rank + 5);
        let num = 0;
        for (let i = 0; i < Unit.enemies.length; i++) {
            if (Math.random() <= prob) {
                num++;
            }
        }
        return num === 0 ? 1 : num;
    }
    setEnemy(num = -1) {
        if (num === -1) {
            num = this.rndEnemyNum();
        }
        for (let i = 0; i < num; i++) {
            const e = Unit.enemies[i];
            this.setEnemyInner(e);
            e.name += String.fromCharCode("A".charCodeAt(0) + i);
        }
    }
    setEnemyInner(e) {
        Job.rndSetEnemy(e, (Math.random() * 0.5 + 0.75) * this.enemyLv);
    }
    setBoss() {
        this.setEnemy(Unit.enemies.length);
        for (const e of Unit.enemies) {
            e.prm(Prm.MAX_HP).base *= 3;
            e.ep = Unit.DEF_MAX_EP;
        }
        this.setBossInner();
        for (let e of Unit.enemies) {
            e.hp = e.prm(Prm.MAX_HP).total;
        }
    }
    setEx() {
        for (const e of Unit.enemies) {
            const _killCount = this.exKillCount < 10 ? this.exKillCount : 10;
            const lv = this.originalEnemyLv * (1 + _killCount * 0.1);
            const job = Job.rndJob(lv);
            job.setEnemy(e, lv);
            e.prm(Prm.MAX_HP).base *= 3;
            e.ep = Unit.DEF_MAX_EP;
        }
        this.setExInner();
        for (let e of Unit.enemies) {
            e.hp = e.prm(Prm.MAX_HP).total;
        }
    }
    dungeonClearEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dungeonClearCount <= 100 && this.dungeonClearCount % 10 === 0) {
                Util.msg.set(`[${this}]を${this.dungeonClearCount}回踏破！`);
                yield cwait();
                const value = (1 + this.dungeonClearCount / 10) | 0;
                Item.ささやかな贈り物.add(value);
                yield wait();
            }
        });
    }
}
Dungeon._values = [];
Dungeon._valueOf = new Map();
Dungeon.auNow = 0;
(function (Dungeon) {
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    Dungeon.再構成トンネル = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "再構成トンネル",
                rank: 0, enemyLv: 1, au: 50,
                treasures: () => [Eq.安全靴],
                exItems: () => [Eq.アカデミーバッヂ],
                trendItems: () => [Item.石, Item.砂],
            });
            this.isVisible = () => true;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "自我";
                e.prm(Prm.MAX_HP).base = 30;
                e.prm(Prm.STR).base = 3;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.毒使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "チョコチョコ";
                e.img = BossImg.choco;
                e.prm(Prm.MAX_HP).base = 30;
                e.prm(Prm.STR).base = 5;
                e.prm(Prm.MAG).base = 5;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story.MAIN_1.run();
                }
                if (Item.脱出ポッド.totalGetCount === 0) {
                    Item.脱出ポッド.add(1);
                    yield wait();
                    Util.msg.set("[お店]が出現した", Color.PINK.bright);
                    yield cwait();
                }
            });
        }
    };
    Dungeon.見知らぬ海岸 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "見知らぬ海岸",
                rank: 0, enemyLv: 3, au: 60,
                treasures: () => [Eq.銅板],
                exItems: () => [Eq.草の服],
                trendItems: () => [Item.草, Item.水],
            });
            this.isVisible = () => Dungeon.再構成トンネル.dungeonClearCount > 0;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "危険な光線";
                e.prm(Prm.MAX_HP).base = 40;
                e.prm(Prm.STR).base = 5;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.鎖使い.setEnemy(e, 5);
                e.name = "アイアンチョコチョコ";
                e.img = BossImg.choco;
                e.prm(Prm.MAX_HP).base = 50;
                e.prm(Prm.STR).base = 5;
                e.prm(Prm.MAG).base = 5;
                e.prm(Prm.CHN).base = 5;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story.MAIN_2.run();
                }
            });
        }
    };
    Dungeon.はじまりの丘 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "はじまりの丘",
                rank: 1, enemyLv: 7, au: 100,
                treasures: () => [Eq.オールマント],
                exItems: () => [Eq.ライダーベルト],
                trendItems: () => [Item.肉, Item.原木],
            });
            this.isVisible = () => Dungeon.見知らぬ海岸.dungeonClearCount > 0;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "導びく者";
                e.prm(Prm.MAX_HP).base = 80;
                e.prm(Prm.STR).base = 10;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, 5);
                e.name = "亡霊ドロシー";
                e.prm(Prm.MAX_HP).base = 120;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story.MAIN_3.run();
                }
            });
        }
    };
    Dungeon.予感の街レ = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "予感の街・レ",
                rank: 0, enemyLv: 11, au: 70,
                treasures: () => [Eq.ミルテの棍],
                exItems: () => [Eq.いばらの鎧],
                trendItems: () => [Item.水],
            });
            this.isVisible = () => Dungeon.はじまりの丘.dungeonClearCount > 0;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.魔法使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "レ町長";
                e.prm(Prm.MAX_HP).base = 80;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, 5);
                e.name = "幻影リリア";
                e.prm(Prm.MAX_HP).base = 120;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story.MAIN_4.run();
                }
            });
        }
    };
})(Dungeon || (Dungeon = {}));
var BossImg;
(function (BossImg) {
    BossImg.choco = new Img("img/choco.png");
})(BossImg || (BossImg = {}));
