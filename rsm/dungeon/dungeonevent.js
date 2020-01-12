var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Util, Place, PlayData } from "../util.js";
import { Btn } from "../widget/btn.js";
import { Dungeon } from "./dungeon.js";
import { Scene, cwait, wait } from "../undym/scene.js";
import { TownScene } from "../scene/townscene.js";
import { Item, ItemDrop } from "../item.js";
import { ILayout, FlowLayout } from "../undym/layout.js";
import { Color } from "../undym/type.js";
import { Unit, Prm } from "../unit.js";
import { FX_Advance, FX_Return, FX_格闘 } from "../fx/fx.js";
import { Battle, BattleType, BattleResult } from "../battle.js";
import { BattleScene } from "../scene/battlescene.js";
import DungeonScene from "../scene/dungeonscene.js";
import { ItemScene } from "../scene/itemscene.js";
import { Dmg, Heal, AUForce } from "../force.js";
import { Img } from "../graphics/texture.js";
import { SaveData } from "../savedata.js";
import { PartySkillOpenBox, PartySkill } from "../partyskill.js";
import { choice } from "../undym/random.js";
import { CollectingSkill } from "../collectingskill.js";
import { Sound, Music } from "../sound.js";
export class DungeonEvent {
    constructor(name) {
        this.name = name;
        DungeonEvent._values.push(this);
    }
    static get values() { return this._values; }
    getImg() { return this.img ? this.img : (this.img = this.createImg()); }
    createImg() { return Img.empty; }
    happen() {
        return __awaiter(this, void 0, void 0, function* () {
            DungeonEvent.now = this;
            yield this.happenInner();
        });
    }
    isZoomImg() { return true; }
}
DungeonEvent._values = [];
class EventImg {
    constructor(src) {
        this.src = src;
    }
    get img() { return this._img ? this._img : (this._img = new Img(this.src)); }
}
(function (EventImg) {
    EventImg.BOX = new EventImg("img/box.png");
    EventImg.OPEN_BOX = new EventImg("img/box_open.png");
})(EventImg || (EventImg = {}));
(function (DungeonEvent) {
    DungeonEvent.empty = new class extends DungeonEvent {
        constructor() {
            super("empty");
            this.happenInner = () => { Util.msg.set(""); };
            this.createBtnLayout = () => createDefLayout();
        }
    };
    DungeonEvent.BOX = new class extends DungeonEvent {
        constructor() {
            super("BOX");
            this.createImg = () => EventImg.BOX.img;
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () { Util.msg.set("宝箱だ"); });
            this.createBtnLayout = () => createDefLayout()
                .set(ReturnBtn.index, new Btn("開ける", () => __awaiter(this, void 0, void 0, function* () {
                Sound.TRAGER.play();
                yield DungeonEvent.OPEN_BOX.happen();
            })));
        }
    };
    DungeonEvent.OPEN_BOX = new class extends DungeonEvent {
        constructor() {
            super("OPEN_BOX");
            this.createImg = () => EventImg.OPEN_BOX.img;
            this.isZoomImg = () => false;
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                yield openBox(ItemDrop.BOX, Dungeon.now.rank / 2, CollectingSkill.宝箱);
                if (Math.random() < 0.15) {
                    const trends = Dungeon.now.trendItems;
                    if (trends.length > 0) {
                        const item = trends[(Math.random() * trends.length) | 0];
                        yield wait();
                        item.add(1);
                    }
                }
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.OPEN_KEY_BOX = new class extends DungeonEvent {
        constructor() {
            super("OPEN_KEY_BOX");
            this.createImg = () => EventImg.OPEN_BOX.img;
            this.isZoomImg = () => false;
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () { });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    const createKeyBoxEvent = (name, msg, key, open) => {
        return new class extends DungeonEvent {
            constructor() { super(name); }
            createImg() { return EventImg.BOX.img; }
            happenInner() {
                return __awaiter(this, void 0, void 0, function* () { Util.msg.set(msg); });
            }
            createBtnLayout() {
                return createDefLayout()
                    .set(ReturnBtn.index, new Btn("開ける", () => __awaiter(this, void 0, void 0, function* () {
                    const _key = key();
                    if (_key.num > 0) {
                        _key.num--;
                        Sound.TRAGER.play();
                        Util.msg.set(`開けた(${_key}残り${_key.num})`);
                        yield DungeonEvent.OPEN_KEY_BOX.happen();
                        for (let i = 0; i < 5; i++) {
                            yield wait();
                            openKeyBox(/*base*/ 2, /*fluctuateRange*/ 2);
                        }
                        open();
                    }
                    else {
                        Sound.no.play();
                        Util.msg.set("鍵を持っていない");
                    }
                })));
            }
            ;
        };
    };
    DungeonEvent.KEY_BOX_RANK2 = createKeyBoxEvent("KEY_BOX_RANK2", "丸い箱だ", () => Item.丸い鍵, () => __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 5; i++) {
            yield wait();
            openKeyBox(/*base*/ 2, /*fluctuateRange*/ 2);
        }
    }));
    DungeonEvent.KEY_BOX_RANK3 = createKeyBoxEvent("KEY_BOX_RANK3", "三角形の箱だ", () => Item.三角鍵, () => __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 6; i++) {
            yield wait();
            openKeyBox(/*base*/ 3, /*fluctuateRange*/ 2);
        }
    }));
    DungeonEvent.KEY_BOX_RANK4 = createKeyBoxEvent("KEY_BOX_RANK4", "トゲトゲの箱だ", () => Item.トゲトゲ鍵, () => __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 7; i++) {
            yield wait();
            openKeyBox(/*base*/ 4, /*fluctuateRange*/ 2);
        }
    }));
    DungeonEvent.KEY_BOX_RANK5 = createKeyBoxEvent("KEY_BOX_RANK5", "ツルツルの箱だ", () => Item.ツルツル鍵, () => __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 8; i++) {
            yield wait();
            openKeyBox(/*base*/ 5, /*fluctuateRange*/ 2);
        }
    }));
    DungeonEvent.KEY_BOX_RANK6 = createKeyBoxEvent("KEY_BOX_RANK6", "ヘンテコな箱だ", () => Item.ヘンテコ鍵, () => __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 9; i++) {
            yield wait();
            openKeyBox(/*base*/ 6, /*fluctuateRange*/ 2);
        }
    }));
    DungeonEvent.TREASURE = new class extends DungeonEvent {
        constructor() {
            super("TREASURE");
            this.createImg = () => new Img("img/treasure.png");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                Util.msg.set("財宝の箱だ！");
            });
            this.createBtnLayout = () => createDefLayout()
                .set(ReturnBtn.index, new Btn("開ける", () => __awaiter(this, void 0, void 0, function* () {
                if (Dungeon.now.treasureKey > 0) {
                    Dungeon.now.treasureKey--;
                    Sound.TRAGER.play();
                    yield DungeonEvent.OPEN_TREASURE.happen();
                }
                else {
                    Sound.no.play();
                    Util.msg.set("鍵を持っていない");
                }
            })));
        }
    };
    DungeonEvent.OPEN_TREASURE = new class extends DungeonEvent {
        constructor() {
            super("OPEN_TREASURE");
            this.createImg = () => new Img("img/treasure_open.png");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                const treasure = Dungeon.now.rndTreasure();
                if (treasure) {
                    Sound.rare.play();
                    yield treasure.add(1);
                }
                else {
                    Util.msg.set("空だった！");
                }
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.GET_TREASURE_KEY = new class extends DungeonEvent {
        constructor() {
            super("GET_TREASURE_KEY");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                Dungeon.now.treasureKey++;
                Sound.rare.play();
                Util.msg.set(`[${Dungeon.now}の財宝の鍵]を手に入れた(${Dungeon.now.treasureKey})`, Color.GREEN.bright);
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.TRAP = new class extends DungeonEvent {
        constructor() {
            super("TRAP");
            this.createImg = () => new Img("img/trap.png");
            this.happenInner = () => {
                Util.msg.set("罠だ");
            };
            this.createBtnLayout = () => createDefLayout()
                .set(ReturnBtn.index, new Btn("解除", () => __awaiter(this, void 0, void 0, function* () {
                Sound.keyopen.play();
                yield DungeonEvent.TRAP_BROKEN.happen();
            })))
                .set(AdvanceBtn.index, new Btn("進む", () => __awaiter(this, void 0, void 0, function* () {
                Sound.blood.play();
                Util.msg.set("引っかかった！", Color.RED);
                yield wait();
                for (let p of Unit.players) {
                    if (!p.exists || p.dead) {
                        continue;
                    }
                    FX_格闘(p.imgCenter);
                    yield new Dmg({
                        attacker: p,
                        target: p,
                        pow: p.prm(Prm.MAX_HP).total / 5,
                        canCounter: false,
                    }).run();
                    yield p.judgeDead();
                }
                if (Unit.players.every(p => !p.exists || p.dead)) {
                    Util.msg.set("全滅した...", Color.RED);
                    yield cwait();
                    yield DungeonEvent.ESCAPE_DUNGEON.happen();
                    return;
                }
                DungeonEvent.empty.happen();
            })).dontMove());
        }
    };
    DungeonEvent.TRAP_BROKEN = new class extends DungeonEvent {
        constructor() {
            super("TRAP_BROKEN");
            this.createImg = () => new Img("img/trap_broken.png");
            this.isZoomImg = () => false;
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                Util.msg.set("解除した");
                yield openBox(ItemDrop.BOX, Dungeon.now.rank / 4, CollectingSkill.解除);
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.REST = new class extends DungeonEvent {
        constructor() {
            super("REST");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                Util.msg.set("休めそうな場所がある...");
            });
            this.createBtnLayout = () => createDefLayout()
                .set(ReturnBtn.index, new Btn("休む", () => __awaiter(this, void 0, void 0, function* () {
                Sound.camp.play();
                for (const p of Unit.players) {
                    if (p.exists && !p.dead) {
                        Heal.run("HP", p.prm(Prm.MAX_HP).total * 0.2 + 1, p, p, undefined, true);
                        Heal.run("MP", p.prm(Prm.MAX_MP).total * 0.2 + 1, p, p, undefined, true);
                    }
                }
                Util.msg.set("休憩した");
                DungeonEvent.empty.happen();
            })));
        }
    };
    DungeonEvent.TREE = new class extends DungeonEvent {
        constructor() {
            super("TREE");
            this.createImg = () => new Img("img/tree.png");
            this.happenInner = () => {
                Util.msg.set("木だ");
            };
            this.createBtnLayout = () => createDefLayout()
                .set(AdvanceBtn.index, new Btn("進む", () => __awaiter(this, void 0, void 0, function* () {
                Sound.PUNCH.play();
                Util.msg.set("いてっ！", Color.RED);
                yield wait();
                for (let p of Unit.players) {
                    if (!p.exists || p.dead) {
                        continue;
                    }
                    FX_格闘(p.imgCenter);
                    yield new Dmg({
                        attacker: p,
                        target: p,
                        pow: p.prm(Prm.MAX_HP).total / 10,
                        canCounter: false,
                    }).run();
                    yield p.judgeDead();
                }
            })).dontMove())
                .set(ReturnBtn.index, new Btn("斬る", () => __awaiter(this, void 0, void 0, function* () {
                Sound.KEN.play();
                yield DungeonEvent.TREE_GET.happen();
            })));
        }
    };
    DungeonEvent.TREE_GET = new class extends DungeonEvent {
        constructor() {
            super("TREE_GET");
            this.createImg = () => new Img("img/tree_broken.png");
            this.isZoomImg = () => false;
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                yield openBox(ItemDrop.TREE, Dungeon.now.rank / 2, CollectingSkill.伐採);
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.STRATUM = new class extends DungeonEvent {
        constructor() {
            super("STRATUM");
            this.createImg = () => new Img("img/stratum.png");
            this.happenInner = () => { Util.msg.set("掘れそうな場所がある"); };
            this.createBtnLayout = () => createDefLayout()
                .set(ReturnBtn.index, new Btn("掘る", () => __awaiter(this, void 0, void 0, function* () {
                yield DungeonEvent.STRATUM_GET.happen();
            })));
        }
    };
    DungeonEvent.STRATUM_GET = new class extends DungeonEvent {
        constructor() {
            super("STRATUM_GET");
            // createImg = ()=> new Img("img/tree_broken.png");
            // isZoomImg = ()=> false;
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                yield openBox(ItemDrop.STRATUM, Dungeon.now.rank / 2, CollectingSkill.地層);
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.FOSSIL = new class extends DungeonEvent {
        constructor() {
            super("FOSSIL");
            this.createImg = () => new Img("img/kaizuka.png");
            this.happenInner = () => { Util.msg.set("掘れそうだ..."); };
            this.createBtnLayout = () => createDefLayout()
                .set(AdvanceBtn.index, new Btn("進む", () => __awaiter(this, void 0, void 0, function* () {
                Sound.PUNCH.play();
                Util.msg.set("つまづいた！", Color.RED);
                yield wait();
                for (let p of Unit.players) {
                    if (!p.exists || p.dead) {
                        continue;
                    }
                    FX_格闘(p.imgCenter);
                    yield new Dmg({
                        attacker: p,
                        target: p,
                        pow: p.prm(Prm.MAX_HP).total / 10,
                        canCounter: false,
                    }).run();
                    yield p.judgeDead();
                }
                DungeonEvent.empty.happen();
            })).dontMove())
                .set(ReturnBtn.index, new Btn("発掘", () => __awaiter(this, void 0, void 0, function* () {
                if (Item.つるはし.remainingUseNum > 0) {
                    Item.つるはし.remainingUseNum--;
                    let rank = Dungeon.now.rank / 2;
                    yield openBox(ItemDrop.FOSSIL, rank, CollectingSkill.発掘);
                    DungeonEvent.empty.happen();
                }
                else {
                    Util.msg.set("つるはしがない");
                }
            })));
        }
    };
    DungeonEvent.LAKE = new class extends DungeonEvent {
        constructor() {
            super("LAKE");
            this.createImg = () => new Img("img/mizu.png");
            this.happenInner = () => {
                Util.msg.set("湖だ");
            };
            this.createBtnLayout = () => createDefLayout()
                .set(ReturnBtn.index, (() => {
                const drink = () => __awaiter(this, void 0, void 0, function* () {
                    yield openBox(ItemDrop.LAKE, Dungeon.now.rank / 2, CollectingSkill.水汲);
                });
                if (Item.釣り竿.remainingUseNum > 0) {
                    return new Btn("釣る", () => __awaiter(this, void 0, void 0, function* () {
                        Item.釣り竿.remainingUseNum--;
                        let rank = Dungeon.now.rank / 2;
                        yield openBox(ItemDrop.LAKE, rank, CollectingSkill.釣り);
                        yield drink();
                        DungeonEvent.empty.happen();
                    }));
                }
                else {
                    return new Btn("汲む", () => __awaiter(this, void 0, void 0, function* () {
                        yield drink();
                        DungeonEvent.empty.happen();
                    }));
                }
            })());
        }
    };
    DungeonEvent.BATTLE = new class extends DungeonEvent {
        constructor() {
            super("BATTLE");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                Util.msg.set("敵が現れた！");
                yield Dungeon.now.setEnemy();
                Battle.setup(BattleType.NORMAL, (result) => __awaiter(this, void 0, void 0, function* () {
                    switch (result) {
                        case BattleResult.WIN:
                            Scene.load(DungeonScene.ins);
                            break;
                        case BattleResult.LOSE:
                            yield DungeonEvent.ESCAPE_DUNGEON.happen();
                            break;
                        case BattleResult.ESCAPE:
                            Scene.load(DungeonScene.ins);
                            break;
                    }
                }));
                Scene.load(BattleScene.ins);
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.BOSS_BATTLE = new class extends DungeonEvent {
        constructor() {
            super("BOSS_BATTLE");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                Dungeon.now.playMusic("boss");
                Util.msg.set(`[${Dungeon.now}]のボスが現れた！`, Color.WHITE.bright);
                yield Dungeon.now.setBoss();
                Battle.setup(BattleType.BOSS, (result) => __awaiter(this, void 0, void 0, function* () {
                    switch (result) {
                        case BattleResult.WIN:
                            Util.dungeonBookMark = undefined;
                            yield DungeonEvent.CLEAR_DUNGEON.happen();
                            break;
                        case BattleResult.LOSE:
                            Util.dungeonBookMark = Dungeon.now;
                            yield DungeonEvent.ESCAPE_DUNGEON.happen();
                            break;
                        case BattleResult.ESCAPE:
                            yield DungeonEvent.ESCAPE_DUNGEON.happen();
                            break;
                    }
                }));
                Scene.load(BattleScene.ins);
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.EX_BATTLE = new class extends DungeonEvent {
        constructor() {
            super("EX_BATTLE");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                Dungeon.now.playMusic("ex");
                Util.msg.set(`[${Dungeon.now}]のエクストラエネミーが現れた！`, Color.WHITE.bright);
                yield Dungeon.now.setEx();
                Battle.setup(BattleType.EX, (result) => __awaiter(this, void 0, void 0, function* () {
                    switch (result) {
                        case BattleResult.WIN:
                            Sound.reaitem1.play();
                            Dungeon.now.exKillCount++;
                            if (Dungeon.now.exItems.length > 0) {
                                const item = choice(Dungeon.now.exItems);
                                item.add(1);
                                yield wait();
                            }
                            Music.stop();
                            Scene.load(DungeonScene.ins);
                            break;
                        case BattleResult.LOSE:
                            yield DungeonEvent.ESCAPE_DUNGEON.happen();
                            break;
                        case BattleResult.ESCAPE:
                            yield DungeonEvent.ESCAPE_DUNGEON.happen();
                            break;
                    }
                }));
                Scene.load(BattleScene.ins);
            });
            this.createBtnLayout = DungeonEvent.empty.createBtnLayout;
        }
    };
    DungeonEvent.ESCAPE_DUNGEON = new class extends DungeonEvent {
        constructor() {
            super("ESCAPE_DUNGEON");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                Music.stop();
                Util.msg.set(`${Dungeon.now.toString()}を脱出します...`);
                yield cwait();
                yield wait();
                Sound.walk2.play();
                Scene.load(TownScene.ins);
                SaveData.save();
                Sound.save.play();
            });
            this.createBtnLayout = () => ILayout.empty;
        }
    };
    DungeonEvent.CLEAR_DUNGEON = new class extends DungeonEvent {
        constructor() {
            super("CLEAR_DUNGEON");
            this.happenInner = () => __awaiter(this, void 0, void 0, function* () {
                BattleScene.ins.background = bounds => { };
                Music.stop();
                let yen = Dungeon.now.au * (Dungeon.now.enemyLv / 10 + 1) * (1 + Dungeon.now.dungeonClearCount * 0.02);
                yen = yen | 0;
                Sound.lvup.play();
                Dungeon.now.dungeonClearCount++;
                Util.msg.set(`[${Dungeon.now}]を踏破した！`, Color.WHITE.bright);
                yield cwait();
                Sound.COIN.play();
                PlayData.yen += yen;
                Util.msg.set(`報奨金${yen}円入手`, Color.YELLOW.bright);
                yield cwait();
                yield Dungeon.now.dungeonClearEvent();
                yield DungeonEvent.ESCAPE_DUNGEON.happen();
            });
            this.createBtnLayout = () => ILayout.empty;
        }
    };
})(DungeonEvent || (DungeonEvent = {}));
const createDefLayout = () => {
    return new FlowLayout(1, 3)
        .set(ItemBtn.index, ItemBtn.ins)
        .set(ReturnBtn.index, ReturnBtn.ins)
        .set(AdvanceBtn.index, AdvanceBtn.ins);
};
class AdvanceBtn {
    static get index() { return 0; }
    static get ins() {
        if (!this._ins) {
            this._ins = new Btn(() => "進む", () => __awaiter(this, void 0, void 0, function* () {
                Sound.walk.play();
                FX_Advance(Place.MAIN);
                const au = new AUForce(1);
                Unit.players.forEach(u => u.walk(au));
                Dungeon.auNow += au.add;
                if (Dungeon.auNow >= Dungeon.now.au) {
                    Dungeon.auNow = Dungeon.now.au;
                    yield DungeonEvent.BOSS_BATTLE.happen();
                    return;
                }
                yield Dungeon.now.rndEvent().happen();
            }));
        }
        return this._ins;
    }
}
class ReturnBtn {
    static get index() { return 1; }
    static get ins() {
        if (!this._ins) {
            this._ins = new Btn(() => "戻る", () => __awaiter(this, void 0, void 0, function* () {
                Sound.walk.play();
                FX_Return(Place.MAIN);
                const au = new AUForce(-1);
                Unit.players.forEach(u => u.walk(au));
                Dungeon.auNow += au.add;
                if (Dungeon.auNow < 0) {
                    Dungeon.auNow = 0;
                    yield DungeonEvent.ESCAPE_DUNGEON.happen();
                    return;
                }
                yield Dungeon.now.rndEvent().happen();
            }));
        }
        return this._ins;
    }
}
class ItemBtn {
    static get index() { return 2; }
    static get ins() {
        if (!this._ins) {
            this._ins = new Btn(() => "アイテム", () => __awaiter(this, void 0, void 0, function* () {
                Sound.system.play();
                Scene.load(ItemScene.ins({
                    selectUser: true,
                    user: Unit.players[0],
                    use: (item, user) => __awaiter(this, void 0, void 0, function* () {
                        if (item.targetings.some(t => t === "select")) {
                            yield item.use(user, [user]);
                        }
                        else {
                            const targets = user.searchUnits(item.targetings, 1);
                            if (targets.length > 0) {
                                yield item.use(user, targets);
                            }
                        }
                    }),
                    returnScene: () => {
                        Scene.set(DungeonScene.ins);
                    },
                }));
            }));
        }
        return this._ins;
    }
}
/***/
const openBox = (dropType, rank, collectingSkill) => __awaiter(this, void 0, void 0, function* () {
    const partySkill = new PartySkillOpenBox();
    PartySkill.skills.forEach(skill => skill.openBox(partySkill, dropType));
    let openNum = 1;
    let openBoost = 0.2 + partySkill.chain;
    while (Math.random() < openBoost) {
        openNum++;
        openBoost /= 2;
    }
    let baseRank = rank + partySkill.addRank;
    for (let i = 0; i < openNum; i++) {
        const itemRank = Item.fluctuateRank(baseRank);
        let item = Item.rndItem(dropType, itemRank);
        let addNum = 1;
        if (i !== 0) {
            yield wait();
        }
        item.add(addNum);
        Sound.ITEM_GET.play();
        if (collectingSkill) {
            yield collectingSkill.judgeLvUP(item.rank);
        }
    }
});
const openKeyBox = (baseRank, rankFluctuateRange) => {
    let frank = Math.random() * (rankFluctuateRange + 1);
    if (Math.random() < 0.5) {
        frank *= -1;
    }
    let rank = baseRank + frank;
    if (rank < 0) {
        rank = 0;
    }
    const item = Item.rndItem(ItemDrop.BOX, rank);
    item.add(1);
    Sound.ITEM_GET.play();
};
