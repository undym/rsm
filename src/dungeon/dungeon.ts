
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
            btn:[DungeonArea, Rect]
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



export class DungeonArea{
    private static _valueOf = new Map<string,DungeonArea>();
    static valueOf(uniqueName:string){return this._valueOf.get(uniqueName);}

    static now:DungeonArea;
    // private static _values:DungeonArea[] = [];
    // static get values():ReadonlyArray<DungeonArea>{return this._values;}
    private _img:Img;
    get img(){return this._img ? this._img : (this._img = new Img(this.imgSrc, {lazyLoad:false}));}

    get areaMoveBtns():{to:DungeonArea, bounds:Rect, isVisible:()=>boolean}[]{
        const res:{to:DungeonArea, bounds:Rect, isVisible:()=>boolean}[] = [];
        for(const set of this._areaMoveBtns()){
            res.push({to:set[0], bounds:set[1], isVisible:set[2]});
        }
        return res;
    }

    constructor(readonly uniqueName:string, private imgSrc:string, private _areaMoveBtns:()=>[DungeonArea, Rect, ()=>boolean][]){
        DungeonArea._valueOf.set(uniqueName, this);
    }

    toString(){return this.uniqueName;}
}
export namespace DungeonArea{
    export const 中央島 =    new DungeonArea("中央島", "img/area_中央島.jpg",
                                ()=>[
                                    [DungeonArea.黒地域, new Rect(0.7, 0.4, 0.3, 0.1), ()=>Dungeon.黒平原.isVisible()],
                                ]
                            );
    export const 黒地域 =    new DungeonArea("黒地域", "img/area_黒地域.jpg",
                                ()=>[
                                    [DungeonArea.中央島, new Rect(0.0, 0.4, 0.3, 0.1), ()=>true],
                                ]
                            );
}

export namespace Dungeon{

