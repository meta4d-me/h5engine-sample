//加载并使用场景资源的样例
class UseSceneDemo implements IState{

    app:m4m.framework.application;
    scene:m4m.framework.scene;
    taskMgr:m4m.framework.taskMgr = new m4m.framework.taskMgr();

    //使用通过asset加载出来的场景。
    private useRawScene(){
        let raw = this.app.getAssetMgr().getAssetByName("MainCity_.scene.json") as m4m.framework.rawscene;
        let root = raw.getSceneRoot();
        root.localEulerAngles = new m4m.math.vector3(0,0,0);
        this.scene.addChild(root = raw.getSceneRoot());
        this.scene.lightmaps = [];
        raw.useLightMap(this.scene);
        raw.useFog(this.scene);
        this.scene.getRoot().markDirty();
        root.markDirty();
    }
    //加载场景
    private loadScene(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate){
        this.app.getAssetMgr().load("res/scenes/MainCity_/MainCity_.assetbundle.json",m4m.framework.AssetTypeEnum.Auto,(s)=>{
            if(s.isfinish){
                
                this.useRawScene();
                state.finish= true;
            }
        });
    }

    //#region 加载shader
    private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.iserror) {
                state.error = true;
            }
            if (s.isfinish)
                state.finish = true;
        });
    }
    //#endregion
    //#region 添加摄像机
    private addCamera(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        let objCam = new m4m.framework.transform();
        objCam.name = "camera.";
        objCam.localPosition.z = -20;
        objCam.localPosition.y = 50;
        objCam.localPosition.x = -20;

        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.far = 1000;
        this.scene.addChild(objCam);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 100));
        objCam.markDirty();
        state.finish = true;
        //使用Dome已经封装好的相机控制器控制相机，以便更好地看到效果。
        CameraController.instance().init(this.app,camera);
    }
    //#endregion
    

    start(app:m4m.framework.application){
        this.app = app;
        this.scene = app.getScene();
        
        this.taskMgr.addTaskCall(this.loadShader.bind(this));
        this.taskMgr.addTaskCall(this.loadScene.bind(this));
        this.taskMgr.addTaskCall(this.addCamera.bind(this));
    }

    update(delta:number){
        this.taskMgr.move(delta);
        CameraController.instance().update(delta);
    }
}