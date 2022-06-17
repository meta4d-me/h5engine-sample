namespace t
{

    export class TestRotate implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        parts: m4m.framework.transform;
        timer: number = 0;
        cube2: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        count: number = 0;
        counttimer: number = 0;
        name: string = "rock256.png";

        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) =>
            {
                //state.finish = true;
              
                if(_state.isfinish)
                {
                    state.finish = true;
                }
            }
            );
        }

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

        private loadPvr(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/resources/" + this.name, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    state.finish = true;
                }
            });
        }
        private changeShader()
        {
            var btn = document.createElement("button");
            // btn.textContent = "切换Shader到：diffuse.shader.json";
            btn.textContent = "save";

            btn.onclick = () =>
            {
                // var sh = this.app.getAssetMgr().getShader("diffuse.shader.json") as m4m.framework.shader;
                // this.change(sh);
                let trans = this.cube;
                let name = trans.name;
                let prefab = new m4m.framework.prefab(name + ".prefab.json");
                prefab.assetbundle = name + ".assetbundle.json";
                prefab.apply(trans);
                // this.app.getAssetMgr().setAssetUrl(prefab, url);
                this.app.getAssetMgr().use(prefab);
                this.app.getAssetMgr().savePrefab(trans, name + ".prefab.json", (data: m4m.framework.SaveInfo, resourses?: string[], content?: any) =>
                {
                    console.log(data);
                });
            }
            btn.style.top = "160px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

        }


        private addcam(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {

            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 1000;
            objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新

            state.finish = true;

        }

        private addcube(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            //添加一个盒子
            {
                //添加一个盒子
                {
                    let cube = new m4m.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    let cuber = renderer;
                    // "rock256.png"
                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null)
                    {
                        console.log("sh 不是空的");
                        cuber.materials = [];
                        cuber.materials.push(new m4m.framework.material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                        if (texture == null)
                            console.error("为什么他是空的呀");
                        else
                        {
                            console.log("texture 不是空的");
                            cuber.materials[0].setTexture("_MainTex", texture);
                        }                           
                    }
                    this.cube = cube;

                    // var tt=dome.addcube(this.app.getAssetMgr());
                    // this.cube.addChild(tt);
                    // tt.localTranslate.z=1;
                    // tt.localScale=new m4m.math.vector3(0.2,0.2,0.2);
                    // tt.markDirty();
                }

                {
                    let ref_cube = new m4m.framework.transform();
                    ref_cube.name = "ref_cube";
                    ref_cube.localScale.x = ref_cube.localScale.y = ref_cube.localScale.z = 1;
                    // ref_cube.localTranslate.x = 2;
                    this.scene.addChild(ref_cube);
                    var mesh = ref_cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = ref_cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("shader/def");
                    if (sh != null)
                    {
                        renderer.materials = [];
                        renderer.materials.push(new m4m.framework.material());
                        renderer.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName(this.name) as m4m.framework.texture;
                        renderer.materials[0].setTexture("_MainTex", texture);

                    }
                    this.cube2 = ref_cube;
                }

                {
                    this.cubetrail = new m4m.framework.transform();
                    this.cubetrail.localScale.x = this.cubetrail.localScale.y = this.cubetrail.localScale.z = 0.2;
                    this.cubetrail.localTranslate.x = -3;
                    var mesh = this.cubetrail.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = smesh;
                    this.cubetrail.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    this.scene.addChild(this.cubetrail);
                    this.cubetrail.markDirty();
                }
            }
            state.finish = true;
        }

        cubetrail: m4m.framework.transform;
        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadPvr.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this))
            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.changeShader();
        }

        private angularVelocity: m4m.math.vector3 = new m4m.math.vector3(10, 0, 0);
        private eulerAngle = m4m.math.pool.new_vector3();

        private zeroPoint = new m4m.math.vector3(0, 0, 0);

        //--------------------
        private startdir = new m4m.math.vector3(-1, 0, 0);
        private enddir = new m4m.math.vector3(0, 0, -1);
        private targetdir = new m4m.math.vector3();
        //-------------
        update(delta: number)
        {
            this.taskmgr.move(delta);

            this.timer += delta;

            if (this.cube != null)
            {
                this.cube.localTranslate.x = Math.cos(this.timer) * 3.0;
                this.cube.localTranslate.z = Math.sin(this.timer) * 3.0;

                this.cube.lookatPoint(this.zeroPoint);
                this.cube.markDirty();
            }
            if (this.cube2)
            {
                //this.cube2.lookat(this.cube);
                this.cube2.lookatPoint(this.cube.getWorldTranslate());
                this.cube2.markDirty();
            }
            if (this.cubetrail)
            {
                var cube = this.cubetrail.clone();
                this.scene.addChild(cube);
                //m4m.framework.traillerp(this.startdir,this.enddir,this.timer*0.1,this.targetdir);
                m4m.math.vec3ScaleByNum(this.targetdir, 3, this.targetdir);
                m4m.math.vec3Clone(this.targetdir, cube.localTranslate);
                cube.markDirty();


            }
        }
    }
}