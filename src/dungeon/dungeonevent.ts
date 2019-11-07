import { Util, Place, PlayData, SceneType } from "../util.js";
import { Btn } from "../widget/btn.js";
import { Dungeon } from "./dungeon.js";
import { Scene, cwait, wait } from "../undym/scene.js";
import { TownScene } from "../scene/townscene.js";
import { Item, ItemDrop, ItemType } from "../item.js";
import { ILayout, YLayout, XLayout, VariableLayout, FlowLayout } from "../undym/layout.js";
import { Color } from "../undym/type.js";
import { Unit, Prm } from "../unit.js";
import { FX, FX_Advance, FX_Return } from "../fx/fx.js";
import { Battle, BattleType, BattleResult } from "../battle.js";
import { BattleScene } from "../scene/battlescene.js";
import DungeonScene from "../scene/dungeonscene.js";
import { ItemScene } from "../scene/itemscene.js";
import { Targeting, Dmg } from "../force.js";
import { Img } from "../graphics/graphics.js";
import { SaveData } from "../savedata.js";
import { Input } from "../undym/input.js";
import { Num } from "../mix.js";
import { PartySkillOpenBox, PartySkill } from "../partyskill.js";
import { choice } from "../undym/random.js";
import { CollectingSkill } from "../collectingskill.js";


export abstract class DungeonEvent{
    private static _values:DungeonEvent[] = [];
    static get values():ReadonlyArray<DungeonEvent>{return this._values;}

    static now:DungeonEvent;

    private img:Img;
    getImg():Img{return this.img ? this.img : (this.img = this.createImg());}
    protected createImg():Img{return Img.empty;}
    
    abstract createBtnLayout():ILayout;

    protected constructor(){
        DungeonEvent._values.push(this);
    }

    async happen(){
        DungeonEvent.now = this;
        await this.happenInner();
    }
    protected abstract happenInner():void;
    
    isZoomImg():boolean{return true;}



}


class EventImg{
    private _img:Img;
    get img(){return this._img ? this._img : (this._img = new Img(this.src));}

    constructor(private readonly src:string){}
}
namespace EventImg{
    export const BOX = new EventImg("img/box.png");
    export const OPEN_BOX = new EventImg("img/box_open.png");
}


