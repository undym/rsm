import { ILayout, Label, XLayout, Layout, VariableLayout, InnerLayout, Labels } from "../undym/layout.js";
import { YLayout } from "../undym/layout.js";
import Gage from "../widget/gage.js";
import { Dungeon } from "../dungeon/dungeon.js";
import { Color, Rect } from "../undym/type.js";
import { PlayData, Debug, Place } from "../util.js";
import { Unit, Prm, PUnit } from "../unit.js";
import { Input } from "../undym/input.js";
import { ConditionType } from "../condition.js";
import { EqPos } from "../eq.js";
import { Font, Graphics } from "../graphics/graphics.js";
import { Img } from "../graphics/texture.js";
import { Version } from "../savedata.js";
export class DrawPlayInfo extends InnerLayout {
    static get ins() {
        return this._ins ? this._ins
            : (this._ins = new DrawPlayInfo());
    }
    constructor() {
        super();
        super.add(new XLayout()
            .add(ILayout.empty)
            .add(new Label(Font.def, () => {
            if (Debug.debugMode) {
                return `Debug{${Version.NOW}}`;
            }
            else {
                return `Version{${Version.NOW}}`;
            }
        }, () => Debug.DEBUG ? Color.RED : Color.WHITE)
            .setBase("left"))
            .add(new Label(Font.def, () => `${PlayData.yen | 0}円`, () => Color.YELLOW).setBase("right")));
    }
}
export class DrawYen extends InnerLayout {
    static get ins() {
        return this._ins ? this._ins
            : (this._ins = new DrawYen());
    }
    constructor() {
        super();
        super.add(new Label(Font.def, () => `${PlayData.yen | 0}円`, () => Color.YELLOW).setBase("right"));
    }
}
export class DrawDungeonData extends InnerLayout {
    static get ins() { return this._ins ? this._ins : (this._ins = new DrawDungeonData()); }
    constructor() {
        super();
        super.add(new YLayout()
            .setOutsidePixelMargin(1, 1, 2, 1)
            .add(new Label(Font.def, () => `[${Dungeon.now}] Rank:${Dungeon.now.rank}`))
            .add(new Gage(() => Dungeon.auNow, () => Dungeon.now.au, () => "AU", () => `${Dungeon.auNow}/${Dungeon.now.au}`, () => Color.D_CYAN.bright(), Font.def, 2))
            .add(ILayout.empty));
    }
}
export class DrawSTBox extends InnerLayout {
    constructor(getUnit) {
        super();
        const font = new Font(30);
        const frame = ILayout.create({ draw: (bounds) => {
                Graphics.drawRect(bounds, Color.L_GRAY);
            } });
        const l = new Layout()
            .add(frame)
            .add(new YLayout()
            .setOutsidePixelMargin(1, 1, 1, 1)
            .add(new XLayout()
            .add(new Label(font, () => getUnit().name))
            .add(new Label(font, () => `Lv${getUnit().prm(Prm.LV).total | 0}`, () => {
            const u = getUnit();
            return (u instanceof PUnit && u.isMasteredJob(u.job)) ? Color.YELLOW : Color.WHITE;
        }).setBase("right")))
            .add(new Gage(() => getUnit().hp, () => getUnit().prm(Prm.MAX_HP).total, () => "HP", () => `${getUnit().hp | 0}`, () => Color.D_GREEN.bright(), font, 2))
            .add(new XLayout()
            .setPixelMargin(4)
            .add(new Gage(() => getUnit().prm(Prm.MP).base, () => getUnit().prm(Prm.MAX_MP).total, () => "MP", () => `${getUnit().prm(Prm.MP).base | 0}`, () => Color.D_RED.bright(), font, 2))
            .add(new Gage(() => getUnit().prm(Prm.TP).base, () => getUnit().prm(Prm.MAX_TP).total, () => "TP", () => `${getUnit().prm(Prm.TP).base | 0}`, () => Color.D_CYAN.bright(), font, 2)))
            .add(new Label(font, () => createConditionStr(getUnit(), ConditionType.goodConditions())).setColor(() => Color.CYAN))
            .add(new Label(font, () => createConditionStr(getUnit(), ConditionType.badConditions())).setColor(() => Color.RED))
            .add(ILayout.empty))
            .add(ILayout.create({ draw: (bounds) => {
                if (getUnit().dead) {
                    Graphics.fillRect(bounds, new Color(1, 0, 0, 0.2));
                }
            } }));
        super.add(new VariableLayout(() => {
            if (getUnit().exists) {
                return l;
            }
            return frame;
        }));
    }
}
export class DrawSTBoxes extends InnerLayout {
    static get players() {
        return this._players ? this._players
            : (this._players = new DrawSTBoxes(Unit.players.length, i => Unit.players[i]));
    }
    static get enemies() {
        return this._enemies ? this._enemies
            : (this._enemies = new DrawSTBoxes(Unit.enemies.length, i => Unit.enemies[i]));
    }
    constructor(len, getUnit) {
        super();
        super.add(new Layout()
            .add((() => {
            let l = new YLayout()
                .setPixelMargin(2);
            for (let i = 0; i < len; i++) {
                l.add(new Layout()
                    .add(new DrawSTBox(() => getUnit(i)))
                    .add(ILayout.create({ draw: (bounds) => {
                        const u = getUnit(i);
                        u.boxBounds = bounds;
                        if (u instanceof PUnit) {
                            u.imgBounds = Place.P_UNIT(i);
                        }
                        else {
                            u.imgBounds = Place.E_UNIT(i);
                        }
                    } })));
            }
            return l;
        })())
            .add(ILayout.create({ ctrl: (bounds) => {
                if (Input.holding < 6) {
                    return;
                }
                for (let i = 0; i < len; i++) {
                    const u = getUnit(i);
                    if (!u.exists) {
                        continue;
                    }
                    if (!u.boxBounds.contains(Input.point)) {
                        continue;
                    }
                    DrawUnitDetail.target = u;
                    break;
                }
            } })));
    }
}
export class DrawUnitDetail extends InnerLayout {
    static get ins() { return this._ins ? this._ins : (this._ins = new DrawUnitDetail()); }
    constructor() {
        super();
        const font = Font.def;
        const getUnit = () => DrawUnitDetail.target;
        const frame = ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(bounds, Color.D_GRAY);
            } });
        const l = new Layout()
            .add(frame)
            .add(new XLayout()
            .setOutsidePixelMargin(1, 1, 1, 1)
            .setPixelMargin(2)
            .add(new Labels(font)
            .add(() => getUnit().name)
            .add(() => `Lv${getUnit().prm(Prm.LV).total | 0}`)
            .add(() => {
            const unit = getUnit();
            if (unit instanceof PUnit) {
                const nextLvExp = unit.getNextLvExp();
                let percent = nextLvExp === 0
                    ? 0
                    : Math.floor(100 * getUnit().prm(Prm.EXP).base / unit.getNextLvExp());
                return `EXP:${percent}%`;
            }
            return "EXP:-";
        })
            .add(() => {
            let unit = getUnit();
            if (unit instanceof PUnit) {
                return unit.isMasteredJob(unit.job)
                    ? `${getUnit().job}:★`
                    : `${getUnit().job}:Lv${unit.getJobLv(unit.job)}`;
            }
            return `${getUnit().job}`;
        })
            .add(() => `HP:${getUnit().hp}/${getUnit().prm(Prm.MAX_HP).total}`)
            .add(() => `MP:${getUnit().mp}/${getUnit().prm(Prm.MAX_MP).total}`)
            .add(() => `TP:${getUnit().tp}/${getUnit().prm(Prm.MAX_TP).total}`)
            .add(() => createConditionStr(getUnit(), ConditionType.goodConditions()), () => Color.CYAN)
            .add(() => createConditionStr(getUnit(), ConditionType.badConditions()), () => Color.RED)
        // .add(createConditionLabel(font, getUnit, ConditionType.goodConditions(), Color.CYAN))
        // .add(createConditionLabel(font, getUnit, ConditionType.badConditions(), Color.RED))
        )
            // .add(new YLayout()
            //     .add(new XLayout()
            //         .add(new Label(font, ()=>getUnit().name))
            //         .add(new Label(font, ()=>`Lv${ getUnit().prm(Prm.LV).total|0 }`).setBase(Font.RIGHT))
            //     )
            //     .add(new Gage(
            //         ()=> getUnit().hp
            //         ,()=> getUnit().prm(Prm.MAX_HP).total
            //         ,()=> "HP"
            //         ,()=> `${ getUnit().hp|0 }`
            //         ,()=> Color.D_GREEN.bright()
            //         ,font
            //         ,2
            //     ))
            //     .add(
            //         new XLayout()
            //             .setPixelMargin(4)
            //             .add(new Gage(
            //                 ()=> getUnit().prm(Prm.MP).base
            //                 ,()=> getUnit().prm(Prm.MAX_MP).total
            //                 ,()=> "MP"
            //                 ,()=> `${ getUnit().prm(Prm.MP).base|0 }`
            //                 ,()=> Color.D_RED.bright()
            //                 ,font
            //                 ,2
            //             ))
            //             .add(new Gage(
            //                 ()=> getUnit().prm(Prm.TP).base
            //                 ,()=> getUnit().prm(Prm.MAX_TP).total
            //                 ,()=> "TP"
            //                 ,()=> `${ getUnit().prm(Prm.TP).base|0 }`
            //                 ,()=> Color.D_CYAN.bright()
            //                 ,font
            //                 ,2
            //             ))
            //     )
            //     .add(new Label(font, ()=>createConditionStr(getUnit(), ConditionType.goodConditions()), ()=>Color.CYAN))
            //     .add(new Label(font, ()=>createConditionStr(getUnit(), ConditionType.badConditions()), ()=>Color.RED))
            //     // .add(createConditionLabel(font, getUnit, ConditionType.goodConditions(), Color.CYAN))
            //     // .add(createConditionLabel(font, getUnit, ConditionType.badConditions(), Color.RED))
            //     .add(ILayout.empty)
            //     .add(ILayout.empty)
            // )
            .add(new YLayout()
            .add(new XLayout()
            .add(new Labels(font)
            .add(() => `力:${getUnit().prm(Prm.STR).total}`)
            .add(() => `光:${getUnit().prm(Prm.LIG).total}`)
            .add(() => `鎖:${getUnit().prm(Prm.CHN).total}`)
            .add(() => `銃:${getUnit().prm(Prm.GUN).total}`)
            .add(() => `EP:${getUnit().ep}`)
            .add(() => ``)
            .add(() => `BP:${getUnit().bp}`))
            .add(new Labels(font)
            .add(() => `魔:${getUnit().prm(Prm.MAG).total}`)
            .add(() => `闇:${getUnit().prm(Prm.DRK).total}`)
            .add(() => `過:${getUnit().prm(Prm.PST).total}`)
            .add(() => `弓:${getUnit().prm(Prm.ARR).total}`)))
            .add(new Labels(font)
            .br()
            .addArray(() => {
            const u = getUnit();
            if (u instanceof PUnit) {
                const res = [];
                u.player.getSpecialInfo().forEach(info => res.push(["-" + info, Color.WHITE]));
                if (res.length > 0) {
                    res.unshift(["特性:", Color.WHITE]);
                }
                return res;
            }
            return [];
        })))
            .add((() => {
            let infoIsEar = true;
            let infoEarIndex = 0;
            let infoPos = EqPos.頭;
            let y = new YLayout();
            for (let i = 0; i < Unit.EAR_NUM; i++) {
                y.add(new Layout()
                    .add(ILayout.create({ draw: (bounds) => {
                        if (infoIsEar && infoEarIndex === i) {
                            Graphics.fillRect(bounds, Color.YELLOW.darker().darker());
                        }
                    } }))
                    .add(new Label(font, () => `耳:${getUnit().getEqEar(i)}`))
                    .add(ILayout.create({ ctrl: (bounds) => {
                        if (Input.holding > 0 && bounds.contains(Input.point)) {
                            infoIsEar = true;
                            infoEarIndex = i;
                        }
                    } })));
            }
            for (let pos of EqPos.values) {
                y.add(new Layout()
                    .add(ILayout.create({ draw: (bounds) => {
                        if (!infoIsEar && pos === infoPos) {
                            Graphics.fillRect(bounds, Color.YELLOW.darker().darker());
                        }
                    } }))
                    .add(new Label(font, () => `${pos}:${getUnit().getEq(pos)}`))
                    .add(ILayout.create({ ctrl: (bounds) => {
                        if (Input.holding > 0 && bounds.contains(Input.point)) {
                            infoIsEar = false;
                            infoPos = pos;
                        }
                    } })));
            }
            y.add(new Label(font, () => {
                return infoIsEar ? getUnit().getEqEar(infoEarIndex).info
                    : getUnit().getEq(infoPos).info;
            }, () => Color.L_GRAY));
            return y;
        })()))
            .add(ILayout.create({ ctrl: (bounds) => {
                if (DrawUnitDetail.target && !Input.holding) {
                    DrawUnitDetail.target = undefined;
                }
            } }));
        super.add(new VariableLayout(() => {
            if (DrawUnitDetail.target && DrawUnitDetail.target.exists) {
                return l;
            }
            return ILayout.empty;
        }));
    }
}
const createConditionStr = (unit, types) => {
    return types
        .filter(type => unit.hasCondition(type))
        .map(type => unit.getConditionSet(type))
        .map(set => `<${set.condition}${set.value | 0}>`)
        .join("");
};
// const createConditionLabel = (font:Font, unit:()=>Unit, types:ReadonlyArray<ConditionType>, color:Color)=>{
//     return new Label(
//          font
//         ,()=>types
//                 .filter(type=> unit().existsCondition(type))
//                 .map(type=> unit().getConditionSet(type))
//                 .map(set=> `<${set.condition}${set.value|0}>`)
//                 .join("")
//         ,()=>color
//     );
// };
export class DrawUnits extends InnerLayout {
    static get ins() { return this._ins ? this._ins : (this._ins = new DrawUnits()); }
    constructor() {
        super();
        let count = 0;
        const haka = new Img("img/unit/haka.png");
        super.add(ILayout.create({ draw: bounds => {
                count++;
                Unit.all
                    .filter(u => u.exists)
                    .forEach((u, index) => {
                    if (u.dead) {
                        haka.draw(u.imgBounds);
                    }
                    else {
                        const shake = Math.sin(Date.now() * 0.01 + index * 0.4) * Graphics.dotH * 5;
                        const imgBounds = new Rect(u.imgBounds.x, u.imgBounds.y + shake, u.imgBounds.w, u.imgBounds.h);
                        u.img.drawEx({
                            dstRatio: imgBounds,
                            reverseHorizontal: (u instanceof PUnit),
                        });
                        Graphics.setAlpha(0.5, () => {
                            if (u.pet) {
                                const rad = Math.PI * 2 * (count + index * 5) / 75;
                                const r = u.imgBounds.w / 2;
                                const petX = imgBounds.cx + Math.cos(rad) * r - u.imgBounds.w / 2;
                                const petY = imgBounds.cy + Math.sin(rad) * r - u.imgBounds.h / 2;
                                const petBounds = new Rect(petX, petY, u.imgBounds.w, u.imgBounds.h);
                                u.pet.img.draw(petBounds);
                            }
                        });
                        const str = `${u.hp}`;
                        const point = u.imgBounds.top;
                        Font.def.draw(str, point.move(Graphics.dotW, Graphics.dotH), Color.BLACK, "bottom");
                        Font.def.draw(str, point, Color.WHITE, "bottom");
                    }
                });
            } }));
    }
}
