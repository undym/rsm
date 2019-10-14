var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Scene } from "../undym/scene.js";
import { ILayout, VariableLayout, XLayout, Labels, Layout, YLayout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit } from "../unit.js";
import { Input } from "../undym/input.js";
import { Rect, Color } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail } from "./sceneutil.js";
import { Debug, Qlace } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { Job } from "../job.js";
export class JobChangeScene extends Scene {
    constructor() {
        super();
        this.list = new List();
        this.choosed = false;
        this.choosedJob = Job.しんまい;
        this.target = Unit.getFirstPlayer();
    }
    init() {
        super.clear();
        // super.add(Place.TOP, DrawPlayInfo.ins);
        // const mainBounds = new Rect(0, Place.TOP.yh, 1, 1 - Place.TOP.h - Qlace.P_BOX.h);
        // const infoBounds = new Rect(0, 0, 1, 0.7);
        // const btnBounds = new Rect(0, infoBounds.yh, 1, 1 - infoBounds.yh);
        super.add(Qlace.LIST_MAIN, new XLayout()
            .add(this.list)
            .add(new Layout()
            .add(ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(bounds, Color.D_GRAY);
            } }))
            .add((() => {
            const info = new Labels(Font.def)
                .add(() => `[${this.choosedJob}]`)
                .add(() => this.target.getJobLv(this.choosedJob) >= this.choosedJob.maxLv ? "Lv:★" : `Lv:${this.target.getJobLv(this.choosedJob)}`)
                .add(() => "成長ステータス:")
                .addArray(() => {
                let res = [];
                for (const set of this.choosedJob.growthPrms) {
                    res.push([` [${set.prm}]+${set.value}`]);
                }
                return res;
            })
                .br()
                .addln(() => this.choosedJob.info);
            return new VariableLayout(() => {
                if (this.choosed) {
                    return info;
                }
                return ILayout.empty;
            });
        })())));
        super.add(new Rect(Qlace.BTN.x, 1 - Qlace.P_BOX.h, Qlace.BTN.w, Qlace.P_BOX.h), new YLayout()
            .add((() => {
            const checkCanChange = () => {
                if (!this.choosed) {
                    return false;
                }
                if (this.target.job === this.choosedJob) {
                    return false;
                }
                return true;
            };
            const canChange = new Btn(() => "転職", () => __awaiter(this, void 0, void 0, function* () {
                if (!checkCanChange()) {
                    return;
                }
                if (!this.choosedJob) {
                    return;
                }
                this.target.job = this.choosedJob;
            }));
            const cantChange = new Btn(() => "-", () => { });
            return new VariableLayout(() => {
                if (!checkCanChange()) {
                    return cantChange;
                }
                return canChange;
            });
        })())
            .add(new Btn("<<", () => {
            Scene.load(TownScene.ins);
        })));
        super.add(Qlace.P_BOX, DrawSTBoxes.players);
        super.add(Qlace.MAIN, DrawUnitDetail.ins);
        super.add(Rect.FULL, ILayout.create({ draw: (bounds) => {
                Graphics.fillRect(this.target.bounds, new Color(0, 1, 1, 0.2));
            } }));
        super.add(Rect.FULL, ILayout.create({ ctrl: (bounds) => {
                if (!Input.click) {
                    return;
                }
                for (let p of Unit.players.filter(p => p.exists)) {
                    if (p.bounds.contains(Input.point)) {
                        this.setList(p);
                        break;
                    }
                }
            } }));
        this.setList(this.target);
    }
    setList(unit) {
        this.target = unit;
        this.choosed = false;
        this.list.clear();
        this.list.add({
            center: () => `${unit.name}`,
            groundColor: () => Color.D_GRAY,
        });
        Job.values
            .filter(job => job.canJobChange(unit) || unit.getJobLv(job) > 0 || Debug.debugMode)
            .forEach((job) => {
            let color = () => {
                if (job === unit.job) {
                    return Color.ORANGE;
                }
                if (unit.isMasteredJob(job)) {
                    return Color.YELLOW;
                }
                return Color.WHITE;
            };
            this.list.add({
                left: () => unit.isMasteredJob(job) ? "★" : `${unit.getJobLv(job)}`,
                leftColor: color,
                right: () => `${job}`,
                rightColor: color,
                groundColor: () => job === this.choosedJob ? Color.D_CYAN : Color.BLACK,
                push: (elm) => {
                    this.choosedJob = job;
                    this.choosed = true;
                },
            });
        });
    }
}
