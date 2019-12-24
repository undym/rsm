import { Item } from "./item.js";
import { Eq, EqPos, EqEar } from "./eq.js";
import { Dungeon, DungeonArea } from "./dungeon/dungeon.js";
import { Prm, Unit } from "./unit.js";
import { Player } from "./player.js";
import { Tec, PassiveTec, ActiveTec } from "./tec.js";
import { Job } from "./job.js";
import { ConditionType, Condition } from "./condition.js";
import { PlayData, SceneType, Util, Flag } from "./util.js";
import { Color } from "./undym/type.js";
import { Mix } from "./mix.js";
import { PartySkill } from "./partyskill.js";
import { CollectingSkill } from "./collectingskill.js";
import { Sound } from "./sound.js";
import { PetFactory } from "./pet.js";
export class Version {
    /**Integer. */
    constructor(major, minior, mentener) {
        this.values = [major | 0, minior | 0, mentener | 0];
    }
    get major() { return this.values[0]; }
    get minior() { return this.values[1]; }
    get mentener() { return this.values[2]; }
    isNewerThan(version) {
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] < version.values[i]) {
                return false;
            }
            if (this.values[i] > version.values[i]) {
                return true;
            }
        }
        return false;
    }
    equals(version) {
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] !== version.values[i]) {
                return false;
            }
        }
        return true;
    }
    toString() { return `${this.major}.${this.minior}.${this.mentener}`; }
}
Version.NOW = new Version(0, 30, 4);
Version.updateInfo = [
    "(0.27.0)ダンジョン追加とか",
    "(0.27.1)いろいろ",
    "(0.27.2)技のターゲット選定のバグ修正",
    "(0.27.3)音楽の調整",
    "(0.28.0)ダンジョン追加",
    "(0.29.0)ダンジョン追加",
    "(0.29.1)合成の調整",
    "(0.29.2)音追加",
    "(0.29.3)音修正",
    "(0.29.4)音楽の調整",
    "(0.30.0)いろいろ",
    "(0.30.1)ゲーム開始時の音をつけた",
    "(0.30.2)やっぱりやめた",
    "(0.30.3)なにか",
    "(0.30.4)雪が最初からペガサスになってしまっていた",
];
let saveDataVersion;
export class SaveData {
    static exists() {
        return window.localStorage.getItem(this.data) !== null;
    }
    static delete() {
        window.localStorage.clear();
    }
    /** */
    static save() {
        let json = {};
        this.io("save", json);
        window.localStorage.setItem(this.data, JSON.stringify(json));
        Util.msg.set("セーブしました", Color.CYAN.bright);
        // console.log(JSON.stringify(json, undefined, 4));
        // console.log(JSON.stringify(json));
    }
    /**jsonStr指定でインポート. */
    static load(jsonStr) {
        if (!jsonStr) {
            jsonStr = window.localStorage.getItem(this.data);
        }
        if (jsonStr) {
            try {
                const json = JSON.parse(jsonStr);
                this.io("load", json);
                return true;
            }
            catch (e) {
                Util.msg.set("セーブデータのパース失敗");
                return false;
            }
        }
        return false;
    }
    /** */
    static export() {
        let json = {};
        this.io("save", json);
        return JSON.stringify(json);
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
    static io(type, json) {
        storageVersion(type, ioObject(type, json, "Version"));
        storageItem(type, ioObject(type, json, "Item"));
        storageEq(type, ioObject(type, json, "Eq"));
        storageEqEar(type, ioObject(type, json, "EqEar"));
        storageDungeon(type, ioObject(type, json, "Dungeon"));
        storagePlayer(type, ioObject(type, json, "Player"));
        storageMix(type, ioObject(type, json, "Mix"));
        storagePlayData(type, ioObject(type, json, "PlayData"));
        storageCollectingSkill(type, ioObject(type, json, "CollectingSkill"));
        storagePartySkill(type, ioObject(type, json, "PartySkill"));
    }
}
SaveData.data = "data";
const ioInt = (type, json, key, value, loadAction) => {
    switch (type) {
        case "save":
            json[key] = value | 0;
            break;
        case "load":
            if (key in json) {
                const load = json[key];
                const parsed = Number.parseInt(load);
                if (parsed !== undefined) {
                    loadAction(parsed);
                }
                else {
                    console.log(`ioInt() parseFail: "${key}":${load}`);
                }
            }
            break;
    }
};
const ioStr = (type, json, key, value, loadAction) => {
    switch (type) {
        case "save":
            json[key] = value;
            break;
        case "load":
            if (key in json) {
                loadAction(json[key]);
            }
            break;
    }
};
const ioBool = (type, json, key, value, loadAction) => {
    //セーブデータファイルの容量の削減のため、0,1で保存する。false,trueよりも短いので。
    switch (type) {
        case "save":
            if (value) {
                json[key] = 1;
            }
            else {
                json[key] = 0;
            }
            break;
        case "load":
            if (key in json) {
                if (json[key]) {
                    loadAction(true);
                }
                else {
                    loadAction(false);
                }
            }
            break;
    }
};
const ioObject = (type, json, key) => {
    switch (type) {
        case "save":
            return (json[key] = {});
        case "load":
            if (json[key]) {
                return json[key];
            }
            return {};
    }
};
const ioNumbers = (args) => {
    switch (args.type) {
        case "save":
            args.json[args.key] = to36Radix(args.digit, args.values);
            break;
        case "load":
            if (args.key in args.json) {
                const load = args.json[args.key];
                for (let i = 0, i2 = 0; i < load.length; i += args.digit) {
                    args.loadAction(parse36Radix(load, args.digit, i2), i2);
                    i2++;
                }
            }
            break;
    }
};
const ioBooleans = (args) => {
    ioNumbers({
        type: args.type,
        json: args.json,
        key: args.key,
        values: args.values.map(v => v ? 1 : 0),
        digit: 1,
        loadAction: (load, index) => {
            if (load === 1) {
                args.loadAction(true, index);
            }
            else {
                args.loadAction(false, index);
            }
        }
    });
};
const storageVersion = (type, json) => {
    let major = Version.NOW.major;
    let minior = Version.NOW.minior;
    let mentener = Version.NOW.mentener;
    ioInt(type, json, "major", Version.NOW.major, load => major = load);
    ioInt(type, json, "minior", Version.NOW.minior, load => minior = load);
    ioInt(type, json, "mentener", Version.NOW.mentener, load => mentener = load);
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
class Radix36Limit {
    static get(digit) {
        if (digit - 1 >= this.values.length) {
            for (let i = this.values.length; i < digit; i++) {
                this.values.push(this.values[i - 1] * 36);
            }
        }
        return this.values[digit - 1];
    }
}
Radix36Limit.values = [36];
/**
 * 指定の桁数の36進数に変換して文字列にまとめたものを返す。
 * to36Radix( 4, [0, 10, 1] );//"0000000a0001"
 * */
const to36Radix = (digit, values) => {
    let res = "";
    const limit = Radix36Limit.get(digit);
    for (let i = 0; i < values.length; i++) {
        if (values[i] > limit) {
            values[i] = limit;
        }
        let s = values[i].toString(36);
        for (let i = s.length; i < digit; i++) {
            s = "0" + s;
        }
        ;
        res = res + s;
    }
    return res;
};
const parse36Radix = (str, digit, index) => {
    return Number.parseInt(str.substring(digit * index, digit * (index + 1)), 36);
};
const storageItem = (type, json) => {
    for (const item of Item.values) {
        const value = to36Radix(
        /*digit*/ 4, [
            item.num,
            item.totalGetCount,
            item.remainingUseNum,
        ]);
        ioStr(type, json, item.uniqueName, value, load => {
            item.num = parse36Radix(load, /*digit*/ 4, /*index*/ 0);
            item.totalGetCount = parse36Radix(load, /*digit*/ 4, /*index*/ 1);
            item.remainingUseNum = parse36Radix(load, /*digit*/ 4, /*index*/ 2);
        });
    }
};
const storageEq = (type, json) => {
    for (const eq of Eq.values) {
        const value = to36Radix(
        /*digit*/ 4, [
            eq.num,
            eq.totalGetCount,
        ]);
        ioStr(type, json, eq.uniqueName, value, load => {
            eq.num = parse36Radix(load, /*digit*/ 4, /*index*/ 0);
            eq.totalGetCount = parse36Radix(load, /*digit*/ 4, /*index*/ 1);
        });
    }
};
const storageEqEar = (type, json) => {
    for (const ear of EqEar.values) {
        const obj = ioObject(type, json, ear.uniqueName);
        ioInt(type, obj, "num", ear.num, load => ear.num = load);
        ioInt(type, obj, "count", ear.totalGetCount, load => ear.totalGetCount = load);
    }
};
const storageDungeon = (type, json) => {
    for (const d of Dungeon.values) {
        const obj = ioObject(type, json, d.uniqueName);
        ioInt(type, obj, "tkey", d.treasureKey, load => d.treasureKey = load);
        ioInt(type, obj, "clear", d.dungeonClearCount, load => d.dungeonClearCount = load);
        ioInt(type, obj, "ex", d.exKillCount, load => d.exKillCount = load);
    }
};
const storagePlayer = (type, json) => {
    for (const p of Player.values) {
        const obj = ioObject(type, json, p.uniqueName);
        const u = p.ins;
        if (!saveDataVersion.isNewerThan(new Version(0, 26, 12))) {
            ioBool(type, obj, "member", p.member, load => p.member = load);
            ioBool(type, obj, "exists", u.exists, load => u.exists = load);
            ioBool(type, obj, "dead", u.dead, load => u.dead = load);
        }
        if (!saveDataVersion.isNewerThan(new Version(0, 26, 11))) {
            const prmObj = ioObject(type, obj, "Prm");
            for (const prm of Prm.values) {
                ioInt(type, prmObj, `${prm}_b`, u.prm(prm).base | 0, load => u.prm(prm).base = load);
            }
        }
        for (let i = 0; i < Unit.EAR_NUM; i++) {
            ioStr(type, obj, `eqear_${i}`, u.getEqEar(i).uniqueName, load => {
                const ear = EqEar.valueOf(load);
                if (ear) {
                    u.setEqEar(i, ear);
                }
            });
        }
        for (const pos of EqPos.values) {
            ioStr(type, obj, `eq_${pos}`, u.getEq(pos).uniqueName, load => {
                const eq = Eq.valueOf(load);
                if (eq) {
                    u.setEq(pos, eq);
                }
            });
        }
        ioStr(type, obj, `job`, u.job.uniqueName, load => {
            const job = Job.valueOf(load);
            if (job) {
                u.job = job;
            }
        });
        let tecsLen = u.tecs.length;
        ioInt(type, obj, `tecs_length`, u.tecs.length, load => tecsLen = load);
        u.tecs.length = tecsLen;
        for (let i = 0; i < u.tecs.length; i++) {
            if (!u.tecs[i]) {
                u.tecs[i] = Tec.empty;
            }
        }
        for (let i = 0; i < tecsLen; i++) {
            const key = `tec_${i}`;
            const value = u.tecs[i].uniqueName;
            ioStr(type, obj, key, value, load => {
                const passive = PassiveTec.valueOf(load);
                if (passive) {
                    u.tecs[i] = passive;
                    return;
                }
                const active = ActiveTec.valueOf(load);
                if (active) {
                    u.tecs[i] = active;
                    return;
                }
            });
        }
        { //condition
            const conditionObj = ioObject(type, obj, "Condition");
            let savedConditions = [];
            for (const ctype of ConditionType.values) {
                const set = u.getConditionSet(ctype);
                const loadSet = { condition: Condition.empty, value: 0 };
                ioStr(type, conditionObj, `${ctype.uniqueName}_condition`, set.condition.uniqueName, load => {
                    const condition = Condition.valueOf(load);
                    if (condition) {
                        loadSet.condition = condition;
                    }
                });
                ioInt(type, conditionObj, `${ctype.uniqueName}_value`, set.value, load => loadSet.value = load);
                savedConditions.push(loadSet);
            }
            if (type === "load") {
                for (let set of savedConditions) {
                    u.setCondition(set.condition, set.value);
                }
            }
        }
        { //pet
            const petObj = ioObject(type, obj, "Pet");
            if (type === "save" && u.pet) {
                ioInt(type, petObj, "hp", u.pet.hp, load => { });
                ioStr(type, petObj, "name", u.pet.uniqueName, load => { });
            }
            if (type === "load") {
                let hp = 0;
                ioInt(type, petObj, "hp", 0, load => hp = load);
                ioStr(type, petObj, "name", "", load => {
                    const factory = PetFactory.valueOf(load);
                    if (factory) {
                        factory.create(hp);
                    }
                });
            }
        }
    }
    ioBooleans({
        type: type,
        json: json,
        key: "member",
        values: Player.values.map(p => p.member),
        loadAction: (load, index) => Player.values[index].member = load,
    });
    ioBooleans({
        type: type,
        json: json,
        key: "exists",
        values: Player.values.map(p => p.ins.exists),
        loadAction: (load, index) => Player.values[index].ins.exists = load,
    });
    ioBooleans({
        type: type,
        json: json,
        key: "dead",
        values: Player.values.map(p => p.ins.dead),
        loadAction: (load, index) => Player.values[index].ins.dead = load,
    });
    if (saveDataVersion.isNewerThan(new Version(0, 26, 11))) {
        const prmObj = ioObject(type, json, "Prm");
        for (const prm of Prm.values) {
            ioNumbers({
                type: type,
                json: prmObj,
                key: `${prm}`,
                values: Player.values.map(p => p.ins.prm(prm).base),
                digit: 4,
                loadAction: (load, index) => Player.values[index].ins.prm(prm).base = load,
            });
        }
    }
    Player.values.forEach(p => p.ins.equip());
    const activeTecObj = ioObject(type, json, "ActiveTec");
    for (const tec of ActiveTec.values) {
        ioBooleans({
            type: type,
            json: activeTecObj,
            key: tec.uniqueName,
            values: Player.values.map(p => p.ins.isMasteredTec(tec)),
            loadAction: (load, index) => Player.values[index].ins.setMasteredTec(tec, load),
        });
    }
    const passiveTecObj = ioObject(type, json, "PassiveTec");
    for (const tec of PassiveTec.values) {
        ioBooleans({
            type: type,
            json: passiveTecObj,
            key: tec.uniqueName,
            values: Player.values.map(p => p.ins.isMasteredTec(tec)),
            loadAction: (load, index) => Player.values[index].ins.setMasteredTec(tec, load),
        });
    }
    const jobParentObj = ioObject(type, json, "JobLvExp");
    for (const job of Job.values) {
        const jobObj = ioObject(type, jobParentObj, `${job.uniqueName}`);
        ioNumbers({
            type: type,
            json: jobObj,
            key: "lv",
            values: Player.values.map(p => p.ins.getJobLv(job)),
            digit: 4,
            loadAction: (load, index) => Player.values[index].ins.setJobLv(job, load),
        });
        ioNumbers({
            type: type,
            json: jobObj,
            key: "exp",
            values: Player.values.map(p => p.ins.getJobExp(job)),
            digit: 4,
            loadAction: (load, index) => Player.values[index].ins.setJobExp(job, load),
        });
    }
};
const storageMix = (type, json) => {
    if (saveDataVersion.isNewerThan(new Version(0, 26, 11))) {
        for (const mix of Mix.values) {
            ioInt(type, json, `${mix.uniqueName}`, mix.count, load => mix.count = load);
        }
    }
    else {
        for (const mix of Mix.values) {
            ioInt(type, json, `${mix.uniqueName}_c`, mix.count, load => mix.count = load);
        }
    }
};
const storagePlayData = (type, json) => {
    ioInt(type, json, "yen", PlayData.yen, load => PlayData.yen = load);
    ioBool(type, json, "gotAnyEq", PlayData.gotAnyEq, load => PlayData.gotAnyEq = load);
    ioStr(type, json, "dungeonNow", Dungeon.now.uniqueName, load => {
        const dungeon = Dungeon.valueOf(load);
        if (dungeon) {
            Dungeon.now = dungeon;
        }
    });
    ioStr(type, json, "dungeonAreaNow", DungeonArea.now.uniqueName, load => {
        const area = DungeonArea.valueOf(load);
        if (area) {
            DungeonArea.now = area;
        }
    });
    ioInt(type, json, "dungeonAU", Dungeon.auNow, load => Dungeon.auNow = load);
    ioStr(type, json, "sceneType", SceneType.now.uniqueName, load => {
        const type = SceneType.valueOf(load);
        if (type) {
            type.loadAction();
        }
        else {
            SceneType.TOWN.set();
            SceneType.TOWN.loadAction();
        }
    });
    for (let i = 0; i < Unit.players.length; i++) {
        ioStr(type, json, `players_${i}`, Unit.players[i].player.uniqueName, load => {
            const p = Player.valueOf(load);
            if (p) {
                Unit.setPlayer(i, p);
            }
        });
    }
    ioInt(type, json, "SoundVolume", Sound.getVolume("sound"), load => Sound.setVolume("sound", load));
    ioInt(type, json, "MusicVolume", Sound.getVolume("music"), load => Sound.setVolume("music", load));
    const flagObj = ioObject(type, json, "Flag");
    for (const flag of Flag.values()) {
        ioBool(type, flagObj, flag.uniqueName, flag.done, load => flag.done = load);
    }
};
const storageCollectingSkill = (type, json) => {
    for (const cs of CollectingSkill.values) {
        ioInt(type, json, cs.uniqueName, cs.lv, load => cs.lv = load);
    }
};
const storagePartySkill = (type, json) => {
    for (const skill of PartySkill.values) {
        ioBool(type, json, `${skill.uniqueName}_has`, skill.has, load => skill.has = load);
    }
    ioInt(type, json, "skills_length", PartySkill.skills.length, load => {
        PartySkill.skills.length = load;
        for (let i = 0; i < PartySkill.skills.length; i++) {
            if (!PartySkill.skills[i]) {
                PartySkill.skills[i] = PartySkill.empty;
            }
        }
    });
    for (let i = 0; i < PartySkill.skills.length; i++) {
        ioStr(type, json, `set_${i}`, PartySkill.skills[i].uniqueName, load => {
            const skill = PartySkill.valueOf(load);
            if (skill) {
                PartySkill.skills[i] = skill;
            }
        });
    }
};
