var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Util } from "./util.js";
import { Color } from "./undym/type.js";
import { wait } from "./undym/scene.js";
import { Sound } from "./sound.js";
export class CollectingSkill {
    constructor(uniqueName) {
        this.uniqueName = uniqueName;
        this.lv = 0;
        CollectingSkill._values.push(this);
    }
    static get values() { return this._values; }
    judgeLvUP(rank) {
        return __awaiter(this, void 0, void 0, function* () {
            // let prob = 1 - (this.lv / (rank+10));
            const prob = rank / (this.lv + 1);
            if (Math.random() < prob * prob) {
                this.lv++;
                Sound.cry.play();
                Util.msg.set(`≪${this.uniqueName}スキル≫が${this.lv}になった`, Color.YELLOW.bright);
                yield wait();
            }
        });
    }
}
CollectingSkill._values = [];
(function (CollectingSkill) {
    CollectingSkill.宝箱 = new CollectingSkill("宝箱");
    CollectingSkill.解除 = new CollectingSkill("解除");
    CollectingSkill.伐採 = new CollectingSkill("伐採");
    CollectingSkill.地層 = new CollectingSkill("地層");
    CollectingSkill.水汲 = new CollectingSkill("水汲");
    CollectingSkill.釣り = new CollectingSkill("釣り");
    CollectingSkill.発掘 = new CollectingSkill("発掘");
})(CollectingSkill || (CollectingSkill = {}));
