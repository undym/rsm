import { Scene, wait, cwait } from "../undym/scene.js";
import { Place, Util, PlayData, SceneType } from "../util.js";
import { DrawSTBoxes, DrawDungeonData, DrawUnitDetail, DrawPlayInfo, DrawYen, DrawUnits } from "./sceneutil.js";
import { VariableLayout, ILayout, Layout, YLayout, RatioLayout, FlowLayout, Labels, XLayout, Label } from "../undym/layout.js";
import { Rect, Color, Point } from "../undym/type.js";
import { Unit, PUnit, Prm, EUnit } from "../unit.js";
import { Battle, BattleResult, BattleType } from "../battle.js";
import { Tec, ActiveTec, PassiveTec, TecType } from "../tec.js";
import { Input } from "../undym/input.js";
import { Btn } from "../widget/btn.js";
import { Action, PhaseStartForce } from "../force.js";
import { Player } from "../player.js";
import { FX } from "../fx/fx.js";
import { Dungeon } from "../dungeon/dungeon.js";
import { TownScene } from "./townscene.js";
import { List } from "../widget/list.js";
import { Item } from "../item.js";
import { ItemScene } from "./itemscene.js";
import { Font, Graphics } from "../graphics/graphics.js";
import { PartySkillWin, PartySkill } from "../partyskill.js";
import { Sound } from "../sound.js";

let btnSpace:Layout;
let chooseTargetLayout:ILayout;

export class BattleScene extends Scene{
    private static _ins:BattleScene;
    static get ins():BattleScene{return this._ins ? this._ins : (this._ins = new BattleScene());}


    background:(bounds:Rect)=>void = emptyBG;

    private tecInfo:{tec:Tec, user:Unit} = {tec:Tec.empty, user:Unit.players[0]};

    private constructor(){
        super();

        btnSpace = new Layout();
        chooseTargetLayout = ILayout.empty;
    }


    init(){

        super.clear();

    

        super.add(Place.MAIN, ILayout.create({draw:(bounds)=>{
            Graphics.clip(bounds, ()=>{
                this.background(bounds);
            });
        }}));

        super.add(Place.DUNGEON_DATA,(()=>{
            const info = new Labels(Font.def)
                            .add(()=>`[${this.tecInfo.tec}]`)
                            .addLayout(
                                ILayout.create({draw:bounds=>{
                                    const tec = this.tecInfo.tec;
                                    const user = this.tecInfo.user;
                                    if(tec instanceof ActiveTec){
                                        let x = bounds.x;
                                        const w = bounds.w * 0.15;
                                        for(const cost of tec.costs){
                                            Font.def.draw( 
                                                `${cost.prm}:${cost.value}`,
                                                new Point(x, bounds.y),
                                                user.prm(cost.prm).base >= cost.value ? Color.WHITE : Color.GRAY,
                                            );

                                            x += w;
                                        }

                                        for(const set of tec.itemCost){
                                            Font.def.draw(
                                                `${set.item}-${set.num}`,
                                                new Point(x, bounds.y),
                                                set.item.num >= set.num ? Color.WHITE : Color.GRAY,
                                            );

                                            x += w;
                                        }
                                    }
                                }})
                            )
                            .addln(()=>this.tecInfo.tec.info)
                            ;
            return new VariableLayout(()=>{
                return this.tecInfo.tec !== Tec.empty ? info : DrawDungeonData.ins;
            });
        })());

        super.add(Rect.FULL, DrawUnits.ins);
        super.add(Place.MSG, Util.msg);

        super.add(Place.YEN, DrawYen.ins);
        super.add(Place.BTN, btnSpace);

        super.add(Place.E_BOX, DrawSTBoxes.enemies);
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);

        {
            const phaseUnitBoxColor = new Color(0,1,1,0.2);
            super.add(Rect.FULL, ILayout.create({draw:(bounds)=>{
                if(!Battle.getPhaseUnit().exists){return;}
    
                Graphics.fillRect(Battle.getPhaseUnit().boxBounds, phaseUnitBoxColor);
                const width = 5 + Math.sin( Date.now() / 200 ) * 4;
                Graphics.setLineWidth(width, ()=>{
                    Graphics.drawRect(Battle.getPhaseUnit().imgBounds, Color.YELLOW.bright());
                });
            }}));
        }

