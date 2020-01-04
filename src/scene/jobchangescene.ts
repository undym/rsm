import { Scene } from "../undym/scene.js";
import { FlowLayout, ILayout, VariableLayout, XLayout, RatioLayout, Labels, Layout, YLayout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Unit, PUnit } from "../unit.js";
import { Input } from "../undym/input.js";
import { Rect, Color, Point } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail, DrawPlayInfo, DrawYen } from "./sceneutil.js";
import { Place } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List, ListElm } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { FX_Str } from "../fx/fx.js";
import { Job } from "../job.js";
import { Sound } from "../sound.js";



export class JobChangeScene extends Scene{
    private list:List = new List();
    private target:PUnit = Unit.getFirstPlayer();
    private info:ILayout = ILayout.empty;
    private jobChangeBtn:ILayout = ILayout.empty;

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
                        .add(Place.LIST_USE_BTN, new VariableLayout(()=> this.jobChangeBtn))
                )
        );
        
        super.add(Place.YEN, DrawYen.ins);

        super.add(Place.LIST_TYPE, ILayout.empty);

        super.add(Place.LIST_BTN,
            new Btn("<<", ()=>{
                Sound.system.play();
                Scene.load(TownScene.ins);
            })
        );
        
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);
            
        super.add(Rect.FULL, ILayout.create({draw:(bounds)=>{
            Graphics.fillRect(this.target.boxBounds, new Color(0,1,1,0.2));
        }}));
        super.add(Rect.FULL, ILayout.create({ctrl:(bounds)=>{
            if(!Input.click){return;}

            for(let p of Unit.players.filter(p=> p.exists)){
                if(p.boxBounds.contains( Input.point )){
                    this.target = p;
                    this.info = ILayout.empty;
                    this.jobChangeBtn = ILayout.empty;
                    Sound.system.play();
                    this.setList();
                    break;
                }
            }
        }}));

    }

    private setList(){

        this.list.clear();

        this.list.add({
            center:()=>`${this.target.name}`,
            groundColor:()=>Color.D_GRAY,
        });

        let choosedJob:Job;


        // Job.values
        //     .filter(job=> job.canJobChange(this.target) || this.target.getJobLv(job) > 0)
        this.target.player.calcJobChangeList()
            .forEach(job=>{
                const color:()=>Color = ()=>{
                    if(this.target.isMasteredJob(job)){return Color.ORANGE;}
                    return Color.WHITE;
                };

                this.list.add({
                    left:()=>{
                        let res = "";
                        if(this.target.isMasteredJob(job))  {res += "★";}
                        else                                {res += `${this.target.getJobLv(job)}`}

                        if(this.target.job === job){res += "=";}

                        return res;
                    },
                    leftColor:color,
                    right:()=>`${job}`,
                    rightColor:color,
                    groundColor:()=>choosedJob === job ? Color.D_CYAN : Color.BLACK,
                    push:(elm)=>{
                        Sound.system.play();
                        choosedJob = job;

                        const jobImgH = 0.1;
                        const jobImgW = Graphics.pixelH * jobImgH / Graphics.pixelW;
                        this.info = new Labels(Font.def)
                                        .add(()=>`${job}`)
                                        .addLayout(ILayout.create({draw:bounds=>{
                                            job.img.drawEx({
                                                dstRatio:new Rect(bounds.x, bounds.y, jobImgW, jobImgH),
                                                keepRatio:true,
                                            })
                                        }}) ,()=> jobImgH)
                                        .add(()=>`${job.info}`)
                                        .addln(()=>{
                                            let res = "";
                                            for(const gp of job.growthPrms){
                                                res += `[${gp.prm}]+${gp.value} `;
                                            }
                                            return res;
                                        })
                                        ;
                                        
                        this.jobChangeBtn = new Btn("転職", ()=>{
                            if(this.target.job === job){
                                
                            }else{
                                this.target.job = job;
                                Sound.bpup.play();
                                FX_Str(Font.def, `${this.target.name}は[${job}]になった`, Point.CENTER, Color.WHITE);
                            }
                        }).dontMove();
                    },

                });
            });
    }
}
