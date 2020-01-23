import { Util } from "../util.js";
import { Color } from "../undym/type.js";
import { Sound } from "../sound.js";
import { cwait } from "../undym/scene.js";
import { Img } from "../graphics/texture.js";
import { Story } from "./story.js";




export namespace SubStory{

    export const runMaya0 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_maya   = new Img("img/face/p_maya.jpg");//泣き顔
        const f_maya2   = new Img("img/face/p_maya2.jpg");//笑顔

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic28.jpg"),
            [
                [f_maya,  "北条院真夜", "「ひっく･･･ひっく･･･」"],
                [f_maya,  "北条院真夜", "「うわーん･･･怖いよう･･･」"],
                [f_maya,  "北条院真夜", "「真っ暗だよぅ･･･何も見えないよぅ･･･」"],
                [f_maya,  "北条院真夜", "「うわ！！！！･･･人がいる！！！」"],
                [f_maya,  "北条院真夜", "「あ、貴方達、誰ですか！？･･･ま、まさか、盗賊･･･！？うわーーーん！！」"],
                [f_maya,  "北条院真夜", "「お願いします･･･命だけは助けて下さい･･･えっぐ･･･えっぐ･･･」"],
                [f_maya,  "北条院真夜", "「･･･え･･･違うんですか･･･？」"],
                [f_maya2, "北条院真夜", "「･･･なんだ･･･」"],
                [f_maya2, "北条院真夜", "「･･･驚かさないでくれよ･･･フン」"],
                [f_maya2, "北条院真夜", "「別に俺･･･泣いてなんかいないからな･･･」"],
                [f_maya2, "北条院真夜", "「俺か？俺は冒険家の北条院真夜･･･」"],
                [f_maya2, "北条院真夜", "「随分前からここら一帯にあると噂されている魔水路を探してるんだ」"],
                [f_maya2, "北条院真夜", "「マーザンとヤハンに交易があった時代に使われていた水路らしいが･･･」"],
                [f_maya2, "北条院真夜", "「さっ･･･俺は冒険で忙しいんだ。邪魔しないでくれないか？フン」"],
                [f_empty, "",          "青年は颯爽と去って行った...."],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
    };

    //塔最上階クリア
    export const runWarmHole = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_1      = new Img("img/face/p_1.jpg");
        const f_pea    = new Img("img/face/p_pea.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic13.jpg"),
            [
                [f_1,      "一号",  "「俺やlukaが通ってきたこのワームホール･･･」"],
                [f_1,      "一号",  "「こちら側からもうまく使えないだろうか」"],
                [f_pea,    "ピアー","「ワシらが古代武器でドカンとフッ飛ばしてもーてのぅ、うまく機能するかどうか･･･」"],
                [f_1,      "一号",  "「壊れたワームホール装置を復元できれば、こちら側からもワームホールを使って向こう側へ行けるかもしれないな」"],
                [f_empty,  "",      "【ワームホール装置の復元】のレシピが『建造』に加わりました。"],
            ]
        );
        /*
                [f_empty,  "",      ""],
                [f_1,      "一号",  ""],
                [f_pea,    "ピアー",""],
        */

        s.end();
        
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
    };

    
    //ラストリゾートクリア、白い鳥がヘブンズになる
    export const runSiroitoriHito = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_tori   = new Img("img/face/p_bird.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic6.jpg"),
            [
                [f_tori,   "白い鳥","「･･････････････････」"],
                [f_tori,   "白い鳥","「･･････！！！！」"],
                [f_empty,  "",      "何やら白い鳥の様子が変だ･･･。"],
                [f_empty,  "",      "白い鳥の目の前に、突然、幽霊猫の幻影が浮かび上がったかと思うと･･･"],
                [f_empty,  "",      "幽霊猫は白い鳥をじっと見つめ、すぅっと闇の中へと消えて行った。"],
                [f_empty,  "",      "白い鳥はいつの間にか人間の姿を取り戻していた！！"],
            ]
        );
        /*
                [f_empty,  "",      ""],
                [f_tori,   "白い鳥",""],
        */

        s.end();
        
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
    };
}


/*
        const f_empty  = new Img("img/face/p_rs.jpg");
        const f_1      = new Img("img/face/p_1.jpg");
        const f_siki  = new Img("img/face/p_siki.jpg");
        const f_yuki = new Img("img/face/p_yuki2.jpg");
        const f_luka   = new Img("img/face/p_luka.jpg");
        const f_luka2   = new Img("img/face/p_luka2.jpg");
        const f_memo = new Img("img/face/p_sol.jpg");
        const f_vega = new Img("img/face/p_vega.jpg");
        const f_pea    = new Img("img/face/p_pea.jpg");
        const f_ruin   = new Img("img/face/p_ruin.jpg");
        const f_maya   = new Img("img/face/p_maya.jpg");//泣き顔
        const f_maya2   = new Img("img/face/p_maya2.jpg");//笑顔

    export const runMain20 = async()=>{
        const f_empty  = new Img("img/face/p_rs.jpg");

        const s = new Story();

        await s.set(
            new Img("img/story/s_pic28.jpg"),
            [
                [f_empty,  "",      ""],
            ]
        );

        s.end();
        
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
        Util.msg.set(".", Color.GRAY); Sound.moji.play(); await cwait();
    };
 */