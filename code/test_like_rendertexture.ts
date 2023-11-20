namespace t
{

    export class test_rendertexture implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        /**
         * 加载着色器
         * @param laststate 
         * @param state 资源状态
         */
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) =>
            {
                state.finish = true;
            }
            );
        }

        /**
         * 加载文本字符串
         * @param laststate 
         * @param state 资源状态
         */
        private loadText(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/zg256.png", m4m.framework.AssetTypeEnum.Auto, (s) => 
            {
                if (s.isfinish) 
                {
                    state.finish = true;
                }
                else
                {
                    state.error = true;
                }
            }
            );
        }
        sh: m4m.framework.shader;
        /**
         * 初始化场景
         * @param laststate 
         * @param state 资源状态
         */
        private initscene(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            {
                //camera1
                var objCam = new m4m.framework.transform();
                objCam.name = "cam_show";
                this.scene.addChild(objCam);
                this.showcamera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
                this.showcamera.order = 0;
                this.showcamera.near = 0.01;
                this.showcamera.far = 30;
                this.showcamera.fov = Math.PI * 0.3;
                objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                objCam.markDirty();//鏍囪涓洪渶瑕佸埛鏂?
            }

            {
                var o2ds = new m4m.framework.overlay2D();

                this.showcamera.addOverLay(o2ds);
                {//overlay1
                    var t2d = new m4m.framework.transform2D();
                    t2d.name="ceng1";
                    t2d.localTranslate.x = 200;
                    t2d.localTranslate.y = 200;
                    t2d.width = 300;
                    t2d.height = 300;
                    t2d.pivot.x = 0;
                    t2d.pivot.y = 0;
                    t2d.markDirty();
                    var rawiamge = t2d.addComponent("rawImage2D") as m4m.framework.rawImage2D;
                    rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;

                    o2ds.addChild(t2d);
                }
                {
                    var cube1 = new m4m.framework.transform();

                    cube1.name = "cube1";
                    this.scene.addChild(cube1);
                    cube1.localScale.x = 8;
                    cube1.localScale.y = 1;
                    cube1.localScale.z = 1;

                    cube1.markDirty();

                    var mesh1 = cube1.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh1.mesh = (smesh);
                    var renderer = cube1.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                }
            }
            


            state.finish = true;

        }

        /**
         * 添加在UI上的3d模型
         * @param laststate 
         * @param state 资源状态
         */
        private add3dmodelbeforeUi(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            {
                var modelcam = new m4m.framework.transform();
                modelcam.name = "modelcam";
                this.scene.addChild(modelcam);
                this.wath_camer = modelcam.gameObject.addComponent("camera") as m4m.framework.camera;
                //--------------------------------重要设置-----------------------------------------
                this.wath_camer.order = 1;//这个看向模型的相机的order需要高于场景相机
                this.wath_camer.clearOption_Color = false;
                this.wath_camer.clearOption_Depth=true;
                this.wath_camer.CullingMask=m4m.framework.CullingMask.modelbeforeui|m4m.framework.CullingMask.ui;
                //--------------------------------------------------------------------------------------
                
                // this.wath_camer.near = 0.01;
                // this.wath_camer.far = 30;
                // this.wath_camer.fov = Math.PI * 0.3;
                modelcam.localTranslate = new m4m.math.vector3(0, 10, -10);
                modelcam.lookatPoint(new m4m.math.vector3(0, 0, 0));//相机要看向你想看到的3d模型
                modelcam.markDirty();
            }
            {//加3d模型，用特定shader
                var cube = new m4m.framework.transform();

                cube.name = "cube";
                this.scene.addChild(cube);
                cube.localScale.x = 3;
                cube.localScale.y = 3;
                cube.localScale.z = 3;

                cube.markDirty();

                var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                renderer.renderLayer = m4m.framework.CullingMask.modelbeforeui;
                let cuber = renderer;

                //"shader/def3dbeforeui"
                //"def/defui"
                //"diffuse.shader.json"
                this.sh = this.app.getAssetMgr().getShader("diffuse.shader.json");//3d模型要用这个shader

                if (this.sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new m4m.framework.material());
                    cuber.materials[0].setShader(this.sh);//

                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
                this.target = cube;
                {//加ui，如果需要在模型上层显示ui
                    var o2d1 = new m4m.framework.overlay2D();
                    this.wath_camer.addOverLay(o2d1);
                    {//
                        var t2d = new m4m.framework.transform2D();
                        t2d.name="ceng2";
                        t2d.localTranslate.x = 300;
                        t2d.localTranslate.y = 100;
                        t2d.width = 150;
                        t2d.height = 150;
                        t2d.pivot.x = 0;
                        t2d.pivot.y = 0;
                        t2d.markDirty();
                        var rawiamge = t2d.addComponent("rawImage2D") as m4m.framework.rawImage2D;
                        rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;

                        o2d1.addChild(t2d);
                    }
                }
            }
            state.finish=true;
        }
        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            this.taskmgr.addTaskCall(this.add3dmodelbeforeUi.bind(this));


        }
        wath_camer: m4m.framework.camera;
        target: m4m.framework.transform;
        targetMat: m4m.framework.material;
        show_cube: m4m.framework.transform;
        showcamera: m4m.framework.camera;
        timer: number = 0;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();

        angle: number;
        update(delta: number)
        {
            this.taskmgr.move(delta);

            if (this.target == undefined) return;
            // if (this.show_cube == undefined) return;
            this.timer += delta;

            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, this.timer * 3, this.target.localRotate);
            this.target.markDirty();


        }
    }
}