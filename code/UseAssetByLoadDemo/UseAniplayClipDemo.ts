//加载动作病简单使用动作的Dome
class UseAniplayClipDemo implements IState {

    app: m4m.framework.application;
    scene: m4m.framework.scene;
    aniClip: m4m.framework.animationClip;
    taskMgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    aniplayer: m4m.framework.aniplayer;


    //加载一个动作
    private loadAniplayClip(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`res/prefabs/roles/pc2/Resources/pc2_skill1.FBAni.aniclip.bin`, m4m.framework.AssetTypeEnum.Aniclip, (s) => {
            // if (s.isfinish) {
            //     //取出一个动作的 IAsset对象
            //     let clip = this.app.getAssetMgr().getAssetByName("pc2_skill1.FBAni.aniclip.bin") as m4m.framework.animationClip;
            //     //通过动作资源的名字找到对应动作的ID
            //     let j = this.aniplayer.clipnames["pc2_skill1.FBAni.aniclip.bin"];
            //     //如果ID存在就说明该aniplayer存在，然后绑定动作资源
            //     if (j != null) {
            //         this.aniplayer.clips[j] = clip;
            //     }
            //     state.finish = true;
            //     this.aniplayer.play("pc2_skill1.FBAni.aniclip.bin", 1.0);
            // }
        });
    }

    //#region  通过bundle包加载一个完整的带动作的角色。
    private loadRole(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`res/prefabs/roles/pc2/pc2.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                let pc = (this.app.getAssetMgr().getAssetByName("pc2.prefab.json") as m4m.framework.prefab).getCloneTrans();

                //拿到pc 的动作组件的索引为后面挂动作资源做准备。
                this.aniplayer = pc.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;

                this.scene.addChild(pc);

                //给角色加上武器，只是为了让动作播放起来更好看
                this.app.getAssetMgr().load(`res/prefabs/weapons/wp_ds_001/wp_ds_001.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        let prefab = this.app.getAssetMgr().getAssetByName("wp_ds_001.prefab.json") as m4m.framework.prefab;
                        //find方法传想要tranform的name，具体哪个name是左右手，在开发中自己去定义。
                        let rhand = pc.find("Bip01 Prop1");
                        let lhand = pc.find("Bip01 Prop1");
                        if (rhand) {
                            let weapon = prefab.getCloneTrans();
                            rhand.addChild(weapon);
                            //初始化武器tranform的属性
                            weapon.localRotate = new m4m.math.quaternion();
                            weapon.localTranslate = new m4m.math.vector3();
                            weapon.localScale = new m4m.math.vector3(1, 1, 1);
                            weapon.markDirty();
                        }

                        if (lhand) {
                            let weapon = prefab.getCloneTrans();
                            lhand.addChild(weapon);
                            weapon.localRotate = new m4m.math.quaternion();
                            weapon.localTranslate = new m4m.math.vector3();
                            weapon.localScale = new m4m.math.vector3(1, 1, 1);
                            weapon.markDirty();
                        }

                        state.finish = true;
                        console.log(pc);
                    }
                });
            }
        });
    }
    //#endregion
    
    //#region 加载shader
    private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.iserror) {
                state.error = true;
            }
            if (s.isfinish)
                state.finish = true;
        });
    }
    //#endregion

    //#region  添加摄像机
    private addCamera(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        let objCam = new m4m.framework.transform();
        objCam.name = "camera.";
        objCam.localPosition.z = -10;
        objCam.localPosition.y = 10;
        objCam.localPosition.x = 10;

        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.far = 100;
        this.scene.addChild(objCam);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        objCam.markDirty();
        state.finish = true;
    }
    //#endregion

    start(app: m4m.framework.application) {
        this.app = app;
        this.scene = app.getScene();
        this.taskMgr.addTaskCall(this.loadShader.bind(this));
        this.taskMgr.addTaskCall(this.addCamera.bind(this));
        this.taskMgr.addTaskCall(this.loadRole.bind(this));
        this.taskMgr.addTaskCall(this.loadAniplayClip.bind(this));

    }


    update(delta: number) {
        this.taskMgr.move(delta);
    }
}
