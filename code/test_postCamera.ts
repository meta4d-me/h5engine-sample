class test_postCamera implements IState{
    
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        start(app: m4m.framework.application) {       
            console.log("i see you are a dog!");
            this.app = app;
            this.scene = this.app.getScene();
            let name = "yongzhedalu_02_1024";
            let isloaded = false;
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state)=>{
                if (state.isfinish){
    
                    this.app.getAssetMgr().load("res/scenes/"+name+"/" + name + ".assetbundle.json",m4m.framework.AssetTypeEnum.Auto,
                    (s)=>{
                        if (s.isfinish){
                        // if(s.bundleLoadState & m4m.framework.AssetBundleLoadState.Scene && !isloaded){
                            isloaded = true;
                            console.error(s.isfinish);
    
                            var _scene:m4m.framework.rawscene = this.app.getAssetMgr().getAssetByName(name + ".scene.json") as m4m.framework.rawscene;
                            var _root = _scene.getSceneRoot();
                            this.scene.addChild(_root);
                            // _root.localTranslate = new m4m.math.vector3(-60, -30, 26.23);
                            _root.localEulerAngles = new m4m.math.vector3(0,0,0);
                            _root.markDirty();
                            this.app.getScene().lightmaps = [];
                            _scene.useLightMap(this.app.getScene());
                            _scene.useFog(this.app.getScene());
                        }
                    });

                    this.addCamera();
                }
            });       
            
        }
    
        camera:m4m.framework.camera;
        timer: number = 0;
        update(delta: number) {
            this.timer += delta;
            CameraController.instance().update(delta);
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.5);
            var z2 = Math.cos(this.timer * 0.5);
            if (this.camera){
                var objCam = this.camera.gameObject.transform;
                // if (this.camera.fov < 1.18){
                //     this.camera.fov += delta * 1.2;               
                // }else{
                //     this.camera.fov = 0.7
                // }
                // let pos = new m4m.math.vector3(0.5, 0, 0);
                // m4m.math.vec3Add(this.camTran.localTranslate, pos, pos);
                // m4m.math.vec3SLerp(this.camTran.localTranslate, pos, 10*delta, pos);
                // this.camTran.localTranslate = pos;
                // this.camTran.markDirty();
                
                // objCam.localTranslate = new m4m.math.vector3(x2 * 10, 53, z2 * 10);
                objCam.markDirty();//标记为需要刷新
            }
            
        }
    
        camTran:m4m.framework.transform;
        postColor:m4m.framework.cameraPostQueue_Color;
        postQuad:m4m.framework.cameraPostQueue_Quad;
        depthColor:m4m.framework.cameraPostQueue_Depth;
        private addCamera()
        {
            this.camTran = new m4m.framework.transform();
            this.camTran.name = "Camera";
            this.scene.addChild(this.camTran);
            this.camera = this.camTran.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.1;
            this.camera.far = 1000;
            this.camera.fov = 1.047;
            this.camTran.localTranslate = new m4m.math.vector3(105, 53, 57);
            this.camTran.localEulerAngles = new m4m.math.vector3(8, -46.5, 0);
            // objCam.lookatPoint(new m4m.math.vector3(133.6694, 97.87, 67));
            this.camTran.lookatPoint(new m4m.math.vector3(105, 53, 70));
            this.camTran.markDirty();

            this.camera.postQueues=[];
            this.postColor = new m4m.framework.cameraPostQueue_Color();
            this.postColor.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
            this.camera.postQueues.push(this.postColor);

            this.depthColor = new m4m.framework.cameraPostQueue_Depth();
            this.depthColor.renderTarget=new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
            this.camera.postQueues.push(this.depthColor);                         

            var textcolor = new m4m.framework.texture("_color");
            textcolor.glTexture = this.postColor.renderTarget;

            var depthcolor = new m4m.framework.texture("_depthcolor");
            depthcolor.glTexture = this.depthColor.renderTarget;
            var texsize:number=512;
            var post = new m4m.framework.cameraPostQueue_Quad();
            post.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl,texsize, texsize, true, false);
            post.material.setShader(this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
            post.material.setTexture("_MainTex", textcolor);
            post.material.setVector4("sample_offsets", new m4m.math.vector4(0,1.0,0,-1.0));
            post.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1.0/texsize,1.0/texsize,texsize,texsize));
            this.camera.postQueues.push(post);

            var texBlur0= new m4m.framework.texture("_blur0");
            texBlur0.glTexture = post.renderTarget;

            var post1 = new m4m.framework.cameraPostQueue_Quad();
            post1.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl,texsize, texsize, true, false);
            post1.material.setShader(this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
            post1.material.setTexture("_MainTex", texBlur0);
            post1.material.setVector4("sample_offsets", new m4m.math.vector4(1.0,0,-1.0,0));
            post1.material.setVector4("_MainTex_TexelSize", new m4m.math.vector4(1.0/texsize,1.0/texsize,texsize,texsize));
            this.camera.postQueues.push(post1);

            var texBlur= new m4m.framework.texture("_blur");
            texBlur.glTexture = post1.renderTarget;

            this.postQuad = new m4m.framework.cameraPostQueue_Quad();
            this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("dof.shader.json"));
            this.postQuad.material.setTexture("_MainTex", textcolor);
            this.postQuad.material.setTexture("_BlurTex",texBlur);
            this.postQuad.material.setTexture("_DepthTex",depthcolor);

            var focalDistance=0.985;
            this.postQuad.material.setFloat("_focalDistance", focalDistance);

            this.camera.postQueues.push(this.postQuad);

            CameraController.instance().init(this.app, this.camera);
        }

    }