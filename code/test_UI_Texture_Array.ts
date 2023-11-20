type UIElement = { atlas: string, spRes: string, w: number, h: number };

/**
 * UI 渲染使用 纹理数组 样例（webgl2 特性优化尝试）
 */
class test_UI_Texture_Array implements IState {
    private readonly texArrShaderName = `shader/texArrayImg`;
    private readonly atlasNames = ["TA_NUMs", "TA_UIs", "TA_ICON"];
    private readonly makeUICount = 1500;    //创建的UI 的数量
    private normalRoot: m4m.framework.transform2D;
    private textureArrayRoot: m4m.framework.transform2D;
    private app: m4m.framework.application;
    private scene: m4m.framework.scene;
    private camera: m4m.framework.camera;
    private rooto2d: m4m.framework.overlay2D;
    private atlasMap: { [res: string]: m4m.framework.atlas } = {};
    private atlasArray: m4m.framework.atlas[] = [];
    private atlasPath = `${resRootPath}atlas/`;
    private cacheTexArray: m4m.framework.texture;
    private cacheAtlasTexs: m4m.framework.texture[] = [];
    private _isTexArrayUIMode = true;
    private get isTexArrayUIMode() { return this._isTexArrayUIMode; }
    private set isTexArrayUIMode(val: boolean) {
        if (this._isTexArrayUIMode == val) return;
        this._isTexArrayUIMode = val;
        this.switchUIMode(this._isTexArrayUIMode);
    }

    //需要使用到的 sprite
    private UITempletes: UIElement[] = [
        { atlas: "TA_NUMs", spRes: "ui_lianji_0", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_1", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_2", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_3", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_4", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_5", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_6", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_7", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_8", w: 32, h: 42 },
        { atlas: "TA_NUMs", spRes: "ui_lianji_9", w: 32, h: 42 },
        { atlas: "TA_UIs", spRes: "bg", w: 100, h: 79 },
        { atlas: "TA_UIs", spRes: "ui_boundary_close", w: 25, h: 25 },
        { atlas: "TA_UIs", spRes: "ui_boundary_close_in", w: 25, h: 25 },
        { atlas: "TA_UIs", spRes: "ui_public_button_1", w: 135, h: 54 },
        { atlas: "TA_UIs", spRes: "ui_public_button_hits", w: 135, h: 54 },
        { atlas: "TA_UIs", spRes: "ui_public_input", w: 39, h: 28 },
        { atlas: "TA_ICON", spRes: "zg03", w: 180, h: 180 },
    ];

    /**
     * 加载altas
     * @param resName 资源名
     * @returns 
     */
    private async loadAtlas(resName: string): Promise<m4m.framework.atlas> {
        const imgFile = `${this.atlasPath}${resName}/${resName}.png`;
        const jsonFile = `${this.atlasPath}${resName}/${resName}.atlas.json`;

        const _img = await util.loadRes<m4m.framework.texture>(imgFile);
        const _atlas = await util.loadRes<m4m.framework.atlas>(jsonFile);
        _atlas.texture = _img;
        return _atlas;
    }



    /**
     * 切换UI 模式
     * @param texArrayMode 纹理数组 模式？
     */
    private switchUIMode(texArrayMode: boolean) {
        this.textureArrayRoot.visible = false;
        this.normalRoot.visible = false;
        const spTexSet = (a: m4m.framework.atlas, tex: m4m.framework.texture) => {
            a.texture = tex;
            for (const k in a.sprites) {
                const sp = a.sprites[k];
                sp.texture = tex;
            }
        }
        //go 切换
        if (texArrayMode) {
            this.textureArrayRoot.visible = true;
            //纹理切换
            this.atlasArray.forEach(a => {
                spTexSet(a, this.cacheTexArray);
            });
        } else {
            this.normalRoot.visible = true;
            //纹理切换
            this.atlasArray.forEach((a, i) => {
                spTexSet(a, this.cacheAtlasTexs[i]);
            });
        }
    }

