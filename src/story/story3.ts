import { Util } from "../util.js";
import { Color } from "../undym/type.js";
import { Sound } from "../sound.js";
import { cwait } from "../undym/scene.js";
import { Img } from "../graphics/texture.js";
import { Story } from "./story.js";



export namespace Story3{
    
    export const runKabe0 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_kabe  = new Img("img/face/p_majo.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic32.jpg"),
            [
                [f_kabe,   "カベイリア","「･･････貴方達は何者です？」"],
                [f_kabe,   "カベイリア","「何故、肉体をもっているのです？」"],
                [f_kabe,   "カベイリア","「･･･死法改定によって、全ての魂人は完全霊体となったはずなのに」"],
                [f_kabe,   "カベイリア","「臥竜の妄想の中にいた？？？？」"],
                [f_kabe,   "カベイリア","「臥竜とは臥竜界王のことですか？？」"],
                [f_kabe,   "カベイリア","「そうか･･････、王朝の者たちが必死に探していたのは、貴方達だったのですね･･･」"],
                [f_kabe,   "カベイリア","「私は魔女カベイリアと言います」"],
                [f_kabe,   "カベイリア",`「私に肉体があるのも、貴方達と同じ･･･、そう･･･"生きている"から･･･`],
                [f_kabe,   "カベイリア","「貴方達は、私のような冥界との特殊な契約に囚われた者達の希望の光･･･」"],
                [f_kabe,   "カベイリア","「王朝の者達に打ち勝てるよう力を授けましょう･･･」"],
                [f_empty,  "",         "ジスロフ達は、『時のクリスタル』を手に入れた。"],
                [f_empty,  "",         "不思議な力がジスロフ達の【最大HP】を+5させた･･･！！"],
            ]
        );

        s.end();
    };
    //冥土の底でカベイリアイベントを発生させた後、ハデスの腹クリア
    export const runKabe1 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_kabe  = new Img("img/face/p_majo.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic32.jpg"),
            [
                [f_kabe,   "カベイリア","「･･････見つかってしまいましたね」"],
                [f_kabe,   "カベイリア","「ごめんなさい、貴方達をずっとつけて見守っていたのです」"],
                [f_kabe,   "カベイリア","「･･･本心から貴方達が心配だったから･･･」"],
                [f_kabe,   "カベイリア","「王朝のやり方は、常界のように甘くはありません」"],
                [f_kabe,   "カベイリア","「彼らは貴方達の魂そのものを殺すとするでしょう･･･」"],
                [f_kabe,   "カベイリア","「それは死よりも恐ろしい事･･･」"],
                [f_kabe,   "カベイリア","「貴方達の魂が死ねば、死法を歪める術も･･･転生術も･･･叶わぬだけでなく、貴方達の子孫すべてが無になるのです」"],
                [f_kabe,   "カベイリア","「余計なお節介でしょうが、もう少し貴方達をつけさせてもらいます･･･」"],
                [f_kabe,   "カベイリア","「･･･貴方達しかもう･･･冥界に残された常界人を救える者はいないのだから･･･」"],
                [f_empty,  "",         "ジスロフ達は、『精神のクリスタル』を手に入れた。"],
                [f_empty,  "",         "不思議な力がジスロフ達の【最大HP】を+10させた･･･！"],
            ]
        );

        s.end();
    };
    //ハデスの腹でカベイリアイベントを発生させた後、魂人の廃都クリア
    export const runKabe2 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_kabe  = new Img("img/face/p_majo.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic32.jpg"),
            [
                [f_kabe,   "カベイリア","「･･････小鬼･･････あんな暗殺者までが送られてくるなんて･･･」"],
                [f_kabe,   "カベイリア","「なんて恐ろしいの･･････」"],
                [f_kabe,   "カベイリア","「今貴方達がまだ生きているのは偶然ではないのよ･･･」"],
                [f_kabe,   "カベイリア","「あの小鬼という子供が、遊び心でわざと貴方達を生かしたから･･･」"],
                [f_kabe,   "カベイリア","「ああ･･････、もうだめかもしれないわ･･････」"],
                [f_kabe,   "カベイリア","「小鬼はこれまで何度も･･･死神候補にあげられた王家の血筋の者よ･･･」"],
                [f_kabe,   "カベイリア","「･･･でも、無邪気さが危険視されて、死神にはなれなかった･･･」"],
                [f_kabe,   "カベイリア","「気をつけなさい･･･」"],
                [f_kabe,   "カベイリア","「･･･もっと力を潜め･･･、なるべく長い時間みつからぬ事が重要なのですよ･･･」"],
                [f_empty,  "",         "ジスロフ達は、『破邪のクリスタル』を手に入れた。"],
                [f_empty,  "",         "不思議な力がジスロフ達の【最大HP】を+15させた･･･！"],
            ]
        );

        s.end();
    };
    //冥界王朝宮クリア
    export const runMain30 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_kabe  = new Img("img/face/p_majo.jpg");
        const f_jisrof  = new Img("img/face/p_jis.jpg");
        const f_nana  = new Img("img/face/p_nana.jpg");
        const f_syao  = new Img("img/face/p_syao.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic34.jpg"),
            [
                [f_empty,  "",         "ジスロフとナナ、そしてカベイリアはとうとう冥界王朝宮に到着した。"],
                [f_empty,  "",         "赤く巨大な門をくぐり、建物内へと侵入すると、王朝兵士達が次々とジスロフ達を襲ってきた。"],
                [f_empty,  "",         "いかに超人的な力を誇るジスロフと言えど、無尽蔵に現れる兵士達の相手は容易ではなかった。"],
                [f_empty,  "",         "ようやく中央の広間に辿り着く頃には、ジスロフは体力の大半を失い、全身が深い傷で覆われていた。"],
                [f_kabe,   "カベイリア","「お待ちなさい」"],
                [f_empty,  "",         "中央広間から抜ける扉を開けようとするジスロフを、カベイリアが止めた。"],
                [f_kabe,   "カベイリア","「貴方達はこっちです･･･」"],
                [f_empty,  "",         "そう言って、別の広間へと続く廊下を指差した。"],
                [f_jisrof, "ジスロフ",  "「違うだろ、奴の妖気はこの扉の向こうから流れてきてる･･･」"],
                [f_kabe,   "カベイリア","「ええ、確かにシャオグイはその扉の向こうで貴方達を待っています」"],
                [f_jisrof, "ジスロフ",  "「どういうことだ･･･」"],
                [f_kabe,   "カベイリア","「こちら側の廊下を進んだ先の広間に、常界に繋がる転移の炉があります」"],
                [f_kabe,   "カベイリア","「貴方達はそこから常界へ戻れます」"],
                [f_jisrof, "ジスロフ",  "「シャオグイや王朝はどうするんだ。おまえを助けろと言ったのはおまえ自身だぞ･･･」"],
                [f_kabe,   "カベイリア","「分かっています」"],
                [f_kabe,   "カベイリア","「しかし、今の貴方ではあっという間に殺されてしまうでしょう」"],
                [f_empty,  "",          "ジスロフの表情に屈辱の色が浮かんだ。"],
                [f_kabe,   "カベイリア","「貴方は常界に戻り、羅文の真の力を取り戻すのです」"],
                [f_kabe,   "カベイリア","「そして、仲間を見つけ、再びここへ戻ってきて、その時こそ冥界王朝を滅ぼしてください」"],
                [f_kabe,   "カベイリア","「今はまだ･･･、その時ではありません」"],
                [f_jisrof, "ジスロフ",  "「･････････」"],
                [f_jisrof, "ジスロフ",  "「･･･分かった」"],
                [f_empty,  "",          "ジスロフは険しい顔をして、カベイリアが指差した廊下の方へ歩き出した。"],
                [f_empty,  "",          "ふと見ると、カベイリアは扉の前にじっと立ったままだ。"],
                [f_jisrof, "ジスロフ",  "「！？･･･おまえ･･･どうする気だ･･･、俺達と一緒に戻らないのか」"],
                [f_kabe,   "カベイリア","「･･･私には転移の炉はくぐれません･･････」"],
                [f_nana,   "ナナ",      "「どうして！？」"],
                [f_empty,  "",          "ナナがカベイリアの手を握り取り離そうとしない。"],
                [f_kabe,   "カベイリア","「ナナ･･･、私の身は契約によって縛られているのです･･･」"],
                [f_nana,   "ナナ",      "「そんな･･･、じゃあどうするの！？」"],
                [f_kabe,   "カベイリア","「転移の炉をくぐろうとすれば、すぐにシャオグイが気づき追い掛けてくるでしょう」"],
                [f_kabe,   "カベイリア","「私がここでシャオグイを止めます」"],
                [f_kabe,   "カベイリア","「契約によって、私は彼等を攻撃することはできません･･･、でも時間を稼ぐことはできるでしょう」"],
                [f_jisrof, "ジスロフ",  "「分かった･･･」"],
                [f_nana,   "ナナ",      "「だめだよ！！」"],
                [f_empty,  "",          "ナナは不安そうな顔で二人に訴えた。"],
                [f_kabe,   "カベイリア","「ナナ･･･、ありがとう」"],
                [f_kabe,   "カベイリア","「でも大丈夫。これでも私は大魔法使いなんですよ･･･」"],
                [f_nana,   "ナナ",      "「でも･･･！」"],
                [f_kabe,   "カベイリア","「ナナ、よく聞いて。･･･貴方はあの方の力の源･･･」"],
                [f_kabe,   "カベイリア","「いつ何時も、あの方の側を離れてはいけません･･･」"],
                [f_nana,   "ナナ",      "「カベイリアさん･･････」"],
                [f_kabe,   "カベイリア","「転移の炉をくぐる時、『地球塔』と言う言葉を思い浮かべなさい。･･･その場所へ転移します」"],
                [f_kabe,   "カベイリア","「･･･そして、地球塔の地下に契約書が保管されています･･･」"],
                [f_kabe,   "カベイリア","「見つけたら･･･それを破り捨てて･･･」"],
                [f_empty,  "",          "ジスロフは頷いた。"],
                [f_empty,  "",          "それを確認すると、カベイリアは微笑みながら二人に手を振った。"],
                [f_empty,  "",          "ジスロフ達が転移の間に消えたその数秒後、カベイリアの後ろの扉が物凄い勢いで開いた。"],
                [f_syao,   "小鬼",      "「魔女め、転移の炉を教えたのはおまえかああああ！！！！」"],
                [f_empty,  "",          "小鬼がカベイリアを睨むと、カベイリアの両膝両手が床に落ち、強制的にこうべが垂れ、土下座の姿勢になった。"],
                [f_kabe,   "カベイリア","「･･･ぅぐ･･････ぅ･･･」"],
                [f_syao,   "小鬼",      "「奴隷の分際で！！！！」"],
                [f_syao,   "小鬼",      "「今すぐに炉を壊してしまえ！！！」"],
                [f_empty,  "",          "小鬼が転移の間へ近づこうとすると、突然、目の前に巨大な火柱が立ち上がった。"],
                [f_syao,   "小鬼",      "「おまえ･･･、俺に逆らうわけ？！」"],
                [f_empty,  "",          "小鬼は右手の掌をカベイリアに向け、気合を込めた。"],
                [f_kabe,   "カベイリア","「キャアアアアアアアアアア！！！！！」"],
                [f_empty,  "",          "カベイリアの全身を高圧の電流が襲った。"],
                [f_empty,  "",          "カベイリアはそのまま気を失ったが、火柱の勢いは弱まる気配がない。"],
                [f_syao,   "小鬼",      "「うぜぇぇーんだよ･･･！」"],
                [f_empty,  "",          "小鬼は大量に息を吸いこむと、口から紫の火を一気に吹き出した。"],
                [f_empty,  "",          "その勢いで、火柱はあっという間に消えさった。"],
                [f_empty,  "",          "小鬼が転移の間の扉を開いた時には、既にジスロフ達の姿はなかった。"],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第30話『カベイリアの願い』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
    export const runMain31 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_jisrof  = new Img("img/face/p_jis.jpg");

        const s = new Story();

        await s.set(
            Img.empty,
            [
                [f_empty,  "",          "地球塔地下２００階にて、ジスロフ達は「契約書保管室」と書かれた扉の前に立っていた。"],
                [f_jisrof, "ジスロフ",  "「ここだな･･･」"],
                [f_empty,  "",          "ジスロフが扉を開けようとするも、扉は何かがひっかかっているのか開かなかった。"],
                [f_jisrof, "ジスロフ",  "「･･････」"],
                [f_empty,  "",          "しばらく考えこむと、ジスロフは思いきり扉を破壊した。"],
            ]
        );
        await s.set(
            new Img("img/story/s_pic35.jpg"),
            [
                [f_empty,  "",          "室内は、大量の植物に覆われ、もう何年もの間、人が出入りしていない様子だった。"],
                [f_empty,  "",          "部屋の中央に机らしきものがあった。"],
                [f_empty,  "",          "そこへジスロフ達が近づいた時、ジスロフ達は気を失った･･･。"],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第31話『目的の部屋にて』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
    export const runMain32 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_kimi  = new Img("img/face/p_kimi.jpg");
        const f_sayaka  = new Img("img/face/p_sayaka.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic34.jpg"),
            [
                [f_kimi,   "キミロフ",  "「爺！！！！！！」"],
                [f_kimi,   "キミロフ",  "「爺！！！！！！呼んでるだろ、爺！！！！！」"],
                [f_sayaka, "沙耶香爺",  "「は、はい、お坊ちゃま、爺はここにございます」"],
                [f_kimi,   "キミロフ",  "「コラ爺･･･、お坊ちゃまと呼ぶなと何度言ったら分かるんだよ･･････」"],
                [f_sayaka, "沙耶香爺",  "「キャッ」"],
                [f_empty,  "",          "キミロフは手の甲で沙耶香の頬を殴った。"],
                [f_sayaka, "沙耶香爺",  "「はっ･･･も、申し訳ありません･･････殿下」"],
                [f_kimi,   "キミロフ",  "「そうだ、それでいいんだよ、バーカ」"],
                [f_empty,  "",          "キミロフは、一枚の羊皮紙を取りだし沙耶香に見せた。"],
                [f_kimi,   "キミロフ",  "「見ろ･･･、今朝の占いで出た」"],
                [f_empty,  "",          "紙には、冥土一帯の地図が描かれており、その中に２つの赤い点があった。"],
                [f_sayaka, "沙耶香爺",  "「これは･･･」"],
                [f_kimi,   "キミロフ",  "「時は満ちたり･･･」"],
                [f_kimi,   "キミロフ",  "「我がキミロフ家の御先祖様が、冥界王朝と不死の契約を結んだばっかりに、我が一族は末代に渡り王朝の奴隷と成り下がってきたが･･･」"],
                [f_kimi,   "キミロフ",  "「やっと･･･やっとだ･･･」"],
                [f_kimi,   "キミロフ",  "「我等一族を再び常の世界に連れ戻してくれる賢者を探し求め、占い続けること数千年･･･」"],
                [f_sayaka, "沙耶香爺",  "「キミロフ坊ちゃ･･･、ゴホン･･･キミロフ殿下！！爺も嬉しゅうございます」"],
                [f_kimi,   "キミロフ",  "「爺っ、すぐに仕度だ！！」"],
                [f_kimi,   "キミロフ",  "「この賢者様の位置へ向かうぞ！！！早くしろ！！！」"],
                [f_sayaka, "沙耶香爺",  "「はいっ、ただいまっ」"],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第32話『殿下現る』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };

    export const runMain33 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_kimi  = new Img("img/face/p_kimi.jpg");
        const f_sayaka  = new Img("img/face/p_sayaka.jpg");
        const f_jisrof  = new Img("img/face/p_jis.jpg");
        const f_nana  = new Img("img/face/p_nana.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic32.jpg"),
            [
                [f_empty,  "",          "ジスロフの行く手に、フードを被った男と、その従者らしき者が現れた。"],
                [f_jisrof, "ジスロフ",  "「なんだ･･･」"],
                [f_empty,  "",          "ジスロフはナナを自分の後に立たせ、万が一に備えた。"],
                [f_empty,  "",          "男はフードを取ると、片膝を地面について、こうべを垂れた。"],
                [f_jisrof, "ジスロフ",  "「？」"],
                [f_kimi,   "キミロフ",  "「賢者様･･･、貴方様の出現を御待ちしておりました」"],
                [f_jisrof, "ジスロフ",  "「賢者だと？」"],
                [f_kimi,   "キミロフ",  "「はい･･･、私めの占いによって、私達をこの冥界より連れ出してくださる賢者様が現れたと、出たのであります」"],
                [f_jisrof, "ジスロフ",  "「それが俺だとでも？」"],
                [f_kimi,   "キミロフ",  "「はい、間違いありません」"],
                [f_jisrof, "ジスロフ",  "「くだらない･･･」"],
                [f_empty,  "",          "ジスロフは男を無視して先を行こうとした。"],
                [f_kimi,   "キミロフ",  "「お、お待ち下さい！！賢者様！！！」"],
                [f_nana,   "ナナ",      "「ジスロフ、この人達困っているよ･･･」"],
                [f_empty,  "",          "ナナはジスロフの袖を掴み、引っ張った。"],
                [f_nana,   "ナナ",      "「それにこの人･･･なんだかジスロフに似てる･･･」"],
                [f_kimi,   "キミロフ",  "「あ･･･貴方は･･･」"],
                [f_empty,  "",          "ナナの顔を見たキミロフの目つきが変わった。"],
                [f_kimi,   "キミロフ",  "「私はキミロフ・スターマイン７世と申すものです･･･、失礼ですが、貴方のお名前は？」"],
                [f_nana,   "ナナ",      "「え･･･、僕はナナ･･･」"],
                [f_kimi,   "キミロフ",  "「ナナ･･･、なんと心地よい響き･･･」"],
                [f_kimi,   "キミロフ",  "「貴方のように美しい女性は見た事がありません･･･」"],
                [f_nana,   "ナナ",      "「え･･･、あの、僕は･･･」"],
                [f_kimi,   "キミロフ",  "「そうか！！！」"],
                [f_kimi,   "キミロフ",  "「貴方が賢者様なのですね･･･、そうに違いない」"],
                [f_kimi,   "キミロフ",  "「貴方を見た瞬間･･･、私めの胸の内で、何かが弾けるのが分かりました」"],
                [f_kimi,   "キミロフ",  "「どうか、私めを貴方の旅にお連れ下さい」"],
                [f_empty,  "",          "そう言うとキミロフはナナの手を取り、甲に口付けをしようとした。"],
                [f_empty,  "",          "キミロフの唇がナナの手に触れる直前に、キミロフは物凄い力で蹴られて地面に転がった。"],
                [f_sayaka, "沙耶香爺",  "「キ、キミロフ様！！！」"],
                [f_empty,  "",          "蹴ったのはむろんジスロフだった。"],
                [f_empty,  "",          "更に追い討ちをかけるべく、倒れたキミロフに近寄ろうとすると、目の前に沙耶香が立ちふさがった。"],
                [f_jisrof, "ジスロフ",  "「なんだ･･･」"],
                [f_kimi,   "キミロフ",  "「どけっ！！」"],
                [f_sayaka, "沙耶香爺",  "「キャッ」"],
                [f_empty,  "",          "起き上がったキミロフは沙耶香を突き飛ばすと、ジスロフに立ち向かった。"],
                [f_kimi,   "キミロフ",  "「何するんだよ、おまえはよ！！！」"],
                [f_jisrof, "ジスロフ",  "「それが賢者様に向かって言う言葉か？」"],
                [f_empty,  "",          "目を真っ赤にさせるキミロフに対し、ジスロフは冷ややかな目でそう言った。"],
                [f_kimi,   "キミロフ",  "「おまえのような奴が賢者なわけがないだろ！賢者様はこのナナ様なんだよ！！」"],
                [f_empty,  "",          "ジスロフがキミロフの喉を掴み上げた。"],
                [f_kimi,   "キミロフ",  "「うぐっ」"],
                [f_jisrof, "ジスロフ",  "「もう一度ナナの名前を気安く呼んでみろ、殺すぞ･･･」"],
                [f_empty,  "",          "ジスロフの目はますます氷のように冷たい視線を放った。"],
                [f_nana,   "ナナ",      "「や、やめて、ジスロフ！」"],
                [f_kimi,   "キミロフ",  "「は、離しやがれ･･･！！！」"],
                [f_sayaka, "沙耶香爺",  "「殿下！！！！」"],
                [f_empty,  "",          "沙耶香のその言葉に、キミロフとジスロフの二人が反応した。"],
                [f_sayaka, "沙耶香爺",  "「殿下、どうかおやめください･･･こんな所で死んでしまってはキミロフ家の血が絶えてしまいます･･･」"],
                [f_kimi,   "キミロフ",  "「なんだと、この俺様がこんな奴に殺されるとでもいうのか！」"],
                [f_jisrof, "ジスロフ",  "「試してみるか･･･」"],
                [f_sayaka, "沙耶香爺",  "「た、旅の賢者様もどうか御許しを･･･！！」"],
                [f_sayaka, "沙耶香爺",  "「我等は元は常界で生きる占い士の一族でした･･･」"],
                [f_sayaka, "沙耶香爺",  "「それがひょんな事から、この冥界で生きることを強いられ･･･、もとの世界に戻ることも叶わず･･･」"],
                [f_sayaka, "沙耶香爺",  "「しかし、我等一族の占いが、我等を助け出してくれる賢者様の存在を予言したのです」"],
                [f_sayaka, "沙耶香爺",  "「我等一族の占いは、百パーセント当たる占い･･･」"],
                [f_sayaka, "沙耶香爺",  "「その証拠に、我等が冥界に囚われているのも、その力を冥界が利用しようとするがため･･･」"],
                [f_sayaka, "沙耶香爺",  "「この力が賢者様の役に立つ事もありましょう」"],
                [f_sayaka, "沙耶香爺",  "「どうか、我等を旅にお供にお加え下さい･･･」"],
                [f_jisrof, "ジスロフ",  "「嫌だ」"],
                [f_empty,  "",          "ジスロフは冷酷な表情で言った。"],
                [f_nana,   "ナナ",      "「ジスロフ･･･、可哀そうだよ」"],
                [f_empty,  "",          "ナナの言葉がジスロフを葛藤させた。"],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第33話『賢者の導き』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
    
    export const runMain34 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_kimi  = new Img("img/face/p_kimi.jpg");
        const f_sayaka  = new Img("img/face/p_sayaka.jpg");
        const f_jisrof  = new Img("img/face/p_jis.jpg");
        const f_nana  = new Img("img/face/p_nana.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic34.jpg"),
            [
                [f_jisrof, "ジスロフ",  "「しかしどういう事なんだ･･･俺達は一度は元の世界に戻ったはずなのに･･･」"],
                [f_nana,   "ナナ",      "「また冥界に舞い戻ってきちゃったね･･･」"],
                [f_nana,   "ナナ",      "「･･･それにカベイリアさんの姿もない･･･もしかしたらシャオグイに･･･」"],
                [f_kimi,   "キミロフ",  "「カベイリア？･･･はて、どこかで聞いたような･･･」"],
                [f_kimi,   "キミロフ",  "「ともかく、ナナ達が元の世界に戻る方法はある」"],
                [f_nana,   "ナナ",      "「本当？」"],
                [f_kimi,   "キミロフ",  "「ああ･･･、転移の炉をくぐればいい」"],
                [f_nana,   "ナナ",      "「･･･転移の炉･･･やっぱり･･･」"],
                [f_kimi,   "キミロフ",  "「転移の炉を知っているのか？なら話が早い」"],
                [f_kimi,   "キミロフ",  "「あの炉を使って、地球塔へ行き、その深部にある契約書保管室で契約書を破ってくれさえすれば･･･」"],
                [f_kimi,   "キミロフ",  "「･･･我等は冥界より解放され、常界に戻る事ができる」"],
                [f_nana,   "ナナ",      "「僕達は一度、転移の炉をくぐったんだ」"],
                [f_nana,   "ナナ",      "「それなのに、また戻ってきちゃったんだ」"],
                [f_kimi,   "キミロフ",  "「はて･･･、おかしいな･･･」"],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第34話『契約の謎』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
    //地下200階の門クリア
    //このストーリー後、塔地下へのボタンが出現、押すとイベント、ルイン達とジスロフ達合流
    export const runMain35 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_kimi  = new Img("img/face/p_kimi.jpg");
        const f_sayaka  = new Img("img/face/p_sayaka.jpg");
        const f_jisrof  = new Img("img/face/p_jis.jpg");
        const f_nana  = new Img("img/face/p_nana.jpg");
        const f_kabe2  = new Img("img/face/p_majo2.jpg");//帽子無し

        const s = new Story();

        await s.set(
            Img.empty,
            [
                [f_empty,  "",          "地球塔地下２００階にて、ジスロフ達は再び「契約書保管室」と書かれた扉の前に立っていた。"],
                [f_jisrof, "ジスロフ",  "「ここだ･･･また来たな･･･」"],
                [f_empty,  "",          "ジスロフが扉を開こうとすると、以前とは違いなんのひっかかりも無く扉はすっと開いた。"],
            ]
        );
        await s.set(
            new Img("img/story/s_pic36.jpg"),
            [
                [f_empty,  "",          "室内に蔓延っていたはずの植物は全く見当たらず、かわりに沢山の書物と書類が散乱していた。"],
                [f_jisrof, "ジスロフ",  "「どうなっているんだ･･･」"],
                [f_empty,  "",          "ジスロフは中央の机の上に目をやった。"],
                [f_empty,  "",          "そこに、キミロフ家との契約書らしきものがあるのを発見した。"],
                [f_jisrof, "ジスロフ",  "「これか･･･、全部破ってしまおう」"],
                [f_empty,  "",          "ジスロフは数枚の契約書を全て破り捨てた。"],
                [f_empty,  "",          "「あ、貴方達･･･何者です！！」"],
                [f_empty,  "",          "部屋の入り口から聞き覚えのある声が聞こえた。"],
                [f_jisrof, "ジスロフ",  "「！！まえは･･･！！」"],
                [f_nana,   "ナナ",      "「カベイリアさん･･･？」"],
                [f_kabe2,  "カベイリア","「どうして私の名を！？･･･そ、それにどうやってここへ入って来たのです！！」"],
                [f_empty,  "",          "カベイリアの視線が、ジスロフの足元の破り捨てられた契約書をとらえた。"],
                [f_kabe2,  "カベイリア","「キャアアア！！！」"],
                [f_kabe2,  "カベイリア","「あ、貴方！そ、その足に落ちてる･･･そ、それは･･･まさか･･･」"],
                [f_empty,  "",          "カベイリアは慌ててバラバラになった契約書をかき集めた。"],
                [f_jisrof, "ジスロフ",  "「キミロフ家との契約相手はおまえだったのか･･･」"],
                [f_kabe2,  "カベイリア","「ああ･･･なんてこと･･･！！」"],
                [f_kabe2,  "カベイリア","「もうお終いだわ･･･！！！！」"],
                [f_nana,   "ナナ",      "「カベイリアさん･･･？どうしたの･･･？」"],
                [f_kabe2,  "カベイリア","「貴方達がこれを破ってしまったせいよ！！」"],
                [f_kabe2,  "カベイリア","「これを保管する事が私の仕事だったのに･･･、これじゃあ契約違反になっちゃうじゃない！！」"],
                [f_nana,   "ナナ",      "「契約違反？」"],
                [f_kabe2,  "カベイリア","「そうよ！！」"],
                [f_kabe2,  "カベイリア","「･･･ああ、どうしよう･･･私はもう永遠に王朝の奴隷になってしまう･･･！！」"],
                [f_nana,   "ナナ",      "「ええっ･･･」"],
                [f_nana,   "ナナ",      "「これって･･･ジ、ジスロフ･･･！カベイリアさんを王朝の奴隷にさせたのは･･･僕達なの！？」"],
                [f_jisrof, "ジスロフ",  "「･････････」"],
                [f_kabe2,  "カベイリア","「キャア！！！手が･･･、ああっ、体が･･･！！」"],
                [f_empty,  "",          "カベイリアの体がだんだんと薄く透明になっていく。"],
                [f_kabe2,  "カベイリア","「もうお終いだわ･･･ああ･･･冥界に連れられてしまう･･･ああ･･･貴方達のせいよ！！」"],
                [f_empty,  "",          "ジスロフは慌てて、消えゆこうとするカベイリアの手を掴もうとすると、誰かの別の手が、ジスロフのその手を掴んだ。"],
                [f_jisrof, "ジスロフ",  "「！？」"],
                [f_kimi,   "キミロフ",  "「おっと･･･そこまで」"],
                [f_jisrof, "ジスロフ",  "「おまえ･･･どうして」"],
                [f_empty,  "",          "いつのまにかジスロフの隣にキミロフが立っていた。"],
                [f_empty,  "",          "隣には沙耶香もいる。"],
                [f_kimi,   "キミロフ",  "「今、そいつに触れたら、あんたまで冥界の奴隷になっちまうぜ」"],
                [f_jisrof, "ジスロフ",  "「どうしたらいいっ」"],
                [f_kimi,   "キミロフ",  "「それでいいんだ」"],
                [f_nana,   "ナナ",      "「それでいいって！？」"],
                [f_kimi,   "キミロフ",  "「あんたが破いたその契約書は、俺達一族だけの契約書じゃない」"],
                [f_kimi,   "キミロフ",  "「俺や沙耶香、それに他の大勢の冥界に囚われた常界人達の契約書だ」"],
                [f_jisrof, "ジスロフ",  "「カベイリアはどうなる」"],
                [f_kimi,   "キミロフ",  "「あんた、未来で会ったんだろ？この契約書保管人に」"],
                [f_kimi,   "キミロフ",  "「･･･おかしいと思って占ってみたのさ。あんた達の未来･･･」"],
                [f_empty,  "",          "カベイリアの体はもうほとんど消え、彼女の声は既に聞こえない。"],
                [f_kimi,   "キミロフ",  "「あんたが契約書を破らなければ、この保管人が冥界に囚われる事はなかったかもしれない」"],
                [f_kimi,   "キミロフ",  "「だが、未来のあんた達はどうなる？」"],
                [f_kimi,   "キミロフ",  "「あんた達は、未来でこの保管人に助けられたはずだ」"],
                [f_kimi,   "キミロフ",  "「この保管人が未来の冥界にいなければ･･･、あんた達は永久に冥界から出られない･･･もしくは殺されていたかもしれないぜ･･･」"],
                [f_nana,   "ナナ",      "「･･･カベイリアさんは･･････！」"],
                [f_nana,   "ナナ",      "「未来のカベイリアさんは･･･、それを知っていたの？！」"],
                [f_kimi,   "キミロフ",  "「そうだろうな･･･、未来でおまえ達を助けさえしなければ、おまえ達が契約書を破くこともない」"],
                [f_kimi,   "キミロフ",  "「だが、知ってておまえ達をここへ寄越し、契約書を破らせたんだ」"],
                [f_nana,   "ナナ",      "「他の常界人のため･･･？」"],
                [f_kimi,   "キミロフ",  "「分からないが･･･多分な･･･」"],
                [f_kimi,   "キミロフ",  "「その答えは･･･、未来で聞くといい･･･」"],
                [f_nana,   "ナナ",      "「え？」"],
                [f_empty,  "",          "見ると、キミロフの体が霞んで見える。"],
                [f_empty,  "",          "違った･･･体が消えようとしているのは、ジスロフ達の方だ。"],
                [f_jisrof, "ジスロフ",  "「これは･･･」"],
                [f_kimi,   "キミロフ",  "「行くんだろ？あの保管人を助けに･･･」"],
                [f_kimi,   "キミロフ",  "「相手は冥界王朝だ。厳しいぞ･･･、覚悟しろ」"],
                [f_empty,  "",          "ジスロフ達は今まさに再び未来へと戻り始めたのだ。"],
                [f_kimi,   "キミロフ",  "「おい、おまえ」"],
                [f_empty,  "",          "そう言って、キミロフは消え行くジスロフを見た。"],
                [f_jisrof, "ジスロフ",  "「なんだ･･･」"],
                [f_kimi,   "キミロフ",  "「ナナを大切にな･･･」"],
                [f_jisrof, "ジスロフ",  "「フン･･･おまえに言われるまでもない」"],
                [f_kimi,   "キミロフ",  "「そうか？･･･大切な物の側に長くいると、何が一番大切なのか忘れちまう」"],
                [f_kimi,   "キミロフ",  "「俺がそうだった」"],
            ]
        );
        await s.set(
            new Img("img/story/s_pic37.jpg"),
            [
                [f_empty,  "",          "キミロフは沙耶香の腰にそっと手をまわし、自分の体へ引き寄せた。"],
                [f_sayaka, "沙耶香",    "「･･･キミロフ様･･･」"],
                [f_kimi,   "キミロフ",  "「そうだ。沙耶香と俺の間に産まれてくる子におまえの名前の一部を取ろう」"],
                [f_kimi,   "キミロフ",  "「男の子だったらジスカル･･･、女の子だったらナナから名を取るよ･･･」"],
                [f_nana,   "ナナ",      "「キミロフさん･･･、沙耶香さん･･･ありがとう！」"],
                [f_empty,  "",          "キミロフの口が「またな」と動くのが見えた。"],
            ]
        );
        await s.set(
            new Img("img/story/s_pic35.jpg"),
            [
                [f_empty,  "",          "次の瞬間、ジスロフ達は、元の現代の地球塔の契約書保管室にいた。"],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第35話『さよなら、殿下』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
    //塔地下へのボタン
    export const runMain35a = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_ruin   = new Img("img/face/p_ruin.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic25.jpg"),
            [
                [f_empty,  "",          "････････････････････････"],
                [f_empty,  "",          "････････････････････････････････････････････････"],
                [f_empty,  "",          "「セイントガール･･･、心配しなくていいよ」"],
                [f_empty,  "",          "「君の子供は、僕らが育てる･･･」"],
                [f_empty,  "",          "「おやすみ･･･セイントガール･･･」"],
                [f_empty,  "",          "「･･･おんぎゃあ！！」"],
                [f_empty,  "",          "「その子をどうするの？」"],
                [f_empty,  "",          "「この子に僕らの力を封印するんだ」"],
                [f_empty,  "",          "「この子、妹が死んだの。海藤ウイルスで」"],
                [f_empty,  "",          "「･･･海藤ウイルス？･･･」"],
                [f_empty,  "",          `「貴方の"ぞうお"をキューブが読心して、停止する最後に造った創造物よ」`],
                [f_empty,  "",          "「大勢の人が感染して死んだわ･･･」"],
                [f_empty,  "",          "「･･･もう会えなくなるよ」"],
                [f_empty,  "",          "「･･･私、海藤ウイルスに感染してるの」"],
                [f_empty,  "",          "「キューブとペルセポネの力･･･それらは、僕ら人間が最初から持っている力だよ」"],
                [f_empty,  "",          "「私達、人間が･･･あのペルセポネっていう巨人の想像だというなら･･･」"],
                [f_empty,  "",          "「･･･私も想像したの･･･」"],
                [f_empty,  "",          "「誰も傷ついたり、脅えたりしない世界を･･･」"],
                [f_empty,  "",          "「妹と安心して眠れる世界を･･･」"],
                [f_empty,  "",          "「･･･マァマァ･･･」"],
                [f_empty,  "",          "「･･･ラブ、おまえのこのちっちゃな肩に頼っちゃってごめんよ」"],
                [f_empty,  "",          "「･･･セイントガール、この子は永遠に生きる」"],
                [f_empty,  "",          "「･･･何万年も、何億年もずっと」"],
                [f_empty,  "",          "「･･･いつか、我等の末裔がこのほこらを見つけ、力を得るだろう」"],
                [f_empty,  "",          "「そして宇宙を常に連続させ続ける力となる」"],
                [f_empty,  "",          "「･･･！！やめろ！！時間が止まってしまう！！」"],
                [f_empty,  "",          "「もう無駄だ、エグゼよ･･･我等はもう永久にこの赤子に触れられない」"],
                [f_empty,  "",          "「コレは、キューブが見テる夢ダ」"],
                [f_empty,  "",          "「･･･おまえの、ほんとうの、おまえを、しっていますようよです･･･」"],
                [f_empty,  "",          "「ひどい、みにくい、おそろしい、くるった、ギラギラしてくからのる！！」"],
                [f_empty,  "",          "「こわい･･･」"],
                [f_empty,  "",          "「こわい･･････」"],
                [f_empty,  "",          "････････････････････････"],
                [f_empty,  "",          "････････････････････････････････････････････････"],
            ]
        );
        await s.set(
            Img.empty,
            [
                [f_empty,  "",          "･･･ルインがその扉に触れた瞬間、ルインの脳内にキューブとペルセポネに融合したミッド・ポイントの記憶が流れこんできた。"],
                [f_empty,  "",          "･･･いや、正確にはそれらは、それら全てを内包する赤子ラブの見る夢だった。"],
                [f_empty,  "",          "ラブはミッド・ポイントの記憶と共に、この塔そのものであった。"],
                [f_ruin,   "ルイン",    "「･･･君だね？･･･」"],
                [f_empty,  "",          "そしてルインは、この赤子こそが自分をこの今に引き寄せた張本人であることをその時悟った。"],
                [f_empty,  "",          "皆が見守る中、果てしなく長い時間決して開かれることのなかった扉が、重く鈍い音を立ててついに開いた。"],
                [f_empty,  "",          "扉は更なる塔深部へと繋がっているはずだ･･････。"],
            ]
        );

        s.end();
    };
    //塔地下777階クリア。このストーリーの後、オランピア・ドラギャレットとの戦闘。
    export const runMain36 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_1      = new Img("img/face/p_1.jpg");
        const f_jisrof  = new Img("img/face/p_jis.jpg");
        const f_luka   = new Img("img/face/p_luka.jpg");
        const f_nana  = new Img("img/face/p_nana.jpg");
        const f_ruin   = new Img("img/face/p_ruin.jpg");
        const f_siki  = new Img("img/face/p_siki.jpg");
        const f_pea    = new Img("img/face/p_pea.jpg");
        const f_oranpia  = new Img("img/face/p_oranpia.jpg");
        const f_dora  = new Img("img/face/p_dora.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic22.jpg"),
            [
                [f_empty,  "",          "皆が戸惑い静まる中、一号が口を開いた。"],
                [f_1,      "一号",      "「俺は、もうアンタを恨むのはやめた」"],
                [f_jisrof, "ジスロフ",  "「･････････」"],
                [f_1,      "一号",      "「俺もlukaも、生きる意味を見付けたからだ」"],
                [f_luka,   "luka",      "「･････････」"],
                [f_luka,   "luka",      "「･･･でも、私･･･、ジスマに会ったら･･･一号のようになれないかもしれない･･･」"],
                [f_nana,   "ナナ",      "「･･･ごめんなさい。lukaさん」"],
                [f_luka,   "luka",      "「え･･････」"],
                [f_empty,  "",          "沈黙するジスロフの前にナナが立ち、lukaに言った。"],
                [f_nana,   "ナナ",      "「･･･ジスマは我を失っています」"],
                [f_nana,   "ナナ",      "「ジスマを止めるのが僕達の務め･･････、だから一緒に行かせてください」"],
                [f_ruin,   "ルイン",    "「一緒に行こう･･･」"],
                [f_ruin,   "ルイン",    "「･･･僕たちはまだ弱いんだ･･･」"],
                [f_ruin,   "ルイン",    "「この星や、大勢の人を守るために、もっと力が必要だから」"],
                [f_nana,   "ナナ",      "「ありがとうルイン」"],
                [f_empty,  "",          "「これは驚いたなっ･･･」"],
                [f_empty,  "",          "皆の後ろで声がした。"],
                [f_siki,   "シキ",      "「先代様じゃありませんか」"],
                [f_ruin,   "ルイン",    "「･･･！」"],
                [f_jisrof, "ジスロフ",  "「おまえは･･････、ハルの子か･･･」"],
                [f_siki,   "シキ",      "「とっくに死んだと聞いていましたが？」"],
                [f_pea,    "ピアー",    "「シキィ！･･･おまえ･･･またルインを殺しにきたなっ！！」"],
                [f_empty,  "",          "ピアーを始め、一号や雪が身構えた。"],
                [f_siki,   "シキ",      "「ああ、おまえ達にこれ以上強くなってもらっちゃ困るんでね」"],
                [f_siki,   "シキ",      "「･･････おまえ達は何も分かっちゃいないんだよ」"],
                [f_siki,   "シキ",      "「この地球塔、そしてヒルトンへ潜る意味がな！！」"],
                [f_siki,   "シキ",      "「おまえ達のような分際で、辿り付かれてたまるものか･･････」"],
                [f_empty,  "",          "シキの後の影から、ぼうっと２つの影が浮かび上がった。"],
                [f_oranpia,"オランピア","「･･･ジスロフ王がいるなんて聞いてないわよ･･･？」"],
                [f_dora,"ドラギャレット","「･･･うむ、しかし羅文の力とやらが感じとれない･･･」"],
                [f_dora,"ドラギャレット","「予定外に苦戦を強いられそうな事に変わりはなさそうだが･･･」"],
                [f_oranpia,"オランピア","「･･････こんな事なら、やっぱりラプソディアを止めておけば良かったわ」"],
                [f_oranpia,"オランピア","「スペシャリストを生きたまま保存したいから連れて帰るだなんて、子供みたい･･･」"],
            ]
        );
        /*
                [f_empty,  "",          ""],
                [f_1,      "一号",      ""],
                [f_jisrof, "ジスロフ",  ""],
                [f_nana,   "ナナ",      ""],
                [f_luka,   "luka",      ""],
                [f_ruin,   "ルイン",    ""],
                [f_siki,   "シキ",      ""],
                [f_pea,    "ピアー",    ""],
                [f_oranpia,"オランピア",""],
                [f_dora,"ドラギャレット",""],
        */

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第n話『』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
}
/*
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_0      = new Img("img/face/p_0.jpg");//ピンク髪
        const f_02      = new Img("img/face/p_02.jpg");//にやり
        const f_03      = new Img("img/face/p_03.jpg");//力み顔
        const f_1      = new Img("img/face/p_1.jpg");
        const f_siki  = new Img("img/face/p_siki.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_luka   = new Img("img/face/p_luka.jpg");
        const f_luka2   = new Img("img/face/p_luka2.jpg");//泣き顔
        const f_memo = new Img("img/face/p_sol.jpg");
        const f_vega = new Img("img/face/p_vega.jpg");
        const f_pea    = new Img("img/face/p_pea.jpg");
        const f_ruin   = new Img("img/face/p_ruin.jpg");
        const f_jisrof  = new Img("img/face/p_jis.jpg");
        const f_jisrof2  = new Img("img/face/p_jis2.jpg");//泣き顔
        const f_nana  = new Img("img/face/p_nana.jpg");
        const f_oranpia  = new Img("img/face/p_oranpia.jpg");
        const f_dora  = new Img("img/face/p_dora.jpg");
        const f_exe  = new Img("img/face/p_exe.jpg");
        const f_yoruko  = new Img("img/face/p_yoruko.jpg");
        const f_jiyuu  = new Img("img/face/p_jiyuu.jpg");
        const f_syao  = new Img("img/face/p_syao.jpg");
        const f_vinus  = new Img("img/face/p_vinus.jpg");
        const f_kabe  = new Img("img/face/p_majo.jpg");
        const f_kabe2  = new Img("img/face/p_majo2.jpg");//帽子無し
        const f_kimi  = new Img("img/face/p_kimi.jpg");
        const f_sayaka  = new Img("img/face/p_sayaka.jpg");

    export const runMain37 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic21.jpg"),
            [
                [f_empty,  "",          ""],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第n話『』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
 */