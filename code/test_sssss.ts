class test_sssss implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    renderer: m4m.framework.meshRenderer[];
    skinRenders: m4m.framework.skinnedMeshRenderer[];
    taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    cam: m4m.framework.camera;
    start(app: m4m.framework.application) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new m4m.math.vector3(0, 0, 0);

        this.taskmgr.addTaskCall(this.loadpbrRes.bind(this));
        this.taskmgr.addTaskCall(this.loadIBL.bind(this));
        this.taskmgr.addTaskCall(this.init.bind(this));

        // this.changeShader();
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

        // // objCam.localTranslate = new m4m.math.vector3(0, 0, -30);
        // CameraController.instance().init(this.app,this.camera);
        // objCam.markDirty();//标记为需要刷新

        //相机展示控制器
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0)

    }

    /**
     * 初始化
     */
    private init() {
        let names: string[] = ["Head"];
        let name = names[0];
        let shaderPackName = "MainShader";
        // let shaderPackName = "shader";
        this.app.getAssetMgr().load(`${resRootPath}shader/${shaderPackName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (state) => {
            if (state.isfinish) {
                let adName = `${name}.assetbundle.json`;
                this.app.getAssetMgr().load(`${resRootPath}prefab/${name}/${adName}`, m4m.framework.AssetTypeEnum.Auto,
                    (s) => {
                        if (s.isfinish) {
                            var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json", adName) as m4m.framework.prefab;
                            this.baihu = _prefab.getCloneTrans();
                            this.scene.addChild(this.baihu);
                            // this.baihu.localScale = new m4m.math.vector3(50, 50, 50);
                            this.baihu.localTranslate = new m4m.math.vector3(0, 0, 0);
                            this.baihu.localEulerAngles = new m4m.math.vector3(0, 180, 0);
                            let objCam = this.camera.gameObject.transform;
                            objCam.localTranslate = new m4m.math.vector3(0, 0, -2);
                            objCam.lookat(this.baihu);
                            objCam.markDirty();

                            // let ani = this.baihu.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;
                            // ani.clipnames;
                            // this.refreshTexture(this.baihu);

                            let assetMgr = this.app.getAssetMgr();

                            let negx_1 = this.app.getAssetMgr().getAssetByName(`negx_1.jpg`) as m4m.framework.texture;
                            let negy_1 = this.app.getAssetMgr().getAssetByName(`negy_1.jpg`) as m4m.framework.texture;
                            let negz_1 = this.app.getAssetMgr().getAssetByName(`negz_1.jpg`) as m4m.framework.texture;
                            let posx_1 = this.app.getAssetMgr().getAssetByName(`posx_1.jpg`) as m4m.framework.texture;
                            let posy_1 = this.app.getAssetMgr().getAssetByName(`posy_1.jpg`) as m4m.framework.texture;
                            let posz_1 = this.app.getAssetMgr().getAssetByName(`posz_1.jpg`) as m4m.framework.texture;
                            let skytex1 = new m4m.framework.texture("skyCubeTex");
                            skytex1.glTexture = new m4m.render.glTextureCube(this.app.webgl);
                            skytex1.use();
                            (skytex1.glTexture as m4m.render.glTextureCube).uploadImages(negx_1, negy_1, negz_1, posx_1, posy_1, posz_1);
                            // this.baihu.localTranslate.x = 0;
                            this.baihu.localTranslate.y = -4;
                            // this.baihu.localTranslate.z = 10;
                            this.baihu.localScale.x = 10;
                            this.baihu.localScale.y = 10;
                            this.baihu.localScale.z = 10;
                            this.baihu.markDirty();
                            // for(let i = 0; i < this.baihu.children.length; i++) {
                            let mr = this.baihu.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
                            mr.materials[0] = new m4m.framework.material("testmat");
                            let sssSH = assetMgr.getShader("pbr_sss.shader.json") as m4m.framework.shader;
                            mr.materials[0].setShader(sssSH);
                            let brdfimg = assetMgr.getAssetByName(`brdf.png`) as m4m.framework.texture;
                            let temp2d = (brdfimg.glTexture as m4m.render.glTexture2D);
                            temp2d.getReader();
                            temp2d.uploadByteArray(true, false, temp2d.width, temp2d.height, temp2d.reader.data, true);
                            mr.materials[0].setTexture("brdf", assetMgr.getAssetByName(`brdf.png`) as m4m.framework.texture);
                            mr.materials[0].setTexture("uv_Basecolor", assetMgr.getAssetByName(`albedo.jpg`) as m4m.framework.texture);
                            mr.materials[0].setTexture("uv_Thickness", assetMgr.getAssetByName(`thickness.png`) as m4m.framework.texture);
                            mr.materials[0].setTexture("uv_Normal", assetMgr.getAssetByName(`normals.png`) as m4m.framework.texture);
                            mr.materials[0].setCubeTexture("u_sky", skytex1);

                            mr.materials[0].setFloat("CustomMetallic", 0.3);
                            mr.materials[0].setFloat("CustomRoughness", 0.8);

                            // NOTE: Screen Space Sub-Surface Scaterring

                            let blur_options = [
                                new m4m.math.vector4(0.22, 0.437, 0.635, 0.042),
                                new m4m.math.vector4(0.101, 0.355, 0.365, 0.220),
                                new m4m.math.vector4(0.119, 0.208, 0.0, 0.433),
                                new m4m.math.vector4(0.114, 0.0, 0.0, 0.753),
                                new m4m.math.vector4(0.364, 0.0, 0.0, 1.412),
                                new m4m.math.vector4(0.080, 0.0, 0.0, 2.722)
                            ];

                            let sh = this.scene.app.getAssetMgr().getShader("sssss.shader.json");
                            if (!sh) {
                                console.warn(`sssss.shader.json not find`);
                                return;
                            }

                            // let psize = 1024;
                            let psize = 2048;
                            var color = new m4m.framework.cameraPostQueue_Color();
                            color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);
                            if (!this.camera.postQueues) this.camera.postQueues = [];
                            this.camera.postQueues.push(color);

                            var depth = new m4m.framework.cameraPostQueue_Depth();
                            depth.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                            this.camera.postQueues.push(depth);

                            var text = new m4m.framework.texture("_depth");
                            text.glTexture = depth.renderTarget;
                            var textcolor = new m4m.framework.texture("_color");
                            textcolor.glTexture = color.renderTarget;

                            // SSSSS Start
                            //_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);
                            post0.material.setVector4("_BlurOptions", blur_options[0]); // NOTE
                            post0.material.setTexture("_MainTex", textcolor);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(1.0, 0.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;

                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);

                            post0.material.setVector4("_BlurOptions", blur_options[0]); // NOTE
                            post0.material.setTexture("_MainTex", blurText);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(0.0, 1.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;
                            //_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);
                            post0.material.setVector4("_BlurOptions", blur_options[1]); // NOTE
                            post0.material.setTexture("_MainTex", textcolor);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(1.0, 0.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;

                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);

                            post0.material.setVector4("_BlurOptions", blur_options[1]); // NOTE
                            post0.material.setTexture("_MainTex", blurText);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(0.0, 1.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;
                            //_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);
                            post0.material.setVector4("_BlurOptions", blur_options[2]); // NOTE
                            post0.material.setTexture("_MainTex", textcolor);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(1.0, 0.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;

                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);

                            post0.material.setVector4("_BlurOptions", blur_options[2]); // NOTE
                            post0.material.setTexture("_MainTex", blurText);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(0.0, 1.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;
                            //_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);
                            post0.material.setVector4("_BlurOptions", blur_options[3]); // NOTE
                            post0.material.setTexture("_MainTex", textcolor);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(1.0, 0.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;

                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);

                            post0.material.setVector4("_BlurOptions", blur_options[3]); // NOTE
                            post0.material.setTexture("_MainTex", blurText);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(0.0, 1.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;
                            //_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);
                            post0.material.setVector4("_BlurOptions", blur_options[4]); // NOTE
                            post0.material.setTexture("_MainTex", textcolor);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(1.0, 0.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;

                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);

                            post0.material.setVector4("_BlurOptions", blur_options[4]); // NOTE
                            post0.material.setTexture("_MainTex", blurText);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(0.0, 1.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;
                            //_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);
                            post0.material.setVector4("_BlurOptions", blur_options[5]); // NOTE
                            post0.material.setTexture("_MainTex", textcolor);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(1.0, 0.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            var blurText = new m4m.framework.texture("_color");
                            blurText.glTexture = post0.renderTarget;

                            var post0 = new m4m.framework.cameraPostQueue_Quad();
                            // post0.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, psize, psize, true, false);

                            post0.material.setShader(sh);

                            post0.material.setVector4("_BlurOptions", blur_options[5]); // NOTE
                            post0.material.setTexture("_MainTex", blurText);
                            post0.material.setTexture("_DepthTex", text);
                            post0.material.setVector4("_BlurDirection", new m4m.math.vector4(0.0, 1.0));
                            post0.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1 / psize, 1 / psize, psize, psize));
                            this.camera.postQueues.push(post0);

                            // var blurText = new m4m.framework.texture("_color");
                            // blurText.glTexture = post0.renderTarget;
                            //_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=



                            // var blurText = new m4m.framework.texture("_color");
                            // blurText.glTexture = post0.renderTarget;



                            // new m4m.math.vector3(blur_weights[0][0], );

                            // This function can be precomputed for efficiency
                            // float3 T(float s) {
                            //   return float3(0.233, 0.455, 0.649) * exp(-s * s / 0.0064) +
                            //          float3(0.1,   0.336, 0.344) * exp(-s * s / 0.0484) +
                            //          float3(0.118, 0.198, 0.0)   * exp(-s * s / 0.187)  +
                            //          float3(0.113, 0.007, 0.007) * exp(-s * s / 0.567)  +
                            //          float3(0.358, 0.004, 0.0)   * exp(-s * s / 1.99)   +
                            //          float3(0.078, 0.0,   0.0)   * exp(-s * s / 7.41);
                            // }
                        }
                    });
            }
        });
    }

    /**
     * 加载PBR 资源
     * @param lastState 
     * @param state 资源状态
     */
    private loadpbrRes(lastState: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`${resRootPath}pbrRes/SSSSS/` + "albedo.jpg", m4m.framework.AssetTypeEnum.Auto, (s0) => {
            if (s0.isfinish) {
                this.app.getAssetMgr().load(`${resRootPath}pbrRes/SSSSS/` + "normals.png", m4m.framework.AssetTypeEnum.Auto, (s1) => {
                    if (s1.isfinish) {
                        this.app.getAssetMgr().load(`${resRootPath}pbrRes/` + "brdf.png", m4m.framework.AssetTypeEnum.Auto, (s2) => {
                            if (s2.isfinish) {
                                this.app.getAssetMgr().load(`${resRootPath}pbrRes/SSSSS/` + "thickness.png", m4m.framework.AssetTypeEnum.Auto, (s3) => {
                                    if (s3.isfinish) {
                                        state.finish = true;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * 加载IBL
     * @param lastState 
     * @param state 资源状态
     */
    private loadIBL(lastState: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`${resRootPath}pbrRes/IBL/map/` + "negx_1.jpg", m4m.framework.AssetTypeEnum.Auto, (s0) => {
            if (s0.isfinish) {
                this.app.getAssetMgr().load(`${resRootPath}pbrRes/IBL/map/` + "negy_1.jpg", m4m.framework.AssetTypeEnum.Auto, (s1) => {
                    if (s1.isfinish) {
                        this.app.getAssetMgr().load(`${resRootPath}pbrRes/IBL/map/` + "negz_1.jpg", m4m.framework.AssetTypeEnum.Auto, (s2) => {
                            if (s2.isfinish) {
                                this.app.getAssetMgr().load(`${resRootPath}pbrRes/IBL/map/` + "posx_1.jpg", m4m.framework.AssetTypeEnum.Auto, (s3) => {
                                    if (s3.isfinish) {
                                        this.app.getAssetMgr().load(`${resRootPath}pbrRes/IBL/map/` + "posy_1.jpg", m4m.framework.AssetTypeEnum.Auto, (s4) => {
                                            if (s4.isfinish) {
                                                this.app.getAssetMgr().load(`${resRootPath}pbrRes/IBL/map/` + "posz_1.jpg", m4m.framework.AssetTypeEnum.Auto, (s5) => {
                                                    if (s5.isfinish) {
                                                        state.finish = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }



    camera: m4m.framework.camera;
    baihu: m4m.framework.transform;
    timer: number = 0;
    update(delta: number) {
        // this.timer += delta;
        // var x = Math.sin(this.timer);
        // var z = Math.cos(this.timer);
        // var x2 = Math.sin(this.timer * 0.1);
        // var z2 = Math.cos(this.timer * 0.1);
        // var objCam = this.camera.gameObject.transform;
        // // objCam.localTranslate = new m4m.math.vector3(x2 * 5, 2.25, -z2 * 5);

        this.taskmgr.move(delta); //推进task

        //    CameraController.instance().update(delta);
    }
}