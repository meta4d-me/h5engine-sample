
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
        /**
         * 获取到canvas空间的矩阵
         * @param mat 
         */
        getToCanvasMatrix(mat?: m4m.math.matrix3x2): m4m.math.matrix3x2;
        /**
         * 改变孔 纹理
         * @param slotName 孔名
         * @param texture 纹理
         */
        changeSlotTexture(slotName: string, texture: m4mTexture);
        /**
         * 清理孔
         * @param slotName 
         */
        clearSlot(slotName: string)
    }
    class SpineAssetMgr
    {
        constructor(mgr: m4m.framework.assetMgr, baseUrl?: string)
        /**
         * 加载二进制数据
         * @param path 路径
         * @param success 成功回调
         * @param error 异常
         */
        loadBinary(path: string, success?: (path: string, binary: Uint8Array) => void, error?: (path: string, message: string) => void): void;
        /**
         * 加载文本字符数据
         * @param path 路径
         * @param success 成功回调
         * @param error 异常
         */
        loadText(path: string, success?: (path: string, text: string) => void, error?: (path: string, message: string) => void): void;
        /**
         * 加载json字符数据
         * @param path 路径
         * @param success 成功回调
         * @param error 异常
         */
        loadJson(path: string, success?: (path: string, object: object) => void, error?: (path: string, message: string) => void): void;
        /**
         * 加载纹理
         * @param path 路径
         * @param success 成功回调
         * @param error 异常
         */
        loadTexture(path: string, success?: (path: string, texture: m4mTexture) => void, error?: (path: string, message: string) => void): void;
        /**
         * 加载图集资源
         * @param path 路径
         * @param success 成功回调
         * @param error 异常
         */
        loadTextureAtlas(path: string, success?: (path: string, atlas: any) => void, error?: (path: string, message: string) => void, fileAlias?: {
            [keyword: string]: string;
        }): void;
        /**
         * 获取资源
         * @param asset 资源key
         */
        get(asset: string): any;
    }

    class AtlasAttachmentLoader
    {
        constructor(atlas: any)
    }

    class SkeletonJson
    {
        constructor(json: any);
        /**
         * 读取骨骼数据
         * @param data 
         */
        readSkeletonData(data: any)
        scale: number
    }

    class AnimationState
    {
        timeScale: number;
        /**
         * 添加动画
         * @param trackIndex 时间轨索引
         * @param animationName 动画名
         * @param loop 是循环的？
         * @param delay 延时
         */
        addAnimation(trackIndex: number, animationName: string, loop?: boolean, delay?: number): TrackEntry
        /**
         * 设置动画
         * @param trackIndex 时间轨索引
         * @param animationName 动画名
         * @param loop 是循环的？
         */
        setAnimation(trackIndex: number, animationName: string, loop?: boolean): TrackEntry
        /**
         * 添加空的动画
         * @param trackIndex 时间轨索引
         * @param mixDuration 混合度
         * @param delay 延时
         */
        addEmptyAnimation(trackIndex: number, mixDuration?: number, delay?: number): TrackEntry;
        /**
         * 设置所有空的动画
         * @param mixDuration 混合度
         */
        setEmptyAnimations(mixDuration?: number): void;
        /**
         * 设置空的动画
         * @param trackIndex 时间轨索引
         * @param mixDuration 混合度
         */
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
        /**
         * 开始
         * @param entry 时轨对象 
         */
        start?(entry: TrackEntry): void;
        /**
         * 中断
         * @param entry 时轨对象
         */
        interrupt?(entry: TrackEntry): void;
        /**
         * 结束
         * @param entry 时轨对象
         */
        end?(entry: TrackEntry): void;
        /**
         * 销毁
         * @param entry 时轨对象
         */
        dispose?(entry: TrackEntry): void;
        /**
         * 完成
         * @param entry 时轨对象
         */
        complete?(entry: TrackEntry): void;
        /**
         * 事件
         * @param entry 时轨对象
         * @param event 事件
         */
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
        /**
         * 通过名字设置skin 
         * @param skinName skin名字
         */
        setSkinByName(skinName: string): void;
        /**
         * 设置 skin
         * @param skin skin对象
         */
        setSkin(skin: Skin): void;
        /**
         * 设置孔到 骨骼姿态
         */
        setSlotsToSetupPose();
        /**
         * 找骨骼
         * @param boneName 骨骼名 
         */
        findBone(boneName: string): Bone;
    }

    class SkeletonData
    {
        skins: Skin[];
    }

    class Skin
    {
        name: string;
        /**
         * 设置附件
         * @param slotIndex 孔索引
         * @param name 名
         * @param attachment 附件 
         */
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
        /**
         * 世界到本地位置
         * @param world 世界位置 
         */
        worldToLocal(world: Vector2): Vector2;
        /**
         * 本地到世界位置
         * @param local 本地位置
         */
        localToWorld(local: Vector2): Vector2;
        /**
         * 世界到本地旋转
         * @param worldRotation 世界旋转
         */
        worldToLocalRotation(worldRotation: number): number;
        /**
         * 本地到世界旋转
         * @param localRotation 本地旋转
         */
        localToWorldRotation(localRotation: number): number;
        /**
         * 旋转世界
         * @param degrees 旋转度
         */
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
        /**
         * 设置二维向量
         * @param x 
         * @param y 
         */
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
    }
    private speed = 1.0
    update(delta: number) { }
    private _comp: spine_m4m.spineSkeleton;
}