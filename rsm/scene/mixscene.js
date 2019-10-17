var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Scene } from "../undym/scene.js";
import { ILayout, VariableLayout, XLayout, Labels, Layout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Color } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail, DrawYen } from "./sceneutil.js";
import { Place } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { Item } from "../item.js";
import { Mix } from "../mix.js";
import { Eq, EqEar } from "../eq.js";
import { SaveData } from "../savedata.js";
export class MixScene extends Scene {
    constructor() {
        super();
        this.list = new List();
        this.choosed = false;
        /**セーブフラグ. */
        this.doneAnyMix = false;
        this.setList("建築", Mix.values.filter(m => !m.result && m.isVisible()));
    }
    init() {
        const typeList = new List()
            .init(list => {
            const push = (() => {
                let pushedElm;
                return (elm) => {
                    if (pushedElm !== undefined) {
                        pushedElm.groundColor = () => Color.BLACK;
                    }
                    pushedElm = elm;
                    pushedElm.groundColor = () => Color.D_CYAN;
                };
            })();
            list.add({
                center: () => "建築",
                push: elm => {
                    push(elm);
                    const values = Mix.values
                        .filter(m => !m.result && m.isVisible());
                    this.setList("建築", values);
                },
            });
            list.add({
                center: () => "装備",
                push: elm => {
                    push(elm);
                    const values = Mix.values
                        .filter(m => {
                        const result = m.result;
                        if (result && result.object instanceof Eq && m.isVisible()) {
                            return true;
                        }
                        return false;
                    });
                    this.setList("装備", values);
                },
            });
            list.add({
                center: () => "アイテム",
                push: elm => {
                    push(elm);
                    const values = Mix.values
                        .filter(m => {
                        const result = m.result;
                        if (result && result.object instanceof Item && m.isVisible()) {
                            return true;
                        }
                        return false;
                    });
                    this.setList("アイテム", values);
                },
            });
        })
            .fit();
        super.clear();
        super.add(Place.LIST_MAIN, new XLayout()
            .add(this.list)
            .add(new Layout()
            .add(ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(bounds, Color.D_GRAY);
            } }))
            .add((() => {
            const info = new Labels(Font.def)
                .add(() => {
                if (this.choosedMix.countLimit === Mix.LIMIT_INF) {
                    return `合成回数(${this.choosedMix.count}/-)`;
                }
                else {
                    return `合成回数(${this.choosedMix.count}/${this.choosedMix.countLimit})`;
                }
            })
                .addArray(() => {
                let res = [];
                for (let m of this.choosedMix.materials) {
                    const color = m.num <= m.object.num ? Color.WHITE : Color.GRAY;
                    res.push([`[${m.object}] ${m.object.num}/${m.num}`, color]);
                }
                const result = this.choosedMix.result;
                if (result) {
                    res.push([""]);
                    if (result.object instanceof Eq) {
                        res.push([`<${result.object.pos}>`]);
                    }
                    if (result.object instanceof EqEar) {
                        res.push([`<耳>`]);
                    }
                    if (result.object instanceof Item) {
                        res.push([`<${result.object.itemType}>`]);
                    }
                }
                return res;
            })
                .br()
                .addln(() => {
                if (this.choosedMix.info) {
                    return this.choosedMix.info;
                }
                const result = this.choosedMix.result;
                if (!result) {
                    return "";
                }
                return result.object.info;
            });
            return new VariableLayout(() => {
                return this.choosed ? info : ILayout.empty;
            });
        })())));
        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.LIST_TYPE, typeList);
        super.add(Place.LIST_BTN, new XLayout()
            .add((() => {
            const canMix = () => {
                if (!this.choosedMix) {
                    return false;
                }
                return this.choosedMix.canRun();
            };
            const run = new Btn("合成", () => __awaiter(this, void 0, void 0, function* () {
                if (!this.choosedMix) {
                    return;
                }
                this.choosedMix.run();
                this.doneAnyMix = true;
            }));
            const noRun = new Btn("-", () => __awaiter(this, void 0, void 0, function* () { }));
            return new VariableLayout(() => {
                return canMix() ? run : noRun;
            });
        })())
            .add(new Btn("<<", () => {
            if (this.doneAnyMix) {
                SaveData.save();
            }
            Scene.load(TownScene.ins);
        })));
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
    }
    setList(name, values) {
        this.list.clear();
        this.list.add({
            center: () => name,
            groundColor: () => Color.D_GRAY,
        });
        values
            .forEach(mix => {
            const color = () => {
                if (!mix.canRun()) {
                    return Color.GRAY;
                }
                return Color.WHITE;
            };
            this.list.add({
                left: () => {
                    if (mix.countLimit === Mix.LIMIT_INF) {
                        return `${mix.count}`;
                    }
                    return `${mix.count}/${mix.countLimit}`;
                },
                leftColor: color,
                right: () => mix.toString(),
                rightColor: color,
                groundColor: () => mix === this.choosedMix ? Color.D_CYAN : Color.BLACK,
                push: (elm) => {
                    this.choosedMix = mix;
                    this.choosed = true;
                },
            });
        });
    }
}
