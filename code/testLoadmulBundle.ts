class test_loadMulBundle implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    /**
     * 刷新纹理
     * @param tran 节点 
     */
    refreshTexture(tran:m4m.framework.transform)
    {
        let meshrenderer = tran.gameObject.getComponentsInChildren("meshRenderer") as m4m.framework.meshRenderer[];
        let skinnmeshrenderer = tran.gameObject.getComponentsInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer[];
        for(let i=0; i<meshrenderer.length; i++)
        {
            let v = meshrenderer[i];
            for(let j=0; j<v.materials.length; j++)
            {
                for(let k in v.materials[j].statedMapUniforms)
                {
                    if(v.materials[j].statedMapUniforms[k].type == m4m.render.UniformTypeEnum.Texture)
                    {
                        let textur = this.app.getAssetMgr().getAssetByName(v.materials[j].statedMapUniforms[k].resname) as m4m.framework.texture;
                        v.materials[j].setTexture(k, textur);
                    }
                }
                
            }
        }
        for(let i=0; i<skinnmeshrenderer.length; i++)
        {
            let v = skinnmeshrenderer[i];
            for(let j=0; j<v.materials.length; j++)
            {
                for(let k in v.materials[j].statedMapUniforms)
                {
                    if(v.materials[j].statedMapUniforms[k].type == m4m.render.UniformTypeEnum.Texture)
                    {
                        let textur = this.app.getAssetMgr().getAssetByName(v.materials[j].statedMapUniforms[k].resname) as m4m.framework.texture;
                        v.materials[j].setTexture(k, textur);
                    }
                }
                
            }
        }
    }

    /**
     * 刷新动画pianduan
     */
    refreshAniclip(tran:m4m.framework.transform)
    {
        // let anipalyer = tran.gameObject.getComponentsInChildren("aniplayer") as m4m.framework.aniplayer[];
        // for(let i=0; i<anipalyer.length; i++)
        // {
        //     for(let j=0; j<anipalyer[i].clips.length; j++)
        //     {
        //         let v = anipalyer[i].clips[j];
        //         anipalyer[i].clips[j] = this.app.getAssetMgr().getAssetByName(v.getName()) as m4m.framework.animationClip;
        //     }
            
        //     anipalyer[i].playByIndex(0);
        // }
    }

    /**
     * 刷新光照贴图
     * @param scene 场景
     * @param rawscene  场景资源 
     */
    refreshLightMap(scene:m4m.framework.scene, rawscene:m4m.framework.rawscene)
    {
        scene.lightmaps = [];
        rawscene.resetLightMap(this.app.getAssetMgr());
        rawscene.useLightMap(this.app.getScene());
        rawscene.useFog(this.app.getScene());
    }

    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        let names: string[] = ["MainCity", "1042_pata_shenyuan_01", "1030_huodongchuangguan", "xinshoucun_fuben_day", "chuangjue-01"];
        let name = names[0];
        // name="MainCity";
        let isloaded = false;
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/scenes/"+name+"/meshprefab/" + name + ".assetbundle.json", m4m.framework.AssetTypeEnum.Auto,(s1)=>{
                    if(s1.isfinish)
                    {
                        var _scene: m4m.framework.rawscene = this.app.getAssetMgr().getAssetByName(name + ".scene.json") as m4m.framework.rawscene;
                        var _root = _scene.getSceneRoot();
                        this.scene.addChild(_root);
                        _root.localEulerAngles = new m4m.math.vector3(0,0,0);
                        _root.markDirty();
                        
                        this.app.getAssetMgr().load("res/scenes/" + name + "/textures/" + name + "texture.assetbundle.json", m4m.framework.AssetTypeEnum.Auto,
                        (s) => 
                        {
                            if(s.isfinish)
                            {
                                this.refreshTexture(this.app.getScene().getRoot());
                                this.refreshLightMap(this.app.getScene(), _scene);
                            }
                        });
                        
                        this.app.getAssetMgr().load("res/scenes/" + name + "/aniclip/" + name + "aniclip.assetbundle.json", m4m.framework.AssetTypeEnum.Auto,
                        (s) => 
                        {
                            if(s.isfinish)
                            {
                                this.refreshAniclip(this.app.getScene().getRoot());
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
        //this.camera.postQueues.push(new m4m.framework.cameraPostQueue_Depth());

        // this.camera.near = 0.01;
        // this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(-20, 50, -20);
        // objCam.lookatPoint(new m4m.math.vector3(133.6694, 97.87, 67));
        objCam.lookatPoint(new m4m.math.vector3(100, 0, 100));

        objCam.markDirty();//标记为需要刷新

        CameraController.instance().init(this.app, this.camera);
    }

    baihu:m4m.framework.transform;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number = 0;
    bere: boolean = false;
    update(delta: number)
    {
        this.timer += delta;
        CameraController.instance().update(delta);
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.5);
        var z2 = Math.cos(this.timer * 0.5);
        var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new m4m.math.vector3(x2 * 10, 30, z2 * 10);
        // objCam.markDirty();//标记为需要刷新

    }
}