import { Force, PhaseStartForce, ForceIns } from "./force.js";
import { Unit, PUnit } from "./unit.js";
import { Tec, ActiveTec } from "./tec.js";
import { choice } from "./undym/random.js";
import { Player } from "./player";
import { Util } from "./util.js";
import { wait } from "./undym/scene.js";
import { Color } from "./undym/type.js";
import { Img } from "./graphics/texture.js";


export abstract class PetFactory{
    private static _values:PetFactory[] = [];
    static values():ReadonlyArray<PetFactory>{return this._values;}

    private static _valueOf = new Map<string,PetFactory>();
    static valueOf(uniqueName:string):PetFactory|undefined{
        return this._valueOf.get(uniqueName);
    }

    constructor(readonly uniqueName:string, readonly img:Img){
        PetFactory._values.push(this);
        if(PetFactory._valueOf.has(uniqueName)) {console.log(`PetFactory._valueOf already has the key: ${uniqueName}.`)}
        else                                    {PetFactory._valueOf.set(uniqueName, this);}
        
    }

    abstract create(hp:number):Pet;
}

export class Pet implements ForceIns{
    
    private static readonly HP_NAMES:ReadonlyArray<string> = ["死亡", "瀕死", "衰弱", "弱体", "通常", "頑丈", "鉄壁", "無敵",];
    static get HP_LIMIT(){return Pet.HP_NAMES.length-1;}
    constructor(
        readonly uniqueName:string,
        readonly img:Img,
        protected _hp:number,
    ){
    }
    
    private forceIns:Force;
    get force():Force{return this.forceIns ? this.forceIns : (this.forceIns = this.createForce(this));}
    protected createForce(_this:Pet):Force{return new Force();}

    get hp(){return this._hp;}
    set hp(value:number){
             if(value < 0)           {this._hp = 0;}
        else if(value > Pet.HP_LIMIT){this._hp = Pet.HP_LIMIT;}
        else                         {this._hp = value;}
    }

    toString(){return this.uniqueName;}
    hpToString():string{
        const index = this.hp|0;
        if(index >= Pet.HP_NAMES.length){return "暴走";}
        if(0 <= index && index < Pet.HP_NAMES.length){return Pet.HP_NAMES[ index ];}
        return "あの世";
    }

    async useRndPetTec(summoner:Unit, tecs:ActiveTec[]){
        if(tecs.length === 0){return undefined;}
        for(let i = 0; i < 10; i++){
            const tec = choice( tecs );
            if(tec.checkCost(summoner)){
                const targets = summoner.searchUnits( tec.targetings, tec.rndAttackNum( summoner ) );
                if(targets.length === 0){return;}
    
                Util.msg.set(`${this.toString()}の[${tec}]`, Color.D_GREEN.bright); await wait();
    
                tec.payCost(summoner);
                for(const t of targets){
                    await tec.run( summoner, t );
                }
                return;
            }
        }
    }

}


export namespace Pet{
    export const             empty:PetFactory = new class extends PetFactory{
        constructor(){super("empty", Img.empty);}
        create(hp:number){
            const uniqueName = this.uniqueName;
            const img = this.img;
            return new class extends Pet{
                constructor(){super(uniqueName, img, hp);}
                toString(){return "";}
            };
        }
    };
    /** */
    export const             ドゥエルガル:PetFactory = new class extends PetFactory{
        constructor(){super("ドゥエルガル", new Img("img/pet/pet1.png", {transparence:Color.BLACK}));}
        create(hp:number){
            const factory = this;
            return new class extends Pet{
                constructor(){super(factory.uniqueName, factory.img, hp);}
    
                async phaseStart(unit:Unit, pForce:PhaseStartForce){
                    await this.useRndPetTec(unit, [Tec.パンチ]);
                }
            };
        }
    };
    /**強化でTec.イスキュアを使用(未実装). */
    export const             ネーレイス:PetFactory = new class extends PetFactory{
        constructor(){super("ネーレイス", new Img("img/pet/pet2.png", {transparence:Color.BLACK}));}
        create(hp:number){
            const factory = this;
            return new class extends Pet{
                constructor(){super(factory.uniqueName, factory.img, hp);}
    
                async phaseStart(unit:Unit, pForce:PhaseStartForce){
                    await this.useRndPetTec(unit, [Tec.キュア, Tec.ラクサスキュア]);
                }
            };
        }
    };
    /** */
    export const             ヴァルナ:PetFactory = new class extends PetFactory{
        constructor(){super("ヴァルナ", new Img("img/pet/pet3.png", {transparence:Color.BLACK}));}
        create(hp:number){
            const factory = this;
            return new class extends Pet{
                constructor(){super(factory.uniqueName, factory.img, hp);}
    
                async phaseStart(unit:Unit, pForce:PhaseStartForce){
                    await this.useRndPetTec(unit, [Tec.シルフ, Tec.レヴィーナの歌声, Tec.ヴァルナパンチ]);
                }
            };
        }
    };
    export const             イリューガー:PetFactory = new class extends PetFactory{
        constructor(){super("イリューガー", new Img("img/pet/pet4.png", {transparence:Color.BLACK}));}
        create(hp:number){
            const factory = this;
            return new class extends Pet{
                constructor(){super(factory.uniqueName, factory.img, hp);}
    
                async phaseStart(unit:Unit, pForce:PhaseStartForce){
                    await this.useRndPetTec(unit, [Tec.ファイアブレス]);
                }
            };
        }
    };
    export const             マーメイド:PetFactory = new class extends PetFactory{
        constructor(){super("マーメイド", new Img("img/pet/pet6.png", {transparence:Color.BLACK}));}
        create(hp:number){
            const factory = this;
            return new class extends Pet{
                constructor(){super(factory.uniqueName, factory.img, hp);}
    
                async phaseStart(unit:Unit, pForce:PhaseStartForce){
                    await this.useRndPetTec(unit, [Tec.人魚の歌, Tec.生命の歌]);
                }
            };
        }
    };
    export const             ホムンクルス:PetFactory = new class extends PetFactory{
        constructor(){super("ホムンクルス", new Img("img/pet/pet7.png", {transparence:Color.BLACK}));}
        create(hp:number){
            const factory = this;
            return new class extends Pet{
                constructor(){super(factory.uniqueName, factory.img, hp);}
    
                async phaseStart(unit:Unit, pForce:PhaseStartForce){
                    await this.useRndPetTec(unit, [Tec.ブラッドパンチ]);
                }
            };
        }
    };
    export const             フランケンシュタイン:PetFactory = new class extends PetFactory{
        constructor(){super("フランケンシュタイン", new Img("img/pet/pet8.png", {transparence:Color.BLACK}));}
        create(hp:number){
            const factory = this;
            return new class extends Pet{
                constructor(){super(factory.uniqueName, factory.img, hp);}
    
                async phaseStart(unit:Unit, pForce:PhaseStartForce){
                    await this.useRndPetTec(unit, [Tec.サイクロン]);
                }
            };
        }
    };
}

