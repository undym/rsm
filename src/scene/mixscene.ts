import { Scene } from "../undym/scene.js";
import { FlowLayout, ILayout, VariableLayout, XLayout, RatioLayout, Labels, Layout, YLayout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Rect, Color } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail, DrawPlayInfo, DrawYen } from "./sceneutil.js";
import { Place } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List, ListElm } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { Item } from "../item.js";
import { Num, Mix } from "../mix.js";
import { Eq, EqEar } from "../eq.js";
import { SaveData } from "../savedata.js";
import { Sound } from "../sound.js";






export class MixScene extends Scene{

    private list:List = new List();
    private choosed:boolean = false;
    private choosedMix:Mix;

    constructor(){
        super();

        this.setList("建築", Mix.values.filter(m=> !m.result && m.isVisible()));
    }

    init(){
        const typeList = new List()
                            .init(typeList=>{
                                typeList.add({
                                    center:()=>"建築",
                                    push:elm=>{
                                        const values = Mix.values
                                                            .filter(m=> !m.result && m.isVisible());
                                        Sound.system.play();
                                        this.setList("建築", values);
                                    },
                                });
                                typeList.add({
                                    center:()=>"装備",
                                    push:elm=>{
                                        const values = Mix.values
                                                            .filter(m=>{
                                                                const result = m.result;
                                                                if(result && result.object instanceof Eq && m.isVisible()){return true;}
                                                                return false;
                                                            });
                                        Sound.system.play();
                                        this.setList("装備", values);
                                    },
                                });
                                typeList.add({
                                    center:()=>"アイテム",
                                    push:elm=>{
                                        const values = Mix.values
                                                            .filter(m=>{
                                                                const result = m.result;
                                                                if(result && result.object instanceof Item && m.isVisible()){return true;}
                                                                return false;
                                                            });
                                        Sound.system.play();
                                        this.setList("アイテム", values);
                                    },
                                });
                            })
                            .fit()
                            .setRadioBtnMode(true, ()=>Color.BLACK, ()=>Color.D_CYAN)
                            .push(0)
                            ;

        super.clear();
        
        super.add(Place.LIST_MAIN, 
            new XLayout()
                .add(this.list)
                .add(
                    new RatioLayout()
                        .add(Place.LIST_INFO,
                            new Layout()
                                .add(ILayout.create({draw:(bounds)=>{
                                    Graphics.fillRect(bounds, Color.D_GRAY);
                                }}))
                                .add((()=>{
                                    const info = new Labels(Font.def)
                                                        .add(()=>{
                                                            if(this.choosedMix.countLimit === Mix.LIMIT_INF){
                                                                return `合成回数(${this.choosedMix.count}/-)`;
                                                            }else{
                                                                return `合成回数(${this.choosedMix.count}/${this.choosedMix.countLimit})`;
                                                            }
                                                        })
                                                        .addArray(()=>{
                                                            let res:[string,Color?][] = [];
        
                                                            for(let m of this.choosedMix.materials){
                                                                const color = m.num <= m.object.num ? Color.WHITE : Color.GRAY;
                                                                res.push([`[${m.object}] ${m.object.num}/${m.num}`, color]);
                                                            }
        
                                                            const result = this.choosedMix.result;
                                                            if(result){
                                                                res.push([""]);
                                                                if(result.object instanceof Eq)    {res.push([`<${result.object.pos}>`]);}
                                                                if(result.object instanceof EqEar) {res.push([`<耳>`]);}
                                                                if(result.object instanceof Item)  {res.push([`<${result.object.itemType}>`]);}
                                                            }
        
                                                            return res;
                                                        })
                                                        .br()
                                                        .addln(()=>{
                                                            if(this.choosedMix.info){
                                                                return this.choosedMix.info;
                                                            }
                                                            
                                                            const result = this.choosedMix.result;
                                                            if(!result){return "";}
                                                            return result.object.info;
                                                        })
                                                        ;
                                    return new VariableLayout(()=>{
                                        
                                        return this.choosed ? info : ILayout.empty;
                                    });
                                })())
                        )
                        .add(Place.LIST_USE_BTN,
                            (()=>{
                                const canMix = ()=>{
                                    if(!this.choosedMix){return false;}
            
                                    return this.choosedMix.canRun();
                                };
                                const run = new Btn("合成",async()=>{
                                    if(!this.choosedMix){return;}
                                    
                                    Sound.made.play();
                                    this.choosedMix.run();
                                });
                                const noRun = new Btn("-",async()=>{});
                                return new VariableLayout(()=>{
                                    return canMix() ? run : noRun;
                                });
                            })()
                        )
                )
        );
        
        super.add(Place.YEN, DrawYen.ins);

        super.add(Place.LIST_TYPE, typeList);
        super.add(Place.LIST_BTN,
            new Btn("<<", ()=>{
                Sound.system.play();
                Scene.load( TownScene.ins );
            })
        );
        
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        
        
        
    }


    private setList(name:string, values:Mix[]){
        this.list.clear();

        this.list.add({
            center:()=>name,
            groundColor:()=>Color.D_GRAY,
        });

        values
            .forEach(mix=>{

                const color = ()=>{
                    if(!mix.canRun())          {return Color.GRAY;}
                    return Color.WHITE;
                };
                this.list.add({
                    left:()=>{
                        if(mix.result){return `${mix.result.object.num}`;}
                        if(mix.countLimit === Mix.LIMIT_INF){return `${mix.count}`;}
                        return `${mix.count}/${mix.countLimit}`;
                    },
                    leftColor:color,
                    right:()=>{
                        if(mix.result){return `${mix.toString()}x${mix.result.num}`}
                        return mix.toString();
                    },
                    rightColor:color,
                    groundColor:()=>mix === this.choosedMix ? Color.D_CYAN : Color.BLACK,
                    push:(elm)=>{
                        Sound.system.play();
                        this.choosedMix = mix;
                        this.choosed = true;
                    },
                });
            });
    }

}