export namespace DungeonEvent{
    export const empty:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        happenInner = ()=>{Util.msg.set("");};
        createBtnLayout = ()=> createDefLayout();
    };
    export const BOX:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.BOX.img;
        happenInner = async()=>{Util.msg.set("宝箱だ")};
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("開ける", async()=>{
                                    await DungeonEvent.OPEN_BOX.happen();
                                }))
                                ;
    };
    export const OPEN_BOX:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.OPEN_BOX.img;
        isZoomImg = ()=> false;
        happenInner = async()=>{
            await openBox( ItemDrop.BOX, Dungeon.now.rank / 2, CollectingSkill.宝箱 );

            if(Math.random() < 0.15){
                const trends = Dungeon.now.trendItems;
                if(trends.length > 0){
                    const item = trends[ (Math.random() * trends.length)|0 ];
                    await wait();
                    item.add(1);
                }
            }

        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const KEY_BOX_RANK2:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.BOX.img;
        happenInner = async()=>{Util.msg.set("丸い箱だ")};
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("開ける", async()=>{
                                    if(Item.丸い鍵.num > 0){
                                        Item.丸い鍵.num--;
                                        await DungeonEvent.OPEN_KEY_BOX_RANK2.happen();
                                    }else{
                                        Util.msg.set("鍵を持っていない");
                                    }
                                }))
                                ;
    };
    export const OPEN_KEY_BOX_RANK2:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.OPEN_BOX.img;
        isZoomImg = ()=> false;
        happenInner = async()=>{
            for(let i = 0; i < 5; i++){
                openKeyBox(/*base*/2, /*fluctuateRange*/2); await wait();
            }
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const KEY_BOX_RANK3:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.BOX.img;
        happenInner = async()=>{Util.msg.set("三角型の箱だ")};
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("開ける", async()=>{
                                    if(Item.三角鍵.num > 0){
                                        Item.三角鍵.num--;
                                        await DungeonEvent.OPEN_KEY_BOX_RANK3.happen();
                                    }else{
                                        Util.msg.set("鍵を持っていない");
                                    }
                                }))
                                ;
    };
    export const OPEN_KEY_BOX_RANK3:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.OPEN_BOX.img;
        isZoomImg = ()=> false;
        happenInner = async()=>{
            for(let i = 0; i < 6; i++){
                openKeyBox(/*base*/3, /*fluctuateRange*/2); await wait();
            }
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const KEY_BOX_RANK4:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.BOX.img;
        happenInner = async()=>{Util.msg.set("トゲトゲの箱だ")};
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("開ける", async()=>{
                                    if(Item.トゲトゲ鍵.num > 0){
                                        Item.トゲトゲ鍵.num--;
                                        await DungeonEvent.OPEN_KEY_BOX_RANK4.happen();
                                    }else{
                                        Util.msg.set("鍵を持っていない");
                                    }
                                }))
                                ;
    };
    export const OPEN_KEY_BOX_RANK4:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.OPEN_BOX.img;
        isZoomImg = ()=> false;
        happenInner = async()=>{
            for(let i = 0; i < 7; i++){
                openKeyBox(/*base*/4, /*fluctuateRange*/2); await wait();
            }
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const KEY_BOX_RANK5:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.BOX.img;
        happenInner = async()=>{Util.msg.set("ツルツルの箱だ")};
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("開ける", async()=>{
                                    if(Item.ツルツル鍵.num > 0){
                                        Item.ツルツル鍵.num--;
                                        await DungeonEvent.OPEN_KEY_BOX_RANK5.happen();
                                    }else{
                                        Util.msg.set("鍵を持っていない");
                                    }
                                }))
                                ;
    };
    export const OPEN_KEY_BOX_RANK5:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.OPEN_BOX.img;
        isZoomImg = ()=> false;
        happenInner = async()=>{
            for(let i = 0; i < 8; i++){
                openKeyBox(/*base*/5, /*fluctuateRange*/2); await wait();
            }
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const KEY_BOX_RANK6:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.BOX.img;
        happenInner = async()=>{Util.msg.set("ヘンテコな箱だ")};
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("開ける", async()=>{
                                    if(Item.ヘンテコ鍵.num > 0){
                                        Item.ヘンテコ鍵.num--;
                                        await DungeonEvent.OPEN_KEY_BOX_RANK6.happen();
                                    }else{
                                        Util.msg.set("鍵を持っていない");
                                    }
                                }))
                                ;
    };
    export const OPEN_KEY_BOX_RANK6:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> EventImg.OPEN_BOX.img;
        isZoomImg = ()=> false;
        happenInner = async()=>{
            for(let i = 0; i < 9; i++){
                openKeyBox(/*base*/6, /*fluctuateRange*/2); await wait();
            }
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const TREASURE:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> new Img("img/treasure.png");
        happenInner = async()=>{
            Util.msg.set("財宝の箱だ！")
        };
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("開ける", async()=>{
                                    if(Dungeon.now.treasureKey > 0){
                                        Dungeon.now.treasureKey--;
                                        await DungeonEvent.OPEN_TREASURE.happen();
                                    }else{
                                        Util.msg.set("鍵を持っていない");
                                    }
                                }))
                                ;
    };
    export const OPEN_TREASURE:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> new Img("img/treasure_open.png");
        happenInner = async()=>{
            const treasure:Num|undefined = Dungeon.now.rndTreasure();
            if(treasure){
                await treasure.add(1);
            }else{
                Util.msg.set("空だった！");
            }
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const GET_TREASURE_KEY:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        happenInner = async()=>{
            Dungeon.now.treasureKey++;
            Util.msg.set(`${Dungeon.now}の財宝の鍵を手に入れた(${Dungeon.now.treasureKey})`, Color.GREEN.bright);
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const TRAP:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> new Img("img/trap.png");
        happenInner = ()=>{
            Util.msg.set("罠だ");
        };
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("解除", async()=>{
                                    await  DungeonEvent.TRAP_BROKEN.happen();
                                }))
                                .set(AdvanceBtn.index, new Btn("進む", async()=>{
                                    Util.msg.set("引っかかった！", Color.RED); await wait();

                                    for(let p of Unit.players){
                                        if(!p.exists || p.dead){continue;}

                                        const dmg = new Dmg({absPow: p.prm(Prm.MAX_HP).total / 5});
                                        await p.doDmg(dmg); await wait();
                                        await p.judgeDead();
                                    }

                                    DungeonEvent.empty.happen();
                                }).dontMove())
                                ;
    };
    export const TRAP_BROKEN:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> new Img("img/trap_broken.png");
        isZoomImg = ()=> false;
        happenInner = async()=>{
            Util.msg.set("解除した");
            await openBox( ItemDrop.BOX, Dungeon.now.rank / 4, CollectingSkill.解除 );
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const REST:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        happenInner = async()=>{
            Util.msg.set("休めそうな場所がある...");
        };
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("休む", async()=>{
                                    for(const p of Unit.players){
                                        if(p.exists && !p.dead){
                                            Unit.healHP(p, p.prm(Prm.MAX_HP).total * 0.2 + 1);
                                            Unit.healMP(p, p.prm(Prm.MAX_MP).total * 0.2 + 1);
                                        }
                                    }

                                    Util.msg.set("休憩した");
                                    
                                    DungeonEvent.empty.happen();
                                }))
                                ;
    };
    export const TREE:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> new Img("img/tree.png");
        happenInner = ()=>{
            Util.msg.set("木だ");
        };
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("切る", async()=>{
                                    await DungeonEvent.TREE_GET.happen();
                                }))
                                .set(AdvanceBtn.index, new Btn("進む", async()=>{
                                    Util.msg.set("いてっ！", Color.RED); await wait();

                                    for(let p of Unit.players){
                                        if(!p.exists || p.dead){continue;}

                                        const dmg = new Dmg({absPow: p.prm(Prm.MAX_HP).total / 10});
                                        await p.doDmg(dmg); await wait();
                                        await p.judgeDead();
                                    }
                                }).dontMove())
                                ;
    };
    export const TREE_GET:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> new Img("img/tree_broken.png");
        isZoomImg = ()=> false;
        happenInner = async()=>{
            await openBox( ItemDrop.TREE, Dungeon.now.rank / 2, CollectingSkill.伐採 );
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const STRATUM:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        createImg = ()=> new Img("img/stratum.png");
        happenInner = ()=>{Util.msg.set("掘れそうな場所がある");};
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, new Btn("掘る", async()=>{
                                    await DungeonEvent.STRATUM_GET.happen();
                                }))
                                ;
    };
    export const STRATUM_GET:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        // createImg = ()=> new Img("img/tree_broken.png");
        // isZoomImg = ()=> false;
        happenInner = async()=>{
            await openBox( ItemDrop.STRATUM, Dungeon.now.rank / 2, CollectingSkill.地層 );
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const LAKE:DungeonEvent = new class extends DungeonEvent{
        private 汲む = false;
        private 釣る = false;
        constructor(){super();}
        // createImg = ()=> new Img("img/tree.png");
        happenInner = ()=>{
            Util.msg.set("湖だ");
            this.汲む = true;

            // if(ItemType.竿.values.some(item=> item.num > 0)){
            //     this.釣る = true;
            // }
        };
        createBtnLayout = ()=> createDefLayout()
                                .set(ReturnBtn.index, (()=>{
                                    const drink = async()=>{
                                        await openBox( ItemDrop.LAKE, Dungeon.now.rank / 2, CollectingSkill.水汲 );
                                    };
                                    const fishingBtn = new Btn("釣る", async()=>{
                                        // this.釣る = false;
                                        // this.汲む = false;
                                        // let doneAnyFishing = false;
                                        
                                        // const fishing = async(baseRank:number)=>{
                                        //     const itemRank = Item.fluctuateRank( baseRank );
                                        //     let item = Item.rndItem( ItemDrop.FISHING, itemRank );
                                        //     item.add(1); await wait();

                                        //     doneAnyFishing = true;
                                        // };
                                        // const checkAndBreakRod = async(prob:number, rod:Item)=>{
                                        //     if(Math.random() < prob){
                                        //         rod.add(-1);
                                        //         Util.msg.set(`[${rod}]が壊れてしまった！(残り${rod.num})`, Color.RED.bright); await wait();
                                        //     }
                                        // };
                                        
                                        // if(Item.ボロい釣竿.num > 0){
                                        //     fishing( Dungeon.now.rank / 2 );
                                        //     checkAndBreakRod(0.05, Item.ボロい釣竿);
                                        // }
                                        // if(Item.マーザン竿.num > 0){
                                        //     fishing( Dungeon.now.rank / 2 + 0.5 );
                                        //     checkAndBreakRod(0.05, Item.マーザン竿);
                                        // }

                                        // if(!doneAnyFishing){
                                        //     Util.msg.set("釣り竿をもっていなかった...");
                                        // }
                                        
                                        // await drink();
                                    });
                                    const drinkBtn = new Btn("汲む", async()=>{
                                        this.汲む = false;

                                        await drink();
                                    });
                                    // return new VariableLayout(()=>this.汲む ? drinkBtn : ReturnBtn.ins);
                                    return new VariableLayout(()=>{
                                        if(this.釣る){return fishingBtn;}
                                        if(this.汲む){return drinkBtn;}
                                        return ReturnBtn.ins;
                                    })
                                })())
                                // .set(5, (()=>{
                                //     return new VariableLayout(()=>this.釣る ? btn : ILayout.empty);
                                // })())
                                ;
    };
    export const BATTLE:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        happenInner = async()=>{
            Util.msg.set("敵が現れた！");
            Dungeon.now.setEnemy();
            Battle.setup( BattleType.NORMAL, async(result)=>{
                switch(result){
                    case BattleResult.WIN:
                        Scene.load( DungeonScene.ins );
                        break;
                    case BattleResult.LOSE:
                        DungeonEvent.ESCAPE_DUNGEON.happen();
                        break;
                    case BattleResult.ESCAPE:
                        Scene.load( DungeonScene.ins );
                        break;
                }
            });
            Scene.load( BattleScene.ins );
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const BOSS_BATTLE:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        happenInner = async()=>{
            Util.msg.set(`[${Dungeon.now}]のボスが現れた！`, Color.WHITE.bright);
            Dungeon.now.setBoss();
            Battle.setup( BattleType.BOSS, async(result)=>{
                switch(result){
                    case BattleResult.WIN:
                        await DungeonEvent.CLEAR_DUNGEON.happen();
                        break;
                    case BattleResult.LOSE:
                        await DungeonEvent.ESCAPE_DUNGEON.happen();
                        break;
                    case BattleResult.ESCAPE:
                        await DungeonEvent.ESCAPE_DUNGEON.happen();
                        break;
                }
            });
            Scene.load( BattleScene.ins );
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const EX_BATTLE:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        happenInner = async()=>{
            Util.msg.set(`[${Dungeon.now}]のエクストラエネミーが現れた！`, Color.WHITE.bright);
            Dungeon.now.setEx();
            Battle.setup( BattleType.EX, async(result)=>{
                switch(result){
                    case BattleResult.WIN:
                        Dungeon.now.exKillCount++;
                        
                        if(Dungeon.now.exItems.length > 0){
                            const item = choice( Dungeon.now.exItems );
                            item.add(1); await wait();
                        }
                        
                        Scene.load( DungeonScene.ins );
                        break;
                    case BattleResult.LOSE:
                        await DungeonEvent.ESCAPE_DUNGEON.happen();
                        break;
                    case BattleResult.ESCAPE:
                        await DungeonEvent.ESCAPE_DUNGEON.happen();
                        break;
                }
            });
            Scene.load( BattleScene.ins );
        };
        createBtnLayout = DungeonEvent.empty.createBtnLayout;
    };
    export const ESCAPE_DUNGEON:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        happenInner = async()=>{

            Util.msg.set(`${Dungeon.now.toString()}を脱出します...`); await cwait(); await wait();
            
            Scene.load( TownScene.ins );
        };
        createBtnLayout = ()=> ILayout.empty;
    };
    export const CLEAR_DUNGEON:DungeonEvent = new class extends DungeonEvent{
        constructor(){super();}
        happenInner = async()=>{
            let yen = Dungeon.now.au * (Dungeon.now.enemyLv / 10 + 1) * (1 + Dungeon.now.dungeonClearCount * 0.02);
            yen = yen|0;
    
            Dungeon.now.dungeonClearCount++;
            Util.msg.set(`[${Dungeon.now}]を踏破した！`, Color.WHITE.bright); await cwait();
    
            PlayData.yen += yen;
            Util.msg.set(`報奨金${yen}円入手`, Color.YELLOW.bright); await cwait();

            await Dungeon.now.dungeonClearEvent();
            
            DungeonEvent.ESCAPE_DUNGEON.happen();
        };
        createBtnLayout = ()=> ILayout.empty;
    };
}


