var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EUnit, Prm } from "./unit.js";
import { Tec } from "./tec.js";
import { EqPos, Eq } from "./eq.js";
import { choice, randomInt } from "./undym/random.js";
import { Img } from "./graphics/texture.js";
import { Condition } from "./condition.js";
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
    get beast() { return this.args.beast ? this.args.beast : false; }
    toString() { return this.args.uniqueName; }
    get maxLv() { return 20; }
    setEnemy(e, lv) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const prm of Prm.values) {
                const set = e.prm(prm);
                set.base = 4 * Math.random() + lv * Math.random();
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
            e.ep = 0;
            for (const pos of EqPos.values) {
                e.setEq(pos, Eq.rnd(pos, lv));
            }
            e.clearConditions();
            this.setEnemyInner(e);
            yield e.equip();
            e.hp = e.prm(Prm.MAX_HP).total;
            e.mp = Math.random() * (e.prm(Prm.MAX_MP).total + 1);
        });
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
                appearLv: 0, img: new Img("img/unit/unit0.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.MAX_HP, 1]],
                learningTecs: () => [Tec.タックル, Tec.HP自動回復, Tec.大いなる動き],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.殴る, Tec.練気];
        }
    };
    Job.訓練生二年生 = new class extends Job {
        constructor() {
            super({ uniqueName: "訓練生二年生", info: "",
                appearLv: 30, img: new Img("img/unit/unit1.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.MAX_HP, 1]],
                learningTecs: () => [Tec.癒しの風, Tec.我慢, Tec.何もしない],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.殴る, Tec.癒しの風, Tec.大いなる動き];
        }
    };
    Job.シーフ = new class extends Job {
        constructor() {
            super({ uniqueName: "シーフ", info: "",
                appearLv: 40, img: new Img("img/unit/unit8.png"),
                lvupExp: Job.DEF_LVUP_EXP,
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
                appearLv: 15, img: new Img("img/unit/unit2.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.STR, 1]],
                learningTecs: () => [Tec.格闘攻撃UP, Tec.格闘防御UP, Tec.防御, Tec.印, Tec.涅槃寂静],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.タックル, Tec.タックル, Tec.格闘防御UP, Tec.防御];
        }
    };
    Job.剣士 = new class extends Job {
        constructor() {
            super({ uniqueName: "剣士", info: "",
                appearLv: 7, img: new Img("img/unit/unit3.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.STR, 1]],
                learningTecs: () => [Tec.斬る, Tec.パワーファクト, Tec.閻魔の笏],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.斬る, Tec.斬る, Tec.斬る, Tec.斬る, Tec.パワーファクト, Tec.閻魔の笏];
        }
    };
    Job.忍者 = new class extends Job {
        constructor() {
            super({ uniqueName: "忍者", info: "",
                appearLv: 50, img: new Img("img/unit/unit13.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
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
                appearLv: 5, img: new Img("img/unit/unit5.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.MAG, 1]],
                learningTecs: () => [Tec.ヴァハ, Tec.魔法攻撃UP, Tec.エヴィン, Tec.ジョンD],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.ヴァハ, Tec.殴る, Tec.殴る, Tec.殴る, Tec.ジョンD];
        }
    };
    Job.ウィザード = new class extends Job {
        constructor() {
            super({ uniqueName: "ウィザード", info: "魔法攻撃を扱う職業",
                appearLv: 55, img: new Img("img/unit/unit16.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.MAG, 2]],
                learningTecs: () => [Tec.オグマ, Tec.ルー, Tec.エヴァ],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.オグマ, Tec.ルー, Tec.エヴァ, Tec.殴る];
        }
    };
    Job.天使 = new class extends Job {
        constructor() {
            super({ uniqueName: "天使", info: "",
                appearLv: 12, img: new Img("img/unit/unit10.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.LIG, 1]],
                learningTecs: () => [Tec.MP自動回復, Tec.天籟, Tec.数珠, Tec.ユグドラシル],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.天籟, Tec.数珠, Tec.数珠, Tec.数珠, Tec.殴る, Tec.殴る, Tec.ユグドラシル, Tec.空中浮遊];
        }
    };
    Job.毒使い = new class extends Job {
        constructor() {
            super({ uniqueName: "毒使い", info: "",
                appearLv: 20, img: new Img("img/unit/unit6.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.DRK, 1]],
                learningTecs: () => [Tec.ポイズンバタフライ, Tec.セル, Tec.恵まれし者],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.ヴァハ, Tec.殴る, Tec.ポイズンバタフライ, Tec.ポイズンバタフライ, Tec.恵まれし者];
        }
    };
    Job.鎖使い = new class extends Job {
        constructor() {
            super({ uniqueName: "鎖使い", info: "",
                appearLv: 52, img: new Img("img/unit/unit7.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.CHN, 1]],
                learningTecs: () => [Tec.スネイク, Tec.アンドロメダ],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.スネイク, Tec.スネイク, Tec.殴る, Tec.殴る, Tec.アンドロメダ];
        }
    };
    Job.スネイカー = new class extends Job {
        constructor() {
            super({ uniqueName: "スネイカー", info: "",
                appearLv: 72, img: new Img("img/unit/unit22.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
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
                appearLv: 32, img: new Img("img/unit/unit11.png"),
                lvupExp: Job.DEF_LVUP_EXP,
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
                appearLv: 22, img: new Img("img/unit/unit4.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.GUN, 1]],
                learningTecs: () => [Tec.撃つ, Tec.スコープ, Tec.弐丁拳銃, Tec.あがらない雨],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.撃つ, Tec.撃つ, Tec.撃つ, Tec.殴る, Tec.殴る, Tec.弐丁拳銃];
        }
    };
    /**TODO. */
    Job.機械士 = new class extends Job {
        constructor() {
            super({ uniqueName: "機械士", info: "",
                appearLv: 75, img: new Img("img/unit/unit12.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.GUN, 1]],
                learningTecs: () => [Tec.機械仕掛け, Tec.レーザー, Tec.メガトン],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.撃つ, Tec.レーザー, Tec.レーザー, Tec.殴る, Tec.撃つ, Tec.撃つ, Tec.メガトン, Tec.機械仕掛け];
        }
    };
    Job.アーチャー = new class extends Job {
        constructor() {
            super({ uniqueName: "アーチャー", info: "",
                appearLv: 25, img: new Img("img/unit/unit9.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                growthPrms: () => [[Prm.ARR, 1]],
                learningTecs: () => [Tec.射る, Tec.一点集中, Tec.アスラの矢],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.射る, Tec.射る, Tec.殴る, Tec.殴る];
        }
    };
    Job.クピド = new class extends Job {
        constructor() {
            super({ uniqueName: "クピド", info: "",
                appearLv: 35, img: new Img("img/unit/unit23.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
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
                appearLv: 25, img: new Img("img/unit/unit14.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.DRK, 1]],
                learningTecs: () => [Tec.吸血, Tec.VAMPIRE_VLOODY_STAR],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.暗黒剣, Tec.暗黒剣, Tec.吸血, Tec.殴る, Tec.殴る, Tec.吸血, Tec.吸血, Tec.VAMPIRE_VLOODY_STAR];
        }
    };
    Job.霊術戦士 = new class extends Job {
        constructor() {
            super({ uniqueName: "霊術戦士", info: "",
                appearLv: 80, img: new Img("img/unit/unit20.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.STR, 1], [Prm.DRK, 1]],
                learningTecs: () => [Tec.怨霊使い, Tec.鎌, Tec.怨霊回復],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.怨霊使い, Tec.鎌, Tec.怨霊回復, Tec.殴る, Tec.死神の鎌, Tec.鎌, Tec.鎌, Tec.パワーファクト];
        }
    };
    Job.暗黒戦士 = new class extends Job {
        constructor() {
            super({ uniqueName: "暗黒戦士", info: "",
                appearLv: 75, img: new Img("img/unit/unit21.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.DRK, 2]],
                learningTecs: () => [Tec.暗黒剣, Tec.衝動, Tec.宵闇, Tec.自爆],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.暗黒剣, Tec.暗黒剣, Tec.暗黒剣, Tec.吸血, Tec.殴る];
        }
    };
    Job.ホークマン = new class extends Job {
        constructor() {
            super({ uniqueName: "ホークマン", info: "",
                appearLv: 75, img: new Img("img/unit/unit15.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.STR, 1], [Prm.ARR, 1]],
                learningTecs: () => [Tec.空中浮遊, Tec.槍, Tec.煙幕],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.槍, Tec.槍, Tec.槍, Tec.殴る, Tec.殴る, Tec.槍, Tec.空中浮遊, Tec.煙幕];
        }
    };
    Job.テンプルナイト = new class extends Job {
        constructor() {
            super({ uniqueName: "テンプルナイト", info: "防御に厚く、聖剣をふるう",
                appearLv: 85, img: new Img("img/unit/unit17.png"),
                lvupExp: Job.DEF_LVUP_EXP * 3,
                growthPrms: () => [[Prm.STR, 1], [Prm.LIG, 1]],
                learningTecs: () => [Tec.かばう, Tec.聖なる守護, Tec.聖剣, Tec.光の護封剣],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.かばう, Tec.聖なる守護, Tec.聖なる守護, Tec.殴る, Tec.聖剣, Tec.光の護封剣, Tec.光の護封剣];
        }
    };
    Job.精霊使い = new class extends Job {
        constructor() {
            super({ uniqueName: "精霊使い", info: "",
                appearLv: 55, img: new Img("img/unit/unit19.png"),
                lvupExp: Job.DEF_LVUP_EXP * 3,
                growthPrms: () => [[Prm.MAX_MP, 1], [Prm.MAG, 1]],
                learningTecs: () => [Tec.ドゥエルガル, Tec.ネーレイス, Tec.ヴァルナ, Tec.イリューガー],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ドゥエルガル, Tec.ネーレイス, Tec.ヴァルナ, Tec.イリューガー, Tec.殴る, Tec.殴る, Tec.殴る];
        }
    };
    Job.侍 = new class extends Job {
        constructor() {
            super({ uniqueName: "侍", info: "",
                appearLv: 65, img: new Img("img/unit/unit24.png"),
                lvupExp: Job.DEF_LVUP_EXP * 3,
                growthPrms: () => [[Prm.MAX_HP, 1], [Prm.STR, 1]],
                learningTecs: () => [Tec.格闘連携, Tec.格闘能力UP, Tec.時雨, Tec.五月雨],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.五月雨, Tec.時雨, Tec.格闘連携, Tec.格闘能力UP, Tec.殴る, Tec.殴る, Tec.殴る];
        }
    };
    Job.ガーディアン = new class extends Job {
        constructor() {
            super({ uniqueName: "ガーディアン", info: "",
                appearLv: 75, img: new Img("img/unit/unit25.png"),
                lvupExp: Job.DEF_LVUP_EXP * 3,
                growthPrms: () => [[Prm.MAG, 1], [Prm.LIG, 1]],
                learningTecs: () => [Tec.ガブリエル, Tec.HPMP回復, Tec.ラファエル, Tec.ウリエル],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.レーザー, Tec.HPMP回復, Tec.ガブリエル, Tec.ラファエル, Tec.ウリエル, Tec.格闘能力UP, Tec.殴る, Tec.殴る, Tec.殴る];
            const c = choice([Condition.格鎖無効, Condition.魔過無効, Condition.銃弓無効]);
            e.setCondition(c, 5);
        }
    };
    Job.考古学者 = new class extends Job {
        constructor() {
            super({ uniqueName: "考古学者", info: "未実装",
                appearLv: 60, img: new Img("img/unit/unit26.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.CHN, 1], [Prm.PST, 1]],
                learningTecs: () => [],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.念力, Tec.スネイク, Tec.射る, Tec.撃つ, Tec.殴る, Tec.殴る, Tec.殴る];
        }
    };
    Job.落武者 = new class extends Job {
        constructor() {
            super({ uniqueName: "落武者", info: "",
                appearLv: 100, img: new Img("img/unit/unit27.png"),
                lvupExp: Job.DEF_LVUP_EXP * 3,
                growthPrms: () => [[Prm.STR, 1], [Prm.DRK, 1]],
                learningTecs: () => [Tec.武者鎌, Tec.成仏, Tec.怨霊回復3, Tec.アンデッド],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.怨霊使い, Tec.鎌, Tec.武者鎌, Tec.時雨, Tec.五月雨, Tec.殴る, Tec.殴る, Tec.成仏];
        }
    };
    Job.アルケミスト = new class extends Job {
        constructor() {
            super({ uniqueName: "アルケミスト", info: "",
                appearLv: 160, img: new Img("img/unit/unit28.png"),
                lvupExp: Job.DEF_LVUP_EXP * 3,
                growthPrms: () => [[Prm.MAG, 1], [Prm.LIG, 1], [Prm.CHN, 1]],
                learningTecs: () => [Tec.マーメイド, Tec.ホムンクルス, Tec.フランケンシュタイン, Tec.死体除去],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.マーメイド, Tec.ホムンクルス, Tec.フランケンシュタイン, Tec.死体除去, Tec.殴る, Tec.殴る, Tec.念, Tec.数珠];
        }
    };
    Job.密猟ハンター = new class extends Job {
        constructor() {
            super({ uniqueName: "密猟ハンター", info: "",
                appearLv: 140, img: new Img("img/unit/unit29.png"),
                lvupExp: Job.DEF_LVUP_EXP * 3,
                growthPrms: () => [[Prm.MAX_HP, 1], [Prm.GUN, 1], [Prm.ARR, 1]],
                learningTecs: () => [Tec.捕獲],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.撃つ, Tec.射る, Tec.ヤクシャ, Tec.殴る, Tec.殴る, Tec.スコープ, Tec.あがらない雨];
        }
    };
    Job.医師 = new class extends Job {
        constructor() {
            super({ uniqueName: "医師", info: "",
                appearLv: 140, img: new Img("img/unit/unit30.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.MAX_MP, 1], [Prm.LIG, 1]],
                learningTecs: () => [Tec.衛生, Tec.解毒, Tec.良き占い],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.衛生, Tec.数珠, Tec.良き占い, Tec.天籟, Tec.殴る, Tec.MP自動回復, Tec.エリス];
        }
    };
    Job.魔砲士 = new class extends Job {
        constructor() {
            super({ uniqueName: "魔砲士", info: "",
                appearLv: 64, img: new Img("img/unit/unit31.png"),
                lvupExp: Job.DEF_LVUP_EXP * 2,
                growthPrms: () => [[Prm.MAG, 1], [Prm.GUN, 1]],
                learningTecs: () => [Tec.大砲, Tec.羊飼いの銃, Tec.魔砲, Tec.乱射],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.撃つ, Tec.大砲, Tec.羊飼いの銃, Tec.殴る, Tec.魔砲, Tec.乱射];
        }
    };
    // export const                         サマナー:Job = new class extends Job{
    //     constructor(){super({uniqueName:"サマナー", info:"絵画から伝説の獣を呼び出す",
    //                             appearLv:125, img:new Img("img/unit/unit18.png"),
    //                             lvupExp:Job.DEF_LVUP_EXP * 3,
    //                             growthPrms:()=>[[Prm.MAX_MP, 1], [Prm.MAX_TP, 1]],
    //                             learningTecs:()=>[],
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.かばう, Tec.聖なる守護, Tec.聖なる守護, Tec.殴る, Tec.聖剣, Tec.光の護封剣, Tec.光の護封剣];
    //     }
    // };
    //--------------------------------------------------
    //
    //獣
    //
    //--------------------------------------------------
    Job.雷鳥 = new class extends Job {
        constructor() {
            super({ uniqueName: "雷鳥", info: "",
                appearLv: 0, img: new Img("img/unit/unit100.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.ARR, 1]],
                learningTecs: () => [Tec.空中浮遊, Tec.射る],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.射る, Tec.射る, Tec.ヴァハ, Tec.殴る, Tec.空中浮遊];
        }
    };
    Job.アメーバ = new class extends Job {
        constructor() {
            super({ uniqueName: "アメーバ", info: "",
                appearLv: 8, img: new Img("img/unit/unit101.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.MAX_MP, 1]],
                learningTecs: () => [Tec.弱体液, Tec.セル, Tec.被膜],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.弱体液, Tec.タックル, Tec.殴る, Tec.セル, Tec.被膜];
        }
    };
    Job.妖精 = new class extends Job {
        constructor() {
            super({ uniqueName: "妖精", info: "",
                appearLv: 0, img: new Img("img/unit/unit102.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.MAG, 1]],
                learningTecs: () => [Tec.妖精の粉, Tec.MP自動回復],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.妖精の粉, Tec.妖精の粉, Tec.ヴァハ, Tec.殴る, Tec.MP自動回復];
        }
    };
    Job.鬼火 = new class extends Job {
        constructor() {
            super({ uniqueName: "鬼火", info: "",
                appearLv: 10, img: new Img("img/unit/unit103.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.MAG, 1]],
                learningTecs: () => [Tec.ファイアボール, Tec.魔法攻撃UP, Tec.自爆],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ファイアボール, Tec.ファイアボール, Tec.殴る, Tec.殴る, Tec.魔法攻撃UP];
        }
    };
    Job.ノーム = new class extends Job {
        constructor() {
            super({ uniqueName: "ノーム", info: "",
                appearLv: 10, img: new Img("img/unit/unit104.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.LIG, 1]],
                learningTecs: () => [Tec.光合成, Tec.HP自動回復, Tec.良き占い],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.光合成, Tec.良き占い, Tec.殴る, Tec.殴る, Tec.殴る];
        }
    };
    Job.チルナノーグ = new class extends Job {
        constructor() {
            super({ uniqueName: "チルナノーグ", info: "",
                appearLv: 70, img: new Img("img/unit/unit105.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.PST, 2]],
                learningTecs: () => [Tec.スモッグ, Tec.雲隠れ, Tec.念力],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.スモッグ, Tec.雲隠れ, Tec.念力, Tec.殴る, Tec.殴る, Tec.殴る, Tec.チルナノーグ];
        }
    };
    Job.魔獣ドンゴ = new class extends Job {
        constructor() {
            super({ uniqueName: "魔獣ドンゴ", info: "",
                appearLv: 130, img: new Img("img/unit/unit106.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.STR, 1]],
                learningTecs: () => [Tec.体当たり, Tec.格闘攻撃UP, Tec.格闘防御UP],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.体当たり, Tec.格闘攻撃UP, Tec.格闘防御UP, Tec.殴る, Tec.殴る, Tec.体当たり, Tec.タックル];
            e.prm(Prm.MAX_HP).base *= 1.5;
        }
    };
    Job.カリストコウモリ = new class extends Job {
        constructor() {
            super({ uniqueName: "カリストコウモリ", info: "",
                appearLv: 13, img: new Img("img/unit/unit107.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.DRK, 1], [Prm.ARR, 1]],
                learningTecs: () => [Tec.ひっかく, Tec.空中浮遊, Tec.吸血],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ひっかく, Tec.吸血, Tec.ひっかく, Tec.殴る, Tec.殴る, Tec.空中浮遊];
        }
    };
    //
    Job.ドラゴン = new class extends Job {
        constructor() {
            super({ uniqueName: "ドラゴン", info: "",
                appearLv: 295, img: new Img("img/unit/unit108.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.MAX_HP, 2]],
                learningTecs: () => [Tec.自然治癒, Tec.龍撃, Tec.ドラゴンテイル, Tec.ドラゴンブレス],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ドラゴンテイル, Tec.ドラゴンテイル, Tec.龍撃, Tec.殴る, Tec.自然治癒];
            e.prm(Prm.MAX_HP).base *= 2;
        }
    };
    Job.月狼 = new class extends Job {
        constructor() {
            super({ uniqueName: "月狼", info: "",
                appearLv: 95, img: new Img("img/unit/unit109.png"),
                lvupExp: Job.DEF_LVUP_EXP * 1,
                growthPrms: () => [[Prm.STR, 2]],
                learningTecs: () => [Tec.噛みつく, Tec.回避UP, Tec.練気],
                beast: true,
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.噛みつく, Tec.回避UP, Tec.練気, Tec.殴る, Tec.自然治癒];
        }
    };
})(Job || (Job = {}));
