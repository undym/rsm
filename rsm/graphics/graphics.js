import { Rect } from "../undym/type.js";
export class Texture {
    static get empty() {
        if (this._empty === undefined) {
            this._empty = new Texture({ pixelSize: { w: 1, h: 1 } });
        }
        return this._empty;
    }
    /**
     * 優先順位: canvas > size > imageData
     * @param values
     */
    constructor(args) {
        if (args.canvas) {
            this.canvas = args.canvas;
            this.ctx = this.canvas.getContext("2d");
        }
        else if (args.pixelSize) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = args.pixelSize.w;
            this.canvas.height = args.pixelSize.h;
            this.ctx = this.canvas.getContext("2d");
        }
        else if (args.imageData) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = args.imageData.width;
            this.canvas.height = args.imageData.height;
            this.ctx = this.canvas.getContext("2d");
            this.ctx.putImageData(args.imageData, 0, 0);
        }
        this.ctx.imageSmoothingEnabled = false;
    }
    draw(dstRatio, srcRatio = { x: 0, y: 0, w: 1, h: 1 }) {
        const ctx = Graphics.getRenderTarget().ctx;
        const w = Graphics.getRenderTarget().canvas.width;
        const h = Graphics.getRenderTarget().canvas.height;
        ctx.drawImage(this.canvas, /*sx*/ srcRatio.x * this.canvas.width, /*sy*/ srcRatio.y * this.canvas.height, /*sw*/ srcRatio.w * this.canvas.width, /*sh*/ srcRatio.h * this.canvas.height, /*dx*/ dstRatio.x * w, /*dy*/ dstRatio.y * h, /*dw*/ dstRatio.w * w, /*dh*/ dstRatio.h * h);
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
}
export class Img {
    constructor(src, lazyLoad = false) {
        this.src = src;
        this.lazyLoad = lazyLoad;
        this.image = new Image();
        this.image.crossOrigin = 'anonymous';
        if (!src) {
            return;
        }
        if (lazyLoad) {
            this.loading = Img.LOADING_YET;
        }
        else {
            this.load();
        }
    }
    static get empty() {
        if (!this._empty) {
            this._empty = new class extends Img {
                constructor() { super(""); }
                draw(dst, src = { x: 0, y: 0, w: 1, h: 1 }) { }
            };
        }
        return this._empty;
    }
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
        ctx.drawImage(this.image, /*sx*/ srcRatio.x * this.image.width, /*sy*/ srcRatio.y * this.image.height, /*sw*/ srcRatio.w * this.image.width, /*sh*/ srcRatio.h * this.image.height, /*dx*/ (-dstRatio.x - dstRatio.w) * cw, /*dy*/ dstRatio.y * ch, /*dw*/ dstRatio.w * cw, /*dh*/ dstRatio.h * ch);
    }
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
        if (args.reverseHorizontal) {
            ctx.scale(-1, 1);
            dstX = -dstX - dstW;
        }
        if (args.reverseVertical) {
            ctx.scale(1, -1);
            dstY = -dstY - dstH;
        }
        ctx.drawImage(this.image, /*sx*/ srcX * this.image.width, /*sy*/ srcY * this.image.height, /*sw*/ srcW * this.image.width, /*sh*/ srcH * this.image.height, /*dx*/ dstX * cw, /*dy*/ dstY * ch, /*dw*/ dstW * cw, /*dh*/ dstH * ch);
        if (args.reverseHorizontal) {
            ctx.scale(-1, 1);
            dstX = -dstX - dstW;
        }
        if (args.reverseVertical) {
            ctx.scale(1, -1);
        }
    }
    // drawCenter(center:Point, zoomMul = 1, srcRatio = Rect.FULL){
    //     if(this.loading !== Img.LOADING_DONE){
    //         if(this.loading === Img.LOADING_YET){
    //             this.load();
    //         }
    //         return;
    //     }
    //     const ctx = Graphics.getRenderTarget().ctx;
    //     const cw = Graphics.getRenderTarget().canvas.width;
    //     const ch = Graphics.getRenderTarget().canvas.height;
    //     const wRatio_2 = this.image.width  / cw * zoomMul / 2;
    //     const hRatio_2 = this.image.height / ch * zoomMul / 2;
    //     ctx.drawImage(
    //          this.image
    //         ,/*sx*/srcRatio.x * this.image.width
    //         ,/*sy*/srcRatio.y * this.image.height
    //         ,/*sw*/srcRatio.w * this.image.width
    //         ,/*sh*/srcRatio.h * this.image.height
    //         ,/*dx*/center.x * cw - wRatio_2
    //         ,/*dy*/center.y * ch - hRatio_2
    //         ,/*dw*/center.x * cw + wRatio_2
    //         ,/*dh*/center.y * ch + hRatio_2
    //     );
    // }
    // drawKeepRatio(dstRatio:{x:number, y:number, w:number, h:number}, srcRatio = {x:0, y:0, w:1, h:1}){
    //     if(!this.loadComplete){return;}
    //     const ctx = Graphics.getRenderTarget().ctx;
    //     const w = Graphics.getRenderTarget().canvas.width;
    //     const h = Graphics.getRenderTarget().canvas.height;
    //     ctx.drawImage(
    //          this.image
    //         ,/*sx*/srcRatio.x * this.image.width
    //         ,/*sy*/srcRatio.y * this.image.height
    //         ,/*sw*/srcRatio.w * this.image.width
    //         ,/*sh*/srcRatio.h * this.image.height
    //         ,/*dx*/dstRatio.x * w
    //         ,/*dy*/dstRatio.y * h
    //         ,/*dw*/dstRatio.w * w
    //         ,/*dh*/dstRatio.h * h
    //     );
    // }
    get isLoadComplete() { return this.loading === Img.LOADING_DONE; }
    /**読み込みが完了するまでは0を返す。 */
    get pixelW() { return this.image.width; }
    /**読み込みが完了するまでは0を返す。 */
    get pixelH() { return this.image.height; }
    /**現在のRenderTargetを基準としたサイズ比を返す。 */
    get ratioW() { return this.image.width / Graphics.getRenderTarget().pixelW; }
    /**現在のRenderTargetを基準としたサイズ比を返す。 */
    get ratioH() { return this.image.height / Graphics.getRenderTarget().pixelH; }
    load() {
        this.loading = Img.LOADING_NOW;
        this.image.onload = () => {
            this.loading = Img.LOADING_DONE;
        };
        this.image.src = this.src;
    }
}
Img.LOADING_YET = 0;
Img.LOADING_NOW = 1;
Img.LOADING_DONE = 2;
export class Graphics {
    constructor() { }
    static get context() { return this.texture.ctx; }
    static getRenderTarget() { return this.texture; }
    static setRenderTarget(texture) { this.texture = texture; }
    static set lineWidth(pixelWidth) { this.texture.ctx.lineWidth = pixelWidth; }
    static setLineWidth(pixelWidth, run) {
        const ctx = this.texture.ctx;
        const bak = ctx.lineWidth;
        ctx.lineWidth = pixelWidth;
        run();
        ctx.lineWidth = bak;
    }
    static clear(bounds) {
        this.texture.ctx.clearRect(bounds.x * this.texture.pixelW, bounds.y * this.texture.pixelH, bounds.w * this.texture.pixelW, bounds.h * this.texture.pixelH);
    }
    static fillRect(bounds, color) {
        this.texture.ctx.fillStyle = toHTMLColorString(color);
        this.texture.ctx.fillRect(bounds.x * this.texture.pixelW, bounds.y * this.texture.pixelH, bounds.w * this.texture.pixelW, bounds.h * this.texture.pixelH);
    }
    static drawRect(bounds, color) {
        this.texture.ctx.strokeStyle = toHTMLColorString(color);
        this.texture.ctx.strokeRect(bounds.x * this.texture.pixelW, bounds.y * this.texture.pixelH, bounds.w * this.texture.pixelW, bounds.h * this.texture.pixelH);
    }
    static line(p1, p2, color) {
        const ctx = this.texture.ctx;
        const w = this.texture.pixelW;
        const h = this.texture.pixelH;
        ctx.strokeStyle = toHTMLColorString(color);
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.closePath();
        ctx.stroke();
    }
    static lines(points, color) {
        if (points.length === 0) {
            return;
        }
        const ctx = this.texture.ctx;
        const w = this.texture.pixelW;
        const h = this.texture.pixelH;
        ctx.strokeStyle = toHTMLColorString(color);
        ctx.beginPath();
        ctx.moveTo(points[0].x * w, points[0].y * h);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x * w, points[i].y * h);
        }
        ctx.closePath();
        ctx.stroke();
    }
    /**rはtextureのwを基準にする。 */
    static drawOval(ratioCenter, ratioR, color) {
        const ctx = this.texture.ctx;
        ctx.beginPath();
        ctx.arc(ratioCenter.x * this.texture.pixelW, ratioCenter.y * this.texture.pixelH, ratioR * this.texture.pixelW, 0, Math.PI * 2);
        ctx.closePath();
        ctx.strokeStyle = toHTMLColorString(color);
        ctx.stroke();
    }
    /**rはtextureのwを基準にする。 */
    static fillOval(ratioCenter, ratioR, color) {
        const ctx = this.texture.ctx;
        ctx.beginPath();
        ctx.arc(ratioCenter.x * this.texture.pixelW, ratioCenter.y * this.texture.pixelH, ratioR * this.texture.pixelW, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = toHTMLColorString(color);
        ctx.fill();
    }
    static fillPolygon(points, color) {
        if (points.length === 0) {
            return;
        }
        const ctx = this.texture.ctx;
        const w = this.texture.pixelW;
        const h = this.texture.pixelH;
        ctx.fillStyle = toHTMLColorString(color);
        ctx.beginPath();
        ctx.moveTo(points[0].x * w, points[0].y * h);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x * w, points[i].y * h);
        }
        ctx.closePath();
        ctx.fill();
    }
    static clip(bounds, run) {
        const ctx = this.texture.ctx;
        ctx.save();
        ctx.beginPath();
        if (bounds.w) {
            const rect = bounds;
            ctx.rect(rect.x * Graphics.pixelW, rect.y * Graphics.pixelH, rect.w * Graphics.pixelW, rect.h * Graphics.pixelH);
        }
        else if (bounds.arc) {
            const arc = bounds;
            ctx.arc(arc.cx, arc.cy, arc.r, arc.startRad, arc.endRad);
        }
        else { //polygon
            const polygon = bounds;
            if (polygon.length > 0) {
                ctx.moveTo(polygon[0].x, polygon[0].y);
                for (let i = 0; i < polygon.length; i++) {
                    ctx.lineTo(polygon[i].x, polygon[i].y);
                }
            }
        }
        ctx.closePath();
        ctx.clip();
        run();
        ctx.restore();
    }
    static rotate(rad, centerRatio, run) {
        const ctx = this.texture.ctx;
        const pw = centerRatio.x * this.pixelW;
        const ph = centerRatio.y * this.pixelH;
        ctx.beginPath();
        ctx.translate(pw, ph);
        ctx.rotate(rad);
        ctx.translate(-pw, -ph);
        ctx.closePath();
        run();
        ctx.beginPath();
        ctx.translate(pw, ph);
        ctx.rotate(-rad);
        ctx.translate(-pw, -ph);
        ctx.closePath();
    }
    /**現在の画面からTextureを生成. */
    static createTexture(ratio) {
        const imageData = this.texture.ctx.getImageData(ratio.x * this.pixelW, ratio.y * this.pixelH, ratio.w * this.pixelW, ratio.h * this.pixelH);
        return new Texture({ imageData: imageData });
    }
    static setAlpha(alpha, run) {
        const ctx = this.texture.ctx;
        const bak = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        run();
        ctx.globalAlpha = bak;
    }
    static get pixelW() { return this.texture.pixelW; }
    static get pixelH() { return this.texture.pixelH; }
    /**1/canvas.width */
    static get dotW() { return this.texture.dotW; }
    /**1/canvas.height */
    static get dotH() { return this.texture.dotH; }
}
const toHTMLColorString = (color) => {
    const r = (color.r * 255) | 0;
    const g = (color.g * 255) | 0;
    const b = (color.b * 255) | 0;
    const a = color.a;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};
