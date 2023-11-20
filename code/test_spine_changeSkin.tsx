
class test_spine_changeSkin implements IState
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
        let atlasFile = "heroes.atlas"
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).heroes);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置皮肤
                comp.skeleton.setSkinByName("Assassin")
                comp.state.setAnimation(0, "run", true);
                let spineNode = new m4m.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                //GUI
                datGui.init().then(() => this.setGUI())
            })
    }

    /**
     * 设置GUI
     * @returns 
     */
    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) =>
        {
            this._comp.state.timeScale = value;
        });

        gui.add(this, "randomSkin")
        gui.add(this, "randomGroupSkin")
    }

    /**
     * 随机SKin
     */
    private randomSkin = () =>
    {
        let skeleton = this._comp.skeleton;
        let randomIndex = Math.floor(Math.random() * (skeleton.data.skins.length - 1));
        let skin = skeleton.data.skins[randomIndex]
        this._comp.skeleton.setSkin(skin);
        this._comp.skeleton.setSlotsToSetupPose();
    }

    /**
     * 随机组Skin
     */
    private randomGroupSkin = () =>
    {
        let skeleton = this._comp.skeleton;
        var skins: spine_m4m.Skin[] = [];
        for (var indx in skeleton.data.skins)
        {
            let skin = skeleton.data.skins[indx];
            if (skin.name === "default") continue;
            skins.push(skin);
        }

        //组装skin
        var newSkin = new spine_m4m.Skin("random-skin");
        for (var slotIndex = 0; slotIndex < skeleton.slots.length; slotIndex++)
        {
            var skin = skins[(Math.random() * skins.length - 1) | 0];
            var attachments = skin.attachments[slotIndex];
            for (var attachmentName in attachments)
            {
                newSkin.setAttachment(slotIndex, attachmentName, attachments[attachmentName]);
            }
        }
        this._comp.skeleton.setSkin(newSkin);
        this._comp.skeleton.setSlotsToSetupPose();
    }

    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_m4m.spineSkeleton;
}