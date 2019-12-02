import { Rect, Color, Point } from "../undym/type.js";
import { Scene, cwait } from "../undym/scene.js";
import { ILayout } from "../undym/layout.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { Img } from "../graphics/texture.js";
import { Sound } from "../sound.js";
import { Util } from "../util.js";
import { Story0 } from "./story0.js";






export class Story{
    bg:Img;
    face:Img;
    _end:boolean;
    name:string = "";

    loaded:number;
    msg:string;
    screenMsg:string[];

    constructor(){
        const mainBounds = new Rect(0, 0, 1, 0.8);
        const nameBounds = new Rect(0, mainBounds.yh, 0.20, 0.05);
        const faceBounds = new Rect(0, nameBounds.yh, nameBounds.w, 1 - nameBounds.yh);
        const msgBounds = new Rect(nameBounds.xw, nameBounds.y, 1 - nameBounds.xw, nameBounds.h + faceBounds.h);
        const msgBoundsInner = (()=>{
            const marginW = msgBounds.w * 0.02;
            const marginH = msgBounds.h * 0.02;
            return new Rect(msgBounds.x + marginW, msgBounds.y + marginH, msgBounds.w - marginW * 2, msgBounds.h - marginH * 2 );
        })();

        Scene.now.add(Rect.FULL, ILayout.create({draw:bounds=>{
            if(this._end){return;}

            Graphics.fillRect(bounds, Color.BLACK);

            if(this.bg){
                this.bg.drawEx({dstRatio:mainBounds, keepRatio:true});
            }

            if(this.face){
                this.face.drawEx({dstRatio:faceBounds, keepRatio:true});
            }

            Font.def.draw(this.name, nameBounds.center, Color.WHITE, "center");

            for(let i = 0; i < 2; i++){       
                if(this.loaded < this.msg.length){
                    const newStr = this.msg.substring(this.loaded, this.loaded+1);
                    if(Font.def.measureRatioW(this.screenMsg[ this.screenMsg.length - 1] + newStr ) >= msgBoundsInner.w){
                        this.screenMsg.push("");
                    }

                    this.screenMsg[ this.screenMsg.length - 1 ] += newStr;
                    this.loaded++;
                }
            }
            this.screenMsg.forEach((s,i)=>{
                Font.def.draw(s, new Point(msgBoundsInner.x, msgBoundsInner.y + Font.def.ratioH * i), Color.WHITE);
            });
        }}));
    }


    async set(bg:Img, sets:[Img, string, string][]){
        this.bg = bg;

        for(const set of sets){
            this.face = set[0];
            this.name = set[1];
            this.msg = set[2];
            this.loaded = 0;
            this.screenMsg = [""];

            Sound.moji.play();
            await cwait();
        }
    }

    end(){
        this._end = true;
    }
}
