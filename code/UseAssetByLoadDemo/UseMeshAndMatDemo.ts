//加载并使用mesh和材质资源
class UseMeshAndMatDemo implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    taskMgr: m4m.framework.taskMgr = new m4m.framework.taskMgr;
    
    //加载一个mesh
    private loadMesh(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`res/prefabs/Cube/resources/Library_unity_default_resources_Cube.mesh.bin`, m4m.framework.AssetTypeEnum.Mesh, (s) => {
            if (s.iserror) {
                state.error = true;
                console.log(s.errs);
            }
            if (s.isfinish) {
                state.finish = true;
            }
        });
    }
    //加载一个mesh的材质资源
    private loadMaterial(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`res/prefabs/Cube/resources/Default-Diffuse.mat.json`, m4m.framework.AssetTypeEnum.Material, (s) => {
            if (s.iserror) {
                state.error = true;
                console.log(s.errs);
            }
            if (s.isfinish) {
                state.finish = true;
            }
        })
    }
    
    //新建一个cube 绑定加载的mesh资源和材质资源
    private useMeshAndMat(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        let cube = new m4m.framework.transform();
        cube.name = "cube";
        cube.localPosition = new m4m.math.vector3(0, 0, 0);
        //给cube添加一个mesh组件，mesh组件存放顶点数据的。
        let mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        //获取已经加载好的mesh资源，并把mesh资源绑定给cube的mesh组件
        mesh.mesh = this.app.getAssetMgr().getAssetByName("Library_unity_default_resources_Cube.mesh.bin") as m4m.framework.mesh;

        //给cube添加一个渲染组件。
        let render = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        //获取已经加载好的材质资源，并把材质资源绑定给cube的渲染组件
        render.materials.push(this.app.getAssetMgr().getAssetByName("Default-Diffuse.mat.json") as m4m.framework.material);
        this.scene.addChild(cube);
        cube.markDirty();
        state.finish = true;
    }

    //#region 加载shader
    private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.iserror) {
                state.error = true;
            }
            if (s.isfinish)
                state.finish = true;
        });
    }
    //#endregion
    //#region 添加一个摄像机
    private addCamera(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        let objCam = new m4m.framework.transform();
        objCam.name = "camera.";
        objCam.localPosition.z = -10;
        objCam.localPosition.y = 10;
        objCam.localPosition.x = 10;

        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.far = 100;
        this.scene.addChild(objCam);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        objCam.markDirty();
        state.finish = true;
    }
    //#endregion

    start(app: m4m.framework.application) {
        this.app = app;
        this.scene = app.getScene();
        //提供给项目用的执行队列，可以减少 asstemgr.load方法 的回调嵌套
        this.taskMgr.addTaskCall(this.loadShader.bind(this));
        this.taskMgr.addTaskCall(this.addCamera.bind(this));
        this.taskMgr.addTaskCall(this.loadMesh.bind(this));
        this.taskMgr.addTaskCall(this.loadMaterial.bind(this));
        this.taskMgr.addTaskCall(this.useMeshAndMat.bind(this));
    }

    update(delta: number) {
        this.taskMgr.move(delta);
    }
}



