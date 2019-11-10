var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Scene } from "../undym/scene.js";
import { Place } from "../util.js";
import { DrawSTBoxes, DrawUnitDetail, DrawYen } from "./sceneutil.js";
import { ILayout, RatioLayout, VariableLayout, XLayout, Labels, Layout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit } from "../unit.js";
import { List } from "../widget/list.js";
import { Rect, Color } from "../undym/type.js";
import { Item, ItemParentType } from "../item.js";
import { Input } from "../undym/input.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { Sound } from "../sound.js";
export class ItemScene extends Scene {
    constructor() {
        super();
        this.selected = false;
        this.list = new List();
    }
    static ins(args) {
        this._ins ? this._ins : (this._ins = new ItemScene());
        this._ins.selectUser = args.selectUser;
        this._ins.user = args.user;
        this._ins.use = args.use;
        this._ins.returnScene = args.returnScene;
        return this._ins;
    }
    init() {
        this.selected = false;
        this.selectedItem = Item.石;
        super.clear();
        super.add(Place.LIST_MAIN, new XLayout()
            .add(this.list)
            .add(new RatioLayout()
            .add(Place.LIST_INFO, new Layout()
            .add(ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(bounds, Color.D_GRAY);
            } }))
            .add((() => {
            const info = new Labels(Font.def)
                .add(() => `[${this.selectedItem}]`, () => Color.WHITE)
                .add(() => {
                const num = this.selectedItem.consumable
                    ? `${this.selectedItem.remainingUseNum}/${this.selectedItem.num}`
                    : `${this.selectedItem.num}`;
                const limit = this.selectedItem.num >= this.selectedItem.numLimit ? "（所持上限）" : "";
                return `${num}個${limit}`;
            }, () => Color.WHITE)
                .add(() => `<${this.selectedItem.itemType}>`, () => Color.WHITE)
                .add(() => `Rank:${this.selectedItem.rank}`, () => Color.WHITE)
                .addln(() => this.selectedItem.info, () => Color.WHITE);
            return new VariableLayout(() => this.selected ? info : ILayout.empty);
        })()))
            .add(Place.LIST_USE_BTN, (() => {
            const canUse = new Btn(() => "使用", () => __awaiter(this, void 0, void 0, function* () {
                yield this.use(this.selectedItem, this.user);
            }));
            const cantUse = new Btn(() => "-", () => { });
            return new VariableLayout(() => {
                if (!this.selected || !this.selectedItem.canUse(this.user, [this.user])) {
                    return cantUse;
                }
                return canUse;
            });
        })())));
        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.LIST_TYPE, new List()
            .init(typeList => {
            for (let type of ItemParentType.values) {
                typeList.add({
                    center: () => type.toString(),
                    push: elm => {
                        Sound.pi.play();
                        this.setList(type);
                    },
                });
            }
        })
            .fit()
            .setRadioBtnMode(true, () => Color.BLACK, () => Color.D_CYAN)
            .push(0));
        super.add(Place.LIST_BTN, new Btn("<<", () => {
            Sound.pi.play();
            this.returnScene();
        }));
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        super.add(Rect.FULL, ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(this.user.boxBounds, new Color(0, 1, 1, 0.2));
            } }));
        super.add(Rect.FULL, ILayout.create({ ctrl: (bounds) => {
                if (!this.selectUser) {
                    return;
                }
                if (!Input.click) {
                    return;
                }
                for (let p of Unit.players.filter(p => p.exists)) {
                    if (p.boxBounds.contains(Input.point)) {
                        this.user = p;
                        break;
                    }
                }
            } }));
    }
    setList(parentType) {
        this.list.clear();
        for (let type of parentType.children) {
            this.list.add({
                center: () => `${type}`,
                groundColor: () => Color.D_GRAY,
            });
            for (let item of type.values.filter(item => item.num > 0)) {
                this.list.add({
                    left: () => {
                        if (item.consumable) {
                            return `${item.remainingUseNum}/${item.num}`;
                        }
                        return `${item.num}`;
                    },
                    right: () => `${item}`,
                    groundColor: () => item === this.selectedItem ? Color.D_CYAN : Color.BLACK,
                    push: (elm) => {
                        this.selected = true;
                        this.selectedItem = item;
                    },
                });
            }
        }
    }
}
