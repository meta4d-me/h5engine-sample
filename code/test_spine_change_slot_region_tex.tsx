class test_spine_change_slot_region_tex implements IState
{
    assetManager: spine_m4m.SpineAssetMgr;
    private _index = 0;
    start(app: m4m.framework.application)
    {

        let scene = app.getScene();
        //相机
        var objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        //2dUI root
        let root2d = new m4m.framework.overlay2D();
        camera.addOverLay(root2d);
        let assetManager = new spine_m4m.SpineAssetMgr(app.getAssetMgr(), `${resRootPath}spine/`);
        this.assetManager = assetManager;
        let skeletonFile = "demos.json";
        let atlasFile = "atlas1.atlas"
        let animation = "walk";
        Promise.all([
            new Promise<void>((resolve, reject) =>
            {
                assetManager.loadJson(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) =>
            {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() =>
            {
                let atlasLoader = new spine_m4m.AtlasAttachmentLoader(assetManager.get(atlasFile));
                let skeletonJson = new spine_m4m.SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).raptor);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                let spineNode = new m4m.framework.transform2D;
                //可用transform2d缩放等
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                // spineNode.localRotate = 30 * Math.PI / 180;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                //GUI
                datGui.init().then(() => this.setGUI())
            })
    }

    private changeSlot = () =>
    {
        this._index = (this._index + 1) % 2;
        let tex = ["head2.png", "head3.png"][this._index];
        this.assetManager.loadTexture(tex, (path, texture) =>
        {
            this._comp.changeSlotTexture("gun", texture);
        })
    }

    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) =>
        {
            this._comp.state.timeScale = value;
        });
        gui.add(this, "changeSlot")
    }
    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_m4m.spineSkeleton;
}