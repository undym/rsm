import { Rect, Color } from "./undym/type.js";
import Msg from "./widget/msg.js";
import { XLayout } from "./undym/layout.js";
import { Unit } from "./unit.js";
import { Graphics } from "./graphics/graphics.js";
import { Scene } from "./undym/scene.js";
import { TownScene } from "./scene/townscene.js";
import DungeonScene from "./scene/dungeonscene.js";
import { Dungeon } from "./dungeon/dungeon.js";


export class Debug{
    static readonly DEBUG = true;

    static debugMode = false;
}




export class Util{
    private constructor(){}
    
    static msg:Msg;

    static init(){
        this.msg = new Msg();
    }
}


export class Place{
    private constructor(){}

    static readonly ST_W = 0.15;
    static get MAIN(){return new Rect(Place.ST_W, 0, 0.55, 1);}
    // static readonly MAIN = new Rect(0, Place.ST_H + Graphics.dotH, 0.8, 1 - Place.ST_H * 2 - Graphics.dotH * 2);
    static get MSG(){return new Rect(Place.MAIN.x, Place.MAIN.y, Place.MAIN.w, Place.MAIN.w * 0.8);}
    static get DUNGEON_DATA(){return new Rect(Place.MSG.x, Place.MSG.yh, Place.MSG.w, Place.MAIN.h - Place.MSG.h);}
    

    static get E_BOX(){return new Rect(0, 0, Place.ST_W, 1);}
    static get P_BOX(){return new Rect(Place.MAIN.xw + Graphics.dotW, 0, Place.ST_W, 1);}
    
    static get YEN(){return new Rect(Place.P_BOX.xw + Graphics.dotW * 2, 0, 1-Place.P_BOX.xw - Graphics.dotW * 3, 0.03);}
    static get BTN(){return new Rect(Place.YEN.x, Place.YEN.yh + Graphics.dotH, Place.YEN.w, 1 - Place.YEN.yh - Graphics.dotH);}

    static get LIST_MAIN(){return new Rect(0, 0, Place.MAIN.xw, 1);}
    static get LIST_TYPE(){return new Rect(Place.BTN.x, Place.BTN.y, Place.BTN.w, 1 - Place.BTN.y - 0.15);}
    static get LIST_BTN(){return new Rect(Place.LIST_TYPE.x, Place.LIST_TYPE.yh, Place.LIST_TYPE.w, 1-Place.LIST_TYPE.yh);}

}

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


export class PlayData{
    private constructor(){}

    static yen:number = 0;
    /**職業変更ボタンの出現フラグ。 */
    static masteredAnyJob = false;
    /**装備ボタンの出現フラグ. */
    static gotAnyEq = false;
}


export class SceneType{
    private static _valueOf:Map<string,SceneType>;
    static valueOf(uniqueName:string){
        return this._valueOf.get(uniqueName);
    }

    private static _now:SceneType;
    static get now(){return this._now;}

    /**
     * actionLoadSaveData: 読み込み時の処理。
     */
    private constructor(
        public readonly uniqueName:string,
        public readonly loadAction:()=>void,
    ){
        if(!SceneType._valueOf){
            SceneType._valueOf = new Map<string,SceneType>();
        }

        SceneType._valueOf.set( uniqueName, this );
    }

    set(){
        SceneType._now = this;
    }

    static TOWN = new SceneType("TOWN", ()=>Scene.load( TownScene.ins ));
    static DUNGEON = new SceneType("DUNGEON", ()=>Scene.load( DungeonScene.ins ));
    static BATTLE = new SceneType("BATTLE", ()=>Scene.load( DungeonScene.ins ));
}