namespace t
{
    export class test_changeshader implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        renderer: m4m.framework.meshRenderer;
        skinrender:m4m.framework.skinnedMeshRenderer;
        objCam: m4m.framework.transform;
        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            var baihu = new m4m.framework.transform();
            baihu.name = "baihu";
            baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 20;
            this.scene.addChild(baihu);

            this.changeShader();
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
            {
                if (state.isfinish)
                {
                    // this.app.getAssetMgr().load("res/prefabs/baihu/resources/res_baihu_baihu.FBX_baihu.mesh.bin", m4m.framework.AssetTypeEnum.Auto, (s) =>
                    // {
                    //     if (s.isfinish)
                    //     {
                    //         var smesh1 = this.app.getAssetMgr().getAssetByName("res_baihu_baihu.FBX_baihu.mesh.bin") as m4m.framework.mesh;
                    //         var mesh1 = baihu.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
                    //         mesh1.mesh = (smesh1);
                    //         this.renderer = baihu.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    //         var collider = baihu.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
                    //         baihu.markDirty();
                    //         var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    //         this.renderer.materials = [];
                    //         this.renderer.materials.push(new m4m.framework.material());
                    //         this.renderer.materials.push(new m4m.framework.material());
                    //         this.renderer.materials.push(new m4m.framework.material());
                    //         this.renderer.materials.push(new m4m.framework.material());
                    //         this.renderer.materials[0].setShader(sh);
                    //         this.renderer.materials[1].setShader(sh);
                    //         this.renderer.materials[2].setShader(sh);
                    //         this.renderer.materials[3].setShader(sh);
                    //         this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihu.imgdesc.json", m4m.framework.AssetTypeEnum.Auto, (s2) =>
                    //         {
                    //             if (s2.isfinish)
                    //             {
                    //                 let texture = this.app.getAssetMgr().getAssetByName("baihu.imgdesc.json") as m4m.framework.texture;
                    //                 this.renderer.materials[0].setTexture("_MainTex", texture);
                    //             }
                    //         });
                    //         this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuan.imgdesc.json", m4m.framework.AssetTypeEnum.Auto, (s2) =>
                    //         {
                    //             if (s2.isfinish)
                    //             {
                    //                 let texture = this.app.getAssetMgr().getAssetByName("baihuan.imgdesc.json") as m4m.framework.texture;
                    //                 this.renderer.materials[1].setTexture("_MainTex", texture);
                    //             }
                    //         });
                    //         this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuya.imgdesc.json", m4m.framework.AssetTypeEnum.Auto, (s2) =>
                    //         {
                    //             if (s2.isfinish)
                    //             {
                    //                 let texture = this.app.getAssetMgr().getAssetByName("baihuya.imgdesc.json") as m4m.framework.texture;
                    //                 this.renderer.materials[2].setTexture("_MainTex", texture);
                    //             }
                    //         });
                    //         this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihumao.imgdesc.json", m4m.framework.AssetTypeEnum.Auto, (s2) =>
                    //         {
                    //             if (s2.isfinish)
                    //             {
                    //                 let texture = this.app.getAssetMgr().getAssetByName("baihumao.imgdesc.json") as m4m.framework.texture;
                    //                 this.renderer.materials[3].setTexture("_MainTex", texture);
                    //             }
                    //         });

                    //     }
                    // });
                    
                    var prefabname="0123_limingshibing";//"shizhiguai"
                    this.app.getAssetMgr().load("res/prefabs/0123_limingshibing/0123_limingshibing.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) =>
                    {
                        if(s.isfinish)
                        {
                            var shizi=this.app.getAssetMgr().getAssetByName("0123_limingshibing.prefab.json")as m4m.framework.prefab;
                            var shizi01=shizi.getCloneTrans();
                            shizi01.localTranslate=new m4m.math.vector3();
                            
                            //m4m.math.vec3ScaleByNum(shizi01.localScale,20,shizi01.localScale);
                            this.scene.addChild(shizi01);
                            shizi01.markDirty();

                            var renderer=shizi01.gameObject.getComponentsInChildren(m4m.framework.StringUtil.COMPONENT_SKINMESHRENDER);
                            this.skinrender= renderer[0]as m4m.framework.skinnedMeshRenderer;

                        }
                    });
                }
            });
            this.cube = baihu;

            //添加一个摄像机
            this.objCam = new m4m.framework.transform();
            this.objCam.name = "sth.";
            this.scene.addChild(this.objCam);
            this.camera = this.objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 100;
            this.objCam.localTranslate = new m4m.math.vector3(0, 12, 12);
            //this.objCam.lookat(baihu);
            this.objCam.lookatPoint(new m4m.math.vector3(0,0,0));
            this.objCam.markDirty();//标记为需要刷新

        }

        /**
         * 执行改变着色器
         */
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
            btn2.textContent = "切换Shader到：transparent-diffuse.shader.json";
            btn2.onclick = () =>
            {
                var shader="transparent-diffuse.shader.json";
                var addshader="transparent_additive.shader.json";
                var sh = this.app.getAssetMgr().getShader(addshader) as m4m.framework.shader;
                this.change(sh);
            }
            btn2.style.top = "124px";
            btn2.style.position = "absolute";
            this.app.container.appendChild(btn2);
        }

        /**
         * 改变着色器
         * @param sha 着色器
         */
        change(sha: m4m.framework.shader)
        {
            // for (let i = 0; i < 4; i++)
            // {
            //     // let _uniform = this.renderer.materials[i].mapUniform;
            //     // this.renderer.materials[i].setShader(sha);
            //     // for (let key in _uniform)
            //     // {
            //     //     if (this.renderer.materials[i].mapUniform[key] != undefined)
            //     //         this.renderer.materials[i].mapUniform[key] = _uniform[key];
            //     // }
            //     this.renderer.materials[i].changeShader(sha);
                
                
            // }
            var materials=this.skinrender.materials;
            for(var i=0;i<materials.length;i++)
            {
                materials[i]=materials[i].clone();
                materials[i].setShader(sha);
            }
        }

        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        cube2: m4m.framework.transform;
        cube3: m4m.framework.transform;
        timer: number = 0;
        update(delta: number)
        {

        }
    }
}