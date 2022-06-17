
class test_keyFrameAni implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskMgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    obj3d: m4m.framework.transform;
    cameraNode: m4m.framework.transform;
    ins: m4m.framework.transform;

    start(app: m4m.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.addCamera();
        util.loadShader(this.app.getAssetMgr())
            .then(() => this.loadAsset())
            .then(() => this.addbtns())
    }
    private addCamera()
    {
        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
        this.cameraNode = objCam;
        this.scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.near = 0.01;
        camera.far = 10000;
        CameraController.instance().init(this.app, camera);
    }

    private loadAsset()
    {
        return util.loadModel(this.app.getAssetMgr(), "PF_PlayerSharkAlien")
            .then(prefab =>
            {
                let ins = prefab.getCloneTrans();
                this.ins = ins;

                let comps = ins.gameObject.getComponentsInChildren('f4skinnedMeshRenderer') as m4m.framework.f4skinnedMeshRenderer[];
                comps.forEach(item => item.materials[0].setShader(this.app.getAssetMgr().getShader("f4skin.shader.json")))

                this.scene.addChild(ins);
                this.cameraNode.lookat(ins);
                this.cameraNode.markDirty();
            })
    }

    private addbtns()
    {
        this.addbtn("play", 10, 100, () =>
        {
            let [aniPlayer] = this.ins.gameObject.getComponentsInChildren("keyFrameAniPlayer") as m4m.framework.keyFrameAniPlayer[];
            let cName = aniPlayer.clips[0].getName();
            aniPlayer.play(cName);
        });

        this.addbtn("stop", 10, 150, () =>
        {
            let [aniPlayer] = this.ins.gameObject.getComponentsInChildren("keyFrameAniPlayer") as m4m.framework.keyFrameAniPlayer[];
            aniPlayer.stop();
        });

        this.addbtn("rewind", 10, 200, () =>
        {
            let [aniPlayer] = this.ins.gameObject.getComponentsInChildren("keyFrameAniPlayer") as m4m.framework.keyFrameAniPlayer[];
            aniPlayer.rewind();
        });
    }

    private addbtn(text: string, x: number, y: number, func: () => void)
    {
        var btn = document.createElement("button");
        btn.textContent = text;
        btn.onclick = () =>
        {
            func();
        }
        btn.style.top = y + "px";
        btn.style.left = x + "px";
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);
    }


    update(delta: number)
    {
        CameraController.instance().update(delta);
    }
}