class test_gltf_animation implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    light: m4m.framework.light;
    dragon: m4m.framework.transform;
    camTran: m4m.framework.transform;
    cube: m4m.framework.transform;
    taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();

    /**
     * 加载着色器
     * @param laststate 
     * @param state 加载状态
     */
    private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                state.finish = true;
            }
        });
    }

    /**
     * 加载资源 prefab
     * @param laststate 
     * @param state 加载状态
     */
    private loadLongPrefab(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        let settring = ["elong", "Run"];
        // let settring = ["MutantWalking", "001"];
        this.app.getAssetMgr().load(`${resRootPath}pbrRes/${settring[0]}.glb`, m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                var _prefab = this.app.getAssetMgr().getAssetByName(`${settring[0]}.glb`) as m4m.framework.gltf;
                _prefab.load(this.app.getAssetMgr(), this.app.webgl, `${resRootPath}pbrRes`, null, null, null)
                    .then(res => {
                        this.dragon = res;
                        let s = res.localScale;
                        s.x *= -1;
                        res.localScale = s;

                        this.scene.addChild(res);
                        this.dragon.markDirty();
                        this.camTran = this.dragon.find("Dummy001");
                        // let ap = this.dragon.gameObject.getComponentsInChildren("animation")[0] as m4m.framework.animation;
                        // ap.play(settring[1]);
                        state.finish = true;
                    })
            }
        });
    }

    /**
     * 添加相机
     * @param laststate 
     * @param state 加载状态
     */
    private addCamera(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10000;
        this.camera.backgroundColor = new m4m.math.color(0.11, 0.11, 0.11, 1.0);
        objCam.localTranslate = new m4m.math.vector3(0, 0, -30);
        // CameraController.instance().init(this.app, this.camera);
        objCam.markDirty();//标记为需要刷新

        //相机控制
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;

        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0);

        var tranLight = new m4m.framework.transform();
        tranLight.name = "light";
        this.scene.addChild(tranLight);
        this.light = tranLight.gameObject.addComponent("light") as m4m.framework.light;
        this.light.type = m4m.framework.LightTypeEnum.Direction;
        tranLight.localTranslate.x = 5;
        tranLight.localTranslate.y = 5;
        tranLight.localTranslate.z = -5;
        tranLight.lookatPoint(new m4m.math.vector3(0, 0, 0));
        tranLight.markDirty();

        state.finish = true;
    }

    start(app: m4m.framework.application) {
        this.app = app;
        this.scene = app.getScene();

        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadLongPrefab.bind(this));
        // this.taskmgr.addTaskCall(this.loadScene.bind(this));
        this.taskmgr.addTaskCall(this.addCamera.bind(this));
    }

    update(delta: number) {
        this.taskmgr.move(delta);
    }

}

