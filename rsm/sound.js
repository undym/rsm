export class Sound {
    constructor(path, gainType, lazyLoad = false) {
        this.path = path;
        this.gainType = gainType;
        this.lazyLoad = lazyLoad;
        this.loaded = false;
        this.playing = false;
        this.doStop = false;
    }
    static get context() { return this._context; }
    static getVolume(type) {
        if (type === "sound") {
            return this.gains[Sound.GAIN_SOUND].volume;
        }
        if (type === "music") {
            return this.gains[Sound.GAIN_MUSIC].volume;
        }
        return 0;
    }
    static setVolume(type, v) {
        v = v | 0;
        if (v > this.MAX_VOLUME) {
            v = this.MAX_VOLUME;
        }
        if (v < this.MIN_VOLUME) {
            v = this.MIN_VOLUME;
        }
        if (type === "sound") {
            const set = this.gains[Sound.GAIN_SOUND];
            set.volume = v;
            set.gain.gain.value = v / 10;
        }
        if (type === "music") {
            const set = this.gains[Sound.GAIN_MUSIC];
            set.volume = v;
            set.gain.gain.value = v / 10;
        }
    }
    /**AudioContextの初期化。ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
    static init() {
        const w = window;
        const AC = (w.AudioContext || w.webkitAudioContext);
        this._context = new AC();
        for (let i = 0; i < this.GAIN_NUM; i++) {
            const gain = this.context.createGain();
            gain.connect(this.context.destination);
            this.gains.push({ gain: gain, volume: 0 });
        }
    }
    load(ondecoded) {
        this.loaded = true;
        fetch(this.path, { method: "GET" })
            .then(res => {
            res.arrayBuffer()
                .then(audioData => {
                Sound.context.decodeAudioData(audioData, buffer => {
                    this.buffer = buffer;
                    if (ondecoded) {
                        ondecoded();
                    }
                }, e => {
                    console.log("Error with decoding audio data " + this.path);
                });
            });
        });
    }
    play(options) {
        this.doStop = false;
        if (Sound.context.state !== "running") {
            Sound.context.resume();
        }
        if (!this.loaded) {
            this.load(() => {
                if (this.doStop) {
                    return;
                }
                this.play(options);
            });
            return;
        }
        if (!this.buffer) {
            return;
        }
        if (this.src && this.src.loop) { //ループがついているsrcを見失うと止められなくなるので
            this.stop();
        }
        const src = Sound.context.createBufferSource();
        src.buffer = this.buffer;
        src.connect(Sound.context.destination);
        if (this.gainType === "sound") {
            src.connect(Sound.gains[Sound.GAIN_SOUND].gain);
        }
        if (this.gainType === "music") {
            src.connect(Sound.gains[Sound.GAIN_MUSIC].gain);
        }
        if (options && options.loop) {
            src.loop = true;
        }
        src.start(0);
        this.src = src;
        this.playing = true;
    }
    stop() {
        this.doStop = true;
        if (this.src && this.playing) {
            this.playing = false;
            try {
                this.src.stop();
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}
Sound.GAIN_SOUND = 0;
Sound.GAIN_MUSIC = 1;
Sound.GAIN_NUM = 2;
Sound.MIN_VOLUME = -10;
Sound.MAX_VOLUME = 10;
Sound.gains = [];
(function (Sound) {
    const _values = [];
    function values() { return _values; }
    Sound.values = values;
    function createSound(path) {
        const s = new Sound(path, "sound");
        _values.push(s);
        return s;
    }
    /**毒. */
    Sound.awa = createSound("sound/awa.mp3");
    /**封印回路. */
    Sound.BELL = createSound("sound/BELL.mp3");
    /**罠発動. */
    Sound.blood = createSound("sound/blood.mp3");
    /**瞑想. */
    Sound.bpup = createSound("sound/bpup.mp3");
    /**小規模攻撃アイテム. */
    Sound.bom = createSound("sound/bom.mp3");
    /**ミサイル系攻撃. */
    Sound.bom2 = createSound("sound/bom2.mp3");
    Sound.chain = createSound("sound/chain.mp3");
    /**休む. */
    Sound.camp = createSound("sound/camp.mp3");
    Sound.COIN = createSound("sound/COIN.mp3");
    /**CollectingSkill上昇. */
    Sound.cry = createSound("sound/cry.mp3");
    /**死神の鎌. */
    Sound.DARK = createSound("sound/DARK.mp3");
    Sound.death = createSound("sound/death.mp3");
    /**弱体. */
    Sound.down = createSound("sound/down.mp3");
    Sound.exp = createSound("sound/exp.mp3");
    Sound.gameover = createSound("sound/gameover.mp3");
    Sound.gun = createSound("sound/gun.mp3");
    Sound.ITEM_GET = createSound("sound/ITEM_GET.mp3");
    Sound.KAIFUKU = createSound("sound/KAIFUKU.mp3");
    Sound.kako = createSound("sound/kako.mp3");
    /**買い物. */
    Sound.KATAN = createSound("sound/KATAN.mp3");
    /**伐採. */
    Sound.KEN = createSound("sound/KEN.mp3");
    /**罠解除. */
    Sound.keyopen = createSound("sound/keyopen.mp3");
    Sound.drain = createSound("sound/kyuusyuu.mp3");
    /**合成. */
    Sound.made = createSound("sound/made.mp3");
    Sound.no = createSound("sound/no.mp3");
    /**魔法攻撃. */
    Sound.MAGIC = createSound("sound/MAGIC.mp3");
    /**story. */
    Sound.moji = createSound("sound/moji.mp3");
    Sound.nigeru = createSound("sound/nigeru.mp3");
    Sound.lazer = createSound("sound/lazer.mp3");
    /**踏破. */
    Sound.lvup = createSound("sound/lvup.mp3");
    Sound.pet_die = createSound("sound/pet_die.mp3");
    /**格闘攻撃. */
    Sound.PUNCH = createSound("sound/PUNCH.mp3");
    /**財宝・ダンジョンクリア時のアイテム. */
    Sound.rare = createSound("sound/rare.mp3");
    /**ex撃破. */
    Sound.reaitem1 = createSound("sound/reaitem1.mp3");
    Sound.save = createSound("sound/save.mp3");
    /**凍てつく波動. */
    Sound.seikou = createSound("sound/seikou.mp3");
    /**神格攻撃. */
    Sound.sin = createSound("sound/sin.mp3");
    /**選択音. */
    Sound.system = createSound("sound/turn_who.mp3");
    Sound.TRAGER = createSound("sound/TRAGER.mp3");
    /**状態強化. */
    Sound.up = createSound("sound/up.mp3");
    Sound.win = createSound("sound/win.mp3");
    Sound.walk = createSound("sound/walk.mp3");
    /**ダンジョン出入り. */
    Sound.walk2 = createSound("sound/walk2.mp3");
    /**ペット召喚. */
    Sound.warp = createSound("sound/warp.mp3");
    /**arr. */
    Sound.ya = createSound("sound/ya.mp3");
})(Sound || (Sound = {}));
export var Music;
(function (Music) {
    const _values = [];
    function values() {
        return _values;
    }
    Music.values = values;
    const musics = new Map([
        ["dungeon", []],
        ["boss", []],
        ["ex", []],
    ]);
    Music.getMusics = (type) => {
        const m = musics.get(type);
        return m ? m : [];
    };
    function createMusic(type, src, lazy) {
        const s = new Sound(src, "music", lazy);
        _values.push(s);
        // musics.get(type)?.push(s);
        const m = musics.get(type);
        if (m) {
            m.push(s);
        }
        return s;
    }
    function stop() {
        Music.values().forEach(m => m.stop());
    }
    Music.stop = stop;
    Music.ifuudoudou = createMusic("dungeon", "sound/music/ifuudoudou.mp3", /*lazy*/ false);
    Music.hesoumi = createMusic("dungeon", "sound/music/hesoumi.mp3", /*lazy*/ false);
    Music.tuchi2 = createMusic("dungeon", "sound/music/tuchi2.mp3", /*lazy*/ false);
    Music.aenai = createMusic("dungeon", "sound/music/aenai.mp3", /*lazy*/ false);
    Music.anokoro = createMusic("ex", "sound/music/anokoro.mp3", /*lazy*/ false);
    Music.rs7 = createMusic("boss", "sound/music/rs7.mp3", /*lazy*/ false);
})(Music || (Music = {}));