    /**
     * 随机创建UI节点
     */
    private randomMakeUI() {
        //随机创建 UI
        const count = this.makeUICount;
        const range = 800;

        for (let i = 0; i < count; i++) {
            //位置
            const x = Math.floor(range * Math.random());
            const y = Math.floor(range * Math.random());
            //旋转
            const angle = 360 * Math.random();
            //元素
            const ele = this.UITempletes[Math.floor(this.UITempletes.length * Math.random())];

            const atlas = this.atlasMap[ele.atlas];
            const sp = atlas.sprites[ele.spRes];
            const texArrIndex = this.atlasNames.indexOf(ele.atlas);

            //创建 UI
            //normal UI
            const nUINode = this.makeUI(sp, ele.w, ele.h);
            this.normalRoot.addChild(nUINode);
            //textureArray UI
            const tUINode = this.makeTexArrayUI(sp, ele.w, ele.h, texArrIndex);
            this.textureArrayRoot.addChild(tUINode);

            //修改 RTS
            [nUINode, tUINode].forEach(n => {
                m4m.math.vec2Set(n.localTranslate, x, y);
                n.localRotate = angle;
            });
        }
    }

    /**
     * 创建普通UI
     * @param sp sprite资源
     * @param w 宽
     * @param h 高
     * @returns UI节点
     */
    private makeUI(sp: m4m.framework.sprite, w: number, h: number) {
        const result = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D);
        const img = result.getComponent("image2D") as m4m.framework.image2D;
        img.sprite = sp;
        result.width = w;
        result.height = h;
        m4m.math.vec2SetAll(result.pivot, 0.5);
        return result;
    }

    /**
     * 创建纹理数组模式UI
     * @param sp sprite资源
     * @param w 宽
     * @param h 高
     * @param texIndex 纹理索引
     * @returns 
     */
    private makeTexArrayUI(sp: m4m.framework.sprite, w: number, h: number, texIndex: number = 0) {
        const result = new m4m.framework.transform2D();
        const texArrImg = result.addComponent("texArrImage2D") as texArrImage2D;
        texArrImg.setShaderByName(this.texArrShaderName);
        texArrImg.sprite = sp;
        texArrImg.texArrayIndex = texIndex;
        result.width = w;
        result.height = h;
        m4m.math.vec2SetAll(result.pivot, 0.5);
        return result;
    }

    /**
     * 创建shader
     * @returns 着色器
     */
    private makeTexArraySahder(): m4m.framework.shader {
        const shKey = `texArrayImg`;
        const sh = new m4m.framework.shader(this.texArrShaderName);
        const gl = m4m.framework.sceneMgr.app.webgl;

        const shaderJson: string = `{
                "properties": [
                "_MainTex('MainTex',Texture)='white'{}",
                "_MaskTex('MaskTex',Texture)='white'{}"
                ]
            }
        `;

        const vs = `#version 300 es
            precision mediump float;

            layout(location = 0) in vec3 _glesVertex;    
            layout(location = 3) in vec4 _glesColor;                   
            layout(location = 4) in vec4 _glesMultiTexCoord0; 
            layout(location = 8) in vec4 _glesColorEx;                   

            uniform highp mat4 glstate_matrix_mvp;       
            out lowp vec4 xlv_COLOR;                 
            out highp vec2 xlv_TEXCOORD0;
            out float v_texArrIndex;
            void main()                                      
            {                           
                v_texArrIndex = _glesColorEx.w;                  
                highp vec4 tmpvar_1;                         
                tmpvar_1.w = 1.0;                            
                tmpvar_1.xyz = _glesVertex.xyz;              
                xlv_COLOR = _glesColor;                      
                xlv_TEXCOORD0 = vec2(_glesMultiTexCoord0.x,1.0-_glesMultiTexCoord0.y);      
                gl_Position = (glstate_matrix_mvp * tmpvar_1);   
            }
        `;

        const fs = `#version 300 es
            precision mediump float;
            precision mediump sampler2DArray;

            // uniform sampler2D _MainTex;
            uniform sampler2DArray _MainTex;
            in lowp vec4 xlv_COLOR;
            in highp vec2 xlv_TEXCOORD0;
            in float v_texArrIndex;
            out vec4 color;
            void main()
            {
                lowp vec4 _color;
                // _color = (xlv_COLOR * texture(_MainTex, xlv_TEXCOORD0));
                _color = (xlv_COLOR * texture(_MainTex, vec3(xlv_TEXCOORD0 , v_texArrIndex)));
                color = _color;
            }
            `;

        //
        const assetMgr = m4m.framework.sceneMgr.app.getAssetMgr();
        const pool = assetMgr.shaderPool;
        pool.compileVS(assetMgr.webgl, shKey, vs);
        pool.compileFS(assetMgr.webgl, shKey, fs);
        const program = pool.linkProgram(assetMgr.webgl, shKey, shKey);

        //
        sh.defaultAsset = true;
        sh.passes["base"] = [];
        const p = new m4m.render.glDrawPass();
        p.setProgram(program);
        sh.passes["base"].push(p);
        sh.fillUnDefUniform(p);
        sh._parseProperties(assetMgr, JSON.parse(shaderJson).properties);
        p.state_showface = m4m.render.ShowFaceStateEnum.ALL;
        p.state_ztest = false;
        p.state_zwrite = false;
        p.state_ztest_method = m4m.render.webglkit.LEQUAL;
        p.setAlphaBlend(m4m.render.BlendModeEnum.Blend);
        assetMgr.mapShader[sh.getName()] = sh;

        //（取巧操作 ，整合到引擎需要调整）-----------------------
        //smp2dArray type 
        let texArray = m4m.render.UniformTypeEnum.CubeTexture + 1;
        //
        const mainTexUnif = p.mapuniforms[`_MainTex`];
        mainTexUnif.type = texArray;
        //
        const applyObj = m4m.render.shaderUniform;
        //增加处理方法
        applyObj.applyuniformFunc[texArray] = (location, value) => {
            let tex = value.glTexture.texture;
            gl.activeTexture(m4m.render.webglkit.GetTextureNumber(applyObj.texindex));
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
            gl.uniform1i(location, applyObj.texindex);
            applyObj.texindex++;
        };

        //----------------------------------------------------

        return sh;
    }

    /**
     * 从assetMgr 获取需要的 htmlImage 图片 （取巧操作 ，整合到引擎需要调整）
     * @returns html image 对象
     */
    private getHtmlImageMap() {
        let _limit = {};
        let _map: { [imgN: string]: HTMLImageElement } = {};
        let nullObj = {};
        this.atlasNames.forEach(n => {
            _limit[n] = nullObj;
            _map[n] = null;
        });
        const mapLoding = m4m.framework.assetMgr.mapLoading;
        const mapImg = m4m.framework.assetMgr.mapImage;
        for (const k in mapLoding) {
            const val = mapLoding[k];
            if (val.url.lastIndexOf(`.png`) == -1) continue;
            let fileName = val.url.substring(val.url.lastIndexOf(`/`) + 1);
            fileName = fileName.substring(0, fileName.indexOf("."));
            if (_limit[fileName]) {
                _map[fileName] = mapImg[k] as HTMLImageElement;
            }
        }
        return _map;
    }

    /**
     * 创建texture2D 纹理
     * @param texMap 纹理字典
     * @returns 纹理
     */
    private makeTex2dArray(texMap: { [imgN: string]: HTMLImageElement }): m4m.framework.texture {
        let texs: HTMLImageElement[] = [];
        for (let i = 0, len = this.atlasNames.length; i < len; i++) {
            let atlasName = this.atlasNames[i];
            texs.push(texMap[atlasName]);
        }

        const glTex: tex2DArray = new tex2DArray(texs[0].width, texs[0].height);
        glTex.uploadImage(texs);

        const result = new m4m.framework.texture(`tex2dArray`);
        result.glTexture = glTex;

        return result;
    }

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
        gui.add(this, `isTexArrayUIMode`).name(`纹理数组 UI模式`);
    }

    async start(app: m4m.framework.application) {

        //初始化
        this.app = app;
        this.scene = this.app.getScene();

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
        this.rooto2d.addChild(this.normalRoot);
        this.textureArrayRoot = new m4m.framework.transform2D();
        this.textureArrayRoot.name = `textureArrayRoot`;
        this.rooto2d.addChild(this.textureArrayRoot);

        //加载 依赖资源
        const pArr: Promise<m4m.framework.atlas>[] = [];
        this.atlasNames.forEach((name) => {
            pArr.push(this.loadAtlas(name));
        });

        const atlasList = await Promise.all(pArr);
        this.atlasNames.forEach((res, i) => {
            this.atlasMap[res] = atlasList[i];
            this.atlasArray.push(atlasList[i]);
            this.cacheAtlasTexs.push(atlasList[i].texture);
        });

        //make textrue2d array 
        let texMap = this.getHtmlImageMap();
        this.cacheTexArray = this.makeTex2dArray(texMap);
        //

        //创建 texArrImg 着色器
        this.makeTexArraySahder();
        //创建 UI
        this.randomMakeUI();
        //
        this.switchUIMode(true);

        //init gui
        this.setGUI();
    }

    update(delta: number) {

    }

}

