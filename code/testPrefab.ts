class test_loadprefab implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    renderer: m4m.framework.meshRenderer[];
    skinRenders: m4m.framework.skinnedMeshRenderer[];
    refreshTexture(tran:m4m.framework.transform)
    {
        let meshrenderer = tran.gameObject.getComponentsInChildren("meshRenderer") as m4m.framework.meshRenderer[];
        let skinnmeshrenderer = tran.gameObject.getComponentsInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer[];
        this.renderer=meshrenderer;
        this.skinRenders=skinnmeshrenderer;
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
    refreshAniclip(tran:m4m.framework.transform, name:string)
    {
        // let anipalyer = tran.gameObject.getComponentsInChildren("aniplayer") as m4m.framework.aniplayer[];
        // for(let i=0; i<anipalyer.length; i++)
        // {
        //     for (let key in anipalyer[i].clipnames){
        //         let j = anipalyer[i].clipnames[key];
        //         let v = anipalyer[i].clips[j]
        //         let clip = this.app.getAssetMgr().getAssetByName("gs_chuangjue_01_" + v.getName()) as m4m.framework.animationClip;
        //         if (clip){
        //             anipalyer[i].clips[j] = clip;
        //             if (anipalyer[i].clipnames[clip.getName()]){

        //             }else{
        //                 anipalyer[i].clipnames[clip.getName()] = j;
        //             }
        //         }                
        //     }
        //     // for(let j=0; j<anipalyer[i].clips.length; j++)
        //     // {
        //     //     let v = anipalyer[i].clips[j];
                
        //     //     let clip = this.app.getAssetMgr().getAssetByName(v.getName()) as m4m.framework.animationClip;
        //     //     if (clip){
        //     //         anipalyer[i].clips[j] = clip;
        //     //     }
        //     // }
        //     anipalyer[i].playCross(name,0.2);      
            
        //     anipalyer[i].playCross("gs_chuangjue_01_" + name,0.2); 
        // }
    }
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new m4m.math.vector3(0, 0, 0);
        let names: string[] = ["elongmul", "0060_duyanshou", "Cube", "0001_fashion", "193_meirenyu"];
        let name = names[0];
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
        {
            if(state.isfinish)
            {
                // this.app.getAssetMgr().load("res/prefabs/" + name + "/meshprefab/" + name + ".assetbundle.json", m4m.framework.AssetTypeEnum.Auto, 
                // (s) => 
                // {
                //     if(s.isfinish)
                //     {
                //         var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as m4m.framework.prefab;
                //         this.baihu = _prefab.getCloneTrans();
                //         this.scene.addChild(this.baihu);
                //         this.baihu.localScale = new m4m.math.vector3(50, 50, 50);
                //         this.baihu.localTranslate = new m4m.math.vector3(0, 0, 0);
                //         this.baihu.localEulerAngles = new m4m.math.vector3(0, 180, 0);

                //         objCam.localTranslate = new m4m.math.vector3(0, 20, -10);
                //         objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                //         objCam.markDirty();

                //         this.app.getAssetMgr().load("res/prefabs/" + name + "/textures/" + name + "texture.assetbundle.json", m4m.framework.AssetTypeEnum.Auto,
                //         (s) => 
                //         {
                //             if(s.isfinish)
                //             {
                //                 this.refreshTexture(this.baihu);
                //             }
                //         });
                //         this.app.getAssetMgr().load("res/prefabs/" + name + "/aniclip/resources/" + "Ready.FBAni.aniclip.bin", m4m.framework.AssetTypeEnum.Auto,
                //         (s) => 
                //         {
                //             if(s.isfinish)
                //             {
                //                 this.refreshAniclip(this.baihu);
                //             }
                //         });
                //     }
                // });
                name = "pc1";
                this.app.getAssetMgr().load("res/prefabs/" + name + "/resources/" + "pc1_wait_idle1.FBAni.aniclip.bin", m4m.framework.AssetTypeEnum.Auto,
                (s) => 
                {
                    if (s.isfinish){
                        
                        this.app.getAssetMgr().load("res/prefabs/" + name + "/" + name + ".assetbundle.json", m4m.framework.AssetTypeEnum.Auto, 
                        (s) => 
                        {
                            if(s.isfinish)
                            {
                                var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as m4m.framework.prefab;
                                this.baihu = _prefab.getCloneTrans();
                                this.scene.addChild(this.baihu);
                                // this.baihu.localScale = new m4m.math.vector3(50, 50, 50);
                                this.baihu.localTranslate = new m4m.math.vector3(0, 0, 0);
                                this.baihu.localEulerAngles = new m4m.math.vector3(0, 180, 0);
        
                                objCam.localTranslate = new m4m.math.vector3(0, 0, -2);
                                objCam.lookat(this.baihu);
                                objCam.markDirty();
        
                                let ani = this.baihu.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;
                                // ani.clipnames;
                                this.refreshTexture(this.baihu);

                                this.app.getAssetMgr().load("res/prefabs/" + name + "/resources/" + "pc1_wait_idle1.FBAni.aniclip.bin", m4m.framework.AssetTypeEnum.Auto,
                                (s) => 
                                {
                                    if (s.isfinish){
                                        this.refreshAniclip(this.baihu, "pc1_wait_idle1.FBAni.aniclip.bin");
                                    }
                                });  
                            }                                
                        }); 
                    }
                });                              
            }
        });

        this.changeShader();
        // name="elong";
        // let isloaded= false;
        // this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
        // {
        //     if (state.isfinish)
        //     {
        //         this.app.getAssetMgr().loadCompressBundle("res/prefabs/" + name + "/" + name + ".assetbundle.json", 
        //             (s) =>
        //             {
        //                 console.log(s.curtask + "/" + s.totaltask);
        //                 console.log(s.curByteLength+"/"+s.totalByteLength);
        //                 if (s.bundleLoadState & m4m.framework.AssetBundleLoadState.Prefab && !isloaded)
        //                 {
        //                     isloaded = true;
        //                     var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as m4m.framework.prefab;
        //                     this.baihu = _prefab.getCloneTrans();
        //                     this.scene.addChild(this.baihu);
        //                     // this.baihu.localScale = new m4m.math.vector3(50, 50, 50);
        //                     this.baihu.localTranslate = new m4m.math.vector3(0, 0, 0);
        //                     this.baihu.localEulerAngles = new m4m.math.vector3(0, 180, 0);

        //                     // this.baihu.localEulerAngles = new m4m.math.vector3();
        //                     this.baihu = _prefab.getCloneTrans();
        //                     objCam.localTranslate = new m4m.math.vector3(0, 20, -10);
        //                     objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //                     objCam.markDirty();
        //                     this.renderer = this.baihu.gameObject.getComponentsInChildren("meshRenderer") as m4m.framework.meshRenderer[];
        //                     this.skinRenders = this.baihu.gameObject.getComponentsInChildren(m4m.framework.StringUtil.COMPONENT_SKINMESHRENDER) as m4m.framework.skinnedMeshRenderer[];
        //                     // this.changeShader();
        //                     // for(let i=0; i<22; i++)
        //                     // {
        //                     //     for(let j=0; j<22; j++)
        //                     //     {
        //                     //         let bp = _prefab.getCloneTrans();
        //                     //         bp.localTranslate = new m4m.math.vector3(i - 11, 0, j - 11);
        //                     //         bp.markDirty();
        //                     //         this.scene.addChild(bp);
        //                     //     }
        //                     // }
        //                 }
        //             });
        //     }
        // });


        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10000;
        this.camera.backgroundColor = new m4m.math.color(0.11, 0.11, 0.11, 1.0);
        // objCam.localTranslate = new m4m.math.vector3(0, 0, -30);
        CameraController.instance().init(this.app,this.camera);
        objCam.markDirty();//标记为需要刷新

    }

    private changeShader()
    {
        var btn = document.createElement("button");
        btn.textContent = "切换Shader到：diffuse.shader.json";
        btn.onclick = () =>
        {
            var sh = this.app.getAssetMgr().getShader("diffuse.shader.json") as m4m.framework.shader;
            this.change(sh);
        }
        btn.style.top = "160px";
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);

        var btn2 = document.createElement("button"); 
        btn2.textContent = "切换Shader到：additive_alpha.shader.json";
        btn2.onclick = () =>
        {
            var sh = this.app.getAssetMgr().getShader("additive_alpha.shader.json") as m4m.framework.shader;
            this.change(sh);
        }
        btn2.style.top = "124px";
        btn2.style.position = "absolute";
        this.app.container.appendChild(btn2);
    }

    change(sha: m4m.framework.shader)
    {
        for (let j = 0; j < this.renderer.length; j++)
        {
            for (let i = 0; i < this.renderer[j].materials.length; i++)
            {
                this.renderer[j].materials[i].setShader(sha);
                // this.renderer[j].materials[i].setVector4("_TintColor", new m4m.math.vector4(0,1,0,1));
            }
        }
        for (let j = 0; j < this.skinRenders.length; j++)
        {
            for (let i = 0; i < this.skinRenders[j].materials.length; i++)
            {
                this.skinRenders[j].materials[i].setShader(sha);
                // this.renderer[j].materials[i].setVector4("_TintColor", new m4m.math.vector4(0,1,0,1));
            }
        }
    }
    camera: m4m.framework.camera;
    baihu: m4m.framework.transform;
    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new m4m.math.vector3(x2 * 5, 2.25, -z2 * 5);
        
        
       CameraController.instance().update(delta);
    }
}