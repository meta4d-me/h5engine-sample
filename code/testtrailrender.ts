namespace t
{

    export class test_trailrender implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        texResName = "trailtest2_00000.imgdesc.json";
        /**
         * 初始化场景
         */
        private initscene()
        {
            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 100;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new m4m.math.color(0, 0, 0, 1);
            objCam.localTranslate = new m4m.math.vector3(0, 20, -20);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新

            {
                var org = new m4m.framework.transform();
                org.name = "org";
                this.org = org;
                this.scene.addChild(org);

                var cube = new m4m.framework.transform();
                cube.name = "cube";
                org.addChild(cube);
                cube.localTranslate.x = -5;
                cube.localScale.y = 0.1;
                cube.localScale.z = 0.5;
                cube.localScale.x = 5;
                cube.markDirty();
                var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let cuber = renderer;


                var trailNode = new m4m.framework.transform();
                trailNode.localTranslate.x = -10;
                org.addChild(trailNode);
                //m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, 90, trailtrans.localRotate);
                trailNode.markDirty();
                //--------------------------------------------trailrender
                var comp = trailNode.gameObject.addComponent("trailRender") as m4m.framework.trailRender;
                var mat = new m4m.framework.material();
                var shader = this.app.getAssetMgr().getShader("particles_add.shader.json") as m4m.framework.shader;
                var tex = this.app.getAssetMgr().getAssetByName(`${this.texResName}`) as m4m.framework.texture;
                mat.setShader(shader);
                mat.setTexture("_Main_Tex", tex);

                comp.setspeed(0.3);
                comp.setWidth(5);
                comp.material = mat;
                comp.lookAtCamera = true;
                comp.extenedOneSide = false;

                comp.play();
            }
        }
        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = app.getScene();
            util.loadShader(this.app.getAssetMgr())
                .then(() => util.loadTextures([`${resRootPath}texture/swingFX.png`, `${resRootPath}texture/${this.texResName}`], this.app.getAssetMgr()))
                .then(() => this.initscene())
                .then(() => this.addUI())
        }

        org: m4m.framework.transform;
        timer: number = 0;
        play: boolean = true;
        update(delta: number)
        {
            if (this.org != undefined && this.play)
            {
                this.timer++;
                m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, this.timer * 5, this.org.localRotate);
                this.org.markDirty();
            }
        }
        /**
         * 添加GUI
         */
        private addUI()
        {
            var tbn = this.addbtn("80px", "0px", "start");
            tbn.onclick = () =>
            {
                this.play = true;
            }
            var btn = this.addbtn("120px", "0px", "stop");
            btn.onclick = () =>
            {
                this.play = false;
            }
        }
        /**
         * 添加按钮
         * @param top 上位置
         * @param left 左位置
         * @param text 文本
         * @returns html按钮组件
         */
        private addbtn(top: string, left: string, text: string): HTMLButtonElement
        {
            var btn = document.createElement("button");
            btn.style.top = top;
            btn.style.left = left;
            btn.style.position = "absolute";
            btn.textContent = text;
            this.app.container.appendChild(btn);

            return btn;
        }
    }
}