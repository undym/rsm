var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Unit } from "./unit.js";
import { Font, Graphics } from "./graphics/graphics.js";
import { DrawSTBox } from "./scene/sceneutil.js";
import { FX_Shake, FX_RotateStr, FX_PetDie } from "./fx/fx.js";
import { Color } from "./undym/type.js";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Sound } from "./sound.js";
export class Force {
    static get empty() { return this._empty ? this._empty : (this._empty = new Force()); }
    equip(unit) { }
    /**死亡していても通る.死亡時発動させたくない場合は、ガードする。*/
    battleStart(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    phaseStart(unit, pForce) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    deadPhaseStart(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    attackNum(action, unit, aForce) { }
    beforeDoAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    beforeBeAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**ダメージを受ける直前、calc()された後に通る. */
    beDamage(unit, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterDoAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterBeAtk(dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    memberAfterDoAtk(me, action, attacker, target, dmg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    whenDead(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * 自分以外の死亡時.
     * 他のキャラクターのwhenAnyoneDeadによって死亡が回避された場合でも、残りの全ての生存キャラクター分呼ばれるので、
     * deadUnitが本当に死亡しているかはdeadUnit.deadで確認されなければならない。
     * */
    whenAnyoneDead(me, deadUnit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    phaseEnd(unit) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
export class PhaseStartForce {
    constructor() {
        this.phaseSkip = false;
    }
}
export class AttackNumForce {
    constructor(base) {
        this.base = base;
        this.add = 0;
    }
    get total() { return (this.base + this.add) | 0; }
}
export class Dmg {
    constructor(args) {
        /**calc()で出された結果のbak. */
        this.result = { value: 0, isHit: false };
        /**追加ダメージ値を返す。 */
        this.additionalAttacks = [];
        /** */
        this.types = [];
        this.clear();
        this.attacker = args.attacker;
        this.target = args.target;
        this.action = args.action;
        if (args.pow) {
            this.pow.base = args.pow;
        }
        if (args.mul) {
            this.pow.mul = args.mul;
        }
        if (args.hit) {
            this.hit.base = args.hit;
        }
        if (args.def) {
            this.def.base = args.def;
        }
        if (args.absPow) {
            this.abs.base = args.absPow;
        }
        if (args.absMul) {
            this.abs.mul = args.absMul;
        }
        if (args.types) {
            this.types = args.types;
        }
    }
    static get empty() {
        if (!this._empty) {
            this._empty = new Dmg({
                attacker: Unit.all[0],
                target: Unit.all[0],
            });
        }
        return this._empty;
    }
    //0     1
    //60    0.85
    //300   0.55
    //1,050 0.3
    //2,100 0.2125
    static calcDefCut(def) {
        return (3000.0 + def * 1) / (3000.0 + def * 10);
    }
    static calcDmgElm(elm) {
        let res = (elm.base + elm.add) * elm.mul;
        return res > 0 ? res : 0;
    }
    /**一つでも持っていたらtrue. */
    hasType(...checkTypes) {
        for (const t of this.types) {
            for (const c of checkTypes) {
                if (t === c) {
                    return true;
                }
            }
        }
        return false;
    }
    clear() {
        this.pow = {
            base: 0,
            add: 0,
            mul: 1,
        };
        this.def = {
            base: 0,
            add: 0,
            mul: 1,
        };
        this.hit = {
            base: 1,
            add: 0,
            mul: 1,
        };
        this.abs = {
            base: 0,
            add: 0,
            mul: 1,
        };
        this.result.value = 0;
        this.result.isHit = false;
        this.additionalAttacks = [];
        this.types = [];
    }
    calc() {
        const _pow = Dmg.calcDmgElm(this.pow);
        const _def = Dmg.calcDmgElm(this.def);
        const _hit = Dmg.calcDmgElm(this.hit);
        const _abs = Dmg.calcDmgElm(this.abs);
        let value = 0;
        let isHit = Math.random() < _hit;
        if (isHit) {
            value = _pow * Dmg.calcDefCut(_def);
            value = value * (0.75 + Math.random() * 0.5);
        }
        else {
            value = 0;
        }
        if (_abs > 0) {
            isHit = true;
            value += _abs | 0;
        }
        this.result.value = value > 0 ? value | 0 : 0;
        this.result.isHit = isHit;
        return this.result;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.target.exists || this.target.dead) {
                return;
            }
            const result = this.calc();
            const font = new Font(Font.def.size * 2, Font.BOLD);
            const point = {
                x: this.target.imgBounds.cx + Graphics.dotW * 60 * (Math.random() * 2 - 1),
                y: this.target.imgBounds.cy + Graphics.dotH * 60 * (Math.random() * 2 - 1),
            };
            const effect = (value) => {
                const stbox = new DrawSTBox(() => this.target);
                FX_Shake(this.target.boxBounds, bounds => {
                    Graphics.fillRect(bounds, Color.BLACK);
                    stbox.draw(bounds);
                });
                FX_RotateStr(font, `${value}`, point, Color.WHITE);
            };
            this.target.beDamage(this);
            if (result.isHit) {
                const _doDmg = (value) => __awaiter(this, void 0, void 0, function* () {
                    effect(value);
                    if (this.target.pet && value >= this.target.hp) {
                        Util.msg.set(`${this.target.pet}が${value}のダメージを引き受けた`);
                        yield wait(1);
                        this.target.pet.hp--;
                        if (this.target.pet.hp <= 0) {
                            const petName = this.target.pet.toString();
                            this.target.pet = undefined;
                            Sound.pet_die.play();
                            FX_PetDie(this.target.imgCenter);
                            Util.msg.set(`${petName}は砕け散った...`);
                            yield wait();
                        }
                    }
                    else {
                        this.target.hp -= value;
                    }
                });
                const value = result.value;
                yield _doDmg(value);
                Util.msg.set(`${this.target.name}に${value}のダメージ`, Color.RED.bright);
                for (let i = 0; i < this.additionalAttacks.length; i++) {
                    yield wait(1);
                    const value = this.additionalAttacks[i](this, i);
                    yield _doDmg(value);
                    Util.msg.set(`+${value}`, Color.RED.bright);
                }
            }
            else {
                FX_RotateStr(font, "MISS", point, Color.L_GRAY);
                Util.msg.set("MISS", Color.L_GRAY);
            }
            this.target.tp += 1;
        });
    }
}
export class Action {
}
// export type Targeting = number;
// export namespace Targeting{
//     export const SELECT      = 1 << 0;
//     export const SELF        = 1 << 1;
//     export const ALL         = 1 << 2;
//     export const WITH_DEAD   = 1 << 3;
//     export const DEAD_ONLY   = 1 << 4;
//     export const WITH_FRIEND = 1 << 5;
//     export const FRIEND_ONLY = 1 << 6;
//     export const RANDOM      = 1 << 7;
//     export const filter = (targetings:Targeting, attacker:Unit, targets:Unit[]|ReadonlyArray<Unit>, num:number):Unit[] => {
//         if(targetings & Targeting.SELF){
//             return new Array<Unit>(num).fill(attacker);
//         }
//         let filtered = targets.filter(t=> t.exists);
//              if(targetings & Targeting.WITH_DEAD){}
//         else if(targetings & Targeting.DEAD_ONLY){filtered = filtered.filter(t=> t.dead);}
//         else                                     {filtered = filtered.filter(t=> !t.dead);}
//              if(targetings & Targeting.WITH_FRIEND){}
//         else if(targetings & Targeting.FRIEND_ONLY){filtered = filtered.filter(t=> t.isFriend(attacker));}
//         else                                       {filtered = filtered.filter(t=> !t.isFriend(attacker));}
//         if(filtered.length === 0){return [];}
//         if(targetings & Targeting.RANDOM){
//             let res:Unit[] = [];
//             for(let i = 0; i < num; i++){
//                 res.push( choice(filtered) );
//             }
//             return res;
//         }
//         if(targetings & Targeting.SELECT){
//             return new Array<Unit>(num).fill( choice(filtered) );
//         }
//         //all
//         let res:Unit[] = [];
//         for(let i = 0; i < num; i++){
//             res = res.concat( filtered );
//         }
//         return res;
//     }
// }
