import { Scene } from "../undym/scene.js";
import { FlowLayout, ILayout, VariableLayout, XLayout, RatioLayout, Labels, Label, Layout, YLayout } from "../undym/layout.js";
import { Btn } from "../widget/btn.js";
import { Rect, Color } from "../undym/type.js";
import { DrawSTBoxes, DrawUnitDetail, DrawPlayInfo, DrawYen } from "./sceneutil.js";
import { Place } from "../util.js";
import { Graphics, Font } from "../graphics/graphics.js";
import { List } from "../widget/list.js";
import { TownScene } from "./townscene.js";
import { FX_Str } from "../fx/fx.js";
import { PartySkill, PartySkillOpenBox } from "../partyskill.js";
import { Sound } from "../sound.js";






export class PartySkillScene extends Scene{

    private settingSkillList = new List();
    private list = new List();
    private choosedSkill:PartySkill = PartySkill.empty;

    constructor(){
        super();
        
        this.choosedSkill = PartySkill.empty;
        SettingSkillMap.reset();
        this.setSettingSkillList();
        this.setList();
    }

    init(){

        super.clear();


        super.add(Place.LIST_MAIN, 
            new XLayout()
                .add(this.settingSkillList)
                .add(this.list)
                .add(
                    new RatioLayout()
                        .add(Place.LIST_INFO,
                            new Layout()
                                .add(ILayout.create({draw:(bounds)=>{
                                    Graphics.fillRect(bounds, Color.D_GRAY);
                                }}))
                                .add((()=>{
                                    const info = new Labels(Font.def)
                                                    .add(()=>`[${this.choosedSkill}]`)
                                                    ;
                                    return new VariableLayout(()=>this.choosedSkill !== PartySkill.empty ? info : ILayout.empty);
                                })())
                        )
                        .add(Place.LIST_USE_BTN,
                            (()=>{
                                const set = new Btn("セット",async()=>{
                                    for(let i = 0; i < PartySkill.skills.length; i++){
                                        if(PartySkill.skills[i] === PartySkill.empty){
                                            PartySkill.skills[i] = this.choosedSkill;
                                            Sound.keyopen.play();
                                            FX_Str(Font.def, `${this.choosedSkill}をセットしました`, {x:0.5, y:0.5}, Color.WHITE);
            
                                            SettingSkillMap.reset();
                                            this.setSettingSkillList();
                                            return;
                                        }
                                    }
            
                                    FX_Str(Font.def, `セット枠に空きがありません`, {x:0.5, y:0.5}, Color.WHITE);
                                });
                                const unset = new Btn("外す",async()=>{
                                    for(let i = 0; i < PartySkill.skills.length; i++){
                                        if(PartySkill.skills[i] === this.choosedSkill){
                                            PartySkill.skills[i] = PartySkill.empty;
                                            Sound.keyopen.play();
                                            FX_Str(Font.def, `${this.choosedSkill}を外しました`, {x:0.5, y:0.5}, Color.WHITE);
            
                                            SettingSkillMap.reset();
                                            this.setSettingSkillList();
                                            return;
                                        }
                                    }
                                });
                                const noset = new Btn("-",()=>{});
            
                                return new VariableLayout(()=>{
                                    if(this.choosedSkill === PartySkill.empty){return noset;}
                                    if(SettingSkillMap.has( this.choosedSkill )){return unset;}
                                    return set;
                                });
                            })()
                        )
                )
        );

        super.add(Place.YEN, DrawYen.ins);

        super.add(Place.LIST_BTN,
            new Btn("<<", ()=>{
                Sound.pi.play();
                Scene.load( TownScene.ins );
            })
        );
        super.add(Place.P_BOX, DrawSTBoxes.players);
        super.add(Place.MAIN, DrawUnitDetail.ins);


    }

    private setSettingSkillList(){
        this.settingSkillList.clear(true);
        this.settingSkillList.add({
            center:()=>`セット中`,
            groundColor:()=>Color.D_GRAY,
        });

        PartySkill.skills
            .forEach((skill)=>{
                if(skill === PartySkill.empty){
                    this.settingSkillList.add({
                        right:()=>"-",
                    });
                }else{
                    let color:()=>Color = ()=>{
                        if(skill === this.choosedSkill){return Color.ORANGE;}
                        return Color.WHITE;
                    };
                    this.settingSkillList.add({
                        right:()=>`${skill}`,
                        rightColor:color,
                        groundColor:()=>SettingSkillMap.has(skill) ? Color.D_CYAN : Color.BLACK,
                        push:(elm)=>{
                            this.choosedSkill = skill;
                        },
    
                    });
                }
            });
    }

    private setList(){

        this.list.clear(true);
        this.list.add({
            center:()=>`スキル`,
            groundColor:()=>Color.D_GRAY,
        });

        PartySkill.values
            .filter(skill=> skill.has && skill !== PartySkill.empty)
            .forEach((skill)=>{
                let color:()=>Color = ()=>{
                    if(skill === this.choosedSkill){return Color.ORANGE;}
                    return Color.WHITE;
                };

                this.list.add({
                    right:()=>`${skill}`,
                    rightColor:color,
                    groundColor:()=>SettingSkillMap.has(skill) ? Color.D_CYAN : Color.BLACK,
                    push:(elm)=>{
                        this.choosedSkill = skill;
                    },
                });
            });
    }
}


class SettingSkillMap{
    private static map = new Map<PartySkill,boolean>();
    static reset(){
        this.map.clear();
        for(const skill of PartySkill.skills){
            this.map.set(skill, true);
        }
    }

    static has(skill:PartySkill){
        return this.map.has(skill);
    }
}