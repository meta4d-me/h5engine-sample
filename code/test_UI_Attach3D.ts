/** UI 贴到 3D 空间 */
class test_UI_Attach3D implements IState {
    private debugBorderFrameImg: m4m.framework.texture;
    private isDebugDisplay = true;
    private nodes: m4m.framework.transform[];
    private aabbDisps: { node: m4m.framework.transform; setVisible: (v: boolean) => void; update: () => void; }[];
    /**
     * 创建3d节点
     * @param w UI容器宽
     * @param h UI容器高
     * @param x 坐标x
     * @param y 坐标y
     * @param z 坐标z
     * @returns 
     */
    private makeUI3DNode(w: number, h: number, x = 0, y = 0, z = 0) {
        const scene = m4m.framework.sceneMgr.scene;
        const node = this.isDebugDisplay ? m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube) : new m4m.framework.transform();
        node.localPosition = new m4m.math.vector3(x, y, z);
        const canRNdoe = new m4m.framework.transform();
        const canvasR = canRNdoe.gameObject.addComponent("canvasRenderer") as m4m.framework.canvasRenderer;
        canvasR.canvas.pixelWidth = w;
        canvasR.canvas.pixelHeight = h;
        canvasR.canvas.enableOutsideRenderClip = false;
        //
        scene.addChild(node);
        node.addChild(canRNdoe);
        //
        if (this.isDebugDisplay) {
            const lopt = m4m.framework.layoutOption;
            const debugFrame = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.RawImage2D).getComponent("rawImage2D") as m4m.framework.rawImage2D;
            debugFrame.image = this.debugBorderFrameImg;
            debugFrame.transform.layoutState = lopt.TOP | lopt.LEFT | lopt.BOTTOM | lopt.RIGHT;
            canvasR.canvas.addChild(debugFrame.transform);
        }
        return canvasR;
    }

    /** 创建UI组件 */
    private async createUIComps(root: m4m.framework.transform2D) {
        const app = m4m.framework.sceneMgr.app;
        const assetMgr = app.getAssetMgr();
        //加载纹理
        const texNames = [`zg256.png`];
        const texUrl = [];
        texNames.forEach(n => {
            texUrl.push(`${resRootPath}texture/${n}`)
        });
        const texs = await util.loadTextures(texUrl, assetMgr);

        //加载字体
        const fontjson = "方正粗圆_GBK.font.json";
        const fontpng = "方正粗圆_GBK.TTF.png";
        await util.loadRes(`${resRootPath}font/${fontpng}`);
        const _font = await util.loadRes<m4m.framework.font>(`${resRootPath}font/${fontjson}`);

        const lab = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Label).getComponent("label") as m4m.framework.label;
        lab.text = `测试UI组件 !`;
        lab.transform.localTranslate = new m4m.math.vector2(20, 30);
        lab.font = _font;

        const img = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.RawImage2D).getComponent("rawImage2D") as m4m.framework.rawImage2D;
        img.image = texs[0];
        img.transform.localTranslate = new m4m.math.vector2(100, 150);

        const btn = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Button).getComponent("button") as m4m.framework.button;
        btn.transform.localTranslate = new m4m.math.vector2(150, 300);
        const btnLab = btn.transform.getFirstComponentInChildren("label") as m4m.framework.label;
        btnLab.text = `测试按钮`;
        btnLab.font = _font;

        //attach 
        root.addChild(lab.transform);
        root.addChild(img.transform);
        root.addChild(btn.transform);

    }

    private createSpines(root: m4m.framework.transform2D) {
        let app = m4m.framework.sceneMgr.app;
        const assetMgr = app.getAssetMgr();
        let assetManager = new spine_m4m.SpineAssetMgr(assetMgr, `${resRootPath}spine/`);
        let skeletonFile = "demos.json";
        let atlasFile = "atlas1.atlas"
        let animation = "walk";
        Promise.all([
            new Promise<void>((resolve, reject) => {
                assetManager.loadJson(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) => {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() => {
                let atlasLoader = new spine_m4m.AtlasAttachmentLoader(assetManager.get(atlasFile));
                let skeletonJson = new spine_m4m.SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).raptor);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                // this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                let spineNode = new m4m.framework.transform2D();
                //可用transform2d缩放等
                spineNode.localTranslate = new m4m.math.vector2(300, 200);
                // spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                // spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                // spineNode.localRotate = 30 * Math.PI / 180;
                spineNode.localScale.x = -1;
                m4m.math.vec2ScaleByNum(spineNode.localScale, 0.5, spineNode.localScale);
                spineNode.addComponentDirect(comp);
                spineNode.width = 200;
                spineNode.height = 200;
                root.addChild(spineNode);

                //
                const img = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.RawImage2D).getComponent("rawImage2D") as m4m.framework.rawImage2D;
                img.image = assetMgr.getDefaultTexture("grid");
                img.transform.localTranslate = new m4m.math.vector2(200, 300);
                root.addChild(img.transform);
            })
    }

    async start(app: m4m.framework.application) {
        let scene = app.getScene();
        const assetMgr = scene.app.getAssetMgr();
        //initCamera
        let objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 10;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0);
        //
        if (this.isDebugDisplay) {
            let texs = await util.loadTextures([`${resRootPath}texture/borderFrame.png`], assetMgr);
            this.debugBorderFrameImg = texs[0];
        }
        //创建 UI 组件
        const baseUINode = this.makeUI3DNode(400, 400);
        baseUINode.cameraTouch = cam;
        await this.createUIComps(baseUINode.canvas.getRoot());
        //创建 spine
        // const spineNode = this.makeUI3DNode(600, 400, 2, 1, 3);
        const spineNode = this.makeUI3DNode(640, 480, 2, 1, 3);
        // const spineNode = this.makeUI3DNode(600, 400);
        spineNode.cameraTouch = cam;
        await this.createSpines(spineNode.canvas.getRoot());

        //添加 aabb 显示框 列表
        this.nodes = [
            baseUINode.gameObject.transform,
            spineNode.gameObject.transform,
            baseUINode.gameObject.transform.parent,
            spineNode.gameObject.transform.parent
        ];

        //gui 设置
        await this.setGUI();
    }

    private _enableAABBShow: boolean = false;
    private get enableAABBShow() { return this._enableAABBShow; }
    private set enableAABBShow(val) {
        if (val == this._enableAABBShow) return;
        this._enableAABBShow = val;
        if (this.aabbDisps == null) {
            this.aabbDisps = [];
            this.nodes.forEach((val) => {
                this.aabbDisps.push(util.makeAABBDisplayer(val));
            });
        }

        this.aabbDisps.forEach((v) => {
            v.setVisible(val);
        });
    };

    private async setGUI() {
        await datGui.init();
        let gui = new dat.GUI();
        const app = m4m.framework.sceneMgr.app;
        gui.add(app, "showDrawCall");
        gui.add(this, "enableAABBShow").name("显示AABB框");
    }

    update(delta: number) {
        if (this.aabbDisps) {
            for (let i = 0, len = this.aabbDisps.length; i < len; i++) {
                const aabbDisp = this.aabbDisps[i];
                if (!aabbDisp) continue;
                aabbDisp.update();
            }
        }
    }
}