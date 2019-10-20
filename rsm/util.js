import { Rect } from "./undym/type.js";
import Msg from "./widget/msg.js";
import { Graphics } from "./graphics/graphics.js";
import { Scene } from "./undym/scene.js";
import { TownScene } from "./scene/townscene.js";
import DungeonScene from "./scene/dungeonscene.js";
export class Debug {
}
Debug.DEBUG = true;
Debug.debugMode = false;
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
    static get DUNGEON_DATA() { return new Rect(Place.MSG.x, Place.MSG.yh, Place.MSG.w, Place.MAIN.h - Place.MSG.h); }
    static get E_BOX() { return new Rect(0, 0, Place.ST_W, 1); }
    static get P_BOX() { return new Rect(Place.MAIN.xw + Graphics.dotW, 0, Place.ST_W, 1); }
    static get YEN() { return new Rect(Place.P_BOX.xw + Graphics.dotW * 2, 0, 1 - Place.P_BOX.xw - Graphics.dotW * 3, 0.03); }
    static get BTN() { return new Rect(Place.YEN.x, Place.YEN.yh + Graphics.dotH, Place.YEN.w, 1 - Place.YEN.yh - Graphics.dotH); }
    static get LIST_MAIN() { return new Rect(0, 0, Place.MAIN.xw, 1); }
    static get LIST_TYPE() { return new Rect(Place.BTN.x, Place.BTN.y, Place.BTN.w, 1 - Place.BTN.y - Place.LIST_BTN_H); }
    static get LIST_BTN() { return new Rect(Place.LIST_TYPE.x, Place.LIST_TYPE.yh, Place.LIST_TYPE.w, 1 - Place.LIST_TYPE.yh); }
    static get LIST_INFO() { return new Rect(0, 0, 1, 1 - Place.LIST_BTN_H); }
    static get LIST_USE_BTN() { return new Rect(0, 1 - Place.LIST_BTN_H, 1, Place.LIST_BTN_H); }
}
Place.ST_W = 0.15;
Place.LIST_BTN_H = 0.15;
// export class Place{
//     private constructor(){}
//     static readonly ST_H = 0.125;
//     private static get dotW(){return 1 / Graphics.pixelW;}
//     private static get dotH(){return 1 / Graphics.pixelH;}
//     private static top:Rect;
//     static get TOP(){return this.top ? this.top :
//         (this.top = new Rect(this.dotW, this.dotH, 1 - this.dotW * 2, 0.03));}
//     private static e_box:Rect;
//     static get E_BOX(){return this.e_box ? this.e_box : 
//         (this.e_box = new Rect(this.dotW, this.TOP.yh + this.dotH, 1 - this.dotW * 2, this.ST_H));}
//     private static main:Rect;
//     static get MAIN(){return this.main ? this.main : 
//         (this.main = new Rect(this.dotW, this.E_BOX.yh, 1 - this.dotW * 2, 0.345 ))}
//     private static msg:Rect;
//     static get MSG(){return this.msg ? this.msg : 
//         (this.msg = new Rect(this.MAIN.x, this.MAIN.y + 1 / Graphics.pixelW, this.MAIN.w, this.MAIN.h * 0.7));}
//     private static p_box:Rect;
//     static get P_BOX(){return this.p_box ? this.p_box : 
//         (this.p_box = new Rect(this.dotW, this.MAIN.yh, 1 - this.dotW * 2, this.ST_H));}
//     private static btn:Rect;
//     static get BTN(){return this.btn ? this.btn : 
//         (this.btn = new Rect(this.dotW, this.P_BOX.yh, 1 - this.dotW * 2, 1 - this.P_BOX.yh));}
//     private static dungeon_data:Rect;
//     static get DUNGEON_DATA(){return this.dungeon_data ? this.dungeon_data : 
//         (this.dungeon_data = new Rect(this.MAIN.x + this.MAIN.w * 0.05, this.MSG.yh, this.MAIN.w * 0.9, this.MAIN.h - this.MSG.h - this.dotH));}
// }
export class PlayData {
    constructor() { }
}
PlayData.yen = 0;
/**職業変更ボタンの出現フラグ。 */
PlayData.masteredAnyJob = false;
/**装備ボタンの出現フラグ. */
PlayData.gotAnyEq = false;
export class SceneType {
    /**
     * actionLoadSaveData: 読み込み時の処理。
     */
    constructor(uniqueName, loadAction) {
        this.uniqueName = uniqueName;
        this.loadAction = loadAction;
        if (!SceneType._valueOf) {
            SceneType._valueOf = new Map();
        }
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
SceneType.TOWN = new SceneType("TOWN", () => Scene.load(TownScene.ins));
SceneType.DUNGEON = new SceneType("DUNGEON", () => Scene.load(DungeonScene.ins));
SceneType.BATTLE = new SceneType("BATTLE", () => Scene.load(DungeonScene.ins));
