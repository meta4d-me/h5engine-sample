class test_load implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: any;
    camNode: m4m.framework.transform;
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        let assetMgr = this.app.getAssetMgr();
        assetMgr.load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                let name = "0001_shengyi_male";
                assetMgr.load(`${resRootPath}prefab/${name}/${name}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        let prefab = assetMgr.getAssetByName(name + ".prefab.json", `${name}.assetbundle.json`) as m4m.framework.prefab;
                        let ins = prefab.getCloneTrans();
                        this.scene.addChild(ins);
                        this.camNode.lookat(ins);
                        this.camNode.markDirty();
                    }
                });
            }
        });

        //添加一个摄像机
        let camNode = new m4m.framework.transform();
        this.scene.addChild(camNode);
        this.camera = camNode.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        camNode.localTranslate = new m4m.math.vector3(0, 10, -10);
        this.camNode = camNode;
    }
    update(delta: number)
    {

    }
}