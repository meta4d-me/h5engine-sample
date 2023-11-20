
class test_spine_mesh implements IState
{
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
        let skeletonFile = "demos.json";
        let atlasFile = "atlas2.atlas"
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).orangegirl);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                this._comp = comp;
                comp.state.setAnimation(0, "animation", true);
                let spineNode = new m4m.framework.transform2D;
                spineNode.addComponentDirect(comp);
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;

                root2d.addChild(spineNode);
                //GUI
                datGui.init().then(() => this.setGUI())
            })
    }
    /**
     * 设置GUI
     */
    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) =>
        {
            this._comp.state.timeScale = value;
        });
    }
    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_m4m.spineSkeleton;
}