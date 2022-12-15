class test_ShaderToy_Player implements IState {
    private res = `happyJumping`;
    private resList = [
        `happyJumping`,
        `PlanetShadertoy`,
        `ProteanClouds`,
        `raymarchingPrimitives`
    ];
    async start(app: m4m.framework.application) {
        await datGui.init();
        // //加载 数据

        // // const resName = `happyJumping`;
        // // const resName = `PlanetShadertoy`;
        // // const resName = `ProteanClouds`;
        // const resName = `raymarchingPrimitives`;
        // const url = `${resRootPath}sToy/${resName}/`;
        // const sToyData = await shaderToyData.Load(url);
        // const sToyNode = new m4m.framework.transform();
        // sToyNode.name = `sToyNode`;
        // const sToyPlayer = sToyNode.gameObject.addComponent("shaderToyPlayer") as shaderToyPlayer;
        // sToyPlayer.stoyData = sToyData;
        // m4m.framework.sceneMgr.scene.addChild(sToyNode);

        //gui
        this.setGUI();
    }

    private setGUI() {
        if (!dat) return;
        let gui = new dat.GUI();
        let title = { str: "shaderToy" };
        gui.add(title, "str");
        //force
        gui.add(this, "res", this.resList).name(`资源`);
        //方法
        gui.add(this, "change").name(`加载替换资源`);
    }

    async change() {
        this.clearScene();
        this.addCam();
        await this.loadToScene(this.res);
    }

    async loadToScene(fileName: string) {
        const url = `${resRootPath}sToy/${fileName}/`;
        const sToyData = await shaderToyData.Load(url);
        const sToyNode = new m4m.framework.transform();
        sToyNode.name = `sToyNode`;
        const sToyPlayer = sToyNode.gameObject.addComponent("shaderToyPlayer") as shaderToyPlayer;
        sToyPlayer.stoyData = sToyData;
        m4m.framework.sceneMgr.scene.addChild(sToyNode);
    }

    private addCam() {
        const scene = m4m.framework.sceneMgr.scene;
        //添加一个摄像机
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
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0)
    }

    private clearScene() {
        const scene = m4m.framework.sceneMgr.scene;
        scene.getRoot().removeAllChild();
    }



    update(delta: number) {

    }
}

/** stoy单元 */
type SToyUint = { code: string, ich0?, ich1?, ich2?, ich3?};

/**
 * shaderToy 数据
 */
class shaderToyData {
    private static _instanceCount = 0;
    public Image: SToyUint = { code: "" };
    public Common?: string;
    public CubeA?: SToyUint;
    public BufferA?: SToyUint;
    public BufferB?: SToyUint;
    public BufferC?: SToyUint;
    public BufferD?: SToyUint;
    private _instanceID: number;
    private _shader: m4m.framework.shader;

    private static readonly INSERT_TAG = `//=#*INSERT_LOCATION*#=`;
    private static readonly STOY_VS_KEY = `stoy_base_vs`;
    private static _inited = false;
    private static _stoyMesh: m4m.framework.mesh;
    //基础的 VS
    private static baseVS = `#version 300 es
        #ifdef GL_ES
            precision highp float;
            precision highp int;
            precision mediump sampler3D;
        #endif
        // in vec2 a_Position; //顶点 位置 是有默认值的 (0,0,0,1)
        layout(location = 0) in highp vec3 _glesVertex;
        void main() {
            gl_Position = vec4(_glesVertex.xy, 0.0 , 1.0);
        }
    `;
    //基础的FS
    private static baseFS = `#version 300 es
        #ifdef GL_ES
            precision highp float;
            precision highp int;
            precision mediump sampler3D;
        #endif
        #define HW_PERFORMANCE 1

        out vec4 color;
        //uniforms
        uniform vec4      iResolution;
        uniform float     iTime;
        //uniform float     iChannelTime[4];
        uniform vec4      iMouse;
        //uniform vec4      iDate;
        //uniform float     iSampleRate;
        //uniform vec3      iChannelResolution[4];
        uniform int       iFrame;
        uniform float     iTimeDelta;

        //=#*INSERT_LOCATION*#=

        void main(){
            // color = vec4(0.0 , 1.0 , 0.0 , 1.0);
            vec4 col = vec4(0.0 , 0.0 , 0.0 , 1.0);
            mainImage(col , gl_FragCoord.xy);
            color = col;
        }
    `;

