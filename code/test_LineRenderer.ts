/// <reference path="../lib/dat.gui.d.ts" />

/** 
 * 线条渲染组件示例
 */
class test_LineRenderer implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;

    lr: m4m.framework.LineRenderer

    loop = false;
    viewcamera = false;

    async start(app: m4m.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        m4m.framework.assetMgr.openGuid = false;

        await datGui.init();

        //
        this.setGUI();
        //
        this.init();
    }

    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'loop');
        gui.add(this, 'viewcamera');
    }

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

        // this._showParticle(this._particles[0]);
        this.initLineRenderer();
    }

    private initLineRenderer()
    {
        let tran = new m4m.framework.transform();
        tran.name = "LineRenderer";
        this.scene.addChild(tran);

        //
        let lr = tran.gameObject.getComponent("LineRenderer") as m4m.framework.LineRenderer;
        if (!lr) lr = tran.gameObject.addComponent("LineRenderer") as any;
        //
        this.lr = lr;
        //
        lr.positions = [new m4m.math.vector3(0, 0, 0), new m4m.math.vector3(1, 0, 0), new m4m.math.vector3(0, 1, 0),];
    }

    private async _showParticle(res: string)
    {
    }

    update(delta: number)
    {
        if (this.lr)
        {
            this.lr.loop = this.loop;
            this.lr.alignment = this.viewcamera ? m4m.framework.LineAlignment.View : m4m.framework.LineAlignment.TransformZ;
        }
    }
}