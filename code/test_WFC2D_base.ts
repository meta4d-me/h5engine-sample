/**
 * 波函数坍缩2d 生成基础
 * WFC2d库链接：https://github.com/anseyuyin/wfc2D
 */
class test_WFC2D_base implements IState {
    private camera: m4m.framework.camera;
    private rooto2d: m4m.framework.overlay2D;
    private bgRoot: m4m.framework.transform2D;
    /** 资源方到 examples/engineExample/exampleResource/wfc2d/  路径下 */
    private WFC2DResList: string[] = ["Carcassonne", "Circuit", "Summer", "test", "Village"];
    private _selectWFC2DRes: string = "Circuit";
    private currWFC2DRes: string = this._selectWFC2DRes;
    private autoTileSize: boolean = true;
    private imgToAtlas: boolean = true;
    /** 尝试最大回退次数 */
    private backOffMaxNum: number = 300;
    /** 回退缓存数 */
    private capQueueMaxLen: number = 3;
    /** 缓存率 */
    private capRate: number = 0.02;
    //设定地图尺寸
    private _mapWidth: number = 30;
    private _mapHeigth: number = 30;
    private _tileSize: number = 14;

    public get selectWFC2DRes() { return this._selectWFC2DRes; }
    public set selectWFC2DRes(val) { this._selectWFC2DRes = this.currWFC2DRes = val; }

    public get mapWidth() { return this._mapWidth; }
    public set mapWidth(val) { this._mapWidth = this.setVal(val); }
    public get mapHeigth() { return this._mapHeigth; }
    public set mapHeigth(val) { this._mapHeigth = this.setVal(val); }

    public get tileSize() { return this._tileSize; }
    public set tileSize(val) {
        if (this.autoTileSize) return;
        this._tileSize = this.setVal(val);
    }

    /**
     * 设置 大于0的整数 值
     * @param val 值
     * @returns 返回值
     */
    private setVal(val: number) { return Math.floor(val < 1 ? 1 : val); }
    /**
     * 设置瓦片尺寸
     * @param val 尺寸
     */
    private setTileSize(val: number) { this._tileSize = this.setVal(val); this.tileSize = this._tileSize; }

    /**
     * 设置GUI
     * @returns 
     */
    private async setGUI() {
        await datGui.init();
        if (!dat) return;
        const app = m4m.framework.sceneMgr.app;
        //
        app.showFps();
        app.showDrawCall();
        //
        const obj = {
            isOnFPS: true,
            swFPS: () => {
                (obj.isOnFPS = !obj.isOnFPS) ? app.showFps() : app.closeFps();
            },
            isOnDCall: true,
            swDC: () => {
                (obj.isOnDCall = !obj.isOnDCall) ? app.showDrawCall() : app.closeDrawCall();
            }

        };

        let gui = new dat.GUI();
        gui.add(obj, `swFPS`).name(`FPS 开关`);
        gui.add(obj, `swDC`).name(`drawcall 开关`);
        gui.add(this, `autoTileSize`).name(`单元像素自动`).listen();
        gui.add(this, `tileSize`).name(`瓦片单元像素尺寸`).listen();
        gui.add(this, `imgToAtlas`).name(`优化成图集`).listen();
        gui.add(this, `selectWFC2DRes`, this.WFC2DResList).name(`选择资源`);
        gui.add(this, `currWFC2DRes`).name(`资源名`).listen();
        gui.add(this, `mapWidth`).name(`地图宽`).listen();
        gui.add(this, `mapHeigth`).name(`地图高`).listen();
        let wfcPs = gui.addFolder(`WFC2D 生成参数`);
        wfcPs.add(this, `backOffMaxNum`, 0).name(`最大回退次数`);
        wfcPs.add(this, `capQueueMaxLen`, 0).name(`回退缓存次数`);
        wfcPs.add(this, `capRate`, 0, 1, 0.001).name(`缓存率`).listen();
        wfcPs.close();
        gui.add(this, `genBG`).name(`生成`);

    }