        super.add(Rect.FULL, new VariableLayout(()=> chooseTargetLayout));

        super.add(Rect.FULL, ILayout.create({ctrl:async(bounds)=>{
            if(Battle.start){
                Battle.start = false;
                SceneType.BATTLE.set();

                if(Battle.type === BattleType.NORMAL){this.background = createNormalBG();}
                if(Battle.type === BattleType.BOSS)  {this.background = createBossBG();}
                if(Battle.type === BattleType.EX)    {this.background = createExBG();}
                //init
                for(const u of Unit.all){
                    if(u instanceof PUnit){u.tp = 0;}
                    u.sp = 1;
                    for(const prm of Prm.values){
                        u.prm(prm).battle = 0;
                    }
                }

                for(const u of Unit.all.filter(u=> u.exists)){
                    u.battleStart();
                }

                await this.phaseEnd();
                return;
            }
        }}));
    }

    private async phaseEnd(){
        //force
        if(Battle.turn > 0){
            const phaseUnit = Battle.getPhaseUnit();
            if(phaseUnit.exists && !phaseUnit.dead){
                await Battle.getPhaseUnit().phaseEnd();
            }
        }

        for(let u of Unit.all){
            await u.judgeDead();
        }

        const judgeBattleEnd = async()=>{
            if(Unit.players.every(u=> !u.exists || u.dead)){
                await lose();
                return true;
            }
            if(Unit.enemies.every(u=> !u.exists || u.dead)){
                return await win();
            }
            return false;
        };

        if(await judgeBattleEnd()){
            return;
        }

        Battle.phase = (Battle.phase + 1) % Unit.all.length;
        if(Battle.phase === Battle.firstPhase){
            Battle.turn++;
            Util.msg.set(`----------${Battle.turn}ターン目----------`, Color.L_GRAY); await wait();
        }

        let attacker = Battle.getPhaseUnit();

        if(attacker.exists && attacker.dead){
            await attacker.deadPhaseStart();
        }

        if(!attacker.exists || attacker.dead){
            await this.phaseEnd();
            return;
        }

        Util.msg.set(`${attacker.name}の行動`, Color.ORANGE);

        const pForce = new PhaseStartForce();
        await attacker.phaseStart(pForce);

        for(const u of Unit.all){
            u.judgeDead();
        }
        
        if(attacker.dead){
            await this.phaseEnd();
            return;
        }
        
        if(await judgeBattleEnd()){
            return;
        }
        
        if(pForce.phaseSkip){
            await wait();
            await this.phaseEnd();
            return;
        }

        if(attacker instanceof PUnit){
            await this.setPlayerPhase(attacker);
            return;
        }else{
            let e = attacker as EUnit;
            await e.ai(e, Unit.all);
            await this.phaseEnd();
            return;
        }

    }


    

    private async setPlayerPhase(attacker:Unit){
        const list = new List(7);

        let choosedTec:Tec|undefined;


        const addActiveTec = (tec:ActiveTec, index:number)=>{
            list.add({
                center:()=>tec.toString(),
                push:async elm=>{
                    chooseTargetLayout = ILayout.empty;
                    choosedTec = tec;
                    Sound.system.play();

                    attacker.tecListScroll = index;

                    this.tecInfo.tec = Tec.empty;
                    
                    if(tec.targetings.some(t=> t === "select")){
        
                        Util.msg.set(`[${tec}]のターゲットを選択してください`);
                        
                        
                        await this.setChooseTargetBtn(attacker, async(targets)=>{
                            if(
                                   !targets[0].dead 
                                || (tec.targetings.some(t=> t === "withDead" || t === "deadOnly"))
                            ){
                                list.freeze(true);
                                Util.msg.set(`＞${targets[0].name}を選択`);
                                await tec.use(attacker, new Array<Unit>( tec.rndAttackNum( attacker ) ).fill( targets[0] ));
                                await this.phaseEnd();
                            }else{
                                choosedTec = undefined;
                            }
                        });
                        
                        await wait(1);
        
                        return;
                    }else{
                        list.freeze(true);
                        let targets:Unit[] = attacker.searchUnits( tec.targetings, tec.rndAttackNum(attacker) );
                        await tec.use(attacker, targets);
                        await this.phaseEnd();
                    }
                },
                hold:elm=>{
                    this.tecInfo.tec = tec;
                    this.tecInfo.user = attacker;
                },
                groundColor:()=>{
                    if(tec.checkCost(attacker)){
                        return choosedTec === tec ? Color.D_CYAN : Color.BLACK;
                    }else{
                        return choosedTec === tec ? Color.RED : Color.D_RED;
                    }
                },
                stringColor:()=>tec.checkCost(attacker) ? Color.WHITE : Color.D_RED,
            });
        };
        
        if(!attacker.tecs.some(tec=> tec instanceof ActiveTec)){
            addActiveTec( Tec.何もしない, 0 );
        }

        attacker.tecs.forEach((tec,index)=>{
            if(tec instanceof ActiveTec){
                addActiveTec(tec, index);
            }else if(tec instanceof PassiveTec){
                list.add({
                    center:()=>tec.toString(),
                    hold:elm=>{
                        this.tecInfo.tec = tec;
                        this.tecInfo.user = attacker;
                    },
                    groundColor:()=>choosedTec === tec ? Color.D_ORANGE : Color.D_GRAY,
                    stringColor:()=>Color.L_GRAY,
                });
            }
        });


        list.add({
            center:()=>"アイテム",
            push:async elm=>{
                choosedTec = undefined;
                chooseTargetLayout = ILayout.empty;
                Sound.system.play();

                Scene.load( ItemScene.ins({
                    user:attacker,
                    selectUser:false,
                    use:async(item, user)=>{
                        Scene.set(this);
    
                        if(item.targetings.some(t=> t === "select")){
                            Util.msg.set(`[${item}]のターゲットを選択してください`);
                            
                            this.setChooseTargetBtn(attacker, async(targets)=>{
                                list.freeze(true);
                                await item.use( user, targets );
                                await this.phaseEnd();
                            });
                        }else{
                            list.freeze(true);

                            const targets = user.searchUnits( item.targetings, 1 );
                            await item.use( user, targets );
                            await this.phaseEnd();
                        }
                    },
                    returnScene:()=>{
                        Scene.set( BattleScene.ins );
                    },
                }));
            },
        });
        list.add({
            center:()=>"逃げる",
            push:async elm=>{
                choosedTec = undefined;
                chooseTargetLayout = ILayout.empty;

                const runEscape = async()=>{
                    Battle.result = BattleResult.ESCAPE;

                    Sound.nigeru.play();
                    Util.msg.set("逃げた"); await wait();

                    await finish();
                    await Battle.battleEndAction(BattleResult.ESCAPE);
                };

                if(Battle.type === BattleType.EX){
                    await runEscape();
                    return;
                }else if(Battle.type === BattleType.NORMAL){
                    if(Math.random() < 0.6){
                        await runEscape();
                        return;
                    }else{
                        Util.msg.set("逃げられなかった..."); await wait();
                        await this.phaseEnd();
                        return;
                    }
                }else{
                    Util.msg.set("逃げられない！");
                    Sound.no.play();
                }
            },
        });

        list.setScroll( attacker.tecListScroll, "center" );

        btnSpace.clear();
        btnSpace.add(list);
    }


    private async setChooseTargetBtn(attacker:Unit, chooseAction:(targets:Unit[])=>void){

        chooseTargetLayout = ILayout.create({
            ctrl:async bounds=>{
                if(Input.click){
                    for(const u of Unit.all){
                        if(!u.exists){continue;}
                        if(!u.boxBounds.contains( Input.point )){continue;}

                        chooseTargetLayout = ILayout.empty;
                        await chooseAction([u]);

                        return;
                    }

                    //誰もいない場所をタップするとキャンセル
                    Util.msg.set("＞キャンセル");
                    chooseTargetLayout = ILayout.empty;
                    await this.setPlayerPhase(attacker);
                }
            },
            draw:bounds=>{
                Graphics.setLineWidth(3, ()=>{
                    for(const u of Unit.all){
                        if(!u.exists){continue;}

                        Graphics.drawRect( u.boxBounds, Color.RED );
                    }
                });
            },
        });
    }
}


