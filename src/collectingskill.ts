import { Util } from "./util.js";
import { Color } from "./undym/type.js";
import { wait } from "./undym/scene.js";






export class CollectingSkill{
    private static _values:CollectingSkill[] = [];
    static get values():ReadonlyArray<CollectingSkill>{return this._values;}

    lv:number = 0;

    constructor(readonly uniqueName:string){
        CollectingSkill._values.push(this);
    }

    async lvupCheck(rank:number){
        // let prob = 1 - (this.lv / (rank+10));
        const prob = rank / (this.lv+1);
        if(Math.random() < prob * prob){
            this.lv++;
            Util.msg.set(`≪${this.uniqueName}スキル≫が${this.lv}になった`, Color.YELLOW.bright); await wait();
        }
    }
}

export namespace CollectingSkill{
    export const 宝箱 = new CollectingSkill("宝箱");
    export const 解除 = new CollectingSkill("解除");
    export const 伐採 = new CollectingSkill("伐採");
    export const 地層 = new CollectingSkill("地層");
    export const 水汲 = new CollectingSkill("水汲");
    export const 釣り = new CollectingSkill("釣り");
    export const 発掘 = new CollectingSkill("発掘");
}