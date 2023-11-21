
/** 3d物理 demo 工具 */
class physics3dDemoTool {
    static app: m4m.framework.application;
    static scene: m4m.framework.scene;
    static camera: m4m.framework.camera;
    static astMgr: m4m.framework.assetMgr;
    static iptMgr: m4m.framework.inputMgr;
    static mats: { [name: string]: m4m.framework.material } = {};
    /**
     * 初始化
     * @param app 引擎app
     */
    static async init(app: m4m.framework.application) {
        m4m.framework.assetMgr.openGuid = false;
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();
        this.iptMgr = this.app.getInputMgr();
        await demoTool.loadbySync(`${resRootPath}shader/shader.assetbundle.json`, this.astMgr);
        await datGui.init();
        this.initMats();
        this.initCamera();
    }

    // static loadbySync(url:string){
    //     return new m4m.threading.gdPromise<any>((resolve,reject)=>{
    //         this.astMgr.load(url,m4m.framework.AssetTypeEnum.Auto,(state)=>{
    //             if(state && state.isfinish){
    //                 resolve();
    //             }
    //         });
    //     });
    // }
    /**
     * 初始化所有材质
     */
    private static initMats() {
        //地板
        this.addMat("white", new m4m.math.vector4(1, 1, 1, 1));

        this.addMat("uvTest", new m4m.math.vector4(1, 1, 1, 1));
        //激活状态
        this.addMat("activated", new m4m.math.vector4(0.51, 0.39, 0.96, 1));
        //yellow
        this.addMat("yellow", new m4m.math.vector4(0.8, 0.8, 0, 1));
        //休眠状态
        this.addMat("sleeping", new m4m.math.vector4(0.4, 0.4, 0.4, 1));
        //purple
        this.addMat("purple", new m4m.math.vector4(0.8, 0, 0.8, 1));
    }

    /**
     * 初始化相机
     */
    private static initCamera() {
        //相机-----------------------------------
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 120;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0)

        ////光;
        let light = new m4m.framework.transform();
        light.localRotate;
        m4m.math.quatFromEulerAngles(45, 10, 0, light.localRotate);
        light.name = "light";
        let lComp = light.gameObject.addComponent("light") as m4m.framework.light;
        lComp.type = m4m.framework.LightTypeEnum.Direction;
        this.scene.addChild(light);
    }

    /**
     * 添加材质
     * @param name 名
     * @param color 颜色
     */
    private static addMat(name: string, color: m4m.math.vector4) {
        let mat = this.mats[name] = new m4m.framework.material(name);
        mat.setShader(this.astMgr.getShader("diffuse.shader.json"));
        mat.setVector4("_MainColor", color);
        if (name == "uvTest") {
            //
            let url = `${resRootPath}texture/uvTest.jpg`;
            this.astMgr.load(url, m4m.framework.AssetTypeEnum.Texture, (sta) => {
                if (sta.isfinish) {
                    let t = this.astMgr.getAssetByName("uvTest.jpg") as m4m.framework.texture;
                    mat.setTexture("_MainTex", t);
                }
            });
        }
    }

    private static tag_isCompound = "__isCompound";
    private static tag_pos = "__reCachePos";
    private static tag_Rot = "__reCacheRot";
    private static tag_resFun = "__reCacheResFun";
    /**
     * 附加到mesh上
     * @param tran 节点
     * @param mat 材质
     * @param meshName mesh名
     * @param isCompound 是复合模式？
     * @returns mesh渲染器
     */
    static attachMesh(tran: m4m.framework.transform, mat: m4m.framework.material, meshName: string, isCompound = false): m4m.framework.meshRenderer {
        let mf = tran.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
        if (!mf) mf = tran.gameObject.addComponent("meshFilter") as any;
        let mr = tran.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        if (!mr) mr = tran.gameObject.addComponent("meshRenderer") as any;
        mr.materials[0] = mat;
        mf.mesh = this.astMgr.getDefaultMesh(meshName);

        if (isCompound && tran.parent) {
            tran = tran.parent;
            tran[this.tag_isCompound] = true;
        }
        if (tran[this.tag_resFun]) return;

        //RT cache
        tran[this.tag_pos] = m4m.math.pool.clone_vector3(tran.getWorldPosition());
        tran[this.tag_Rot] = m4m.math.pool.clone_quaternion(tran.getWorldRotate());
        tran[this.tag_resFun] = () => {
            //有物理 代理
            let phy = tran.physicsImpostor;
            if (phy) { //速度清理
                let lv = phy.physicsBody.linearVelocity;
                let gv = phy.physicsBody.angularVelocity;
                lv.x = lv.y = lv.z = gv.x = gv.y = gv.z = 0;
            }
            tran.setWorldPosition(tran[this.tag_pos]);
            tran.setWorldRotate(tran[this.tag_Rot]);
        }
        return mr;
    }

    /**
     * 重置 复位
     * @param mrs 所有渲染器节点
     */
    static resetObj(mrs: m4m.framework.meshRenderer[]) {
        mrs.forEach(mr => {
            if (mr) {
                let tran = mr.gameObject.transform;
                if (tran[this.tag_resFun])
                    tran[this.tag_resFun]();
            }
        });
    }

    private static lastsleepTag = "_lastsleep_";
    /**
     * 检查物理体 是否睡眠
     * @param mrs 所有渲染器
     */
    static ckBodySleeped(mrs: m4m.framework.meshRenderer[]) {
        mrs.forEach(mr => {
            if (mr && mr.gameObject.transform.physicsImpostor) {
                let tran = mr.gameObject.transform;
                let phy = tran.physicsImpostor;
                if (phy[this.lastsleepTag] == null || phy[this.lastsleepTag] != phy.isSleeping) {
                    this.cgDefMat(mr, phy.isSleeping);
                    if (mr.gameObject.transform[this.tag_isCompound]) {
                        mr.gameObject.transform.children.forEach(sub => {
                            let smr = sub.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
                            this.cgDefMat(smr, phy.isSleeping);
                        });
                    }
                }
                phy[this.lastsleepTag] = phy.isSleeping;
            }
        });
    }

    private static defMatTag = "_defMat_";
    /**
     * 改变默认材质
     * @param mr 渲染器
     * @param isSleeping 是睡眠了？ 
     */
    private static cgDefMat(mr: m4m.framework.meshRenderer, isSleeping: boolean) {
        if (!mr) return;
        let tran = mr.gameObject.transform;
        if (!tran[this.defMatTag]) {
            tran[this.defMatTag] = mr.materials[0];
        }
        let mat = isSleeping ? physics3dDemoTool.mats["sleeping"] : tran[this.defMatTag];
        mr.materials[0] = mat;
    }

}