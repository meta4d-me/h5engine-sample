namespace t
{

    export class test_three_leaved_rose_curve implements IState
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


        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }

        private loadText(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/trailtest2_00000.imgdesc.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            }
            );
            this.app.getAssetMgr().load("res/zg256.png", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            }
            );
        }
        aniplayer: m4m.framework.aniplayer;
        role: m4m.framework.transform;
        private roleLength: number;
        private loadRole(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/prefabs/dragon/dragon.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName("dragon.prefab.json") as m4m.framework.prefab;
                    this.role = _prefab.getCloneTrans();
                    this.role.name = "dragon";
                    // this.roleLength = this.role.children.length;
                    this.scene.addChild(this.role);


                    var trailtrans = new m4m.framework.transform();
                    trailtrans.localTranslate.y = 0.005;
                    
                    this.role.addChild(trailtrans);               
                    m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, 90, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("trailRender") as m4m.framework.trailRender;
                    //trailrender.color=new m4m.math.color(1.0,0,0,1.0);
                    trailrender.setspeed(0.35);
                    trailrender.setWidth(0.5);
                    var mat = new m4m.framework.material();
                    let shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json") as m4m.framework.shader;
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json") as m4m.framework.texture;
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex)

                    trailrender.material = mat;
                    // this.aniplayer = this.role.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;
                    state.finish = true;
                }
            });
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
            objCam.localTranslate = new m4m.math.vector3(0, 10, 10);
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
                    cube.localScale.x = cube.localScale.y = 0.5;                    
                    cube.localScale.z =2;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null)
                    {
                        cuber.materials = [];
                        cuber.materials.push(new m4m.framework.material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }
                    this.cube = cube;

                    var trailtrans = new m4m.framework.transform();
                    trailtrans.localTranslate.z = -0.5;
                    
                    this.cube.addChild(trailtrans);               
                    m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, 90, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("trailRender") as m4m.framework.trailRender;
                    //trailrender.color=new m4m.math.color(1.0,0,0,1.0);
                    trailrender.setspeed(0.25);
                    trailrender.setWidth(0.25);
                    var mat = new m4m.framework.material();
                    let shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json") as m4m.framework.shader;
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json") as m4m.framework.texture;
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex)

                    trailrender.material = mat;
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
                        cuber.materials = [];
                        cuber.materials.push(new m4m.framework.material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }



                    this.cube2 = ref_cube;


                }
            }
            state.finish = true;
        }


        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            // this.taskmgr.addTaskCall(this.addcube.bind(this))
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        }

        private angularVelocity: m4m.math.vector3 = new m4m.math.vector3(10, 0, 0);
        private eulerAngle = m4m.math.pool.new_vector3();

        private  zeroPoint=new m4m.math.vector3(0,0,0);
        update(delta: number)
        {
            this.taskmgr.move(delta);

            this.timer += delta;

            if(this.role!=null)
            {
                let a = 5;
                {

                    let theta = this.timer *0.5;
                    this.role.localTranslate.x = a * Math.cos(3 * theta) * Math.cos(theta);
                    this.role.localTranslate.z = a * Math.cos(3 * theta) * Math.sin(theta);
                }
                {
                    let deltaTheta = this.timer * 0.5 + 0.001;
                    let targetPoint = m4m.math.pool.new_vector3();
                    targetPoint.x  = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                    targetPoint.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                    this.role.lookatPoint(targetPoint);
                    m4m.math.pool.delete_vector3(targetPoint);

                    let q = m4m.math.pool.new_quaternion();
                    m4m.math.quatFromEulerAngles(-90,0,0,q);
                    m4m.math.quatMultiply(this.role.localRotate,q,this.role.localRotate);
                    m4m.math.pool.delete_quaternion(q);
                }


                // {
                //     let deltaTheta = this.timer*0.5 + 0.001;
                //     this.cube.localTranslate.x = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                //     this.cube.localTranslate.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                //     this.role.lookat(this.cube);
                // }
                // // m4m.math.quatFromEulerAngles(0,theta * 3,0,this.cube.localRotate);
                // // this.cube.lookatPoint(this.zeroPoint);
                // this.role.markDirty();
                this.role.markDirty();
                this.role.updateWorldTran();
            }

            if (this.cube != null)
            {
                // this.cube.localTranslate.x=Math.cos(this.timer)*3.0;
                // this.cube.localTranslate.z=Math.sin(this.timer)*3.0;
                let a = 5;
                {

                    let theta = this.timer *0.5;
                    this.cube.localTranslate.x = a * Math.cos(3 * theta) * Math.cos(theta);
                    this.cube.localTranslate.z = a * Math.cos(3 * theta) * Math.sin(theta);
                }
                {
                    let deltaTheta = this.timer * 0.5 + 0.001;
                    let targetPoint = m4m.math.pool.new_vector3();
                    targetPoint.x  = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                    targetPoint.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                    this.cube.lookatPoint(targetPoint);
                    m4m.math.pool.delete_vector3(targetPoint);
                }


                // {
                //     let deltaTheta = this.timer*0.5 + 0.001;
                //     this.cube.localTranslate.x = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                //     this.cube.localTranslate.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                //     this.role.lookat(this.cube);
                // }
                // // m4m.math.quatFromEulerAngles(0,theta * 3,0,this.cube.localRotate);
                // // this.cube.lookatPoint(this.zeroPoint);
                // this.role.markDirty();
                this.cube.markDirty();
                this.cube.updateWorldTran();
            }
            if(this.cube2)
            {
                //this.cube2.lookat(this.cube);
                this.cube2.lookatPoint(this.cube.getWorldTranslate());
                this.cube2.markDirty();
            }
        }
    }
}