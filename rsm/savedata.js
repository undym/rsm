import { Item } from "./item.js";
import { Eq, EqPos, EqEar } from "./eq.js";
import { Dungeon, DungeonArea } from "./dungeon/dungeon.js";
import { Prm, Unit } from "./unit.js";
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
Version.NOW = new Version(0, 24, 0);
Version.updateInfo = [
    "(0.20.15)バグ修正",
    "(0.21.0)もろもろ追加",
    "(0.21.1)微調整",
    "(0.22.0)ストーリーの表示変更",
    "(0.22.1)ストーリーの表示調整",
    "(0.23.0)いろいろ",
    "(0.24.0)セーブデータの仕様変更",
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
        // if(!this.exists()){
        //     window.localStorage.setItem(this.data, "true");
        // }
        let json = {};
        this.io(/*save*/ true, json);
        window.localStorage.setItem(this.data, JSON.stringify(json));
        Util.msg.set("セーブしました", Color.CYAN.bright);
    }
    /**jsonStr指定でインポート. */
    static load(jsonStr) {
        if (!jsonStr) {
            const str = window.localStorage.getItem("data");
            if (str) {
                jsonStr = str;
            }
        }
        if (jsonStr) {
            try {
                const json = JSON.parse(jsonStr);
                this.io(/*save*/ false, json);
            }
            catch (e) {
                Util.msg.set("セーブデータのパース失敗");
            }
        }
    }
    /** */
    static export() {
        let json = {};
        this.io(/*save*/ true, json);
        return JSON.stringify(json);
    }
    static io(save, json) {
        storageVersion(save, ioObject(save, json, "Version"));
        storageItem(save, ioObject(save, json, "Item"));
        storageEq(save, ioObject(save, json, "Eq"));
        storageEqEar(save, ioObject(save, json, "EqEar"));
        storageDungeon(save, ioObject(save, json, "Dungeon"));
        storagePlayer(save, ioObject(save, json, "Player"));
        storageMix(save, ioObject(save, json, "Mix"));
        storagePlayData(save, ioObject(save, json, "PlayData"));
        storageCollectingSkill(save, ioObject(save, json, "CollectingSkill"));
        storagePartySkill(save, ioObject(save, json, "PartySkill"));
    }
}
SaveData.data = "data";
const ioInt = (save, json, key, value, loadAction) => {
    if (save) {
        json[key] = value | 0;
    }
    else {
        const load = json[key];
        if (load) {
            const parsed = Number.parseInt(load);
            if (parsed !== undefined) {
                loadAction(parsed);
            }
            else {
                console.log(`ioInt() parseFail: "${key}":${load}`);
            }
        }
    }
};
const ioStr = (save, json, key, value, loadAction) => {
    if (save) {
        json[key] = value;
    }
    else {
        const load = json[key];
        if (load) {
            loadAction(load);
        }
    }
};
const ioBool = (save, json, key, value, loadAction) => {
    if (save) {
        json[key] = value;
    }
    else {
        const load = json[key];
        if (load !== undefined) {
            if (load) {
                loadAction(true);
            }
            else {
                loadAction(false);
            }
        }
    }
};
const ioObject = (save, json, key) => {
    if (save) {
        return (json[key] = {});
    }
    else {
        if (json[key]) {
            return json[key];
        }
        return {};
    }
};
const storageVersion = (save, json) => {
    let major = Version.NOW.major;
    let minior = Version.NOW.minior;
    let mentener = Version.NOW.mentener;
    ioInt(save, json, "major", Version.NOW.major, load => major = load);
    ioInt(save, json, "minior", Version.NOW.minior, load => minior = load);
    ioInt(save, json, "mentener", Version.NOW.mentener, load => mentener = load);
    saveDataVersion = new Version(major, minior, mentener);
};
const storageItem = (save, json) => {
    for (const item of Item.values) {
        const obj = ioObject(save, json, item.uniqueName);
        ioInt(save, obj, "num", item.num, load => item.num = load);
        ioInt(save, obj, "totalGetCount", item.totalGetCount, load => item.totalGetCount = load);
        ioInt(save, obj, "num", item.remainingUseNum, load => item.remainingUseNum = load);
    }
};
const storageEq = (save, json) => {
    for (const eq of Eq.values) {
        const obj = ioObject(save, json, eq.uniqueName);
        ioInt(save, obj, "num", eq.num, load => eq.num = load);
        ioInt(save, obj, "totalGetCount", eq.totalGetCount, load => eq.totalGetCount = load);
    }
};
const storageEqEar = (save, json) => {
    for (const ear of EqEar.values) {
        const obj = ioObject(save, json, ear.uniqueName);
        ioInt(save, obj, "num", ear.num, load => ear.num = load);
        ioInt(save, obj, "totalGetCount", ear.totalGetCount, load => ear.totalGetCount = load);
    }
};
const storageDungeon = (save, json) => {
    for (const d of Dungeon.values) {
        const obj = ioObject(save, json, d.uniqueName);
        ioInt(save, obj, "treasureKey", d.treasureKey, load => d.treasureKey = load);
        ioInt(save, obj, "dungeonClearCount", d.dungeonClearCount, load => d.dungeonClearCount = load);
        ioInt(save, obj, "exKillCount", d.exKillCount, load => d.exKillCount = load);
    }
};
const storagePlayer = (save, json) => {
    for (const p of Player.values) {
        const obj = ioObject(save, json, p.uniqueName);
        ioBool(save, obj, "member", p.member, load => p.member = load);
        const u = p.ins;
        ioBool(save, obj, "exists", u.exists, load => u.exists = load);
        ioBool(save, obj, "dead", u.dead, load => u.dead = load);
        for (const prm of Prm.values) {
            ioInt(save, obj, `${prm}_base`, u.prm(prm).base | 0, load => u.prm(prm).base = load);
            ioInt(save, obj, `${prm}_eq`, u.prm(prm).eq | 0, load => u.prm(prm).eq = load);
            ioInt(save, obj, `${prm}_battle`, u.prm(prm).battle | 0, load => u.prm(prm).battle = load);
        }
        for (let i = 0; i < Unit.EAR_NUM; i++) {
            ioStr(save, obj, `eqear_${i}`, u.getEqEar(i).uniqueName, load => {
                const ear = EqEar.valueOf(load);
                if (ear) {
                    u.setEqEar(i, ear);
                }
            });
        }
        for (const pos of EqPos.values) {
            ioStr(save, obj, `eq_${pos}`, u.getEq(pos).uniqueName, load => {
                const eq = Eq.valueOf(load);
                if (eq) {
                    u.setEq(pos, eq);
                }
            });
        }
        ioStr(save, obj, `job`, u.job.uniqueName, load => {
            const job = Job.valueOf(load);
            if (job) {
                u.job = job;
            }
        });
        for (const job of Job.values) {
            ioInt(save, obj, `jobLv_${job.uniqueName}`, u.getJobLv(job), load => {
                u.setJobLv(job, load);
            });
            ioInt(save, obj, `jobExp_${job.uniqueName}`, u.getJobExp(job), load => {
                u.setJobExp(job, load);
            });
        }
        let tecsLen = u.tecs.length;
        ioInt(save, obj, `tecs_length`, u.tecs.length, load => tecsLen = load);
        u.tecs.length = tecsLen;
        for (let i = 0; i < u.tecs.length; i++) {
            if (!u.tecs[i]) {
                u.tecs[i] = Tec.empty;
            }
        }
        for (let i = 0; i < tecsLen; i++) {
            const key = `tec_${i}`;
            const value = u.tecs[i].uniqueName;
            ioStr(save, obj, key, value, load => {
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
        {
            const passiveObj = ioObject(save, obj, "PassiveTec");
            for (const tec of PassiveTec.values) {
                ioBool(save, passiveObj, tec.uniqueName, u.isMasteredTec(tec), load => {
                    u.setMasteredTec(tec, load);
                });
            }
            const activeObj = ioObject(save, obj, "ActiveTec");
            for (const tec of ActiveTec.values) {
                ioBool(save, activeObj, tec.uniqueName, u.isMasteredTec(tec), load => {
                    u.setMasteredTec(tec, load);
                });
            }
        }
        { //condition
            const conditionObj = ioObject(save, obj, "Condition");
            let savedConditions = [];
            for (const type of ConditionType.values) {
                const set = u.getConditionSet(type);
                const loadSet = { condition: Condition.empty, value: 0 };
                ioStr(save, conditionObj, `${type.uniqueName}_condition`, set.condition.uniqueName, load => {
                    const condition = Condition.valueOf(load);
                    if (condition) {
                        loadSet.condition = condition;
                    }
                });
                ioInt(save, conditionObj, `${type.uniqueName}_value`, set.value, load => loadSet.value = load);
                savedConditions.push(loadSet);
            }
            if (!save) {
                for (let set of savedConditions) {
                    u.setCondition(set.condition, set.value);
                }
            }
        }
    }
};
const storageMix = (save, json) => {
    for (const mix of Mix.values) {
        ioInt(save, json, `${mix.uniqueName}_count`, mix.count, load => mix.count = load);
    }
};
const storagePlayData = (save, json) => {
    ioInt(save, json, "yen", PlayData.yen, load => PlayData.yen = load);
    ioBool(save, json, "gotAnyEq", PlayData.gotAnyEq, load => PlayData.gotAnyEq = load);
    ioStr(save, json, "`dungeonNow", Dungeon.now.uniqueName, load => {
        const dungeon = Dungeon.valueOf(load);
        if (dungeon) {
            Dungeon.now = dungeon;
        }
    });
    ioStr(save, json, "dungeonAreaNow", DungeonArea.now.uniqueName, load => {
        const area = DungeonArea.valueOf(load);
        if (area) {
            DungeonArea.now = area;
        }
    });
    ioInt(save, json, "dungeonAU", Dungeon.auNow, load => Dungeon.auNow = load);
    ioStr(save, json, "sceneType", SceneType.now.uniqueName, load => {
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
        ioStr(save, json, `players_${i}`, Unit.players[i].player.uniqueName, load => {
            const p = Player.valueOf(load);
            if (p) {
                Unit.setPlayer(i, p);
            }
        });
    }
    ioInt(save, json, "SoundVolume", Sound.volume, load => Sound.volume = load);
};
const storageCollectingSkill = (save, json) => {
    for (const cs of CollectingSkill.values) {
        ioInt(save, json, cs.uniqueName, cs.lv, load => cs.lv = load);
    }
};
const storagePartySkill = (save, json) => {
    for (const skill of PartySkill.values) {
        ioBool(save, json, `${skill.uniqueName}_has`, skill.has, load => skill.has = load);
    }
    ioInt(save, json, "skills_length", PartySkill.skills.length, load => {
        PartySkill.skills.length = load;
        for (let i = 0; i < PartySkill.skills.length; i++) {
            if (!PartySkill.skills[i]) {
                PartySkill.skills[i] = PartySkill.empty;
            }
        }
    });
    for (let i = 0; i < PartySkill.skills.length; i++) {
        ioStr(save, json, `set_${i}`, PartySkill.skills[i].uniqueName, load => {
            const skill = PartySkill.valueOf(load);
            if (skill) {
                PartySkill.skills[i] = skill;
            }
        });
    }
};
