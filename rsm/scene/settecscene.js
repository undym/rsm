var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Scene } from "../undym/scene.js";
import { ILayout, VariableLayout, XLayout, RatioLayout, Labels, Label, Layout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit } from "../unit.js";
import { Input } from "../undym/input.js";
import { Rect, Color, Point } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail } from "./sceneutil.js";
import { Place } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { Tec, ActiveTec, TecSort } from "../tec.js";
import { FX_Str } from "../fx/fx.js";
import { Sound } from "../sound.js";
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
        const typeList = new List(7)
            .init(typeList => {
            typeList.add({
                center: () => "全て",
                push: elm => {
                    Sound.system.play();
                    (this.resetList = keepScroll => {
                        this.list.clear(keepScroll);
                        for (let type of TecSort.values) {
                            const tecs = type.tecs;
                            this.setList(this.target, `${type}`, tecs);
                        }
                    })(false);
                },
            });
            for (const type of TecSort.values) {
                typeList.add({
                    center: () => type.toString(),
                    push: elm => {
                        Sound.system.play();
                        (this.resetList = keepScroll => {
                            this.list.clear(keepScroll);
                            this.setList(this.target, `${type}`, type.tecs);
                        })(false);
                    },
                });
            }
        })
            .setRadioBtnMode(true)
            .push(0);
        super.clear();
        super.add(Place.LIST_MAIN, new XLayout()
            .add(this.settingTecList)
            .add(this.list)
            .add(new RatioLayout()
            .add(Place.LIST_INFO, infoLayout)
            .add(Place.LIST_USE_BTN, new VariableLayout(() => this.useBtn))));
        super.add(Place.LIST_TYPE, typeList);
        super.add(Place.YEN, new Label(Font.def, () => `BP:${this.target.bp}`, () => Color.ORANGE).setBase("right"));
        super.add(Place.LIST_BTN, new Btn("<<", () => {
            Sound.system.play();
            Scene.load(TownScene.ins);
        }));
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        super.add(Rect.FULL, ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(this.target.boxBounds, new Color(0, 1, 1, 0.2));
            } }));
        super.add(Rect.FULL, ILayout.create({ ctrl: (bounds) => {
                if (!Input.click) {
                    return;
                }
                for (let p of Unit.players.filter(p => p.exists)) {
                    if (p.boxBounds.contains(Input.point)) {
                        this.target = p;
                        this.setSettingTecList(p, false);
                        this.resetList(false);
                        Sound.system.play();
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
                        Sound.system.play();
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
                        Sound.system.play();
                    },
                });
            }
        });
    }
    createSetBtn(tec, unit) {
        const 外す = new Btn("外す", () => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < unit.tecs.length; i++) {
                if (unit.tecs[i] === tec) {
                    unit.tecs[i] = Tec.empty;
                    Sound.keyopen.play();
                    FX_Str(Font.def, `${tec}を外しました`, { x: 0.5, y: 0.5 }, Color.WHITE);
                    this.setSettingTecList(unit, true);
                    this.resetList(true);
                    return;
                }
            }
        }));
        const セット = new Btn("セット", () => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < unit.tecs.length; i++) {
                if (unit.tecs[i] === Tec.empty) {
                    unit.tecs[i] = tec;
                    Sound.keyopen.play();
                    FX_Str(Font.def, `${tec}をセットしました`, Point.CENTER, Color.WHITE);
                    this.setSettingTecList(unit, true);
                    return;
                }
            }
            FX_Str(Font.def, `技欄に空きがありません`, Point.CENTER, Color.WHITE);
        }));
        return new VariableLayout(() => {
            if (tec === Tec.empty) {
                return ILayout.empty;
            }
            return unit.tecs.some(t => t === tec) ? 外す : セット;
        });
    }
}
const createTecInfo = (tec, unit) => {
    const l = new Labels(Font.def)
        .add(() => `[${tec}]`)
        .add(() => `<${tec.type}>`)
        .addln(() => {
        let res = "";
        if (tec instanceof ActiveTec) {
            for (const cost of tec.costs) {
                res += `${cost.prm}:${cost.value} `;
            }
        }
        return res;
    })
        .addln(() => {
        let res = "";
        if (tec instanceof ActiveTec) {
            for (const set of tec.itemCost) {
                res += `${set.item}-${set.num}(${set.item.num}) `;
            }
        }
        return res;
    })
        .addln(() => tec.info);
    return l;
};
