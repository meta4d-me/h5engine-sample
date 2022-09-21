type UIElement = { atlas: string, spRes: string, w: number, h: number };

/**
 * UI 渲染使用 纹理数组 样例（webgl2 特性优化尝试）
 */
class test_UI_Texture_Array implements IState {
    private normalRoot: m4m.framework.transform2D;
    private textureArrayRoot: m4m.framework.transform2D;
    private app: m4m.framework.application;
    private scene: m4m.framework.scene;
    private camera: m4m.framework.camera;
    private rooto2d: m4m.framework.overlay2D;
    private readonly atlasNames = ["TA_NUMs", "TA_UIs", "TA_ICON"];
    private atlasMap: { [res: string]: m4m.framework.atlas } = {};
    private atlasPath = `${resRootPath}atlas/`;
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

    private async loadAtlas(resName: string): Promise<m4m.framework.atlas> {
        const imgFile = `${this.atlasPath}${resName}/${resName}.png`;
        const jsonFile = `${this.atlasPath}${resName}/${resName}.atlas.json`;

        const _img = await util.loadRes<m4m.framework.texture>(imgFile);
        const _atlas = await util.loadRes<m4m.framework.atlas>(jsonFile);
        _atlas.texture = _img;
        return _atlas;
    }

    private switchUIMode(texArrayMode: boolean) {
        this.textureArrayRoot.visible = false;
        this.normalRoot.visible = false;

        if (texArrayMode) {
            this.textureArrayRoot.visible = true;
        } else {
            this.normalRoot.visible = true;
        }
    }

    private randomMakeUI() {
        //随机创建 UI
        const count = 100;
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
            //创建 UI
            //normal UI
            const nUINode = this.makeUI(sp, ele.w, ele.h);
            this.normalRoot.addChild(nUINode);
            //textureArray UI
            const tUINode = this.makeTexArrayUI();
            this.textureArrayRoot.addChild(tUINode);

            //修改 RTS
            [nUINode, nUINode].forEach(n => {
                m4m.math.vec2Set(n.localTranslate, x, y);
                n.localRotate = angle;
            });
        }
    }

    private makeUI(sp: m4m.framework.sprite, w: number, h: number) {
        const result = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D);
        const img = result.getComponent("image2D") as m4m.framework.image2D;
        img.sprite = sp;
        result.width = w;
        result.height = h;
        return result;
    }

    private makeTexArrayUI() {
        const result = new m4m.framework.transform2D();

        return result;
    }

    private makeTexArraySahder(): m4m.framework.shader {
        const shKey = `_texArray`;
        const sh = new m4m.framework.shader(`shader/${shKey}`);

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
            uniform highp mat4 glstate_matrix_mvp;       
            out lowp vec4 xlv_COLOR;                 
            out highp vec2 xlv_TEXCOORD0;            
            void main()                                      
            {                                                
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

        uniform sampler2D _MainTex;
        in lowp vec4 xlv_COLOR;
        in highp vec2 xlv_TEXCOORD0;
        out vec4 color;
        void main()
        {
            lowp vec4 tmpvar_3;
            tmpvar_3 = (xlv_COLOR * texture(_MainTex, xlv_TEXCOORD0));
            color = tmpvar_3;
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

        return sh;
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
        });

        //创建 UI
        this.randomMakeUI();
        //
        this.switchUIMode(false);
    }

    update(delta: number) {

    }

}