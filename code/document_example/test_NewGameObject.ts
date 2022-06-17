class test_NewGameObject implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;

    cube: m4m.framework.transform;

    camera: m4m.framework.camera;


    start(app: m4m.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();

        {
            //添加一个Cube
            var cube = new m4m.framework.transform();
            cube.name = "Cube1";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 2;

            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            mesh.mesh = (this.app.getAssetMgr()).getDefaultMesh("cube");
            cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            cube.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
            this.cube = cube;
            cube.markDirty();
        }
        {
            //为cube添加一个子物体 sphere
            var sphere = new m4m.framework.transform();
            sphere.name = "Cube's child";
            cube.addChild(sphere);
            sphere.localScale.x = sphere.localScale.y = sphere.localScale.z = 1;
            sphere.localTranslate.x = 2;
            var mesh = sphere.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            mesh.mesh = this.app.getAssetMgr().getDefaultMesh("sphere");
            sphere.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            sphere.markDirty();
        }
        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "camera";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
        objCam.lookat(this.cube);
        objCam.markDirty();//标记为需要刷新
    }


    update(delta: number)
    {
    }
}