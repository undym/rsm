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
    constructor(name, hp) {
        super();
        this.name = name;
        this.hp = hp;
    }
    toString() { return this.name; }
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
(function (Pet) {
    Pet.ネーレイス = new class extends PetFactory {
        constructor() { super("ネーレイス", new Img("img/pet/pet2.png", { clear: Color.BLACK })); }
        create(hp) {
            return new class extends Pet {
                constructor() { super("ネーレイス", hp); }
                phaseStart(unit, pForce) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.useRndPetTec(unit, [Tec.キュア]);
                    });
                }
            };
        }
    };
})(Pet || (Pet = {}));
