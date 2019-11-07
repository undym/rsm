






export class Sound{
    private audio:HTMLAudioElement;

    constructor(private src:string){
    }

    play(){
        if(!this.audio){
            this.audio = new Audio(this.src);
        }
        this.audio.currentTime = 0;

        this.audio.play();
    }
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