/**敵がBattle.setReserveUnitsによって敵が補充された場合、trueを返す。 */
const win = async():Promise<boolean>=>{
    if(Battle.setReserveUnits.length > 0){
        Util.msg.set("敵を殲滅した..."); await cwait();
        Util.msg.set("."); await cwait();
        Util.msg.set("."); await cwait();
        Util.msg.set("."); await cwait();

        await Battle.setReserveUnits[0]();
        Battle.setReserveUnits.shift();

        Util.msg.set(`${Unit.enemies[0].name}達が現れた！`, Color.RED.bright);

        return false;
    }

    Battle.result = BattleResult.WIN;
    Sound.win.play();
    Util.msg.set("勝った"); await wait();

    const partySkill = new PartySkillWin();
    Unit.enemies
        .filter(e=> e.exists)
        .forEach(e=>{
            partySkill.exp.base    += e.prm(Prm.EXP).base;
            partySkill.jobExp.base += 1;
            partySkill.yen.base    += e.yen;
        });

    for(const skill of PartySkill.skills){
        skill.win( partySkill );
    }

    
    const exp = (partySkill.exp.base * partySkill.exp.mul)|0;
    Util.msg.set(`${exp}の経験値を入手`, Color.CYAN.bright);
    const jobExp = (partySkill.jobExp.base * partySkill.jobExp.mul)|0;
    Util.msg.set(`ジョブ経験+${jobExp}`, Color.YELLOW.bright);
    
    Sound.exp.play();
    await wait();

    for(let p of Unit.players.filter(p=> p.exists && !p.dead)){
        await p.addExp( exp );
    }
    for(let p of Unit.players.filter(p=> p.exists && !p.dead)){
        await p.addJobExp(jobExp);
    }

    
    const yen = (partySkill.yen.base * partySkill.yen.mul)|0;
    PlayData.yen += yen;
    Util.msg.set(`${yen}円入手`, Color.YELLOW.bright); Sound.COIN.play(); await wait();

    await finish();
    await Battle.battleEndAction(BattleResult.WIN);

    return true;
};


