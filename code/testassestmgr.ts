class test_assestmgr implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    assetName = "elong";
    count = 10;
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        this.cube = new m4m.framework.transform();
        this.scene.addChild(this.cube);
        let assetName = this.assetName;
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                // this.app.getAssetMgr().load("res/scenes/city/city.assetbundle.json", m4m.framework.AssetTypeEnum.Auto,
                //     (s1) =>
                //     {
                //         if (s1.isfinish)
                //         {
                //             this.app.getAssetMgr().loadScene("city.scene.json", () =>
                //             {
                                
                //             });
                //         }
                //     });
                    
                this.app.getAssetMgr().load(`res/prefabs/${assetName}/${assetName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto,
                    (s) =>
                    {
                        if (s.isfinish)
                        {
                            this.baihu = [];
                            this._prefab = this.app.getAssetMgr().getAssetByName(`${assetName}.prefab.json`) as m4m.framework.prefab;
                            for(let i=0; i<this.count; i++)
                            {
                                this.baihu[i] = this._prefab.getCloneTrans();
                                this.scene.addChild(this.baihu[i]);
                                this.baihu[i].localScale = new m4m.math.vector3(0.3, 0.3, 0.3);
                                this.baihu[i].localTranslate = new m4m.math.vector3(i*2, 0, 0);
                                this.baihu[i].markDirty();
                                this.scene.addChild(this.baihu[i]);
                            }
                            
                            objCam.lookat(this.baihu[this.count/2]);
                            objCam.markDirty();
                        }
                    });

            }
        });


        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        //this.camera.postQueues.push(new m4m.framework.cameraPostQueue_Depth());

        // this.camera.near = 0.01;
        // this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(50, 82, -500);
        objCam.lookat(this.cube);
        objCam.markDirty();//标记为需要刷新
        this.cube.localTranslate = new m4m.math.vector3(40, 0, 10);

    }
    _prefab: m4m.framework.prefab;
    baihu: m4m.framework.transform[];
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number = 0;
    bere: boolean = false;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.5);
        var z2 = Math.cos(this.timer * 0.5);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new m4m.math.vector3(x2 * 10, 30, -z2 * 10);

        //assetbundle test
        // if (this.timer > 20)
        // {
        //     this.app.getScene().getRoot().dispose();
            
        // }
        // if (this.timer > 40 && !this.bere)
        // {
        //     this.bere = true;

        //     // this.app.getAssetMgr().unload("res/scenes/city/city.assetbundle.json");
        //     this.app.getAssetMgr().getAssetBundle("city.assetbundle.json").unload();
        //     this.app.getAssetMgr().releaseUnuseAsset();
        // }

        //prefab test
        if (this.timer > 20 && !this.bere)
        {
            this.bere = true;
            for(let i=0; i<this.count; i++)
            {
                this.baihu[i].dispose();
            }
            // this._prefab.unuse();
            this.app.getAssetMgr().getAssetBundle(`${this.assetName}.assetbundle.json`).unload();
            this.app.getAssetMgr().releaseUnuseAsset();

        }
    }
}