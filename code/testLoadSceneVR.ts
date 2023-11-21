class test_loadSceneVR implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    objCamRoot: m4m.framework.transform;
    normalCam: m4m.framework.camera;
    start(app: m4m.framework.application) {
        this.app = app;
        this.scene = this.app.getScene();
        let assetMgr = this.app.getAssetMgr();
        //相机剔除暂时 关闭
        app.isFrustumCulling = false;
        //xrManager init
        xrManager.init();

        //init cam
        this.initCam(app);

        //相机控制
        let hoverc = this.objCamRoot.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 163;
        hoverc.tiltAngle = 16.5;
        hoverc.distance = 1;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(43, 40, 15);

        //VR 按钮
        vrButton.tryListenSessionGranted();
        const ele = vrButton.makeButton(this.onEnterVR.bind(this), this.onExitVR.bind(this));
        //doc 挂载元素
        document.body.appendChild(ele);

        //加载场景
        util.loadShader(assetMgr)
            .then(() => {
                let sceneName = "MainCity_"
                assetMgr.load(`${resRootPath}prefab/${sceneName}/${sceneName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s1) => {
                    if (s1.isfinish) {
                        const _scene = assetMgr.getAssetByName(sceneName + ".scene.json", `${sceneName}.assetbundle.json`) as m4m.framework.rawscene;
                        const _root = _scene.getSceneRoot();
                        _root.name = "sceneModel";
                        // this.scene.addChild(_root);
                        xrManager.vrModelRoot.addChild(_root);
                        this.app.getScene().lightmaps = [];
                        _scene.useLightMap(this.app.getScene());
                        _scene.useFog(this.app.getScene());

                        //set vr offset 
                        xrManager.setViewOffsetPos(new m4m.math.vector3(-70, 35, 30));
                    }
                });
            })
    }

    /**
     * 进入 VR 模式
     * @param session vr 传感器
     */
    private onEnterVR(session: XRSession) {
        console.log(`进入 VR`);
        this.normalCam.gameObject.visible = false;

        xrManager.setSession(session);
    }

    /**
     * 当退出VR模式时调用
     */
    private onExitVR() {
        console.log(`退出 VR`);
        this.normalCam.gameObject.visible = true;

    }

    /**
     * 初始化相机
     * @param app 
     */
    private initCam(app: m4m.framework.application) {
        let objCamRoot = this.objCamRoot = new m4m.framework.transform();
        app.getScene().addChild(objCamRoot);
        objCamRoot.localTranslate = new m4m.math.vector3(52, 48, 6);
        {
            let objCamNormal = new m4m.framework.transform();
            objCamRoot.addChild(objCamNormal);
            //添加一个摄像机 正常模式
            let cam = this.normalCam = objCamNormal.gameObject.addComponent("camera") as m4m.framework.camera;
            cam.near = 0.01;
            cam.far = 500;
            // cam.fov = Math.PI * 105 / 180; //105度相机
            cam.viewport = new m4m.math.rect(0, 0, 1, 1);
        }
    }

    update(delta: number) {
    }
}

/** VR 切换按钮 */
class vrButton {
    private static xrSessionIsGranted: boolean = false;

    /**
     * 设置 元素样式
     * @param element html 元素
     */
    private static stylizeElement(element: HTMLElement) {
        element.style.position = 'absolute';
        element.style.bottom = '20px';
        element.style.padding = '12px 6px';
        element.style.border = '1px solid #fff';
        element.style.borderRadius = '4px';
        element.style.background = 'rgba(0,0,0,0.1)';
        element.style.color = '#fff';
        element.style.font = 'normal 13px sans-serif';
        element.style.textAlign = 'center';
        element.style.opacity = '0.5';
        element.style.outline = 'none';
        element.style.zIndex = '999';
    }

    /**
     * 创建 VR 按钮
     */
    public static makeButton(onEnter?: (session: XRSession) => any, onExit?: Function) {
        //创建 html 按钮
        const button = document.createElement('button');

        /** 展示 进入VR */
        const showEnterVR = () => {

            let currentSession = null;

            async function onSessionStarted(session) {

                session.addEventListener('end', onSessionEnded);

                //设置 传感器
                // await renderer.xr.setSession(session);
                if (onEnter) { await onEnter(session) }
                button.textContent = '退出 VR';

                currentSession = session;

            }

            const onSessionEnded = ( /*event*/) => {

                currentSession.removeEventListener('end', onSessionEnded);

                if (onExit) { onExit() }

                button.textContent = '进入 VR';

                currentSession = null;

            }

            //

            button.style.display = '';

            button.style.cursor = 'pointer';
            button.style.left = 'calc(50% - 50px)';
            button.style.width = '100px';

            button.textContent = '进入 VR';

            button.onmouseenter = function () {

                button.style.opacity = '1.0';

            };

            button.onmouseleave = function () {

                button.style.opacity = '0.5';

            };

            button.onclick = function () {

                if (currentSession === null) {

                    //requestReferenceSpace 仅当对应的功能在会话创建时才能请求,“local” 始终在 immersive 模式可用不需要单独请求。
                    const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'] };
                    navigator.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted);

                } else {

                    currentSession.end();

                }

            };

        }

        const showWebXRNotFound = () => {

            disableButton();

            button.textContent = 'VR 不支持';

        }

        /** 删除按钮  */
        const disableButton = () => {

            button.style.display = '';

            button.style.cursor = 'auto';
            button.style.left = 'calc(50% - 75px)';
            button.style.width = '150px';

            button.onmouseenter = null;
            button.onmouseleave = null;

            button.onclick = null;

        }

        /** 展示 VR没有允许的状态 */
        const showVRNotAllowed = (exception) => {

            disableButton();

            console.warn('调用 xr.isSessionSupported 时的报错', exception);

            button.textContent = 'VR 没允许';

        }
        if ('xr' in navigator) {

            button.id = 'VRButton';
            button.style.display = 'none';

            this.stylizeElement(button);

            navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {

                supported ? showEnterVR() : showWebXRNotFound();

                if (supported && vrButton.xrSessionIsGranted) {

                    button.click();

                }

            }).catch(showVRNotAllowed);

            return button;

        } else {

            const message = document.createElement('a');

            if (window.isSecureContext === false) {

                message.href = document.location.href.replace(/^http:/, 'https:');
                message.innerHTML = 'WEBXR 需要 HTTPS'; // TODO Improve message

            } else {

                message.href = 'https://immersiveweb.dev/';
                message.innerHTML = 'WEBXR 不可用';

            }

            message.style.left = 'calc(50% - 90px)';
            message.style.width = '180px';
            message.style.textDecoration = 'none';

            this.stylizeElement(message);

            return message;

        }

    }

    /**
     * 尝试 监听传感器的授权
     */
    public static tryListenSessionGranted() {
        let xr = navigator.xr;
        if (!xr) return;
        //处理 火狐浏览器的 bug
        if (/WebXRViewer\//i.test(navigator.userAgent)) return;

        xr.addEventListener('sessiongranted', () => {
            this.xrSessionIsGranted = true;
        });
    }
}

/**
 * webXR 管理器
 */
class xrManager {
    /** 传感器 */
    public static session: XRSession;
    //是否在呈现
    private static isPresenting: boolean = false;
    //参考空间类型
    private static referenceSpaceType: XRReferenceSpaceType = "local-floor";
    //参考空间对象
    private static referenceSpace: XRReferenceSpace;
    //帧缓冲 缩放系数
    private static framebufferScaleFactor = 1.0;
    //gl layer
    private static glBaseLayer: XRWebGLLayer;
    //是否是XRLoop
    private static isXRLoop: boolean = false;
    //缓存的 引擎主循环函数
    private static cacheNormalMainLoop: Function;
    //VR 左眼相机
    private static vrCameraL: m4m.framework.camera;
    //VR 右眼相机
    private static vrCameraR: m4m.framework.camera;
    //当前深度 近处值
    private static _currentDepthNear: number;
    //当前深度 远处值
    private static _currentDepthFar: number;
    //XRFrame
    private static _xrFrame: XRFrame;
    //postQueue
    private static _color: m4m.framework.ICameraPostQueue;
    //vr model root
    private static _vrModelRoot: m4m.framework.transform;
    //偏移位置
    private static _offsetPos: m4m.math.vector3;
    /** vr model 父容器 */
    public static get vrModelRoot() { return this._vrModelRoot; }

    /** 初始化 */
    public static init() {
        this._offsetPos = new m4m.math.vector3();
        //model root
        let scene = m4m.framework.sceneMgr.scene;
        this._vrModelRoot = new m4m.framework.transform();
        this._vrModelRoot.name = "vrModelRoot";
        scene.addChild(this._vrModelRoot);
        //相机
        {
            //添加一个摄像机 vr left
            let objCamL = new m4m.framework.transform();
            scene.addChild(objCamL);
            //app.getScene().addChild(objCam);
            let cam = this.vrCameraL = objCamL.gameObject.addComponent("camera") as m4m.framework.camera;
            cam.near = 0.01;
            cam.far = 500;
            cam.fov = Math.PI * 105 / 180; //105度相机
            cam.viewport = new m4m.math.rect(0, 0, 0.5, 1);
            objCamL.localTranslate = new m4m.math.vector3(-0.1, 0, 0);      //偏左
        }
        {
            //添加一个摄像机 vr right
            let objCamR = new m4m.framework.transform();
            scene.addChild(objCamR);
            //app.getScene().addChild(objCam);
            let camR = this.vrCameraR = objCamR.gameObject.addComponent("camera") as m4m.framework.camera;
            camR.clearOption_Color = false;
            camR.near = 0.01;
            camR.far = 500;
            camR.fov = Math.PI * 105 / 180;//105度相机
            camR.viewport = new m4m.math.rect(0.5, 0, 0.5, 1);
            objCamR.localTranslate = new m4m.math.vector3(0.1, 0, 0);      //偏右
        }

    }

    /**
     * 设置view 位置偏移
     * @param offsetPos 
     */
    public static setViewOffsetPos(offsetPos: m4m.math.vector3) {
        if (!offsetPos) return;
        m4m.math.vec3Clone(offsetPos, this._offsetPos);
    }

    /**
     * 设置传感器
     * @param session 传感器
     */
    public static async setSession(session: XRSession) {
        this.session = session;
        session.addEventListener('select', xrManager.onSessionEvent);
        session.addEventListener('selectstart', xrManager.onSessionEvent);
        session.addEventListener('selectend', xrManager.onSessionEvent);
        session.addEventListener('squeeze', xrManager.onSessionEvent);
        session.addEventListener('squeezestart', xrManager.onSessionEvent);
        session.addEventListener('squeezeend', xrManager.onSessionEvent);
        session.addEventListener('end', xrManager.onSessionEndSuc);
        session.addEventListener('inputsourceschange', xrManager.onInputSourcesChange);

        //
        let gl = m4m.framework.sceneMgr.app.webgl;
        const attributes = gl.getContextAttributes();
        if (!attributes.xrCompatible) {
            await gl.makeXRCompatible();
        }

        //baselayer
        if ((session.renderState.layers === undefined)) {
            const layerInit = {
                antialias: (session.renderState.layers === undefined) ? attributes.antialias : true,
                alpha: attributes.alpha,
                depth: attributes.depth,
                stencil: attributes.stencil,
                framebufferScaleFactor: this.framebufferScaleFactor
            };

            this.glBaseLayer = new XRWebGLLayer(session, gl, layerInit);

            session.updateRenderState({
                baseLayer: this.glBaseLayer,
                depthFar: 1000,
                depthNear: 0,
                // inlineVerticalFieldOfView: 105
            });

        } else {
            //暂时没有实现
        }

        // Set foveation to maximum.
        this.setFoveation(1.0);

        //参考空间对象
        this.referenceSpace = await session.requestReferenceSpace(this.referenceSpaceType);

        //开始了锁住
        this.isPresenting = true;

        this.cgMainLoop(true);


        //相机
        this.vrCameraL.gameObject.visible = true;
        this.vrCameraR.gameObject.visible = true;

        //将引擎场景 root x 轴缩放 为 -1 , 为了处理 vrView projectionMatrix 为右手坐标系的问题
        let vTran = this._vrModelRoot.gameObject.transform;
        vTran.localScale.x = -1;
        vTran.localScale = vTran.localScale;
    }


    private static isBindXRFBO = false;
    /**
     * 尝试 将 xrlayer的fbo 绑定绘制
     * @returns 
     */
    private static tryXRFBOBind() {
        if (this.isBindXRFBO || !this.glBaseLayer.framebuffer) return;
        this.isBindXRFBO = true;
        const gl = m4m.framework.sceneMgr.app.webgl;
        if (!this._color) {
            this._color = new m4m.framework.cameraPostQueue_Color();
            this._color.renderTarget = new m4m.render.glRenderTarget(gl, this.glBaseLayer.framebufferWidth, this.glBaseLayer.framebufferHeight, true, false, this.glBaseLayer.framebuffer);
        }
        this.vrCameraL.postQueues.push(this._color);
        this.vrCameraR.postQueues.push(this._color);
    }

    /**
     * 尝试解除绑定
     */
    private static tryXRFBOUnBind() {
        if (!this.isBindXRFBO) return;
        this.isBindXRFBO = false;
        const LIdx = this.vrCameraL.postQueues.indexOf(this._color);
        this.vrCameraL.postQueues.splice(LIdx, 1);
        const RIdx = this.vrCameraR.postQueues.indexOf(this._color);
        this.vrCameraR.postQueues.splice(RIdx, 1);
    }

    /**
     * 设置参考空间类型
     * @param value 类型
     */
    public static setReferenceSpaceType(value: XRReferenceSpaceType) {

        this.referenceSpaceType = value;

        if (this.isPresenting === true) {
            console.warn('当前正在运行，不能改变 ReferenceSpace 类型。');
        }

    }

    /**
     * 设置 foveation
     * @param foveation 
     */
    private static setFoveation(foveation) {

        // 0 = no foveation = full resolution
        // 1 = maximum foveation = the edges render at lower resolution

        if (this.glBaseLayer !== null && this.glBaseLayer.fixedFoveation !== undefined) {
            this.glBaseLayer.fixedFoveation = foveation;
        }

    };

    /** 传感器事件 */
    private static onSessionEvent(event) {
        // debugger;
        console.log(`onSessionEvent :`);
    }

    /** 传感结束 */
    private static onSessionEndSuc() {
        const session = xrManager.session;
        if (!session) return;
        //移除事件监听
        session.removeEventListener('select', xrManager.onSessionEvent);
        session.removeEventListener('selectstart', xrManager.onSessionEvent);
        session.removeEventListener('selectend', xrManager.onSessionEvent);
        session.removeEventListener('squeeze', xrManager.onSessionEvent);
        session.removeEventListener('squeezestart', xrManager.onSessionEvent);
        session.removeEventListener('squeezeend', xrManager.onSessionEvent);
        session.removeEventListener('end', xrManager.onSessionEndSuc);
        session.removeEventListener('inputsourceschange', xrManager.onInputSourcesChange);

        xrManager.isPresenting = false;

        xrManager.cgMainLoop(false);

        xrManager.tryXRFBOUnBind();


        //相机
        this.vrCameraL.gameObject.visible = false;
        this.vrCameraR.gameObject.visible = false;

        //将引擎场景 root x 轴缩放 为 -1 , 为了处理 vrView projectionMatrix 为右手坐标系的问题
        let vTran = this._vrModelRoot.gameObject.transform;
        vTran.localScale.x = 1;
        vTran.localScale = vTran.localScale;
    }

    /** 输入源变化 */
    private static onInputSourcesChange(event) {
        // debugger;
        console.log(`onInputSourcesChange :`);

    }

    /**
     * 更新相机
     */
    private static updateCamera() {
        if (this._currentDepthNear !== this.vrCameraL.near || this._currentDepthFar !== this.vrCameraL.far) {
            // Note that the new renderState won't apply until the next frame. See #18320
            this.session.updateRenderState({
                depthNear: this.vrCameraL.near,
                depthFar: this.vrCameraL.far
            });
        }

    }

    /**
     * 改变主循环
     * @param isXRLoopMode 是XR 循环？
     */
    private static cgMainLoop(isXRLoopMode: boolean) {
        const session = this.session;
        if (!session || this.isXRLoop == isXRLoopMode) return;
        const app = m4m.framework.sceneMgr.app as any;
        if (isXRLoopMode) {
            const updateFun = xrManager.onUpdate.bind(xrManager);
            const scene = m4m.framework.sceneMgr.scene;
            scene.onLateUpdate = updateFun;
            this.cacheNormalMainLoop = app.loop;
            //新的循环
            const _loopFun = (time: number, xrFrame: XRFrame) => {
                const now = Date.now() / 1000;
                // const now = time / 1000;
                app._deltaTime = now - app.lastTimer;
                app.totalTime = now - app.beginTimer;
                app.updateTimer = now - app.pretimer;
                let dt = app.deltaTime;
                this._xrFrame = xrFrame;
                app.update(dt);
                if (app.stats != null) app.stats.update();
                app.lastTimer = now;
                app.pretimer = now;
                // if (updateFun) updateFun(dt, xrFrame);
                session.requestAnimationFrame(_loopFun);
            }
            app.loop = () => { };
            //run loop
            _loopFun(null, null);
        } else {
            app.loop = this.cacheNormalMainLoop;
            this.cacheNormalMainLoop = null;
            //run loop
            app.loop();
        }

        this.isXRLoop = isXRLoopMode;
    }

    /** 更新 */
    private static onUpdate(dt: number) {
        const xrFrame = this._xrFrame;
        if (!this.isPresenting || !xrFrame) return;
        const pose = xrFrame.getViewerPose(this.referenceSpace);
        //同步 传感器到场景相机
        if (pose) {
            const views = pose.views;
            const isVR = views.length == 2;
            if (isVR && this.vrCameraL && this.vrCameraR) {

                const gl = m4m.framework.sceneMgr.app.webgl;
                const w = this.glBaseLayer.framebufferWidth;
                const h = this.glBaseLayer.framebufferHeight;

                //layer.framebuffer 存在时将 画面绘制到 layer.framebuffer
                //bind framebuffer
                this.tryXRFBOBind();

                const app = m4m.framework.sceneMgr.app;

                for (let i = 0; i < 2; i++) {
                    const cam = i == 0 ? this.vrCameraL : this.vrCameraR;
                    const trans = cam.gameObject.transform;
                    //相机信息
                    const view = views[i];
                    const vTrans = view.transform;
                    const otherView = views[(i + 1) % 2];   //另外一个view
                    //viewport
                    const viewport = this.glBaseLayer.getViewport(view);
                    // const viewport = this.glBaseLayer.getViewport(otherView);
                    m4m.math.rectSet(cam.viewport, viewport.x / w, viewport.y / h, viewport.width / w, viewport.height / h);

                    //位移
                    const wPos = trans.getWorldPosition();
                    m4m.math.vec3Set(wPos, vTrans.position.x, -vTrans.position.y, vTrans.position.z);
                    //offset
                    m4m.math.vec3Add(this._offsetPos, wPos, wPos);
                    trans.setWorldPosition(wPos);
                    //旋转
                    const wRot = trans.getWorldRotate();
                    wRot.x = vTrans.orientation.x;
                    wRot.y = vTrans.orientation.y;
                    wRot.z = vTrans.orientation.z;
                    wRot.w = vTrans.orientation.w;
                    trans.setWorldRotate(wRot);

                    //相机投影矩阵
                    view.projectionMatrix;
                    const pmtx = cam["projectMatrix"] as m4m.math.matrix;
                    view.projectionMatrix.forEach((v, i) => {
                        pmtx.rawData[i] = v;
                    });
                }

                this.updateCamera();
            }
        }

        //控制器（InputSources）更新处理
        //....

    }
}