    private static sToyTest = `
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = fragCoord/iResolution.xy;
    
        // Time varying pixel color
        vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    
        // Output to screen
        fragColor = vec4(col,1.0);
    }
    `;

    /** stoy mesh */
    public static get stoyMesh() { return this._stoyMesh; }
    /** 对象实例ID */
    public get instanceID() { return this._instanceID; }
    /** 着色器 */
    public get shader() { return this._shader; }

    private static init() {
        if (this._inited) return;
        this._inited = true;
        const app = m4m.framework.sceneMgr.app;
        const gl = app.webgl;
        const pool = app.getAssetMgr().shaderPool;
        pool.compileVS(gl, this.STOY_VS_KEY, this.baseVS);
        //
        this._stoyMesh = this.genSToyMesh();
    }

    constructor() {
        shaderToyData.init();
        this._instanceID = shaderToyData._instanceCount++;
    }

    public static async Load(resUrl: string) {
        const loadRes = <T>(url: string, _type = m4m.framework.AssetTypeEnum.Auto) => {
            const mgr = m4m.framework.sceneMgr.app.getAssetMgr();
            return new Promise<T>((res) => {
                mgr.load(url, _type, () => {
                    res(mgr.getAssetByName(url.split('/').pop()) as any);
                });
            });
        }
        //加载 json 数据
        //解析
        const text = await loadRes<m4m.framework.textasset>(`${resUrl}stoyconfig.json`, m4m.framework.AssetTypeEnum.TextAsset);
        if (!text) return;
        const jsonObj = JSON.parse(text.content);
        const { files, data } = jsonObj;
        const { texts } = files;
        //加载所有的 text
        let textAssets: m4m.framework.textasset[] = [];
        if (texts) {
            const _textPs: Promise<m4m.framework.textasset>[] = [];
            const textUrls = (texts as string[]);
            for (let i = 0, len = textUrls.length; i < len; i++) {
                const url = textUrls[i];
                const _p = loadRes<m4m.framework.textasset>(`${resUrl}${url}`, m4m.framework.AssetTypeEnum.TextAsset);
                _textPs.push(_p);
            }
            textAssets = await Promise.all(_textPs);
        }
        //处理 data
        const result: shaderToyData = new shaderToyData();
        const { Image, Common, CubeA, BufferA, BufferB, BufferC, BufferD } = data;

        if (Image) {
            const d_image = result.Image;
            const { code } = Image;
            if (code != null && textAssets[code]) {
                d_image.code = textAssets[code].content;
            }
        }

        //构建着色器
        this.makeShader(result);

        return result;
    }

    /** 构建着色器 */
    private static makeShader(data: shaderToyData) {
        const app = m4m.framework.sceneMgr.app;
        const gl = app.webgl;
        const assetMgr = app.getAssetMgr();
        const pool = assetMgr.shaderPool;
        const key = `stoy_${data.instanceID}`;
        //
        let insertCode = "";
        insertCode += data.Image.code;
        //拼接shader , 组装 glProgram
        // let vs_code: string = shaderToyData.baseVS;
        let fs_code: string = shaderToyData.baseFS.replace(shaderToyData.INSERT_TAG, insertCode);
        // let fs_code: string = shaderToyData.baseFS.replace(shaderToyData.INSERT_TAG, this.sToyTest);
        pool.compileFS(gl, key, fs_code);

        //program
        let program = pool.linkProgram(gl, this.STOY_VS_KEY, key);

        //shader 处理
        let sh = new m4m.framework.shader(key);
        sh.passes["base"] = [];
        let p = new m4m.render.glDrawPass();
        sh.passes["base"].push(p);
        p.setProgram(program);
        sh.fillUnDefUniform(p);
        p.state_ztest = false;
        p.state_zwrite = true;
        p.state_showface = m4m.render.ShowFaceStateEnum.ALL;
        sh.layer = m4m.framework.RenderLayerEnum.Overlay;
        assetMgr.mapShader[sh.getName()] = sh;

        //
        data._shader = sh;
    }