const createDefLayout = ()=>{
    return new FlowLayout(1,3)
            .set(ItemBtn.index, ItemBtn.ins)
            .set(ReturnBtn.index, ReturnBtn.ins)
            .set(AdvanceBtn.index, AdvanceBtn.ins)
            ;
};

class AdvanceBtn{
    static get index(){return 0;}

    private static _ins:Btn;
    static get ins():Btn{
        if(!this._ins){
            this._ins = new Btn(()=>"進む", async()=>{
                FX_Advance( Place.MAIN );

                Dungeon.auNow += 1;
                if(Dungeon.auNow >= Dungeon.now.au){
                    Dungeon.auNow = Dungeon.now.au;

                    await DungeonEvent.BOSS_BATTLE.happen();
                    return;
                }
    
                await Dungeon.now.rndEvent().happen();
            });
        }
        return this._ins;
    }
}


class ReturnBtn{
    static get index(){return 1;}
    
    private static _ins:Btn;
    static get ins():Btn{
        if(!this._ins){
            this._ins = new Btn(()=>"戻る", async()=>{
                FX_Return( Place.MAIN );
                Dungeon.auNow -= 1;
                if(Dungeon.auNow < 0){
                    Dungeon.auNow = 0;
                    await DungeonEvent.ESCAPE_DUNGEON.happen();
                    return;
                }
    
                await Dungeon.now.rndEvent().happen();
            });
        }
        return this._ins;
    }
}


