import { choice } from "./undym/random.js";
import { Util } from "./util.js";



export class Sound{

    static readonly MIN_VOLUME = -10;
    static readonly MAX_VOLUME = 10;

    private static _context:AudioContext;
    static get context(){return this._context;}
    private static gainNode:GainNode;
    private static volume:number;
    static getVolume():number{
        return this.volume;
    }
    static setVolume(v:number){
        v = v|0;
        if(v > this.MAX_VOLUME){v = this.MAX_VOLUME;}
        if(v < this.MIN_VOLUME){v = this.MIN_VOLUME;}

        this.volume = v;
        this.gainNode.gain.value = v / 10;

    }

    /**AudioContextの初期化。ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    static init(){
        const w:any = window;
        const AC = (w.AudioContext || w.webkitAudioContext);
        this._context = new AC();

        const gain = this.context.createGain();
        gain.connect(this.context.destination);
        this.gainNode = gain;
        this.volume = 0;
    }

    private buffer:AudioBuffer;
    private src:AudioBufferSourceNode;
    private loaded = false;
    private playing = false;
    private doStop = false;

    
    constructor(readonly path:string, readonly lazyLoad = false){
    }
    
    load(ondecoded?:()=>void){
        this.loaded = true;
        
        fetch(this.path, {method:"GET"})
            .then(res=>{

                res.arrayBuffer()
                    .then(audioData=>{
                        Sound.context.decodeAudioData(audioData, buffer=>{
                            this.buffer = buffer;
                            if(ondecoded){
                                ondecoded();
                            }
                        },e=>{
                            console.log( "Error with decoding audio data " + this.path );
                        });
                    })
                    ;

            })
            ;

    }

    play(options?:{
        loop?:boolean,
    }){
        this.doStop = false;

        if(Sound.context.state !== "running"){
            Sound.context.resume();
        }

        if(!this.loaded){
            this.load(()=>{
                if(this.doStop){return;}
                this.play(options);
            });
            return;
        }
        if(!this.buffer){return;}

        if(this.src && this.src.loop){//ループがついているsrcを見失うと止められなくなるので
            this.stop();
        }

        const src = Sound.context.createBufferSource();
        src.buffer = this.buffer;
        src.connect(Sound.context.destination);
        src.connect(Sound.gainNode);
        if(options && options.loop){
            src.loop = true;
        }

        src.start(0);
        this.src = src;
        this.playing = true;
    }

    stop(){
        this.doStop = true;

        if(this.src && this.playing){
            this.playing = false;
            try{
                this.src.stop();
            }catch(err){
                console.log(err);
            }
        }
    }
}


export class Music{

    private audio:HTMLAudioElement;
    private loaded:boolean;
    private _volume:number = 0;
    get volume(){return this._volume;}
    set volume(v:number){
        this._volume = v;
        this.audio.volume = v;
    }

    constructor(readonly path:string, readonly lazyLoad = false){
        this.audio = new Audio(this.path);
    }

    load(){
        this.loaded = true;
        
        // this.audio.src = this.path;
        // this.audio.src = this.path;
        // this.audio.load();
    }

    play(options?:{
        loop?:boolean,
    }){
        if(Sound.context.state !== "running"){
            Sound.context.resume();
        }

        if(!this.loaded){
            this.load();
            this.play(options);
            return;
        }

        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.loop = (options && options.loop) ? true : false;
        this.audio.muted = false;
        this.audio.play();
    }

    stop(){
        this.audio.pause();
        this.audio.muted = true;
    }
}


export namespace Sound{
    const _values:Sound[] = [];
    export function values():ReadonlyArray<Sound>{return _values;}

    function createSound(path:string):Sound{
        const s = new Sound(path);
        _values.push(s);
        return s;
    }
    /**毒. */
    export const awa        = createSound("sound/awa.mp3");
    /**封印回路. */
    export const BELL       = createSound("sound/BELL.mp3");
    /**罠発動. */
    export const blood      = createSound("sound/blood.mp3");
    /**瞑想. */
    export const bpup       = createSound("sound/bpup.mp3");
    /**小規模攻撃アイテム. */
    export const bom        = createSound("sound/bom.mp3");
    /**ミサイル系攻撃. */
    export const bom2       = createSound("sound/bom2.mp3");
    export const chain      = createSound("sound/chain.mp3");
    /**休む. */
    export const camp       = createSound("sound/camp.mp3");
    export const COIN       = createSound("sound/COIN.mp3");
    /**CollectingSkill上昇. */
    export const cry        = createSound("sound/cry.mp3");
    /**死神の鎌. */
    export const DARK       = createSound("sound/DARK.mp3");
    export const death      = createSound("sound/death.mp3");
    /**弱体. */
    export const down       = createSound("sound/down.mp3");
    export const exp        = createSound("sound/exp.mp3");
    export const gameover   = createSound("sound/gameover.mp3");
    export const gun        = createSound("sound/gun.mp3");
    export const ITEM_GET   = createSound("sound/ITEM_GET.mp3");
    export const KAIFUKU    = createSound("sound/KAIFUKU.mp3");
    export const kako       = createSound("sound/kako.mp3");
    /**買い物. */
    export const KATAN      = createSound("sound/KATAN.mp3");
    /**伐採. */
    export const KEN        = createSound("sound/KEN.mp3");
    /**罠解除. */
    export const keyopen    = createSound("sound/keyopen.mp3");
    export const drain      = createSound("sound/kyuusyuu.mp3");
    /**合成. */
    export const made       = createSound("sound/made.mp3");
    export const no         = createSound("sound/no.mp3");
    /**魔法攻撃. */
    export const MAGIC      = createSound("sound/MAGIC.mp3");
    /**story. */
    export const moji       = createSound("sound/moji.mp3");
    export const nigeru     = createSound("sound/nigeru.mp3");
    export const lazer      = createSound("sound/lazer.mp3");
    /**踏破. */
    export const lvup       = createSound("sound/lvup.mp3");
    export const pet_die    = createSound("sound/pet_die.mp3");
    /**格闘攻撃. */
    export const PUNCH      = createSound("sound/PUNCH.mp3");
    /**財宝・ダンジョンクリア時のアイテム. */
    export const rare       = createSound("sound/rare.mp3");
    /**ex撃破. */
    export const reaitem1   = createSound("sound/reaitem1.mp3");
    export const save       = createSound("sound/save.mp3");
    /**凍てつく波動. */
    export const seikou     = createSound("sound/seikou.mp3");
    /**神格攻撃. */
    export const sin        = createSound("sound/sin.mp3");
    /**選択音. */
    export const system     = createSound("sound/turn_who.mp3");
    export const TRAGER     = createSound("sound/TRAGER.mp3");
    /**状態強化. */
    export const up         = createSound("sound/up.mp3");
    export const win        = createSound("sound/win.mp3");
    export const walk       = createSound("sound/walk.mp3");
    /**ダンジョン出入り. */
    export const walk2      = createSound("sound/walk2.mp3");
    /**ペット召喚. */
    export const warp       = createSound("sound/warp.mp3");
    /**arr. */
    export const ya         = createSound("sound/ya.mp3");
}