export class Font {
    constructor(size, weight = Font.NORMAL, name = Font.MONOSPACE) {
        this.size = size;
        this.weight = weight;
        this.name = name;
        size = size | 0;
        const htmlString = Font.createHTMLString(size, weight, name);
        this.toString = () => htmlString;
    }
    static get def() {
        return this.DEF ? this.DEF : (this.DEF = new Font(35));
    }
    static createHTMLString(size, weight, name) {
        //一度代入することにより、HTML側の表現を得る。
        Graphics.getRenderTarget().ctx.font = `${weight} ${size}px ${name}`;
        return Graphics.getRenderTarget().ctx.font;
    }
    draw(_str, point, color, base = Font.UPPER_LEFT) {
        const ctx = Graphics.getRenderTarget().ctx;
        ctx.fillStyle = toHTMLColorString(color);
        switch (base) {
            case Font.UPPER_LEFT:
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                break;
            case Font.TOP:
                ctx.textBaseline = "top";
                ctx.textAlign = "center";
                break;
            case Font.UPPER_RIGHT:
                ctx.textBaseline = "top";
                ctx.textAlign = "right";
                break;
            case Font.LEFT:
                ctx.textBaseline = "middle";
                ctx.textAlign = "left";
                break;
            case Font.CENTER:
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                break;
            case Font.RIGHT:
                ctx.textBaseline = "middle";
                ctx.textAlign = "right";
                break;
            case Font.LOWER_LEFT:
                ctx.textBaseline = "bottom";
                ctx.textAlign = "left";
                break;
            case Font.BOTTOM:
                ctx.textBaseline = "bottom";
                ctx.textAlign = "center";
                break;
            case Font.LOWER_RIGHT:
                ctx.textBaseline = "bottom";
                ctx.textAlign = "right";
                break;
        }
        if (ctx.font !== this.toString()) {
            ctx.font = this.toString();
        }
        ctx.fillText(_str, point.x * Graphics.pixelW, point.y * Graphics.pixelH);
    }
    // /**現在のRenderTargetのサイズを基準にしたもの。 */
    get ratioH() { return this.size / Graphics.pixelH; }
    measurePixelW(s) {
        if (Graphics.getRenderTarget().ctx.font !== this.toString()) {
            Graphics.getRenderTarget().ctx.font = this.toString();
        }
        return Graphics.getRenderTarget().ctx.measureText(s).width;
    }
    // /**現在のRenderTargetのサイズを基準にしたもの。 */
    measureRatioW(s) {
        return this.measurePixelW(s) / Graphics.pixelW;
    }
    split(str, ratioW, lineLim = 10) {
        const origin = str;
        let res = [];
        for (let line = 0; line < lineLim; line++) {
            if (this.measureRatioW(str) <= ratioW) {
                res.push(str);
                return res;
            }
            for (let i = str.length; i > 0; i--) {
                const sub = str.substring(0, i);
                if (this.measureRatioW(sub) <= ratioW) {
                    res.push(sub);
                    str = str.substring(i, str.length);
                    break;
                }
            }
        }
        res.push(str);
        return res;
    }
}
Font.MONOSPACE = "monospace";
Font.UPPER_LEFT = "upperLeft";
Font.TOP = "top";
Font.UPPER_RIGHT = "upperRight";
Font.LEFT = "left";
Font.CENTER = "center";
Font.RIGHT = "right";
Font.LOWER_LEFT = "lowerLeft";
Font.BOTTOM = "bottom";
Font.LOWER_RIGHT = "lowerRight";
Font.NORMAL = "normal";
Font.BOLD = "bold";
Font.ITALIC = "italic";
