import { Player } from "./player.js";
import { Util, PlayData } from "./util.js";
import { Scene, wait } from "./undym/scene.js";
import { Color, Rect, Point } from "./undym/type.js";
import { Tec, ActiveTec, PassiveTec, TecType } from "./tec.js";
import { Dmg, Force, Action, PhaseStartForce, AttackNumForce, Heal, AUForce } from "./force.js";
import { Job } from "./job.js";
import { FX_ShakeStr, FX_RotateStr, FX_Shake, FX_Str, FX_LVUP, FX_PetDie, FX_反射, FX_RemoveCondition } from "./fx/fx.js";
import { ConditionType, Condition, InvisibleCondition } from "./condition.js";
import { Eq, EqPos, EqEar } from "./eq.js";
import { choice } from "./undym/random.js";
import { Graphics, Font } from "./graphics/graphics.js";
import { Img } from "./graphics/texture.js";
// import { DrawSTBox } from "./scene/sceneutil.js";
import { Sound } from "./sound.js";
import { Pet } from "./pet.js";



class PrmSet{
    private _base:number = 0;
    get base()            {return this._base;}
    set base(value:number){this._base = value|0;}

    private _eq:number = 0;
    get eq()              {return this._eq;}
    set eq(value:number)  {this._eq = value|0;}

    private _battle:number = 0;
    get battle()            {return this._battle;}
    set battle(value:number){this._battle = value|0;}

    constructor(){}

    get total():number{
        let res = this.base + this.eq + this.battle;
        if(res < 0){return 0;}
        return res;
    }

    get(...type:("base"|"eq"|"battle")[]):number{
        let res = 0;
        for(const t of type){
            switch(t){
                case "base"  : res += this.base;    break;
                case "eq"    : res += this.eq;      break;
                case "battle": res += this.battle;  break;
            }
        }
        return res > 0 ? res : 0;
    }
}


export class Prm{
    private static _values:Prm[] = [];
    static get values():ReadonlyArray<Prm>{return this._values;}

    static get atkPrms():Prm[]{return [this.STR, this.MAG, this.LIG, this.DRK, this.CHN, this.PST, this.GUN, this.ARR, this.GHOST];}

    private static ordinalNow:number = 0;

    static readonly HP      = new Prm("HP");
    static readonly MAX_HP  = new Prm("最大HP");
    static readonly MP      = new Prm("MP");
    static readonly MAX_MP  = new Prm("最大MP");
    static readonly TP      = new Prm("TP");
    static readonly MAX_TP  = new Prm("最大TP");

    static readonly STR     = new Prm("力");
    static readonly MAG     = new Prm("魔");
    static readonly LIG     = new Prm("光");
    static readonly DRK     = new Prm("闇");
    static readonly CHN     = new Prm("鎖");
    static readonly PST     = new Prm("過");
    static readonly GUN     = new Prm("銃");
    static readonly ARR     = new Prm("弓");

    static readonly LV      = new Prm("Lv");
    static readonly EXP     = new Prm("Exp");
    static readonly BP      = new Prm("BP");

    static readonly EP      = new Prm("EP");
    static readonly MAX_EP  = new Prm("最大EP");
    static readonly XP      = new Prm("XP");
    static readonly MAX_XP  = new Prm("最大XP");
    static readonly SP      = new Prm("SP");
    
    static readonly GHOST   = new Prm("GHOST");


    readonly ordinal:number;

    private constructor(_toString:string){
        this.toString = ()=>_toString;

        this.ordinal = Prm.ordinalNow++;

        Prm._values.push(this);
    }

}


export type Targeting = "select"|"random"|"self"|"all"|"withDead"|"deadOnly"|"withFriend"|"friendOnly";


export abstract class Unit{
    static readonly DEF_MAX_EP = 1;
    static readonly DEF_MAX_XP = 1;
    static readonly EAR_NUM = 2;

