import { Force, Dmg, Action, PhaseStartForce } from "./force.js";
import { Unit, Prm, PUnit } from "./unit.js";
import { Num, Mix } from "./mix.js";
import { Item } from "./item.js";
import { ActiveTec, TecType, Tec } from "./tec.js";
import { Condition } from "./condition.js";
import { Util, PlayData } from "./util.js";
import { Battle } from "./battle.js";
import { choice } from "./undym/random.js";
import { wait } from "./undym/scene.js";
import { SaveData } from "./savedata.js";
import { Player } from "./player.js";
import { Sound } from "./sound.js";


export class EqPos{
    private static _values:EqPos[] = [];
    static get values():ReadonlyArray<EqPos>{return this._values;}

    private static ordinalNow = 0;

    private _eqs:Eq[];
    get eqs():ReadonlyArray<Eq>{
        if(!this._eqs){
            this._eqs = Eq.values.filter(eq=> eq.pos === this);
        }
        return this._eqs;
    }

    readonly ordinal:number;

    private constructor(name:string){
        this.toString = ()=>name;

        this.ordinal = EqPos.ordinalNow++;

        EqPos._values.push(this);
    }

    static readonly 頭 = new EqPos("頭");
    static readonly 武 = new EqPos("武");
    static readonly 盾 = new EqPos("盾");
    static readonly 体 = new EqPos("体");
    static readonly 腰 = new EqPos("腰");
    static readonly 手 = new EqPos("手");
    static readonly 指 = new EqPos("指");
    static readonly 脚 = new EqPos("脚");
}


export abstract class Eq extends Force implements Num{
    static readonly NO_APPEAR_LV = -1;

    private static _values:Eq[] = [];
    static get values():ReadonlyArray<Eq>{return this._values;}

    private static _valueOf = new Map<string,Eq>();
    static valueOf(uniqueName:string):Eq|undefined{
        return this._valueOf.get(uniqueName);
    }

    private static _posValues:Map<EqPos,Eq[]>;
    static posValues(pos:EqPos):ReadonlyArray<Eq>{
        if(!this._posValues){
            this._posValues = new Map<EqPos,Eq[]>();

            for(let p of EqPos.values){
                this._posValues.set(p, []);
            }

            for(let eq of this.values){
                (this._posValues.get(eq.pos) as Eq[]).push(eq);
            }
        }
        return this._posValues.get(pos) as Eq[];
    }

    /**各装備箇所のデフォルト装備を返す.*/
    static getDef(pos:EqPos):Eq{
        if(pos === EqPos.頭){return this.髪;}
        if(pos === EqPos.武){return this.恋人;}
        if(pos === EqPos.盾){return this.板;}
        if(pos === EqPos.体){return this.襤褸切れ;}
        if(pos === EqPos.腰){return this.ひも;}
        if(pos === EqPos.手){return this.手;}
        if(pos === EqPos.指){return this.肩身の指輪;}
        if(pos === EqPos.脚){return this.きれいな靴;}

        return this.髪;
    }

    static rnd(pos:EqPos, lv:number):Eq{
        const _posValues = this.posValues(pos);

        for(let i = 0; i < 8; i++){
            const eq = choice( _posValues );
            if(eq.appearLv !== this.NO_APPEAR_LV && eq.appearLv <= lv){return eq;}
        }
        return this.getDef(pos);
    }

    get uniqueName():string{return this.args.uniqueName;}
    get info():string      {return this.args.info;}
    get pos():EqPos        {return this.args.pos;}
    /**敵が装備し始めるレベル. */
    get appearLv():number  {return this.args.lv;}

    num = 0;
    totalGetCount = 0;
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    protected constructor(
        private args:{
            uniqueName:string,
            info:string,
            pos:EqPos,
            lv:number,
        }
    ){
        super();
        Eq._values.push(this);
        Eq._valueOf.set( args.uniqueName, this );
    }


