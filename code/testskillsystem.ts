namespace t {

    export class test_skillsystem implements IState {
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
        private role = new m4m.framework.transform();

        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }

        private loadText(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
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

        private addcam(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {

            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new m4m.math.vector3(0, 10, 0);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
            state.finish = true;

        }

        private addcube(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
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

                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new m4m.framework.material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }
                    this.cube = cube;
                }

                //添加一个盒子
                {
                    let cube = new m4m.framework.transform();
                    cube.name = "cube";
                    // this.scene.addChild(cube);
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
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
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube2 = cube;
                }
            }
            state.finish = true;
        }

        private loadRole(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.role.name = "role";
            this.app.getAssetMgr().load("res/prefabs/0000_zs_male/0000_zs_male.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName("0000_zs_male.prefab.json") as m4m.framework.prefab;
                    this.role = _prefab.getCloneTrans();
                    this.scene.addChild(this.role);
                    this.role.localScale = new m4m.math.vector3(1, 1, 1);
                    this.role.localTranslate = new m4m.math.vector3(0, 0, 0);
                    this.role.gameObject.visible = true;
                    var ap = this.role.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;
                    ap.autoplay = true;

                    {
                        let play = document.createElement("button");
                        play.textContent = "play1";
                        play.onclick = () => {
                            // this.playAniAndEffect(ap, "attack_01", 0, 0);
                            this.playAniAndEffect(ap, "attack_01", "fx_zs_male@attack_01", 0, 0);
                            //this.playAniAndEffect(ap, "attack_02", "fx_zs_male@attack_02", 1000, 1000);
                            this.playAniAndEffect(ap, "attack_04", "fx_zs_male@attack_03", 3000, 1000);
                            setInterval(() => {
                                this.playAniAndEffect(ap, "attack_01", "fx_zs_male@attack_01", 0, 0);
                                //this.playAniAndEffect(ap, "attack_02", "fx_zs_male@attack_02", 1000, 1000);
                                this.playAniAndEffect(ap, "attack_04", "fx_zs_male@attack_03", 3000, 1000);
                            }, 6000);
                        }
                        play.style.left = "0px";
                        play.style.top = "240px";
                        play.style.position = "absolute";
                        this.app.container.appendChild(play);
                    }
                    // ap._playTimer = Math.random() * 1000;
                }

                state.finish = true;
            });
        }

        private playAniAndEffect(aniplayer: m4m.framework.aniplayer, aniName: string, effectName: string, playAniDelay: number, afterAni_PlayEffectDelay: number) {
            {
                setTimeout(() => {
                    let aniclipName = aniName + ".FBAni.aniclip.bin";
                    aniplayer.playCross(aniclipName, 0.2);
                    setTimeout(() => {
                        if (this.effect != null) {
this.effect.gameObject.transform.dispose();
                        }
                        let path = "res/particleEffect/" + effectName + "/" + effectName + ".assetbundle.json";

                        this.app.getAssetMgr().load(path, m4m.framework.AssetTypeEnum.Auto, (_state) => {
                            if (_state.isfinish) {
                                let tr = new m4m.framework.transform();
                                this.effect = tr.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as m4m.framework.effectSystem;
                                var text: m4m.framework.textasset = this.app.getAssetMgr().getAssetByName(effectName + ".effect.json") as m4m.framework.textasset;
                                this.effect.setJsonData(text);
                                this.role.addChild(tr);
                                let rotateVelocity: m4m.math.quaternion = m4m.math.pool.new_quaternion();
                                m4m.math.quatFromEulerAngles(180, 0, 0, rotateVelocity);
                                m4m.math.quatMultiply(rotateVelocity, tr.localRotate, tr.localRotate);
                                m4m.math.pool.delete_quaternion(rotateVelocity);

                                tr.markDirty();
                                tr.updateWorldTran();
                            }
                        }
                        );

                    }, afterAni_PlayEffectDelay);
                }, playAniDelay);
            }
        }

        effect: m4m.framework.effectSystem;
        effect2: m4m.framework.effectSystem;

        private loadEffect(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            let name = "fx_zs_male@attack_01";
            let path = "res/particleEffect/" + name + "/" + name + ".assetbundle.json";

            this.app.getAssetMgr().load(path, m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    let tr = new m4m.framework.transform();
                    this.effect = tr.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as m4m.framework.effectSystem;
                    var text: m4m.framework.textasset = this.app.getAssetMgr().getAssetByName(name + ".effect.json") as m4m.framework.textasset;
                    this.effect.setJsonData(text);
                    this.role.addChild(tr);
                    let rotateVelocity: m4m.math.quaternion = m4m.math.pool.new_quaternion();
                    m4m.math.quatFromEulerAngles(180, 0, 0, rotateVelocity);
                    m4m.math.quatMultiply(rotateVelocity, tr.localRotate, tr.localRotate);
                    m4m.math.pool.delete_quaternion(rotateVelocity);
                    tr.markDirty();
                    tr.updateWorldTran();
                    state.finish = true;
                }
            }
            );
        }

        start(app: m4m.framework.application) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
            // this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            this.taskmgr.addTaskCall(this.loadEffect.bind(this));

        }

        private angularVelocity: m4m.math.vector3 = new m4m.math.vector3(0, 10, 0);
        private eulerAngle = m4m.math.pool.new_vector3();
        update(delta: number) {
            this.taskmgr.move(delta);

            this.timer += delta;

            if (this.role != null) {

                let cubeTransform = this.role.gameObject.transform;

                this.eulerAngle.x = delta * this.angularVelocity.x;
                this.eulerAngle.y = delta * this.angularVelocity.y;
                this.eulerAngle.z = delta * this.angularVelocity.z;

                let rotateVelocity: m4m.math.quaternion = m4m.math.pool.new_quaternion();

                //替代掉这个函数
                m4m.math.quatFromEulerAngles(this.eulerAngle.x, this.eulerAngle.y, this.eulerAngle.z, rotateVelocity);

                //一切ok
                //m4m.math.quatFromAxisAngle(new m4m.math.vector3(0, 1, 0), this.timer, rotateVelocity);

                m4m.math.quatMultiply(rotateVelocity, cubeTransform.localRotate, cubeTransform.localRotate);
                m4m.math.pool.delete_quaternion(rotateVelocity);
                cubeTransform.markDirty();
            }

        }
    }
}