    private static _players:PUnit[];
    static get players():ReadonlyArray<PUnit>{return this._players;}

    private static _enemies:EUnit[];
    static get enemies():ReadonlyArray<EUnit>{return this._enemies;}

    private static _all:Unit[];
    static get all():Unit[]{return this._all;}

    static init(){
        let player_num = 4;
        let enemy_num = 4;

        this._players = [];
        for(let i = 0; i < player_num; i++){
            this._players.push(Player.empty.ins);
        }

        this._enemies = [];
        for(let i = 0; i < enemy_num; i++){
            this._enemies.push(new EUnit());
        }

        this.resetAll();
    }

    static setPlayer(index:number, p:Player){
        this._players[index] = p.ins;
        this.resetAll();
    }
    /** */
    static getFirstPlayer():PUnit{
        for(let p of this._players){
            if(p.exists){return p;}
        }
        return this._players[0];
    }

    private static resetAll(){
        this._all = [];
        for(let p of this._players){
            this._all.push(p);
        }
        for(let e of this._enemies){
            this._all.push(e);
        }
    }

    name:string = "";
    exists:boolean = false;
    dead:boolean = false;

    boxBounds:Rect;
    get boxCenter(){return this.boxBounds.center;}
    imgBounds:Rect;
    get imgCenter(){return this.imgBounds.center;}

    readonly img:Img;

    tecs:Tec[] = [];
    /**戦闘時の。 */
    tecListScroll = 0;
    // protected prmSets = new Map<Prm,PrmSet>();
    protected prmSets:PrmSet[] = [];
    protected equips:Eq[] = [];
    protected eqEars:EqEar[] = [];
    protected conditions:{condition:Condition, value:number}[] = [];
    protected invisibleConditions:InvisibleCondition[] = [];

    job:Job;

    pet:Pet|undefined;
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    constructor(){
        this.boxBounds = Rect.ZERO;
        this.imgBounds = Rect.ZERO;

        for(const prm of Prm.values){
            this.prmSets.push(new PrmSet());
        }

        this.prm(Prm.MAX_EP).base = Unit.DEF_MAX_EP;
        this.prm(Prm.MAX_XP).base = Unit.DEF_MAX_XP;

        
        for(let type of ConditionType.values){
            this.conditions.push( {condition:Condition.empty, value:0} );
        }

        for(const pos of EqPos.values){
            this.equips.push( Eq.getDef(pos) );
        }

        for(let i = 0; i < Unit.EAR_NUM; i++){
            this.eqEars.push( EqEar.getDef() );
        }
        
        this.job = Job.訓練生;
    }



    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    abstract isFriend(u:Unit):boolean;

    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    prm(p:Prm){return this.prmSets[p.ordinal] as PrmSet;}

    get hp():number      {return this.prm(Prm.HP).base;}
    set hp(value:number) {
        this.prm(Prm.HP).base = value|0;
        this.fixPrm(Prm.HP, Prm.MAX_HP);
    }
    get mp():number      {return this.prm(Prm.MP).base;}
    set mp(value:number) {
        this.prm(Prm.MP).base = value|0;
        this.fixPrm(Prm.MP, Prm.MAX_MP);
    }
    get tp():number      {return this.prm(Prm.TP).base;}
    set tp(value:number) {
        this.prm(Prm.TP).base = value|0;
        this.fixPrm(Prm.TP, Prm.MAX_TP);
    }
    get ep():number      {return this.prm(Prm.EP).base;}
    set ep(value:number) {
        this.prm(Prm.EP).base = value|0;
        this.fixPrm(Prm.EP, Prm.MAX_EP);
    }
    get sp():number      {return this.prm(Prm.SP).base;}
    set sp(value:number) {
        if(value >= 1) {this.prm(Prm.SP).base = 1;}
        else           {this.prm(Prm.SP).base = 0;}
    }
    get xp():number      {return this.prm(Prm.XP).base;}
    set xp(value:number) {
        this.prm(Prm.XP).base = value|0;
        this.fixPrm(Prm.XP, Prm.MAX_XP);
    }
    get exp():number     {return this.prm(Prm.EXP).base;}
    set exp(value:number){this.prm(Prm.EXP).base = value|0;}

