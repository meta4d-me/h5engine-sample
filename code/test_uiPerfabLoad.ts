//UI 组件样例
class test_uiPerfabLoad implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    assetMgr: m4m.framework.assetMgr;
    rooto2d: m4m.framework.overlay2D;
    start(app: m4m.framework.application)
    {

        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();

        this.app.closeFps();

        //相机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10;

        //2dUI root
        this.rooto2d = new m4m.framework.overlay2D();
        this.camera.addOverLay(this.rooto2d);


        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadShaders.bind(this));
        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.createUI.bind(this));

        //html 输入框
        let inputh = document.createElement("input");
        this.app.container.appendChild(inputh);
        inputh.style.position = "absolute";
        inputh.style.width = 100 + "px";
        inputh.style.height = 30 + "px";
        inputh.value = "button_comb1";

        let btn = document.createElement("button");
        this.app.container.appendChild(btn);
        btn.textContent = "加载";
        btn.style.position = "absolute";
        btn.style.left = 120 + "px";
        btn.onclick = () =>
        {
            console.error(inputh.innerText);
            console.error(inputh.textContent);
            console.error(inputh.value);
            this.doLoad(inputh.value);
        }

    }

    private bgui: m4m.framework.transform2D;
    /**
     * 创建UI 
     * @param astState 
     * @param state 状态 
     */
    private createUI(astState: m4m.framework.taskstate, state: m4m.framework.taskstate)
    {
        let atlasComp = this.assetMgr.getAssetByName("comp.atlas.json") as m4m.framework.atlas;
        let tex_0 = this.assetMgr.getAssetByName("zg03_256.png") as m4m.framework.texture;

        //9宫格拉伸底图
        let bg_t = new m4m.framework.transform2D;
        bg_t.width = 400;
        bg_t.height = 260;
        bg_t.pivot.x = 0;
        bg_t.pivot.y = 0;
        //bg_t.localTranslate.x = 100;
        bg_t.localTranslate.y = 100;
        this.rooto2d.addChild(bg_t);
        let bg_i = bg_t.addComponent("image2D") as m4m.framework.image2D;
        bg_i.imageType = m4m.framework.ImageType.Sliced;
        bg_i.sprite = atlasComp.sprites["bg"];
        bg_i.imageBorder.l = 10;
        bg_i.imageBorder.t = 50;
        bg_i.imageBorder.r = 10;
        bg_i.imageBorder.b = 10;
        bg_t.layoutState = 0 | m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.RIGHT | m4m.framework.layoutOption.TOP | m4m.framework.layoutOption.BOTTOM;
        bg_t.setLayoutValue(m4m.framework.layoutOption.LEFT, 60);
        bg_t.setLayoutValue(m4m.framework.layoutOption.TOP, 60);
        bg_t.setLayoutValue(m4m.framework.layoutOption.RIGHT, 60);
        bg_t.setLayoutValue(m4m.framework.layoutOption.BOTTOM, 60);

        this.bgui = bg_t;

        let prefabName = "button";
        //this.doLoad(prefabName);

        //key dwon test
        let inputMgr = this.app.getInputMgr();

        this.app.webgl.canvas.addEventListener("keydown", (ev: KeyboardEvent) =>
        {
            if (ev.keyCode == 81)
            {

            }
        }, false);



        state.finish = true;
    }

    targetui: m4m.framework.transform2D;
    /**
     * 加载资源
     * @param name 资源名 
     * @returns 
     */
    private doLoad(name)
    {
        if (!this.bgui) return;
        if (this.targetui)
        {
            this.bgui.removeChild(this.targetui);
            this.targetui.dispose();
        }

        let prefabName = name;
        // 加载 ui  预制体
        this.assetMgr.load(`${resRootPath}prefab/${prefabName}/${prefabName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s1) =>
        {
            if (s1.isfinish)
            {
                let ass = this.assetMgr;
                let temp = this.assetMgr.getAssetByName(`${prefabName}.prefab.json`, `${prefabName}.assetbundle.json`) as m4m.framework.prefab;
                let t2d = temp.getCloneTrans2D() as m4m.framework.transform2D;
                this.bgui.addChild(t2d);
                t2d.layoutState = 0 | m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
                t2d.markDirty();
                this.targetui = t2d;
            }
        });
    }

    /**
     * 加载着色器
     * @param lastState 
     * @param state 状态
     */
    private loadShaders(lastState: m4m.framework.taskstate, state: m4m.framework.taskstate)
    {
        this.assetMgr.load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                state.finish = true;
            }
        });
    }

    /**
     * 加载纹理
     * @param lastState 
     * @param state 状态
     */
    private loadTexture(lastState: m4m.framework.taskstate, state: m4m.framework.taskstate)
    {
        //加载图片资源
        this.assetMgr.load(`${resRootPath}atlas/comp/comp.json.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                this.assetMgr.load(`${resRootPath}atlas/comp/comp.atlas.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        //加载字体资源
                        this.assetMgr.load(`${resRootPath}font/STXINGKA.TTF.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
                        {
                            if (s.isfinish)
                            {
                                this.assetMgr.load(`${resRootPath}font/STXINGKA.font.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
                                {
                                    this.assetMgr.load(`${resRootPath}texture/zg03_256.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
                                    {
                                        if (s.isfinish)
                                        {
                                            state.finish = true;
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    update(delta: number)
    {
        this.taskmgr.move(delta); //推进task

    }

}