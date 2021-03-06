import { Scene } from "../undym/scene.js";
import { FlowLayout, ILayout, VariableLayout, XLayout, RatioLayout, Layout, YLayout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit, PUnit, Prm } from "../unit.js";
import { Input } from "../undym/input.js";
import { Rect, Color, Point } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail, DrawPlayInfo, DrawYen } from "./sceneutil.js";
import { Place, PlayData } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { TecType, Tec, ActiveTec } from "../tec.js";
import { FX_Str } from "../fx/fx.js";
import { Player } from "../player.js";
import { Eq, EqEar } from "../eq.js";
import { Item } from "../item.js";
import { Dungeon } from "../dungeon/dungeon.js";
import { Job } from "../job.js";
import { PartySkill } from "../partyskill.js";
import { Sound } from "../sound.js";
import { Mix } from "../mix.js";
import { CollectingSkill } from "../collectingskill.js";


class TecMaster{
    static map = new Map<Tec,boolean>();

    static check(tec:Tec):boolean{
        return this.map.get(tec) ? true : false;
    }

    static setCandidates(tecs:Tec[]){
        const members = Player.values.filter(p=> p.member);
        for(const tec of tecs){
            if(!this.map.get(tec)){
                const master = members.some(p=> p.ins.isMasteredTec(tec));
                this.map.set(tec, master);
            }
        }
    }
}

export class ShopScene extends Scene{

    private static completedInitGoods = false;
    private list:List = new List();
    private choosedGoods:Goods|undefined;

    constructor(){
        super();

        TecMaster.setCandidates([
            Tec.ヤクシャ, Tec.ナーガ, Tec.ガルダ, Tec.キンナラ, Tec.手裏剣, Tec.レーザー, Tec.ドゥエルガル, Tec.ガブリエル,
        ]);

        if(!ShopScene.completedInitGoods){
            ShopScene.completedInitGoods = true;
            initGoods();
        }

        
        this.setList();
    }

    init(){
        const infoLayout =  ILayout.create({draw:(bounds)=>{
                                Graphics.fillRect(bounds, Color.D_GRAY);

                                const goods = this.choosedGoods;
                                if(!goods){return;}
                                
                                let font = Font.def;
                                let p = bounds.upperLeft.move(1 / Graphics.pixelW, 2 / Graphics.pixelH);
                                const moveP = ()=> p = p.move(0, font.ratioH);
                                
                                font.draw(`[${goods.name}]`, moveP(), Color.WHITE);
                                font.draw(`${goods.type}`, moveP(), Color.WHITE);
                                font.draw(`${goods.price}円`, moveP(), Color.WHITE);
                                // if(goods.num){
                                //     font.draw(`所持:${goods.num()}`, moveP(), Color.WHITE);
                                // }else{
                                //     moveP();
                                // }

                                moveP();

                                font.draw(goods.info, moveP(), Color.WHITE);
                            }});
        super.clear();


        super.add(Place.LIST_MAIN, 
            new XLayout()
                .add(this.list)
                .add(
                    new RatioLayout()
                        .add(Place.LIST_INFO, infoLayout)
                        .add(Place.LIST_USE_BTN, 
                            (()=>{
                                const buy:(num:number)=>number = (num)=>{
                                    if(!this.choosedGoods){return 0;}
                                    
                                    const goods = this.choosedGoods;
                                    
                                    if(!goods.isVisible()){return 0;}

                                    let boughtNum = 0;
                                    for(let i = 0; i < num; i++){
                                        if(PlayData.yen >= goods.price){
                                            PlayData.yen -= goods.price;
                                            goods.buy();
                                            boughtNum++;
                                        }
                                    }
                                    if(boughtNum > 0){
                                        Sound.KATAN.play();
                                        FX_Str(Font.def, `[${goods.name}]を${boughtNum}個買った`, Point.CENTER, Color.WHITE);
                                    }
                                    return num;
                                };
                                const buyPanel = new XLayout()
                                                    .add(new Btn("x10", ()=>{
                                                        buy(10);
                                                    }))
                                                    .add(new Btn("購入", ()=>{
                                                        buy(1);
                                                    }))
                                                    ;
                                const no = new Btn("-",async()=>{});
                                return new VariableLayout(()=>{
                                    if(this.choosedGoods && this.choosedGoods.isVisible()){
                                        return buyPanel;
                                    }
                                    return no;
                                });
                            })()
                        )
                    
                )
        );
        
        super.add(Place.YEN, DrawYen.ins);

        super.add(Place.LIST_BTN,
            new Btn("<<", ()=>{
                Sound.system.play();
                Scene.load( TownScene.ins );
            })
        );
        
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
        
    }