    get bp():number      {return this.prm(Prm.BP).base;}
    set bp(value:number) {this.prm(Prm.BP).base = value|0;}

    get ghost():number   {return this.prm(Prm.GHOST).base;}
    set ghost(value:number){
        const lim = 9999999;
        this.prm(Prm.GHOST).base = value < lim ? value : lim;
    }

    private fixPrm(checkPrm:Prm, maxPrm:Prm){
        if(this.prm(checkPrm).base > this.prm(maxPrm).total){this.prm(checkPrm).base = this.prm(maxPrm).total;}
        if(this.prm(checkPrm).base < 0)                     {this.prm(checkPrm).base = 0;}
    }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    
    async judgeDead(){
        if(!this.exists || this.dead){return;}
        if(this.prm(Prm.HP).base > 0){return;}
        
        Sound.death.play();
        this.dead = true;

        for(const u of Unit.all.filter(u=> u.exists && !u.dead && u !== this)){
            await u.whenAnyoneDead(this);
        }
        if(!this.dead){return;}

        await this.whenDead();
        if(!this.dead){return;}

        Util.msg.set(`${this.name}は死んだ`, Color.RED); await wait();

        for(const set of this.conditions){
            set.condition = Condition.empty;
            set.value = 0;
        }

        this.pet = undefined;
    }
    //---------------------------------------------------------
    //
    //force
    //
    //---------------------------------------------------------
    async equip():Promise<void>{
        for(const prm of Prm.values){
            this.prm(prm).eq = 0;
        }
        await this.force(async f=> f.equip(this));
    }
    async walk(au:AUForce):Promise<void>                    {await this.force(async f=> await f.walk(this,au));}
    async battleStart():Promise<void>                       {await this.force(async f=> await f.battleStart(this));}
    async deadPhaseStart():Promise<void>                    {await this.force(async f=> await f.deadPhaseStart(this));}
    async phaseStart(pForce:PhaseStartForce):Promise<void>  {await this.force(async f=> await f.phaseStart(this, pForce));}
    attackNum(action:Action, aForce:AttackNumForce)         {this.force(async f=> await f.attackNum(action, this, aForce));}
    async beforeDoAtk(dmg:Dmg):Promise<void>                {await this.force(async f=> await f.beforeDoAtk(dmg));}
    async beforeBeAtk(dmg:Dmg):Promise<void>                {await this.force(async f=> await f.beforeBeAtk(dmg));}
    async beDamage(dmg:Dmg):Promise<void>                   {await this.force(async f=> await f.beDamage(dmg));}
    async afterDoAtk(dmg:Dmg):Promise<void>                 {await this.force(async f=> await f.afterDoAtk(dmg));}
    async afterBeAtk(dmg:Dmg):Promise<void>                 {await this.force(async f=> await f.afterBeAtk(dmg));}
    async memberAfterDoAtk(dmg:Dmg):Promise<void>           {await this.force(async f=> await f.memberAfterDoAtk(this, dmg));}
    async whenDead():Promise<void>                          {await this.force(async f=> await f.whenDead(this));}
    async whenAnyoneDead(deadUnit:Unit):Promise<void>       {await this.force(async f=> await f.whenAnyoneDead(this, deadUnit))}
    async beHeal(heal:Heal):Promise<void>                   {await this.force(async f=> await f.beHeal(heal));}
    async doHeal(heal:Heal):Promise<void>                   {await this.force(async f=> await f.doHeal(heal));}
    async phaseEnd():Promise<void>                          {await this.force(async f=> await f.phaseEnd(this));}

