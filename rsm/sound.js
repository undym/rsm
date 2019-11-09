export class Sound {
    constructor(path) {
        this.path = path;
        Sound._values.push(this);
    }
    static get values() { return this._values; }
    /**ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    init() {
        this.ac = new AudioContext();
        const request = new XMLHttpRequest();
        request.onload = () => {
            var audioData = request.response;
            this.ac.decodeAudioData(audioData, buffer => {
                this.buffer = buffer;
            }, e => {
                return "Error with decoding audio data " + this.path;
            });
        };
        request.open("GET", this.path);
        request.responseType = 'arraybuffer';
        request.send();
    }
    play() {
        if (!this.buffer) {
            return;
        }
        this.src = this.ac.createBufferSource();
        this.src.buffer = this.buffer;
        this.src.connect(this.ac.destination);
        this.src.start(0);
    }
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
