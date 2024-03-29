class UseTextureDemo implements IState {
    app: m4m.framework.application;
    assetMgr: m4m.framework.assetMgr;
    scene: m4m.framework.scene;
    taskMgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    texture: m4m.framework.texture;
    quad: m4m.framework.transform;

    start(app: m4m.framework.application) {//接口IState 入口
        this.app = app;
        this.assetMgr = app.getAssetMgr();
        this.scene = app.getScene();

        this.taskMgr.addTaskCall(this.loadShader.bind(this));
        this.taskMgr.addTaskCall(this.loadQuad.bind(this));
        this.taskMgr.addTaskCall(this.loadTexture.bind(this));

        //#region 在场景中放入一个相机
        let cam = new m4m.framework.transform();
        cam.name = "looker";
        this.scene.addChild(cam);
        cam.localPosition = new m4m.math.vector3(0, 0, -10);
        //cam.localRotate = new m4m.math.quaternion(0,0,0,1);
        let camera = cam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.far = 100;
        cam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        cam.markDirty();
        //#endregion
        this.addCtrl();
    }


    /**
     * 加载纹理
     * 加载纹理，png .jpg纹理。用类似的操作可以加载 .pvr .pvr.bin pvr纹理资源  .dds .dds.bin dds纹理资源 和 .imgdesc.json 贴图资源，只需把AssetTypeEnum的类型 修改为 PVR,DDS和TextureDesc或者Auto即可。
     * @param laststate 
     * @param state 状态
     */
    private loadTexture(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`res/zg256.png`, m4m.framework.AssetTypeEnum.Texture, (s) => {
            if (s.isfinish) {
                //所有纹理相关的资源最后都会生成一个texture的对象保存着。
                this.texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                state.finish = true;
            }
        });
    }

    /**
     * 使用纹理
     */
    private useTexture(){
        let render = this.quad.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        console.log(this.texture);
        //白纹理图片设置进材质中
        render.materials[0].setTexture("_MainTex", this.texture);
    }

    //#region 加载shader
    private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.iserror) {
                state.error = true;
            }
            if (s.isfinish)
                state.finish = true;
        });
    }
    //#endregion
    //#region 加载一个面片，用于绑定纹理。
    private loadQuad(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.assetMgr.load("res/prefabs/Quad11/Quad.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                let quadPrefab = this.assetMgr.getAssetByName("Quad.prefab.json") as m4m.framework.prefab;
                let quad = quadPrefab.getCloneTrans();
                this.scene.addChild(quad);
                quad.markDirty();
                state.finish = true;
                this.quad = quad;
            }
        });
    }
    //#endregion
    //#region 添加按钮使用加载的纹理
    private  addCtrl() {
        let changeTexture = document.createElement("button") as HTMLButtonElement;
        changeTexture.innerText = "更换纹理";
        this.app.container.appendChild(changeTexture);
        changeTexture.style.position = "absolute";
        changeTexture.style.height = "25px";
        changeTexture.style.width = "75px";
        changeTexture.style.top = "100px";
        changeTexture.style.left = "75px";

        changeTexture.onclick = (e) => {
            //更换quad的纹理图片
            this.useTexture();
        }
    }
    //#endregion

    update(delta: number) {//接口IState 的update方法 detal一般是当前与上次 app中update方法被的时间差
        this.taskMgr.move(delta);
        
    }
}