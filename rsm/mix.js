import { Util } from "./util.js";
import { Color } from "./undym/type.js";
export class Num {
    static add(obj, v) {
        v = v | 0;
        if (v > 0) {
            const newItem = obj.totalGetCount === 0;
            if (newItem) {
                Util.msg.set("new", Color.rainbow);
            }
            else {
                Util.msg.set("");
            }
            obj.num += v;
            obj.totalGetCount += v;
            Util.msg.add(`[${obj}]を${v}個手に入れた(${obj.num})`, cnt => Color.GREEN.wave(Color.YELLOW, cnt));
            if (newItem && obj.info.length > 0) {
                Util.msg.set(`"`, Color.YELLOW);
                Util.msg.add(obj.info, Color.YELLOW);
                Util.msg.add(`"`, Color.YELLOW);
            }
        }
        if (v < 0) {
            obj.num += v;
        }
    }
}
export class Mix {
    /**
     *
     * limit:合成限界.
     * action:合成時に発生する効果。
     */
    constructor(args) {
        this.args = args;
        /**合成回数. */
        this.count = 0;
        Mix._values.push(this);
        if (Mix._valueOf.has(args.uniqueName)) {
            console.log("Mix._valueOf.has:", `"${args.uniqueName}"`);
        }
        else {
            Mix._valueOf.set(args.uniqueName, this);
        }
    }
    static get values() { return this._values; }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
    // readonly materials:{object:Num, num:number}[] = [];
    // readonly result:{object:Num, num:number}|undefined;
    get materials() {
        let res = [];
        for (const m of this.args.materials()) {
            res.push({ object: m[0], num: m[1] });
        }
        return res;
    }
    get result() {
        const res = this.args.result;
        if (res) {
            const r = res();
            return { object: r[0], num: r[1] };
        }
        return undefined;
    }
    get countLimit() { return this.args.limit ? this.args.limit : Mix.LIMIT_INF; }
    get uniqueName() { return this.args.uniqueName; }
    get info() { return this.args.info; }
    toString() { return this.uniqueName; }
    isVisible() {
        if (!this.materials) {
            return false;
        }
        if (this.args.isVisible && !this.args.isVisible()) {
            return false;
        }
        return this.materials[0].object.totalGetCount > 0 && this.count < this.countLimit;
    }
    canRun() {
        if (this.countLimit !== Mix.LIMIT_INF && this.count >= this.countLimit) {
            return false;
        }
        for (let m of this.materials) {
            if (m.object.num < m.num) {
                return false;
            }
        }
        return true;
    }
    run() {
        if (!this.canRun()) {
            return;
        }
        this.count++;
        for (let m of this.materials) {
            m.object.add(-m.num);
        }
        if (this.result) {
            this.result.object.add(this.result.num);
        }
        if (this.args.action) {
            this.args.action();
        }
    }
}
Mix._values = [];
Mix._valueOf = new Map();
Mix.LIMIT_INF = Number.POSITIVE_INFINITY;
