export class Sound {
    constructor(src) {
        this.audio = new Audio(src);
        Sound._values.push(this);
    }
    static get values() { return this._values; }
    play() {
        this.audio.currentTime = 0;
        this.audio.play();
    }
    get volume() { return this.audio.volume; }
    set volume(v) { this.audio.volume = v; }
}
Sound._values = [];
(function (Sound) {
    Sound.death = new Sound("sound/death.mp3");
    Sound.MAGIC = new Sound("sound/MAGIC.mp3");
    /**格闘攻撃. */
    Sound.PUNCH = new Sound("sound/PUNCH.mp3");
    /**ダンジョン出入り. */
    Sound.walk2 = new Sound("sound/walk2.mp3");
    Sound.save = new Sound("sound/save.mp3");
    /**ゲーム開始. */
    Sound.start = new Sound("sound/start.mp3");
    Sound.win = new Sound("sound/win.mp3");
})(Sound || (Sound = {}));
