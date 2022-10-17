/**
 * 高度图地形样例
 */
class test_Heightmap_terrain implements IState {
    heightData:Uint8Array;
    w:number;
    h:number;
    nFrame:number = 0;
    rooto2d: m4m.framework.overlay2D;
    static app:m4m.framework.application;
    static _heights_ :Float32Array = null;
    static gl:WebGL2RenderingContext;
    static planeMF:m4m.framework.meshFilter;

    static getHeightmapPixels(heightmap: m4m.framework.texture):Uint8Array
    {
        const pixelReader = (heightmap.glTexture as m4m.render.glTexture2D).getReader(true);    //只读灰度信息
        let w = heightmap.glTexture.width;
        let h = heightmap.glTexture.height;
        var array = new Uint8Array(w * h);
        const uDiv: number = 1.0;       //(w - 1) / (w - 1);
        const vDiv: number = 1.0;       //(h - 1) / (h - 1);
        for(var row = 0; row < h; row++)
        {
            for(var column = 0; column < w; column++)
            {
                var x = (column / (w - 1) - 0.5) * w;
                var z = (row/ (h - 1) - 0.5) * h;
                var u = Math.floor(column * uDiv) / w;
                var v = Math.floor(((h - 1) - row) * vDiv) / h;
                
                var index = row * w + column;
                var color = pixelReader.getPixel(u, v) & 0xff;
                //console.log("color=" + color);
                color = color & 0xff;
                //console.log("color 1=" + color);
                array[index] = color;
                
            }
        }
        //for(var ii = 0; ii < 1000; ii++)
            //console.log(array[ii]);
        return array;
        
    }

    async start(app: m4m.framework.application) {
        // return;
        console.log("test_Heightmap_terrain start");

        test_Heightmap_terrain.app = app;

        const scene = app.getScene();
        const assetMgr = app.getAssetMgr();
        const gl = app.webgl;
        test_Heightmap_terrain.gl = app.webgl;
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
        hoverc.distance = 18;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0)

        //2dUI root
        this.rooto2d = new m4m.framework.overlay2D();
        cam.addOverLay(this.rooto2d);

