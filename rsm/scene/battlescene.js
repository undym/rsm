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
import { DrawSTBoxes, DrawDungeonData, DrawUnitDetail, DrawYen, DrawUnits } from "./sceneutil.js";
import { VariableLayout, ILayout, Layout, Labels } from "../undym/layout.js";
import { Rect, Color, Point } from "../undym/type.js";
import { Unit, PUnit, Prm } from "../unit.js";
import { Battle, BattleResult, BattleType } from "../battle.js";
import { Tec, ActiveTec, PassiveTec } from "../tec.js";
import { Input } from "../undym/input.js";
import { Targeting, PhaseStartForce } from "../force.js";
import { List } from "../widget/list.js";
import { ItemScene } from "./itemscene.js";
import { Font, Graphics } from "../graphics/graphics.js";
import { PartySkillWin, PartySkill } from "../partyskill.js";
import { Sound } from "../sound.js";
let btnSpace;
let chooseTargetLayout;
export class BattleScene extends Scene {
    constructor() {
        super();
        this.background = emptyBG;
        this.tecInfo = { tec: Tec.empty, user: Unit.players[0] };
        btnSpace = new Layout();
        chooseTargetLayout = ILayout.empty;
    }
    static get ins() { return this._ins ? this._ins : (this._ins = new BattleScene()); }
    init() {
        super.clear();
        super.add(Place.MAIN, ILayout.create({ draw: (bounds) => {
                Graphics.clip(bounds, () => {
                    this.background(bounds);
                });
            } }));
        super.add(Place.DUNGEON_DATA, (() => {
            const info = new Labels(Font.def)
                .add(() => `[${this.tecInfo.tec}]`)
                .addLayout(ILayout.create({ draw: bounds => {
                    const tec = this.tecInfo.tec;
                    const user = this.tecInfo.user;
                    if (tec instanceof ActiveTec) {
                        let x = bounds.x;
                        const w = bounds.w * 0.1;
                        for (const cost of tec.costs) {
                            Font.def.draw(`${cost.prm}:${cost.value}`, new Point(x, bounds.y), user.prm(cost.prm).base >= cost.value ? Color.WHITE : Color.GRAY);
                            x += w;
                        }
                        for (const set of tec.itemCost) {
                            Font.def.draw(`${set.item}-${set.num}`, new Point(x, bounds.y), set.item.num >= set.num ? Color.WHITE : Color.GRAY);
                            x += w;
                        }
                    }
                } }))
                .addln(() => this.tecInfo.tec.info);
            return new VariableLayout(() => {
                return this.tecInfo.tec !== Tec.empty ? info : DrawDungeonData.ins;
            });
        })());
        super.add(Rect.FULL, DrawUnits.ins);
        super.add(Place.MSG, Util.msg);
        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.BTN, btnSpace);
        super.add(Place.E_BOX, DrawSTBoxes.enemies);
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        {
            const phaseUnitBoxColor = new Color(0, 1, 1, 0.2);
            super.add(Rect.FULL, ILayout.create({ draw: (bounds) => {
                    if (!Battle.getPhaseUnit().exists) {
                        return;
                    }
                    Graphics.fillRect(Battle.getPhaseUnit().boxBounds, phaseUnitBoxColor);
                    const width = 5 + Math.sin(Date.now() / 200) * 4;
                    Graphics.setLineWidth(width, () => {
                        Graphics.drawRect(Battle.getPhaseUnit().imgBounds, Color.YELLOW.bright());
                    });
                } }));
        }
        super.add(Rect.FULL, new VariableLayout(() => chooseTargetLayout));
        super.add(Rect.FULL, ILayout.create({ ctrl: (bounds) => __awaiter(this, void 0, void 0, function* () {
                if (Battle.start) {
                    Battle.start = false;
                    SceneType.BATTLE.set();
                    if (Battle.type === BattleType.NORMAL) {
                        this.background = createNormalBG();
                    }
                    if (Battle.type === BattleType.BOSS) {
                        this.background = createBossBG();
                    }
                    if (Battle.type === BattleType.EX) {
                        this.background = createExBG();
                    }
                    //init
                    for (const u of Unit.all) {
                        u.tp = 0;
                        u.sp = 1;
                        for (const prm of Prm.values) {
                            u.prm(prm).battle = 0;
                        }
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
            //force
            if (Battle.turn > 0) {
                const phaseUnit = Battle.getPhaseUnit();
                if (phaseUnit.exists && !phaseUnit.dead) {
                    yield Battle.getPhaseUnit().phaseEnd();
                }
            }
            for (let u of Unit.all) {
                yield u.judgeDead();
            }
            const judgeBattleEnd = () => __awaiter(this, void 0, void 0, function* () {
                if (Unit.players.every(u => !u.exists || u.dead)) {
                    yield lose();
                    return true;
                }
                if (Unit.enemies.every(u => !u.exists || u.dead)) {
                    yield win();
                    return true;
                }
                return false;
            });
            if (yield judgeBattleEnd()) {
                return;
            }
            Battle.phase = (Battle.phase + 1) % Unit.all.length;
            if (Battle.phase === Battle.firstPhase) {
                Battle.turn++;
                Util.msg.set(`----------${Battle.turn}ターン目----------`, Color.L_GRAY);
                yield wait();
            }
            let attacker = Battle.getPhaseUnit();
            if (attacker.exists && attacker.dead) {
                yield attacker.deadPhaseStart();
            }
            if (!attacker.exists || attacker.dead) {
                yield this.phaseEnd();
                return;
            }
            Util.msg.set(`${attacker.name}の行動`, Color.ORANGE);
            const pForce = new PhaseStartForce();
            yield attacker.phaseStart(pForce);
            for (const u of Unit.all) {
                u.judgeDead();
            }
            if (attacker.dead) {
                yield this.phaseEnd();
                return;
            }
            if (yield judgeBattleEnd()) {
                return;
            }
            if (pForce.phaseSkip) {
                yield wait();
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
            const list = new List(7);
            let choosedTec;
            const addActiveTec = (tec, index) => {
                list.add({
                    center: () => tec.toString(),
                    push: (elm) => __awaiter(this, void 0, void 0, function* () {
                        chooseTargetLayout = ILayout.empty;
                        choosedTec = tec;
                        Sound.system.play();
                        attacker.tecListScroll = index;
                        this.tecInfo.tec = Tec.empty;
                        if (tec.targetings & Targeting.SELECT) {
                            Util.msg.set(`[${tec}]のターゲットを選択してください`);
                            yield this.setChooseTargetBtn(attacker, (targets) => __awaiter(this, void 0, void 0, function* () {
                                if (!targets[0].dead
                                    || (tec.targetings & Targeting.WITH_DEAD || tec.targetings & Targeting.DEAD_ONLY)) {
                                    list.freeze(true);
                                    Util.msg.set(`＞${targets[0].name}を選択`);
                                    yield tec.use(attacker, new Array(tec.rndAttackNum()).fill(targets[0]));
                                    yield this.phaseEnd();
                                }
                                else {
                                    choosedTec = undefined;
                                }
                            }));
                            yield wait(1);
                            return;
                        }
                        else {
                            list.freeze(true);
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
                    groundColor: () => {
                        if (tec.checkCost(attacker)) {
                            return choosedTec === tec ? Color.D_CYAN : Color.BLACK;
                        }
                        else {
                            return choosedTec === tec ? Color.RED : Color.D_RED;
                        }
                    },
                    stringColor: () => tec.checkCost(attacker) ? Color.WHITE : Color.D_RED,
                });
            };
            if (!attacker.tecs.some(tec => tec instanceof ActiveTec)) {
                addActiveTec(Tec.何もしない, 0);
            }
            attacker.tecs.forEach((tec, index) => {
                if (tec instanceof ActiveTec) {
                    addActiveTec(tec, index);
                }
                else if (tec instanceof PassiveTec) {
                    list.add({
                        center: () => tec.toString(),
                        hold: elm => {
                            this.tecInfo.tec = tec;
                            this.tecInfo.user = attacker;
                        },
                        groundColor: () => choosedTec === tec ? Color.D_ORANGE : Color.D_GRAY,
                        stringColor: () => Color.L_GRAY,
                    });
                }
            });
            list.add({
                center: () => "アイテム",
                push: (elm) => __awaiter(this, void 0, void 0, function* () {
                    choosedTec = undefined;
                    chooseTargetLayout = ILayout.empty;
                    Sound.system.play();
                    Scene.load(ItemScene.ins({
                        user: attacker,
                        selectUser: false,
                        use: (item, user) => __awaiter(this, void 0, void 0, function* () {
                            Scene.set(this);
                            if (item.targetings & Targeting.SELECT) {
                                Util.msg.set(`[${item}]のターゲットを選択してください`);
                                this.setChooseTargetBtn(attacker, (targets) => __awaiter(this, void 0, void 0, function* () {
                                    list.freeze(true);
                                    yield item.use(user, targets);
                                    yield this.phaseEnd();
                                }));
                            }
                            else {
                                list.freeze(true);
                                let targets = Targeting.filter(item.targetings, user, Unit.all, /*num*/ 1);
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
            list.add({
                center: () => "逃げる",
                push: (elm) => __awaiter(this, void 0, void 0, function* () {
                    choosedTec = undefined;
                    chooseTargetLayout = ILayout.empty;
                    const runEscape = () => __awaiter(this, void 0, void 0, function* () {
                        Battle.result = BattleResult.ESCAPE;
                        Sound.nigeru.play();
                        Util.msg.set("逃げた");
                        yield wait();
                        yield finish();
                    });
                    if (Battle.type === BattleType.EX) {
                        yield runEscape();
                        return;
                    }
                    else if (Battle.type === BattleType.NORMAL) {
                        if (Math.random() < 0.6) {
                            yield runEscape();
                            return;
                        }
                        else {
                            Util.msg.set("逃げられなかった...");
                            yield wait();
                            yield this.phaseEnd();
                            return;
                        }
                    }
                    else {
                        Util.msg.set("逃げられない！");
                        Sound.no.play();
                    }
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
                            if (!u.boxBounds.contains(Input.point)) {
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
                    Graphics.setLineWidth(3, () => {
                        for (const u of Unit.all) {
                            if (!u.exists) {
                                continue;
                            }
                            Graphics.drawRect(u.boxBounds, Color.RED);
                        }
                    });
                },
            });
        });
    }
}
const win = () => __awaiter(this, void 0, void 0, function* () {
    Battle.result = BattleResult.WIN;
    Sound.win.play();
    Util.msg.set("勝った");
    yield wait();
    const partySkill = new PartySkillWin();
    Unit.enemies
        .filter(e => e.exists)
        .forEach(e => {
        partySkill.exp.base += e.prm(Prm.EXP).base;
        partySkill.jobExp.base += 1;
        partySkill.yen.base += e.yen;
    });
    for (const skill of PartySkill.skills) {
        skill.win(partySkill);
    }
    const exp = (partySkill.exp.base * partySkill.exp.mul) | 0;
    Util.msg.set(`${exp}の経験値を入手`, Color.CYAN.bright);
    const jobExp = (partySkill.jobExp.base * partySkill.jobExp.mul) | 0;
    Util.msg.set(`ジョブ経験+${jobExp}`, Color.YELLOW.bright);
    Sound.exp.play();
    yield wait();
    for (let p of Unit.players.filter(p => p.exists && !p.dead)) {
        yield p.addExp(exp);
    }
    for (let p of Unit.players.filter(p => p.exists && !p.dead)) {
        yield p.addJobExp(jobExp);
    }
    const yen = (partySkill.yen.base * partySkill.yen.mul) | 0;
    PlayData.yen += yen;
    Util.msg.set(`${yen}円入手`, Color.YELLOW.bright);
    Sound.COIN.play();
    yield wait();
    yield finish();
    yield Battle.battleEndAction(BattleResult.WIN);
});
const lose = () => __awaiter(this, void 0, void 0, function* () {
    Sound.gameover.play();
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
    for (const u of Unit.all) {
        for (const prm of Prm.values) {
            u.prm(prm).battle = 0;
        }
        u.clearInvisibleConditions();
    }
    btnSpace.clear();
    BattleScene.ins.background = emptyBG;
});
const emptyBG = (bounds) => { };
const createNormalBG = () => {
    return bounds => {
        for (let i = 0; i < 5; i++) {
            const w = Math.random() * 0.5;
            const h = Math.random() * 0.5;
            const x = Math.random() * (1 - w);
            const y = Math.random() * (1 - h);
            const c = 0.01 + Math.random() * 0.1;
            Graphics.fillRect(new Rect(x, y, w, h), new Color(c, c, c));
        }
    };
};
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
        const yNum = 6;
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
