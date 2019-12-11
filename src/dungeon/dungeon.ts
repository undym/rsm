
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
import { Img } from "../graphics/texture.js";
import { Story1 } from "../story/story1.js";
import { Story0 } from "../story/story0.js";
import { Sound } from "../sound.js";
import { Story2 } from "../story/story2.js";


export class DungeonArea{
    private static _valueOf = new Map<string,DungeonArea>();
    static valueOf(uniqueName:string){return this._valueOf.get(uniqueName);}

    static now:DungeonArea;
    private _img:Img;
    get img(){return this._img ? this._img : (this._img = new Img(this.imgSrc, {lazyLoad:false}));}

    get areaMoveBtns():{to:DungeonArea, bounds:Rect, isVisible:()=>boolean}[]{
        const res:{to:DungeonArea, bounds:Rect, isVisible:()=>boolean}[] = [];
        for(const set of this._areaMoveBtns()){
            res.push({to:set[0], bounds:set[1], isVisible:set[2]});
        }
        return res;
    }

    get areaItems():{item:Item, prob:number}[]{
        const res:{item:Item, prob:number}[] = [];
        for(const set of this._areaItems()){
            res.push({item:set[0], prob:set[1]});
        }
        return res;
    }

    constructor(
        readonly uniqueName:string, 
        private imgSrc:string, 
        private _areaMoveBtns:()=>[DungeonArea, Rect, ()=>boolean][],
        private _areaItems:()=>[Item, number][],
    ){
        DungeonArea._valueOf.set(uniqueName, this);
    }

    toString(){return this.uniqueName;}
}