        //模型 
        const planeNode = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Plane);
        const planeMR = planeNode.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        test_Heightmap_terrain.planeMF = planeNode.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
        // planeNode.localScale = new m4m.math.vector3(10, 10, 10);
        //加载纹理
        const texNames = [`211.jpg`, `blendMaskTexture.jpg`, `splat_0Tex.png`, `splat_3Tex.png`, `splat_2Tex.png`, `splat_1Tex.png`];
        const texUrl = [];
        texNames.forEach(n => {
            texUrl.push(`${resRootPath}texture/${n}`)
        });
        const texs = await util.loadTextures(texUrl, assetMgr);

        this.heightData = test_Heightmap_terrain.getHeightmapPixels(texs[0]);
        console.log(this.heightData);

        //更换 mesh

        const terrainMesh = genElevationMesh(gl, texs[0], 255, 0, 15);
        test_Heightmap_terrain.planeMF.mesh = terrainMesh;

        //材质
        const mtr = planeMR.materials[0];
        //加载 shader 包
        await util.loadShader(assetMgr);
        //获取 高度图shader
        const tSH = assetMgr.getShader(`terrain_rgb_control.shader.json`);
        mtr.setShader(tSH);
        //纹理
        mtr.setTexture("_Control", texs[1]);
        mtr.setTexture("_Splat0", texs[2]);
        mtr.setTexture("_Splat1", texs[3]);
        mtr.setTexture("_Splat2", texs[4]);
        mtr.setTexture("_Splat3", texs[5]);

        //缩放和平铺
        // mtr.setVector4(`_Splat0_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
        // mtr.setVector4(`_Splat1_ST`, new m4m.math.vector4(16, 16, 0, 0));
        // mtr.setVector4(`_Splat2_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
        // mtr.setVector4(`_Splat3_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
        mtr.setVector4(`_Splat0_ST`, new m4m.math.vector4(4, 4, 0, 0));
        mtr.setVector4(`_Splat1_ST`, new m4m.math.vector4(4, 4, 0, 0));
        mtr.setVector4(`_Splat2_ST`, new m4m.math.vector4(4, 4, 0, 0));
        mtr.setVector4(`_Splat3_ST`, new m4m.math.vector4(4, 4, 0, 0));

        //添加到场景
        scene.addChild(planeNode);
    }

    OnModify():void
    {
        console.log("Modify mesh");
        for(var row = 0; row < 210; row++)
        {
            for(var column = 0; column < 210; column++)
            {
                var index = row * 210 + column;
                var f = test_Heightmap_terrain._heights_[index] -1;
                test_Heightmap_terrain._heights_[index] = f >= 0 ? f : 0;
            }
        }
        ///UpdateElevationMesh()
        var newMesh = UpdateElevationMesh(test_Heightmap_terrain.gl, 255, 0, 15);
        test_Heightmap_terrain.planeMF.mesh = newMesh;
    }

    //private addbtn(top: string, left: string, text: string, app_:test_Heightmap_terrain): HTMLButtonElement {
    private addbtn(top: string, left: string, text: string, app_:test_Heightmap_terrain): m4m.framework.transform2D{
        //var btn = document.createElement("button");
        var btn = new m4m.framework.transform2D;
        btn.name = "btn_按鈕"
        btn.width = 100;
        btn.height = 100;
        btn.pivot.x = 0;
        btn.pivot.y = 0;
        btn.localTranslate.x = 10;
        btn.localTranslate.y = 70;
        
        //test_Heightmap_terrain.app.container.appendChild(btn);
        this.rooto2d.addChild(btn);

        console.log(test_Heightmap_terrain.app);
        
        
        let btn_b = btn.addComponent("button") as m4m.framework.button;
        btn_b.targetImage = btn.addComponent("image2D") as m4m.framework.image2D;
        //atlas资源
        test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/2.atlas.json`, m4m.framework.AssetTypeEnum.Auto, (state) =>
                {
                    if(state.isfinish)
                    {
                        var atlas = test_Heightmap_terrain.app.getAssetMgr().getAssetByName("2.atlas.json") as m4m.framework.atlas;
                        //btn_b.targetImage.sprite = atlas.sprites["card_role_1_face"];
                        console.log(atlas.sprites["brush_0"]);

                        btn_b.targetImage.sprite = atlas.sprites["brush_0"];
                        if(btn_b.targetImage.sprite == null)
                            console.log("btn_b.targetImage.sprite is null, FAIL");
                    }
                    
                });
            }
        }); 
        //btn_b.pressedGraphic = new m4m.framework.sprite("brush0.jpg");;
        btn_b.pressedColor = new m4m.math.color(1, 1, 1, 1);
        btn_b.transition = m4m.framework.TransitionType.SpriteSwap;

        btn_b.addListener(m4m.event.UIEventEnum.PointerClick, () => {
            console.log("btn_b clicked")
            app_.OnModify();
        }, this);

        return btn;
    }

    update(delta: number) {
        //console.log(this.nFrame);
        if(this.nFrame == 0)
        {
            console.log("addbtn called");
            this.addbtn('0', '0', "Modify", this);
        }
        this.nFrame++;
    }
    

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



//function genElevationMesh(gl: WebGL2RenderingContext, heightmap: m4m.framework.texture, width: number = 1000, height: number = 100, depth: number = 1000, segmentsW: number = 30, segmentsH: number = 30, maxElevation: number = 255, minElevation: number = 0): m4m.framework.mesh {
function genElevationMesh(gl: WebGL2RenderingContext, heightmap: m4m.framework.texture, maxElevation: number = 255, minElevation: number = 0, heightScale: number = 12.0): m4m.framework.mesh {    
    let _heightdata = test_Heightmap_terrain.getHeightmapPixels(heightmap);
    const w = heightmap.glTexture.width;
    const h = heightmap.glTexture.height;

    function InBounds(i : number, j : number): Boolean
    {
		// True if ij are valid indices; false otherwise.
		return i >= 0 && i < w &&
			j >= 0 && j < h;
	}
    function Average(i:number, j:number) :number
	{
		// ----------
		// | 1| 2| 3|
		// ----------
		// |4 |ij| 6|
		// ----------
		// | 7| 8| 9|
		// ----------
		let avg = 0.0;
		let num = 0.0;
		for (var m = i - 1; m <= i + 1; ++m)
		{
			for (var n = j - 1; n <= j + 1; ++n)
			{
				if (InBounds(m, n))
				{
                    var index_ = m * w + n;
					avg += _heightdata[index_];
					num += 1;
				}
			}
		}
		return avg / num;
	}
    if(test_Heightmap_terrain._heights_ == null)
        test_Heightmap_terrain._heights_ = new Float32Array(w * h);
    for (var i = 0; i < h; ++i)
    {
        for (var j = 0; j < w; ++j)
        {
            test_Heightmap_terrain._heights_[i * w + j] = Average(i, j);
        }
    }


    //gen meshData
    const data = new m4m.render.meshData();
    data.pos = [];
    data.trisindex = [];
    data.normal = [];
    data.tangent = [];
    data.color = [];
    data.uv = [];
    data.uv2 = [];
    var segmentsW = w - 1;
    var segmentsH = h - 1;
    let x: number, z: number, u: number, v: number, y: number, col: number, base: number, numInds = 0;
    let index_:number;
    const tw: number = segmentsW + 1;
    // let numVerts: number = (segmentsH + 1) * tw;
    const uDiv: number = (w - 1) / segmentsW;
    const vDiv: number = (h - 1) / segmentsH;
    const scaleU = 1;
    const scaleV = 1;

    for (let zi: number = 0; zi < h; ++zi) {
        for (let xi: number = 0; xi < w; ++xi) {
            x = (xi / segmentsW - 0.5) * w;
            z = (zi / segmentsH - 0.5) * h;
            u = Math.floor(xi * uDiv) / w;
            v = Math.floor((segmentsH - zi) * vDiv) / h;

            index_ = zi * w + xi;
            //col = _heightdata[index_];
            col = test_Heightmap_terrain._heights_[index_];
            y = (col > maxElevation) ? (maxElevation / 0xff) * heightScale : ((col < minElevation) ? (minElevation / 0xff) * heightScale : (col / 0xff) * heightScale);

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

function UpdateElevationMesh(gl: WebGL2RenderingContext, maxElevation: number = 255, minElevation: number = 0, heightScale: number = 12.0): m4m.framework.mesh
{    
    
    
    //gen meshData
    const data = new m4m.render.meshData();
    data.pos = [];
    data.trisindex = [];
    data.normal = [];
    data.tangent = [];
    data.color = [];
    data.uv = [];
    data.uv2 = [];
    var segmentsW = 210 - 1;
    var segmentsH = 210 - 1;
    let x: number, z: number, u: number, v: number, y: number, col: number, base: number, numInds = 0;
    let index_:number;
    const tw: number = segmentsW + 1;
    // let numVerts: number = (segmentsH + 1) * tw;
    const uDiv: number = (210 - 1) / segmentsW;
    const vDiv: number = (210 - 1) / segmentsH;
    const scaleU = 1;
    const scaleV = 1;

    for (let zi: number = 0; zi < 210; ++zi) {
        for (let xi: number = 0; xi < 210; ++xi) {
            x = (xi / segmentsW - 0.5) * 210;
            z = (zi / segmentsH - 0.5) * 210;
            u = Math.floor(xi * uDiv) / 210;
            v = Math.floor((segmentsH - zi) * vDiv) / 210;

            index_ = zi * 210 + xi;
            //col = _heightdata[index_];
            col = test_Heightmap_terrain._heights_[index_];
            y = (col > maxElevation) ? (maxElevation / 0xff) * heightScale : ((col < minElevation) ? (minElevation / 0xff) * heightScale : (col / 0xff) * heightScale);

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
    const _mesh: m4m.framework.mesh = new m4m.framework.mesh(`${"211"}.mesh.bin`);
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