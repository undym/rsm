var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Scene, wait } from "../undym/scene.js";
import { Place, Util, PlayData, SceneType } from "../util.js";
import { DrawSTBoxes, DrawDungeonData, DrawUnitDetail, DrawYen } from "./sceneutil.js";
import { VariableLayout, ILayout, Layout, Labels, XLayout, Label } from "../undym/layout.js";
import { Rect, Color } from "../undym/type.js";
import { Unit, PUnit, Prm } from "../unit.js";
import { Battle, BattleResult, BattleType } from "../battle.js";
import { Tec, ActiveTec, PassiveTec } from "../tec.js";
import { Input } from "../undym/input.js";
import { Targeting } from "../force.js";
import { List } from "../widget/list.js";
import { ItemScene } from "./itemscene.js";
import { Font, Graphics } from "../graphics/graphics.js";
import { PartySkillWin, PartySkill } from "../partyskill.js";
let btnSpace;
let chooseTargetLayout;
export class BattleScene extends Scene {
    constructor() {
        super();
        this.tecInfo = { tec: Tec.empty, user: Unit.players[0] };
        btnSpace = new Layout();
        chooseTargetLayout = ILayout.empty;
    }
    static get ins() { return this._ins ? this._ins : (this._ins = new BattleScene()); }
    init() {
        super.clear();
        // super.add(Place.TOP, DrawPlayInfo.ins);
        const drawBG = (() => {
            if (Battle.type === BattleType.BOSS) {
                return createBossBG();
            }
            if (Battle.type === BattleType.EX) {
                return createExBG();
            }
            return (bounds) => { };
        })();
        super.add(Place.MAIN, ILayout.create({ draw: (bounds) => {
                Graphics.clip(bounds, () => {
                    drawBG(bounds);
                });
            } }));
        // super.add(Place.DUNGEON_DATA, new VariableLayout(()=>{
        //     if(this.tecInfo.tec === Tec.empty){return DrawDungeonData.ins;}
        //     return ILayout.empty;
        // }));
        super.add(Place.DUNGEON_DATA, (() => {
            const info = new Labels(Font.def)
                .add(() => `[${this.tecInfo.tec}]`)
                .addLayout(new XLayout()
                .add(new Label(Font.def, () => {
                if (this.tecInfo.tec instanceof ActiveTec) {
                    return this.tecInfo.tec.mpCost > 0 ? `MP:${this.tecInfo.tec.mpCost}` : "";
                }
                return "";
            }, () => {
                if (this.tecInfo.tec instanceof ActiveTec) {
                    return this.tecInfo.tec.mpCost <= this.tecInfo.user.mp ? Color.WHITE : Color.GRAY;
                }
                return Color.WHITE;
            }))
                .add(new Label(Font.def, () => {
                if (this.tecInfo.tec instanceof ActiveTec) {
                    return this.tecInfo.tec.tpCost > 0 ? `TP:${this.tecInfo.tec.tpCost}` : "";
                }
                return "";
            }, () => {
                if (this.tecInfo.tec instanceof ActiveTec) {
                    return this.tecInfo.tec.tpCost <= this.tecInfo.user.tp ? Color.WHITE : Color.GRAY;
                }
                return Color.WHITE;
            }))
                .add(new Label(Font.def, () => {
                if (this.tecInfo.tec instanceof ActiveTec) {
                    return this.tecInfo.tec.epCost > 0 ? `EP:${this.tecInfo.tec.epCost}` : "";
                }
                return "";
            }, () => {
                if (this.tecInfo.tec instanceof ActiveTec) {
                    return this.tecInfo.tec.epCost <= this.tecInfo.user.ep ? Color.WHITE : Color.GRAY;
                }
                return Color.WHITE;
            }))
                .add(new Label(Font.def, () => {
                if (this.tecInfo.tec instanceof ActiveTec && this.tecInfo.tec.itemCost.length > 0) {
                    let res = "";
                    for (const set of this.tecInfo.tec.itemCost) {
                        res += `${set.item}-${set.num}(${set.item.num}) `;
                    }
                    return res;
                }
                return "";
            }, () => {
                if (this.tecInfo.tec instanceof ActiveTec) {
                    for (const set of this.tecInfo.tec.itemCost) {
                        if (set.item.num < set.num) {
                            return Color.GRAY;
                        }
                    }
                    return Color.WHITE;
                }
                return Color.WHITE;
            }))
                .add(ILayout.empty)
                .add(ILayout.empty)
                .add(ILayout.empty)
                .add(ILayout.empty), () => Font.def.ratioH)
                .addln(() => this.tecInfo.tec.info);
            return new VariableLayout(() => {
                return this.tecInfo.tec !== Tec.empty ? info : DrawDungeonData.ins;
            });
        })());
        super.add(Place.MSG, Util.msg);
        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.BTN, btnSpace);
        super.add(Place.E_BOX, DrawSTBoxes.enemies);
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        super.add(Rect.FULL, ILayout.create({ draw: (bounds) => {
                if (!Battle.getPhaseUnit().exists) {
                    return;
                }
                Graphics.fillRect(Battle.getPhaseUnit().bounds, new Color(0, 1, 1, 0.2));
            } }));
        super.add(Rect.FULL, new VariableLayout(() => chooseTargetLayout));
        super.add(Rect.FULL, ILayout.create({ ctrl: (bounds) => __awaiter(this, void 0, void 0, function* () {
                if (Battle.start) {
                    Battle.start = false;
                    SceneType.BATTLE.set();
                    //init
                    for (const u of Unit.all) {
                        u.tp = 0;
                    }
                    for (const u of Unit.all) {
                        u.battleStart();
                    }
                    yield this.phaseEnd();
                    return;
                }
            }) }));
    }
    phaseEnd() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Battle.turn > 0) {
                for (const u of Unit.all.filter(u => u.exists && !u.dead)) {
                    yield u.phaseEnd();
                }
            }
            for (let u of Unit.all) {
                yield u.judgeDead();
            }
            if (Unit.players.every(u => !u.exists || u.dead)) {
                yield lose();
                return;
            }
            if (Unit.enemies.every(u => !u.exists || u.dead)) {
                yield win();
                return;
            }
            Battle.phase = (Battle.phase + 1) % Unit.all.length;
            if (Battle.phase === Battle.firstPhase) {
                Battle.turn++;
                Util.msg.set(`----------${Battle.turn}ターン目----------`, Color.L_GRAY);
                yield wait();
            }
            let attacker = Battle.getPhaseUnit();
            if (!attacker.exists || attacker.dead) {
                yield this.phaseEnd();
                return;
            }
            Util.msg.set(`${attacker.name}の行動`, Color.ORANGE);
            attacker.tp += 1;
            attacker.phaseStart();
            for (const u of Unit.all) {
                u.judgeDead();
            }
            if (attacker.dead) {
                yield this.phaseEnd();
                return;
            }
            if (attacker instanceof PUnit) {
                yield this.setPlayerPhase(attacker);
                return;
            }
            else {
                let e = attacker;
                yield e.ai(e, Unit.all);
                yield this.phaseEnd();
                return;
            }
        });
    }
    setPlayerPhase(attacker) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = new List(8);
            attacker.tecs.forEach((tec, index) => {
                if (tec instanceof ActiveTec) {
                    list.add({
                        center: () => tec.toString(),
                        push: (elm) => __awaiter(this, void 0, void 0, function* () {
                            attacker.tecListScroll = index;
                            this.tecInfo.tec = Tec.empty;
                            if (tec.targetings & Targeting.SELECT) {
                                Util.msg.set(`[${tec}]のターゲットを選択してください`);
                                yield this.setChooseTargetBtn(attacker, (targets) => __awaiter(this, void 0, void 0, function* () {
                                    if (!targets[0].dead
                                        || (tec.targetings & Targeting.WITH_DEAD || tec.targetings & Targeting.DEAD_ONLY)) {
                                        Util.msg.set(`＞${targets[0].name}を選択`);
                                        yield tec.use(attacker, new Array(tec.rndAttackNum()).fill(targets[0]));
                                        yield this.phaseEnd();
                                    }
                                }));
                                yield wait(1);
                                return;
                            }
                            else {
                                let targets = [];
                                targets = targets.concat(Targeting.filter(tec.targetings, attacker, Unit.all, tec.rndAttackNum()));
                                yield tec.use(attacker, targets);
                                yield this.phaseEnd();
                            }
                        }),
                        hold: elm => {
                            this.tecInfo.tec = tec;
                            this.tecInfo.user = attacker;
                        },
                        groundColor: () => tec.checkCost(attacker) ? Color.BLACK : Color.GRAY,
                        stringColor: () => tec.checkCost(attacker) ? Color.WHITE : Color.D_GRAY,
                    });
                }
                else if (tec instanceof PassiveTec) {
                    list.add({
                        center: () => tec.toString(),
                        hold: elm => {
                            this.tecInfo.tec = tec;
                            this.tecInfo.user = attacker;
                        },
                        groundColor: () => Color.D_GRAY,
                        stringColor: () => Color.L_GRAY,
                    });
                }
            });
            list.add({
                center: () => "アイテム",
                push: (elm) => __awaiter(this, void 0, void 0, function* () {
                    Scene.load(ItemScene.ins({
                        user: attacker,
                        selectUser: false,
                        use: (item, user) => __awaiter(this, void 0, void 0, function* () {
                            Scene.set(this);
                            if (item.targetings & Targeting.SELECT) {
                                Util.msg.set(`[${item}]のターゲットを選択してください`);
                                this.setChooseTargetBtn(attacker, (targets) => __awaiter(this, void 0, void 0, function* () {
                                    yield item.use(user, targets);
                                    yield this.phaseEnd();
                                }));
                            }
                            else {
                                let targets = Targeting.filter(item.targetings, user, Unit.players, /*num*/ 1);
                                yield item.use(user, targets);
                                yield this.phaseEnd();
                            }
                        }),
                        returnScene: () => {
                            Scene.set(BattleScene.ins);
                        },
                    }));
                }),
            });
            list.setScroll(attacker.tecListScroll, "center");
            btnSpace.clear();
            btnSpace.add(list);
        });
    }
    setChooseTargetBtn(attacker, chooseAction) {
        return __awaiter(this, void 0, void 0, function* () {
            chooseTargetLayout = ILayout.create({
                ctrl: (bounds) => __awaiter(this, void 0, void 0, function* () {
                    if (Input.click) {
                        for (const u of Unit.all) {
                            if (!u.exists) {
                                continue;
                            }
                            if (!u.bounds.contains(Input.point)) {
                                continue;
                            }
                            chooseTargetLayout = ILayout.empty;
                            yield chooseAction([u]);
                            return;
                        }
                        //誰もいない場所をタップするとキャンセル
                        Util.msg.set("＞キャンセル");
                        chooseTargetLayout = ILayout.empty;
                        yield this.setPlayerPhase(attacker);
                    }
                }),
                draw: bounds => {
                    Graphics.setLineWidth(2, () => {
                        for (const u of Unit.all) {
                            if (!u.exists) {
                                continue;
                            }
                            Graphics.drawRect(u.bounds, Color.RED);
                        }
                    });
                },
            });
        });
    }
}
const win = () => __awaiter(this, void 0, void 0, function* () {
    Battle.result = BattleResult.WIN;
    Util.msg.set("勝った");
    yield wait();
    const partySkill = new PartySkillWin();
    Unit.enemies
        .filter(e => e.exists)
        .forEach(e => {
        partySkill.exp.base += e.prm(Prm.EXP).base;
        partySkill.bp.base += 1;
        partySkill.yen.base += e.yen;
    });
    for (const skill of PartySkill.skills) {
        skill.win(partySkill);
    }
    const exp = (partySkill.exp.base * partySkill.exp.mul) | 0;
    Util.msg.set(`${exp}の経験値を入手`, Color.CYAN.bright);
    yield wait();
    for (let p of Unit.players.filter(p => p.exists)) {
        yield p.addExp(exp);
    }
    const bp = (partySkill.bp.base * partySkill.bp.mul) | 0;
    for (let p of Unit.players.filter(p => p.exists)) {
        p.bp += bp;
    }
    Util.msg.set(`BP${bp}入手`, Color.YELLOW.bright);
    const yen = (partySkill.yen.base * partySkill.yen.mul) | 0;
    PlayData.yen += yen;
    Util.msg.set(`${yen}円入手`, Color.YELLOW.bright);
    yield wait();
    yield finish();
    yield Battle.battleEndAction(BattleResult.WIN);
});
const lose = () => __awaiter(this, void 0, void 0, function* () {
    Battle.result = BattleResult.LOSE;
    Util.msg.set("負けた");
    yield wait();
    if (Battle.type === BattleType.NORMAL) {
        const lostYen = (PlayData.yen / 3) | 0;
        PlayData.yen -= lostYen;
        Util.msg.set(`${lostYen}円失った...`, (cnt) => Color.RED);
        yield wait();
    }
    yield finish();
    yield Battle.battleEndAction(BattleResult.LOSE);
});
const finish = () => __awaiter(this, void 0, void 0, function* () {
    for (const e of Unit.enemies) {
        e.exists = false;
    }
    for (const p of Unit.players) {
        for (const prm of Prm.values()) {
            p.prm(prm).battle = 0;
        }
    }
    btnSpace.clear();
});
const createBossBG = () => {
    const nextR = (r, num) => {
        if (num <= 0) {
            return r;
        }
        return nextR(r * 1.2 + 0.002, num - 1);
    };
    const nextRad = (rad, num) => {
        if (num <= 0) {
            return rad;
        }
        // return nextRad(rad * 1.05, num-1);
        return nextRad(rad + 0.05, num - 1);
    };
    let center = { x: 0.5, y: 0.5 };
    let nextCenter = { x: 0.5, y: 0.5 };
    ;
    let elms = [];
    const elmNum = 80;
    for (let i = 0; i < elmNum; i++) {
        elms.push({
            rad: Math.PI * 2 * (i + 1) / elmNum,
            r: Math.random(),
        });
    }
    return bounds => {
        const color = { r: 0, g: 0, b: 0, a: 1 };
        const vertex = 4;
        let vertexes = [];
        for (let i = 0; i < vertex; i++) {
            const rad = Math.PI * 2 * (i + 1) / vertex;
            vertexes.push({
                x: Math.cos(rad),
                y: Math.sin(rad),
            });
        }
        const cx = bounds.x + center.x * bounds.w;
        const cy = bounds.y + center.y * bounds.h;
        for (let i = 0; i < elms.length; i++) {
            const e = elms[i];
            Graphics.setLineWidth(80 * e.r, () => {
                let points = [];
                const x = cx + Math.cos(e.rad) * e.r;
                const y = cy + Math.sin(e.rad) * e.r;
                const r = e.r * 0.1;
                for (let i = 0; i < vertex; i++) {
                    points.push({
                        x: x + vertexes[i].x * r,
                        y: y + vertexes[i].y * r,
                    });
                }
                color.r = 0.2 + e.r * 0.8;
                Graphics.lines(points, color);
            });
            e.r = nextR(e.r, 1);
            if (e.r > 1) {
                e.r = 0.01 + Math.random() * 0.01;
            }
            e.rad = nextRad(e.rad, 1);
        }
        center.x = center.x * 0.97 + nextCenter.x * 0.03;
        center.y = center.y * 0.97 + nextCenter.y * 0.03;
        if (Math.abs(center.x - nextCenter.x) < 0.001 && Math.abs(center.y - nextCenter.y) < 0.001) {
            nextCenter.x = 0.1 + Math.random() * 0.8;
            nextCenter.y = 0.1 + Math.random() * 0.8;
        }
    };
};
const createExBG = () => {
    let count = 0;
    let vertex = 4;
    let rads = [];
    for (let i = 0; i < vertex; i++) {
        const rad = Math.PI * 2 * (i + 1) / vertex;
        rads.push({
            x: Math.cos(rad),
            y: Math.sin(rad),
        });
    }
    return bounds => {
        const xNum = 8;
        const yNum = 4;
        const w = bounds.w / xNum;
        const h = bounds.h / yNum;
        const wHalf = w / 2;
        const hHalf = h / 2;
        const color = new Color(0, 0.25, 0.25);
        const lineWidth = 4;
        count++;
        for (let y = 0; y < yNum; y++) {
            for (let x = 0; x < xNum; x++) {
                let points = [];
                const _x = bounds.x + wHalf + w * x;
                const _y = bounds.y + hHalf + h * y;
                for (let i = 0; i < vertex; i++) {
                    points.push({
                        x: _x + rads[i].x * w / 2,
                        y: _y + rads[i].y * h / 2,
                    });
                }
                // Graphics.setLineWidth(lineWidth + Math.sin( x * 0.1 + y * 0.1 + count * 0.1 ) * lineWidth, ()=>{    
                Graphics.setLineWidth(Math.abs(Math.sin(x * 0.1 + y * 0.1 + count * 0.05)) * lineWidth, () => {
                    Graphics.lines(points, color);
                });
            }
        }
    };
};
