
import { Scene } from "../undym/scene.js";
import { RatioLayout, XLayout, YLayout, ILayout, VariableLayout, Layout, Labels } from "../undym/layout.js";
import { Place, Util, PlayData, Debug, SceneType, Flag } from "../util.js";
import { Btn } from "../widget/btn.js";
import { Dungeon, DungeonArea } from "../dungeon/dungeon.js";
import { Rect, Color, Point } from "../undym/type.js";
import DungeonScene from "./dungeonscene.js";
import { DungeonEvent } from "../dungeon/dungeonevent.js";
import { DrawUnitDetail, DrawSTBoxes, DrawPlayInfo, DrawYen, DrawUnits } from "./sceneutil.js";
import { Unit, Prm } from "../unit.js";
import { ItemScene } from "./itemscene.js";
import { Font, Graphics } from "../graphics/graphics.js";
import { Texture } from "../graphics/texture.js";
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
import { JobChangeScene } from "./jobchangescene.js";
import { SaveData } from "../savedata.js";
import { Sound, Music } from "../sound.js";
import { MemberChangeScene } from "./memberchangescene.js";
import { Player } from "../player.js";
import { Pet } from "../pet.js";
import { EqPos } from "../eq.js";
import { choice } from "../undym/random.js";
import { OptionScene } from "./optionscene.js";
import { Tec } from "../tec.js";
import { Story } from "../story/story.js";
import { Story3 } from "../story/story3.js";


let choosedDungeon:Dungeon|undefined;

export class TownScene extends Scene{
    private static _ins:TownScene;
    static get ins():TownScene{return this._ins ? this._ins : (this._ins = new TownScene());}


    private constructor(){
        super();
    }

    init(){
        super.clear();

        super.add(Place.MSG, ILayout.create({draw:bounds=> DungeonArea.now.img.draw(bounds)}));
        super.add(Place.MSG, createDungeonBtnLayout());
        super.add(Place.DUNGEON_DATA, Util.msg);
        
        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.BTN, new VariableLayout(()=>TownBtn.ins));
        super.add(Place.E_BOX,
            new RatioLayout()
                .add(new Rect(0, 0, 1, 0.7), (()=>{
                    const d = ()=> choosedDungeon as Dungeon;
                    const l = new Labels(Font.def)
                                    .add(()=>`[${d()}]`)
                                    .add(()=>`Rank:${d().rank}`)
                                    .add(()=>`Lv:${d().enemyLv}`)
                                    .add(()=>`AU:${d().au}`)
                                    .add(()=>d().info)
                                    .add(()=>`攻略回数:${d().dungeonClearCount}`, ()=>d().dungeonClearCount > 0 ? Color.WHITE : Color.GRAY)
                                    .add(()=>`鍵:${d().treasureKey}`)
                                    .add(()=>"財宝:")
                                    .addArray(()=>{
                                        const res:[string,Color?][] = [];
                                        for(const t of d().treasures){
                                            if(t.totalGetCount > 0) {res.push([` ${t}`]);}
                                            else                    {res.push([` ${"？".repeat( t.toString().length )}`, Color.GRAY]);}
                                        }
                                        return res;
                                    })
                                    .add(()=>"Extra:")
                                    .addArray(()=>{
                                        const res:[string,Color?][] = [];
                                        for(const t of d().exItems){
                                            if(t.totalGetCount > 0) {res.push([` ${t}`]);}
                                            else                    {res.push([` ${"？".repeat( t.toString().length )}`, Color.GRAY]);}
                                        }
                                        return res;
                                    })
                                    ;
                    return new VariableLayout(()=> choosedDungeon ? l : ILayout.empty);
                })())
                .add(new Rect(0, 0.7, 1, 0.3), (()=>{
                    const btn = new Btn("侵入", ()=>{
                        if(!choosedDungeon){return;}
            
                        Dungeon.now = choosedDungeon;
                        Dungeon.auNow = 0;
                        DungeonEvent.now = DungeonEvent.empty;
                        for(let item of Item.consumableValues()){
                            item.remainingUseNum = item.num;
                        }
            
                        Util.msg.set(`${choosedDungeon}に侵入しました`);
                        Sound.walk2.play();
                        
                        FX_DungeonName( choosedDungeon.toString(), Place.DUNGEON_DATA );
            
                        choosedDungeon = undefined;

                        Dungeon.now.playMusic("dungeon");
    
                        Scene.load( DungeonScene.ins );
                    });
                    return new VariableLayout(()=> choosedDungeon ? btn : ILayout.empty);
                })())
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
            u.removeCondition(type);
        }
    }
};


