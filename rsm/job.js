import { EUnit, Prm } from "./unit.js";
import { Tec } from "./tec.js";
import { EqPos, Eq } from "./eq.js";
import { choice } from "./undym/random.js";
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
    static rndJob(lv) {
        for (let i = 0; i < 7; i++) {
            const job = choice(Job.values);
            if (job.appearLv <= lv) {
                return job;
            }
        }
        return Job.訓練生;
    }
    static rndSetEnemy(unit, lv) {
        this.rndJob(lv).setEnemy(unit, lv);
    }
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
        e.prm(Prm.MAX_HP).base = 3 + (lv * lv * 0.35);
        e.prm(Prm.MAX_MP).base = 1 + lv / 20 + Math.random() * lv / 5;
        e.prm(Prm.MAX_TP).base = 1 + lv / 20 + Math.random() * lv / 5;
        e.tp = 0;
        e.ep = 0;
        for (const pos of EqPos.values()) {
            e.setEq(pos, Eq.rnd(pos, lv));
        }
        e.clearAllCondition();
        this.setEnemyInner(e);
        e.equip();
        e.hp = e.prm(Prm.MAX_HP).total;
        e.mp = Math.random() * (e.prm(Prm.MAX_MP).total + 1);
    }
    setEnemyInner(e) { }
}
Job._values = [];
Job._valueOf = new Map();
Job.DEF_LVUP_EXP = 5;
(function (Job) {
    Job.訓練生 = new class extends Job {
        constructor() {
            super({ uniqueName: "訓練生", info: "",
                appearLv: 0, img: new Img("img/訓練生.png"),
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
    Job.剣士 = new class extends Job {
        constructor() {
            super({ uniqueName: "剣士", info: "",
                appearLv: 7, img: new Img("img/剣士.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.STR, 1]],
                learningTecs: () => [Tec.斬る, Tec.大いなる動き],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.斬る, Tec.斬る];
        }
    };
    Job.魔法使い = new class extends Job {
        constructor() {
            super({ uniqueName: "魔法使い", info: "魔法攻撃を扱う職業",
                appearLv: 5, img: new Img("img/魔法使い.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.MAG, 1]],
                learningTecs: () => [Tec.ヴァハ, Tec.ジョンD],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.ヴァハ, Tec.殴る, Tec.殴る, Tec.殴る];
        }
    };
    Job.天使 = new class extends Job {
        constructor() {
            super({ uniqueName: "天使", info: "",
                appearLv: 12, img: new Img("img/天使.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.LIG, 1]],
                learningTecs: () => [Tec.天籟, Tec.数珠, Tec.ユグドラシル],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.天籟, Tec.数珠, Tec.数珠, Tec.数珠, Tec.殴る];
        }
    };
    Job.毒使い = new class extends Job {
        constructor() {
            super({ uniqueName: "毒使い", info: "",
                appearLv: 20, img: new Img("img/毒使い.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.DRK, 1]],
                learningTecs: () => [Tec.ポイズンバタフライ, Tec.恵まれし者],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.ヴァハ, Tec.ヴァハ, Tec.殴る, Tec.殴る, Tec.ポイズンバタフライ];
        }
    };
    Job.鎖使い = new class extends Job {
        constructor() {
            super({ uniqueName: "鎖使い", info: "",
                appearLv: 52, img: new Img("img/鎖使い.png"),
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
    Job.ダウザー = new class extends Job {
        constructor() {
            super({ uniqueName: "ダウザー", info: "",
                appearLv: 32, img: new Img("img/ダウザー.png"),
                lvupExp: Job.DEF_LVUP_EXP,
                canJobChange: p => p.isMasteredJob(Job.訓練生),
                growthPrms: () => [[Prm.PST, 1]],
                learningTecs: () => [Tec.念力, Tec.念, Tec.光の護封剣],
            });
        }
        setEnemyInner(e) {
            e.tecs = [Tec.念力, Tec.念力, Tec.念, Tec.殴る, Tec.殴る, Tec.光の護封剣];
        }
    };
    Job.ガンマン = new class extends Job {
        constructor() {
            super({ uniqueName: "ガンマン", info: "",
                appearLv: 22, img: new Img("img/ガンマン.png"),
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
    Job.アーチャー = new class extends Job {
        constructor() {
            super({ uniqueName: "アーチャー", info: "",
                appearLv: 25, img: new Img("img/アーチャー.png"),
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
    // export const                         格闘家:Job = new class extends Job{
    //     constructor(){super({uniqueName:"格闘家", info:"格闘攻撃を扱う職業",
    //                             appearLv:1,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.二回殴る, Tec.人狼剣];
    //     }
    // };
    // export const                         剣士:Job = new class extends Job{
    //     constructor(){super({uniqueName:"剣士", info:"",
    //                             appearLv:5,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.殴る, Tec.殴る, Tec.殴る, Tec.二回殴る, Tec.人狼剣, Tec.急所];
    //     }
    // };
    // export const                         騎士:Job = new class extends Job{
    //     constructor(){super({uniqueName:"騎士", info:"",
    //                             appearLv:35,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.殴る, Tec.衛生, Tec.ばんそうこう, Tec.聖剣, Tec.聖剣, Tec.天籟];
    //     }
    // };
    // export const                         ウィザード:Job = new class extends Job{
    //     constructor(){super({uniqueName:"ウィザード", info:"魔法攻撃を扱う職業",
    //                             appearLv:50,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.ヴァハ, Tec.ヴァハ,Tec.ヴァハ,Tec.ヴァハ, Tec.エヴィン, Tec.エヴィン, Tec.殴る];
    //     }
    // };
    // export const                         女神:Job = new class extends Job{
    //     constructor(){super({uniqueName:"女神", info:"",
    //                             appearLv:40,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.天籟, Tec.衛生, Tec.ばんそうこう, Tec.ばんそうこう, Tec.ひんやりゼリー, Tec.殴る];
    //         e.prm(Prm.LIG).base *= 1.5;
    //     }
    // };
    // export const                         暗黒戦士:Job = new class extends Job{
    //     constructor(){super({uniqueName:"暗黒戦士", info:"自分の身を削り強力な攻撃を放つ",
    //                             appearLv:8,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.暗黒剣, Tec.暗黒剣, Tec.殴る, Tec.殴る, Tec.殴る];
    //     }
    // };
    // export const                         ヴァンパイア:Job = new class extends Job{
    //     constructor(){super({uniqueName:"ヴァンパイア", info:"",
    //                             appearLv:40,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.暗黒剣, Tec.暗黒剣, Tec.吸血, Tec.吸心, Tec.吸心, Tec.吸心, Tec.殴る, Tec.殴る, Tec.殴る];
    //         e.prm(Prm.DRK).base *= 1.5;
    //     }
    // };
    // export const                         阿修羅:Job = new class extends Job{
    //     constructor(){super({uniqueName:"阿修羅", info:"",
    //                             appearLv:80,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.暗黒剣, Tec.暗黒剣, Tec.吸血, Tec.殴る, Tec.宵闇];
    //     }
    // };
    // export const                         ダークナイト:Job = new class extends Job{
    //     constructor(){super({uniqueName:"ダークナイト", info:"",
    //                             appearLv:50,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.インドラ, Tec.撃つ, Tec.暗黒剣, Tec.暗黒剣, Tec.吸血, Tec.殴る, Tec.宵闇];
    //     }
    // };
    // export const                         スネイカー:Job = new class extends Job{
    //     constructor(){super({uniqueName:"スネイカー", info:"蛇を虐待してる",
    //                             appearLv:20,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.スネイク, Tec.スネイク, Tec.TP自動回復, Tec.殴る, Tec.殴る, Tec.凍てつく波動];
    //     }
    // };
    // export const                         蛇使い:Job = new class extends Job{
    //     constructor(){super({uniqueName:"蛇使い", info:"",
    //                             appearLv:40,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.スネイク, Tec.スネイク, Tec.TP自動回復, Tec.殴る, Tec.コブラ, Tec.コブラ, Tec.コブラ, Tec.ハブ];
    //     }
    // };
    // export const                         触手:Job = new class extends Job{
    //     constructor(){super({uniqueName:"触手", info:"",
    //                             appearLv:40,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.スネイク, Tec.スネイク, Tec.TP自動回復, Tec.殴る, Tec.念力, Tec.念力, Tec.凍てつく波動];
    //     }
    // };
    // export const                         ダウザー:Job = new class extends Job{
    //     constructor(){super({uniqueName:"ダウザー", info:"全体攻撃に長ける",
    //                             appearLv:30,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.念力, Tec.念, Tec.念, Tec.念, Tec.念, Tec.殴る, Tec.殴る, Tec.殴る];
    //     }
    // };
    // export const                         エスパー:Job = new class extends Job{
    //     constructor(){super({uniqueName:"エスパー", info:"",
    //                             appearLv:50,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.念力, Tec.念, Tec.念, Tec.念, Tec.MP自動回復, Tec.殴る, Tec.殴る, Tec.やる気0];
    //     }
    // };
    // export const                         ハイパー:Job = new class extends Job{
    //     constructor(){super({uniqueName:"ハイパー", info:"",
    //                             appearLv:80,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.念力, Tec.念, Tec.念, Tec.念, Tec.ネガティヴフィードバック, Tec.MP自動回復, Tec.弱体液, Tec.やる気0];
    //     }
    // };
    // export const                         砲撃手:Job = new class extends Job{
    //     constructor(){super({uniqueName:"砲撃手", info:"",
    //                             appearLv:37,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.撃つ, Tec.撃つ, Tec.撃つ, Tec.二丁拳銃, Tec.二丁拳銃, Tec.殴る, Tec.殴る, Tec.テーブルシールド];
    //     }
    // };
    // export const                         アーチャー:Job = new class extends Job{
    //     constructor(){super({uniqueName:"アーチャー", info:"致命の一撃を放つ",
    //                             appearLv:10,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.射る, Tec.射る, Tec.射る, Tec.射る, Tec.殴る, Tec.殴る, Tec.インドラ];
    //     }
    // };
    // export const                         クピド:Job = new class extends Job{
    //     constructor(){super({uniqueName:"クピド", info:"",
    //                             appearLv:60,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.射る, Tec.射る, Tec.射る, Tec.射る, Tec.インドラ, Tec.殴る, Tec.フェニックスアロー];
    //     }
    // };
    // export const                         測量士:Job = new class extends Job{
    //     constructor(){super({uniqueName:"測量士", info:"",
    //                             appearLv:20,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.撃つ, Tec.撃つ, Tec.撃つ, Tec.二丁拳銃, Tec.射る, Tec.射る, Tec.インドラ, Tec.殴る];
    //     }
    // };
    // export const                         探検家 = new class extends Job{
    //     constructor(){super({uniqueName:"探検家", info:"",
    //                             appearLv:14,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.撃つ, Tec.撃つ, Tec.射る, Tec.射る, Tec.HP自動回復, Tec.天籟, Tec.便風, Tec.石肌];
    //     }
    // };
    // export const                         探求家 = new class extends Job{
    //     constructor(){super({uniqueName:"探求家", info:"",
    //                             appearLv:14,
    //     });}
    //     setEnemyInner(e:EUnit){
    //         e.tecs = [Tec.撃つ, Tec.撃つ, Tec.射る, Tec.射る, Tec.ヴァハ, Tec.暗黒剣, Tec.保湿クリーム];
    //     }
    // };
})(Job || (Job = {}));
