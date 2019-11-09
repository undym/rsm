import { Util } from "./util.js";


export class Sound{
    private static _values:Sound[] = [];
    static get values():ReadonlyArray<Sound>{return this._values;}

    private static ac:AudioContext;
    private src:AudioBufferSourceNode;
    private buffer:AudioBuffer;
    // private audio:HTMLAudioElement;

    constructor(private path:string){
        Sound._values.push(this);
    }
    /**ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    init(){
        if(!Sound.ac){
            const w:any = window;
            const AC = (w.AudioContext || w.webkitAudioContext);;
            Sound.ac = new AC();
        }
        // this.audio = new Audio(this.path);
        // this.audio.muted = true;
        // this.audio.play();
        // this.audio.pause();
        // this.audio.muted = false;

        // this.ac = new AudioContext();
        const request = new XMLHttpRequest();
        request.onload = ()=>{
            Util.msg.set("onload:"+this.path);
            var audioData = request.response;
            Sound.ac.decodeAudioData(audioData, buffer=>{
                this.buffer = buffer;
            },e=>{
                return "Error with decoding audio data " + this.path;
            });
        };
        request.open("GET", this.path, true);
        request.responseType = 'arraybuffer';
        request.send();
    }

    play(){
        // this.audio.currentTime = 0;
        // this.audio.play();


        if(!this.buffer){return;}

        this.src = Sound.ac.createBufferSource();
        this.src.buffer = this.buffer;
        this.src.connect(Sound.ac.destination);
        
        this.src.start(0);
    }

    
}


export namespace Sound{
    /**休む. */
    export const camp       = new Sound("sound/camp.mp3");
    export const death      = new Sound("sound/death.mp3");
    export const gameover   = new Sound("sound/gameover.mp3");
    /**伐採. */
    export const KEN        = new Sound("sound/KEN.mp3");
    export const MAGIC      = new Sound("sound/MAGIC.mp3");
    /**格闘攻撃. */
    export const PUNCH      = new Sound("sound/PUNCH.mp3");
    /**ダンジョン出入り. */
    export const walk2      = new Sound("sound/walk2.mp3");
    /**ゲーム開始. */
    export const start      = new Sound("sound/start.mp3");
    export const TRAGER     = new Sound("sound/TRAGER.mp3");
    export const win        = new Sound("sound/win.mp3");
    export const save       = new Sound("sound/save.mp3");
}