    /**
     * 获取WFC 资源
     * @param res 资源名
     * @returns 返回的 Promise<> 异步资源
     */
    private async getWFCRes(res: string) {
        //得到配置对象 (xxxloadJson 替换成自己的加载json的函数)
        let textRes = await util.loadRes<m4m.framework.textasset>(`${resRootPath}wfc2d/${res}/data.json`);
        let jsonObj = JSON.parse(textRes.content);
        return jsonObj;
    }

    /**
     * 构建一个 tile node
     * @param size 
     * @param img 
     * @param rotate 
     */
    private makeTile(size: number, img: m4m.framework.texture, rotate: number)
    private makeTile(size: number, img: m4m.framework.sprite, rotate: number)
    private makeTile(size: number, img: m4m.framework.texture | m4m.framework.sprite, rotate: number) {
        let result: m4m.framework.IRectRenderer;
        let node: m4m.framework.transform2D;
        if (img instanceof m4m.framework.texture) {
            node = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.RawImage2D);
            let rawImg = node.getComponent("rawImage2D") as m4m.framework.rawImage2D;
            rawImg.image = img;
            result = rawImg;
        } else {
            node = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D);
            let img2d = node.getComponent("image2D") as m4m.framework.image2D;
            img2d.sprite = img;
            result = img2d;
        }
        //
        node.width = size;
        node.height = size;
        node.localRotate = rotate * 90 * m4m.math.DEG2RAD;
        node.pivot = new m4m.math.vector2(0.5, 0.5);
        return result;
    }

    /**
     * 组和成一个BG
     * @param tileData      tile一维矩阵信息
     * @param imgNameResMap 图名和资源容器
     * @param w 
     * @param h 
     */
    private combinationGB(tileData: [string, number][], imgNameResMap: Map<string, m4m.framework.texture>, w: number, h: number)
    private combinationGB(tileData: [string, number][], imgNameResMap: Map<string, m4m.framework.sprite>, w: number, h: number)
    private combinationGB(tileData: [string, number][], imgNameResMap: Map<string, m4m.framework.texture> | Map<string, m4m.framework.sprite>, w: number, h: number): m4m.framework.transform2D {
        if (!tileData) return null;
        let tileSize = this._tileSize;
        let result = new m4m.framework.transform2D();
        result.name = `${this.currWFC2DRes}_bg_root`;
        result.width = tileSize * this._mapWidth;
        result.height = tileSize * this._mapHeigth;

        //绘制地图的每个瓦片
        let count = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let imgData = tileData[count++];
                //图片资源名 , 类型 string
                let imgName = imgData[0];
                //图片顺时针旋转次数（每次90度）, 类型 number 
                let rotate = imgData[1];
                //绘制 一个 瓦片到容器  (xxxDrawTile 替换成自己的绘制函数)
                let _img = imgNameResMap.get(imgName);
                let _2dImg = this.makeTile(tileSize, _img as any, rotate);
                _2dImg.transform.localTranslate.x = x * tileSize;
                _2dImg.transform.localTranslate.y = y * tileSize;
                result.addChild(_2dImg.transform);
            }
        }
        return result;
    }

    /** 生成 背景图 */
    private async genBG() {

        //先清理历史
        this.releaseHistory();
        //
        let jsonConf: WFC.wfc2dData = await this.getWFCRes(this.currWFC2DRes);
        //加载所需要的图资源
        let imgURLs: string[] = [];
        let tiles = jsonConf.tiles;
        let imgNames: string[] = [];
        for (const key in tiles) {
            if (Object.prototype.hasOwnProperty.call(tiles, key)) {
                const element = tiles[key];
                imgURLs.push(`${resRootPath}wfc2d/${this.currWFC2DRes}/${key}${element[0]}`);
                imgNames.push(key);
            }
        }

        //创建 WFC2D
        let wfc2d = new WFC.WFC2D(jsonConf);
        //计算生成 地图数据 ，返回数据类型 数组 [[string,number],.....]
        let resultMap: [string, number][];
        try {
            resultMap = await wfc2d.collapse(this._mapWidth, this._mapHeigth, this.backOffMaxNum, this.capQueueMaxLen, this.capRate);
        } catch (err) {
            alert(`生成失败 \nWFC 算法是不保证成功的 \n对于不同的资源成功率也不一样 \n想要提高成功率可以尝试修改 “WFC2D 生成参数” 设置`);
            return;
        }

        if (this.imgToAtlas) {
            //图集模式 ，使用 Image2D ，UI drawCall 少 ，会合批
            this.makeBGByImg(resultMap, imgURLs);
        } else {
            //单图模式 ，使用 RawImage ，UI drawCall 多
            this.makeBGByRawImg(resultMap, imgURLs, imgNames);
        }

    }

    /**
     * 通过 raw纹理数据 创建 背景图
     * @param wfc2dReslutMap wfc 计算输出的结果数据
     * @param imgURLs raw纹理 url 链接列表
     * @param imgNames raw纹理 名 列表
     */
    private async makeBGByRawImg(wfc2dReslutMap: [string, number][], imgURLs: string[], imgNames: string[]) {
        //加载所有的单图成引擎纹理
        let imgs = await util.loadTextures(imgURLs, m4m.framework.sceneMgr.app.getAssetMgr());
        if (this.autoTileSize && imgs.length > 0) {
            this.setTileSize(imgs[0].glTexture.width);
        }
        let imgNameResMap: Map<string, m4m.framework.texture> = new Map();
        for (let i = 0, len = imgs.length; i < len; i++) {
            imgNameResMap.set(imgNames[i], imgs[i]);
        }

        //组合成BG
        let genBG = this.combinationGB(wfc2dReslutMap, imgNameResMap, this._mapWidth, this._mapHeigth);
        //挂载到场景
        this.bgRoot.addChild(genBG);
    }

    /**
     * 通过 raw纹理 创建 背景图
     * @param wfc2dReslutMap wfc 计算输出的结果数据
     * @param imgURLs raw纹理 url 链接列表
     */
    private async makeBGByImg(wfc2dReslutMap: [string, number][], imgURLs: string[]) {
        //生成 图集
        let atlas = await util.imageMergeToAtlas(imgURLs);
        let sps = atlas.sprites;
        let imgNameResMap: Map<string, m4m.framework.sprite> = new Map();
        let hasSetTileSize = false;
        for (const key in sps) {
            if (Object.prototype.hasOwnProperty.call(sps, key)) {
                const element = sps[key];
                imgNameResMap.set(key, element);

                if (this.autoTileSize && !hasSetTileSize) {
                    this.setTileSize(element.rect.w);
                    hasSetTileSize = true;
                }
            }
        }
        //组合成BG
        let genBG = this.combinationGB(wfc2dReslutMap, imgNameResMap, this._mapWidth, this._mapHeigth);
        //挂载到场景
        this.bgRoot.addChild(genBG);
    }

    /**
     * 清理历史
     */
    private releaseHistory() {
        this.bgRoot.removeAllChild(true);
    }

    async start(app: m4m.framework.application) {
        //初始化
        let scene = app.getScene();

        //相机
        let objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10;

        //2dUI root
        this.rooto2d = new m4m.framework.overlay2D();
        this.camera.addOverLay(this.rooto2d);

        //node root
        this.bgRoot = new m4m.framework.transform2D();
        this.bgRoot.name = `bgRoot`;
        this.rooto2d.addChild(this.bgRoot);

        //load js
        // await util.loadJSLib(`./lib/dat.gui.js`);
        await util.loadJSLib(`./lib/wfc2D.js`);

        //init gui
        this.setGUI();

        //先生成一个
        this.genBG();
    }

    update(delta: number) {
    }

}