const lose = async()=>{
    Sound.gameover.play();
    Battle.result = BattleResult.LOSE;
    Util.msg.set("負けた"); await wait();

    if(Battle.type === BattleType.NORMAL){
        const lostYen = (PlayData.yen / 3)|0;
        PlayData.yen -= lostYen;
        Util.msg.set(`${lostYen}円失った...`, (cnt)=>Color.RED); await wait();
    }

    await finish();
    await Battle.battleEndAction(BattleResult.LOSE);
};


const finish = async()=>{
    for(const e of Unit.enemies){
        e.exists = false;
        e.clearConditions();
    }

    for(const u of Unit.all){
        for(const prm of Prm.values){
            u.prm(prm).battle = 0;
        }
        u.clearInvisibleConditions();
    }

    Player.jisrofUsedRamonsuisei = false;

    Battle.setReserveUnits = [];

    btnSpace.clear();

    BattleScene.ins.background = emptyBG;
}


const emptyBG = (bounds:Rect)=>{};

const createNormalBG:()=>(bounds:Rect)=>void = ()=>{
    return bounds=>{
        for(let i = 0; i < 5; i++){
            const w = Math.random() * 0.5;
            const h = Math.random() * 0.5;
            const x = Math.random() * (1 - w);
            const y = Math.random() * (1 - h);
            const c = 0.01 + Math.random() * 0.1;
            Graphics.fillRect(new Rect(x, y, w, h), new Color(c,c,c));
        }
    };
};