    /** 生成 stoyMesh */
    private static genSToyMesh(): m4m.framework.mesh {
        const data = new m4m.render.meshData();
        data.pos = [];
        data.trisindex = [];

        //准备顶点数据
        //什么只有一个三角形? 我们只需像素渲染覆盖全屏（一个大三角形足以），只需要使用 gl_FragCoord + iResolution 来算定位像素UV。
        //        0
        //      /   \
        //     /     \
        //   2 ------- 1
        //
        data.pos.push(new m4m.math.vector3(0, 3, 0));
        data.pos.push(new m4m.math.vector3(2, -1, 0));
        data.pos.push(new m4m.math.vector3(-2, -1, 0));

        const gl = m4m.framework.sceneMgr.app.webgl;

        const _mesh = new m4m.framework.mesh(`stoyMesh`);
        _mesh.data = data;
        var vf = m4m.render.VertexFormatMask.Position;
        _mesh.data.originVF = vf;
        var v32 = _mesh.data.genVertexDataArray(vf);
        // var i16 = _mesh.data.genIndexDataArray();

        _mesh.glMesh = new m4m.render.glMesh();
        _mesh.glMesh.initBuffer(gl, vf, _mesh.data.getVertexCount());
        _mesh.glMesh.uploadVertexData(gl, v32);

        // _mesh.glMesh.addIndex(gl, i16.length);
        // _mesh.glMesh.uploadIndexData(gl, 0, i16);
        _mesh.glMesh.initVAO();
        _mesh.submesh = [];
        {
            var sm = new m4m.framework.subMeshInfo();
            sm.matIndex = 0;
            sm.useVertexIndex = -1;
            sm.start = 0;
            sm.size = 3;
            sm.line = false;
            _mesh.submesh.push(sm);
        }

        return _mesh;
    }
}

/**
 * ShaderToy 播放器
 */
@m4m.reflect.nodeRender
@m4m.reflect.nodeComponent
class shaderToyPlayer implements m4m.framework.IRenderer {
    public layer = m4m.framework.RenderLayerEnum.Overlay;
    public queue: number = 0;
    public gameObject: m4m.framework.gameObject;

    private _stoyData: shaderToyData;
    private _stoyMaterial = new m4m.framework.material(`stoyMaterial`);
    private _renderTarget: m4m.render.glRenderTarget;
    private _iResolution = new m4m.math.vector4();
    private _totalTimeSec = 0;
    private _frame = 0;
    private _iMouse = new m4m.math.vector4();

    get renderLayer() { return this.gameObject.layer; }
    set renderLayer(layer: number) {
        this.gameObject.layer = layer;
    }

    /** renderTarget */
    public get renderTarget() { return this._renderTarget; };

    /** shaderToy 数据 */
    public get stoyData() { return this._stoyData; }
    public set stoyData(val) {
        if (this._stoyData == val) return;
        this._stoyData = val;
        if (this._stoyMaterial.getShader() != val.shader) {
            this._stoyMaterial.setShader(val.shader);
        }
    }

    render(context: m4m.framework.renderContext, assetmgr: m4m.framework.assetMgr, camera: m4m.framework.camera) {
        if (!this._stoyData) return;
        const gl = context.webgl;
        const app = m4m.framework.sceneMgr.app;
        const dt = app.deltaTime;
        const sh = this._stoyData.shader;
        const mesh = shaderToyData.stoyMesh;
        const mtr: m4m.framework.material = this._stoyMaterial;
        //gl 状态
        gl.hint(gl.FRAGMENT_SHADER_DERIVATIVE_HINT, gl.NICEST);

        //更新 材质参数

        m4m.math.vec4Set(this._iResolution, gl.canvas.width, gl.canvas.width, 1, 0);
        mtr.setVector4(`iResolution`, this._iResolution);
        this._totalTimeSec += dt;
        mtr.setFloat(`iTime`, this._totalTimeSec);
        mtr.setFloat(`iTimeDelta`, dt);
        mtr.setInt(`iFrame`, this._frame);
        mtr.setVector4(`iMouse`, this._iMouse);

        this._frame++;
        //启用FBO

        //渲染提交
        mtr.draw(context, mesh, mesh.submesh[0], `base`);

        //关闭FBO
    }

    onPlay() { }

    start() { }

    update(delta: number) {
    }

    remove() {

    }
}