var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Util } from "../util.js";
import { Color } from "../undym/type.js";
import { Sound } from "../sound.js";
import { cwait } from "../undym/scene.js";
import { Img } from "../graphics/texture.js";
import { Story } from "./story.js";
export var Story0;
(function (Story0) {
    Story0.runMain1 = () => __awaiter(this, void 0, void 0, function* () {
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_ranzo = new Img("img/face/p_sirakawa.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const s = new Story();
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
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第1話『父と子と母の遺志』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story0.runMain2 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const s = new Story();
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
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第2話『温もりは思い出の向こう』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story0.runMain3 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const s = new Story();
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
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第3話『最悪条件下においても』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story0.runMain4 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const s = new Story();
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
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第4話『地球に捨てられた人々』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story0.runMain5 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_1 = new Img("img/face/p_1.jpg");
        const s = new Story();
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
            [f_empty, "", "「だから、おまえには女神が憑いている」"],
        ]);
        s.end();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第5話『奇跡の子luka』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story0.runMain6 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_1 = new Img("img/face/p_1.jpg");
        const s = new Story();
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
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第6話『名も無き孤児』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story0.runMain7 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const s = new Story();
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
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第7話『招かれざる帰省者』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story0.runMain8 = () => __awaiter(this, void 0, void 0, function* () {
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_ranzo = new Img("img/face/p_sirakawa.jpg");
        const s = new Story();
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
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第8話『紡がれし時の糸』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story0.runMain9 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_1 = new Img("img/face/p_1.jpg");
        const s = new Story();
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
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set(".", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
        Util.msg.set("第9話『宇宙を跨ぐ時の河』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
})(Story0 || (Story0 = {}));
