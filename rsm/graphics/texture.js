import { Rect } from "../undym/type.js";
import { Graphics } from "./graphics.js";
export class Texture {
    /**
     * 優先順位: canvas > size > imageData
     * @param values
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }
    draw(dstRatio, srcRatio = Rect.FULL) {
        const ctx = Graphics.getRenderTarget().ctx;
        const w = Graphics.getRenderTarget().canvas.width;
        const h = Graphics.getRenderTarget().canvas.height;
        ctx.drawImage(this.canvas, 
        /*sx*/ srcRatio.x * this.canvas.width, 
        /*sy*/ srcRatio.y * this.canvas.height, 
        /*sw*/ srcRatio.w * this.canvas.width, 
        /*sh*/ srcRatio.h * this.canvas.height, 
        /*dx*/ dstRatio.x * w, 
        /*dy*/ dstRatio.y * h, 
        /*dw*/ dstRatio.w * w, 
        /*dh*/ dstRatio.h * h);
    }
    /**このTextureをRenderTargetにし、runを実行したのち元のTextureをRenderTargetに戻す。*/
    setRenderTarget(run) {
        const bak = Graphics.getRenderTarget();
        Graphics.setRenderTarget(this);
        run();
        Graphics.setRenderTarget(bak);
    }
    /**canvas.width */
    get pixelW() { return this.canvas.width; }
    /**canvas.height */
    get pixelH() { return this.canvas.height; }
    /**1/canvas.width */
    get dotW() { return 1 / this.canvas.width; }
    /**1/canvas.height */
    get dotH() { return 1 / this.canvas.height; }
    /**現在のRenderTargetを基準としたサイズ比を返す。 */
    get ratioW() { return this.canvas.width / Graphics.getRenderTarget().pixelW; }
    /**現在のRenderTargetを基準としたサイズ比を返す。 */
    get ratioH() { return this.canvas.height / Graphics.getRenderTarget().pixelH; }
}
(function (Texture) {
    Texture.empty = (() => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        return new Texture(canvas);
    })();
    Texture.createFromPixel = (w, h) => {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        return new Texture(canvas);
    };
    Texture.createFromImageData = (imageData) => {
        const canvas = document.createElement("canvas");
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext("2d");
        ctx.putImageData(imageData, 0, 0);
        return new Texture(canvas);
    };
    Texture.createFromSrc = (src) => {
        const img = new Image();
        img.src = src;
    };
})(Texture || (Texture = {}));
export class Img extends Texture {
    constructor(src, option) {
        super(document.createElement("canvas"));
        this.src = src;
        this.option = option;
        this.img = new Image();
        // this._image.crossOrigin = 'anonymous';
        if (!src) {
            return;
        }
        if (option && option.lazyLoad) {
            this.loading = Img.LOADING_YET;
        }
        else {
            this.load();
        }
    }
    get image() { return this.img; }
    draw(dstRatio, srcRatio = Rect.FULL) {
        if (this.loading !== Img.LOADING_DONE) {
            if (this.loading === Img.LOADING_YET) {
                this.load();
            }
            return;
        }
        const ctx = Graphics.getRenderTarget().ctx;
        const cw = Graphics.getRenderTarget().canvas.width;
        const ch = Graphics.getRenderTarget().canvas.height;
        ctx.drawImage(this.canvas, /*sx*/ srcRatio.x * this.img.width, /*sy*/ srcRatio.y * this.img.height, /*sw*/ srcRatio.w * this.img.width, /*sh*/ srcRatio.h * this.img.height, /*dx*/ dstRatio.x * cw, /*dy*/ dstRatio.y * ch, /*dw*/ dstRatio.w * cw, /*dh*/ dstRatio.h * ch);
        // ctx.putImageData
    }
    /**
     * keepRatio:dstRatioを中心に、縦横を大きい側に合わせる。小さい側はdstRatioに合わず、隙間ができる。
     */
    drawEx(args) {
        if (this.loading !== Img.LOADING_DONE) {
            if (this.loading === Img.LOADING_YET) {
                this.load();
            }
            return;
        }
        const ctx = Graphics.context;
        const cw = Graphics.getRenderTarget().canvas.width;
        const ch = Graphics.getRenderTarget().canvas.height;
        let srcX, srcY, srcW, srcH;
        let dstX = args.dstRatio.x;
        let dstY = args.dstRatio.y;
        let dstW = args.dstRatio.w;
        let dstH = args.dstRatio.h;
        if (args.srcRatio) {
            srcX = args.srcRatio.x;
            srcY = args.srcRatio.y;
            srcW = args.srcRatio.w;
            srcH = args.srcRatio.h;
        }
        else {
            srcX = 0;
            srcY = 0;
            srcW = 1;
            srcH = 1;
        }
        if (args.keepRatio) {
            const rw = args.dstRatio.w - this.ratioW;
            const rh = args.dstRatio.h - this.ratioH;
            let mul = 1;
            if (rw < rh) {
                mul = args.dstRatio.w / this.ratioW;
            }
            else {
                mul = args.dstRatio.h / this.ratioH;
            }
            dstW = this.ratioW * mul;
            dstH = this.ratioH * mul;
            dstX = args.dstRatio.cx - dstW / 2;
            dstY = args.dstRatio.cy - dstH / 2;
        }
        if (args.reverseHorizontal) {
            ctx.scale(-1, 1);
            dstX = -dstX - dstW;
        }
        if (args.reverseVertical) {
            ctx.scale(1, -1);
            dstY = -dstY - dstH;
        }
        ctx.drawImage(this.canvas, /*sx*/ srcX * this.img.width, /*sy*/ srcY * this.img.height, /*sw*/ srcW * this.img.width, /*sh*/ srcH * this.img.height, /*dx*/ dstX * cw, /*dy*/ dstY * ch, /*dw*/ dstW * cw, /*dh*/ dstH * ch);
        if (args.reverseHorizontal) {
            ctx.scale(-1, 1);
            dstX = -dstX - dstW;
        }
        if (args.reverseVertical) {
            ctx.scale(1, -1);
        }
    }
    get complete() { return this.img.complete; }
    load() {
        this.loading = Img.LOADING_NOW;
        this.img.onload = () => {
            this.loading = Img.LOADING_DONE;
            this.canvas.width = this.img.width;
            this.canvas.height = this.img.height;
            this.ctx.drawImage(this.img, 0, 0);
            if (this.option && this.option.clear) {
                this.clear(this.option.clear);
            }
            if (this.option && this.option.onload) {
                this.option.onload(this);
            }
        };
        this.img.src = this.src;
    }
    clear(color) {
        const imgData = this.ctx.getImageData(0, 0, this.img.width, this.img.height);
        const data = imgData.data;
        const r = (color.r * 255) | 0;
        const g = (color.g * 255) | 0;
        const b = (color.b * 255) | 0;
        const a = (color.a * 255) | 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === r
                && data[i + 1] === g
                && data[i + 2] === b
                && data[i + 3] === a) {
                data[i + 3] = 0;
            }
        }
        this.ctx.putImageData(imgData, 0, 0);
    }
}
Img.LOADING_YET = 0;
Img.LOADING_NOW = 1;
Img.LOADING_DONE = 2;
(function (Img) {
    Img.empty = new Img("");
})(Img || (Img = {}));
