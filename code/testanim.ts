class test_anim implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        let assetMgr = this.app.getAssetMgr();
        //添加一个摄像机
        var camNode = new m4m.framework.transform();
        this.scene.addChild(camNode);
        this.camera = camNode.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        camNode.localTranslate = new m4m.math.vector3(0, 10, -10);

        util.loadShader(assetMgr)
            .then(() =>
            {
                let prefabName = "PF_PlayerSharkReef";
                assetMgr.load(`${resRootPath}prefab/${prefabName}/${prefabName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        let prefab = assetMgr.getAssetByName(prefabName + ".prefab.json", `${prefabName}.assetbundle.json`) as m4m.framework.prefab;
                        let ins = prefab.getCloneTrans();
                        this.scene.addChild(ins);
                        camNode.lookat(ins);
                        camNode.markDirty();

                        var aps = ins.gameObject.getComponentsInChildren("aniplayer") as m4m.framework.aniplayer[];
                        var ap = aps[0];
                        let resPath = `${resRootPath}prefab/${prefabName}/resources`;
                        let list = ap.awaitLoadClipNames();
                        Promise.all(list.map(item => new Promise<void>((resolve, reject) =>
                        {
                            ap.addClipByNameLoad(assetMgr, resPath, item, () => resolve())
                        })))
                            .then(() =>
                            {
                                if(list.length > 0){
                                    ap.play(list[0]);
                                }
                                document.onkeydown = (ev) =>
                                {
                                    ap.play(list[Math.floor(Math.random() * list.length)]);
                                }
                            })
                    }
                });
            })
    }
    camera: m4m.framework.camera;
    update(delta: number)
    {

    }
}