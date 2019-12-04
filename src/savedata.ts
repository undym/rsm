import { Item } from "./item.js";
import { Eq, EqPos, EqEar } from "./eq.js";
import { Dungeon, DungeonArea } from "./dungeon/dungeon.js";
import { PUnit, Prm, Unit } from "./unit.js";
import { Player } from "./player.js";
import { Tec, PassiveTec, ActiveTec } from "./tec.js";
import { Job } from "./job.js";
import { ConditionType, Condition } from "./condition.js";
import { PlayData, SceneType, Util } from "./util.js";
import { Color } from "./undym/type.js";
import { Mix } from "./mix.js";
import { PartySkill } from "./partyskill.js";
import { CollectingSkill } from "./collectingskill.js";
import { Sound } from "./sound.js";
import { PetFactory } from "./pet.js";



export class Version{
    static readonly NOW = new Version(0,26,3);
    static readonly updateInfo =    [
                                        "(0.24.12)エフェクト修正",
                                        "(0.24.13)収集スキルの計算式修正",
                                        "(0.25.0)ダンジョンとか追加",
                                        "(0.25.1)合成追加",
                                        "(0.25.2)こまごま",
                                        "(0.25.3)一部ダンジョンのAUを減らした",
                                        "(0.25.4)装備追加",
                                        "(0.25.5)微調整",
                                        "(0.25.6)バグ修正",
                                        "(0.25.7)ジョブ追加、他",
                                        "(0.25.8)エフェクト追加",
                                        "(0.26.0)塔4000階追加、バグ修正",
                                        "(0.26.1)exporttest",
                                        "(0.26.2)exporttest",
                                        "(0.26.3)exporttest",
                                    ];

    private values:number[];

    get major()     {return this.values[0];}
    get minior()    {return this.values[1];}
    get mentener()  {return this.values[2];}

    /**Integer. */
    constructor(major:number, minior:number, mentener:number){
        this.values = [major|0, minior|0, mentener|0];
    }

    isNewerThan(version:Version):boolean{
        for(let i = 0; i < this.values.length; i++){
            if(this.values[i] < version.values[i]){
                return false;
            }
            if(this.values[i] > version.values[i]){
                return true;
            }
        }

        return false;
    }

    equals(version:Version):boolean{
        for(let i = 0; i < this.values.length; i++){
            if(this.values[i] !== version.values[i]){return false;}
        }
        return true;
    }

    toString(){return `${this.major}.${this.minior}.${this.mentener}`;}
}



let saveDataVersion:Version;


export class SaveData{
    private static readonly data = "data";

    static exists():boolean{
        return window.localStorage.getItem(this.data) !== null;
    }

    static delete(){
        window.localStorage.clear();
    }
    /** */
    static save(){
        let json:any = {};
        this.io(/*save*/true, json);

        window.localStorage.setItem(this.data, JSON.stringify(json));
        Util.msg.set("セーブしました", Color.CYAN.bright);

        // console.log(JSON.stringify(json, undefined, 4));
        // console.log(JSON.stringify(json));
    }
    /**jsonStr指定でインポート. */
    static load(jsonStr?:string|null):boolean{
        if(!jsonStr){
            jsonStr = window.localStorage.getItem(this.data);
        }
        if(jsonStr){
            try{
                const json = JSON.parse( jsonStr );
                this.io(/*save*/false, json);
                return true;
            }catch(e){
                Util.msg.set("セーブデータのパース失敗");
                return false;
            }
            
        }
        return false;
    }
    /** */
    static export():string{
        let json:any = {};
        this.io(/*save*/true, json);
        return JSON.stringify( json );
    }
    // /**受け取ったstringをUint8Arrayにして返す。 */
    // static stringToByteArray(data:string):Uint8Array{
    //     const encoder = new TextEncoder();
    //     const encoded = encoder.encode( data );
    //     return encoded;
    // }
    // /**受け取ったUint8Arrayをstringにして返す。 */
    // static byteArrayToString(data:Uint8Array):string{
    //     const decoder = new TextDecoder();
    //     return 
    // }

    private static io(save:boolean, json:any){
        storageVersion(save,         ioObject(save, json, "Version"));
        storageItem(save,            ioObject(save, json, "Item"));
        storageEq(save,              ioObject(save, json, "Eq"));
        storageEqEar(save,           ioObject(save, json, "EqEar"));
        storageDungeon(save,         ioObject(save, json, "Dungeon"));
        storagePlayer(save,          ioObject(save, json, "Player"));
        storageMix(save,             ioObject(save, json, "Mix"));
        storagePlayData(save,        ioObject(save, json, "PlayData"));
        storageCollectingSkill(save, ioObject(save, json, "CollectingSkill"));
        storagePartySkill(save,      ioObject(save, json, "PartySkill"));

    }
}


