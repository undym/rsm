import { Texture } from "./texture.js";
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
    /**rはtextureのwを基準にする。 r<0は無視する。*/
    static fillOval(ratioCenter, ratioR, color) {
        if (ratioR < 0) {
            return;
        }
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
        return Texture.createFromImageData(imageData);
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
        if (!this.DEF) {
            const size = Graphics.pixelH / 30;
            this.DEF = new Font(size);
        }
        return this.DEF;
    }
    static createHTMLString(size, weight, name) {
        //一度代入することにより、HTML側の表現を得る。
        Graphics.getRenderTarget().ctx.font = `${weight} ${size}px ${name}`;
        return Graphics.getRenderTarget().ctx.font;
    }
    draw(_str, point, color, base = "upperLeft") {
        const ctx = Graphics.getRenderTarget().ctx;
        ctx.fillStyle = toHTMLColorString(color);
        switch (base) {
            case "upperLeft":
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                break;
            case "top":
                ctx.textBaseline = "top";
                ctx.textAlign = "center";
                break;
            case "upperRight":
                ctx.textBaseline = "top";
                ctx.textAlign = "right";
                break;
            case "left":
                ctx.textBaseline = "middle";
                ctx.textAlign = "left";
                break;
            case "center":
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                break;
            case "right":
                ctx.textBaseline = "middle";
                ctx.textAlign = "right";
                break;
            case "lowerLeft":
                ctx.textBaseline = "bottom";
                ctx.textAlign = "left";
                break;
            case "bottom":
                ctx.textBaseline = "bottom";
                ctx.textAlign = "center";
                break;
            case "lowerRight":
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
Font.NORMAL = "normal";
Font.BOLD = "bold";
Font.ITALIC = "italic";
