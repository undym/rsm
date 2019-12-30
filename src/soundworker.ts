const ctx:Worker = self as any;

ctx.addEventListener("message", async ev=>{
    fetch(ev.data.path, {method:"GET"})
        .then(res=>{

            res.arrayBuffer()
                .then(audioData=>{
                    ctx.postMessage({audioData:audioData});
                    // ev.data.soundContext.decodeAudioData(audioData, buffer=>{
                    //     ctx.postMessage({buffer:buffer});
                    // },e=>{
                    //     console.log( "Error with decoding audio data " + ev.data.path );
                    // });
                })
                ;

        })
        ;
    // console.log("worker:"+ev.data);
    // ctx.postMessage("res");
});