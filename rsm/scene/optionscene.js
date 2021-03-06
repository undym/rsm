var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Scene } from "../undym/scene.js";
import { Place, Util, Debug, PlayData } from "../util.js";
import { Btn } from "../widget/btn.js";
import { List } from "../widget/list.js";
import { EffectTest } from "../fx/fx.js";
import { Item, ItemType } from "../item.js";
import { ActiveTec, PassiveTec } from "../tec.js";
import { Player } from "../player.js";
import { SaveData } from "../savedata.js";
import { EqEar, Eq } from "../eq.js";
import { PartySkill } from "../partyskill.js";
import { Sound, Music } from "../sound.js";
import { Dungeon } from "../dungeon/dungeon.js";
import { DrawYen, DrawSTBoxes, DrawUnitDetail } from "./sceneutil.js";
export class OptionScene extends Scene {
    constructor(args) {
        super();
        this.args = args;
        this.list = new List(6);
    }
    init() {
        super.clear();
        super.add(Place.DUNGEON_DATA, Util.msg);
        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.LIST_TYPE, this.list);
        super.add(Place.LIST_BTN, new Btn("<<", () => {
            Sound.system.play();
            this.runReturn();
        }));
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        this.setDefList();
    }
    runReturn() {
        this.removeElements();
        this.args.onreturn();
    }
    removeElements() {
        for (const id of ["export", "importText", "inputParent", "runImport"]) {
            for (;;) {
                const e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                else {
                    break;
                }
            }
        }
    }
    setDefList() {
        this.list.clear();
        this.list.add({
            center: () => "データ削除",
            push: elm => {
                this.setReadyDeleteSaveData();
            },
        });
        this.list.add({
            center: () => "-",
            push: elm => {
            },
        });
        this.list.add({
            center: () => "再読み込み",
            push: elm => {
                this.setReload();
            },
        });
        this.list.add({
            center: () => "効果音+",
            push: elm => {
                Sound.setVolume(Sound.getVolume() + 1);
                Util.msg.set("効果音音量:" + Sound.getVolume());
                Sound.save.play();
            },
        });
        this.list.add({
            center: () => "効果音-",
            push: elm => {
                Sound.setVolume(Sound.getVolume() - 1);
                Util.msg.set("効果音音量:" + Sound.getVolume());
                Sound.save.play();
            },
        });
        this.list.add({
            center: () => "音楽+",
            push: elm => {
                Music.setVolume(Music.getVolume() + 1);
                Util.msg.set("音楽音量:" + Music.getVolume());
            },
        });
        this.list.add({
            center: () => "音楽-",
            push: elm => {
                Music.setVolume(Music.getVolume() - 1);
                Util.msg.set("音楽音量:" + Music.getVolume());
            },
        });
        this.list.add({
            center: () => "export",
            push: elm => {
                this.removeElements();
                Util.msg.set("セーブデータを出力します");
                Util.msg.set("文字列をどうにかコピーしてどうにかファイルに保存してください");
                const encoded = new TextEncoder().encode(SaveData.export());
                let save = "";
                for (const e of encoded) {
                    //2桁区切りでエンコードされたものを書き込んでいく
                    //1桁のものは左を"+"で埋める
                    const e36 = e.toString(36);
                    if (e36.length < 2) {
                        save += "+" + e36;
                    }
                    else {
                        save += e36;
                    }
                }
                const a = document.createElement("textarea");
                a.id = "export";
                a.readOnly = true;
                a.value = save;
                a.style.position = "fixed";
                a.style.top = "10vh";
                a.style.left = "50vw";
                a.style.width = "50vw";
                a.style.height = "20vh";
                a.onclick = ev => {
                    a.setSelectionRange(0, save.length);
                };
                document.body.appendChild(a);
                a.focus();
                a.setSelectionRange(0, save.length);
            },
        });
        this.list.add({
            center: () => "import",
            push: (() => {
                let readText;
                const a = document.createElement("textarea");
                a.id = "importText";
                a.readOnly = true;
                a.style.position = "fixed";
                a.style.top = "0vh";
                a.style.left = "50vw";
                a.style.width = "50vw";
                a.style.height = "30vh";
                const xhr = new XMLHttpRequest();
                xhr.onload = req => {
                    const res = xhr.responseText;
                    a.readOnly = false;
                    a.innerText = res;
                    a.readOnly = true;
                    readText = res;
                };
                const inputParent = document.createElement("div");
                inputParent.id = "inputParent";
                inputParent.style.position = "fixed";
                inputParent.style.top = "30vh";
                inputParent.style.left = "50vw";
                inputParent.style.width = "50vw";
                inputParent.style.height = "20vh";
                inputParent.style.background = "gray";
                const b = document.createElement("input");
                b.id = "chooseImportFile";
                b.type = "file";
                b.style.position = "fixed";
                b.style.top = "30vh";
                b.style.left = "50vw";
                b.style.width = "50vw";
                b.style.height = "20vh";
                b.style.fontSize = "4rem";
                b.addEventListener("change", ev => {
                    xhr.abort();
                    if (b.files && b.files[0]) {
                        const blob = new Blob([b.files[0]]);
                        const url = URL.createObjectURL(blob);
                        xhr.open("GET", url);
                        xhr.send();
                    }
                });
                inputParent.appendChild(b);
                const runImport = document.createElement("button");
                runImport.id = "runImport";
                runImport.style.position = "fixed";
                runImport.style.top = "50vh";
                runImport.style.left = "50vw";
                runImport.style.width = "50vw";
                runImport.style.height = "20vh";
                runImport.style.fontSize = "4rem";
                runImport.innerText = "実行";
                runImport.onclick = ev => {
                    if (!readText) {
                        Util.msg.set("ファイルが選択されていません");
                        return;
                    }
                    const arr = new Uint8Array(readText.length / 2);
                    for (let i = 0; i < readText.length; i += 2) {
                        const sp = readText.substring(i, i + 2);
                        const index = (i / 2) | 0;
                        if (sp.substring(0, 1) === "+") {
                            arr[index] = Number.parseInt(sp.substring(1, 2), 36);
                        } //桁数を合わせるために付けた"+"を外す
                        else {
                            arr[index] = Number.parseInt(sp, 36);
                        }
                    }
                    const decoded = new TextDecoder().decode(arr);
                    if (SaveData.load(decoded)) {
                        Util.msg.set("import成功");
                        this.removeElements();
                    }
                };
                return (elm) => __awaiter(this, void 0, void 0, function* () {
                    this.removeElements();
                    Util.msg.set("出力されたセーブデータを入力します");
                    document.body.appendChild(a);
                    document.body.appendChild(inputParent);
                    document.body.appendChild(runImport);
                });
            })(),
        });
        if (Debug.debugMode) {
            this.list.add({
                center: () => "Debug",
                push: elm => {
                    this.setDebug();
                },
            });
        }
    }
    setReload() {
        Util.msg.set("再読み込みしますか？");
        this.list.clear();
        this.list.add({
            center: () => "はい",
            push: elm => {
                window.location.reload(true);
            },
        });
        this.list.add({
            center: () => "いいえ",
            push: elm => {
                Util.msg.set("＞いいえ");
                this.setDefList();
            },
        });
        this.list.add({
            center: () => "<<",
            push: elm => {
                Util.msg.set("やめた");
                this.setDefList();
            },
        });
    }
    setReadyDeleteSaveData() {
        Util.msg.set("セーブデータを削除しますか？");
        this.list.clear();
        this.list.add({
            center: () => "はい",
            push: elm => {
                Util.msg.set("＞はい");
                this.setReadyDeleteSaveData2();
            },
        });
        this.list.add({
            center: () => "いいえ",
            push: elm => {
                Util.msg.set("＞いいえ");
                this.setDefList();
            },
        });
        this.list.add({
            center: () => "<<",
            push: elm => {
                Util.msg.set("やめた");
                this.setDefList();
            },
        });
    }
    setReadyDeleteSaveData2() {
        this.list.clear();
        this.list.add({
            center: () => "削除実行",
            push: elm => {
                SaveData.delete();
                window.location.reload(true);
            },
        });
        this.list.add({
            center: () => "<<",
            push: elm => {
                Util.msg.set("やめた");
                this.setDefList();
            },
        });
    }
    setDebug() {
        this.list.clear();
        this.list.add({
            center: () => "EffectTest",
            push: elm => {
                Scene.load(new EffectTest({
                    onreturn: () => {
                        Scene.load(new OptionScene(this.args));
                    },
                }));
            },
        });
        this.list.add({
            center: () => "アイテム入手",
            push: elm => {
                for (let item of Item.values) {
                    item.num = item.numLimit;
                }
                Util.msg.set("アイテム入手");
            },
        });
        this.list.add({
            center: () => "素材入手",
            push: elm => {
                for (let item of ItemType.素材.values) {
                    item.num = item.numLimit;
                }
                Util.msg.set("素材入手");
            },
        });
        this.list.add({
            center: () => "技習得",
            push: elm => {
                for (let p of Player.values) {
                    for (let tec of ActiveTec.values) {
                        p.ins.setMasteredTec(tec, true);
                    }
                    for (let tec of PassiveTec.values) {
                        p.ins.setMasteredTec(tec, true);
                    }
                }
                Util.msg.set("技習得");
            },
        });
        this.list.add({
            center: () => "装備入手",
            push: elm => {
                for (const eq of EqEar.values) {
                    eq.num += 1;
                }
                for (const eq of Eq.values) {
                    eq.num += 1;
                }
                Util.msg.set("装備入手");
            },
        });
        this.list.add({
            center: () => "パーティースキル入手",
            push: elm => {
                for (const skill of PartySkill.values) {
                    skill.has = true;
                }
                Util.msg.set("パーティースキル入手");
            },
        });
        this.list.add({
            center: () => "金",
            push: elm => {
                const value = 99999;
                PlayData.yen += value;
                Util.msg.set(`yen+${value}`);
            },
        });
        this.list.add({
            center: () => "鍵",
            push: elm => {
                for (const d of Dungeon.values) {
                    d.treasureKey += 10;
                }
                Item.丸い鍵.add(10);
                Item.三角鍵.add(10);
            },
        });
        this.list.add({
            center: () => "BP",
            push: elm => {
                const value = 9999;
                for (const p of Player.values) {
                    p.ins.bp += value;
                }
                Util.msg.set(`bp+${value}`);
            },
        });
        this.list.add({
            center: () => "Option",
            push: elm => {
                this.setDefList();
            },
        });
        this.list.add({
            center: () => "戻る",
            push: elm => {
                this.runReturn();
            },
        });
    }
}
