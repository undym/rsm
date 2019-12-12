// export class Sound2{
//     static readonly MIN_VOLUME = -10;
//     static readonly MAX_VOLUME = 10;
//     private static _volume:number;
//     /**-10～10.Int. */
//     static get volume()         {return this._volume;}
//     /**-10～10.Int. */
//     static set volume(v:number) {
//         v = v|0;
//         if(v > this.MAX_VOLUME){v = this.MAX_VOLUME;}
//         if(v < this.MIN_VOLUME){v = this.MIN_VOLUME;}
//         this._volume = v;
//         Sound2.gain.gain.value = v / 10;
//     }
//     private static ac:AudioContext;
//     private static gain:GainNode;
//     /**AudioContextの初期化。ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
//     static init(){
//         const w:any = window;
//         const AC = (w.AudioContext || w.webkitAudioContext);
//         this.ac = new AC();
//         this.gain = this.ac.createGain();
//         this.gain.connect(this.ac.destination);
//         this.volume = 0;
//         // Sound.gain.gain.value = 0;
//     }
//     static load(node:SoundNode, ondecoded?:()=>void){
//         node.loaded = true;
//         const request = new XMLHttpRequest();
//         request.onload = ()=>{
//             var audioData = request.response;
//             Sound2.ac.decodeAudioData(audioData, buffer=>{
//                 node.buffer = buffer;
//                 if(ondecoded){
//                     ondecoded();
//                 }
//             },e=>{
//                 return "Error with decoding audio data: " + node.path;
//             });
//         };
//         request.open("GET", node.path, true);
//         request.responseType = 'arraybuffer';
//         request.send();
//     }
//     static play(
//         node:SoundNode, 
//         options?:{
//             loop?:boolean,
//         },
//     ){
//         if(Sound2.ac.state !== "running"){
//             Sound2.ac.resume();
//         }
//         if(!node.loaded){
//             this.load(node, ()=>{
//                 this.play(node, options);
//             });
//             return;
//         }
//         if(!node.buffer){return;}
//         const src = Sound2.ac.createBufferSource();
//         src.buffer = node.buffer;
//         src.connect(Sound2.ac.destination);
//         src.connect(Sound2.gain);
//         if(options && options.loop){
//             src.loop = true;
//         }
//         src.start(0);
//         node.src = src;
//     }
//     static stop(node:SoundNode){
//         node.src.stop();
//     }
// }
// export class SoundNode{
//     buffer:AudioBuffer;
//     src:AudioBufferSourceNode;
//     loaded = false;
//     constructor(readonly path:string){
//     }
//     play(
//         options?:{
//             loop?:boolean,
//         },
//     ){
//         Sound2.play(this, options);
//     }
//     stop(){
//         Sound2.stop(this);
//     }
// }
export class Sound {
    constructor(path, lazyLoad = false) {
        this.path = path;
        this.lazyLoad = lazyLoad;
        this.loaded = false;
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
        this.ac = new AC();
        this.gain = this.ac.createGain();
        this.gain.connect(this.ac.destination);
        this.volume = 0;
        // Sound.gain.gain.value = 0;
    }
    load(ondecoded) {
        this.loaded = true;
        const request = new XMLHttpRequest();
        request.onload = () => {
            var audioData = request.response;
            Sound.ac.decodeAudioData(audioData, buffer => {
                this.buffer = buffer;
                if (ondecoded) {
                    ondecoded();
                }
            }, e => {
                return "Error with decoding audio data " + this.path;
            });
        };
        request.open("GET", this.path, true);
        request.responseType = 'arraybuffer';
        request.send();
    }
    play(options) {
        if (Sound.ac.state !== "running") {
            Sound.ac.resume();
        }
        if (!this.loaded) {
            this.load(() => {
                this.play(options);
            });
            return;
        }
        if (!this.buffer) {
            return;
        }
        if (this.src && this.src.loop) { //ループがついているsrcを見失うと止められなくなるので
            this.src.stop();
        }
        const src = Sound.ac.createBufferSource();
        src.buffer = this.buffer;
        src.connect(Sound.ac.destination);
        src.connect(Sound.gain);
        if (options && options.loop) {
            src.loop = true;
        }
        src.start(0);
        this.src = src;
    }
    stop() {
        if (this.src) {
            this.src.stop();
        }
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
    /**小規模攻撃アイテム. */
    Sound.bom = new Sound("sound/bom.mp3");
    /**ミサイル系攻撃. */
    Sound.bom2 = new Sound("sound/bom2.mp3");
    Sound.chain = new Sound("sound/chain.mp3");
    /**休む. */
    Sound.camp = new Sound("sound/camp.mp3");
    Sound.COIN = new Sound("sound/COIN.mp3");
    /**死神の鎌. */
    Sound.DARK = new Sound("sound/DARK.mp3");
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
    Sound.no = new Sound("sound/no.mp3");
    /**魔法攻撃. */
    Sound.MAGIC = new Sound("sound/MAGIC.mp3");
    /**story. */
    Sound.moji = new Sound("sound/moji.mp3");
    Sound.lazer = new Sound("sound/lazer.mp3");
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
    /**ペット召喚. */
    Sound.warp = new Sound("sound/warp.mp3");
    /**arr. */
    Sound.ya = new Sound("sound/ya.mp3");
})(Sound || (Sound = {}));
export var Music;
(function (Music) {
    const _values = [];
    function values() {
        return _values;
    }
    Music.values = values;
    const _dungeonMusics = [];
    function getDungeonMusics() { return _dungeonMusics; }
    Music.getDungeonMusics = getDungeonMusics;
    const _bossMusics = [];
    function getBossMusics() { return _bossMusics; }
    Music.getBossMusics = getBossMusics;
    function createMusic(type, src, lazy) {
        const s = new Sound(src, lazy);
        _values.push(s);
        if (type === "dungeon") {
            _dungeonMusics.push(s);
        }
        else if (type === "boss") {
            _bossMusics.push(s);
        }
        return s;
    }
    function stop() {
        Music.values().forEach(m => m.stop());
    }
    Music.stop = stop;
    Music.ifuudoudou = createMusic("dungeon", "sound/music/ifuudoudou.mp3", /*lazy*/ true);
    Music.kimi = createMusic("dungeon", "sound/music/kimi.mp3", /*lazy*/ true);
    Music.hesoumi = createMusic("dungeon", "sound/music/hesoumi.mp3", /*lazy*/ true);
    Music.satori = createMusic("dungeon", "sound/music/satori.mp3", /*lazy*/ true);
    Music.satori2 = createMusic("dungeon", "sound/music/satori2.mp3", /*lazy*/ true);
    Music.satori3 = createMusic("dungeon", "sound/music/satori3.mp3", /*lazy*/ true);
    Music.usakuma = createMusic("dungeon", "sound/music/usakuma.mp3", /*lazy*/ true);
    Music.iknewme = createMusic("dungeon", "sound/music/iknewme.mp3", /*lazy*/ true);
    Music.rs7 = createMusic("boss", "sound/music/rs7.mp3", /*lazy*/ true);
    Music.tatakai2 = createMusic("boss", "sound/music/tatakai2.mp3", /*lazy*/ true);
    Music.ma = createMusic("boss", "sound/music/ma.mp3", /*lazy*/ true);
    Music.ruin = createMusic("boss", "sound/music/ruin.mp3", /*lazy*/ true);
})(Music || (Music = {}));
