
declare namespace spine_m4m
{
    class m4mTexture
    {

    }
    class spineSkeleton implements m4m.framework.I2DComponent
    {
        constructor(skeletonData: any)
        state: AnimationState;
        animData: any;
        skeleton: Skeleton;
        onPlay();
        start();
        update(delta: number);
        transform: m4m.framework.transform2D;
        remove();
        onUpdate: () => void;
        getToCanvasMatrix(mat?: m4m.math.matrix3x2): m4m.math.matrix3x2;
        changeSlotTexture(slotName: string, texture: m4mTexture);
        clearSlot(slotName: string)
    }
    class SpineAssetMgr
    {
        constructor(mgr: m4m.framework.assetMgr, baseUrl?: string)
        loadBinary(path: string, success?: (path: string, binary: Uint8Array) => void, error?: (path: string, message: string) => void): void;
        loadText(path: string, success?: (path: string, text: string) => void, error?: (path: string, message: string) => void): void;
        loadJson(path: string, success?: (path: string, object: object) => void, error?: (path: string, message: string) => void): void;
        loadTexture(path: string, success?: (path: string, texture: m4mTexture) => void, error?: (path: string, message: string) => void): void;
        loadTextureAtlas(path: string, success?: (path: string, atlas: any) => void, error?: (path: string, message: string) => void, fileAlias?: {
            [keyword: string]: string;
        }): void;
        get(asset: string): any;
    }

    class AtlasAttachmentLoader
    {
        constructor(atlas: any)
    }

    class SkeletonJson
    {
        constructor(json: any);
        readSkeletonData(data: any)
        scale: number
    }

    class AnimationState
    {
        timeScale: number;
        addAnimation(trackIndex: number, animationName: string, loop?: boolean, delay?: number): TrackEntry
        setAnimation(trackIndex: number, animationName: string, loop?: boolean): TrackEntry
        addEmptyAnimation(trackIndex: number, mixDuration?: number, delay?: number): TrackEntry;
        setEmptyAnimations(mixDuration?: number): void;
        setEmptyAnimation(trackIndex: number, mixDuration?: number): TrackEntry;
    }

    class TrackEntry
    {
        previous: TrackEntry;
        next: TrackEntry;
        mixingFrom: TrackEntry;
        mixingTo: TrackEntry;
        listener: AnimationStateListener;
        trackIndex: number;
        loop: boolean;
        mixBlend: MixBlend;
        alpha: number;
    }
    enum MixBlend
    {
        setup = 0,
        first = 1,
        replace = 2,
        add = 3
    }
    class AnimationStateListener
    {
        start?(entry: TrackEntry): void;
        interrupt?(entry: TrackEntry): void;
        end?(entry: TrackEntry): void;
        dispose?(entry: TrackEntry): void;
        complete?(entry: TrackEntry): void;
        event?(entry: TrackEntry, event: Event): void;
    }

    class Skeleton
    {
        data: SkeletonData
        slots: Slot[];
        scaleX: number;
        scaleY: number;
        x: number;
        y: number;
        setSkinByName(skinName: string): void;
        setSkin(skin: Skin): void;
        setSlotsToSetupPose();
        findBone(boneName: string): Bone;
    }

    class SkeletonData
    {
        skins: Skin[];
    }

    class Skin
    {
        name: string;
        setAttachment(slotIndex: number, name: string, attachment: Attachment): void;
        attachments: { [att: string]: Attachment }[]
        constructor(name: string)
    }

    class Bone
    {
        data: BoneData;
        skeleton: Skeleton;
        parent: Bone;
        children: Bone[];
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        shearX: number;
        shearY: number;
        ax: number;
        ay: number;
        arotation: number;
        ascaleX: number;
        ascaleY: number;
        ashearX: number;
        ashearY: number;
        a: number;
        b: number;
        c: number;
        d: number;
        worldY: number;
        worldX: number;
        sorted: boolean;
        active: boolean;

        worldToLocal(world: Vector2): Vector2;
        localToWorld(local: Vector2): Vector2;
        worldToLocalRotation(worldRotation: number): number;
        localToWorldRotation(localRotation: number): number;
        rotateWorld(degrees: number): void;
    }
    class BoneData
    {
        index: number;
        name: string;
        parent: BoneData;
        length: number;
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        shearX: number;
        shearY: number;
    }
    class Slot
    {

    }
    abstract class Attachment
    {
        name: string;
    }

    class Vector2
    {
        x: number;
        y: number;
        set(x: number, y: number);
    }
}

class test_spine_spriteSheet implements IState
{
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
        let animation = "walk";
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
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).raptor);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                this._comp = comp;
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                let spineNode = new m4m.framework.transform2D;
                //可用transform2d缩放等
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                // spineNode.localRotate = 30 * Math.PI / 180;
                spineNode.localScale.x = -1;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
                //GUI
                datGui.init().then(() => this.setGUI())
            })
    }
    setGUI()
    {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'speed', 0, 2).onChange((value) =>
        {
            this._comp.state.timeScale = value;
        });
    }
    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_m4m.spineSkeleton;
}