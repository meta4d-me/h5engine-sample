namespace t
{
    export class test_posteffect implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load(`${resRootPath}shader/Mainshader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    state.finish = true;
                }
            }
            );
        }

        private loadText(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load(`${resRootPath}texture/map_diffuse.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    state.finish = true;
                }
                else
                {
                    state.error = true;
                }
            }
            );
        }

        private addcube(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            for (var i = -4; i < 5; i++)
            {
                for (var j = -4; j < 5; j++)
                {
                    var cube = new m4m.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                    cube.localTranslate.x = i;
                    cube.localTranslate.z = j;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                    // var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null)
                    {
                        cuber.materials = [];
                        cuber.materials.push(new m4m.framework.material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        //cuber.materials[0].setVector4("_Color", new m4m.math.vector4(0.4, 0.4, 0.2, 1.0));

                        let texture = this.app.getAssetMgr().getAssetByName("map_diffuse.png") as m4m.framework.texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }

                }
            }

            state.finish = true;
        }
        private addcamandlight(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {

            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 1;
            this.camera.far = 100;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新


            //set post effect
            {
                                //color 2 rt
                var color = new m4m.framework.cameraPostQueue_Color();
                color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                this.camera.postQueues.push(color);


                //depth 2 rt
                var depth = new m4m.framework.cameraPostQueue_Depth();
                depth.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                this.camera.postQueues.push(depth);

                var post = new m4m.framework.cameraPostQueue_Quad();
                post.material.setShader(this.scene.app.getAssetMgr().getShader("outline.shader.json"));

                var text = new m4m.framework.texture("_depth");
                text.glTexture = depth.renderTarget;

                var textcolor = new m4m.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;

                post.material.setTexture("_MainTex", textcolor);
                post.material.setTexture("_DepthTex", text);
                this.camera.postQueues.push(post);

            }


            //灯光
            var lighttran = new m4m.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light") as m4m.framework.light;
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();

            {
                var cube = new m4m.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;

                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new m4m.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    //cuber.materials[0].setVector4("_Color", new m4m.math.vector4(0.4, 0.4, 0.2, 1.0));

                    let texture = this.app.getAssetMgr().getAssetByName("map_diffuse.png") as m4m.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);

                }
            }
            state.finish = true;

        }
        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.style.top = "120px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            btn.onclick = () =>
            {
                if (this.light != null)
                {
                    if (this.light.type == m4m.framework.LightTypeEnum.Direction)
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (this.light.type == m4m.framework.LightTypeEnum.Point)
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Spot;
                        this.light.spotAngelCos = Math.cos(0.2 * Math.PI);
                        console.log("聚光灯");
                    }
                    else
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            }

            let list: string[] = [
                "灰度+描边",
                "马赛克",
                "均值模糊",
                "高斯模糊",
                "径向模糊",
                "旋转扭曲",
                "桶模糊",
                "bloom",
                "景深",
                "Vignetting",
                "校色"
            ];

            var select = document.createElement("select");
            select.style.top = "240px";
            select.style.position = "absolute";
            this.app.container.appendChild(select);
            for (let i = 0; i < list.length; i++)
            {
                let op = document.createElement("option");
                op.value = i.toString();
                op.innerText = list[i];
                select.appendChild(op);
            }
            select.onchange = () =>
            {
                this.camera.postQueues = [];

                if (select.value == "0")
                {
                    var color = new m4m.framework.cameraPostQueue_Color();
                    color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(color);

                    //depth 2 rt
                    var depth = new m4m.framework.cameraPostQueue_Depth();
                    depth.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(depth);

                    var post = new m4m.framework.cameraPostQueue_Quad();
                    post.material.setShader(this.scene.app.getAssetMgr().getShader("outline.shader.json"));

                    var text = new m4m.framework.texture("_depth");
                    text.glTexture = depth.renderTarget;

                    var textcolor = new m4m.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;

                    post.material.setTexture("_MainTex", textcolor);
                    post.material.setTexture("_DepthTex", text);
                    this.camera.postQueues.push(post);
                    console.log("灰度+描边");
                }
                else if (select.value == "1")
                {
                    var color = new m4m.framework.cameraPostQueue_Color();
                    color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(color);

                    var post = new m4m.framework.cameraPostQueue_Quad();
                    let sh = this.scene.app.getAssetMgr().getShader("mosaic.shader.json");
                    post.material.setShader(sh);

                    var textcolor = new m4m.framework.texture("_color");0
                    textcolor.glTexture = color.renderTarget;

                    post.material.setTexture("_MainTex", textcolor);
                    this.camera.postQueues.push(post);
                    console.log("马赛克");
                }
                else if (select.value == "2")
                {
                    var color = new m4m.framework.cameraPostQueue_Color();
                    color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(color);

                    var post = new m4m.framework.cameraPostQueue_Quad();
                    post.material.setShader(this.scene.app.getAssetMgr().getShader("blur.shader.json"));

                    var textcolor = new m4m.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;

                    post.material.setTexture("_MainTex", textcolor);
                    post.material.setFloat("_BlurGap",1);
                    this.camera.postQueues.push(post);
                    console.log("均值模糊");
                }
                else if (select.value == "3")
                {
                    var color = new m4m.framework.cameraPostQueue_Color();
                    color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(color);

                    var post = new m4m.framework.cameraPostQueue_Quad();
                    post.material.setShader(this.scene.app.getAssetMgr().getShader("gaussianBlur.shader.json"));

                    var textcolor = new m4m.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;

                    post.material.setTexture("_MainTex", textcolor);
                    post.material.setFloat("_BlurGap", 2);
                    post.material.setFloat("_BlurSigma", 6);
                    post.material.setFloat("_BlurLayer", 10);
                    this.camera.postQueues.push(post);
                    console.log("高斯模糊");
                }
                else if (select.value == "4")
                {
                    var color = new m4m.framework.cameraPostQueue_Color();
                    color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(color);

                    var post = new m4m.framework.cameraPostQueue_Quad();
                    post.material.setShader(this.scene.app.getAssetMgr().getShader("radial_blur.shader.json"));

                    var textcolor = new m4m.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;

                    post.material.setTexture("_MainTex", textcolor);
                    post.material.setFloat("_Level", 50);
                    this.camera.postQueues.push(post);
                    console.log("径向模糊");
                }
                else if (select.value == "5")
                {
                    var color = new m4m.framework.cameraPostQueue_Color();
                    color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(color);

                    var post = new m4m.framework.cameraPostQueue_Quad();
                    post.material.setShader(this.scene.app.getAssetMgr().getShader("contort.shader.json"));

                    var textcolor = new m4m.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;

                    post.material.setTexture("_MainTex", textcolor);
                    this.camera.postQueues.push(post);
                    console.log("旋转扭曲");
                }
                else if (select.value == "6")
                {
                    var color = new m4m.framework.cameraPostQueue_Color();
                    color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(color);

                    var post = new m4m.framework.cameraPostQueue_Quad();
                    post.material.setShader(this.scene.app.getAssetMgr().getShader("barrel_blur.shader.json"));

                    var textcolor = new m4m.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;

                    post.material.setTexture("_MainTex", textcolor);
                    this.camera.postQueues.push(post);
                    console.log("桶模糊");
                }else if (select.value == "7")
                {
                    let bloomctr = this.scene.mainCamera.gameObject.addComponent("bloomctr") as m4m.framework.bloomctr;

                    console.log("bloom");
                }else if (select.value == "8")
                {
                    this.camera.postQueues=[];
                    var color = new m4m.framework.cameraPostQueue_Color();
                    color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(color);
                    var textcolor = new m4m.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;

                    var depth = new m4m.framework.cameraPostQueue_Depth();
                    depth.renderTarget=new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                    this.camera.postQueues.push(depth);
                    var depthcolor = new m4m.framework.texture("_depthcolor");
                    depthcolor.glTexture = depth.renderTarget;

                    var texsize:number=1024;
                    var post = new m4m.framework.cameraPostQueue_Quad();
                    post.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl,texsize, texsize, true, false);
                    let isGaussianblur = false; //高斯模糊 和普通模糊
                    if(isGaussianblur){
                        post.material.setShader(this.scene.app.getAssetMgr().getShader("gaussianBlur.shader.json"));
                        post.material.setTexture("_MainTex", textcolor);
                        post.material.setFloat("_BlurGap", 2);
                        post.material.setFloat("_BlurSigma", 6);
                        post.material.setFloat("_BlurLayer", 10);
                    }else{
                        post.material.setShader(this.scene.app.getAssetMgr().getShader("blur.shader.json"));
                        post.material.setTexture("_MainTex", textcolor);
                    }
                    this.camera.postQueues.push(post);

                    var texBlur= new m4m.framework.texture("_blur");
                    texBlur.glTexture = post.renderTarget;

                    var post2 = new m4m.framework.cameraPostQueue_Quad();
                    post2.material.setShader(this.scene.app.getAssetMgr().getShader("dof.shader.json"));
                    post2.material.setTexture("_MainTex",textcolor);
                    post2.material.setTexture("_BlurTex",texBlur);
                    post2.material.setTexture("_DepthTex",depthcolor);
                    //var focalDistance=(10-this.camera.near)/(this.camera.far-this.camera.near);
                    var focalDistance=0.96;
                    post2.material.setFloat("_focalDistance",focalDistance);
                    this.camera.postQueues.push(post2);
                    console.log("景深");
                }else if (select.value == "9")
                {
                    let actr = this.scene.mainCamera.gameObject.addComponent("vignettingCtr") as m4m.framework.vignettingCtr;
                    console.log("Vignetting");
                }else if(select.value=="10")
                {
                    // let actr = this.scene.mainCamera.gameObject.addComponent("colorCorrect") as m4m.framework.colorCorrect;
                    // console.log("colorCorrect"); 
                }

            }

            this.addbtn("60px","深度图",()=>{
                this.camera.postQueues=[];
                var depth = new m4m.framework.cameraPostQueue_Depth();
                this.camera.postQueues.push(depth);
            });

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        }

        private addbtn(topOffset:string,textContent:string,func:()=>void)
        {
            var btn = document.createElement("button");
            btn.style.top = topOffset;
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

            btn.textContent = textContent;
            btn.onclick = () =>
            {
                this.camera.postQueues = [];
                func();
                console.log("Handle Clicking..."+textContent);
            }
        }

        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number = 0;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        update(delta: number)
        {
            this.taskmgr.move(delta);

            this.timer += delta;

            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);

            if (this.camera != null)
            {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new m4m.math.vector3(x2 * 10, 2.25, -z2 * 10);
                // objCam.markDirty();
                objCam.updateWorldTran();
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                objCam.markDirty();
            }

            let isbreak = false;
            if(isbreak) return;

            if (this.light != null)
            {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new m4m.math.vector3(x * 5, 3, z * 5);
                objlight.updateWorldTran();
                objlight.lookatPoint(new m4m.math.vector3(0, 0, 0));
                objlight.markDirty();

            }

        }
    }


}
