import { PUnit, Prm, Unit } from "./unit.js";
import { Tec } from "./tec.js";
import { Job } from "./job.js";
import { Eq } from "./eq.js";
import { Img } from "./graphics/texture.js";
export class Player {
    constructor(uniqueName, sex) {
        this.uniqueName = uniqueName;
        this.sex = sex;
        this.member = false;
        this.toString = () => this.uniqueName;
        Player._values.push(this);
        Player._valueOf.set(this.uniqueName, this);
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) { return this._valueOf.get(uniqueName); }
    get ins() {
        if (!this._ins) {
            this._ins = this.create();
        }
        return this._ins;
    }
    calcJobChangeList() {
        const map = new Map();
        this.setJobChangeList(map);
        const u = this.ins;
        return Job.values.filter(job => map.has(job) || u.getJobLv(job) >= 1);
    }
    create() {
        let res = new PUnit(this);
        res.name = this.toString();
        res.exists = true;
        res.dead = false;
        this.createInner(res);
        res.prm(Prm.HP).base = res.prm(Prm.MAX_HP).total;
        res.tecs.filter(tec => tec !== Tec.empty)
            .forEach(tec => res.setMasteredTec(tec, true));
        return res;
    }
    /**プレイヤーの加入処理。 */
    join() {
        this.member = true;
        for (let i = 0; i < Unit.players.length; i++) {
            if (Unit.players[i].player === Player.empty) {
                Unit.setPlayer(i, this);
                break;
            }
        }
    }
}
Player._values = [];
Player._valueOf = new Map();
//セーブデータの互換性のため、プレイヤーの定義の順番をかえてはいけない。
(function (Player) {
    Player.empty = new class extends Player {
        constructor() { super("empty", "♂"); }
        createInner(p) {
            p.exists = false;
        }
        setJobChangeList(map) { }
    };
    Player.ルイン = new class extends Player {
        constructor() { super("ルイン", "♂"); }
        createInner(p) {
            p.job = Job.訓練生;
            p.img = new Img("img/unit/p_ruin.png");
            p.prm(Prm.MAX_HP).base = 20;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 2;
            p.prm(Prm.STR).base = 3;
            p.tecs = [
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map) { setDefJobChangeList(map, this.ins); }
    };
    Player.ピアー = new class extends Player {
        constructor() { super("ピアー", "♂"); }
        createInner(p) {
            p.job = Job.魔法使い;
            p.img = new Img("img/unit/p_pea.png");
            p.prm(Prm.MAX_HP).base = 16;
            p.prm(Prm.MAX_MP).base = 4;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 1;
            p.prm(Prm.MAG).base = 4;
            p.tecs = [
                Tec.殴る,
                Tec.ヴァハ,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map) {
            map.set(Job.魔法使い, true);
            setDefJobChangeList(map, this.ins);
        }
    };
    Player.一号 = new class extends Player {
        constructor() { super("一号", "♂"); }
        createInner(p) {
            p.job = Job.暗黒戦士;
            p.img = new Img("img/unit/p_1.png");
            p.prm(Prm.MAX_HP).base = 30;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 2;
            p.prm(Prm.DRK).base = 5;
            p.tecs = [
                Tec.暗黒剣,
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map) {
            map.set(Job.暗黒戦士, true);
            setDefJobChangeList(map, this.ins);
        }
    };
    Player.雪 = new class extends Player {
        constructor() { super("雪", "♂"); }
        createInner(p) {
            p.job = Job.鎖使い;
            p.img = new Img("img/unit/p_yuki.png");
            p.prm(Prm.MAX_HP).base = 20;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 2;
            p.prm(Prm.STR).base = 1;
            p.prm(Prm.CHN).base = 6;
            p.tecs = [
                Tec.スネイク,
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
            p.setEq(Eq.ハルのカフス.pos, Eq.ハルのカフス);
        }
        setJobChangeList(map) {
            map.set(Job.鎖使い, true);
            setDefJobChangeList(map, this.ins);
        }
    };
    Player.ベガ = new class extends Player {
        constructor() { super("ベガ", "♂"); }
        createInner(p) {
            p.job = Job.ドラゴン;
            p.img = new Img("img/unit/unit108.png");
            p.prm(Prm.MAX_HP).base = 70;
            p.prm(Prm.MAX_MP).base = 0;
            p.prm(Prm.MAX_TP).base = 3;
            p.prm(Prm.STR).base = 8;
            p.tecs = [
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map) {
            // setDefJobChangeList(map, this.ins);
            map.set(Job.ドラゴン, true);
            setBeastJobChangeList(map, this.ins);
        }
    };
    Player.luka = new class extends Player {
        constructor() { super("luka", "♀"); }
        createInner(p) {
            p.job = Job.カウボーイ;
            p.img = new Img("img/unit/p_luka.png");
            p.prm(Prm.MAX_HP).base = 35;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 2;
            p.prm(Prm.GUN).base = 25;
            p.tecs = [
                Tec.撃つ,
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map) {
            setDefJobChangeList(map, this.ins);
        }
    };
    // export const             ジスロフ = new class extends Player{
    //     constructor(){super("ジスロフ", "♂");}
    //     createInner(p:PUnit){
    //         p.job = Job.カウボーイ;
    //         p.img = new Img("img/unit/p_luka.png");
    //         p.prm(Prm.MAX_HP).base = 35;
    //         p.prm(Prm.MAX_MP).base = 1;
    //         p.prm(Prm.MAX_TP).base = 2;
    //         p.prm(Prm.GUN).base = 25;
    //         p.tecs = [
    //             Tec.撃つ,
    //             Tec.殴る,
    //             Tec.empty,
    //             Tec.empty,
    //             Tec.empty,
    //         ];
    //     }
    //     setJobChangeList(map:Map<Job,true>){
    //         setDefJobChangeList(map, this.ins);
    //     }
    // };
    // export const             ナナ = new class extends Player{
    //     constructor(){super("ナナ", "♂");}
    //     createInner(p:PUnit){
    //         p.job = Job.僧兵;
    //         p.img = new Img("img/unit/p_luka.png");
    //         p.prm(Prm.MAX_HP).base = 35;
    //         p.prm(Prm.MAX_MP).base = 1;
    //         p.prm(Prm.MAX_TP).base = 2;
    //         p.prm(Prm.GUN).base = 25;
    //         p.tecs = [
    //             Tec.撃つ,
    //             Tec.殴る,
    //             Tec.empty,
    //             Tec.empty,
    //             Tec.empty,
    //         ];
    //     }
    //     setJobChangeList(map:Map<Job,true>){
    // map.set(Job.僧兵, true);
    //         setDefJobChangeList(map, this.ins);
    //     }
    // };
})(Player || (Player = {}));
const setDefJobChangeList = (map, u) => {
    const add = (addJob, checkJobs) => {
        for (const job of checkJobs) {
            if (!u.isMasteredJob(job)) {
                return;
            }
        }
        map.set(addJob, true);
    };
    map.set(Job.訓練生, true);
    add(Job.訓練生二年生, [Job.訓練生]);
    add(Job.格闘家, [Job.訓練生二年生]);
    add(Job.体術士, [Job.格闘家, Job.テンプルナイト, Job.ホークマン]);
    add(Job.シーフ, [Job.訓練生二年生]);
    add(Job.考古学者, [Job.シーフ, Job.ダウザー]);
    add(Job.密猟ハンター, [Job.考古学者, Job.カウボーイ]);
    add(Job.剣士, [Job.訓練生]);
    add(Job.忍者, [Job.剣士, Job.シーフ]);
    if (u.player.sex === "♂") {
        add(Job.侍, [Job.剣士, Job.格闘家]);
        add(Job.勇者, [Job.忍者, Job.テンプルナイト, Job.侍, Job.ガーディアン, Job.ホークマン]);
    }
    add(Job.魔法使い, [Job.訓練生]);
    add(Job.ウィザード, [Job.魔法使い]);
    add(Job.アルケミスト, [Job.ウィザード, Job.考古学者]);
    add(Job.天使, [Job.訓練生]);
    add(Job.テンプルナイト, [Job.天使, Job.訓練生二年生]);
    add(Job.ガーディアン, [Job.天使, Job.精霊使い]);
    add(Job.医師, [Job.天使]);
    add(Job.毒使い, [Job.訓練生]);
    add(Job.落武者, [Job.毒使い, Job.侍, Job.霊術戦士]);
    add(Job.鎖使い, [Job.訓練生]);
    add(Job.スネイカー, [Job.鎖使い]);
    add(Job.ダウザー, [Job.訓練生]);
    add(Job.カウボーイ, [Job.訓練生]);
    add(Job.魔砲士, [Job.カウボーイ, Job.魔法使い]);
    add(Job.霊弾の射手, [Job.魔砲士, Job.霊術戦士]);
    add(Job.機械士, [Job.カウボーイ]);
    add(Job.ロボット, [Job.機械士]);
    add(Job.ミサイリスト, [Job.機械士, Job.魔砲士]);
    add(Job.軍人, [Job.ミサイリスト, Job.考古学者]);
    add(Job.アーチャー, [Job.訓練生]);
    add(Job.クピド, [Job.アーチャー, Job.格闘家]);
};
const setBeastJobChangeList = (map, u) => {
    const add = (addJob, checkJobs) => {
        for (const job of checkJobs) {
            if (!u.isMasteredJob(job)) {
                return;
            }
        }
        map.set(addJob, true);
    };
    add(Job.アメーバ, [Job.ドラゴン]);
    add(Job.鬼火, [Job.アメーバ]);
    add(Job.チルナノーグ, [Job.アメーバ]);
    add(Job.アングラ, [Job.アメーバ, Job.魔獣ドンゴ]);
    add(Job.ノーム, [Job.ドラゴン]);
    add(Job.妖精, [Job.ノーム]);
    add(Job.アイス, [Job.ノーム, Job.チルナノーグ]);
    add(Job.カリストコウモリ, [Job.ドラゴン]);
    add(Job.雷鳥, [Job.カリストコウモリ]);
    add(Job.魔獣ドンゴ, [Job.雷鳥]);
    add(Job.月狼, [Job.魔獣ドンゴ]);
};
