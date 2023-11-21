namespace t {
    export class test_light1 implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        tex: m4m.framework.texture;
        /**
         * 加载文本字符串
         * @returns 等待Promise
         */
        private loadText() {
            return new Promise<void>((resolve, reject) => {
                let imgName = `zg256.png`;
                let imgURL = `${resRootPath}texture/${imgName}`;
                m4m.framework.sceneMgr.app.getAssetMgr().load(imgURL, m4m.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        this.tex = m4m.framework.sceneMgr.app.getAssetMgr().getAssetByName(imgName) as m4m.framework.texture;
                        resolve();
                    }
                    if (s.isloadFail) {
                        reject();
                    }
                });
            })
        }

        /**
         * 添加所有 cube
         */
        private addCubes() {
            for (var i = -4; i < 5; i++) {
                for (var j = -4; j < 5; j++) {
                    this.addCube(i, j, 0);
                    this.addCube(i, 0, j);
                }
            }
        }

        /**
         * 添加cube 
         * @param x 位置x
         * @param y 位置y
         * @param z 位置z
         */
        private addCube(x: number, y: number, z: number) {
            var cube = new m4m.framework.transform();
            cube.name = "cube";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.8;
            cube.localTranslate.x = x;
            cube.localTranslate.y = y;
            cube.localTranslate.z = z;
            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            let cuber = renderer;

            var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
            if (sh != null) {
                cuber.materials = [];
                cuber.materials.push(new m4m.framework.material());
                cuber.materials[0].setShader(sh);
                cuber.materials[0].setTexture("_MainTex", this.tex);
            }
        }

        /**
         * 添加相机和灯光
         */
        private addCameraAndLight() {
            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新


            var lightNode = new m4m.framework.transform();
            this.scene.addChild(lightNode);
            this.light = lightNode.gameObject.addComponent("light") as m4m.framework.light;
            this.light.type = m4m.framework.LightTypeEnum.Direction;
            lightNode.localTranslate.x = 2;
            lightNode.localTranslate.z = 1;
            lightNode.localTranslate.y = 3;
            lightNode.markDirty();

            {
                var cube = new m4m.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;

                lightNode.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new m4m.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    //cuber.materials[0].setVector4("_Color", new m4m.math.vector4(0.4, 0.4, 0.2, 1.0));

                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
        }
        start(app: m4m.framework.application) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = () => {
                if (!this.light) return;
                this.light.type++;
                this.light.type %= 3;

                this.light.intensity = 1;
                if (this.light.type == m4m.framework.LightTypeEnum.Point) {
                    this.light.range = 10;
                    this.light.intensity = 2;
                    console.log("点光源");
                }
                else if (this.light.type == m4m.framework.LightTypeEnum.Spot) {
                    this.light.spotAngelCos = Math.cos(0.5 * Math.PI);
                    this.light.intensity = 2;
                    console.log("聚光灯");
                }
                else {
                    this.light.intensity = 0.6;
                    console.log("方向光");
                }
            }
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

            util.loadShader(this.app.getAssetMgr())
                .then(() => this.loadText())
                .then(() => this.addCubes())
                .then(() => this.addCameraAndLight())
        }

        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number = 0;
        update(delta: number) {
            this.timer += delta;

            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new m4m.math.vector3(x2 * 10, 2.25, -z2 * 10);
                // objCam.markDirty();
                objCam.updateWorldTran();
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                //objCam.markDirty();
            }
            if (this.light != null) {
                var objLight = this.light.gameObject.transform;
                objLight.localTranslate = new m4m.math.vector3(x * 5, 3, z * 5);
                objLight.updateWorldTran();
                objLight.lookatPoint(new m4m.math.vector3(0, 0, 0));
            }
        }
    }
}