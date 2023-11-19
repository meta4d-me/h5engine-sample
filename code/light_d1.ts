namespace t
{
    export class light_d1 implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        /**
         * 添加cube
         */
        private addcube()
        {
            var smesh1 = this.app.getAssetMgr().getDefaultMesh("cube");
            for (var i = -4; i < 5; i++)
            {
                for (var j = -4; j < 5; j++)
                {
                    var baihu = new m4m.framework.transform();
                    this.scene.addChild(baihu);
                    baihu.localScale = new m4m.math.vector3(0.5, 0.5, 0.5);
                    baihu.localTranslate.x = i;
                    baihu.localTranslate.y = j;
                    //m4m.math.quatFromEulerAngles(-90, 0, 0, baihu.localRotate);
                    baihu.markDirty();

                    // var smesh1 = this.app.getAssetMgr().getAssetByName("Sphere.mesh.bin") as m4m.framework.mesh;
                    var mesh1 = baihu.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
                    mesh1.mesh = (smesh1);
                    var renderer = baihu.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    baihu.markDirty();
                    var sh = this.app.getAssetMgr().getShader("light3.shader.json");
                    renderer.materials = [];
                    renderer.materials.push(new m4m.framework.material());
                    renderer.materials[0].setShader(sh);

                    let texture = this.app.getAssetMgr().getAssetByName("rock256.png") as m4m.framework.texture;
                    renderer.materials[0].setTexture("_MainTex", texture);

                    var tex2 = this.app.getAssetMgr().getAssetByName("rock_n256.png") as m4m.framework.texture;
                    renderer.materials[0].setTexture("_NormalTex", tex2);
                }
            }
        }

        /**
         * 添加相机和灯光
         */
        private addCameraAndLight()
        {
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


            var lighttran = new m4m.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light") as m4m.framework.light;
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();

            {
                var cube = new m4m.framework.transform();
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;

                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let cuber = renderer;
            }
        }
        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = () =>
            {
                if (this.light != null)
                {
                    if (this.light.type == m4m.framework.LightTypeEnum.Direction)
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (this.light.type == m4m.framework.LightTypeEnum.Point)
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Spot;
                        console.log("聚光灯");
                    }
                    else
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            }
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

            let texPath = `${resRootPath}texture/`;
            util.loadShader(this.app.getAssetMgr())
                .then(() => Promise.all([`${texPath}zg256.png`, `${texPath}rock256.png`, `${texPath}rock_n256.png`].map(item => util.loadTex(item, this.app.getAssetMgr()))))
                .then(() => this.addcube())
                .then(() => this.addCameraAndLight())
        }

        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number = 0;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        update(delta: number)
        {
            this.taskmgr.move(delta);

            this.timer += delta;

            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null)
            {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new m4m.math.vector3(x2 * 5, 4, -z2 * 5);
                // objCam.markDirty();
                //objCam.updateWorldTran();
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                objCam.markDirty();
            }
            if (this.light != null)
            {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new m4m.math.vector3(x * 3, 3, z * 3);

                //objlight.updateWorldTran();
                objlight.lookatPoint(new m4m.math.vector3(0, 0, 0));
                objlight.markDirty();
            }

        }
    }

}