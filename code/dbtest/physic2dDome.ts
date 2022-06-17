//UI 组件样例
class physic2d_dome implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    assetMgr: m4m.framework.assetMgr;
    rooto2d: m4m.framework.overlay2D;
    static temp:m4m.framework.transform2D;
    start(app: m4m.framework.application) {

        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();

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

        this.scene.enable2DPhysics(new m4m.math.vector2(0,0));

        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.createUI.bind(this));


    }

    private createUI(astState: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        let atlasComp = this.assetMgr.getAssetByName("comp.atlas.json") as m4m.framework.atlas;
        let tex_0 = this.assetMgr.getAssetByName("zg03_256.png") as m4m.framework.texture;
        

        //raw png
        this.creatbox(100,100,120,120,tex_0,this.rooto2d);
        this.creatbox(130,300,120,120,tex_0,this.rooto2d);


        let wallWidth=1200;
        let wallheigth=600;


        this.crea2dWall(0,wallheigth/2,50,wallheigth,tex_0,this.rooto2d);
        this.crea2dWall(wallWidth,wallheigth/2,50,wallheigth,tex_0,this.rooto2d);
        this.crea2dWall(wallWidth/2,0,wallWidth,50,tex_0,this.rooto2d);
        this.crea2dWall(wallWidth/2,wallheigth,wallWidth,50,tex_0,this.rooto2d);

        state.finish = true;
    }

    private crea2dWall(posx:number,posy:number,width:number,height:number,texture:m4m.framework.texture,root:m4m.framework.overlay2D):m4m.framework.transform2D
    {
        let bound3 = new m4m.framework.transform2D;
        bound3.localTranslate.x=posx;
        bound3.localTranslate.y=posy;
        bound3.width = width;
        bound3.height = height;
        bound3.pivot.x=0.5;
        bound3.pivot.y=0.5;
        let boundimag3 = bound3.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        boundimag3.image = texture;
        let body3=bound3.addComponent("rectBody2d") as m4m.framework.rectBody2d;
        body3.setInitData({isStatic:true});

        root.addChild(bound3);
        return bound3;
    }

    private creatbox(posx:number,posy:number,width:number,height:number,texture:m4m.framework.texture,root:m4m.framework.overlay2D):m4m.framework.transform2D
    {
        let bound3 = new m4m.framework.transform2D;
        bound3.localTranslate.x=posx;
        bound3.localTranslate.y=posy;
        bound3.width = width;
        bound3.height = height;
        bound3.pivot.x=0.5;
        bound3.pivot.y=0.5;
        let boundimag3 = bound3.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        boundimag3.image = texture;
        let body3=bound3.addComponent("rectBody2d") as m4m.framework.rectBody2d;

        setTimeout(()=>{
            body3.addForce(new m4m.math.vector2(1,0));
        },3000);

        root.addChild(bound3);
        return bound3;
    }


    private loadTexture(lastState: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        //加载图片资源
        this.assetMgr.load(`${resRootPath}atlas/comp/comp.json.png`, m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                this.assetMgr.load(`${resRootPath}atlas/comp/comp.atlas.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                    if(s.isfinish){
                        //加载字体资源
                        this.assetMgr.load(`${resRootPath}font/STXINGKA.TTF.png`,m4m.framework.AssetTypeEnum.Auto,(s)=>{
                            if(s.isfinish){
                                this.assetMgr.load(`${resRootPath}font/STXINGKA.font.json`,m4m.framework.AssetTypeEnum.Auto,(s)=>{
                                    this.assetMgr.load(`${resRootPath}texture/zg03_256.png`,m4m.framework.AssetTypeEnum.Auto,(s)=>{
                                        if(s.isfinish){
                                            state.finish = true;
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    update(delta: number) {
        this.taskmgr.move(delta); //推进task

    }

}