
import { DungeonEvent } from "./dungeonevent.js";
import { Rect, Color } from "../undym/type.js";
import { Job } from "../job.js";
import { Unit, EUnit, Prm } from "../unit.js";
import { Btn } from "../widget/btn.js";
import { Tec } from "../tec.js";
import { Item } from "../item.js";
import { Num } from "../mix.js";
import { Eq } from "../eq.js";
import { Util } from "../util.js";
import { cwait, wait } from "../undym/scene.js";
import { Player } from "../player.js";
import { choice } from "../undym/random.js";
import { Img } from "../graphics/graphics.js";
import { Story } from "../story.js";



export abstract class Dungeon{
    private static _values:Dungeon[] = [];
    static get values():ReadonlyArray<Dungeon>{return this._values;}

    private static _valueOf = new Map<string,Dungeon>();
    static valueOf(uniqueName:string){return this._valueOf.get(uniqueName);}


    static now:Dungeon;
    static auNow:number = 0;

    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    treasureKey:number = 0;
    dungeonClearCount:number = 0;
    exKillCount:number = 0;
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------

    get uniqueName():string{return this.args.uniqueName;}
    get rank():number{return this.args.rank;}
    /** クリア回数による補正をかけていないもの。*/
    get originalEnemyLv():number{return this.args.enemyLv;}
    /**クリア回数の補正をかけたもの。 */
    get enemyLv():number{
        const _clearCount = this.dungeonClearCount < 20 ? this.dungeonClearCount : 20;
        const res = this.args.enemyLv * (1 + _clearCount * 0.05) + _clearCount / 2;
        return res|0;
    }
    get au():number{return this.args.au;}

    get treasures():Num[]{return this.args.treasures();}
    rndTreasure():Num|undefined{
        if(this.treasures.length === 0){return undefined;}
        return choice( this.treasures );
    }
    /**Exエネミーを倒した時に入手。 */
    get exItems():Num[]{return this.args.exItems();}
    get trendItems():Item[]{return this.args.trendItems();}
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    // private constructor(name:string, protected rank:number, protected enemyLv:number, protected au:number){
    protected constructor(
        private args:{
            uniqueName:string,
            rank:number,
            enemyLv:number,
            au:number,
            treasures:()=>Num[],
            exItems:()=>Num[],
            trendItems:()=>Item[],
            event?:()=>Event,
        }
    ){

        Dungeon._values.push(this);
        if(Dungeon._valueOf.has(this.uniqueName)){console.log(`Dungeon already has uniqueName "${this.uniqueName}".`);}
        else                                     {Dungeon._valueOf.set( this.uniqueName, this );}
    }

    toString():string{return this.args.uniqueName;}
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    abstract isVisible():boolean;
    abstract setBossInner():void;
    abstract setExInner():void;
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    rndEvent():DungeonEvent{
        if(Math.random() < 0.002){
            if(this.treasureKey === 0){
                if(Math.random() < 0.8) {return DungeonEvent.GET_TREASURE_KEY;}
                else                    {return DungeonEvent.TREASURE;}
            }else{
                if(Math.random() < 0.8) {return DungeonEvent.TREASURE;}
                else                    {return DungeonEvent.GET_TREASURE_KEY;}
            }
        }

        if(Dungeon.now.dungeonClearCount > 0 && Math.random() < 0.001){return DungeonEvent.EX_BATTLE;}
        
        if(Math.random() < 0.15){
            if(Dungeon.now.rank >= 2 && Math.random() < 0.05){
                if(Dungeon.now.rank >= 6 && Math.random() < 0.3){return DungeonEvent.KEY_BOX_RANK6;}
                if(Dungeon.now.rank >= 5 && Math.random() < 0.3){return DungeonEvent.KEY_BOX_RANK5;}
                if(Dungeon.now.rank >= 4 && Math.random() < 0.3){return DungeonEvent.KEY_BOX_RANK4;}
                if(Dungeon.now.rank >= 3 && Math.random() < 0.3){return DungeonEvent.KEY_BOX_RANK3;}
                return DungeonEvent.KEY_BOX_RANK2;
            }else{
                return DungeonEvent.BOX;
            }
        }
        if(Math.random() < 0.15){return DungeonEvent.BATTLE;}
        if(Math.random() < 0.04){return DungeonEvent.TRAP;}
        
        if(this.rank >= 1 && Math.random() < 0.01){return DungeonEvent.TREE;}
        if(this.rank >= 2 && Math.random() < 0.01){return DungeonEvent.STRATUM;}
        if(this.rank >= 3 && Math.random() < 0.01){return DungeonEvent.LAKE;}

        //(10 + rank * 1) / (10 + rank * 6)
        //[rank = 0,  1 / 1] [rank = 1,  11 / 16] [rank = 5,  15 / 40] [rank = 10, 20 / 70 = 2 / 7]
        if(Math.random() < 0.02 * (10 + this.rank) / (10 + this.rank * 6)){return DungeonEvent.REST;}

        return DungeonEvent.empty;
    }

    rndEnemyNum():number{
        const prob = 1.0 - (this.rank + 4) / (this.rank * this.rank + 5);
        let num = 0;
        for(let i = 0; i < Unit.enemies.length; i++){
            if(Math.random() <= prob){
                num++;
            }
        }
        return num === 0 ? 1 : num;
    }

