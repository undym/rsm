var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Img } from "../graphics/texture.js";
import { Story } from "./story.js";
export var Story3;
(function (Story3) {
    Story3.runKabe0 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_kabe = new Img("img/face/p_majo.jpg");
        const s = new Story();
        yield s.set(new Img("img/story/s_pic32.jpg"), [
            [f_kabe, "カベイリア", "「･･････貴方達は何者です？」"],
            [f_kabe, "カベイリア", "「何故、肉体をもっているのです？」"],
            [f_kabe, "カベイリア", "「･･･死法改定によって、全ての魂人は完全霊体となったはずなのに」"],
            [f_kabe, "カベイリア", "「臥竜の妄想の中にいた？？？？」"],
            [f_kabe, "カベイリア", "「臥竜とは臥竜界王のことですか？？」"],
            [f_kabe, "カベイリア", "「そうか･･････、王朝の者たちが必死に探していたのは、貴方達だったのですね･･･」"],
            [f_kabe, "カベイリア", "「私は魔女カベイリアと言います」"],
            [f_kabe, "カベイリア", `「私に肉体があるのも、貴方達と同じ･･･、そう･･･"生きている"から･･･`],
            [f_kabe, "カベイリア", "「貴方達は、私のような冥界との特殊な契約に囚われた者達の希望の光･･･」"],
            [f_kabe, "カベイリア", "「王朝の者達に打ち勝てるよう力を授けましょう･･･」"],
            [f_empty, "", "ジスロフ達は、『時のクリスタル』を手に入れた。"],
            [f_empty, "", "不思議な力がジスロフ達の【最大HP】を+5させた･･･！！"],
        ]);
        s.end();
    });
    //冥土の底でカベイリアイベントを発生させた後、ハデスの腹クリア
    Story3.runKabe1 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_kabe = new Img("img/face/p_majo.jpg");
        const s = new Story();
        yield s.set(new Img("img/story/s_pic32.jpg"), [
            [f_kabe, "カベイリア", "「･･････見つかってしまいましたね」"],
            [f_kabe, "カベイリア", "「ごめんなさい、貴方達をずっとつけて見守っていたのです」"],
            [f_kabe, "カベイリア", "「･･･本心から貴方達が心配だったから･･･」"],
            [f_kabe, "カベイリア", "「王朝のやり方は、常界のように甘くはありません」"],
            [f_kabe, "カベイリア", "「彼らは貴方達の魂そのものを殺すとするでしょう･･･」"],
            [f_kabe, "カベイリア", "「それは死よりも恐ろしい事･･･」"],
            [f_kabe, "カベイリア", "「貴方達の魂が死ねば、死法を歪める術も･･･転生術も･･･叶わぬだけでなく、貴方達の子孫すべてが無になるのです」"],
            [f_kabe, "カベイリア", "「余計なお節介でしょうが、もう少し貴方達をつけさせてもらいます･･･」"],
            [f_kabe, "カベイリア", "「･･･貴方達しかもう･･･冥界に残された常界人を救える者はいないのだから･･･」"],
            [f_empty, "", "ジスロフ達は、『精神のクリスタル』を手に入れた。"],
            [f_empty, "", "不思議な力がジスロフ達の【最大HP】を+10させた･･･！"],
        ]);
        s.end();
    });
    //ハデスの腹でカベイリアイベントを発生させた後、魂人の廃都クリア
    Story3.runKabe2 = () => __awaiter(this, void 0, void 0, function* () {
        const f_empty = new Img("img/face/p_rs.jpg");
        const f_kabe = new Img("img/face/p_majo.jpg");
        const s = new Story();
        yield s.set(new Img("img/story/s_pic32.jpg"), [
            [f_kabe, "カベイリア", "「･･････小鬼･･････あんな暗殺者までが送られてくるなんて･･･」"],
            [f_kabe, "カベイリア", "「なんて恐ろしいの･･････」"],
            [f_kabe, "カベイリア", "「今貴方達がまだ生きているのは偶然ではないのよ･･･」"],
            [f_kabe, "カベイリア", "「あの小鬼という子供が、遊び心でわざと貴方達を生かしたから･･･」"],
            [f_kabe, "カベイリア", "「ああ･･････、もうだめかもしれないわ･･････」"],
            [f_kabe, "カベイリア", "「小鬼はこれまで何度も･･･死神候補にあげられた王家の血筋の者よ･･･」"],
            [f_kabe, "カベイリア", "「･･･でも、無邪気さが危険視されて、死神にはなれなかった･･･」"],
            [f_kabe, "カベイリア", "「気をつけなさい･･･」"],
            [f_kabe, "カベイリア", "「･･･もっと力を潜め･･･、なるべく長い時間みつからぬ事が重要なのですよ･･･」"],
            [f_empty, "", "ジスロフ達は、『破邪のクリスタル』を手に入れた。"],
            [f_empty, "", "不思議な力がジスロフ達の【最大HP】を+15させた･･･！"],
        ]);
        /*
                [f_empty,  "",         ""],
                [f_kabe,   "カベイリア",""],
         */
        s.end();
    });
})(Story3 || (Story3 = {}));
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