const ioInt = (save:boolean, json:any, key:string, value:number, loadAction:(load:number)=>void):void=>{
    if(save){
        json[key] = value|0;
    }else{
        const load = json[key];
        if(load){
            const parsed:number = Number.parseInt(load);
            if(parsed !== undefined){loadAction(parsed);}
            else                    {console.log(`ioInt() parseFail: "${key}":${load}`);}
        }
    }
};

const ioStr = (save:boolean, json:any, key:string, value:string, loadAction:(load:string)=>void):void=>{
    if(save){
        json[key] = value;
    }else{
        const load = json[key];
        if(load){
            loadAction(load);
        }
    }
};

const ioBool = (save:boolean, json:any, key:string, value:boolean, loadAction:(load:boolean)=>void):void=>{
    //セーブデータファイルの容量の削減のため、0,1で保存する。false,trueよりも短いので。
    if(save){
        if(value){json[key] = 1;}
        else     {json[key] = 0;}
    }else{
        const load = json[key];
        if(load !== undefined){
            if(load){loadAction(true);}
            else    {loadAction(false);}
        }
    }
};


const ioObject = (save:boolean, json:any, key:string):any=>{
    if(save){
        return (json[key] = {});
    }else{
        if(json[key]){return json[key];}
        return {};
    }
};

const storageVersion = (save:boolean, json:any)=>{
    let major:number = Version.NOW.major;
    let minior:number = Version.NOW.minior;
    let mentener:number = Version.NOW.mentener;
    ioInt(save, json, "major",    Version.NOW.major,    load=>major = load);
    ioInt(save, json, "minior",   Version.NOW.minior,   load=>minior = load);
    ioInt(save, json, "mentener", Version.NOW.mentener, load=>mentener = load);

    saveDataVersion = new Version(major, minior, mentener);
};

// /**
//  * 4bitの16進数に変換して文字列にまとめたものを返す。 
//  * to4bit16hex( 0, 10, 1 );//"0000000a0001"
//  * */
// const to4bit16hex = (values:number[]):string=>{
//     let res = "";
//     for(let i = 0; i < values.length; i++){
//         if(values[i] > 0xFFFF){
//             values[i] = 0xFFFF;
//         }
//         let s = values[i].toString(16);
//         for(let i = s.length; i < 4; i++){
//             s = "0"+s;
//         };

//         res = res + s;
//     }
    
//     return res;
// };



// const parse4bit16hex = (str:string, index:number):number=>{
//     return Number.parseInt( str.substring(4 * index, 4 * (index+1)), 16 );
// }

class Radix36Limit{
    private static values:number[] = [36];
    static get(digit:number):number{
        if(digit-1 >= this.values.length){
            for(let i = this.values.length; i < digit; i++){
                this.values.push( this.values[i-1] * 36 );
            }
        }

        return this.values[digit-1];
    }
}
/**
 * 指定の桁数の36進数に変換して文字列にまとめたものを返す。 
 * to36Radix( 4, [0, 10, 1] );//"0000000a0001"
 * */
const to36Radix = (digit:number, values:number[]):string=>{
    let res = "";
    const limit = Radix36Limit.get(digit);
    
    for(let i = 0; i < values.length; i++){
        if(values[i] > limit){
            values[i] = limit;
        }
        let s = values[i].toString(36);
        for(let i = s.length; i < digit; i++){
            s = "0"+s;
        };

        res = res + s;
    }
    
    return res;
};

const parse36Radix = (digit:number, str:string, index:number):number=>{
    return Number.parseInt( str.substring(digit * index, digit * (index+1)), 36 );
};

const storageItem = (save:boolean, json:any)=>{
    for(const item of Item.values){
        const value =   to36Radix(
                            /*digit*/4,
                            [
                                item.num,
                                item.totalGetCount,
                                item.remainingUseNum,
                            ]
                        );
        ioStr(save, json, item.uniqueName, value, load=>{
            item.num                = parse36Radix(/*digit*/4, load, /*index*/0);
            item.totalGetCount      = parse36Radix(/*digit*/4, load, /*index*/1);
            item.remainingUseNum    = parse36Radix(/*digit*/4, load, /*index*/2);
        });
    }
};


const storageEq = (save:boolean, json:any)=>{
    for(const eq of Eq.values){
        const value =   to36Radix(
                            /*digit*/4,
                            [
                                eq.num,
                                eq.totalGetCount,
                            ]
                        );
        ioStr(save, json, eq.uniqueName, value, load=>{
            eq.num                = parse36Radix(/*digit*/4, load, /*index*/0);
            eq.totalGetCount      = parse36Radix(/*digit*/4, load, /*index*/1);
        });
    }
}


