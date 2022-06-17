class test_spine_transition implements IState
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).spineboy);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                this._comp = comp;
                //复杂融合参考官方文档
                //http://zh.esotericsoftware.com/spine-applying-animations#%E9%80%9A%E9%81%93%28Track%29
                //设置默认融合
                comp.animData.defaultMix = 0.2
                //播放一系列动画
                this.setAnimations(comp.state);
                let spineNode = new m4m.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                //GUI
                datGui.init().then(() => this.setGUI())
            })
    }
    private setAnimations(state: spine_m4m.AnimationState)
    {
        state.addAnimation(0, "idle", true, 0);
        state.addAnimation(0, "walk", true, 0);
        state.addAnimation(0, "jump", false, 0);
        state.addAnimation(0, "run", true, 0);
        state.addAnimation(0, "jump", false, 1);
        state.addAnimation(0, "walk", true, 0).listener = {
            start: (trackIndex) =>
            {
                this.setAnimations(state);
            }
        };
    }

    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) =>
        {
            this._comp.state.timeScale = value;
        });
        gui.add(this, 'playDie');
    }

    private playDie = () =>
    {
        this._comp.state.setAnimation(0, "death", false);
        this.setAnimations(this._comp.state);
    }

    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_m4m.spineSkeleton;
}