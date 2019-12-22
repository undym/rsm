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
        /*
                [f_empty,  "",          ""],
                [f_kabe,   "カベイリア",""],
                [f_jisrof, "ジスロフ",  ""],
                [f_nana,   "ナナ",      ""],
                [f_syao,   "小鬼",      ""],
         */

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第30話『カベイリアの願い』", Color.L_GRAY); Sound.moji.play(); await cwait();
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

    export const runMain30 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic21.jpg"),
            [
                [f_empty,  "",         ""],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第n話『』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
 */