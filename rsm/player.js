import { PUnit, Prm, Unit } from "./unit.js";
import { Tec } from "./tec.js";
import { Job } from "./job.js";
import { Img } from "./graphics/graphics.js";
export class Player {
    constructor(uniqueName) {
        this.uniqueName = uniqueName;
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
(function (Player) {
    Player.empty = new class extends Player {
        constructor() { super("empty"); }
        createInner(p) {
            p.exists = false;
        }
    };
    Player.ルイン = new class extends Player {
        constructor() { super("ルイン"); }
        createInner(p) {
            p.job = Job.訓練生;
            p.img = new Img("img/ルイン.png");
            p.prm(Prm.MAX_HP).base = 20;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 2;
            p.tecs = [
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
    };
    Player.ピアー = new class extends Player {
        constructor() { super("ピアー"); }
        createInner(p) {
            p.job = Job.魔法使い;
            p.setJobLv(Job.魔法使い, 1);
            p.img = new Img("img/ピアー.png");
            p.prm(Prm.MAX_HP).base = 16;
            p.prm(Prm.MAX_MP).base = 5;
            p.prm(Prm.MAX_TP).base = 0;
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
    };
})(Player || (Player = {}));
