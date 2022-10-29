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
    static font_:m4m.framework.font;
    static _heights_ :Float32Array = null;
    heightMapWidth:number;
    heightMapHeight:number;
    
    static gl:WebGL2RenderingContext;
    static planeMF:m4m.framework.meshFilter;
    mtrlRoot:m4m.framework.transform2D = new m4m.framework.transform2D;
    texRoot:m4m.framework.transform2D = new m4m.framework.transform2D;
    bk:m4m.framework.transform2D = new m4m.framework.transform2D;
    btn:m4m.framework.transform2D[] = [ new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D];
    page:m4m.framework.transform2D[] = [ new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D];
    heightScaleCtrl:m4m.framework.transform2D = new m4m.framework.transform2D;
    textureUVScaleCtrl:m4m.framework.transform2D[] = [new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D];
    textureUVInputCtrls:m4m.framework.transform2D[][] = [
        [new m4m.framework.transform2D, new m4m.framework.transform2D],
        [new m4m.framework.transform2D, new m4m.framework.transform2D],
        [new m4m.framework.transform2D, new m4m.framework.transform2D],
        [new m4m.framework.transform2D, new m4m.framework.transform2D]
    ];

    
    iptFrame_HeightScale:m4m.framework.transform2D[] = [new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D];
    mtr:m4m.framework.material[] = [];
    texs:m4m.framework.texture[] = [];
    currentPickTexture:m4m.framework.transform2D;
    static bUpdatePickedTexture:boolean = false;
    static currentPickIndex:number = -1;
    _mousePos:any;

    textureLayer:m4m.framework.transform2D[] = [
        new m4m.framework.transform2D,
        new m4m.framework.transform2D,
        new m4m.framework.transform2D,
        new m4m.framework.transform2D,
        new m4m.framework.transform2D,
        new m4m.framework.transform2D,
        new m4m.framework.transform2D
    ];

    brushSizeBtns:m4m.framework.transform2D[] = [ new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D];
    static cam : m4m.framework.camera;
    static shifKey:boolean;
    worldX : number;
    worldZ : number;
    static mouseDown:boolean=false;
    
    static dictBrushData: { [id: string]: Uint8Array } = {};
    
    gridX:number;
    gridZ:number;
    static newHeight_ : Float32Array;
    static selectedBrush:number = 0;        //选择的刷子
    static selectedBrushSize:number = 0;    //brush size: 0:16; 1:32; 2:64; 3:128; 4:256;
    
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
                var u = Math.floor(column * uDiv) / w;
                //var v = Math.floor(((h - 1) - row) * vDiv) / h;
                var v = Math.floor((row) * vDiv) / h;
                
                var index = row * w + column;
                var color = pixelReader.getPixel(u, v) & 0xff;
                //console.log("color=" + color);
                color = color & 0xff;
                //console.log("color 1=" + color);
                array[index] = color;
                
            }
        }
        return array;
        
    }

    static getHeightmapPixels1(heightmap: m4m.framework.texture, brushDtatIndex:number):Uint8Array
    {
        const pixelReader = (heightmap.glTexture as m4m.render.glTexture2D).getReader(false);    //true只读灰度信息，false读rgba
        let w = heightmap.glTexture.width;
        let h = heightmap.glTexture.height;
        var array = new Uint8Array(w * h);
        const uDiv: number = 1.0;       //(w - 1) / (w - 1);
        const vDiv: number = 1.0;       //(h - 1) / (h - 1);
        for(var row = 0; row < h; row++)
        {
            for(var column = 0; column < w; column++)
            {
                var u = Math.floor(column * uDiv) / w;
                //var v = Math.floor(((h - 1) - row) * vDiv) / h;
                var v = Math.floor((row) * vDiv) / h;
                
                var index = row * w + column;
                var color = pixelReader.getPixel(u, v);
                //console.log("color=" + color + ", r:" + color.r + " g:" + color.g + " b:" + color.b + " a:" + color.a );
                array[index] = color.r;
            }
        }
        return array;
    }


    async start(app: m4m.framework.application) {
        // return;
        console.log("test_Heightmap_terrain start");
        

        test_Heightmap_terrain.app = app;
        test_Heightmap_terrain.mouseDown = false;
        const scene = app.getScene();
        const assetMgr = app.getAssetMgr();
        const gl = app.webgl;
        test_Heightmap_terrain.gl = app.webgl;
        //initCamera
        let objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        test_Heightmap_terrain.cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        test_Heightmap_terrain.cam.near = 0.01;
        test_Heightmap_terrain.cam.far = 2000;
        test_Heightmap_terrain.cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = test_Heightmap_terrain.cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 18;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 2.5, 0)
        var callback:any = this.ApplayNewHeight;
        this.worldX = 10000;
        this.worldZ = 10000;
        var callModify: any = this.OnModify;
        var callTestHit: any = this.TestHit;

        //font
        test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}font/方正粗圆_GBK.TTF.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}font/方正粗圆_GBK.font.json`, m4m.framework.AssetTypeEnum.Auto, (s1) =>
                {
                    if(s1.isfinish)
                    test_Heightmap_terrain.font_ = test_Heightmap_terrain.app.getAssetMgr().getAssetByName("方正粗圆_GBK.font.json") as m4m.framework.font;//;
                    this.addbtn('0', '0', "Modify", this);
                    this.afterAddButton();
                    this.OnPage(0);    

                });

                
            }
        });
        
        test_Heightmap_terrain.app.container.addEventListener("mousedown", function (e) {
            console.log("mousedown");
            test_Heightmap_terrain.mouseDown = true;
        }, false);
        var hold:m4m.framework.transform2D = this.bk;
        
        test_Heightmap_terrain.app.container.addEventListener("mouseup", function (e) {
            console.log("mouseup");
            test_Heightmap_terrain.mouseDown = false;
            //test_Heightmap_terrain.bUpdatePickedTexture = false;
        }, false);
        test_Heightmap_terrain.app.container.addEventListener("keydown", function (e) {
            console.log("keydown:" + e.code);
            if(e.code == "ShiftLeft" || e.code == "ShiftRight")
            {
                test_Heightmap_terrain.shifKey = true;
            }
            if(e.code == "AltRight")
            {
                console.log("Alt key down");
            }

            if(e.code == "KeyT")
            {
                console.log(test_Heightmap_terrain.dictBrushData["1_0"]);
            }
            if(e.code == "KeyY")
            {
                console.log(test_Heightmap_terrain.dictBrushData["1_1"]);
            }
            if(e.code == "KeyU")
            {
                console.log(test_Heightmap_terrain.dictBrushData["1_2"]);
            }
            if(e.code == "KeyI")
            {
                console.log(test_Heightmap_terrain.dictBrushData["1_3"]);
            }
            if(e.code == "KeyO")
            {
                console.log(test_Heightmap_terrain.dictBrushData["1_4"]);
            }
            if(e.code == "KeyP")
            {
                console.log(test_Heightmap_terrain.dictBrushData["1_5"]);
            }

        }, false);
        test_Heightmap_terrain.app.container.addEventListener("keyup", function (e) {
            console.log("keyup:" + e + " code:" + e.code);
            if(e.code == "ShiftLeft" || e.code == "ShiftRight")
            {
                test_Heightmap_terrain.shifKey = false;
            }
        }, false);

        //2dUI root
        this.rooto2d = new m4m.framework.overlay2D();
        test_Heightmap_terrain.cam.addOverLay(this.rooto2d);

        //模型 
        const planeNode = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Plane);
        const planeMR = planeNode.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        test_Heightmap_terrain.planeMF = planeNode.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
        // planeNode.localScale = new m4m.math.vector3(10, 10, 10);
        //加载纹理
        //const texNames = [`211.jpg`, `blendCtrl.png`, `splat_0Tex.png`, `splat_3Tex.png`, `splat_2Tex.png`, `splat_1Tex.png`, `rock1.png`, `grass2.png`, `dirt2.png`, `sand1.png`];
        const texNames = [`211.jpg`, `blendMaskTexture.png`, `splat_0Tex.png`, `splat_3Tex.png`, `splat_2Tex.png`, `splat_1Tex.png`, `rock1.png`, `grass2.png`, `dirt2.png`, `sand1.png`, `mask.png`];
        const texUrl = [];
        texNames.forEach(n => {
            texUrl.push(`${resRootPath}texture/${n}`)
        });
        this.texs = await util.loadTextures(texUrl, assetMgr);

        //this.heightData = test_Heightmap_terrain.getHeightmapPixels(texs[0]);
        console.log(this.heightData);

        //更换 mesh

        const terrainMesh = genElevationMesh(gl, this.texs[0], 255, 0, 15);
        test_Heightmap_terrain.planeMF.mesh = terrainMesh;

        //材质
        this.mtr[0] = planeMR.materials[0];
        //加载 shader 包
        await util.loadShader(assetMgr);
        //获取 高度图shader
        const tSH = assetMgr.getShader(`terrain_rgb_control.shader.json`);
        this.mtr[0].setShader(tSH);
        //纹理
        this.mtr[0].setTexture("_Control", this.texs[1]);
        this.mtr[0].setTexture("_Splat0", this.texs[2]);
        this.mtr[0].setTexture("_Splat1", this.texs[3]);
        this.mtr[0].setTexture("_Splat2", this.texs[4]);
        this.mtr[0].setTexture("_Splat3", this.texs[5]);

        //缩放和平铺
        // mtr.setVector4(`_Splat0_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
        // mtr.setVector4(`_Splat1_ST`, new m4m.math.vector4(16, 16, 0, 0));
        // mtr.setVector4(`_Splat2_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
        // mtr.setVector4(`_Splat3_ST`, new m4m.math.vector4(26.7, 26.7, 0, 0));
        this.mtr[0].setVector4(`_Splat0_ST`, new m4m.math.vector4(4, 4, 0, 0));
        this.mtr[0].setVector4(`_Splat1_ST`, new m4m.math.vector4(4, 4, 0, 0));
        this.mtr[0].setVector4(`_Splat2_ST`, new m4m.math.vector4(4, 4, 0, 0));
        this.mtr[0].setVector4(`_Splat3_ST`, new m4m.math.vector4(4, 4, 0, 0));
        this.mtr[0].setVector4(`v_useTextureOrGPU`, new m4m.math.vector4(1.0, 1.0, 0.01, 0.0));

    
        this.mtr[0].setVector4(`_HeightScale`, new m4m.math.vector4(15.0, 15.0, 15.0, 15.0))

        //添加到场景
        scene.addChild(planeNode);
    }
    

    OnModify():void
    {
        console.log("Modify mesh");
        if(this.worldX < 10000 && this.worldZ < 10000)
        {
            this.gridX = Math.floor(this.worldX - -0.5*210);
            this.gridZ = Math.floor(this.worldZ - -0.5*210);
            console.log("grid:" + this.gridX + ", " + this.gridZ);
        }
    }
    ApplayNewHeight(AddOrMinus:boolean):void
    {
        console.log("ApplayNewHeight called grid:"+ this.gridX + ", " + this.gridZ);
        console.log("selectedBrush" + test_Heightmap_terrain.selectedBrush);
        console.log("selectedBrushSize" + test_Heightmap_terrain.selectedBrushSize);
        var curSize:number = 32;
        if(test_Heightmap_terrain.selectedBrushSize == 0)
        {
            curSize = 16.0;
        }
        else if(test_Heightmap_terrain.selectedBrushSize == 1)
        {
            curSize = 32.0;
        }
        else if(test_Heightmap_terrain.selectedBrushSize == 2)
        {
            curSize = 64.0;
        }
        else if(test_Heightmap_terrain.selectedBrushSize == 3)
        {
            curSize = 128.0;
        }
        else if(test_Heightmap_terrain.selectedBrushSize == 4)
        {
            curSize = 256.0;
        }

        for(var row = this.gridZ - curSize/2; row < this.gridZ - curSize/2 + curSize; row++)
        {
            for(var column = this.gridX - curSize/2; column < this.gridX - curSize/2 + curSize; column++)
            {
                if(row < 0 || row > 209)
                    continue;
                if(column < 0 || column > 209)
                    continue;

                var index = row * 210 + column;
                if(AddOrMinus == false)
                {
                    let __index:number = (row - (this.gridZ - curSize/2)) * curSize + (column - (this.gridX - curSize/2));
                    if(__index >= curSize * curSize)
                        __index = curSize*curSize -1;
                    let delta:number = 0;
                    var key : string = test_Heightmap_terrain.selectedBrushSize + "_" + test_Heightmap_terrain.selectedBrush;
                    console.log("Applay key" + key);
                    delta = 0.2 * test_Heightmap_terrain.dictBrushData[key][__index];
                    
                    var f = test_Heightmap_terrain._heights_[index] + delta;
                    test_Heightmap_terrain._heights_[index] = f <= 255 ? f : 255;
                }
                else{
                    let __index:number = (row - (this.gridZ - curSize/2)) * curSize + (column - (this.gridX - curSize/2));
                    if(__index >= curSize * curSize)
                        __index = curSize*curSize -1;
                    let delta:number = 0;
                    var key : string = test_Heightmap_terrain.selectedBrushSize + "_" + test_Heightmap_terrain.selectedBrush;
                    console.log("Applay key" + key);
                    delta = 0.2 * test_Heightmap_terrain.dictBrushData[key][__index];
                    
                    var f = test_Heightmap_terrain._heights_[index] - delta;
                    test_Heightmap_terrain._heights_[index] = f >= 0 ? f : 0;
                }
            }
        }
        var newMesh = UpdateElevationMesh(test_Heightmap_terrain.gl, 255, 0, 15);
        test_Heightmap_terrain.planeMF.mesh = newMesh;
    }

    static BrushTextureLoadFinished(brushIndex : number, brushSize:number)
    {
        console.log("BrushTextureLoadFinished brushIndex:" + brushIndex + ", brushSize:" + brushSize );
        var _name = "brush_" + String(brushIndex) + "_" + String(brushSize) + ".png";
                        
        var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(_name) as m4m.framework.texture;
        if(texture0 == null)
            console.log(_name + " is null. FAIL");
        else
        {
            console.log(_name + " is not null. ok");
            
            var key:string = String(brushSize) + "_" + String(brushIndex);
            test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
            
        }
                        
    }


    private addbtn(top: string, left: string, text: string, app_:test_Heightmap_terrain): m4m.framework.transform2D[]{
        console.log("addbtn called");
        this.bk.name = "background";
        this.bk.width = 105 * 3;
        this.bk.height = 105 * 5;
        this.bk.pivot.x = 0;
        this.bk.pivot.y = 0;
        this.bk.localTranslate.x = 0;
        this.bk.localTranslate.y = 0;
        this.rooto2d.addChild(this.bk);
        let background = this.bk.addComponent("rawImage2D") as m4m.framework.rawImage2D;

        this.page[0].name = "vertex";
        this.page[1].name = "uv";
        this.page[2].name = "texture";
        this.page[0].width = 103;
        this.page[1].width = 103;
        this.page[2].width = 103;
        this.page[0].height = 75;
        this.page[1].height = 75;
        this.page[2].height = 75;
        this.page[0].pivot.x = 0;
        this.page[1].pivot.x = 0;
        this.page[2].pivot.x = 0;
        this.page[0].pivot.y = 0;
        this.page[1].pivot.y = 0;
        this.page[2].pivot.y = 0;
        this.page[0].localTranslate.x = 0;
        this.page[1].localTranslate.x = 105;
        this.page[2].localTranslate.x = 210;
        this.page[0].localTranslate.y = 0;
        this.page[1].localTranslate.y = 0;
        this.page[2].localTranslate.y = 0;
        let page0Btn = this.page[0].addComponent("button") as m4m.framework.button;
        let page1Btn = this.page[1].addComponent("button") as m4m.framework.button;
        let page2Btn = this.page[2].addComponent("button") as m4m.framework.button;
        let page0BtnBack = this.page[0].addComponent("rawImage2D") as m4m.framework.rawImage2D;
        let page1BtnBack = this.page[1].addComponent("rawImage2D") as m4m.framework.rawImage2D;
        let page2BtnBack = this.page[2].addComponent("rawImage2D") as m4m.framework.rawImage2D;
        page0BtnBack.image = this.texs[10];
        page1BtnBack.image = this.texs[10];
        page2BtnBack.image = this.texs[10];

        var labPage0 = new m4m.framework.transform2D();
        labPage0.name = "labPage0";
        labPage0.width = 103;
        labPage0.height = 73;
        labPage0.pivot.x = 0;
        labPage0.pivot.y = 0;
        labPage0.localTranslate.x = 1;
        labPage0.localTranslate.y = 1;
        var labelGeometry = labPage0.addComponent("label") as m4m.framework.label;
        var txtlabPage0:string = "几何体";
        if(test_Heightmap_terrain.font_ != null)
            console.log("font is not null, OK");
        else
        console.log("font is null, Fail");
        labelGeometry.font = test_Heightmap_terrain.font_;
        labelGeometry.text = txtlabPage0;
        labelGeometry.fontsize = 30;
        labelGeometry.color = new m4m.math.color(1, 0, 0, 1);
        this.page[0].addChild(labPage0);
        
        var labPage1 = new m4m.framework.transform2D();
        labPage1.name = "labPage1";
        labPage1.width = 103;
        labPage1.height = 73;
        labPage1.pivot.x = 0;
        labPage1.pivot.y = 0;
        labPage1.localTranslate.x = 1;
        labPage1.localTranslate.y = 1;
        var labelMaterial = labPage1.addComponent("label") as m4m.framework.label;
        var txtlabPage1:string = "高度;UV比例";
        labelMaterial.font = test_Heightmap_terrain.font_;
        labelMaterial.text = txtlabPage1;
        labelMaterial.fontsize = 30;
        labelMaterial.color = new m4m.math.color(1, 0, 0, 1);
        this.page[1].addChild(labPage1);

        var labPage2 = new m4m.framework.transform2D();
        labPage2.name = "labPage2";
        labPage2.width = 103;
        labPage2.height = 73;
        labPage2.pivot.x = 0;
        labPage2.pivot.y = 0;
        labPage2.localTranslate.x = 1;
        labPage2.localTranslate.y = 1;
        var labelTex = labPage2.addComponent("label") as m4m.framework.label;
        var txtlabPage2:string = "Texture";
        labelTex.font = test_Heightmap_terrain.font_;
        labelTex.text = txtlabPage2;
        labelTex.fontsize = 30;
        labelTex.color = new m4m.math.color(1, 0, 0, 1);
        this.page[2].addChild(labPage2);


        page0Btn.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnPage(0);
        }, this);
        page1Btn.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnPage(1);
        }, this);
        page2Btn.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnPage(2);
        }, this);

        this.bk.addChild(this.page[0]);
        this.bk.addChild(this.page[1]);
        this.bk.addChild(this.page[2]);

        for(var i = 0; i < 11; i++)
        {
            var row = Math.floor(i/3);
            var col = i%3;
            this.btn[i].name = "btn" + i;
            this.btn[i].width = i < 6 ? 100 : 35;
            this.btn[i].height = i < 6 ? 100 : 35;
            this.btn[i].pivot.x = 0;
            this.btn[i].pivot.y = 0;
            this.btn[i].localTranslate.x = i < 6 ? 105 * col : 40 * (i - 6);
            this.btn[i].localTranslate.y = i < 6 ? 105 * row + 80 : 105 * 2 + 20 + 80;

            this.page[0].addChild(this.btn[i]);
            if(this.btn[i].getComponent("button") == null)
            {
                let btn_b = this.btn[i].addComponent("button") as m4m.framework.button;
                btn_b.pressedColor = new m4m.math.color(1, 1, 1, 1);
                btn_b.transition = m4m.framework.TransitionType.SpriteSwap;
                if(this.btn[i].getComponent("image2D") == null)
                {
                    btn_b.targetImage = this.btn[i].addComponent("image2D") as m4m.framework.image2D;
                }
            }
            
            if(i >= 6)
            {
                var lab = new m4m.framework.transform2D();
                lab.name = "lab";
                lab.width = 40;
                lab.height = 40;
                lab.pivot.x = 0;
                lab.pivot.y = 0;
                lab.localTranslate.x = 5;
                lab.localTranslate.y = 0;
                //lab.markDirty();
                var label = lab.addComponent("label") as m4m.framework.label;
                var txt:string = "刷" + String(i - 6 + 1);
                //label.font = _font;
                label.font = test_Heightmap_terrain.font_;
                label.text = txt;
                label.fontsize = 18;
                label.color = new m4m.math.color(1, 0, 0, 1);
                this.btn[i].addChild(lab);
            }
        }

        

        var loadIndexRow:number[] = [0, 1, 2, 3, 4, 5];
        var loadIndexColumn:number[] = [0, 1, 2, 3, 4];
        for(var iiii = 0; iiii < 6; iiii++)
        {
            for(var jjjj = 0; jjjj < 5; jjjj++)
            {
                var _name:string = "atlas/1/brush_" + loadIndexRow[iiii] + "_" + loadIndexColumn[jjjj] + ".png";
                var texName = `${resRootPath}` + _name;
                console.log("texName:" + texName);
                let a = {
                    i: iiii,
                    j: jjjj,
                }
                test_Heightmap_terrain.app.getAssetMgr().load(texName, m4m.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        console.log(a, iiii, jjjj);
                        test_Heightmap_terrain.BrushTextureLoadFinished(a.i, a.j);
                    }
                });
            }
        }

        
        //root 
        this.mtrlRoot.name = "MaterialRoot";
        this.mtrlRoot.width = 1;
        this.mtrlRoot.height = 1;
        this.mtrlRoot.pivot.x = 0;
        this.mtrlRoot.pivot.y = 0;
        this.mtrlRoot.localTranslate.x = 0;
        this.mtrlRoot.localTranslate.y = 0;
        this.rooto2d.addChild(this.mtrlRoot);
        // left text
        this.heightScaleCtrl.width = 300;
        this.heightScaleCtrl.height = 40;
        this.heightScaleCtrl.pivot.x = 0;
        this.heightScaleCtrl.pivot.y = 0;
        this.heightScaleCtrl.localTranslate.x = 18;
        this.heightScaleCtrl.localTranslate.y = 90;
        //this.rooto2d.addChild(this.heightScaleCtrl);
        this.mtrlRoot.addChild(this.heightScaleCtrl);
        //this.heightScaleCtrl.layoutState = 0 | m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.BOTTOM;
        //this.heightScaleCtrl.setLayoutValue(m4m.framework.layoutOption.H_CENTER, 0);
        //this.heightScaleCtrl.setLayoutValue(m4m.framework.layoutOption.V_CENTER, 0);
        let leftTextLabel = this.heightScaleCtrl.addComponent("label") as m4m.framework.label;
        leftTextLabel.font = test_Heightmap_terrain.font_;
        leftTextLabel.fontsize = 19;
        leftTextLabel.color = new m4m.math.color(1, 0, 0, 1);
        leftTextLabel.text = "高度比例";
        //输入框
        this.iptFrame_HeightScale[0].width = 190;
        this.iptFrame_HeightScale[0].height = 40;
        this.iptFrame_HeightScale[0].pivot.x = 0;
        this.iptFrame_HeightScale[0].pivot.y = 0;
        this.iptFrame_HeightScale[0].localTranslate.x = 300 - 190;
        this.iptFrame_HeightScale[0].localTranslate.y = 0;
        this.heightScaleCtrl.addChild(this.iptFrame_HeightScale[0]);
        let ipt0 = this.iptFrame_HeightScale[0].addComponent("inputField") as m4m.framework.inputField;
        ipt0.LineType = m4m.framework.lineType.SingleLine;                              //单行输入
        ipt0.onTextSubmit = (t) => {
            console.log(`HeightScale.x:${t}`);
            var scale:number = Number(t);
            this.mtr[0].setVector4(`_HeightScale`, new m4m.math.vector4(scale, scale, scale, scale));
        }
        let img_t0 = new m4m.framework.transform2D;
        img_t0.width = this.iptFrame_HeightScale[0].width;
        img_t0.height = this.iptFrame_HeightScale[0].height;
        this.iptFrame_HeightScale[0].addChild(img_t0);
        ipt0.frameImage = img_t0.addComponent("image2D") as m4m.framework.image2D;
        ipt0.frameImage.imageType = m4m.framework.ImageType.Sliced;
        ipt0.frameImage.imageBorder.l = 10;
        ipt0.frameImage.imageBorder.t = 2;
        ipt0.frameImage.imageBorder.r = 10;
        ipt0.frameImage.imageBorder.b = 2;

        let text_t = new m4m.framework.transform2D;
        text_t.width = this.iptFrame_HeightScale[0].width;
        text_t.height = this.iptFrame_HeightScale[0].height;
        this.iptFrame_HeightScale[0].addChild(text_t);
        ipt0.TextLabel = text_t.addComponent("label") as m4m.framework.label;
        ipt0.TextLabel.font = test_Heightmap_terrain.font_;
        ipt0.TextLabel.fontsize = 19
        ipt0.TextLabel.color = new m4m.math.color(1, 1, 1, 1);
        text_t.layoutState = 0 | m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
        text_t.setLayoutValue(m4m.framework.layoutOption.H_CENTER, 0);
        text_t.setLayoutValue(m4m.framework.layoutOption.V_CENTER, 0);

        let p_t = new m4m.framework.transform2D;
        p_t.width = this.iptFrame_HeightScale[0].width;
        p_t.height = this.iptFrame_HeightScale[0].height;
        this.iptFrame_HeightScale[0].addChild(p_t);
        ipt0.PlaceholderLabel = p_t.addComponent("label") as m4m.framework.label;
        ipt0.PlaceholderLabel.text = "SingleLine Enter text...";
        ipt0.PlaceholderLabel.font = test_Heightmap_terrain.font_;
        ipt0.PlaceholderLabel.fontsize = 19
        ipt0.PlaceholderLabel.color = new m4m.math.color(0.6, 0.6, 0.6, 1);


        var inputSuit: any[][] = [
            [this.textureUVInputCtrls[0][0], this.textureUVInputCtrls[0][1]],
            [this.textureUVInputCtrls[1][0], this.textureUVInputCtrls[1][1]],
            [this.textureUVInputCtrls[2][0], this.textureUVInputCtrls[2][1]],
            [this.textureUVInputCtrls[3][0], this.textureUVInputCtrls[3][1]],

        ];

        var yPos:number = 90 + 55;
        for(var iRow = 0; iRow < 4; iRow++)
        {
            ///textureUVScaleCtrl
            this.textureUVScaleCtrl[iRow].width = 190;
            this.textureUVScaleCtrl[iRow].height = 38;
            this.textureUVScaleCtrl[iRow].pivot.x = 0;
            this.textureUVScaleCtrl[iRow].pivot.y = 0;
            this.textureUVScaleCtrl[iRow].localTranslate.x = 18;
            this.textureUVScaleCtrl[iRow].localTranslate.y = yPos;
            yPos += 40;
            this.mtrlRoot.addChild(this.textureUVScaleCtrl[iRow]);
            let labelTextureScale = this.textureUVScaleCtrl[iRow].addComponent("label") as m4m.framework.label;
            labelTextureScale.font = test_Heightmap_terrain.font_;
            labelTextureScale.fontsize = 19;
            labelTextureScale.color = new m4m.math.color(1, 0, 0, 1);
            var iUV:number = iRow + 1;
            labelTextureScale.text = "UV" + iUV + "比例";
            ///2个输入框
            //输入框
            this.textureUVInputCtrls[iRow][0].width = 90;
            this.textureUVInputCtrls[iRow][0].height = 38;
            this.textureUVInputCtrls[iRow][0].pivot.x = 0;
            this.textureUVInputCtrls[iRow][0].pivot.y = 0;
            this.textureUVInputCtrls[iRow][0].localTranslate.x = 90;
            this.textureUVInputCtrls[iRow][0].localTranslate.y = 0;
            this.textureUVInputCtrls[iRow][1].width = 90;
            this.textureUVInputCtrls[iRow][1].height = 38;
            this.textureUVInputCtrls[iRow][1].pivot.x = 0;
            this.textureUVInputCtrls[iRow][1].pivot.y = 0;
            this.textureUVInputCtrls[iRow][1].localTranslate.x = 180;
            this.textureUVInputCtrls[iRow][1].localTranslate.y = 0;
            this.textureUVScaleCtrl[iRow].addChild(this.textureUVInputCtrls[iRow][0]);
            this.textureUVScaleCtrl[iRow].addChild(this.textureUVInputCtrls[iRow][1]);
            let ipt00 = this.textureUVInputCtrls[iRow][0].addComponent("inputField") as m4m.framework.inputField;
            ipt00.LineType = m4m.framework.lineType.SingleLine;                              //单行输入
            ipt00.onTextSubmit = (t) => {
                console.log(`UV .x:${t}`);
                var scale:number = Number(t);
                
                var input00 = inputSuit[0][0].getComponent("inputField") as m4m.framework.inputField; 
                var u0:number = Number(input00.text);
                var input01 = inputSuit[0][1].getComponent("inputField") as m4m.framework.inputField; 
                var v0:number = Number(input01.text);
                var input10 = inputSuit[1][0].getComponent("inputField") as m4m.framework.inputField; 
                var u1:number = Number(input10.text);
                var input11 = inputSuit[1][1].getComponent("inputField") as m4m.framework.inputField; 
                var v1:number = Number(input11.text);
                var input20 = inputSuit[2][0].getComponent("inputField") as m4m.framework.inputField; 
                var u2:number = Number(input20.text);
                var input21 = inputSuit[2][1].getComponent("inputField") as m4m.framework.inputField; 
                var v2:number = Number(input21.text);
                var input30 = inputSuit[3][0].getComponent("inputField") as m4m.framework.inputField; 
                var u3:number = Number(input30.text);
                var input31 = inputSuit[3][1].getComponent("inputField") as m4m.framework.inputField; 
                var v3:number = Number(input30.text);
                
                if(u0 == 0)
                {
                    u0 = 1;
                    input00.text = "1";
                }
                if(v0 == 0)
                {
                    v0 = 1;
                    input01.text = "1";
                }
                if(u1 == 0)
                {
                    u1 = 1;
                    input10.text = "1";
                }
                if(v1 == 0)
                {
                    v1 = 1;
                    input11.text = "1";
                }
                if(u2== 0)
                {
                    u2 = 1;
                    input20.text = "1";
                }
                if(v2 == 0)
                {
                    v2 = 1;
                    input21.text = "1";
                }
                if(u3 == 0)
                {
                    u3 = 1;
                    input30.text = "1";
                }
                if(v3 == 0)
                {
                    v3 = 1;
                    input31.text = "1";
                }
                
                console.log(u0 + "," + v0);
                console.log(u1 + "," + v1);
                console.log(u2 + "," + v2);
                console.log(u3 + "," + v3);

                this.mtr[0].setVector4(`_Splat0_ST`, new m4m.math.vector4(u0, v0, 0, 0));
                this.mtr[0].setVector4(`_Splat1_ST`, new m4m.math.vector4(u1, v1, 0, 0));
                this.mtr[0].setVector4(`_Splat2_ST`, new m4m.math.vector4(u2, v2, 0, 0));
                this.mtr[0].setVector4(`_Splat3_ST`, new m4m.math.vector4(u3, v3, 0, 0));
            }
            let ipt11 = this.textureUVInputCtrls[iRow][1].addComponent("inputField") as m4m.framework.inputField;
            ipt11.LineType = m4m.framework.lineType.SingleLine;                              //单行输入
            ipt11.onTextSubmit = (t) => {
                console.log(`UV .y:${t}`);
                var scale:number = Number(t);
                
                var input00 = inputSuit[0][0].getComponent("inputField") as m4m.framework.inputField; 
                var u0:number = Number(input00.text);
                var input01 = inputSuit[0][1].getComponent("inputField") as m4m.framework.inputField; 
                var v0:number = Number(input01.text);
                var input10 = inputSuit[1][0].getComponent("inputField") as m4m.framework.inputField; 
                var u1:number = Number(input10.text);
                var input11 = inputSuit[1][1].getComponent("inputField") as m4m.framework.inputField; 
                var v1:number = Number(input11.text);
                var input20 = inputSuit[2][0].getComponent("inputField") as m4m.framework.inputField; 
                var u2:number = Number(input20.text);
                var input21 = inputSuit[2][1].getComponent("inputField") as m4m.framework.inputField; 
                var v2:number = Number(input21.text);
                var input30 = inputSuit[3][0].getComponent("inputField") as m4m.framework.inputField; 
                var u3:number = Number(input30.text);
                var input31 = inputSuit[3][1].getComponent("inputField") as m4m.framework.inputField; 
                var v3:number = Number(input30.text);
                if(u0 == 0)
                {
                    u0 = 1;
                    input00.text = "1";
                }
                if(v0 == 0)
                {
                    v0 = 1;
                    input01.text = "1";
                }
                if(u1 == 0)
                {
                    u1 = 1;
                    input10.text = "1";
                }
                if(v1 == 0)
                {
                    v1 = 1;
                    input11.text = "1";
                }
                if(u2== 0)
                {
                    u2 = 1;
                    input20.text = "1";
                }
                if(v2 == 0)
                {
                    v2 = 1;
                    input21.text = "1";
                }
                if(u3 == 0)
                {
                    u3 = 1;
                    input30.text = "1";
                }
                if(v3 == 0)
                {
                    v3 = 1;
                    input31.text = "1";
                }

                console.log(u0 + "," + v0);
                console.log(u1 + "," + v1);
                console.log(u2 + "," + v2);
                console.log(u3 + "," + v3);

                this.mtr[0].setVector4(`_Splat0_ST`, new m4m.math.vector4(u0, v0, 0, 0));
                this.mtr[0].setVector4(`_Splat1_ST`, new m4m.math.vector4(u1, v1, 0, 0));
                this.mtr[0].setVector4(`_Splat2_ST`, new m4m.math.vector4(u2, v2, 0, 0));
                this.mtr[0].setVector4(`_Splat3_ST`, new m4m.math.vector4(u3, v3, 0, 0));
            }

            let img_u = new m4m.framework.transform2D;
            img_u.width = this.textureUVInputCtrls[iRow][0].width;
            img_u.height = this.textureUVInputCtrls[iRow][0].height;
            this.textureUVInputCtrls[iRow][0].addChild(img_u);
            if(img_u.getComponent("image2D") == null)
                ipt00.frameImage = img_u.addComponent("image2D") as m4m.framework.image2D;
            //ipt00.frameImage.imageType = m4m.framework.ImageType.Sliced;
            //ipt00.frameImage.imageBorder.l = 10;
            //ipt00.frameImage.imageBorder.t = 2;
            //ipt00.frameImage.imageBorder.r = 10;
            //ipt00.frameImage.imageBorder.b = 2;


            let img_v = new m4m.framework.transform2D;
            img_v.width = this.textureUVInputCtrls[iRow][1].width;
            img_v.height = this.textureUVInputCtrls[iRow][1].height;
            this.textureUVInputCtrls[iRow][1].addChild(img_v);
            if(img_v.getComponent("image2D") == null)
                ipt11.frameImage = img_v.addComponent("image2D") as m4m.framework.image2D;
            //ipt11.frameImage.imageType = m4m.framework.ImageType.Sliced;
            //ipt11.frameImage.imageBorder.l = 10;
            //ipt11.frameImage.imageBorder.t = 2;
            //ipt11.frameImage.imageBorder.r = 10;
            //ipt11.frameImage.imageBorder.b = 2;

            let text_x = new m4m.framework.transform2D;
            text_x.width = this.textureUVInputCtrls[iRow][0].width;
            text_x.height = this.textureUVInputCtrls[iRow][0].height;
            this.textureUVInputCtrls[iRow][0].addChild(text_x);
            ipt00.TextLabel = text_x.addComponent("label") as m4m.framework.label;
            ipt00.TextLabel.font = test_Heightmap_terrain.font_;
            ipt00.TextLabel.fontsize = 24
            ipt00.TextLabel.color = new m4m.math.color(1, 1, 1, 1);
            text_x.layoutState = 0 | m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
            text_x.setLayoutValue(m4m.framework.layoutOption.H_CENTER, 0);
            text_x.setLayoutValue(m4m.framework.layoutOption.V_CENTER, 0);

            let text_y = new m4m.framework.transform2D;
            text_y.width = this.textureUVInputCtrls[iRow][1].width;
            text_y.height = this.textureUVInputCtrls[iRow][1].height;
            this.textureUVInputCtrls[iRow][1].addChild(text_y);
            ipt11.TextLabel = text_y.addComponent("label") as m4m.framework.label;
            ipt11.TextLabel.font = test_Heightmap_terrain.font_;
            ipt11.TextLabel.fontsize = 24
            ipt11.TextLabel.color = new m4m.math.color(1, 1, 1, 1);
            text_y.layoutState = 0 | m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
            text_y.setLayoutValue(m4m.framework.layoutOption.H_CENTER, 0);
            text_y.setLayoutValue(m4m.framework.layoutOption.V_CENTER, 0);

            let p_tx = new m4m.framework.transform2D;
            p_tx.width = this.textureUVInputCtrls[iRow][0].width;
            p_tx.height = this.textureUVInputCtrls[iRow][0].height;
            this.textureUVInputCtrls[iRow][0].addChild(p_tx);
            ipt00.PlaceholderLabel = p_tx.addComponent("label") as m4m.framework.label;
            ipt00.PlaceholderLabel.text = "U scale ...";
            ipt00.PlaceholderLabel.font = test_Heightmap_terrain.font_;
            ipt00.PlaceholderLabel.fontsize = 24
            ipt00.PlaceholderLabel.color = new m4m.math.color(0.6, 0.6, 0.6, 1);

            let p_t1 = new m4m.framework.transform2D;
            p_t1.width = this.textureUVInputCtrls[iRow][1].width;
            p_t1.height = this.textureUVInputCtrls[iRow][1].height;
            this.textureUVInputCtrls[iRow][1].addChild(p_t1);
            ipt11.PlaceholderLabel = p_t1.addComponent("label") as m4m.framework.label;
            ipt11.PlaceholderLabel.text = "V scale ...";
            ipt11.PlaceholderLabel.font = test_Heightmap_terrain.font_;
            ipt11.PlaceholderLabel.fontsize = 24
            ipt11.PlaceholderLabel.color = new m4m.math.color(0.6, 0.6, 0.6, 1);
        }

        //root 
        this.texRoot.name = "TextureLayerRoot";
        this.texRoot.width = 1;
        this.texRoot.height = 1;
        this.texRoot.pivot.x = 0;
        this.texRoot.pivot.y = 0;
        this.texRoot.localTranslate.x = 0;
        this.texRoot.localTranslate.y = 0;
        this.rooto2d.addChild(this.texRoot);
        //left side 4 texture layer + 1 mix layer
        for(var iRow = 0; iRow < 5; iRow++)
        {
            this.textureLayer[iRow].width = 60;
            this.textureLayer[iRow].height = 60;
            this.textureLayer[iRow].pivot.x = 0;
            this.textureLayer[iRow].pivot.y = 0;
            this.textureLayer[iRow].localTranslate.x = 1;
            this.textureLayer[iRow].localTranslate.y = this.page[2].height + 64* (iRow%5);
            if(this.texRoot == null)
                console.log("texRoot is nul, Fail");
            else
                console.log("texRoot is not null, OK");
            this.texRoot.addChild(this.textureLayer[iRow]);
            let imgTs = new m4m.framework.transform2D;
            imgTs.width = this.textureLayer[iRow].width;
            imgTs.height = this.textureLayer[iRow].height;
            imgTs.pivot.x = 0;
            imgTs.pivot.y = 0;
            imgTs.localTranslate.x = 0;
            imgTs.localTranslate.y = 0;
            this.textureLayer[iRow].addChild(imgTs);
            let img2D:m4m.framework.rawImage2D = imgTs.addComponent("rawImage2D") as m4m.framework.rawImage2D;
            let param0 =
            {
                index:iRow,
                img:img2D,
            }
            if(iRow < 4)
                img2D.image = this.texs[iRow + 2];
            else
                img2D.image = this.texs[1];
            let rightButton = imgTs.addComponent("button") as m4m.framework.button;
            rightButton.addListener(m4m.event.UIEventEnum.PointerClick, function ()
            {
                this.OnReplaceTexture(param0.index, param0.img);
            }, this);
        }
        /// left bottom a button to select use blend texture or gradient
        this.textureLayer[5].width = 100;
        this.textureLayer[5].height = 35;
        this.textureLayer[5].pivot.x = 0;
        this.textureLayer[5].pivot.y = 0;
        this.textureLayer[5].localTranslate.x = 1;
        this.textureLayer[5].localTranslate.y = this.page[2].height + 64 * 5 + 30;
        this.texRoot.addChild(this.textureLayer[5]);
        let btnUseBlendTexture = this.textureLayer[5].addComponent("button") as m4m.framework.button;
        let labelBlendTexture = this.textureLayer[5].addComponent("label") as m4m.framework.label;
        btnUseBlendTexture.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnUseBlendTexture();
        }, this);
        labelBlendTexture.color = new m4m.math.color(1, 0 , 0, 1);
        labelBlendTexture.text = "Blend Texture";
        labelBlendTexture.font = test_Heightmap_terrain.font_;
        labelBlendTexture.fontsize = 16;
        let imgLayer5Ts = new m4m.framework.transform2D;
        imgLayer5Ts.width = this.textureLayer[5].width;
        imgLayer5Ts.height = this.textureLayer[5].height;
        imgLayer5Ts.pivot.x = 0;
        imgLayer5Ts.pivot.y = 0;
        imgLayer5Ts.localTranslate.x = 0;
        imgLayer5Ts.localTranslate.y = 0;
        this.textureLayer[5].addChild(imgLayer5Ts);
        let imgTextureLayer5 = imgLayer5Ts.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        imgTextureLayer5.image = this.texs[10];
        imgTextureLayer5.color = new m4m.math.color(1.0, 1.0, 1.0, 0.5);
        
        this.textureLayer[6].width = 100;
        this.textureLayer[6].height = 35;
        this.textureLayer[6].pivot.x = 0;
        this.textureLayer[6].pivot.y = 0;
        this.textureLayer[6].localTranslate.x = 1;
        this.textureLayer[6].localTranslate.y = this.page[2].height + 64 * 5 + 30 + 35 + 5;
        this.texRoot.addChild(this.textureLayer[6]);
        let btnUseGPUBlend = this.textureLayer[6].addComponent("button") as m4m.framework.button;
        let labelGPUBlend = this.textureLayer[6].addComponent("label") as m4m.framework.label;
        btnUseGPUBlend.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnUseGPUMixTexture();
        }, this);
        labelGPUBlend.color = new m4m.math.color(1, 0 , 0, 1);
        labelGPUBlend.text = "GPU Blend";
        labelGPUBlend.font = test_Heightmap_terrain.font_;
        labelGPUBlend.fontsize = 16;
        let imgLayer6Ts = new m4m.framework.transform2D;
        imgLayer6Ts.width = this.textureLayer[6].width;
        imgLayer6Ts.height = this.textureLayer[6].height;
        imgLayer6Ts.pivot.x = 0;
        imgLayer6Ts.pivot.y = 0;
        imgLayer6Ts.localTranslate.x = 0;
        imgLayer6Ts.localTranslate.y = 0;
        this.textureLayer[6].addChild(imgLayer6Ts);
        let imgTextureLayer6 = imgLayer6Ts.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        imgTextureLayer6.image = this.texs[10];
        imgTextureLayer6.color = new m4m.math.color(1.0, 1.0, 1.0, 0.5);
        
        
        //滑动卷轴框
        let scroll_t = new m4m.framework.transform2D;
        scroll_t.width = 210;
        scroll_t.height = 450;
        this.texRoot.addChild(scroll_t);
        scroll_t.localTranslate.x = 105;
        scroll_t.localTranslate.y = 75;
        let scroll_ = scroll_t.addComponent("scrollRect") as m4m.framework.scrollRect;
        let ct = new m4m.framework.transform2D;
        scroll_t.addChild(ct);
        scroll_.inertia = true;
        ct.width = 208;
        ct.height = 208*10;
        scroll_.decelerationRate = 0.135;
        scroll_.content = ct;
        scroll_t.isMask = true;
        scroll_.horizontal = false;
        scroll_.vertical = true;
        //卷轴框 raw png
        for(var imgIndex_ = 1; imgIndex_ <11; imgIndex_++)
        {
            let raw_t2 = new m4m.framework.transform2D;
            var sz:string = "texture_" + String(imgIndex_);
            raw_t2.name = sz;
            raw_t2.width = 200;
            raw_t2.height = 200;
            raw_t2.localTranslate.x = 8;
            raw_t2.localTranslate.y = 208 * ((imgIndex_ - 1));
            let raw_i2 = raw_t2.addComponent("rawImage2D") as m4m.framework.rawImage2D;
            
            raw_i2.image = this.texs[imgIndex_];
            ct.addChild(raw_t2);
            //卷轴框 label
            let s_l_t = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Label);
            s_l_t.width = 180;
            let s_l = s_l_t.getComponent("label") as m4m.framework.label;
            s_l.font = test_Heightmap_terrain.font_;
            s_l.fontsize = 40;
            s_l.color = new m4m.math.color(0.0, 0.0, 1.0, 0.3);
            s_l.verticalOverflow = true;
            s_l.verticalType = m4m.framework.VerticalType.Top;
            s_l.text = "scrollRect \ntry drag \nto move";
            ct.addChild(s_l_t);
            let imgBtn = raw_t2.addComponent("button") as m4m.framework.button;
            let param =
            {
                btn:imgBtn,
                index:imgIndex_,
            }
            imgBtn.addListener(m4m.event.UIEventEnum.PointerClick, function ()
            {
                this.OnClickTexture(param.index, param.btn);
            }, this);
        }

        /// selected texture
        this.currentPickTexture = new m4m.framework.transform2D;
        this.currentPickTexture.width = 60;
        this.currentPickTexture.height = 60;
        this.currentPickTexture.pivot.x = 0.5;
        this.currentPickTexture.pivot.y = 0.5;
        this.texRoot.addChild(this.currentPickTexture);
        let _currentPick:m4m.framework.rawImage2D = this.currentPickTexture.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        _currentPick.image = null;

        //atlas
        var imgIndex:m4m.framework.transform2D[] = [];
        for(var ii =0; ii < 11; ii++)
        {
            imgIndex[ii] = this.btn[ii];
        }

        var abc:any[][] = [
            [this.textureUVInputCtrls[0][0], this.textureUVInputCtrls[0][1]],
            [this.textureUVInputCtrls[1][0], this.textureUVInputCtrls[1][1]],
            [this.textureUVInputCtrls[2][0], this.textureUVInputCtrls[2][1]],
            [this.textureUVInputCtrls[3][0], this.textureUVInputCtrls[3][1]]
        ];

        test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/2.atlas.json`, m4m.framework.AssetTypeEnum.Auto, function(state)
                {
                    if(state.isfinish)
                    {
                        var atlas = test_Heightmap_terrain.app.getAssetMgr().getAssetByName("2.atlas.json") as m4m.framework.atlas;
                        console.log("atlas:" + atlas);
                        console.log("sprites:" + atlas.sprites);
                        for(var Index = 0; Index < 11; Index++)
                        {
                            var img2D = imgIndex[Index].getComponent("image2D") as m4m.framework.image2D;
                            if(img2D == null)
                            {
                                console.log("Fool, null img2D:" + imgIndex);
                            }
                            else{
                                
                                var spriteName = "brush_"+(Index);
                                console.log("OK, img2D attach sprite" + atlas.sprites[spriteName]);
                                img2D.sprite = atlas.sprites[spriteName];
                                
                            }
                        }
                        ipt0.frameImage.sprite = atlas.sprites["input_0"];
                        
                        var img2Dx:m4m.framework.image2D [] = abc[0][0].getComponentsInChildren("image2D") as m4m.framework.image2D[];
                        if(img2Dx == null)
                            console.log(ii + " img2Dx is null FAIL");
                        else
                            console.log(ii + "img2Dx is not null OK");

                        img2Dx[0].sprite = atlas.sprites["input_0"];
                        var img2Dy:m4m.framework.image2D []= abc[0][1].getComponentsInChildren("image2D") as m4m.framework.image2D[];
                        img2Dy[0].sprite = atlas.sprites["input_0"];

                        var img2Dx1:m4m.framework.image2D [] = abc[1][0].getComponentsInChildren("image2D") as m4m.framework.image2D[];
                        if(img2Dx1 == null)
                            console.log(ii + " img2Dx1 is null FAIL");
                        else
                            console.log(ii + "img2Dx1 is not null OK");

                        img2Dx1[0].sprite = atlas.sprites["input_0"];
                        var img2Dy1:m4m.framework.image2D []= abc[1][1].getComponentsInChildren("image2D") as m4m.framework.image2D[];
                        img2Dy1[0].sprite = atlas.sprites["input_0"];

                        var img2Dx2:m4m.framework.image2D [] = abc[2][0].getComponentsInChildren("image2D") as m4m.framework.image2D[];
                        if(img2Dx2 == null)
                            console.log(ii + " img2Dx2 is null FAIL");
                        else
                            console.log(ii + "img2Dx2 is not null OK");

                        img2Dx2[0].sprite = atlas.sprites["input_0"];
                        var img2Dy2:m4m.framework.image2D []= abc[2][1].getComponentsInChildren("image2D") as m4m.framework.image2D[];
                        img2Dy2[0].sprite = atlas.sprites["input_0"];

                        var img2Dx3:m4m.framework.image2D [] = abc[3][0].getComponentsInChildren("image2D") as m4m.framework.image2D[];
                        if(img2Dx3 == null)
                            console.log(ii + " img2Dx3 is null FAIL");
                        else
                            console.log(ii + "img2Dx3 is not null OK");

                        img2Dx3[0].sprite = atlas.sprites["input_0"];
                        var img2Dy3:m4m.framework.image2D []= abc[3][1].getComponentsInChildren("image2D") as m4m.framework.image2D[];
                        img2Dy3[0].sprite = atlas.sprites["input_0"];

                    }
                });
            }
        });

        return this.btn;
    }

    afterAddButton()
    {
        var btnIndex:number[] = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4];
        let btn_b0 = this.btn[0].getComponent("button") as m4m.framework.button;
        btn_b0.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnBrushBtnClick(btnIndex[0]);
        }, this);
        let btn_b1 = this.btn[1].getComponent("button") as m4m.framework.button;
        btn_b1.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnBrushBtnClick(btnIndex[1]);
        }, this);
        let btn_b2 = this.btn[2].getComponent("button") as m4m.framework.button;
        btn_b2.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnBrushBtnClick(btnIndex[2]);
        }, this);
        let btn_b3 = this.btn[3].getComponent("button") as m4m.framework.button;
        btn_b3.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnBrushBtnClick(btnIndex[3]);
        }, this);
        let btn_b4 = this.btn[4].getComponent("button") as m4m.framework.button;
        btn_b4.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnBrushBtnClick(btnIndex[4]);
        }, this);
        let btn_b5 = this.btn[5].getComponent("button") as m4m.framework.button;
        btn_b5.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnBrushBtnClick(btnIndex[5]);
        }, this);
        let btn_b6 = this.btn[6].getComponent("button") as m4m.framework.button;
        btn_b6.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnSetBrushSize(btnIndex[6]);
        }, this);
        let btn_b7 = this.btn[7].getComponent("button") as m4m.framework.button;
        btn_b7.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnSetBrushSize(btnIndex[7]);
        }, this);
        let btn_b8 = this.btn[8].getComponent("button") as m4m.framework.button;
        btn_b8.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnSetBrushSize(btnIndex[8]);
        }, this);
        let btn_b9 = this.btn[9].getComponent("button") as m4m.framework.button;
        btn_b9.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnSetBrushSize(btnIndex[9]);
        }, this);
        let btn_b10 = this.btn[10].getComponent("button") as m4m.framework.button;
        btn_b10.addListener(m4m.event.UIEventEnum.PointerClick, function ()
        {
            this.OnSetBrushSize(btnIndex[10]);
        }, this);
    }

    OnSetBrushSize(index:number)
    {
        console.log("Brush size" + index);
        test_Heightmap_terrain.selectedBrushSize = index;
    }

    OnBrushBtnClick(index:number)
    {
        console.log("btn" + index + " clicked");
        test_Heightmap_terrain.selectedBrush = index;
    }

    OnPage(btnNumber:number)
    {
        console.log("page " + btnNumber + " clicked");
        if(btnNumber == 0)
        {
            for(var item of this.btn)
            {
                item.visible = true;
            }
            this.mtrlRoot.visible = false;
            this.texRoot.visible = false;
        }
        else if(btnNumber == 1)
        {
            for(var item of this.btn)
            {
                item.visible = false;
            }
            this.mtrlRoot.visible = true;
            this.texRoot.visible = false;
        }
        else{
            for(var item of this.btn)
            {
                item.visible = false;
            }
            this.mtrlRoot.visible = false;
            this.texRoot.visible = true;
        }

    }
    OnUseBlendTexture()
    {
        console.log("Use blend texture control 4 texture mix");

        this.mtr[0].setVector4(`v_useTextureOrGPU`, new m4m.math.vector4(0.0, 0.0, 0.01, 0.0));

        
    }
    OnUseGPUMixTexture()
    {
        console.log("Use GPU control 4 texture with height factor");
        this.mtr[0].setVector4(`v_useTextureOrGPU`, new m4m.math.vector4(1.0, 1.0, 0.01, 0.0));
    }

    OnClickTexture(_index:number, _btn:m4m.framework.button)
    {
        console.log("texture btn:" + _index + " clicked");
        //var tex:m4m.framework.texture = new m4m.framework.texture(this.texs[_index]);
        var img2D = this.currentPickTexture.getComponent("rawImage2D") as m4m.framework.rawImage2D;
        if(img2D != null)
        {
            img2D.image = this.texs[_index];
            test_Heightmap_terrain.bUpdatePickedTexture = true;
            test_Heightmap_terrain.currentPickIndex = _index;
        }

    }
    OnReplaceTexture(_index:number, _img2D:m4m.framework.rawImage2D)
    {
        
        // texture layer, replace
        if(test_Heightmap_terrain.currentPickIndex != -1)
        {
            _img2D.image = this.texs[test_Heightmap_terrain.currentPickIndex];
            if(_index == 0)
            {
                this.mtr[0].setTexture("_Splat0", this.texs[test_Heightmap_terrain.currentPickIndex]);
            }
            else if(_index == 1)
            {
                this.mtr[0].setTexture("_Splat1", this.texs[test_Heightmap_terrain.currentPickIndex]);
            }
            else if(_index == 2)
            {
                this.mtr[0].setTexture("_Splat2", this.texs[test_Heightmap_terrain.currentPickIndex]);
            }
            else if(_index == 3){
                this.mtr[0].setTexture("_Splat3", this.texs[test_Heightmap_terrain.currentPickIndex]);
            }
            else{
                this.mtr[0].setTexture("_Control", this.texs[test_Heightmap_terrain.currentPickIndex]);
            }
            test_Heightmap_terrain.currentPickIndex = -1;
            test_Heightmap_terrain.bUpdatePickedTexture = false;
            var img2D = this.currentPickTexture.getComponent("rawImage2D") as m4m.framework.rawImage2D;
            if(img2D != null)
            {
                img2D.image = null;
            }
        }
    }

    UpdatePickedTexturePosition()
    {
        if(test_Heightmap_terrain.bUpdatePickedTexture)
        {
            var pos = new m4m.math.vector2(test_Heightmap_terrain.app.getInputMgr().point.x, test_Heightmap_terrain.app.getInputMgr().point.y);
            console.log("mouse:" + pos.x + ", " + pos.y);
            /// out of UI area, disable attach to mouse
            var img = this.currentPickTexture.getComponent("rawImage2D") as m4m.framework.rawImage2D;
            if(pos.x >= 105*3 || pos.x < 0 || pos.y >= 105 * 5 || pos.y < 0)
            {
                test_Heightmap_terrain.bUpdatePickedTexture = false;
                if(img != null)
                    img.image = null;
            }
            /// top label area, disable attach to mouse
            if(pos.x > 0 && pos.x < 105 * 3 && pos.y > 0 && pos.y < 75)
            {
                test_Heightmap_terrain.bUpdatePickedTexture = false;
                if(img != null)
                    img.image = null;
            }
            
            
            if(img.image != null)
            {
                this.currentPickTexture.localTranslate.x = pos.x;
                this.currentPickTexture.localTranslate.y = pos.y;
                this.currentPickTexture.localTranslate = pos;
                this.currentPickTexture.markDirty();
            }
            
        }
    }

    update(delta: number) {
        
        this._mousePos = new m4m.math.vector2(test_Heightmap_terrain.app.getInputMgr().point.x, test_Heightmap_terrain.app.getInputMgr().point.y);
        this.UpdatePickedTexturePosition();

        /// left top area is ui so do not handle
        //console.log("Mouse:" + mousePos.x, mousePos.y);
        if(this._mousePos.x < 105*3 && this._mousePos.y < 105 * 5)
        {
            this.nFrame++;
            return;
        }
        
        
        if(test_Heightmap_terrain.mouseDown == true)
        {
            if(this.nFrame % 10 == 0)
            {
                this.TestHit();
                this.OnModify();
                
                if(test_Heightmap_terrain.shifKey)
                {
                    this.ApplayNewHeight(true);
                }
                else
                {
                    this.ApplayNewHeight(false);
                }
            }
        }


        this.nFrame++;
    }
    TestHit():void
    {
        //创建射线
        let ray = test_Heightmap_terrain.cam.creatRayByScreen(new m4m.math.vector2(test_Heightmap_terrain.app.getInputMgr().point.x, test_Heightmap_terrain.app.getInputMgr().point.y), test_Heightmap_terrain.app);
        //多碰撞
        //let tempinfos: m4m.framework.pickinfo[] = []; //射线碰撞的结果集
        //let bool1 = ea.scene.pickAll(ray, tempinfos, true);
        //单碰撞
        let tempinfo: m4m.framework.pickinfo = new m4m.framework.pickinfo(); //射线碰撞的结果集
        let bool2 = test_Heightmap_terrain.app.getScene().pick(ray, tempinfo, true);
        if(bool2)
        {
            console.log("Hit:" + tempinfo.hitposition);
            this.worldX = tempinfo.hitposition.x;
            this.worldZ = tempinfo.hitposition.z;
        }
        else
        {
            console.log("NotHit");
            this.worldX = 10000;
            this.worldZ = 10000;
        }
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
    //const w = heightmap.glTexture.width;
    //const h = heightmap.glTexture.height;
    this.heightMapWidth = heightmap.glTexture.width;
    this.heightMapHeight = heightmap.glTexture.height;

    function InBounds(i : number, j : number): Boolean
    {
		// True if ij are valid indices; false otherwise.
		return i >= 0 && i < this.heightMapWidth &&
			j >= 0 && j < this.heightMapHeight;
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
                    var index_ = m * this.heightMapWidth + n;
					avg += _heightdata[index_];
					num += 1;
				}
			}
		}
		return avg / num;
	}
    if(test_Heightmap_terrain._heights_ == null)
        test_Heightmap_terrain._heights_ = new Float32Array(this.heightMapWidth * this.heightMapHeight);
    
    for (var i = 0; i < this.heightMapHeight; ++i)
    {
        for (var j = 0; j < this.heightMapWidth; ++j)
        {
            test_Heightmap_terrain._heights_[i * this.heightMapWidth + j] = Average(i, j);
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
    var segmentsW = this.heightMapWidth - 1;
    var segmentsH = this.heightMapHeight - 1;
    let x: number, z: number, u: number, v: number, y: number, col: number, base: number, numInds = 0;
    let index_:number;
    const tw: number = segmentsW + 1;
    // let numVerts: number = (segmentsH + 1) * tw;
    const uDiv: number = (this.heightMapWidth - 1) / segmentsW;
    const vDiv: number = (this.heightMapHeight - 1) / segmentsH;
    const scaleU = 1;
    const scaleV = 1;

    for (let zi: number = 0; zi < this.heightMapHeight; ++zi) {
        for (let xi: number = 0; xi < this.heightMapWidth; ++xi) {
            x = (xi / segmentsW - 0.5) * this.heightMapWidth;
            z = (zi / segmentsH - 0.5) * this.heightMapHeight;
            u = Math.floor(xi * uDiv) / this.heightMapWidth;
            v = Math.floor((segmentsH - zi) * vDiv) / this.heightMapHeight;

            index_ = zi * this.heightMapWidth + xi;
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
                //data.trisindex.push(base, base + tw, base + tw + 1, base, base + tw + 1, base + 1);
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

function UpdateElevationMesh(gl: WebGL2RenderingContext, maxElevation: number = 255, minElevation: number = 0, heightScale: number = 12.0, addOrMinus:Boolean = true): m4m.framework.mesh
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

    for (let zi: number = 0; zi < this.heightMapHeight; ++zi) {
        for (let xi: number = 0; xi < this.heightMapWidth; ++xi) {
            x = (xi / segmentsW - 0.5) * 210;
            z = (zi / segmentsH - 0.5) * 210;
            u = Math.floor(xi * uDiv) / 210;
            v = Math.floor((segmentsH - zi) * vDiv) / 210;

            index_ = zi * this.heightMapWidth + xi;
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
                //data.trisindex.push(base, base + tw, base + tw + 1, base, base + tw + 1, base + 1);
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