export namespace DungeonArea{
    export const 中央島 =    new DungeonArea("中央島", "img/map1.jpg",
                                ()=>[
                                    [DungeonArea.黒地域,     new Rect(0.7, 0.45, 0.3, 0.1), ()=>Dungeon.黒平原.isVisible()],
                                    [DungeonArea.古マーザン, new Rect(0.0, 0.4, 0.3, 0.1),   ()=>Dungeon.古マーザン森.isVisible()],
                                ],
                                ()=>[
                                    [Item.肉まん, 0.002],
                                    [Item.地球塔粉末, 0.002],
                                ],
                            );
    export const 黒地域 =    new DungeonArea("黒地域", "img/map2.jpg",
                                ()=>[
                                    [DungeonArea.中央島, new Rect(0.0, 0.4, 0.3, 0.1), ()=>true],
                                ],
                                ()=>[
                                    [Item.タンホイザーの砂飯, 0.002],
                                    [Item.黒色火薬, 0.002],
                                    [Item.B火薬, 0.002],
                                ],
                            );
    export const 月 =       new DungeonArea("月", "img/map4.jpg",
                                ()=>[
                                    // [DungeonArea.中央島, new Rect(0.0, 0.4, 0.3, 0.1), ()=>true],
                                ],
                                ()=>[
                                    [Item.月の石, 0.002],
                                ],
                            );
    export const 古マーザン =    new DungeonArea("古マーザン", "img/map3.jpg",
                                ()=>[
                                    [DungeonArea.中央島, new Rect(0.7, 0.25, 0.3, 0.1), ()=>Dungeon.古マーザン森.isVisible()],
                                ],
                                ()=>[
                                    [Item.マーザン, 0.002],
                                ],
                            );
}





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
    get info():string{return this.args.info;}
    get rank():number{return this.args.rank;}
    /** クリア回数による補正をかけていないもの。*/
    get originalEnemyLv():number{return this.args.enemyLv;}
    /**クリア回数の補正をかけたもの。 */
    get enemyLv():number{
        const _clearCount = this.dungeonClearCount < 20 ? this.dungeonClearCount : 20;
        const res = this.args.enemyLv * (1 + _clearCount * 0.05) + _clearCount / 2;
        return res|0;
    }
    get au():number         {return this.args.au;}
    get area():DungeonArea  {return this.args.btn[0];}
    get btnBounds():Rect    {return this.args.btn[1];}

    get treasures():Num[]{return this.args.treasures();}
    rndTreasure():Num|undefined{
        if(this.treasures.length === 0){return undefined;}
        return choice( this.treasures );
    }
    /**Exエネミーを倒した時に入手。 */
    get exItems():Num[]{return this.args.exItems();}
    get trendItems():Item[]{return this.args.trendItems();}
    /**通常rndDungeonEvent()の最後に実行される。 */
    private rndTrendEvents():DungeonEvent{
        if(this.args.trendEvents){
            for(const set of this.args.trendEvents()){
                if(Math.random() < set[1]){
                    return set[0];
                }
            }
        }
        return DungeonEvent.empty;
    }
    //-----------------------------------------------------------------
    //
    //
    //
    //-----------------------------------------------------------------
    /**trendEvents:通常rndDungeonEvent()の最後に実行される。 */
    protected constructor(
        private args:{
            uniqueName:string,
            info:string,
            rank:number,
            enemyLv:number,
            au:number,
            btn:[DungeonArea, Rect]
            treasures:()=>Num[],
            exItems:()=>Num[],
            trendItems:()=>Item[],
            trendEvents?:()=>([DungeonEvent,number][]),
            beast?:boolean,//獣ジョブが出るか
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
        for(const set of DungeonArea.now.areaItems){
            if(Math.random() < set.prob){
                const num = 1;
                set.item.add(num);
                Util.msg.set(`${set.item}を${num}個拾った(${set.item.num})`, Color.GREEN.wave( Color.YELLOW ));
            }
        }

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
            if(Dungeon.now.rank >= 2 && Math.random() < 0.04){
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
        if(this.rank >= 4 && Math.random() < 0.01){return DungeonEvent.FOSSIL;}

        //(10 + rank * 1) / (10 + rank * 6)
        //[rank = 0,  1 / 1] [rank = 1,  11 / 16] [rank = 5,  15 / 40] [rank = 10, 20 / 70 = 2 / 7]
        if(Math.random() < 0.02 * (10 + this.rank) / (10 + this.rank * 6)){return DungeonEvent.REST;}
    
        return this.rndTrendEvents();
    }

    rndJob():Job{
        const lv = this.enemyLv;
        for(let i = 0; i < 10; i++){
            const tmp = choice( Job.values );
            if(tmp.appearLv <= lv){
                if(tmp.beast && !this.args.beast){continue;}
                return tmp;
            }
        }
        return Job.訓練生;
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

    async setEnemy(num:number = 0){
        if(num === 0){
            num = this.rndEnemyNum();
        }
        for(let i = 0; i < num; i++){
            const e = Unit.enemies[i];
            await this.setEnemyInner( e );
            e.name += String.fromCharCode("A".charCodeAt(0) + i);
        }
    }

    async setEnemyInner(e:EUnit){
        await this.rndJob().setEnemy(e, (Math.random() * 0.5 + 0.75) * this.enemyLv);
    }

    async setBoss(){
        await this.setEnemy( Unit.enemies.length );
        for(const e of Unit.enemies){
            e.prm(Prm.MAX_HP).base *= 3;
            e.ep = Unit.DEF_MAX_EP;
        }

        this.setBossInner();

        for(let e of Unit.enemies){
            await e.equip();
            e.hp = e.prm(Prm.MAX_HP).total;
        }
    }

    async setEx(){
        for(const e of Unit.enemies){
            const _killCount = this.exKillCount < 10 ? this.exKillCount : 10;
            const lv = this.originalEnemyLv * (1 + _killCount * 0.1);
            const job = this.rndJob();
            job.setEnemy( e, lv );

            e.prm(Prm.MAX_HP).base *= 3;
            e.ep = Unit.DEF_MAX_EP;
        }

        this.setExInner();
        
        for(let e of Unit.enemies){
            await e.equip();
            e.hp = e.prm(Prm.MAX_HP).total;
        }
    }

    async dungeonClearEvent(){
        if(this.dungeonClearCount <= 100 && this.dungeonClearCount % 10 === 0){
            Util.msg.set(`[${this}]を${this.dungeonClearCount}回踏破！`); await cwait();
            Sound.rare.play();
            const value = (this.dungeonClearCount / 10)|0;
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

    ///////////////////////////////////////////////////////////////////////
    //                                                                   //
    //                            中央島                                 //
    //                                                                   //
    ///////////////////////////////////////////////////////////////////////
    export const                         再構成トンネル:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"再構成トンネル", info:"",
                                rank:0, enemyLv:1, au:50, btn:[DungeonArea.中央島, new Rect(0, 0.2, 0.3, 0.1)],
                                treasures:  ()=>[Eq.安全靴],
                                exItems:    ()=>[Eq.アカデミーバッヂ],
                                trendItems: ()=>[Item.石, Item.杉, Item.ヒノキ, Item.竹, Item.草],
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
            e.img = new Img("img/unit/choco.png");
            e.prm(Prm.MAX_HP).base = 30;
            e.prm(Prm.STR).base = 5;
            e.prm(Prm.MAG).base = 5;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain1();
            }
            if(Item.脱出ポッド.totalGetCount === 0){
                Sound.rare.play();
                Item.脱出ポッド.add(1); await cwait();
                Sound.bpup.play();
                Util.msg.set("[お店]が出現した", Color.PINK.bright); await cwait();
            }
        }
    };
    export const                         見知らぬ海岸:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"見知らぬ海岸", info:"",
                                rank:0, enemyLv:3, au:60, btn:[DungeonArea.中央島, new Rect(0.1, 0.3, 0.3, 0.1)],
                                treasures:  ()=>[Eq.銅板],
                                exItems:    ()=>[Eq.草の服],
                                trendItems: ()=>[Item.草, Item.水, Item.竹, Item.かんな],
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
            Job.鎖使い.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "アイアンチョコチョコ";
            e.img = new Img("img/unit/choco.png");
            e.prm(Prm.MAX_HP).base = 50;
            e.prm(Prm.STR).base = 5;
            e.prm(Prm.MAG).base = 5;
            e.prm(Prm.CHN).base = 5;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain2();
            }
            if(Item.動かない映写機.totalGetCount === 0){
                Sound.rare.play();
                Item.動かない映写機.add(1); await cwait();
            }
        }
    };
    export const                         はじまりの丘:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"はじまりの丘", info:"木+",
                                rank:1, enemyLv:4, au:100, btn:[DungeonArea.中央島, new Rect(0.7, 0.15, 0.3, 0.1)],
                                treasures:  ()=>[Eq.オールマント],
                                exItems:    ()=>[Eq.ライダーベルト],
                                trendItems: ()=>[Item.肉, Item.竹, Item.砂, Item.かんな],
                                trendEvents:()=>[[DungeonEvent.TREE, 0.05]],
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
            Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "亡霊ドロシー";
            e.img = new Img("img/unit/dorosy.png");
            e.prm(Prm.MAX_HP).base = 120;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain3();
            }
        }
    };
    export const                         予感の街レ:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"予感の街レ", info:"",
                                rank:0, enemyLv:9, au:70, btn:[DungeonArea.中央島, new Rect(0.7, 0.7, 0.3, 0.1)],
                                treasures:  ()=>[Eq.ミルテの棍],
                                exItems:    ()=>[Eq.いばらの鎧],
                                trendItems: ()=>[Item.粘土, Item.土, Item.ガラス, Item.かんな],
        });}
        toString(){return "予感の街・レ";}
        isVisible = ()=>Dungeon.はじまりの丘.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.魔法使い.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "レ町長";
            e.prm(Prm.MAX_HP).base = 80;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影リリア";
            e.img = new Img("img/unit/riria.png");
            e.prm(Prm.MAX_HP).base = 120;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain4();
            }

            if(Item.レレシピ.totalGetCount === 0){
                Sound.rare.play();
                Item.レレシピ.add(1); await cwait();
            }
        }
    };
    export const                         水の都イス:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"水の都イス", info:"湖+",
                                rank:2, enemyLv:14, au:60, btn:[DungeonArea.中央島, new Rect(0.7, 0.8, 0.3, 0.1)],
                                treasures:  ()=>[Eq.レティシアsガン],
                                exItems:    ()=>[Eq.月代],
                                trendItems: ()=>[Item.水, Item.イズミミズ, Item.ジェリーの粘液, Item.精霊の涙],
                                trendEvents:()=>[[DungeonEvent.LAKE, 0.05]],
        });}
        toString(){return "水の都・イス";}
        isVisible = ()=>Dungeon.黒い丘.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.カウボーイ.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "イス都長";
            e.prm(Prm.MAX_HP).base = 250;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.剣士.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影ハインリヒ";
            e.img = new Img("img/unit/haine.png");
            e.prm(Prm.MAX_HP).base = 250;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain7();
            }
            if(Item.イスレシピ.totalGetCount === 0){
                Sound.rare.play();
                Item.イスレシピ.add(1); await cwait();
            }
        }
    };
    export const                         リテの門:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"リテの門", info:"",
                                rank:2, enemyLv:16, au:200, btn:[DungeonArea.中央島, new Rect(0, 0.75, 0.3, 0.1)],
                                treasures:  ()=>[Eq.忍者ソード],
                                exItems:    ()=>[Eq.反精霊の盾],
                                trendItems: ()=>[Item.ファーストキス, Item.エレタクレヨン],
        });}
        toString(){return "リ・テの門";}
        isVisible = ()=>Dungeon.水の都イス.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.剣士.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "リテの門番";
            e.prm(Prm.MAX_HP).base = 280;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生二年生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "亡霊運命兄さん";
            e.img = new Img("img/unit/unmei.png");
            e.prm(Prm.MAX_HP).base = 280;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain8();
            }
        }
    };
    export const                         クラウンボトル:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"クラウンボトル", info:"",
                                rank:3, enemyLv:20, au:250, btn:[DungeonArea.中央島, new Rect(0.15, 0.65, 0.3, 0.1)],
                                treasures:  ()=>[Eq.呪縛の弓矢],
                                exItems:    ()=>[Eq.コスモガン],
                                trendItems: ()=>[Item.血粉末, Item.うんち, Item.太陽の欠片],
        });}
        isVisible = ()=>Dungeon.黒の廃村.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.カウボーイ.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "無限の壺人";
            e.prm(Prm.MAX_HP).base = 350;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.鎖使い.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "亡霊ガニュメート";
            e.img = new Img("img/unit/unmei.png");
            e.prm(Prm.MAX_HP).base = 350;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain11();
            }
        }
    };
    export const                         トトの郊外:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"トトの郊外", info:"",
                                rank:4, enemyLv:20, au:70, btn:[DungeonArea.中央島, new Rect(0.7, 0.9, 0.3, 0.1)],
                                treasures:  ()=>[Eq.悪夢],
                                exItems:    ()=>[Eq.猛者の鎧],
                                trendItems: ()=>[Item.肉, Item.錫, Item.高野槙, Item.桜],
        });}
        isVisible = ()=>Dungeon.クラウンボトル.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.機械士.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "機械仕掛けA";
            e.prm(Prm.MAX_HP).base = 500;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.格闘家.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影トレジャー";
            e.img = new Img("img/unit/trager.png");
            e.prm(Prm.MAX_HP).base = 500;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain12();

                DungeonArea.now = DungeonArea.月;
                for(let i = 0; i < Unit.players.length; i++){
                    Unit.setPlayer(i, Player.empty);
                }
                Player.一号.join();
                Player.雪.join();
            }
        }
    };
    export const                         塔4000階:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"塔4000階", info:"",
                                rank:5, enemyLv:25, au:240, btn:[DungeonArea.中央島, new Rect(0.35, 0.4, 0.3, 0.1)],
                                treasures:  ()=>[Eq.ミサイリストスーツ],
                                exItems:    ()=>[Eq.ぱとバット],
                                trendItems: ()=>[Item.松, Item.桜, Item.クワ, Item.良い土, Item.イズミジュエリー, Item.肉],
        });}
        isVisible = ()=>Dungeon.精霊寺院跡.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.暗黒戦士.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "太古の亜人";
            e.prm(Prm.MAX_HP).base = 1000;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.スネイカー.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影ユキエモン";
            e.img = new Img("img/unit/yukiemon.png");
            e.prm(Prm.MAX_HP).base = 1050;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story2.runMain20();
            }
        }
    };

    ///////////////////////////////////////////////////////////////////////
    //                                                                   //
    //                            黒地域                                 //
    //                                                                   //
    ///////////////////////////////////////////////////////////////////////
    export const                         黒平原:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"黒平原", info:"地層+",
                                rank:0, enemyLv:10, au:100, btn:[DungeonArea.黒地域, new Rect(0.7, 0.5, 0.3, 0.1)],
                                treasures:  ()=>[Eq.魔性のマント],
                                exItems:    ()=>[Eq.妖魔の手],
                                trendItems: ()=>[Item.バッタ, Item.クワ, Item.銅, Item.鉄],
                                trendEvents:()=>[[DungeonEvent.STRATUM, 0.05]],
        });}
        isVisible = ()=>Dungeon.予感の街レ.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.毒使い.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "黒き誘い";
            e.prm(Prm.MAX_HP).base = 130;
            e.prm(Prm.DRK).base = 15;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影オーロラ";
            e.img = new Img("img/unit/orora.png");
            e.prm(Prm.MAX_HP).base = 150;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain5();
            }
        }
    };
    export const                         黒い丘:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"黒い丘", info:"地層+",
                                rank:1, enemyLv:12, au:150, btn:[DungeonArea.黒地域, new Rect(0.2, 0.6, 0.3, 0.1)],
                                treasures:  ()=>[Eq.魔ヶ玉の手首飾り],
                                exItems:    ()=>[Eq.無色の靴],
                                trendItems: ()=>[Item.鉄, Item.銅, Item.バーミキュライト],
                                trendEvents:()=>[[DungeonEvent.STRATUM, 0.05]],
        });}
        isVisible = ()=>Dungeon.黒平原.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.アーチャー.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "黒き獰猛";
            e.prm(Prm.MAX_HP).base = 250;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.鎖使い.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影ジレンマ";
            e.img = new Img("img/unit/jirenma.png");
            e.prm(Prm.MAX_HP).base = 250;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain6();
            }
        }
    };
    export const                         黒遺跡:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"黒遺跡", info:"地層+",
                                rank:2, enemyLv:18, au:200, btn:[DungeonArea.黒地域, new Rect(0.55, 0.3, 0.3, 0.1)],
                                treasures:  ()=>[Eq.ダークネスロード],
                                exItems:    ()=>[Item.ヴァンパイアの血],
                                trendItems: ()=>[Item.黒色のまぼろし, Item.エレタの絵の具, Item.桐, Item.鉄, Item.桜],
                                trendEvents:()=>[[DungeonEvent.STRATUM, 0.05]],
        });}
        isVisible = ()=>Dungeon.リテの門.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.ヴァンパイア.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "スプリガン";
            e.prm(Prm.MAX_HP).base = 330;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生二年生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "亡霊VBS";
            e.img = new Img("img/unit/vbs2.png");
            e.prm(Prm.MAX_HP).base = 330;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story0.runMain9();
            }
        }
    };
    export const                         黒の廃村:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"黒の廃村", info:"地層+",
                                rank:3, enemyLv:19, au:250, btn:[DungeonArea.黒地域, new Rect(0.55, 0.9, 0.3, 0.1)],
                                treasures:  ()=>[Eq.機工の指輪],
                                exItems:    ()=>[Item.霊術戦士の血],
                                trendItems: ()=>[Item.ロウ, Item.桐, Item.銅, Item.鉄],
                                trendEvents:()=>[[DungeonEvent.STRATUM, 0.05]],
        });}
        isVisible = ()=>Dungeon.黒遺跡.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.霊術戦士.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "黒の門番";
            e.prm(Prm.MAX_HP).base = 350;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.霊術戦士.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "ティル王";
            e.img = new Img("img/unit/tilou.png");
            e.prm(Prm.MAX_HP).base = 350;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain10();
            }
        }
    };

    ///////////////////////////////////////////////////////////////////////
    //                                                                   //
    //                               月                                  //
    //                                                                   //
    ///////////////////////////////////////////////////////////////////////
    export const                         テント樹林:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"テント樹林", info:"木+",
                                rank:0, enemyLv:0, au:100, btn:[DungeonArea.月, new Rect(0.35, 0.1, 0.3, 0.1)],
                                treasures:  ()=>[Eq.鎖のマント],
                                exItems:    ()=>[Eq.アリランナイフ],
                                trendItems: ()=>[Item.テント木, Item.発砲ツル, Item.円形ハゲミミズの油],
                                trendEvents:()=>[[DungeonEvent.TREE, 0.05]],
                                beast:true,
        });}
        isVisible = ()=>Dungeon.トトの郊外.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.雷鳥.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "大雷鳥";
            e.prm(Prm.MAX_HP).base = 250;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影ニュース";
            e.img = new Img("img/unit/news.png");
            e.prm(Prm.MAX_HP).base = 250;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain13();
            }
        }
    };
    export const                         小人集落周辺:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"小人集落周辺", info:"木+",
                                rank:1, enemyLv:3, au:150, btn:[DungeonArea.月, new Rect(0.45, 0.2, 0.3, 0.1)],
                                treasures:  ()=>[Eq.チェーンベルト],
                                exItems:    ()=>[Eq.アメーバリング],
                                trendItems: ()=>[Item.テント木, Item.発砲ツル, Item.円形ハゲミミズの油],
                                trendEvents:()=>[[DungeonEvent.TREE, 0.05]],
                                beast:true,
        });}
        isVisible = ()=>Dungeon.テント樹林.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.アメーバ.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "スライム";
            e.prm(Prm.MAX_HP).base = 300;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.ダウザー.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影パンドラ";
            e.img = new Img("img/unit/pandora.png");
            e.prm(Prm.MAX_HP).base = 300;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain14();
            }
        }
    };
    export const                         聖なる洞窟:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"聖なる洞窟", info:"",
                                rank:2, enemyLv:7, au:200, btn:[DungeonArea.月, new Rect(0.40, 0.45, 0.3, 0.1)],
                                treasures:  ()=>[Eq.アンパストベルト],
                                exItems:    ()=>[Eq.ルナローブ],
                                trendItems: ()=>[Item.粘土, Item.石, Item.銅, Item.銀, Item.金],
                                beast:true,
        });}
        isVisible = ()=>Dungeon.小人集落周辺.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.妖精.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "聖なる妖精";
            e.prm(Prm.MAX_HP).base = 450;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.忍者.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影オルガ";
            e.img = new Img("img/unit/orga.png");
            e.prm(Prm.MAX_HP).base = 600;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain15();

                Player.ベガ.join();
            }
        }
    };
    export const                         月狼の森:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"月狼の森", info:"",
                                rank:3, enemyLv:10, au:250, btn:[DungeonArea.月, new Rect(0.70, 0.6, 0.3, 0.1)],
                                treasures:  ()=>[Eq.魔法使いのミトン],
                                exItems:    ()=>[Eq.弓弓弓弓],
                                trendItems: ()=>[Item.テント木, Item.発砲ツル, Item.円形ハゲミミズの油],
                                beast:true,
        });}
        isVisible = ()=>Dungeon.聖なる洞窟.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.鬼火.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "ビッグファイヤー";
            e.prm(Prm.MAX_HP).base = 650;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.忍者.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "霊体オルガ";
            e.img = new Img("img/unit/orga.png");
            e.prm(Prm.MAX_HP).base = 800;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain16();
                
                DungeonArea.now = DungeonArea.中央島;
            }
        }
    };

    ///////////////////////////////////////////////////////////////////////
    //                                                                   //
    //                        古マーザン                                  //
    //                                                                   //
    ///////////////////////////////////////////////////////////////////////
    export const                         古マーザン森:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"古マーザン森", info:"",
                                rank:2, enemyLv:21, au:250, btn:[DungeonArea.古マーザン, new Rect(0.5, 0, 0.3, 0.1)],
                                treasures:  ()=>[Eq.魔ヶ玉],
                                exItems:    ()=>[Eq.水晶の指輪],
                                trendItems: ()=>[],
        });}
        isVisible = ()=>Dungeon.月狼の森.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.天使.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "朱雀";
            e.prm(Prm.MAX_HP).base = 700;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.天使.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影キキツキ";
            e.img = new Img("img/unit/kiki.png");
            e.prm(Prm.MAX_HP).base = 700;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain17();
            }
        }
    };
    export const                         魔鳥の岩壁:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"魔鳥の岩壁", info:"",
                                rank:4, enemyLv:23, au:300, btn:[DungeonArea.古マーザン, new Rect(0.7, 0.9, 0.3, 0.1)],
                                treasures:  ()=>[Eq.水晶の手首飾り],
                                exItems:    ()=>[Item.ホークマンの血],
                                trendItems: ()=>[],
        });}
        isVisible = ()=>Dungeon.古マーザン森.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.ホークマン.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "鳥人";
            e.prm(Prm.MAX_HP).base = 750;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.ホークマン.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "魔鳥ぱと";
            e.img = new Img("img/unit/hato.png");
            e.prm(Prm.MAX_HP).base = 800;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain18();

                Sound.lvup.play();
                Util.msg.set("パーティーメンバーの入れ替えができるようになった！"); await cwait();
            }
        }
    };
    export const                         精霊寺院跡:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"精霊寺院跡", info:"",
                                rank:6, enemyLv:25, au:350, btn:[DungeonArea.古マーザン, new Rect(0.1, 0.05, 0.3, 0.1)],
                                treasures:  ()=>[Eq.エスペラント],
                                exItems:    ()=>[Item.精霊使いの血],
                                trendItems: ()=>[Item.エレタの絵の具, Item.エレタクレヨン, Item.カンバス],
        });}
        isVisible = ()=>Dungeon.魔鳥の岩壁.dungeonClearCount > 0;
        setBossInner = ()=>{
            let e = Unit.enemies[0];
            Job.テンプルナイト.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "死せる住職";
            e.prm(Prm.MAX_HP).base = 750;
        };
        setExInner = ()=>{
            let e = Unit.enemies[0];
            Job.精霊使い.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "新王ブレッシュ";
            e.img = new Img("img/unit/bresh.png");
            e.prm(Prm.MAX_HP).base = 800;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story1.runMain19();
                
                Player.一号.member = false;
                Player.雪.member = false;
                for(let i = 0; i < Unit.players.length; i++){
                    Unit.setPlayer( i, Player.empty );
                }
                
                Player.ルイン.join();
                Player.ピアー.join();
                Player.ベガ.join();
                Player.luka.join();
            }
        }
    };
}

