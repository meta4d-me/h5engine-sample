class test_texuv implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new m4m.math.vector3(0, 0, 0);

        util.loadShader(this.app.getAssetMgr())
            .then(() => util.loadTex(`${resRootPath}texture/trailtest_yellow.png`, this.app.getAssetMgr()))
            .then(() => {
                let base = this.createBaseCube();
                base.localTranslate.x = -1;
                base.markDirty();

                let uv = this.createUvCube();
                uv.localPosition.x = 1;
                uv.markDirty();

            })

        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        //this.camera.backgroundColor=new m4m.math.color(0,0,0,1);
        objCam.localTranslate = new m4m.math.vector3(0, 2, 5);
        objCam.lookatPoint(new m4m.math.vector3());
        objCam.markDirty();//标记为需要刷新
    }

    /**
     * 创建基础 cube模型
     * @returns 
     */
    private createBaseCube() {
        var mat = new m4m.framework.material();
        var shader = m4m.framework.sceneMgr.app.getAssetMgr().getShader("diffuse.shader.json");
        mat.setShader(shader);
        var tex = m4m.framework.sceneMgr.app.getAssetMgr().getAssetByName("trailtest_yellow.png") as m4m.framework.texture;
        mat.setTexture("_MainTex", tex);

        var trans = new m4m.framework.transform();
        var meshf = trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHFILTER) as m4m.framework.meshFilter;
        var meshr = trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHRENDER) as m4m.framework.meshRenderer;
        meshr.materials = [];
        meshr.materials.push(mat);
        var mesh = m4m.framework.sceneMgr.app.getAssetMgr().getDefaultMesh("cube");
        meshf.mesh = mesh;

        this.scene.addChild(trans);
        return trans;
    }

    /**
     * 创建UVcube
     * @returns 
     */
    private createUvCube() {
        var mat = new m4m.framework.material();
        var shader = m4m.framework.sceneMgr.app.getAssetMgr().getShader("testtexuv.shader.json");
        mat.setShader(shader);
        var tex = m4m.framework.sceneMgr.app.getAssetMgr().getAssetByName("trailtest_yellow.png") as m4m.framework.texture;
        mat.setTexture("_MainTex", tex);

        var trans = new m4m.framework.transform();
        var meshf = trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHFILTER) as m4m.framework.meshFilter;
        var meshr = trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHRENDER) as m4m.framework.meshRenderer;
        meshr.materials = [];
        meshr.materials.push(mat);
        var mesh = m4m.framework.sceneMgr.app.getAssetMgr().getDefaultMesh("cube");
        meshf.mesh = mesh;

        this.scene.addChild(trans);
        return trans;
    }


    camera: m4m.framework.camera;
    baihu: m4m.framework.transform;
    timer: number = 0;
    update(delta: number) {

    }
}