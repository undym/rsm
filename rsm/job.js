import { EUnit, Prm } from "./unit.js";
import { Tec } from "./tec.js";
import { EqPos, Eq } from "./eq.js";
import { randomInt } from "./undym/random.js";
import { Img } from "./graphics/graphics.js";
/*
敵のLV毎のHP目安.
e.prm(Prm.MAX_HP).base = 3 + (lv * lv * 0.35);

lv max_hp
0 3
30 318
60 1263
90 2838
120 5043
150 7877
180 11343
210 15437
240 20163
270 25518
300 31502
330 38118
360 45363
390 53238
420 61742
450 70878
480 80643
510 91038
540 102063
570 113718
600 126002
630 138918
660 152463
690 166638
720 181443
750 196878
780 212943
810 229637
840 246962
870 264918
900 283503
930 302718
960 322563
990 343038
*/
export class Job {
    constructor(args) {
        this.args = args;
        Job._values.push(this);
        if (Job._valueOf.has(args.uniqueName)) {
            console.log(`!!Job already has uniqueName "${args.uniqueName}".`);
        }
        else {
            Job._valueOf.set(args.uniqueName, this);
        }
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) { return this._valueOf.get(uniqueName); }
    get uniqueName() { return this.args.uniqueName; }
    get info() { return this.args.info; }
    get appearLv() { return this.args.appearLv; }
    get img() { return this.args.img; }
    get learningTecs() { return this.args.learningTecs(); }
    get growthPrms() {
        const res = [];
        for (const gp of this.args.growthPrms()) {
            res.push({ prm: gp[0], value: gp[1] });
        }
        return res;
    }
    get lvupExp() { return this.args.lvupExp; }
    canJobChange(p) { return this.args.canJobChange(p); }
    toString() { return this.args.uniqueName; }
    get maxLv() { return 20; }
    setEnemy(e, lv) {
        for (const prm of Prm.values()) {
            const set = e.prm(prm);
            set.base = lv / 10 + (lv + 3) * Math.random();
            set.battle = 0;
            set.eq = 0;
        }
        e.name = this.toString();
        e.job = this;
        e.img = this.img;
        e.exists = true;
        e.dead = false;
        e.ai = EUnit.DEF_AI;
        e.prm(Prm.LV).base = lv;
        e.prm(Prm.EXP).base = lv + 1;
        e.yen = lv + 1;
        e.prm(Prm.MAX_HP).base = randomInt(1, 7) + (lv * lv * 0.35);
        e.prm(Prm.MAX_MP).base = 1 + lv / 20 + Math.random() * lv / 5;
        e.prm(Prm.MAX_TP).base = 1 + lv / 20 + Math.random() * lv / 5;
        e.tp = 0;
        e.ep = 0;
        for (const pos of EqPos.values()) {
            e.setEq(pos, Eq.rnd(pos, lv));
        }
        e.clearConditions();
        this.setEnemyInner(e);
        e.equip();
        e.hp = e.prm(Prm.MAX_HP).total;
        e.mp = Math.random() * (e.prm(Prm.MAX_MP).total + 1);
    }
    setEnemyInner(e) { }
}
Job._values = [];
Job._valueOf = new Map();
Job.DEF_LVUP_EXP = 10;
(function (Job) {
    Job.訓練生 = new class extends Job {
        constructor() {
            super({ uniqueName: "訓練生", info: "",
                appearLv: 0, img: new Img("img/unit/訓練生.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => true,
                growthPrms: () => [[Prm.MAX_HP, 1]],
                learningTecs: () => [Tec.タックル, Tec.HP自動回復],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.殴る, Tec.練気];
        }
    };
    Job.訓練生二年生 = new class extends Job {
        constructor() {
            super({ uniqueName: "訓練生二年生", info: "",
                appearLv: 30, img: new Img("img/unit/訓練生二年生.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.MAX_HP, 1]],
                learningTecs: () => [Tec.癒しの風, Tec.我慢, Tec.何もしない],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.殴る, Tec.癒しの風];
        }
    };
    Job.シーフ = new class extends Job {
        constructor() {
            super({ uniqueName: "シーフ", info: "",
                appearLv: 40, img: new Img("img/unit/シーフ.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生二年生),
                growthPrms: () => [[Prm.MAX_TP, 1]],
                learningTecs: () => [Tec.回避UP, Tec.風],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.手裏剣, Tec.癒しの風, Tec.回避UP, Tec.風];
        }
    };
    Job.格闘家 = new class extends Job {
        constructor() {
            super({ uniqueName: "格闘家", info: "",
                appearLv: 15, img: new Img("img/unit/格闘家.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => p.isMasteredJob(Job.訓練生二年生),
                growthPrms: () => [[Prm.STR, 1]],
                learningTecs: () => [Tec.格闘攻撃UP, Tec.格闘防御UP],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.タックル, Tec.タックル, Tec.格闘防御UP];
        }
    };
    Job.剣士 = new class extends Job {
        constructor() {
            super({ uniqueName: "剣士", info: "",
                appearLv: 7, img: new Img("img/unit/剣士.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.STR, 1]],
                learningTecs: () => [Tec.斬る, Tec.大いなる動き],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.斬る, Tec.斬る, Tec.斬る, Tec.斬る, Tec.大いなる動き];
        }
    };
    Job.忍者 = new class extends Job {
        constructor() {
            super({ uniqueName: "忍者", info: "",
                appearLv: 50, img: new Img("img/unit/忍者.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => p.isMasteredJob(Job.剣士) && p.isMasteredJob(Job.シーフ),
                growthPrms: () => [[Prm.STR, 1], [Prm.ARR, 1]],
                learningTecs: () => [Tec.二刀流, Tec.手裏剣, Tec.ジライヤ],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.手裏剣, Tec.手裏剣, Tec.ジライヤ];
        }
    };
    Job.魔法使い = new class extends Job {
        constructor() {
            super({ uniqueName: "魔法使い", info: "魔法攻撃を扱う職業",
                appearLv: 5, img: new Img("img/unit/魔法使い.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.MAG, 1]],
                learningTecs: () => [Tec.ヴァハ, Tec.エヴィン, Tec.ジョンD],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.ヴァハ, Tec.殴る, Tec.殴る, Tec.殴る];
        }
    };
    Job.ウィザード = new class extends Job {
        constructor() {
            super({ uniqueName: "ウィザード", info: "魔法攻撃を扱う職業",
                appearLv: 55, img: new Img("img/unit/ウィザード.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => p.isMasteredJob(Job.魔法使い),
                growthPrms: () => [[Prm.MAG, 2]],
                learningTecs: () => [Tec.魔法攻撃UP, Tec.オグマ, Tec.ルー],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.オグマ, Tec.ルー, Tec.エヴァ, Tec.殴る];
        }
    };
    Job.天使 = new class extends Job {
        constructor() {
            super({ uniqueName: "天使", info: "",
                appearLv: 12, img: new Img("img/unit/天使.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.LIG, 1]],
                learningTecs: () => [Tec.天籟, Tec.数珠, Tec.ユグドラシル],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.天籟, Tec.数珠, Tec.数珠, Tec.数珠, Tec.殴る, Tec.ユグドラシル];
        }
    };
    Job.毒使い = new class extends Job {
        constructor() {
            super({ uniqueName: "毒使い", info: "",
                appearLv: 20, img: new Img("img/unit/毒使い.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.DRK, 1]],
                learningTecs: () => [Tec.ポイズンバタフライ, Tec.恵まれし者],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.ヴァハ, Tec.殴る, Tec.ポイズンバタフライ, Tec.ポイズンバタフライ, Tec.恵まれし者];
        }
    };
    Job.鎖使い = new class extends Job {
        constructor() {
            super({ uniqueName: "鎖使い", info: "",
                appearLv: 52, img: new Img("img/unit/鎖使い.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.CHN, 1]],
                learningTecs: () => [Tec.スネイク, Tec.凍てつく波動],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.スネイク, Tec.スネイク, Tec.殴る, Tec.殴る, Tec.凍てつく波動];
        }
    };
    Job.スネイカー = new class extends Job {
        constructor() {
            super({ uniqueName: "スネイカー", info: "",
                appearLv: 72, img: new Img("img/unit/スネイカー.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => p.isMasteredJob(Job.鎖使い),
                growthPrms: () => [[Prm.CHN, 2]],
                learningTecs: () => [Tec.TP自動回復, Tec.ホワイトスネイク, Tec.血技の技巧],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.スネイク, Tec.スネイク, Tec.殴る, Tec.殴る, Tec.TP自動回復, Tec.ホワイトスネイク, Tec.血技の技巧];
        }
    };
    Job.ダウザー = new class extends Job {
        constructor() {
            super({ uniqueName: "ダウザー", info: "",
                appearLv: 32, img: new Img("img/unit/ダウザー.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.PST, 1]],
                learningTecs: () => [Tec.念力, Tec.念, Tec.SORRYCSTEF],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.念力, Tec.念力, Tec.念, Tec.殴る, Tec.殴る, Tec.光の護封剣, Tec.SORRYCSTEF];
        }
    };
    Job.カウボーイ = new class extends Job {
        constructor() {
            super({ uniqueName: "カウボーイ", info: "",
                appearLv: 22, img: new Img("img/unit/カウボーイ.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.GUN, 1]],
                learningTecs: () => [Tec.撃つ, Tec.乱射],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.撃つ, Tec.撃つ, Tec.撃つ, Tec.殴る, Tec.殴る];
        }
    };
    /**TODO. */
    Job.機械士 = new class extends Job {
        constructor() {
            super({ uniqueName: "機械士", info: "",
                appearLv: 75, img: new Img("img/unit/霊術戦士.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => false,
                growthPrms: () => [[Prm.STR, 1], [Prm.DRK, 1]],
                learningTecs: () => [],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.暗黒剣, Tec.吸血, Tec.殴る, Tec.ヤクシャ, Tec.吸血, Tec.吸血, Tec.VAMPIRE_VLOODY_STAR];
        }
    };
    Job.アーチャー = new class extends Job {
        constructor() {
            super({ uniqueName: "アーチャー", info: "",
                appearLv: 25, img: new Img("img/unit/アーチャー.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.ARR, 1]],
                learningTecs: () => [Tec.射る, Tec.アスラの矢],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.射る, Tec.射る, Tec.殴る, Tec.殴る];
        }
    };
    Job.クピド = new class extends Job {
        constructor() {
            super({ uniqueName: "クピド", info: "",
                appearLv: 35, img: new Img("img/unit/クピド.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => p.isMasteredJob(Job.アーチャー) && p.isMasteredJob(Job.訓練生二年生),
                growthPrms: () => [[Prm.ARR, 2]],
                learningTecs: () => [Tec.ヤクシャ, Tec.ナーガ, Tec.ガルダ, Tec.キンナラ],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.射る, Tec.ナーガ, Tec.殴る, Tec.ヤクシャ, Tec.ナーガ, Tec.ガルダ, Tec.キンナラ];
        }
    };
    Job.ヴァンパイア = new class extends Job {
        constructor() {
            super({ uniqueName: "ヴァンパイア", info: "",
                appearLv: 25, img: new Img("img/unit/クピド.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => false,
                growthPrms: () => [[Prm.DRK, 1]],
                learningTecs: () => [Tec.吸血, Tec.VAMPIRE_VLOODY_STAR],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.暗黒剣, Tec.吸血, Tec.殴る, Tec.ヤクシャ, Tec.吸血, Tec.吸血, Tec.VAMPIRE_VLOODY_STAR];
        }
    };
    Job.霊術戦士 = new class extends Job {
        constructor() {
            super({ uniqueName: "霊術戦士", info: "",
                appearLv: 75, img: new Img("img/unit/霊術戦士.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => false,
                growthPrms: () => [[Prm.STR, 1], [Prm.DRK, 1]],
                learningTecs: () => [],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.暗黒剣, Tec.吸血, Tec.殴る, Tec.ヤクシャ, Tec.吸血, Tec.吸血, Tec.VAMPIRE_VLOODY_STAR];
        }
    };
    Job.暗黒戦士 = new class extends Job {
        constructor() {
            super({ uniqueName: "暗黒戦士", info: "",
                appearLv: 75, img: new Img("img/unit/霊術戦士.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                canJobChange: p => false,
                growthPrms: () => [[Prm.DRK, 2]],
                learningTecs: () => [Tec.暗黒剣, Tec.衝動, Tec.宵闇, Tec.自爆],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.暗黒剣, Tec.暗黒剣, Tec.暗黒剣, Tec.吸血, Tec.殴る];
        }
    };
    //--------------------------------------------------
    //
    //獣
    //
    //--------------------------------------------------
    //TODO
    Job.雷鳥 = new class extends Job {
        constructor() {
            super({ uniqueName: "雷鳥", info: "",
                appearLv: 75, img: new Img("img/unit/雷鳥.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                canJobChange: p => false,
                growthPrms: () => [[Prm.ARR, 1]],
                learningTecs: () => [],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.射る, Tec.ヴァハ, Tec.殴る];
        }
    };
    //TODO
    Job.アメーバ = new class extends Job {
        constructor() {
            super({ uniqueName: "アメーバ", info: "",
                appearLv: 85, img: new Img("img/unit/アメーバ.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                canJobChange: p => false,
                growthPrms: () => [[Prm.MAX_MP, 1]],
                learningTecs: () => [Tec.弱体液, Tec.セル, Tec.被膜],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.弱体液, Tec.タックル, Tec.殴る, Tec.セル, Tec.被膜];
        }
    };
    //TODO
    Job.妖精 = new class extends Job {
        constructor() {
            super({ uniqueName: "妖精", info: "",
                appearLv: 95, img: new Img("img/unit/妖精.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                canJobChange: p => false,
                growthPrms: () => [[Prm.MAG, 1]],
                learningTecs: () => [Tec.妖精の粉, Tec.MP自動回復],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.妖精の粉, Tec.妖精の粉, Tec.ヴァハ, Tec.殴る, Tec.MP自動回復];
        }
    };
    //TODO
    Job.ドラゴン = new class extends Job {
        constructor() {
            super({ uniqueName: "ドラゴン", info: "",
                appearLv: 95, img: new Img("img/unit/ドラゴン.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                canJobChange: p => false,
                growthPrms: () => [[Prm.MAX_HP, 2]],
                learningTecs: () => [Tec.自然治癒, Tec.龍撃, Tec.ドラゴンテイル, Tec.ドラゴンブレス],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ドラゴンテイル, Tec.ドラゴンテイル, Tec.龍撃, Tec.殴る, Tec.自然治癒];
            e.prm(Prm.MAX_HP).base *= 2;
        }
    };
})(Job || (Job = {}));
