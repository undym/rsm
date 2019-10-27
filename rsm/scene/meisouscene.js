import { Scene } from "../undym/scene.js";
import { Place } from "../util.js";
import { DrawSTBoxes, DrawUnitDetail, DrawYen } from "./sceneutil.js";
import { YLayout, ILayout, XLayout, Labels, Layout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit, Prm } from "../unit.js";
import { Rect, Color, Point } from "../undym/type.js";
import { FX_Str } from "../fx/fx.js";
import { Input } from "../undym/input.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { TownScene } from "./townscene.js";
export class MeisouScene extends Scene {
    constructor() {
        super();
        this.target = Unit.getFirstPlayer();
    }
    init() {
        super.clear();
        const addPrm = (prm, value) => {
            if (this.target.bp < 1) {
                FX_Str(Font.def, `BPが足りない`, Point.CENTER, Color.WHITE);
                return;
            }
            this.target.bp--;
            this.target.prm(prm).base += value;
            FX_Str(Font.def, `[${prm}]が${this.target.prm(prm).total}になった`, Point.CENTER, Color.CYAN);
        };
        super.add(Place.LIST_MAIN, new XLayout()
            .add(new XLayout()
            .add(new YLayout()
            .add(new Btn("HP+2", () => addPrm(Prm.MAX_HP, 2)))
            .add(new Btn("MP+1", () => addPrm(Prm.MAX_MP, 1)))
            .add(new Btn("力+1", () => addPrm(Prm.STR, 1)))
            .add(new Btn("光+1", () => addPrm(Prm.LIG, 1)))
            .add(new Btn("鎖+1", () => addPrm(Prm.CHN, 1)))
            .add(new Btn("銃+1", () => addPrm(Prm.GUN, 1))))
            .add(new YLayout()
            .add(ILayout.empty)
            .add(new Btn("TP+1", () => addPrm(Prm.MAX_TP, 1)))
            .add(new Btn("魔+1", () => addPrm(Prm.MAG, 1)))
            .add(new Btn("闇+1", () => addPrm(Prm.DRK, 1)))
            .add(new Btn("過+1", () => addPrm(Prm.PST, 1)))
            .add(new Btn("弓+1", () => addPrm(Prm.ARR, 1)))))
            .add(new Layout()
            .add(ILayout.create({ draw: bounds => {
                Graphics.fillRect(bounds, Color.D_GRAY);
            } }))
            .add(new Labels(Font.def)
            .add(() => `[${this.target.name}]`)
            .add(() => `BP:${this.target.bp}`)
            .add(() => `HP:${this.target.prm(Prm.MAX_HP).total}`)
            .add(() => `MP:${this.target.prm(Prm.MAX_MP).total}`)
            .add(() => `TP:${this.target.prm(Prm.MAX_TP).total}`)
            .add(() => `力:${this.target.prm(Prm.STR).total}`)
            .add(() => `魔:${this.target.prm(Prm.MAG).total}`)
            .add(() => `光:${this.target.prm(Prm.LIG).total}`)
            .add(() => `闇:${this.target.prm(Prm.DRK).total}`)
            .add(() => `鎖:${this.target.prm(Prm.CHN).total}`)
            .add(() => `過:${this.target.prm(Prm.PST).total}`)
            .add(() => `銃:${this.target.prm(Prm.GUN).total}`)
            .add(() => `弓:${this.target.prm(Prm.ARR).total}`)))
        // .add(this.list)
        // .add(
        //     new RatioLayout()
        //         .add(Place.LIST_INFO,
        //             new Layout()
        //                 .add(ILayout.create({draw:(bounds)=>{
        //                     Graphics.fillRect(bounds, Color.D_GRAY);
        //                 }}))
        //                 .add((()=>{
        //                     const info = new Labels(Font.def)
        //                                         .add(()=>`[${this.selectedItem}]`, ()=>Color.WHITE)
        //                                         .add(()=>{
        //                                             const num = this.selectedItem.consumable 
        //                                                         ? `${this.selectedItem.remainingUseNum}/${this.selectedItem.num}`
        //                                                         : `${this.selectedItem.num}`
        //                                                         ;
        //                                             const limit = this.selectedItem.num >= this.selectedItem.numLimit ? "（所持上限）" : "";
        //                                             return `${num}個${limit}`;
        //                                         }, ()=>Color.WHITE)
        //                                         .add(()=>`<${this.selectedItem.itemType}>`, ()=>Color.WHITE)
        //                                         .add(()=>`Rank:${this.selectedItem.rank}`, ()=>Color.WHITE)
        //                                         .addln(()=>this.selectedItem.info, ()=>Color.WHITE)
        //                                         ;
        //                     return new VariableLayout(()=> this.selected ? info : ILayout.empty);
        //                 })())
        //         )
        //         .add(Place.LIST_USE_BTN,(()=>{
        //             const canUse = new Btn(()=>"使用",async()=>{
        //                 await this.use( this.selectedItem, this.user );
        //             });
        //             const cantUse = new Btn(()=>"-",()=>{});
        //             return new VariableLayout(()=>{
        //                 if(!this.selected || !this.selectedItem.canUse(this.user, [this.user])){
        //                     return cantUse;
        //                 }
        //                 return canUse;
        //             });
        //         })()
        //         )
        // )
        );
        super.add(Place.YEN, DrawYen.ins);
        // super.add(Place.LIST_TYPE,
        //     new List()
        //         .init(typeList=>{
        //             for(let type of ItemParentType.values){
        //                 typeList.add({
        //                     center:()=>type.toString(),
        //                     push:elm=>{
        //                         this.setList(type);
        //                     },
        //                 })
        //             }
        //         })
        //         .fit()
        //         .setRadioBtnMode(true, ()=>Color.BLACK, ()=>Color.D_CYAN)
        //         .push(0)
        // );
        super.add(Place.LIST_BTN, new Btn("<<", () => {
            Scene.load(TownScene.ins);
        }));
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        super.add(Rect.FULL, ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(this.target.boxBounds, new Color(0, 1, 1, 0.2));
            } }));
        super.add(Rect.FULL, ILayout.create({ ctrl: (bounds) => {
                for (let p of Unit.players.filter(p => p.exists)) {
                    if (p.boxBounds.contains(Input.point)) {
                        this.target = p;
                        break;
                    }
                }
            } }));
    }
}
