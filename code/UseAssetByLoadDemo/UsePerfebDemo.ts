//现在我们使用封装好的loadDome类来加载一个 简单的面片prefeb 
class UsePrefebDemo implements IState {//IState 接口是给dome用的接口，为了更方便地看我们dome的效果。该接口与引擎无关
    app: m4m.framework.application;
    assetMgr: m4m.framework.assetMgr;
    scene: m4m.framework.scene;

    start(app: m4m.framework.application) {//接口IState 入口
        this.app = app;
        this.assetMgr = app.getAssetMgr();
        this.scene = app.getScene();

        //#region 在场景中放入一个相机
        let cam: m4m.framework.transform, camera: m4m.framework.camera;
        {
            cam = new m4m.framework.transform();
            cam.name = "looker";
            this.scene.addChild(cam);
            cam.localPosition = new m4m.math.vector3(0, 0, -10);
            //cam.localRotate = new m4m.math.quaternion(0,0,0,1);
            camera = cam.gameObject.addComponent("camera") as m4m.framework.camera;
            camera.far = 100;
            cam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            cam.markDirty();
        }
        //#endregion

        //Dome加载的资源使用的是"res/prefabs/Cube/resources/Cube.prefab.json"
        this.assetMgr.load("res/prefabs/Cube/resources/Cube.prefab.json", m4m.framework.AssetTypeEnum.Prefab, (s) => {
            if(s.isfinish){
                let Cube = (this.assetMgr.getAssetByName("Cube.prefab.json") as m4m.framework.prefab).getCloneTrans();
                this.scene.addChild(Cube);
                Cube.localPosition = new m4m.math.vector3(0, 0, 0);
                Cube.markDirty();
                console.log(Cube);
            }
            
        });
    }

    update(delta: number) {//接口IState 的update方法 detal一般是当前与上次 app中update方法被的时间差

    }
    //运行时我们会发现，并没有看到什么，这是因为我们只加载了prefeb资源 。prefeb资源中并没其他如mesh texture 等资源。如果我们想看到效果必须把其他相关资源一起加载了。
}


//这个Dome是多个有关联的资源一起加载的Dome。通常都是使用bundle包加载
class UsePrefebDemo2 implements IState {
    app: m4m.framework.application;
    assetMgr: m4m.framework.assetMgr;
    scene: m4m.framework.scene;

    start(app: m4m.framework.application) {
        this.app = app;
        this.assetMgr = app.getAssetMgr();
        this.scene = app.getScene();

        //#region 在场景中放入一个相机
        let cam: m4m.framework.transform, camera: m4m.framework.camera;
        {
            cam = new m4m.framework.transform();
            cam.name = "looker";
            this.scene.addChild(cam);
            cam.localPosition = new m4m.math.vector3(0, 0, -10);
            //cam.localRotate = new m4m.math.quaternion(0,0,0,1);
            camera = cam.gameObject.addComponent("camera") as m4m.framework.camera;
            camera.far = 100;
            cam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            cam.markDirty();
        }
        //#endregion

        //所以实际开发中都会把资源打包成bundle包 或 压缩的bundle包进行统一加载。如下：
        this.assetMgr.load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                this.assetMgr.load("res/prefabs/Quad11/Quad.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        let quadPrefab = this.assetMgr.getAssetByName("Quad.prefab.json") as m4m.framework.prefab;
                        let quad = quadPrefab.getCloneTrans();
                        this.scene.addChild(quad);
                        quad.markDirty();
                    }
                });
            }
        });

    }

    update(delta: number) {

    }

}