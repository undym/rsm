var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Scene } from "../undym/scene.js";
import { ILayout, VariableLayout, XLayout, Labels, Label, Layout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit } from "../unit.js";
import { Input } from "../undym/input.js";
import { Rect, Color, Point } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail } from "./sceneutil.js";
import { Place } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { TecType, Tec, ActiveTec } from "../tec.js";
import { FX_Str } from "../fx/fx.js";
export class SetTecScene extends Scene {
    constructor() {
        super();
        this.settingTecList = new List();
        this.list = new List();
        this.target = Unit.getFirstPlayer();
        this.choosedTec = Tec.empty;
        this.info = ILayout.empty;
        this.useBtn = ILayout.empty;
        this.setSettingTecList(this.target, true);
        (this.resetList = keepScroll => {
            const type = TecType.格闘;
            this.list.clear(keepScroll);
            this.setList(this.target, `${type}`, type.tecs);
        })(false);
    }
    init() {
        const infoLayout = new Layout()
            .add(ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(bounds, Color.D_GRAY);
            } }))
            .add((() => {
            return new VariableLayout(() => {
                return this.info;
            });
        })());
        const typeList = new List()
            .init(list => {
            list.add({
                center: () => "全て",
                push: elm => {
                    (this.resetList = keepScroll => {
                        this.list.clear(keepScroll);
                        for (let type of TecType.values()) {
                            const tecs = type.tecs;
                            this.setList(this.target, `${type}`, tecs);
                        }
                    })(false);
                },
            });
            for (const type of TecType.values()) {
                list.add({
                    center: () => type.toString(),
                    push: elm => {
                        (this.resetList = keepScroll => {
                            this.list.clear(keepScroll);
                            this.setList(this.target, `${type}`, type.tecs);
                        })(false);
                    },
                });
            }
        })
            .fit();
        // const listBtnLayout = new XLayout()
        //                         .add((()=>{
        //                             const choosedTecIsSetting = ()=> this.target.tecs.some(t=> t === this.choosedTec)
        //                             const set = new Btn("セット",async()=>{
        //                                 if(!this.choosedTec){return;}
        //                                 for(let i = 0; i < this.target.tecs.length; i++){
        //                                     if(this.target.tecs[i] === Tec.empty){
        //                                             this.target.tecs[i] = this.choosedTec;
        //                                             FX_Str(Font.def, `${this.choosedTec}をセットしました`, {x:0.5, y:0.5}, Color.WHITE);
        //                                             this.setSettingTecList(this.target, true);
        //                                             return;
        //                                     }
        //                                 }
        //                                 FX_Str(Font.def, `技欄に空きがありません`, {x:0.5, y:0.5}, Color.WHITE);
        //                             });
        //                             const unset = new Btn("外す",async()=>{
        //                                 if(!this.choosedTec){return;}
        //                                 for(let i = 0; i < this.target.tecs.length; i++){
        //                                     if(this.target.tecs[i] === this.choosedTec){
        //                                         this.target.tecs[i] = Tec.empty;
        //                                         FX_Str(Font.def, `${this.choosedTec}を外しました`, {x:0.5, y:0.5}, Color.WHITE);
        //                                         this.setSettingTecList(this.target, true);
        //                                         this.resetList(true);
        //                                         return;
        //                                     }
        //                                 }
        //                             });
        //                             return new VariableLayout(()=>{
        //                                 if(choosedTecIsSetting()){
        //                                     return unset;
        //                                 }
        //                                 return set;
        //                             });
        //                         })())
        //                         .add(new Btn("<<", ()=>{
        //                             Scene.load( TownScene.ins );
        //                         }))
        //                         ;
        super.clear();
        super.add(Place.LIST_MAIN, new XLayout()
            .add(this.settingTecList)
            .add(this.list)
            .add(infoLayout));
        super.add(Place.LIST_TYPE, typeList);
        // super.add(Place.YEN, DrawYen.ins);
        super.add(Place.YEN, new Label(Font.def, () => `BP:${this.target.bp}`, () => Color.ORANGE).setBase(Font.RIGHT));
        super.add(Place.LIST_BTN, new XLayout()
            .add(new VariableLayout(() => this.useBtn))
            .add(new Btn("<<", () => {
            Scene.load(TownScene.ins);
        })));
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        super.add(Rect.FULL, ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(this.target.bounds, new Color(0, 1, 1, 0.2));
            } }));
        super.add(Rect.FULL, ILayout.create({ ctrl: (bounds) => {
                if (!Input.click) {
                    return;
                }
                for (let p of Unit.players.filter(p => p.exists)) {
                    if (p.bounds.contains(Input.point)) {
                        this.target = p;
                        this.setSettingTecList(p, false);
                        this.resetList(false);
                        break;
                    }
                }
            } }));
    }
    setSettingTecList(unit, keepScroll) {
        this.settingTecList.clear(keepScroll);
        this.settingTecList.add({
            center: () => `セット中`,
            groundColor: () => Color.D_GRAY,
        });
        unit.tecs
            .forEach((tec) => {
            if (tec === Tec.empty) {
                this.settingTecList.add({
                    right: () => "-",
                });
            }
            else {
                this.settingTecList.add({
                    right: () => `${tec}`,
                    groundColor: () => tec === this.choosedTec ? Color.D_CYAN : Color.BLACK,
                    push: (elm) => {
                        this.choosedTec = tec;
                        this.info = createTecInfo(tec, unit);
                        this.useBtn = this.createSetBtn(tec, unit);
                    },
                });
            }
        });
    }
    setList(unit, listTypeName, tecs) {
        const settingTecs = new Map();
        for (const t of unit.tecs) {
            settingTecs.set(t, true);
        }
        ;
        this.list.add({
            center: () => `${listTypeName}`,
            groundColor: () => Color.D_GRAY,
        });
        tecs
            .filter(tec => unit.isMasteredTec(tec))
            .forEach((tec) => {
            if (tec === Tec.empty) {
                this.list.add({
                    right: () => "-",
                });
            }
            else {
                const color = () => {
                    if (settingTecs.has(tec)) {
                        return Color.ORANGE;
                    }
                    return Color.WHITE;
                };
                this.list.add({
                    left: () => settingTecs.has(tec) ? "=" : ``,
                    leftColor: color,
                    right: () => `${tec}`,
                    rightColor: color,
                    groundColor: () => tec === this.choosedTec ? Color.D_CYAN : Color.BLACK,
                    push: (elm) => {
                        this.choosedTec = tec;
                        this.info = createTecInfo(tec, unit);
                        this.useBtn = this.createSetBtn(tec, unit);
                    },
                });
            }
        });
        tecs
            .filter(tec => {
            if (unit.isMasteredTec(tec)) {
                return false;
            }
            const learning = tec.learning;
            return (learning && learning.origins.every(t => unit.isMasteredTec(t)));
        })
            .forEach(tec => {
            const learning = tec.learning;
            if (!learning) {
                return;
            }
            this.list.add({
                left: () => `${learning.bp}`,
                right: () => `${tec}`,
                groundColor: () => tec === this.choosedTec ? Color.ORANGE.darker() : Color.BLACK,
                push: (elm) => {
                    this.choosedTec = tec;
                    this.info = createTecInfo(tec, unit);
                    this.useBtn = this.createLearnBtn(tec, unit);
                },
            });
        });
    }
    createSetBtn(tec, unit) {
        if (unit.tecs.some(t => t === tec)) {
            return new Btn("外す", () => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < unit.tecs.length; i++) {
                    if (unit.tecs[i] === tec) {
                        unit.tecs[i] = Tec.empty;
                        FX_Str(Font.def, `${tec}を外しました`, { x: 0.5, y: 0.5 }, Color.WHITE);
                        this.setSettingTecList(unit, true);
                        this.resetList(true);
                        return;
                    }
                }
            }));
        }
        else {
            return new Btn("セット", () => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < unit.tecs.length; i++) {
                    if (unit.tecs[i] === Tec.empty) {
                        unit.tecs[i] = tec;
                        FX_Str(Font.def, `${tec}をセットしました`, Point.CENTER, Color.WHITE);
                        this.setSettingTecList(unit, true);
                        return;
                    }
                }
                FX_Str(Font.def, `技欄に空きがありません`, Point.CENTER, Color.WHITE);
            }));
        }
    }
    createLearnBtn(tec, unit) {
        return new Btn("覚える", () => __awaiter(this, void 0, void 0, function* () {
            const learning = tec.learning;
            if (!learning) {
                return;
            }
            if (unit.bp < learning.bp) {
                FX_Str(Font.def, `BPが足りない`, Point.CENTER, Color.WHITE);
                return;
            }
            unit.bp -= learning.bp;
            unit.setMasteredTec(tec, true);
            FX_Str(Font.def, `${unit.name}は[${tec}]を習得した`, Point.CENTER, Color.WHITE);
            for (const gp of learning.growthPrms) {
                unit.prm(gp.prm).base += gp.value;
            }
            this.useBtn = this.createSetBtn(tec, unit);
        }));
    }
}
const createTecInfo = (tec, unit) => {
    const l = new Labels(Font.def)
        .add(() => `[${tec}]`)
        .add(() => `<${tec.type}>`)
        .addln(() => {
        let res = "";
        if (tec instanceof ActiveTec) {
            if (tec.mpCost > 0) {
                res += `MP:${tec.mpCost} `;
            }
            if (tec.tpCost > 0) {
                res += `TP:${tec.tpCost} `;
            }
            if (tec.epCost > 0) {
                res += `EP:${tec.epCost} `;
            }
            for (const set of tec.itemCost) {
                res += `${set.item}-${set.num}(${set.item.num}) `;
            }
        }
        return res;
    })
        .addln(() => tec.info);
    if (!unit.isMasteredTec(tec)) {
        l.add(() => "習得ボーナス");
        const learning = tec.learning;
        if (learning) {
            for (const gp of learning.growthPrms) {
                l.add(() => ` ${gp.prm}+${gp.value}`);
            }
        }
    }
    return l;
};
// const createSetBtn = (tec:Tec, unit:PUnit)=>{
//     const choosedTecIsSetting = ()=> unit.tecs.some(t=> t === this.choosedTec)
//     const set = new Btn("セット",async()=>{
//         for(let i = 0; i < unit.tecs.length; i++){
//             if(unit.tecs[i] === Tec.empty){
//                     unit.tecs[i] = tec;
//                     FX_Str(Font.def, `${tec}をセットしました`, {x:0.5, y:0.5}, Color.WHITE);
//                     this.setSettingTecList(this.target, true);
//                     return;
//             }
//         }
//         FX_Str(Font.def, `技欄に空きがありません`, {x:0.5, y:0.5}, Color.WHITE);
//     });
//     const unset = new Btn("外す",async()=>{
//         if(!this.choosedTec){return;}
//         for(let i = 0; i < this.target.tecs.length; i++){
//             if(this.target.tecs[i] === this.choosedTec){
//                 this.target.tecs[i] = Tec.empty;
//                 FX_Str(Font.def, `${this.choosedTec}を外しました`, {x:0.5, y:0.5}, Color.WHITE);
//                 this.setSettingTecList(this.target, true);
//                 this.resetList(true);
//                 return;
//             }
//         }
//     });
//     return new VariableLayout(()=>{
//         if(choosedTecIsSetting()){
//             return unset;
//         }
//         return set;
//     });
// }
