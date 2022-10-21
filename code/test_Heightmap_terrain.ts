/**
 * 高度图地形样例
 */
class TerrainEditorHoldName
{
    _Name:string;
}


class test_Heightmap_terrain implements IState {
    heightData:Uint8Array;
    w:number;
    h:number;
    nFrame:number = 0;
    rooto2d: m4m.framework.overlay2D;
    static app:m4m.framework.application;
    static font_:m4m.framework.font;
    static _heights_ :Float32Array = null;
    static gl:WebGL2RenderingContext;
    static planeMF:m4m.framework.meshFilter;
    btn:m4m.framework.transform2D[] = [ new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D];
    brushSizeBtns:m4m.framework.transform2D[] = [ new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D, new m4m.framework.transform2D];
    static cam : m4m.framework.camera;
    static shifKey:boolean;
    worldX : number;
    worldZ : number;
    
    static dictBrushData: { [id: string]: Uint8Array } = {};
    
    gridX:number;
    gridZ:number;
    static newHeight_ : Float32Array;
    static selectedBrush:number = 0;        //选择的刷子
    static selectedBrushSize:number = 0;    //brush size: 0:32; 1:64; 2:128; 3:256
    
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
        test_Heightmap_terrain.app.container.addEventListener("mousedown", function (e) {
            console.log("mousedown");
            var mousePos = new m4m.math.vector2(test_Heightmap_terrain.app.getInputMgr().point.x, test_Heightmap_terrain.app.getInputMgr().point.y);
            /// left top area is ui so do not handle
            console.log("Mouse:" + mousePos.x, mousePos.y);
            if(mousePos.x < 105*3 && mousePos.y < (105 * 2 + 20 + 40))
                return;
            
            callTestHit();
            callModify();
            if(test_Heightmap_terrain.shifKey)
            {
                callback(true);
            }
            else
            {
                callback(false);
            }
        }, false);
        test_Heightmap_terrain.app.container.addEventListener("mouseup", function (e) {
            console.log("mouseup");
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
        const texNames = [`211.jpg`, `blendMaskTexture.jpg`, `splat_0Tex.png`, `splat_3Tex.png`, `splat_2Tex.png`, `splat_1Tex.png`];
        const texUrl = [];
        texNames.forEach(n => {
            texUrl.push(`${resRootPath}texture/${n}`)
        });
        const texs = await util.loadTextures(texUrl, assetMgr);

        //this.heightData = test_Heightmap_terrain.getHeightmapPixels(texs[0]);
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

        //var maskIndex:number = 0;
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

                //maskIndex += 1;
            }
        }
        var newMesh = UpdateElevationMesh(test_Heightmap_terrain.gl, 255, 0, 15);
        test_Heightmap_terrain.planeMF.mesh = newMesh;
    }


    private addbtn(top: string, left: string, text: string, app_:test_Heightmap_terrain): m4m.framework.transform2D[]{
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
            this.btn[i].localTranslate.y = i < 6 ? 105 * row : 105 * 2 + 20;

            this.rooto2d.addChild(this.btn[i]);
            let btn_b = this.btn[i].addComponent("button") as m4m.framework.button;
            btn_b.targetImage = this.btn[i].addComponent("image2D") as m4m.framework.image2D;
            
            
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
                label.text = txt;
                label.fontsize = 18;
                label.color = new m4m.math.color(1, 0, 0, 1);
                this.btn[i].addChild(lab);
            }

            //font
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}font/STXINGKA.TTF.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}font/STXINGKA.font.json`, m4m.framework.AssetTypeEnum.Auto, (s1) =>
                    {
                        if(s1.isfinish)
                        test_Heightmap_terrain.font_ = test_Heightmap_terrain.app.getAssetMgr().getAssetByName("STXINGKA.font.json") as m4m.framework.font;//;
                        for(var m = 0; m < 11; m++)
                        {
                            var labels_ = this.btn[m].getComponentsInChildren("label");
                            for(let item of labels_)
                            {
                                (item as m4m.framework.label).font = test_Heightmap_terrain.font_;
                            }
                        }

                    });
                }
            });

            
            //atlas
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/2.atlas.json`, m4m.framework.AssetTypeEnum.Auto, (state) =>
                    {
                        if(state.isfinish)
                        {
                            var atlas = test_Heightmap_terrain.app.getAssetMgr().getAssetByName("2.atlas.json") as m4m.framework.atlas;
                            for(var imgIndex = 0; imgIndex < 11; imgIndex++)
                            {
                                let _btn_ = this.btn[imgIndex].getComponent("button")as m4m.framework.button;
                                var spriteName = "brush_"+(imgIndex);
                                _btn_.targetImage.sprite = atlas.sprites[spriteName];
                            }
                        }
                    });
                }
            });

            //texture 资源
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_0_0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_0_0.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_0_0.png is null. FAIL");
                    else
                    {
                        console.log("brush_0_0.png is not null. ok");
                        
                        var key:string = "0_0";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                        
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_0_1.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_0_1.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_0_1.png is null. FAIL");
                    else
                    {
                        console.log("brush_0_1.png is not null. ok");
                        var key:string = "1_0";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_0_2.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_0_2.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_0_2.png is null. FAIL");
                    else
                    {
                        console.log("brush_0_2.png is not null. ok");
                        var key:string = "2_0";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_0_3.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_0_3.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_0_3.png is null. FAIL");
                    else
                    {
                        console.log("brush_0_3.png is not null. ok");
                        var key:string = "3_0";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_0_4.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_0_4.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_0_4.png is null. FAIL");
                    else
                    {
                        console.log("brush_0_4.png is not null. ok");
                        var key:string = "4_0";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });

            
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_1_0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_1_0.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("texture1 is null. FAIL");
                    else
                    {
                        console.log("brush_1_0.png is not null. ok");
                        var key:string = "0_1";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_1_1.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_1_1.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_1_1.png is null. FAIL");
                    else
                    {
                        console.log("brush_1_1.png is not null. ok");
                        var key:string = "1_1";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_1_2.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_1_2.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_1_2.png is null. FAIL");
                    else
                    {
                        console.log("brush_1_2.png is not null. ok");
                        var key:string = "2_1";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_1_3.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_1_3.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush1_3.png is null. FAIL");
                    else
                    {
                        console.log("brush_1_3.png is not null. ok");
                        var key:string = "3_1";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_1_4.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_1_4.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush1_4.png is null. FAIL");
                    else
                    {
                        console.log("brush_1_4.png is not null. ok");
                        var key:string = "4_1";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });

            
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_2_0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_2_0.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_2_0.png is null. FAIL");
                    else
                    {
                        console.log("brush_2_0.png is not null. ok");
                        var key:string = "0_2";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_2_1.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_2_1.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_2_1.png is null. FAIL");
                    else
                    {
                        console.log("brush_2_1.png is not null. ok");
                        var key:string = "1_2";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_2_2.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_2_2.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_2_2.png is null. FAIL");
                    else
                    {
                        console.log("brush_2_2.png is not null. ok");
                        var key:string = "2_2";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_2_3.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_2_3.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_2_3.png is null. FAIL");
                    else
                    {
                        console.log("brush_2_3.png is not null. ok");
                        var key:string = "3_2";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_2_4.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_2_4.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_2_4.png is null. FAIL");
                    else
                    {
                        console.log("brush_2_4.png is not null. ok");
                        var key:string = "4_2";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });


            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_3_0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_3_0.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_3_0.png is null. FAIL");
                    else
                    {
                        console.log("brush_3_0.png is not null. ok");
                        var key:string = "0_3";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_3_1.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_3_1.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_3_1.png is null. FAIL");
                    else
                    {
                        console.log("brush_3_1.png is not null. ok");
                        var key:string = "1_3";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_3_2.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_3_2.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_3_2.png is null. FAIL");
                    else
                    {
                        console.log("brush_3_2.png is not null. ok");
                        var key:string = "2_3";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_3_3.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_3_3.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_3_3.png is null. FAIL");
                    else
                    {
                        console.log("brush_3_3.png is not null. ok");
                        var key:string = "3_3";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_3_4.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_3_4.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_3_4.png is null. FAIL");
                    else
                    {
                        console.log("brush_3_4.png is not null. ok");
                        var key:string = "4_3";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });


            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_4_0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_4_0.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_4_0.png is null. FAIL");
                    else
                    {
                        console.log("brush_4_0.png is not null. ok");
                        var key:string = "0_4";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_4_1.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_4_1.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_4_1.png is null. FAIL");
                    else
                    {
                        console.log("brush_4_1.png is not null. ok");
                        var key:string = "1_4";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_4_2.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_4_2.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_4_2.png is null. FAIL");
                    else
                    {
                        console.log("brush_4_2.png is not null. ok");
                        var key:string = "2_4";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_4_3.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_4_3.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_4_3.png is null. FAIL");
                    else
                    {
                        console.log("brush_4_3.png is not null. ok");
                        var key:string = "3_4";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            
            
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_5_0.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_5_0.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_5_0.png is null. FAIL");
                    else
                    {
                        console.log("brush_5_0.png is not null. ok");
                        var key:string = "0_5";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_5_1.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_4_1.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_5_1.png is null. FAIL");
                    else
                    {
                        console.log("brush_5_1.png is not null. ok");
                        var key:string = "1_5";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_5_2.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_5_2.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_5_2.png is null. FAIL");
                    else
                    {
                        console.log("brush_5_2.png is not null. ok");
                        var key:string = "2_5";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_5_3.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_5_3.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_5_3.png is null. FAIL");
                    else
                    {
                        console.log("brush_5_3.png is not null. ok");
                        var key:string = "3_5";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                }
            });
            test_Heightmap_terrain.app.getAssetMgr().load(`${resRootPath}atlas/1/brush_5_4.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var texture0 = test_Heightmap_terrain.app.getAssetMgr().getAssetByName(`brush_5_4.png`) as m4m.framework.texture;
                    if(texture0 == null)
                        console.log("brush_5_4.png is null. FAIL");
                    else
                    {
                        console.log("brush_5_4.png is not null. ok");
                        var key:string = "4_5";
                        test_Heightmap_terrain.dictBrushData[key] = new Uint8Array(test_Heightmap_terrain.getHeightmapPixels1(texture0, 0));
                    }
                    console.log("dictBrushData[\"0_0\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["0_0"]);
                    console.log("dictBrushData[\"1_0\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["1_0"]);
                    console.log("dictBrushData[\"2_0\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["2_0"]);
                    console.log("dictBrushData[\"3_0\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["3_0"]);
                    console.log("dictBrushData[\"0_1\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["0_1"]);
                    console.log("dictBrushData[\"1_1\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["1_1"]);
                    console.log("dictBrushData[\"2_1\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["2_1"]);
                    console.log("dictBrushData[\"3_1\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["3_1"]);
                    console.log("dictBrushData[\"0_2\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["0_2"]);
                    console.log("dictBrushData[\"1_2\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["1_2"]);
                    console.log("dictBrushData[\"2_2\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["2_2"]);
                    console.log("dictBrushData[\"3_2\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["3_2"]);
                    console.log("dictBrushData[\"0_3\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["0_3"]);
                    console.log("dictBrushData[\"1_3\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["1_3"]);
                    console.log("dictBrushData[\"2_3\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["2_3"]);
                    console.log("dictBrushData[\"3_3\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["3_3"]);
                    console.log("dictBrushData[\"0_4\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["0_4"]);
                    console.log("dictBrushData[\"1_4\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["1_4"]);
                    console.log("dictBrushData[\"2_4\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["2_4"]);
                    console.log("dictBrushData[\"3_4\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["3_4"]);
                    console.log("dictBrushData[\"0_5\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["0_5"]);
                    console.log("dictBrushData[\"1_5\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["1_5"]);
                    console.log("dictBrushData[\"2_5\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["2_5"]);
                    console.log("dictBrushData[\"3_5\"]");
                    console.log(test_Heightmap_terrain.dictBrushData["3_5"]);
                }
            });

            //btn_b.pressedGraphic = new m4m.framework.sprite("brush0.jpg");;
            btn_b.pressedColor = new m4m.math.color(1, 1, 1, 1);
            btn_b.transition = m4m.framework.TransitionType.SpriteSwap;
        }

        for(var i = 0; i < 11; i++)
        {
            let btn_b = this.btn[i].getComponent("button") as m4m.framework.button;
            console.log(btn_b);
            if(i == 0)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {
                    this.OnBrushBtnClick0(this.btn[i]);
                }, this);
            }
            else if(i == 1)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {

                    this.OnBrushBtnClick1(this.btn[i]);
                }, this);
            }
            else if(i == 2)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {

                    this.OnBrushBtnClick2(this.btn[i]);
                }, this);
            }
            else if(i == 3)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {

                    this.OnBrushBtnClick3(this.btn[i]);
                }, this);
            }
            else if(i == 4)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {

                    this.OnBrushBtnClick4(this.btn[i]);
                }, this);
            }
            else if(i == 5)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {

                    this.OnBrushBtnClick5(this.btn[i]);
                }, this);
            }
            else if(i == 6)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {
                    this.OnSetBrushSize0(this.btn[i]);
                }, this);
            }
            else if(i == 7)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {
                    this.OnSetBrushSize1(this.btn[i]);
                }, this);
            }
            else if(i == 8)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {
                    this.OnSetBrushSize2(this.btn[i]);
                }, this);
            }
            else if(i == 9)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {
                    this.OnSetBrushSize3(this.btn[i]);
                }, this);
            }
            else if(i == 10)
            {
                btn_b.addListener(m4m.event.UIEventEnum.PointerClick, function ()
                {
                    this.OnSetBrushSize4(this.btn[i]);
                }, this);
            }
        }
        return this.btn;
    }
    OnSetBrushSize0(obj:m4m.framework.transform2D)
    {
        console.log("Brush size 0");
        test_Heightmap_terrain.selectedBrushSize = 0;
    }
    OnSetBrushSize1(obj:m4m.framework.transform2D)
    {
        console.log("Brush size 1");
        test_Heightmap_terrain.selectedBrushSize = 1;
    }
    OnSetBrushSize2(obj:m4m.framework.transform2D)
    {
        console.log("Brush size 2");
        test_Heightmap_terrain.selectedBrushSize = 2;
    }
    OnSetBrushSize3(obj:m4m.framework.transform2D)
    {
        console.log("Brush size 3");
        test_Heightmap_terrain.selectedBrushSize = 3;
    }
    OnSetBrushSize4(obj:m4m.framework.transform2D)
    {
        console.log("Brush size 4");
        test_Heightmap_terrain.selectedBrushSize = 4;
    }
    
    OnBrushBtnClick0(obj:m4m.framework.transform2D){
        console.log("btn 0 clicked");
        //this.UpdateBrush(0, 2);
        test_Heightmap_terrain.selectedBrush = 0;
    }
    OnBrushBtnClick1(obj:m4m.framework.transform2D){
        console.log("btn 1 clicked");
        //this.UpdateBrush(1, 2);
        test_Heightmap_terrain.selectedBrush = 1;
    }
    OnBrushBtnClick2(obj:m4m.framework.transform2D){
        console.log("btn 2 clicked");
        //this.UpdateBrush(2, 2);
        test_Heightmap_terrain.selectedBrush = 2;
    }
    OnBrushBtnClick3(obj:m4m.framework.transform2D){
        console.log("btn 3 clicked");
        //this.UpdateBrush(3, 2);
        test_Heightmap_terrain.selectedBrush = 3;
    }
    OnBrushBtnClick4(obj:m4m.framework.transform2D){
        console.log("btn 4 clicked");
        //this.UpdateBrush(4, 2);
        test_Heightmap_terrain.selectedBrush = 4;
    }
    OnBrushBtnClick5(obj:m4m.framework.transform2D){
        console.log("btn 5 clicked");
        //this.UpdateBrush(5, 2);
        test_Heightmap_terrain.selectedBrush = 5;
    }

    update(delta: number) {
        //console.log(this.nFrame);
        if(this.nFrame == 0)
        {
            console.log("addbtn called");
            this.addbtn('0', '0', "Modify", this);
        }

        // var screenPos = new m4m.math.vector2(test_Heightmap_terrain.app.getInputMgr().point.x, test_Heightmap_terrain.app.getInputMgr().point.y);
        // if(this.btn != null)
        // {
        //     //console.log(screenPos);
        //     screenPos.x -= 0.5*129;
        //     screenPos.y -= 0.5*129;
        // }
        

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