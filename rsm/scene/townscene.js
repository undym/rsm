var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Scene } from "../undym/scene.js";
import { RatioLayout, YLayout, ILayout, VariableLayout, Labels } from "../undym/layout.js";
import { Place, Util, PlayData, Debug, SceneType } from "../util.js";
import { Btn } from "../widget/btn.js";
import { Dungeon, DungeonArea } from "../dungeon/dungeon.js";
import { Rect, Color, Point } from "../undym/type.js";
import DungeonScene from "./dungeonscene.js";
import { DungeonEvent } from "../dungeon/dungeonevent.js";
import { DrawUnitDetail, DrawSTBoxes, DrawYen } from "./sceneutil.js";
import { Unit, Prm } from "../unit.js";
import { createOptionBtn } from "./optionscene.js";
import { ItemScene } from "./itemscene.js";
import { Targeting } from "../force.js";
import { Font, Graphics, Texture } from "../graphics/graphics.js";
import { Item } from "../item.js";
import { SetTecScene } from "./settecscene.js";
import { MixScene } from "./mixscene.js";
import { EqScene } from "./eqscene.js";
import { ConditionType } from "../condition.js";
import { ShopScene } from "./shopscene.js";
import { FX } from "../fx/fx.js";
import { List } from "../widget/list.js";
import { MeisouScene } from "./meisouscene.js";
import { Mix } from "../mix.js";
import { JobChangeScene } from "./jobchangescene.js";
import { SaveData } from "../savedata.js";
let choosedDungeon;
export class TownScene extends Scene {
    static get ins() { return this._ins ? this._ins : (this._ins = new TownScene()); }
    constructor() {
        super();
    }
    init() {
        super.clear();
        super.add(Place.MSG, ILayout.create({ draw: bounds => DungeonArea.中央島.img.draw(bounds) }));
        super.add(Place.MSG, createDungeonBtnLayout());
        super.add(Place.DUNGEON_DATA, Util.msg);
        // super.add(Place.MSG, Util.msg);
        // Util.msg.set(`[${d}]`);
        // Util.msg.set(`Rank:${d.rank}`);
        // Util.msg.set(`Lv:${d.enemyLv}`);
        // Util.msg.set(`攻略回数:${d.dungeonClearCount}`, d.dungeonClearCount > 0 ? Color.WHITE : Color.GRAY);
        // Util.msg.set(`鍵:${d.treasureKey}`);
        // Util.msg.set(`財宝:`);
        // for(const t of d.treasures){
        //     if(t.totalGetCount > 0){
        //         Util.msg.add(`${t}/`);
        //     }else{
        //         Util.msg.add(`${"？".repeat( t.toString().length )}`, Color.GRAY);
        //     }
        // }
        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.BTN, new VariableLayout(() => TownBtn.ins));
        super.add(Place.E_BOX, new YLayout()
            .add((() => {
            const d = () => choosedDungeon;
            const l = new Labels(Font.def)
                .add(() => `[${d()}]`)
                .add(() => `Rank:${d().rank}`)
                .add(() => `Lv:${d().enemyLv}`)
                .add(() => `攻略回数:${d().dungeonClearCount}`, () => d().dungeonClearCount > 0 ? Color.WHITE : Color.GRAY)
                .add(() => `鍵:${d().treasureKey}`)
                .add(() => `財宝:`)
                .addArray(() => {
                const res = [];
                for (const t of d().treasures) {
                    if (t.totalGetCount > 0) {
                        res.push([`${t}/`]);
                    }
                    else {
                        res.push([`${"？".repeat(t.toString().length)}`, Color.GRAY]);
                    }
                }
                return res;
            });
            return new VariableLayout(() => choosedDungeon ? l : ILayout.empty);
        })())
            .add((() => {
            const btn = new Btn("侵入", () => {
                if (!choosedDungeon) {
                    return;
                }
                Dungeon.now = choosedDungeon;
                Dungeon.auNow = 0;
                DungeonEvent.now = DungeonEvent.empty;
                for (let item of Item.consumableValues()) {
                    item.remainingUseNum = item.num;
                }
                Util.msg.set(`${choosedDungeon}に侵入しました`);
                const h = 0.15;
                FX_DungeonName(choosedDungeon.toString(), Place.DUNGEON_DATA);
                choosedDungeon = undefined;
                Scene.load(DungeonScene.ins);
            });
            return new VariableLayout(() => choosedDungeon ? btn : ILayout.empty);
        })()));
        // super.add(Place.DUNGEON_DATA,
        //     (()=>{
        //         const btn = new Btn("侵入", ()=>{
        //             if(!choosedDungeon){return;}
        //             Dungeon.now = choosedDungeon;
        //             Dungeon.auNow = 0;
        //             DungeonEvent.now = DungeonEvent.empty;
        //             for(let item of Item.consumableValues()){
        //                 item.remainingUseNum = item.num;
        //             }
        //             Util.msg.set(`${choosedDungeon}に侵入しました`);
        //             const h = 0.15;
        //             FX_DungeonName( choosedDungeon.toString(), Place.DUNGEON_DATA );
        //             choosedDungeon = undefined;
        //             Scene.load( DungeonScene.ins );
        //         });
        //         return new VariableLayout(()=>choosedDungeon ? btn : ILayout.empty);
        //     })()
        // );
        super.add(Place.P_BOX, DrawSTBoxes.players);
        // super.add(Rect.FULL, DrawUnits.ins);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        //----------------------------------------------------
        SceneType.TOWN.set();
        TownBtn.reset();
        fullCare();
        //----------------------------------------------------
    }
}
const fullCare = () => {
    for (let u of Unit.players) {
        u.dead = false;
        u.hp = u.prm(Prm.MAX_HP).total;
        u.mp = u.prm(Prm.MAX_MP).total;
        u.tp = u.prm(Prm.MAX_TP).total;
        u.ep = u.prm(Prm.MAX_EP).total;
        for (const type of ConditionType.values) {
            u.clearCondition(type);
        }
    }
};
const createDungeonBtnLayout = () => {
    const area = DungeonArea.中央島;
    const l = new RatioLayout();
    Dungeon.values
        .filter(d => d.area === area && (d.isVisible() || Debug.debugMode))
        .forEach(d => {
        const btn = new Btn(d.dungeonClearCount > 0 ? `★${d}` : `${d}`, () => {
            choosedDungeon = d;
        });
        btn.groundColor = () => d === choosedDungeon ? Color.D_CYAN.bright(Date.now() / 50, 0.15) : Color.BLACK;
        btn.frameColor = () => Color.CLEAR;
        btn.stringColor = () => Color.WHITE;
        l.add(d.btnBounds, btn);
    });
    return l;
};
class TownBtn {
    static get ins() { return this._ins; }
    static reset() {
        const l = new List(6);
        // l.add({
        //     center:()=>"ダンジョン",
        //     push:elm=>{
        //         this.setDungeonList();
        //     },
        // });
        l.add({
            center: () => "アイテム",
            push: elm => {
                Scene.load(ItemScene.ins({
                    selectUser: true,
                    user: Unit.players[0],
                    use: (item, user) => __awaiter(this, void 0, void 0, function* () {
                        if (item.targetings & Targeting.SELECT) {
                            yield item.use(user, [user]);
                        }
                        else {
                            let targets = Targeting.filter(item.targetings, user, Unit.players, /*num*/ 1);
                            if (targets.length > 0) {
                                yield item.use(user, targets);
                            }
                        }
                    }),
                    returnScene: () => {
                        Scene.load(TownScene.ins);
                    },
                }));
            },
        });
        if (Dungeon.再構成トンネル.dungeonClearCount > 0 || Debug.debugMode) {
            l.add({
                center: () => "お店",
                push: elm => {
                    Scene.load(new ShopScene());
                },
            });
        }
        if (Item.合成許可証.num > 0 || Debug.debugMode) {
            l.add({
                center: () => "合成",
                push: elm => {
                    Scene.load(new MixScene());
                },
            });
        }
        if (Mix.転職所.count > 0 || Debug.debugMode) {
            l.add({
                center: () => "技のセット",
                push: elm => {
                    Scene.load(new SetTecScene());
                },
            });
        }
        if (Mix.転職所.count > 0 || Debug.debugMode) {
            l.add({
                center: () => "ジョブ",
                push: elm => {
                    Scene.load(new JobChangeScene());
                },
            });
        }
        if (PlayData.gotAnyEq || Debug.debugMode) {
            l.add({
                center: () => "装備",
                push: elm => {
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
        if (Mix.瞑想所.count > 0 || Debug.debugMode) {
            l.add({
                center: () => "瞑想",
                push: elm => {
                    Scene.load(new MeisouScene());
                },
            });
        }
        l.add({
            center: () => "セーブ",
            push: elm => {
                SaveData.save();
            },
        });
        l.add({
            center: () => "OPTION",
            push: elm => {
                this._ins = createOptionBtn();
            },
        });
        this._ins = l;
    }
    static setDungeonList() {
        const list = new List(6);
        // const visibleDungeons = Dungeon.values.filter(d=> d.isVisible() || Debug.debugMode);
        Dungeon.values
            .filter(d => d.isVisible() || Debug.debugMode)
            .forEach((d, index) => {
            list.add({
                center: () => d.dungeonClearCount > 0 ? `★${d}` : `${d}`,
                groundColor: () => d === choosedDungeon ? Color.D_CYAN : Color.BLACK,
                push: elm => {
                    this.dungeonListScroll = index;
                    choosedDungeon = d;
                    Util.msg.set("");
                    Util.msg.set("");
                    Util.msg.set(`[${d}]`);
                    Util.msg.set(`Rank:${d.rank}`);
                    Util.msg.set(`Lv:${d.enemyLv}`);
                    Util.msg.set(`攻略回数:${d.dungeonClearCount}`, d.dungeonClearCount > 0 ? Color.WHITE : Color.GRAY);
                    Util.msg.set(`鍵:${d.treasureKey}`);
                    Util.msg.set(`財宝:`);
                    for (const t of d.treasures) {
                        if (t.totalGetCount > 0) {
                            Util.msg.add(`${t}/`);
                        }
                        else {
                            Util.msg.add(`${"？".repeat(t.toString().length)}`, Color.GRAY);
                        }
                    }
                },
            });
        });
        list.setScroll(this.dungeonListScroll, "center");
        const listH = 0.85;
        this._ins = new RatioLayout()
            .add(new Rect(0, 0, 1, listH), list)
            .add(new Rect(0, listH, 1, 1 - listH), new Btn("<<", () => {
            choosedDungeon = undefined;
            this.reset();
        }));
        ;
    }
}
TownBtn.dungeonListScroll = 0;
const FX_DungeonName = (name, bounds) => {
    const fontSize = 60;
    const font = new Font(fontSize, Font.ITALIC);
    const tex = new Texture({ pixelSize: { w: font.measurePixelW(name), h: fontSize } });
    tex.setRenderTarget(() => {
        font.draw(name, Point.ZERO, Color.WHITE);
    });
    const flash = () => {
        const addX = 0.01;
        const addY = 0.01;
        const b = new Rect(bounds.x - addX, bounds.y - addY, bounds.w + addX * 2, bounds.h + addY * 2);
        let alpha = 1.0;
        FX.add((count) => {
            Graphics.setAlpha(alpha, () => {
                tex.draw(b);
            });
            alpha -= 0.1;
            return alpha > 0;
        });
    };
    let alpha = 1.0;
    FX.add((count) => {
        const countLim = 45;
        let w = count / countLim * tex.pixelW;
        if (w > tex.pixelW) {
            w = tex.pixelW;
            if (alpha === 1.0) {
                flash();
            }
            alpha -= 0.03;
            if (alpha <= 0) {
                FX.add(count => {
                    const over = 30;
                    Graphics.fillRect(bounds, new Color(0, 0, 0, 1 - count / over));
                    return count < over;
                });
                return false;
            }
        }
        Graphics.fillRect(bounds, Color.BLACK);
        Graphics.setAlpha(alpha, () => {
            for (let i = 0; i < w; i += 2) {
                tex.draw({
                    x: bounds.x + i / tex.pixelW * bounds.w,
                    y: bounds.y,
                    w: 1 / tex.pixelW * bounds.w,
                    h: bounds.h,
                }, {
                    x: i / tex.pixelW,
                    y: 0,
                    w: 1 / tex.pixelW,
                    h: 1,
                });
            }
            const add = tex.pixelW % 2 + 1;
            for (let i = tex.pixelW - add; i > tex.pixelW - w; i -= 2) {
                tex.draw({
                    x: bounds.x + i / tex.pixelW * bounds.w,
                    y: bounds.y,
                    w: 1 / tex.pixelW * bounds.w,
                    h: bounds.h,
                }, {
                    x: i / tex.pixelW,
                    y: 0,
                    w: 1 / tex.pixelW,
                    h: 1,
                });
            }
        });
        return true;
    });
};