    protected async force(forceDlgt:(f:Force)=>Promise<void>):Promise<void>{
        for(const tec of this.tecs){
            await forceDlgt( tec.force );
        }
        for(const eq of this.equips.values()){
            await forceDlgt( eq.force );
        }
        for(const ear of this.eqEars.values()){
            await forceDlgt( ear.force );
        }
        for(const cond of this.conditions.values()){
            await forceDlgt( cond.condition.force );
        }
        if(this.pet){
            await forceDlgt( this.pet.force );
        }
        for(const inv of this.invisibleConditions.values()){
            await forceDlgt( inv.force );
        }
    }
    //---------------------------------------------------------
    //
    //Condition
    //
    //---------------------------------------------------------
    hasCondition(condition:Condition|ConditionType){
        if(condition instanceof Condition){
            return this.conditions[condition.type.ordinal].condition === condition;
        }
        if(condition instanceof ConditionType){
            return this.conditions[condition.ordinal].condition !== Condition.empty;
        }
        return false;
    }
    /**指定の状態を解除.その状態でなければ何もしない. */
    removeCondition(condition:Condition|ConditionType){
        if(condition instanceof Condition){
            const set = this.conditions[condition.type.ordinal];
            if(set.condition === condition){
                set.condition = Condition.empty;
            }
            return;
        }
        if(condition instanceof ConditionType){
            this.conditions[condition.ordinal].condition = Condition.empty;
            return;
        }
    }
    clearConditions(){
        for(const set of this.conditions){
            set.condition = Condition.empty;
            set.value = 0;
        }
    }
    /**valueが1未満ならemptyをセットする。 */
    setCondition(condition:Condition, value:number){
        const set = this.conditions[condition.type.ordinal];
        if(value < 1){
            set.condition = Condition.empty;
            set.value = 0;
            return;
        }
        set.condition = condition;
        set.value = value|0;
    }

