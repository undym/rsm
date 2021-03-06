import { Dungeon } from "./dungeon/dungeon.js";
import { Util, SceneType } from "./util.js";
import { Color, Point } from "./undym/type.js";
import { Scene, wait } from "./undym/scene.js";
import { Unit, Prm, PUnit, Targeting } from "./unit.js";
import { FX_Str, FX_RotateStr, FX_回復, FX_Buff, FX_RemoveCondition, FX_約束 } from "./fx/fx.js";
import { Action, Dmg, Heal } from "./force.js";
import { randomInt, choice } from "./undym/random.js";
import { Font } from "./graphics/graphics.js";
import { Num, Mix } from "./mix.js";
import { DungeonEvent } from "./dungeon/dungeonevent.js";
import { SaveData } from "./savedata.js";
import DungeonScene from "./scene/dungeonscene.js";
import { Battle } from "./battle.js";
import { Tec } from "./tec.js";
import { Condition, ConditionType } from "./condition.js";
import { Sound } from "./sound.js";
import { Job } from "./job.js";



export class ItemType{
    protected _values:Item[];

    private constructor(name:string){
        this.toString = ()=>name;
    }

    get values():ReadonlyArray<Item>{
        if(!this._values){
            this._values = Item.values
                                .filter(item=> item.itemType === this);
        }
        return this._values;
    };

    static readonly 蘇生 = new ItemType("蘇生");
    static readonly HP回復 = new ItemType("HP回復");
    static readonly MP回復 = new ItemType("MP回復");

    static readonly 状態 = new ItemType("状態");

    static readonly ダンジョン = new ItemType("ダンジョン");
    static readonly 弾 = new ItemType("弾");
    static readonly 鍵 = new ItemType("鍵");
    
    static readonly ダメージ = new ItemType("ダメージ");
    
    static readonly ドーピング = new ItemType("ドーピング");
    static readonly 書 = new ItemType("書");

    static readonly メモ = new ItemType("メモ");

    static readonly 素材 = new ItemType("素材");
}


export class ItemParentType{
    private static _values:ItemParentType[] = [];
    static get values():ReadonlyArray<ItemParentType>{return this._values;}


    private constructor(
        name:string
        ,public readonly children:ReadonlyArray<ItemType>
    ){
        this.toString = ()=>name;

        ItemParentType._values.push(this);
    }

    static readonly 回復       = new ItemParentType("回復", [ItemType.蘇生, ItemType.HP回復, ItemType.MP回復]);
    static readonly 状態       = new ItemParentType("状態", [ItemType.状態]);
    static readonly ダンジョン  = new ItemParentType("ダンジョン", [ItemType.ダンジョン, ItemType.弾, ItemType.鍵]);
    static readonly 戦闘       = new ItemParentType("戦闘", [ItemType.ダメージ]);
    static readonly 強化       = new ItemParentType("強化", [ItemType.ドーピング, ItemType.書]);
    static readonly その他     = new ItemParentType("その他",    [
                                                                    ItemType.メモ, ItemType.素材,
                                                                ]);
}


export enum ItemDrop{
    NO      = 0,
    BOX     = 1 << 0,
    TREE    = 1 << 1,
    STRATUM = 1 << 2,
    LAKE    = 1 << 3,
    FISHING = 1 << 4,
    FOSSIL  = 1 << 5,
}


class ItemValues{
    private values = new Map<number,Item[]>();

    constructor(items:Item[]){
        for(const item of items){
            if(!this.values.has(item.rank)){
                this.values.set(item.rank, []);
            }

            (this.values.get(item.rank) as Item[]).push(item);
        }
    }

    get(rank:number):ReadonlyArray<Item>|undefined{
        return this.values.get(rank);
    }
}



export class Item implements Action, Num{
    private static _values:Item[] = [];
    static get values():ReadonlyArray<Item>{return this._values;}


    private static _consumableValues:Item[] = [];
    static consumableValues():ReadonlyArray<Item>{
        return this._consumableValues;
    }

    private static _dropTypeValues = new Map<number,ItemValues>();
    /**
     * 指定のタイプの指定のランクのアイテムを返す。そのランクにアイテムが存在しなければランクを一つ下げて再帰する。
     * @param dropType 
     * @param rank 
     */
    static rndItem(dropType:number, rank:number):Item{
        rank = rank|0;
        if(!this._dropTypeValues.has(dropType)){
            const typeValues = this.values.filter(item=> item.dropTypes & dropType);
            this._dropTypeValues.set(dropType, new ItemValues(typeValues));
        }

        const itemValues = this._dropTypeValues.get(dropType);
        if(itemValues){
            const rankValues = itemValues.get(rank);
            if(rankValues){
                for(let i = 0; i < 10; i++){
                    let tmp = choice( rankValues );
                    if(tmp.num < tmp.numLimit){return tmp;}
                }
            }

            if(rank <= 0){return Item.石;}
            return this.rndItem(dropType, rank-1);
        }
        
        return Item.石;
    }
    /**
     * return res > 0 ? res : 0;
     * */
    static fluctuateRank(baseRank:number, rankFluctuatePassProb = 0.3){
        let add = 0;

        const loopLim = 20;
        let loop = 0;
        while(Math.random() <= rankFluctuatePassProb && loop++ < loopLim){
            add += 0.5 + Math.random() * 0.5;
        }

        if(Math.random() < 0.5){
            add *= -1;
        }

        const res = (baseRank + add)|0;
        return res > 0 ? res : 0;
    }


    static readonly DEF_NUM_LIMIT = 9999;


    num:number = 0;
    totalGetCount:number = 0;
    /**残り使用回数。*/
    remainingUseNum:number = 0;

    get uniqueName():string {return this.args.uniqueName;}
    get info():string       {return this.args.info;}
    get itemType():ItemType {return this.args.type;}
    get rank():number       {return this.args.rank;}
    get targetings():Targeting[] {return this.args.targetings ? this.args.targetings : ["select"];}
    get consumable():boolean{return this.args.consumable ? this.args.consumable : false;}
    /**所持上限. */
    get numLimit():number   {return this.args.numLimit ? this.args.numLimit : Item.DEF_NUM_LIMIT;}
    get dropTypes():number  {return this.args.drop;}

    
    protected constructor(
        protected args:{
            uniqueName:string,
            info:string,
            type:ItemType,
            rank:number,
            drop:number,
            targetings?:Targeting[],
            numLimit?:number,
            consumable?:boolean,
            use?:(user:Unit,target:Unit)=>Promise<void>,
        }
    ){
        
        if(args.consumable){
            Item._consumableValues.push(this);
        }

        Item._values.push(this);

    }

    toString():string{return this.uniqueName;}

    add(v:number){
        if(v > 0){       
            if(this.num + v > this.numLimit){
                v = this.numLimit - this.num;
                if(v <= 0){
                    Util.msg.set(`[${this}]はこれ以上入手できない`, Color.L_GRAY);
                    return;
                }
            }
        }

        Num.add(this, v);
    }

    async use(user:Unit, targets:Unit[]):Promise<void>{
        if(!this.canUse(user, targets)){return;}

        for(let t of targets){
            await this.useInner(user, t);
        }
        
        if(this.consumable) {this.remainingUseNum--;}
        else                {this.num--;}
    }

    protected async useInner(user:Unit, target:Unit):Promise<void>{
        if(this.args.use){await this.args.use(user, target);}
    }

    canUse(user:Unit, targets:Unit[]){
        if(!this.args.use){return false;}
        if(this.consumable && this.remainingUseNum <= 0){return false;}
        if(!this.consumable && this.num <= 0){return false;}
        return true;
    }
}



export namespace Item{
    const itemUnitCenter = (target:Unit):Point=>{
        if(SceneType.now === SceneType.BATTLE){
            return target.imgCenter;
        }else{
            return target.boxCenter;
        }
    };
    const itemRevive = async(hp:number, user:Unit, target:Unit, item:Item)=>{
        if(!target.dead){return;}
        
        target.dead = false;
        target.hp = 0;
        Heal.run("HP", hp, target, target, item, false);

        Sound.KAIFUKU.play();
        FX_約束( itemUnitCenter(target) );
        if(SceneType.now === SceneType.BATTLE){
            Util.msg.set(`${target.name}は生き返った`); await wait();
        }
    }
    const itemHeal = async(type:"HP"|"MP"|"TP", value:number, user:Unit, target:Unit, item:Item)=>{
        Sound.KAIFUKU.play();
        FX_回復( itemUnitCenter(target) );
        const msg = SceneType.now === SceneType.BATTLE;
        Heal.run(type, value, user, target, item, msg);
    };

    const removeCondition = async(target:Unit, condition:Condition|ConditionType)=>{
        if(target.hasCondition(condition)){
            target.removeCondition(condition);
            
            FX_RemoveCondition( itemUnitCenter(target) );
            Sound.up.play();
            if(condition instanceof Condition){
                if(SceneType.now === SceneType.BATTLE){
                    Util.msg.set(`${target.name}の＜${condition}＞が解除された`); await wait();
                }
            }
        }
    };