    private setList(){

        this.list.clear();

        this.list.add({
            center:()=>"お店",
            groundColor:()=>Color.D_GRAY,
        });

        Goods.values()
            .filter(g=> g.isVisible())
            .forEach(goods=>{
                this.list.add({
                    left:()=>goods.left,
                    right:()=> goods.isVisible() ? goods.name : `-`,
                    groundColor:()=>goods === this.choosedGoods ? Color.D_CYAN : Color.BLACK,
                    push:(elm)=>{
                        this.choosedGoods = goods;
                        Sound.system.play();
                    },
                });
            });
    }
}



class Goods{
    private static _values:Goods[] = [];
    static values():ReadonlyArray<Goods>{
        return this._values;
    }

    get name(){return this.args.name;}
    get type(){return this.args.type;}
    get info(){return this.args.info;}
    get price(){return this.args.price();}
    isVisible(){return this.args.isVisible();}
    buy(){this.args.buy();}
    get left(){return this.args.left ? this.args.left() : "";}

    constructor(
        private args:{
            readonly name:string,
            readonly type:string,
            readonly info:string,
            readonly price:()=>number,
            readonly isVisible:()=>boolean,
            readonly buy:()=>void,
            readonly left?:()=>string,
        }
    ){

        Goods._values.push(this);
    }
    // constructor(
    //     private readonly name:string,
    //     public readonly type:string,
    //     public readonly info:string,
    //     public readonly price:()=>number,
    //     public readonly isVisible:()=>boolean,
    //     public readonly buy:()=>void,
    //     public readonly num:()=>(number|undefined) = ()=>undefined,
    // ){
    //     this.toString = ()=>this.name;
    //     Goods._values.push(this);
    // }

}




