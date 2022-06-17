namespace t
{
    export class Test_NormalMap implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load(`${resRootPath}shader/Mainshader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    state.finish = true;
                }
            }
            );
        }

        private loadText(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            let c = 0;
            c++;
            this.app.getAssetMgr().load(`${resRootPath}texture/zg256.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else
                {
                    state.error = true;
                }
            }
            );
            c++;
            this.app.getAssetMgr().load(`${resRootPath}texture/map_diffuse.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else
                {
                    state.error = true;
                }
            }
            );
            c++;
            this.app.getAssetMgr().load(`${resRootPath}texture/map_normal.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else
                {
                    state.error = true;
                }
            }
            );
        }

        cuber: m4m.framework.meshRenderer;
        private normalCube: m4m.framework.transform;

        private addnormalcube(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {

            this.normalCube = new m4m.framework.transform();
            this.normalCube.name = "cube";
            this.normalCube.localScale.x = this.normalCube.localScale.y = this.normalCube.localScale.z = 3;
            this.scene.addChild(this.normalCube);

            var mesh = this.normalCube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);

            let renderer = this.normalCube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            this.cuber = renderer;
            let sh = this.app.getAssetMgr().getShader("normalmap.shader.json");
            if (sh != null)
            {
                this.cuber.materials = [];
                this.cuber.materials.push(new m4m.framework.material());
                this.cuber.materials[0].setShader(sh);//----------------使用shader
                //cuber.materials[0].setVector4("_Color", new m4m.math.vector4(0.4, 0.4, 0.2, 1.0));

                let texture = this.app.getAssetMgr().getAssetByName("map_diffuse.png") as m4m.framework.texture;
                this.cuber.materials[0].setTexture("_MainTex", texture);

                let normalTexture = this.app.getAssetMgr().getAssetByName("map_normal.png") as m4m.framework.texture;
                this.cuber.materials[0].setTexture("_NormalTex", normalTexture);

                // 瞎搞
                // if(this.light)
                // {
                //      let objlight = this.light.gameObject.transform;
                //      this.cuber.materials[0].setVector4("lightpos",new m4m.math.vector4(objlight.localTranslate.x,objlight.localTranslate.y,objlight.localTranslate.z,1));
                // }

            }

            state.finish = true;
        }

        private addcube(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            var cube = new m4m.framework.transform();
            cube.name = "cube";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 2;
            cube.localTranslate.x = 3;
            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            let cuber = renderer;

            var sh = this.app.getAssetMgr().getShader("light1.shader.json");
            if (sh != null)
            {
                cuber.materials = [];
                cuber.materials.push(new m4m.framework.material());
                cuber.materials[0].setShader(sh);//----------------使用shader

                let texture = this.app.getAssetMgr().getAssetByName("map_diffuse.png") as m4m.framework.texture;
                cuber.materials[0].setTexture("_MainTex", texture);

            }
            state.finish = true;
        }

        private addcamandlight(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {

            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new m4m.math.vector3(0, 0, -5);
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
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;

                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new m4m.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    //cuber.materials[0].setVector4("_Color", new m4m.math.vector4(0.4, 0.4, 0.2, 1.0));

                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);

                }
            }
            state.finish = true;

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

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addnormalcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
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
                objCam.localTranslate = new m4m.math.vector3(x2 * 10, 2.25, -z2 * 10);
                // objCam.markDirty();
                objCam.updateWorldTran();
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                //objCam.markDirty();
            }
            // if (this.normalCube != null) {
            //     let transform = this.normalCube.gameObject.transform;
            //     m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up,this.timer*30,transform.localRotate);
            //     transform.markDirty();
            // }

            // what the fuck。
            if (this.light != null)
            {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new m4m.math.vector3(x * 5, 3, z * 5);
                //     // objlight.markDirty();
                //     objlight.updateWorldTran();
                objlight.lookatPoint(new m4m.math.vector3(0, 0, 0));


                //     let lightPos = new m4m.math.vector4(x * 5, 3, z * 5,1.0);
                //     this.cuber.materials[0].setVector4("lightpos",lightPos);

                //     let eyePos = new m4m.math.vector4(x2 * 10, 2.25, -z2 * 10);
                //     this.cuber.materials[0].setVector4("eyepos",eyePos);
            }

        }
    }

}