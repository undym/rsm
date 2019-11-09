






export class Sound{
    private static _values:Sound[] = [];
    static get values():ReadonlyArray<Sound>{return this._values;}

    private ac:AudioContext;
    private src:AudioBufferSourceNode;
    private buffer:AudioBuffer;

    constructor(private path:string){
        Sound._values.push(this);
    }
    /**ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    init(){
        this.ac = new AudioContext();
        const request = new XMLHttpRequest();
        request.onload = ()=>{
            var audioData = request.response;
            this.ac.decodeAudioData(audioData, buffer=>{
                this.buffer = buffer;
            },e=>{
                return "Error with decoding audio data " + this.path;
            });
        };
        request.open("GET", this.path);
        request.responseType = 'arraybuffer';
        request.send();
    }

    play(){
        if(!this.buffer){return;}

        this.src = this.ac.createBufferSource();
        this.src.buffer = this.buffer;
        this.src.connect(this.ac.destination);
        
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
    export const save       = new Sound("sound/save.mp3");
    /**ゲーム開始. */
    export const start      = new Sound("sound/start.mp3");
    export const TRAGER     = new Sound("sound/TRAGER.mp3");
    export const win        = new Sound("sound/win.mp3");
}