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
    /**6666階クリア. */
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
    //塔6666階クリア2回目
    Story2.runMain24 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_luka = new Img("img/face/p_luka.jpg");
        const f_pea = new Img("img/face/p_pea.jpg");
        const f_0 = new Img("img/face/p_0.jpg"); //ピンク髪
        const f_02 = new Img("img/face/p_02.jpg"); //にやり
        const f_03 = new Img("img/face/p_03.jpg"); //力み顔
        const f_1 = new Img("img/face/p_1.jpg");
        const s = new Story();
        yield s.set(Img.empty, [
            [f_empty, "", "ピアーは突然の出来事に、状況を把握するのに数秒の時間を要した。"],
            [f_empty, "", "自分の腕の中で、ルインが気を失って眠っていた。"],
            [f_empty, "", "lukaとベガはすぐ後にいる･･･。"],
            [f_empty, "", "周囲には太い柱が何本も立ち、壁はなく外から強い風が吹き込んできていた。"],
            [f_pea, "ピアー", "「ここは･･････」"],
            [f_empty, "", "頭上で物凄い轟音が響き、天井から砂がパラパラと落ちた。"],
            [f_luka, "luka", "「･･･さっきのすぐ下の階よ･･･、ここを通って中枢室に上がったのを覚えているでしょ」"],
            [f_empty, "", "lukaがピアーに言った。"],
            [f_pea, "ピアー", "「瞬間移動したのか？･･･ルインがやったのか･･･」"],
            [f_luka, "luka", "「たぶんそうね･･･でも、どうしてここなのかしら･･･」"],
            [f_empty, "", "確かに、もっと遠くへ飛べば、すぐ階上の危険からは遠ざかれる･･･ルインにはこれが精一杯だったのだろうか･･･、とピアーは考えた。"],
            [f_empty, "", "その時、下の階段から何者かが上がってくるのが分かった。"],
            [f_empty, "", "ピアー達は急いで身構えた。"],
            [f_0, "", "「･････････」"],
            [f_luka, "luka", "「い、一号！！！！」"],
            [f_luka, "luka", "「良かった･･･もう治ったのね！？」"],
            [f_empty, "", "lukaが走り寄ろうとした時、一号は腰から暗黒剣を引きぬきlukaに向かって振り下ろした。"],
            [f_luka, "luka", "「キャッ！！」"],
            [f_empty, "", "lukaは寸での所で退いた。"],
            [f_pea, "ピアー", "「なにしとんじゃっ一号！！！！」"],
            [f_0, "", "「残念だったなぁ･･････」"],
            [f_0, "", "「･･････わしが一号じゃのうて」"],
            [f_pea, "ピアー", "「･･･！？」"],
            [f_0, "", "「もうじき死ぬアンタらに言うてもしゃーないけんど･･･、わしは一号とはちゃうで･･･」"],
            [f_empty, "", "驚くlukaに向かって、男はもう一度剣を振った。"],
            [f_empty, "", "ベガの巨大な尻尾が、素早く男の剣をはじき返した。"],
            [f_luka, "luka", "「あ、貴方･･･だれなの･･･」"],
            [f_0, "", "「名前なんかあらへんわ･･････」"],
            [f_empty, "", "男は不快そうな表情で答えた。"],
            [f_0, "", "「そやな･･･あいつが一号やったら･･････、わしは零号っちゅうことか、あほらし･･･」"],
            [f_luka, "luka", "「･･･ぜ･･･零号･･････」"],
            [f_0, "零号", "「あー･･･うるせぇ･･･うるせぇ･･･」"],
            [f_0, "零号", "「あいつには因子があって、わしにはない？･･････それがどしたっちゅーねん･･･」"],
            [f_0, "零号", "「わしにはあいつが持ってへんこの力がある･･････！！！」"],
            [f_03, "零号", "「この力がなぁ！！！！！！」"],
            [f_empty, "", "零号がそう叫ぶと、零号の髪は赤く染まり、体中に無数の傷跡と赤い体毛が浮かび上がった。"],
        ]);
        yield s.set(new Img("img/story/s_pic29.jpg"), [
            [f_empty, "", "その次に零号が振り下ろした剣は、今度こそベガでも返しきれず、巨大なベガの体がドシンと吹き飛ばされた。"],
            [f_empty, "", "すかさずピアーが術を放ったが、零号の剣気がそれを打ち消し、零号はピアーに体当たりをかけて気絶させた。"],
            [f_luka, "luka", "「や、やめて！！」"],
            [f_empty, "", "lukaが引きがねを引くより前に、零号の剣より放たれた暗黒波がlukaを襲った。"],
            [f_luka, "luka", "「キャアアアアアアア！！」"],
            [f_empty, "", "lukaの全身に暗黒のエネルギーが痛みを伴って突き走る･･･。"],
            [f_empty, "", "lukaはバタリと力無く崩れ落ちた。"],
            [f_02, "零号", "「ほうら見てみぃ･･･」"],
            [f_02, "零号", "「わしは一号より強いんじゃ･･･」"],
            [f_luka, "luka", "「ぅ･･･ぅ･･･た･･･すけて･･･」"],
            [f_empty, "", "瀕死で横たわるlukaの上から、零号が見下ろした。"],
            [f_02, "零号", "「･･･うるせぇ･･･うるせぇ･･･」"],
            [f_03, "零号", "「･･････死ねやぁぁぁぁ！！！」"],
            [f_empty, "", "零号が止めを刺そうと剣を思いきり振り下ろそうとしたその時･･･"],
            [f_empty, "", "零号の真横から、白い巨獣が物凄い速さで突っ込み、零号を突き飛ばした。"],
            [f_empty, "", "零号は柱の１本に叩きつけられ、柱は衝撃に耐えきれずに壊れた。"],
            [f_empty, "", "lukaの前に、大きな翼を広げた白い獣が立ち、ゴロゴロと喉を鳴らした。"],
            [f_empty, "", "白翼獣の背には、見覚えのある戦士が乗っていた。"],
        ]);
        yield s.set(new Img("img/story/s_pic30.jpg"), [
            [f_luka, "luka", "「一･･･ご･･･う･･･」"],
            [f_luka, "luka", "「今度こそ･･･本当･･･だよ･･･ね･･･」"],
            [f_1, "一号", "「遅くなってごめん･･･」"],
            [f_luka, "luka", "「良かった･･････一号･･･」"],
            [f_1, "一号", "「ルインの声が聞こえたんだ･･･ここにいるって･･･」"],
            [f_luka, "luka", "「･･･この子･･･雪？」"],
            [f_empty, "", "一号の隣からlukaを覗きこむ白翼獣の鼻を撫で、lukaは言った。"],
            [f_1, "一号", "「そうだよ･･･」"],
            [f_empty, "", "lukaはにっこりと笑い、そして気を失った。"],
            [f_empty, "", "一号は、ピアーとlukaとルインの３人を雪の背に乗せた。"],
            [f_03, "零号", "「ま･･･まてや･･･」"],
            [f_empty, "", "柱の瓦礫の中から、零号がヨロヨロと立ち上がった。"],
            [f_1, "一号", "「･････････」"],
            [f_empty, "", "一号は、零号をチラリと睨み見たが、何も言わず･･･"],
            [f_empty, "", "雪の背にまたがると、ベガと共に、外へと飛び立った。"],
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
        Util.msg.set("第24話『0』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    //塔地下200階クリア
    Story2.runMain25 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_jisrof = new Img("img/face/p_jis.jpg");
        const f_jisrof2 = new Img("img/face/p_jis2.jpg"); //泣き顔
        const f_nana = new Img("img/face/p_nana.jpg");
        const s = new Story();
        yield s.set(Img.empty, [
            [f_empty, "", "･･･しっかりしろ･･････"],
            [f_empty, "", "･･････目を醒ましてくれ･･･！！"],
            [f_empty, "", "･･･ナナ･････････"],
            [f_empty, "", "･･･ナナ･･････！！"],
        ]);
        yield s.set(new Img("img/story/s_pic31.jpg"), [
            [f_nana, "ナナ", "「･･･こ･･･ここは･･･？」"],
            [f_jisrof2, "ジスロフ", "「よ･･･良かった･･･ナナ･･･」"],
            [f_nana, "ナナ", "「･･･涙出てるよ･･･ジスロフ･･･？」"],
            [f_jisrof2, "ジスロフ", "「･･････もう１週間も目を醒まさなかったんだ」"],
            [f_nana, "ナナ", "「え、僕そんなに眠ってた･･･？」"],
            [f_jisrof2, "ジスロフ", "「ああ･･･」"],
            [f_jisrof, "ジスロフ", "「憶えてるか？･･･あの世界の事を･･･」"],
            [f_nana, "ナナ", "「え･･･」"],
            [f_jisrof, "ジスロフ", "「臥竜の妄想に囚われ、俺達は臥竜の意識の中にいた」"],
            [f_nana, "ナナ", "「･･･が、臥竜･･････」"],
            [f_nana, "ナナ", "「はっ･･･、プ、プリンスとおしゃまは！？･･･」"],
            [f_jisrof, "ジスロフ", "「ここにはいない･･･。あの世界にいたプリンスとおしゃまが本物かどうかも定かではない」"],
            [f_jisrof, "ジスロフ", "「臥竜の妄想が創り出した産物だったかもしれないから」"],
            [f_nana, "ナナ", "「･･････僕達は･･･どうなったの？」"],
            [f_jisrof, "ジスロフ", "「臥竜は、冥符王朝の高官によって覚醒させられたんだ」"],
            [f_jisrof, "ジスロフ", "「臥竜が目覚めると共に、俺達は妄想からはじき出された･･･」"],
            [f_nana, "ナナ", "「･･･そうか･･････」"],
            [f_nana, "ナナ", "「ここは･･･冥界だね･･･」"],
            [f_jisrof, "ジスロフ", "「ああ･･･」"],
            [f_nana, "ナナ", "「あの世界にいた時･･･声が聞こえた･･･」"],
            [f_jisrof, "ジスロフ", "「え？」"],
            [f_nana, "ナナ", "「･･･死神の声･･･」"],
            [f_jisrof, "ジスロフ", "「俺も聞いたよ」"],
            [f_nana, "ナナ", "「･･････僕達を無事ここに戻してくれたのは死神さんかもしれないね･･･」"],
            [f_jisrof, "ジスロフ", "「そうだな･･･そうかもしれない」"],
            [f_empty, "", "二人は冥界の空を見上げた。"],
            [f_nana, "ナナ", "「･･･ジスロフ、空の色がおかしいよ･･･、以前の冥土の底とは違う･･･」"],
            [f_jisrof, "ジスロフ", "「ナナが眠っている間も、ずっとこうだった」"],
            [f_jisrof, "ジスロフ", "「冥界全体が変質しているんだ」"],
            [f_nana, "ナナ", "「どういうこと？」"],
            [f_jisrof, "ジスロフ", "「冥界の王が変わったからだ･･･」"],
            [f_nana, "ナナ", "「！･･････」"],
            [f_empty, "", "ナナは、その言葉を聞いてようやく妄想世界での全ての出来事を思い出した。"],
            [f_empty, "", "臥竜が、自分が目覚めてしまう事で死神が現冥界王の資格を失う事を恐れ、覚醒を拒んだ事･･･"],
            [f_empty, "", "冥界王朝の者が現れ、臥竜の覚醒を強いた事･･･"],
            [f_empty, "", "臥竜の目覚めによって、死神が無に帰してしまった事･･･"],
            [f_nana, "ナナ", "「死神･･･さん･･･」"],
            [f_empty, "", "ナナの目からすっと一筋の涙が流れた。"],
            [f_jisrof, "ジスロフ", "「以前の冥界とは違う･･･」"],
            [f_jisrof, "ジスロフ", "「これからは俺達の周囲の死も、新たな死の法によって裁かれる」"],
            [f_jisrof, "ジスロフ", "「もう死神の守護は受けられないんだ･･･」"],
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
        Util.msg.set("第25話『冥界王の目覚め』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    //冥土の底クリア
    Story2.runMain26 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_jisrof = new Img("img/face/p_jis.jpg");
        const f_nana = new Img("img/face/p_nana.jpg");
        const s = new Story();
        yield s.set(new Img("img/story/s_pic32.jpg"), [
            [f_empty, "", "かつて多くの魂で賑わっていた冥土の底も、ジスロフ達が目覚めた時にはただの荒地と化していた。"],
            [f_empty, "", "冥界王朝の変革は、冥界全土において様々な変化をもたらした。"],
            [f_empty, "", "魂は肉体化し、それまで無縁だった痛みや空腹がリアルに迫るようになった。"],
            [f_empty, "", "親睦的なクグワ達は、狂気に触れ野獣と化し、残った魂人達を襲い続けていた。"],
            [f_jisrof, "ジスロフ", "「ここで調達できる食料も、今日が限界だろう･･･」"],
            [f_jisrof, "ジスロフ", "「気温も下がってきているようだ･･･」"],
            [f_nana, "ナナ", "「･･･僕はまだ平気だよ」"],
            [f_jisrof, "ジスロフ", "「無理しなくていいナナ･･･」"],
            [f_empty, "", "少しでもジスロフの負担にならないようにと強気をはるナナの姿を、ジスロフは優しい眼差しで見つめ、そっと自分の上着をナナの肩に羽織らせた。"],
            [f_jisrof, "ジスロフ", "「･･･冥界の変質は、俺達に肉体を与えた･･･」"],
            [f_jisrof, "ジスロフ", "「死が無なら、俺達はまだ常界に戻れるのかもしれない」"],
            [f_nana, "ナナ", "「！･･･そうかもしれないよ、ジスロフ」"],
            [f_nana, "ナナ", "「･･･でも･･･、出口とかってあるのかな･･･」"],
            [f_jisrof, "ジスロフ", "「俺にも分からない･･･。しかし、冥界王朝の場所なら分かる」"],
            [f_empty, "", "そう言って、ジスロフは空を見上げた。"],
            [f_nana, "ナナ", "「そうか、雲の流れ･･･」"],
            [f_empty, "", "変質前は雲１つ無かった空に、今では禍々しい黒い雲が物凄い速さで移動している。"],
            [f_empty, "", "その流れは、ある一点から放射状に移動していた。"],
            [f_jisrof, "ジスロフ", "「ああ･･･この雲を吐き出している場所が、おそらく冥界王朝･･･」"],
            [f_empty, "", "ジスロフ達は冥土の底に別れを告げ、暗雲のはじまる場所を目指し旅立った。"],
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
        Util.msg.set("第26話『暗雲の始まる場所』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    //ハデスの腹クリア
    Story2.runMain27 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_jisrof = new Img("img/face/p_jis.jpg");
        const f_nana = new Img("img/face/p_nana.jpg");
        const s = new Story();
        yield s.set(new Img("img/story/s_pic32.jpg"), [
            [f_empty, "", "ジスロフとナナが歩いていると、紫死草の茂みから音が聞こえた。"],
            [f_jisrof, "ジスロフ", "「何かいる･･･」"],
            [f_empty, "", "ジスロフが警戒しながら茂みの中を覗こうとすると、中から幽霊猫が飛び出してきた。"],
            [f_empty, "", "見ると、幽霊猫の口には小さな白い鳥がくわえられていた。"],
            [f_empty, "", "ナナは、ゆっくりと幽霊猫に近づくと、口から鳥を取り出した。"],
            [f_nana, "ナナ", "「ジスロフ、この鳥、まだ生きてるよ」"],
            [f_jisrof, "ジスロフ", "「ん･･･？」"],
            [f_empty, "", "白い鳥は、ナナの掌の上でゆっくりと起き上がり、ナナの顔を見つめた。"],
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
        Util.msg.set("第27話『白い鳥』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    //魂人の廃都クリア
    Story2.runMain28 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_syao = new Img("img/face/p_syao.jpg");
        const f_jisrof = new Img("img/face/p_jis.jpg");
        const f_nana = new Img("img/face/p_nana.jpg");
        const s = new Story();
        yield s.set(Img.empty, [
            [f_syao, "小鬼", "「･･･ははーん、緑の髪に、桜色の獣耳･･･」"],
            [f_syao, "小鬼", "「美奈枢様の言った通りだ」"],
            [f_empty, "", "ジスロフ達の後から声が聞こえた。"],
            [f_empty, "", "見ると、ジスロフ達の後方上空４メートルほどの空中に、少年が両足から紫の炎を出しながら浮遊していた。"],
        ]);
        yield s.set(new Img("img/story/s_pic33.jpg"), [
            [f_jisrof, "ジスロフ", "「誰だ･･･」"],
            [f_syao, "小鬼", "「俺はシャオグイ、あんた達を殺しにきたんだけど」"],
            [f_jisrof, "ジスロフ", "「誰の差しがねだ、冥界王朝か」"],
            [f_syao, "小鬼", "「あったりぃ」"],
            [f_syao, "小鬼", "「美奈枢様が、界王様の邪魔になるからあんた達を殺せってさ」"],
            [f_jisrof, "ジスロフ", "「美奈枢･･･」"],
            [f_syao, "小鬼", "「生首だけあればいいらしいから、切らせてもらえる？」"],
            [f_jisrof, "ジスロフ", "「ナナ･･･気をつけろ」"],
            [f_nana, "ナナ", "「うん･･･」"],
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
        Util.msg.set("第28話『紫の刺客』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
    //ハデスの口クリア
    Story2.runMain29 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_syao = new Img("img/face/p_syao.jpg");
        const f_vinus = new Img("img/face/p_vinus.jpg");
        const s = new Story();
        yield s.set(new Img("img/story/s_pic34.jpg"), [
            [f_empty, "", "･･･王朝宮のとある一室にて･･･"],
            [f_vinus, "美奈枢", "「･･･シャオグイか」"],
            [f_empty, "", "寝台で眠りについていた美奈枢の目がゆっくり開いた。"],
            [f_syao, "小鬼", "「へへ、美奈枢様には絶対気づかれちゃうなー」"],
            [f_empty, "", "寝台の脇の暗闇から、小鬼の体が幽霊のように浮かび上がり実体化した。"],
            [f_vinus, "美奈枢", "「･･･？･･･、血の臭いがしないぞ」"],
            [f_syao, "小鬼", "「聞いてよ、美奈枢様っ、あの獣耳の男･･･」"],
            [f_empty, "", "美奈枢は布団をどけ寝台から降りると、小鬼の目の前まで行き、右の頬を力強くぶった。"],
            [f_empty, "", "室内にバシンッという音が散った。"],
            [f_vinus, "美奈枢", "「何故殺さなかった、殺せと言ったはずだ」"],
            [f_syao, "小鬼", "「だ･･･、だって･･･」"],
            [f_empty, "", "小鬼の目に、いっぱいの涙が浮かんだ。"],
            [f_syao, "小鬼", "「･･･あいつ凄く強いんだっ、強くて･･･もっと遊びたくなったんだ･･･」"],
            [f_vinus, "美奈枢", "「甘くみるな･･･、奴はチュルホロ王族だ」"],
            [f_vinus, "美奈枢", "「今は臥竜界王様の力のおかげで、羅文の真の力を発揮できないでいるだろう」"],
            [f_vinus, "美奈枢", "「だが、臥竜界王様の力がいつまでもあると思うな」"],
            [f_syao, "小鬼", "「大丈夫だよっ･･･、あいつは強いけど･･･、それにその羅文とかっていう力を出しても、俺に勝てるわけがないよっ！」"],
            [f_vinus, "美奈枢", "「シャオグイ･･･」"],
            [f_vinus, "美奈枢", "「確かにおまえは強い･･･」"],
            [f_empty, "", "小鬼は美奈枢の口から強いと言われ、嬉しそうな顔をした。"],
            [f_vinus, "美奈枢", "「･･･だがおまえの精神はまだ幼い」"],
            [f_empty, "", "小鬼の顔から笑みが消える。"],
            [f_vinus, "美奈枢", "「･･･その子供心が･･･、いつかおまえの命取りになる･･･」"],
            [f_syao, "小鬼", "「俺は･･･強い･･･」"],
            [f_empty, "", "小鬼は俯いて涙をふきながら呟いた。"],
            [f_syao, "小鬼", "「美奈枢様･･････」"],
            [f_syao, "小鬼", "「俺は･･･」"],
            [f_syao, "小鬼", "「俺は･･･、強いんだよおおおおおお･･･！！！！！！」"],
            [f_empty, "", "小鬼が叫び声をあげると共に、小鬼の髪の毛は逆立ち、全身から紫の炎が吹き出た。"],
            [f_vinus, "美奈枢", "「もうじき、奴はここまでくるだろう」"],
            [f_vinus, "美奈枢", "「次こそ、殺すんだ･･･」"],
        ]);
        /*
                [f_empty,  "",        ""],
                [f_syao,   "小鬼",    ""],
                [f_vinus,  "美奈枢",  ""],
        */
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
        Util.msg.set("第29話『小鬼の涙』", Color.L_GRAY);
        Sound.moji.play();
        yield cwait();
    });
})(Story2 || (Story2 = {}));
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

    export const runMain28 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic21.jpg"),
            [
                [f_empty,  "",        ""],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.L_GRAY); Sound.moji.play(); await cwait();
        Util.msg.set("第n話『』", Color.L_GRAY); Sound.moji.play(); await cwait();
    };
 */ 
