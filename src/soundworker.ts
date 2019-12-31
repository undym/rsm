const ctx:Worker = self as any;

// const sounds = new Map<string,SoundWorker>();
// const musics = new Map<string,SoundWorker>();
// let init = false;

// class SoundWorker{
//     private static readonly GAIN_SOUND = 0;
//     private static readonly GAIN_MUSIC = 1;
//     private static readonly GAIN_NUM = 2;

//     static readonly MIN_VOLUME = -10;
//     static readonly MAX_VOLUME = 10;


//     private static _context:AudioContext;
//     static get context(){return this._context;}
//     private static gains:{gain:GainNode, volume:number}[] = [];
//     static getVolume(type:"sound"|"music"):number{
//         if(type === "sound"){return this.gains[ SoundWorker.GAIN_SOUND ].volume;}
//         if(type === "music"){return this.gains[ SoundWorker.GAIN_MUSIC ].volume;}
//         return 0;
//     }
//     static setVolume(type:"sound"|"music", v:number){
//         v = v|0;
//         if(v > this.MAX_VOLUME){v = this.MAX_VOLUME;}
//         if(v < this.MIN_VOLUME){v = this.MIN_VOLUME;}
//         if(type === "sound"){
//             const set = this.gains[ SoundWorker.GAIN_SOUND ];
//             set.volume = v;
//             set.gain.gain.value = v / 10;
//         }
//         if(type === "music"){
//             const set = this.gains[ SoundWorker.GAIN_MUSIC ];
//             set.volume = v;
//             set.gain.gain.value = v / 10;
//         }

//     }

//     /**AudioContextの初期化。ブラウザの制限のため、TouchEventの中で初期化しなければならない。 */
//     static init(){
//         const w = self as any;
//         const AC = (w.AudioContext || w.webkitAudioContext);
//         this._context = new AC();

//         for(let i = 0; i < this.GAIN_NUM; i++){
//             const gain = this.context.createGain();
//             gain.connect(this.context.destination);
//             this.gains.push( {gain:gain, volume:0});
//         }
//     }

//     private buffer:AudioBuffer;
//     private src:AudioBufferSourceNode;
//     private loaded = false;
//     private playing = false;
//     private doStop = false;

    
//     constructor(readonly path:string, readonly gainType:"sound"|"music", readonly lazyLoad = false){
//     }
    
//     load(ondecoded?:()=>void){
//         this.loaded = true;
        
//         // if(this.gainType === "sound"){
//             fetch(this.path, {method:"GET"})
//                 .then(res=>{
    
//                     res.arrayBuffer()
//                         .then(audioData=>{
//                             SoundWorker.context.decodeAudioData(audioData, buffer=>{
//                                 this.buffer = buffer;
//                                 if(ondecoded){
//                                     ondecoded();
//                                 }
//                             },e=>{
//                                 console.log( "Error with decoding audio data " + this.path );
//                             });
//                         })
//                         ;
    
//                 })
//                 ;
//         // }else{
//                 //別スレッドでダウンロードすることでカクカクがなくなるかと思ったが、同じだった
//                 //decodeAudioDataでやれば違う？
//                 //Sound関係を全てWorkerに任せればいいのか？
//         //     const worker = new Worker("soundworker.js");

//         //     worker.onmessage = ev=>{
//         //         Sound.context.decodeAudioData(ev.data.audioData, buffer=>{
//         //             this.buffer = buffer;
//         //             if(ondecoded){
//         //                 ondecoded();
//         //             }

//         //             worker.terminate();
//         //         },e=>{
//         //             console.log( "Error with decoding audio data " + this.path );
//         //             worker.terminate();
//         //         });
//         //     };
//         //     worker.postMessage({
//         //         path:this.path,
//         //     });
//         // }
//     }

//     play(options?:{
//         loop?:boolean,
//     }){
//         this.doStop = false;

//         if(SoundWorker.context.state !== "running"){
//             SoundWorker.context.resume();
//         }

//         if(!this.loaded){
//             this.load(()=>{
//                 if(this.doStop){return;}
//                 this.play(options);
//             });
//             return;
//         }
//         if(!this.buffer){return;}

//         if(this.src && this.src.loop){//ループがついているsrcを見失うと止められなくなるので
//             this.stop();
//         }

//         const src = SoundWorker.context.createBufferSource();
//         src.buffer = this.buffer;
//         src.connect(SoundWorker.context.destination);
//         if(this.gainType === "sound"){src.connect(SoundWorker.gains[ SoundWorker.GAIN_SOUND ].gain);}
//         if(this.gainType === "music"){src.connect(SoundWorker.gains[ SoundWorker.GAIN_MUSIC ].gain);}
//         if(options && options.loop){
//             src.loop = true;
//         }

//         src.start(0);
//         this.src = src;
//         this.playing = true;
//     }

//     stop(){
//         this.doStop = true;

//         if(this.src && this.playing){
//             this.playing = false;
//             try{
//                 this.src.stop();
//             }catch(err){
//                 console.log(err);
//             }
//         }
//     }
// }



ctx.addEventListener("message", async ev=>{
    // if(!init){
    //     init = true;
    //     SoundWorker.init();
    // }

    // const data:{
    //     type:"sound"|"music",
    //     action:"load"|"play"|"loop"|"stop"|"volume",
    //     path?:string,
    //     lazyLoad?:boolean,
    //     volume?:number,
    // } = ev.data;

    // if(data.action === "volume"){
    //     if(data.volume){
    //         SoundWorker.setVolume( data.type, data.volume );
    //     }
    //     return;
    // }

    // if(!data.path){return;}

    // if(data.type === "sound" && !sounds.has(data.path)){
    //     sounds.set( data.path, new SoundWorker(data.path, "sound", data.lazyLoad) );
    // }
    // if(data.type === "music" && !musics.has(data.path)){
    //     musics.set( data.path, new SoundWorker(data.path, "music", data.lazyLoad) );
    // }
    
    // if(data.action === "load"){
    //     return;
    // }

    // const sound = sounds.get(data.path);

    // if(!sound){return;}

    // if(data.action === "play"){
    //     sound.play({loop:false});
    //     return;
    // }
    // if(data.action === "loop"){
    //     sound.play({loop:true});
    //     return;
    // }
    // if(data.action === "stop"){
    //     sound.stop();
    //     return;
    // }

    ev.data.action();

    // fetch(ev.data.path, {method:"GET"})
    //     .then(res=>{

    //         res.arrayBuffer()
    //             .then(audioData=>{
    //                 ctx.postMessage({audioData:audioData});
    //                 // ev.data.soundContext.decodeAudioData(audioData, buffer=>{
    //                 //     ctx.postMessage({buffer:buffer});
    //                 // },e=>{
    //                 //     console.log( "Error with decoding audio data " + ev.data.path );
    //                 // });
    //             })
    //             ;

    //     })
    //     ;
    // console.log("worker:"+ev.data);
    // ctx.postMessage("res");
});