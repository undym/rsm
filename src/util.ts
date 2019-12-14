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



// export class CollectingSkill{
//     private constructor(){}

//     static tree = 0;
// }



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
    static get MSG(){return new Rect(Place.MAIN.x, Place.MAIN.y, Place.MAIN.w, Place.MAIN.h * 0.8);}
    static get DUNGEON_DATA(){
        const w = Place.MSG.w * 0.7;
        return new Rect(Place.MSG.cx - w / 2, Place.MSG.yh, w, Place.MAIN.h - Place.MSG.h);
    }
    
    private static readonly BOX_H = 1;

    static get E_BOX(){return new Rect(0, 0, Place.ST_W, Place.BOX_H);}
    static get P_BOX(){return new Rect(Place.MAIN.xw + Graphics.dotW, 0, Place.ST_W, Place.BOX_H);}

    static E_UNIT(i:number){
        const u = Unit.enemies[i];
        if(!u.img.complete){return Rect.ZERO;}

        const imgScreenPixelH = Graphics.pixelH * Place.BOX_H / Unit.enemies.length / 2;
        const zoomMul = imgScreenPixelH / u.img.pixelH;
        const imgScreenRatioW = u.img.ratioW * zoomMul;
        const imgScreenRatioH = u.img.ratioH * zoomMul;
        return  new Rect(
                    Place.E_BOX.xw,
                    Place.E_BOX.y + Place.BOX_H / Unit.enemies.length * (i + 0.5) - imgScreenRatioH / 2,
                    imgScreenRatioW,
                    imgScreenRatioH,
                );
    }
    static P_UNIT(i:number){
        const u = Unit.players[i];
        if(!u.img.complete){return Rect.ZERO;}

        const imgScreenPixelH = Graphics.pixelH * Place.BOX_H / Unit.players.length / 2;
        const zoomMul = imgScreenPixelH / u.img.pixelH;
        const imgScreenRatioW = u.img.ratioW * zoomMul;
        const imgScreenRatioH = u.img.ratioH * zoomMul;
        return  new Rect(
                    Place.P_BOX.x - imgScreenRatioW - Graphics.dotH,
                    Place.P_BOX.y + Place.BOX_H / Unit.players.length * (i + 0.5) - imgScreenRatioH / 2,
                    imgScreenRatioW,
                    imgScreenRatioH,
                );
    }
    
    // static get YEN(){return new Rect(Place.P_BOX.xw + Graphics.dotW * 2, 0.03, 1-Place.P_BOX.xw - Graphics.dotW * 3, 0.03);}
    static get YEN(){return new Rect(Place.P_BOX.xw + Graphics.dotW * 2, 0, 1-Place.P_BOX.xw - Graphics.dotW * 3, 0.03);}
    static get BTN(){return new Rect(Place.YEN.x, Place.YEN.yh + Graphics.dotH, Place.YEN.w, 1 - Place.YEN.yh - Graphics.dotH);}

    static get LIST_MAIN(){return new Rect(0, 0, Place.MAIN.xw, 1);}
    static readonly LIST_BTN_H = 0.15;
    static get LIST_TYPE(){return new Rect(Place.BTN.x, Place.BTN.y, Place.BTN.w, 1 - Place.BTN.y - Place.LIST_BTN_H);}
    static get LIST_BTN(){return new Rect(Place.LIST_TYPE.x, Place.LIST_TYPE.yh, Place.LIST_TYPE.w, 1-Place.LIST_TYPE.yh);}
    static get LIST_INFO(){return new Rect(0, 0, 1, 1 - Place.LIST_BTN_H);}
    static get LIST_USE_BTN(){return new Rect(0, 1 - Place.LIST_BTN_H, 1, Place.LIST_BTN_H);}
}



export class PlayData{
    private constructor(){}

    static yen:number = 0;
    /**装備ボタンの出現フラグ. */
    static gotAnyEq = false;
}


export class SceneType{
    private static _valueOf = new Map<string,SceneType>();
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
        SceneType._valueOf.set( uniqueName, this );
    }

    set(){
        SceneType._now = this;
    }

    static TOWN = new SceneType("TOWN", ()=>Scene.load( TownScene.ins ));
    static DUNGEON = new SceneType("DUNGEON", ()=>{
        Dungeon.now.playMusic("dungeon");
        Scene.load( DungeonScene.ins );
    });
    static BATTLE = new SceneType("BATTLE", ()=>{
        Dungeon.now.playMusic("dungeon");
        Scene.load( DungeonScene.ins );
    });
}