namespace t
{
    export class test_uvroll implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        /**
         * 加载着色器 
         * @param laststate 
         * @param state 状态
         */
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                    state.finish = true;
            }
            );
        }
        /**
         * 加载文本数据
         * @param laststate 
         * @param state 状态
         */
        private loadText(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/uvSprite.png", m4m.framework.AssetTypeEnum.Auto, (s) => 
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
        /**
         * 添加cube
         * @param laststate 
         * @param state 状态
         */
        private addcube(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            //添加一个盒子
            {
                var cube = new m4m.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                cube.localTranslate.x = -1;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("sample_uvsprite.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new m4m.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    let texture = this.app.getAssetMgr().getAssetByName("uvSprite.png") as m4m.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
                this.cube = cube;
            }
            {
                var cube1 = new m4m.framework.transform();
                cube1.name = "cube1";
                cube1.localScale.x = cube1.localScale.y = cube1.localScale.z = 1;
                cube1.localTranslate.x = 1;
                this.scene.addChild(cube1);
                var mesh1 = cube1.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh1.mesh = (smesh);
                var renderer1 = cube1.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let cuber1 = renderer1;

                var sh = this.app.getAssetMgr().getShader("uvroll.shader.json");
                if (sh != null)
                {
                    cuber1.materials = [];
                    cuber1.materials.push(new m4m.framework.material());
                    cuber1.materials[0].setShader(sh);//----------------使用shader

                    let texture1 = this.app.getAssetMgr().getAssetByName("uvSprite.png") as m4m.framework.texture;
                    cuber1.materials[0].setTexture("_MainTex", texture1);
                    cuber1.materials[0].setFloat("_SpeedU", 3);
                    cuber1.materials[0].setFloat("_SpeedV", 1);
                    this.cube1 = cube1;
                }

            }
            {
                var cube2 = new m4m.framework.transform();
                cube2.name = "cube2222";
                cube2.localScale.x = cube1.localScale.y = cube1.localScale.z = 1;
                cube2.localTranslate.y = 1;
                this.scene.addChild(cube2);
                var mesh1 = cube2.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh1.mesh = (smesh);
                var renderer2 = cube2.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;

                var sh = this.app.getAssetMgr().getShader("selftimer_uvroll.shader.json");
                if (sh != null)
                {
                    renderer2.materials = [];
                    renderer2.materials.push(new m4m.framework.material());
                    renderer2.materials[0].setShader(sh);//----------------使用shader
                    let texture1 = this.app.getAssetMgr().getAssetByName("uvSprite.png") as m4m.framework.texture;
                    renderer2.materials[0].setTexture("_MainTex", texture1);
                    
                }
                this.cube2 = cube2;
            }
            state.finish = true;
        }
        /**
         * 添加相机
         * @param laststate 
         * @param state 状态
         */
        private addcam(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {

            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 30;
            objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新

            state.finish = true;

        }
        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        }

        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        cube1: m4m.framework.transform;
        cube2: m4m.framework.transform;

        timer: number = 0;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        count: number = 0;

        row: number = 3;
        col: number = 3;
        totalframe: number = 9;
        fps: number = 2;
        /**
         * 在粒子系统的一个生命周期内，动画重复的数量
         */
        private cycles: number;
        update(delta: number)
        {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.cube != null)
            {
                //uv 动画
                let curframe = Math.floor(this.timer * this.fps);
                curframe = curframe % this.totalframe;

                // let ratex = 1/this.col;
                // let ratey = 1/this.row;

                // var vec4 = new m4m.math.vector4(ratex, ratey, curframe%this.col*ratey, Math.floor(curframe/this.col)*ratex);
                var vec41 = new m4m.math.vector4();
                m4m.math.spriteAnimation(3, 3, curframe, vec41);
                var renderer = this.cube.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
                renderer.materials[0].setVector4("_MainTex_ST", vec41);//shader 里加入st参数
            }
            //cube1用的全局的timer
            if (this.cube2 != null)
            {//uv滚动//用自己的timer
                var renderer2 = this.cube2.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
                renderer2.materials[0].setVector4("_MainTex_ST", new m4m.math.vector4(1.0, 1.0, 0, 0));
                renderer2.materials[0].setFloat("_SpeedU", 3.0);
                renderer2.materials[0].setFloat("_SpeedV", 1.0);
                renderer2.materials[0].setFloat("self_timer", this.timer);//shader 里加入st参数
            }




            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null)
            {
                var objCam = this.camera.gameObject.transform;
                // objCam.localTranslate = new m4m.math.vector3(x2 * 10, 2.25, -z2 * 10);
                // objCam.markDirty();
                // objCam.updateWorldTran();
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                objCam.markDirty();
            }

        }
    }

}