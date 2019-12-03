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
export var Story2;
(function (Story2) {
    Story2.runMain20 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_oranpia = new Img("img/face/p_oranpia.jpg");
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_dora = new Img("img/face/p_dora.jpg");
        const s = new Story();
        yield s.set(new Img("img/story/s_pic5.jpg"), [
            [f_empty, "", "ルイン達は更に塔を昇り続けた。"],
            [f_empty, "", "･･････幾つもの平行宇宙にまたがり、かつて、この塔を同じように昇った者達がいた。"],
            [f_empty, "", "宇宙再生に贖おうとした伝説の鳥使いスターダンスは、塔中腹にて猫老人ヨーガと出会い･･･"],
            [f_empty, "", "･･･人類からの差別支配に抵抗しようとした亜人ミッド・ポイントとアタゼルは、塔の中で何度も青色人という不思議な生命体に遭遇し･･･"],
            [f_empty, "", "･･･アナザーマインドという別人格を持ったレペモッチョネは、その塔と宇宙全体の関係の秘密を解き明かそうとし･･･"],
            [f_empty, "", "･･･兎人トリクーガは、塔最下層にあるロストメモリー室の壁に、オクタビアンらが残したメッセージを見つけ･･･"],
            [f_empty, "", "･･･獣使いアレクは全ての＜答え＞を手に入れるべく、塔の中で古の戦士達と死闘を繰り広げ･･･"],
            [f_empty, "", "･･･悲愴剣士レインは、グージーグージーが塔内部に残した無限ダンジョンにて、グージーグージーの呪いに取り憑かれた。"],
            [f_empty, "", "･･･太古の星士達は、この塔に運命を巻き寄せられ幾つもの命を落としながらも尚塔を昇ろうとする多くの人々を見、こう詠った。"],
            [f_empty, "", "･･････『生命よ星となって昇れ･･･』と。"],
            [f_empty, "", "～地球塔･･････。"],
            [f_empty, "", "『彼』は、無限の宇宙にまたがり、誰もが失った全ての記憶を有する者だ。"],
        ]);
        yield s.set(Img.empty, [
            [f_empty, "", "･･･ルイン達はようやく1000階に到達しようとしていた。"],
            [f_empty, "", "そんなルイン達の後をつける二人組がいた。"],
        ]);
        yield s.set(new Img("img/story/s_pic23.jpg"), [
            [f_empty, "", "一人は女剣士だ･･･。"],
            [f_empty, "", "･･･帝国十二天子デルバの一天子･･･梵天子オランピアであった。"],
            [f_empty, "", "そしてオランピアに付き添う高い細身の男は、エデン民族の戦士が扱う三日月弓を持っている。"],
            [f_empty, "", "オランピア同様に、男も十二天の一人だ。"],
            [f_empty, "", "ルイン達が眠っている時間･･･、二人の元に、一人の男が現れた。"],
            [f_empty, "", ""],
            [f_oranpia, "オランピア", "「あの餓鬼達と、ドラゴンを連れて行く利はあるんだろうな？」"],
            [f_siki, "シキ", "「ああ･･･」"],
            [f_oranpia, "オランピア", "「･･･フン･･･」"],
            [f_oranpia, "オランピア", "「ジスマ様は事を急いでおられだぞ」"],
            [f_oranpia, "オランピア", "「･･･戦端は押されっぱなしなのだ･･･」"],
            [f_oranpia, "オランピア", "「･･･今は火天（アグニ）の爺様と、ラプソディアの戦隊が食い止めてはいるが長くは持つまい」"],
            [f_siki, "シキ", "「ラプソディア･･････閻魔天子までが出ているのか？」"],
            [f_oranpia, "オランピア", "「そうだ。･･･冥界の新政権は容赦がないぞ･･･シキ」"],
            [f_siki, "シキ", "「ヴァーユからの連絡はまだ無しか？」"],
            [f_oranpia, "オランピア", "「うむ･･････」"],
            [f_oranpia, "オランピア", "「やつがプリンス様のお供にあるだけ、まだ幸いというものだがな」"],
            [f_dora, "ド・ラ・ギャレット", "「･･･おい･･･」"],
            [f_empty, "", "後ろでじっと闇を睨んでいたド・ラ・ギャレットが低い声で警告した。"],
            [f_empty, "", "シキが振り返ると、上の方でルイン達の目覚める声が聞こえた。"],
            [f_siki, "シキ", "「･･･あまり近づくな。あいつらにバレる･･･」"],
            [f_siki, "シキ", "「ベガとかいうドラゴンの感覚器官がおまえ達の存在を掴み始めているようだ･･･」"],
            [f_oranpia, "オランピア", "「･･････いざとなったら殺す。それだけだろ？」"],
            [f_siki, "シキ", "「まだ必要だといっただろう･･･もう行く･･･」"],
            [f_empty, "", "シキがルイン達のいる方向へ歩き出すと、オランピアとド・ラ・ギャレットの二人はすうっと闇の中へと消えた。"],
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
        //TODO
        Util.msg.set("第20話『画策』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story2.runMain21 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const s = new Story();
        yield s.set(new Img("img/story/s_pic22.jpg"), [
            [f_empty, "", "標準時間で１ヶ月が過ぎようとしていた。"],
            [f_empty, "", "僕達は塔の4000階に辿り付いていた。"],
            [f_empty, "", "･･････そこは天井が見えぬほどの巨大な空洞になっていた。"],
            [f_empty, "", "太い２本の柱が中央に建ち、上空の暗闇に消えていた。"],
            [f_empty, "", "シキは、その柱を指差し、「あれは足だ」と言った。"],
            [f_empty, "", "柱に近づくにつれ、それが人間の足をそのまま巨大化したような形であることが分かった。"],
            [f_empty, "", "そして、空洞の中央上空が見渡せる位置まで達すると、それが巨大な人間そのものであることが確かに見てとれた。"],
        ]);
        yield s.set(new Img("img/story/s_pic24.jpg"), [
            [f_pea, "ピアー", "「なんなんじゃ･･･、この巨大像は･･･」"],
            [f_siki, "シキ", "「像？良く見ろ･･･、像ではない。生命体だ」"],
            [f_siki, "シキ", "「それでも３億分の１にまで縮小している･･･」"],
            [f_pea, "ピアー", "「そ･･･そげんことが･･･」"],
            [f_ruin, "ルイン", "「生きてる･･･」"],
            [f_empty, "", "この巨人の胸が、限りなくゆっくりとだが動いていた。息をしているのだ。"],
            [f_luka, "luka", "「･･･なんなの･･･これ･･･」"],
            [f_siki, "シキ", "「ペルセポネ･･･、人間を想像した神だ」"],
            [f_pea, "ピアー", "「･･･神？！」"],
            [f_siki, "シキ", "「桜聖典では、万古という名で描かれた宇宙第一創生種だ」"],
            [f_luka, "luka", "「どうしてこんな所に･･･？」"],
            [f_siki, "シキ", "「キューブが拘束しているのだ･･･」"],
            [f_siki, "シキ", "「『月』がまだ地球の体内にいた頃･･･、ペルセポネは元々太陽系の１０番目の惑星として、その軌道を周回していた」"],
            [f_siki, "シキ", "「だがある時、彼はキューブに捕らえられ地球に落ちた」"],
            [f_siki, "シキ", "「その衝撃で地球と月は分離し、ペルセポネは人を想像し、キューブがそれを具現化した」"],
            [f_siki, "シキ", "「･･････そして生まれたのが人間だ」"],
            [f_siki, "シキ", "「今から、彼に血清を打ち込む」"],
            [f_luka, "luka", "「血清？？？」"],
            [f_siki, "シキ", "「かつて･･･私の父が、キューブを停止させる手段として、ペルセポネにウィルスを注入したのだ」"],
            [f_siki, "シキ", "「ペルセポネはウィルスによって強制的に『キューブが停止する夢』を見させられた」"],
            [f_siki, "シキ", "「キューブはそれを自ら具現化してしまい、停止したのだ」"],
            [f_siki, "シキ", "「ペルセポネ･･･、彼は今も尚、その夢を見続けている･･･」"],
            [f_ruin, "ルイン", "「･･･ペルセポネ･･･」"],
            [f_empty, "", "僕は、遥か上空でこうべを垂れたペルセポネの顔を、目を凝らして見つめた。"],
            [f_empty, "", "まるで意識を失ってしまった虚ろな目が、一瞬、僕を見つめたような気がした。"],
            [f_pea, "ピアー", "「じゃあ、その血清を打った瞬間に、キューブは目覚めるのか？」"],
            [f_siki, "シキ", "「そういうことになる･･･」"],
            [f_ruin, "ルイン", "（ペルセポネ･･･ペルセポネ･･･）"],
            [f_empty, "ペルセポネ", "（なんだ･･･）"],
            [f_ruin, "ルイン", "（僕をこの世界に呼んだのは君？）"],
            [f_empty, "ペルセポネ", "（違う･･･）"],
            [f_empty, "ペルセポネ", "（この都市は停止してる･･･ずっと･･･ずっと昔に･･･キューブが停止するようり遥か昔だ･･･）"],
            [f_empty, "ペルセポネ", "（彼女が待ってる･･･）"],
            [f_ruin, "ルイン", "（彼女･･･！？･･･その人が僕を呼んだんだね？）"],
            [f_empty, "ペルセポネ", "（･･････）"],
            [f_siki, "シキ", "「血清を打った･･･。キューブが目覚めるぞ･･･」"],
            [f_empty, "", "キューブは覚醒した。"],
            [f_empty, "", "･･･ペルセポネと共に。"],
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
        Util.msg.set("第21話『神の声』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    /**4000階の階段を合成して出現した6665階をクリア. */
    Story2.runMain22 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_cube = new Img("img/face/p_cube.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_fujin = new Img("img/face/p_fujin.jpg");
        const f_oranpia = new Img("img/face/p_oranpia.jpg");
        const f_dora = new Img("img/face/p_dora.jpg");
        const f_exe = new Img("img/face/p_exe.jpg");
        const f_yoruko = new Img("img/face/p_yoruko.jpg");
        const f_jiyuu = new Img("img/face/p_jiyuu.jpg");
        const s = new Story();
        yield s.set(Img.empty, [
            [f_empty, "", "僕達はついに塔の6666階にある中枢室に辿り着いた。"],
            [f_empty, "", "そこの扉を開くと、部屋の中央に青白い光を放つ立方体が浮遊していた。"],
        ]);
        yield s.set(new Img("img/story/s_pic25.jpg"), [
            [f_empty, "", "そして、キューブの声が一斉に僕達の脳内に侵入してきた。"],
            [f_cube, "キューブ", "「この部屋に立ち入る事を禁ずる」"],
            [f_pea, "ピアー", "「ううっっ、あ、頭が･･･割れる･･･！！」"],
            [f_empty, "", "突然、ピアー達が頭部を押さえて倒れこんだ。"],
            [f_empty, "", "ベガさえもが、その瞳に苦痛の色を浮かべている。"],
            [f_ruin, "ルイン", "「み、みんな！！」"],
            [f_siki, "シキ", "「や、やはり･･･、ルイン、お･･･おまえ人間じゃなかったな･･･」"],
            [f_empty, "", "シキが頭痛に悶絶しながらも、ニヤリと微笑みながらルインを見た。"],
            [f_empty, "", "皆が倒れこむ中、ルインだけがなんともなかった。"],
            [f_siki, "シキ", "「ルイン、キューブに触れろ･･･そして、キューブとのコンタクトを果たすんだ」"],
            [f_empty, "", "ルインは言われるが侭、キューブに近づくと、恐る恐るその発光する立方体の表面に手を当てた。"],
            [f_empty, "", "その途端、皆の顔から苦痛の表情が消えた。"],
            [f_siki, "シキ", "「桜聖典の記述通りだ･･･、ラストボックスを持たぬ者のみがキューブとのコンタクトを許される･･･」"],
            [f_siki, "シキ", "「さあキューブよ･･･！我に力を与えよ。おまえを再び覚醒させてやったのは私だ」"],
            [f_cube, "キューブ", "「力はここにはない」"],
            [f_siki, "シキ", "「分かっている。ヒルトン炭鉱への扉を開いて欲しいのだ」"],
            [f_siki, "シキ", "「･･･アケローンの河は既に流れた。古の地球塔地下への挑戦権を我に与えよ」"],
            [f_cube, "キューブ", "「それはできない。おまえは人間だ」"],
            [f_empty, "", "シキの口元が再び吊り上がった。"],
            [f_siki, "シキ", "「やはりラストボックスか･･･」"],
            [f_empty, "", "次の瞬間、シキは突然芯を抜かれたかのように力なく床に倒れた。"],
            [f_empty, "", "皆が唖然とする中、数秒してシキは再び立ち上がった。"],
            [f_luka, "luka", "「シキ！？大丈夫なの？！」"],
            [f_siki, "シキ", "「･･･私の脳は既にラストボックス以外の全てを電脳結線化している･･･」"],
            [f_siki, "シキ", "「そして、たった今、最後のラストボックス野を焼いた」"],
            [f_luka, "luka", "「そ、そんなことをしたら、人間じゃなくなってしまう！」"],
            [f_siki, "シキ", "「それでいい･･･」"],
            [f_siki, "シキ", "「さあ、キューブ、私はもう人間ではない」"],
            [f_siki, "シキ", "「地下への挑戦権を与えろ！！」"],
            [f_cube, "キューブ", "「･････････」"],
            [f_siki, "シキ", "「どうしたキューブ！」"],
            [f_cube, "キューブ", "「･････････」"],
            [f_cube, "キューブ", "「･･････おまえには挑戦権を与えられない」"],
            [f_siki, "シキ", "「！！･･･何故だ！！！」"],
            [f_empty, "", "キューブは黙ったままそれ以上喋ろうとはせず、ただの箱のようになってしまった。"],
            [f_empty, "", "その時、キューブの後方にあった碑石のような物から、亡霊が浮き出た。"],
            [f_fujin, "不人", "「不人とは人間ではない人間･･･」"],
            [f_empty, "", "その立体ホログラフは、誰に話しかけるともなく、ゆっくりと語り始めた。"],
            [f_fujin, "不人", "「まだキューブが過去の記憶を忘れていない･･･真のキューブであった頃･･･」"],
            [f_fujin, "不人", "「蜘蛛の体を与えられたミッドポイントは、竜人アタゼルと融合することで半人体を手に入れました」"],
            [f_fujin, "不人", "「彼は、キューブによって差別支配を行っていたゼータ卿らを始めとする超人類を止めるために、自らをキューブと融合し、キューブそのものを時の渦に封印したのです」"],
            [f_fujin, "不人", "「以後、キューブはラストボックスとの送受信機能だけを残し、本来の機能を停止させました」"],
            [f_fujin, "不人", "「キューブの･･･本来の機能とは･･･ロス･･･メ･･･リ･･･ジジジジジ･･･ジジジ･･･」"],
            [f_empty, "", "一瞬、立体ホログラフにノイズが生じたが、『それ』は止まる事無く語り続けた。"],
            [f_fujin, "不人", "「ジジジ･･････、･･･ダー分岐点･･･スペシャリスト達の宇宙次元間の移動を可能にするための転移装置を制御する事でした」"],
            [f_fujin, "不人", "「即ち、かつてヒルトンへの通行を許されたのは･･･、ラストボックスをもたぬ異次元の人間または、スペシャリストのみだったのです」"],
            [f_siki, "シキ", "「･･･ラストボックスは･･････この宇宙に住む者と、平行宇宙に住む者を見分けるための識別コードだったのか！！」"],
            [f_empty, "", "シキがホログラフに向かって叫ぶように言った。"],
            [f_empty, "", "ホログラフは全く反応を見せず、更に話を続けた。"],
            [f_fujin, "不人", "「しかし、ミッドポイントと融合したキューブは、それらの機能を全て停止させたために、キューブを守護していたスペシャリスト達はこの宇宙から消え･･･」"],
            [f_fujin, "不人", "「いつかこれら全ての力を解きほどく者として、･･･自分がかつてそうであった･･･動物と人間の亜種･･･、亜人にのみ、挑戦権を許したのです」"],
            [f_siki, "シキ", "「･･････あ･･････亜人だとぉ･･････！！？」"],
            [f_siki, "シキ", "「･･･ふ･･･ざけるな･･･！！！」"],
            [f_siki, "シキ", "「ふざけるな！！！！」"],
            [f_empty, "", "シキはホログラフに向かって電磁ビームガンを放った。"],
            [f_empty, "", "ホログラフはビームと干渉し合い、波上に拡散し消えた。"],
            [f_ruin, "ルイン", "「不人の子･･･！！･･･き、君はペルセポネだね！？」"],
            [f_empty, "", "ルインが、消えたホログラフが立っていた場所へ向かって走りながら叫んだ。"],
            [f_empty, "", "ホログラフが浮き出ていた碑石まで辿り着くと、碑石に向かって更に叫び続けた。"],
            [f_ruin, "ルイン", "「ペルセポネ！！さっきの映像は君が見せたんだね！」"],
            [f_ruin, "ルイン", "「ペルセポネ！！！」"],
            [f_empty, "", "碑石に刻まれたルーンが、ルインの声に反応するかのように強く輝き出した。"],
            [f_empty, "", "その光は、碑石を離れ、ルインの手を伝わって、ルインそのものと同化した。"],
        ]);
        yield s.set(new Img("img/story/s_pic18.jpg"), [
            [f_ruin, "ルイン", "「う、うわあ！！！」"],
            [f_empty, "", "ルインの体内から、青白い光が爆発した。"],
            [f_siki, "シキ", "「ま、まさか･･･ま･･･や、や、やめろ！！！！！！！！」"],
            [f_pea, "ピアー", "「ル、ルイン！！！！」"],
            [f_siki, "シキ", "「お、おまえ･･･おまえが･･････、ゆ、許されないぞルイン！！！」"],
            [f_siki, "シキ", "「すぐにそこから離れろ！！離れるんだ！！」"],
            [f_empty, "", "ルインはそのまま光に呑まれ、尚も閃光は強く巨大化した。"],
            [f_siki, "シキ", "「ル･･････ル･･･イン･･････ンンンン！！！！」"],
            [f_siki, "シキ", "「お、お、お、おまえごとき分際に、力が与えられてたまるか･･････！！！！」"],
            [f_empty, "", "シキの声はもはや光の中のルインには届いていない。"],
            [f_siki, "シキ", "「くそ！！！･･･ブラフマー！！キャンドラ！！！」"],
            [f_empty, "", "シキがそう呼ぶと、ベガやlukaが立つ入り口の扉から、扉そのものを通りぬけて二人の戦士が姿を現した。"],
            [f_luka, "luka", "「な、何！？」"],
            [f_oranpia, "オランピア", "「馬鹿を見たわね、シキ」"],
            [f_oranpia, "オランピア", "「･･･あんな子供に横取りされるな・ん・て」"],
            [f_siki, "シキ", "「まだ間に合う！！」"],
            [f_siki, "シキ", "「はやくあいつを殺せ！！！！！！！」"],
            [f_pea, "ピアー", "「シキぃ、貴様ぁ！！」"],
            [f_siki, "シキ", "「はやくしろ！ブラフマー！！」"],
            [f_oranpia, "オランピア", "「フン･･･」"],
            [f_oranpia, "オランピア", "「ドラギャレット･･･射っていいわよ」"],
            [f_empty, "", "オランピアがそう言うと、ドラギャレットは自分の前髪を一本引き抜き、念を唱えた。"],
            [f_empty, "", "緑色をした髪の毛は見る見るうちに長い矢へとその身を変え、彼の右手におさまった。"],
            [f_empty, "", "自分の身長程もあるエデン族の三日月弓を、ドラギャレットはその長い手で思い切り引いた。"],
            [f_empty, "", "一瞬、時が永遠に止まってしまうかのような、恐ろしく冷たい空気が周囲に張り詰め･･･"],
            [f_empty, "", "･･･次の瞬間、ドラギャレットは矢を射った。"],
            [f_empty, "", "矢は、緑の光線となって真っ直ぐに空を切った。"],
            [f_dora, "ドラギャレット", "「･･･！」"],
            [f_empty, "", "そのままルインの心臓へと辿り着こうとしていたその光は、ルインに到達する事無く途中で遮られた。"],
        ]);
        yield s.set(new Img("img/story/s_pic26.jpg"), [
            [f_oranpia, "オランピア", "「ば･･･馬鹿な･･･」"],
            [f_oranpia, "オランピア", "「･･･月夜の矢を･･･掴ん･･････だ･･･」"],
            [f_empty, "", "ドラギャレットの放った矢は、一人の青年の手によって、ルインの元へ届く途中の空間で掴みとられていた。"],
            [f_oranpia, "オランピア", "「･･････そ、そんな･･･空間を呑み込む闇の矢よ･･････」"],
            [f_empty, "", "オランピアは、信じられないといった驚愕の表情を浮かべ、青年を見た。"],
            [f_exe, "エグゼ", "「誰だい･･･君達は･･･」"],
            [f_empty, "", "青年は、自分が掴んだ矢を見つめながら静かに言った。"],
            [f_siki, "シキ", "「う、後だ！！！」"],
            [f_empty, "", "シキがオランピアに叫んだ。"],
            [f_empty, "", "オランピアとドラギャレットが慌てて振り向くと、すぐ背後に見知らぬ人間の女と亜人が立っていた。"],
            [f_yoruko, "夜子", "「･････････」"],
            [f_jiyuu, "ジユウ", "「･････････」"],
            [f_oranpia, "オランピア", "「･･･いつの間に･･･」"],
            [f_empty, "", "オランピアの引きぬいた大剣が一瞬で振り下ろされ地面に着地した。"],
            [f_empty, "", "人間の女と亜人の二人は、オランピアの反対側に移動していた。"],
            [f_dora, "ドラギャレット", "「オランピア･･･下がれ･･･、数の分が悪い･･･」"],
            [f_empty, "", "ドラギャレットは離れた位置で、床に魔法陣を刻んでいる。"],
            [f_oranpia, "オランピア", "「何を呼ぶ！･･･爺様達は戦場だぞ！！」"],
            [f_dora, "ドラギャレット", "「ラプソディアだけだ･･･、他の天子は呼ばない･･･」"],
            [f_empty, "", "言い終わる前に、床に刻まれた魔法陣が閻魔天子ラプソディアを呼び寄せた･･･！"],
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
        Util.msg.set("第22話『人間にあらず者』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    Story2.runMain23 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_exe = new Img("img/face/p_exe.jpg");
        const f_rap = new Img("img/face/p_rap.jpg");
        const f_oranpia = new Img("img/face/p_oranpia.jpg");
        const f_siki = new Img("img/face/p_siki.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_ruin = new Img("img/face/p_ruin.jpg");
        const s = new Story();
        yield s.set(Img.empty, [
            [f_empty, "", "ドラギャレットの魔法陣が空間を歪ませ、一人の天子を呼び寄せた。"],
        ]);
        yield s.set(new Img("img/story/s_pic27.jpg"), [
            [f_exe, "エグゼ", "「！･･･この塔の壁を超えて転移してきたのか･･･」"],
            [f_exe, "エグゼ", "「･･･この奇妙な矢といい、君達･･･何者だい･･･？」"],
            [f_empty, "", "召喚された天子は、ゆっくりと着地すると、鋭い目でエグゼ等３人を睨んだ。"],
            [f_rap, "ラプソディア", "「それはこっちが聞きたいのぅ･･･」"],
            [f_rap, "ラプソディア", "「アグニの爺様を残してきてまで、ワシを呼ぶとは･･･」"],
            [f_rap, "ラプソディア", "「･･･オランピアよ。･･･よほどの急時じゃろうのぅ？」"],
            [f_oranpia, "オランピア", "「そうよ･･･」"],
            [f_rap, "ラプソディア", "「ふぅむ･･････あやつら何者じゃ」"],
            [f_empty, "", "ラプソディアは尋常ではない力を感じ取ったのか、エグゼ等から視線を離そうとしない。"],
            [f_siki, "シキ", "「閻魔天子･･･っ、そいつらは恐らくキューブを守護するスペシャリストだ･･･！」"],
            [f_rap, "ラプソディア", "「スペシャリストじゃと？」"],
            [f_rap, "ラプソディア", "「･･･ほぅぉ･･･オクタビー伝説に登場する不老不死のスペシャリストか？」"],
            [f_siki, "シキ", "「そうだ･･･」"],
            [f_rap, "ラプソディア", "「本当じゃろうのぅ･･･？嘘をつくと舌をひっこ抜くぞ」"],
            [f_siki, "シキ", "「あの子供が碑石に触れた途端、突然出現した･･･間違いない･･･」"],
            [f_rap, "ラプソディア", "「ほぅ･･････、ムフフ･･･」"],
            [f_empty, "", "ラプソディアはルインの方を一瞥すると、エグゼ達に再び視線を戻し不気味な笑い声をあげた。"],
            [f_rap, "ラプソディア", "「伝説のスペシャリストと戦えるというのか？」"],
            [f_rap, "ラプソディア", "「･･･ムフフ･･･ならば面白い･･･」"],
            [f_rap, "ラプソディア", "「三対三というわけじゃな･･･よくぞワシを呼んだ！」"],
        ]);
        yield s.set(new Img("img/story/s_pic25.jpg"), [
            [f_ruin, "ルイン", "（･･･ピアー･･･！）"],
            [f_pea, "ピアー", "「･･･！？」"],
            [f_empty, "", "ラプソディア達の様子にただ困惑していたピアーは、突然脳内に直接響いてきたルインの声にびっくりした。"],
            [f_ruin, "ルイン", "（･･･lukaとベガを･･･連れて、こっちへ･･･！）"],
            [f_empty, "", "見ると、ルインが碑石が放つ光の中で、微かに瞳を開けこちらを見ていた。"],
            [f_empty, "", "ピアーはlukaとベガに合図を送り、ルインの元へ走り出した。"],
            [f_siki, "シキ", "「･･･！･･･」"],
            [f_siki, "シキ", "「行かせるか！！」"],
            [f_empty, "", "シキがすぐさまピアー達に向けて電磁ビームガンを撃った。"],
            [f_empty, "", "ビームは、シキとピアー達を遮る見えない力の壁にぶち当たり消えた。"],
            [f_siki, "シキ", "「･･･何！？」"],
            [f_oranpia, "オランピア", "「今は無理よ、シキ」"],
            [f_oranpia, "オランピア", "「･･･貴方の言った通り、こいつらはキューブを･･･ルイン達を守護しているのよ」"],
            [f_siki, "シキ", "「･･･く･･･！」"],
            [f_empty, "", "ピアー達がルインの元へ辿り着くと、碑石が放つ光がルイン共々ピアー達を飲む込んだ。"],
            [f_empty, "", "そして光が消えると同時に、ルイン達の姿はもうそこにはなかった。"],
            [f_siki, "シキ", "「･･･くそぉぉぉぉぉ！！！」"],
            [f_exe, "エグゼ", "「･････････」"],
            [f_rap, "ラプソディア", "「さぁて、いくぞよ！」"],
            [f_empty, "", "ラプソディアの掛け声と共に、３人のスペシャリスト達と３人の十二天子達との壮絶なる戦いが始まった･･･！"],
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
        Util.msg.set("第23話『ラプソディア召喚』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
})(Story2 || (Story2 = {}));
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
        const f_oranpia  = new Img("img/face/p_oranpia.jpg");
        const f_dora  = new Img("img/face/p_dora.jpg");
        const f_exe  = new Img("img/face/p_exe.jpg");
        const f_yoruko  = new Img("img/face/p_yoruko.jpg");
        const f_jiyuu  = new Img("img/face/p_jiyuu.jpg");

    export const runMain23 = async()=>{
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
