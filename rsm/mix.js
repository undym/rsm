import { Util } from "./util.js";
import { Color } from "./undym/type.js";
import { Item } from "./item.js";
import { Player } from "./player.js";
import { Prm } from "./unit.js";
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
        return this.args.isVisible() && this.count < this.countLimit;
        // if(!this.materials){return false;}
        // if(this.args.isVisible && !this.args.isVisible()){return false;}
        // return this.materials[0].object.totalGetCount > 0 && this.count < this.countLimit;
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
(function (Mix) {
    //--------------------------------------------------------
    //
    //建築
    //
    //--------------------------------------------------------
    const ルインドアースLv1 = new Mix({
        uniqueName: "ルインドアースLv1", limit: 1, info: "",
        materials: () => [[Item.石, 1],],
        isVisible: () => true,
    });
    const ルインドアースLv2 = new Mix({
        uniqueName: "ルインドアースLv2", limit: 1, info: "",
        materials: () => [[Item.水, 4],],
        isVisible: () => ルインドアースLv1.count > 0,
    });
    const ルインドアースLv3 = new Mix({
        uniqueName: "ルインドアースLv3", limit: 1, info: "",
        materials: () => [[Item.草, 6],],
        isVisible: () => ルインドアースLv2.count > 0,
    });
    const ルインドアースLv4 = new Mix({
        uniqueName: "ルインドアースLv4", limit: 1, info: "",
        materials: () => [[Item.竹材, 2],],
        isVisible: () => ルインドアースLv3.count > 0,
    });
    const ルインドアースLv5 = new Mix({
        uniqueName: "ルインドアースLv5", limit: 1, info: "",
        materials: () => [[Item.銅板, 2], [Item.針金, 3],],
        isVisible: () => ルインドアースLv4.count > 0,
    });
    const ルインドアースLv6 = new Mix({
        uniqueName: "ルインドアースLv6", limit: 1, info: "",
        materials: () => [[Item.銅板, 2], [Item.合板, 4],],
        isVisible: () => ルインドアースLv5.count > 0,
    });
    const ルインドアースLv7 = new Mix({
        uniqueName: "ルインドアースLv7", limit: 1, info: "",
        materials: () => [[Item.クワ, 10],],
        isVisible: () => ルインドアースLv6.count > 0,
    });
    const ルインドアースLv8 = new Mix({
        uniqueName: "ルインドアースLv8", limit: 1, info: "",
        materials: () => [[Item.粘土, 5], [Item.ガラス, 5], [Item.桜, 2]],
        isVisible: () => ルインドアースLv7.count > 0,
    });
    const ルインドアースLv9 = new Mix({
        uniqueName: "ルインドアースLv9", limit: 1, info: "",
        materials: () => [[Item.ファーストキス, 3],],
        isVisible: () => ルインドアースLv8.count > 0,
    });
    const ルインドアースLv10 = new Mix({
        uniqueName: "ルインドアースLv10", limit: 1, info: "",
        materials: () => [[Item.サクラ材, 4], [Item.松材, 4], [Item.エデン樹, 4]],
        isVisible: () => ルインドアースLv9.count > 0,
    });
    Mix.瞑想所 = new Mix({
        uniqueName: "瞑想所", limit: 1, info: "瞑想が可能になる",
        materials: () => [[Item.ヒノキ, 1], [Item.草, 5]],
        isVisible: () => ルインドアースLv1.count > 0,
    });
    Mix.転職所 = new Mix({
        uniqueName: "転職所", limit: 1, info: "職業選択の自由を得る",
        materials: () => [[Item.杉材, 1], [Item.ヒノキ材, 1]],
        isVisible: () => ルインドアースLv4.count > 0,
    });
    const 肉のスープ = new Mix({
        uniqueName: "肉のスープ", limit: 10, info: "ルインの最大HP+1",
        materials: () => [[Item.石, 3], [Item.肉, 3], [Item.水, 3]],
        isVisible: () => ルインドアースLv2.count > 0,
        action: () => {
            Player.ルイン.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const ねこじゃらし = new Mix({
        uniqueName: "ねこじゃらし", limit: 5, info: "ルインの力+1",
        materials: () => [[Item.竹材, 3], [Item.バッタ, 3], [Item.つる, 1]],
        isVisible: () => ルインドアースLv3.count > 0,
        action: () => {
            Player.ルイン.ins.prm(Prm.STR).base += 1;
        },
    });
    const 銅像 = new Mix({
        uniqueName: "銅像", limit: 5, info: "ルインの最大TP+1",
        materials: () => [[Item.銅板, 3], [Item.少女の心を持ったおっさん, 3], [Item.たんぽぽ, 1]],
        isVisible: () => ルインドアースLv4.count > 0,
        action: () => {
            Player.ルイン.ins.prm(Prm.MAX_TP).base += 1;
        },
    });
    const バッタのスープ = new Mix({
        uniqueName: "バッタのスープ", limit: 10, info: "ピアーの最大HP+1",
        materials: () => [[Item.石, 2], [Item.バッタ, 2], [Item.水, 2]],
        isVisible: () => ルインドアースLv2.count > 0,
        action: () => {
            Player.ピアー.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const ゴーグルケース = new Mix({
        uniqueName: "ゴーグルケース", limit: 5, info: "ピアーの最大MP+1",
        materials: () => [[Item.ガラス, 3], [Item.ヒノキ, 2], [Item.針金, 1]],
        isVisible: () => ルインドアースLv3.count > 0,
        action: () => {
            Player.ピアー.ins.prm(Prm.MAX_MP).base += 1;
        },
    });
    const 水晶玉 = new Mix({
        uniqueName: "水晶玉", limit: 5, info: "ピアーの魔+1",
        materials: () => [[Item.ガラス, 3], [Item.水, 2]],
        isVisible: () => ルインドアースLv4.count > 0,
        action: () => {
            Player.ピアー.ins.prm(Prm.MAG).base += 1;
        },
    });
    const 竹林 = new Mix({
        uniqueName: "竹林", limit: 1, info: "竹の加工が可能になる",
        materials: () => [[Item.竹, 3]],
        isVisible: () => ルインドアースLv3.count > 0,
    });
    const ボロ木工所 = new Mix({
        uniqueName: "ボロ木工所", limit: 1, info: "木材の加工が可能になる",
        materials: () => [[Item.杉, 3], [Item.ヒノキ, 3]],
        isVisible: () => ルインドアースLv4.count > 0,
    });
    const 小さな木工所 = new Mix({
        uniqueName: "小さな木工所", limit: 1, info: "木材の加工が可能になる",
        materials: () => [[Item.松, 3], [Item.クワ, 3]],
        isVisible: () => ルインドアースLv5.count > 0,
    });
    const 大きな木工所 = new Mix({
        uniqueName: "大きな木工所", limit: 1, info: "木材の加工が可能になる",
        materials: () => [[Item.桜, 3], [Item.松, 6]],
        isVisible: () => ルインドアースLv8.count > 0,
    });
    const ガラス工場 = new Mix({
        uniqueName: "ガラス工場", limit: 1, info: "ガラスの加工が可能になる",
        materials: () => [[Item.砂, 3], [Item.石, 1]],
        isVisible: () => ルインドアースLv3.count > 0,
    });
    const ボロ鉄工所 = new Mix({
        uniqueName: "ボロ鉄工所", limit: 1, info: "金属の加工が可能になる",
        materials: () => [[Item.鉄, 3]],
        isVisible: () => ルインドアースLv4.count > 0,
    });
    const 小さな鉄工所 = new Mix({
        uniqueName: "小さな鉄工所", limit: 1, info: "金属の加工が可能になる",
        materials: () => [[Item.銅, 3], [Item.針金, 1]],
        isVisible: () => ルインドアースLv4.count > 0,
    });
    const 大きな鉄工所 = new Mix({
        uniqueName: "大きな鉄工所", limit: 1, info: "金属の加工が可能になる",
        materials: () => [[Item.金, 4], [Item.銀, 3]],
        isVisible: () => ルインドアースLv10.count > 0,
    });
    // //--------------------------------------------------------
    // //
    // //アイテム
    // //
    // //--------------------------------------------------------
    // const           硬化スティックパン:Mix = new Mix({
    //     uniqueName:"硬化スティックパン", limit:10,
    //     result:()=>[Item.硬化スティックパン, 1],
    //     materials:()=>[[Item.はじまりの丘チール, 2], [Item.石, 5], [Item.土, 5]],
    // });
    // const           布:Mix = new Mix({
    //     uniqueName:"布", limit:Mix.LIMIT_INF,
    //     result:()=>[Item.布, 1],
    //     materials:()=>[[Item.草, 5], [Item.枝, 1]],
    //     isVisible:()=>草の服.count > 0,
    // });
    // const           兵法指南の書:Mix = new Mix({
    //     uniqueName:"兵法指南の書", limit:Mix.LIMIT_INF,
    //     result:()=>[Item.兵法指南の書, 1],
    //     materials:()=>[[Item.リテの門チール, 2], [Item.葉っぱ, 10], [Item.紙, 10]],
    // });
    // const           五輪の書:Mix = new Mix({
    //     uniqueName:"五輪の書", limit:Mix.LIMIT_INF,
    //     result:()=>[Item.五輪の書, 1],
    //     materials:()=>[[Item.クリスタル, 1], [Item.イズミジュエリー, 3], [Item.紙, 10]],
    // });
    // const           天地創造の書:Mix = new Mix({
    //     uniqueName:"天地創造の書", limit:Mix.LIMIT_INF,
    //     result:()=>[Item.天地創造の書, 1],
    //     materials:()=>[[Item.血粉末, 1], [Item.サファイア, 3], [Item.紙, 10]],
    // });
    const 兵法指南の書 = new Mix({
        uniqueName: "兵法指南の書", limit: Mix.LIMIT_INF,
        result: () => [Item.兵法指南の書, 1],
        materials: () => [[Item.ファーストキス, 3], [Item.杉材, 10], [Item.ヒノキ材, 10], [Item.針金, 6],],
        isVisible: () => ルインドアースLv9.count > 0,
    });
    const 杉材 = new Mix({
        uniqueName: "杉材", limit: Mix.LIMIT_INF,
        result: () => [Item.杉材, 1],
        materials: () => [[Item.杉, 3]],
        isVisible: () => ボロ木工所.count > 0,
    });
    const ヒノキ材 = new Mix({
        uniqueName: "ヒノキ材", limit: Mix.LIMIT_INF,
        result: () => [Item.ヒノキ材, 1],
        materials: () => [[Item.ヒノキ, 3]],
        isVisible: () => ボロ木工所.count > 0,
    });
    const 竹材 = new Mix({
        uniqueName: "竹材", limit: Mix.LIMIT_INF,
        result: () => [Item.竹材, 1],
        materials: () => [[Item.竹, 3]],
        isVisible: () => 竹林.count > 0,
    });
    const 合板 = new Mix({
        uniqueName: "合板", limit: Mix.LIMIT_INF,
        result: () => [Item.合板, 1],
        materials: () => [[Item.松, 2], [Item.クワ, 2]],
        isVisible: () => 小さな木工所.count > 0,
    });
    const サクラ材 = new Mix({
        uniqueName: "サクラ材", limit: Mix.LIMIT_INF,
        result: () => [Item.サクラ材, 1],
        materials: () => [[Item.桜, 3],],
        isVisible: () => 大きな木工所.count > 0,
    });
    const 松材 = new Mix({
        uniqueName: "松材", limit: Mix.LIMIT_INF,
        result: () => [Item.松材, 1],
        materials: () => [[Item.松, 3],],
        isVisible: () => 大きな木工所.count > 0,
    });
    const ガラス = new Mix({
        uniqueName: "ガラス", limit: Mix.LIMIT_INF,
        result: () => [Item.ガラス, 2],
        materials: () => [[Item.砂, 3]],
        isVisible: () => ガラス工場.count > 0,
    });
    const 針金 = new Mix({
        uniqueName: "針金", limit: Mix.LIMIT_INF,
        result: () => [Item.針金, 2],
        materials: () => [[Item.鉄, 3]],
        isVisible: () => ボロ鉄工所.count > 0,
    });
    const 銅板 = new Mix({
        uniqueName: "銅板", limit: Mix.LIMIT_INF,
        result: () => [Item.銅板, 2],
        materials: () => [[Item.銅, 3], [Item.針金, 1]],
        isVisible: () => 小さな鉄工所.count > 0,
    });
    const エレクトラム = new Mix({
        uniqueName: "エレクトラム", limit: Mix.LIMIT_INF,
        result: () => [Item.エレクトラム, 2],
        materials: () => [[Item.金, 3], [Item.銀, 3]],
        isVisible: () => 大きな鉄工所.count > 0,
    });
    //--------------------------------------------------------
    //
    //装備
    //
    //--------------------------------------------------------
})(Mix || (Mix = {}));
