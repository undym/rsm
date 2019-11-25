import { Rect, Color, Point } from "../undym/type.js";
import { ILayout, YLayout, RatioLayout, XLayout, Label } from "../undym/layout.js";
import { Input } from "../undym/input.js";
import { Btn } from "./btn.js";
import { Graphics, Font, Texture } from "../graphics/graphics.js";



export class List extends ILayout{
    private elms:ILayout[] = [];
    private aPageElmNum:number;
    private panel:ILayout;
    private elmPanel:YLayout;
    private update:boolean = true;
    private hold = false;
    private holdY = 0;
    //scrollの値1につき1項目スクロールする。少数有効。
    private scroll = 0;
    private vec = 0;
    private scrolled:boolean = false;
    private fitting:boolean;
    private pushed:ListElm;
    private radioBtnMode:boolean = false;
    private radioBtnModeOffGroundColor:()=>Color = ()=>Color.BLACK;
    private radioBtnModeOnGroundColor:()=>Color = ()=>Color.D_CYAN;
    private freezing = false;

    constructor(aPageElmNum:number = 12){
        super();

        this.aPageElmNum = aPageElmNum|0;


        this.elmPanel = new YLayout();
        this.panel = new RatioLayout()
                        .add(Rect.FULL, this.elmPanel);

    }

    init(run:(list:List)=>void):this{
        run(this);
        return this;
    }

    /**タッチ操作を受け付けなくする。 */
    freeze(b:boolean){
        this.freezing = b;
    }
    /** 
     * this.aPageElmNum = this.elms.length;
     * スクロールしなくなる。
     * */
    fit():this{
        this.aPageElmNum = this.elms.length;
        this.fitting = true;
        return this;
    }

    unfit(){
        this.fitting = false;
    }

    setRadioBtnMode(b:boolean, offGroundColor?:()=>Color, onGroundColor?:()=>Color):this{
        this.radioBtnMode = b;
        if(offGroundColor){this.radioBtnModeOffGroundColor = offGroundColor;}
        if(onGroundColor) {this.radioBtnModeOnGroundColor = onGroundColor;}
        return this;
    }

    push(index:number):this{
        const e = this.elms[index];
        if(e instanceof ListElm){
            e.push();
        }
        return this;
    }

    /**pos: "top"|"center"|"bottom". */
    setScroll(index:number, pos:string):void;
    /**pos: "top"|"center"|"bottom". */
    setScroll(elm:ListElm, pos:string):void;
    /**pos: "top"|"center"|"bottom". */
    setScroll(a:any, pos:string):void{
        let index = -1;
        if(typeof a === "number"){
            index = a;
        }else if(a instanceof ListElm){
            for(let i = 0; i < this.elms.length; i++){
                if(this.elms[i] === a){
                    index = i;
                    break;
                }
            }
        }

        if(index === -1){return;}

             if(pos === "top")      {this.scroll = index;}
        else if(pos === "center")   {this.scroll = index - this.aPageElmNum / 2;}
        else                        {this.scroll = index - this.aPageElmNum - 1;}

        this.scroll = this.scroll|0;
        if(this.scroll > this.elms.length - this.aPageElmNum){this.scroll = this.elms.length - this.aPageElmNum;}
        if(this.scroll < 0){this.scroll = 0;}

        this.update = true;
    }

    search(anyMatch:{
        left?:string,
        right?:string,
        center?:string,
    }):ListElm[]{
        const res:ListElm[] = [];
        for(const e of this.elms){
            if(e instanceof ListElm){
                if(anyMatch.left   !== undefined && e.left   && anyMatch.left   === e.left())  {res.push(e); continue;}
                if(anyMatch.right  !== undefined && e.right  && anyMatch.right  === e.right()) {res.push(e); continue;}
                if(anyMatch.center !== undefined && e.center && anyMatch.center === e.center()){res.push(e); continue;}
            }
        }
        return res;
    }

    clear(keepScroll = false){
        this.elms = [];
        
        this.update = true;
        if(!keepScroll){
            this.scroll = 0;
        }
    }

    add(args:{
        push?:(elm:ListElm)=>void,
        hold?:(elm:ListElm)=>void,

        left?:()=>string,
        leftColor?:()=>Color,
        
        right?:()=>string,
        rightColor?:()=>Color,

        center?:()=>string,
        centerColor?:()=>Color,

        groundColor?:()=>Color,
        frameColor?:()=>Color,
        stringColor?:()=>Color,
    }):ListElm{
        if(args.push){
            const push = args.push;
            args.push = elm=>{
                if(this.radioBtnMode){
                    if(this.pushed){
                        this.pushed.groundColor = this.radioBtnModeOffGroundColor;
                    }

                    elm.groundColor = this.radioBtnModeOnGroundColor;
                    this.pushed = elm;
                }
                push(elm);
            };
        }

        const e = new ListElm(args);
        

        this.elms.push(e);

        this.update = true;

        return e;
    }

    addLayout(l:ILayout){
        this.elms.push(l);

        this.update = true;
    }


