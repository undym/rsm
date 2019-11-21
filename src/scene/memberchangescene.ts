import { Scene } from "../undym/scene.js";
import { ILayout, VariableLayout, XLayout, RatioLayout, Labels, Layout, YLayout, Label } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit, Prm } from "../unit.js";
import { Input } from "../undym/input.js";
import { Rect, Color, Point } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail, DrawYen } from "./sceneutil.js";
import { Place } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { FX_Str } from "../fx/fx.js";
import { Sound } from "../sound.js";
import { Player } from "../player.js";
import { EqPos, EqEar } from "../eq.js";



export class MemberChangeScene extends Scene{
    private list:List = new List();
    private choosed:Player = Player.empty;
    private info:ILayout = ILayout.empty;
    private exchangeBtn:ILayout = ILayout.empty;

    constructor(){
        super();

        this.setList();
    }

    init(){

        super.clear();
        
        super.add(Place.LIST_MAIN, 
            new XLayout()
                .add(this.list)
                .add(
                    new RatioLayout()
                        .add(Place.LIST_INFO,
                            new Layout()
                                .add(ILayout.create({draw:(bounds)=>{
                                    Graphics.fillRect(bounds, Color.D_GRAY);
                                }}))
                                .add(new VariableLayout(()=>this.info))
                        )
                        .add(Place.LIST_USE_BTN, new VariableLayout(()=> this.exchangeBtn))
                )
        );
        
        super.add(Place.YEN, DrawYen.ins);

        super.add(Place.LIST_TYPE, ILayout.empty);

        super.add(Place.LIST_BTN,
            new Btn("<<", ()=>{
                if(!Unit.players.find(p=> p.exists)){
                    FX_Str(Font.def, "誰もいない", Point.CENTER, Color.WHITE);
                    return;
                }
                Sound.system.play();
                Scene.load(TownScene.ins);
            })
        );
        
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
            
        super.add(Rect.FULL, ILayout.create({draw:(bounds)=>{
            if(this.choosed === Player.empty){return;}
            Graphics.fillRect(this.choosed.ins.boxBounds, new Color(0,1,1,0.2));
        }}));
        super.add(Rect.FULL, ILayout.create({ctrl:(bounds)=>{
            if(!Input.click){return;}

            let i = 0;
            for(let p of Unit.players.filter(p=> p.exists)){
                if(p.boxBounds.contains( Input.point )){
                    this.choosed = p.player;
                    this.exchangeBtn = new Btn("外す", ()=>{
                        FX_Str(Font.def, `${p.name}を外した`, Point.CENTER, Color.WHITE);
                        Unit.setPlayer( i, Player.empty );
                        this.setList();
                    });
                    this.setInfo(p.player);
                    break;
                }
                i++;
            }
        }}));

    }

    private setList(){

        this.list.clear();
        
        const battleMembers = new Map<Player,true>();
        for(const u of Unit.players){
            battleMembers.set( u.player, true );
        }

        Player.values
            .filter(p=> p !== Player.empty && p.member && !battleMembers.has(p))
            .forEach(p=>{
                this.list.add({
                    left:()=>`${p.ins.prm(Prm.LV).total}`,
                    right:()=>p.ins.name,
                    groundColor:()=>this.choosed === p ? Color.D_CYAN : Color.BLACK,
                    push:(elm)=>{
                        this.choosed = p;
                        Sound.system.play();
                        
                        this.exchangeBtn = new Btn("入れる", ()=>{
                            for(let i = 0; i < Unit.players.length; i++){
                                if(Unit.players[i].player === Player.empty){
                                    Unit.setPlayer( i, p );
                                    FX_Str(Font.def, `${p}を入れた`, Point.CENTER, Color.WHITE);
                                    this.setList();
                                    break;
                                }
                            }
                        });

                        this.setInfo(p);
                    },

                });
            });
    }

    private setInfo(player:Player){
        const u = player.ins;
        this.info = new Labels(Font.def)
                        .add(()=>u.name)
                        .add(()=>`Lv:${u.prm(Prm.LV).total}`)
                        .add(()=>`HP:${u.prm(Prm.MAX_HP).total}`)
                        .addLayout(new XLayout()
                            .add(new Label(Font.def, ()=>`MP:${u.prm(Prm.MAX_MP).total}`))
                            .add(new Label(Font.def, ()=>`TP:${u.prm(Prm.MAX_TP).total}`))
                        )
                        .addLayout(new XLayout()
                            .add(new Label(Font.def, ()=>`力:${u.prm(Prm.STR).total}`))
                            .add(new Label(Font.def, ()=>`魔:${u.prm(Prm.MAG).total}`))
                        )
                        .addLayout(new XLayout()
                            .add(new Label(Font.def, ()=>`光:${u.prm(Prm.LIG).total}`))
                            .add(new Label(Font.def, ()=>`闇:${u.prm(Prm.DRK).total}`))
                        )
                        .addLayout(new XLayout()
                            .add(new Label(Font.def, ()=>`鎖:${u.prm(Prm.CHN).total}`))
                            .add(new Label(Font.def, ()=>`過:${u.prm(Prm.PST).total}`))
                        )
                        .addLayout(new XLayout()
                            .add(new Label(Font.def, ()=>`銃:${u.prm(Prm.GUN).total}`))
                            .add(new Label(Font.def, ()=>`弓:${u.prm(Prm.ARR).total}`))
                        )
                        .br()
                        .addArray(()=>{
                            const res:[string,Color?][] = [];
                            for(let i = 0; i < Unit.EAR_NUM; i++){
                                res.push([`耳:${u.getEqEar(i)}`]);
                            }
                            EqPos.values.forEach(pos=>{
                                res.push([`${pos}:${u.getEq(pos)}`]);
                            });
                            return res;
                        })
    }
}
