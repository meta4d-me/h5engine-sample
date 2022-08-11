
/** GPU 实例渲染模式  */
class test_GPU_instancing implements IState {
    private static readonly help_quat: m4m.math.quaternion = new m4m.math.quaternion();
    private _app: m4m.framework.application;
    private _scene: m4m.framework.scene;
    private _mat_ins: m4m.framework.material;
    private createCount = 20000;
    private instanceShBase: m4m.framework.shader;
    private mats: m4m.framework.material[] = [];
    private mrArr: m4m.framework.meshRenderer[] = [];
    private isInstancing = true;
    private cubeRoot: m4m.framework.transform;
    private cam: m4m.framework.camera;
    private modelType: string = "";
    private subRange = 10;
    async start(app: m4m.framework.application) {
        await demoTool.loadbySync(`${resRootPath}shader/shader.assetbundle.json`, app.getAssetMgr());
        // await demoTool.loadbySync(`${resRootPath}shader/customShader/customShader.assetbundle.json`, app.getAssetMgr());  //项目shader
        await datGui.init();
        let scene = this._scene = app.getScene();
        this.cubeRoot = new m4m.framework.transform();
        this.cubeRoot.localTranslate.y = -5;
        scene.addChild(this.cubeRoot);
        this._app = app;
        //initCamera
        let objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
        this.cam = cam;
        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0);

        this.initMaterails();

        //绘制xx  个物体
        this.refresh();

        //
        app.showDrawCall();
        app.showFps();

        //set datui
        let _dat = new dat.GUI();
        _dat.add(this, "modelType", ["", "bullet_11"]);
        _dat.add(this, 'isInstancing').listen();
        _dat.add(this, 'instanceSwitch');
        _dat.add(this, 'batcherSwitch');
        _dat.add(this, 'isStatic').listen();;
        _dat.add(this, 'needUpdate').listen();;
        _dat.add(this, 'needFillRenderer').listen();;
        _dat.add(this, 'createCount');
        _dat.add(this, 'refresh');

        //
        m4m.framework.transform.prototype["checkToTop"] = () => { }; //去掉检查优化
        // app.isFrustumCulling = false;
    }

    private _batcher = false;
    batcherSwitch() {
        this._batcher = !this._batcher;
        if (this._batcher) {
            // this.cubeRoot.parent.removeChild(this.cubeRoot);

            this.mrArr.forEach((mr) => {
                let tran = mr.gameObject.transform;
                tran.needGpuInstancBatcher = true;
            });

            this.needFillRenderer = false;
        } else {
            // this._scene.addChild(this.cubeRoot);
            this.mrArr.forEach((mr) => {
                let tran = mr.gameObject.transform;
                tran.needGpuInstancBatcher = true;
            });

            this.needFillRenderer = true;
        }

        this._scene.refreshGpuInstancBatcher();
    }

    refresh() {
        this.cubeRoot.removeAllChild();
        this.cubeRoot.gameObject.isStatic = this.isStatic;
        this.mrArr.length = 0;
        this.mats.length = 0;

        if (!this.modelType) {
            this.createByNum(this.createCount);
        } else {
            this.loadTest(this.modelType);
        }
    }

    private _isStatic = true;
    get isStatic() { return this._isStatic; }
    set isStatic(v) {
        this._isStatic = v;
        this.cubeRoot.gameObject.isStatic = v;
    }

    private _needUpdate = true;
    get needUpdate() { return this._needUpdate; }
    set needUpdate(v) {
        this._needUpdate = v;
        this.cubeRoot.needUpdate = v;
    }


    private _needFillRenderer = true;
    get needFillRenderer() { return this._needFillRenderer; }
    set needFillRenderer(v) {
        this._needFillRenderer = v;
        this.cubeRoot.needFillRenderer = v;
    }


    private loadedTest = false;
    async loadTest(modelName: string) {
        let url = `${resRootPath}prefab/${modelName}/${modelName}.assetbundle.json`;
        if (!this.loadedTest)
            await demoTool.loadbySync(url, this._app.getAssetMgr());
        this.loadedTest = true;

        let m = this._app.getAssetMgr().getAssetByName(`${modelName}.prefab.json`, `${modelName}.assetbundle.json`) as m4m.framework.prefab;
        let count = this.createCount;
        let range = this.subRange;
        for (let i = 0; i < count; i++) {
            let tran = m.getCloneTrans();
            this.cubeRoot.addChild(tran);
            m4m.math.vec3Set(tran.localTranslate, Math.random() * range, Math.random() * range, Math.random() * range);
            tran.localTranslate = tran.localTranslate;
            if (this.isInstancing) {
                gpuInstanceMgr.setToGupInstance(tran, url, this.mats);
            }
            let mrs = tran.gameObject.getComponentsInChildren("meshRenderer") as m4m.framework.meshRenderer[];
            mrs.forEach((v) => {
                this.mrArr.push(v);
                // v.gameObject.transform.enableCulling = false;
            });
        }
    }

    createByNum(num: number) {
        if (num < 1) num = 1;
        let count = 0;
        while (count < num) {
            this.createOne(this._app, this.isInstancing);
            count++;
        }
    }

    instanceSwitch() {
        this.isInstancing = !this.isInstancing;
        this.mats.forEach((v) => {
            v.enableGpuInstancing = this.isInstancing;
        });
    }

    initMaterails() {
        this._mat_ins = new m4m.framework.material("GPU_Instancing");
        this.instanceShBase = this._app.getAssetMgr().getShader("demo_gpu_instancing.shader.json");
        this._mat_ins.setShader(this.instanceShBase);
    }

    private count = 0;
    createOne(app, needInstance: boolean) {
        let obj = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube, app);
        obj.gameObject.transform.enableCulling = false;
        obj.name = `cube_${++this.count}`;
        this.cubeRoot.addChild(obj);
        let range = this.subRange;
        let scaleRange = 1;
        let rotRnage = 180;
        //位置
        m4m.math.vec3Set(obj.localPosition, this.getRandom(range), this.getRandom(range), this.getRandom(range));
        //缩放
        let s = this.getRandom(scaleRange) + 0.5;
        m4m.math.vec3Set(obj.localScale, s, s, s);
        //旋转
        m4m.math.quatFromEulerAngles(this.getRandom(rotRnage), this.getRandom(rotRnage), this.getRandom(rotRnage), obj.localRotate);

        //change materail
        let mr = obj.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        let mat = this._mat_ins;
        mr.materials[0] = mat.clone();
        mr.materials[0].enableGpuInstancing = needInstance;
        mr.materials[0].setVector4("a_particle_color", new m4m.math.vector4(Math.random(), Math.random(), Math.random(), 1));
        this.mats.push(mr.materials[0]);
        this.mrArr.push(mr);
    }

    private lookAtCamera(trans: m4m.framework.transform) {
        if (!this.cam) return;
        //朝向玩家
        let camPos = this.cam.gameObject.transform.localPosition;
        let tempQuat = test_GPU_instancing.help_quat;
        // m4m.math.quatLookat(trans.getWorldPosition(), camPos,tempQuat);
        m4m.math.quat2Lookat(trans.getWorldPosition(), camPos, tempQuat);
        trans.setWorldRotate(tempQuat);
    }

    private getRandom(range: number) {
        return range * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    }

    update(delta: number) {

    }
}

