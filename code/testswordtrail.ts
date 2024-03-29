namespace t {

    export class test_trailrenderrecorde implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        /**
         * 加载着色器
         * @param laststate 
         * @param state 状态
         */
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }
        /**
         * 加载文本数据
         * @param laststate 
         * @param state 状态
         */
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
            this.app.getAssetMgr().load("res/rock256.png", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            }
            );
            this.app.getAssetMgr().load("res/swingFX.png", m4m.framework.AssetTypeEnum.Auto, (s) => {
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
        /**
         * 加载角色模型
         * @param laststate 
         * @param state 状态
         */
        private loadRole(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/prefabs/0000_zs_male/0000_zs_male.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName("0000_zs_male.prefab.json") as m4m.framework.prefab;
                    this.role = _prefab.getCloneTrans();
                    this.role.name = "role";
                    this.roleLength = this.role.children.length;
                    this.scene.addChild(this.role);
                    this.role.localScale = new m4m.math.vector3(1, 1, 1);
                    this.role.localTranslate = new m4m.math.vector3(0, 0, 0);
                    this.role.gameObject.visible = true;
                    this.role.markDirty();
                    this.role.updateWorldTran();
                    this.aniplayer = this.role.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;
                    state.finish = true;
                }
            });
        }

        private weapon: m4m.framework.transform;
        /**
         * 加载武器
         * @param laststate 
         * @param state 状态
         */
        private loadWeapon(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/prefabs/0002_sword_sword/0002_sword_sword.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    if (this.weapon) this.weapon.parent.removeChild(this.weapon);
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName("0002_sword_sword.prefab.json") as m4m.framework.prefab;
                    this.weapon = _prefab.getCloneTrans();
                    //  this.scene.addChild(this.role);
                    this.weapon.localScale = new m4m.math.vector3(1, 1, 1);
                    this.weapon.localTranslate = new m4m.math.vector3(0, 0, 0);
                    var obj = this.role.find("Bip001 Prop1");
                    obj.addChild(this.weapon);
                    state.finish = true;
                }
            });
        }
        sh: m4m.framework.shader;
        cube2: m4m.framework.transform;
        /**
         * 初始化场景
         * @param laststate 
         * @param state 状态
         */
        private initscene(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {



            {

                //添加一个摄像机
                var objCam = new m4m.framework.transform();
                objCam.name = "sth.";
                this.scene.addChild(objCam);
                this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
                this.camera.near = 0.01;
                this.camera.far = 100;
                this.camera.fov = Math.PI * 0.3;
                this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
                objCam.localTranslate = new m4m.math.vector3(0, 5, -5);
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                objCam.markDirty();//标记为需要刷新

                {
                    var org = new m4m.framework.transform();
                    org.name = "org";
                    this.org = org;
                    this.scene.addChild(org);
                }

                {
                    let ref_cube = new m4m.framework.transform();
                    ref_cube.name = "ref_cube";
                    ref_cube.localScale.x = ref_cube.localScale.y = ref_cube.localScale.z = 5;
                    ref_cube.localTranslate.y = -2;
                    this.scene.addChild(ref_cube);
                    var mesh = ref_cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("plane");
                    mesh.mesh = (smesh);
                    var renderer = ref_cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("diffuse_bothside.shader.json") as m4m.framework.shader;
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new m4m.framework.material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("rock256.png") as m4m.framework.texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }
                    this.cube2 = ref_cube;
                }

                {



                    var cube = new m4m.framework.transform();
                    cube.name = "cube";
                    this.cube = cube;
                    org.addChild(cube);
                    cube.localTranslate.x = -5;
                    // cube.localScale.y = 0.1;
                    // cube.localScale.z = 0.5;
                    // cube.localScale.x = 5;
                    cube.markDirty();
                    var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    let cuber = renderer;

                    // var test1=new m4m.framework.transform();
                    // test1.localScale.y=2;
                    // test1.localScale.x=0.3;
                    // test1.localScale.z=0.3;
                    // test1.localTranslate.z=1;
                    // this.weapon.addChild(test1);
                    //  var mesh = test1.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
                    // test1.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    // mesh.mesh=smesh;
                    // m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_right, 90, test1.localRotate);
                    // test1.markDirty();
                    
                    var trailtrans = new m4m.framework.transform();
                    trailtrans.localTranslate.z = 0.5;
                    
                    this.weapon.addChild(trailtrans);               
                    m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_right, 270, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("trailRender_recorde") as m4m.framework.trailRender_recorde;
                    //trailrender.color=new m4m.math.color(1.0,0,0,1.0);
                    //trailrender.speed = 1;
                    trailrender.setWidth(1);
                    var mat = new m4m.framework.material();
                    //particles_additive.shader.json
                    //transparent_bothside.shader.json
                    //particles_additive_premultiply.shader.json
                    let shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json") as m4m.framework.shader;
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json") as m4m.framework.texture;
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex)

                    trailrender.material = mat;
                    //trailrender.interpolate=true;
                    //this.trailrender=trailrender;
                    //trailrender.lifetime=0.4;
                    //trailrender.minvertexDistance=0.01;
                    trailrender.setWidth(1,1);
                }

            }
            state.finish = true;

        }

        trailrender:m4m.framework.trailRender;
        start(app: m4m.framework.application) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.wind = new m4m.math.vector4()

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            this.taskmgr.addTaskCall(this.loadWeapon.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            var tbn1 = this.addbtn("80px", "0px", "attack_01");
            tbn1.onclick = () => {
                    let name = "attack_01.FBAni.aniclip.bin";
                    this.aniplayer.playCross(name, 0.2);
            }
            var btn = this.addbtn("120px", "0px", "attack_02");
            btn.onclick = () => {
                    let name = "attack_02.FBAni.aniclip.bin";
                    this.aniplayer.playCross(name, 0.2);
            }
            // var btn3 = this.addbtn("160px", "0px", "attack_03");
            // btn3.onclick = () => {
            //         let name = "attack_03.FBAni.aniclip.bin";
            //         this.aniplayer.playCross(name, 0.2);
            // }

            {
                let btn2 = this.addbtn("160px", "0px", "playAttackAni");
                btn2.onclick = () => {
                    let name = "attack_04.FBAni.aniclip.bin";
                    this.aniplayer.playCross(name, 0.2);
                }
            }
        }
        org: m4m.framework.transform;
        cube: m4m.framework.transform;
        camera: m4m.framework.camera;
        timer: number = 0;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        grassMat: m4m.framework.material;
        private wind: m4m.math.vector4;
        private WaveFrequency: number = 4.0;
        private WaveAmplitude: number = 0.05;

        play: boolean = true;
        update(delta: number) {
            this.taskmgr.move(delta);
            this.timer += delta;
            // if (this.org != undefined && this.play) {
            //     this.timer++;
            //     // var x = Math.sin(this.timer * 0.01);
            //     // var z = Math.cos(this.timer * 0.01);
            //     this.org.localTranslate.x +=0.05;
            //     // this.cube.localTranslate.z = z * 5;

            //     // this.cube.markDirty();
            //     // m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, this.timer, this.org.localRotate); 
            //     this.org.markDirty();
            // }

        }

        /**
         * 添加按钮
         * @param top 上位置 
         * @param left 左位置
         * @param text 文本
         * @returns html按钮组件
         */
        private addbtn(top: string, left: string, text: string): HTMLButtonElement {
            var btn = document.createElement("button");
            btn.style.top = top;
            btn.style.left = left;
            btn.style.position = "absolute";
            btn.textContent = text;
            this.app.container.appendChild(btn);

            return btn;
        }
    }
}