const storageEqEar = (save:boolean, json:any)=>{
    for(const ear of EqEar.values){
        const obj = ioObject(save, json, ear.uniqueName);
        ioInt(save, obj, "num",   ear.num,           load=>ear.num = load);
        ioInt(save, obj, "count", ear.totalGetCount, load=>ear.totalGetCount = load);
    }
}


const storageDungeon = (save:boolean, json:any)=>{
    for(const d of Dungeon.values){
        const obj = ioObject(save, json, d.uniqueName);
        ioInt(save, obj, "tkey",   d.treasureKey,       load=>d.treasureKey = load);
        ioInt(save, obj, "clear",  d.dungeonClearCount, load=>d.dungeonClearCount = load);
        ioInt(save, obj, "ex",     d.exKillCount,       load=>d.exKillCount = load);
    }
};


const storagePlayer = (save:boolean, json:any)=>{
    for(const p of Player.values){
        const obj = ioObject(save, json, p.uniqueName);
        ioBool(save, obj, "member", p.member, load=>p.member = load);
        const u = p.ins;
        ioBool(save, obj, "exists", u.exists, load=>u.exists = load);
        ioBool(save, obj, "dead", u.dead, load=>u.dead = load);
        const prmObj = ioObject(save, obj, "Prm");
        for(const prm of Prm.values){
            ioInt(save, prmObj, `${prm}_b`,   u.prm(prm).base|0,   load=>u.prm(prm).base = load);
            ioInt(save, prmObj, `${prm}_e`,   u.prm(prm).eq|0,     load=>u.prm(prm).eq = load);
            //戦闘中にセーブはできないので、battleを保存する必要はない
            // ioInt(save, obj, `${prm}_battle`, u.prm(prm).battle|0, load=>u.prm(prm).battle = load);
        }

        for(let i = 0; i < Unit.EAR_NUM; i++){
            ioStr(save, obj, `eqear_${i}`, u.getEqEar(i).uniqueName, load=>{
                const ear = EqEar.valueOf(load);
                if(ear){u.setEqEar(i, ear);}
            });
        }
        for(const pos of EqPos.values){
            ioStr(save, obj, `eq_${pos}`, u.getEq(pos).uniqueName, load=>{
                const eq = Eq.valueOf(load);
                if(eq){u.setEq(pos, eq);}
            });
        }
    
        ioStr(save, obj, `job`, u.job.uniqueName, load=>{
            const job = Job.valueOf(load);
            if(job){
                u.job = job;
            }
        });
    
        let tecsLen = u.tecs.length;
        ioInt(save, obj, `tecs_length`, u.tecs.length, load=> tecsLen = load);
    
        u.tecs.length = tecsLen;
        for(let i = 0; i < u.tecs.length; i++){
            if(!u.tecs[i]){
                u.tecs[i] = Tec.empty;
            }
        }
    
        for(let i = 0; i < tecsLen; i++){
    
            const key = `tec_${i}`;
            const value = u.tecs[i].uniqueName;
    
            ioStr(save, obj, key, value, load=>{
                const passive = PassiveTec.valueOf(load);
                if(passive){
                    u.tecs[i] = passive; 
                    return;
                }

                const active = ActiveTec.valueOf(load);
                if(active){
                    u.tecs[i] = active; 
                    return;
                }
            });
        }
        

        {//condition
            const conditionObj = ioObject(save, obj, "Condition");
            let savedConditions:{condition:Condition, value:number}[] = [];
            for(const type of ConditionType.values){
                const set = u.getConditionSet(type);
                const loadSet = {condition:Condition.empty, value:0};
                ioStr(save, conditionObj, `${type.uniqueName}_condition`, set.condition.uniqueName, load=>{
                    const condition = Condition.valueOf(load);
                    if(condition){
                        loadSet.condition = condition;
                    }
                });
                ioInt(save, conditionObj, `${type.uniqueName}_value`, set.value, load=> loadSet.value = load);
    
                savedConditions.push(loadSet);
            }
            if(!save){
                for(let set of savedConditions){
                    u.setCondition( set.condition, set.value );
                }
            }
        }

        {//pet
            const petObj = ioObject(save, obj, "Pet");
            if(save && u.pet){
                ioInt(save, petObj, "hp", u.pet.hp, load=>{});
                ioStr(save, petObj, "name", u.pet.uniqueName, load=>{});
            }
            if(!save){
                let hp = 0;
                ioInt(save, petObj, "hp", 0, load=>hp = load);
                ioStr(save, petObj, "name", "", load=>{
                    const factory = PetFactory.valueOf(load);
                    if(factory){
                        factory.create(hp);
                    }
                });
            }
        }
    }

    {
        const activeTecObj = ioObject(save, json, "ActiveTec");
        const digit = 1;
        for(const tec of ActiveTec.values){
            const values:number[] = Player.values.map(p=> p.ins.isMasteredTec(tec) ? 1 : 0);
            const value = to36Radix(digit, values);
            ioStr(save, activeTecObj, tec.uniqueName, value, load=>{
                Player.values.forEach((p,index)=>{
                    if(index * digit >= load.length){return;}
                    
                    if(parse36Radix(digit, load, index) === 1)  {p.ins.setMasteredTec(tec, true);}
                    else                                        {p.ins.setMasteredTec(tec, false);}
                });
            });
        }
    }

    
    {
        const passiveTecObj = ioObject(save, json, "PassiveTec");
        const digit = 1;
        for(const tec of PassiveTec.values){
            const values:number[] = Player.values.map(p=> p.ins.isMasteredTec(tec) ? 1 : 0);
            const value = to36Radix(digit, values);
            ioStr(save, passiveTecObj, tec.uniqueName, value, load=>{
                Player.values.forEach((p,index)=>{
                    if(index * digit >= load.length){return;}
                    
                    if(parse36Radix(digit, load, index) === 1)  {p.ins.setMasteredTec(tec, true);}
                    else                                        {p.ins.setMasteredTec(tec, false);}
                });
            });
        }
    }
    {
        const jobParentObj = ioObject(save, json, "JobLvExp");
        const digit = 4;
        for(const job of Job.values){
            const jobObj = ioObject(save, jobParentObj, `${job.uniqueName}`);
            {
                const lvs:number[]  = Player.values.map(p=> p.ins.getJobLv(job));
                const value:string = to36Radix(digit, lvs);
                ioStr(save, jobObj, "lv", value, load=>{
                    Player.values.forEach((p,index)=>{
                        if(index * digit >= load.length){return;}
    
                        p.ins.setJobLv( job, parse36Radix(digit, load, index) );
                    });
                });
            }
            {
                const exps:number[] = Player.values.map(p=> p.ins.getJobExp(job));
                const value:string = to36Radix(digit, exps);
                ioStr(save, jobObj, "exp", value, load=>{
                    Player.values.forEach((p,index)=>{
                        if(index * digit >= load.length){return;}
    
                        p.ins.setJobExp( job, parse36Radix(digit, load, index) );
                    });
                });
            }
        }
    }
};



