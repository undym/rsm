import { PUnit, Prm, Unit } from "./unit.js";
import { Tec, PassiveTec } from "./tec.js";
import { Job } from "./job.js";
import { Eq } from "./eq.js";
import { Img } from "./graphics/graphics.js";
import { SaveData } from "./savedata.js";



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
    abstract setJobChangeList(map:Map<Job,true>):void;

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


export namespace Player{
    export const             empty = new class extends Player{
        constructor(){super("empty");}
        createInner(p:PUnit){
            p.exists = false;
        }
        setJobChangeList(map:Map<Job,true>){}
    };
    export const             ルイン = new class extends Player{
        constructor(){super("ルイン");}
        createInner(p:PUnit){
            p.job = Job.訓練生;
            p.img = new Img("img/unit/p_ruin.png");
            p.prm(Prm.MAX_HP).base = 20;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 2;
            p.prm(Prm.STR).base = 2;

            p.tecs = [
                Tec.殴る,
                Tec.empty,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map:Map<Job,true>){setDefJobChangeList(map, this.ins);}
    };
    export const             ピアー = new class extends Player{
        constructor(){super("ピアー");}
        createInner(p:PUnit){
            p.job = Job.魔法使い;
            p.setJobLv(Job.魔法使い, 1);
            p.img = new Img("img/unit/p_pea.png");
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
        setJobChangeList(map:Map<Job,true>){setDefJobChangeList(map, this.ins);}
    };
    export const             一号 = new class extends Player{
        constructor(){super("一号");}
        createInner(p:PUnit){
            p.job = Job.暗黒戦士;
            p.img = new Img("img/unit/p_1.png");
            p.prm(Prm.MAX_HP).base = 30;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 1;
            p.prm(Prm.STR).base = 2;
            p.prm(Prm.DRK).base = 5;

            p.tecs = [
                Tec.殴る,
                Tec.暗黒剣,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];
        }
        setJobChangeList(map:Map<Job,true>){setDefJobChangeList(map, this.ins);}
    };
    export const             雪 = new class extends Player{
        constructor(){super("雪");}
        createInner(p:PUnit){
            p.job = Job.鎖使い;
            p.img = new Img("img/unit/p_yuki.png");
            p.prm(Prm.MAX_HP).base = 20;
            p.prm(Prm.MAX_MP).base = 1;
            p.prm(Prm.MAX_TP).base = 2;
            p.prm(Prm.STR).base = 1;
            p.prm(Prm.CHN).base = 6;

            p.tecs = [
                Tec.殴る,
                Tec.スネイク,
                Tec.empty,
                Tec.empty,
                Tec.empty,
            ];

            p.setEq(Eq.ハルのカフス.pos, Eq.ハルのカフス);
        }
        setJobChangeList(map:Map<Job,true>){setDefJobChangeList(map, this.ins);}
    };
    export const             ベガ = new class extends Player{
        constructor(){super("ベガ");}
        createInner(p:PUnit){
            p.job = Job.鎖使い;
            p.img = new Img("img/unit/unit108.png");
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
            setDefJobChangeList(map, this.ins);
            setBeastJobChangeList(map, this.ins);
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
        add(Job.シーフ, [Job.訓練生二年生]);
    add(Job.剣士, [Job.訓練生]);
        add(Job.忍者, [Job.剣士, Job.シーフ]);
    add(Job.魔法使い, [Job.訓練生]);
        add(Job.ウィザード, [Job.魔法使い]);
    add(Job.天使, [Job.訓練生]);
    add(Job.毒使い, [Job.訓練生]);
    add(Job.鎖使い, [Job.訓練生]);
        add(Job.スネイカー, [Job.鎖使い]);
    add(Job.ダウザー, [Job.訓練生]);
    add(Job.カウボーイ, [Job.訓練生]);
        add(Job.機械士, [Job.カウボーイ]);
    add(Job.アーチャー, [Job.訓練生]);
        add(Job.機械士, [Job.クピド]);
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
    add(Job.ノーム, [Job.ドラゴン]);
};
// //--------------------------------------------------
// //
// //獣
// //
// //--------------------------------------------------
// //TODO
// export const                         雷鳥:Job = new class extends Job{
//     constructor(){super({uniqueName:"雷鳥", info:"",
//                             appearLv:0, img:new Img("img/unit/雷鳥.png"),
//                             lvupExp:Job.DEF_LVUP_EXP * 1,
//                             canJobChange:p=> false,
//                             growthPrms:()=>[[Prm.ARR, 1]],
//                             learningTecs:()=>[],
//                             beast:true,
//     });}
//     setEnemyInner(e:EUnit){
//         e.tecs = [Tec.射る, Tec.射る, Tec.ヴァハ, Tec.殴る];
//     }
// };
// //TODO
// export const                         アメーバ:Job = new class extends Job{
//     constructor(){super({uniqueName:"アメーバ", info:"",
//                             appearLv:8, img:new Img("img/unit/アメーバ.png"),
//                             lvupExp:Job.DEF_LVUP_EXP * 1,
//                             canJobChange:p=> false,
//                             growthPrms:()=>[[Prm.MAX_MP, 1]],
//                             learningTecs:()=>[Tec.弱体液, Tec.セル, Tec.被膜],
//                             beast:true,
//     });}
//     setEnemyInner(e:EUnit){
//         e.tecs = [Tec.殴る, Tec.弱体液, Tec.タックル, Tec.殴る, Tec.セル, Tec.被膜];
//     }
// };
// //TODO
// export const                         妖精:Job = new class extends Job{
//     constructor(){super({uniqueName:"妖精", info:"",
//                             appearLv:0, img:new Img("img/unit/妖精.png"),
//                             lvupExp:Job.DEF_LVUP_EXP * 1,
//                             canJobChange:p=> false,
//                             growthPrms:()=>[[Prm.MAG, 1]],
//                             learningTecs:()=>[Tec.妖精の粉, Tec.MP自動回復],
//                             beast:true,
//     });}
//     setEnemyInner(e:EUnit){
//         e.tecs = [Tec.妖精の粉, Tec.妖精の粉, Tec.ヴァハ, Tec.殴る, Tec.MP自動回復];
//     }
// };
// //TODO
// export const                         ドラゴン:Job = new class extends Job{
//     constructor(){super({uniqueName:"ドラゴン", info:"",
//                             appearLv:95, img:new Img("img/unit/ドラゴン.png"),
//                             lvupExp:Job.DEF_LVUP_EXP * 1,
//                             canJobChange:p=> false,
//                             growthPrms:()=>[[Prm.MAX_HP, 2]],
//                             learningTecs:()=>[Tec.自然治癒, Tec.龍撃, Tec.ドラゴンテイル, Tec.ドラゴンブレス],
//                             beast:true,
//     });}
//     setEnemyInner(e:EUnit){
//         e.tecs = [Tec.ドラゴンテイル, Tec.ドラゴンテイル, Tec.龍撃, Tec.殴る, Tec.自然治癒];
//         e.prm(Prm.MAX_HP).base *= 2;
//     }
// };
// //TODO
// export const                         鬼火:Job = new class extends Job{
//     constructor(){super({uniqueName:"鬼火", info:"",
//                             appearLv:10, img:new Img("img/unit/鬼火.png"),
//                             lvupExp:Job.DEF_LVUP_EXP * 1,
//                             canJobChange:p=> false,
//                             growthPrms:()=>[[Prm.MAG, 1]],
//                             learningTecs:()=>[Tec.ファイアボール, Tec.魔法攻撃UP, Tec.自爆],
//                             beast:true,
//     });}
//     setEnemyInner(e:EUnit){
//         e.tecs = [Tec.ファイアボール, Tec.ファイアボール, Tec.殴る, Tec.殴る, Tec.殴る];
//     }
// };
// }