    getCondition(type:ConditionType):Condition{
        return this.conditions[type.ordinal].condition;
    }
    /**その状態でなければ0を返す。 */
    getConditionValue(condition:Condition|ConditionType):number{
        if(condition instanceof Condition){
            const set = this.conditions[condition.type.ordinal];
            if(set.condition === condition){
                return set.value;
            }
        }
        if(condition instanceof ConditionType){
            return this.conditions[condition.ordinal].value;
        }
        return 0;
    }
    /**返り値は変更しても影響なし。 */
    getConditionSet(type:ConditionType):{condition:Condition, value:number}{
        const set = this.conditions[type.ordinal];
        return {condition:set.condition, value:set.value};
    }
    //---------------------------------------------------------
    //
    //InvisibleCondition
    //
    //---------------------------------------------------------
    clearInvisibleConditions(){this.invisibleConditions = [];}
    removeInvisibleCondition(remove:InvisibleCondition){
        this.invisibleConditions = this.invisibleConditions.filter(c=> c !== remove);
    }
    addInvisibleCondition(iCondition:InvisibleCondition){
        this.invisibleConditions.push( iCondition );
    }
    getInvisibleConditions():ReadonlyArray<InvisibleCondition>{return this.invisibleConditions;}
    hasInvisibleCondition(uniqueName:string):boolean{
        return this.invisibleConditions.some(inv=> inv.uniqueName === uniqueName);
    }
    //---------------------------------------------------------
    //
    //Eq
    //
    //---------------------------------------------------------
    getEq(pos:EqPos):Eq            {return this.equips[pos.ordinal];}
    setEq(pos:EqPos, eq:Eq):void   {this.equips[pos.ordinal] = eq;}
    //---------------------------------------------------------
    //
    //EqEar
    //
    //---------------------------------------------------------
    getEqEar(index:number):EqEar     {return this.eqEars[index];}
    setEqEar(index:number, ear:EqEar){this.eqEars[index] = ear;}
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    /**
     * 
     */
    searchUnits(who:Targeting[], num:number):Unit[]{
        
        if(who.some(w=> w === "self")){
            return new Array<Unit>(num).fill(this);
        }

        let filtered = Unit.all.filter(t=> t.exists);
             if(who.some(w=> w === "withDead")){}
        else if(who.some(w=> w === "deadOnly")){filtered = filtered.filter(t=> t.dead);}
        else                                   {filtered = filtered.filter(t=> !t.dead);}

             if(who.some(w=> w === "withFriend")){}
        else if(who.some(w=> w === "friendOnly")){filtered = filtered.filter(t=> t.isFriend(this));}
        else                                     {filtered = filtered.filter(t=> !t.isFriend(this));}

        if(filtered.length === 0){return [];}

        if(who.some(w=> w === "random")){
            let res:Unit[] = [];
            for(let i = 0; i < num; i++){
                res.push( choice(filtered) );
            }
            return res;
        }
        
        if(who.some(w=> w === "select")){
            return new Array<Unit>(num).fill( choice(filtered) );
        }
        //all
        let res:Unit[] = [];
        for(let i = 0; i < num; i++){
            res = res.concat( filtered );
        }
        return res;
    }
    /**
     * !existsとdeadは含めない.
     * @party 本人を含める.
     * @withDead deadを含める.
     */
    searchUnitsEx(...who:("withDead"|"top"|"bottom"|"faceToFace"|"party")[]):Unit[]{
        const withDead   = who.some(w=> w === "withDead");
        const top    = who.some(w=> w === "top");
        const bottom = who.some(w=> w === "bottom");
        const ftf    = who.some(w=> w === "faceToFace");
        const party  = who.some(w=> w === "party");
        const searchOwnIndex = (units:ReadonlyArray<Unit>):number=>{
            for(let i = 0; i < units.length; i++){
                if(units[i] === this){return i;}
            }
            return 0;
        };
        const search = (units:ReadonlyArray<Unit>, others:ReadonlyArray<Unit>):Unit[]=>{
            const map = new Map<Unit,true>();
            const index = searchOwnIndex(units);
            if(top    && index > 0)                {map.set(units[index-1], true);}
            if(bottom && index < units.length - 1) {map.set(units[index+1], true);}
            if(ftf)                                {map.set(others[index], true);}
            if(party)                              {units.forEach(u=> map.set(u, true));}
            
            let res:Unit[] = [];
            for(const key of map.keys()){
                res.push(key);
            }
            if(!withDead){
                res = res.filter(u=> !u.dead);
            }
            return res.filter(u=> u.exists);
        }
        if(this instanceof PUnit){
            return search(Unit.players, Unit.enemies);
        }
        if(this instanceof EUnit){
            return search(Unit.enemies, Unit.players);
        }
        return [];
    };
}


export class PUnit extends Unit{
    private jobLvs = new Map<Job,{lv:number, exp:number}>();
    private masteredTecs = new Map<Tec,boolean>();

    
    constructor(readonly player:Player){
        super();

        for(let job of Job.values){
            this.jobLvs.set(job, {lv:0, exp:0});
        }

        for(let tec of ActiveTec.values){
            this.masteredTecs.set(tec, false);
        }
        for(let tec of PassiveTec.values){
            this.masteredTecs.set(tec, false);
        }
    }

    get img(){return this.player.img;}