const storageMix = (save:boolean, json:any)=>{
    for(const mix of Mix.values){
        ioInt(save, json, `${mix.uniqueName}_c`, mix.count, load=>mix.count = load);
    }
};


const storagePlayData = (save:boolean, json:any)=>{
    ioInt(save, json, "yen", PlayData.yen, load=>PlayData.yen = load);
    
    ioBool(save, json, "gotAnyEq", PlayData.gotAnyEq, load=>PlayData.gotAnyEq = load);
    ioStr(save, json, "dungeonNow", Dungeon.now.uniqueName, load=>{
        const dungeon = Dungeon.valueOf(load);
        if(dungeon){
            Dungeon.now = dungeon;
        }
    });
    ioStr(save, json, "dungeonAreaNow", DungeonArea.now.uniqueName, load=>{
        const area = DungeonArea.valueOf(load);
        if(area){
            DungeonArea.now = area;
        }
    });
    ioInt(save, json, "dungeonAU", Dungeon.auNow, load=> Dungeon.auNow = load);
    ioStr(save, json, "sceneType", SceneType.now.uniqueName, load=>{
        const type = SceneType.valueOf(load);
        if(type){
            type.loadAction();
        }else{
            SceneType.TOWN.set();
            SceneType.TOWN.loadAction();
        }
    });

    for(let i = 0; i < Unit.players.length; i++){
        ioStr(save, json, `players_${i}`, Unit.players[i].player.uniqueName, load=>{
            const p = Player.valueOf(load);
            if(p){
                Unit.setPlayer( i, p );
            }
        });
    }


    ioInt(save, json, "SoundVolume", Sound.volume, load=> Sound.volume = load);
};

const storageCollectingSkill = (save:boolean, json:any):void=>{
    for(const cs of CollectingSkill.values){
        ioInt(save, json, cs.uniqueName, cs.lv, load=> cs.lv = load);
    }
};

const storagePartySkill = (save:boolean, json:any)=>{
    for(const skill of PartySkill.values){
        ioBool(save, json, `${skill.uniqueName}_has`, skill.has, load=> skill.has = load);
    }
    
    ioInt(save, json, "skills_length", PartySkill.skills.length, load=>{
        PartySkill.skills.length = load;
        for(let i = 0; i < PartySkill.skills.length; i++){
            if(!PartySkill.skills[i]){
                PartySkill.skills[i] = PartySkill.empty;
            }
        }
    });

    for(let i = 0; i < PartySkill.skills.length; i++){
        ioStr(save, json, `set_${i}`, PartySkill.skills[i].uniqueName, load=>{
            const skill = PartySkill.valueOf(load);
            if(skill){
                PartySkill.skills[i] = skill;
            }
        });
    }
};