    toString(){return this.args.uniqueName;}
    

    add(v:number){
        Num.add(this, v);

        PlayData.gotAnyEq = true;
    }
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
}


export class EqEar extends Force implements Num{
    private static _values:EqEar[] = [];
    static get values():EqEar[]{return this._values;}

    private static _valueOf = new Map<string,EqEar>();
    static valueOf(uniqueName:string):EqEar|undefined{
        return this._valueOf.get(uniqueName);
    }

    static getDef():EqEar{return EqEar.耳たぶ;}

    get uniqueName():string{return this.args.uniqueName;}
    get info():string      {return this.args.info;}
    /**敵が装備し始めるレベル. */
    get appearLv():number  {return this.args.lv;}

    num = 0;
    totalGetCount = 0;
    //--------------------------------------------------------------------------
    //
    //
    //
    //--------------------------------------------------------------------------
    protected constructor(
        private args:{
            uniqueName:string,
            info:string,
            lv:number,
        }
    ){
        super();
        EqEar._values.push(this);
        EqEar._valueOf.set( args.uniqueName, this );
    }
    
    toString(){return this.args.uniqueName;}
    
    add(v:number){
        Num.add(this, v);

        PlayData.gotAnyEq = true;
    }
}



export namespace Eq{
    //--------------------------------------------------------------------------
    //
    //頭
    //
    //--------------------------------------------------------------------------
    export const                         髪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"髪", info:"はげてない、まだはげてない", 
                                pos:EqPos.頭, lv:0});}
    }
    export const                         月代:Eq = new class extends Eq{
        constructor(){super({uniqueName:"月代", info:"「斬る」威力+25%", 
                                pos:EqPos.頭, lv:0});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action === ActiveTec.斬る){
                dmg.pow.mul *= 1.25;
            }
        }   
    }
    // export const                         魔女のとんがり帽:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"魔女のとんがり帽", info:"最大MP+10", 
    //                             pos:EqPos.頭, lv:3});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_MP).eq += 10;
    //     }
    // }
    // export const                         山男のとんかつ帽:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"山男のとんかつ帽", info:"最大TP+10", 
    //                             pos:EqPos.頭, lv:3});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_TP).eq += 10;
    //     }
    // }
    // export const                         千里ゴーグル:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"千里ゴーグル", info:"銃・弓攻撃時稀にクリティカル", 
    //                             pos:EqPos.頭, lv:120});}
    //     beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type.any(TecType.格闘) && Math.random() < 0.2){
    //             Util.msg.set("＞千里ゴーグル");
    //             dmg.pow.mul *= 1.5;
    //         }
    //     }   
    // }
    // export const                         勾玉:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"勾玉", info:"", 
    //                             pos:EqPos.頭, lv:Eq.NO_APPEAR_LV});}
    // }
    // export const                         メガネ:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"メガネ", info:"", 
    //                             pos:EqPos.頭, lv:Eq.NO_APPEAR_LV});}
    // }
    // export const                         マーザンの角:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"マーザンの角", info:"防御値+200", 
    //                             pos:EqPos.頭, lv:30});}
    //     beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         dmg.def.add += 200;
    //     }
    // }
    //--------------------------------------------------------------------------
    //
    //武
    //
    //--------------------------------------------------------------------------
    export const                         恋人:Eq = new class extends Eq{
        constructor(){super({uniqueName:"恋人", info:"",
                                pos:EqPos.武, lv:0});}
    }
    export const                         ミルテの棍:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ミルテの棍", info:"攻撃時、確率でHP+5%",
                                pos:EqPos.武, lv:5});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(Math.random() < 0.8){
                Unit.healHP( attacker, 1 + attacker.prm(Prm.MAX_HP).total * 0.05 );
            }
        }
    }
    export const                         レティシアsガン:Eq = new class extends Eq{
        constructor(){super({uniqueName:"レティシアsガン", info:"銃攻撃時、稀に相手を＜防↓＞化",
                                pos:EqPos.武, lv:5});}
        toString(){return "レティシア'sガン";}
        async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃) && Math.random() < 0.7){
                Unit.setCondition( target, Condition.防御低下, 1 );
            }
        }
    }
    /**リテの門財宝. */
    export const                         忍者ソード:Eq = new class extends Eq{
        constructor(){super({uniqueName:"忍者ソード", info:"格闘攻撃時、稀に追加攻撃",
                                pos:EqPos.武, lv:105});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘) && Math.random() < 0.75){
                dmg.additionalAttacks.push((dmg,i)=>{
                    return dmg.result.value / 2;
                });
            }
        }
    }
    /**クラウンボトルEX. */
    export const                         コスモガン:Eq = new class extends Eq{
        constructor(){super({uniqueName:"コスモガン", info:"銃攻撃時稀に追加攻撃",
                                pos:EqPos.武, lv:95});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any( TecType.銃 ) && dmg.result.isHit && Math.random() < 0.5){
                dmg.additionalAttacks.push((dmg,i)=>{
                    return dmg.result.value / 2;
                });
            }
        }
    }
    /**クラウンボトル財宝. */
    export const                         呪縛の弓矢:Eq = new class extends Eq{
        constructor(){super({uniqueName:"呪縛の弓矢", info:"弓攻撃時、稀に相手を＜鎖＞化",
                                pos:EqPos.武, lv:95});}
        async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any( TecType.弓 ) && dmg.result.isHit && Math.random() < 0.5){
                Unit.setCondition(target, Condition.鎖, 1); await wait();
            }
        }
    }
    /**テント樹林EX. */
    export const                         アリランナイフ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アリランナイフ", info:"攻撃時、稀に相手を＜毒＞化",
                                pos:EqPos.武, lv:95});}
        async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && dmg.result.isHit && Math.random() < 0.8){
                Sound.awa.play();
                const value = attacker.prm(Prm.DRK).total + 1;
                Unit.setCondition(target, Condition.毒, value); await wait();
            }
        }
    }
    //--------------------------------------------------------------------------
    //
    //盾
    //
    //--------------------------------------------------------------------------
    export const                         板:Eq = new class extends Eq{
        constructor(){super({uniqueName:"板", info:"",
                                pos:EqPos.盾, lv:0});}
    }
    export const                         銅板:Eq = new class extends Eq{
        constructor(){super({uniqueName:"銅板", info:"防御値+100",
                                pos:EqPos.盾, lv:12});}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            dmg.def.add += 100;
        }
    }
    /**リテの門EX. */
    export const                         反精霊の盾:Eq = new class extends Eq{
        constructor(){super({uniqueName:"反精霊の盾", info:"防御値+200",
                                pos:EqPos.盾, lv:52});}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            dmg.def.add += 200;
        }
    }
    //--------------------------------------------------------------------------
    //
    //体
    //
    //--------------------------------------------------------------------------
    export const                         襤褸切れ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"襤褸切れ", info:"",
                                pos:EqPos.体, lv:0});}
    }
    export const                         草の服:Eq = new class extends Eq{
        constructor(){super({uniqueName:"草の服", info:"最大HP+20",
                                pos:EqPos.体, lv:15});}
        async equip(unit:Unit){unit.prm(Prm.MAX_HP).eq += 20;}
    }
    /**はじまりの丘財宝. */
    export const                         オールマント:Eq = new class extends Eq{
        constructor(){super({uniqueName:"オールマント", info:"全ステータス+20",
                                pos:EqPos.体, lv:55});}
        async equip(unit:Unit){
            [Prm.STR, Prm.MAG, Prm.LIG, Prm.DRK, Prm.CHN, Prm.PST, Prm.GUN, Prm.ARR].forEach(prm=> unit.prm(prm).eq += 20);
        }
    }
    /**予感の街レEX. */
    export const                         いばらの鎧:Eq = new class extends Eq{
        constructor(){super({uniqueName:"いばらの鎧", info:"被格闘攻撃時、稀に格闘反撃",
                                pos:EqPos.体, lv:55});}
        async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘) && !dmg.counter && Math.random() < 0.4){
                await Tec.格闘カウンター.run(target, attacker);
            }
        }
    }
    /**黒平原財宝. */
    export const                         魔性のマント:Eq = new class extends Eq{
        constructor(){super({uniqueName:"魔性のマント", info:"被攻撃時、MP+1",
                                pos:EqPos.体, lv:15});}
        async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec){
                target.mp++;
            }
        }
    }
    /**黒遺跡財宝. */
    export const                         ダークネスロード:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ダークネスロード", info:"攻撃倍率+10%　防御倍率-20%",
                                pos:EqPos.体, lv:35});}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            dmg.def.mul *= 0.8;
        }
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            dmg.pow.mul *= 1.1;
        }
    }
    /**トトの郊外EX. */
    export const                         猛者の鎧:Eq = new class extends Eq{
        constructor(){super({uniqueName:"猛者の鎧", info:"格闘攻撃+15%　被格闘攻撃+15%",
                                pos:EqPos.体, lv:35});}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                dmg.def.mul *= 1.15;
            }
        }
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                dmg.def.mul *= 1.15;
            }
        }
    }
    /**テント樹林財宝. */
    export const                         鎖のマント:Eq = new class extends Eq{
        constructor(){super({uniqueName:"鎖のマント", info:"鎖術攻撃+20%",
                                pos:EqPos.体, lv:15});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.鎖術)){
                dmg.def.mul *= 1.20;
            }
        }
    }
    /**聖なる洞窟EX. */
    export const                         ルナローブ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ルナローブ", info:"行動開始時TP+1",
                                pos:EqPos.体, lv:25});}
        async phaseStart(unit:Unit, pForce:PhaseStartForce){
            Unit.healTP(unit, 1);
        }
    }
    /**月狼の森. */
    export const                         弓弓弓弓:Eq = new class extends Eq{
        constructor(){super({uniqueName:"弓弓弓弓", info:"弓攻撃命中率+20%",
                                pos:EqPos.体, lv:85});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.弓)){
                dmg.hit.mul *= 1.2;
            }
        }
    }
    //--------------------------------------------------------------------------
    //
    //腰
    //
    //--------------------------------------------------------------------------
    export const                         ひも:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ひも", info:"",
                                pos:EqPos.腰, lv:0});}
    }
    export const                         ライダーベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ライダーベルト", info:"攻撃+10",
                                pos:EqPos.腰, lv:35});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            dmg.pow.add += 10;
        }
    }
    export const                         チェーンベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"チェーンベルト", info:"攻撃時極稀に相手を＜鎖＞化",
                                pos:EqPos.腰, lv:300});}
        async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(Math.random() < 0.1){
                Util.msg.set("＞チェーンベルト");
                Unit.setCondition( target, Condition.鎖, 1 );
            }
        }
    }
    export const                         アンパストベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アンパストベルト", info:"過去攻撃を稀に無効化",
                                pos:EqPos.腰, lv:300});}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.過去) && Math.random() < 0.33){
                Util.msg.set("＞アンパストベルト");
                dmg.pow.base = 0;
            }
        }
    }
    //--------------------------------------------------------------------------
    //
    //手
    //
    //--------------------------------------------------------------------------
    export const                         手:Eq = new class extends Eq{
        constructor(){super({uniqueName:"手", info:"",
                                pos:EqPos.手, lv:0});}
    }
    /**黒平原EX. */
    export const                         妖魔の手:Eq = new class extends Eq{
        constructor(){super({uniqueName:"妖魔の手", info:"被魔法・過去攻撃時、稀に魔法反撃",
                                pos:EqPos.手, lv:65});}
        async afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.過去) && !dmg.counter && Math.random() < 0.7){
                await Tec.魔法カウンター.run(target, attacker);
            }
        }
    }
    /**黒い丘財宝. */
    export const                         魔ヶ玉の手首飾り:Eq = new class extends Eq{
        constructor(){super({uniqueName:"魔ヶ玉の手首飾り", info:"毎ターンMP+1",
                                pos:EqPos.手, lv:55});}
        async phaseStart(unit:Unit){
            Unit.healMP( unit, 1 );
        }
    }
    /**雪の初期装備. */
    export const                         ハルのカフス:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ハルのカフス", info:"毎ターンTP+1　雪以外が装備するとダメージ",
                                pos:EqPos.手, lv:65});}
        async phaseStart(unit:Unit){
            Unit.healTP( unit, 1 );

            if(unit instanceof PUnit && unit.player !== Player.雪){
                await unit.doDmg(new Dmg({absPow:unit.prm(Prm.MAX_HP).total * 0.1})); await wait();
            }
        }
    }
    /**月狼の森. */
    export const                         魔法使いのミトン:Eq = new class extends Eq{
        constructor(){super({uniqueName:"魔法使いのミトン", info:"魔法・過去攻撃+10",
                                pos:EqPos.手, lv:70});}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.過去)){
                dmg.abs.add += 10;
            }
        }
    }
    /**魔鳥の岩壁財宝. */
    export const                         水晶の手首飾り:Eq = new class extends Eq{
        constructor(){super({uniqueName:"水晶の手首飾り", info:"最大HP+50　行動開始時HP+1%",
                                pos:EqPos.手, lv:99});}
        async equip(unit:Unit){
            unit.prm(Prm.MAX_HP).eq += 50;
        }
        async phaseStart(unit:Unit){
            Unit.healHP(unit, unit.prm(Prm.HP).total * 0.01 + 1 );
        }
    }
    //--------------------------------------------------------------------------
    //
    //指
    //
    //--------------------------------------------------------------------------
    export const                         肩身の指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"肩身の指輪", info:"",
                                pos:EqPos.指, lv:0});}
    }
    export const                         アカデミーバッヂ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アカデミーバッヂ", info:"全ステータス+10",
                                pos:EqPos.指, lv:30});}
        async equip(u:Unit){
            [Prm.STR, Prm.MAG, Prm.LIG, Prm.DRK, Prm.CHN, Prm.PST, Prm.GUN, Prm.ARR].forEach(prm=> u.prm(prm).eq += 10);
        }
    }
    export const                         機工の指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"機工の指輪", info:"銃攻撃+20%",
                                pos:EqPos.指, lv:1});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.銃)){
                dmg.pow.mul *= 1.2;
            }
        }
    }
    export const                         アメーバリング:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アメーバリング", info:"被魔法・神格・過去攻撃-20%",
                                pos:EqPos.指, lv:40});}
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.魔法, TecType.神格, TecType.過去)){
                dmg.pow.mul *= 0.8;
            }
        }
    }
    /**古マーザン森財宝. */
    export const                         魔ヶ玉:Eq = new class extends Eq{
        constructor(){super({uniqueName:"魔ヶ玉", info:"行動開始時MP+1",
                                pos:EqPos.指, lv:98});}
        async phaseStart(unit:Unit){
            Unit.healMP(unit, 1 );
        }
    }
    /**古マーザン森EX. */
    export const                         水晶の指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"水晶の指輪", info:"行動開始時HP+5%",
                                pos:EqPos.指, lv:97});}
        async phaseStart(unit:Unit){
            Unit.healHP(unit, unit.prm(Prm.HP).total * 0.05 + 1 );
        }
    }
    // export const                         瑠璃:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"瑠璃", info:"戦闘開始時TP+10%",
    //                             pos:EqPos.指, lv:50});}
    //     battleStart(unit:Unit){
    //         Unit.healTP(unit, unit.prm(Prm.MAX_TP).total * 0.1 + 1);
    //     }
    // }
    // export const                         キャットネイル:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"キャットネイル", info:"攻撃時追加攻撃",
    //                             pos:EqPos.指, lv:50});}
    //     async afterDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && dmg.result.isHit){
    //             dmg.additinalAttacks.push((dmg,index)=>{
    //                 return dmg.result.value / (index + 2);
    //             });
    //         }
    //     }
    // }
    //--------------------------------------------------------------------------
    //
    //脚
    //
    //--------------------------------------------------------------------------
    export const                         きれいな靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"きれいな靴", info:"",
                                pos:EqPos.脚, lv:0});}
    }
    export const                         安全靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"安全靴", info:"戦闘開始時<盾>化",
                                pos:EqPos.脚, lv:10});}
        async battleStart(unit:Unit){
            unit.setCondition( Condition.盾, 1 );
        }
    }
    export const                         無色の靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"無色の靴", info:"格闘攻撃+20%",
                                pos:EqPos.脚, lv:15});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.格闘)){
                dmg.pow.mul *= 1.2;
            }
        }
    }
    /**トトの郊外財宝. */
    export const                         悪夢:Eq = new class extends Eq{
        constructor(){super({uniqueName:"悪夢", info:"過去攻撃+20%　被過去攻撃+20%",
                                pos:EqPos.脚, lv:0});}
        async beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.過去)){
                dmg.pow.mul *= 1.2;
            }
        }
        async beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
            if(action instanceof ActiveTec && action.type.any(TecType.過去)){
                dmg.pow.mul *= 1.2;
            }
        }
    }
    // export const                         安全靴:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"安全靴", info:"被攻撃時稀に<盾>化",
    //                             pos:EqPos.脚, lv:40});}
    //     afterBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec && action.type !== TecType.状態 && Math.random() < 0.6){
    //             Unit.setCondition(target, Condition.盾, 1);
    //         }
    //     }
    // }
    // export const                         鉄下駄:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"鉄下駄", info:"攻撃命中率x0.9 防御値x2",
    //                             pos:EqPos.脚, lv:21});}
    //     beforeBeAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec){
    //             dmg.def.mul *= 2;
    //         }
    //     }
    //     beforeDoAtk(action:Action, attacker:Unit, target:Unit, dmg:Dmg){
    //         if(action instanceof ActiveTec){
    //             dmg.hit.mul *= 0.9;
    //         }
    //     }
    // }
}