const createDungeonBtnLayout = ()=>{
    const area = DungeonArea.now;
    const l = new RatioLayout();
    Dungeon.values
        .filter(d=> d.area === area && (d.isVisible() || Debug.debugMode))
        .forEach(d=>{
            const btn = new Btn(d.dungeonClearCount > 0 ? `★${d}` : `${d}`, ()=>{
                            choosedDungeon = d;
                            Sound.system.play();
                        });
            btn.groundColor = ()=> d === choosedDungeon ? Color.D_CYAN.bright(Date.now() / 50, 0.15) : Color.BLACK;
            btn.frameColor = ()=>Color.WHITE;
            btn.stringColor = ()=>Color.WHITE;

            l.add(d.btnBounds, btn);
        });

    area.areaMoveBtns
        .filter(am=> am.isVisible() || Debug.debugMode)
        .forEach(am=>{
            const btn = new Btn(`＞${am.to}`, ()=>{
                            DungeonArea.now = am.to;
                            choosedDungeon = undefined;
                            TownScene.ins.init();
                            Sound.system.play();
                        });
            btn.groundColor = ()=> Color.BLACK;
            btn.frameColor = ()=>Color.YELLOW;
            btn.stringColor = ()=>Color.YELLOW;

            l.add(am.bounds, btn);
        });
    
    TownEvent.values()
        .filter(ev=> ev.isVisible())
        .forEach(ev=>{
            const btn = new Btn(ev.toString(), async()=> await ev.run());
            btn.groundColor = ()=> Color.BLACK;
            btn.frameColor = ()=>Color.YELLOW;
            btn.stringColor = ()=>Color.YELLOW;

            l.add(ev.bounds, btn);
        });
    return l;
};


class TownBtn{
    private static _ins:ILayout;
    static get ins(){return this._ins;}

    private static dungeonListScroll = 0;

    static reset(){
        const l = new List(7);
            // l.add({
            //     center:()=>"ダンジョン",
            //     push:elm=>{
            //         this.setDungeonList();
            //     },
            // });
            l.add({
                center:()=>"セーブ",
                push:elm=>{
                    SaveData.save();
                    Sound.save.play();
                },
            });
            if(Dungeon.再構成トンネル.dungeonClearCount > 0 || Debug.debugMode){
                l.add({
                    center:()=>"お店",
                    push:elm=>{
                        Sound.system.play();
                        Scene.load(new ShopScene());
                    },
                });
            }
            if(Item.合成許可証.num > 0 || Debug.debugMode){
                l.add({
                    center:()=>"合成",
                    push:elm=>{
                        Sound.system.play();
                        Scene.load(new MixScene());
                    },
                });
            }
            if(Mix.転職所.count > 0 || Debug.debugMode){
                l.add({
                    center:()=>"転職",
                    push:elm=>{
                        Sound.system.play();
                        Scene.load(new JobChangeScene());
                    },
                });
            }
            if(Mix.転職所.count > 0 || Debug.debugMode){
                l.add({
                    center:()=>"技のセット",
                    push:elm=>{
                        Sound.system.play();
                        Scene.load(new SetTecScene());
                    },
                });
            }
            if(PlayData.gotAnyEq || Debug.debugMode){
                l.add({
                    center:()=>"装備",
                    push:elm=>{
                        Sound.system.play();
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
                        Sound.system.play();
                        Scene.load(new MeisouScene());
                    },
                });
            }
            if(Dungeon.魔鳥の岩壁.dungeonClearCount > 0 || Debug.debugMode){
                l.add({
                    center:()=>"パーティ",
                    push:elm=>{
                        Scene.load(new MemberChangeScene());  
                    },
                });
            }
            l.add({
                center:()=>"アイテム",
                push:elm=>{
                    Sound.system.play();
                    Scene.load( ItemScene.ins({
                        selectUser:true,
                        user:Unit.players[0],
                        use:async(item,user)=>{
                            if(item.targetings.some(t=> t === "select")){
                                await item.use( user, [user] );
                            }else{
                                const targets = user.searchUnits( item.targetings, 1 );
                                
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
            l.add({
                center:()=>"OPTION",
                push:elm=>{
                    Sound.system.play();
                    Scene.load(new OptionScene({
                        onreturn:()=> Scene.load(TownScene.ins),
                    }))
                },
            });
            // l.add({
            //     center:()=>"test",
            //     push:elm=>{
            //         Dungeon.精霊寺院.setEnemy();
            //         for(const e of Unit.enemies){
            //             Util.msg.set(`${e.getEq(EqPos.体).toString()},${e.hp}/${e.prm(Prm.MAX_HP).total}`);
            //         }
            //     },
            // });

            
        this._ins = l;
    }


}


const FX_DungeonName = (name:string, bounds:Rect)=>{
    const fontSize = 60;
    const font = new Font(fontSize, Font.ITALIC);

    const tex = Texture.createFromPixel(font.measurePixelW(name), fontSize);
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


class TownEvent{
    private static _values:TownEvent[] = [];
    static values():ReadonlyArray<TownEvent>{return this._values;}
    
    get bounds():Rect{return this.args.bounds();}

    constructor(
        private args:{
            name:string,
            bounds:()=>Rect,
            run:()=>Promise<void>,
            visible:()=>boolean,
        }
    ){
        TownEvent._values.push(this);
    }

    toString(){return this.args.name;}

    isVisible():boolean{return this.args.visible();}
    async run():Promise<void>{await this.args.run();}
}

namespace TownEvent{
    export const 塔地下 = new TownEvent({
        name:"＞塔地下",
        bounds:()=>{
            for(const set of DungeonArea.中央島.areaMoveBtns){
                if(set.to === DungeonArea.塔地下){
                    return set.bounds;
                }
            }
            return Rect.ZERO;
        },
        visible:()=> Flag.story_Main35.done && !Flag.story_Toutika.done,
        run:async()=>{
            Flag.story_Toutika.done = true;
            await Story3.runMain35a();
        },
    });
}