import { Util, Place } from "./util.js";
import { cwait } from "./undym/scene.js";
import { Color, Rect } from "./undym/type.js";
import { Battle } from "./battle.js";
import { BattleScene } from "./scene/battlescene.js";
import { Graphics, Img } from "./graphics/graphics.js";
import { ILayout } from "./undym/layout.js";
import { Unit } from "./unit.js";





export abstract class Story{


    async abstract run();

    protected async defMsg(msgs:string[]){
        for(const msg of msgs){
            Util.msg.set(msg, Color.L_GRAY); await cwait();
        }
    }
}



export namespace Story{
    export const MAIN_1:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "シキ「父さん！！父さんだな！",
                "どうして１号を逃がした！･･･貴重な初号体なのに･･･！」",
                "白川乱造「･･･おまえはもうわしの子ではない･･･。",
                "人が人たるべく持つ大切な物を、お前は煩悩の霧中に見失ってしまったのだ」",
                "シキ「くそ！･･･父さんはもう新プロジェクトの方には加わらせないよ」",
                "白川乱造「新プロジェクトだと･･･？",
                "･･･まさか、エデンの園の発掘を再開するのか！」",
                "シキ「そうさ･･･、これで、やっと母さんの遺志を継ぐことができるんだ･･･！」",
                "白川乱造「ならんぞ！･･･いかに国王の命と言えど、これ以上エデンを汚すことはならん！」",
                "シキ「おや？国王への忠誠心を僕に誓わせたのは父さんだよ？」",
                "白川乱造「･･･。国王はお変りになられた･･･。",
                "そして、お前もだ。シキ。",
                "母さんの遺志すら、今のおまえには歪み間違って映っておる」",
                "シキ「好きに言うがいいよ。１号を逃がした罪は償ってもらうよ･･･！」",
                "白川乱造「な、何をするんじゃ！わしはおまえの父じゃぞ！",
                "は、離せ！わしを閉じこめる気か！シキ！",
                "シキーッ！！！」",
                "シキ「父さん･･･、僕は母さんの遺志を見誤っちゃいない･･･。",
                "エデンに眠りし偉大なる力が僕を呼んでる･･･！",
                "母さん･･･、見てて･･･。僕はやってみせる･･･」",
                "雪「兄さん･･･、それでいいんだよ」",
                "シキ「雪･･･」",
                "雪「兄さんは間違っちゃいない、それでいいんだ」",
                ".",
                ".",
                ".",
                "第1話『父と子と母の遺志』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_2:Story = new class extends Story{
        async run(){
            await this.defMsg([
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
                ".",
                ".",
                "第2話『温もりは思い出の向こう』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_3:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "ルインドアース･･･",
                "そこは、ぼくのいたアケローン地球とほぼ同じ環境状態だった。",
                "大地と海は、汚染と荒廃の限界を辿り、",
                "....空には重水素の雲が光を遮断していた。",
                "光と言えど、それは生物を焼き尽くす剥き出しの光線に過ぎず、",
                "たまに大地に振り注いでは、土と微生物を焼き尽くした。",
                "ぼくにはもう、それらに耐えうる強靭な肉体はないのだ。",
                "ピアー「自殺行為か！！くそっ！",
                "しっかりせーっ、おいっ！！」",
                "ルイン「あぁぁ....ぁぁ....」",
                "ピアー「なんじゃこいつは....すっ裸でなんしとん！",
                "....まじで自殺する気だったんか！？",
                "地下路の入り口まで少しある....もう少し辛抱せーっ....！」",
                "ルイン「あり･･がとう･･」",
                "ピアー「じ、自殺なんぞさせんぞ、自殺、自殺....！！」",
                "でも、ここにはあっちにはなかったものがあった。",
                "ヒトだ....。",
                "....この星には、ヒトがいた。",
                ".",
                ".",
                ".",
                "第3話『最悪条件下においても』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_4:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "ピアー「よし、まだ意識はあんな。",
                "ほら、ここがオレんちだ」",
                "塔の入り口から内部へ....そこからかなり降りた所に、ピアーの家はあった。",
                "ピアーが扉を開くと、中から小さい子供達がいっせいに飛び出してきた。",
                "「あんちゃん、これ誰！？」",
                "「裸！！裸！！あんちゃんが裸の人連れてきた！！」",
                "「あんちゃん、この人死んどん！？自殺？！」",
                "ピアー「うるせえ、手伝えっ！",
                "そらっ、オラのベッドだ。",
                "よし･･･ヒドイのは肩と腕だけだな･･･。",
                "眼も肺も異常なさそうだ･･･」",
                "ルイン「僕は･･･」",
                "ピアー「良くなるまで大人しくしてな、動くと自殺行為じゃ」",
                "ルイン「･･･」",
                "ピアーは「塔」と呼ばれる巨大な建造物の地下に住んでいた。",
                "太古の数々の惨劇の中で、この星から山と谷が消え、大地と海がどれほど平坦化しようとも",
                "唯一、その「塔」だけは残りつづけ、今尚、この星でたった１つの巨大人口建造として聳え立っていた。",
                "そして、ピアーによれば、この星で生存し続ける人類の９９％が、この塔の地下にスラムを形成し生き延びているという。",
                "言わばこの塔は、この死の星における最後の砦なのだ。",
                "それから１０年が過ぎた･･･。",
                ".",
                ".",
                ".",
                "第4話『地球に捨てられた人々』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_5:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "惑星チュルホロ跡地にできた無重力スラム・キングスター･･･",
                "そこには、帝国政権に刃向かう多くの反乱分子達の住家があった。",
                "雪率いる白蛇の部隊は、キングスターの壊滅を命じられ、残留する人々を一掃していた。",
                "雪「フン、てこずらせやがって･･･」",
                "luka「助けて！」",
                "雪「まだ子供か･･･、こんな奴にテロを起こされてたとは」",
                "luka「逃がしてくれるなら･･････、スカートの下･･･好きにしてもいいわ･･･」",
                "雪「あいにく興味なくてな」",
                "luka「（こいつだ･･･、この顔を覚えてる･･･。",
                "･･･母さんを殺した部隊長だ･･･）」",
                "雪「なんだ？その眼はぁ･･･！」",
                "ドン！",
                "突然、雪の左胸から血が吹き出た。",
                "すぐに撃たれたと分かった。",
                "射線を辿ると、lukaの後の壁上に一人の青年が立っていた。",
                "雪の顔が驚き表情に変わった。",
                "雪「....おまえ....",
                "....まさか一号か！？」",
                "一号「･･･」",
                "雪「フハハハ、生きてたか！",
                "･･･丁度いい、ここで･･･」",
                "雪は発言の途中でフラつき、膝を地面に落とした。",
                "周りの雪の部下が急いで駆け寄るのを、雪は手で払った。",
                "雪「深手か･･･",
                "まあいい･･･。",
                "一号･･･！会えて嬉しいぞ！ハハハハ。",
                "フハハ、人間のフリをして生きてきたのか！？」",
                "一号「･･･」",
                "雪「逃げるのか？",
                "逃げろ逃げろ！！",
                "･･･ふ、また会うだろう･･･、その時がおまえの死ぬ時だ！",
                "フハハハハハハハ」",
                "部下達が雪を担ぎ起こしている間に、lukaと青年はその場を去った。",
                "lukaには、幼い頃から不思議な幸運がまとわりついていた。",
                "両親の居ないlukaを育てたロビンは、彼女にこう言った。",
                "「おまえの母親は幸運の女神のような女だったよ。",
                "どんな困難な盗みも、あいつが微笑めば成功すると信じられたんだ。",
                "おまえは宇宙一ラッキーな女が産んだ子だ。",
                "だから、おまえには女神が憑いている」",
                ".",
                ".",
                ".",
                "第5話『奇跡の子luka』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_6:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "luka「あんたの名前･･･なんて言うの」",
                "一号「･･･一号･･･」",
                "luka「変わった名前･･･」",
                "一号「･･･名前を付けられる前に、両親は死んだ･･･。",
                "俺は、死んだ母親の体内から摘出されて、培養されたんだ」",
                "luka「･･･ジスマがやらせたの？･･･」",
                "一号「ジスマか･･･、いや違うよ･･･。",
                "もっとずっと昔だ。ジスロフが国王だった頃だ」",
                "luka「･･･そんなに？",
                "･･･でも、あなた私と同い年くらいに見えるわ」",
                "一号「ずっと試験管の中にいたから･･･」",
                "かつての帝国国王ジスロフの后だった紗智が自害した後･･･",
                "･･･紗智の遺体はチュルホロ科学班によって保管されていた。",
                "科学班は、輪廻転生の能力を分析するため、紗智の遺体内にあった胎児を摘出した。",
                "脳死状態にあった胎児だが、怪生物を融合させることで甦生に成功し、研究はそのまま進められていった。",
                "長い年月の中、いつしかその実験体には自我が芽生え",
                "･･･ある日、脱走した。",
                "自分の生い立ちや両親の事を知り、ジスロフへの復讐を願うも、その時既にジスロフは冥界にあった。",
                "残るシキや雪、そして現国王ジスマへの復讐だけが、今の彼を生かしていた。",
                "一号「luka･･･、エデンへ行こう」",
                "luka「えっ？」",
                "一号「･･･俺とlukaは同じだよ。",
                "俺達はあいつらを殺すまで、自分の人生を手に入れられない･･･」",
                "luka「一号･･･」",
                "一号「luka、エデンであいつらを殺そう･･･！」",
                "luka「･･･",
                "･･･分かったわ、エデンへ行こう」",
                ".",
                ".",
                ".",
                "第6話『名も無き孤児』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_7:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "ある日、地球に一隻の船が降り立った。",
                "宇宙からの来訪者･･･いや、帰省者だ。",
                "ピアーの話によれば、数年に１度こうした宇宙からの帰省者が現れるのだという。",
                "黒き星海へと出ていった者達は、限られた中での交配を繰り返し、長い星霜の末、種の限界に行き当たるのだ。",
                "そのため、彼らは原種の遺伝子を求め、自分達が一度は捨てたこの星へと舞い戻るのである。",
                "ピアーの弟や妹達は、空から降下してくる巨大な船を見て、兄の体にしがみ付いた。",
                "自分達が連れて行かれるのかもしれないと脅えているのだ。",
                "だが、彼等はこれまでの帰省者とは違っていた。",
                "彼等は高等な文明の武器を持ち出し、地球人達を奴隷とした。",
                "帝国軍と名乗る彼等の目的は、塔を再び機能させることだった。",
                "塔内部に無数に蔓延る、植物と甲殻類の撤去作業に、僕等は駆り出された。",
                "僕達を始め地球人達は、唯一与えられた休憩時間である夜間に、塔の下層部に集まり、密かに反乱の計画を練った。",
                "帝国軍の武力に対抗するため、塔深層部に保管されていた古代地球人が残した武器の使用が検討されたが、誰もその使い道が分からなかった。",
                "長く太陽の光と汚染された大地から逃れる事に精一杯であった地球人達にとって、戦いなどとうの昔に忘れてしまった記憶なのだ。",
                "･･･僕にあの力があれば･･･",
                "･･･アケローンにいた頃の力があれば･･･",
                "背に巨大な翼を持ち、体は銃線を跳ね返す強靭な毛で覆われ、眼から熱光線を放射できたあの力･･･",
                "それでも、愛する友や地球人達を守らねばならないと、僕は思った。",
                "だが、今は弱き地球人だった。",
                ".",
                ".",
                ".",
                "第7話『招かれざる帰省者』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_8:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "シキ「父さん･･･」",
                "白川乱造「シキ･･･」",
                "シキ「父さん･･･、今日やっと古文書を解読できたよ。",
                "･･･何が書いてあったと思う？･･･",
                "遺跡の最奥に封印されてたあの巨大な機械は、兵器じゃない。",
                "あれはコントローラーなんだ」",
                "白川乱造「コントローラー･･･じゃと･･･？",
                "そうか･･･！砲塔に見えたあれは送信塔か･･･！",
                "しかし、あれほど巨大な送信機で何を動かすんじゃ･･･。",
                "あの送信塔の長さと、計算されたエネルギーを考えると･･･",
                "･･･宇宙の端へ電波でも送るつもりかっ･･･」",
                "シキ「さすが父さん。正解だよ。",
                "あの機械の送信先は、地球なんだ」",
                "白川乱造「地球じゃと！？」",
                "シキ「そう･･･父さんの故郷･･･、",
                "･･･１千光年紀前、父さんが捨てた星、ルインドアースだよ」",
                "白川乱造「まさか･･･！」",
                "シキ「父さんは覚えてるだろ？･･･",
                "･･･地球に聳え立つ巨大な塔･･･",
                "人知を超越したブレイン・キューブ･･･",
                "忘れるわけがない･･･",
                "･･･あの時、父さんがキューブを停止させたせいで、地球は生命の住めない星になってしまった･･･",
                "･･･父さんの間違った選択･･･！」",
                "白川乱造「違う！･･･キューブを止めなければワシ達の脱出は不可能じゃった！」",
                "シキ「キューブは人類が地球を捨てる事を許さなかったんだ！",
                "･･･キューブは言ってた！",
                "･･･最後まで地球を守る努力をすれば、太陽風の増幅にも耐えられると！」",
                "白川乱造「ワシ達の計算では、キューブに太陽は止められんかった！」",
                "シキ「その計算に、母さんは異論を唱えていた！」",
                "白川乱造「･･･」",
                "シキ「母さんが封印遺跡を発掘しようとしてたのは、御祖父さんの遺産を発掘するためだと･･･ずっと思ってた。",
                "でも違ったんだ･･･。",
                "母さんは、遺跡に地球塔を起動させる操縦機があることを知ってた･･･。",
                "母さんは･･････",
                "･･･地球を再び救おうとしてたんだ！！」",
                "白川乱造「今更、地球塔を起動させてどうなる･･･！」",
                "シキ「キューブがあれば地球を再建できる！",
                "キューブが提唱してた理論が正しければ、太陽の制御が可能なんだ」",
                "白川乱造「キューブは人知を超えた危険な機械じゃ！",
                "再びキューブは人類を支配下におき、宇宙中にその触手を広げるじゃろう！",
                "忘れたのかシキよ･･･！",
                "･･･ワシ等全ての人類の脳にはラストボックスが埋め込まれておるんじゃぞ！",
                "ワシ等が築かせたこの一大帝国も、キューブにかかれば･･･！！！」",
                "シキ「父さん･･･！この帝国を築いたのはチュルホロ人だよ」",
                "白川乱造「何を言うか･･･っ、",
                "･･･遥か太古、地球から逃れたワシ等人類が、チュルホロ星の下等生物に遺伝子をかけ合わせ･･･",
                "･･････！･･･」",
                "シキ「･･･そうだよ父さん･･･、",
                "･･･彼等チュルホロ人達は、ラストボックスを持たないんだ･･･」",
                "白川乱造「･･････」",
                "シキ「母さんはみんな知ってた･･･」",
                "白川乱造「･･･なんということだ･･･」",
                "シキ「チュルホロ人を生成した時･･･、母さんは執拗にチュルホロ生物の独自性を残そうとしてた。",
                "･･･父さんはあの耳を見て、無駄な物だと反対していたけど･･･",
                "･･･あれは、ラストボックス遺伝子を持たずとも生存できる生命体にするためだったんだ･･･。",
                "･･･いつかキューブを復活させた時、キューブに支配されぬように･･･」",
                "白川乱造「･･････",
                "･･･ハル･･･",
                "･･･ハルよ･･･おまえは･･･」",
                "シキ「キューブが復活しても、彼等ならキューブを支配できる･･･。",
                "彼等･･･チュルホロ人なら･･･」",
                ".",
                ".",
                ".",
                "第8話『紡がれし時の糸』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_9:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "～エデン、封印遺跡内・特設科学研究所内第一実験室～",
                "雪「兄さん･･･いよいよだね」",
                "シキ「ああ･･･",
                "･･･古文書の通りなら、このトレーダーを起動させた瞬間、宇宙の中心を『ヒルトンの道』が貫くはずだ。",
                "そこが･･･地球・木星・エデン・ノーザンバランドの４つの特異点を結ぶ･･･宇宙の黄金律線だ」",
                "シキは、封印遺跡より発掘されしトレーダーを起動させた。",
                "トレーダーは低い唸りと共に青白い光を放つと、空へと向かって一直線に太い光線を放射した。",
                "その数秒後、バリバリという物凄い轟音が響き、そして宇宙に裂け目が生じた。",
                "それが･･･ヒルトンの道･･･別名、アケローンの河だった。",
                "シキ「アケローンの河･･･",
                "･･･内部では実世界の２００億倍の速さで時間が進む宇宙を貫く時の河･･･。",
                "かつて、人類が作り上げた仮想宇宙は、この伝説の河の名をとってアケローン宇宙と名づけられた」",
                "雪「すごい･･･すごいぞ！",
                "すごいや、兄さん！！",
                "僕等の御爺様はこんな凄いものを操る機械を創れたんだね！！」",
                "その時突然、室内に警報が鳴り響いた。",
                "シキ「どうした」",
                "雪「警備兵！！」",
                "すぐに実験室入り口の扉が開いたかと思うと、外から警備兵数名の遺体が投げ込まれた。",
                "入り口の先を見た雪の顔がみるみるうちに怒りで真っ赤になった。",
                "雪「一号ぉぉぉぉぉぉぉおおお！！！！」",
                "一号「こっちから来てやったぞ･･･、俺を待ってたんだろ･･･」",
                "扉から現れたのは、一号とlukaの二人だった。",
                "所内は無防備な研究員がほとんどで、武装された警備兵は数名しかいなかった。",
                "エデン中央市から遠く離れた遺跡では警戒も薄かった。",
                "一号とlukaは、シキ達が軍隊から離れ単独で行動するこの機を狙ったのだ。",
                "一号はすぐに、なんの躊躇いも無く実験室内の他の研究員を全て射殺した。",
                "シキ「一号･･･久しぶりだな･･･」",
                "一号「あんたを殺す」",
                "一号が引きがねを引こうとした瞬間、シキは雪と共にトレーダーが放つ光の中へと身を投じた。",
                "一号「くそ！！」",
                "luka「どこへ行ったの！？あいつら消えたわ･･･！」",
                "一号「行こう･･･」",
                "luka「え？」",
                "一号「俺達も･･･行こう。追いかけるんだ･･･！」",
                "luka「うん！」",
                "二人は勢いよくその光の中へ飛び込んだ。",
                "二人の意識は光の流れの中に溶け、とても深い眠りの中に消えた。",
                "彼等の肉体は、そのままワームホールの中を数百億年をかけて流れ･･･",
                "･･･やがて･･･かつて人類が芽生えた地球という小さな惑星に辿り付いた。",
                ".",
                ".",
                ".",
                "第9話『宇宙を跨ぐ時の河』",
                ".",
                ".",
                ".",
            ]);
        }
    };
    export const MAIN_10:Story = new class extends Story{
        async run(){
            await this.defMsg([
                ".",
                ".",
                ".",
                "",
                ".",
                ".",
                ".",
                "第10話『重なり始める歯車』",
                ".",
                ".",
                ".",
            ]);
        }
    };
}