//耳は全て店売りにする
export namespace EqEar{
    export const                         耳たぶ:EqEar = new class extends EqEar{
        constructor(){super({uniqueName:"耳たぶ", info:"", lv:0});}
    }
    // export const                         おにく:EqEar = new class extends EqEar{//店
    //     constructor(){super({uniqueName:"おにく", info:"最大HP+29", lv:29});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_HP).eq += 29;
    //     }
    // }
    // export const                         水晶のピアス:EqEar = new class extends EqEar{//店
    //     constructor(){super({uniqueName:"水晶のピアス", info:"行動開始時HP+1%", lv:29});}
    //     phaseStart(unit:Unit){
    //         Unit.healHP( unit, unit.prm(Prm.MAX_HP).total * 0.01 + 1 );
    //     }
    // }
    // export const                         魔ヶ玉のピアス:EqEar = new class extends EqEar{//店
    //     constructor(){super({uniqueName:"魔ヶ玉のピアス", info:"最大MP+10", lv:29});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_MP).eq += 10;
    //     }
    // }
    // export const                         エメラルドのピアス:EqEar = new class extends EqEar{//店
    //     constructor(){super({uniqueName:"エメラルドのピアス", info:"最大TP+10", lv:29});}
    //     equip(unit:Unit){
    //         unit.prm(Prm.MAX_TP).eq += 10;
    //     }
    // }
}