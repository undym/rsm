
import { Scene } from "../undym/scene.js";
import { RatioLayout, XLayout, YLayout, ILayout, VariableLayout } from "../undym/layout.js";
import { Place, Util, PlayData, Debug, SceneType } from "../util.js";
import { Btn } from "../widget/btn.js";
import { Dungeon } from "../dungeon/dungeon.js";
import { Rect, Color, Point } from "../undym/type.js";
import DungeonScene from "./dungeonscene.js";
import { DungeonEvent } from "../dungeon/dungeonevent.js";
import { DrawUnitDetail, DrawSTBoxes, DrawPlayInfo, DrawYen, DrawUnits } from "./sceneutil.js";
import { Unit, Prm } from "../unit.js";
import { createOptionBtn } from "./optionscene.js";
import { ItemScene } from "./itemscene.js";
import { Targeting } from "../force.js";
import { Font, Graphics, Texture } from "../graphics/graphics.js";
import { Item } from "../item.js";
import { SetTecScene } from "./settecscene.js";
import { MixScene } from "./mixscene.js";
import { EqScene } from "./eqscene.js";
import { ConditionType, Condition } from "../condition.js";
import { ShopScene } from "./shopscene.js";
import { FX } from "../fx/fx.js";
import { PartySkillScene } from "./partyskillscene.js";
import { List } from "../widget/list.js";
import { MeisouScene } from "./meisouscene.js";
import { Mix } from "../mix.js";


let choosedDungeon:Dungeon|undefined;

export class TownScene extends Scene{
    private static _ins:TownScene;
    static get ins():TownScene{return this._ins ? this._ins : (this._ins = new TownScene());}


    private constructor(){
        super();
    }

    init(){
        super.clear();

        
        super.add(Place.MSG, Util.msg);

        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.BTN,new VariableLayout(()=>TownBtn.ins));
        super.add(Place.DUNGEON_DATA,
            (()=>{
                const btn = new Btn("侵入", ()=>{
                    if(!choosedDungeon){return;}
        
                    Dungeon.now = choosedDungeon;
                    Dungeon.auNow = 0;
                    DungeonEvent.now = DungeonEvent.empty;
                    for(let item of Item.consumableValues()){
                        item.remainingUseNum = item.num;
                    }
        
                    Util.msg.set(`${choosedDungeon}に侵入しました`);
                    const h = 0.15;
                    FX_DungeonName( choosedDungeon.toString(), Place.DUNGEON_DATA );
        
                    choosedDungeon = undefined;

                    Scene.load( DungeonScene.ins );
                });
                return new VariableLayout(()=>choosedDungeon ? btn : ILayout.empty);
            })()
        );
        
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        //----------------------------------------------------

        SceneType.TOWN.set();
        TownBtn.reset();
        fullCare();

        //----------------------------------------------------
    }
}


const fullCare = ()=>{
    for(let u of Unit.players){
        u.dead = false;

        u.hp = u.prm(Prm.MAX_HP).total;
        u.mp = u.prm(Prm.MAX_MP).total;
        u.tp = u.prm(Prm.MAX_TP).total;
        u.ep = u.prm(Prm.MAX_EP).total;
        
        for(const type of ConditionType.values){
            u.clearCondition(type);
        }
    }
};


class TownBtn{
    private static _ins:ILayout;
    static get ins(){return this._ins;}


    static reset(){
        const l = new List(6);
            l.add({
                center:()=>"ダンジョン",
                push:elm=>{
                    this.setDungeonList();
                },
            });
            l.add({
                center:()=>"アイテム",
                push:elm=>{
                    Scene.load( ItemScene.ins({
                        selectUser:true,
                        user:Unit.players[0],
                        use:async(item,user)=>{
                            if(item.targetings & Targeting.SELECT){
                                await item.use( user, [user] );
                            }else{
                                let targets = Targeting.filter( item.targetings, user, Unit.players, /*num*/1 );
                                
                                if(targets.length > 0){
                                    await item.use( user, targets );
                                }
                            }
                        },
                        returnScene:()=>{
                            Scene.load( TownScene.ins );
                        }, 
                    }) );
                },
            });
            if(Dungeon.再構成トンネル.dungeonClearCount > 0 || Debug.debugMode){
                l.add({
                    center:()=>"お店",
                    push:elm=>{
                        Scene.load(new ShopScene());
                    },
                });
            }
            // if(Item.合成許可証.num > 0 || Debug.debugMode){
            //     l.add({
            //         center:()=>"合成",
            //         push:elm=>{
            //             Scene.load(new MixScene());
            //         },
            //     });
            // }
            // if(Item.技習得許可証.num > 0 || Debug.debugMode){
            //     l.add({
            //         center:()=>"技のセット",
            //         push:elm=>{
            //             Scene.load(new SetTecScene());
            //         },
            //     });
            // }
            if(PlayData.gotAnyEq || Debug.debugMode){
                l.add({
                    center:()=>"装備",
                    push:elm=>{
                        Scene.load(new EqScene());
                    },
                });
            }
            // if(Item.パーティースキル取り扱い許可証.num > 0 || Debug.debugMode){
            //     l.add({
            //         center:()=>"パーティースキル",
            //         push:elm=>{
            //             Scene.load(new PartySkillScene());
            //         },
            //     });
            // }
            if(Mix.瞑想所.count > 0 || Debug.debugMode){
                l.add({
                    center:()=>"瞑想",
                    push:elm=>{
                        Scene.load(new MeisouScene());
                    },
                });
            }
            l.add({
                center:()=>"OPTION",
                push:elm=>{
                    this._ins = createOptionBtn();
                },
            });

            
        this._ins = l;
    }

