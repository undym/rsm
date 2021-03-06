import { PUnit, Prm, Unit } from "./unit.js";
import { Tec, PassiveTec } from "./tec.js";
import { Job } from "./job.js";
import { Eq } from "./eq.js";
import { Img } from "./graphics/texture.js";
import { SaveData } from "./savedata.js";
import { Flag } from "./util.js";
import { Force, ForceIns, AUForce } from "./force.js";
import { Mix } from "./mix.js";


export abstract class Player implements ForceIns{
    private static _values:Player[] = [];
    static get values():ReadonlyArray<Player>{return this._values;}
    private static _valueOf = new Map<string,Player>();
    static valueOf(uniqueName:string):Player|undefined{return this._valueOf.get( uniqueName );}

    private _ins:PUnit;
    get ins(){
        if(!this._ins){
            this._ins = this.create();
        }
        return this._ins;
    }

    member = false;
    abstract readonly img:Img;

    constructor(readonly uniqueName:string, readonly sex:"♂"|"♀"){
        this.toString = ()=>this.uniqueName;

        Player._values.push(this);
        Player._valueOf.set( this.uniqueName, this );
    }
    
    abstract createInner(p:PUnit):void;
    abstract setJobChangeList(map:Map<Job,true>):void;
    abstract getSpecialInfo():string[];
    
    private forceIns:Force;
    get force(){return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this));}
    protected abstract createForce(_this:Player):Force;

    calcJobChangeList():Job[]{
        const map = new Map<Job,true>();
        this.setJobChangeList(map);
        const u = this.ins;

        return Job.values.filter(job=> map.has(job) || u.getJobLv(job) >= 1);
    }

    create():PUnit{
        let res = new PUnit(this);

        res.name = this.toString();
        res.exists = true;
        res.dead = false;

        this.createInner(res);

        res.prm(Prm.HP).base = res.prm(Prm.MAX_HP).total;

        res.tecs.filter(tec=> tec !== Tec.empty)
                .forEach(tec=> res.setMasteredTec(tec, true));


        return res;
    }
    /**プレイヤーの加入処理。 */
    join(){
        this.member = true;
        for(let i = 0; i < Unit.players.length; i++){
            if(Unit.players[i].player === Player.empty){
                Unit.setPlayer(i, this);
                break;
            }
        }
    }


}


//セーブデータの互換性のため、プレイヤーの定義の順番をかえてはいけない。
export namespace Player{
    export let jisrofUsedRamonsuisei = false;

