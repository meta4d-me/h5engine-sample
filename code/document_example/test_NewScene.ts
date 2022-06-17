class test_NewScene implements IState
{
    app:m4m.framework.application;
    scene:m4m.framework.scene;
    camera:m4m.framework.camera;

    start(app:m4m.framework.application)
    {
         this.app=app;
         this.scene=this.app.getScene();

        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "camera";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
        objCam.markDirty();//标记为需要刷新
   }

    update(delta:number)
    {
    }
}