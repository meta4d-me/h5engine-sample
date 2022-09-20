/**
 * UI 渲染使用 纹理数组 样例（webgl2 特性优化尝试）
 */
class test_UI_Texture_Array implements IState {
    private normalRoot: m4m.framework.transform2D;
    private textureArrayRoot: m4m.framework.transform2D;
    private app: m4m.framework.application;
    private scene: m4m.framework.scene;
    private camera: m4m.framework.camera;
    private taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    private assetMgr: m4m.framework.assetMgr;
    private rooto2d: m4m.framework.overlay2D;
    private readonly atlasNames = ["TA_NUMs", "TA_UIs", "TA_ICON"];
    private atlasPath = `${resRootPath}atlas/`;

    private async loadAtlas(resName: string): Promise<m4m.framework.atlas> {
        const imgFile = `${this.atlasPath}${resName}/${resName}.png`;
        const jsonFile = `${this.atlasPath}${resName}/${resName}.atlas.json`;

        const _img = await util.loadRes<m4m.framework.texture>(imgFile);
        const _atlas = await util.loadRes<m4m.framework.atlas>(jsonFile);
        _atlas.texture = _img;
        return _atlas;
    }

    async start(app: m4m.framework.application) {

        //初始化
        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();

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

        //node root
        this.normalRoot = new m4m.framework.transform2D();
        this.normalRoot.name = `noramlRoot`;
        this.textureArrayRoot = new m4m.framework.transform2D();
        this.textureArrayRoot.name = `textureArrayRoot`;

        //加载 依赖资源
        const pArr: Promise<m4m.framework.atlas>[] = [];
        this.atlasNames.forEach((name) => {
            pArr.push(this.loadAtlas(name));
        });

        await Promise.all(pArr);

        //创建 UI
    }

    private randomMakeUI(){

    }

    update(delta: number) {

    }

}