    isFriend(u:Unit):boolean{return (u instanceof PUnit);}
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    async addExp(exp:number){
        this.prm(Prm.EXP).base += exp;
        if(
            this.prm(Prm.EXP).base >= this.getNextLvExp()
            && this.prm(Prm.LV).base < 99
            //&& (this.prm(Prm.LV).base < 99 && Mix.上限突破99.count === 0)
            && this.prm(Prm.LV).base < 999
        ){
            this.prm(Prm.LV).base++;
            this.prm(Prm.EXP).base = 0;

            Sound.lvup.play();
            FX_LVUP( this.img, this.imgBounds, Color.BLACK, true );
            Util.msg.set(`${this.name}はLv${this.prm(Prm.LV).base}になった`, Color.ORANGE.bright); await wait();

            const growHP = (this.prm(Prm.LV).base + 100) / (100 + (this.prm(Prm.LV).base % 2) * 100);
            this.growPrm( Prm.MAX_HP, growHP );

            for(const gp of this.job.growthPrms){
                this.growPrm( gp.prm, gp.value );
            }

            const addBP = (1 + this.prm(Prm.LV).base / 100)|0;
            this.bp += addBP;
            Util.msg.set(`BP+${addBP}`, Color.GREEN.bright);
        }
    }

    getNextLvExp():number{
        const lv = this.prm(Prm.LV).base;
        const grade = (lv/49+1)|0;
        return (lv * grade * 5)|0;
    }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    private getJobLvSet(job:Job):{lv:number, exp:number}{return this.jobLvs.get(job) as {lv:number, exp:number};}
    setJobExp(job:Job, exp:number){this.getJobLvSet(job).exp = exp;}
    getJobExp(job:Job):number     {return this.getJobLvSet(job).exp;}
    async addJobExp(value:number){
        if(this.isMasteredJob(this.job)){return;}

        const set = this.getJobLvSet(this.job);

        set.exp += value;
        if(set.exp >= this.job.lvupExp){
            set.lv += 1;
            set.exp = 0;

            Sound.lvup.play();
            Util.msg.set(`${this.name}の${this.job}Lvが${set.lv}になった`, Color.ORANGE.bright); await wait();

            const learnings = this.job.learningTecs;
            const ratio = set.lv / this.job.maxLv;
            for(let i = 0; i < learnings.length; i++){
                if(i+1 > ((learnings.length * ratio)|0)){break;}
                if(learnings[i] === Tec.empty){continue;}
                if(this.isMasteredTec(learnings[i])){continue;}

                this.setMasteredTec(learnings[i], true);
                Util.msg.set(`[${learnings[i]}]を習得した！`, Color.GREEN.bright); await wait();

                //技スロットに空きがあれば覚えた技をセット
                for(let ei = 0; ei < this.tecs.length; ei++){
                    if(this.tecs[ei] === Tec.empty){
                        this.tecs[ei] = learnings[i];
                        this.equip();
                        break;
                    }
                }
            }

            if(set.lv >= this.job.maxLv){
                Util.msg.set(`${this.job}を極めた！`, Color.ORANGE.bright); await wait();
            }
        }
    }

    setJobLv(job:Job, lv:number){this.getJobLvSet(job).lv = lv;}
    getJobLv(job:Job):number    {return this.getJobLvSet(job).lv;}

    isMasteredJob(job:Job):boolean{return this.getJobLvSet(job).lv >= job.maxLv;}
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    setMasteredTec(tec:Tec, b:boolean){this.masteredTecs.set(tec, b);}
    isMasteredTec(tec:Tec):boolean{
        const b = this.masteredTecs.get(tec);
        return b ? b : false;
    }
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
    /**1未満の値は無視される。 */
    private async growPrm(prm:Prm, value:number){
        value = value|0;
        if(value <= 0){return;}
        this.prm(prm).base += value;

        Util.msg.set(`[${prm}]+${value}`, Color.GREEN.bright); await wait();
    }
}




export class EUnit extends Unit{
    static readonly DEF_AI = async(attacker:Unit, targetCandidates:Unit[])=>{
        let activeTecs:ActiveTec[] = attacker.tecs.filter(tec=> tec instanceof ActiveTec) as ActiveTec[];
        if(activeTecs.length === 0){
            await Tec.何もしない.use( attacker, [attacker] );
            return;
        }

        for(let i = 0; i < 10; i++){
            let tec = choice( activeTecs );
            if(tec.checkCost(attacker)){
                const targets = attacker.searchUnits( tec.targetings, tec.rndAttackNum(attacker) );
                if(targets.length === 0){continue;}
                await tec.use( attacker, targets );
                return;
            }
        }

        await Tec.殴る.use( attacker, attacker.searchUnits( Tec.殴る.targetings, Tec.殴る.rndAttackNum(attacker) ) );
    };

