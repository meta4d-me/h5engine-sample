type texture = m4m.framework.texture;
/**
 * 高度图地形样例
 */
class test_Heightmap_terrain_v2 implements IState {

    private texs: m4m.framework.texture[];
    private terrainMR: m4m.framework.meshRenderer;
    async start(app: m4m.framework.application) {
        const scene = app.getScene();
        const assetMgr = app.getAssetMgr();
        const gl = app.webgl;
        await datGui.init();
        //initCamera
        let objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        cam.near = 0.01;
        cam.far = 2000;
        cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 480;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0)

        //模型 
        const planeNode = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Plane);
        const planeMR = this.terrainMR = planeNode.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        const planeMF = planeNode.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
        // planeNode.localScale = new m4m.math.vector3(10, 10, 10);
        //加载纹理
        const texNames = [`Heightmap_0.jpg`, `blendMaskTexture.jpg`, `splat_0Tex.png`, `splat_1Tex.png`, `splat_2Tex.png`, `splat_3Tex.png`];
        const texUrl = [];
        texNames.forEach(n => {
            texUrl.push(`${resRootPath}texture/${n}`)
        });
        //加载纹理
        const texs = this.texs = await util.loadTextures(texUrl, assetMgr);
        //加载 shader 包
        await util.loadShader(assetMgr);

        //更换 mesh
        const terrainMesh = test_Heightmap_terrain_v2.genMesh(gl, texs[0], 1000, 1000, 200, 200);
        planeMF.mesh = terrainMesh;

        //材质
        const mtr = planeMR.materials[0];
        //设置terrain材质参数
        // this.setTerrainMaterial(mtr, 200, texs[0], texs[1], texs[2], texs[3], texs[4], texs[5]);

        //添加到场景
        scene.addChild(planeNode);

        //
        this.setGUI();
    }

    setTerrainMaterial(mtr: m4m.framework.material, heightMax: number, heightMap: texture, splatCtr: texture, splat0: texture, splat1: texture, splat2: texture, splat3: texture) {
        let assetMgr = m4m.framework.sceneMgr.app.getAssetMgr();
        //获取 高度图shader
        const tSH = assetMgr.getShader(`terrain_gpu.shader.json`);
        mtr.setShader(tSH);
        //纹理
        mtr.setTexture("_Control", splatCtr);
        mtr.setTexture("_Splat0", splat0);
        mtr.setTexture("_Splat1", splat1);
        mtr.setTexture("_Splat2", splat2);
        mtr.setTexture("_Splat3", splat3);
        //
        mtr.setTexture("_HeightMap", heightMap);
        mtr.setFloat("_HeightMax", heightMax);


        //缩放和平铺
        mtr.setVector4(`_Splat0_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
        mtr.setVector4(`_Splat1_ST`, new m4m.math.vector4(16, 16, 0, 0));
        mtr.setVector4(`_Splat2_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
        mtr.setVector4(`_Splat3_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
    }

    saveData() {
        const texs = this.texs;
        const dataCfg: ITerrainConfig = { version: "1.0" };
        const dataCfgStr = JSON.stringify(dataCfg);
        const hImg: m4m.framework.texture = texs[0];
        const sImg: m4m.framework.texture = texs[1];
        const hImgR = (hImg.glTexture as m4m.render.glTexture2D).getReader(true);
        const sImgR = (sImg.glTexture as m4m.render.glTexture2D).getReader();
        const tDataBin = test_Heightmap_terrain_v2.genTerrainData(dataCfgStr, hImgR.data, sImgR.data);

        //test readData
        const rTd = test_Heightmap_terrain_v2.parseTerrainData(tDataBin);
        const tMR = this.terrainMR;
        const mtr = tMR.materials[0];
        //设置terrain材质参数
        this.setTerrainMaterial(mtr, 200, rTd.heightMap, rTd.splatMap, texs[2], texs[3], texs[4], texs[5]);
        // this.setTerrainMaterial(mtr, 200, texs[0], texs[1], texs[2], texs[3], texs[4], texs[5]);
    }

    setGUI() {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, "saveData").name("保存terrain数据");
    }

    update(delta: number) {

    }

    /**
     * 生成TerrainData
     * @param jsonStr       terrain 设置jason 字符串
     * @param heightMap     高度图纹理
     * @param splatMap      泼绘控制纹理
     * @returns TerrainData二进制数据
     */
    public static genTerrainData(jsonStr: string, heightMap: ArrayBuffer, splatMap: ArrayBuffer) {
        //Terrain 数据格式规划 ，参照 GLB 格式的二进制数据模式做规划
        //固定头部数据：
        //版本
        //总数据长度
        //chunk
        //  当前chunk数据长度
        //  当前chunk数据类型（TYPES_BIN、TYPES_JSON）
        //chunk...
        const VERTION = 1;
        const HEADER_LENGTH = 8;
        const CHUNK_TYPES_JSON = 0;
        const CHUNK_TYPES_BIN_HEIGHTMAP = 1;
        const CHUNK_TYPES_BIN_SPLATMAP = 2;
        let buoy = 0;
        let totalByteLength = 0;
        let jsonBin: Uint8Array;

        const wInfoFun = (len: number, t: number) => {
            dv.setUint32(buoy, len);   //块数据长度
            buoy += 4;
            dv.setUint32(buoy, t);    //块数据类型
            buoy += 4;
        }

        if (jsonStr) {
            let te = new TextEncoder();
            jsonBin = te.encode(jsonStr);
            totalByteLength += jsonBin.byteLength + 8;
        }
        if (heightMap) {
            totalByteLength += heightMap.byteLength + 8;
        }
        if (splatMap) {
            totalByteLength += splatMap.byteLength + 8;
        }

        let result = new ArrayBuffer(HEADER_LENGTH + totalByteLength);
        let ui8View = new Uint8Array(result);
        let dv = new DataView(result);
        //写入数据到buffer
        dv.setUint32(buoy, VERTION);
        buoy += 4;

        dv.setUint32(buoy, totalByteLength);
        buoy += 4;

        //json 二精致数据
        if (jsonBin) {
            wInfoFun(jsonBin.byteLength, CHUNK_TYPES_JSON);

            ui8View.set(jsonBin, buoy);
            buoy += jsonBin.byteLength;
        }

        //高度图块数据
        if (heightMap) {
            wInfoFun(heightMap.byteLength, CHUNK_TYPES_BIN_HEIGHTMAP);

            ui8View.set(new Uint8Array(heightMap), buoy);
            buoy += heightMap.byteLength;
        }

        //泼绘控制图块数据
        if (splatMap) {
            wInfoFun(splatMap.byteLength, CHUNK_TYPES_BIN_SPLATMAP);

            ui8View.set(new Uint8Array(splatMap), buoy);
            buoy += splatMap.byteLength;
        }

        return result;
    }

    /**
     * 解析 terrainData 数据
     * @param terrainData TerrainData二进制数据
     * @returns 
     */
    public static parseTerrainData(terrainData: ArrayBuffer) {
        //Terrain 数据格式规划 ，参照 GLB 格式的二进制数据模式做规划
        //固定头部数据：
        //版本
        //总数据长度
        //chunk
        //  当前chunk数据长度
        //  当前chunk数据类型（TYPES_BIN、TYPES_JSON）
        //chunk...
        type terrainResult = { config?: String, heightMap?: m4m.framework.texture, splatMap?: m4m.framework.texture };

        const vd = new DataView(terrainData);
        const HEADER_LENGTH = 8;
        const CHUNK_TYPES_JSON = 0;
        const CHUNK_TYPES_BIN_HEIGHTMAP = 1;
        const CHUNK_TYPES_BIN_SPLATMAP = 2;
        const vertion = vd.getUint32(0);
        const totalByteLength = vd.getUint32(4);
        let buoy = HEADER_LENGTH;
        let result: terrainResult = {};
        let gl = m4m.framework.sceneMgr.app.webgl;
        //生成 图
        const genImg = (size: number, data: Uint8Array, tFormat: m4m.render.TextureFormatEnum) => {
            // 初始化纹理
            let t2d = new m4m.render.glTexture2D(gl);
            t2d.width = size;
            t2d.height = size;
            t2d.format = tFormat;
            t2d.mipmap = false;
            //额外处理
            gl.bindTexture(gl.TEXTURE_2D, t2d.texture);
            //纹理 Y 翻转
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
            t2d.uploadByteArray(false, true, size, size, data, false, false, false, false, true, gl.UNSIGNED_BYTE);
            //结束
            gl.bindTexture(gl.TEXTURE_2D, null);
            return t2d;
        }

        while (buoy < totalByteLength) {
            const byteLen = vd.getUint32(buoy);
            buoy += 4;
            const byteType = vd.getUint32(buoy);
            buoy += 4;
            let binData = new Uint8Array(terrainData, buoy, byteLen);
            switch (byteType) {
                case CHUNK_TYPES_JSON:
                    let td = new TextDecoder();
                    result.config = td.decode(binData) ?? "";
                    break;
                case CHUNK_TYPES_BIN_HEIGHTMAP:
                    //处理成纹理（R16）
                    let hTex = result.heightMap = new m4m.framework.texture(`heightMap`);
                    let hsize = Math.sqrt(byteLen);
                    // 初始化纹理
                    let ht2d = genImg(hsize, binData, m4m.render.TextureFormatEnum.Gray);
                    hTex.glTexture = ht2d;
                    break;
                case CHUNK_TYPES_BIN_SPLATMAP:
                    //处理成纹理（RGBA）
                    let sTex = result.splatMap = new m4m.framework.texture(`splatMap`);
                    let sSize = Math.sqrt(byteLen / 4);
                    // 初始化纹理
                    let sT2d = genImg(sSize, binData, m4m.render.TextureFormatEnum.RGBA);
                    sTex.glTexture = sT2d;
                    break;
            }
            buoy += byteLen;
        }

        return result;
    }

    /**
     * 通过 高度图 ，生成 高度地势 mesh
     * @param gl webgl上下文
     * @param heightmap 高度图
     * @param width x轴方向尺寸
     * @param height y轴方向尺寸
     * @param depth z轴方向尺寸
     * @param segmentsW X轴的段落数
     * @param segmentsH z轴的段落数
     * @param maxElevation 最大高度
     * @param minElevation 最小高度
     * @returns 
     */
    public static genElevationMesh(gl: WebGL2RenderingContext, heightmap: m4m.framework.texture, width: number = 1000, height: number = 100, depth: number = 1000, segmentsW: number = 30, segmentsH: number = 30, maxElevation: number = 255, minElevation: number = 0): m4m.framework.mesh {
        const pixelReader = (heightmap.glTexture as m4m.render.glTexture2D).getReader(true);    //只读灰度信息
        // pixelReader.getPixel();
        const w = heightmap.glTexture.width;
        const h = heightmap.glTexture.height;

        //gen meshData
        const data = new m4m.render.meshData();
        data.pos = [];
        data.trisindex = [];
        data.normal = [];
        data.tangent = [];
        data.color = [];
        data.uv = [];
        data.uv2 = [];

        let x: number, z: number, u: number, v: number, y: number, col: number, base: number, numInds = 0;
        const tw: number = segmentsW + 1;
        // let numVerts: number = (segmentsH + 1) * tw;
        const uDiv: number = (w - 1) / segmentsW;
        const vDiv: number = (h - 1) / segmentsH;
        const scaleU = 1;
        const scaleV = 1;

        for (let zi: number = 0; zi <= segmentsH; ++zi) {
            for (let xi: number = 0; xi <= segmentsW; ++xi) {
                x = (xi / segmentsW - 0.5) * width;
                z = (zi / segmentsH - 0.5) * depth;
                u = Math.floor(xi * uDiv) / w;
                v = Math.floor((segmentsH - zi) * vDiv) / h;

                col = pixelReader.getPixel(u, v) & 0xff;
                y = (col > maxElevation) ? (maxElevation / 0xff) * height : ((col < minElevation) ? (minElevation / 0xff) * height : (col / 0xff) * height);

                //pos
                data.pos.push(new m4m.math.vector3(x, y, z));
                //normal
                data.normal.push(new m4m.math.vector3(1, 1, 1));    //先填充一个值 ，准确值需要之后计算
                //tan
                data.tangent.push(new m4m.math.vector3(-1, 1, 1));  //先填充一个值 ，准确值需要之后计算
                //color
                data.color.push(new m4m.math.color(1, 1, 1, 1));
                //uv
                data.uv.push(new m4m.math.vector2(xi / segmentsW * scaleU, 1.0 - zi / segmentsH * scaleV));
                //uv1
                data.uv2.push(new m4m.math.vector2(xi / segmentsW, 1.0 - zi / segmentsH));

                if (xi != segmentsW && zi != segmentsH) {
                    base = xi + zi * tw;
                    data.trisindex.push(base, base + tw + 1, base + tw, base, base + 1, base + tw + 1);
                }
            }
        }


        //gen mesh
        const _mesh: m4m.framework.mesh = new m4m.framework.mesh(`${heightmap.getName()}.mesh.bin`);
        _mesh.data = data;
        const vf = m4m.render.VertexFormatMask.Position | m4m.render.VertexFormatMask.Normal | m4m.render.VertexFormatMask.Tangent | m4m.render.VertexFormatMask.Color | m4m.render.VertexFormatMask.UV0 | m4m.render.VertexFormatMask.UV1;
        _mesh.data.originVF = vf;
        const v32 = _mesh.data.genVertexDataArray(vf);
        const i16 = _mesh.data.genIndexDataArray();

        _mesh.glMesh = new m4m.render.glMesh();
        _mesh.glMesh.initBuffer(gl, vf, _mesh.data.pos.length);
        _mesh.glMesh.uploadVertexData(gl, v32);

        _mesh.glMesh.addIndex(gl, i16.length);
        _mesh.glMesh.uploadIndexData(gl, 0, i16);
        _mesh.glMesh.initVAO();
        //填充submesh 0
        _mesh.submesh = [];
        {
            var sm = new m4m.framework.subMeshInfo();
            sm.matIndex = 0;
            sm.useVertexIndex = 0;
            sm.start = 0;
            sm.size = i16.length;
            sm.line = false;
            _mesh.submesh.push(sm);
        }
        return _mesh;
    }

    public static genMesh(gl: WebGL2RenderingContext, heightmap: m4m.framework.texture, width: number = 1000, depth: number = 1000, segmentsW: number = 30, segmentsH: number = 30) {
        const pixelReader = (heightmap.glTexture as m4m.render.glTexture2D).getReader(true);    //只读灰度信息
        // pixelReader.getPixel();
        const w = heightmap.glTexture.width;
        const h = heightmap.glTexture.height;

        //gen meshData
        const data = new m4m.render.meshData();
        data.pos = [];
        data.trisindex = [];
        data.normal = [];
        data.tangent = [];
        data.color = [];
        data.uv = [];
        data.uv2 = [];

        let x: number, z: number, u: number, v: number, y: number, col: number, base: number, numInds = 0;
        const tw: number = segmentsW + 1;
        // let numVerts: number = (segmentsH + 1) * tw;
        const uDiv: number = (w - 1) / segmentsW;
        const vDiv: number = (h - 1) / segmentsH;
        const scaleU = 1;
        const scaleV = 1;

        for (let zi: number = 0; zi <= segmentsH; ++zi) {
            for (let xi: number = 0; xi <= segmentsW; ++xi) {
                x = (xi / segmentsW - 0.5) * width;
                z = (zi / segmentsH - 0.5) * depth;
                u = Math.floor(xi * uDiv) / w;
                v = Math.floor((segmentsH - zi) * vDiv) / h;

                col = pixelReader.getPixel(u, v) & 0xff;
                // y = (col > maxElevation) ? (maxElevation / 0xff) * height : ((col < minElevation) ? (minElevation / 0xff) * height : (col / 0xff) * height);

                //pos
                data.pos.push(new m4m.math.vector3(x, y, z));
                //normal
                data.normal.push(new m4m.math.vector3(1, 1, 1));    //先填充一个值 ，准确值需要之后计算
                //tan
                data.tangent.push(new m4m.math.vector3(-1, 1, 1));  //先填充一个值 ，准确值需要之后计算
                //color
                data.color.push(new m4m.math.color(1, 1, 1, 1));
                //uv
                data.uv.push(new m4m.math.vector2(xi / segmentsW * scaleU, 1.0 - zi / segmentsH * scaleV));
                //uv1
                data.uv2.push(new m4m.math.vector2(xi / segmentsW, 1.0 - zi / segmentsH));

                if (xi != segmentsW && zi != segmentsH) {
                    base = xi + zi * tw;
                    data.trisindex.push(base, base + tw + 1, base + tw, base, base + 1, base + tw + 1);
                }
            }
        }


        //gen mesh
        const _mesh: m4m.framework.mesh = new m4m.framework.mesh(`${heightmap.getName()}.mesh.bin`);
        _mesh.data = data;
        const vf = m4m.render.VertexFormatMask.Position | m4m.render.VertexFormatMask.Normal | m4m.render.VertexFormatMask.Tangent | m4m.render.VertexFormatMask.Color | m4m.render.VertexFormatMask.UV0 | m4m.render.VertexFormatMask.UV1;
        _mesh.data.originVF = vf;
        const v32 = _mesh.data.genVertexDataArray(vf);
        const i16 = _mesh.data.genIndexDataArray();

        _mesh.glMesh = new m4m.render.glMesh();
        _mesh.glMesh.initBuffer(gl, vf, _mesh.data.pos.length);
        _mesh.glMesh.uploadVertexData(gl, v32);

        _mesh.glMesh.addIndex(gl, i16.length);
        _mesh.glMesh.uploadIndexData(gl, 0, i16);
        _mesh.glMesh.initVAO();
        //填充submesh 0
        _mesh.submesh = [];
        {
            var sm = new m4m.framework.subMeshInfo();
            sm.matIndex = 0;
            sm.useVertexIndex = 0;
            sm.start = 0;
            sm.size = i16.length;
            sm.line = false;
            _mesh.submesh.push(sm);
        }
        return _mesh;
    }

}

/**
 * terrain 配置接口
 */
interface ITerrainConfig {
    version: string;
    images?: { uri: string, name: string }[];
    heightmap?: { image: number, size: number, format: number };
    splatmap?: { image: number, size: number, format: number };
}

