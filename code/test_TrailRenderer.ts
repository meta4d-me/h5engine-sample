/// <reference path="../lib/dat.gui.d.ts" />

/** 
 * 拖尾渲染组件示例
 */
class test_TrailRenderer implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;

    lr: m4m.framework.TrailRenderer

    move = true;
    viewcamera = false;

    res = "Trail_SpeedLines";

    async start(app: m4m.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        m4m.framework.assetMgr.openGuid = false;

        await demoTool.loadbySync(`${resRootPath}shader/shader.assetbundle.json`, this.astMgr);
        await datGui.init();

        //
        this.setGUI();
        //
        this.init();
    }

    /**
     * 设置 GUI 控件
     */
    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'move');
        gui.add(this, 'viewcamera');
    }

    /**
     * 初始化函数
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
        //
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 10;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0)

        // this.initLineRenderer();
        this.loadRes(this.res);
    }

    /**
     * 初始化 LineRenderer
     */
    private initLineRenderer()
    {
        let tran = new m4m.framework.transform();
        tran.name = "TrailRenderer";
        this.scene.addChild(tran);

        //
        let lr = tran.gameObject.getComponent("TrailRenderer") as m4m.framework.TrailRenderer;
        if (!lr) lr = tran.gameObject.addComponent("trailrenderer") as any;
        //
        this.lr = lr;
    }

    /**
     * 加载资源
     * @param res 资源名称
     */
    private async loadRes(res: string)
    {
        if (this.lr)
        {
            this.scene.removeChild(this.lr.transform);
            this.lr = null;
        }

        await demoTool.loadbySync(`${resRootPath}prefab/${res}/${res}.assetbundle.json`, this.astMgr);

        let cubeP = this.astMgr.getAssetByName(`${res}.prefab.json`, `${res}.assetbundle.json`) as m4m.framework.prefab;
        let cubeTran = cubeP.getCloneTrans();

        this.lr = cubeTran.gameObject.getComponent("TrailRenderer") as m4m.framework.TrailRenderer;

        this.scene.addChild(cubeTran);

        this._particleStartPosition = new m4m.math.vector3();
        m4m.math.vec3Clone(cubeTran.localPosition, this._particleStartPosition);
    }

    private _particleStartPosition = new m4m.math.vector3();
    private _particleCurrentPosition = new m4m.math.vector3();
    private _moveRadius = 5;
    private _moveAngle = 0;
    private _moveAngleSpeed = 5;

    update(delta: number)
    {
        if (this.lr)
        {
            if (this.move)
            {
                var offsetX = Math.cos(this._moveAngle / 180 * Math.PI) * this._moveRadius;
                var offsetY = (this._moveAngle % 3600) / 3600 * this._moveRadius;
                var offsetZ = Math.sin(this._moveAngle / 180 * Math.PI) * this._moveRadius;

                this._particleCurrentPosition.x = this._particleStartPosition.x + offsetX;
                this._particleCurrentPosition.y = this._particleStartPosition.y + offsetY;
                this._particleCurrentPosition.z = this._particleStartPosition.z + offsetZ;

                this.lr.transform.localPosition = this._particleCurrentPosition;

                this._moveAngle += this._moveAngleSpeed;
            }
            this.lr.alignment = this.viewcamera ? m4m.framework.LineAlignment.View : m4m.framework.LineAlignment.TransformZ;
        }
    }
}