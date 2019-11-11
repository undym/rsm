import { Scene } from "../undym/scene.js";
import { FlowLayout, ILayout, VariableLayout, XLayout, RatioLayout, Labels, Layout, YLayout } from "../undym/layout.js";
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
import { Eq, EqPos, EqEar } from "../eq.js";
import { SaveData } from "../savedata.js";
import { Player } from "../player.js";
import { Sound } from "../sound.js";


enum ChoosedType{
    NO,
    EQ,
    EAR,
}


export class EqScene extends Scene{
    private list:List;
    private target:PUnit;
    private choosedEq:Eq;
    private choosedEar:EqEar;
    private choosedType:ChoosedType = ChoosedType.NO;
    private pos:EqPos;
    private resetList:(keepScroll:boolean)=>void;

    constructor(){
        super();

        this.list = new List();
        this.target = Unit.getFirstPlayer();

        this.choosedEq  = Eq.values[0];
        this.choosedEar = EqEar.values[0];
        
        this.choosedType = ChoosedType.NO;
    }

    init(){

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
                                    const eqInfo = new Labels(Font.def)
                                                        .add(()=>`[${this.choosedEq}]`, ()=>Color.WHITE)
                                                        .add(()=>`<${this.choosedEq.pos}>`, ()=>Color.WHITE)
                                                        .add(()=>`${this.choosedEq.num}個`, ()=>Color.WHITE)
                                                        .addln(()=>this.choosedEq.info, ()=>Color.WHITE)
                                                        ;
                                    const earInfo = new Labels(Font.def)
                                                        .add(()=>`[${this.choosedEar}]`, ()=>Color.WHITE)
                                                        .add(()=>`<耳>`, ()=>Color.WHITE)
                                                        .add(()=>`${this.choosedEar.num}個`, ()=>Color.WHITE)
                                                        .addln(()=>this.choosedEar.info, ()=>Color.WHITE)
                                                        ;
                                    return new VariableLayout(()=>{
                                        if(this.choosedType === ChoosedType.EQ){return eqInfo;}
                                        if(this.choosedType === ChoosedType.EAR){return earInfo;}
                                        return ILayout.empty
                                    });
                                })())
                        )
                        .add(Place.LIST_USE_BTN,
                            (()=>{
                                const set = new Btn("装備",async()=>{
                                    if(!this.choosedEq){return;}
                                    
                                    equip( this.target, this.choosedEq );
                                    Sound.keyopen.play();
                                    FX_Str(Font.def, `${this.choosedEq}をセットしました`, Point.CENTER, Color.WHITE);
                                });
                                const unset = new Btn("外す",async()=>{
                                    if(!this.choosedEq){return;}
            
                                    equip( this.target, Eq.getDef(this.pos));
                                    Sound.keyopen.play();
                                    FX_Str(Font.def, `${this.choosedEq}を外しました`, Point.CENTER, Color.WHITE);
                                });
                                const setEar = new Btn("装備",async()=>{
                                    if(!this.choosedEq){return;}
                                    
                                    let index = 0;
                                    for(let i = 0; i < Unit.EAR_NUM; i++){
                                        if(this.target.getEqEar(i) === EqEar.getDef()){
                                            index = i;
                                            break;
                                        }
                                    }
                                    equipEar( this.target, index, this.choosedEar );
                                    Sound.keyopen.play();
                                    FX_Str(Font.def, `耳${index+1}に${this.choosedEar}をセットしました`, Point.CENTER, Color.WHITE);
                                });
                                const unsetEar = new Btn("外す",async()=>{
                                    for(let i = 0; i < Unit.EAR_NUM; i++){
                                        if(this.target.getEqEar(i) === this.choosedEar){
                                            equipEar( this.target, i, EqEar.getDef() );
                                            Sound.keyopen.play();
                                            FX_Str(Font.def, `耳${i+1}の${this.choosedEar}を外しました`, Point.CENTER, Color.WHITE);
                                            break;
                                        }
                                    }
                                });
                                return new VariableLayout(()=>{
                                    if(!this.choosedEq){return ILayout.empty;}
            
                                    if(this.choosedType === ChoosedType.EQ){
                                        if(this.target.getEq(this.pos) === this.choosedEq){
                                            return unset;
                                        }
                                        return set;
                                    }
            
                                    if(this.choosedType === ChoosedType.EAR){
                                        for(let i = 0; i < Unit.EAR_NUM; i++){
                                            if(this.target.getEqEar(i) === this.choosedEar){return unsetEar;}
                                        }
                                        return setEar;
                                    }
            
                                    return ILayout.empty;
                                });
                            })())
                )
        );
        
        super.add(Place.YEN, DrawYen.ins);

        super.add(Place.LIST_TYPE,
        new List(7)
            .init(typeList=>{
                typeList.add({
                    center:()=>"全て",
                    push:elm=>{
                        Sound.system.play();
                        (this.resetList = (keepScroll)=>{
                            this.list.clear(keepScroll);
                            this.setEarList();
                            for(const pos of EqPos.values()){
                                this.setList( pos );
                            }
                        })(false);
                    },
                });
                typeList.add({
                    center:()=>"耳",
                    push:elm=>{
                        Sound.system.play();
                        (this.resetList = (keepScroll)=>{
                            this.list.clear(keepScroll);
                            this.setEarList();
                        })(false);
                    }
                });
            
                for(let pos of EqPos.values()){
                    typeList.add({
                        center:()=>`${pos}`,
                        push:elm=>{
                            Sound.system.play();
                            (this.resetList = (keepScroll)=>{
                                this.list.clear(keepScroll);
                                this.setList( pos );
                            })(false);
                        },
                    });
                }
            })
            .setRadioBtnMode(true, ()=>Color.BLACK, ()=>Color.D_CYAN)
            .push(0)
        );

        super.add(Place.LIST_BTN,
            new Btn("<<", ()=>{
                Sound.system.play();
                Scene.load(TownScene.ins);
            })
        );
        
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
            
        super.add(Rect.FULL, ILayout.create({draw:(bounds)=>{
            Graphics.fillRect(this.target.boxBounds, new Color(0,1,1,0.2));
        }}));
        super.add(Rect.FULL, ILayout.create({ctrl:(bounds)=>{
            if(!Input.click){return;}

            for(let p of Unit.players.filter(p=> p.exists)){
                if(p.boxBounds.contains( Input.point )){
                    Sound.system.play();
                    this.target = p;
                    this.resetList(true);
                    break;
                }
            }
        }}));

        // (this.resetList = ()=>{
        //     this.list.clear();
        //     this.setEarList();
        //     for(const pos of EqPos.values()){
        //         this.setList( pos );
        //     }
        // })();
    }

    private setEarList(){
        this.choosedType = ChoosedType.NO;

        this.list.add({
            center:()=>`耳`,
            groundColor:()=>Color.D_GRAY,
        });

        EqEar.values
            .filter(ear=>{
                if(ear.num > 0){return true;}
                for(let i = 0; i < Unit.EAR_NUM; i++){
                    if(this.target.getEqEar(i) === ear){return true;}
                }
                return false;
            })
            .forEach(ear=>{
                let color:()=>Color = ()=>{
                    if(ear === this.choosedEar){return Color.ORANGE;}
                    for(let i = 0; i < Unit.EAR_NUM; i++){
                        if(this.target.getEqEar(i) === ear){return Color.CYAN;}
                    }
                    return Color.WHITE;
                };

                this.list.add({
                    left:()=>{
                        let res = "";
                        for(let i = 0; i < Unit.EAR_NUM; i++){
                            if(this.target.getEqEar(i) === ear){res += `${i+1}`;}
                        }
                        return res;
                    },
                    leftColor:color,
                    right:()=>`${ear}`,
                    rightColor:color,
                    groundColor:()=>this.choosedType === ChoosedType.EAR && ear === this.choosedEar ? Color.D_CYAN : Color.BLACK,
                    push:(elm)=>{
                        Sound.system.play();
                        this.choosedEar = ear;
                        this.choosedType = ChoosedType.EAR;
                    },

                });
            });
    }

    private setList(pos:EqPos){
        this.choosedType = ChoosedType.NO;
        this.pos = pos;

        this.list.add({
            center:()=>`${pos}`,
            groundColor:()=>Color.D_GRAY,
        });

        pos.eqs
            .filter(eq=> eq.num > 0 || eq === this.target.getEq(pos))
            .forEach((eq)=>{
                let color:()=>Color = ()=>{
                    if(this.target.getEq(pos) === eq){return Color.ORANGE;}
                    return Color.WHITE;
                };

                this.list.add({
                    left:()=> this.target.getEq(pos) === eq ? "=" : ``,
                    leftColor:color,
                    right:()=>`${eq}`,
                    rightColor:color,
                    groundColor:()=> this.choosedType === ChoosedType.EQ && eq === this.choosedEq ? Color.D_CYAN : Color.BLACK,
                    push:(elm)=>{
                        Sound.system.play();
                        this.choosedEq = eq;
                        this.choosedType = ChoosedType.EQ;
                    },

                });
            });
    }
}


const equip = (unit:PUnit, newEq:Eq)=>{
    const oldEq = unit.getEq(newEq.pos);

    oldEq.num++;
    newEq.num--;

    unit.setEq(newEq.pos, newEq);
    unit.equip();
};

const equipEar = (unit:PUnit, index:number, newEar:EqEar)=>{
    const oldEar = unit.getEqEar(index);

    oldEar.num++;
    newEar.num--;

    unit.setEqEar(index, newEar);
    unit.equip();
}