type batcherStrct = { pass: m4m.render.glDrawPass, darr: m4m.math.ExtenArray<Float32Array>, renderers: m4m.math.ReuseArray<m4m.framework.IRendererGpuIns> };
class gpuInstanceMgr {
    private static SetedMap: { [resUrl: string]: boolean } = {}
    /**
     * 设置材质渲染到 gupInstance
     * @param tran   需要设置的对象
     * @param resUrl 资源的URL （去重操作）
     */
    static setToGupInstance(tran: m4m.framework.transform, resUrl?: string, mats?: m4m.framework.material[]) {
        if (this.SetedMap[resUrl] || !tran) return;
        if (resUrl) this.SetedMap[resUrl] = true;
        let mrs = tran.gameObject.getComponentsInChildren("meshRenderer") as m4m.framework.meshRenderer[];
        for (let i = 0, len = mrs.length; i < len; i++) {
            let mr = mrs[i];
            for (let j = 0, len_1 = mr.materials.length; j < len_1; j++) {
                let mat = mr.materials[j];
                let canUseGpuIns = this.ckCanUseGpuInstance(mat);
                if (!canUseGpuIns) continue;
                mat.enableGpuInstancing = true;
                this.fillParameters(mat);
                if (mats) {
                    mats.push(mat);
                }
            }
        }
    }

    private static fillParameters(mat: m4m.framework.material) {
        let staMap = mat.statedMapUniforms;
        for (let key in staMap) {
            let val = staMap[key];
            if (typeof (val) == "number") {
                mat.setFloat(key, val);
                continue;
            }
            if (val instanceof m4m.math.vector4) {
                mat.setVector4(key, val);
                continue;
            }
        }
    }

    private static ckCanUseGpuInstance(mat: m4m.framework.material) {
        if (!mat) return false;
        let sh = mat.getShader();
        if (!sh) return false;
        if (!sh.passes["instance"] && !sh.passes["instance_fog"]) {
            console.warn(`shader ${sh.getName()} , 没有 instance 通道, 无法使用 gupInstance 功能.`);
            return false;
        }
        return true;
    }

}