    yen:number = 0;

    ai = EUnit.DEF_AI;

    private _img:Img;
    get img(){return this._img;}
    set img(setImg:Img){this._img = setImg;}

    constructor(){
        super();

        this._img = Img.empty;
    }

    isFriend(u:Unit):boolean{return (u instanceof EUnit);}

    
    //---------------------------------------------------------
    //
    //
    //
    //---------------------------------------------------------
}





export namespace Unit{
    
    class FXFont{
        private static font:Font;
        static get def(){return this.font ? this.font : (this.font = new Font(60));}
    }

    /***/
    export const setCondition = (target:Unit, condition:Condition, value:number, overwrite = false)=>{
        value = value|0;
        if(value <= 0){return;}
        if(condition === Condition.empty){return;}
        if(!overwrite && target.getCondition(condition.type) !== Condition.empty){return;}

        target.setCondition(condition, value);

        FX_Str(FXFont.def, `<${condition}>`, target.boxBounds.center, Color.WHITE);
        Util.msg.set(`${target.name}は<${condition}${value}>になった`, cnt=>condition.color(cnt));
    };
    /** */
    export const addConditionValue = (target:Unit, condition:Condition, add:number)=>{
        if(!target.hasCondition(condition)){return;}

        const nowValue = target.getConditionValue(condition);
        target.setCondition(condition, nowValue + add);
        if(!target.hasCondition(condition)){
            FX_RemoveCondition(target.imgCenter);
        }
    };
    /** */
    export const set反射Inv = (unit:Unit)=>{
        unit.addInvisibleCondition(new class extends InvisibleCondition{
            readonly uniqueName = "反射";
            createForce(_this:InvisibleCondition){return new class extends Force{
                async beDamage(dmg:Dmg){
                    dmg.target.removeInvisibleCondition(_this);
    
                    if(!dmg.canCounter || dmg.attacker === dmg.target){return;}
    
                    if(dmg.result.isHit){
                        FX_反射( dmg.target.imgCenter, dmg.attacker.imgCenter );
                        Util.msg.set("＞反射");
                        const refDmg =  new Dmg({
                                            attacker:dmg.target,
                                            target:dmg.attacker,
                                            absPow:dmg.result.value,
                                            canCounter:false,
                                        });
                        await refDmg.run(); await wait();
    
                        dmg.result.value = 0;
                    };
                }
            };}
        });
    };
    /** */
    export const set吸収Inv = (unit:Unit, drainSuccessAction?:()=>void)=>{
        const name = "吸収";
        if(unit.hasInvisibleCondition(name)){return;}
        unit.addInvisibleCondition(new class extends InvisibleCondition{
            readonly uniqueName = name;
            createForce(_this:InvisibleCondition){return new class extends Force{
                async beDamage(dmg:Dmg){
                    dmg.target.removeInvisibleCondition(_this);
    
                    if(dmg.result.isHit){
                        const value = Heal.run("HP", dmg.result.value, dmg.attacker, unit, this, false);
                        Util.msg.set(`＞${value}のダメージを吸収`, Color.GREEN); await wait();
        
                        dmg.result.value = 0;
                        if(drainSuccessAction){
                            drainSuccessAction();
                        }
                    }
                }
            };}
        });
    };
    // /** */
    // export const removeCondition = (unit:Unit, condition:Condition)=>{
    //     if(unit.hasCondition(condition)){
    //         unit.removeCondition(condition);
    //         FX_RemoveCondition( unit.imgCenter );
    //     }
    // };
}