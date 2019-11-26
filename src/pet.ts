import { Force, PhaseStartForce, Targeting } from "./force";
import { Unit, PUnit } from "./unit";
import { Tec, ActiveTec } from "./tec";
import { choice } from "./undym/random";
import { Player } from "./player";
import { Util } from "./util";
import { wait } from "./undym/scene";
import { Color } from "./undym/type";
import { Img } from "./graphics/graphics";


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

export class Pet extends Force{
    constructor(
        readonly name:string,
        public hp:number,
    ){
        super();
    }

    toString(){return this.name;}

    async useRndPetTec(summoner:Unit, tecs:ActiveTec[]){
        if(tecs.length === 0){return undefined;}
        for(let i = 0; i < 10; i++){
            const tec = choice( tecs );
            if(tec.checkCost(summoner)){
                const targets = Targeting.filter( tec.targetings, summoner, Unit.all, tec.rndAttackNum() );
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
    export const             ネーレイス:PetFactory = new class extends PetFactory{
        constructor(){super("ネーレイス", new Img("img/pet/pet2.png"));}
        create(hp:number){
            return new class extends Pet{
                constructor(){super("ネーレイス", hp);}
    
                async phaseStart(unit:Unit, pForce:PhaseStartForce){
                    await this.useRndPetTec(unit, [Tec.キュア]);
                }
            };
        }
    };
}

