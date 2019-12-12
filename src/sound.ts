import { choice } from "./undym/random.js";


export class Sound{
    private static _values:Sound[] = [];
    static get values():ReadonlyArray<Sound>{return this._values;}

    static readonly MIN_VOLUME = -10;
    static readonly MAX_VOLUME = 10;

    private static _volume:number;
    /**-10～10.Int. */
    static get volume()         {return this._volume;}
    /**-10～10.Int. */
    static set volume(v:number) {
        v = v|0;
        if(v > this.MAX_VOLUME){v = this.MAX_VOLUME;}
        if(v < this.MIN_VOLUME){v = this.MIN_VOLUME;}
        this._volume = v;
        Sound.gain.gain.value = v / 10;
    }

    private static ac:AudioContext;
    private static gain:GainNode;

    /**AudioContextの初期化。ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    static init(){
        const w:any = window;
        const AC = (w.AudioContext || w.webkitAudioContext);;
        this.ac = new AC();
        this.gain = this.ac.createGain();
        this.gain.connect(this.ac.destination);
        this.volume = 0;
        // Sound.gain.gain.value = 0;
    }

    private buffer:AudioBuffer;
    private src:AudioBufferSourceNode;
    private loaded = false;
    private state:"play"|"loop"|"stop" = "stop";

    constructor(private path:string, private lazyLoad = false){
        Sound._values.push(this);
    }
    
    load(){
        this.loaded = true;

        const request = new XMLHttpRequest();
        request.onload = ()=>{
            var audioData = request.response;
            Sound.ac.decodeAudioData(audioData, buffer=>{
                this.buffer = buffer;
                if(this.lazyLoad){
                    if(this.state === "play"){this.play();}
                    if(this.state === "loop"){this.play(true);}
                }
            },e=>{
                return "Error with decoding audio data " + this.path;
            });
        };
        request.open("GET", this.path, true);
        request.responseType = 'arraybuffer';
        request.send();
        
    }

    play(loop:boolean = false){
        this.state = loop ? "loop" : "play";

        if(Sound.ac.state !== "running"){
            Sound.ac.resume();
        }

        if(!this.loaded){
            this.load();
            return;
        }
        if(!this.buffer){return;}

        const src = Sound.ac.createBufferSource();
        src.buffer = this.buffer;
        src.connect(Sound.ac.destination);
        src.connect(Sound.gain);
        src.loop = loop;

        src.start(0);
        this.src = src;
    }

    stop(){
        this.state = "stop";

        if(this.src){
            this.src.stop();
        }
    }
}


export namespace Sound{
    /**毒. */
    export const awa        = new Sound("sound/awa.mp3");
    /**罠発動. */
    export const blood      = new Sound("sound/blood.mp3");
    /**瞑想. */
    export const bpup       = new Sound("sound/bpup.mp3");
    /**小規模攻撃アイテム. */
    export const bom        = new Sound("sound/bom.mp3");
    /**ミサイル系攻撃. */
    export const bom2       = new Sound("sound/bom2.mp3");
    export const chain      = new Sound("sound/chain.mp3");
    /**休む. */
    export const camp       = new Sound("sound/camp.mp3");
    export const COIN       = new Sound("sound/COIN.mp3");
    /**死神の鎌. */
    export const DARK       = new Sound("sound/DARK.mp3");
    export const death      = new Sound("sound/death.mp3");
    export const exp        = new Sound("sound/exp.mp3");
    export const gameover   = new Sound("sound/gameover.mp3");
    export const gun        = new Sound("sound/gun.mp3");
    export const ITEM_GET   = new Sound("sound/ITEM_GET.mp3");
    export const KAIFUKU    = new Sound("sound/KAIFUKU.mp3");
    export const kako       = new Sound("sound/kako.mp3");
    /**買い物. */
    export const KATAN      = new Sound("sound/KATAN.mp3");
    /**伐採. */
    export const KEN        = new Sound("sound/KEN.mp3");
    /**罠解除. */
    export const keyopen    = new Sound("sound/keyopen.mp3");
    export const drain      = new Sound("sound/kyuusyuu.mp3");
    /**合成. */
    export const made       = new Sound("sound/made.mp3");
    export const no         = new Sound("sound/no.mp3");
    /**魔法攻撃. */
    export const MAGIC      = new Sound("sound/MAGIC.mp3");
    /**story. */
    export const moji       = new Sound("sound/moji.mp3");
    export const lazer      = new Sound("sound/lazer.mp3");
    /**踏破. */
    export const lvup       = new Sound("sound/lvup.mp3");
    export const pet_die    = new Sound("sound/pet_die.mp3");
    /**格闘攻撃. */
    export const PUNCH      = new Sound("sound/PUNCH.mp3");
    /**財宝・ダンジョンクリア時のアイテム. */
    export const rare       = new Sound("sound/rare.mp3");
    export const save       = new Sound("sound/save.mp3");
    /**凍てつく波動. */
    export const seikou     = new Sound("sound/seikou.mp3");
    /**神格攻撃. */
    export const sin        = new Sound("sound/sin.mp3");
    /**選択音. */
    export const system     = new Sound("sound/turn_who.mp3");
    export const TRAGER     = new Sound("sound/TRAGER.mp3");
    /**状態強化. */
    export const up         = new Sound("sound/up.mp3");
    export const win        = new Sound("sound/win.mp3");
    export const walk       = new Sound("sound/walk.mp3");
    /**ダンジョン出入り. */
    export const walk2      = new Sound("sound/walk2.mp3");
    /**ペット召喚. */
    export const warp       = new Sound("sound/warp.mp3");
    /**arr. */
    export const ya         = new Sound("sound/ya.mp3");
}


export namespace Music{
    const _values:Sound[] = [];
    export function values():ReadonlyArray<Sound>{
        return _values;
    }
    const dungeonMusics:Sound[] = [];
    const bossMusics:Sound[] = [];
    function createMusic(type:"dungeon"|"boss", src:string, lazy:boolean):Sound{
        const s = new Sound(src, lazy);
        _values.push(s);

             if(type === "dungeon"){dungeonMusics.push(s);}
        else if(type === "boss")   {bossMusics.push(s);}

        return s;
    }

    export function rndDungeonMusic(){return choice( dungeonMusics );}

    export function stop(){
        Music.values().forEach(m=> m.stop());
    }

    export const kimi = createMusic("dungeon", "sound/music/kimi.mp3", /*lazy*/true);
    // export const ifuudoudou = createMusic("dungeon", "sound/music/ifuudoudou.mp3", /*lazy*/true);
}