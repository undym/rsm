var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TownScene } from "./scene/townscene.js";
import { Scene } from "./undym/scene.js";
import { Util, SceneType, Debug } from "./util.js";
import { Input } from "./undym/input.js";
import { Unit } from "./unit.js";
import { FX } from "./fx/fx.js";
import { Dungeon, DungeonArea } from "./dungeon/dungeon.js";
import { Player } from "./player.js";
import { Rect, Color, Point } from "./undym/type.js";
import { Graphics, Texture, Font, Img } from "./graphics/graphics.js";
import { Item } from "./item.js";
import { SaveData, Version } from "./savedata.js";
import { DungeonEvent } from "./dungeon/dungeonevent.js";
import { PartySkill } from "./partyskill.js";
import { Sound } from "./sound.js";
{
    const run = document.getElementById("runreload");
    run.onclick = () => {
        window.location.reload(true);
    };
    const reload = document.getElementById("reloadbutton");
    reload.onclick = () => {
        if (run.style.visibility === "visible") {
            run.style.visibility = "hidden";
        }
        else {
            run.style.visibility = "visible";
        }
    };
}
window.onload = () => {
    {
        const loading = document.getElementById("loading");
        document.body.removeChild(loading);
    }
    console.log("start");
    const canvas = document.getElementById("canvas");
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
    const texture = new Texture({ canvas: canvas });
    Graphics.setRenderTarget(texture);
    Input.init(canvas, rotate);
    setInput();
    init();
    // setTitle();
    title();
};
const ctrl = () => __awaiter(this, void 0, void 0, function* () {
    yield Scene.now.ctrl(Rect.FULL);
    Input.update();
    setTimeout(ctrl, 1000 / 60);
});
const draw = () => {
    Graphics.fillRect(Rect.FULL, Color.BLACK);
    Scene.now.draw(Rect.FULL);
    FX.draw();
};
const init = () => {
    Util.init();
    Unit.init();
    SceneType.TOWN.set();
    Dungeon.now = Dungeon.再構成トンネル;
    DungeonArea.now = DungeonArea.中央島;
    //画像読み込み
    for (const ev of DungeonEvent.values) {
        ev.getImg();
    }
    PartySkill.skills.length = PartySkill.DEF_PARTY_SKILL_NUM;
    PartySkill.skills.fill(PartySkill.empty);
};
const newGame = () => {
    Util.msg.set("NEW GAME");
    Player.ルイン.join();
    Player.ピアー.join();
    const setItem = (item, num) => {
        item.num = num;
        item.totalGetCount = num;
    };
    setItem(Item.スティックパン, 10);
    setItem(Item.赤い水, 5);
    setItem(Item.サンタクララ薬, 5);
};
const continueGame = () => {
    Util.msg.set("CONTINUE");
    return SaveData.load();
};
const setInput = () => {
    if (Debug.DEBUG) {
        document.addEventListener("keydown", ev => {
            if (ev.key === "d") {
                Debug.debugMode = !Debug.debugMode;
            }
            if (Debug.debugMode) {
                if (ev.key === "1") {
                    Dungeon.auNow = Dungeon.now.au;
                    for (const u of Unit.enemies) {
                        u.exists = false;
                    }
                }
            }
        });
    }
};
// const setTitle = ()=>{
//     Graphics.fillRect(Rect.FULL, Color.BLACK);
//     const img = new Img("img/title.png", {
//         lazyLoad:false,
//         onload:img=>{
//             // const h = 1;
//             // const w = img.pixelW / img.pixelH;
//             // img.draw(new Rect(
//             //     0.5 - w / 2,
//             //     0.5 - h / 2,
//             //     w,
//             //     h
//             // ));
//             img.drawEx({
//                 dstRatio:Rect.FULL,
//                 keepRatio:true,
//             });
//             const msg:string[] = [`Version(${Version.NOW})`];
//             for(const s of Version.updateInfo){
//                 msg.push(s);
//             }
//             msg.push("test");
//             msg.forEach((s,i)=>{
//                 Font.def.draw(s, new Point(0, i * Font.def.ratioH), Color.WHITE);
//             });
//         },
//     });
//     let done = false;
//     const listener:(this:Document, ev:TouchEvent|MouseEvent)=>any = ev=>{
//         if(done){return;}
//         done = true;
//         Sound.init();
//         for(const sound of Sound.values){
//             sound.load();
//         }
//         if(SaveData.exists()){
//             continueGame();
//             ctrl();
//         }else{
//             newGame();
//             Scene.load( TownScene.ins );
//             ctrl();
//         }
//         setInterval( draw, 1000 / 30 );
//         Graphics.getRenderTarget().canvas.removeEventListener("touchend", listener);
//         Graphics.getRenderTarget().canvas.removeEventListener("click", listener);
//     };
//     Graphics.getRenderTarget().canvas.addEventListener("touchend", listener);
//     Graphics.getRenderTarget().canvas.addEventListener("click", listener);
// };
const title = () => {
    // class TitleStr{
    //     private strings:string[] = [];
    //     private measureRatioW:number = 0;
    //     private count = 0;
    //     readonly bounds:Rect;
    //     constructor(private font:Font, readonly str:string, readonly center:Point, private push:()=>void){
    //         for(let i = 0; i < str.length; i++){
    //             this.strings.push( str.substring(i, i+1) );
    //         }
    //         this.measureRatioW = font.measureRatioW(str);
    //         this.bounds = new Rect(center.x - this.measureRatioW / 2, center.y - font.ratioH / 2, this.measureRatioW, font.ratioH);
    //     }
    //     draw(){
    //         this.count++;
    //         let x = this.bounds.x;
    //         const y = this.bounds.y;
    //         const w1 = this.measureRatioW / this.str.length;
    //         const shake = Graphics.dotW * 3;
    //         for(let i = 0; i < this.strings.length; i++){
    //             // for(let i2 = 0; i2 < 3; i2++){
    //                 const _x = x + randomFloat( -shake, shake );
    //                 const _y = y + randomFloat( -shake, shake );
    //                 this.font.draw( this.strings[i], new Point(x, y), Color.WHITE.wave(Color.CYAN, this.count * 0.3 + i * 0.7));
    //             // }
    //             x += w1;
    //         }
    //     }
    // }
    const img = new Img("img/title.png", { lazyLoad: false, });
    const updateMsgs = [`Version(${Version.NOW})`];
    for (const s of Version.updateInfo) {
        updateMsgs.push(s);
    }
    // const font = new Font( Graphics.pixelH * 0.08, Font.ITALIC );
    // const newGameStr = new TitleStr( font, "NEW GAME", new Point(0.5, 0.3), ()=>{
    // });
    // const continueStr = new TitleStr( font, "CONTINUE", new Point(0.5, 0.7), ()=>{
    // });
    // const rigingStar = new TitleStr( font, "RigingStar", ()=>{
    // });
    // const rsW = font.measureRatioW( rigingStar.str );
    let gameStarted = false;
    const listener = ev => {
        if (gameStarted) {
            return;
        }
        gameStarted = true;
        Sound.init();
        for (const sound of Sound.values) {
            sound.load();
        }
        const runNewGame = () => {
            newGame();
            Scene.load(TownScene.ins);
        };
        if (SaveData.exists()) {
            console.log("exists");
            const loadSuccess = continueGame();
            if (!loadSuccess) {
                Util.msg.set("不正なセーブデータ");
                runNewGame();
            }
        }
        else {
            console.log("!exists");
            runNewGame();
        }
        ctrl();
        setInterval(draw, 1000 / 30);
        Graphics.getRenderTarget().canvas.removeEventListener("touchend", listener);
        Graphics.getRenderTarget().canvas.removeEventListener("click", listener);
    };
    Graphics.getRenderTarget().canvas.addEventListener("touchend", listener);
    Graphics.getRenderTarget().canvas.addEventListener("click", listener);
    const loop = () => {
        if (gameStarted) {
            return;
        }
        Graphics.fillRect(Rect.FULL, Color.BLACK);
        img.drawEx({
            dstRatio: Rect.FULL,
            keepRatio: true,
        });
        updateMsgs.forEach((s, i) => {
            Font.def.draw(s, new Point(0, i * Font.def.ratioH), Color.WHITE);
        });
        Input.update();
        setTimeout(loop, 1000 / 60);
    };
    loop();
};
