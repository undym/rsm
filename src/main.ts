
import { TownScene } from "./scene/townscene.js";
import { Scene, wait } from "./undym/scene.js";
import {Util, SceneType, Debug, PlayData} from "./util.js";
import { Input } from "./undym/input.js";
import { Unit } from "./unit.js";
import { FX, FXTest, EffectTest } from "./fx/fx.js";
import { Dungeon, DungeonArea } from "./dungeon/dungeon.js";
import { Player } from "./player.js";
import { Rect, Color, Point } from "./undym/type.js";
import { Graphics, Font } from "./graphics/graphics.js";
import { Img } from "./graphics/texture.js";
import { Texture } from "./graphics/texture.js";
import { Item } from "./item.js";
import { SaveData, Version } from "./savedata.js";
import { DungeonEvent } from "./dungeon/dungeonevent.js";
import { XLayout, ILayout, Label } from "./undym/layout.js";
import { Job } from "./job.js";
import { PartySkill } from "./partyskill.js";
import { randomInt, randomFloat, choice } from "./undym/random.js";
import { Sound, Music } from "./sound.js";
import { CollectingSkill } from "./collectingskill.js";


// {
//     const run = document.getElementById("runreload") as HTMLButtonElement;
//     run.onclick = ()=>{
//         window.location.reload(true);
//     };
//     const reload = document.getElementById("reloadbutton") as HTMLButtonElement;
//     reload.onclick = ()=>{
//         if(run.style.visibility === "visible"){
//             run.style.visibility = "hidden";
//         }else{
//             run.style.visibility = "visible";
//         }
//     };
// }

window.onload = ()=>{
    {
        const loading = document.getElementById("loading") as HTMLElement;
        document.body.removeChild(loading);
        const reload = document.getElementById("reload") as HTMLElement;
        document.body.removeChild(reload);
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

    const texture = new Texture(canvas);
    Graphics.setRenderTarget(texture);
    Input.init(canvas, rotate);

    setInput();

    init();

    title();
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
    // window.requestAnimationFrame(draw);
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
};

const continueGame = ()=>{
    Util.msg.set("CONTINUE");
    
    return SaveData.load();
}

const setInput = ()=>{
    if(Debug.DEBUG){
        document.addEventListener("keydown", ev=>{
            // if(ev.key === "d"){
            //     Debug.debugMode = !Debug.debugMode;
            // }
            // if(Debug.debugMode){
            //     if(ev.key === "1"){
            //         Dungeon.auNow = Dungeon.now.au;
            //         for(const u of Unit.enemies){
            //             u.exists = false;
            //         }
            //     }
            // }
            if(ev.key === "e"){
                Scene.load(new EffectTest({
                    onreturn:()=>{
                        Scene.load(TownScene.ins);
                    },
                }));
            }
        });
    }
};


const title = ()=>{
    
    const titleImgPath = ["img/title.png", "img/title2.png", "img/title3.png", "img/title4.png"];
    const img = new Img(choice( titleImgPath ), {lazyLoad:false,});
    const updateMsgs:string[] = [`Version(${Version.NOW})`];
    for(const s of Version.updateInfo){
        updateMsgs.push(s);
    }
    
    let gameStarted = false;
    const listener:(this:Document, ev:TouchEvent|MouseEvent)=>any = ev=>{
        if(gameStarted){return;}
        gameStarted = true;

        Sound.init();

        for(const sound of Sound.values().filter(s=> !s.lazyLoad)){
            sound.load();
        }
        for(const music of Music.values().filter(m=> !m.lazyLoad)){
            music.load();
        }


        const runNewGame = ()=>{
            newGame();
            Scene.load( TownScene.ins );
        };

        if(SaveData.exists()){
            const loadSuccess = continueGame();
            if(!loadSuccess){
                Util.msg.set("不正なセーブデータ");
                runNewGame();
            }
        }else{
            runNewGame();
        }
    
        ctrl();
        setInterval( draw, 1000 / 30 );

        Graphics.getRenderTarget().canvas.removeEventListener("touchend", listener);
        Graphics.getRenderTarget().canvas.removeEventListener("click", listener);
    };
    Graphics.getRenderTarget().canvas.addEventListener("touchend", listener);
    Graphics.getRenderTarget().canvas.addEventListener("click", listener);



    const loop = ()=>{
        if(gameStarted){return;}

        Graphics.fillRect(Rect.FULL, Color.BLACK);
        img.drawEx({
            dstRatio:Rect.FULL,
            keepRatio:true,
        });
        
        updateMsgs.forEach((s,i)=>{
            Font.def.draw(s, new Point(0, i * Font.def.ratioH), Color.WHITE);
        });
        
        Font.def.draw("RSMobile", new Point(0, 1), Color.WHITE, "lowerLeft");

        Input.update();
        setTimeout(loop, 1000 / 60);
    };
    loop();

};

