/** 表面贴花 样例 */
class test_Decal implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    assetMgr: m4m.framework.assetMgr;
    private buildingPname = "Map_Castle_dajiwuA";
    private texName = "EF_decal_yp.png";
    private inited = false;
    async start  (app: m4m.framework.application) {
        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();
        await demoTool.loadbySync(`${resRootPath}shader/shader.assetbundle.json`,this.assetMgr);
        await demoTool.loadbySync(`${resRootPath}texture/${this.texName}`,this.assetMgr);
        await demoTool.loadbySync(`${resRootPath}prefab/${this.buildingPname}/${this.buildingPname}.assetbundle.json`,this.assetMgr);
        await datGui.init();
        this.init();
        this.inited = true; 
        return null;
    }

    private dec  = "点击模型发射贴上弹痕";
    private building : m4m.framework.transform;
    /** 初始化 */
    init(){
        this.initCamera();
        //建筑
        let bPrefb = this.assetMgr.getAssetByName(`${this.buildingPname}.prefab.json` , `${this.buildingPname}.assetbundle.json`) as m4m.framework.prefab;
        let bTrans = bPrefb.getCloneTrans();
        this.building = bTrans;
        let mf = bTrans.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
        m4m.math.vec3SetAll(bTrans.localScale,5);
        this.scene.addChild(bTrans);
        
        //贴花模板
        let templateD = new m4m.framework.transform();
        let mr = templateD.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        mr.materials= [];
        mr.materials[0] = new m4m.framework.material();
        mr.materials[0].setShader(this.assetMgr.getShader("particles_blend.shader.json"));
        mr.materials[0].setTexture("_Main_Tex",this.assetMgr.getAssetByName(this.texName) as m4m.framework.texture);

        //Manager
        let mgr = new m4m.framework.transform ();
        this.scene.addChild(mgr);
        let decal = mgr.gameObject.addComponent("decalCreater") as decalCreater;
        decal.tempTex = mr;
        decal.targetMF = mf;
        decal.camera = this.camera;

         //adtUI
         let gui = new dat.GUI();;
         gui.add( this , 'dec');
    }

    /**
     * 初始化相机
     */
    private initCamera(){
        //相机-----------------------------------
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 50;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new m4m.math.vector3(0,15,-15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30 ;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0)
    }

    private Y_ag = 0; 
    update(delta: number) {
        if(!this.inited) return;
        this.Y_ag += delta * 30;
        m4m.math.quatFromEulerAngles(0,this.Y_ag,0,this.building.localRotate);
        this.building.localRotate = this.building.localRotate;
    }

}