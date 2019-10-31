var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Util } from "./util.js";
import { cwait } from "./undym/scene.js";
export class Story {
    defMsg(msgs) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const msg of msgs) {
                Util.msg.set(msg);
                yield cwait();
            }
        });
    }
}
(function (Story) {
    Story.MAIN_1 = new class extends Story {
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.defMsg([
                    ".",
                    ".",
                    ".",
                    "シキ「父さん！！父さんだな！」",
                    "シキ「どうして１号を逃がした！･･･貴重な初号体なのに･･･！」",
                    "白川乱造「･･･おまえはもうわしの子ではない･･･」",
                    "白川乱造「人が人たるべく持つ大切な物を、お前は煩悩の霧中に見失ってしまったのだ」",
                    "シキ「くそ！･･･父さんはもう新プロジェクトの方には加わらせないよ」",
                    "白川乱造「新プロジェクトだと･･･？」",
                    "白川乱造「･･･まさか、エデンの園の発掘を再開するのか！」",
                    "シキ「そうさ･･･、これで、やっと母さんの遺志を継ぐことができるんだ･･･！」",
                    "白川乱造「ならんぞ！･･･いかに国王の命と言えど、これ以上エデンを汚すことはならん！」",
                    "シキ「おや？国王への忠誠心を僕に誓わせたのは父さんだよ？」",
                    "白川乱造「･･･。国王はお変りになられた･･･」",
                    "白川乱造「そして、お前もだ。シキ」",
                    "白川乱造「母さんの遺志すら、今のおまえには歪み間違って映っておる」",
                    "シキ「好きに言うがいいよ。１号を逃がした罪は償ってもらうよ･･･！」",
                    "白川乱造「な、何をするんじゃ！わしはおまえの父じゃぞ！」",
                    "白川乱造「は、離せ！わしを閉じこめる気か！シキ！」",
                    "白川乱造「シキーッ！！！」",
                    "シキ「父さん･･･、僕は母さんの遺志を見誤っちゃいない･･･」",
                    "シキ「エデンに眠りし偉大なる力が僕を呼んでる･･･！」",
                    "シキ「母さん･･･、見てて･･･。僕はやってみせる･･･」",
                    "雪「兄さん･･･、それでいいんだよ」",
                    "シキ「雪･･･」",
                    "雪「兄さんは間違っちゃいない、それでいいんだ」",
                    ".",
                    "第１話『父と子と母の遺志』",
                    ".",
                    ".",
                    ".",
                ]);
            });
        }
    };
    Story.MAIN_2 = new class extends Story {
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.defMsg([
                    ".",
                    ".",
                    ".",
                    "ぼくは、水の中で、ただ水の漂いに身を任せていた。",
                    "全身の毛が波にそって揺れ、四足も波の思うが侭。",
                    "上の方でかすかに感じる太陽の存在だけが、この静かで重い海に揺られるぼくの頼りだった。",
                    "目が醒めると、ぼくの体にはもうあまり毛がなかった。",
                    "波の音がする方に目をやり、この汚染された海に耐えられる体ではもうないのだと自分に言い聞かせた。",
                    "ふと、両手と肩に温もりを感じた。",
                    "太陽の光だ。",
                    "分厚い雲の裂け目から日の光が降ってきた。",
                    "もう水の漂いに身を任せることはできなくなったが、この温もりには近づけた....。",
                    "温もりはじょじょに温度を上げ、",
                    "....次の瞬間、全身にするどい痛みを感じた。",
                    "ぼくは気を再び失った",
                    ".",
                    "第２話『温もりは思い出の向こう』",
                    ".",
                    ".",
                    ".",
                ]);
            });
        }
    };
})(Story || (Story = {}));
