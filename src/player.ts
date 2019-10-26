import { PUnit, Prm, Unit } from "./unit.js";
import { Tec, PassiveTec } from "./tec.js";
import { Job } from "./job.js";
import { Eq } from "./eq.js";
import { Img } from "./graphics/graphics.js";



export abstract class Player{
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

    constructor(public readonly uniqueName:string){
        this.toString = ()=>this.uniqueName;

        Player._values.push(this);
        Player._valueOf.set( this.uniqueName, this );
    }
    
    abstract createInner(p:PUnit):void;

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


export namespace Player{
    export const             empty = new class extends Player{
        constructor(){super("empty");}
        createInner(p:PUnit){
            p.exists = false;
        }
    };
    export const             ルイン = new class extends Player{
        constructor(){super("ルイン");}
        createInner(p:PUnit){
            p.job = Job.訓練生;
            p.img = new Img("img/ルイン.png");
            p.prm(Prm.MAX_HP).base = 20;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 2;

            p.tecs = [
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
    };
    export const             ピアー = new class extends Player{
        constructor(){super("ピアー");}
        createInner(p:PUnit){
            p.job = Job.魔法使い;
            p.setJobLv(Job.魔法使い, 1);
            p.img = new Img("img/ピアー.png");
            p.prm(Prm.MAX_HP).base = 16;
            p.prm(Prm.MAX_MP).base = 5;
            p.prm(Prm.MAX_TP).base = 0;
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
    };
}