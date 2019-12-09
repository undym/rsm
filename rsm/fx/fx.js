import { Rect, Color, Point } from "../undym/type.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { Img } from "../graphics/texture.js";
import { randomFloat } from "../undym/random.js";
export class FX {
    /**countは0スタート。 */
    static add(effect) {
        let e = new Elm(effect);
        this.elms.push(e);
    }
    static draw() {
        for (let i = 0; i < this.elms.length; i++) {
            let e = this.elms[i];
            if (!e.exists) {
                this.elms.splice(i, 1);
                i--;
                continue;
            }
            e.draw();
        }
    }
}
FX.elms = [];
class Elm {
    constructor(effect) {
        this.count = 0;
        this.exists = true;
        this.effect = effect;
    }
    draw() {
        this.exists = this.effect(this.count);
        this.count++;
    }
}
export class FXTest {
    static get attacker() { return this._attacker !== undefined ? this._attacker : (this._attacker = new Point(0.3, 0.3)); }
    ;
    static get target() { return this._target !== undefined ? this._target : (this._target = new Point(0.6, 0.6)); }
    ;
    static add(name, run) {
        this.effects.push({ name: name, run: run });
    }
    static values() {
        return this.effects;
    }
}
// private static effects:[string,()=>void][] = [];
FXTest.effects = [];
export const FX_Advance = (bounds) => {
    FX.add((count) => {
        const over = 3;
        let w = bounds.w * count / over;
        let ph = 8 / Graphics.pixelH;
        let h = ph * count / over;
        let bh = (bounds.h - h) * 0.75;
        let y = bounds.y + bh * (count - 1) / (over - 1);
        Graphics.fillRect(new Rect(bounds.cx - w / 2, y, w, h), Color.GRAY);
        return count < over;
    });
};
FXTest.add(FX_Advance.name, () => FX_Advance(Rect.FULL));
export const FX_Return = (bounds) => {
    FX.add((count) => {
        const over = 3;
        let w = bounds.w - bounds.w * count / over;
        let ph = 8 / Graphics.pixelH;
        let h = ph - ph * count / over;
        let bh = (bounds.h - h) * 0.75;
        let y = bounds.y + bh - bh * count / (over - 1);
        Graphics.fillRect(new Rect(bounds.cx - w / 2, y, w, h), Color.GRAY);
        return count < over;
    });
};
FXTest.add(FX_Return.name, () => FX_Return(Rect.FULL));
export const FX_ShakeStr = (font, str, center, color) => {
    let strings = [];
    let measures = [];
    for (let i = 0; i < str.length; i++) {
        let s = str.substring(i, i + 1);
        strings.push(s);
        measures.push(font.measureRatioW(s));
    }
    const x = center.x - font.measureRatioW(str) / 2;
    let y = center.y - font.ratioH / 2;
    FX.add((count) => {
        const over = 30;
        let x2 = x;
        let y2 = y;
        let a = count < over / 2 ? 1 : 1 - (count - over / 2) / (over / 2);
        let col = new Color(color.r, color.g, color.b, a);
        for (let i = 0; i < strings.length; i++) {
            let shakeX = (1 / Graphics.pixelW) / 2 * (Math.random() * 2 - 1) / (count / over);
            let shakeY = (1 / Graphics.pixelH) / 2 * (Math.random() * 2 - 1) / (count / over);
            let x3 = x2 + shakeX;
            let y3 = y2 + shakeY;
            font.draw(strings[i], new Point(x3, y3), col);
            x2 += measures[i];
        }
        y -= (1 / Graphics.pixelH) / 2;
        return count < over;
    });
};
FXTest.add(FX_ShakeStr.name, () => FX_ShakeStr(new Font(30, Font.BOLD), "1234", FXTest.target, Color.RED));
export const FX_Str = (font, str, center, color) => {
    let strings = [];
    let measures = [];
    for (let i = 0; i < str.length; i++) {
        let s = str.substring(i, i + 1);
        strings.push(s);
        measures.push(font.measureRatioW(s));
    }
    const x = center.x - font.measureRatioW(str) / 2;
    let y = center.y - font.ratioH / 2;
    FX.add((count) => {
        const over = 30;
        let x2 = x;
        let y2 = y;
        let a = count < over / 2 ? 1 : 1 - (count - over / 2) / (over / 2);
        let col = new Color(color.r, color.g, color.b, a);
        for (let i = 0; i < strings.length; i++) {
            font.draw(strings[i], new Point(x2, y2), col);
            x2 += measures[i];
        }
        y -= (1 / Graphics.pixelH) / 2;
        return count < over;
    });
};
FXTest.add(FX_Str.name, () => FX_Str(new Font(30, Font.BOLD), "1234", FXTest.target, Color.GREEN));
export const FX_RotateStr = (font, str, center, color) => {
    let strings = [];
    let measures = [];
    for (let i = 0; i < str.length; i++) {
        let s = str.substring(i, i + 1);
        strings.push(s);
        measures.push(font.measureRatioW(s));
    }
    const x = center.x - font.measureRatioW(str) / 2;
    let y = center.y - font.ratioH / 2;
    const PI2 = Math.PI * 2;
    FX.add((count) => {
        const over = 30;
        const rotateOver = 8;
        let x2 = x;
        let y2 = y;
        let a = count < over / 2 ? 1 : 1 - (count - over / 2) / (over / 2);
        let col = new Color(color.r, color.g, color.b, a);
        for (let i = 0; i < strings.length; i++) {
            let rad = -Math.PI - PI2 * (count - i) / rotateOver;
            if (rad < -PI2) {
                rad = 0;
            }
            Graphics.rotate(/*rad*/ rad, /*center*/ new Point(x2, y2), () => {
                font.draw(strings[i], new Point(x2 - measures[i] / 2, y2 - font.ratioH / 2), col);
            });
            x2 += measures[i];
        }
        y -= (1 / Graphics.pixelH) / 2;
        return count < over;
    });
};
FXTest.add(FX_RotateStr.name, () => FX_RotateStr(new Font(30, Font.BOLD), "12345", FXTest.target, Color.GREEN));
export const FX_Shake = (dstRatio, draw) => {
    FX.add(count => {
        const over = 15;
        const shakeRange = 0.015;
        const shake = () => {
            let v = shakeRange * (over - count) / over;
            if (Math.random() < 0.5) {
                return v;
            }
            else {
                return -v;
            }
        };
        const r = new Rect(dstRatio.x + shake(), dstRatio.y + shake(), dstRatio.w, dstRatio.h);
        draw(r);
        return count < over;
    });
};
FXTest.add(FX_Shake.name, () => {
    const r = new Rect(0, 0, 0.5, 0.5);
    const tex = Graphics.createTexture(r);
    FX_Shake(r, bounds => tex.draw(bounds));
});
export const FX_格闘 = (center) => {
    let particles = [];
    for (let i = 0; i < 40; i++) {
        const pow = 1 + Math.random() * 20;
        const rad = Math.PI * 2 * Math.random();
        particles.push({
            x: center.x,
            y: center.y,
            vx: Math.cos(rad) * pow * Graphics.dotW,
            vy: Math.sin(rad) * pow * Graphics.dotH,
            lifeTime: 3 + Math.random() * 15,
        });
    }
    FX.add((count) => {
        let exists = false;
        for (const p of particles) {
            if (p.lifeTime-- > 0) {
                exists = true;
                const size = (p.lifeTime * 0.7 + 1) / Graphics.pixelW;
                Graphics.fillOval(p, size, Color.RED);
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.85;
                p.vy *= 0.85;
            }
        }
        return exists;
    });
};
FXTest.add(FX_格闘.name, () => FX_格闘(FXTest.target));
export const FX_魔法 = (center) => {
    let particles = [];
    const iLoop = 5;
    const i2Loop = 10;
    for (let i = 0; i < iLoop; i++) {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        for (let i2 = 0; i2 < i2Loop; i2++) {
            particles.push({
                r: 4 + i2 * 10,
                rad: Math.PI * 2 * i / iLoop,
                ordinal: i2,
                color: new Color(r, g, b, 0.7 + 0.3 * i2 / i2Loop),
            });
        }
    }
    FX.add((count) => {
        const t = count % 2;
        let exists = false;
        for (const p of particles) {
            if (p.r > 1 && p.ordinal % 2 === t) {
                exists = true;
                const size = (p.r * 0.35 + 1) / Graphics.pixelW;
                const point = {
                    x: center.x + Math.cos(p.rad) * p.r * Graphics.dotW,
                    y: center.y + Math.sin(p.rad) * p.r * Graphics.dotH,
                };
                Graphics.fillOval(point, size, p.color);
                p.r *= 0.75;
                p.rad += 0.05 + (i2Loop - p.ordinal) * 0.18;
            }
        }
        return exists;
    });
};
FXTest.add(FX_魔法.name, () => FX_魔法(FXTest.target));
export const FX_神格 = (center) => {
    FX.add(count => {
        const over = 20;
        for (let i = 0; i < 3; i++) {
            Graphics.setLineWidth(12, () => {
                Graphics.rotate(Math.PI * 2 * 8 / 360, center, () => {
                    const x = center.x + Math.random() * Graphics.dotW * 6;
                    const y = center.y + Math.random() * Graphics.dotH * 6;
                    const color = new Color(0.5 + Math.random(), 0.5 + Math.random(), 0.5 + Math.random());
                    const size = 70;
                    const w = Graphics.dotW * size;
                    const h = Graphics.dotH * size * 1.5;
                    //x
                    {
                        const p1 = new Point(x - w / 2, y);
                        const p2 = new Point(x + w / 2, y);
                        Graphics.line(p1, p2, color);
                    }
                    //y
                    {
                        const p1 = new Point(x, y - h / 3);
                        const p2 = new Point(x, y + h * 2 / 3);
                        Graphics.line(p1, p2, color);
                    }
                });
            });
        }
        return count < over;
    });
};
FXTest.add(FX_神格.name, () => FX_神格(FXTest.target));
export const FX_暗黒 = (center) => {
    const addParticle = (point, vec, size, color) => {
        const over = 12;
        const rad = Math.PI * 2 * Math.random();
        const v = vec;
        let vx = Math.cos(rad) * v * Graphics.dotW;
        let vy = Math.sin(rad) * v * Graphics.dotH;
        FX.add(count => {
            const r = size * (1 - count / over);
            // Graphics.fillOval(point, r, color);
            Graphics.fillRect(new Rect(point.x - r / 2, point.y - r / 2, r, r), color);
            point.x += vx;
            point.y += vy;
            vx *= 0.85;
            vy *= 0.85;
            return count < over;
        });
    };
    FX.add(count => {
        const over = 4;
        const start = new Point(center.x + 0.03, center.y - 0.07);
        const end = new Point(center.x - 0.03, center.y + 0.07);
        for (let i2 = 0; i2 < 2; i2++) {
            const count2 = count + i2 * 0.5;
            const x = (start.x * (over - count2) + end.x * count2) / over;
            const y = (start.y * (over - count2) + end.y * count2) / over;
            for (let i = 0; i < 6; i++) {
                const vec = 1 + Math.random() * 12 * (1 - count / over);
                addParticle({ x: x, y: y }, vec, /*size*/ 0.01 + 0.01 * Math.random() * (1 - count / over), Color.RED);
            }
            for (let i = 0; i < 6; i++) {
                const vec = 1 + Math.random() * 12 * (1 - count / over);
                const c = 0.1 + Math.random() * 0.2;
                addParticle({ x: x, y: y }, vec, /*size*/ 0.01 + 0.01 * Math.random() * (1 - count / over), new Color(c + Math.random() * 0.4, c, c));
            }
        }
        return count < over;
    });
};
FXTest.add(FX_暗黒.name, () => FX_暗黒(FXTest.target));
export const FX_鎖術 = (attacker, target) => {
    FX.add((count) => {
        const over = 20;
        const color = { r: 0, g: 0, b: 0, a: 1 };
        const rndColor = () => {
            color.g = Math.random();
            return color;
        };
        if (count % 2) { //line: attacker to target
            const points = [];
            const loop = 20;
            for (let i = 1; i < loop - 1; i++) {
                let x = (attacker.x * (loop - i) + target.x * i) / loop;
                let y = (attacker.y * (loop - i) + target.y * i) / loop;
                const rad = i * 0.6 + count * 1.2;
                const r = 0.05;
                x = x + Math.sin(rad ^ Number.MAX_SAFE_INTEGER * 1.0) * r;
                y = y + Math.sin(rad) * r;
                points.push({ x: x, y: y });
            }
            points.unshift(attacker);
            points.push(target);
            for (let i3 = 0; i3 < points.length - 1; i3++) {
                Graphics.setLineWidth(1 + (points.length - i3) / 2, () => {
                    Graphics.line(points[i3], points[i3 + 1], rndColor());
                });
            }
        }
        else { //line: target
            const loop = 26;
            const points = [];
            for (let i = 0; i < loop; i++) {
                const rad = Math.PI * 2 * i / loop * 2.5 + count * 0.6;
                const r = 20 * i / loop + 70 * Math.random();
                let x = target.x + Math.cos(rad) * r * Graphics.dotW;
                let y = target.y + Math.sin(rad) * r * Graphics.dotH;
                points.push({ x: x, y: y });
            }
            for (let i = 0; i < points.length - 1; i++) {
                Graphics.setLineWidth(1 + Math.random() * 6, () => {
                    Graphics.line(points[i], points[i + 1], rndColor());
                });
            }
        }
        return count < over;
    });
};
FXTest.add(FX_鎖術.name, () => FX_鎖術(FXTest.attacker, FXTest.target));
export const FX_過去 = (target) => {
    FX.add((count) => {
        const over = 20;
        const color = { r: 0, g: 0, b: 0, a: 1 };
        const rndColor = () => {
            color.r = color.g = color.b = Math.random();
            return color;
        };
        //line: target
        const loop = 60;
        const points = [];
        for (let i = 0; i < loop; i++) {
            const rad = Math.PI * 2 * i / loop * 2.5;
            const r = 25 * i / loop + 40 * Math.random();
            let x = target.x + Math.cos(rad) * r * Graphics.dotW;
            let y = target.y + Math.sin(rad) * r * Graphics.dotH;
            points.push({ x: x, y: y });
        }
        for (let i = 0; i < points.length - 1; i++) {
            Graphics.setLineWidth(1 + Math.random() * 6, () => {
                Graphics.line(points[i], points[i + 1], rndColor());
            });
        }
        return count < over;
    });
};
FXTest.add(FX_過去.name, () => FX_過去(FXTest.target));
export const FX_銃 = (attacker, target) => {
    let particles = [];
    for (let i = 0; i < 20; i++) {
        const vecBase = 0.08;
        let vec = Math.random() * vecBase;
        if (Math.random() < 0.1) {
            vec *= 3;
        }
        const vecRad = Math.PI * 2 * Math.random();
        const lifeTime = 2 + ((vecBase - vec) * 250) | 0;
        let points = [];
        const vertex = 3 + (Math.random() * 6) | 0;
        for (let i = 0; i < vertex; i++) {
            const rad = Math.PI * 2 * (i + 1) / vertex;
            points.push({
                x: Math.cos(rad + Math.random() * 0.01) * (lifeTime * Math.random()) * 0.001,
                y: Math.sin(rad + Math.random() * 0.01) * (lifeTime * Math.random()) * 0.001,
            });
        }
        particles.push({
            x: target.x,
            y: target.y,
            vx: Math.cos(vecRad) * vec,
            vy: Math.sin(vecRad) * vec,
            lifeTime: lifeTime,
            lifeTimeLim: lifeTime,
            points: points,
        });
    }
    FX.add((count) => {
        let exists = false;
        for (const p of particles) {
            if (p.lifeTime-- > 0) {
                exists = true;
                let points = [];
                for (let _p of p.points) {
                    points.push({
                        x: p.x + _p.x,
                        y: p.y + _p.y,
                    });
                }
                Graphics.fillPolygon(points, new Color(1, 0, 0, p.lifeTime / p.lifeTimeLim));
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.5;
                p.vy *= 0.5;
            }
        }
        return exists;
    });
    FX.add((count) => {
        const over = 10;
        const a = 1.0 - count / over;
        Graphics.setLineWidth(2, () => {
            Graphics.line(attacker, target, new Color(1, 1, 1, a));
        });
        const r = 0.07 * count / over;
        Graphics.drawOval(target, r, new Color(1, 1, 1, a));
        return count < over;
    });
};
FXTest.add(FX_銃.name, () => FX_銃(FXTest.attacker, FXTest.target));
export const FX_弓 = (attacker, target) => {
    const rnd = target.x - attacker.x;
    const x = attacker.x + rnd * Math.random();
    const center = new Point(x, 0);
    FX.add((count) => {
        const over = 20;
        const color = new Color(1, 0, 0, 1 - count / over);
        Graphics.line(attacker, center, color);
        Graphics.line(target, center, color);
        return count < over;
    });
};
FXTest.add(FX_弓.name, () => FX_弓(FXTest.attacker, FXTest.target));
export const FX_回復 = (target) => {
    const addStar = (x, y) => {
        let w = Graphics.dotW * 12;
        let h = Graphics.dotH * 12;
        FX.add(count => {
            if (count % 2) {
                return true;
            }
            let _w = w;
            let _h = h;
            let lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                Graphics.setLineWidth(lineWidth++, () => {
                    Graphics.line(new Point(x - _w, y), new Point(x + _h, y), Color.WHITE);
                    Graphics.line(new Point(x, y - _w), new Point(x, y + _h), Color.WHITE);
                });
                _w /= 2;
                _h /= 2;
            }
            w *= 0.9;
            h *= 0.9;
            return count < 10;
        });
    };
    FX.add((count) => {
        const over = 20;
        const rad = count * 0.6;
        const r = 70;
        const x = target.x + Math.cos(rad) * (1 - count / over) * Graphics.dotW * r;
        const y = target.y + Math.sin(rad) * (1 - count / over) * Graphics.dotH * r;
        addStar(x, y);
        return count < over;
    });
};
FXTest.add(FX_回復.name, () => FX_回復(FXTest.target));
export const FX_吸収 = (attacker, target) => {
    FX.add((count) => {
        const over = 20;
        const color = new Color(1, 0, 0, 0.3);
        for (let i = 0; i < 3; i++) {
            const shake = () => -0.02 + 0.04 * Math.random();
            const over2 = over - 1;
            const x = (target.x * (over2 - count) + attacker.x * count) / over2 + shake();
            const y = (target.y * (over2 - count) + attacker.y * count) / over2 + shake();
            Graphics.fillOval(new Point(x, y), 0.02, color.bright());
        }
        return count < over;
    });
};
FXTest.add(FX_吸収.name, () => FX_吸収(FXTest.attacker, FXTest.target));
export const FX_ナーガ = (attacker, target) => {
    const rnd = target.x - attacker.x;
    const x = attacker.x + rnd * Math.random();
    const center = new Point(x, 0);
    FX.add((count) => {
        const over = 20;
        const color = new Color(1, 0, 0, 1 - count / over);
        Graphics.line(attacker, center, color);
        return count < over;
    });
};
FXTest.add(FX_ナーガ.name, () => FX_ナーガ(FXTest.attacker, FXTest.target));
export const FX_LVUP = (img, bounds, transparence, reverse) => {
    const imgData = img.ctx.getImageData(0, 0, img.pixelW, img.pixelH);
    const data = imgData.data;
    class Elm {
    }
    const elms = [];
    const w = bounds.w / imgData.width;
    const h = bounds.h / imgData.height;
    const tr = transparence.r * 255;
    const tg = transparence.g * 255;
    const tb = transparence.b * 255;
    const ta = transparence.a * 255;
    for (let i = 0; i < data.length; i += 4 * 2) {
        if (data[i] !== tr
            || data[i + 1] !== tg
            || data[i + 2] !== tb
            || data[i + 3] !== ta) {
            const index = i / 4;
            const e = new Elm();
            e.x = bounds.xw - (index % imgData.width) * w;
            e.y = bounds.y + index / imgData.width * h;
            e.color = new Color(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255, data[i + 3] / 255);
            const rad = Math.atan2(e.y - bounds.cy, e.x - bounds.cx);
            e.vx = Math.cos(rad) * Graphics.dotW * 0.6;
            e.vy = Math.sin(rad) * Graphics.dotH * 0.6;
            e.lifeTime = (3 + Math.random() * 80) | 0;
            elms.push(e);
        }
    }
    const w2 = w * 2;
    const h2 = h * 2;
    FX.add(count => {
        let exists = false;
        for (const e of elms) {
            if (count >= e.lifeTime) {
                continue;
            }
            exists = true;
            Graphics.fillRect({
                x: e.x,
                y: e.y,
                w: w2,
                h: h2,
            }, Math.random() < 0.5 ? e.color : Color.WHITE);
            e.x += e.vx;
            e.y += e.vy;
        }
        return exists;
    });
};
const FX_LVUP_Test = (img, bounds, reverseHorizontal) => {
    FX.add(count => {
        img.drawEx({
            dstRatio: bounds,
            reverseHorizontal: reverseHorizontal
        });
        return count < 80;
    });
};
const testImg = new Img("img/unit/unit0.png", { transparence: Color.BLACK });
FXTest.add(FX_LVUP.name, () => {
    const r = new Rect(0.3, 0.3, 0.1, 0.1);
    FX_LVUP_Test(testImg, r, true);
    FX_LVUP(testImg, r, Color.CLEAR, true);
});
export const FX_PetDie = (center) => {
    const PI2 = Math.PI * 2;
    class Elm {
        constructor() {
            const rad = PI2 * Math.random();
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            this.x = center.x + cos * Graphics.dotW * 20 * Math.random();
            this.y = center.y + sin * Graphics.dotH * 20 * Math.random();
            this.vx = cos * Graphics.dotW * 4 * Math.random();
            this.vy = sin * Graphics.dotH * 4 * Math.random();
            if (Math.random() < 0.2) {
                this.vx *= 2;
            }
            if (Math.random() < 0.2) {
                this.vy *= 2;
            }
            this.w = Math.random() * 20 * Graphics.dotW;
            this.h = Math.random() * 20 * Graphics.dotH;
            this.lifeTime = (Math.random() * 50) | 0;
            this.lifeTimeLim = this.lifeTime;
        }
        draw() {
            this.lifeTime--;
            if (this.lifeTime <= 0) {
                return;
            }
            const col = Math.random() < 0.5 ? Color.WHITE : Color.GRAY;
            const mul = this.lifeTime / this.lifeTimeLim;
            const _w = this.w * mul;
            const _h = this.h * mul;
            Graphics.fillRect({
                x: this.x - _w / 2,
                y: this.y - _h / 2,
                w: _w,
                h: _h,
            }, col);
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.95;
            this.vy *= 0.95;
        }
    }
    const elms = [];
    for (let i = 0; i < 80; i++) {
        elms.push(new Elm());
    }
    FX.add(count => {
        let exists = false;
        for (const e of elms) {
            e.draw();
            if (e.lifeTime > 0) {
                exists = true;
            }
        }
        return exists;
    });
};
FXTest.add(FX_PetDie.name, () => FX_PetDie(FXTest.attacker));
export const FX_Poison = (center) => {
    const addBubble = (lifeTime, cx, cy, r) => {
        FX.add(count => {
            if (count % 3 === 0) {
                Graphics.fillOval(new Point(cx, cy), (1.0 - count / lifeTime) * r, new Color(0, 0.5, 0));
            }
            cy -= 0.001;
            return count < lifeTime;
        });
    };
    FX.add(count => {
        const rnd = () => -0.05 + Math.random() * 0.10;
        addBubble(
        /*lifeTime*/ 5 + Math.random() * 20, 
        /*cx*/ center.x + rnd(), 
        /*cy*/ center.y + rnd(), 
        /*r*/ 0.01 + Math.random() * 0.02);
        return count < 30;
    });
};
FXTest.add(FX_Poison.name, () => FX_Poison(FXTest.target));
export const FX_Buff = (center) => {
    const elms = [];
    for (let i = 0; i < 40; i++) {
        elms.push({
            x: center.x - 0.03 + Math.random() * 0.06,
            y: center.y + Math.random() * 0.02,
            h: 0.01 + Math.random() * 0.06,
            vy: -Math.random() * 0.003,
            lifeTime: 5 + Math.random() * 35,
        });
    }
    FX.add(count => {
        let exists = false;
        for (const e of elms) {
            if (count >= e.lifeTime) {
                continue;
            }
            exists = true;
            const h = e.h * (1.0 - count / e.lifeTime) / 2;
            Graphics.line(new Point(e.x, e.y - h), new Point(e.x, e.y + h), Math.random() < 0.3 ? Color.WHITE : Color.D_CYAN);
            e.y += e.vy;
        }
        return exists;
    });
};
FXTest.add(FX_Buff.name, () => FX_Buff(FXTest.target));
export const FX_機械 = (attacker, target) => {
    const PI2 = Math.PI * 2;
    const addBlood = (args) => {
        let points = [];
        const vertex = 3 + Math.random() * 5;
        for (let i = 0; i < vertex; i++) {
            points.push({
                x: randomFloat(-args.size, args.size),
                y: randomFloat(-args.size, args.size),
            });
        }
        FX.add(count => {
            if (Math.random() < 0.3) {
                return true;
            }
            args.x += args.vx;
            args.y += args.vy;
            args.vx *= 0.8;
            args.vy *= 0.8;
            const s2 = args.size / 2;
            // Graphics.fillRect(new Rect(args.x - s2, args.y - s2, args.size, args.size), args.color);
            const p = [];
            for (const _p of points) {
                p.push({
                    x: args.x + _p.x,
                    y: args.y + _p.y,
                });
            }
            Graphics.fillPolygon(p, args.color);
            return count < args.lifeTime;
        });
    };
    const addLazer = (sx, sy, lifeTime, color) => {
        lifeTime = lifeTime | 0;
        let beforeX = sx;
        let beforeY = sy;
        FX.add(count => {
            const x = (sx * (lifeTime - count) + target.x * count) / lifeTime;
            const y = (sy * (lifeTime - count) + target.y * count) / lifeTime;
            Graphics.setLineWidth(3, () => {
                Graphics.line(new Point(beforeX, beforeY), new Point(x, y), color);
            });
            beforeX = x;
            beforeY = y;
            if (count >= lifeTime) {
                const rad = PI2 * Math.random();
                const v = Math.random() * 0.02;
                addBlood({
                    x: x,
                    y: y,
                    size: 0.001 + Math.random() * 0.025,
                    vx: Math.cos(rad) * v,
                    vy: Math.sin(rad) * v,
                    lifeTime: 1 + Math.random() * 20,
                    color,
                });
                return false;
            }
            return true;
        });
    };
    FX.add(count => {
        const over = 12;
        const rnd = 0.01;
        const colors = [Color.CYAN, Color.YELLOW, Color.WHITE];
        for (let i = 0; i < 3; i++) {
            addLazer(attacker.x + randomFloat(-rnd, rnd), attacker.y + randomFloat(-rnd, rnd), 3 + Math.random() * 7, colors[i % colors.length]);
        }
        return count < over;
    });
};
FXTest.add(FX_機械.name, () => FX_機械(FXTest.attacker, FXTest.target));
export const FX_BOM = (center) => {
    let r = 0.01;
    let vec = 0.03;
    const color = new Color(0.5, 0, 0.5);
    const white = new Color(0.8, 0.8, 0.8);
    FX.add(count => {
        const over = 45;
        const width = Graphics.pixelW * 0.07;
        Graphics.setLineWidth(width - width * count / over, () => {
            Graphics.drawOval(center, r, Math.random() < 0.8 ? color : white);
            r += vec;
            vec *= 0.9;
        });
        return count < over;
    });
};
FXTest.add(FX_BOM.name, () => FX_BOM(FXTest.target));
const FX_NO_USED = (center) => {
    const PI2 = Math.PI * 2;
    const rnd = () => {
        const v = Graphics.dotW * 5;
        return -v + v * 2 * Math.random();
    };
    const D_YELLOW = new Color(0.5, 0.5, 0);
    const drawElm = (cx, cy) => {
        const w = Math.random() * 8 * Graphics.dotW;
        const h = Math.random() * 8 * Graphics.dotH;
        let color = Color.WHITE;
        const random = Math.random();
        if (random < 0.3) {
            color = Color.D_CYAN;
        }
        else if (random < 0.6) {
            color = D_YELLOW;
        }
        Graphics.fillRect({
            x: cx - w / 2,
            y: cy - h / 2,
            w: w,
            h: h
        }, color);
    };
    const addFX = () => {
        const loop = 18;
        for (let i = 0; i < loop; i++) {
            const rad = PI2 * i / (loop - 1);
            let x = center.x;
            let y = center.y;
            let vx = Math.cos(rad) * Graphics.dotW * 10;
            let vy = Math.sin(rad) * Graphics.dotH * 10;
            FX.add(count => {
                const over = 24;
                x += vx;
                y += vy;
                vx *= 0.9;
                vy *= 0.9;
                for (let i = 0; i < 5; i++) {
                    drawElm(x + rnd(), y + rnd());
                }
                if (count >= over) {
                    const over2 = 4;
                    const _vx = (x - center.x) / over2;
                    const _vy = (y - center.y) / over2;
                    FX.add(count2 => {
                        const v = count2 - (i % (loop / 4));
                        if (v < 0) {
                            for (let i = 0; i < 5; i++) {
                                drawElm(x + rnd(), y + rnd());
                            }
                            return true;
                        }
                        else {
                            const r = 0.01 * (1.0 - v / over2);
                            const _x = x - _vx * v;
                            const _y = y - _vy * v;
                            for (let i = 0; i < 5; i++) {
                                drawElm(_x + rnd(), _y + rnd());
                            }
                            return v < over2;
                        }
                    });
                }
                return count < over;
            });
        }
    };
    addFX();
    FX.add(count => {
        if (count === 5) {
            addFX();
        }
        if (count === 10) {
            addFX();
        }
        if (count === 15) {
            addFX();
            return false;
        }
        return true;
    });
};
FXTest.add(FX_NO_USED.name, () => FX_NO_USED(FXTest.attacker));
export const FX_NO_USED2 = (target) => {
    const PI2 = Math.PI * 2;
    const t = new Point(target.x * Graphics.pixelW, target.y * Graphics.pixelH);
    FX.add(count => {
        const over1 = 60;
        const over2 = 66;
        const ctx = Graphics.context;
        for (let i2 = 0; i2 < 2; i2++) {
            const r = Graphics.pixelW * (0.02 + 0.04 * (i2 + 1));
            ctx.beginPath();
            if (count < over1) {
                ctx.strokeStyle = Color.CYAN.toString();
            }
            else {
                ctx.strokeStyle = new Color(0, 1, 1, 1 - (over1 - count) / (over1 - over2)).toString();
            }
            // const loop = count / 2 + 2;
            const c = count < over1 ? count : over1;
            let loop = c / 2 + 2;
            for (let i = 0; i < loop; i++) {
                const rad = PI2 * i / (loop - 1);
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const rad2 = PI2 * (i + 1) / (loop - 1);
                const cos2 = Math.cos(rad2);
                const sin2 = Math.sin(rad2);
                ctx.quadraticCurveTo(t.x + cos2 * r, t.y + sin2 * r, t.x + cos * r, t.y + sin * r);
            }
            ctx.stroke();
        }
        return count < over2;
    });
};
FXTest.add(FX_NO_USED2.name, () => FX_NO_USED2(FXTest.target));
