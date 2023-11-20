//UI 视频纹理
class test_videoTexture implements IState {

    private loadVideo(url: string): Promise<HTMLVideoElement> {
        return new Promise<HTMLVideoElement>((res, rej) => {
            const video = document.createElement("video");
            //webgl跨域渲染要这样玩 [crossOrigin = ""]否则服务器允许跨域也没用
            video.crossOrigin = "";
            video.src = url;
            //通过 play 触发视频加载
            video.play().then(() => {
                video.pause();
                res(video);
            }).catch((err) => {
                rej(err);
            });
        });
    }

    /**
     * 创建视频纹理
     * @param video 视频数据元素 
     * @returns 
     */
    private makeVideoTexture(video: HTMLVideoElement) {
        const tex = new m4m.framework.texture("videoTex");
        const t2d = new m4m.render.videoTexture(video);
        tex.glTexture = t2d;
        return tex;
    }

    async start(app: m4m.framework.application) {
        const assetMgr = app.getAssetMgr();
        let obj = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Quad, app);
        const mr = obj.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        let scene = app.getScene();
        scene.addChild(obj);
        //initCamera
        let objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new m4m.math.vector3(0, 5, -8);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 20;
        hoverc.distance = 3;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0);
        //材质
        const mat = mr.materials[0];
        mat.setShader(assetMgr.getShader(`shader/def3dbeforeui`));
        //加载视屏纹理
        const video = await this.loadVideo(`${resRootPath}video/movie.mp4`);
        video.loop = true;
        const vTex = this.makeVideoTexture(video);
        // mat.setTexture("_MainTex", assetMgr.getDefaultTexture("grid"));
        mat.setTexture("_MainTex", vTex);
        video.play();
    }

    update(delta: number) {


    }

}
