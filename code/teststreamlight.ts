class test_streamlight implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    player: m4m.framework.transform;
    cubes: { [id: string]: m4m.framework.transform } = {};
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        var baihu = new m4m.framework.transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;

        this.scene.addChild(baihu);
        {
            var lighttran = new m4m.framework.transform();
            this.scene.addChild(lighttran);
            var light = lighttran.gameObject.addComponent("light") as m4m.framework.light;
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();

        }
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/prefabs/streamlight/anim/0001_shengyi_male.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName("0001_shengyi_male.prefab.json") as m4m.framework.prefab;
                        baihu = _prefab.getCloneTrans();
                        this.player = baihu;
                        this.scene.addChild(baihu);
                        objCam.lookat(baihu);
                        objCam.markDirty();

                        let bb = _prefab.getCloneTrans();
                        this.scene.addChild(bb);
                        bb.localTranslate = new m4m.math.vector3(2,0,0);
                        bb.markDirty();

                        let bodyRenderer = (bb.children[0].gameObject.getComponent("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer);
                        let mat = bodyRenderer.materials[0].clone();
                        bodyRenderer.materials[0] = mat;

                        mat.setVector4("_LightTex_ST",new m4m.math.vector4(2,2,0,0));
                        console.log("aaa");
                    }
                });
            }
        });
        this.cube = baihu;

        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();//标记为需要刷新


    }

    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 1.1);
        var z2 = Math.cos(this.timer * 1.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new m4m.math.vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();//标记为需要刷新
        objCam.updateWorldTran();
    }
}