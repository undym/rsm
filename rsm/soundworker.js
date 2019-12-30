var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ctx = self;
ctx.addEventListener("message", (ev) => __awaiter(this, void 0, void 0, function* () {
    fetch(ev.data.path, { method: "GET" })
        .then(res => {
        res.arrayBuffer()
            .then(audioData => {
            ctx.postMessage({ audioData: audioData });
            // ev.data.soundContext.decodeAudioData(audioData, buffer=>{
            //     ctx.postMessage({buffer:buffer});
            // },e=>{
            //     console.log( "Error with decoding audio data " + ev.data.path );
            // });
        });
    });
    // console.log("worker:"+ev.data);
    // ctx.postMessage("res");
}));