    async ctrlInner(bounds:Rect){
        if(this.freezing){return;}
        
        const contains = bounds.contains( Input.point );

        if(Input.holding === 0){
            this.hold = false;
        }

        if(contains && Input.holding === 1 && !this.fitting){
            this.hold = true;
            this.holdY = Input.y;
        }

        if(this.hold){
            this.vec = 0;
            const min = bounds.h / this.aPageElmNum;
            const addScroll = (this.holdY - Input.y) / min;
            if(Math.abs(addScroll) >= 0.05){
                this.scrolled = true;
                this.scroll += addScroll;
                this.vec = addScroll;
                this.holdY = Input.y;
                this.update = true;
            }
        }else{
            //下の限界を超えたら下の限界まで戻る
            let bottomLim = this.elms.length - this.aPageElmNum;
            if(bottomLim < 0){bottomLim = 0;}
            if(this.scroll > bottomLim){
                this.scroll -= 0.5 + (this.scroll - bottomLim) / 2;
                if(this.scroll < bottomLim){
                    this.scroll = bottomLim;
                }
                this.update = true;
            }
            //上の限界を超えたら上の限界まで戻る
            if(this.scroll < 0){
                this.scroll += 0.5 + (this.scroll * -1) / 2;
                if(this.scroll > 0){
                    this.scroll = 0;
                }
                this.update = true;
            }

            if(this.vec !== 0){
                this.scroll += this.vec;
                this.vec *= 0.8;
                this.update = true;
                if(Math.abs(this.vec) < 0.02){
                    this.vec = 0;
                }
            }


        }



        if(this.update){
            this.update = false;
            
            const e = this.elmPanel;
            const s = this.scroll|0;
            e.clear();
            for(let i = s - 1; i < s + this.aPageElmNum + 1; i++){//1項目分に満たない上へのスクロール時、上の項目が表示されるように-1。下も同様の理由で+1。
                if(0 <= i && i < this.elms.length){
                    e.add( this.elms[i] );
                }else{
                    e.add( ILayout.empty );
                }
            }

        }

        if(contains && !this.scrolled){
            await this.panel.ctrl( this.scrolledBounds(bounds) );
        }

        if(Input.holding === 0){
            this.scrolled = false;
        }
    }

    drawInner(bounds:Rect){
        
        Graphics.clip(bounds, ()=>{
            const barW = Graphics.dotW * 3;
            const barX = bounds.xw - barW;
            const s = this.scrolledBounds(bounds);
            const listBounds = new Rect(s.x, s.y, s.w - barW, s.h);
            this.panel.draw( listBounds );

            const drawBar = (rect:Rect)=>{
                Graphics.fillRect(rect, Color.D_CYAN);
            };

            if(this.elms.length <= this.aPageElmNum){
                drawBar(new Rect(barX, bounds.y, barW, bounds.h));
            }else{    
                let barH = bounds.h * this.aPageElmNum / this.elms.length;
                const barSpaceH = bounds.h - barH;
                let ratio = this.scroll / (this.elms.length - this.aPageElmNum);
                if(ratio < 0){ratio = 0;}
                if(ratio > 1){ratio = 1;}
                const y = barSpaceH * ratio;
                drawBar(new Rect(barX, bounds.y + y, barW, barH));
            }
        });
    }

    private oneElmH(bounds:Rect){return bounds.h / this.aPageElmNum;}

    private scrolledBounds(bounds:Rect):Rect{
        const oneElmH = this.oneElmH(bounds);
        const s = this.scroll|0;
        return new Rect(bounds.x, bounds.y - oneElmH - (this.scroll - s) * oneElmH, bounds.w, bounds.h + oneElmH * 2);
    }
}




export class ListElm extends ILayout{
    left:(()=>string) | undefined;
    leftColor:()=>Color;

    center:(()=>string) | undefined;
    centerColor:()=>Color;

    right:(()=>string) | undefined;
    rightColor:()=>Color;
    
    push:()=>void;
    hold:()=>void;

    font:Font;

    groundColor:()=>Color;
    frameColor:()=>Color;
    stringColor:()=>Color;

    
    constructor(args:{
        push?:(elm:ListElm)=>void,
        hold?:(elm:ListElm)=>void,
        left?:()=>string,
        leftColor?:()=>Color,
        center?:()=>string,
        centerColor?:()=>Color,
        right?:()=>string,
        rightColor?:()=>Color,
        groundColor?:()=>Color,
        frameColor?:()=>Color,
        stringColor?:()=>Color,
    }){
        super();

        const _push = args.push;
        this.push = _push ? async()=> await _push(this) : ()=>{};
        const _hold = args.hold;
        this.hold = _hold ? async()=> await _hold(this) : ()=>{};

        this.left = args.left;
        this.leftColor   = args.leftColor   ? args.leftColor   : ()=>Color.WHITE;

        this.center = args.center;
        this.centerColor = args.centerColor ? args.centerColor : ()=>Color.WHITE;

        this.right = args.right;
        this.rightColor  = args.rightColor  ? args.rightColor  : ()=>Color.WHITE;


        this.groundColor = args.groundColor ? args.groundColor : ()=>Color.BLACK;
        this.frameColor  = args.frameColor  ? args.frameColor  : ()=>Color.L_GRAY;
        this.stringColor = args.stringColor ? args.stringColor : ()=>Color.WHITE;

        this.font = Font.def;
    }

    async ctrlInner(bounds:Rect){
        if(bounds.contains( Input.point )){
            if(Input.holding > 4){
                await this.hold();
            }
            if(Input.click){
                await this.push();
            }
        }
    }

    drawInner(bounds:Rect){
        Graphics.fillRect(bounds, this.groundColor());
        Graphics.drawRect(bounds, this.frameColor());

        if(this.left !== undefined){
            this.font.draw( this.left(), bounds.left, this.leftColor(), "left" );
        }
        if(this.right !== undefined){
            this.font.draw( this.right(), bounds.right, this.rightColor(), "right" );
        }
        if(this.center !== undefined){
            this.font.draw( this.center(), bounds.center, this.centerColor(), "center" );
        }
    }

}
