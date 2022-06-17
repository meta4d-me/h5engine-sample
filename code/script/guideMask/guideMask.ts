
/** 新手引导 遮罩 */
@m4m.reflect.node2DComponent
class guideMask extends m4m.framework.behaviour2d
{   
    private _holeRect = new m4m.math.rect(50,50,100,100);
    //镂空矩形 (x,y,width,height)
    @m4m.reflect.Field("rect")
    get holeRect(){
        return this._holeRect;
    } 
    set holeRect(val:m4m.math.rect){
        m4m.math.rectClone(val,this._holeRect);
        this.refreshMask();
        console.error("set holeRect");
    }
    
    @m4m.reflect.Field("reference",null,"transform2D")
    template : m4m.framework.transform2D;
    private inited = false;
    public onPlay() {
        if(!this.template) return;
        let opt = m4m.framework.layoutOption;
        //clone ui
        this.top = this.template.clone();
        this.top.name = "top";
        this.bottom = this.template.clone();
        this.bottom.name = "bottom";
        this.left = this.template.clone();
        this.left.name = "left";
        this.right = this.template.clone();
        this.right.name = "right";
        this.cells.push(this.top,this.bottom,this.left,this.right);
        this.cells.forEach(sub=>{
            sub.layoutState = opt.TOP | opt.BOTTOM | opt.LEFT | opt.RIGHT ;
            sub.visible = true;
            this.transform.addChild(sub);
        });

        this.inited = true;
        this.refreshMask();
    }
    public update(delta: number) {

    }
    public remove() {
        let len = this.cells.length;
        for(let i=0 ;i < len ;i++){
            let sub = this.cells.pop();
            sub.dispose();
        }
        this.cells.length = 0;
        this.template.dispose();
        this.template = null;
        m4m.math.pool.delete_rect(this._holeRect);
        this._holeRect = null;
    }

    private cells : m4m.framework.transform2D[] = [];
    private top :m4m.framework.transform2D;
    private bottom :m4m.framework.transform2D;
    private left :m4m.framework.transform2D;
    private right :m4m.framework.transform2D;

    //刷新 mask
    private refreshMask(){
        if(!this.inited) return;
        this.cells.forEach(sub=>{sub.visible = false});
        console.error(this.cells.length);
        let opt = m4m.framework.layoutOption;
        let r = this._holeRect;
        let tran = this.transform;
        let pos = tran.localTranslate;
        let isFull = false;
        //top
        let topVal = 0;
        if( r.y > 0 ){
            topVal = this.transform.height  - r.y;
            this.top.setLayoutValue(opt.BOTTOM,topVal);
            this.top.markDirty();
            this.top.visible = true;
        }else{
            this.top.visible = false;
            isFull = true;
        }

        let bottomVal = 0;
        //bottom
        if( r.y + r.h < tran.height ){
            let height = r.h < 0 ? 0: r.h;
            bottomVal = r.y + height;
            this.bottom.setLayoutValue(opt.TOP,bottomVal);
            this.bottom.markDirty();
            this.bottom.visible = true;
        }else{
            this.bottom.visible = false;
            isFull = true;
        }

        //left
        if(r.x > 0 && !isFull){
            //ef top
            this.left.setLayoutValue(opt.BOTTOM,topVal);
            //ef bottom
            this.left.setLayoutValue(opt.TOP,bottomVal);

            let val = this.transform.width - r.x ;
            this.left.setLayoutValue(opt.RIGHT,val);
            this.left.markDirty();
            this.left.visible = true;
        }else{
            this.left.visible = false;
        }

        //right
        if( r.x + r.w < tran.width && !isFull){
            //ef top
            this.right.setLayoutValue(opt.BOTTOM,topVal);
            //ef bottom
            this.right.setLayoutValue(opt.TOP,bottomVal);
            let width = r.w < 0 ? 0: r.w;
            let val = r.x + width;
            this.right.setLayoutValue(opt.LEFT,val);
            this.right.markDirty();
            this.right.visible = true;
        }else{
            this.right.visible = false;
        }
    }
}    