    //-----------------------------------------------------------------
    //
    //蘇生
    //
    //-----------------------------------------------------------------
    export const                         サンタクララ薬:Item = new class extends Item{
        constructor(){super({uniqueName:"サンタクララ薬", info:"一体をHP1で蘇生",
                                type:ItemType.蘇生, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    await itemRevive( 1, user, target, this );
                                }
        })}
    };
    //-----------------------------------------------------------------
    //
    //HP回復
    //
    //-----------------------------------------------------------------
    export const                         スティック:Item = new class extends Item{
        constructor(){super({uniqueName:"スティック", info:"HP+5",
                                type:ItemType.HP回復, rank:0, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 5, user, target, this),
        })}
    };
    export const                         スティックパ:Item = new class extends Item{
        constructor(){super({uniqueName:"スティックパ", info:"HP+10",
                                type:ItemType.HP回復, rank:0, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 10, user, target, this),
        })}
    };
    export const                         スティックパン:Item = new class extends Item{
        constructor(){super({uniqueName:"スティックパン", info:"HP+20",
                                type:ItemType.HP回復, rank:0, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 20, user, target, this),
        })}
    };
    export const                         ダブルスティックパン:Item = new class extends Item{
        constructor(){super({uniqueName:"ダブルスティックパン", info:"HP+30",
                                type:ItemType.HP回復, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 30, user, target, this),
        })}
    };
    export const                         硬化スティックパン:Item = new class extends Item{
        constructor(){super({uniqueName:"硬化スティックパン", info:"HP+50",
                                type:ItemType.HP回復, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 50, user, target, this),
        })}
    };
    export const                         マーラーカオ:Item = new class extends Item{
        constructor(){super({uniqueName:"マーラーカオ", info:"マーラーの顔をかたどったパン  HP+70",
                                type:ItemType.HP回復, rank:2, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 70, user, target, this),
        })}
    };
    export const                         霊水:Item = new class extends Item{
        constructor(){super({uniqueName:"霊水", info:"HP+300",
                                type:ItemType.HP回復, rank:7, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 300, user, target, this),
        })}
    };
    export const                         清水:Item = new class extends Item{
        constructor(){super({uniqueName:"清水", info:"HP+400",
                                type:ItemType.HP回復, rank:8, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 400, user, target, this),
        })}
    };
    export const                         超聖水:Item = new class extends Item{
        constructor(){super({uniqueName:"超聖水", info:"HP+500",
                                type:ItemType.HP回復, rank:9, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", 500, user, target, this),
        })}
    };
    export const                         ドラッグ:Item = new class extends Item{
        constructor(){super({uniqueName:"ドラッグ", info:"HP+10%",
                                type:ItemType.HP回復, rank:0, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.10 + 1, user, target, this),
        })}
    };
    export const                         LAドラッグ:Item = new class extends Item{
        constructor(){super({uniqueName:"LAドラッグ", info:"HP+20%",
                                type:ItemType.HP回復, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.20 + 1, user, target, this),
        })}
    };
    export const                         ロシアドラッグ:Item = new class extends Item{
        constructor(){super({uniqueName:"ロシアドラッグ", info:"HP+30%",
                                type:ItemType.HP回復, rank:2, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.30 + 1, user, target, this),
        })}
    };
    export const                         ビタミンドラッグ:Item = new class extends Item{
        constructor(){super({uniqueName:"ビタミンドラッグ", info:"HP+40%",
                                type:ItemType.HP回復, rank:3, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.40 + 1, user, target, this),
        })}
    };
    export const                         高ビタミンドラッグ:Item = new class extends Item{
        constructor(){super({uniqueName:"高ビタミンドラッグ", info:"HP+50%",
                                type:ItemType.HP回復, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.50 + 1, user, target, this),
        })}
    };
    export const                         濃密ビタミンドラッグ:Item = new class extends Item{
        constructor(){super({uniqueName:"濃密ビタミンドラッグ", info:"HP+60%",
                                type:ItemType.HP回復, rank:5, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.60 + 1, user, target, this),
        })}
    };
    export const                         ビタミンドラッグA:Item = new class extends Item{
        constructor(){super({uniqueName:"ビタミンドラッグA", info:"HP+70%",
                                type:ItemType.HP回復, rank:6, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.70 + 1, user, target, this),
        })}
    };
    export const                         ビタミンドラッグFINAL:Item = new class extends Item{
        constructor(){super({uniqueName:"ビタミンドラッグFINAL", info:"HP+80%",
                                type:ItemType.HP回復, rank:7, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.80 + 1, user, target, this),
        })}
    };
    export const                         ビタミンドラッグFF:Item = new class extends Item{
        constructor(){super({uniqueName:"ビタミンドラッグFF", info:"HP+90%",
                                type:ItemType.HP回復, rank:8, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total * 0.90 + 1, user, target, this),
        })}
    };
    export const                         ビタミンドラッグFFF:Item = new class extends Item{
        constructor(){super({uniqueName:"ビタミンドラッグFFF", info:"HP+100%",
                                type:ItemType.HP回復, rank:9, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("HP", target.prm(Prm.MAX_HP).total, user, target, this),
        })}
    };
    export const                         シェイクスピア分子:Item = new class extends Item{
        constructor(){super({uniqueName:"シェイクスピア分子", info:"全員のHP+30",
                                type:ItemType.HP回復, rank:2, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>await itemHeal("HP", 30, user, target, this),
        })}
    };
    export const                         シェイクスピア分子1:Item = new class extends Item{
        constructor(){super({uniqueName:"シェイクスピア分子1", info:"全員のHP+50",
                                type:ItemType.HP回復, rank:3, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>await itemHeal("HP", 50, user, target, this),
        })}
        toString(){return "シェイクスピア分子+1";}
    };
    export const                         シェイクスピア分子2:Item = new class extends Item{
        constructor(){super({uniqueName:"シェイクスピア分子2", info:"全員のHP+100",
                                type:ItemType.HP回復, rank:4, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>await itemHeal("HP", 100, user, target, this),
        })}
        toString(){return "シェイクスピア分子+2";}
    };
    export const                         シェイクスピア分子3:Item = new class extends Item{
        constructor(){super({uniqueName:"シェイクスピア分子3", info:"全員のHP+130",
                                type:ItemType.HP回復, rank:5, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>await itemHeal("HP", 130, user, target, this),
        })}
        toString(){return "シェイクスピア分子+3";}
    };
    export const                         シェイクスピア分子4:Item = new class extends Item{
        constructor(){super({uniqueName:"シェイクスピア分子4", info:"全員のHP+150",
                                type:ItemType.HP回復, rank:6, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>await itemHeal("HP", 150, user, target, this),
        })}
        toString(){return "シェイクスピア分子+4";}
    };
    export const                         シェイクスピア分子5:Item = new class extends Item{
        constructor(){super({uniqueName:"シェイクスピア分子5", info:"全員のHP+200",
                                type:ItemType.HP回復, rank:7, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>await itemHeal("HP", 200, user, target, this),
        })}
        toString(){return "シェイクスピア分子+5";}
    };
    export const                         シェイクスピア分子6:Item = new class extends Item{
        constructor(){super({uniqueName:"シェイクスピア分子6", info:"全員のHP+300",
                                type:ItemType.HP回復, rank:8, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>await itemHeal("HP", 300, user, target, this),
        })}
        toString(){return "シェイクスピア分子+6";}
    };
    export const                         シェイクスピア分子7:Item = new class extends Item{
        constructor(){super({uniqueName:"シェイクスピア分子7", info:"全員のHP+500",
                                type:ItemType.HP回復, rank:9, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>await itemHeal("HP", 500, user, target, this),
        })}
        toString(){return "シェイクスピア分子+7";}
    };
    export const                         じすたま:Item = new class extends Item{
        constructor(){super({uniqueName:"じすたま", info:"",
                                type:ItemType.HP回復, rank:12, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    await itemHeal("HP", target.prm(Prm.MAX_HP).total, user, target, this);
                                    await itemHeal("MP", target.prm(Prm.MAX_MP).total, user, target, this);
                                    await itemHeal("TP", target.prm(Prm.MAX_TP).total, user, target, this);
                                },
        })}
    };
    //-----------------------------------------------------------------
    //
    //MP回復
    //
    //-----------------------------------------------------------------
    export const                         蛍草:Item = new class extends Item{
        constructor(){super({uniqueName:"蛍草", info:"MP+1",
                                type:ItemType.MP回復, rank:0, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("MP", 1, user, target, this),
        })}
    };
    export const                         赤葉草:Item = new class extends Item{
        constructor(){super({uniqueName:"赤葉草", info:"MP+2",
                                type:ItemType.MP回復, rank:0, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("MP", 2, user, target, this),
        })}
    };
    export const                         蛍草のエキス:Item = new class extends Item{
        constructor(){super({uniqueName:"蛍草のエキス", info:"MP+3",
                                type:ItemType.MP回復, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("MP", 3, user, target, this),
        })}
    };
    export const                         赤い水:Item = new class extends Item{
        constructor(){super({uniqueName:"赤い水", info:"MP+4",
                                type:ItemType.MP回復, rank:3, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("MP", 4, user, target, this),
        })}
    };
    export const                         赤蛍草:Item = new class extends Item{
        constructor(){super({uniqueName:"赤蛍草", info:"MP+6",
                                type:ItemType.MP回復, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("MP", 6, user, target, this),
        })}
    };
    export const                         インパチェンス:Item = new class extends Item{
        constructor(){super({uniqueName:"インパチェンス", info:"MP+7",
                                type:ItemType.MP回復, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("MP", 7, user, target, this),
        })}
    };
    export const                         アウラレッドグラス:Item = new class extends Item{
        constructor(){super({uniqueName:"アウラレッドグラス", info:"MP+10",
                                type:ItemType.MP回復, rank:5, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("MP", 10, user, target, this),
        })}
    };
    export const                         紫死草:Item = new class extends Item{
        constructor(){super({uniqueName:"紫死草", info:"MP+20",
                                type:ItemType.MP回復, rank:6, drop:ItemDrop.BOX,
                                use:async(user,target)=>await itemHeal("MP", 20, user, target, this),
        })}
    };
    
    export const                         ヴァイスドラッグ:Item = new class extends Item{
        constructor(){super({uniqueName:"ヴァイスドラッグ", info:"HP+20 MP+2",
                                type:ItemType.MP回復, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    await itemHeal("HP", 20, user, target, this);
                                    await itemHeal("MP", 2, user, target, this);
                                },
        })}
    };
    export const                         ヴァイスドラッグ2:Item = new class extends Item{
        constructor(){super({uniqueName:"ヴァイスドラッグ2", info:"HP+30 MP+3",
                                type:ItemType.MP回復, rank:2, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    await itemHeal("HP", 30, user, target, this);
                                    await itemHeal("MP", 3, user, target, this);
                                },
        })}
        toString(){return "ヴァイスドラッグⅡ";}
    };
    export const                         ヴァイスドラッグ3:Item = new class extends Item{
        constructor(){super({uniqueName:"ヴァイスドラッグ3", info:"HP+50 MP+5",
                                type:ItemType.MP回復, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    await itemHeal("HP", 50, user, target, this);
                                    await itemHeal("MP", 5, user, target, this);
                                },
        })}
        toString(){return "ヴァイスドラッグⅢ";}
    };
    export const                         ヴァイスドラッグ4:Item = new class extends Item{
        constructor(){super({uniqueName:"ヴァイスドラッグ4", info:"HP+100 MP+10",
                                type:ItemType.MP回復, rank:6, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    await itemHeal("HP", 100, user, target, this);
                                    await itemHeal("MP", 10, user, target, this);
                                },
        })}
        toString(){return "ヴァイスドラッグⅣ";}
    };
    export const                         ヴァイスドラッグ5:Item = new class extends Item{
        constructor(){super({uniqueName:"ヴァイスドラッグ5", info:"HP+200 MP+20",
                                type:ItemType.MP回復, rank:7, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    await itemHeal("HP", 200, user, target, this);
                                    await itemHeal("MP", 20, user, target, this);
                                },
        })}
        toString(){return "ヴァイスドラッグⅤ";}
    };
    export const                         ヴァイスドラッグ6:Item = new class extends Item{
        constructor(){super({uniqueName:"ヴァイスドラッグ6", info:"HP+400 MP+40",
                                type:ItemType.MP回復, rank:8, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    await itemHeal("HP", 400, user, target, this);
                                    await itemHeal("MP", 40, user, target, this);
                                },
        })}
        toString(){return "ヴァイスドラッグⅥ";}
    };
    //-----------------------------------------------------------------
    //
    //-MP回復
    //状態回復
    //
    //-----------------------------------------------------------------
    export const                         血清:Item = new class extends Item{
        constructor(){super({uniqueName:"血清", info:"＜毒＞状態を解除する",
                                type:ItemType.状態, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>await removeCondition(target, Condition.毒),
        })}
    };
    export const                         目覚まし時計:Item = new class extends Item{
        constructor(){super({uniqueName:"目覚まし時計", info:"＜眠＞状態を解除する",
                                type:ItemType.状態, rank:2, drop:ItemDrop.BOX,
                                use:async(user,target)=>await removeCondition(target, Condition.眠),
        })}
    };
    export const                         レンチ:Item = new class extends Item{
        constructor(){super({uniqueName:"レンチ", info:"＜鎖＞状態を解除する",
                                type:ItemType.状態, rank:2, drop:ItemDrop.BOX,
                                use:async(user,target)=>await removeCondition(target, Condition.鎖),
        })}
    };
    export const                         石溶け水:Item = new class extends Item{
        constructor(){super({uniqueName:"石溶け水", info:"＜石＞状態を解除する",
                                type:ItemType.状態, rank:3, drop:ItemDrop.BOX | ItemDrop.LAKE,
                                use:async(user,target)=>await removeCondition(target, Condition.石),
        })}
    };
    export const                         ワクチン:Item = new class extends Item{
        constructor(){super({uniqueName:"ワクチン", info:"＜病気＞状態を解除する",
                                type:ItemType.状態, rank:3, drop:ItemDrop.BOX,
                                use:async(user,target)=>await removeCondition(target, Condition.病気),
        })}
    };
    export const                         発砲フィセル:Item = new class extends Item{
        constructor(){super({uniqueName:"発砲フィセル", info:"＜命中低下＞状態を解除する",
                                type:ItemType.状態, rank:3, drop:ItemDrop.BOX,
                                use:async(user,target)=>await removeCondition(target, Condition.命中低下),
        })}
    };
    export const                         攻撃力回復薬:Item = new class extends Item{
        constructor(){super({uniqueName:"攻撃力回復薬", info:"＜攻撃低下＞状態を解除する",
                                type:ItemType.状態, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>await removeCondition(target, Condition.攻撃低下),
        })}
    };
    export const                         防御力回復薬:Item = new class extends Item{
        constructor(){super({uniqueName:"防御力回復薬", info:"＜防御低下＞状態を解除する",
                                type:ItemType.状態, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>await removeCondition(target, Condition.防御低下),
        })}
    };
    export const                         精神安定剤:Item = new class extends Item{
        constructor(){super({uniqueName:"精神安定剤", info:"＜暴走＞状態を解除する",
                                type:ItemType.状態, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>await removeCondition(target, Condition.暴走),
        })}
    };
    export const                         空の涙:Item = new class extends Item{
        constructor(){super({uniqueName:"空の涙", info:"＜契約＞以外のLV1状態異常を解除する",
                                type:ItemType.状態, rank:5, drop:ItemDrop.BOX | ItemDrop.LAKE,
                                use:async(user,target)=>{
                                    const type = ConditionType.BAD_LV1;
                                    const c = target.getCondition(type);
                                    if(c !== Condition.契約){
                                        await removeCondition( target, type );
                                    }
                                },
        })}
    };
    export const                         地の涙:Item = new class extends Item{
        constructor(){super({uniqueName:"地の涙", info:"LV2状態異常を解除する",
                                type:ItemType.状態, rank:5, drop:ItemDrop.BOX | ItemDrop.LAKE,
                                use:async(user,target)=>{
                                    await removeCondition( target, ConditionType.BAD_LV2 );
                                },
        })}
    };
    export const                         妖精の涙:Item = new class extends Item{
        constructor(){super({uniqueName:"妖精の涙", info:"LV3状態異常を解除する",
                                type:ItemType.状態, rank:5, drop:ItemDrop.BOX | ItemDrop.LAKE,
                                use:async(user,target)=>{
                                    await removeCondition( target, ConditionType.BAD_LV3 );
                                },
        })}
    };
    export const                         パーフェクトパフォーマンス:Item = new class extends Item{
        constructor(){super({uniqueName:"パーフェクトパフォーマンス", info:"＜暴走・契約＞以外の強化・弱体状態を解除する",
                                type:ItemType.状態, rank:6, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    for(const type of ConditionType.values){
                                        const c = target.getCondition(type);
                                        if(c !== Condition.暴走 && c !== Condition.契約){
                                            await removeCondition(target, type);
                                        }
                                    }
                                },
        })}
    };
    export const                         天使の涙:Item = new class extends Item{
        constructor(){super({uniqueName:"天使の涙", info:"＜契約＞以外の弱体状態を解除する",
                                type:ItemType.状態, rank:6, drop:ItemDrop.BOX | ItemDrop.LAKE,
                                use:async(user,target)=>{
                                    for(const type of ConditionType.badConditions()){
                                        const c = target.getCondition(type);
                                        if(c !== Condition.契約){
                                            await removeCondition(target, type);
                                        }
                                    }
                                },
        })}
    };
    export const                         解除コードのメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"解除コードのメモ", info:"＜暴走＞以外の強化状態を解除する",
                                type:ItemType.状態, rank:6, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    for(const type of ConditionType.goodConditions()){
                                        const c = target.getCondition(type);
                                        if(c !== Condition.暴走){
                                            await removeCondition(target, type);
                                        }
                                    }
                                },
        })}
    };
    //-----------------------------------------------------------------
    //
    //-状態回復
    //強化付与
    //
    //-----------------------------------------------------------------
    export const                         火の尻尾:Item = new class extends Item{
        constructor(){super({uniqueName:"火の尻尾", info:"一体を＜練＞状態にする",
                                type:ItemType.状態, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.up.play();
                                    Unit.setCondition(target, Condition.練, 1);
                                },
        })}
    };
    export const                         燃える髪:Item = new class extends Item{
        constructor(){super({uniqueName:"燃える髪", info:"一体を＜練2＞状態にする",
                                type:ItemType.状態, rank:3, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.up.play();
                                    Unit.setCondition(target, Condition.練, 2);
                                },
        })}
    };
    export const                         赤き髪の目:Item = new class extends Item{
        constructor(){super({uniqueName:"赤き髪の目", info:"一体を＜練3＞状態にする",
                                type:ItemType.状態, rank:5, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.up.play();
                                    Unit.setCondition(target, Condition.練, 3);
                                },
        })}
    };
    export const                         ジルの血:Item = new class extends Item{
        constructor(){super({uniqueName:"ジルの血", info:"一体を＜練4＞状態にする",
                                type:ItemType.状態, rank:7, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.up.play();
                                    Unit.setCondition(target, Condition.練, 4);
                                },
        })}
    };
    export const                         ゆかちゃん保険:Item = new class extends Item{
        constructor(){super({uniqueName:"ゆかちゃん保険", info:"一体を＜約1＞状態にする",
                                type:ItemType.状態, rank:7, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.up.play();
                                    Unit.setCondition(target, Condition.約束, 1);
                                },
        })}
    };
    export const                         天使のファンデュ:Item = new class extends Item{
        constructor(){super({uniqueName:"天使のファンデュ", info:"味方全体を＜癒10＞状態にする",
                                type:ItemType.状態, rank:5, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>{
                                    Sound.up.play();
                                    FX_Buff( target.imgCenter );

                                    Unit.setCondition( target, Condition.癒, 10 );
                                },
        })}
    };
    export const                         悪魔のファンデュ:Item = new class extends Item{
        constructor(){super({uniqueName:"悪魔のファンデュ", info:"味方全体を＜体↑10＞(行動開始時最大HP+10%)状態にする",
                                type:ItemType.状態, rank:5, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>{
                                    Sound.up.play();
                                    FX_Buff( target.imgCenter );

                                    Unit.setCondition( target, Condition.体力上昇, 10 );
                                },
        })}
    };
    export const                         恒星型リュスティック:Item = new class extends Item{
        constructor(){super({uniqueName:"恒星型リュスティック", info:"戦闘時、味方全体の最大HP・HPを50増加させる",
                                type:ItemType.状態, rank:5, drop:ItemDrop.BOX, targetings:["all","friendOnly"],
                                use:async(user,target)=>{
                                    Sound.up.play();
                                    FX_Buff( target.imgCenter );

                                    const value = 50;
                                    target.prm(Prm.MAX_HP).battle += value;
                                    target.hp += value;
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    //-----------------------------------------------------------------
    //
    //-強化付与
    //弱体付与
    //
    //-----------------------------------------------------------------
    export const                         ネクロマンス法:Item = new class extends Item{
        constructor(){super({uniqueName:"ネクロマンス法", info:"一体の最大HPを10%消滅させる(最大99999)",
                                type:ItemType.状態, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>{


                                    const lim = 99999;
                                    let value = target.prm(Prm.MAX_HP).total * 0.1;
                                    if(value > lim){value = lim;}

                                    target.prm(Prm.MAX_HP).battle -= value;
                                    
                                    Sound.DARK.play();
                                    Util.msg.set(`${target.name}の最大HPが${value|0}消滅した`);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         ネクロマンス真法:Item = new class extends Item{
        constructor(){super({uniqueName:"ネクロマンス真法", info:"一体の最大HPを20%消滅させる(最大99999)",
                                type:ItemType.状態, rank:5, drop:ItemDrop.BOX,
                                use:async(user,target)=>{


                                    const lim = 99999;
                                    let value = target.prm(Prm.MAX_HP).total * 0.2;
                                    if(value > lim){value = lim;}

                                    target.prm(Prm.MAX_HP).battle -= value;
                                    
                                    Sound.DARK.play();
                                    Util.msg.set(`${target.name}の最大HPが${value|0}消滅した`);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         八ノ地教裏禁呪:Item = new class extends Item{
        constructor(){super({uniqueName:"八ノ地教裏禁呪", info:"一体の最大HPを33%消滅させる(最大99999)",
                                type:ItemType.状態, rank:6, drop:ItemDrop.BOX,
                                use:async(user,target)=>{


                                    const lim = 99999;
                                    let value = target.prm(Prm.MAX_HP).total * 0.33;
                                    if(value > lim){value = lim;}

                                    target.prm(Prm.MAX_HP).battle -= value;
                                    
                                    Sound.DARK.play();
                                    Util.msg.set(`${target.name}の最大HPが${value|0}消滅した`);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         エリの願い:Item = new class extends Item{
        constructor(){super({uniqueName:"エリの願い", info:"一体の最大HPを50%消滅させる(最大99999)",
                                type:ItemType.状態, rank:7, drop:ItemDrop.BOX,
                                use:async(user,target)=>{


                                    const lim = 99999;
                                    let value = target.prm(Prm.MAX_HP).total * 0.5;
                                    if(value > lim){value = lim;}

                                    target.prm(Prm.MAX_HP).battle -= value;
                                    
                                    Sound.DARK.play();
                                    Util.msg.set(`${target.name}の最大HPが${value|0}消滅した`);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         子守歌:Item = new class extends Item{
        constructor(){super({uniqueName:"子守歌", info:"一体を50%の確率で＜眠2＞状態にする",
                                type:ItemType.状態, rank:3, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    if(Math.random() < 0.5){
                                        Unit.setCondition( target, Condition.眠, 2 );
                                    }else{
                                        Util.msg.set("MISS");
                                    }
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    //-----------------------------------------------------------------
    //
    //-弱体付与
    //ダメージ
    //
    //-----------------------------------------------------------------
    export const                         呪素:Item = new class extends Item{
        constructor(){super({uniqueName:"呪素", info:"戦闘時、10ダメージを与える",
                                type:ItemType.ダメージ, rank:0, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.bom.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:10,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         呪:Item = new class extends Item{
        constructor(){super({uniqueName:"呪", info:"戦闘時、50ダメージを与える",
                                type:ItemType.ダメージ, rank:1, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.bom.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:50,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         呪詛:Item = new class extends Item{
        constructor(){super({uniqueName:"呪詛", info:"戦闘時、150ダメージを与える",
                                type:ItemType.ダメージ, rank:2, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.bom.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:150,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         旧式ミサイル:Item = new class extends Item{
        constructor(){super({uniqueName:"旧式ミサイル", info:"戦闘時、250ダメージを与える",
                                type:ItemType.ダメージ, rank:3, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.bom2.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:250,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         帝国式ミサイル:Item = new class extends Item{
        constructor(){super({uniqueName:"帝国式ミサイル", info:"戦闘時、350ダメージを与える",
                                type:ItemType.ダメージ, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.bom2.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:350,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         ハル式ミサイル:Item = new class extends Item{
        constructor(){super({uniqueName:"ハル式ミサイル", info:"戦闘時、450ダメージを与える",
                                type:ItemType.ダメージ, rank:5, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.bom2.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:450,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         バスターミサイル:Item = new class extends Item{
        constructor(){super({uniqueName:"バスターミサイル", info:"戦闘時、1000ダメージを与える",
                                type:ItemType.ダメージ, rank:7, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Sound.bom2.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:1000,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         鬼火:Item = new class extends Item{
        constructor(){super({uniqueName:"鬼火", info:"戦闘時、敵全体に10ダメージを与える",
                                type:ItemType.ダメージ, rank:0, drop:ItemDrop.BOX, targetings:["all"],
                                use:async(user,target)=>{
                                    Sound.bom.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:10,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         ウィルスα:Item = new class extends Item{
        constructor(){super({uniqueName:"ウィルスα", info:"戦闘時、敵全体に25ダメージを与える",
                                type:ItemType.ダメージ, rank:0, drop:ItemDrop.BOX, targetings:["all"],
                                use:async(user,target)=>{
                                    Sound.bom.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:25,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         手榴弾:Item = new class extends Item{
        constructor(){super({uniqueName:"手榴弾", info:"戦闘時、敵全体に100ダメージを与える",
                                type:ItemType.ダメージ, rank:1, drop:ItemDrop.BOX, targetings:["all"],
                                use:async(user,target)=>{
                                    Sound.bom2.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:100,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         鬼火のダイナマイト:Item = new class extends Item{
        constructor(){super({uniqueName:"鬼火のダイナマイト", info:"戦闘時、敵全体に200ダメージを与える",
                                type:ItemType.ダメージ, rank:3, drop:ItemDrop.BOX, targetings:["all"],
                                use:async(user,target)=>{
                                    Sound.bom2.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:200,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         セクシーダイナマイツ:Item = new class extends Item{
        constructor(){super({uniqueName:"セクシーダイナマイツ", info:"戦闘時、敵全体に1000ダメージを与える",
                                type:ItemType.ダメージ, rank:8, drop:ItemDrop.BOX, targetings:["all"],
                                use:async(user,target)=>{
                                    Sound.bom2.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:1000,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    export const                         バスターマシン3号:Item = new class extends Item{
        constructor(){super({uniqueName:"バスターマシン3号", info:"戦闘時、敵味方全体に30000ダメージを与える",
                                type:ItemType.ダメージ, rank:10, drop:ItemDrop.BOX, targetings:["all","withFriend"],
                                use:async(user,target)=>{
                                    Sound.bom2.play();
                                    await new Dmg({
                                        attacker:user,
                                        target:target,
                                        absPow:3000,
                                        canCounter:false,
                                    }).run();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.BATTLE;}
    };
    //-----------------------------------------------------------------
    //
    //ダンジョン
    //
    //-----------------------------------------------------------------
    export const                         動かない映写機:Item = new class extends Item{
        constructor(){super({uniqueName:"動かない映写機", info:"壊れている...",
                                type:ItemType.ダンジョン, rank:10, drop:ItemDrop.NO,
                                consumable:true,
                                use:async(user,target)=>{
                                    if(!Util.dungeonBookMark || Util.dungeonBookMark !== Dungeon.now){return;}
                                    //-------------------------
                                    Dungeon.auNow = Dungeon.now.au - 1;
                                    Util.msg.set("ダンジョンの最深部に移動した");
                                    //-------------------------
                                },
        })}
        get info(){return (Mix.動く映写機.count > 0 && Util.dungeonBookMark) ? `[${Util.dungeonBookMark}]の最深部に移動する` : this.args.info;}
        canUse(user:Unit, targets:Unit[]){
            if(!super.canUse( user, targets )){return false;}
            if(SceneType.now !== SceneType.DUNGEON){return false;}
            if(Mix.動く映写機.count === 0){return false;}
            if(Util.dungeonBookMark !== Dungeon.now){return false;}
            return true;
        }
    };
    export const                         脱出ポッド:Item = new class extends Item{
        constructor(){super({uniqueName:"脱出ポッド", info:"ダンジョンから脱出する。なくならない。",
                                type:ItemType.ダンジョン, rank:10, drop:ItemDrop.NO,
                                consumable:true,
                                use:async(user,target)=>{
                                    Scene.load( DungeonScene.ins );
                                    await DungeonEvent.ESCAPE_DUNGEON.happen();
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.DUNGEON;}
    };
    export const                         侍プリッツ迅速:Item = new class extends Item{
        constructor(){super({uniqueName:"侍プリッツ迅速", info:"10AU進む",
                                type:ItemType.ダンジョン, rank:2, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Dungeon.auNow += 10;
                                    if(Dungeon.auNow > Dungeon.now.au){Dungeon.auNow = Dungeon.now.au;}
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.DUNGEON;}
        toString(){return "侍プリッツ・迅速";}
    };
    export const                         侍プリッツ神速一歩手前:Item = new class extends Item{
        constructor(){super({uniqueName:"侍プリッツ神速一歩手前", info:"20AU進む",
                                type:ItemType.ダンジョン, rank:3, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Dungeon.auNow += 20;
                                    if(Dungeon.auNow > Dungeon.now.au){Dungeon.auNow = Dungeon.now.au;}
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.DUNGEON;}
        toString(){return "侍プリッツ・神速一歩手前";}
    };
    export const                         侍プリッツ神速:Item = new class extends Item{
        constructor(){super({uniqueName:"侍プリッツ神速", info:"30AU進む",
                                type:ItemType.ダンジョン, rank:4, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Dungeon.auNow += 30;
                                    if(Dungeon.auNow > Dungeon.now.au){Dungeon.auNow = Dungeon.now.au;}
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.DUNGEON;}
        toString(){return "侍プリッツ・神速";}
    };
    export const                         侍プリッツ神速を超えて:Item = new class extends Item{
        constructor(){super({uniqueName:"侍プリッツ神速を超えて", info:"40AU進む",
                                type:ItemType.ダンジョン, rank:5, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    Dungeon.auNow += 40;
                                    if(Dungeon.auNow > Dungeon.now.au){Dungeon.auNow = Dungeon.now.au;}
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now === SceneType.DUNGEON;}
        toString(){return "侍プリッツ・神速を超えて";}
    };
    export const                         釣り竿:Item = new class extends Item{
        constructor(){super({uniqueName:"釣り竿", info:"ダンジョン内の湖で釣りができるようになる",
                                type:ItemType.ダンジョン, rank:11, drop:ItemDrop.NO,
                                consumable:true,
        })}
    };
    export const                         つるはし:Item = new class extends Item{
        constructor(){super({uniqueName:"つるはし", info:"ダンジョン内の地層で発掘ができるようになる",
                                type:ItemType.ダンジョン, rank:11, drop:ItemDrop.NO,
                                consumable:true,
        })}
    };
    //-----------------------------------------------------------------
    //
    //弾
    //
    //-----------------------------------------------------------------
    export const                         降雨の矢:Item = new class extends Item{
        constructor(){super({uniqueName:"降雨の矢", info:"ナーガに使用",
                                type:ItemType.弾, rank:7, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         夜叉の矢:Item = new class extends Item{
        constructor(){super({uniqueName:"夜叉の矢", info:"ヤクシャに使用",
                                type:ItemType.弾, rank:8, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         金翅鳥の矢:Item = new class extends Item{
        constructor(){super({uniqueName:"金翅鳥の矢", info:"ガルダに使用",
                                type:ItemType.弾, rank:9, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         歌舞の矢:Item = new class extends Item{
        constructor(){super({uniqueName:"歌舞の矢", info:"キンナラに使用",
                                type:ItemType.弾, rank:9, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         月夜の矢:Item = new class extends Item{
        constructor(){super({uniqueName:"月夜の矢", info:"キャンドラに使用",
                                type:ItemType.弾, rank:9, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         手裏剣:Item = new class extends Item{
        constructor(){super({uniqueName:"手裏剣", info:"手裏剣に使用",
                                type:ItemType.弾, rank:10, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         バッテリー:Item = new class extends Item{
        constructor(){super({uniqueName:"バッテリー", info:"レーザーに使用",
                                type:ItemType.弾, rank:11, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         高出力バッテリー:Item = new class extends Item{
        constructor(){super({uniqueName:"高出力バッテリー", info:"コールドレーザーに使用",
                                type:ItemType.弾, rank:11, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         VIRGINデルタ:Item = new class extends Item{
        constructor(){super({uniqueName:"VIRGINデルタ", info:"VIRGIN-⊿に使用",
                                type:ItemType.弾, rank:11, drop:ItemDrop.NO,
                                consumable:true})}
        toString(){return "VIRGIN-⊿";}
    };
    export const                         絵画母なる星の緑の丘:Item = new class extends Item{
        constructor(){super({uniqueName:"絵画母なる星の緑の丘", info:"ドゥエルガルに使用",
                                type:ItemType.弾, rank:12, drop:ItemDrop.NO,
                                consumable:true})}
        toString(){return "絵画『母なる星の緑の丘』"}
    };
    export const                         絵画シェイクスピアの涙:Item = new class extends Item{
        constructor(){super({uniqueName:"絵画シェイクスピアの涙", info:"ネーレイスに使用",
                                type:ItemType.弾, rank:12, drop:ItemDrop.NO,
                                consumable:true})}
        toString(){return "絵画『シェイクスピアの涙』"}
    };
    export const                         絵画彼女の髪:Item = new class extends Item{
        constructor(){super({uniqueName:"絵画彼女の髪", info:"ヴァルナに使用",
                                type:ItemType.弾, rank:12, drop:ItemDrop.NO,
                                consumable:true})}
        toString(){return "絵画『彼女の髪』"}
    };
    export const                         絵画我が情熱の日:Item = new class extends Item{
        constructor(){super({uniqueName:"絵画我が情熱の日", info:"イリューガーに使用",
                                type:ItemType.弾, rank:12, drop:ItemDrop.NO,
                                consumable:true})}
        toString(){return "絵画『我が情熱の日』"}
    };
    export const                         聖水:Item = new class extends Item{
        constructor(){super({uniqueName:"聖水", info:"ガブリエル・ラファエル・ウリエルに使用",
                                type:ItemType.弾, rank:9, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         Dフラスコ:Item = new class extends Item{
        constructor(){super({uniqueName:"Dフラスコ", info:"死体除去に使用",
                                type:ItemType.弾, rank:8, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         マーメイド:Item = new class extends Item{
        constructor(){super({uniqueName:"マーメイド", info:"マーメイドに使用",
                                type:ItemType.弾, rank:7, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         ホムンクルス:Item = new class extends Item{
        constructor(){super({uniqueName:"ホムンクルス", info:"ホムンクルスに使用",
                                type:ItemType.弾, rank:7, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         フランケンシュタイン:Item = new class extends Item{
        constructor(){super({uniqueName:"フランケンシュタイン", info:"フランケンシュタインに使用",
                                type:ItemType.弾, rank:7, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         魔弾:Item = new class extends Item{
        constructor(){super({uniqueName:"魔弾", info:"羊飼いの銃に使用",
                                type:ItemType.弾, rank:6, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         砲弾:Item = new class extends Item{
        constructor(){super({uniqueName:"砲弾", info:"大砲に使用",
                                type:ItemType.弾, rank:6, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         霊弾:Item = new class extends Item{
        constructor(){super({uniqueName:"霊弾", info:"-霊砲-に使用",
                                type:ItemType.弾, rank:6, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         パワータンク:Item = new class extends Item{
        constructor(){super({uniqueName:"パワータンク", info:"バベルに使用",
                                type:ItemType.弾, rank:6, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         林式ミサイル:Item = new class extends Item{
        constructor(){super({uniqueName:"林式ミサイル", info:"林式ミサイルうに使用",
                                type:ItemType.弾, rank:5, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         エボリ製悪魔のミサイル:Item = new class extends Item{
        constructor(){super({uniqueName:"エボリ製悪魔のミサイル", info:"エボリ製悪魔のミサイルに使用",
                                type:ItemType.弾, rank:5, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         メフィスト製悪魔のミサイル:Item = new class extends Item{
        constructor(){super({uniqueName:"メフィスト製悪魔のミサイル", info:"メフィスト製悪魔のミサイルに使用",
                                type:ItemType.弾, rank:5, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         原子爆弾:Item = new class extends Item{
        constructor(){super({uniqueName:"原子爆弾", info:"原子爆弾に使用",
                                type:ItemType.弾, rank:11, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         水素爆弾:Item = new class extends Item{
        constructor(){super({uniqueName:"水素爆弾", info:"水素爆弾に使用",
                                type:ItemType.弾, rank:11, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         重力子爆弾:Item = new class extends Item{
        constructor(){super({uniqueName:"重力子爆弾", info:"重力子爆弾に使用",
                                type:ItemType.弾, rank:11, drop:ItemDrop.NO,
                                consumable:true})}
    };
    export const                         lucifer製量子爆弾:Item = new class extends Item{
        constructor(){super({uniqueName:"lucifer製量子爆弾", info:"lucifer製量子爆弾に使用",
                                type:ItemType.弾, rank:11, drop:ItemDrop.NO,
                                consumable:true})}
    };
    //-----------------------------------------------------------------
    //
    //鍵
    //
    //-----------------------------------------------------------------
    export const                         丸い鍵:Item = new class extends Item{
        constructor(){super({uniqueName:"丸い鍵", info:"丸い箱を開ける",
                                type:ItemType.鍵, rank:2, drop:ItemDrop.BOX})}
    };
    export const                         三角鍵:Item = new class extends Item{
        constructor(){super({uniqueName:"三角鍵", info:"三角形の箱を開ける",
                                type:ItemType.鍵, rank:3, drop:ItemDrop.BOX})}
    };
    export const                         トゲトゲ鍵:Item = new class extends Item{
        constructor(){super({uniqueName:"トゲトゲ鍵", info:"トゲトゲの箱を開ける",
                                type:ItemType.鍵, rank:4, drop:ItemDrop.BOX})}
    };
    export const                         ツルツル鍵:Item = new class extends Item{
        constructor(){super({uniqueName:"ツルツル鍵", info:"ツルツルした箱を開ける",
                                type:ItemType.鍵, rank:5, drop:ItemDrop.BOX})}
    };
    export const                         ヘンテコ鍵:Item = new class extends Item{
        constructor(){super({uniqueName:"ヘンテコ鍵", info:"ヘンテコな箱を開ける",
                                type:ItemType.鍵, rank:6, drop:ItemDrop.BOX})}
    };
    //-----------------------------------------------------------------
    //
    //ドーピング
    //
    //-----------------------------------------------------------------
    export const                         いざなみの命:Item = new class extends Item{
        constructor(){super({uniqueName:"いざなみの命", info:"最大HP+2",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.MAX_HP).base += 2;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の最大HP+2`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         林ライス:Item = new class extends Item{
        constructor(){super({uniqueName:"林ライス", info:"最大HP+3",
                                type:ItemType.ドーピング, rank:12, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.MAX_HP).base += 3;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の最大HP+3`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         おおげつ姫:Item = new class extends Item{
        constructor(){super({uniqueName:"おおげつ姫", info:"最大MP+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.MAX_MP).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の最大MP+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         アラハバキ神:Item = new class extends Item{
        constructor(){super({uniqueName:"アラハバキ神", info:"最大TP+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.MAX_TP).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の最大TP+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         この花咲くや姫:Item = new class extends Item{
        constructor(){super({uniqueName:"この花咲くや姫", info:"力+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.STR).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の力+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         つくよみの命:Item = new class extends Item{
        constructor(){super({uniqueName:"つくよみの命", info:"魔+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.MAG).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の魔+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         よもつおお神:Item = new class extends Item{
        constructor(){super({uniqueName:"よもつおお神", info:"光+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.LIG).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の光+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         わたつみの神:Item = new class extends Item{
        constructor(){super({uniqueName:"わたつみの神", info:"闇+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.DRK).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の闇+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         へつなぎさびこの神:Item = new class extends Item{
        constructor(){super({uniqueName:"へつなぎさびこの神", info:"鎖+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.CHN).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の鎖+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         ほのかぐつちの神:Item = new class extends Item{
        constructor(){super({uniqueName:"ほのかぐつちの神", info:"過+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.PST).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の過+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         たけみかづちの命:Item = new class extends Item{
        constructor(){super({uniqueName:"たけみかづちの命", info:"銃+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.GUN).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の銃+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         すさのおの命:Item = new class extends Item{
        constructor(){super({uniqueName:"すさのおの命", info:"弓+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.prm(Prm.ARR).base += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}の弓+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         ささやかな贈り物:Item = new class extends Item{
        constructor(){super({uniqueName:"ささやかな贈り物", info:"BP+1",
                                type:ItemType.ドーピング, rank:10, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    target.bp += 1;
                                    Sound.bpup.play();
                                    FX_Str(Font.def, `${target.name}のBP+1`, Point.CENTER, Color.WHITE);
                                },
        })}
        canUse(user:Unit, targets:Unit[]){return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;}
    };
    export const                         列なりの思い出:Item = new class extends Item{
        constructor(){super({uniqueName:"列なりの思い出", info:"Lv-1",
                                type:ItemType.ドーピング, rank:12, drop:ItemDrop.BOX,
                                use:async(user,target)=>{
                                    if(target.prm(Prm.LV).base > 0){
                                        target.prm(Prm.LV).base--;
                                        Sound.bpup.play();
                                        FX_Str(Font.def, `${target.name}のLv-1`, Point.CENTER, Color.WHITE);
                                    }
                                },
        })}
        canUse(user:Unit, targets:Unit[]){
            for(const t of targets){
                if(t.prm(Prm.LV).base <= 0){return false;}
            }
            return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;
        }
    };

    const createMaborosi = (uniqueName:string, rank:number, value:number)=>{
        return new class extends Item{
            constructor(){super({uniqueName:uniqueName, info:"対象の経験値+"+value,
                                    type:ItemType.ドーピング, rank:rank, drop:ItemDrop.BOX,
                                    use:async(user,target)=>{
                                        Sound.exp.play();
                                        target.exp += value;
                                    },
            })}
            canUse(user:Unit, targets:Unit[]){
                for(const t of targets){
                    if(t instanceof PUnit && t.exp >= t.getNextLvExp()){return false;}
                }
                return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;
            }
        };
    };
    export const 灰色のまぼろし = createMaborosi(
                "灰色のまぼろし", /*rank*/0, /*value*/30);
    export const 黒色のまぼろし = createMaborosi(
                "黒色のまぼろし", /*rank*/2, /*value*/50);
    export const 白色のまぼろし = createMaborosi(
                "白色のまぼろし", /*rank*/4, /*value*/70);
    export const 金色のまぼろし = createMaborosi(
                "金色のまぼろし", /*rank*/6, /*value*/90);
    export const 緋色のまぼろし = createMaborosi(
                "緋色のまぼろし", /*rank*/8, /*value*/110);

    export const                         アーク素子:Item = new class extends Item{
        constructor(){super({uniqueName:"アーク素子", info:"",
                                type:ItemType.ドーピング, rank:1, drop:ItemDrop.BOX,
        })}
    };


    const createBlood = (uniqueName:string, jobName:string, job:()=>Job)=>{
        return new class extends Item{
            constructor(){super({uniqueName:uniqueName, info:jobName+"に転職できるようになる",
                                    type:ItemType.ドーピング, rank:6, drop:ItemDrop.NO,
                                    use:async(user,target)=>{
                                        if(target instanceof PUnit){
                                            Sound.exp.play();
                                            target.setJobLv(job(), 1);
                                        }
                                    },
            })}
            canUse(user:Unit, targets:Unit[]){
                for(const t of targets){
                    if(!(t instanceof PUnit && t.getJobLv(job()) === 0)){return false;}
                }
                return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;
            }
        };
    };
    export const ヴァンパイアの血 = createBlood(
                "ヴァンパイアの血", "ヴァンパイア",()=>Job.ヴァンパイア);
    export const 霊術戦士の血 = createBlood(
                "霊術戦士の血",     "霊術戦士",    ()=>Job.霊術戦士);
    export const ホークマンの血 = createBlood(
                "ホークマンの血",   "ホークマン",  ()=>Job.ホークマン);
    export const 精霊使いの血 = createBlood(
                "精霊使いの血",     "精霊使い",    ()=>Job.精霊使い);
    export const 鬼の血 = createBlood(
                "鬼の血",           "鬼",          ()=>Job.鬼);
    export const 月弓子の血 = createBlood(
                "月弓子の血",       "月弓子",      ()=>Job.月弓子);
    //-----------------------------------------------------------------
    //
    //書
    //
    //-----------------------------------------------------------------
    const createAddTecNumBook = (uniqueName:string, tecNum:number)=>{
        return new class extends Item{
            constructor(){super({uniqueName:uniqueName, info:`技のセット可能数を${tecNum}に増やす`,
                                    type:ItemType.書, rank:13, drop:ItemDrop.NO,
                                    use:async(user,target)=>{
                                        target.tecs.push( Tec.empty );
                                        FX_Str(Font.def, `${target.name}の技セット可能数が${tecNum}になった`, Point.CENTER, Color.WHITE);
                                    },
            })}
            canUse(user:Unit, targets:Unit[]){
                for(const u of targets){
                    if(!(u instanceof PUnit && u.tecs.length === tecNum-1) ){return false;}
                }
                return super.canUse( user, targets ) && SceneType.now !== SceneType.BATTLE;
            }
        };
    };
    export const                         兵法指南の書:Item = 
                    createAddTecNumBook("兵法指南の書", 6);
    export const                         五輪の書:Item = 
                    createAddTecNumBook("五輪の書", 7);
    // export const                         天地創造の書:Item = 
    //                 createAddTecNumBook("天地創造の書", 8);
    //-----------------------------------------------------------------
    //
    //メモ
    //
    //-----------------------------------------------------------------
    export const                         消耗品のメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"消耗品のメモ", info:"「ごく一部の消耗品はダンジョンに入る度に補充される。脱出ポッドなどがそれに該当する」と書かれている", 
                                type:ItemType.メモ, rank:0, drop:ItemDrop.BOX, numLimit:1})}
    };
    export const                         夏のメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"夏のメモ", info:"「夏はいつ終わるの？」と書かれている", 
                                type:ItemType.メモ, rank:1, drop:ItemDrop.BOX, numLimit:1})}
    };
    export const                         冬のメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"冬のメモ", info:"「いつまでもこの冬が続けばいいのに」と書かれている", 
                                type:ItemType.メモ, rank:7, drop:ItemDrop.BOX, numLimit:1})}
    };
    export const                         EPのメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"EPのメモ", info:"「EPはダンジョンに侵入する時に回復する。なので、EPを消費する技は基本的に一度の侵入で一回しか使えない」と書かれている", 
                                type:ItemType.メモ, rank:1, drop:ItemDrop.BOX, numLimit:1})}
    };
    export const                         SPのメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"SPのメモ", info:"「SPは戦闘開始時に回復する。なので、SPを消費する技は基本的に一度の戦闘で一回しか使えない」と書かれている", 
                                type:ItemType.メモ, rank:5, drop:ItemDrop.BOX, numLimit:1})}
    };
    export const                         HP至上主義のメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"HP至上主義のメモ", info:"「とりあえずHPを上げれば間違いはない。俺は詳しいんだ」と書かれている", 
                                type:ItemType.メモ, rank:0, drop:ItemDrop.BOX, numLimit:1})}
    };
    export const                         HP懐疑主義のメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"HP懐疑主義のメモ", info:"「何も考えずにHPを上げるのは危険だ。騙されないぞ」と書かれている", 
                                type:ItemType.メモ, rank:1, drop:ItemDrop.BOX, numLimit:1})}
    };
    export const                         ジスカルドのメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"ジスカルドのメモ", info:"「じすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさんじすさん」と書かれている", 
                                type:ItemType.メモ, rank:9, drop:ItemDrop.BOX, numLimit:1})}
    };
    export const                         練盾のメモ:Item = new class extends Item{
        constructor(){super({uniqueName:"練盾のメモ", info:"「＜練＞状態は格闘・神格・鎖術・銃・弓攻撃を強化する。＜盾＞状態はそれらを軽減する」と書かれている", 
                                type:ItemType.メモ, rank:1, drop:ItemDrop.BOX, numLimit:1})}
        toString(){return "＜練＞＜盾＞のメモ";}
    };
    export const                         合成許可証:Item = new class extends Item{
        constructor(){super({uniqueName:"合成許可証", info:"「合成してもいいよ」と書かれている", 
                                type:ItemType.メモ, rank:10, drop:ItemDrop.NO, numLimit:1})}
    };
    export const                         リュサンデールの絵筆:Item = new class extends Item{
        constructor(){super({uniqueName:"リュサンデールの絵筆", info:"これでぬってあげるわね、すごく！", 
                                type:ItemType.メモ, rank:10, drop:ItemDrop.NO, numLimit:1})}
    };
    export const                         レレシピ:Item = new class extends Item{
        constructor(){super({uniqueName:"レレシピ", info:"予感の街・レに伝わる秘伝の装備レシピ", 
                                type:ItemType.メモ, rank:8, drop:ItemDrop.NO, numLimit:1})}
    };
    export const                         イスレシピ:Item = new class extends Item{
        constructor(){super({uniqueName:"イスレシピ", info:"水の都・イスに伝わる秘伝の装備レシピ", 
                                type:ItemType.メモ, rank:8, drop:ItemDrop.NO, numLimit:1})}
    };
    // export const                         パーティースキル取り扱い許可証:Item = new class extends Item{
    //     constructor(){super({uniqueName:"パーティースキル取り扱い許可証", info:"パーティースキルが解放される", 
    //                             type:ItemType.メモ, rank:10, drop:ItemDrop.NO, numLimit:1})}
    // };
    //-----------------------------------------------------------------
    //
    //素材
    //
    //-----------------------------------------------------------------
    export const                         石:Item = new class extends Item{
        constructor(){super({uniqueName:"石", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX})}
    };
    export const                         かんな:Item = new class extends Item{
        constructor(){super({uniqueName:"かんな", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX})}
    };
    export const                         少女の心を持ったおっさん:Item = new class extends Item{
        constructor(){super({uniqueName:"少女の心を持ったおっさん", info:"いつもプリキュアの話をしている",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX})}
    };
    export const                         草:Item = new class extends Item{
        constructor(){super({uniqueName:"草", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX})}
    };
    export const                         肉:Item = new class extends Item{
        constructor(){super({uniqueName:"肉", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX})}
    };
    export const                         バッタ:Item = new class extends Item{
        constructor(){super({uniqueName:"バッタ", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX})}
    };
    export const                         たんぽぽ:Item = new class extends Item{
        constructor(){super({uniqueName:"たんぽぽ", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX})}
    };
    export const                         トマト:Item = new class extends Item{
        constructor(){super({uniqueName:"トマト", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX})}
    };
    export const                         エレタクレヨン:Item = new class extends Item{
        constructor(){super({uniqueName:"エレタクレヨン", info:"おえかきしようね",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX})}
        toString(){return "エレ・タ・クレヨン";}
    };
    export const                         ファーストキス:Item = new class extends Item{
        constructor(){super({uniqueName:"ファーストキス", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX})}
    };
    export const                         にじゅうよん:Item = new class extends Item{
        constructor(){super({uniqueName:"にじゅうよん", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX})}
        toString(){return "24";}
    };
    export const                         退魔の十字架:Item = new class extends Item{
        constructor(){super({uniqueName:"退魔の十字架", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX})}
    };
    export const                         モーター:Item = new class extends Item{
        constructor(){super({uniqueName:"モーター", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX})}
    };
    export const                         エレタの絵の具:Item = new class extends Item{
        constructor(){super({uniqueName:"エレタの絵の具", info:"ぬりぬりしようね",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX})}
        toString(){return "エレ・タの絵の具";}
    };
    export const                         小説38万キロの恋:Item = new class extends Item{
        constructor(){super({uniqueName:"小説38万キロの恋", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX})}
        toString(){return "小説『３８万キロの恋』";}
    };
    export const                         小説おやすみコネコ:Item = new class extends Item{
        constructor(){super({uniqueName:"小説おやすみコネコ", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX})}
        toString(){return "小説『おやすみ、コネコ』";}
    };
    export const                         うんち:Item = new class extends Item{
        constructor(){super({uniqueName:"うんち", info:"うんち",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX})}
    };
    export const                         太陽の欠片:Item = new class extends Item{
        constructor(){super({uniqueName:"太陽の欠片", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX})}
    };
    export const                         血粉末:Item = new class extends Item{
        constructor(){super({uniqueName:"血粉末", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX})}
    };
    export const                         思い出そのもの:Item = new class extends Item{
        constructor(){super({uniqueName:"思い出そのもの", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX})}
    };
    export const                         アポーちゃんの林檎:Item = new class extends Item{
        constructor(){super({uniqueName:"アポーちゃんの林檎", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX})}
    };
    export const                         あらくれ剣:Item = new class extends Item{
        constructor(){super({uniqueName:"あらくれ剣", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX})}
    };
    export const                         烈火:Item = new class extends Item{
        constructor(){super({uniqueName:"烈火", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX})}
    };
    export const                         清龍:Item = new class extends Item{
        constructor(){super({uniqueName:"清龍", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX})}
    };
    export const                         失った思い出:Item = new class extends Item{
        constructor(){super({uniqueName:"失った思い出", info:"",
                                type:ItemType.素材, rank:6, drop:ItemDrop.BOX})}
    };
    export const                         火と水と土と風と光と闇のアニムス:Item = new class extends Item{
        constructor(){super({uniqueName:"火と水と土と風と光と闇のアニムス", info:"",
                                type:ItemType.素材, rank:6, drop:ItemDrop.BOX})}
    };
    export const                         鳥使い達の誓い:Item = new class extends Item{
        constructor(){super({uniqueName:"鳥使い達の誓い", info:"",
                                type:ItemType.素材, rank:7, drop:ItemDrop.BOX})}
    };
    export const                         遠い約束:Item = new class extends Item{
        constructor(){super({uniqueName:"遠い約束", info:"",
                                type:ItemType.素材, rank:8, drop:ItemDrop.BOX})}
    };
    export const                         カンバス:Item = new class extends Item{
        constructor(){super({uniqueName:"カンバス", info:"",
                                type:ItemType.素材, rank:8, drop:ItemDrop.BOX})}
    };
    export const                         セカンドチャンス:Item = new class extends Item{
        constructor(){super({uniqueName:"セカンドチャンス", info:"",
                                type:ItemType.素材, rank:9, drop:ItemDrop.BOX})}
    };
    export const                         きゅうせん:Item = new class extends Item{
        constructor(){super({uniqueName:"きゅうせん", info:"",
                                type:ItemType.素材, rank:10, drop:ItemDrop.BOX})}
        toString(){return "9000";}
    };
    export const                         セルダンの危機:Item = new class extends Item{
        constructor(){super({uniqueName:"セルダンの危機", info:"",
                                type:ItemType.素材, rank:11, drop:ItemDrop.BOX})}
    };
    export const                         フロントミッション:Item = new class extends Item{
        constructor(){super({uniqueName:"フロントミッション", info:"",
                                type:ItemType.素材, rank:11, drop:ItemDrop.BOX})}
    };
    export const                         獣神イリューガ:Item = new class extends Item{
        constructor(){super({uniqueName:"獣神イリューガ", info:"",
                                type:ItemType.素材, rank:12, drop:ItemDrop.BOX})}
    };
    
    //-----------------------------------------------------------------
    //
    //-素材
    //TREE
    //
    //-----------------------------------------------------------------
    export const                         杉:Item = new class extends Item{
        constructor(){super({uniqueName:"杉", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         ヒノキ:Item = new class extends Item{
        constructor(){super({uniqueName:"ヒノキ", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         竹:Item = new class extends Item{
        constructor(){super({uniqueName:"竹", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         松:Item = new class extends Item{
        constructor(){super({uniqueName:"松", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         クワ:Item = new class extends Item{
        constructor(){super({uniqueName:"クワ", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         エデン樹:Item = new class extends Item{
        constructor(){super({uniqueName:"エデン樹", info:"エデンに生える細く長い木",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         桜:Item = new class extends Item{
        constructor(){super({uniqueName:"桜", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         発砲ツル:Item = new class extends Item{
        constructor(){super({uniqueName:"発砲ツル", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         合板:Item = new class extends Item{
        constructor(){super({uniqueName:"合板", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         桐:Item = new class extends Item{
        constructor(){super({uniqueName:"桐", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         梅:Item = new class extends Item{
        constructor(){super({uniqueName:"梅", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         三木:Item = new class extends Item{
        constructor(){super({uniqueName:"三木", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         クヌギ:Item = new class extends Item{
        constructor(){super({uniqueName:"クヌギ", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         高野槙:Item = new class extends Item{
        constructor(){super({uniqueName:"高野槙", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         杜松:Item = new class extends Item{
        constructor(){super({uniqueName:"杜松", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         翌檜:Item = new class extends Item{
        constructor(){super({uniqueName:"翌檜", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         サクラ材:Item = new class extends Item{
        constructor(){super({uniqueName:"サクラ材", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX})}
    };
    export const                         松材:Item = new class extends Item{
        constructor(){super({uniqueName:"松材", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX})}
    };
    export const                         テント木:Item = new class extends Item{
        constructor(){super({uniqueName:"テント木", info:"",
                                type:ItemType.素材, rank:6, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         ヒュム:Item = new class extends Item{
        constructor(){super({uniqueName:"ヒュム", info:"ジャスライク星系に生息する歩く生きた巨木",
                                type:ItemType.素材, rank:7, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         霊樹:Item = new class extends Item{
        constructor(){super({uniqueName:"霊樹", info:"",
                                type:ItemType.素材, rank:8, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         バーナード原木:Item = new class extends Item{
        constructor(){super({uniqueName:"バーナード原木", info:"",
                                type:ItemType.素材, rank:9, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    export const                         日立の木:Item = new class extends Item{
        constructor(){super({uniqueName:"日立の木", info:"この木なんの木",
                                type:ItemType.素材, rank:10, drop:ItemDrop.BOX | ItemDrop.TREE})}
    };
    //-----------------------------------------------------------------
    //
    //-TREE
    //STRATUM
    //
    //-----------------------------------------------------------------
    export const                         砂:Item = new class extends Item{
        constructor(){super({uniqueName:"砂", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         地球のひも:Item = new class extends Item{
        constructor(){super({uniqueName:"地球のひも", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.STRATUM})}
    };
    export const                         銅:Item = new class extends Item{
        constructor(){super({uniqueName:"銅", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX | ItemDrop.STRATUM | ItemDrop.FOSSIL})}
    };
    export const                         針金:Item = new class extends Item{
        constructor(){super({uniqueName:"針金", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         鉄:Item = new class extends Item{
        constructor(){super({uniqueName:"鉄", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.STRATUM | ItemDrop.FOSSIL})}
    };
    export const                         土:Item = new class extends Item{
        constructor(){super({uniqueName:"土", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         ガラス:Item = new class extends Item{
        constructor(){super({uniqueName:"ガラス", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         銅板:Item = new class extends Item{
        constructor(){super({uniqueName:"銅板", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         粘土:Item = new class extends Item{
        constructor(){super({uniqueName:"粘土", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         バーミキュライト:Item = new class extends Item{
        constructor(){super({uniqueName:"バーミキュライト", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         動かないゴーグル:Item = new class extends Item{
        constructor(){super({uniqueName:"動かないゴーグル", info:"壊れて動かなくなったゴーグル",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX})}
    };
    export const                         銀:Item = new class extends Item{
        constructor(){super({uniqueName:"銀", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         錫:Item = new class extends Item{
        constructor(){super({uniqueName:"錫", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         クリスタル:Item = new class extends Item{
        constructor(){super({uniqueName:"クリスタル", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         惑星エネルギー:Item = new class extends Item{
        constructor(){super({uniqueName:"惑星エネルギー", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         イリジウム:Item = new class extends Item{
        constructor(){super({uniqueName:"イリジウム", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         金:Item = new class extends Item{
        constructor(){super({uniqueName:"金", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         イズミジュエリー:Item = new class extends Item{
        constructor(){super({uniqueName:"イズミジュエリー", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         良い土:Item = new class extends Item{
        constructor(){super({uniqueName:"良い土", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         白金:Item = new class extends Item{
        constructor(){super({uniqueName:"白金", info:"",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         サングラス:Item = new class extends Item{
        constructor(){super({uniqueName:"サングラス", info:"",
                                type:ItemType.素材, rank:6, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         重力:Item = new class extends Item{
        constructor(){super({uniqueName:"重力", info:"",
                                type:ItemType.素材, rank:7, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         エレクトラム:Item = new class extends Item{
        constructor(){super({uniqueName:"エレクトラム", info:"",
                                type:ItemType.素材, rank:7, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         ジスカルド:Item = new class extends Item{
        constructor(){super({uniqueName:"ジスカルド", info:"",
                                type:ItemType.素材, rank:8, drop:ItemDrop.BOX | ItemDrop.STRATUM})}
    };
    export const                         オムナイト:Item = new class extends Item{
        constructor(){super({uniqueName:"オムナイト", info:"おおむかし うみに すんでいた こだい ポケモン。10ぽんの あしを くねらせて およぐ。",
                                type:ItemType.素材, rank:9, drop:ItemDrop.BOX | ItemDrop.FOSSIL | ItemDrop.FISHING})}
    };
    //-----------------------------------------------------------------
    //
    //-STRATUM
    //加工金属
    //
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    //
    //FOSSIL
    //
    //-----------------------------------------------------------------
    export const                         岩塩:Item = new class extends Item{
        constructor(){super({uniqueName:"岩塩", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         アステロイド:Item = new class extends Item{
        constructor(){super({uniqueName:"アステロイド", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         アリラン型岩石:Item = new class extends Item{
        constructor(){super({uniqueName:"アリラン型岩石", info:"おっきないしっころ",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         エーテルトカゲ:Item = new class extends Item{
        constructor(){super({uniqueName:"エーテルトカゲ", info:"宇宙空間のエーテル間を連続的にワープし移動するトカゲ",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         カリストコウモリ:Item = new class extends Item{
        constructor(){super({uniqueName:"カリストコウモリ", info:"木星衛星カリストに生息する青いコウモリ",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         スカイフェアリーの死体:Item = new class extends Item{
        constructor(){super({uniqueName:"スカイフェアリーの死体", info:"魔獣ドンゴの胃袋から発見される事が多い",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         ドルバン粉末:Item = new class extends Item{
        constructor(){super({uniqueName:"ドルバン粉末", info:"精霊の威力を500p上げる",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         ドンゴの鱗:Item = new class extends Item{
        constructor(){super({uniqueName:"ドンゴの鱗", info:"多目獣ドンゴの鱗",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         ドンゴの骨:Item = new class extends Item{
        constructor(){super({uniqueName:"ドンゴの骨", info:"多目獣ドンゴの骨の一部",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         ヒルトン石:Item = new class extends Item{
        constructor(){super({uniqueName:"ヒルトン石", info:"",
                                type:ItemType.素材, rank:6, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         ムーンストーン:Item = new class extends Item{
        constructor(){super({uniqueName:"ムーンストーン", info:"月でとれる不思議な石",
                                type:ItemType.素材, rank:6, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         家康の生首:Item = new class extends Item{
        constructor(){super({uniqueName:"家康の生首", info:"fromNIPPON",
                                type:ItemType.素材, rank:7, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         大型隕石:Item = new class extends Item{
        constructor(){super({uniqueName:"大型隕石", info:"",
                                type:ItemType.素材, rank:7, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         永久月磁石:Item = new class extends Item{
        constructor(){super({uniqueName:"永久月磁石", info:"月で産出する特殊な磁場を持つ永久磁石",
                                type:ItemType.素材, rank:8, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         巨人の肉片君:Item = new class extends Item{
        constructor(){super({uniqueName:"巨人の肉片君", info:"ペルセポネの肉片、食べるとお腹+20",
                                type:ItemType.素材, rank:8, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         真空蛇:Item = new class extends Item{
        constructor(){super({uniqueName:"真空蛇", info:"真空中で生息可能な謎の蛇、小さいものでも全長250kmを越える",
                                type:ItemType.素材, rank:9, drop:ItemDrop.BOX | ItemDrop.FOSSIL})}
    };
    export const                         空亀:Item = new class extends Item{
        constructor(){super({uniqueName:"空亀", info:"木星核付近に生息する巨大亀、この亀の動作によって木星雲の模様が変化すると言われている",
                                type:ItemType.素材, rank:10, drop:ItemDrop.FOSSIL})}
    };
    export const                         燃える脳:Item = new class extends Item{
        constructor(){super({uniqueName:"燃える脳", info:"",
                                type:ItemType.素材, rank:10, drop:ItemDrop.FOSSIL})}
    };
    export const                         にっく:Item = new class extends Item{
        constructor(){super({uniqueName:"にっく", info:"うちゅうのおにく、LOVE ＆ NIKU",
                                type:ItemType.素材, rank:10, drop:ItemDrop.FOSSIL})}
    };
    export const                         ゆかり:Item = new class extends Item{
        constructor(){super({uniqueName:"ゆかり", info:"？？？？",
                                type:ItemType.素材, rank:11, drop:ItemDrop.FOSSIL})}
    };
    export const                         Wにっく:Item = new class extends Item{
        constructor(){super({uniqueName:"Wにっく", info:"うちゅうのおにく、NIKU ＆ NIKU",
                                type:ItemType.素材, rank:12, drop:ItemDrop.FOSSIL})}
    };
    export const                         あの頃:Item = new class extends Item{
        constructor(){super({uniqueName:"あの頃", info:"",
                                type:ItemType.素材, rank:13, drop:ItemDrop.FOSSIL})}
    };
    //-----------------------------------------------------------------
    //
    //LAKE
    //
    //-----------------------------------------------------------------
    export const                         水:Item = new class extends Item{
        constructor(){super({uniqueName:"水", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         イズミミズ:Item = new class extends Item{
        constructor(){super({uniqueName:"イズミミズ", info:"みみずっぽい",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         呪い水:Item = new class extends Item{
        constructor(){super({uniqueName:"呪い水", info:"野山などに転がる獣の霊が宿る水",
                                type:ItemType.素材, rank:1, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         カゼミズ:Item = new class extends Item{
        constructor(){super({uniqueName:"カゼミズ", info:"サラサラとした水",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         円形ハゲミミズの油:Item = new class extends Item{
        constructor(){super({uniqueName:"円形ハゲミミズの油", info:"油",
                                type:ItemType.素材, rank:2, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         ジェリーの粘液:Item = new class extends Item{
        constructor(){super({uniqueName:"ジェリーの粘液", info:"ねばねば",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         ロウ:Item = new class extends Item{
        constructor(){super({uniqueName:"ロウ", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         精霊の涙:Item = new class extends Item{
        constructor(){super({uniqueName:"精霊の涙", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         王子の素:Item = new class extends Item{
        constructor(){super({uniqueName:"王子の素", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         テント樹液:Item = new class extends Item{
        constructor(){super({uniqueName:"テント樹液", info:"テント樹から取れる樹液、ゴム状",
                                type:ItemType.素材, rank:5, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         ストュクス川の水:Item = new class extends Item{
        constructor(){super({uniqueName:"ストュクス川の水", info:"精霊値を800上昇させる",
                                type:ItemType.素材, rank:6, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         ガゼルの血液:Item = new class extends Item{
        constructor(){super({uniqueName:"ガゼルの血液", info:"上空でのみ生きる事ができた有翼人のガゼル、彼の全身から吹き出た血。",
                                type:ItemType.素材, rank:7, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         はなみず:Item = new class extends Item{
        constructor(){super({uniqueName:"はなみず", info:"",
                                type:ItemType.素材, rank:8, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         ミダスの水:Item = new class extends Item{
        constructor(){super({uniqueName:"ミダスの水", info:"",
                                type:ItemType.素材, rank:9, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    export const                         ドンゴのミルク:Item = new class extends Item{
        constructor(){super({uniqueName:"ドンゴのミルク", info:"",
                                type:ItemType.素材, rank:10, drop:ItemDrop.BOX | ItemDrop.LAKE})}
    };
    //-----------------------------------------------------------------
    //
    //FISHING
    //
    //-----------------------------------------------------------------
    export const                         コイキング:Item = new class extends Item{
        constructor(){super({uniqueName:"コイキング", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.FISHING})}
    };
    export const                         かに:Item = new class extends Item{
        constructor(){super({uniqueName:"かに", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.FISHING})}
    };
    export const                         うに:Item = new class extends Item{
        constructor(){super({uniqueName:"うに", info:"",
                                type:ItemType.素材, rank:0, drop:ItemDrop.FISHING})}
    };
    export const                         ルアー:Item = new class extends Item{
        constructor(){super({uniqueName:"ルアー", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.FISHING})}
    };
    export const                         宇宙魚:Item = new class extends Item{
        constructor(){super({uniqueName:"宇宙魚", info:"宇宙を浮遊移動し、エーテルを食らう不思議な生物",
                                type:ItemType.素材, rank:1, drop:ItemDrop.FISHING})}
    };
    export const                         ミヂンコ:Item = new class extends Item{
        constructor(){super({uniqueName:"ミヂンコ", info:"",
                                type:ItemType.素材, rank:1, drop:ItemDrop.FISHING})}
    };
    export const                         シュ:Item = new class extends Item{
        constructor(){super({uniqueName:"シュ", info:"少し素早い魚",
                                type:ItemType.素材, rank:2, drop:ItemDrop.FISHING})}
    };
    export const                         おじさん:Item = new class extends Item{
        constructor(){super({uniqueName:"おじさん", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.FISHING})}
    };
    export const                         RANK2:Item = new class extends Item{
        constructor(){super({uniqueName:"RANK2", info:"",
                                type:ItemType.素材, rank:2, drop:ItemDrop.FISHING})}
    };
    export const                         緑亀:Item = new class extends Item{
        constructor(){super({uniqueName:"緑亀", info:"",
                                type:ItemType.素材, rank:3, drop:ItemDrop.FISHING})}
    };
    export const                         タイヤクラゲ:Item = new class extends Item{
        constructor(){super({uniqueName:"タイヤクラゲ", info:"タイヤみたいなクラゲ。けっこう丈夫、食べるとお腹+4",
                                type:ItemType.素材, rank:3, drop:ItemDrop.FISHING})}
    };
    export const                         ミソヅケ:Item = new class extends Item{
        constructor(){super({uniqueName:"ミソヅケ", info:"おいしそう、食べるとお腹+13",
                                type:ItemType.素材, rank:4, drop:ItemDrop.FISHING})}
    };
    export const                         ブレインうさぎ:Item = new class extends Item{
        constructor(){super({uniqueName:"ブレインうさぎ", info:"あたまのいいうさぎちゃん....食べるとお腹+27",
                                type:ItemType.素材, rank:4, drop:ItemDrop.FISHING})}
    };
    export const                         幽霊猫:Item = new class extends Item{
        constructor(){super({uniqueName:"幽霊猫", info:"",
                                type:ItemType.素材, rank:4, drop:ItemDrop.FISHING})}
    };
    export const                         魂のない子:Item = new class extends Item{
        constructor(){super({uniqueName:"魂のない子", info:"魂が宿っていない人造人間の子....食べるとお腹+28",
                                type:ItemType.素材, rank:5, drop:ItemDrop.FISHING})}
    };
    export const                         ウェーブコイラバタフラ:Item = new class extends Item{
        constructor(){super({uniqueName:"ウェーブコイラバタフラ", info:"宇宙がビックバンとビッククランチを繰り返す史中を超",
                                type:ItemType.素材, rank:5, drop:ItemDrop.FISHING})}
    };
    export const                         ウェーブコイラバタフライ:Item = new class extends Item{
        constructor(){super({uniqueName:"ウェーブコイラバタフライ", info:"宇宙がビックバンとビッククランチを繰り返す史中を超えて生き続ける超生物....食べるとお腹+26",
                                type:ItemType.素材, rank:6, drop:ItemDrop.FISHING})}
    };
    export const                         MMMMM:Item = new class extends Item{
        constructor(){super({uniqueName:"MMMMM", info:"ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ",
                                type:ItemType.素材, rank:6, drop:ItemDrop.FISHING})}
        toString(){return "ＭＭＭＭＭ";}
    };
    export const                         ペガサス:Item = new class extends Item{
        constructor(){super({uniqueName:"ペガサス", info:"YUKI",
                                type:ItemType.素材, rank:7, drop:ItemDrop.FISHING})}
    };
    export const                         ドラゴン:Item = new class extends Item{
        constructor(){super({uniqueName:"ドラゴン", info:"VEGA",
                                type:ItemType.素材, rank:7, drop:ItemDrop.FISHING})}
    };
    export const                         重子力艦ソラ:Item = new class extends Item{
        constructor(){super({uniqueName:"重子力艦ソラ", info:"",
                                type:ItemType.素材, rank:8, drop:ItemDrop.FISHING})}
    };
    export const                         ウェポン:Item = new class extends Item{
        constructor(){super({uniqueName:"ウェポン", info:"",
                                type:ItemType.素材, rank:8, drop:ItemDrop.FISHING})}
    };
    export const                         一号:Item = new class extends Item{
        constructor(){super({uniqueName:"一号", info:"",
                                type:ItemType.素材, rank:9, drop:ItemDrop.FISHING})}
    };
    export const                         零号:Item = new class extends Item{
        constructor(){super({uniqueName:"零号", info:"",
                                type:ItemType.素材, rank:10, drop:ItemDrop.FISHING})}
    };
    export const                         テルウィング:Item = new class extends Item{
        constructor(){super({uniqueName:"テルウィング", info:"非常に高度な人口翼だが、ピクピクと動いている。食べるとお腹+32",
                                type:ItemType.素材, rank:11, drop:ItemDrop.FISHING})}
        toString(){return "テル・ウィング";}
    };
    export const                         モナト:Item = new class extends Item{
        constructor(){super({uniqueName:"モナト", info:"？？？？",
                                type:ItemType.素材, rank:11, drop:ItemDrop.FISHING})}
    };
    export const                         チュルホロ:Item = new class extends Item{
        constructor(){super({uniqueName:"チュルホロ", info:"",
                                type:ItemType.素材, rank:12, drop:ItemDrop.FISHING})}
    };
    export const                         シスミン:Item = new class extends Item{
        constructor(){super({uniqueName:"シスミン", info:"",
                                type:ItemType.素材, rank:13, drop:ItemDrop.FISHING})}
    };
    //-----------------------------------------------------------------
    //
    //エリア素材
    //
    //-----------------------------------------------------------------
    export const                         月の石:Item = new class extends Item{
        constructor(){super({uniqueName:"月の石", info:"月地域で稀に採れる石",
                                type:ItemType.素材, rank:3, drop:ItemDrop.NO})}
    };
    export const                         肉まん:Item = new class extends Item{
        constructor(){super({uniqueName:"肉まん", info:"中央島地域で稀に採れる肉まん",
                                type:ItemType.素材, rank:3, drop:ItemDrop.NO})}
    };
    export const                         地球塔粉末:Item = new class extends Item{
        constructor(){super({uniqueName:"地球塔粉末", info:"中央島地域で稀に採れる地球塔粉末",
                                type:ItemType.素材, rank:4, drop:ItemDrop.NO})}
    };
    export const                         タンホイザーの砂飯:Item = new class extends Item{
        constructor(){super({uniqueName:"タンホイザーの砂飯", info:"黒地域で稀に採れる料理、全員のお腹を4回復",
                                type:ItemType.素材, rank:3, drop:ItemDrop.NO})}
    };
    export const                         黒色火薬:Item = new class extends Item{
        constructor(){super({uniqueName:"黒色火薬", info:"黒地域で稀に採れる火薬",
                                type:ItemType.素材, rank:4, drop:ItemDrop.NO})}
    };
    export const                         B火薬:Item = new class extends Item{
        constructor(){super({uniqueName:"B火薬", info:"黒地域で稀に採れる火薬",
                                type:ItemType.素材, rank:5, drop:ItemDrop.NO})}
    };
    export const                         マーザン:Item = new class extends Item{
        constructor(){super({uniqueName:"マーザン", info:"古マーザン地域で稀に採れるマーザン",
                                type:ItemType.素材, rank:3, drop:ItemDrop.NO})}
    };
    export const                         冥石:Item = new class extends Item{
        constructor(){super({uniqueName:"冥石", info:"冥界地域で稀に採れる石",
                                type:ItemType.素材, rank:4, drop:ItemDrop.NO})}
    };
}
