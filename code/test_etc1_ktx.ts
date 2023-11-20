/** 
 * 粒子系統示例
 */
class test_ETC1_KTX implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;

    private transform: m4m.framework.transform;

    async start(app: m4m.framework.application)
    {
        var ext = app.webgl.getExtension('WEBGL_compressed_texture_etc1');
        if (!ext)
        {
            alert(`需要使用Android平台才能运行！`)
            // return;
        }

        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        m4m.framework.assetMgr.openGuid = false;

        // await demoTool.loadbySync(`res_etc1/shader/shader.assetbundle.json`, this.astMgr);
        // await demoTool.loadbySync(`${resRootPath}shader/shader.assetbundle.json`, this.astMgr);
        await demoTool.loadbySync(`res_etc1/etc1_shader/shader.assetbundle.json`, this.astMgr);
        //
        this.init();
    }

    /**
     * 初始化
     */
    private init()
    {
        //相机-----------------------------------
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 1000;
        this.camera.fov = Math.PI * 2 / 3;
        this.camera.backgroundColor = new m4m.math.color(0.2784, 0.2784, 0.2784, 1);
        objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));

        this.loadPrefabs();
    }

    /**
     * 加载所有预制体
     */
    private async loadPrefabs()
    {
        var res = "test_ktx";

        await demoTool.loadbySync(`res/prefabs/${res}/${res}.assetbundle.json`, this.astMgr);

        let cubeP = this.astMgr.getAssetByName(`${res}.prefab.json`, `${res}.assetbundle.json`) as m4m.framework.prefab;
        let cubeTran = this.transform = cubeP.getCloneTrans();

        cubeTran.localPosition.x = 0;
        cubeTran.localPosition.y = 0;
        cubeTran.localPosition.z = 0;

        cubeTran.localScale.x = 8;
        cubeTran.localScale.y = 8;
        cubeTran.localScale.z = 8;

        this.scene.addChild(cubeTran);
    }

    ry = 0;

    update(delta: number)
    {
        if (!this.transform) return;

        //圆柱朝向
        m4m.math.quatFromEulerAngles(0, this.ry, 0, this.transform.localRotate);

        this.ry++;
    }
}