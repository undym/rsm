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
import { Rect, Color } from "../undym/type.js";
import { ILayout, RatioLayout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { TownScene } from "./townscene.js";
import { List } from "../widget/list.js";
import { FXTest } from "../fx/fx.js";
import { Item, ItemType } from "../item.js";
import { Graphics } from "../graphics/graphics.js";
import { ActiveTec, PassiveTec } from "../tec.js";
import { Player } from "../player.js";
import { SaveData } from "../savedata.js";
import { EqEar, Eq } from "../eq.js";
import { PartySkill } from "../partyskill.js";
import { Sound } from "../sound.js";
import { Dungeon } from "../dungeon/dungeon.js";
const list = new List(6);
let returnAction = () => { };
export const createOptionBtn = () => {
    // const w = 4;
    // const h = 3;
    // const l = new FlowLayout(w,h);
    setOptionBtn();
    const listH = 1 - Place.LIST_BTN_H;
    return new RatioLayout()
        .add(new Rect(0, 0, 1, listH), list)
        .add(new Rect(0, listH, 1, 1 - listH), new Btn("<<", () => {
        returnAction();
    }));
    ;
};
const setOptionBtn = () => {
    list.clear();
    list.add({
        center: () => "データ削除",
        push: elm => {
            setSaveDataDeleteBtn();
        },
    });
    list.add({
        center: () => "-",
        push: elm => {
        },
    });
    list.add({
        center: () => "音量↑",
        push: elm => {
            Sound.volume++;
            Util.msg.set(`${Sound.volume}`);
            Sound.save.play();
        },
    });
    list.add({
        center: () => "音量↓",
        push: elm => {
            Sound.volume--;
            Util.msg.set(`${Sound.volume}`);
            Sound.save.play();
        },
    });
    list.add({
        center: () => "export",
        push: elm => {
            const encoder = new TextEncoder();
            const encoded = encoder.encode(SaveData.export());
            let save = "";
            for (const e of encoded) {
                save += e.toString(36) + "\n";
            }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([save], { type: "text.plain" }));
            a.download = "rsm_export.txt";
            a.click();
            // const file = new File([encoded], "rsm_export.txt");
            // const dl = document.createElement("a");
            // dl.id = "export";
            // dl.download = "rsm_export";
            // dl.href = URL.createObjectURL(new Blob([save], {type: "text.plain"}));
            // dl.dataset.downloadurl = ["text/plain", dl.download, dl.href].join(":");
            // dl.style.position = "fixed";
            // dl.style.width = "33vh";
            // dl.style.height = "33vw";
            // dl.style.transformOrigin = "top left";
            // dl.style.transform = "translateX(66vw) translateY(33vh) rotate(90deg)";
            // dl.style.fontSize = "30px";
            // dl.style.backgroundColor = "black";
            // dl.innerHTML = "EXPORT";
            // position:fixed;
            // width:33vh;
            // height:33vw;
            // transform-origin: top left;
            // transform: translateX(66vw) translateY(33vh) rotate(90deg);
            // visibility: hidden;
            // font-size: 30px;
            // document.body.appendChild(dl);
        },
    });
    list.add({
        center: () => "export2",
        push: elm => {
            const encoder = new TextEncoder();
            const encoded = encoder.encode(SaveData.export());
            let save = "";
            for (const e of encoded) {
                save += e.toString(36) + "\n";
            }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([save], { type: "text.plain" }));
            a.download = "rsm_export.txt";
            a.addEventListener("touchend", ev => {
                a.click();
            });
            // const file = new File([encoded], "rsm_export.txt");
            // const dl = document.createElement("a");
            // dl.id = "export";
            // dl.download = "rsm_export";
            // dl.href = URL.createObjectURL(new Blob([save], {type: "text.plain"}));
            // dl.dataset.downloadurl = ["text/plain", dl.download, dl.href].join(":");
            a.style.position = "fixed";
            a.style.width = "33vh";
            a.style.height = "33vw";
            a.style.transformOrigin = "top left";
            a.style.transform = "translateX(66vw) translateY(33vh) rotate(90deg)";
            a.style.fontSize = "30px";
            a.style.backgroundColor = "black";
            a.innerHTML = "EXPORT";
            document.body.appendChild(a);
        },
    });
    list.add({
        center: () => "inport",
        push: elm => {
        },
    });
    // list.add({
    //     center:()=>"EXPORT",
    //     push:elm=>{
    //         const textarea = document.createElement('textarea') as HTMLTextAreaElement;
    //         textarea.value = SaveData.export();
    //         textarea.selectionStart = 0;
    //         textarea.selectionEnd = textarea.value.length;
    //         const s = textarea.style;
    //         s.position = 'fixed';
    //         s.left = '-100%';
    //         document.body.appendChild(textarea);
    //         textarea.focus();
    //         const result = document.execCommand('copy');
    //         textarea.blur();
    //         document.body.removeChild(textarea);
    //         // true なら実行できている falseなら失敗か対応していないか
    //         if(result){
    //             Util.msg.set("クリップボードにコピーしました");
    //         }else{
    //             Util.msg.set("失敗");
    //         }
    //     },
    // });
    // list.add({
    //     center:()=>"INPORT",
    //     push:async elm=>{
    //     },
    // });
    if (Debug.debugMode) {
        list.add({
            center: () => "Debug",
            push: elm => {
                setDebugBtn();
            },
        });
    }
    returnAction = () => {
        const exp = document.getElementById("export");
        if (exp) {
            document.body.removeChild(exp);
        }
        Scene.load(TownScene.ins);
    };
};
const setSaveDataDeleteBtn = () => {
    Util.msg.set("セーブデータを削除しますか？");
    list.clear();
    list.add({
        center: () => "はい",
        push: elm => {
            Util.msg.set("＞はい");
            setSaveDataDeleteBtn2();
        },
    });
    list.add({
        center: () => "いいえ",
        push: elm => {
            Util.msg.set("＞いいえ");
            setOptionBtn();
        },
    });
    returnAction = () => {
        Util.msg.set("やめた");
        setOptionBtn();
    };
};
const setSaveDataDeleteBtn2 = () => {
    list.clear();
    list.add({
        center: () => "削除実行",
        push: elm => {
            SaveData.delete();
            window.location.reload(true);
        },
    });
    // l.add(new Btn("削除実行", ()=>{
    //     SaveData.delete();
    //     window.location.href = window.location.href;
    // }))
    returnAction = () => {
        Util.msg.set("やめた");
        setOptionBtn();
    };
};
const setDebugBtn = () => {
    list.clear();
    list.add({
        center: () => "EffectTest",
        push: elm => {
            Scene.load(new EffectTest());
        },
    });
    list.add({
        center: () => "アイテム入手",
        push: elm => {
            for (let item of Item.values) {
                item.num = item.numLimit;
            }
            Util.msg.set("アイテム入手");
        },
    });
    list.add({
        center: () => "素材入手",
        push: elm => {
            for (let item of ItemType.素材.values) {
                item.num = item.numLimit;
            }
            Util.msg.set("素材入手");
        },
    });
    list.add({
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
    list.add({
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
    list.add({
        center: () => "パーティースキル入手",
        push: elm => {
            for (const skill of PartySkill.values) {
                skill.has = true;
            }
            Util.msg.set("パーティースキル入手");
        },
    });
    list.add({
        center: () => "金",
        push: elm => {
            const value = 99999;
            PlayData.yen += value;
            Util.msg.set(`yen+${value}`);
        },
    });
    list.add({
        center: () => "鍵",
        push: elm => {
            for (const d of Dungeon.values) {
                d.treasureKey += 10;
            }
            Item.丸い鍵.add(10);
            Item.三角鍵.add(10);
        },
    });
    list.add({
        center: () => "BP",
        push: elm => {
            const value = 9999;
            for (const p of Player.values) {
                p.ins.bp += value;
            }
            Util.msg.set(`bp+${value}`);
        },
    });
    list.add({
        center: () => "Option",
        push: elm => {
            setOptionBtn();
        },
    });
    returnAction = () => {
        Scene.load(TownScene.ins);
    };
};
class EffectTest extends Scene {
    init() {
        const _super = Object.create(null, {
            clear: { get: () => super.clear },
            add: { get: () => super.add }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let list = new List();
            _super.clear.call(this);
            _super.add.call(this, new Rect(0, 0.1, 0.2, 0.8), list);
            _super.add.call(this, Rect.FULL, ILayout.create({ draw: (bounds) => {
                    {
                        let w = 5 / Graphics.pixelW;
                        let h = 5 / Graphics.pixelH;
                        Graphics.fillRect(new Rect(FXTest.attacker.x - w / 2, FXTest.attacker.y - h / 2, w, h), Color.RED);
                    }
                    {
                        let w = 5 / Graphics.pixelW;
                        let h = 5 / Graphics.pixelH;
                        Graphics.fillRect(new Rect(FXTest.target.x - w / 2, FXTest.target.y - h / 2, w, h), Color.CYAN);
                    }
                } }));
            _super.add.call(this, new Rect(0.8, 0.8, 0.2, 0.2), new Btn(() => "<-", () => {
                Scene.load(TownScene.ins);
            }));
            for (let v of FXTest.values()) {
                list.add({
                    right: () => v.name,
                    push: () => v.run(),
                });
            }
        });
    }
}