    export const             empty = new class extends Player{
        constructor(){super("empty", "♂");}
        get img(){return Img.empty;}
        createInner(p:PUnit){
            p.exists = false;
        }
        setJobChangeList(map:Map<Job,true>){}
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             ルイン = new class extends Player{
        constructor(){super("ルイン", "♂");}

        private _img:Img;
        get img(){return this._img ? this._img : (this._img = new Img("img/unit/p_ruin.png"));}
        
        createInner(p:PUnit){
            p.job = Job.訓練生;
            p.prm(Prm.MAX_HP).base = 20;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 2;
            p.prm(Prm.STR).base = 3;

            p.tecs = [
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map:Map<Job,true>){setDefJobChangeList(map, this.ins);}
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             ピアー = new class extends Player{
        constructor(){super("ピアー", "♂");}
        
        private _img:Img;
        get img(){return this._img ? this._img : (this._img = new Img("img/unit/p_pea.png"));}
        
        createInner(p:PUnit){
            p.job = Job.魔法使い;
            p.prm(Prm.MAX_HP).base = 16;
            p.prm(Prm.MAX_MP).base = 4;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 1;
            p.prm(Prm.MAG).base = 4;
            
            p.tecs = [
                Tec.殴る,
                Tec.ヴァハ,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map:Map<Job,true>){
            map.set(Job.魔法使い, true);
            setDefJobChangeList(map, this.ins);
        }
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             一号 = new class extends Player{
        constructor(){super("一号", "♂");}
        
        private _img:Img;
        get img(){return this._img ? this._img : (this._img = new Img("img/unit/p_1.png"));}

        createInner(p:PUnit){
            p.job = Job.暗黒戦士;
            p.prm(Prm.MAX_HP).base = 30;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 2;
            p.prm(Prm.DRK).base = 5;

            p.tecs = [
                Tec.暗黒剣,
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map:Map<Job,true>){
            map.set(Job.暗黒戦士, true);
            setDefJobChangeList(map, this.ins);
        }
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             雪 = new class extends Player{
        private uma:Img;
        private hito:Img;

        constructor(){super("雪", "♂");}
        
        get img(){
            if(!this.uma){this.uma = Job.ペガサス.img;}
            if(!this.hito){this.hito = new Img("img/unit/p_yuki.png");}
            
            if(Flag.yuki_beastOnly.done){
                return this.uma;
            }else{
                return this.hito;
            }
        }

        createInner(p:PUnit){
            p.job = Job.鎖使い;
            p.prm(Prm.MAX_HP).base = 20;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 2;
            p.prm(Prm.STR).base = 1;
            p.prm(Prm.CHN).base = 6;

            p.tecs = [
                Tec.スネイク,
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];

            p.setEq(Eq.ハルのカフス.pos, Eq.ハルのカフス);
        }
        setJobChangeList(map:Map<Job,true>){
            if(Flag.yuki_beastOnly.done){
                map.set(Job.ペガサス, true);
                setBeastJobChangeList(map, this.ins);
            }else{
                map.set(Job.鎖使い, true);
                setDefJobChangeList(map, this.ins);
            }
        }
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             ベガ = new class extends Player{
        constructor(){super("ベガ", "♂");}
        
        private _img:Img;
        get img(){return this._img ? this._img : (this._img = new Img("img/unit/unit108.png"));}

        createInner(p:PUnit){
            p.job = Job.ドラゴン;
            p.prm(Prm.MAX_HP).base = 70;
            p.prm(Prm.MAX_MP).base = 0;
            p.prm(Prm.MAX_TP).base = 3;
            p.prm(Prm.STR).base = 8;

            p.tecs = [
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];

        }
        setJobChangeList(map:Map<Job,true>){
            // setDefJobChangeList(map, this.ins);
            map.set(Job.ドラゴン, true);
            setBeastJobChangeList(map, this.ins);
        }
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             luka = new class extends Player{
        constructor(){super("luka", "♀");}
        
        private _img:Img;
        get img(){return this._img ? this._img : (this._img = new Img("img/unit/p_luka.png"));}

        createInner(p:PUnit){
            p.job = Job.カウボーイ;
            p.prm(Prm.MAX_HP).base = 35;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 2;
            p.prm(Prm.GUN).base = 25;

            p.tecs = [
                Tec.撃つ,
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];

        }
        setJobChangeList(map:Map<Job,true>){
            setDefJobChangeList(map, this.ins);
        }
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             ジスロフ = new class extends Player{
        constructor(){super("ジスロフ", "♂");}
        
        private normal:Img;
        private ramon:Img;
        get img(){
            if(!this.normal){this.normal = new Img("img/unit/p_jisrof.png");}
            if(!this.ramon){this.ramon = new Img("img/unit/p_jisrof2.png");}

            if(Player.jisrofUsedRamonsuisei){return this.ramon;}
            return this.normal;
        }

        createInner(p:PUnit){
            p.job = Job.羅文騎士;
            p.prm(Prm.MAX_HP).base = 99;
            p.prm(Prm.MAX_MP).base = 5;
            p.prm(Prm.MAX_TP).base = 5;
            p.prm(Prm.STR).base = 20;
            p.prm(Prm.PST).base = 99;

            p.tecs = [
                Tec.殴る,
                Tec.インフレーション,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];

        }
        setJobChangeList(map:Map<Job,true>){
            map.set(Job.羅文騎士, true);
        }
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             ナナ = new class extends Player{
        constructor(){super("ナナ", "♂");}
        
        private _img:Img;
        get img(){return this._img ? this._img : (this._img = new Img("img/unit/p_nana.png"));}

        createInner(p:PUnit){
            p.job = Job.僧兵;
            p.prm(Prm.MAX_HP).base = 45;
            p.prm(Prm.MAX_MP).base = 7;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.MAG).base = 2;
            p.prm(Prm.LIG).base = 20;
            p.prm(Prm.PST).base = 1;

            p.tecs = [
                Tec.天籟,
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];

        }
        setJobChangeList(map:Map<Job,true>){
            map.set(Job.僧兵, true);
            setDefJobChangeList(map, this.ins);
        }
        createForce(_this:Player){return new class extends Force{

        };}
        getSpecialInfo(){return [];}
    };
    export const             白い鳥 = new class extends Player{
        constructor(){super("白い鳥", "♂");}
        
        private _img:Img;
        get img(){return this._img ? this._img : (this._img = new Img("img/unit/unit118.png"));}

        createInner(p:PUnit){
            p.job = Job.鳥;
            p.prm(Prm.MAX_HP).base = 75;
            p.prm(Prm.MAX_MP).base = 3;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 2;
            p.prm(Prm.LIG).base = 5;
            p.prm(Prm.DRK).base = 2;
            p.prm(Prm.ARR).base = 35;

            p.tecs = [
                Tec.ホワイトランス,
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];

        }
        setJobChangeList(map:Map<Job,true>){
            map.set(Job.鳥, true);
            if(this.ins.isMasteredJob(Job.鳥)){
                map.set(Job.カリストコウモリ, true);
                if(this.ins.isMasteredJob(Job.カリストコウモリ)){
                    map.set(Job.雷鳥, true);
                    if(this.ins.isMasteredJob(Job.雷鳥)){map.set(Job.エルフ, true);}
                    map.set(Job.魔獣ドンゴ, true);
                    if(this.ins.isMasteredJob(Job.魔獣ドンゴ)){map.set(Job.朱雀, true);}
                }
            }
        }
        createForce(_this:Player){return new class extends Force{
            async walk(unit:Unit, au:AUForce){
                if(Mix.飛行.count > 0 && au.add > 0 && Math.random() < 0.3){au.add += 1;}
                if(Mix.飛行2.count > 0 && au.add > 0 && Math.random() < 0.3){au.add += 1;}
            }
        };}
        getSpecialInfo(){
            const res:string[] = [];
            if(Mix.飛行.count > 0){res.push("進む時稀に+1");}
            if(Mix.飛行2.count > 0){res.push("進む時稀に+1");}
            return res;
        }
    };
    export const             真夜 = new class extends Player{
        constructor(){super("真夜", "♂");}
        
        private _img:Img;
        get img(){return this._img ? this._img : (this._img = new Img("img/unit/p_maya.png"));}

        createInner(p:PUnit){
            p.job = Job.魔剣士;
            p.prm(Prm.MAX_HP).base = 30;
            p.prm(Prm.MAX_MP).base = 18;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 25;
            p.prm(Prm.MAG).base = 25;

            p.tecs = [
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];

        }
        setJobChangeList(map:Map<Job,true>){
            map.set(Job.魔剣士, true);
        }
        createForce(_this:Player){return new class extends Force{
        };}
        getSpecialInfo(){
            const res:string[] = [];
            return res;
        }
    };
}


const setDefJobChangeList = (map:Map<Job,true>, u:PUnit):void=>{

    const add = (addJob:Job, checkJobs:Job[]):void=>{
        for(const job of checkJobs){
            if(!u.isMasteredJob(job)){
                return;
            }
        }

        map.set(addJob, true);
    }

    map.set(Job.訓練生, true);
    
    add(Job.訓練生二年生, [Job.訓練生]);
        add(Job.格闘家, [Job.訓練生二年生]);
            add(Job.体術士, [Job.格闘家, Job.テンプルナイト, Job.ホークマン]);
        add(Job.シーフ, [Job.訓練生二年生]);
            add(Job.考古学者, [Job.シーフ, Job.ダウザー]);
                add(Job.密猟ハンター, [Job.考古学者, Job.カウボーイ]);
    add(Job.剣士, [Job.訓練生]);
        add(Job.忍者, [Job.剣士, Job.シーフ]);
        if(u.player.sex === "♂"){
            add(Job.侍, [Job.剣士, Job.格闘家]);
                add(Job.勇者, [Job.忍者, Job.テンプルナイト, Job.侍, Job.ガーディアン, Job.ホークマン]);
        }
    add(Job.魔法使い, [Job.訓練生]);
        add(Job.ウィザード, [Job.魔法使い]);
            add(Job.メイガス, [Job.ウィザード, Job.精霊使い]);
            add(Job.アルケミスト, [Job.ウィザード, Job.考古学者]);
                add(Job.エスパー, [Job.アルケミスト]);
    add(Job.天使, [Job.訓練生]);
        add(Job.テンプルナイト, [Job.天使, Job.訓練生二年生]);
        add(Job.ガーディアン, [Job.天使, Job.精霊使い]);
        add(Job.医師, [Job.天使]);
    add(Job.毒使い, [Job.訓練生]);
        add(Job.落武者, [Job.毒使い, Job.侍, Job.霊術戦士]);
    add(Job.鎖使い, [Job.訓練生]);
        add(Job.スネイカー, [Job.鎖使い]);
    add(Job.ダウザー, [Job.訓練生]);
    add(Job.カウボーイ, [Job.訓練生]);
        add(Job.魔砲士, [Job.カウボーイ, Job.魔法使い]);
            add(Job.霊弾の射手, [Job.魔砲士, Job.霊術戦士]);
        add(Job.機械士, [Job.カウボーイ]);
            add(Job.ロボット, [Job.機械士]);
            add(Job.ミサイリスト, [Job.機械士, Job.魔砲士]);
                add(Job.軍人, [Job.ミサイリスト, Job.考古学者]);
    add(Job.アーチャー, [Job.訓練生]);
        add(Job.クピド, [Job.アーチャー, Job.格闘家]);
};

const setBeastJobChangeList = (map:Map<Job,true>, u:PUnit)=>{
    
    const add = (addJob:Job, checkJobs:Job[]):void=>{
        for(const job of checkJobs){
            if(!u.isMasteredJob(job)){
                return;
            }
        }

        map.set(addJob, true);
    }

    add(Job.アメーバ, [Job.ドラゴン]);
        add(Job.鬼火, [Job.アメーバ]);
        add(Job.チルナノーグ, [Job.アメーバ]);
            add(Job.ブルージェリー, [Job.チルナノーグ]);
                add(Job.ブラッド, [Job.ブルージェリー, Job.カリストコウモリ]);
        add(Job.アングラ, [Job.アメーバ, Job.魔獣ドンゴ]);
            add(Job.お化け, [Job.アングラ, Job.妖精, Job.アイス]);
    add(Job.ノーム, [Job.ドラゴン]);
        add(Job.妖精, [Job.ノーム]);
            add(Job.エルフ, [Job.妖精]);
        add(Job.アイス, [Job.ノーム, Job.チルナノーグ]);
    add(Job.カリストコウモリ, [Job.ドラゴン]);
        add(Job.雷鳥, [Job.カリストコウモリ]);
            add(Job.魔獣ドンゴ, [Job.雷鳥]);
                add(Job.月狼, [Job.魔獣ドンゴ]);        
                    add(Job.朱雀, [Job.月狼, Job.お化け]);
};