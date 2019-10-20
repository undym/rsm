import { Scene } from "../undym/scene.js";
import { FlowLayout, ILayout, VariableLayout, XLayout, RatioLayout, Labels, Label, Layout, YLayout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit, PUnit } from "../unit.js";
import { Input } from "../undym/input.js";
import { Rect, Color, Point } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail, DrawPlayInfo, DrawYen } from "./sceneutil.js";
import { Place } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List, ListElm } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { TecType, Tec, ActiveTec } from "../tec.js";
import { FX_Str } from "../fx/fx.js";






export class SetTecScene extends Scene{

    private settingTecList = new List();
    private list = new List();
    private target:PUnit = Unit.getFirstPlayer();
    private choosedTec:Tec = Tec.empty;
    private resetList:(keepScroll:boolean)=>void;
    private info:ILayout = ILayout.empty;
    private useBtn:ILayout = ILayout.empty;

    constructor(){
        super();
        
        this.setSettingTecList(this.target, true);
    }

    init(){
        const infoLayout = new Layout()
                                .add(ILayout.create({draw:(bounds)=>{
                                    Graphics.fillRect(bounds, Color.D_GRAY);
                                }}))
                                .add((()=>{
                                    return new VariableLayout(()=>{
                                        return this.info;
                                    })
                                })())
                                ;
        const typeList = new List()
                            .init(typeList=>{
                                typeList.add({
                                    center:()=>"全て",
                                    push:elm=>{

                                        (this.resetList = keepScroll=>{
                                            this.list.clear(keepScroll);
                                            for(let type of TecType.values()){
                                                const tecs = type.tecs;
                                                this.setList( this.target, `${type}`, tecs );
                                            }
                                        })(false);
                                    },
                                });

                                for(const type of TecType.values()){
                                    typeList.add({
                                        center:()=>type.toString(),
                                        push:elm=>{

                                            (this.resetList = keepScroll=>{
                                                this.list.clear(keepScroll);
                                                this.setList( this.target, `${type}`, type.tecs);
                                            })(false);
                                        },
                                    });
                                }

                            })
                            .fit()
                            .setRadioBtnMode(true)
                            .push(0)
                            ;

        super.clear();

        super.add(Place.LIST_MAIN,
            new XLayout()
                .add(this.settingTecList)
                .add(this.list)
                .add(
                    new RatioLayout()
                        .add(Place.LIST_INFO, infoLayout)
                        .add(Place.LIST_USE_BTN, new VariableLayout(()=> this.useBtn))
                )
        );
        
        super.add(Place.LIST_TYPE, typeList);
        
        super.add(Place.YEN, new Label(Font.def, ()=>`BP:${this.target.bp}`, ()=>Color.ORANGE).setBase(Font.RIGHT))

        super.add(Place.LIST_BTN, 
            new Btn("<<", ()=>{
                Scene.load( TownScene.ins );
            })
        );
        
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
            
        super.add(Rect.FULL, ILayout.create({draw:(bounds)=>{
            Graphics.fillRect(this.target.bounds, new Color(0,1,1,0.2));
        }}));
        super.add(Rect.FULL, ILayout.create({ctrl:(bounds)=>{
            if(!Input.click){return;}

            for(let p of Unit.players.filter(p=> p.exists)){
                if(p.bounds.contains( Input.point )){
                    this.target = p;
                    this.setSettingTecList(p, false);
                    this.resetList(false);
                    break;
                }
            }
        }}));


    }

    private setSettingTecList(unit:PUnit, keepScroll:boolean){
        this.settingTecList.clear(keepScroll);
        this.settingTecList.add({
            center:()=>`セット中`,
            groundColor:()=>Color.D_GRAY,
        });

        unit.tecs
            .forEach((tec)=>{
                if(tec === Tec.empty){
                    this.settingTecList.add({
                        right:()=>"-",
                    });
                }else{
    
                    this.settingTecList.add({
                        right:()=>`${tec}`,
                        groundColor:()=>tec === this.choosedTec ? Color.D_CYAN : Color.BLACK,
                        push:(elm)=>{
                            this.choosedTec = tec;
                            this.info = createTecInfo(tec, unit);
                            this.useBtn = this.createSetBtn(tec, unit);
                        },
                    });
                }
            });
    }