@m4m.reflect.node2DComponent
@m4m.reflect.nodeRender
class texArrImage2D implements m4m.framework.IRectRenderer {
    static readonly ClassName: string = "texArrImage2D";

    private _unitLen = 13;
    //2d使用固定的顶点格式
    //pos[0,1,2]color[3,4,5,6]uv[7,8]color2[9,10,11,12] length=13
    private datar: number[] = [
        0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ];

    private _sprite: m4m.framework.sprite;
    private needRefreshImg = false;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 颜色
     * @version m4m 1.0
     */
    @m4m.reflect.Field("color")
    @m4m.reflect.UIStyle("color")
    color: m4m.math.color = new m4m.math.color(1.0, 1.0, 1.0, 1.0);

    private static readonly defUIShader = `shader/defui`;  //非mask 使用shader
    private static readonly defMaskUIShader = `shader/defmaskui`; //mask 使用shader

    private _CustomShaderName = ``;//自定义UIshader
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 设置rander Shader名字
     * @version m4m 1.0
     */
    setShaderByName(shaderName: string) {
        this._CustomShaderName = shaderName;
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 获取rander 的材质
     * @version m4m 1.0
     */
    getMaterial() {
        if (!this._uimat) {
            return this.uimat;
        }
        return this._uimat;
    }

    private _darwRect: m4m.math.rect;

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 获取渲染绘制矩形边界
     * @version m4m 1.0
     */
    getDrawBounds() {
        if (!this._darwRect) {
            this._darwRect = new m4m.math.rect();
            this.calcDrawRect();
        }
        return this._darwRect;
    }

    /**
     * @private
     * ui默认材质
     */
    private _uimat: m4m.framework.material;
    private get uimat() {
        let assetmgr = this.transform.canvas.assetmgr;
        if (!assetmgr) return this._uimat;

        this.searchTexture();
        if (this._sprite && this._sprite.texture) {
            let pMask = this.transform.parentIsMask;
            let mat = this._uimat;
            let rectTag = "";
            let uiTag = "_ui";
            if (pMask) {
                // let prect = this.transform.maskRect;
                // rectTag = `mask(${prect.x}_${prect.y}_${prect.w}_${prect.h})`; //when parentIsMask,can't multiplexing material , can be multiplexing when parent equal

                let rId = this.transform.maskRectId;
                rectTag = `mask(${rId})`;
            }
            let matName = this._sprite.texture.getName() + uiTag + rectTag;
            if (!mat || mat.getName() != matName) {
                if (mat) mat.unuse();
                mat = assetmgr.getAssetByName(matName) as m4m.framework.material;
                if (mat) mat.use();
            }
            if (!mat) {
                mat = new m4m.framework.material(matName);
                let sh = assetmgr.getShader(this._CustomShaderName);
                sh = sh ? sh : assetmgr.getShader(pMask ? texArrImage2D.defMaskUIShader : texArrImage2D.defUIShader);
                mat.setShader(sh);
                mat.use();
                this.needRefreshImg = true;
            }
            this._uimat = mat;
        }
        return this._uimat;
    }

    transform: m4m.framework.transform2D;

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 精灵
     * @version m4m 1.0
     */
    public set sprite(sprite: m4m.framework.sprite) {
        if (sprite == this._sprite) return;

        if (this._sprite) {
            this._sprite.unuse();
        }
        if (!this._sprite || !sprite || this._sprite.texture != sprite.texture) {
            this.needRefreshImg = true;
        }

        this._sprite = sprite;
        if (sprite) {
            this._sprite.use();
            this._spriteName = this._sprite.getName();
            this.prepareData();
            if (this.transform != null) {
                this.transform.markDirty();
                this.updateTran();
            }
        } else {
            this._spriteName = "";
        }

    }
    public get sprite() {
        return this._sprite;
    }

    @m4m.reflect.Field("string")
    private _spriteName: string = "";


    private _texArrayIndex = 0;
    public get texArrayIndex() { return this._texArrayIndex; };
    public set texArrayIndex(val: number) {
        val = isNaN(val) || val == null ? 0 : val;
        if (val == this._texArrayIndex) return;
        this._texArrayIndex = val;
        //刷新数据
        if (this.datar.length != this._unitLen * 6) return;
        for (let i = 0; i < 6; i++) {
            this.datar[(i + 1) * this._unitLen - 1] = this._texArrayIndex;
        }
    };

    /**
     * @private
     */
    render(canvas: m4m.framework.canvas) {
        let mat = this.uimat;
        if (!mat) return;

        let img;
        if (this._sprite && this._sprite.texture) {
            img = this._sprite.texture;
        }

        if (img) {
            let needRMask = false;
            if (this.needRefreshImg) {
                mat.setTexture("_MainTex", img);
                this.needRefreshImg = false;
                needRMask = true;
            }

            if (this.transform.parentIsMask) {
                if (!this._cacheMaskV4) this._cacheMaskV4 = new m4m.math.vector4();
                let rect = this.transform.maskRect;
                if (this._cacheMaskV4.x != rect.x || this._cacheMaskV4.y != rect.y || this._cacheMaskV4.w != rect.w || this._cacheMaskV4.z != rect.h || needRMask) {
                    this._cacheMaskV4.x = rect.x; this._cacheMaskV4.y = rect.y; this._cacheMaskV4.z = rect.w; this._cacheMaskV4.w = rect.h;
                    mat.setVector4("_maskRect", this._cacheMaskV4);
                }
            }

            canvas.pushRawData(mat, this.datar);
        }

    }

    /**
     * 资源管理器中寻找 指定的贴图资源
     */
    private searchTexture() {
        if (this._sprite) return;
        let assetmgr = this.transform.canvas.assetmgr;
        let temp = m4m.framework.assetMgr.mapNamed[this._spriteName];
        let tspr: m4m.framework.sprite;
        if (temp != null) {
            tspr = assetmgr.getAssetByName(this._spriteName) as m4m.framework.sprite;
        } else {
            if (assetmgr.mapDefaultSprite[this._spriteName]) //找默认资源
                tspr = assetmgr.getDefaultSprite(this._spriteName);
        }
        if (tspr) {
            this.sprite = tspr;
            this.needRefreshImg = true;
            return;  //捕获到目标sprite后强制 下一帧渲染 （防止 transform树同步延迟 导致 右上角ghostShadow 问题）
        }
    }

    private _cacheMaskV4: m4m.math.vector4;

    /**
     * @private
     */
    start() {

    }

    onPlay() {

    }

    /**
     * @private
     */
    update(delta: number) {
    }

    /**
     * @private
     */
    remove() {
        if (this._sprite) this._sprite.unuse();
        if (this._uimat) this._uimat.unuse();
        this.datar.length = 0;
        this.transform = null;
    }

    /**
     * 根据显示方式来准备数据
     */
    private prepareData() {
        if (this._sprite == null) return;
        let urange = this._sprite.urange;
        let vrange = this._sprite.vrange;
        const texArrIdx = this._texArrayIndex;
        this.datar = [
            0, 0, 0, 1, 1, 1, 1, urange.x, vrange.x, 1, 1, 1, texArrIdx,
            0, 0, 0, 1, 1, 1, 1, urange.y, vrange.x, 1, 1, 1, texArrIdx,
            0, 0, 0, 1, 1, 1, 1, urange.x, vrange.y, 1, 1, 1, texArrIdx,
            0, 0, 0, 1, 1, 1, 1, urange.x, vrange.y, 1, 1, 1, texArrIdx,
            0, 0, 0, 1, 1, 1, 1, urange.y, vrange.x, 1, 1, 1, texArrIdx,
            0, 0, 0, 1, 1, 1, 1, urange.y, vrange.y, 1, 1, 1, texArrIdx
        ];
    }

    /**
     * 更新 变换组件
     */
    updateTran() {
        var m = this.transform.getWorldMatrix();

        var l = -this.transform.pivot.x * this.transform.width;
        var r = this.transform.width + l;
        var t = -this.transform.pivot.y * this.transform.height;
        var b = this.transform.height + t;

        var x0 = l * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
        var y0 = l * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
        var x1 = r * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
        var y1 = r * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
        var x2 = l * m.rawData[0] + b * m.rawData[2] + m.rawData[4];
        var y2 = l * m.rawData[1] + b * m.rawData[3] + m.rawData[5];
        var x3 = r * m.rawData[0] + b * m.rawData[2] + m.rawData[4];
        var y3 = r * m.rawData[1] + b * m.rawData[3] + m.rawData[5];

        if (this._sprite == null) return;
        this.updateSimpleData(x0, y0, x1, y1, x2, y2, x3, y3);
        //主color
        let vertexCount = this.datar.length / this._unitLen;
        for (var i = 0; i < vertexCount; i++) {
            this.datar[i * this._unitLen + 3] = this.color.r;
            this.datar[i * this._unitLen + 4] = this.color.g;
            this.datar[i * this._unitLen + 5] = this.color.b;
            this.datar[i * this._unitLen + 6] = this.color.a;
        }

        //drawRect 
        this.min_x = Math.min(x0, x1, x2, x3, this.min_x);
        this.min_y = Math.min(y0, y1, y2, y3, this.min_y);
        this.max_x = Math.max(x0, x1, x2, x3, this.max_x);
        this.max_y = Math.max(y0, y1, y2, y3, this.max_y);
        this.calcDrawRect();
    }

    private min_x: number = Number.MAX_VALUE;
    private max_x: number = Number.MAX_VALUE * -1;
    private min_y: number = Number.MAX_VALUE;
    private max_y: number = Number.MAX_VALUE * -1;
    /** 计算drawRect */
    private calcDrawRect() {
        if (!this._darwRect) return;
        //drawBounds (y 轴反向)
        let canvas = this.transform.canvas;
        if (!canvas) return;
        let minPos = m4m.poolv2();
        minPos.x = this.min_x;
        minPos.y = this.max_y;
        canvas.clipPosToCanvasPos(minPos, minPos);

        let maxPos = m4m.poolv2();
        maxPos.x = this.max_x;
        maxPos.y = this.min_y;
        canvas.clipPosToCanvasPos(maxPos, maxPos);

        this._darwRect.x = minPos.x;
        this._darwRect.y = minPos.y;
        this._darwRect.w = maxPos.x - minPos.x;
        this._darwRect.h = maxPos.y - minPos.y;

        this.min_x = this.min_y = Number.MAX_VALUE;
        this.max_x = this.max_y = Number.MAX_VALUE * -1;

        m4m.poolv2_del(minPos);
        m4m.poolv2_del(maxPos);
    }

    /**
     * 更新quad的顶点数据
     */
    private updateQuadData(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, quadIndex = 0, mirror: boolean = false) {
        let _index: number = quadIndex * 6;
        if (!mirror) {
            this.datar[(_index + 0) * this._unitLen] = x0;
            this.datar[(_index + 0) * this._unitLen + 1] = y0;
            this.datar[(_index + 1) * this._unitLen] = x1;
            this.datar[(_index + 1) * this._unitLen + 1] = y1;
            this.datar[(_index + 2) * this._unitLen] = x2;
            this.datar[(_index + 2) * this._unitLen + 1] = y2;
            this.datar[(_index + 3) * this._unitLen] = x2;
            this.datar[(_index + 3) * this._unitLen + 1] = y2;
            this.datar[(_index + 4) * this._unitLen] = x1;
            this.datar[(_index + 4) * this._unitLen + 1] = y1;
            this.datar[(_index + 5) * this._unitLen] = x3;
            this.datar[(_index + 5) * this._unitLen + 1] = y3;
        }
        else {
            this.datar[(_index + 0) * this._unitLen] = x0;
            this.datar[(_index + 0) * this._unitLen + 1] = y0;
            this.datar[(_index + 1) * this._unitLen] = x1;
            this.datar[(_index + 1) * this._unitLen + 1] = y1;
            this.datar[(_index + 2) * this._unitLen] = x3;
            this.datar[(_index + 2) * this._unitLen + 1] = y3;
            this.datar[(_index + 3) * this._unitLen] = x0;
            this.datar[(_index + 3) * this._unitLen + 1] = y0;
            this.datar[(_index + 4) * this._unitLen] = x3;
            this.datar[(_index + 4) * this._unitLen + 1] = y3;
            this.datar[(_index + 5) * this._unitLen] = x2;
            this.datar[(_index + 5) * this._unitLen + 1] = y2;
        }
    }

    /**
     * 更新常规数据
     */
    private updateSimpleData(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        this.updateQuadData(x0, y0, x1, y1, x2, y2, x3, y3);
    }

}

/**
 * 2D 数组纹理
 */
class tex2DArray implements m4m.render.ITexture {
    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.texture = m4m.framework.sceneMgr.app.webgl.createTexture();
    }
    /**
     * 上传纹理到 webgl API
     * @param texs html 纹理数据列表
     */
    uploadImage(texs: HTMLImageElement[]) {
        if (!texs || texs.length < 1) return;
        const w = texs[0].width;
        const h = texs[0].height;
        const len = texs.length;
        const gl = m4m.framework.sceneMgr.app.webgl;
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, w, h, len, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        for (let i = 0; i < len; i++) {
            const tex = texs[i];
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, tex.width, tex.height, 1, gl.RGBA, gl.UNSIGNED_BYTE, tex);
        }

        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    }

    texture: WebGLTexture;
    width: number;
    height: number;
    /**
     * 是FBO ？
     * @returns 
     */
    isFrameBuffer(): boolean {
        return false;
    }
    /**
     * 销毁
     * @param webgl 
     */
    dispose(webgl: WebGL2RenderingContext) {
    }
    /**
     * 计算内存中的数据长度
     * @returns 数据长度
     */
    caclByteLength(): number {
        return 0;
    }

}