export namespace Music{
    const _values:Music[] = [];
    export function values():ReadonlyArray<Music>{
        return _values;
    }

    const musics = new Map<"dungeon"|"boss"|"ex", Music[]>([
        ["dungeon",[]],
        ["boss",[]],
        ["ex",[]],
    ]);

    export const getMusics = (type:"dungeon"|"boss"|"ex"):ReadonlyArray<Music>=>{
        const m = musics.get(type);
        return m ? m : [];
    };
    
    function createMusic(type:"dungeon"|"boss"|"ex", src:string, lazy:boolean):Music{
        const s = new Music(src, lazy);
        _values.push(s);
        
        // musics.get(type)?.push(s);
        const m = musics.get(type);
        if(m){m.push(s);}
        
        return s;
    }

    export function stop(){
        Music.values().forEach(m=> m.stop());
    }

    let volume = 0;
    export function getVolume():number{return volume|0;}
    export function setVolume(v:number){
        v = v|0;
        const min = 0;
        const max = 10;
        if(v > max){v = max;}
        if(v < min){v = min;}

        volume = v;
        Music.values().forEach(m=> m.volume = v / 10);
    }


    export const ifuudoudou = createMusic("dungeon", "sound/music/ifuudoudou.mp3", /*lazy*/true);
    export const hesoumi    = createMusic("dungeon", "sound/music/hesoumi.mp3",    /*lazy*/true);
    export const tuchi2     = createMusic("dungeon", "sound/music/tuchi2.mp3",     /*lazy*/true);
    export const aenai      = createMusic("dungeon", "sound/music/aenai.mp3",      /*lazy*/true);

    export const anokoro    = createMusic("ex",      "sound/music/anokoro.mp3", /*lazy*/false);

    export const rs7        = createMusic("boss",    "sound/music/rs7.mp3", /*lazy*/false);

}