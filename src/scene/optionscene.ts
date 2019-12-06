import { Scene } from "../undym/scene.js";
import { Place, Util, Debug, PlayData } from "../util.js";
import { Rect, Color, Size } from "../undym/type.js";
import { YLayout, ILayout, Layout, Label, FlowLayout, RatioLayout, VariableLayout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { TownScene } from "./townscene.js";
import { List, ListElm } from "../widget/list.js";
import { FXTest } from "../fx/fx.js";
import { Item, ItemType } from "../item.js";
import { Font, Graphics } from "../graphics/graphics.js";
import { ActiveTec, PassiveTec } from "../tec.js";
import { Player } from "../player.js";
import { SaveData } from "../savedata.js";
import { DungeonEvent } from "../dungeon/dungeonevent.js";
import { EqEar, Eq } from "../eq.js";
import { PartySkill } from "../partyskill.js";
import { Sound } from "../sound.js";
import { Dungeon } from "../dungeon/dungeon.js";

const list = new List(6);
let returnAction:()=>void = ()=>{};

export const createOptionBtn = ()=>{
    // const w = 4;
    // const h = 3;
    // const l = new FlowLayout(w,h);

    setOptionBtn();

    const listH = 1 - Place.LIST_BTN_H;
    return new RatioLayout()
        .add(new Rect(0, 0, 1, listH), list)
        .add(new Rect(0, listH, 1, 1-listH), new Btn("<<", ()=>{
            returnAction();
        }))
        ;

    ;
};

const setOptionBtn = ()=>{
    const removeElements = ()=>{
        for(const id of ["export", "importText", "paste", "runImport"]){
            for(;;){
                const exp = document.getElementById(id);
                if(exp){document.body.removeChild(exp);}
                else{break;}
            }
        }
    };

    list.clear();

    list.add({
        center:()=>"データ削除",
        push:elm=>{
            setSaveDataDeleteBtn();
        },
    });
    list.add({
        center:()=>"-",
        push:elm=>{
        },
    });
    list.add({
        center:()=>"音量↑",
        push:elm=>{
            Sound.volume++;
            Util.msg.set(`${Sound.volume}`);
            Sound.save.play();
        },
    });
    list.add({
        center:()=>"音量↓",
        push:elm=>{
            Sound.volume--;
            Util.msg.set(`${Sound.volume}`);
            Sound.save.play();
        },
    });
    list.add({
        center:()=>"export",
        push:elm=>{
            removeElements();

            const encoded = new TextEncoder().encode( SaveData.export() );
            let save = "";
            for(const e of encoded){
                save += e.toString(36) + "+";
            }
            save = save.substring(0, save.length-1);
            const a = document.createElement("textarea");
            a.id = "export";
            a.readOnly = true;
            a.value = save;
            a.style.position = "fixed";
            a.style.top = "0vh";
            a.style.left = "50vw";
            a.style.width = "50vw";
            a.style.height = "50vh";
            a.onclick = ev=>{
                a.setSelectionRange(0, save.length);
            };
            document.body.appendChild(a);
            a.focus();

            a.setSelectionRange(0, save.length);
        },
    });


    list.add({
        center:()=>"import",
        push:async(elm:ListElm)=>{
            removeElements();
                
            const a = document.createElement("input");
            a.id = "importText";
            a.type = "file";
            a.style.position = "fixed";
            a.style.top = "0vh";
            a.style.left = "50vw";
            a.style.width = "50vw";
            a.style.height = "50vh";

            // a.onclick = ev=>{
            //     a.focus();
            //     console.log( document.execCommand("paste", true, "a") );
            // };

            document.body.appendChild(a);
        },
    });


    if(Debug.debugMode){
        list.add({
            center:()=>"Debug",
            push:elm=>{
                setDebugBtn();
            },
        })
    }
    
    returnAction = ()=>{
        removeElements();


        Scene.load( TownScene.ins );
    };

};

const setSaveDataDeleteBtn = ()=>{
    Util.msg.set("セーブデータを削除しますか？");

    list.clear();

    list.add({
        center:()=>"はい",
        push:elm=>{
            Util.msg.set("＞はい");
            setSaveDataDeleteBtn2();
        },
    });
    list.add({
        center:()=>"いいえ",
        push:elm=>{
            Util.msg.set("＞いいえ");
            setOptionBtn();
        },
    });
    
    returnAction = ()=>{
        Util.msg.set("やめた");
        setOptionBtn();
    };
};

const setSaveDataDeleteBtn2 = ()=>{
    list.clear();
    list.add({
        center:()=>"削除実行",
        push:elm=>{
            SaveData.delete();
            window.location.reload(true);
        },
    });
    // l.add(new Btn("削除実行", ()=>{
    //     SaveData.delete();
    //     window.location.href = window.location.href;
    // }))
    returnAction = ()=>{
        Util.msg.set("やめた");
        setOptionBtn();
    };
};

const setDebugBtn = ()=>{
    list.clear();

    list.add({
        center:()=>"EffectTest",
        push:elm=>{
            Scene.load(new EffectTest());
        },
    });
    list.add({
        center:()=>"アイテム入手",
        push:elm=>{
            for(let item of Item.values){
                item.num = item.numLimit;
            }
            Util.msg.set("アイテム入手");
        },
    });
    list.add({
        center:()=>"素材入手",
        push:elm=>{
            for(let item of ItemType.素材.values){
                item.num = item.numLimit;
            }
            Util.msg.set("素材入手");
        },
    });
    list.add({
        center:()=>"技習得",
        push:elm=>{
            for(let p of Player.values){
                for(let tec of ActiveTec.values){
                    p.ins.setMasteredTec(tec, true);
                }   
                for(let tec of PassiveTec.values){
                    p.ins.setMasteredTec(tec, true);
                }   
            }
            
            Util.msg.set("技習得");
        },
    });
    list.add({
        center:()=>"装備入手",
        push:elm=>{
            for(const eq of EqEar.values){
                eq.num += 1;
            }
            for(const eq of Eq.values){
                eq.num += 1;
            }
            
            Util.msg.set("装備入手");
        },
    });
    list.add({
        center:()=>"パーティースキル入手",
        push:elm=>{
            for(const skill of PartySkill.values){
                skill.has = true;
            }
            
            Util.msg.set("パーティースキル入手");
        },
    });
    list.add({
        center:()=>"金",
        push:elm=>{
            const value = 99999;
            PlayData.yen += value;
    
            Util.msg.set(`yen+${value}`);
        },
    });
    list.add({
        center:()=>"鍵",
        push:elm=>{
            for(const d of Dungeon.values){
                d.treasureKey += 10;
            }

            Item.丸い鍵.add(10);
            Item.三角鍵.add(10);
        },
    });
    list.add({
        center:()=>"BP",
        push:elm=>{
            const value = 9999;
            for(const p of Player.values){
                p.ins.bp += value;
            }
    
            Util.msg.set(`bp+${value}`);
        },
    });
    list.add({
        center:()=>"Option",
        push:elm=>{
            setOptionBtn();
        },
    });

    returnAction = ()=>{
        Scene.load( TownScene.ins );
    };
};


class EffectTest extends Scene{

    async init() {
        let list = new List();
        super.clear();
        super.add(new Rect(0, 0.1, 0.2, 0.8), list);
        super.add(Rect.FULL, ILayout.create({draw:(bounds)=>{
            {
                let w = 5 / Graphics.pixelW;
                let h = 5 / Graphics.pixelH;
                Graphics.fillRect( new Rect(FXTest.attacker.x - w / 2, FXTest.attacker.y - h / 2, w, h ), Color.RED );
            }
            {
                let w = 5 / Graphics.pixelW;
                let h = 5 / Graphics.pixelH;
                Graphics.fillRect( new Rect(FXTest.target.x - w / 2, FXTest.target.y - h / 2, w, h ), Color.CYAN );
            }
        }}));
        super.add(new Rect(0.8, 0.8, 0.2, 0.2),new Btn(()=>"<-",()=>{
            Scene.load( TownScene.ins );
        }));

        for(let v of FXTest.values()){
            list.add({
                right:()=> v.name,
                push:()=> v.run(),
            });
        }
    }
    
}