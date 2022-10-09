class test_animationClip implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    prefab: m4m.framework.transform;
    start(app: m4m.framework.application) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        m4m.framework.skinnedMeshRenderer.technicalType = "BONE_TEXTURE";
        m4m.framework.assetMgr.openGuid = true;
        this.app.getAssetMgr().load(`./${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (state) => {
            if (state.isfinish) {
                this.app.getAssetMgr().load(`./${resRootPath}prefab/elong_prefab/elong_prefab.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(`elong_prefab.prefab.json`, "elong_prefab.assetbundle.json") as m4m.framework.prefab;
                        let prefabObj = _prefab.getCloneTrans();
                        this.scene.addChild(prefabObj);
                        this.prefab = prefabObj;

                        this.app.getAssetMgr().load(`./${resRootPath}prefab/elong_prefab/resources/Ready.FBAni.min.aniclip.bin`, m4m.framework.AssetTypeEnum.Aniclip, (s) => {
                            if (s.isfinish) {
                                var aps = prefabObj.gameObject.getComponentsInChildren("aniplayer") as m4m.framework.aniplayer[];
                                var ap = aps[0];
                                ap.addClip(s.resstateFirst.res as m4m.framework.animationClip);
                                ap.play("Ready.FBAni.min.aniclip.bin");
                            }
                        });
                    }
                });

            }
        });

        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(0, 10, 30);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
    }

    camera: m4m.framework.camera;
    // cube: m4m.framework.transform;
    // cube2: m4m.framework.transform;
    // cube3: m4m.framework.transform;
    // timer: number = 0;
    update(delta: number) {
        // this.timer += delta;
        // var x = Math.sin(this.timer);
        // var z = Math.cos(this.timer);
        // var x2 = Math.sin(this.timer * 0.1);
        // var z2 = Math.cos(this.timer * 0.1);
        // var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new m4m.math.vector3(x2 * 5, 2.25, -z2 * 5);
        // objCam.lookat(this.cube);
        // objCam.markDirty();//标记为需要刷新
        // objCam.updateWorldTran();
        if (this.prefab) {
            this.camera.gameObject.transform.lookat(this.prefab);
        }
    }
}