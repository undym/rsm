






export class Sound{
    private static _values:Sound[] = [];
    static get values():ReadonlyArray<Sound>{return this._values;}


    private audio:HTMLAudioElement;
    

    constructor(src:string){
        this.audio = new Audio(src);

        Sound._values.push(this);
    }

    play(){
        this.audio.currentTime = 0;

        this.audio.play();
    }

    get volume()        {return this.audio.volume;}
    set volume(v:number){this.audio.volume = v;}
}


export namespace Sound{
    export const death      = new Sound("sound/death.mp3");
    export const MAGIC      = new Sound("sound/MAGIC.mp3");
    /**格闘攻撃. */
    export const PUNCH      = new Sound("sound/PUNCH.mp3");
    /**ダンジョン出入り. */
    export const walk2      = new Sound("sound/walk2.mp3");
    export const save       = new Sound("sound/save.mp3");
    /**ゲーム開始. */
    export const start      = new Sound("sound/start.mp3");
    export const win        = new Sound("sound/win.mp3");
}