    setEnemy(num:number = -1){
        if(num === -1){
            num = this.rndEnemyNum();
        }
        for(let i = 0; i < num; i++){
            const e = Unit.enemies[i];
            this.setEnemyInner( e );
            e.name += String.fromCharCode("A".charCodeAt(0) + i);
        }
    }

    setEnemyInner(e:EUnit){
        Job.rndSetEnemy(e, (Math.random() * 0.5 + 0.75) * this.enemyLv);
    }

    setBoss(){
        this.setEnemy( Unit.enemies.length );
        for(const e of Unit.enemies){
            e.prm(Prm.MAX_HP).base *= 3;
            e.ep = Unit.DEF_MAX_EP;
        }

        this.setBossInner();

        for(let e of Unit.enemies){
            e.hp = e.prm(Prm.MAX_HP).total;
        }
    }

    setEx(){
        for(const e of Unit.enemies){
            const _killCount = this.exKillCount < 10 ? this.exKillCount : 10;
            const lv = this.originalEnemyLv * (1 + _killCount * 0.1);
            const job = Job.rndJob(lv);
            job.setEnemy( e, lv );

            e.prm(Prm.MAX_HP).base *= 3;
            e.ep = Unit.DEF_MAX_EP;
        }

        this.setExInner();
        
        for(let e of Unit.enemies){
            e.hp = e.prm(Prm.MAX_HP).total;
        }
    }

    async dungeonClearEvent(){
        if(this.dungeonClearCount <= 100 && this.dungeonClearCount % 10 === 0){
            Util.msg.set(`[${this}]を${this.dungeonClearCount}回踏破！`); await cwait();
            const value = (1 + this.dungeonClearCount / 10)|0;
            Item.ささやかな贈り物.add(value);       await wait();
        }
    }
    

    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
}


export namespace Dungeon{
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    export const                         再構成トンネル:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"再構成トンネル",
                                rank:0, enemyLv:1, au:50,
                                treasures:  ()=>[Eq.安全靴],
                                exItems:    ()=>[Eq.アカデミーバッヂ],
                                trendItems: ()=>[Item.石, Item.砂],
        });}
        isVisible = ()=>true;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "自我";
            e.prm(Prm.MAX_HP).base = 30;
            e.prm(Prm.STR).base = 3;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.毒使い.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "チョコチョコ";
            e.img = BossImg.choco;
            e.prm(Prm.MAX_HP).base = 30;
            e.prm(Prm.STR).base = 5;
            e.prm(Prm.MAG).base = 5;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story.MAIN_1.run();
            }
            if(Item.脱出ポッド.totalGetCount === 0){
                Item.脱出ポッド.add(1); await wait();
                Util.msg.set("[お店]が出現した", Color.PINK.bright); await cwait();
            }
        }
    };
    export const                         見知らぬ海岸:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"見知らぬ海岸",
                                rank:0, enemyLv:3, au:60,
                                treasures:  ()=>[Eq.銅板],
                                exItems:    ()=>[Eq.草の服],
                                trendItems: ()=>[Item.草, Item.水],
        });}
        isVisible = ()=>Dungeon.再構成トンネル.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "危険な光線";
            e.prm(Prm.MAX_HP).base = 40;
            e.prm(Prm.STR).base = 5;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.鎖使い.setEnemy(e, 5);
            e.name = "アイアンチョコチョコ";
            e.img = BossImg.choco;
            e.prm(Prm.MAX_HP).base = 50;
            e.prm(Prm.STR).base = 5;
            e.prm(Prm.MAG).base = 5;
            e.prm(Prm.CHN).base = 5;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story.MAIN_2.run();
            }
        }
    };
    export const                         はじまりの丘:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"はじまりの丘",
                                rank:1, enemyLv:7, au:100,
                                treasures:  ()=>[Eq.オールマント],
                                exItems:    ()=>[Eq.ライダーベルト],
                                trendItems: ()=>[Item.肉, Item.原木],
        });}
        isVisible = ()=>Dungeon.見知らぬ海岸.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "導びく者";
            e.prm(Prm.MAX_HP).base = 80;
            e.prm(Prm.STR).base = 10;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生.setEnemy(e, 5);
            e.name = "亡霊ドロシー";
            e.prm(Prm.MAX_HP).base = 120;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story.MAIN_3.run();
            }
        }
    };
    export const                         予感の街レ:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"予感の街・レ",
                                rank:0, enemyLv:11, au:70,
                                treasures:  ()=>[Eq.ミルテの棍],
                                exItems:    ()=>[Eq.いばらの鎧],
                                trendItems: ()=>[Item.水],
        });}
        isVisible = ()=>Dungeon.はじまりの丘.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.魔法使い.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "レ町長";
            e.prm(Prm.MAX_HP).base = 80;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生.setEnemy(e, 5);
            e.name = "幻影リリア";
            e.prm(Prm.MAX_HP).base = 120;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story.MAIN_4.run();
            }
        }
    };
}



namespace BossImg{
    export const choco = new Img("img/choco.png");
}