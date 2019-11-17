var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Util } from "./util.js";
import { cwait, Scene } from "./undym/scene.js";
import { Color, Rect, Point } from "./undym/type.js";
import { Sound } from "./sound.js";
import { ILayout } from "./undym/layout.js";
import { Graphics, Img, Font } from "./graphics/graphics.js";
class S {
    constructor() {
        this.name = "";
        const mainBounds = new Rect(0, 0, 1, 0.8);
        const nameBounds = new Rect(0, mainBounds.yh, 0.25, 0.05);
        const faceBounds = new Rect(0, nameBounds.yh, nameBounds.w, 1 - nameBounds.yh);
        const msgBounds = new Rect(nameBounds.xw, nameBounds.y, 1 - nameBounds.xw, nameBounds.h + faceBounds.h);
        const msgBoundsInner = (() => {
            const marginW = msgBounds.w * 0.05;
            const marginH = msgBounds.h * 0.05;
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
export var Story;
(function (Story) {
    Story.runMain1 = () => __awaiter(this, void 0, void 0, function* () {
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_ranzo = new Img("img/face/p_sirakawa.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic0.jpg"), [
            [f_siki, "シキ", "「父さん！！父さんだな！」"],
            [f_siki, "シキ", "「どうして一号を逃がした！･･･貴重な初号体なのに･･･！」"],
            [f_ranzo, "白川乱造", "「･･･おまえはもうワシの子ではない･･･」"],
            [f_ranzo, "白川乱造", "「人が人たるべく持つ大切な物を、おまえは煩悩の霧中に見失ってしまったのだ」"],
            [f_siki, "シキ", "「くそ！･･･父さんはもう新プロジェクトの方には加わらせないよ」"],
            [f_ranzo, "白川乱造", "「新プロジェクトだと･･･？」"],
            [f_ranzo, "白川乱造", "「･･･まさか、エデンの園の発掘を再開するのか！」"],
            [f_siki, "シキ", "「そうさ･･･、これで、やっと母さんの遺志を継ぐ事ができるんだ･･･！」"],
            [f_ranzo, "白川乱造", "「ならんぞ！･･･いかに国王の命と言えど、エデンをこれ以上汚す事はならん！」"],
            [f_siki, "シキ", "「おや？国王への忠誠心を僕に誓わせたのは父さんだよ？」"],
            [f_ranzo, "白川乱造", "「･･･。国王はお変わりになられた･･･」"],
            [f_ranzo, "白川乱造", "「そして、おまえもだ。シキ」"],
            [f_ranzo, "白川乱造", "「母さんの遺志すら、今のおまえには歪み間違って映っておる」"],
            [f_siki, "シキ", "「好きに言うがいいよ。一号を逃がした罪は償ってもらうよ･･･！」"],
            [f_ranzo, "白川乱造", "「な、何をするんじゃ！わしはおまえの父じゃぞ！」"],
            [f_ranzo, "白川乱造", "「は、離せ！わしを閉じこめる気か！シキ！」"],
            [f_ranzo, "白川乱造", "「シキーッ！！！」"],
            [f_siki, "シキ", "「父さん･･･、僕は母さんの遺志を見誤っちゃいない･･･」"],
            [f_siki, "シキ", "「エデンに眠りし偉大なる力が僕を呼んでる･･･！」"],
            [f_siki, "シキ", "「母さん･･･、見てて･･･。僕はやってみせる･･･」"],
            [f_yuki, "雪", "「兄さん･･･、それでいいんだよ」"],
            [f_siki, "シキ", "「雪･･･」"],
            [f_yuki, "雪", "「兄さんは間違っちゃいない、それでいいんだ」"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第1話『父と子と母の遺志』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain2 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic1.jpg"), [
            [f_empty, "", "ぼくは、水の中で、ただ水の漂いに身を任せていた。"],
            [f_empty, "", "全身の毛が波にそって揺れ、四足も波の思うが侭。"],
            [f_empty, "", "上の方でかすかに感じる太陽の存在だけが、この静かで重い海に揺られるぼくの頼りだった。"],
            [f_empty, "", "目が醒めると、ぼくの体にはもうあまり毛がなかった。"],
            [f_empty, "", "波の音がする方に目をやり、この汚染された海に耐えられる体ではもうないのだと自分に言い聞かせた。"],
            [f_empty, "", "ふと、両手と肩に温もりを感じた。"],
            [f_empty, "", "太陽の光だ。"],
            [f_empty, "", "分厚い雲の裂け目から日の光が降ってきた。"],
            [f_empty, "", "もう水の漂いに身を任せることはできなくなったが、この温もりには近づけた....。"],
            [f_empty, "", "温もりはじょじょに温度を上げ、"],
            [f_empty, "", "....次の瞬間、全身にするどい痛みを感じた。"],
        ]);
        yield s.set(Img.empty, [
            [f_empty, "", "ぼくは気を再びうしなった"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第2話『温もりは思い出の向こう』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain3 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic2.jpg"), [
            [f_empty, "", "ルインドアース･･･"],
            [f_empty, "", "そこは、ぼくのいたアケローン地球とほぼ同じ環境状態だった。"],
            [f_empty, "", "大地と海は、汚染と荒廃の限界を辿り、"],
            [f_empty, "", "....空には重水素の雲が光を遮断していた。"],
            [f_empty, "", "光と言えど、それは生物を焼き尽くす剥き出しの光線に過ぎず、"],
            [f_empty, "", "たまに大地に降り注いでは、土と微生物を焼き尽くした。"],
            [f_empty, "", "ぼくにはもう、それらに耐えうる強靭な肉体はないのだ。"],
        ]);
        yield s.set(new Img("img/story/s_pic3.jpg"), [
            [f_pea, "ピアー", "「自殺行為か！！くそっ！」"],
            [f_pea, "ピアー", "「しっかりせーっ、おいっ！！」"],
            [f_ruin, "ルイン", "「あぁぁ....ぁぁ....」"],
            [f_pea, "ピアー", "「なんじゃこいつは....すっ裸でなんしとん！」"],
            [f_pea, "ピアー", "「....まじで自殺する気だったんか！？」"],
            [f_pea, "ピアー", "「地下路の入り口まで少しある....もう少し辛抱せーっ....！」"],
            [f_ruin, "ルイン", "「あり･･がとう･･」"],
            [f_pea, "ピアー", "「じ、自殺なんぞさせんぞ、自殺、自殺....！！」"],
            [f_empty, "", "でも、ここにはあっちになかったものがあった。"],
            [f_empty, "", "ヒトだ....。"],
            [f_empty, "", "....この星には、ヒトがいた。"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第3話『最悪条件下においても』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain4 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic4.jpg"), [
            [f_pea, "ピアー", "「よし、まだ意識はあんな」"],
            [f_pea, "ピアー", "「ほら、ここがオレんちだ」"],
            [f_empty, "", "塔の入り口から内部へ....そこからかなり降りた所に、ピアーの家はあった。"],
            [f_empty, "", "ピアーが扉を開くと、中から小さい子供達がいっせいに飛び出してきた。"],
            [f_empty, "", "「あんちゃん、これ誰！？」"],
            [f_empty, "", "「裸！！裸！！あんちゃんが裸の人連れてきた！！」"],
            [f_empty, "", "「あんちゃん、この人死んどん！？自殺！？」"],
            [f_pea, "ピアー", "「うるせえ、手伝えっ！」"],
            [f_pea, "ピアー", "「そらっ、オラのベッドだ」"],
            [f_pea, "ピアー", "「よし･･･ヒドイのは肩と腕だけだな･･･」"],
            [f_pea, "ピアー", "「眼も肺も異常なさそうだ･･･」"],
            [f_ruin, "ルイン", "「僕は･･･」"],
            [f_pea, "ピアー", "「良くなるまで大人しくしてな、動くと自殺行為じゃ」"],
            [f_ruin, "ルイン", "「･･･」"],
        ]);
        yield s.set(new Img("img/story/s_pic5.jpg"), [
            [f_empty, "", "ピアーは「塔」と呼ばれる巨大な建造物の地下に住んでいた。"],
            [f_empty, "", "太古の数々の惨劇の中で、この星から山と谷が消え、大地と海がどれほど平坦化しようとも"],
            [f_empty, "", "唯一、その「塔」だけは残りつづけ、今尚、この星でたった１つの巨大人口建造として聳え立っていた。"],
            [f_empty, "", "そして、ピアーによれば、この星で生存し続ける人類の９９％が、この塔の地下にスラムを形成し生き延びているという。"],
            [f_empty, "", "言わばこの塔は、この死の星における最後の砦なのだ。"],
            [f_empty, "", "それから１０年が過ぎた･･･。"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第4話『地球に捨てられた人々』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain5 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_1 = new Img("img/face/p_1.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic6.jpg"), [
            [f_empty, "", "惑星チュルホロ跡地にできた無重力スラム・キングスター･･･"],
            [f_empty, "", "そこには、帝国政権に刃向かう多くの反乱分子達の住家があった。"],
            [f_empty, "", "雪率いる白蛇の部隊は、キングスターの壊滅を命じられ、残留する人々を一掃していた。"],
        ]);
        yield s.set(new Img("img/story/s_pic7.jpg"), [
            [f_yuki, "雪", "「フン、てこずらせやがって･･･」"],
            [f_luka, "luka", "「助けて！」"],
            [f_yuki, "雪", "「まだ子供か･･･、こんな奴にテロを起こされてたとは」"],
            [f_luka, "luka", "「逃がしてくれるなら･･････、スカートの下･･･好きにしてもいいわ･･･」"],
            [f_yuki, "雪", "「あいにく興味なくてな」"],
            [f_luka, "luka", "（こいつだ･･･、この顔を覚えてる･･･）"],
            [f_luka, "luka", "（･･･母さんを殺した部隊長だ･･･）"],
            [f_yuki, "雪", "「なんだ？その眼はぁ･･･！」"],
            [f_empty, "", "ドン！"],
            [f_empty, "", "突然、雪の左胸から血が吹き出た。"],
            [f_empty, "", "すぐに撃たれたと分かった。"],
        ]);
        yield s.set(new Img("img/story/s_pic8.jpg"), [
            [f_empty, "", "射線を辿ると、lukaの後の壁上に一人の青年が立っていた。"],
            [f_empty, "", "雪の顔が驚き表情に変わった。"],
            [f_yuki, "雪", "「....おまえ....」"],
            [f_yuki, "雪", "「....まさか一号か！？」"],
            [f_1, "一号", "「･･･」"],
            [f_yuki, "雪", "「フハハハ、生きてたか！」"],
            [f_yuki, "雪", "「･･･丁度いい、ここで･･･」"],
            [f_empty, "", "雪は発言の途中でフラつき、膝を地面に落とした。"],
            [f_empty, "", "周りの雪の部下が急いで駆け寄るのを、雪は手で払った。"],
            [f_yuki, "雪", "「深手か･･･」"],
            [f_yuki, "雪", "「まあいい･･･」"],
            [f_yuki, "雪", "「一号･･･！会えて嬉しいぞ！ハハハハ」"],
            [f_yuki, "雪", "「フハハ、人間のフリをして生きてきたのか！？」"],
            [f_1, "一号", "「･･･」"],
            [f_yuki, "雪", "「逃げるのか？」"],
            [f_yuki, "雪", "「逃げろ逃げろ！！」"],
            [f_yuki, "雪", "「･･･ふ、また会うだろう･･･、その時がおまえの死ぬ時だ！」"],
            [f_yuki, "雪", "「フハハハハハハハ」"],
            [f_empty, "", "部下達が雪を担ぎ起こしている間に、lukaと青年はその場を去った。"],
            [f_empty, "", "lukaには、幼い頃から不思議な幸運がまとわりついていた。"],
            [f_empty, "", "両親の居ないlukaを育てたロビンは、彼女にこう言った。"],
            [f_empty, "", "「おまえの母親は幸運の女神のような女だったよ」"],
            [f_empty, "", "「どんな困難な盗みも、あいつが微笑めば成功すると信じられたんだ」"],
            [f_empty, "", "「おまえは宇宙一ラッキーな女が産んだ子だ」"],
            [f_empty, "", "「だから、おまえには女神が憑いている「"],
            [f_empty, "", ""],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第5話『奇跡の子luka』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain6 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_1 = new Img("img/face/p_1.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic6.jpg"), [
            [f_luka, "luka", "「あんたの名前･･･なんて言うの」"],
            [f_1, "一号", "「･･･一号･･･」"],
            [f_luka, "luka", "「変わった名前･･･」"],
            [f_1, "一号", "「･･･名前を付けられる前に、両親は死んだ･･･」"],
            [f_1, "一号", "「俺は、死んだ母親の体内から摘出されて、培養されたんだ」"],
            [f_luka, "luka", "「･･･ジスマがやらせたの？･･･」"],
            [f_1, "一号", "「ジスマか･･･、いや違うよ･･･」"],
            [f_1, "一号", "「もっとずっと昔だ。ジスロフが国王だった頃だ」"],
            [f_luka, "luka", "「･･･そんなに？」"],
            [f_luka, "luka", "「･･･でも、あなた私と同い年くらいに見えるわ」"],
            [f_1, "一号", "「ずっと試験管の中にいたから･･･」"],
            [f_empty, "", "かつての帝国国王ジスロフの后だった紗智が自害した後･･･"],
            [f_empty, "", "･･･紗智の遺体はチュルホロ科学班によって保管されていた。"],
            [f_empty, "", "科学班は、輪廻転生の能力を分析するため、紗智の遺体内にあった胎児を摘出した。"],
            [f_empty, "", "脳死状態にあった胎児だが、怪生物を融合させることで甦生に成功し、研究はそのまま進められていった。"],
            [f_empty, "", "長い年月の中、いつしかその実験体には自我が芽生え"],
            [f_empty, "", "･･･ある日、脱走した。"],
            [f_empty, "", "自分の生い立ちや両親の事を知り、ジスロフへの復讐を願うも、その時既にジスロフは冥界にあった。"],
            [f_empty, "", "残るシキや雪、そして現国王ジスマへの復讐だけが、今の彼を生かしていた。"],
            [f_1, "一号", "「luka･･･、エデンへ行こう」"],
            [f_luka, "luka", "「えっ？」"],
            [f_1, "一号", "「･･･俺とlukaは同じだよ」"],
            [f_1, "一号", "「俺達はあいつらを殺すまで、自分の人生を手に入れられない･･･」"],
            [f_luka, "luka", "「一号･･･」"],
            [f_1, "一号", "「luka、エデンであいつらを殺そう･･･！」"],
            [f_luka, "luka", "「･･･」"],
            [f_luka, "luka", "「･･･分かったわ、エデンへ行こう」"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第6話『名も無き孤児』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain7 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic9.jpg"), [
            [f_empty, "", "ある日、地球に一隻の船が降り立った。"],
            [f_empty, "", "宇宙からの来訪者･･･いや、帰省者だ。"],
            [f_empty, "", "ピアーの話によれば、数年に１度こうした宇宙からの帰省者が現れるのだという。"],
            [f_empty, "", "黒き星海へと出ていった者達は、限られた中での交配を繰り返し、長い星霜の末、種の限界に行き当たるのだ。"],
            [f_empty, "", "そのため、彼らは原種の遺伝子を求め、自分達が一度は捨てたこの星へと舞い戻るのである。"],
            [f_empty, "", "ピアーの弟や妹達は、空から降下してくる巨大な船を見て、兄の体にしがみ付いた。"],
            [f_empty, "", "自分達が連れて行かれるのかもしれないと脅えているのだ。"],
            [f_empty, "", "だが、彼等はこれまでの帰省者とは違っていた。"],
            [f_empty, "", "彼等は高等な文明の武器を持ち出し、地球人達を奴隷とした。"],
            [f_empty, "", "帝国軍と名乗る彼等の目的は、塔を再び機能させることだった。"],
            [f_empty, "", "塔内部に無数に蔓延る、植物と甲殻類の撤去作業に、僕等は駆り出された。"],
            [f_empty, "", "僕達を始め地球人達は、唯一与えられた休憩時間である夜間に、塔の下層部に集まり、密かに反乱の計画を練った。"],
            [f_empty, "", "帝国軍の武力に対抗するため、塔深層部に保管されていた古代地球人が残した武器の使用が検討されたが、誰もその使い道が分からなかった。"],
            [f_empty, "", "長く太陽の光と汚染された大地から逃れる事に精一杯であった地球人達にとって、戦いなどとうの昔に忘れてしまった記憶なのだ。"],
            [f_empty, "", "･･･僕にあの力があれば･･･"],
            [f_empty, "", "･･･アケローンにいた頃の力があれば･･･"],
            [f_empty, "", "背に巨大な翼を持ち、体は銃線を跳ね返す強靭な毛で覆われ、眼から熱光線を放射できたあの力･･･"],
            [f_empty, "", "だが、今は弱き地球人だった。"],
            [f_empty, "", "それでも、愛する友や地球人達を守らねばならないと、僕は思った。"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第7話『招かれざる帰省者』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain8 = () => __awaiter(this, void 0, void 0, function* () {
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_ranzo = new Img("img/face/p_sirakawa.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic10.jpg"), [
            [f_siki, "シキ", "「父さん･･･」"],
            [f_ranzo, "白川乱造", "「シキ･･･」"],
            [f_siki, "シキ", "「父さん･･･、今日やっと古文書を解読できたよ」"],
            [f_siki, "シキ", "「･･･何が書いてあったと思う？･･･」"],
            [f_siki, "シキ", "「遺跡の最奥に封印されてたあの巨大な機械は、兵器じゃない」"],
            [f_siki, "シキ", "「あれはコントローラーなんだ」"],
            [f_ranzo, "白川乱造", "「コントローラー･･･じゃと･･･？」"],
            [f_ranzo, "白川乱造", "「そうか･･･！砲塔に見えたあれは送信塔か･･･」"],
            [f_ranzo, "白川乱造", "「しかし、あれほど巨大な送信機で何を動かすんじゃ･･･」"],
            [f_ranzo, "白川乱造", "「あの送信塔の長さと、計算されたエネルギーを考えると･･･」"],
            [f_ranzo, "白川乱造", "「･･･宇宙の端へ電波でも送るつもりかっ･･･」"],
            [f_siki, "シキ", "「さすが父さん。正解だよ」"],
            [f_siki, "シキ", "「あの機械の送信先は、地球なんだ」"],
            [f_ranzo, "白川乱造", "「地球じゃと！？」"],
            [f_siki, "シキ", "「そう･･･父さんの故郷･･･、"],
            [f_siki, "シキ", "･･･１千光年紀前、父さんが捨てた星、ルインドアースだよ」"],
            [f_ranzo, "白川乱造", "「まさか･･･！」"],
            [f_siki, "シキ", "「父さんは覚えてるだろ？･･･"],
            [f_siki, "シキ", "･･･地球に聳え立つ巨大な塔･･･"],
            [f_siki, "シキ", "人知を超越したブレイン・キューブ･･･"],
            [f_siki, "シキ", "忘れるわけがない･･･"],
            [f_siki, "シキ", "･･･あの時、父さんがキューブを停止させたせいで、地球は生命の住めない星になってしまった･･･"],
            [f_siki, "シキ", "･･･父さんの間違った選択･･･！」"],
            [f_ranzo, "白川乱造", "「違う！･･･キューブを止めなければワシ達の脱出は不可能じゃった！」"],
            [f_siki, "シキ", "「キューブは人類が地球を捨てる事を許さなかったんだ！」"],
            [f_siki, "シキ", "「･･･キューブは言ってた！」"],
            [f_siki, "シキ", "「･･･最後まで地球を守る努力をすれば、太陽風の増幅にも耐えられると！」"],
            [f_ranzo, "白川乱造", "「ワシ達の計算では、キューブに太陽は止められんかった！」"],
            [f_siki, "シキ", "「その計算に、母さんは異論を唱えていた！」"],
            [f_ranzo, "白川乱造", "「･･･」"],
            [f_siki, "シキ", "「母さんが封印遺跡を発掘しようとしてたのは、御祖父さんの遺産を発掘するためだと･･･ずっと思ってた」"],
            [f_siki, "シキ", "「でも違ったんだ･･･」"],
            [f_siki, "シキ", "「母さんは、遺跡に地球塔を起動させる操縦機があることを知ってた･･･」"],
            [f_siki, "シキ", "「母さんは･･････」"],
            [f_siki, "シキ", "「･･･地球を再び救おうとしてたんだ！！」"],
            [f_ranzo, "白川乱造", "「今更、地球塔を起動させてどうなる･･･！」"],
            [f_siki, "シキ", "「キューブがあれば地球を再建できる！」"],
            [f_siki, "シキ", "「キューブが提唱してた理論が正しければ、太陽の制御が可能なんだ」"],
            [f_ranzo, "白川乱造", "「キューブは人知を超えた危険な機械じゃ！」"],
            [f_ranzo, "白川乱造", "「再びキューブは人類を支配下におき、宇宙中にその触手を広げるじゃろう！」"],
            [f_ranzo, "白川乱造", "「忘れたのかシキよ･･･」"],
            [f_ranzo, "白川乱造", "「･･･ワシ等全ての人類の脳にはラストボックスが埋め込まれておるんじゃぞ！」"],
            [f_ranzo, "白川乱造", "「ワシ等が築かせたこの一大帝国も、キューブにかかれば･･･！！！」"],
            [f_siki, "シキ", "「父さん･･･！この帝国を築いたのはチュルホロ人だよ」"],
            [f_ranzo, "白川乱造", "「何を言うか･･･っ、"],
            [f_ranzo, "白川乱造", "･･･遥か太古、地球から逃れたワシ等人類が、チュルホロ星の下等生物に遺伝子をかけ合わせ･･･"],
            [f_ranzo, "白川乱造", "･･････！･･･」"],
            [f_siki, "シキ", "「･･･そうだよ父さん･･･、"],
            [f_siki, "シキ", "･･･彼等チュルホロ人達は、ラストボックスを持たないんだ･･･」"],
            [f_ranzo, "白川乱造", "「･･････」"],
            [f_siki, "シキ", "「母さんはみんな知ってた･･･」"],
            [f_ranzo, "白川乱造", "「･･･なんということだ･･･」"],
            [f_siki, "シキ", "「チュルホロ人を生成した時･･･、母さんは執拗にチュルホロ生物の独自性を残そうとしてた」"],
            [f_siki, "シキ", "「･･･父さんはあの耳を見て、無駄な物だと反対していたけど･･･」"],
            [f_siki, "シキ", "「･･･あれは、ラストボックス遺伝子を持たずとも生存できる生命体にするためだったんだ･･･」"],
            [f_siki, "シキ", "「･･･いつかキューブを復活させた時、キューブに支配されぬように･･･」"],
            [f_ranzo, "白川乱造", "「･･････」"],
            [f_ranzo, "白川乱造", "「･･･ハル･･･」"],
            [f_ranzo, "白川乱造", "「･･･ハルよ･･･おまえは･･･」"],
            [f_siki, "シキ", "「キューブが復活しても、彼等ならキューブを支配できる･･･」"],
            [f_siki, "シキ", "「彼等･･･チュルホロ人なら･･･」"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第8話『紡がれし時の糸』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain9 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_1 = new Img("img/face/p_1.jpg");
        const s = new S();
        yield s.set(Img.empty, [
            [f_empty, "", "～エデン、封印遺跡内・特設科学研究所内第一実験室～"],
        ]);
        yield s.set(new Img("img/story/s_pic11.jpg"), [
            [f_yuki, "雪", "「兄さん･･･いよいよだね」"],
            [f_siki, "シキ", "「ああ･･･」"],
            [f_siki, "シキ", "「･･･古文書の通りなら、このトレーダーを起動させた瞬間、宇宙の中心を『ヒルトンの道』が貫くはずだ」"],
            [f_siki, "シキ", "「そこが･･･地球・木星・エデン・ノーザンバランドの４つの特異点を結ぶ･･･宇宙の黄金律線だ」"],
            [f_empty, "", "シキは、封印遺跡より発掘されしトレーダーを起動させた。"],
            [f_empty, "", "トレーダーは低い唸りと共に青白い光を放つと、空へと向かって一直線に太い光線を放射した。"],
            [f_empty, "", "その数秒後、バリバリという物凄い轟音が響き、そして宇宙に裂け目が生じた。"],
            [f_empty, "", "それが･･･ヒルトンの道･･･別名、アケローンの河だった。"],
            [f_siki, "シキ", "「アケローンの河･･･」"],
            [f_siki, "シキ", "「･･･内部では実世界の２００億倍の速さで時間が進む宇宙を貫く時の河･･･」"],
            [f_siki, "シキ", "「かつて、人類が作り上げた仮想宇宙は、この伝説の河の名をとってアケローン宇宙と名づけられた」"],
            [f_yuki, "雪", "「すごい･･･すごいぞ！」"],
            [f_yuki, "雪", "「すごいや、兄さん！！」"],
            [f_yuki, "雪", "「僕等の御爺様はこんな凄いものを操る機械を創れたんだね！！」"],
        ]);
        yield s.set(Img.empty, [
            [f_empty, "", "その時突然、室内に警報が鳴り響いた。"],
            [f_siki, "シキ", "「どうした」"],
            [f_yuki, "雪", "「警備兵！！」"],
            [f_empty, "", "すぐに実験室入り口の扉が開いたかと思うと、外から警備兵数名の遺体が投げ込まれた。"],
            [f_empty, "", "入り口の先を見た雪の顔がみるみるうちに怒りで真っ赤になった。"],
        ]);
        yield s.set(new Img("img/story/s_pic12.jpg"), [
            [f_yuki, "雪", "「一号ぉぉぉぉぉぉぉおおお！！！！」"],
            [f_1, "一号", "「こっちから来てやったぞ･･･、俺を待ってたんだろ･･･」"],
            [f_empty, "", "扉から現れたのは、一号とlukaの二人だった。"],
            [f_empty, "", "所内は無防備な研究員がほとんどで、武装された警備兵は数名しかいなかった。"],
            [f_empty, "", "エデン中央市から遠く離れた遺跡では警戒も薄かった。"],
            [f_empty, "", "一号とlukaは、シキ達が軍隊から離れ単独で行動するこの機を狙ったのだ。"],
            [f_empty, "", "一号はすぐに、なんの躊躇いも無く実験室内の他の研究員を全て射殺した。"],
            [f_siki, "シキ", "「一号･･･久しぶりだな･･･」"],
            [f_1, "一号", "「あんたを殺す」"],
            [f_empty, "", "一号が引きがねを引こうとした瞬間、シキは雪と共にトレーダーが放つ光の中へと身を投じた。"],
            [f_1, "一号", "「くそ！！」"],
            [f_luka, "luka", "「どこへ行ったの！？あいつら消えたわ･･･！」"],
            [f_1, "一号", "「行こう･･･」"],
            [f_luka, "luka", "「え？」"],
            [f_1, "一号", "「俺達も･･･行こう。追いかけるんだ･･･！」"],
            [f_luka, "luka", "「うん！」"],
        ]);
        yield s.set(new Img("img/story/s_pic13.jpg"), [
            [f_empty, "", "二人は勢いよくその光の中へ飛び込んだ。"],
            [f_empty, "", "二人の意識は光の流れの中に溶け、とても深い眠りの中に消えた。"],
            [f_empty, "", "彼等の肉体は、そのままワームホールの中を数百億年をかけて流れ･･･"],
            [f_empty, "", "･･･やがて･･･かつて人類が芽生えた地球という小さな惑星に辿り付いた。"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第9話『宇宙を跨ぐ時の河』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain10 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic5.jpg"), [
            [f_empty, "", "夜、僕達は塔内部にある高速エレベーターを作動させた。"],
            [f_empty, "", "･･･長い間、地球人達の間では塔上層への侵入は禁じられていた。"],
            [f_empty, "", "それは、地球人達の記憶の奥底にある、塔への畏怖の念がそうさせていたのだ。"],
            [f_empty, "", "僕達数十名の地球人を乗せた高速エレベーターは尚も加速し、たった数分で地球と宇宙の境目の距離に達した。"],
        ]);
        yield s.set(new Img("img/story/s_pic9.jpg"), [
            [f_empty, "", "塔の全長は成層圏にまで及び、その頂上に帝国軍の宇宙船は碇を下ろし停泊していた。"],
            [f_empty, "", "･･･頂上に辿り付いた僕達は、深層より運び上げた古代の武器を、宇宙船の侵入口に向けて設置した。"],
            [f_empty, "", "その武器がどのような攻撃を放つものなのかは、まだ誰も分からなかった。"],
            [f_empty, "", "試用することで、この武器の存在が帝国軍にばれてしまうことを恐れたのだ。"],
            [f_empty, "", "確かにまだ使えるはずだという祈りのような確信にすがり、僕達は武器の引きがねを引いた。"],
            [f_empty, "", "武器の後方から何か透明な力場が噴出され、あっという間に僕達を包んだ。"],
            [f_empty, "", "それに驚く間もなく、次の瞬間、武器の先端がカッと閃光を放った。"],
        ]);
        yield s.set(new Img("img/story/s_pic14.jpg"), [
            [f_pea, "ピアー", "な、なんじゃこれ･･･"],
            [f_empty, "", "その言葉を聞いて、閉じた目をゆっくりと開いた。"],
            [f_empty, "", "前方が、真っ白からじょじょに景色を取り戻すと、そこに先ほどまで存在した宇宙船の侵入口などは無く･･･"],
            [f_empty, "", "･･･遠く地球の青い成層圏がどこまでも続いているだけだった。"],
            [f_empty, "", "すぐに視界を拡張させると、四方へ飛び散った巨大な宇宙船の欠片が、物凄い速さで地球の重力に引かれ、赤く燃えながら落下してゆく様が見えた。"],
            [f_empty, "", "凄まじいほどの衝撃波と埃が飛び交っていたが、僕達を包む不思議な力場が、それらを全てはじき返していた。"],
            [f_empty, "", "僕達は、今自分たちが作動させた古代の機械をまじまじと見つめ、そして恐怖した。"],
            [f_pea, "ピアー", "「こ、こんなもんが･･･、こんな恐ろしいもんがあったんか･･･"],
            [f_empty, "", "後方のエレベーター口が開いた。"],
            [f_empty, "", "中から、数十名の帝国軍の兵士達が一斉に飛び出してきた。"],
            [f_empty, "", "塔の下層で警備についていた残りの兵士達だ。"],
            [f_empty, "", "急いで、古代武器を兵士達の方向へ向けようとしたが、力場が邪魔をして皆、素早く動けない。"],
            [f_empty, "", "兵士達がこちらに向かって発砲してきたが、それら全てを力場が受け止めてくれた。"],
            [f_pea, "ピアー", "まずいぞ、このままじゃ力場が無くなった途端、おしめえじゃん！」"],
            [f_ruin, "ルイン", "「もう一度撃とう！」"],
            [f_pea, "ピアー", "「で、でも、こっちは力場がまだ邪魔してる！」"],
            [f_pea, "ピアー", "「それに、あのエレベーターまで壊してしもたら下に戻れんかもしれん！」"],
            [f_ruin, "ルイン", "「このままでも死ぬよ･･･！それこそ自殺行為だ！」"],
            [f_pea, "ピアー", "「じ、自殺行為･･･！！」"],
            [f_pea, "ピアー", "「･･･よ、よ、よし！！撃とう！！撃てええええ！！！」"],
            [f_empty, "", "僕は古代武器の引きがねを思いきり引いた。"],
        ]);
        yield s.set(new Img("img/story/s_pic_white.png"), [
            [f_empty, "", "再び砲口が閃光に包まれたかと思うと、その白光は、直上より轟音と共に降り注いだより強く大きい光によって掻き消された。"],
            [f_ruin, "ルイン", "「うわあっ」"],
            [f_empty, "", "突然出現した第二の光は、古代武器が放ったエネルギー波と衝突し、そして力場によって周辺一帯に一度に拡散した。"],
            [f_pea, "ピアー", "「ど、どうなったんじゃ･･･さっきまで青かった大気の層が真っ白になってもうたぞ！！」"],
            [f_empty, "", "古代武器のエネルギーと真上からの光が、力場によって御互いを打消しあったせいか、帝国軍の兵士もエレベーター口も健在していた。"],
            [f_ruin, "ルイン", "「力場が無くなってる･･･どうしよう！ピアー！」"],
            [f_pea, "ピアー", "「なんだあれ･･･」"],
            [f_empty, "", "帝国軍の兵士達が急にどよめき始めた。"],
            [f_empty, "", "彼等の視線の先を辿ると、今まで確かにそこには居なかったはずの二人の人間が倒れていた。"],
            [f_ruin, "ルイン", "「人が倒れてる･･･」"],
            [f_empty, "", "兵士達の数人が慌てるようにしてそこへ駆け寄った。"],
        ]);
        yield s.set(new Img("img/story/s_pic15.jpg"), [
            [f_luka, "luka", "「来るな！！」"],
            [f_empty, "", "兵士達の動きがピタリと止まった。"],
            [f_empty, "", "その娘は、起き上がると同時に、倒れていたもう一人の体を抱えると、その者の頭に拳銃を突き付けたのだ。"],
            [f_siki, "シキ", "「ううぅ･･･」"],
            [f_luka, "luka", "「一歩でも動けば、こいつを殺す」"],
            [f_empty, "", "見るとその娘の額から血が流れていた。"],
            [f_empty, "", "娘も今の衝撃で傷を負ったのだ。"],
            [f_ruin, "ルイン", "「そこの入り口から下へ降りれる！」"],
            [f_pea, "ピアー", "「えっ！」"],
            [f_empty, "", "娘が僕達の方を目の端で見た。"],
            [f_ruin, "ルイン", "「あの子は味方だよ。帝国軍の奴等に刃向かってる･･･！」"],
            [f_ruin, "ルイン", "「もう一人が何者かは分からないけど･･･、あの子につけば兵士達の動きを止めたまま逃げられるよ」"],
            [f_empty, "", "ピアーや他の地球人達もすぐに僕の意見に賛同した。"],
            [f_empty, "", "娘と僕達は、もう一人の何者かと古代武器を抱えてエレベーターの中に走りこんだ。"],
        ]);
        yield s.set(Img.empty, [
            [f_empty, "", "エレベーター口が閉じると同時に、僕達は物凄い速さで地上へ落下した。"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第10話『重なり始める歯車』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain11 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const s = new S();
        yield s.set(Img.empty, [
            [f_empty, "", "僕達は、lukaと名乗る彼女と共に、人質を抱えたまま塔の下層域に立てこもった。"],
        ]);
        yield s.set(new Img("img/story/s_pic4.jpg"), [
            [f_luka, "luka", "「ここは･･･どこなの･･･」"],
            [f_pea, "ピアー", "「塔の下層部分じゃ」"],
            [f_pea, "ピアー", "「地上からの入り口は、ここと反対側だけ」"],
            [f_pea, "ピアー", "「その人質さんがおる限りひとまず安全じゃろ」"],
            [f_luka, "luka", "「塔･･･？･･･エデンの遺跡の近くなの？」"],
            [f_pea, "ピアー", "「エデン･･･？なんじゃそら」"],
            [f_empty, "", "手足を拘束され、地べたに転がっている人質が、苦しそうに口を開いた。"],
            [f_siki, "シキ", "「ここはエデンではない･･･」"],
            [f_siki, "シキ", "「地球だ･･･」"],
            [f_luka, "luka", "「地球！？･･･さっきまでエデンの遺跡にいたはずよ！」"],
            [f_siki, "シキ", "「おまえも見ただろう、あの光の道を･･･我々はワームホールを開いたのだ」"],
            [f_luka, "luka", "「ワームホール･･･？！･･･」"],
            [f_luka, "luka", "「一号は？･･･一号はどこへいったの！？」"],
            [f_empty, "", "シキは目線を例の古代武器の方へ向けた。"],
            [f_siki, "シキ", "「･･･地球人がぶっ放したその武器･･･、そいつのエネルギー波のせいだな･･･」"],
            [f_empty, "", "シキは古代武器の表面に記された『lucifers』という社名ロゴを見て、呆れたように小さく笑った。"],
            [f_siki, "シキ", "「ワームホールが開く出口で、高出力のエネルギーが同時に展開されれば、時空が歪みもする」"],
            [f_siki, "シキ", "「一号は我々より先に到着していたかもしれないし･･･後かもしれない･･･」"],
            [f_siki, "シキ", "「それも１時間前かもしれないし･･･５万年後かもしれない･･･」"],
            [f_luka, "luka", "「そんな！！」"],
            [f_siki, "シキ", "「おそらく･･･雪も一号と一緒か･･･」"],
            [f_empty, "", "僕達は、彼女達の会話を遠いおとぎばなしでも聞くかのように顔をぽかんとさせていた。"],
            [f_luka, "luka", "「一号を探すにも･･･この状況じゃ外へ出れないわ･･･」"],
            [f_luka, "luka", "「外の兵士･･･、帝国軍ね。あんた達帝国はこの地球で何をするつもりなの･･･」"],
            [f_siki, "シキ", "「もうじき大きな宇宙規模の戦争が始まる･･･」"],
            [f_siki, "シキ", "「それもこの世とあの世の戦いだ」"],
            [f_luka, "luka", "「あの世？」"],
            [f_siki, "シキ", "「そうだ。･･･信じられないかもしれないが、今帝国は冥界と戦争状態にある」"],
            [f_siki, "シキ", "「冥界はこの世と次元の壁を挟んだ別宇宙に存在する･･･」"],
            [f_siki, "シキ", "「次元の壁を越え、冥界に太刀打つ術がこの地球にあるのだ」"],
            [f_luka, "luka", "「そんな子供騙しみたいな話･･･」"],
            [f_siki, "シキ", "「ふ･･･信じようが信じまいが好きにするがいい」"],
            [f_luka, "luka", "「･･･馬鹿げてるわ･･･」"],
        ]);
        yield s.set(Img.empty, [
            [f_empty, "", "地上では夜が明け、朝を迎えていた。"],
            [f_empty, "", "皆疲れ果ててはいたが、半分の者が見張りに、半分の者が眠りについた。"],
            [f_empty, "", "遠いエデンという星から来たlukaは、寝床につく前に僕に言った。"],
            [f_luka, "luka", "「今日は助かったよ･･･ありがとう･･･」"],
            [f_ruin, "ルイン", "「僕達も君が現れてくれたおかげで命拾いしたんだ」"],
            [f_luka, "luka", "「あなた･･･、どこか他の人達とは違うわ･･･？･･･地球人じゃないの？」"],
            [f_ruin, "ルイン", "「うん･･･。僕も１０年前にこの星に辿り付いたんだ」"],
            [f_ruin, "ルイン", "「この話も馬鹿げてると言うかもしれないけど、仮想的に創られた宇宙があって･･･その宇宙にある地球から来たんだ･･･"],
            [f_empty, "", "lukaは少しだけ驚いて、そして微笑んだ。"],
            [f_luka, "luka", "「ホント･･･、馬鹿げてる」"],
            [f_luka, "luka", "「おやすみなさい、もう１つの地球から来たルイン」"],
            [f_ruin, "ルイン", "「･･･おやすみ。エデンの園から来たluka」"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第11話『おやすみ。エデンの園から来たluka』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain12 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_1 = new Img("img/face/p_1.jpg");
        const s = new S();
        yield s.set(Img.empty, [
            [f_empty, "", "強い光が自分を照らすのを、閉じた瞼の下からも感じ取った。"],
            [f_empty, "", "夢と現実の判別と、意識を正常に取り戻す作業に、全身への痛みが邪魔をした。"],
            [f_empty, "", "打撲や切り傷などの痛みではない･･･火傷のような痛みだ。"],
            [f_empty, "", "一号はそこで全てを思いだし、咄嗟に起きあがり辺りを見渡した。"],
        ]);
        yield s.set(new Img("img/story/s_pic17.jpg"), [
            [f_empty, "", "すぐ隣に雪が倒れていた。"],
            [f_empty, "", "同じように、雪の皮膚も火傷を負いかけていた。"],
            [f_1, "一号", "「くっ･･･なんだこの光は･･･」"],
            [f_empty, "", "異常な光線を容赦無く降り注ぐ上空の太陽を見上げようとしたが、すぐに太陽を直視する事の危険性を理解しとどまった。"],
            [f_1, "一号", "「う･･･くそ･･･空気もか･･･」"],
            [f_empty, "", "服の端を破り、即席でマスクを作った。"],
            [f_empty, "", "雪の分も作ったが、これではあまりもちそうにもなかった。"],
            [f_empty, "", "視界の端に巨大な黒い雲を発見した。"],
            [f_empty, "", "雲かとおもったそれは、驚くほど長身な大木が密集した森だった。"],
            [f_empty, "", "雪の意識がまだ覚醒していないのを確認すると、雪の体をひっぱって森の陰の中へと避難した。"],
        ]);
        yield s.set(Img.empty, [
            [f_empty, "", "化け物のように伸びた大木林の影を頼りながら、周辺一帯を走り回ったが助けになるような物は一切見えなかった。"],
        ]);
        yield s.set(new Img("img/story/s_pic16.jpg"), [
            [f_empty, "", "森の中の空気が清浄であることにすぐに気づいた。"],
            [f_empty, "", "あちこちに高く生えた大木は、てっぺんに巨大な葉を開き、自然のテントを形成していた。"],
            [f_empty, "", "そのおかげで大木林の下はあの攻撃的な光から回避できた。"],
            [f_empty, "", "それでも、木葉の間から漏れた光は、地上まで達するとすぐに草を焼き、灰を産んだ。"],
            [f_empty, "", "再びその部分が影の領域に入ると、小さな微生物が一斉にその灰にたかった。"],
            [f_empty, "", "微生物は植物が焼けたその灰から特殊な栄養分を吸収した。"],
            [f_empty, "", "灰食虫が灰を完全に分解し終わる頃、さきほどまで白く灰になっていた円形領域には、すっかり黒い土が顔を出していた。"],
            [f_empty, "", "そこに突如、見るからに気色の悪い軟体動物が、黒土の中心から土を割って頭を出現させた。"],
            [f_empty, "", "灰食虫達は一瞬で放射状に拡散したが、一部分はその軟体動物によって食い殺された。"],
            [f_empty, "", "突如、テント木達がざわめき出した。"],
            [f_empty, "", "テント木の幹に纏わりついたツルが、急速に音を立てて花を開いたのだ。"],
            [f_empty, "", "その音は人間の赤ん坊の泣き声を連想させるような高い奇妙な音だった。"],
            [f_empty, "", "その音に反応して、テント木の合間を飛び交っていた雷鳥が瞬時に身を隠した。"],
            [f_empty, "", "ツルの花は高速で向きを変え、地上の先ほどの円形領域を狙うと、銃砲の音と共に何かを発射した。"],
            [f_empty, "", "ツルの花が発砲した何かは、灰食虫を食べ終わったばかりの円形ハゲミミズの頭部を打ちぬき、そのまま貫通して円形ハゲミミズが耕したばかりの黒土の裂け目に潜りこんだ。"],
            [f_empty, "", "発砲ツルが発射したのは紛れもなく種子だった。"],
            [f_empty, "", "発砲ツルの花びら内からでた火薬の臭いが林内に立ちこめる頃、身を隠していた雷鳥が再び姿を現し、円形ハゲミミズの死体を食いに地上へと降り立った。"],
            [f_empty, "", "雷鳥はうまそうに食事をとりながら、その足で発砲ツルの種子が埋まった黒土を踏み、種子が飛び出ないよう地盤を固めた。"],
            [f_empty, "", "恐ろしく成長の早い発砲ツルの種子は、雷鳥の糞と豊な黒土からたっぷりと栄養を吸収し、急速に芽を出し、双葉を開かせ、ついにはツルを伸ばし地面を這った。"],
            [f_empty, "", "それを待っていたかのように、地中からわらわらと小さな動物達が顔を出してきた。"],
            [f_empty, "", "爆発的な成長の過程で、発砲ツルは大気中の毒素を体内に取りこみ、その成分を元にして自然の火薬をつぼみの部分に形成しているのだ。"],
            [f_empty, "", "そしてそれに伴い、毒素が取り除かれた清浄な大気を思う存分吸おうと、これまで地中で息を潜めていたこの小動物達が出現したのだった。"],
            [f_empty, "", "その一連の生態連鎖は、たった３分間の間に行われた。"],
            [f_empty, "", "それら全てを見ていた一号は、森の中の空気が安全である理由を理解した。"],
            [f_1, "一号", "「とりあえずは、なんとか持ちそうだな･･･」"],
            [f_1, "一号", "「･･･ここがエデンでない事だけは確かそうだ･･･」"],
            [f_empty, "", "自分の足元に横たわり未だ意識を失ったままの雪の顔を見た。"],
            [f_1, "一号", "「･･･今なら殺せる･･･」"],
            [f_1, "一号", "「今だ･･･今、殺すんだ！」"],
            [f_empty, "", "一号は雪を殺さなかった。"],
            [f_empty, "", "それどころか、殺人光の下からこのテント林まで運び、御節介にもマスクまでつけてやった。"],
            [f_empty, "", "ここから抜け出すには雪の力が必要である事を一号の理性は理解していた。"],
            [f_empty, "", "ここから抜け出さぬ事には、雪は殺せても、シキやジスマを殺せなくなってしまう･･･"],
            [f_empty, "", "･･･そう自分に言い聞かせた。"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第12話『我を守りたもう、大自然よ』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story.runMain13 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_1 = new Img("img/face/p_1.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_memo = new Img("img/face/p_sol.jpg");
        const s = new S();
        yield s.set(new Img("img/story/s_pic16a.jpg"), [
            [f_empty, "", "すぐに太陽が落ち夜が迫った。"],
            [f_empty, "", "完全な闇が訪れる前に、一号は力づくで雪を起した。"],
            [f_empty, "", "雪を拘束するためのツルなら、豊富に調達できていた。"],
            [f_empty, "", "雪は目を覚ますと、案の定わめきちらしたが、そのせいで大きく息をしたため、毒素も一緒に吸い込み咳き込んだ。"],
            [f_empty, "", "ここでは嫌でも助け合わないと、シキやlukaの元へ辿り着く前に死んでしまうだろう、と、一号は雪に諭した。"],
            [f_yuki, "雪", "「むなくそ悪いぜ･･･」"],
            [f_yuki, "雪", "「ゴホッ･･･ゴホッ･･･、ちっ･･･、分かったからもうこのツルを解けよ」"],
            [f_1, "一号", "「･･･いいだろう･･･だが、足だけだ。まだおまえを信じきっちゃいない･･･」"],
            [f_yuki, "雪", "「フン･･･」"],
            [f_empty, "", "一号は警戒しながらも雪の足の自由を拘束するツルをゆっくりとほどいてやった。"],
            [f_empty, "", "途端、雪は一号の懐に体当たりをかませた。"],
        ]);
        yield s.set(new Img("img/story/s_pic20.jpg"), [
            [f_empty, "", "倒れた一号の上に馬乗りになり両手首を押さえ付けた。"],
            [f_empty, "", "毒素にやられ弱り切っていた先ほどからは想像も出来ないほどの俊敏な動きだった。"],
            [f_yuki, "雪", "「あーーーまいんだよ･･･！一号ぉぉぉ」"],
            [f_yuki, "雪", "「おまえみたいな出来そこないが、人間様を操れるとでも思ったかー？フケケッ」"],
            [f_empty, "", "ガサッと周囲から物音が聞こえた。"],
            [f_yuki, "雪", "「･･･なんだ･･･！？･･･」"],
        ]);
        yield s.set(new Img("img/story/s_pic16a.jpg"), [
            [f_empty, "", "辺りはもう既にかなり暗くなっていた。"],
            [f_empty, "", "何か小さな物が動く影が見えた。"],
            [f_empty, "", "雪が闇に目を凝らしていると、闇影からゾロゾロと現れたのは十数名の白い小人達だった。"],
        ]);
        yield s.set(new Img("img/story/s_pic21.jpg"), [
            [f_empty, "", "身長は１メートル程、体は白く長い体毛に完全に覆われており、毛むくじゃらの頭部からキョロッとした真っ黒い目玉が２つこちらを見ていた。"],
            [f_yuki, "雪", "「な･･･なんだこいつら･･･」"],
            [f_empty, "", "雪が口を開くと、小人達は一斉に「喋った！喋った！喋った！喋った！喋った！喋った！喋った！」と連呼した。"],
            [f_empty, "", "一号は、放心状態の雪を体の上から払いのけ、すぐさま顔面を２、３度蹴って気を失わせた。"],
            [f_empty, "", "小人達は驚いて、全員が「ギャアギャア」と叫んだ。"],
        ]);
        yield s.set(new Img("img/story/s_pic16a.jpg"), [
            [f_empty, "", "一号と雪は、小人達に数時間連れられ、彼等の集落へ辿り着いた。"],
            [f_empty, "", "彼等は光を持っていた。"],
            [f_empty, "", "発光する木の根のような物が集落中に張り巡らされていた。"],
            [f_empty, "", "後でそれはテント木の根であることがわかった。"],
            [f_empty, "", "テント木は昼間の内、強力な光をあの巨大な屋根のような頭部で吸収し、幹を伝わせ、膨大な光エネルギーを根に蓄えているのだ。"],
            [f_1, "一号", "「女の子を見かけなかったか？俺達のような体の女の子だ」"],
            [f_memo, "小人", "「･･･女の子だ、･･･女の子だ、･･･女の子だ、･･･女の子だ」"],
            [f_1, "一号", "「真似じゃない、質問してるんだ」"],
            [f_memo, "小人", "「真似じゃない、真似じゃない、真似じゃない、真似じゃない」"],
            [f_yuki, "雪", "「ハハハハ･･･無駄だぜ、一号」"],
            [f_empty, "", "小人達の知能は低かった。"],
            [f_empty, "", "集落の文明度から見ても、IQは９０程度、人間の９歳ほどの知能しかないと見えた。"],
            [f_empty, "", "全身を覆う白毛は、真昼の攻撃光から身を守る防護服の役目を果たしているようだ。"],
            [f_empty, "", "白毛の豊富さのせいで、幼児体型のようにふっくらして見えるが、毛の下の部分は全くの人類の縮小版である。"],
            [f_empty, "", "言葉の節々に現れる古い口調から考えても、彼等が元々は人類であった可能性が高いと、雪は一号に言った。"],
            [f_1, "一号", "「退化したのか？･･･」"],
            [f_1, "一号", "「地球人はまだ健在のはずだろ？」"],
            [f_yuki, "雪", "「ああ、しかし帝国と交易があったのは地球塔だけだ」"],
            [f_yuki, "雪", "「それ以外の地域は、こちらの調べでも生命体は皆無とされてたが･･･」"],
            [f_yuki, "雪", "「未知の地域で、生命の独自の進化があったと考えられなくもない」"],
            [f_yuki, "雪", "「知能の衰えは、長い時間の中での近親交配による偏血のためだろう」"],
            [f_empty, "", "夜が深まり、小人達は一号達のいる目の前で生殖行為を始め出した。"],
            [f_empty, "", "彼等に性のダブーという習慣はないようだ。"],
            [f_empty, "", "彼等に対する興味は尽きなかったが、数億光年を移動してきた二人にそれを疲労が許さなかった。"],
            [f_empty, "", "二人は深い眠りについた。"],
        ]);
        s.end();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第13話『小人の国』", Color.GRAY);
        Sound.moji.play();
        yield cwait();
    });
})(Story || (Story = {}));
/*
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_1      = new Img("img/face/p_1.jpg");
        const f_siki  = new Img("img/face/p_siki.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_luka   = new Img("img/face/p_luka.jpg");
        const f_memo = new Img("img/face/p_sol.jpg");
 */ 
