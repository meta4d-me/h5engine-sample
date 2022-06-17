//UI 新手引导
class test_UIGuideMask implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    assetMgr: m4m.framework.assetMgr;
    iptMgr: m4m.framework.inputMgr;
    rooto2d: m4m.framework.overlay2D;
    private inited = false;
    async start(app: m4m.framework.application) {
        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();
        this.iptMgr = this.app.getInputMgr();
        //相机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10;
        //2dUI root
        this.rooto2d = new m4m.framework.overlay2D();
        this.camera.addOverLay(this.rooto2d);
        await datGui.init();
        this.init();
    }
    
    private dec  = "点击屏幕 , 移动孔的位置"
    init(){
        //遮挡模板 
        let template = new m4m.framework.transform2D();
        let rImg = template.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        rImg.image = this.assetMgr.getDefaultTexture(m4m.framework.defTexture.white);
        rImg.color = new m4m.math.color(0,0,0,0.8);

        let opt = m4m.framework.layoutOption;
        let maskui = new m4m.framework.transform2D();
        maskui.layoutState = opt.TOP | opt.BOTTOM |opt.LEFT |opt.RIGHT ;
        let maskComp = maskui.addComponent("guideMask") as guideMask;
        this.rooto2d.addChild(maskui);
        maskComp.holeRect = new m4m.math.rect(200,200,100,100);
        maskComp.template = template;

        let tv2 = new m4m.math.vector2();
        let tv2_1 = new m4m.math.vector2();
        this.iptMgr.addPointListener(m4m.event.PointEventEnum.PointDown,([x,y])=>{
            m4m.math.vec2Set(tv2,x,y);
            this.rooto2d.calScreenPosToCanvasPos(tv2,tv2_1);
            maskComp.holeRect.x = tv2_1.x;
            maskComp.holeRect.y = tv2_1.y;
            maskComp.holeRect = maskComp.holeRect; 
        },this);

        //adtUI
        let gui = new dat.GUI();;
        gui.add( this , 'dec');
    }

    update(delta: number) {
        

    }


 
}