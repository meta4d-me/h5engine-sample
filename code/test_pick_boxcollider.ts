/** 射线碰撞 碰撞体 */
class test_pick_boxcollider implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    navmeshMgr: m4m.framework.NavMeshLoadManager;
    inputMgr: m4m.framework.inputMgr;
    assetMgr: m4m.framework.assetMgr;
    cubesize = 0.5;
    player: m4m.framework.transform;
    goals = [];
    mods: m4m.framework.transform[] = [];
    astMgr: m4m.framework.assetMgr;
    start(app: m4m.framework.application)
    {
        this.astMgr = app.getAssetMgr();

        m4m.framework.assetMgr.openGuid = false;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.inputMgr = this.app.getInputMgr();
        this.assetMgr = app.getAssetMgr();
        this.app.closeFps();
        //说明
        var descr = document.createElement("p");
        descr.textContent = `提示: \n 点击碰撞框 可发射小球到碰撞位置！`;
        descr.style.top = 0 + "px";
        descr.style.left = 0 + "px";
        descr.style.position = "absolute";
        this.app.container.appendChild(descr);

        let names: string[] = ["MainCity_", "testnav", "city", "1042_pata_shenyuan_01", "1030_huodongchuangguan", "xinshoucun_fuben_day", "chuangjue-01"];
        let name = names[1];
        demoTool.loadbySync(`${resRootPath}shader/MainShader.assetbundle.json`, this.astMgr).then(() =>
        {
            this.loadScene(name);
        });

        // this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
        // {
        //     if (state.isfinish)
        //     {
        //     }
        // });

        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.far = 10000;
        objCam.localTranslate = new m4m.math.vector3(0, 100, 0);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        objCam.markDirty();//标记为需要刷新
        //相机控制
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 60;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0);

        // CameraController.instance().init(this.app, this.camera);

        //light
        let lObj = new m4m.framework.transform();
        m4m.math.quatFromEulerAngles(0,45,60,lObj.localRotate);
        let l = lObj.gameObject.addComponent("light") as m4m.framework.light;
        this.scene.addChild(lObj);

        l.type = m4m.framework.LightTypeEnum.Direction;
        
    }
    private loadScene(assetName: string, isCompress = false)
    {
        let ShowBoxcollder = (trans: m4m.framework.transform) =>
        {
            if (!trans) return;
            let boxc = trans.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
            if (boxc) boxc.colliderVisible = true;
            //test
            let meshC = trans.gameObject.getComponent("meshcollider") as m4m.framework.meshcollider;
            if (meshC)
            {
                meshC.colliderVisible = true;
            }

            console.error(` layer : ${trans.gameObject.layer} `);
            if (!trans.children) return;
            trans.children.forEach(sub =>
            {
                if (sub) ShowBoxcollder(sub);
            });
        }

        let addScene = () =>
        {
            let beAddScene = true;
            if (beAddScene)
            {
                var _scene: m4m.framework.rawscene = this.app.getAssetMgr().getAssetByName(assetName + ".scene.json", `${assetName}.assetbundle.json`) as m4m.framework.rawscene;
                var _root = _scene.getSceneRoot();
                _root.localEulerAngles = new m4m.math.vector3(0, 0, 0);
                _root.markDirty();
                this.app.getScene().lightmaps = [];
                _scene.useLightMap(this.app.getScene());
                // _scene.useFog(this.app.getScene());
                this.scene.addChild(_root);
                ShowBoxcollder(_root);
            }
        }


        this.app.getAssetMgr().load(`${resRootPath}prefab/${assetName}/${assetName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s1) =>
        {
            if (s1.isfinish)
            {
                addScene();
            }
        });
    }

    private colorMap: { [key: string]: m4m.math.vector4 } = {};
    private getColor(r, g, b)
    {
        let key = `${r}_${g}_${b}`;
        if (!this.colorMap[key]) this.colorMap[key] = new m4m.math.vector4(r, g, b, 1);
        return this.colorMap[key];
    }

    private balls = [];
    private addBall(pos: m4m.math.vector3)
    {
        let ball = this.generateGeomtry("sphere", this.getColor(1, 0, 0));
        m4m.math.vec3Clone(pos, ball.localTranslate);
        this.scene.addChild(ball);
        this.balls.push(ball);
        ball.markDirty();
    }

    private pickLayer = 8;
    pickDown(): void
    {
        let v3 = this.rayCollider();
        if (v3)
        {
            this.addBall(v3.hitposition);
        }
    }
    private rayCollider(): m4m.framework.pickinfo
    {
        let inputMgr = this.app.getInputMgr();
        let ray = this.camera.creatRayByScreen(new m4m.math.vector2(inputMgr.point.x, inputMgr.point.y), this.app);
        let temp = m4m.math.pool.new_pickInfo();
        //let bool = this.scene.pick(ray,temp,false,this.scene.getRoot(),this.pickLayer);
        let tranRoot = this.scene.getRoot();
        let mask = m4m.framework.cullingmaskutil.layerToMask(this.pickLayer);
        let bool = this.scene.pick(ray, temp, false,tranRoot,mask);
        return bool ? temp : null;
    }
    //----------- 绘制路径线段----------------
    private points: m4m.framework.transform[] = [];
    private generateGeomtry(meshType: string = "cube", color: m4m.math.vector4 = null)
    {
        let G3D = new m4m.framework.transform;
        let mf = G3D.gameObject.addComponent(`meshFilter`) as m4m.framework.meshFilter;
        mf.mesh = (this.assetMgr.getDefaultMesh(meshType) as m4m.framework.mesh);
        let mr = G3D.gameObject.addComponent(`meshRenderer`) as m4m.framework.meshRenderer;
        mr.materials = [];
        mr.materials[0] = new m4m.framework.material(`mat`);
        //mr.materials[0].setShader(this.assetMgr.getShader("shader/def"));
        mr.materials[0].setShader(this.assetMgr.getShader("diffuse.shader.json"));
        mr.materials[0].setTexture("_MainTex", this.assetMgr.getDefaultTexture("white"));
        if (color)
            mr.materials[0].setVector4("_MainColor", color);
        this.scene.addChild(G3D);
        return G3D;
    }

    camera: m4m.framework.camera;
    timer: number = 0;
    bere: boolean = false;
    isAKeyDown = false;
    private pointDown = false;
    update(delta: number)
    {

        if (this.pointDown == false && this.inputMgr.point.touch == true)//pointdown
        {
            this.pickDown();
        }
        this.pointDown = this.inputMgr.point.touch;
        if (this.inputMgr.GetKeyDown(65))
        {
            this.isAKeyDown = true;
        } else
        {
            this.isAKeyDown = false;
        }

        this.timer += delta;
        // CameraController.instance().update(delta);
    }
}