    private static setDungeonList(){
        const list = new List(8);
        const visibleDungeons = Dungeon.values.filter(d=> d.isVisible() || Debug.debugMode);
        for(const d of visibleDungeons){
            list.add({
                center:()=>d.toString(),
                groundColor:()=> d === choosedDungeon ? Color.D_CYAN : Color.BLACK,
                push:elm=>{
                    Util.msg.set("");
                    Util.msg.set("");
                    Util.msg.set(`[${d}]`);
                    Util.msg.set(`Rank:${d.rank}`);
                    Util.msg.set(`Lv:${d.enemyLv}`);
                    Util.msg.set(`攻略回数:${d.dungeonClearCount}`, d.dungeonClearCount > 0 ? Color.WHITE : Color.GRAY);
                    Util.msg.set(`鍵:${d.treasureKey}`);

                    Util.msg.set(`財宝:`);
                    for(const t of d.treasures){
                        if(t.totalGetCount > 0){
                            Util.msg.add(`${t}/`);
                        }else{
                            Util.msg.add(`${"？".repeat( t.toString().length )}`, Color.GRAY);
                        }
                    }

                    choosedDungeon = d;
                },
            })
        }


        const listH = 0.85;
        this._ins = new RatioLayout()
                        .add(new Rect(0, 0, 1, listH), list)
                        .add(new Rect(0, listH, 1, 1-listH), 
                            new Btn("<<", ()=>{
                                choosedDungeon = undefined;
                                this.reset();
                            })
                        )
                        ;
        ;
    }

}


const FX_DungeonName = (name:string, bounds:Rect)=>{
    const fontSize = 60;
    const font = new Font(fontSize, Font.ITALIC);

    const tex = new Texture({pixelSize:{w:font.measurePixelW(name), h:fontSize}});
    tex.setRenderTarget(()=>{
        font.draw(name, Point.ZERO, Color.WHITE);
    });

    const flash = ()=>{
        const addX = 0.01;
        const addY = 0.01;
        const b = new Rect(
            bounds.x - addX,
            bounds.y - addY,
            bounds.w + addX * 2,
            bounds.h + addY * 2,
        );
        let alpha = 1.0;
        FX.add((count)=>{
            Graphics.setAlpha(alpha, ()=>{
                tex.draw(b);
            });
            alpha -= 0.1;
            return alpha > 0;
        });
    }

    let alpha = 1.0;
    
    FX.add((count)=>{
        const countLim = 45;
        let w = count / countLim * tex.pixelW;
        if(w > tex.pixelW){
            w = tex.pixelW;

            if(alpha === 1.0){
                flash();
            }

            alpha -= 0.03;
            if(alpha <= 0){
                FX.add(count=>{
                    const over = 30;
                    Graphics.fillRect(bounds, new Color(0,0,0,1 - count / over));
                    return count < over;
                });
                return false;
            }
        }

        Graphics.fillRect(bounds, Color.BLACK);
        Graphics.setAlpha(alpha, ()=>{
            for(let i = 0; i < w; i+=2){
                tex.draw({
                    x:bounds.x + i / tex.pixelW * bounds.w,
                    y:bounds.y,
                    w:1 / tex.pixelW * bounds.w,
                    h:bounds.h,
                },{
                    x:i / tex.pixelW,
                    y:0,
                    w:1 / tex.pixelW,
                    h:1,
                });
            }
            const add = tex.pixelW % 2 + 1;
            for(let i = tex.pixelW - add; i > tex.pixelW - w; i-=2){
                tex.draw({
                    x:bounds.x + i / tex.pixelW * bounds.w,
                    y:bounds.y,
                    w:1 / tex.pixelW * bounds.w,
                    h:bounds.h,
                },{
                    x:i / tex.pixelW,
                    y:0,
                    w:1 / tex.pixelW,
                    h:1,
                });
            }
        });

        return true;
    });
};