class ItemBtn{
    static get index(){return 2;}

    private static _ins:Btn;
    static get ins():Btn{
        if(!this._ins){
            this._ins = new Btn(()=>"アイテム", async()=>{
                Scene.load( ItemScene.ins({
                    selectUser:true,
                    user:Unit.players[0],
                    use:async(item,user)=>{
                        if(item.targetings & Targeting.SELECT){
                            await item.use( user, [user] );
                        }else{
                            let targets = Targeting.filter( item.targetings, user, Unit.players, /*num*/1 );
                            
                            if(targets.length > 0){
                                await item.use( user, targets );
                            }
                        }
                    },
                    returnScene:()=>{
                       Scene.set( DungeonScene.ins );
                    }, 
                }));
            });
        }
        return this._ins;
    }
}

/**入手'した'アイテムを返す. */
const openBox = async(dropType:ItemDrop, rank:number, collectingSkill:CollectingSkill|undefined)=>{
    const partySkill = new PartySkillOpenBox();
    PartySkill.skills.forEach(skill=> skill.openBox( partySkill, dropType ) );

    let openNum = 1;
    let openBoost = 0.2 + partySkill.chain;
    while(Math.random() < openBoost){
        openNum++;
        openBoost /= 2;
    }
    let baseRank = rank + partySkill.addRank;
    for(let i = 0; i < openNum; i++){
        const itemRank = Item.fluctuateRank( baseRank );
        let item = Item.rndItem( dropType, itemRank );
        let addNum = 1;
        item.add( addNum ); await wait();

        if(collectingSkill){
            await collectingSkill.lvupCheck(item.rank);
        }
    }
};


const openKeyBox = (baseRank:number, rankFluctuateRange:number)=>{
    let frank = Math.random() * (rankFluctuateRange + 1);
    if(Math.random() < 0.5){frank *= -1;}
    let rank = baseRank + frank;
    if(rank < 0){rank = 0;}
    const item = Item.rndItem( ItemDrop.BOX, rank );
    item.add(1);
};