import { Rect } from "./undym/type.js";
import Msg from "./widget/msg.js";
import { Unit } from "./unit.js";
import { Graphics } from "./graphics/graphics.js";
import { Scene } from "./undym/scene.js";
import { TownScene } from "./scene/townscene.js";
import DungeonScene from "./scene/dungeonscene.js";
import { Dungeon } from "./dungeon/dungeon.js";
export class Debug {
}
Debug.DEBUG = true;
Debug.debugMode = false;
// export class CollectingSkill{
//     private constructor(){}
//     static tree = 0;
// }
export class Util {
    constructor() { }
    static init() {
        this.msg = new Msg();
    }
}
export class Place {
    constructor() { }
    static get MAIN() { return new Rect(Place.ST_W, 0, 0.55, 1); }
    // static readonly MAIN = new Rect(0, Place.ST_H + Graphics.dotH, 0.8, 1 - Place.ST_H * 2 - Graphics.dotH * 2);
    static get MSG() { return new Rect(Place.MAIN.x, Place.MAIN.y, Place.MAIN.w, Place.MAIN.h * 0.8); }
    static get DUNGEON_DATA() {
        const w = Place.MSG.w * 0.7;
        return new Rect(Place.MSG.cx - w / 2, Place.MSG.yh, w, Place.MAIN.h - Place.MSG.h);
    }
    static get E_BOX() { return new Rect(0, 0, Place.ST_W, Place.BOX_H); }
    static get P_BOX() { return new Rect(Place.MAIN.xw + Graphics.dotW, 0, Place.ST_W, Place.BOX_H); }
    static E_UNIT(i) {
        const u = Unit.enemies[i];
        if (!u.img.complete) {
            return Rect.ZERO;
        }
        const imgScreenPixelH = Graphics.pixelH * Place.BOX_H / Unit.enemies.length / 2;
        const zoomMul = imgScreenPixelH / u.img.pixelH;
        const imgScreenRatioW = u.img.ratioW * zoomMul;
        const imgScreenRatioH = u.img.ratioH * zoomMul;
        return new Rect(Place.E_BOX.xw, Place.E_BOX.y + Place.BOX_H / Unit.enemies.length * (i + 0.5) - imgScreenRatioH / 2, imgScreenRatioW, imgScreenRatioH);
    }
    static P_UNIT(i) {
        const u = Unit.players[i];
        if (!u.img.complete) {
            return Rect.ZERO;
        }
        const imgScreenPixelH = Graphics.pixelH * Place.BOX_H / Unit.players.length / 2;
        const zoomMul = imgScreenPixelH / u.img.pixelH;
        const imgScreenRatioW = u.img.ratioW * zoomMul;
        const imgScreenRatioH = u.img.ratioH * zoomMul;
        return new Rect(Place.P_BOX.x - imgScreenRatioW - Graphics.dotH, Place.P_BOX.y + Place.BOX_H / Unit.players.length * (i + 0.5) - imgScreenRatioH / 2, imgScreenRatioW, imgScreenRatioH);
    }
    // static get YEN(){return new Rect(Place.P_BOX.xw + Graphics.dotW * 2, 0.03, 1-Place.P_BOX.xw - Graphics.dotW * 3, 0.03);}
    static get YEN() { return new Rect(Place.P_BOX.xw + Graphics.dotW * 2, 0, 1 - Place.P_BOX.xw - Graphics.dotW * 3, 0.03); }
    static get BTN() { return new Rect(Place.YEN.x, Place.YEN.yh + Graphics.dotH, Place.YEN.w, 1 - Place.YEN.yh - Graphics.dotH); }
    static get LIST_MAIN() { return new Rect(0, 0, Place.MAIN.xw, 1); }
    static get LIST_TYPE() { return new Rect(Place.BTN.x, Place.BTN.y, Place.BTN.w, 1 - Place.BTN.y - Place.LIST_BTN_H); }
    static get LIST_BTN() { return new Rect(Place.LIST_TYPE.x, Place.LIST_TYPE.yh, Place.LIST_TYPE.w, 1 - Place.LIST_TYPE.yh); }
    static get LIST_INFO() { return new Rect(0, 0, 1, 1 - Place.LIST_BTN_H); }
    static get LIST_USE_BTN() { return new Rect(0, 1 - Place.LIST_BTN_H, 1, Place.LIST_BTN_H); }
}
Place.ST_W = 0.15;
Place.BOX_H = 1;
Place.LIST_BTN_H = 0.15;
export class PlayData {
    constructor() { }
}
PlayData.yen = 0;
/**装備ボタンの出現フラグ. */
PlayData.gotAnyEq = false;
export class SceneType {
    /**
     * actionLoadSaveData: 読み込み時の処理。
     */
    constructor(uniqueName, loadAction) {
        this.uniqueName = uniqueName;
        this.loadAction = loadAction;
        SceneType._valueOf.set(uniqueName, this);
    }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
    static get now() { return this._now; }
    set() {
        SceneType._now = this;
    }
}
SceneType._valueOf = new Map();
SceneType.TOWN = new SceneType("TOWN", () => Scene.load(TownScene.ins));
SceneType.DUNGEON = new SceneType("DUNGEON", () => {
    Dungeon.now.playMusic("dungeon");
    Scene.load(DungeonScene.ins);
});
SceneType.BATTLE = new SceneType("BATTLE", () => {
    Dungeon.now.playMusic("dungeon");
    Scene.load(DungeonScene.ins);
});
export var Flag;
(function (Flag_1) {
    class Flag {
        constructor(uniqueName) {
            this.uniqueName = uniqueName;
            this.done = false;
        }
    }
    const _values = [];
    Flag_1.values = () => _values;
    // const _valueOf = new Map<string,Flag>();
    // export const valueOf = (uniqueName:string):Flag|undefined=> _valueOf.get(uniqueName);
    const create = (uniqueName) => {
        const res = new Flag(uniqueName);
        _values.push(res);
        return res;
    };
    Flag_1.story_Kabe0 = create("story_Kabe0");
    Flag_1.story_Kabe1 = create("story_Kabe1");
    Flag_1.story_Kabe2 = create("story_Kabe2");
    Flag_1.story_Main31 = create("story_Main31");
    Flag_1.story_Main33 = create("story_Main33");
    Flag_1.story_Main34 = create("story_Main34");
    Flag_1.story_Main35 = create("story_Main35");
    Flag_1.story_Main36 = create("story_Main36");
    Flag_1.story_Main38 = create("story_Main38");
    Flag_1.story_Toutika = create("story_Toutika");
    Flag_1.yuki_beastOnly = create("yuki_beastOnly");
})(Flag || (Flag = {}));
