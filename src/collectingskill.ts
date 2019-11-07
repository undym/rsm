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
        let prob = 1 - (this.lv / (rank+1) * 10);
        //lv = 0, rank = 1,
        //0 / 20,
        //1 - 0 / 20
        //1
        //lv = 9, rank = 1,
        //9 / 20
        //lv = 30, rank = 1,
        //30 / 20,
        //1 - 1.5,
        //-0.5
        if(prob > 0 && Math.random() < prob * prob){
            this.lv++;
            Util.msg.set(`${this.uniqueName}スキルが${this.lv}になった`, Color.YELLOW.bright); await wait();
        }
    }
}

export namespace CollectingSkill{
    export const 宝箱 = new CollectingSkill("宝箱");
    export const 解除 = new CollectingSkill("解除");
    export const 伐採 = new CollectingSkill("伐採");
    export const 地層 = new CollectingSkill("地層");
    export const 水汲 = new CollectingSkill("水汲");
}