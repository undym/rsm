export class Sound {
    // private audio:HTMLAudioElement;
    constructor(path) {
        this.path = path;
        Sound._values.push(this);
    }
    static get values() { return this._values; }
    /**AudioContextの初期化。ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    static init() {
        const w = window;
        const AC = (w.AudioContext || w.webkitAudioContext);
        ;
        Sound.ac = new AC();
    }
    /**ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    load() {
        // this.audio = new Audio(this.path);
        // this.audio.muted = true;
        // this.audio.play();
        // this.audio.pause();
        // this.audio.muted = false;
        // this.ac = new AudioContext();
        const request = new XMLHttpRequest();
        request.onload = () => {
            var audioData = request.response;
            Sound.ac.decodeAudioData(audioData, buffer => {
                this.buffer = buffer;
            }, e => {
                return "Error with decoding audio data " + this.path;
            });
        };
        request.open("GET", this.path, true);
        request.responseType = 'arraybuffer';
        request.send();
    }
    play() {
        // this.audio.currentTime = 0;
        // this.audio.play();
        if (!this.buffer) {
            return;
        }
        this.src = Sound.ac.createBufferSource();
        this.src.buffer = this.buffer;
        this.src.connect(Sound.ac.destination);
        this.src.start(0);
    }
}
Sound._values = [];
(function (Sound) {
    /**休む. */
    Sound.camp = new Sound("sound/camp.mp3");
    Sound.death = new Sound("sound/death.mp3");
    Sound.gameover = new Sound("sound/gameover.mp3");
    /**伐採. */
    Sound.KEN = new Sound("sound/KEN.mp3");
    /**魔法攻撃. */
    Sound.MAGIC = new Sound("sound/MAGIC.mp3");
    /**格闘攻撃. */
    Sound.PUNCH = new Sound("sound/PUNCH.mp3");
    /**ダンジョン出入り. */
    Sound.walk2 = new Sound("sound/walk2.mp3");
    Sound.save = new Sound("sound/save.mp3");
    Sound.TRAGER = new Sound("sound/TRAGER.mp3");
    Sound.win = new Sound("sound/win.mp3");
})(Sound || (Sound = {}));
