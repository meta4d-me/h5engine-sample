/**
 * lightMap 光照贴图
 */
class test_LightMap implements IState {
    private app: m4m.framework.application;
    private scene: m4m.framework.scene;
    private resType = `FLOAT16`;
    private resTypeFileMap = {
        PNG: { f: `lightMapItem_png`, type: `pfb` },
        FLOAT16: { f: `lightMapItem_f16`, type: `pfb` }
    };
    async start(app: m4m.framework.application) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        let assetMgr = this.app.getAssetMgr();
        await datGui.init();
        await util.loadShader(assetMgr);

        //
        this.setGUI();
        //
        this.change();
    }

    private addCam() {
        //添加一个摄像机
        //initCamera
        let objCam = new m4m.framework.transform();
        this.scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0)
    }

    private setGUI() {
        if (!dat) return;
        let gui = new dat.GUI();
        let title = { str: "LightMap 光照贴图" };
        gui.add(title, "str");
        //force
        gui.add(this, "resType", ["PNG", "FLOAT16"]).name(`类型`);
        //方法
        gui.add(this, "change").name(`加载替换资源`);
    }

    async change() {
        let { f, type } = this.resTypeFileMap[this.resType];
        if (!f) return;
        this.clearScene();
        this.addCam();
        await this.loadToScene(f, type);
    }

    async loadToScene(fileName: string, type: string) {
        let assetMgr = this.app.getAssetMgr();
        switch (type) {
            case "pfb":
                const pfb = await util.loadModel(assetMgr, fileName);
                const node = pfb.getCloneTrans();
                this.scene.addChild(node);
                break;
            case "scene":
                const _scene = await util.loadScnee(assetMgr, fileName);
                let _root = _scene.getSceneRoot();
                this.scene.addChild(_root);
                this.app.getScene().lightmaps = [];
                _scene.useLightMap(this.app.getScene());
                _scene.useFog(this.app.getScene());
                break;
        }
    }

    clearScene() {
        this.scene.getRoot().removeAllChild();
    }

    update(delta: number) {

    }
}