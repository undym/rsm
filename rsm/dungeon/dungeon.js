var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DungeonEvent } from "./dungeonevent.js";
import { Rect, Color } from "../undym/type.js";
import { Job } from "../job.js";
import { Unit, Prm } from "../unit.js";
import { Tec } from "../tec.js";
import { Item } from "../item.js";
import { Eq } from "../eq.js";
import { Util, Flag } from "../util.js";
import { cwait, wait } from "../undym/scene.js";
import { Player } from "../player.js";
import { choice } from "../undym/random.js";
import { Img } from "../graphics/texture.js";
import { Story1 } from "../story/story1.js";
import { Story0 } from "../story/story0.js";
import { Sound, Music } from "../sound.js";
import { Story2 } from "../story/story2.js";
import { Pet } from "../pet.js";
import { Story3 } from "../story/story3.js";
export class DungeonArea {
    constructor(uniqueName, imgSrc, _areaMoveBtns, _areaItems) {
        this.uniqueName = uniqueName;
        this.imgSrc = imgSrc;
        this._areaMoveBtns = _areaMoveBtns;
        this._areaItems = _areaItems;
        DungeonArea._valueOf.set(uniqueName, this);
    }
    static valueOf(uniqueName) { return this._valueOf.get(uniqueName); }
    get img() { return this._img ? this._img : (this._img = new Img(this.imgSrc, { lazyLoad: false })); }
    get areaMoveBtns() {
        const res = [];
        for (const set of this._areaMoveBtns()) {
            res.push({ to: set[0], bounds: set[1], isVisible: set[2] });
        }
        return res;
    }
    get areaItems() {
        const res = [];
        for (const set of this._areaItems()) {
            res.push({ item: set[0], prob: set[1] });
        }
        return res;
    }
    toString() { return this.uniqueName; }
}
DungeonArea._valueOf = new Map();
(function (DungeonArea) {
    DungeonArea.中央島 = new DungeonArea("中央島", "img/map1.jpg", () => [
        [DungeonArea.黒地域, new Rect(0.7, 0.45, 0.3, 0.1), () => Dungeon.黒平原.isVisible()],
        [DungeonArea.古マーザン, new Rect(0.0, 0.4, 0.3, 0.1), () => Dungeon.古マーザン森.isVisible()],
    ], () => [
        [Item.肉まん, 0.001],
        [Item.地球塔粉末, 0.001],
    ]);
    DungeonArea.黒地域 = new DungeonArea("黒地域", "img/map2.jpg", () => [
        [DungeonArea.中央島, new Rect(0.0, 0.4, 0.3, 0.1), () => true],
    ], () => [
        [Item.タンホイザーの砂飯, 0.001],
        [Item.黒色火薬, 0.001],
        [Item.B火薬, 0.001],
    ]);
    DungeonArea.月 = new DungeonArea("月", "img/map4.jpg", () => [
    // [DungeonArea.中央島, new Rect(0.0, 0.4, 0.3, 0.1), ()=>true],
    ], () => [
        [Item.月の石, 0.001],
    ]);
    DungeonArea.古マーザン = new DungeonArea("古マーザン", "img/map3.jpg", () => [
        [DungeonArea.中央島, new Rect(0.7, 0.25, 0.3, 0.1), () => Dungeon.古マーザン森.isVisible()],
    ], () => [
        [Item.マーザン, 0.001],
    ]);
    DungeonArea.冥界 = new DungeonArea("冥界", "img/map5.jpg", () => [], () => [
        [Item.冥石, 0.001],
    ]);
})(DungeonArea || (DungeonArea = {}));
export class Dungeon {
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    /**trendEvents:通常rndDungeonEvent()の最後に実行される。 */
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
    get info() { return this.args.info; }
    get rank() { return this.args.rank; }
    /** クリア回数による補正をかけていないもの。*/
    get originalEnemyLv() { return this.args.enemyLv; }
    /**クリア回数の補正をかけたもの。 */
    get enemyLv() {
        const lim = 40;
        const _clearCount = this.dungeonClearCount < lim ? this.dungeonClearCount : lim;
        //クリア回数による敵のレベルの最大倍率。maxEnemyLvMul===2の場合なら、元のレベルの2倍(+_clearCount/2)まで出る。
        const maxEnemyLvMul = 2;
        const res = this.args.enemyLv * (1 + _clearCount / lim * (maxEnemyLvMul - 1)) + _clearCount / 2;
        return res | 0;
    }
    get au() { return this.args.au; }
    get area() { return this.args.btn[0]; }
    get btnBounds() { return this.args.btn[1]; }
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
    /**通常rndDungeonEvent()の最後に実行される。 */
    rndTrendEvents() {
        if (this.args.trendEvents) {
            for (const set of this.args.trendEvents()) {
                if (Math.random() < set[1]) {
                    return set[0];
                }
            }
        }
        return DungeonEvent.empty;
    }
    toString() { return this.args.uniqueName; }
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    musics(type) {
        return Music.getMusics(type);
    }
    /**ランダムな曲を流す. */
    playMusic(type) {
        Music.stop();
        Dungeon.musicCount = 0;
        const _musics = this.musics(type);
        if (_musics) {
            const m = choice(_musics);
            const pathSplit = m.path.split("/");
            const fileName = pathSplit.length > 0 ? pathSplit[pathSplit.length - 1] : "";
            Util.msg.set("|> " + fileName, Color.L_GRAY.bright);
            m.play({ loop: type !== "dungeon" }); //通常ダンジョン曲はループしない
        }
    }
    rndEvent() {
        if (++Dungeon.musicCount >= 200 && Math.random() < 0.002) {
            this.playMusic("dungeon");
        }
        for (const set of DungeonArea.now.areaItems) {
            if (Math.random() < set.prob) {
                const num = 1;
                Sound.rare.play();
                set.item.add(num);
            }
        }
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
        if (Dungeon.now.dungeonClearCount >= 1 && Math.random() < 0.001) {
            return DungeonEvent.EX_BATTLE;
        }
        if (Math.random() < 0.13) {
            if (Dungeon.now.rank >= 2 && Math.random() < 0.02) {
                if (Dungeon.now.rank >= 6 && Math.random() < 0.3) {
                    return DungeonEvent.KEY_BOX_RANK6;
                }
                if (Dungeon.now.rank >= 5 && Math.random() < 0.3) {
                    return DungeonEvent.KEY_BOX_RANK5;
                }
                if (Dungeon.now.rank >= 4 && Math.random() < 0.3) {
                    return DungeonEvent.KEY_BOX_RANK4;
                }
                if (Dungeon.now.rank >= 3 && Math.random() < 0.3) {
                    return DungeonEvent.KEY_BOX_RANK3;
                }
                return DungeonEvent.KEY_BOX_RANK2;
            }
            else {
                return DungeonEvent.BOX;
            }
        }
        if (Math.random() < 0.13) {
            return DungeonEvent.BATTLE;
        }
        if (Math.random() < 0.03) {
            return DungeonEvent.TRAP;
        }
        if (Math.random() < 0.03) {
            const collectingEvents = [];
            if (this.rank >= 1) {
                collectingEvents.push(DungeonEvent.TREE);
            }
            if (this.rank >= 1) {
                collectingEvents.push(DungeonEvent.STRATUM);
            }
            if (this.rank >= 2) {
                collectingEvents.push(DungeonEvent.LAKE);
            }
            if (this.rank >= 3) {
                collectingEvents.push(DungeonEvent.FOSSIL);
            }
            if (collectingEvents.length > 0) {
                return choice(collectingEvents);
            }
        }
        //(10 + rank * 1) / (10 + rank * 6)
        //[rank = 0,  1 / 1] [rank = 1,  11 / 16] [rank = 5,  15 / 40] [rank = 10, 20 / 70 = 2 / 7]
        if (Math.random() < 0.02 * (10 + this.rank) / (10 + this.rank * 6)) {
            return DungeonEvent.REST;
        }
        return this.rndTrendEvents();
    }
    rndJob() {
        const lv = this.enemyLv;
        for (let i = 0; i < 10; i++) {
            const tmp = choice(Job.values);
            if (tmp.appearLv <= lv) {
                if (tmp.beast && !this.args.beast) {
                    continue;
                }
                if (tmp.ghost && !this.args.ghost) {
                    continue;
                }
                return tmp;
            }
        }
        return Job.訓練生;
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
    setEnemy(num = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (num === 0) {
                num = this.rndEnemyNum();
            }
            for (let i = 0; i < num; i++) {
                const e = Unit.enemies[i];
                yield this.setEnemyInner(e);
                e.name += String.fromCharCode("A".charCodeAt(0) + i);
            }
        });
    }
    setEnemyInner(e) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rndJob().setEnemy(e, (Math.random() * 0.5 + 0.75) * this.enemyLv);
        });
    }
    setBoss() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setEnemy(Unit.enemies.length);
            for (const e of Unit.enemies) {
                e.prm(Prm.MAX_HP).base *= 3;
                e.ep = Unit.DEF_MAX_EP;
            }
            this.setBossInner();
            for (let e of Unit.enemies) {
                yield e.equip();
                e.hp = e.prm(Prm.MAX_HP).total;
            }
        });
    }
    setEx() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const e of Unit.enemies) {
                const _killCount = this.exKillCount < 10 ? this.exKillCount : 10;
                const lv = this.originalEnemyLv * (1 + _killCount * 0.1);
                const job = this.rndJob();
                job.setEnemy(e, lv);
                e.prm(Prm.MAX_HP).base *= 3;
                e.ep = Unit.DEF_MAX_EP;
            }
            this.setExInner();
            for (let e of Unit.enemies) {
                yield e.equip();
                e.hp = e.prm(Prm.MAX_HP).total;
            }
        });
    }
    dungeonClearEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dungeonClearCount <= 100 && this.dungeonClearCount % 10 === 0) {
                Util.msg.set(`[${this}]を${this.dungeonClearCount}回踏破！`);
                yield cwait();
                Sound.rare.play();
                const value = 4 + (this.dungeonClearCount / 10) | 0;
                Item.ささやかな贈り物.add(value);
                yield wait();
            }
        });
    }
}
Dungeon._values = [];
Dungeon._valueOf = new Map();
Dungeon.auNow = 0;
/**前回playMusic()をしてからrndEvent()を呼び出した回数。 */
Dungeon.musicCount = 0;
(function (Dungeon) {
    ///////////////////////////////////////////////////////////////////////
    //                                                                   //
    //                            中央島                                 //
    //                                                                   //
    ///////////////////////////////////////////////////////////////////////
    Dungeon.再構成トンネル = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "再構成トンネル", info: "",
                rank: 0, enemyLv: 1, au: 50, btn: [DungeonArea.中央島, new Rect(0, 0.2, 0.3, 0.1)],
                treasures: () => [Eq.安全靴],
                exItems: () => [Eq.アカデミーバッヂ],
                trendItems: () => [Item.石, Item.杉, Item.ヒノキ, Item.竹, Item.草],
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
                e.img = new Img("img/unit/ex_choco.png");
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
                    yield Story0.runMain1();
                }
                if (Item.脱出ポッド.totalGetCount === 0) {
                    Sound.rare.play();
                    Item.脱出ポッド.add(1);
                    yield cwait();
                    Sound.bpup.play();
                    Util.msg.set("[お店]が出現した", Color.PINK.bright);
                    yield cwait();
                }
            });
        }
    };
    Dungeon.見知らぬ海岸 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "見知らぬ海岸", info: "",
                rank: 0, enemyLv: 3, au: 60, btn: [DungeonArea.中央島, new Rect(0.1, 0.3, 0.3, 0.1)],
                treasures: () => [Eq.銅板],
                exItems: () => [Eq.草の服],
                trendItems: () => [Item.草, Item.水, Item.竹, Item.かんな],
            });
            this.isVisible = () => Dungeon.再構成トンネル.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "危険な光線";
                e.prm(Prm.MAX_HP).base = 40;
                e.prm(Prm.STR).base = 5;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.鎖使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "アイアンチョコチョコ";
                e.img = new Img("img/unit/ex_choco2.png");
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
                    yield Story0.runMain2();
                }
                if (Item.動かない映写機.totalGetCount === 0) {
                    Sound.rare.play();
                    Item.動かない映写機.add(1);
                    yield cwait();
                }
            });
        }
    };
    Dungeon.はじまりの丘 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "はじまりの丘", info: "木+",
                rank: 1, enemyLv: 4, au: 100, btn: [DungeonArea.中央島, new Rect(0.7, 0.15, 0.3, 0.1)],
                treasures: () => [Eq.オールマント],
                exItems: () => [Eq.ライダーベルト],
                trendItems: () => [Item.肉, Item.竹, Item.砂, Item.かんな],
                trendEvents: () => [[DungeonEvent.TREE, 0.05]],
            });
            this.isVisible = () => Dungeon.見知らぬ海岸.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "導びく者";
                e.prm(Prm.MAX_HP).base = 80;
                e.prm(Prm.STR).base = 10;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "亡霊ドロシー";
                e.img = new Img("img/unit/ex_dorosy.png");
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
                    yield Story0.runMain3();
                }
            });
        }
    };
    Dungeon.予感の街レ = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "予感の街レ", info: "",
                rank: 0, enemyLv: 9, au: 70, btn: [DungeonArea.中央島, new Rect(0.7, 0.7, 0.3, 0.1)],
                treasures: () => [Eq.ミルテの棍],
                exItems: () => [Eq.いばらの鎧],
                trendItems: () => [Item.粘土, Item.土, Item.ガラス, Item.かんな],
            });
            this.isVisible = () => Dungeon.はじまりの丘.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.魔法使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "レ町長";
                e.prm(Prm.MAX_HP).base = 80;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影リリア";
                e.img = new Img("img/unit/ex_riria.png");
                e.prm(Prm.MAX_HP).base = 120;
            };
        }
        toString() { return "予感の街・レ"; }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story0.runMain4();
                }
                if (Item.レレシピ.totalGetCount === 0) {
                    Sound.rare.play();
                    Item.レレシピ.add(1);
                    yield cwait();
                }
            });
        }
    };
    Dungeon.水の都イス = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "水の都イス", info: "湖+",
                rank: 2, enemyLv: 14, au: 60, btn: [DungeonArea.中央島, new Rect(0.7, 0.8, 0.3, 0.1)],
                treasures: () => [Eq.レティシアsガン],
                exItems: () => [Eq.月代],
                trendItems: () => [Item.水, Item.イズミミズ, Item.ジェリーの粘液, Item.精霊の涙, Item.シェイクスピア分子],
                trendEvents: () => [[DungeonEvent.LAKE, 0.05]],
            });
            this.isVisible = () => Dungeon.黒い丘.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.カウボーイ.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "イス都長";
                e.prm(Prm.MAX_HP).base = 250;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.剣士.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影ハインリヒ";
                e.img = new Img("img/unit/ex_haine.png");
                e.prm(Prm.MAX_HP).base = 250;
            };
        }
        toString() { return "水の都・イス"; }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story0.runMain7();
                }
                if (Item.イスレシピ.totalGetCount === 0) {
                    Sound.rare.play();
                    Item.イスレシピ.add(1);
                    yield cwait();
                }
            });
        }
    };
    Dungeon.リテの門 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "リテの門", info: "",
                rank: 2, enemyLv: 16, au: 200, btn: [DungeonArea.中央島, new Rect(0, 0.75, 0.3, 0.1)],
                treasures: () => [Eq.忍者ソード],
                exItems: () => [Eq.反精霊の盾],
                trendItems: () => [Item.ファーストキス, Item.エレタクレヨン, Item.草, Item.呪詛, Item.火の尻尾],
            });
            this.isVisible = () => Dungeon.水の都イス.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.剣士.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "リテの門番";
                e.prm(Prm.MAX_HP).base = 280;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生二年生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "亡霊運命兄さん";
                e.img = new Img("img/unit/ex_unmei.png");
                e.prm(Prm.MAX_HP).base = 280;
            };
        }
        toString() { return "リ・テの門"; }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story0.runMain8();
                }
            });
        }
    };
    Dungeon.クラウンボトル = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "クラウンボトル", info: "",
                rank: 3, enemyLv: 20, au: 250, btn: [DungeonArea.中央島, new Rect(0.15, 0.65, 0.3, 0.1)],
                treasures: () => [Eq.呪縛の弓矢],
                exItems: () => [Eq.コスモガン],
                trendItems: () => [Item.血粉末, Item.うんち, Item.太陽の欠片, Item.シェイクスピア分子1, Item.銅板],
            });
            this.isVisible = () => Dungeon.黒の廃村.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.カウボーイ.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "無限の壺人";
                e.prm(Prm.MAX_HP).base = 350;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.鎖使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "亡霊ガニュメート";
                e.img = new Img("img/unit/ex_ganyu.png");
                e.prm(Prm.MAX_HP).base = 350;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain11();
                }
            });
        }
    };
    Dungeon.トトの郊外 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "トトの郊外", info: "",
                rank: 4, enemyLv: 20, au: 70, btn: [DungeonArea.中央島, new Rect(0.7, 0.9, 0.3, 0.1)],
                treasures: () => [Eq.悪夢],
                exItems: () => [Eq.猛者の鎧],
                trendItems: () => [Item.肉, Item.錫, Item.高野槙, Item.桜],
            });
            this.isVisible = () => Dungeon.クラウンボトル.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.機械士.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "機械仕掛けA";
                e.prm(Prm.MAX_HP).base = 500;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.格闘家.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影トレジャー";
                e.img = new Img("img/unit/ex_trager.png");
                e.prm(Prm.MAX_HP).base = 500;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain12();
                    DungeonArea.now = DungeonArea.月;
                    for (let i = 0; i < Unit.players.length; i++) {
                        Unit.setPlayer(i, Player.empty);
                    }
                    Player.一号.join();
                    Player.雪.join();
                }
            });
        }
    };
    Dungeon.塔4000階 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "塔4000階", info: "",
                rank: 5, enemyLv: 25, au: 240, btn: [DungeonArea.中央島, new Rect(0.35, 0.4, 0.3, 0.1)],
                treasures: () => [Eq.ミサイリストスーツ],
                exItems: () => [Eq.ぱとバット],
                trendItems: () => [Item.松, Item.桜, Item.クワ, Item.良い土, Item.イズミジュエリー, Item.肉],
                beast: true,
            });
            this.isVisible = () => Dungeon.精霊寺院跡.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.暗黒戦士.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "太古の亜人";
                e.prm(Prm.MAX_HP).base = 1000;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.スネイカー.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影ユキエモン";
                e.img = new Img("img/unit/ex_yukiemon.png");
                e.prm(Prm.MAX_HP).base = 1050;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story2.runMain20();
                }
                if (this.dungeonClearCount === 2) {
                    yield Story2.runMain21();
                }
            });
        }
    };
    Dungeon.塔6665階 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "塔6665階", info: "",
                rank: 5, enemyLv: 27, au: 250, btn: [DungeonArea.中央島, new Rect(0.35, 0.25, 0.3, 0.1)],
                treasures: () => [Eq.霊宝天尊],
                exItems: () => [Eq.侍の盾],
                trendItems: () => [Item.粘土, Item.桜, Item.かんな, Item.アリラン型岩石, Item.ドンゴの鱗, Item.ドンゴの骨],
                beast: true,
            });
            this.isVisible = () => Dungeon.塔4000階.dungeonClearCount >= 2;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.精霊使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "殺意ホログラフ";
                e.prm(Prm.MAX_HP).base = 1500;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.考古学者.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影フィガロ";
                e.img = new Img("img/unit/ex_figaro.png");
                e.prm(Prm.MAX_HP).base = 1500;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story2.runMain22();
                }
            });
        }
    };
    Dungeon.塔6666階 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "塔6666階", info: "",
                rank: 4, enemyLv: 28, au: 166, btn: [DungeonArea.中央島, new Rect(0.35, 0.15, 0.3, 0.1)],
                treasures: () => [Eq.力の指輪],
                exItems: () => [Eq.アンチェーンベルト],
                trendItems: () => [Item.肉, Item.バーミキュライト, Item.バッタ, Item.イズミジュエリー, Item.ヴァイスドラッグ5],
            });
            this.isVisible = () => Dungeon.塔6665階.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.侍.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "6666階門番";
                e.prm(Prm.MAX_HP).base = 1600;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.アルケミスト.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影バンバ・エンヤ";
                e.img = new Img("img/unit/ex_banba.png");
                e.prm(Prm.MAX_HP).base = 2350;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story2.runMain23();
                }
                if (this.dungeonClearCount === 2) {
                    yield Story2.runMain24();
                    Player.一号.join();
                    Player.雪.join();
                    Player.雪.ins.job = Job.ペガサス;
                    Flag.yuki_beastOnly.done = true;
                }
            });
        }
    };
    Dungeon.塔地下二百階の門 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "塔地下二百階の門", info: "",
                rank: 5, enemyLv: 30, au: 200, btn: [DungeonArea.中央島, new Rect(0.35, 0.75, 0.3, 0.1)],
                treasures: () => [Eq.アンマシンベルト],
                exItems: () => [Eq.ロングドレスの剣],
                trendItems: () => [Item.肉, Item.燃える髪, Item.石溶け水, Item.恒星型リュスティック],
            });
            this.isVisible = () => Dungeon.塔6666階.dungeonClearCount >= 2;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.ロボット.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "地下への門番";
                e.prm(Prm.MAX_HP).base = 1800;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.アルケミスト.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影魔王";
                e.img = new Img("img/unit/ex_maou.png");
                e.prm(Prm.MAX_HP).base = 2500;
                e.pet = Pet.ネーレイス.create(4);
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story2.runMain25();
                    //冥界編へ移行
                    for (const p of Player.values) {
                        p.member = false;
                    }
                    for (let i = 0; i < Unit.players.length; i++) {
                        Unit.setPlayer(i, Player.empty);
                    }
                    Player.ジスロフ.join();
                    Player.ナナ.join();
                    DungeonArea.now = DungeonArea.冥界;
                }
                if (Dungeon.冥界王朝宮.dungeonClearCount > 0 && !Flag.story_Main31.done) {
                    Flag.story_Main31.done = true;
                    yield Story3.runMain31();
                    DungeonArea.now = DungeonArea.冥界;
                }
                if (Flag.story_Main34.done && !Flag.story_Main35.done) {
                    Flag.story_Main35.done = true;
                    yield Story3.runMain35();
                }
            });
        }
    };
    //-中央島
    ///////////////////////////////////////////////////////////////////////
    //黒地域
    ///////////////////////////////////////////////////////////////////////
    Dungeon.黒平原 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "黒平原", info: "地層+",
                rank: 0, enemyLv: 10, au: 100, btn: [DungeonArea.黒地域, new Rect(0.7, 0.5, 0.3, 0.1)],
                treasures: () => [Eq.魔性のマント],
                exItems: () => [Eq.妖魔の手],
                trendItems: () => [Item.バッタ, Item.クワ, Item.銅, Item.鉄, Item.銅板],
                trendEvents: () => [[DungeonEvent.STRATUM, 0.05]],
            });
            this.isVisible = () => Dungeon.予感の街レ.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.毒使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "黒き誘い";
                e.prm(Prm.MAX_HP).base = 130;
                e.prm(Prm.DRK).base = 10;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影オーロラ";
                e.img = new Img("img/unit/ex_orora.png");
                e.prm(Prm.MAX_HP).base = 150;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story0.runMain5();
                }
            });
        }
    };
    Dungeon.黒い丘 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "黒い丘", info: "地層+",
                rank: 1, enemyLv: 12, au: 150, btn: [DungeonArea.黒地域, new Rect(0.2, 0.6, 0.3, 0.1)],
                treasures: () => [Eq.魔ヶ玉の手首飾り],
                exItems: () => [Eq.無色の靴],
                trendItems: () => [Item.鉄, Item.銅板, Item.バーミキュライト, Item.血清, Item.ガラス],
                trendEvents: () => [[DungeonEvent.STRATUM, 0.05]],
            });
            this.isVisible = () => Dungeon.黒平原.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.アーチャー.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "黒き獰猛";
                e.prm(Prm.MAX_HP).base = 250;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.鎖使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影ジレンマ";
                e.img = new Img("img/unit/ex_jirenma.png");
                e.prm(Prm.MAX_HP).base = 250;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story0.runMain6();
                }
            });
        }
    };
    Dungeon.黒遺跡 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "黒遺跡", info: "地層+",
                rank: 2, enemyLv: 18, au: 200, btn: [DungeonArea.黒地域, new Rect(0.55, 0.3, 0.3, 0.1)],
                treasures: () => [Eq.ダークネスロード],
                exItems: () => [Item.ヴァンパイアの血],
                trendItems: () => [Item.黒色のまぼろし, Item.エレタの絵の具, Item.桐, Item.鉄, Item.桜],
                trendEvents: () => [[DungeonEvent.STRATUM, 0.05]],
            });
            this.isVisible = () => Dungeon.リテの門.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.ヴァンパイア.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "スプリガン";
                e.prm(Prm.MAX_HP).base = 330;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生二年生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "亡霊VBS";
                e.img = new Img("img/unit/ex_vbs2.png");
                e.prm(Prm.MAX_HP).base = 330;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story0.runMain9();
                }
            });
        }
    };
    Dungeon.黒の廃村 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "黒の廃村", info: "地層+",
                rank: 3, enemyLv: 19, au: 250, btn: [DungeonArea.黒地域, new Rect(0.55, 0.9, 0.3, 0.1)],
                treasures: () => [Eq.機工の指輪],
                exItems: () => [Item.霊術戦士の血],
                trendItems: () => [Item.ロウ, Item.桐, Item.銅, Item.鉄],
                trendEvents: () => [[DungeonEvent.STRATUM, 0.05]],
            });
            this.isVisible = () => Dungeon.黒遺跡.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.霊術戦士.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "黒の門番";
                e.prm(Prm.MAX_HP).base = 350;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.霊術戦士.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "ティル王";
                e.img = new Img("img/unit/ex_tilou.png");
                e.prm(Prm.MAX_HP).base = 350;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain10();
                }
            });
        }
    };
    //-黒地域
    ///////////////////////////////////////////////////////////////////////
    //月
    ///////////////////////////////////////////////////////////////////////
    Dungeon.テント樹林 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "テント樹林", info: "木+",
                rank: 0, enemyLv: 0, au: 100, btn: [DungeonArea.月, new Rect(0.35, 0.1, 0.3, 0.1)],
                treasures: () => [Eq.鎖のマント],
                exItems: () => [Eq.アリランナイフ],
                trendItems: () => [Item.テント木, Item.発砲ツル, Item.円形ハゲミミズの油],
                trendEvents: () => [[DungeonEvent.TREE, 0.05]],
                beast: true,
            });
            this.isVisible = () => Dungeon.トトの郊外.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.雷鳥.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "大雷鳥";
                e.prm(Prm.MAX_HP).base = 250;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影ニュース";
                e.img = new Img("img/unit/ex_news.png");
                e.prm(Prm.MAX_HP).base = 250;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain13();
                }
            });
        }
    };
    Dungeon.小人集落周辺 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "小人集落周辺", info: "木+",
                rank: 1, enemyLv: 3, au: 150, btn: [DungeonArea.月, new Rect(0.45, 0.2, 0.3, 0.1)],
                treasures: () => [Eq.チェーンベルト],
                exItems: () => [Eq.アメーバリング],
                trendItems: () => [Item.テント木, Item.発砲ツル, Item.円形ハゲミミズの油, Item.松],
                trendEvents: () => [[DungeonEvent.TREE, 0.05]],
                beast: true,
            });
            this.isVisible = () => Dungeon.テント樹林.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.アメーバ.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "スライム";
                e.prm(Prm.MAX_HP).base = 300;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.ダウザー.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影パンドラ";
                e.img = new Img("img/unit/ex_pandora.png");
                e.prm(Prm.MAX_HP).base = 300;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain14();
                }
            });
        }
    };
    Dungeon.聖なる洞窟 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "聖なる洞窟", info: "",
                rank: 2, enemyLv: 7, au: 200, btn: [DungeonArea.月, new Rect(0.40, 0.45, 0.3, 0.1)],
                treasures: () => [Eq.アンパストベルト],
                exItems: () => [Eq.ルナローブ],
                trendItems: () => [Item.粘土, Item.石, Item.銅, Item.銀, Item.金],
                beast: true,
            });
            this.isVisible = () => Dungeon.小人集落周辺.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.妖精.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "聖なる妖精";
                e.prm(Prm.MAX_HP).base = 450;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.忍者.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影オルガ";
                e.img = new Img("img/unit/ex_orga.png");
                e.prm(Prm.MAX_HP).base = 600;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain15();
                    Player.ベガ.join();
                }
            });
        }
    };
    Dungeon.月狼の森 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "月狼の森", info: "",
                rank: 3, enemyLv: 10, au: 250, btn: [DungeonArea.月, new Rect(0.70, 0.6, 0.3, 0.1)],
                treasures: () => [Eq.魔法使いのミトン],
                exItems: () => [Eq.弓弓弓弓],
                trendItems: () => [Item.テント木, Item.発砲ツル, Item.円形ハゲミミズの油, Item.ロウ],
                beast: true,
            });
            this.isVisible = () => Dungeon.聖なる洞窟.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.鬼火.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "ビッグファイヤー";
                e.prm(Prm.MAX_HP).base = 650;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.忍者.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "霊体オルガ";
                e.img = new Img("img/unit/ex_orga2.png");
                e.prm(Prm.MAX_HP).base = 800;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain16();
                    DungeonArea.now = DungeonArea.中央島;
                }
            });
        }
    };
    //-月
    ///////////////////////////////////////////////////////////////////////
    //古マーザン
    ///////////////////////////////////////////////////////////////////////
    Dungeon.古マーザン森 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "古マーザン森", info: "",
                rank: 2, enemyLv: 21, au: 250, btn: [DungeonArea.古マーザン, new Rect(0.5, 0, 0.3, 0.1)],
                treasures: () => [Eq.魔ヶ玉],
                exItems: () => [Eq.水晶の指輪],
                trendItems: () => [Item.蛍草のエキス, Item.水, Item.シェイクスピア分子2, Item.シェイクスピア分子1, Item.桜],
            });
            this.isVisible = () => Dungeon.月狼の森.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.天使.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "朱雀";
                e.prm(Prm.MAX_HP).base = 700;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.天使.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "幻影キキツキ";
                e.img = new Img("img/unit/ex_kiki.png");
                e.prm(Prm.MAX_HP).base = 700;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain17();
                }
            });
        }
    };
    Dungeon.魔鳥の岩壁 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "魔鳥の岩壁", info: "",
                rank: 4, enemyLv: 23, au: 300, btn: [DungeonArea.古マーザン, new Rect(0.7, 0.9, 0.3, 0.1)],
                treasures: () => [Eq.水晶の手首飾り],
                exItems: () => [Item.ホークマンの血],
                trendItems: () => [Item.燃える髪, Item.ワクチン, Item.太陽の欠片, Item.うんち, Item.ガラス],
            });
            this.isVisible = () => Dungeon.古マーザン森.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.ホークマン.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "鳥人";
                e.prm(Prm.MAX_HP).base = 750;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.ホークマン.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "魔鳥ぱと";
                e.img = new Img("img/unit/ex_hato.png");
                e.prm(Prm.MAX_HP).base = 800;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain18();
                    Sound.lvup.play();
                    Util.msg.set("パーティーメンバーの入れ替えができるようになった！");
                    yield cwait();
                }
            });
        }
    };
    Dungeon.精霊寺院跡 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "精霊寺院跡", info: "",
                rank: 6, enemyLv: 25, au: 350, btn: [DungeonArea.古マーザン, new Rect(0.1, 0.05, 0.3, 0.1)],
                treasures: () => [Eq.エスペラント],
                exItems: () => [Item.精霊使いの血],
                trendItems: () => [Item.エレタの絵の具, Item.エレタクレヨン, Item.カンバス, Item.清龍, Item.烈火, Item.あらくれ剣],
            });
            this.isVisible = () => Dungeon.魔鳥の岩壁.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.テンプルナイト.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "死せる住職";
                e.prm(Prm.MAX_HP).base = 750;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.精霊使い.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "新王ブレッシュ";
                e.img = new Img("img/unit/ex_bresh.png");
                e.prm(Prm.MAX_HP).base = 800;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story1.runMain19();
                    Player.一号.member = false;
                    Player.雪.member = false;
                    for (let i = 0; i < Unit.players.length; i++) {
                        Unit.setPlayer(i, Player.empty);
                    }
                    Player.ルイン.join();
                    Player.ピアー.join();
                    Player.ベガ.join();
                    Player.luka.join();
                }
            });
        }
    };
    //-古マーザン
    ///////////////////////////////////////////////////////////////////////
    //冥界
    ///////////////////////////////////////////////////////////////////////
    Dungeon.冥土の底 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "冥土の底", info: "",
                rank: 0, enemyLv: 0, au: 222, btn: [DungeonArea.冥界, new Rect(0.4, 0.2, 0.3, 0.1)],
                treasures: () => [Eq.洗浄の腕輪],
                exItems: () => [Eq.アングラの泥腕輪],
                trendItems: () => [Item.肉, Item.失った思い出, Item.血粉末, Item.バッタ, Item.かんな, Item.ヒノキ],
                ghost: true,
            });
            this.isVisible = () => true;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.アングラ.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "底主";
                e.prm(Prm.MAX_HP).base = 400;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.アイス.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "霊体ブリザード";
                e.img = new Img("img/unit/ex_bli.png");
                e.prm(Prm.MAX_HP).base = 700;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story2.runMain26();
                }
                if (this.dungeonClearCount >= 2 && !Flag.story_Kabe0.done) {
                    Flag.story_Kabe0.done = true;
                    yield Story3.runKabe0();
                    Unit.players.filter(u => u.exists).forEach(u => u.prm(Prm.MAX_HP).base += 5);
                }
            });
        }
    };
    Dungeon.ハデスの腹 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "ハデスの腹", info: "",
                rank: 2, enemyLv: 6, au: 201, btn: [DungeonArea.冥界, new Rect(0.5, 0.5, 0.3, 0.1)],
                treasures: () => [Eq.光色の靴],
                exItems: () => [Eq.ハデスの腹剣],
                trendItems: () => [Item.肉, Item.銅板, Item.ガラス, Item.松, Item.桜, Item.杉],
                ghost: true,
            });
            this.isVisible = () => Dungeon.冥土の底.dungeonClearCount >= 1;
            this.setBossInner = () => {
                let e = Unit.enemies[0];
                Job.孤独のクグワ.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "腹虫";
                e.prm(Prm.MAX_HP).base = 500;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.魔砲士.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "霊体ビジョン";
                e.img = new Img("img/unit/ex_vision.png");
                e.prm(Prm.MAX_HP).base = 945;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story2.runMain27();
                }
                if (this.dungeonClearCount >= 2 && Flag.story_Kabe0.done && !Flag.story_Kabe1.done) {
                    Flag.story_Kabe1.done = true;
                    yield Story3.runKabe1();
                    Unit.players.filter(u => u.exists).forEach(u => u.prm(Prm.MAX_HP).base += 10);
                }
                if (!Player.白い鳥.member) {
                    Player.白い鳥.join();
                }
            });
        }
    };
    Dungeon.魂人の廃都 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "魂人の廃都", info: "",
                rank: 4, enemyLv: 8, au: 244, btn: [DungeonArea.冥界, new Rect(0.45, 0.4, 0.3, 0.1)],
                treasures: () => [Eq.暖かい布],
                exItems: () => [Eq.クピドの指輪],
                trendItems: () => [Item.合板, Item.ネクロマンス法, Item.子守歌, Item.地の涙, Item.血粉末, Item.血清],
                ghost: true,
            });
            this.isVisible = () => Dungeon.ハデスの腹.dungeonClearCount >= 1 && !Dungeon.小鬼.isVisible();
            this.setBossInner = () => {
                for (const e of Unit.enemies) {
                    for (const prm of Prm.atkPrms) {
                        e.prm(prm).base *= 1.5;
                    }
                }
                let e = Unit.enemies[0];
                Job.絶望のクグワ.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "絶望の大クグワ";
                e.prm(Prm.MAX_HP).base = 600;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.クピド.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "霊体・葵";
                e.img = new Img("img/unit/ex_aoi.png");
                e.prm(Prm.MAX_HP).base = 1440;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story2.runMain28();
                }
                if (this.dungeonClearCount >= 2 && Flag.story_Kabe1.done && !Flag.story_Kabe2.done) {
                    Flag.story_Kabe2.done = true;
                    yield Story3.runKabe2();
                    Unit.players.filter(u => u.exists).forEach(u => u.prm(Prm.MAX_HP).base += 15);
                }
            });
        }
    };
    Dungeon.小鬼 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "小鬼", info: "",
                rank: 4, enemyLv: 12, au: 1, btn: [DungeonArea.冥界, new Rect(0.45, 0.4, 0.3, 0.1)],
                treasures: () => [],
                exItems: () => [],
                trendItems: () => [],
                ghost: true,
            });
            this.isVisible = () => Dungeon.魂人の廃都.dungeonClearCount >= 1 && this.dungeonClearCount === 0;
            this.setBossInner = () => {
                for (const e of Unit.enemies) {
                    for (const prm of Prm.atkPrms) {
                        e.prm(prm).base *= 1.5;
                    }
                }
                let e = Unit.enemies[0];
                Job.鬼.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "小鬼";
                e.img = new Img("img/unit/boss_syao.png");
                e.prm(Prm.MAX_HP).base = 2000;
                e.prm(Prm.STR).base = 41;
                e.tecs.push(Tec.閻魔の笏, Tec.暴れる);
                e.setEq(Eq.小鬼の腕輪.pos, Eq.小鬼の腕輪);
            };
            this.setExInner = () => {
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    Eq.小鬼の腕輪.add(1);
                    yield wait();
                    Item.鬼の血.add(1);
                    yield wait();
                }
            });
        }
    };
    Dungeon.ハデスの口 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "ハデスの口", info: "湖+",
                rank: 5, enemyLv: 15, au: 255, btn: [DungeonArea.冥界, new Rect(0.05, 0.3, 0.3, 0.1)],
                treasures: () => [Eq.回避の指輪],
                exItems: () => [Eq.卯月ベルト],
                trendItems: () => [Item.鬼火, Item.旧式ミサイル, Item.精神安定剤, Item.クワ, Item.銀, Item.金, Item.クリスタル, Item.大型隕石],
                trendEvents: () => [[DungeonEvent.LAKE, 0.05]],
                ghost: true,
            });
            this.isVisible = () => Dungeon.小鬼.dungeonClearCount >= 1;
            this.setBossInner = () => {
                for (const e of Unit.enemies) {
                    for (const prm of Prm.atkPrms) {
                        e.prm(prm).base *= 1.5;
                    }
                }
                let e = Unit.enemies[0];
                Job.お化け.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "口に住まう亡霊";
                e.prm(Prm.MAX_HP).base = 1000;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.ダウザー.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "霊体・卯月";
                e.img = new Img("img/unit/ex_uzuki.png");
                e.prm(Prm.MAX_HP).base = 2000;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story2.runMain29();
                }
            });
        }
    };
    Dungeon.冥界王朝宮 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "冥界王朝宮", info: "",
                rank: 6, enemyLv: 17, au: 266, btn: [DungeonArea.冥界, new Rect(0.1, 0.85, 0.3, 0.1)],
                treasures: () => [Eq.僧兵の腕輪],
                exItems: () => [Eq.僧兵の盾],
                trendItems: () => [Item.鬼火, Item.松, Item.精神安定剤, Item.クワ, Item.銀, Item.金, Item.杉, Item.桜],
                ghost: true,
            });
            this.isVisible = () => {
                if (Dungeon.ハデスの口.dungeonClearCount > 0 && Flag.story_Kabe2.done && this.dungeonClearCount === 0) {
                    return true;
                }
                if (Dungeon.占星術師の館.dungeonClearCount >= 2) {
                    return true;
                }
                return true;
            };
            this.setBossInner = () => {
                for (const e of Unit.enemies) {
                    for (const prm of Prm.atkPrms) {
                        e.prm(prm).base *= 1.5;
                    }
                }
                let e = Unit.enemies[0];
                Job.僧兵.setEnemy(e, e.prm(Prm.LV).base + 20);
                e.name = "王朝兵";
                e.prm(Prm.MAX_HP).base = 1200;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.鬼.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "アリラン";
                e.img = new Img("img/unit/ex_ariran.png");
                e.prm(Prm.MAX_HP).base = 2200;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story3.runMain30();
                    DungeonArea.now = DungeonArea.中央島;
                }
                if (Flag.story_Main33.done && !Flag.story_Main34.done) {
                    Flag.story_Main34.done = true;
                    yield Story3.runMain34();
                    DungeonArea.now = DungeonArea.中央島;
                }
            });
        }
    };
    Dungeon.占星術師の館 = new class extends Dungeon {
        constructor() {
            super({ uniqueName: "占星術師の館", info: "",
                rank: 6, enemyLv: 18, au: 266, btn: [DungeonArea.冥界, new Rect(0, 0.2, 0.3, 0.1)],
                treasures: () => [Eq.塔],
                exItems: () => [Eq.お化けマント],
                trendItems: () => [Item.クリスタル, Item.ドラッグ, Item.バッタ, Item.エレタクレヨン, Item.清水, Item.ドンゴの鱗],
                ghost: true,
            });
            this.isVisible = () => Flag.story_Main31.done;
            this.setBossInner = () => {
                for (const e of Unit.enemies) {
                    for (const prm of Prm.atkPrms) {
                        e.prm(prm).base *= 1.5;
                    }
                }
                let e = Unit.enemies[0];
                Job.ロボット.setEnemy(e, e.prm(Prm.LV).base + 10);
                e.name = "館の番人";
                e.prm(Prm.MAX_HP).base = 1300;
            };
            this.setExInner = () => {
                let e = Unit.enemies[0];
                Job.魔砲士.setEnemy(e, e.prm(Prm.LV).base);
                e.name = "聖戦士・魔王";
                e.img = new Img("img/unit/ex_ariran.png");
                e.prm(Prm.MAX_HP).base = 3000;
            };
        }
        dungeonClearEvent() {
            const _super = Object.create(null, {
                dungeonClearEvent: { get: () => super.dungeonClearEvent }
            });
            return __awaiter(this, void 0, void 0, function* () {
                yield _super.dungeonClearEvent.call(this);
                if (this.dungeonClearCount === 1) {
                    yield Story3.runMain32();
                }
                if (this.dungeonClearCount === 2) {
                    Flag.story_Main33.done = true;
                    yield Story3.runMain33();
                }
            });
        }
    };
})(Dungeon || (Dungeon = {}));
