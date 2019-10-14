import { Scene, wait } from "../undym/scene.js";
import { Place, Util, Qlace } from "../util.js";
import { DrawSTBoxes, DrawUnitDetail, DrawPlayInfo } from "./sceneutil.js";
import { YLayout, ILayout, RatioLayout, VariableLayout, FlowLayout, XLayout, Labels, Layout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit } from "../unit.js";
import { List, ListElm } from "../widget/list.js";
import { Rect, Color, Point } from "../undym/type.js";
import { Item, ItemParentType } from "../item.js";
import { FX } from "../fx/fx.js";
import { Input } from "../undym/input.js";
import { Targeting } from "../force.js";
import { Battle } from "../battle.js";
import { BattleScene } from "./battlescene.js";
import { Graphics, Font } from "../graphics/graphics.js";



export class ItemScene extends Scene{
    private static _ins:ItemScene;
    static ins(args:{selectUser:boolean, user:Unit, use:(item:Item, user:Unit)=>void, returnScene:()=>void}):ItemScene{
        this._ins ? this._ins : (this._ins = new ItemScene());

        this._ins.selectUser = args.selectUser;
        this._ins.user = args.user;
        this._ins.use = args.use;
        this._ins.returnScene = args.returnScene;

        return this._ins;
    }
    
    private selectUser:boolean;
    private user:Unit;
    private use:(item:Item, user:Unit)=>void;
    private returnScene:()=>void;

    private selected:boolean = false;
    private selectedItem:Item;

    private list:List;


    private constructor(){
        super();

        this.list = new List();
    }
    

    init(){
        this.selected = false;
        this.selectedItem = Item.石;
        
        super.clear();
        


        super.add(Qlace.LIST_MAIN, 
            new XLayout()
                .add(this.list)
                .add(
                    new Layout()
                        .add(ILayout.create({draw:(bounds)=>{
                            Graphics.fillRect(bounds, Color.D_GRAY);
                        }}))
                        .add((()=>{
                            const info = new Labels(Font.def)
                                                .add(()=>`[${this.selectedItem}]`, ()=>Color.WHITE)
                                                .add(()=>{
                                                    const num = this.selectedItem.consumable 
                                                                ? `${this.selectedItem.remainingUseNum}/${this.selectedItem.num}`
                                                                : `${this.selectedItem.num}`
                                                                ;
                                                    const limit = this.selectedItem.num >= this.selectedItem.numLimit ? "（所持上限）" : "";
                                                    return `${num}個${limit}`;
                                                }, ()=>Color.WHITE)
                                                .add(()=>`<${this.selectedItem.itemType}>`, ()=>Color.WHITE)
                                                .add(()=>`Rank:${this.selectedItem.rank}`, ()=>Color.WHITE)
                                                .addln(()=>this.selectedItem.info, ()=>Color.WHITE)
                                                ;
                            return new VariableLayout(()=> this.selected ? info : ILayout.empty);
                        })())
                )
        );

        super.add(Qlace.BTN,  (()=>{
            // const otherBtns:ILayout[] = [
            //     new Btn("<<", ()=>{
            //         this.returnScene();
            //     }),
            //     (()=>{
            //         const canUse = new Btn(()=>"使用",async()=>{
            //             await this.use( this.selectedItem, this.user );
            //         });
            //         const cantUse = new Btn(()=>"-",()=>{});

            //         return new VariableLayout(()=>{
            //             if(!this.selected || !this.selectedItem.canUse(this.user, [this.user])){
            //                 return cantUse;
            //             }
            //             return canUse;
            //         });
            //     })(),
            // ];

            // const w = 2;
            // const h = ((otherBtns.length + ItemParentType.values.length + 1) / w)|0;
            // const l = new FlowLayout(w,h);
            // for(let type of ItemParentType.values){
            //     l.add(new Btn(type.toString(), ()=>{
            //         this.setList(type);
            //     }));
            // }

            // for(const o of otherBtns){
            //     l.addFromLast(o);
            // }
            const listH = 1 - Qlace.P_BOX.h;
            return new RatioLayout()
                .add(new Rect(0, 0, 1, listH), 
                    new List()
                        .init(list=>{
                            const push = (()=>{
                                let pushedElm:ListElm;
                                return (elm:ListElm)=>{
                                    if(pushedElm !== undefined){
                                        pushedElm.groundColor = ()=>Color.BLACK;
                                    }
                    
                                    pushedElm = elm;
                                    pushedElm.groundColor = ()=>Color.D_CYAN;
                                };
                            })();
                            
                            for(let type of ItemParentType.values){
                                list.add({
                                    center:()=>type.toString(),
                                    push:elm=>{
                                        push(elm);

                                        this.setList(type);
                                    },
                                })
                            }
                        })
                        .fit()
                )
                .add(new Rect(0, listH, 1, 1-listH), 
                    new YLayout()
                        .add((()=>{
                            const canUse = new Btn(()=>"使用",async()=>{
                                await this.use( this.selectedItem, this.user );
                            });
                            const cantUse = new Btn(()=>"-",()=>{});
        
                            return new VariableLayout(()=>{
                                if(!this.selected || !this.selectedItem.canUse(this.user, [this.user])){
                                    return cantUse;
                                }
                                return canUse;
                            });
                        })())
                        .add(new Btn("<<", ()=>{
                            this.returnScene();
                        }))
                )
            ;
        })());

        super.add(Qlace.P_BOX, DrawSTBoxes.players);
        super.add(Qlace.MAIN, DrawUnitDetail.ins);
            
        super.add(Rect.FULL, ILayout.create({draw:(bounds)=>{
            Graphics.fillRect(this.user.bounds, new Color(0,1,1,0.2));
        }}));
        super.add(Rect.FULL, ILayout.create({ctrl:(bounds)=>{
            if(!this.selectUser){return;}
            if(!Input.click){return;}

            for(let p of Unit.players.filter(p=> p.exists)){
                if(p.bounds.contains( Input.point )){
                    this.user = p;
                    break;
                }
            }
        }}));


        this.setList( ItemParentType.回復 );
    }


    private setList(parentType:ItemParentType){
        this.list.clear();

        for(let type of parentType.children){

            this.list.add({
                center:()=>`${type}`,
                groundColor:()=>Color.D_GRAY,
            });

            for(let item of type.values.filter(item=> item.num > 0)){
                this.list.add({
                    left:()=>{
                        if(item.consumable){return `${item.remainingUseNum}/${item.num}`;}
                        return `${item.num}`;
                    },
                    right:()=>`${item}`,
                    groundColor:()=>item === this.selectedItem ? Color.D_CYAN : Color.BLACK,
                    push:(elm)=>{
                        this.selected = true;
                        this.selectedItem = item;
                    },

                });
            }
        }
    }
}