const initGoods = ()=>{
    const createItemGoods = (args:{
        item:Item,
        price:()=>number,
        isVisible:()=>boolean,
        num?:number,
    })=>{
        new Goods({
            name:(()=>{
                if(args.num){return `${args.item}x${args.num}`;}
                return args.item.toString();
            })(),
            type:"＜アイテム＞",
            info:args.item.info,
            price:args.price,
            isVisible:args.isVisible,
            buy:()=>{
                if(args.num){args.item.add( args.num );}
                else        {args.item.add(1);}
            },
            left:()=>`${args.item.num}`,
        });
    }
    // const createItemGoodsNum = (item:Item, num:number, price:()=>number, isVisible:()=>boolean)=>{
    //     new Goods(
    //         item.toString(),
    //         item.info,
    //         price,
    //         isVisible,
    //         ()=> item.add(num),
    //         ()=> item.num,
    //     );
    // };
    // const createEqGoods = (eq:Eq, price:()=>number, isVisible:()=>boolean)=>{
    //     new Goods(
    //         eq.toString(),
    //         `＜${eq.pos}＞`,
    //         eq.info,
    //         price,
    //         isVisible,
    //         ()=>eq.add(1),
    //         ()=> eq.num,
    //     );
    // };
    // const createEarGoods = (ear:EqEar, price:()=>number, isVisible:()=>boolean)=>{
    //     new Goods(
    //         ear.toString(),
    //         "＜耳＞",
    //         ear.info,
    //         price,
    //         isVisible,
    //         ()=>ear.add(1),
    //         ()=> ear.num,
    //     );
    // };
    // const createPartySkill = (skill:PartySkill, price:()=>number, isVisible:()=>boolean)=>{
    //     new Goods(
    //         skill.toString(),
    //         "＜パーティースキル＞",
    //         "",
    //         price,
    //         ()=> isVisible() && !skill.has,
    //         ()=>skill.has = true,
    //     );
    // };
    
    // createItemGoods(Item.技習得許可証, ()=>50, ()=>Dungeon.はじまりの丘.dungeonClearCount > 0 && Item.技習得許可証.totalGetCount === 0);
    createItemGoods({item:Item.合成許可証, 
        price:()=>300, isVisible:()=>Dungeon.はじまりの丘.dungeonClearCount > 0 && Item.合成許可証.totalGetCount === 0});
    createItemGoods({item:Item.リュサンデールの絵筆, num:1,
        price:()=>10000, isVisible:()=>TecMaster.check(Tec.ドゥエルガル) && Item.リュサンデールの絵筆.totalGetCount === 0});
    
    createItemGoods({item:Item.スティックパン,        price:()=>30,  isVisible:()=>true});
    createItemGoods({item:Item.硬化スティックパン,    price:()=>100,  isVisible:()=>Mix.パン屋のごみ箱.count > 0});
    createItemGoods({item:Item.シェイクスピア分子1,   price:()=>500,  isVisible:()=>Mix.健康保険証.count > 0});
    createItemGoods({item:Item.赤い水,               price:()=>50,  isVisible:()=>true});
    createItemGoods({item:Item.サンタクララ薬,        price:()=>100, isVisible:()=>true});

    createItemGoods({item:Item.夜叉の矢,   num:2,  price:()=>(Item.夜叉の矢.num+2)   * 1000, isVisible:()=>TecMaster.check(Tec.ヤクシャ)});
    createItemGoods({item:Item.降雨の矢,   num:4,  price:()=>(Item.降雨の矢.num+4)   * 1000, isVisible:()=>TecMaster.check(Tec.ナーガ)});
    createItemGoods({item:Item.金翅鳥の矢, num:1,  price:()=>(Item.金翅鳥の矢.num+1) * 1000, isVisible:()=>TecMaster.check(Tec.ガルダ)});
    createItemGoods({item:Item.歌舞の矢,   num:6,  price:()=>(Item.歌舞の矢.num+6)   * 1000, isVisible:()=>TecMaster.check(Tec.キンナラ)});
    createItemGoods({item:Item.手裏剣,     num:2,  price:()=>(Item.手裏剣.num+2)     * 1000, isVisible:()=>TecMaster.check(Tec.手裏剣)});
    createItemGoods({item:Item.バッテリー, num:1,  price:()=>(Item.バッテリー.num+1)  * 1000, isVisible:()=>TecMaster.check(Tec.レーザー)});
    createItemGoods({item:Item.聖水,       num:1,  price:()=>(Item.聖水.num+1)       * 3000, isVisible:()=>TecMaster.check(Tec.ガブリエル)});
    
    createItemGoods({item:Item.釣り竿,     num:1,  price:()=>(Item.釣り竿.num+1)  * 10000, isVisible:()=>CollectingSkill.水汲.lv >= 10});
    createItemGoods({item:Item.つるはし,   num:1,  price:()=>(Item.つるはし.num+1) * 10000, isVisible:()=>CollectingSkill.地層.lv >= 10});
    

    // createEarGoods(EqEar.おにく,               ()=>100   ,()=>Dungeon.リテの門.dungeonClearCount > 0 && EqEar.おにく.totalGetCount < 2);
    // createEarGoods(EqEar.水晶のピアス,         ()=>200   ,()=>Dungeon.リテの門.dungeonClearCount > 0 && EqEar.水晶のピアス.totalGetCount < 2);
    // createEarGoods(EqEar.魔ヶ玉のピアス,       ()=>100   ,()=>Dungeon.リテの門.dungeonClearCount > 0 && EqEar.魔ヶ玉のピアス.totalGetCount < 2);
    // createEarGoods(EqEar.エメラルドのピアス,   ()=>100   ,()=>Dungeon.リテの門.dungeonClearCount > 0 && EqEar.エメラルドのピアス.totalGetCount < 2);


    // createItemGoods(Item.パーティースキル取り扱い許可証, ()=>1000, ()=>Dungeon.黒遺跡.dungeonClearCount > 0 && Item.パーティースキル取り扱い許可証.num === 0);
    // createPartySkill(PartySkill.入手経験値増加,         ()=>1000, ()=>Item.パーティースキル取り扱い許可証.num > 0);
    // createPartySkill(PartySkill.入手BP増加,            ()=>1000, ()=>Item.パーティースキル取り扱い許可証.num > 0);
    // createPartySkill(PartySkill.入手金増加,            ()=>2000, ()=>Item.パーティースキル取り扱い許可証.num > 0);
    // createPartySkill(PartySkill.宝箱チェーン増加,       ()=>3000, ()=>Item.パーティースキル取り扱い許可証.num > 0);
    // createPartySkill(PartySkill.宝箱ランク増加,         ()=>4000, ()=>PartySkill.宝箱チェーン増加.has);
    // createPartySkill(PartySkill.伐採チェーン増加,       ()=>5000, ()=>PartySkill.宝箱ランク増加.has);
};

