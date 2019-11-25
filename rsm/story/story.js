var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Rect, Color, Point } from "../undym/type.js";
import { Scene, cwait } from "../undym/scene.js";
import { ILayout } from "../undym/layout.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { Sound } from "../sound.js";
export class Story {
    constructor() {
        this.name = "";
        const mainBounds = new Rect(0, 0, 1, 0.8);
        const nameBounds = new Rect(0, mainBounds.yh, 0.20, 0.05);
        const faceBounds = new Rect(0, nameBounds.yh, nameBounds.w, 1 - nameBounds.yh);
        const msgBounds = new Rect(nameBounds.xw, nameBounds.y, 1 - nameBounds.xw, nameBounds.h + faceBounds.h);
        const msgBoundsInner = (() => {
            const marginW = msgBounds.w * 0.02;
            const marginH = msgBounds.h * 0.02;
            return new Rect(msgBounds.x + marginW, msgBounds.y + marginH, msgBounds.w - marginW * 2, msgBounds.h - marginH * 2);
        })();
        Scene.now.add(Rect.FULL, ILayout.create({ draw: bounds => {
                if (this._end) {
                    return;
                }
                Graphics.fillRect(bounds, Color.BLACK);
                if (this.bg) {
                    this.bg.drawEx({ dstRatio: mainBounds, keepRatio: true });
                }
                if (this.face) {
                    this.face.drawEx({ dstRatio: faceBounds, keepRatio: true });
                }
                Font.def.draw(this.name, nameBounds.center, Color.WHITE, "center");
                if (this.loaded < this.msg.length) {
                    const newStr = this.msg.substring(this.loaded, this.loaded + 1);
                    if (Font.def.measureRatioW(this.screenMsg[this.screenMsg.length - 1] + newStr) >= msgBoundsInner.w) {
                        this.screenMsg.push("");
                    }
                    this.screenMsg[this.screenMsg.length - 1] += newStr;
                    this.loaded++;
                }
                this.screenMsg.forEach((s, i) => {
                    Font.def.draw(s, new Point(msgBoundsInner.x, msgBoundsInner.y + Font.def.ratioH * i), Color.WHITE);
                });
            } }));
    }
    set(bg, sets) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bg = bg;
            for (const set of sets) {
                this.face = set[0];
                this.name = set[1];
                this.msg = set[2];
                this.loaded = 0;
                this.screenMsg = [""];
                Sound.moji.play();
                yield cwait();
            }
        });
    }
    end() {
        this._end = true;
    }
}
