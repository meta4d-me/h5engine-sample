
class test_spine_stretchyMan implements IState
{
    private _inited: boolean;
    private controlBones = ["back leg controller", "front leg controller", "back arm controller", "front arm controller", "head controller", "hip controller"];
    private _temptMat = new m4m.math.matrix();
    private _temptPos = new m4m.math.vector2();
    private _chooseBone: spine_m4m.Bone;
    private bonesPos: { [bone: string]: { bone: spine_m4m.Bone, boneUI: HTMLDivElement } } = {}

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
        let atlasFile = "atlas2.atlas"
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).stretchyman);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置皮肤
                comp.state.setAnimation(0, "idle", true);
                let spineNode = new m4m.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);

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

                                // let boneWorldPos = new m4m.math.vector2(ev.clientX - app.width / 2, app.height / 2 - ev.clientY);
                                // let worldPos = this._comp.transform.getWorldTranslate();
                                // let worldRot = this._comp.transform.getWorldRotate();
                                // let worldScale = this._comp.transform.getWorldScale();
                                // m4m.math.matrix3x2MakeTransformRTS(worldPos, worldScale, worldRot.v, this._temptMat);
                                // m4m.math.matrix3x2Inverse(this._temptMat, this._temptMat);
                                // m4m.math.matrix3x2TransformVector2(this._temptMat, boneWorldPos, this._temptPos);

                                this._chooseBone.parent.worldToLocal(tempt);
                                this._chooseBone.x = tempt.x;
                                this._chooseBone.y = tempt.y;
                                for (let i = 0; i < this.controlBones.length; i++)
                                {
                                    // if(this.bonesPos[this.controlBones[i]]!=null)
                                    let boneName = this.controlBones[i];
                                    let bone = this._comp.skeleton.findBone(boneName);
                                    let x = this._comp.skeleton.x + bone.worldX;
                                    let y = this._comp.skeleton.y + bone.worldY;
                                    m4m.math.matrix3x2TransformVector2(toMat, new m4m.math.vector2(x, y), temptPos);
                                    root2d.calCanvasPosToScreenPos(temptPos, temptPos);
                                    let screen_x = temptPos.x;
                                    let screen_y = temptPos.y;

                                    this.bonesPos[boneName].boneUI.style.top = screen_y + "px";
                                    this.bonesPos[boneName].boneUI.style.left = screen_x + "px";
                                }
                            }
                        })
                        document.addEventListener("mouseup", () => this._chooseBone = null)

                        // let worldPos = this._comp.transform.getWorldTranslate();
                        // let worldRot = this._comp.transform.getWorldRotate();
                        // let worldScale = this._comp.transform.getWorldScale();
                        // m4m.math.matrix3x2MakeTransformRTS(worldPos, worldScale, worldRot.v, this._temptMat);
                        let toCanvasMat = this._comp.getToCanvasMatrix();
                        let temptPos = new m4m.math.vector2();
                        for (let i = 0; i < this.controlBones.length; i++)
                        {
                            // if(this.bonesPos[this.controlBones[i]]!=null)
                            let boneName = this.controlBones[i];
                            let bone = this._comp.skeleton.findBone(boneName);
                            let x = this._comp.skeleton.x + bone.worldX;
                            let y = this._comp.skeleton.y + bone.worldY;
                            m4m.math.matrix3x2TransformVector2(toCanvasMat, new m4m.math.vector2(x, y), temptPos);
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
    update(delta: number) { }
    private _comp: spine_m4m.spineSkeleton;
}