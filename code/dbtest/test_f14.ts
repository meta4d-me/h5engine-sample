namespace dome {
    export class db_test_f14eff implements IState {
        rotEuler: number;
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        timer: number = 0;
        label: HTMLLabelElement;
        rot: m4m.math.quaternion = new m4m.math.quaternion();

        start(app: m4m.framework.application) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            //m4m.framework.assetMgr.useBinJs=true;
            util.loadShader(app.getAssetMgr())
                .then(() => this.loadEffectPrefab())
                .then(() => this.addCamera())
                .then(() => this.addUI())
        }
        private f14eff: m4m.framework.f14EffectSystem;
        private effPrefab: m4m.framework.transform;
        effbaseprefab: m4m.framework.prefab
        /**
         * 加载特效和prefab
         * @param name 资源名
         * @returns 
         */
        private loadEffectPrefab(name: string = "fx_yh") {
            return new Promise<void>((resolve, reject) => {
                this.app.getAssetMgr().load(`${resRootPath}effect/${name}/${name}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(`${name}.prefab.json`, `${name}.assetbundle.json`) as m4m.framework.prefab;
                        this.effbaseprefab = _prefab;
                        let prefab = _prefab.getCloneTrans();
                        this.effPrefab = prefab;
                        let f14Effect = this.effPrefab.gameObject.getComponent("f14EffectSystem") as m4m.framework.f14EffectSystem;
                        this.f14eff = f14Effect;
                        this.scene.addChild(this.effPrefab);
                        resolve();
                    }
                });
            })
        }

        /**
         * 添加GUI
         */
        private addUI() {
            this.addButton();
            this.addButton2();
        }
        /**
         * 添加按钮
         */
        private addButton() {
            var btn = document.createElement("button");
            btn.textContent = "Play";
            btn.onclick = () => {
                this.f14eff.play();
            }
            btn.style.top = "160px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
        }
        /**
         * 添加按钮
         */
        private addButton2() {
            var btn = document.createElement("button");
            btn.textContent = "stop";
            btn.onclick = () => {
                this.f14eff.stop();
            }
            btn.style.top = "200px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
        }
        /**
         * 添加相机
         */
        private addCamera() {
            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 2000;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new m4m.math.vector3(0, 0, -15);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            // let controller=new CameraController();
            CameraController.instance().init(this.app, this.camera);
            this.app.getScene().mainCamera = this.camera;
        }
        update(delta: number) {
            CameraController.instance().update(delta);
        }
    }
}