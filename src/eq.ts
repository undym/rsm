import { Force, Dmg, Action, PhaseStartForce, AttackNumForce, ForceIns, Heal } from "./force.js";
import { Unit, Prm, PUnit } from "./unit.js";
import { Num, Mix } from "./mix.js";
import { Item } from "./item.js";
import { ActiveTec, TecType, Tec } from "./tec.js";
import { Condition, InvisibleCondition } from "./condition.js";
import { Util, PlayData } from "./util.js";
import { Battle } from "./battle.js";
import { choice } from "./undym/random.js";
import { wait } from "./undym/scene.js";
import { SaveData } from "./savedata.js";
import { Player } from "./player.js";
import { Sound } from "./sound.js";
import { FX_反射 } from "./fx/fx.js";


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


export abstract class Eq implements ForceIns, Num{
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
        Eq._values.push(this);
        Eq._valueOf.set( args.uniqueName, this );
    }


    toString(){return this.args.uniqueName;}
    
    private forceIns:Force;
    get force():Force{return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this));}
    protected abstract createForce(_this:Eq):Force;

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


export abstract class EqEar implements ForceIns, Num{
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
        EqEar._values.push(this);
        EqEar._valueOf.set( args.uniqueName, this );
    }
    
    toString(){return this.args.uniqueName;}
    
    private forceIns:Force;
    get force():Force{return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this));}
    protected abstract createForce(_this:EqEar):Force;
    
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
        createForce(_this:Eq){return Force.empty;}
    }
    export const                         月代:Eq = new class extends Eq{
        constructor(){super({uniqueName:"月代", info:"「斬る」威力+25%", 
                                pos:EqPos.頭, lv:10});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.action === ActiveTec.斬る){
                    dmg.pow.mul *= 1.25;
                }
            }
        };}
    }
    /**合成. */
    export const                         星的:Eq = new class extends Eq{
        constructor(){super({uniqueName:"星的", info:"被銃・弓攻撃-10%", 
                                pos:EqPos.頭, lv:3});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("銃","弓")){
                    dmg.pow.mul *= 0.9;
                }
            }
        };}
    }
    /**合成:月のレシピ. */
    export const                         花水飾り:Eq = new class extends Eq{
        constructor(){super({uniqueName:"花水飾り", info:"防御値+500", 
                                pos:EqPos.頭, lv:40});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                dmg.def.add += 500;
            }
        };}
    }
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
    //--------------------------------------------------------------------------
    //
    //武
    //
    //--------------------------------------------------------------------------
    export const                         恋人:Eq = new class extends Eq{
        constructor(){super({uniqueName:"恋人", info:"",
                                pos:EqPos.武, lv:0});}
        createForce(_this:Eq){return Force.empty;}
    }
    export const                         ミルテの棍:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ミルテの棍", info:"攻撃時、確率でHP+5%",
                                pos:EqPos.武, lv:5});}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(Math.random() < 0.5){
                    Heal.run("HP", dmg.attacker.prm(Prm.MAX_HP).total * 0.05 + 1, dmg.attacker, dmg.attacker, Eq.ミルテの棍, false);
                }
            }
        };}
    }
    export const                         レティシアsガン:Eq = new class extends Eq{
        constructor(){super({uniqueName:"レティシアsガン", info:"銃攻撃時、稀に相手を＜防↓＞化",
                                pos:EqPos.武, lv:5});}
        toString(){return "レティシア'sガン";}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(dmg.hasType("銃") && Math.random() < 0.7){
                    Unit.setCondition( dmg.target, Condition.防御低下, 1 );
                }
            }
        };}
    }
    /**リテの門財宝. */
    export const                         忍者ソード:Eq = new class extends Eq{
        constructor(){super({uniqueName:"忍者ソード", info:"格闘攻撃時、稀に追加攻撃",
                                pos:EqPos.武, lv:105});}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(dmg.result.isHit && dmg.hasType("格闘") && Math.random() < 0.75){
                    await new Dmg({
                        attacker:dmg.attacker,
                        target:dmg.target,
                        absPow:dmg.result.value / 2,
                        types:["追加攻撃"],
                    }).run();
                    await wait(1);
                }
            }
        };}
    }
    /**クラウンボトルEX. */
    export const                         コスモガン:Eq = new class extends Eq{
        constructor(){super({uniqueName:"コスモガン", info:"銃攻撃時稀に追加攻撃",
                                pos:EqPos.武, lv:95});}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(dmg.result.isHit && dmg.hasType("銃") && Math.random() < 0.5){
                    Util.msg.set("≫コスモガン");
                    await new Dmg({
                        attacker:dmg.attacker,
                        target:dmg.target,
                        absPow:dmg.result.value / 2,
                        types:["追加攻撃"],
                    }).run();
                    await wait(1);
                }
            }
        };}
    }
    /**クラウンボトル財宝. */
    export const                         呪縛の弓矢:Eq = new class extends Eq{
        constructor(){super({uniqueName:"呪縛の弓矢", info:"弓攻撃時、稀に相手を＜鎖2＞化",
                                pos:EqPos.武, lv:95});}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(dmg.result.isHit && dmg.hasType("弓") && Math.random() < 0.5){
                    Unit.setCondition(dmg.target, Condition.鎖, 2); await wait();
                }
            }
        };}
    }
    /**テント樹林EX. */
    export const                         アリランナイフ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アリランナイフ", info:"攻撃時、稀に相手を＜毒＞化",
                                pos:EqPos.武, lv:95});}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(dmg.result.isHit && Math.random() < 0.8){
                    Sound.awa.play();
                    const value = dmg.attacker.prm(Prm.DRK).total + 1;
                    Unit.setCondition(dmg.target, Condition.毒, value); await wait();
                }
            }
        };}
    }
    /**合成. */
    export const                         アタックシールド:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アタックシールド", info:"最大HP+25",
                                pos:EqPos.武, lv:35});}
        createForce(_this:Eq){return new class extends Force{
            async equip(unit:Unit){
                unit.prm(Prm.MAX_HP).eq += 25;
            }
        };}
    }
    /**塔4000階EX. */
    export const                         ぱとバット:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ぱとバット", info:"＜眠＞から目覚めやすくなる",
                                pos:EqPos.武, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                if(unit.hasCondition(Condition.眠)){
                    Unit.addConditionValue( unit, Condition.眠, -1 );
                }
            }
        };}
    }
    /**塔地下200階の門EX. */
    export const                         ロングドレスの剣:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ロングドレスの剣", info:"格闘攻撃時、現在MP値を加算 MP-10%",
                                pos:EqPos.武, lv:200});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("格闘")){
                    dmg.pow.add += dmg.attacker.mp;
                    dmg.attacker.mp = dmg.attacker.mp * 0.9;
                }
            }
        };}
    }
    /**ハデスの腹EX. */
    export const                         ハデスの腹剣:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ハデスの腹剣", info:"格闘攻撃時に自分の受けているダメージの1/3を加算",
                                pos:EqPos.武, lv:300});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("格闘")){
                    dmg.pow.add += dmg.attacker.prm(Prm.MAX_HP).total - dmg.attacker.hp;
                }
            }
        };}
    }
    /**月のレシピ. */
    export const                         天秤:Eq = new class extends Eq{
        constructor(){super({uniqueName:"天秤", info:"光闇+100",
                                pos:EqPos.武, lv:70});}
        createForce(_this:Eq){return new class extends Force{
            async equip(unit:Unit){
                unit.prm(Prm.LIG).eq += 100;
                unit.prm(Prm.DRK).eq += 100;
            }
        };}
    }
    /**月のレシピ. */
    export const                         蔓の鎖:Eq = new class extends Eq{
        constructor(){super({uniqueName:"蔓の鎖", info:"鎖過+100",
                                pos:EqPos.武, lv:70});}
        createForce(_this:Eq){return new class extends Force{
            async equip(unit:Unit){
                unit.prm(Prm.CHN).eq += 100;
                unit.prm(Prm.PST).eq += 100;
            }
        };}
    }
    //--------------------------------------------------------------------------
    //
    //-武
    //盾
    //
    //--------------------------------------------------------------------------
    export const                         板:Eq = new class extends Eq{
        constructor(){super({uniqueName:"板", info:"",
                                pos:EqPos.盾, lv:0});}
        createForce(_this:Eq){return Force.empty;}
    }
    /**見知らぬ海岸財宝. */
    export const                         銅板:Eq = new class extends Eq{
        constructor(){super({uniqueName:"銅板", info:"防御値+100",
                                pos:EqPos.盾, lv:12});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                dmg.def.add += 100;
            }
        };}
    }
    /**リテの門EX. */
    export const                         反精霊の盾:Eq = new class extends Eq{
        constructor(){super({uniqueName:"反精霊の盾", info:"防御値+200",
                                pos:EqPos.盾, lv:52});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                dmg.def.add += 200;
            }
        };}
    }
    /**イスレシピ. */
    export const                         愛の盾:Eq = new class extends Eq{
        constructor(){super({uniqueName:"愛の盾", info:"魔+30",
                                pos:EqPos.盾, lv:102});}
        createForce(_this:Eq){return new class extends Force{
            equip(unit:Unit){
                unit.prm(Prm.MAG).eq += 30;
            }
        };}
    }
    /**塔6665階EX. */
    export const                         侍の盾:Eq = new class extends Eq{
        constructor(){super({uniqueName:"侍の盾", info:"＜練＞状態の相手から格闘・槍・鎖術攻撃を受けた際、反射する",
                                pos:EqPos.盾, lv:142});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.attacker.hasCondition(Condition.練) && dmg.hasType("格闘","槍","鎖術")){
                    Unit.set反射Inv( dmg.target );
                }
            }  
        };} 
    }
    /**冥界王朝宮EX. */
    export const                         僧兵の盾:Eq = new class extends Eq{
        constructor(){super({uniqueName:"僧兵の盾", info:"被攻撃時、神格反撃",
                                pos:EqPos.盾, lv:32});}
        createForce(_this:Eq){return new class extends Force{
            async afterBeAtk(dmg:Dmg){
                if(dmg.canCounter && dmg.hasType("神格")){
                    Util.msg.set("＞僧兵の盾");
                    await Tec.神格反撃.run(dmg.target, dmg.attacker);
                }
            }  
        };} 
    }
    /**塔地下777階EX. */
    export const                         退霊の盾:Eq = new class extends Eq{
        constructor(){super({uniqueName:"退霊の盾", info:"怨霊攻撃を稀に無効化",
                                pos:EqPos.盾, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("怨霊") && Math.random() < 0.6){
                    Util.msg.set("＞退霊の盾");
                    dmg.pow.base = 0;
                }
            }  
        };} 
    }
    //--------------------------------------------------------------------------
    //
    //-盾
    //体
    //
    //--------------------------------------------------------------------------
    export const                         襤褸切れ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"襤褸切れ", info:"",
                                pos:EqPos.体, lv:0});}
        createForce(_this:Eq){return Force.empty;}
    }
    /**見知らぬ海岸EX. */
    export const                         草の服:Eq = new class extends Eq{
        constructor(){super({uniqueName:"草の服", info:"最大HP+20",
                                pos:EqPos.体, lv:15});}
        createForce(_this:Eq){return new class extends Force{
            async equip(unit:Unit){unit.prm(Prm.MAX_HP).eq += 20;}
        };} 
    }
    /**はじまりの丘財宝. */
    export const                         オールマント:Eq = new class extends Eq{
        constructor(){super({uniqueName:"オールマント", info:"全ステータス+20",
                                pos:EqPos.体, lv:20});}
        createForce(_this:Eq){return new class extends Force{
            async equip(unit:Unit){
                [Prm.STR, Prm.MAG, Prm.LIG, Prm.DRK, Prm.CHN, Prm.PST, Prm.GUN, Prm.ARR].forEach(prm=> unit.prm(prm).eq += 20);
            }
        };} 
    }
    /**予感の街レEX. */
    export const                         いばらの鎧:Eq = new class extends Eq{
        constructor(){super({uniqueName:"いばらの鎧", info:"被格闘攻撃時、稀に格闘反撃",
                                pos:EqPos.体, lv:15});}
        createForce(_this:Eq){return new class extends Force{
            async afterBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘") && dmg.canCounter && Math.random() < 0.4){
                    Util.msg.set("＞いばらの鎧");
                    await Tec.格闘反撃.run(dmg.target, dmg.attacker);
                }
            }
        };} 
    }
    /**黒平原財宝. */
    export const                         魔性のマント:Eq = new class extends Eq{
        constructor(){super({uniqueName:"魔性のマント", info:"被攻撃時、MP+1",
                                pos:EqPos.体, lv:15});}
        createForce(_this:Eq){return new class extends Force{
            async afterBeAtk(dmg:Dmg){
                dmg.target.mp++;
            }
        };}
    }
    /**黒遺跡財宝. */
    export const                         ダークネスロード:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ダークネスロード", info:"攻撃倍率+10%　防御倍率-20%",
                                pos:EqPos.体, lv:6});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                dmg.def.mul *= 0.8;
            }
            async beforeDoAtk(dmg:Dmg){
                dmg.pow.mul *= 1.1;
            }
        };}
    }
    /**トトの郊外EX. */
    export const                         猛者の鎧:Eq = new class extends Eq{
        constructor(){super({uniqueName:"猛者の鎧", info:"格闘攻撃+15%　被格闘攻撃+15%",
                                pos:EqPos.体, lv:3});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("格闘")){
                    dmg.def.mul *= 1.15;
                }
            }
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("格闘")){
                    dmg.def.mul *= 1.15;
                }
            }
        };}
    }
    /**テント樹林財宝. */
    export const                         鎖のマント:Eq = new class extends Eq{
        constructor(){super({uniqueName:"鎖のマント", info:"鎖術攻撃+20%",
                                pos:EqPos.体, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("鎖術")){
                    dmg.def.mul *= 1.20;
                }
            }
        };}
    }
    /**聖なる洞窟EX. */
    export const                         ルナローブ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ルナローブ", info:"毎ターンTP+1",
                                pos:EqPos.体, lv:20});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                Heal.run("TP", 1, unit, unit, Eq.ルナローブ, false);
            }
        };}
    }
    /**月狼の森. */
    export const                         弓弓弓弓:Eq = new class extends Eq{
        constructor(){super({uniqueName:"弓弓弓弓", info:"弓攻撃命中率+20%",
                                pos:EqPos.体, lv:85});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("弓")){
                    dmg.hit.mul *= 1.2;
                }
            }
        };}
    }
    /**塔4000階財宝. */
    export const                         ミサイリストスーツ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ミサイリストスーツ", info:"銃攻撃時稀にクリティカル",
                                pos:EqPos.体, lv:285});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("銃") && Math.random() < 0.25){
                    Util.msg.set("＞ミサイリストスーツ");
                    dmg.hit.mul *= 2;
                }
            }
        };}
    }
    /**魂人の廃都財宝. */
    export const                         暖かい布:Eq = new class extends Eq{
        constructor(){super({uniqueName:"暖かい布", info:"毎ターンHP+5%",
                                pos:EqPos.体, lv:120});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                Heal.run("HP", unit.prm(Prm.MAX_HP).total * 0.05, unit, unit, Eq.暖かい布, false);
            }
        };}
    }
    /**占星術師の館EX. */
    export const                         お化けマント:Eq = new class extends Eq{
        constructor(){super({uniqueName:"お化けマント", info:"稀にすりぬけ（攻撃無効化）発動",
                                pos:EqPos.体, lv:120});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(Math.random() < 0.2){
                    Util.msg.set("＞すりぬけ");
                    dmg.pow.base = 0;
                }
            }
        };}
    }
    //--------------------------------------------------------------------------
    //
    //-体
    //腰
    //
    //--------------------------------------------------------------------------
    export const                         ひも:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ひも", info:"",
                                pos:EqPos.腰, lv:0});}
        createForce(_this:Eq){return Force.empty;}
    }
    export const                         ライダーベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ライダーベルト", info:"攻撃+10",
                                pos:EqPos.腰, lv:17});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                dmg.pow.add += 10;
            }
        };}
    }
    export const                         チェーンベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"チェーンベルト", info:"攻撃時極稀に相手を＜鎖＞化",
                                pos:EqPos.腰, lv:300});}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(Math.random() < 0.1){
                    Util.msg.set("＞チェーンベルト");
                    Unit.setCondition( dmg.target, Condition.鎖, 1 );
                }
            }
        };}
    }
    export const                         アンチェーンベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アンチェーンベルト", info:"鎖術攻撃を稀に無効化",
                                pos:EqPos.腰, lv:150});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("鎖術") && Math.random() < 0.8){
                    Util.msg.set("アンチェーンベルト");
                    dmg.pow.base = 0;
                }
            }
        };}
    }
    export const                         アンパストベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アンパストベルト", info:"過去攻撃を稀に無効化",
                                pos:EqPos.腰, lv:300});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("過去") && Math.random() < 0.8){
                    Util.msg.set("＞アンパストベルト");
                    dmg.pow.base = 0;
                }
            }
        };}
    }
    /**塔地下200階の門財宝. */
    export const                         アンマシンベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アンマシンベルト", info:"機械攻撃を稀に無効化",
                                pos:EqPos.腰, lv:40});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("機械") && Math.random() < 0.8){
                    Util.msg.set("＞アンマシンベルト");
                    dmg.pow.base = 0;
                }
            }
        };}
    }
    /**ハデスの口EX. */
    export const                         卯月ベルト:Eq = new class extends Eq{
        constructor(){super({uniqueName:"卯月ベルト", info:"過去攻撃後HP+2%",
                                pos:EqPos.腰, lv:340});}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(dmg.hasType("過去")){
                    Heal.run("HP", dmg.attacker.prm(Prm.MAX_HP).total * 0.02, dmg.attacker, dmg.attacker, Eq.卯月ベルト, false);
                }
            }
        };}
    }
    //--------------------------------------------------------------------------
    //
    //-腰
    //手
    //
    //--------------------------------------------------------------------------
    export const                         手:Eq = new class extends Eq{
        constructor(){super({uniqueName:"手", info:"",
                                pos:EqPos.手, lv:0});}
        createForce(_this:Eq){return Force.empty;}
    }
    /**黒平原EX. */
    export const                         妖魔の手:Eq = new class extends Eq{
        constructor(){super({uniqueName:"妖魔の手", info:"被魔法・過去攻撃時、稀に魔法反撃",
                                pos:EqPos.手, lv:20});}
        createForce(_this:Eq){return new class extends Force{
            async afterBeAtk(dmg:Dmg){
                if(dmg.hasType("魔法","過去") && dmg.canCounter && Math.random() < 0.7){
                    await Tec.魔法反撃.run(dmg.target, dmg.attacker);
                }
            }
        };}
    }
    /**黒い丘財宝. */
    export const                         魔ヶ玉の手首飾り:Eq = new class extends Eq{
        constructor(){super({uniqueName:"魔ヶ玉の手首飾り", info:"毎ターンMP+1",
                                pos:EqPos.手, lv:55});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit){
                Heal.run("MP", 1, unit, unit, Eq.魔ヶ玉の手首飾り, false);
            }
        };}
    }
    /**雪の初期装備. */
    export const                         ハルのカフス:Eq = new class extends Eq{
        constructor(){super({uniqueName:"ハルのカフス", info:"毎ターンTP+1　雪以外が装備するとダメージ",
                                pos:EqPos.手, lv:65});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit){
                Heal.run("TP", 1, unit, unit, Eq.ハルのカフス, false);
    
                if(unit instanceof PUnit && unit.player !== Player.雪){
                    const dmg = new Dmg({
                        attacker:unit,
                        target:unit,
                        absPow:unit.prm(Prm.MAX_HP).total * 0.1,
                        canCounter:false,
                    });
                    await dmg.run(); await wait();
                }
            }
        };}
    }
    /**月狼の森. */
    export const                         魔法使いのミトン:Eq = new class extends Eq{
        constructor(){super({uniqueName:"魔法使いのミトン", info:"魔法・過去攻撃+10",
                                pos:EqPos.手, lv:20});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("魔法","過去")){
                    dmg.pow.add += 10;
                }
            }
        };}
    }
    /**魔鳥の岩壁財宝. */
    export const                         水晶の手首飾り:Eq = new class extends Eq{
        constructor(){super({uniqueName:"水晶の手首飾り", info:"最大HP+50　毎ターンHP+1%",
                                pos:EqPos.手, lv:99});}
        createForce(_this:Eq){return new class extends Force{
            async equip(unit:Unit){
                unit.prm(Prm.MAX_HP).eq += 50;
            }
            async phaseStart(unit:Unit){
                Heal.run("HP", unit.prm(Prm.HP).total * 0.01 + 1, unit, unit, Eq.水晶の手首飾り, false);
            }
        };}
    }
    /**冥土の底財宝. */
    export const                         洗浄の腕輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"洗浄の腕輪", info:"＜毒・病気＞耐性",
                                pos:EqPos.手, lv:50});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit){
                unit.removeCondition(Condition.毒);
                unit.removeCondition(Condition.病気);
            }
        };}
    }
    /**冥土の底EX. */
    export const                         アングラの泥腕輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アングラの泥腕輪", info:"戦闘開始時＜毒＞化",
                                pos:EqPos.手, lv:19});}
        createForce(_this:Eq){return new class extends Force{
            async battleStart(unit:Unit){
                if(unit.dead){return;}
                
                Unit.setCondition( unit, Condition.毒, unit.prm(Prm.LV).total, true );
            }
        };}
    }
    /**小鬼. */
    export const                         小鬼の腕輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"小鬼の腕輪", info:"5の倍数のターンに正気を取り戻す",
                                pos:EqPos.手, lv:79});}
        createForce(_this:Eq){return new class extends Force{
            async battleStart(unit:Unit){
                if(unit.dead){return;}
                
                if(Battle.turn % 5 === 0){
                    unit.removeCondition(Condition.暴走);
                    unit.removeCondition(Condition.混乱);
                }
            }
        };}
    }
    /**冥界王朝宮財宝. */
    export const                         僧兵の腕輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"僧兵の腕輪", info:"格闘攻撃時、『天籟』発動  MP-1TP-1",
                                pos:EqPos.手, lv:29});}
        createForce(_this:Eq){return new class extends Force{
            async afterDoAtk(dmg:Dmg){
                if(dmg.canCounter && dmg.hasType("格闘") && dmg.attacker.mp >= 1 && dmg.attacker.tp >= 1){
                    Util.msg.set("＞僧兵の腕輪");
                    dmg.attacker.mp -= 1;
                    dmg.attacker.tp -= 1;
                    await Tec.天籟.run( dmg.attacker, dmg.target );
                }
            }
        };}
    }
    //--------------------------------------------------------------------------
    //
    //-手
    //指
    //
    //--------------------------------------------------------------------------
    export const                         肩身の指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"肩身の指輪", info:"",
                                pos:EqPos.指, lv:0});}
        createForce(_this:Eq){return Force.empty;}
    }
    export const                         アカデミーバッヂ:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アカデミーバッヂ", info:"全ステータス+10",
                                pos:EqPos.指, lv:20});}
        createForce(_this:Eq){return new class extends Force{
            async equip(u:Unit){
                [Prm.STR, Prm.MAG, Prm.LIG, Prm.DRK, Prm.CHN, Prm.PST, Prm.GUN, Prm.ARR].forEach(prm=> u.prm(prm).eq += 10);
            }
        };}
    }
    export const                         機工の指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"機工の指輪", info:"銃攻撃+20%",
                                pos:EqPos.指, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("銃")){
                    dmg.pow.mul *= 1.2;
                }
            }
        };}
    }
    export const                         アメーバリング:Eq = new class extends Eq{
        constructor(){super({uniqueName:"アメーバリング", info:"被魔法・神格・過去攻撃-20%",
                                pos:EqPos.指, lv:7});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("魔法","神格","過去")){
                    dmg.pow.mul *= 0.8;
                }
            }
        };}
    }
    /**古マーザン森財宝. */
    export const                         魔ヶ玉:Eq = new class extends Eq{
        constructor(){super({uniqueName:"魔ヶ玉", info:"毎ターンMP+1",
                                pos:EqPos.指, lv:98});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit){
                Heal.run("MP", 1, unit, unit, Eq.魔ヶ玉, false);
            }
        };}
    }
    /**古マーザン森EX. */
    export const                         水晶の指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"水晶の指輪", info:"毎ターンHP+5%",
                                pos:EqPos.指, lv:97});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit){
                Heal.run("HP", unit.prm(Prm.HP).total * 0.05 + 1, unit, unit, Eq.水晶の指輪, false);
            }
        };}
    }
    /**精霊寺院財宝. */
    export const                         エスペラント:Eq = new class extends Eq{
        constructor(){super({uniqueName:"エスペラント", info:"魔法・神格・過去・ペット攻撃+20%",
                                pos:EqPos.指, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("魔法","神格","過去","ペット")){
                    dmg.pow.mul *= 1.2;
                }
            }
        };}
    }
    /**塔6665階財宝. */
    export const                         霊宝天尊:Eq = new class extends Eq{
        constructor(){super({uniqueName:"霊宝天尊", info:"数珠・良き占いの回復量+50% 神格攻撃+33%",
                                pos:EqPos.指, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async doHeal(heal:Heal){
                if(heal.action === Tec.数珠 || heal.action === Tec.良き占い){
                    heal.value *= 1.5;
                }
            }
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("神格")){
                    dmg.pow.mul *= 1.33;
                }
            }
        };}
    }
    /**塔6666階財宝. */
    export const                         力の指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"力の指輪", info:"格闘攻撃+20%",
                                pos:EqPos.指, lv:20});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("格闘")){
                    dmg.pow.mul *= 1.2;
                }
            }
        };}
    }
    /**ハデスの腹財宝. */
    export const                         回避の指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"回避の指輪", info:"行動開始時、稀に＜回避＞化する",
                                pos:EqPos.指, lv:100});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                if(Math.random() < 0.3){
                    Unit.setCondition( unit, Condition.回避, 1 );
                }
            }
        };}
    }
    /**魂人の廃都EX. */
    export const                         クピドの指輪:Eq = new class extends Eq{
        constructor(){super({uniqueName:"クピドの指輪", info:"ガルダ・ヤクシャ・キンナラ回数+1",
                                pos:EqPos.指, lv:200});}
        createForce(_this:Eq){return new class extends Force{
            attackNum(action:Action, unit:Unit, aForce:AttackNumForce){
                if(
                       action instanceof ActiveTec
                    && (action === Tec.ガルダ || action === Tec.ヤクシャ || action === Tec.キンナラ)
                ){
                    aForce.add += 1;
                }
            }
        };}
    }
    /**占星術師の館財宝. */
    export const                         塔:Eq = new class extends Eq{
        constructor(){super({uniqueName:"塔", info:"槍攻撃+30",
                                pos:EqPos.指, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("槍")){
                    dmg.pow.add += 30;
                }
            }
        };}
    }
    /**合成:月のレシピ. */
    export const                         シャドウムーン:Eq = new class extends Eq{
        constructor(){super({uniqueName:"シャドウムーン", info:"最大MPTP+40",
                                pos:EqPos.指, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async equip(unit:Unit){
                unit.prm(Prm.MAX_MP).eq += 40;
                unit.prm(Prm.MAX_TP).eq += 40;
            }
        };}
    }
    // /**塔地下二百階の門財宝. */
    // export const                         治癒の指輪:Eq = new class extends Eq{
    //     constructor(){super({uniqueName:"治癒の指輪", info:"行動終了時HP+5%",
    //                             pos:EqPos.指, lv:98});}
    //     async phaseEnd(unit:Unit){
    //         Unit.healHP( unit, unit.prm(Prm.MAX_HP).total * 0.05 + 1 );
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
    //-指
    //脚
    //
    //--------------------------------------------------------------------------
    export const                         きれいな靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"きれいな靴", info:"",
                                pos:EqPos.脚, lv:0});}
        createForce(_this:Eq){return Force.empty;}
    }
    export const                         安全靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"安全靴", info:"戦闘開始時<盾>化",
                                pos:EqPos.脚, lv:10});}
        createForce(_this:Eq){return new class extends Force{
            async battleStart(unit:Unit){
                if(unit.dead){return;}
                
                unit.setCondition( Condition.盾, 1 );
            }
        };}
    }
    export const                         無色の靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"無色の靴", info:"格闘攻撃+20%",
                                pos:EqPos.脚, lv:15});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("格闘")){
                    dmg.pow.mul *= 1.2;
                }
            }
        };}
    }
    /**ハデスの腹財宝. */
    export const                         光色の靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"光色の靴", info:"神格攻撃x1.5",
                                pos:EqPos.脚, lv:205});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("神格")){
                    dmg.pow.mul *= 1.5;
                }
            }
        };}
    }
    /**トトの郊外財宝. */
    export const                         悪夢:Eq = new class extends Eq{
        constructor(){super({uniqueName:"悪夢", info:"過去攻撃+20%　被過去攻撃+20%",
                                pos:EqPos.脚, lv:0});}
        createForce(_this:Eq){return new class extends Force{
            async beforeDoAtk(dmg:Dmg){
                if(dmg.hasType("過去")){
                    dmg.pow.mul *= 1.2;
                }
            }
            async beforeBeAtk(dmg:Dmg){
                if(dmg.hasType("過去")){
                    dmg.pow.mul *= 1.2;
                }
            }
        };}
    }
    /**イスレシピ. */
    export const                         空飛ぶ靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"空飛ぶ靴", info:"攻撃回避率+5%",
                                pos:EqPos.脚, lv:255});}
        createForce(_this:Eq){return new class extends Force{
            async beforeBeAtk(dmg:Dmg){
                dmg.hit.mul *= 0.95;
            }
        };}
    }
    /**塔地下777階財宝. */
    export const                         誓いの靴:Eq = new class extends Eq{
        constructor(){super({uniqueName:"誓いの靴", info:"毎ターン全ステータス+10%",
                                pos:EqPos.脚, lv:55});}
        createForce(_this:Eq){return new class extends Force{
            async phaseStart(unit:Unit, pForce:PhaseStartForce){
                if(unit.dead){return;}
                for(const prm of Prm.atkPrms){
                    unit.prm(prm).battle += unit.prm(prm).get("base","eq") * 0.1;
                }
            }
        };}
    }
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
        createForce(_this:EqEar){return Force.empty;}
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