    private setList(unit:PUnit, listTypeName:string, tecs:Tec[]|ReadonlyArray<Tec>){

        const settingTecs = new Map<Tec,boolean>();
        for(const t of unit.tecs){
            settingTecs.set(t, true);
        };

        this.list.add({
            center:()=>`${listTypeName}`,
            groundColor:()=>Color.D_GRAY,
        });

        tecs
            .filter(tec=>unit.isMasteredTec(tec))
            .forEach((tec)=>{
                if(tec === Tec.empty){
                    this.list.add({
                        right:()=>"-",
                    });
                }else{
                    const color:()=>Color = ()=>{
                        if(settingTecs.has(tec)){return Color.ORANGE;}
                        return Color.WHITE;
                    };
    
                    this.list.add({
                        left:()=> settingTecs.has(tec) ? "=" : ``,
                        leftColor:color,
                        right:()=>`${tec}`,
                        rightColor:color,
                        groundColor:()=>tec === this.choosedTec ? Color.D_CYAN : Color.BLACK,
                        push:(elm)=>{
                            this.choosedTec = tec;
                            this.info = createTecInfo(tec, unit);
                            this.useBtn = this.createSetBtn(tec, unit);
                        },
    
                    });
                }
            });

        tecs
            .filter(tec=>{
                if(unit.isMasteredTec(tec)){return false;}
                const learning = tec.learning;
                return (learning && learning.origins.every(t=> unit.isMasteredTec(t)));
            })
            .forEach(tec=>{
                const learning = tec.learning;
                if(!learning){return;}

                this.list.add({
                    left:()=>`${learning.bp}`,
                    right:()=>`${tec}`,
                    groundColor:()=>tec === this.choosedTec ? Color.ORANGE.darker() : Color.BLACK,
                    push:(elm)=>{
                        this.choosedTec = tec;
                        this.info = createTecInfo(tec, unit);
                        this.useBtn = this.createLearnBtn(tec, unit);
                    },

                });
            });
    }

    private createSetBtn(tec:Tec, unit:PUnit){
        const 外す = new Btn("外す",async()=>{
            for(let i = 0; i < unit.tecs.length; i++){
                if(unit.tecs[i] === tec){
                    unit.tecs[i] = Tec.empty;
                    FX_Str(Font.def, `${tec}を外しました`, {x:0.5, y:0.5}, Color.WHITE);
    
                    this.setSettingTecList(unit, true);
                    this.resetList(true);
                    return;
                }
            }
        });
        const セット = new Btn("セット",async()=>{
            for(let i = 0; i < unit.tecs.length; i++){
                if(unit.tecs[i] === Tec.empty){
                        unit.tecs[i] = tec;
                        FX_Str(Font.def, `${tec}をセットしました`, Point.CENTER, Color.WHITE);
    
                        this.setSettingTecList(unit, true);
                        return;
                }
            }
            
            FX_Str(Font.def, `技欄に空きがありません`, Point.CENTER, Color.WHITE);
        });
        return new VariableLayout(()=>{
            if(tec === Tec.empty){return ILayout.empty;}
            return unit.tecs.some(t=> t === tec) ? 外す : セット;
        });
    }

    private createLearnBtn(tec:Tec, unit:PUnit){
        return new Btn("覚える", async()=>{
            const learning = tec.learning;
            if(!learning){return;}
            if(unit.bp < learning.bp){
                FX_Str(Font.def, `BPが足りない`, Point.CENTER, Color.WHITE);
                return;
            }

            unit.bp -= learning.bp;
            unit.setMasteredTec(tec, true);
            FX_Str(Font.def, `${unit.name}は[${tec}]を習得した`, Point.CENTER, Color.WHITE);

            for(const gp of learning.growthPrms){
                unit.prm(gp.prm).base += gp.value;
            }
            
            this.useBtn = this.createSetBtn(tec, unit);
            // this.resetList(true);
        });
    }
}


const createTecInfo = (tec:Tec, unit:PUnit)=>{
    const l = new Labels(Font.def)
                    .add(()=>`[${tec}]`)
                    .add(()=>`<${tec.type}>`)
                    .addln(()=>{
                        let res = "";
                        if(tec instanceof ActiveTec){
                            if(tec.mpCost > 0){res += `MP:${tec.mpCost} `}
                            if(tec.tpCost > 0){res += `TP:${tec.tpCost} `}
                            if(tec.epCost > 0){res += `EP:${tec.epCost} `}
                            for(const set of tec.itemCost){
                                res += `${set.item}-${set.num}(${set.item.num}) `
                            }
                        }
                        return res;
                    })
                    .addln(()=>tec.info)
                    ;
    if(!unit.isMasteredTec(tec)){
        l.br();
        l.add(()=>"習得ボーナス", ()=>Color.ORANGE);
        const learning = tec.learning;
        if(learning){
            for(const gp of learning.growthPrms){
                l.add(()=>` ${gp.prm}+${gp.value}` ,()=>Color.ORANGE);
            }
        }
    }
    return l;
}