class test_01 implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        let cuber: m4m.framework.meshRenderer;
        this.testEffect();
        for (var i = 0; i < 1; i++) {
            //添加一个盒子
            var cube = new m4m.framework.transform();
            cube.name = "cube";
            this.scene.addChild(cube);

            // var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            // var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            // mesh.mesh = (smesh);
            // var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            // this.testNRes(cube);


            //目前材质是内置配置的，
            //这个加载机制弄完之后，就可以根据name 访问资源包里的shader
            //然后用shader 构造材质，和unity相同
            // 配置代码如下

            // this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) => {
            //     if (state.isfinish) {
            //         var sh = this.app.getAssetMgr().getShader("color.shader.json");
            //         if (sh != null) {
            //             //用了从资源里加载出来的shader
            //             cuber.materials = [];
            //             cuber.materials.push(new m4m.framework.material());
            //             cuber.materials[0].setShader(sh);
            //             //shader 修改为 不和一般资源一样加载,而是统一用getShader方法
            //             //cuber.materials[0].shader = this.app.getAssetMgr().getResourceByName("color") as m4m.framework.shader;
            //             this.app.getAssetMgr().load("res/zg256.png", m4m.framework.AssetTypeEnum.Auto, (s) => {
            //                 if (s.isfinish) {
            //                     console.warn("Finish load img.");
            //                     let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
            //                     cuber.materials[0].setTexture("_MainTex", texture);
            //                 }
            //             })
            //         }
            //     }
            // });

            // m4m.math.quatFromAxisAngle(new m4m.math.vector3(0, 0, 1), 45, cube.localRotate);
            // this.cube = cube;
            // this.cube.setWorldPosition(new m4m.math.vector3(i, 0, 0));
        }
        // {
        //     this.cube2 = new m4m.framework.transform();
        //     this.cube2.name = "cube2";
        //     this.scene.addChild(this.cube2);
        //     this.cube2.localScale.x = this.cube2.localScale.y = this.cube2.localScale.z = 0.5;
        //     var mesh = this.cube2.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        //     mesh.mesh = (smesh);
        //     var renderer = this.cube2.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        //     var collider = this.cube2.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
        //     {
        // var cube = new m4m.framework.transform();
        // cube.name = "cubesub";
        // this.cube2.addChild(cube);
        // var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        // mesh.mesh = (smesh);
        // var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;

        //         cube.localTranslate.z = 1;
        //         cube.localScale.x = 0.5;
        //         cube.localScale.y = 0.5;
        //         //cube.localScale.z = 0.5;
        //         var collider = cube.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
        //         cube.markDirty();
        //     }
        // }
        {
            //this.cube3 = new m4m.framework.transform();
            //this.cube3.localScale.x = this.cube3.localScale.y = this.cube3.localScale.z = 0.7;
            //this.cube3.name = "cube3";
            //this.scene.addChild(this.cube3);
            //var mesh = this.cube3.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            //mesh.setMesh(smesh);
            //var renderer = this.cube3.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            ////var collider = this.cube3.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
        }

        //添加一个摄像机
        setTimeout(() => {
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 100;
            this.camera.backgroundColor = new m4m.math.color(0,0,0,1);
            objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
            objCam.lookat(cube);
            objCam.markDirty();//标记为需要刷新

        }, 1000);
        {
            var testQuat: m4m.math.quaternion = m4m.math.pool.new_quaternion();


            // m4m.math.quatFromAxisAngle(m4m.math.pool.vector2_right, 45, testQuat);
        }

        //{
        //    var angle = new m4m.math.vector3(30, 40, 150);
        //    var quat = new m4m.math.quaternion();
        //    m4m.math.quatFromEulerAngles(angle.x, angle.y, angle.z, quat);

        //    var out = new m4m.math.vector3();
        //    m4m.math.quatToEulerAngles(quat, out);
        //}
    }
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number = 0;
    update(delta: number) {
        return;
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        //objCam.localTranslate = new m4m.math.vector3(x2 * 5, 2.25, -z2 * 5);
        //objCam.lookat(this.cube);
        //objCam.markDirty();//标记为需要刷新
        //objCam.updateWorldTran();

        this.cube2.localTranslate = new m4m.math.vector3(this.timer, 0, 0);
        //this.cube2.lookat(this.cube);
        this.cube2.markDirty();
        //this.cube3.localTranslate = new m4m.math.vector3(x * 2, 0, z * 2);
        //this.cube3.markDirty();

    }

    private testPrefab(cube: m4m.framework.transform) {

        // cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
        // cube.localTranslate.x = 2;
        // var collider = cube.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;

        // var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

        // var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
        // mesh.mesh = smesh;
        // var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        // let v3 = cube.localEulerAngles;
        // console.log(cube.getWorldMatrix());
        // v3.x += 50;
        // cube.localEulerAngles = v3;
        // console.log(cube.getWorldMatrix());
        // cuber = renderer;

        console.warn("Finish it.");
        let assetMgr = this.app.getAssetMgr();
        assetMgr.load("res/test/customShader/customShader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) => {
            if (state.isfinish) {
                // assetMgr.load("res/test/1/ui/yingdao_page/yingdao_page.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
                // {
                //     if (state.isfinish)
                //     {
                //         let prefab = assetMgr.getAssetByName("yingdao_page.prefab.json") as m4m.framework.prefab;
                //         let trans = prefab.getCloneTrans();
                //         console.log("###", trans);
                //     }
                // });
                var cloneCount = 1;
                m4m.framework.mesh.useThead = false;
                window["test0"] = function (cloneCount) {
                    assetMgr.load("res/test/0/Background/Background.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) => {
                        if (state.isfinish) {
                            let prefab = assetMgr.getAssetByName("Background.prefab.json") as m4m.framework.prefab;
                            let time = Date.now();
                            for (let i = 0; i < cloneCount; ++i) {
                                let shark = prefab.getCloneTrans();
                                cube.addChild(shark);
                            }
                            let useTime = Date.now() - time;
                            console.log(`old clone trans:${useTime}/ms count:${cloneCount}`);
                            // this.scene.addChild(shark);
                        }
                    });
                }
                window["test1"] = function (cloneCount) {
                    assetMgr.load("res/test/1/Background/Background.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) => {
                        if (state.isfinish) {
                            let prefab = assetMgr.getAssetByName("Background.prefab.json") as m4m.framework.prefab;
                            let time = Date.now();
                            for (let i = 0; i < cloneCount; ++i) {
                                let shark = prefab.getCloneTrans();
                                cube.addChild(shark);
                            }
                            let useTime = Date.now() - time;
                            console.log(`new clone trans:${useTime}/ms count:${cloneCount}`);
                            // this.scene.addChild(shark);
                        }
                    });
                }
                window["test2"] = function (cloneCount) {

                    assetMgr.load("res/test/2/Background/Background.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) => {
                        if (state.isfinish) {
                            let prefab = assetMgr.getAssetByName("Background.prefab.json") as m4m.framework.prefab;
                            let time = Date.now();
                            for (let i = 0; i < cloneCount; ++i) {
                                let shark = prefab.getCloneTrans();
                                cube.addChild(shark);
                            }
                            let useTime = Date.now() - time;
                            console.log(`new clone trans:${useTime}/ms count:${cloneCount}`);
                            // this.scene.addChild(shark);
                        }
                    });
                }

                // assetMgr.load("res/test/0/7/7.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
                // {
                //     if (state.isfinish)
                //     {
                //         let prefab = assetMgr.getAssetByName("7.prefab.json") as m4m.framework.prefab;
                //         let time = Date.now();
                //         for (let i = 0; i < cloneCount; ++i)
                //         {
                //             let shark = prefab.getCloneTrans();
                //             cube.addChild(shark);
                //         }
                //         let useTime = Date.now() - time;
                //         console.log(`new clone trans:${useTime}/ms count:${cloneCount}`);
                //         // this.scene.addChild(shark);
                //     }
                // });
                // assetMgr.load("res/test/1/7/7.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
                // {
                //     if (state.isfinish)
                //     {
                //         let prefab = assetMgr.getAssetByName("7.prefab.json") as m4m.framework.prefab;
                //         let time = Date.now();
                //         for (let i = 0; i < cloneCount; ++i)
                //         {
                //             let shark = prefab.getCloneTrans();
                //             cube.addChild(shark);
                //         }
                //         let useTime = Date.now() - time;
                //         console.log(`new clone trans:${useTime}/ms count:${cloneCount}`);
                //         // this.scene.addChild(shark);
                //     }
                // });
            }
        });
    }

    private testNRes(root: m4m.framework.transform) {
        let cndroot = "http://192.168.88.68:8088/public/1/hungryshark/Resources_new/";
        let assetMgr = this.app.getAssetMgr();
        assetMgr.load(`${cndroot}shader/customShader/customShader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, async (state) => {
            if (state.isfinish) {


                assetMgr.mapShader = this.app.getAssetMgr().mapShader;
                // assetMgr.cdnRoot = cndroot;
                // await assetMgr.initGuidList(`${assetMgr.cdnRoot}guidlist.json`);

                assetMgr.load(`${cndroot}props/PC/role/PF_PlayerSharkReef/PF_PlayerSharkReef.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (state) => {
                    if (state.isfinish) {
                        console.log("资源加载结束");
                        let prefab: m4m.framework.prefab = assetMgr.getAssetByName("PF_PlayerSharkReef.prefab.json");
                        let trans = prefab.getCloneTrans();
                        root.addChild(trans);
                        // debugger;
                    }
                });

            }
        });

    }


    private testEffect() {
        let assetMgr = this.app.getAssetMgr();
        assetMgr.load("res/f14effprefab/customShader/customShader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) => {
            if (state.isfinish) {

                assetMgr.load("res/f14effprefab/fx_cs/fx_cs.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) => {
                    if (state.isfinish) {
                        let prefab = assetMgr.getAssetByName("fx_cs.prefab.json","fx_cs.assetbundle.json") as m4m.framework.prefab;
                        let trans = prefab.getCloneTrans();
                          trans.localEulerAngles = new m4m.math.vector3(0,90,0);

                        this.scene.addChild(trans);
                    }
                });
            }
        });

    }
}