/** GPU 压缩纹理测试 */
class test_CompressTexture implements IState {
    private texType = `PNG`;
    private texTypeFileMap = {
        PNG: `${resRootPath}texture/Scene02_shiwu_01.png`,
        ASTC: `${resRootPath}texture/Scene02_shiwu_01_5x5.astc`,
        PVR: `${resRootPath}texture/Scene02_shiwu_01.pvr`,
        S3TC: `${resRootPath}texture/Scene02_shiwu_01.dds`,
        ETC: `${resRootPath}texture/Scene02_shiwu_01.ktx`,
    };
    private app: m4m.framework.application;
    private model: m4m.framework.meshRenderer;
    async start(app: m4m.framework.application) {
        this.app = app;
        await datGui.init();
        await util.loadShader(app.getAssetMgr());
        let scene = m4m.framework.sceneMgr.scene;

        //相机-----------------------------------
        let objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.near = 0.01;
        camera.far = 120;
        camera.fov = Math.PI * 0.3;
        camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        let hoverc = camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 10;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0)

        //模型
        this.model = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube).gameObject.renderer as any;
        this.model.materials[0].setShader(app.getAssetMgr().getShader(`simple.shader.json`));
        //
        scene.addChild(this.model.gameObject.transform);

        //GUI
        this.setGUI();
    }

    /**
     * 设置 调试GUI 
     */
    private setGUI() {
        if (!dat) return;
        let gui = new dat.GUI();
        let title = { str: "GPU压缩纹理" };
        gui.add(title, "str");
        //force
        gui.add(this, "texType", ["PNG", "ASTC", "PVR", "S3TC", "ETC"]).name(`纹理类型`);
        //方法
        gui.add(this, "changeTexture").name(`加载替换纹理`);
    }

    /**
     * 改变纹理
     */
    private async changeTexture() {
        let file = this.texTypeFileMap[this.texType];
        if (!file) return;
        let tex: m4m.framework.texture = await util.loadTex(file, this.app.getAssetMgr()) as m4m.framework.texture;
        //
        let mat = this.model.materials[0];
        mat.setTexture(`_MainTex`, tex);
    }

    update(delta: number) {

    }

}