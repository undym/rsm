
import { TownScene } from "./scene/townscene.js";
import { Scene, wait } from "./undym/scene.js";
import {Util, SceneType, Debug, PlayData} from "./util.js";
import { Input } from "./undym/input.js";
import { Unit } from "./unit.js";
import { FX, FXTest } from "./fx/fx.js";
import { Dungeon, DungeonArea } from "./dungeon/dungeon.js";
import { Player } from "./player.js";
import { Rect, Color, Point } from "./undym/type.js";
import { Graphics, Texture, Font, Img } from "./graphics/graphics.js";
import { Item } from "./item.js";
import { SaveData, Version } from "./savedata.js";
import { DungeonEvent } from "./dungeon/dungeonevent.js";
import { XLayout, ILayout, Label } from "./undym/layout.js";
import { Job } from "./job.js";
import { PartySkill } from "./partyskill.js";
import { randomInt } from "./undym/random.js";
import { Sound } from "./sound.js";


{
    const run = document.getElementById("runreload") as HTMLButtonElement;
    run.onclick = ()=>{
        window.location.href = window.location.href;
    };
    const reload = document.getElementById("reloadbutton") as HTMLButtonElement;
    reload.onclick = ()=>{
        if(run.style.visibility === "visible"){
            run.style.visibility = "hidden";
        }else{
            run.style.visibility = "visible";
        }
    };
}

window.onload = ()=>{
    {
        const loading = document.getElementById("loading") as HTMLElement;
        document.body.removeChild(loading);
    }

    console.log("start");

    
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const rotate = true;
    // const rotate:boolean = window.navigator.userAgent.indexOf("Mobile") !== -1;
    
    // if(rotate){
    //     canvas.style.width = "100vh";
    //     canvas.style.height = "100vw";
    //     canvas.style.transformOrigin = "top left";
    //     canvas.style.transform = "translateX(100vw) rotate(90deg)";
    // }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const texture = new Texture({canvas:canvas});
    Graphics.setRenderTarget(texture);
    Input.init(canvas, rotate);

    setInput();

    init();
    
    Util.msg.set( `Version(${Version.NOW})` );
    for(const s of Version.updateInfo){
        Util.msg.set(s);
    }

    Sound.start.play();
    if(SaveData.exists()){
        continueGame();
        ctrl();
    }else{
        newGame();
        Scene.load( TownScene.ins );
        ctrl();
    }

    setInterval( draw, 1000 / 30 );


};

const ctrl = async()=>{
    await Scene.now.ctrl(Rect.FULL);
    
    Input.update();
    setTimeout(ctrl, 1000 / 60);
};

const draw = ()=>{
    Graphics.fillRect(Rect.FULL, Color.BLACK);
    Scene.now.draw(Rect.FULL);

    FX.draw();
};

const init = ()=>{
    Util.init();
    Unit.init();

    SceneType.TOWN.set();
    Dungeon.now = Dungeon.再構成トンネル;
    DungeonArea.now = DungeonArea.中央島;
    //画像読み込み
    for(const ev of DungeonEvent.values){
        ev.getImg();
    }

    PartySkill.skills.length = PartySkill.DEF_PARTY_SKILL_NUM;
    PartySkill.skills.fill( PartySkill.empty );
};

const newGame = ()=>{
    Util.msg.set("NEW GAME");
    
    Player.ルイン.join();
    Player.ピアー.join();

    const setItem = (item:Item, num:number)=>{
        item.num = num;
        item.totalGetCount = num;
    };
    
    setItem( Item.スティックパン, 10 );
    setItem( Item.赤い水, 5 );
    setItem( Item.サンタクララ薬, 5 );
    setItem( Item.動かない映写機, 1 );
};

const continueGame = ()=>{
    Util.msg.set("CONTINUE");
    
    SaveData.load();
}

const setInput = ()=>{
    if(Debug.DEBUG){
        document.addEventListener("keydown", ev=>{
            if(ev.key === "d"){
                Debug.debugMode = !Debug.debugMode;
            }
            if(Debug.debugMode){
                if(ev.key === "1"){
                    Dungeon.auNow = Dungeon.now.au;
                    for(const u of Unit.enemies){
                        u.exists = false;
                    }
                }
            }
        });
    }
};