    ///////////////////////////////////////////////////////////////////////
    //                                                                   //
    //                            中央島                                 //
    //                                                                   //
    ///////////////////////////////////////////////////////////////////////
    export const                         再構成トンネル:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"再構成トンネル",
                                rank:0, enemyLv:1, au:50, btn:[DungeonArea.中央島, new Rect(0.1, 0.1, 0.3, 0.1)],
                                treasures:  ()=>[Eq.安全靴],
                                exItems:    ()=>[Eq.アカデミーバッヂ],
                                trendItems: ()=>[Item.石, Item.杉, Item.ヒノキ],
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
                await Story.runMain1();
            }
            if(Item.脱出ポッド.totalGetCount === 0){
                Item.脱出ポッド.add(1); await wait();
                Util.msg.set("[お店]が出現した", Color.PINK.bright); await cwait();
            }
        }
    };
    export const                         見知らぬ海岸:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"見知らぬ海岸",
                                rank:0, enemyLv:3, au:60, btn:[DungeonArea.中央島, new Rect(0.2, 0.2, 0.3, 0.1)],
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
                await Story.runMain2();
            }
            if(Item.動かない映写機.totalGetCount === 0){
                Item.動かない映写機.add(1); await wait();
            }
        }
    };
    export const                         はじまりの丘:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"はじまりの丘",
                                rank:1, enemyLv:4, au:100, btn:[DungeonArea.中央島, new Rect(0.7, 0.15, 0.3, 0.1)],
                                treasures:  ()=>[Eq.オールマント],
                                exItems:    ()=>[Eq.ライダーベルト],
                                trendItems: ()=>[Item.肉, Item.竹, Item.砂],
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
                await Story.runMain3();
            }
        }
    };
    export const                         予感の街レ:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"予感の街・レ",
                                rank:0, enemyLv:9, au:70, btn:[DungeonArea.中央島, new Rect(0.7, 0.7, 0.3, 0.1)],
                                treasures:  ()=>[Eq.ミルテの棍],
                                exItems:    ()=>[Eq.いばらの鎧],
                                trendItems: ()=>[Item.粘土, Item.土, Item.ガラス],
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
            Job.訓練生.setEnemy(e, e.prm(Prm.LV).base);
            e.name = "幻影リリア";
            e.img = new Img("img/unit/riria.png");
            e.prm(Prm.MAX_HP).base = 120;
        };
        async dungeonClearEvent(){
            await super.dungeonClearEvent();
            if(this.dungeonClearCount === 1){
                await Story.runMain4();
            }
        }
    };
    export const                         水の都イス:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"水の都・イス",
                                rank:2, enemyLv:14, au:60, btn:[DungeonArea.中央島, new Rect(0.7, 0.8, 0.3, 0.1)],
                                treasures:  ()=>[Eq.レティシアsガン],
                                exItems:    ()=>[Eq.月代],
                                trendItems: ()=>[Item.水, Item.イズミミズ, Item.ジェリーの粘液, Item.精霊の涙],
        });}
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
                await Story.runMain7();
            }
        }
    };
    export const                         リテの門:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"リ・テの門",
                                rank:2, enemyLv:16, au:200, btn:[DungeonArea.中央島, new Rect(0, 0.75, 0.3, 0.1)],
                                treasures:  ()=>[Eq.忍者ソード],
                                exItems:    ()=>[Eq.反精霊の盾],
                                trendItems: ()=>[Item.ファーストキス, Item.エレタクレヨン],
        });}
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
                await Story.runMain8();
            }
        }
    };
    export const                         クラウンボトル:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"クラウンボトル",
                                rank:3, enemyLv:20, au:300, btn:[DungeonArea.中央島, new Rect(0.15, 0.65, 0.3, 0.1)],
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
                await Story.runMain11();
            }
        }
    };

    ///////////////////////////////////////////////////////////////////////
    //                                                                   //
    //                            黒地域                                 //
    //                                                                   //
    ///////////////////////////////////////////////////////////////////////
    export const                         黒平原:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"黒平原",
                                rank:0, enemyLv:10, au:100, btn:[DungeonArea.黒地域, new Rect(0.7, 0.5, 0.3, 0.1)],
                                treasures:  ()=>[Eq.魔性のマント],
                                exItems:    ()=>[Eq.妖魔の手],
                                trendItems: ()=>[Item.バッタ, Item.クワ],
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
                await Story.runMain5();
            }
        }
    };
    export const                         黒い丘:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"黒い丘",
                                rank:1, enemyLv:12, au:200, btn:[DungeonArea.黒地域, new Rect(0.2, 0.6, 0.3, 0.1)],
                                treasures:  ()=>[Eq.魔ヶ玉の手首飾り],
                                exItems:    ()=>[Eq.無色の靴],
                                trendItems: ()=>[Item.鉄, Item.銅, Item.バーミキュライト],
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
                await Story.runMain6();
            }
        }
    };
    export const                         黒遺跡:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"黒遺跡",
                                rank:2, enemyLv:18, au:250, btn:[DungeonArea.黒地域, new Rect(0.55, 0.3, 0.3, 0.1)],
                                treasures:  ()=>[Eq.ダークネスロード],
                                exItems:    ()=>[Item.ヴァンパイアの血],
                                trendItems: ()=>[Item.黒色のまぼろし, Item.エレタの絵の具, Item.桐, Item.桜],
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
                await Story.runMain9();
            }
        }
    };
    export const                         黒の廃村:Dungeon = new class extends Dungeon{
        constructor(){super({uniqueName:"黒の廃村",
                                rank:3, enemyLv:19, au:350, btn:[DungeonArea.黒地域, new Rect(0.55, 0.9, 0.3, 0.1)],
                                treasures:  ()=>[Eq.機工の指輪],
                                exItems:    ()=>[Item.霊術戦士の血],
                                trendItems: ()=>[Item.ロウ, Item.桐],
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
                await Story.runMain10();
            }
        }
    };
}

