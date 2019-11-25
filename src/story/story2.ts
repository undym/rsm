import { Util } from "../util.js";
import { Color } from "../undym/type.js";
import { Sound } from "../sound.js";
import { cwait } from "../undym/scene.js";
import { Img } from "../graphics/graphics.js";
import { Story } from "./story.js";


export namespace Story2{

    export const runMain20 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_oranpia  = new Img("img/face/p_oranpia.jpg");
        const f_siki  = new Img("img/face/p_siki.jpg");
        const f_dora  = new Img("img/face/p_dora.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic5.jpg"),
            [
                [f_empty,  "",      "ルイン達は更に塔を昇り続けた。"],
                [f_empty,  "",      "･･････幾つもの平行宇宙にまたがり、かつて、この塔を同じように昇った者達がいた。"],
                [f_empty,  "",      "宇宙再生に贖おうとした伝説の鳥使いスターダンスは、塔中腹にて猫老人ヨーガと出会い･･･"],
                [f_empty,  "",      "･･･人類からの差別支配に抵抗しようとした亜人ミッド・ポイントとアタゼルは、塔の中で何度も青色人という不思議な生命体に遭遇し･･･"],
                [f_empty,  "",      "･･･アナザーマインドという別人格を持ったレペモッチョネは、その塔と宇宙全体の関係の秘密を解き明かそうとし･･･"],
                [f_empty,  "",      "･･･兎人トリクーガは、塔最下層にあるロストメモリー室の壁に、オクタビアンらが残したメッセージを見つけ･･･"],
                [f_empty,  "",      "･･･獣使いアレクは全ての＜答え＞を手に入れるべく、塔の中で古の戦士達と死闘を繰り広げ･･･"],
                [f_empty,  "",      "･･･悲愴剣士レインは、グージーグージーが塔内部に残した無限ダンジョンにて、グージーグージーの呪いに取り憑かれた。"],
                [f_empty,  "",      "･･･太古の星士達は、この塔に運命を巻き寄せられ幾つもの命を落としながらも尚塔を昇ろうとする多くの人々を見、こう詠った。"],
                [f_empty,  "",      "･･････『生命よ星となって昇れ･･･』と。"],
                [f_empty,  "",      "～地球塔･･････。"],
                [f_empty,  "",      "『彼』は、無限の宇宙にまたがり、誰もが失った全ての記憶を有する者だ。"],
            ]
        );

        await s.set(
            Img.empty,
            [
                [f_empty,  "",      "･･･ルイン達はようやく1000階に到達しようとしていた。"],
                [f_empty,  "",      "そんなルイン達の後をつける二人組がいた。"],
            ]
        );
        await s.set(
            new Img("img/story/s_pic23.jpg"),
            [
                [f_empty,  "",      "一人は女剣士だ･･･。"],
                [f_empty,  "",      "･･･帝国十二天子デルバの一天子･･･梵天子オランピアであった。"],
                [f_empty,  "",      "そしてオランピアに付き添う高い細身の男は、エデン民族の戦士が扱う三日月弓を持っている。"],
                [f_empty,  "",      "オランピア同様に、男も十二天の一人だ。"],
                [f_empty,  "",      "ルイン達が眠っている時間･･･、二人の元に、一人の男が現れた。"],
                [f_empty,  "",      ""],
                [f_oranpia,"オランピア", "「あの餓鬼達と、ドラゴンを連れて行く利はあるんだろうな？」"],
                [f_siki,   "シキ",      "「ああ･･･」"],
                [f_oranpia,"オランピア", "「･･･フン･･･」"],
                [f_oranpia,"オランピア", "「ジスマ様は事を急いでおられだぞ」"],
                [f_oranpia,"オランピア", "「･･･戦端は押されっぱなしなのだ･･･」"],
                [f_oranpia,"オランピア", "「･･･今は火天（アグニ）の爺様と、ラプソディアの戦隊が食い止めてはいるが長くは持つまい」"],
                [f_siki,   "シキ",      "「ラプソディア･･････閻魔天子までが出ているのか？」"],
                [f_oranpia,"オランピア", "「そうだ。･･･冥界の新政権は容赦がないぞ･･･シキ」"],
                [f_siki,   "シキ",      "「ヴァーユからの連絡はまだ無しか？」"],
                [f_oranpia,"オランピア", "「うむ･･････」"],
                [f_oranpia,"オランピア", "「やつがプリンス様のお供にあるだけ、まだ幸いというものだがな」"],
                [f_dora,   "ド・ラ・ギャレット", "「･･･おい･･･」"],
                [f_empty,  "",                 "後ろでじっと闇を睨んでいたド・ラ・ギャレットが低い声で警告した。"],
                [f_empty,  "",                 "シキが振り返ると、上の方でルイン達の目覚める声が聞こえた。"],
                [f_siki,   "シキ",             "「･･･あまり近づくな。あいつらにバレる･･･」"],
                [f_siki,   "シキ",             "「ベガとかいうドラゴンの感覚器官がおまえ達の存在を掴み始めているようだ･･･」"],
                [f_oranpia,"オランピア",        "「･･････いざとなったら殺す。それだけだろ？」"],
                [f_siki,   "シキ",             "「まだ必要だといっただろう･･･もう行く･･･」"],
                [f_empty,  "",                 "シキがルイン達のいる方向へ歩き出すと、オランピアとド・ラ・ギャレットの二人はすうっと闇の中へと消えた。"],
            ]
        );
        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        //TODO
        Util.msg.set("第20話『画策』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
    
    export const runMain21 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_pea    = new Img("img/face/p_pea.jpg");
        const f_siki  = new Img("img/face/p_siki.jpg");
        const f_ruin   = new Img("img/face/p_ruin.jpg");
        const f_luka   = new Img("img/face/p_luka.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic22.jpg"),
            [
                [f_empty,  "",      "標準時間で１ヶ月が過ぎようとしていた。"],
                [f_empty,  "",      "僕達は塔の4000階に辿り付いていた。"],
                [f_empty,  "",      "･･････そこは天井が見えぬほどの巨大な空洞になっていた。"],
                [f_empty,  "",      "太い２本の柱が中央に建ち、上空の暗闇に消えていた。"],
                [f_empty,  "",      "シキは、その柱を指差し、「あれは足だ」と言った。"],
                [f_empty,  "",      "柱に近づくにつれ、それが人間の足をそのまま巨大化したような形であることが分かった。"],
                [f_empty,  "",      "そして、空洞の中央上空が見渡せる位置まで達すると、それが巨大な人間そのものであることが確かに見てとれた。"],
            ]
        );
        await s.set(
            new Img("img/story/s_pic24.jpg"),
            [
                [f_pea,    "ピアー", "「なんなんじゃ･･･、この巨大像は･･･」"],
                [f_siki,   "シキ",  "「像？良く見ろ･･･、像ではない。生命体だ」"],
                [f_siki,   "シキ",  "「それでも３億分の１にまで縮小している･･･」"],
                [f_pea,    "ピアー", "「そ･･･そげんことが･･･」"],
                [f_ruin,   "ルイン","「生きてる･･･」"],
                [f_empty,  "",      "この巨人の胸が、限りなくゆっくりとだが動いていた。息をしているのだ。"],
                [f_luka,   "luka",  "「･･･なんなの･･･これ･･･」"],
                [f_siki,   "シキ",  "「ペルセポネ･･･、人間を想像した神だ」"],
                [f_pea,    "ピアー","「･･･神？！」"],
                [f_siki,   "シキ",  "「桜聖典では、万古という名で描かれた宇宙第一創生種だ」"],
                [f_luka,   "luka",  "「どうしてこんな所に･･･？」"],
                [f_siki,   "シキ",  "「キューブが拘束しているのだ･･･」"],
                [f_siki,   "シキ",  "「『月』がまだ地球の体内にいた頃･･･、ペルセポネは元々太陽系の１０番目の惑星として、その軌道を周回していた」"],
                [f_siki,   "シキ",  "「だがある時、彼はキューブに捕らえられ地球に落ちた」"],
                [f_siki,   "シキ",  "「その衝撃で地球と月は分離し、ペルセポネは人を想像し、キューブがそれを具現化した」"],
                [f_siki,   "シキ",  "「･･････そして生まれたのが人間だ」"],
                [f_siki,   "シキ",  "「今から、彼に血清を打ち込む」"],
                [f_luka,   "luka",  "「血清？？？」"],
                [f_siki,   "シキ",  "「かつて･･･私の父が、キューブを停止させる手段として、ペルセポネにウィルスを注入したのだ」"],
                [f_siki,   "シキ",  "「ペルセポネはウィルスによって強制的に『キューブが停止する夢』を見させられた」"],
                [f_siki,   "シキ",  "「キューブはそれを自ら具現化してしまい、停止したのだ」"],
                [f_siki,   "シキ",  "「ペルセポネ･･･、彼は今も尚、その夢を見続けている･･･」"],
                [f_ruin,   "ルイン","「･･･ペルセポネ･･･」"],
                [f_empty,  "",      "僕は、遥か上空でこうべを垂れたペルセポネの顔を、目を凝らして見つめた。"],
                [f_empty,  "",      "まるで意識を失ってしまった虚ろな目が、一瞬、僕を見つめたような気がした。"],
                [f_pea,    "ピアー","「じゃあ、その血清を打った瞬間に、キューブは目覚めるのか？」"],
                [f_siki,   "シキ",  "「そういうことになる･･･」"],
                [f_ruin,   "ルイン","（ペルセポネ･･･ペルセポネ･･･）"],
                [f_empty,  "ペルセポネ", "（なんだ･･･）"],
                [f_ruin,   "ルイン","（僕をこの世界に呼んだのは君？）"],
                [f_empty,  "ペルセポネ", "（違う･･･）"],
                [f_empty,  "ペルセポネ", "（この都市は停止してる･･･ずっと･･･ずっと昔に･･･キューブが停止するようり遥か昔だ･･･）"],
                [f_empty,  "ペルセポネ", "（彼女が待ってる･･･）"],
                [f_ruin,   "ルイン","（彼女･･･！？･･･その人が僕を呼んだんだね？）"],
                [f_empty,  "ペルセポネ", "（･･････）"],
                [f_siki,   "シキ",  "「血清を打った･･･。キューブが目覚めるぞ･･･」"],
                [f_empty,  "",      "キューブは覚醒した。"],
                [f_empty,  "",      "･･･ペルセポネと共に。"],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第21話『神の声』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
}
/*
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_1      = new Img("img/face/p_1.jpg");
        const f_siki  = new Img("img/face/p_siki.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_luka   = new Img("img/face/p_luka.jpg");
        const f_luka2   = new Img("img/face/p_luka2.jpg");//泣き顔
        const f_memo = new Img("img/face/p_sol.jpg");
        const f_vega = new Img("img/face/p_vega.jpg");
        const f_pea    = new Img("img/face/p_pea.jpg");
        const f_ruin   = new Img("img/face/p_ruin.jpg");

    export const runMain21 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic21.jpg"),
            [
                [f_empty,  "",      ""],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第n話『』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
 */