import { Util } from "./util.js";
import { Color } from "./undym/type.js";
import { Item } from "./item.js";
import { Player } from "./player.js";
import { Eq } from "./eq.js";
import { Prm } from "./unit.js";
import { Dungeon } from "./dungeon/dungeon.js";
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
    toString() { return this.args.to_string ? this.args.to_string : this.uniqueName; }
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
        materials: () => [[Item.草, 5],],
        isVisible: () => ルインドアースLv2.count > 0,
    });
    const ルインドアースLv4 = new Mix({
        uniqueName: "ルインドアースLv4", limit: 1, info: "",
        materials: () => [[Item.竹, 3], [Item.かんな, 1],],
        isVisible: () => ルインドアースLv3.count > 0,
    });
    const ルインドアースLv5 = new Mix({
        uniqueName: "ルインドアースLv5", limit: 1, info: "",
        materials: () => [[Item.銅板, 1], [Item.針金, 1],],
        isVisible: () => ルインドアースLv4.count > 0,
    });
    const ルインドアースLv6 = new Mix({
        uniqueName: "ルインドアースLv6", limit: 1, info: "",
        materials: () => [[Item.銅板, 2], [Item.合板, 2],],
        isVisible: () => ルインドアースLv5.count > 0,
    });
    const ルインドアースLv7 = new Mix({
        uniqueName: "ルインドアースLv7", limit: 1, info: "",
        materials: () => [[Item.クワ, 10],],
        isVisible: () => ルインドアースLv6.count > 0,
    });
    const ルインドアースLv8 = new Mix({
        uniqueName: "ルインドアースLv8", limit: 1, info: "",
        materials: () => [[Item.粘土, 5], [Item.ガラス, 3], [Item.桜, 2]],
        isVisible: () => ルインドアースLv7.count > 0,
    });
    const ルインドアースLv9 = new Mix({
        uniqueName: "ルインドアースLv9", limit: 1, info: "",
        materials: () => [[Item.ファーストキス, 3],],
        isVisible: () => ルインドアースLv8.count > 0,
    });
    const ルインドアースLv10 = new Mix({
        uniqueName: "ルインドアースLv10", limit: 1, info: "",
        materials: () => [[Item.桜, 10], [Item.松, 10], [Item.エデン樹, 4], [Item.かんな, 20]],
        isVisible: () => ルインドアースLv9.count > 0,
    });
    const ルインドアースLv11 = new Mix({
        uniqueName: "ルインドアースLv11", limit: 1, info: "",
        materials: () => [[Item.杉, 20], [Item.ヒノキ, 20], [Item.クワ, 10]],
        isVisible: () => ルインドアースLv10.count > 0,
    });
    const ルインドアースLv12 = new Mix({
        uniqueName: "ルインドアースLv12", limit: 1, info: "",
        materials: () => [[Item.うんち, 3]],
        isVisible: () => ルインドアースLv11.count > 0,
    });
    const ルインドアースLv13 = new Mix({
        uniqueName: "ルインドアースLv13", limit: 1, info: "",
        materials: () => [[Item.たんぽぽ, 30]],
        isVisible: () => ルインドアースLv12.count > 0,
    });
    const ルインドアースLv14 = new Mix({
        uniqueName: "ルインドアースLv14", limit: 1, info: "",
        materials: () => [[Item.銅板, 20], [Item.発砲ツル, 20]],
        isVisible: () => ルインドアースLv13.count > 0,
    });
    const ルインドアースLv15 = new Mix({
        uniqueName: "ルインドアースLv15", limit: 1, info: "",
        materials: () => [[Item.サクラ材, 10], [Item.クワ, 10]],
        isVisible: () => ルインドアースLv14.count > 0,
    });
    const ルインドアースLv16 = new Mix({
        uniqueName: "ルインドアースLv16", limit: 1, info: "",
        materials: () => [[Item.アリラン型岩石, 10]],
        isVisible: () => ルインドアースLv15.count > 0,
    });
    const ルインドアースLv17 = new Mix({
        uniqueName: "ルインドアースLv17", limit: 1, info: "",
        materials: () => [[Item.クヌギ, 6], [Item.バーミキュライト, 20]],
        isVisible: () => ルインドアースLv16.count > 0,
    });
    const ルインドアースLv18 = new Mix({
        uniqueName: "ルインドアースLv18", limit: 1, info: "",
        materials: () => [[Item.肉まん, 1], [Item.月の石, 1], [Item.冥石, 1]],
        isVisible: () => ルインドアースLv17.count > 0,
    });
    const ルインドアースLv19 = new Mix({
        uniqueName: "ルインドアースLv19", limit: 1, info: "",
        materials: () => [[Item.退魔の十字架, 10], [Item.血粉末, 10]],
        isVisible: () => ルインドアースLv18.count > 0,
    });
    Mix.瞑想所 = new Mix({
        uniqueName: "瞑想所", limit: 1, info: "瞑想が可能になる",
        materials: () => [[Item.ヒノキ, 1], [Item.草, 5]],
        isVisible: () => ルインドアースLv1.count > 0,
    });
    Mix.転職所 = new Mix({
        uniqueName: "転職所", limit: 1, info: "職業選択の自由を得る",
        materials: () => [[Item.杉, 3], [Item.ヒノキ, 3], [Item.かんな, 3]],
        isVisible: () => ルインドアースLv4.count > 0,
    });
    Mix.動く映写機 = new Mix({
        uniqueName: "動く映写機", limit: 1, info: "動かない映写機を修理する",
        materials: () => [[Item.にじゅうよん, 24], [Item.少女の心を持ったおっさん, 1],],
        isVisible: () => ルインドアースLv10.count > 0,
    });
    Mix.月読転移装置 = new Mix({
        uniqueName: "月読転移装置", limit: 1, info: "月に行けるようになる",
        materials: () => [[Item.タンホイザーの砂飯, 1], [Item.惑星エネルギー, 10], [Item.イリジウム, 20], [Item.モーター, 10],],
        isVisible: () => ルインドアースLv16.count > 0 && Dungeon.月狼の森.dungeonClearCount > 0,
    });
    Mix.封印の魔十字架 = new Mix({
        uniqueName: "封印の魔十字架", limit: 1, info: "魔界門を開く",
        materials: () => [[Item.退魔の十字架, 99], [Item.呪い水, 39],],
        isVisible: () => Dungeon.魔水路.dungeonClearCount > 0,
    });
    // export const    集会所:Mix = new Mix({
    //     uniqueName:"集会所", limit:1, info:"パーティースキルをセットできるようになる",
    //     materials:()=>[[Item.エレタクレヨン, 6], [Item.エデン樹, 3]],
    //     isVisible:()=>ルインドアースLv20.count > 0,
    // });
    Mix.月のレシピ = new Mix({
        uniqueName: "月のレシピ", limit: 1, info: "月小人に伝わる秘伝の装備レシピ",
        materials: () => [[Item.月の石, 1], [Item.錫, 10], [Item.粘土, 10],],
        isVisible: () => ルインドアースLv16.count > 0 && Dungeon.月狼の森.dungeonClearCount > 0,
    });
    const 肉のスープ = new Mix({
        uniqueName: "肉のスープ", limit: 10, info: "ルインの最大HP+1",
        materials: () => [[Item.石, 2], [Item.肉, 1], [Item.水, 1]],
        isVisible: () => Player.ルイン.member && ルインドアースLv2.count > 0,
        action: () => {
            Player.ルイン.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const 猫の秘薬 = new Mix({
        uniqueName: "猫の秘薬", limit: 10, info: "ルインの最大HP+1",
        materials: () => [[Item.肉, 1], [Item.水, 3]],
        isVisible: () => Player.ルイン.member && ルインドアースLv6.count > 0 && 肉のスープ.count >= 肉のスープ.countLimit,
        action: () => {
            Player.ルイン.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const ねこじゃらし = new Mix({
        uniqueName: "ねこじゃらし", limit: 10, info: "ルインの力+1",
        materials: () => [[Item.竹, 4], [Item.バッタ, 2], [Item.草, 1]],
        isVisible: () => Player.ルイン.member && ルインドアースLv3.count > 0,
        action: () => {
            Player.ルイン.ins.prm(Prm.STR).base += 1;
        },
    });
    const 銅像 = new Mix({
        uniqueName: "銅像", limit: 5, info: "ルインの最大TP+1",
        materials: () => [[Item.銅板, 1], [Item.少女の心を持ったおっさん, 3], [Item.たんぽぽ, 1]],
        isVisible: () => Player.ルイン.member && ルインドアースLv10.count > 0,
        action: () => {
            Player.ルイン.ins.prm(Prm.MAX_TP).base += 1;
        },
    });
    const バッタのスープ = new Mix({
        uniqueName: "バッタのスープ", limit: 10, info: "ピアーの最大HP+1",
        materials: () => [[Item.肉, 1], [Item.バッタ, 2], [Item.水, 1]],
        isVisible: () => Player.ピアー.member && ルインドアースLv2.count > 0,
        action: () => {
            Player.ピアー.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const ピアー家秘薬 = new Mix({
        uniqueName: "ピアー家秘薬", limit: 10, info: "ピアーの最大HP+1",
        materials: () => [[Item.肉, 1], [Item.草, 2]],
        isVisible: () => Player.ピアー.member && ルインドアースLv6.count > 0 && バッタのスープ.count >= バッタのスープ.countLimit,
        action: () => {
            Player.ピアー.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const ゴーグルケース = new Mix({
        uniqueName: "ゴーグルケース", limit: 5, info: "ピアーの最大MP+1",
        materials: () => [[Item.ガラス, 3], [Item.ヒノキ, 2], [Item.針金, 1]],
        isVisible: () => Player.ピアー.member && ルインドアースLv10.count > 0,
        action: () => {
            Player.ピアー.ins.prm(Prm.MAX_MP).base += 1;
        },
    });
    const 水晶玉 = new Mix({
        uniqueName: "水晶玉", limit: 10, info: "ピアーの魔+1",
        materials: () => [[Item.ガラス, 3], [Item.水, 2]],
        isVisible: () => Player.ピアー.member && ルインドアースLv4.count > 0,
        action: () => {
            Player.ピアー.ins.prm(Prm.MAG).base += 1;
        },
    });
    const ウェルダン = new Mix({
        uniqueName: "ウェルダン", limit: 10, info: "一号の闇+1",
        materials: () => [[Item.肉, 1], [Item.針金, 1]],
        isVisible: () => Player.一号.member && Dungeon.テント樹林.dungeonClearCount > 0,
        action: () => {
            Player.一号.ins.prm(Prm.DRK).base += 1;
        },
    });
    const 大きなお弁当箱 = new Mix({
        uniqueName: "大きなお弁当箱", limit: 10, info: "一号の最大HP+1",
        materials: () => [[Item.杉, 10], [Item.ヒノキ, 10]],
        isVisible: () => Player.一号.member && ルインドアースLv8.count > 0,
        action: () => {
            Player.一号.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const ツルの銃 = new Mix({
        uniqueName: "ツルの銃", limit: 10, info: "一号の闇+1",
        materials: () => [[Item.発砲ツル, 2], [Item.土, 4]],
        isVisible: () => Player.一号.member && ルインドアースLv10.count > 0,
        action: () => {
            Player.一号.ins.prm(Prm.DRK).base += 1;
        },
    });
    const レア = new Mix({
        uniqueName: "レア", limit: 10, info: "雪の鎖+1",
        materials: () => [[Item.肉, 1], [Item.草, 2]],
        isVisible: () => Player.雪.member && Dungeon.テント樹林.dungeonClearCount > 0,
        action: () => {
            Player.雪.ins.prm(Prm.CHN).base += 1;
        },
    });
    const ビー玉 = new Mix({
        uniqueName: "ビー玉", limit: 10, info: "雪の最大HP+1",
        materials: () => [[Item.ガラス, 4], [Item.砂, 8]],
        isVisible: () => Player.雪.member && ルインドアースLv8.count > 0,
        action: () => {
            Player.雪.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const おもちゃの鎖 = new Mix({
        uniqueName: "おもちゃの鎖", limit: 10, info: "雪の力+1",
        materials: () => [[Item.針金, 4], [Item.銅, 5]],
        isVisible: () => Player.雪.member && ルインドアースLv10.count > 0,
        action: () => {
            Player.雪.ins.prm(Prm.CHN).base += 1;
        },
    });
    const ガンステーキ = new Mix({
        uniqueName: "ガンステーキ", limit: 10, info: "lukaの銃+1",
        materials: () => [[Item.肉, 1], [Item.発砲ツル, 1]],
        isVisible: () => Player.luka.member,
        action: () => {
            Player.luka.ins.prm(Prm.GUN).base += 1;
        },
    });
    const おもちゃの銃 = new Mix({
        uniqueName: "おもちゃの銃", limit: 10, info: "lukaの銃+1",
        materials: () => [[Item.石, 1], [Item.発砲ツル, 1]],
        isVisible: () => Player.luka.member && ルインドアースLv8.count > 0,
        action: () => {
            Player.luka.ins.prm(Prm.GUN).base += 1;
        },
    });
    const 石焼き肉 = new Mix({
        uniqueName: "石焼き肉", limit: 10, info: "ベガの最大HP+1",
        materials: () => [[Item.肉, 1], [Item.石, 2]],
        isVisible: () => Player.ベガ.member,
        action: () => {
            Player.ベガ.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const ただれた肉 = new Mix({
        uniqueName: "ただれた肉", limit: 10, info: "ベガの最大HP+1",
        materials: () => [[Item.肉, 1], [Item.呪い水, 5]],
        isVisible: () => Player.ベガ.member && ルインドアースLv8.count > 0,
        action: () => {
            Player.ベガ.ins.prm(Prm.MAX_HP).base += 1;
        },
    });
    const ししおどし = new Mix({
        uniqueName: "ししおどし", limit: 10, info: "ベガの力+1",
        materials: () => [[Item.かんな, 7], [Item.竹, 5]],
        isVisible: () => Player.ベガ.member && ルインドアースLv10.count > 0,
        action: () => {
            Player.ベガ.ins.prm(Prm.STR).base += 1;
        },
    });
    const ハンバーグ = new Mix({
        uniqueName: "ハンバーグ", limit: 10, info: "ジスロフの力+1",
        materials: () => [[Item.肉, 1], [Item.岩塩, 2]],
        isVisible: () => Player.ジスロフ.member,
        action: () => {
            Player.ジスロフ.ins.prm(Prm.STR).base += 1;
        },
    });
    const ミートボール = new Mix({
        uniqueName: "ミートボール", limit: 10, info: "ナナの光+1",
        materials: () => [[Item.肉, 1], [Item.トマト, 2]],
        isVisible: () => Player.ナナ.member,
        action: () => {
            Player.ナナ.ins.prm(Prm.LIG).base += 1;
        },
    });
    const ピアーの肉まんレシピ = new Mix({
        uniqueName: "ピアーの肉まんレシピ", limit: 10, info: "ピアー直伝肉まんレシピが解放される",
        materials: () => [[Item.動かないゴーグル, 20]],
        isVisible: () => ルインドアースLv17.count > 0,
    });
    const たんぽぽまん = new Mix({
        uniqueName: "たんぽぽまん", limit: 5, info: "ルインの全ステータス+10",
        materials: () => [[Item.肉まん, 1], [Item.たんぽぽ, 30]],
        isVisible: () => ピアーの肉まんレシピ.count > 0 && Player.ルイン.member,
        action: () => {
            Prm.atkPrms.forEach(prm => Player.ルイン.ins.prm(prm).base += 10);
        },
    });
    const 筍まん = new Mix({
        uniqueName: "筍まん", limit: 5, info: "ピアーの魔+10",
        materials: () => [[Item.肉まん, 1], [Item.竹, 30]],
        isVisible: () => ピアーの肉まんレシピ.count > 0 && Player.ピアー.member,
        action: () => {
            Player.ピアー.ins.prm(Prm.MAG).base += 10;
        },
    });
    const バッタまん = new Mix({
        uniqueName: "バッタまん", limit: 5, info: "一号の闇+10",
        materials: () => [[Item.肉まん, 1], [Item.バッタ, 30]],
        isVisible: () => ピアーの肉まんレシピ.count > 0 && Player.一号.member,
        action: () => {
            Player.一号.ins.prm(Prm.DRK).base += 10;
        },
    });
    const 水まん = new Mix({
        uniqueName: "水まん", limit: 5, info: "雪の鎖+10",
        materials: () => [[Item.肉まん, 1], [Item.水, 30]],
        isVisible: () => ピアーの肉まんレシピ.count > 0 && Player.雪.member,
        action: () => {
            Player.雪.ins.prm(Prm.CHN).base += 10;
        },
    });
    const かにまん = new Mix({
        uniqueName: "かにまん", limit: 5, info: "ベガの全ステータス+10",
        materials: () => [[Item.肉まん, 1], [Item.かに, 30]],
        isVisible: () => ピアーの肉まんレシピ.count > 0 && Player.ベガ.member,
        action: () => {
            Prm.atkPrms.forEach(prm => Player.ベガ.ins.prm(prm).base += 10);
        },
    });
    const にじゅうよんまん = new Mix({
        uniqueName: "にじゅうよんまん", limit: 5, info: "ジスロフの全ステータス+10",
        to_string: "24万",
        materials: () => [[Item.肉まん, 1], [Item.にじゅうよん, 24]],
        isVisible: () => ピアーの肉まんレシピ.count > 0 && Player.ジスロフ.member,
        action: () => {
            Prm.atkPrms.forEach(prm => Player.ジスロフ.ins.prm(prm).base += 10);
        },
    });
    const トマトまん = new Mix({
        uniqueName: "トマトまん", limit: 5, info: "ナナの光+10",
        materials: () => [[Item.肉まん, 1], [Item.トマト, 30]],
        isVisible: () => ピアーの肉まんレシピ.count > 0 && Player.ナナ.member,
        action: () => {
            Player.ナナ.ins.prm(Prm.LIG).base += 10;
        },
    });
    //Force
    Mix.飛行 = new Mix({
        uniqueName: "飛行", limit: 1, info: "白い鳥が特性[進む時稀に+1]を覚える",
        materials: () => [[Item.小説38万キロの恋, 1], [Item.バッタ, 5]],
        isVisible: () => Player.白い鳥.member && ルインドアースLv11.count > 0,
    });
    Mix.飛行2 = new Mix({
        uniqueName: "飛行2", limit: 1, info: "白い鳥が特性[進む時稀に+1]を覚える",
        to_string: "飛行+",
        materials: () => [[Item.小説38万キロの恋, 1], [Item.バッタ, 10]],
        isVisible: () => Player.白い鳥.member && ルインドアースLv12.count > 0 && Mix.飛行.count > 0,
    });
    //-Force
    const 技の極み = new Mix({
        uniqueName: "技の極み", limit: 1, info: "技セット上限数増加アイテムの合成が解放される",
        materials: () => [[Item.松, 20], [Item.クワ, 20]],
        isVisible: () => ルインドアースLv9.count > 0,
    });
    const 技の極み2 = new Mix({
        uniqueName: "技の極み2", limit: 1, info: "技セット上限数増加アイテムの合成が解放される",
        to_string: "技の極み+",
        materials: () => [[Item.エデン樹, 20], [Item.桜, 20]],
        isVisible: () => ルインドアースLv12.count > 0 && 技の極み.count > 0,
    });
    Mix.パン屋のごみ箱 = new Mix({
        uniqueName: "パン屋のごみ箱", limit: 1, info: "お店に新しい商品が並ぶ",
        materials: () => [[Item.ドラッグ, 5]],
        isVisible: () => ルインドアースLv4.count > 0,
    });
    Mix.健康保険証 = new Mix({
        uniqueName: "健康保険証", limit: 1, info: "お店に新しい商品が並ぶ",
        materials: () => [[Item.ドラッグ, 5], [Item.草, 5]],
        isVisible: () => ルインドアースLv5.count > 0,
    });
    const 生命倫理 = new Mix({
        uniqueName: "生命倫理", limit: 1, info: "新たなアイテムの合成が解放される",
        materials: () => [[Item.思い出そのもの, 10], [Item.スカイフェアリーの死体, 1]],
        isVisible: () => ルインドアースLv12.count > 0,
    });
    // //--------------------------------------------------------
    // //
    // //アイテム
    // //
    // //--------------------------------------------------------
    // const           天地創造の書:Mix = new Mix({
    //     uniqueName:"天地創造の書", limit:Mix.LIMIT_INF,
    //     result:()=>[Item.天地創造の書, 1],
    //     materials:()=>[[Item.血粉末, 1], [Item.サファイア, 3], [Item.紙, 10]],
    // });
    const 兵法指南の書 = new Mix({
        uniqueName: "兵法指南の書", limit: Mix.LIMIT_INF,
        result: () => [Item.兵法指南の書, 1],
        materials: () => [[Item.ファーストキス, 3], [Item.杉, 20], [Item.ヒノキ, 20], [Item.針金, 6],],
        isVisible: () => 技の極み.count > 0,
    });
    const 五輪の書 = new Mix({
        uniqueName: "五輪の書", limit: Mix.LIMIT_INF,
        result: () => [Item.五輪の書, 1],
        materials: () => [[Item.クリスタル, 3], [Item.イズミジュエリー, 1], [Item.杉, 20], [Item.ヒノキ, 20]],
        isVisible: () => 技の極み2.count > 0,
    });
    const 絵画母なる星の緑の丘 = new Mix({
        uniqueName: "絵画母なる星の緑の丘", limit: Mix.LIMIT_INF,
        result: () => [Item.絵画母なる星の緑の丘, 1],
        materials: () => [[Item.エレタの絵の具, 5], [Item.カンバス, 5], [Item.良い土, 5]],
        isVisible: () => Item.リュサンデールの絵筆.totalGetCount > 0,
    });
    const 絵画シェイクスピアの涙 = new Mix({
        uniqueName: "絵画シェイクスピアの涙", limit: Mix.LIMIT_INF,
        result: () => [Item.絵画シェイクスピアの涙, 1],
        materials: () => [[Item.エレタの絵の具, 5], [Item.カンバス, 5], [Item.清龍, 2]],
        isVisible: () => Item.リュサンデールの絵筆.totalGetCount > 0,
    });
    const 絵画彼女の髪 = new Mix({
        uniqueName: "絵画彼女の髪", limit: Mix.LIMIT_INF,
        result: () => [Item.絵画彼女の髪, 1],
        materials: () => [[Item.エレタクレヨン, 5], [Item.カンバス, 5], [Item.火と水と土と風と光と闇のアニムス, 2]],
        isVisible: () => Item.リュサンデールの絵筆.totalGetCount > 0,
    });
    const 絵画我が情熱の日 = new Mix({
        uniqueName: "絵画我が情熱の日", limit: Mix.LIMIT_INF,
        result: () => [Item.絵画我が情熱の日, 1],
        materials: () => [[Item.エレタクレヨン, 5], [Item.カンバス, 5], [Item.烈火, 10]],
        isVisible: () => Item.リュサンデールの絵筆.totalGetCount > 0,
    });
    const Dフラスコ = new Mix({
        uniqueName: "Dフラスコ", limit: Mix.LIMIT_INF,
        result: () => [Item.Dフラスコ, 1],
        materials: () => [[Item.マーザン, 1], [Item.ガラス, 5],],
        isVisible: () => 生命倫理.count > 0,
    });
    const マーメイド = new Mix({
        uniqueName: "マーメイド", limit: Mix.LIMIT_INF,
        result: () => [Item.マーメイド, 1],
        materials: () => [[Item.マーザン, 1], [Item.呪い水, 4], [Item.少女の心を持ったおっさん, 1],],
        isVisible: () => 生命倫理.count > 0,
    });
    const ホムンクルス = new Mix({
        uniqueName: "ホムンクルス", limit: Mix.LIMIT_INF,
        result: () => [Item.ホムンクルス, 1],
        materials: () => [[Item.マーザン, 1], [Item.精霊の涙, 2], [Item.王子の素, 2],],
        isVisible: () => 生命倫理.count > 0,
    });
    const フランケンシュタイン = new Mix({
        uniqueName: "フランケンシュタイン", limit: Mix.LIMIT_INF,
        result: () => [Item.フランケンシュタイン, 1],
        materials: () => [[Item.マーザン, 1], [Item.思い出そのもの, 2], [Item.針金, 6],],
        isVisible: () => 生命倫理.count > 0,
    });
    const 魔弾 = new Mix({
        uniqueName: "魔弾", limit: Mix.LIMIT_INF,
        result: () => [Item.魔弾, 2],
        materials: () => [[Item.地球塔粉末, 1], [Item.ロウ, 10],],
        isVisible: () => ルインドアースLv11.count > 0,
    });
    const 砲弾 = new Mix({
        uniqueName: "砲弾", limit: Mix.LIMIT_INF,
        result: () => [Item.砲弾, 1],
        materials: () => [[Item.地球塔粉末, 1], [Item.ロウ, 10],],
        isVisible: () => ルインドアースLv11.count > 0,
    });
    const パワータンク = new Mix({
        uniqueName: "パワータンク", limit: Mix.LIMIT_INF,
        result: () => [Item.パワータンク, 4],
        materials: () => [[Item.月の石, 1], [Item.アステロイド, 10], [Item.発砲ツル, 10],],
        isVisible: () => ルインドアースLv14.count > 0 && Item.月の石.totalGetCount > 0,
    });
    const 林式ミサイル = new Mix({
        uniqueName: "林式ミサイル", limit: Mix.LIMIT_INF,
        result: () => [Item.林式ミサイル, 1],
        materials: () => [[Item.黒色火薬, 1], [Item.サングラス, 3],],
        isVisible: () => ルインドアースLv15.count > 0 && Item.黒色火薬.totalGetCount > 0,
    });
    const エボリ製悪魔のミサイル = new Mix({
        uniqueName: "エボリ製悪魔のミサイル", limit: Mix.LIMIT_INF,
        result: () => [Item.エボリ製悪魔のミサイル, 1],
        materials: () => [[Item.黒色火薬, 1], [Item.太陽の欠片, 3],],
        isVisible: () => ルインドアースLv15.count > 0 && Item.黒色火薬.totalGetCount > 0,
    });
    const メフィスト製悪魔のミサイル = new Mix({
        uniqueName: "メフィスト製悪魔のミサイル", limit: Mix.LIMIT_INF,
        result: () => [Item.メフィスト製悪魔のミサイル, 1],
        materials: () => [[Item.黒色火薬, 1], [Item.うんち, 3],],
        isVisible: () => ルインドアースLv15.count > 0 && Item.黒色火薬.totalGetCount > 0,
    });
    const 原子爆弾 = new Mix({
        uniqueName: "原子爆弾", limit: Mix.LIMIT_INF,
        result: () => [Item.原子爆弾, 4],
        materials: () => [[Item.B火薬, 1], [Item.太陽の欠片, 4],],
        isVisible: () => ルインドアースLv16.count > 0 && Item.B火薬.totalGetCount > 0,
    });
    const 水素爆弾 = new Mix({
        uniqueName: "水素爆弾", limit: Mix.LIMIT_INF,
        result: () => [Item.水素爆弾, 4],
        materials: () => [[Item.B火薬, 1], [Item.水, 20],],
        isVisible: () => ルインドアースLv16.count > 0 && Item.B火薬.totalGetCount > 0,
    });
    const 重力子爆弾 = new Mix({
        uniqueName: "重力子爆弾", limit: Mix.LIMIT_INF,
        result: () => [Item.重力子爆弾, 4],
        materials: () => [[Item.B火薬, 1], [Item.重力, 2],],
        isVisible: () => ルインドアースLv16.count > 0 && Item.B火薬.totalGetCount > 0,
    });
    const lucifer製量子爆弾 = new Mix({
        uniqueName: "lucifer製量子爆弾", limit: Mix.LIMIT_INF,
        result: () => [Item.lucifer製量子爆弾, 4],
        materials: () => [[Item.B火薬, 1], [Item.重力, 1], [Item.ジスカルド, 1],],
        isVisible: () => ルインドアースLv16.count > 0 && Item.B火薬.totalGetCount > 0,
    });
    //--------------------------------------------------------
    //
    //-アイテム
    //装備
    //
    //--------------------------------------------------------
    const アタックシールド = new Mix({
        uniqueName: "アタックシールド", limit: 1,
        result: () => [Eq.アタックシールド, 1],
        materials: () => [[Item.杉, 5], [Item.ヒノキ, 5], [Item.かんな, 4]],
        isVisible: () => Item.レレシピ.totalGetCount > 0,
    });
    const 星的 = new Mix({
        uniqueName: "星的", limit: 1,
        result: () => [Eq.星的, 1],
        materials: () => [[Item.少女の心を持ったおっさん, 10], [Item.砂, 5]],
        isVisible: () => Item.レレシピ.totalGetCount > 0,
    });
    const 愛の盾 = new Mix({
        uniqueName: "愛の盾", limit: 1,
        result: () => [Eq.愛の盾, 1],
        materials: () => [[Item.少女の心を持ったおっさん, 10], [Item.土, 5], [Item.針金, 1]],
        isVisible: () => Item.イスレシピ.totalGetCount > 0,
    });
    const 空飛ぶ靴 = new Mix({
        uniqueName: "空飛ぶ靴", limit: 1,
        result: () => [Eq.空飛ぶ靴, 1],
        materials: () => [[Item.イズミミズ, 5], [Item.杉, 10], [Item.ヒノキ, 10], [Item.針金, 1]],
        isVisible: () => Item.イスレシピ.totalGetCount > 0,
    });
    const シャドウムーン = new Mix({
        uniqueName: "シャドウムーン", limit: 1,
        result: () => [Eq.シャドウムーン, 1],
        materials: () => [[Item.月の石, 1], [Item.粘土, 10], [Item.地球のひも, 10], [Item.針金, 5]],
        isVisible: () => Mix.月のレシピ.count > 0,
    });
    const 花水飾り = new Mix({
        uniqueName: "花水飾り", limit: 1,
        result: () => [Eq.花水飾り, 1],
        materials: () => [[Item.月の石, 1], [Item.たんぽぽ, 10], [Item.桜, 10], [Item.梅, 5]],
        isVisible: () => Mix.月のレシピ.count > 0,
    });
    const 天秤 = new Mix({
        uniqueName: "天秤", limit: 1,
        result: () => [Eq.天秤, 1],
        materials: () => [[Item.月の石, 1], [Item.桐, 20], [Item.鉄, 10], [Item.銅, 10]],
        isVisible: () => Mix.月のレシピ.count > 0,
    });
    const 蔓の鎖 = new Mix({
        uniqueName: "蔓の鎖", limit: 1,
        result: () => [Eq.蔓の鎖, 1],
        materials: () => [[Item.月の石, 1], [Item.発砲ツル, 30], [Item.石, 30], [Item.地球のひも, 10],],
        isVisible: () => Mix.月のレシピ.count > 0,
    });
    //--------------------------------------------------------
    //
    //-装備
    //
    //--------------------------------------------------------
})(Mix || (Mix = {}));
