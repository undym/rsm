export class Sound {
    constructor(path) {
        this.path = path;
        Sound._values.push(this);
    }
    static get values() { return this._values; }
    /**-10～10.Int. */
    static get volume() { return this._volume; }
    /**-10～10.Int. */
    static set volume(v) {
        v = v | 0;
        if (v > this.MAX_VOLUME) {
            v = this.MAX_VOLUME;
        }
        if (v < this.MIN_VOLUME) {
            v = this.MIN_VOLUME;
        }
        this._volume = v;
        Sound.gain.gain.value = v / 10;
    }
    /**AudioContextの初期化。ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    static init() {
        const w = window;
        const AC = (w.AudioContext || w.webkitAudioContext);
        ;
        this.ac = new AC();
        this.gain = this.ac.createGain();
        this.gain.connect(this.ac.destination);
        this.volume = 0;
        // Sound.gain.gain.value = 0;
    }
    load() {
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
        if (Sound.ac.state !== "running") {
            Sound.ac.resume();
        }
        if (!this.buffer) {
            return;
        }
        const src = Sound.ac.createBufferSource();
        src.buffer = this.buffer;
        src.connect(Sound.ac.destination);
        src.connect(Sound.gain);
        src.start(0);
    }
}
Sound._values = [];
Sound.MIN_VOLUME = -10;
Sound.MAX_VOLUME = 10;
(function (Sound) {
    /**毒. */
    Sound.awa = new Sound("sound/awa.mp3");
    /**罠発動. */
    Sound.blood = new Sound("sound/blood.mp3");
    /**瞑想. */
    Sound.bpup = new Sound("sound/bpup.mp3");
    Sound.chain = new Sound("sound/chain.mp3");
    /**休む. */
    Sound.camp = new Sound("sound/camp.mp3");
    Sound.COIN = new Sound("sound/COIN.mp3");
    Sound.death = new Sound("sound/death.mp3");
    Sound.exp = new Sound("sound/exp.mp3");
    Sound.gameover = new Sound("sound/gameover.mp3");
    Sound.gun = new Sound("sound/gun.mp3");
    Sound.ITEM_GET = new Sound("sound/ITEM_GET.mp3");
    Sound.KAIFUKU = new Sound("sound/KAIFUKU.mp3");
    Sound.kako = new Sound("sound/kako.mp3");
    /**買い物. */
    Sound.KATAN = new Sound("sound/KATAN.mp3");
    /**伐採. */
    Sound.KEN = new Sound("sound/KEN.mp3");
    /**罠解除. */
    Sound.keyopen = new Sound("sound/keyopen.mp3");
    Sound.drain = new Sound("sound/kyuusyuu.mp3");
    /**合成. */
    Sound.made = new Sound("sound/made.mp3");
    /**魔法攻撃. */
    Sound.MAGIC = new Sound("sound/MAGIC.mp3");
    /**story. */
    Sound.moji = new Sound("sound/moji.mp3");
    /**踏破. */
    Sound.lvup = new Sound("sound/lvup.mp3");
    Sound.pet_die = new Sound("sound/pet_die.mp3");
    /**格闘攻撃. */
    Sound.PUNCH = new Sound("sound/PUNCH.mp3");
    /**財宝・ダンジョンクリア時のアイテム. */
    Sound.rare = new Sound("sound/rare.mp3");
    Sound.save = new Sound("sound/save.mp3");
    /**凍てつく波動. */
    Sound.seikou = new Sound("sound/seikou.mp3");
    /**神格攻撃. */
    Sound.sin = new Sound("sound/sin.mp3");
    /**選択音. */
    Sound.system = new Sound("sound/turn_who.mp3");
    Sound.TRAGER = new Sound("sound/TRAGER.mp3");
    /**状態強化. */
    Sound.up = new Sound("sound/up.mp3");
    Sound.win = new Sound("sound/win.mp3");
    Sound.walk = new Sound("sound/walk.mp3");
    /**ダンジョン出入り. */
    Sound.walk2 = new Sound("sound/walk2.mp3");
    /**arr. */
    Sound.ya = new Sound("sound/ya.mp3");
})(Sound || (Sound = {}));
