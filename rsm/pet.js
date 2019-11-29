var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Force, Targeting } from "./force.js";
import { Unit } from "./unit.js";
import { Tec } from "./tec.js";
import { choice } from "./undym/random.js";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Color } from "./undym/type.js";
import { Img } from "./graphics/texture.js";
export class PetFactory {
    constructor(uniqueName, img) {
        this.uniqueName = uniqueName;
        this.img = img;
        PetFactory._values.push(this);
        if (PetFactory._valueOf.has(uniqueName)) {
            console.log(`PetFactory._valueOf already has the key: ${uniqueName}.`);
        }
        else {
            PetFactory._valueOf.set(uniqueName, this);
        }
    }
    static values() { return this._values; }
    static valueOf(uniqueName) {
        return this._valueOf.get(uniqueName);
    }
}
PetFactory._values = [];
PetFactory._valueOf = new Map();
export class Pet extends Force {
    constructor(uniqueName, img, _hp) {
        super();
        this.uniqueName = uniqueName;
        this.img = img;
        this._hp = _hp;
    }
    static get HP_LIMIT() { return Pet.HP_NAMES.length - 1; }
    get hp() { return this._hp; }
    set hp(value) {
        if (value < 0) {
            this._hp = 0;
        }
        else if (value > Pet.HP_LIMIT) {
            this._hp = Pet.HP_LIMIT;
        }
        else {
            this._hp = value;
        }
    }
    toString() { return this.uniqueName; }
    hpToString() {
        const index = this.hp | 0;
        if (index >= Pet.HP_NAMES.length) {
            return "暴走";
        }
        if (0 <= index && index < Pet.HP_NAMES.length) {
            return Pet.HP_NAMES[index];
        }
        return "あの世";
    }
    useRndPetTec(summoner, tecs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tecs.length === 0) {
                return undefined;
            }
            for (let i = 0; i < 10; i++) {
                const tec = choice(tecs);
                if (tec.checkCost(summoner)) {
                    const targets = Targeting.filter(tec.targetings, summoner, Unit.all, tec.rndAttackNum());
                    if (targets.length === 0) {
                        return;
                    }
                    Util.msg.set(`${this.toString()}の[${tec}]`, Color.D_GREEN.bright);
                    yield wait();
                    tec.payCost(summoner);
                    for (const t of targets) {
                        yield tec.run(summoner, t);
                    }
                    return;
                }
            }
        });
    }
}
Pet.HP_NAMES = ["死亡", "瀕死", "衰弱", "弱体", "通常", "頑丈", "鉄壁", "無敵",];
(function (Pet) {
    Pet.empty = new class extends PetFactory {
        constructor() { super("empty", Img.empty); }
        create(hp) {
            const uniqueName = this.uniqueName;
            const img = this.img;
            return new class extends Pet {
                constructor() { super(uniqueName, img, hp); }
                toString() { return ""; }
            };
        }
    };
    /** */
    Pet.ドゥエルガル = new class extends PetFactory {
        constructor() { super("ドゥエルガル", new Img("img/pet/pet1.png", { transparence: Color.BLACK })); }
        create(hp) {
            const factory = this;
            return new class extends Pet {
                constructor() { super(factory.uniqueName, factory.img, hp); }
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.useRndPetTec(unit, [Tec.パンチ]);
                    });
                }
            };
        }
    };
    /**強化でTec.イスキュアを使用(未実装). */
    Pet.ネーレイス = new class extends PetFactory {
        constructor() { super("ネーレイス", new Img("img/pet/pet2.png", { transparence: Color.BLACK })); }
        create(hp) {
            const factory = this;
            return new class extends Pet {
                constructor() { super(factory.uniqueName, factory.img, hp); }
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.useRndPetTec(unit, [Tec.キュア, Tec.ラクサスキュア]);
                    });
                }
            };
        }
    };
    /** */
    Pet.ヴァルナ = new class extends PetFactory {
        constructor() { super("ヴァルナ", new Img("img/pet/pet3.png", { transparence: Color.BLACK })); }
        create(hp) {
            const factory = this;
            return new class extends Pet {
                constructor() { super(factory.uniqueName, factory.img, hp); }
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.useRndPetTec(unit, [Tec.シルフ, Tec.レヴィーナの歌声, Tec.ヴァルナパンチ]);
                    });
                }
            };
        }
    };
    Pet.イリューガー = new class extends PetFactory {
        constructor() { super("イリューガー", new Img("img/pet/pet4.png", { transparence: Color.BLACK })); }
        create(hp) {
            const factory = this;
            return new class extends Pet {
                constructor() { super(factory.uniqueName, factory.img, hp); }
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.useRndPetTec(unit, [Tec.ファイアブレス]);
                    });
                }
            };
        }
    };
})(Pet || (Pet = {}));