const createBossBG:()=>(bounds:Rect)=>void = ()=>{
    const nextR = (r:number, num:number)=>{
        if(num <= 0){return r;}
        return nextR(r * 1.2 + 0.002, num-1);
    };
    const nextRad = (rad:number, num:number)=>{
        if(num <= 0){return rad;}
        // return nextRad(rad * 1.05, num-1);
        return nextRad(rad + 0.05, num-1);
    };

    let center = {x:0.5, y:0.5};
    let nextCenter = {x:0.5, y:0.5};;

    let elms:{rad:number, r:number}[] = [];
    const elmNum = 80;
    for(let i = 0; i < elmNum; i++){
        elms.push({
            rad:Math.PI * 2 * (i+1) / elmNum,
            r:Math.random(),
        });
    }
    
    return bounds=>{
        const color = {r:0, g:0, b:0, a:1};
        const vertex = 4;
        let vertexes:{x:number ,y:number}[] = [];
        for(let i = 0; i < vertex; i++){
            const rad = Math.PI * 2 * (i+1) / vertex;
            vertexes.push({
                x:Math.cos(rad),
                y:Math.sin(rad),
            });
        }
        const cx = bounds.x + center.x * bounds.w;
        const cy = bounds.y + center.y * bounds.h;
        for(let i = 0; i < elms.length; i++){
            const e = elms[i];

            Graphics.setLineWidth(80 * e.r, ()=>{
                let points:{x:number, y:number}[] = [];
                const x = cx + Math.cos(e.rad) * e.r;
                const y = cy + Math.sin(e.rad) * e.r;
                const r = e.r * 0.1;
                for(let i = 0; i < vertex; i++){
                    points.push({
                        x:x + vertexes[i].x * r,
                        y:y + vertexes[i].y * r,
                    });
                }

                color.r = 0.2 + e.r * 0.8;
                Graphics.lines(points, color);
            });

            e.r = nextR(e.r, 1);
            if(e.r > 1){
                e.r = 0.01 + Math.random() * 0.01;
            }


            e.rad = nextRad(e.rad, 1);
        }

        center.x = center.x * 0.97 + nextCenter.x * 0.03;
        center.y = center.y * 0.97 + nextCenter.y * 0.03;
        if(Math.abs(center.x - nextCenter.x) < 0.001 && Math.abs(center.y - nextCenter.y) < 0.001){
            nextCenter.x = 0.1 + Math.random() * 0.8;
            nextCenter.y = 0.1 + Math.random() * 0.8; 
        }
    };
};


const createExBG:()=>(bounds:Rect)=>void = ()=>{
    let count = 0;
    let vertex = 4;
    let rads:{x:number, y:number}[] = [];
    for(let i = 0; i < vertex; i++){
        const rad = Math.PI * 2 * (i+1) / vertex;
        rads.push({
            x:Math.cos(rad),
            y:Math.sin(rad),
        });
    }
    return bounds=>{
        const xNum = 8;
        const yNum = 6;
        const w = bounds.w / xNum;
        const h = bounds.h / yNum;
        const wHalf = w / 2;
        const hHalf = h / 2;
        const color = new Color(0,0.25,0.25);
        const lineWidth = 4;
        count++;
        
        for(let y = 0; y < yNum; y++){
            for(let x = 0; x < xNum; x++){
                let points:{x:number, y:number}[] = [];
                const _x = bounds.x + wHalf + w * x;
                const _y = bounds.y + hHalf + h * y;
                for(let i = 0; i < vertex; i++){
                    points.push({
                        x:_x + rads[i].x * w / 2,
                        y:_y + rads[i].y * h / 2,
                    });
                }
                // Graphics.setLineWidth(lineWidth + Math.sin( x * 0.1 + y * 0.1 + count * 0.1 ) * lineWidth, ()=>{    
                Graphics.setLineWidth(Math.abs(Math.sin( x * 0.1 + y * 0.1 + count * 0.05 )) * lineWidth, ()=>{    
                    Graphics.lines(points, color);
                });
            }
        }

    };
};