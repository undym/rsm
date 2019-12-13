import { Scene, cwait } from "../undym/scene.js";
import { RatioLayout, YLayout, ILayout, XLayout, VariableLayout, InnerLayout } from "../undym/layout.js";
import { Rect, Color } from "../undym/type.js";
import { DungeonEvent } from "../dungeon/dungeonevent.js";
import { Place, Util, SceneType, Debug } from "../util.js";
import { DrawSTBoxes, DrawUnitDetail, DrawDungeonData, DrawPlayInfo, DrawYen, DrawUnits } from "./sceneutil.js";
import { Img } from "../graphics/texture.js";
import { Btn } from "../widget/btn.js";
import { Sound } from "../sound.js";
import { SaveData } from "../savedata.js";
import { List } from "../widget/list.js";
import { OptionScene } from "./optionscene.js";



export default class DungeonScene extends Scene{
    private static _ins:DungeonScene;
    static get ins():DungeonScene{return this._ins ? this._ins : (this._ins = new DungeonScene());}


    private debug_eventList:List;

    private constructor(){
        super();
        DungeonEvent.now = DungeonEvent.empty;

        if(Debug.debugMode){
            this.debug_eventList = new List();
            for(const ev of DungeonEvent.values){
                this.debug_eventList.add({
                    right:()=>ev.name,
                    push:async()=>{
                        await ev.happen();
                    },
                });
            }
        }
    }

    init(){
        super.clear();

        
        super.add(Place.MAIN, DrawEvent.ins);
        super.add(Place.DUNGEON_DATA, DrawDungeonData.ins);

        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.BTN,(()=>{
            let dungeonEventBak:DungeonEvent;
            let btnLayout:ILayout = ILayout.empty;

            return new VariableLayout(()=>{
                if(dungeonEventBak != DungeonEvent.now){
                    dungeonEventBak = DungeonEvent.now;
                    btnLayout = dungeonEventBak.createBtnLayout();
                }
                return btnLayout;
            })
        })());
        const save = new Rect(Place.E_BOX.x, Place.E_BOX.y, Place.E_BOX.w, Place.E_BOX.h / 8);
        super.add(save,
            new Btn("セーブ", ()=>{
                SaveData.save();
                Sound.save.play();
            })
        );
        super.add(Place.E_BOX,
            new YLayout()
                .add(
                    new Btn("セーブ", ()=>{
                        SaveData.save();
                        Sound.save.play();
                    })
                )
                .add(
                    new Btn("OPTION", ()=>{
                        Scene.load(new OptionScene({
                            onreturn:()=>{
                                Scene.load( this );
                            },
                        }))
                    })
                )
                .add(ILayout.empty)
                .add(ILayout.empty)
                .add(ILayout.empty)
                .add(ILayout.empty)
                .add(ILayout.empty)
                .add(ILayout.empty)
        );

        if(Debug.debugMode){
            super.add(new Rect(save.x, save.yh, save.w, 1 - save.yh),
                new VariableLayout(()=>{
                    if(this.debug_eventList){return this.debug_eventList;}
                    return ILayout.empty;
                })
            );
        }
        
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Rect.FULL, DrawUnits.ins);
        super.add(Place.MSG, Util.msg);
        super.add(Place.MAIN, DrawUnitDetail.ins);

        // super.add(Place.E_BOX, new VariableLayout(()=>{
        //     if(!Debug.debugMode){return ILayout.empty;}

            
        // }));

        SceneType.DUNGEON.set();
    }

}


class DrawEvent extends InnerLayout{
    private static _ins:DrawEvent;
    static get ins():DrawEvent{return this._ins ? this._ins : (this._ins = new DrawEvent());}

    constructor(){
        super();

        let evBak = DungeonEvent.now;
        let img = Img.empty;
        let zoomCount = 0;

        super.add(ILayout.create({draw:(bounds)=>{
            if(evBak != DungeonEvent.now){
                evBak = DungeonEvent.now;

                img = DungeonEvent.now.getImg();
                if(DungeonEvent.now.isZoomImg()){
                    zoomCount = 0;
                }
            }

            zoomCount++;
            
            if(!img.complete){return;}

            let zoom = 0;
            if(img.ratioW / bounds.w > img.ratioH / bounds.h){
                zoom = zoomCount / (zoomCount + 1) * bounds.w / img.ratioW;
            }else{
                zoom = zoomCount / (zoomCount + 1) * bounds.h / img.ratioH;
            }
            const sizeW = img.ratioW * zoom;
            const sizeH = img.ratioH * zoom;
            img.draw( new Rect(bounds.cx - sizeW / 2, bounds.cy - sizeH / 2, sizeW, sizeH) );
        }}));

    }
}