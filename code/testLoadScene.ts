class test_loadScene implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        let assetMgr = this.app.getAssetMgr();

        //添加一个摄像机
        let objCam = new m4m.framework.transform();
        app.getScene().addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        cam.near = 0.01;
        cam.far = 500;
        cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new m4m.math.vector3(52, 48, 6);
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
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