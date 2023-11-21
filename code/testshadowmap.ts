class test_ShadowMap implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    renderer: m4m.framework.meshRenderer[];
    skinRenders: m4m.framework.skinnedMeshRenderer[];
    assetmgr: m4m.framework.assetMgr;
    start(app: m4m.framework.application) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.assetmgr = this.app.getAssetMgr();
        this.scene.getRoot().localTranslate = new m4m.math.vector3(0, 0, 0);
        let name = "baihu";
        this.app.getAssetMgr().load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (state) => {
            if (state.isfinish) {
                this.app.getAssetMgr().load(`${resRootPath}prefab/testshadowmap/testshadowmap.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto,
                    (s) => {
                        if (s.isfinish) {
                            var _scene: m4m.framework.rawscene = this.app.getAssetMgr().getAssetByName("testshadowmap.scene.json", "testshadowmap.assetbundle.json") as m4m.framework.rawscene;
                            var _root = _scene.getSceneRoot();
                            let assetmgr = this.app.getAssetMgr();
                            this.scene.addChild(_root);
                            // this.scene.getRoot().markDirty();
                            _root.markDirty();
                            //_root.updateTran(false);
                            //_root.updateAABBChild();

                            let _aabb = _root.aabb;
                            console.log(_aabb.maximum + " : " + _aabb.minimum);
                            this.FitToScene(this.lightcamera, _aabb);
                            this.ShowCameraInfo(this.lightcamera);

                            {
                                var depth = new m4m.framework.cameraPostQueue_Depth();
                                depth.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                                this.lightcamera.postQueues.push(depth);

                                this.depthTexture = new m4m.framework.texture("_depth");
                                this.depthTexture.glTexture = depth.renderTarget;
                                // m4m.framework.shader.setGlobalTexture ("_Light_Depth",this.depthTexture);
                            }


                            let mrs = _root.gameObject.getComponentsInChildren("meshRenderer") as m4m.framework.meshRenderer[];
                            mrs.forEach(item => {
                                item.materials.forEach(el => {
                                    if (el.getShader().getName() == this.shadowSh) {
                                        this.mats.push(el);
                                    }
                                })
                            })

                            // this.collectMat();
                            this.mats.forEach(element => {
                                if (element) element.setTexture("_Light_Depth", this.depthTexture);
                            });
                        }
                    });
            }
        });

        //添加一个摄像机
        var lightCamObj = new m4m.framework.transform();
        lightCamObj.name = "LightCamera";
        this.scene.addChild(lightCamObj);
        lightCamObj.localTranslate = new m4m.math.vector3(10, 10, -10);
        this.lightcamera = lightCamObj.gameObject.addComponent("camera") as m4m.framework.camera;
        this.lightcamera.opvalue = 0;
        this.lightcamera.gameObject.transform.lookatPoint(new m4m.math.vector3(0, 0, 0));
        lightCamObj.markDirty();//标记为需要刷新


        var viewCamObj = new m4m.framework.transform();
        viewCamObj.name = "ViewCamera";
        this.scene.addChild(viewCamObj);
        viewCamObj.localTranslate = new m4m.math.vector3(20, 20, 20);
        viewCamObj.lookatPoint(new m4m.math.vector3(0, 0, 0));
        this.viewcamera = viewCamObj.gameObject.addComponent("camera") as m4m.framework.camera;

        viewCamObj.markDirty();
        this.ShowUI();
    }

    private shadowSh = "shadowmap.shader.json";
    private mats: m4m.framework.material[] = [];
    /**
     * 收集材质
     * @returns 
     */
    private collectMat() {
        if (!this.assetmgr) return
        let resmap = this.assetmgr.mapRes;
        for (let key in resmap) {
            let asset = resmap[key];
            if (!asset["asset"] || !(asset["asset"] instanceof m4m.framework.material)) continue;
            let mat = asset["asset"] as m4m.framework.material;
            if (!mat["shader"] || mat["shader"].getName() != this.shadowSh) continue;
            this.mats.push(mat);
        }
    }

    /**
     * 设置材质
     * @param key key
     * @param value 值
     * @returns 
     */
    private setmat(key: string, value: any) {
        if (!this.mats) return;
        this.mats.forEach(element => {
            if (element) element.setTexture("_Light_Depth", this.depthTexture);
        });
    }

    lightcamera: m4m.framework.camera;//方向光的camera
    depthTexture: m4m.framework.texture;//方向光的camera生成的深度图
    // lightArea:m4m.framework.transform;
    // depthTexTrans:m4m.framework.transform;

    viewcamera: m4m.framework.camera;//视图camera

    timer: number = 0;

    posToUV: m4m.math.matrix = new m4m.math.matrix();
    lightProjection: m4m.math.matrix = new m4m.math.matrix();

    update(delta: number) {
        this.posToUV.rawData[0] = 0.5;
        this.posToUV.rawData[1] = 0.0;
        this.posToUV.rawData[2] = 0.0;
        this.posToUV.rawData[3] = 0.0;

        this.posToUV.rawData[4] = 0.0;
        this.posToUV.rawData[5] = 0.5;
        this.posToUV.rawData[6] = 0.0;
        this.posToUV.rawData[7] = 0.0;

        this.posToUV.rawData[8] = 0.0;
        this.posToUV.rawData[9] = 0.0;
        this.posToUV.rawData[10] = 1.0;
        this.posToUV.rawData[11] = 0.0;

        this.posToUV.rawData[12] = 0.5;
        this.posToUV.rawData[13] = 0.5;
        this.posToUV.rawData[14] = 0.0;
        this.posToUV.rawData[15] = 1.0;


        let worldToView: m4m.math.matrix = m4m.math.pool.new_matrix();
        this.lightcamera.calcViewMatrix(worldToView);

        var vpp = new m4m.math.rect();
        this.lightcamera.calcViewPortPixel(this.app, vpp);
        this.asp = vpp.w / vpp.h;
        let projection: m4m.math.matrix = m4m.math.pool.new_matrix();
        this.lightcamera.calcProjectMatrix(this.asp, projection);

        m4m.math.matrixMultiply(projection, worldToView, this.lightProjection);
        m4m.math.matrixMultiply(this.posToUV, this.lightProjection, this.lightProjection);
        // m4m.framework.shader.setGlobalMatrix("_LightProjection", this.lightProjection);
        // m4m.framework.shader.setGlobalFloat("_bias",0.001);
        this.mats.forEach(element => {
            if (element) {
                element.setMatrix("_LightProjection", this.lightProjection);
                if (element) element.setFloat("_bias", 0.001);
            }
        });
    }

    /**
     * 适配场景包围
     * @param lightCamera 相机
     * @param aabb aabb 包围
     */
    FitToScene(lightCamera: m4m.framework.camera, aabb: m4m.framework.aabb) {
        lightCamera.gameObject.transform.setWorldPosition(new m4m.math.vector3(aabb.center.x, aabb.center.y, aabb.center.z));

        let _vec3 = m4m.math.pool.new_vector3();
        m4m.math.vec3Subtract(aabb.maximum, aabb.minimum, _vec3);

        let maxLength = m4m.math.vec3Length(_vec3);

        lightCamera.size = maxLength;
        lightCamera.near = -maxLength / 2;
        lightCamera.far = maxLength / 2;

    }

    asp: number;
    labelNear: HTMLLabelElement;
    labelFar: HTMLLabelElement;
    inputNear: HTMLInputElement;
    inputFar: HTMLInputElement;

    /**
     * 显示UI
     */
    ShowUI() {
        document.addEventListener("keydown", (ev) => {
            if (ev.key === "c") {
                if (this.viewcamera.postQueues.length > 0)
                    this.viewcamera.postQueues = [];
                else {
                    var post = new m4m.framework.cameraPostQueue_Quad();
                    post.material.setShader(this.scene.app.getAssetMgr().getShader("mask.shader.json"));

                    post.material.setTexture("_MainTex", this.depthTexture);
                    this.viewcamera.postQueues.push(post);
                }
            }
        })

        this.labelNear = document.createElement("label");
        this.labelNear.style.top = "100px";
        this.labelNear.style.position = "absolute";
        this.app.container.appendChild(this.labelNear);

        this.inputNear = document.createElement("input");
        this.inputNear.type = "range";
        this.inputNear.min = "-15";
        this.inputNear.max = "15";
        this.inputNear.step = "0.1";
        this.inputNear.oninput = () => {
            let _value = parseFloat(this.inputNear.value);
            if (_value > this.lightcamera.far) {
                _value = this.lightcamera.far;
                this.inputNear.value = _value.toString();
            }
            this.labelNear.textContent = "near :" + _value;
            this.lightcamera.near = _value;

            // this.lightArea.localScale = new m4m.math.vector3(this.asp * this.lightcamera.size,this.lightcamera.size,this.lightcamera.far - this.lightcamera.near);
            // this.lightArea.localTranslate = new m4m.math.vector3(0,0,(this.lightcamera.far + this.lightcamera.near)/2);
            // this.lightArea.markDirty();
        }
        this.inputNear.style.top = "124px";
        this.inputNear.style.position = "absolute";
        this.app.container.appendChild(this.inputNear);

        this.labelFar = document.createElement("label");
        this.labelFar.style.top = "225px";
        this.labelFar.style.position = "absolute";
        this.app.container.appendChild(this.labelFar);

        this.inputFar = document.createElement("input");
        this.inputFar.type = "range";
        this.inputFar.min = "-15";
        this.inputFar.max = "15";
        this.inputFar.step = "0.1";
        this.inputFar.oninput = () => {
            let _value = parseFloat(this.inputFar.value);
            if (_value < this.lightcamera.near) {
                _value = this.lightcamera.near;
                this.inputFar.value = _value.toString();
            }
            this.labelFar.textContent = "far :" + _value;
            this.lightcamera.far = _value;

            // this.lightArea.localScale = new m4m.math.vector3(this.asp * this.lightcamera.size,this.lightcamera.size,this.lightcamera.far - this.lightcamera.near);
            // this.lightArea.localTranslate = new m4m.math.vector3(0,0,(this.lightcamera.far + this.lightcamera.near)/2);
            // this.lightArea.markDirty();

        }
        this.inputFar.style.top = "250px";
        this.inputFar.style.position = "absolute";
        this.app.container.appendChild(this.inputFar);


        // let castShadowCheckBox = document.createElement("input");
        // castShadowCheckBox.type = "checkbox";
        // castShadowCheckBox.checked = false;
        // castShadowCheckBox.onchange = () =>
        // {
        //     let castshadowNum = castShadowCheckBox.checked?1.0:0.0;
        //     m4m.framework.shader.setGlobalFloat("_CastShadow",castshadowNum);
        // }
        // castShadowCheckBox.style.top = "350px";
        // castShadowCheckBox.style.position = "absolute";
        // this.app.container.appendChild(castShadowCheckBox);


        // var inputDepth = document.createElement("input");
        // inputDepth.type = "range";
        // inputDepth.min = "-15";
        // inputDepth.max = "15";
        // inputDepth.step = "0.1";
        // inputDepth.oninput = () =>
        // {
        //     let _value = parseFloat(inputDepth.value);

        //     this.depthTexTrans.localTranslate = new m4m.math.vector3(0,0,_value);
        //     this.depthTexTrans.markDirty();
        // }
        // inputDepth.style.top = "400px";
        // inputDepth.style.position = "absolute";
        // this.app.container.appendChild(inputDepth);


        var cameraRotateLabel = document.createElement("label");
        cameraRotateLabel.style.top = "375px";
        cameraRotateLabel.style.position = "absolute";
        cameraRotateLabel.textContent = "改变灯光角度";
        this.app.container.appendChild(cameraRotateLabel);

        var inputCameraRotateY = document.createElement("input");
        inputCameraRotateY.type = "range";
        inputCameraRotateY.min = "-180";
        inputCameraRotateY.max = "180";
        inputCameraRotateY.step = "1";
        inputCameraRotateY.oninput = () => {
            let _value = parseFloat(inputCameraRotateY.value);

            let _angle = this.lightcamera.gameObject.transform.localEulerAngles;

            this.lightcamera.gameObject.transform.localEulerAngles = new m4m.math.vector3(_angle.x, _value, _angle.z);
            this.lightcamera.gameObject.transform.markDirty();
        }
        inputCameraRotateY.style.top = "400px";
        inputCameraRotateY.style.position = "absolute";
        this.app.container.appendChild(inputCameraRotateY);
    }

    /**
     * 显示相机信息
     * @param camera 
     */
    ShowCameraInfo(camera: m4m.framework.camera) {
        let near = camera.near.toString();
        let far = camera.far.toString();
        this.inputNear.value = near;
        this.inputFar.value = far;
        this.labelNear.textContent = "near :" + near;
        this.labelFar.textContent = "far :" + far;
    }
}