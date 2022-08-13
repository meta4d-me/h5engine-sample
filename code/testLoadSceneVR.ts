class test_loadSceneVR implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        let assetMgr = this.app.getAssetMgr();

        let objCamRoot = new m4m.framework.transform();
        app.getScene().addChild(objCamRoot);
        objCamRoot.localTranslate = new m4m.math.vector3(52, 48, 6);
        {
            //添加一个摄像机
            let objCamL = new m4m.framework.transform();
            objCamRoot.addChild(objCamL);
            //app.getScene().addChild(objCam);
            let cam = objCamL.gameObject.addComponent("camera") as m4m.framework.camera;
            cam.near = 0.01;
            cam.far = 500;
            cam.fov = Math.PI * 105/180; //105度相机
            cam.viewport=new  m4m.math.rect(0,0,0.5,1);
            objCamL.localTranslate = new m4m.math.vector3(-0.1, 0, 0);      //偏左
        }
        {
             //添加一个摄像机
             let objCamR = new m4m.framework.transform();
             objCamRoot.addChild(objCamR);
             //app.getScene().addChild(objCam);
             let camR = objCamR.gameObject.addComponent("camera") as m4m.framework.camera;
             camR.clearOption_Color = false;
             camR.near = 0.01;
             camR.far = 500;
             camR.fov = Math.PI * 105/180;//105度相机
             camR.viewport=new  m4m.math.rect(0.5,0,0.5,1);
             objCamR.localTranslate = new m4m.math.vector3(0.1, 0, 0);      //偏右
        }
        //相机控制
        let hoverc = objCamRoot.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 163;
        hoverc.tiltAngle = 16.5;
        hoverc.distance = 1;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(43, 40, 15)

        util.loadShader(assetMgr)
            .then(() =>
            {
                let sceneName = "MainCity_"
                assetMgr.load(`${resRootPath}prefab/${sceneName}/${sceneName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s1) =>
                {
                    if (s1.isfinish)
                    {
                        var _scene = assetMgr.getAssetByName(sceneName + ".scene.json", `${sceneName}.assetbundle.json`) as m4m.framework.rawscene;
                        var _root = _scene.getSceneRoot();
                        this.scene.addChild(_root);
                        this.app.getScene().lightmaps = [];
                        _scene.useLightMap(this.app.getScene());
                        _scene.useFog(this.app.getScene());
                    }
                });
            })
    }

    update(delta: number)
    {
    }
}