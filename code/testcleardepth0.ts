namespace t {
    export class test_clearDepth0 implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        start(app: m4m.framework.application) {
            this.app = app;
            this.scene = this.app.getScene();

            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadTexture.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
        }
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }

        private loadTexture(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/rock256.png", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            }
            );
        }
        sh: m4m.framework.shader;
        private initscene(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            var objCam = new m4m.framework.transform();
            objCam.name = "cam_show";
            this.scene.addChild(objCam);
            this.showcamera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.showcamera.order = 0;
            this.showcamera.near = 0.01;
            this.showcamera.far = 30;
            this.showcamera.fov = Math.PI * 0.3;
            console.log(this.showcamera.fov);
            objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//鏍囪涓洪渶瑕佸埛鏂?
            
            
            {
                var o2ds = new m4m.framework.overlay2D();

                this.showcamera.addOverLay(o2ds);
                {
                    var t2d = new m4m.framework.transform2D();
                    t2d.name = "ceng1";
                    t2d.localTranslate.x = 0;
                    t2d.localTranslate.y = 0;
                    t2d.width = 150;
                    t2d.height = 150;
                    t2d.pivot.x = 0;
                    t2d.pivot.y = 0;
                    t2d.markDirty();
                    var rawiamge = t2d.addComponent("rawImage2D") as m4m.framework.rawImage2D;
                    rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("rock256.png") as m4m.framework.texture;
                    t2d.markDirty();
                    o2ds.addChild(t2d);


                }
                {
                    var cube1 = new m4m.framework.transform();
                    cube1.localTranslate.x = -3;
                    cube1.name = "cube1";
                    this.scene.addChild(cube1);
                    cube1.localScale.x = 4;
                    cube1.localScale.y = 4;
                    cube1.localScale.z = 1;

                    cube1.markDirty();

                    var mesh1 = cube1.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("plane");
                    mesh1.mesh = (smesh);
                    var renderer = cube1.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    renderer.materials = [];
                    let mat = new m4m.framework.material();
                    renderer.materials[0] = mat;
                    mat.setShader(this.app.getAssetMgr().getShader("diffuse.shader.json"));
                    mat.setTexture("_MainTex", this.app.getAssetMgr().getAssetByName("rock256.png") as m4m.framework.texture);
                }
            }
            state.finish = true;
        }



        private fuckLabel: m4m.framework.label;
        private showcamera: m4m.framework.camera;

        target: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        angle: number;
        timer: number;
        update(delta: number) {
            this.taskmgr.move(delta);

            if (this.target == undefined) return;
            // if (this.show_cube == undefined) return;
            this.timer += delta;
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, this.timer * 3, this.target.localRotate);
            this.target.markDirty();
        }
    }
}