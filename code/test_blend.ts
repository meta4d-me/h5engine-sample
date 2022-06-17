namespace t
{

    export class test_blend implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        background: m4m.framework.transform;
        parts: m4m.framework.transform;
        timer: number = 0;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        count: number = 0;
        counttimer: number = 0;
        private angularVelocity: m4m.math.vector3 = new m4m.math.vector3(10, 0, 0);
        private eulerAngle = m4m.math.pool.new_vector3();

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
            let t = 2;
            this.app.getAssetMgr().load(`${resRootPath}texture/zg256.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    t--;
                    if (t == 0)
                    {
                        state.finish = true;

                    }
                }
                else
                {
                    state.error = true;
                }
            }
            );

            this.app.getAssetMgr().load(`${resRootPath}texture/trailtest2.png`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    t--;
                    if (t == 0)
                    {
                        state.finish = true;

                    }
                }
                else
                {
                    state.error = true;
                }
            }
            );
        }

        private addcam()
        {

            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new m4m.math.vector3(0, 10, 10);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
        }

        foreground: m4m.framework.transform;
        private addplane()
        {
            {
                let background = new m4m.framework.transform();
                background.name = "background";
                background.localScale.x = background.localScale.y = 5;
                background.localTranslate.z = -1;
                console.log(background);
                this.scene.addChild(background);
                background.markDirty();
                background.updateWorldTran();
                var mesh = background.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("quad");
                mesh.mesh = (smesh);
                var renderer = background.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let meshRender = renderer;

                var sh = this.app.getAssetMgr().getShader("diffuse_bothside.shader.json") as m4m.framework.shader;
                if (sh != null)
                {
                    meshRender.materials = [];
                    meshRender.materials.push(new m4m.framework.material());
                    meshRender.materials[0].setShader(sh);
                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                    meshRender.materials[0].setTexture("_MainTex", texture);
                }
                this.background = background;
            }

            {
                let foreground = new m4m.framework.transform();
                foreground.name = "foreground ";
                foreground.localScale.x = foreground.localScale.y = 5;
                this.scene.addChild(foreground);
                foreground.markDirty();
                foreground.updateWorldTran();
                var mesh = foreground.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("quad");
                mesh.mesh = (smesh);
                var renderer = foreground.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let meshRender = renderer;

                var sh = this.app.getAssetMgr().getShader("particles_add.shader.json") as m4m.framework.shader;
                if (sh != null)
                {
                    meshRender.materials = [];
                    meshRender.materials.push(new m4m.framework.material());
                    meshRender.materials[0].setShader(sh);
                    let texture = this.app.getAssetMgr().getAssetByName("trailtest2.png") as m4m.framework.texture;
                    meshRender.materials[0].setTexture("_Main_Tex", texture);
                }
                this.foreground = foreground;
            }
        }


        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            let assetMgr = app.getAssetMgr();
            util.loadShader(assetMgr)
                .then(() => util.loadTextures([`${resRootPath}texture/zg256.png`, `${resRootPath}texture/trailtest2.png`], assetMgr))
                .then(() => this.addplane())
                .then(() => util.addCamera(this.scene))
        }

        update(delta: number)
        {
            this.taskmgr.move(delta);

            this.timer += delta;
            if (this.background != undefined)
            {
                let x = Math.cos(this.timer * 1);
                let y = Math.sin(this.timer * 1);

                this.background.localTranslate.x = 1.5 * x;
                this.background.localTranslate.y = 1.5 * y;

                // this.cube.markDirty();
                // m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, this.timer * 20, this.background.localRotate);
                this.background.markDirty();
            }
        }
    }

}