import { Util } from "./util.js";
import { cwait } from "./undym/scene.js";
import { Color } from "./undym/type.js";





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
                "白川乱造「･･･。国王はお変りになられた･･･」",
                "そして、お前もだ。シキ。",
                "母さんの遺志すら、今のおまえには歪み間違って映っておる」",
                "シキ「好きに言うがいいよ。１号を逃がした罪は償ってもらうよ･･･！」",
                "白川乱造「な、何をするんじゃ！わしはおまえの父じゃぞ！」",
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
}