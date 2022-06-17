namespace demo
{
    export class DragonTest implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        light: m4m.framework.light;
        dragon: m4m.framework.transform;
        camTran: m4m.framework.transform;
        cube: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();

        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load(`${resRootPath}shader/Mainshader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if(s.isfinish)
                {
                    state.finish = true;
                }
            });
        }

        private loadLongPrefab(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            let resName = "long"
            this.app.getAssetMgr().load(`${resRootPath}prefab/${resName}/${resName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(`${resName}.prefab.json` , `${resName}.assetbundle.json`) as m4m.framework.prefab;
                    this.dragon = _prefab.getCloneTrans();
                    this.scene.addChild(this.dragon);
                    this.dragon.markDirty();
                    this.camTran = this.dragon.find("Dummy001");
                    let ap =  this.dragon.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;
                    let list = ap.awaitLoadClipNames();
                    let resPath = `${resRootPath}prefab/${resName}/resources/`;
                    if(list.length >0 ){
                        let cname = list[0];
                        ap.addClipByNameLoad(this.app.getAssetMgr(),resPath,cname,(sta,clipName)=>{
                            if(sta.isfinish){
                                let clip = ap.getClip(cname);
                                ap.play(cname);
                            }
                        });
                    }
                    state.finish = true;
                }
            });
        }

        private addCameraAndLight(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            var tranCam = new m4m.framework.transform();
            tranCam.name = "Cam";
            this.camTran.addChild(tranCam);
            tranCam.localEulerAngles = new m4m.math.vector3(0, 270, 0);
            this.camera = tranCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 1000;
            this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3);
            tranCam.markDirty();

            var tranLight = new m4m.framework.transform();
            tranLight.name = "light";
            this.scene.addChild(tranLight);
            this.light = tranLight.gameObject.addComponent("light") as m4m.framework.light;
            this.light.type = m4m.framework.LightTypeEnum.Direction;
            tranLight.localTranslate.x = 5;
            tranLight.localTranslate.y = 5;
            tranLight.localTranslate.z = -5;
            tranLight.lookatPoint(new m4m.math.vector3(0, 0, 0));
            tranLight.markDirty();

            state.finish = true;
        }

        start(app: m4m.framework.application)
        {
            this.app = app;
            this.scene = app.getScene();

            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadLongPrefab.bind(this));
            // this.taskmgr.addTaskCall(this.loadScene.bind(this));
            this.taskmgr.addTaskCall(this.addCameraAndLight.bind(this));
        }

        update(delta: number)
        {
            this.taskmgr.move(delta);
        }

    }

}