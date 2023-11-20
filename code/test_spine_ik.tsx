class test_spine_IK implements IState
{
    private _inited: boolean;
    private controlBones = ["hoverboard controller", "hip controller", "board target", "crosshair"];
    private _temptMat = new m4m.math.matrix();
    private _temptPos = new m4m.math.vector2();
    private _chooseBone: spine_m4m.Bone;
    private bonesPos: { [bone: string]: { bone: spine_m4m.Bone, boneUI: HTMLDivElement } } = {}
    private _hoverBone: string;

    start(app: m4m.framework.application)
    {

        let scene = app.getScene();
        //相机
        var objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        //2dUI root
        let root2d = new m4m.framework.overlay2D();
        camera.addOverLay(root2d);
        let assetManager = new spine_m4m.SpineAssetMgr(app.getAssetMgr(), `${resRootPath}spine/`);
        let skeletonFile = "demos.json";
        let atlasFile = "atlas1.atlas"
        Promise.all([
            new Promise<void>((resolve, reject) =>
            {
                assetManager.loadJson(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) =>
            {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() =>
            {
                let atlasLoader = new spine_m4m.AtlasAttachmentLoader(assetManager.get(atlasFile));
                let skeletonJson = new spine_m4m.SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).spineboy);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, "hoverboard", true);
                let spineNode = new m4m.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;

                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

                //GUI
                datGui.init().then(() => this.setGUI())

                comp.onUpdate = () =>
                {
                    if (!this._inited)
                    {
                        this._inited = true;
                        let ui = document.getElementById("drawarea") as HTMLDivElement;

                        //拖动骨骼
                        document.addEventListener("mousemove", (ev) =>
                        {
                            if (this._chooseBone)
                            {
                                let boneName = this._chooseBone.data.name;

                                let temptPos = new m4m.math.vector2();
                                temptPos.x = ev.clientX;
                                temptPos.y = ev.clientY;
                                root2d.calScreenPosToCanvasPos(temptPos, temptPos);
                                let toMat = this._comp.getToCanvasMatrix();
                                let temptMat = new m4m.math.matrix3x2();
                                m4m.math.matrix3x2Inverse(toMat, temptMat);
                                m4m.math.matrix3x2TransformVector2(temptMat, temptPos, temptPos);
                                let tempt = new spine_m4m.Vector2();
                                tempt.set(temptPos.x, temptPos.y)

                                this._chooseBone.parent.worldToLocal(tempt);
                                this._chooseBone.x = tempt.x;
                                this._chooseBone.y = tempt.y;

                                this.bonesPos[boneName].boneUI.style.top = ev.clientY + "px";
                                this.bonesPos[boneName].boneUI.style.left = ev.clientX + "px";
                            }
                        })
                        document.addEventListener("mouseup", () => this._chooseBone = null)

                        //初始化骨骼UI
                        let temptMat = this._comp.getToCanvasMatrix();
                        let temptPos = new m4m.math.vector2();

                        for (let i = 0; i < this.controlBones.length; i++)
                        {
                            // if(this.bonesPos[this.controlBones[i]]!=null)
                            let boneName = this.controlBones[i];
                            let bone = this._comp.skeleton.findBone(boneName);
                            let x = this._comp.skeleton.x + bone.worldX;
                            let y = this._comp.skeleton.y + bone.worldY;
                            m4m.math.matrix3x2TransformVector2(temptMat, new m4m.math.vector2(x, y), temptPos);
                            root2d.calCanvasPosToScreenPos(temptPos, temptPos);
                            let screen_x = temptPos.x;
                            let screen_y = temptPos.y;

                            let boneUI = document.createElement("div", {});
                            boneUI.style.position = "absolute";
                            boneUI.style.width = "10px";
                            boneUI.style.height = "10px";
                            boneUI.style.backgroundColor = "blue";
                            boneUI.style.top = screen_y + "px";
                            boneUI.style.left = screen_x + "px";
                            boneUI.addEventListener("mouseenter", () =>
                            {
                                boneUI.style.backgroundColor = "green";
                            });
                            boneUI.addEventListener("mouseleave", () =>
                            {
                                boneUI.style.backgroundColor = "blue";
                            });
                            boneUI.addEventListener("mousedown", () =>
                            {
                                this._chooseBone = bone;
                            });
                            this.bonesPos[boneName] = { bone, boneUI }
                            ui.appendChild(boneUI)
                        }
                    }
                }
            })
    }

    /**
     * 发射
     */
    private fire = () =>
    {
        this._comp.state.setAnimation(3, "aim", true);
        this._comp.state.setAnimation(4, "shoot", false);
        this._comp.state.addEmptyAnimation(4, 0.5, 0).listener = {
            complete: (trackIndex) =>
            {
                this._comp.state.setEmptyAnimation(3, 0.2);
            }
        };
    }

    /**
     *  跳跃 
     */
    private jump = () =>
    {
        this._comp.state.setAnimation(2, "jump", false);
        this._comp.state.addEmptyAnimation(2, 0.5, 0);
    }
    /**
     * 设置GUI
     * @returns 
     */
    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) =>
        {
            this._comp.state.timeScale = value;
        });

        gui.add(this, "fire")
        gui.add(this, "jump")
    }
    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_m4m.spineSkeleton;
}