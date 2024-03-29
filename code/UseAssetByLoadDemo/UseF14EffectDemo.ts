//加载并使用特效
class UseF14EffectDemo implements IState {

    app: m4m.framework.application;
    scene: m4m.framework.scene;
    taskMgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    eff: m4m.framework.transform;
    effectSystems: m4m.framework.f14EffectSystem;

    /** 使用特效 */
    private useF14Effect() {
        //一个特效文件本质上是挂在了特效组件的一个空的transform。所以只要把这个带有特效的transform加在需要绑定特效的transform下即可。
        this.eff = (this.app.getAssetMgr().getAssetByName(`fx_B_5.prefab.json`) as m4m.framework.prefab).getCloneTrans();
        this.scene.addChild(this.eff);
        //取出tranform的特效组件集，方便后面播放使用。
        this.effectSystems = this.eff.gameObject.getComponent("f14EffectSystem") as m4m.framework.f14EffectSystem;
        this.eff.markDirty();
        console.log(this.eff);
        console.log(this.effectSystems);
    }

    /** 加载特效 */
    private loadF14Effect(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        //加载特效一般都是加载打包号的特效包即可。
        this.app.getAssetMgr().load(`res/effectShow/fx_B_5/fx_B_5.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                this.useF14Effect();
                state.finish = true;
            }
        });
    }

    /**播放特效 */
    playEffect(){
            //this.effectSystems.play(1.0);
    }
    /** 停止特效 */
    stopEffect(){
            this.effectSystems.stop();
    }

    /** 加入播放特效和停止的控制按钮 */
    addCtrl() {
        let play = document.createElement("button") as HTMLButtonElement;
        let stop = document.createElement("button") as HTMLButtonElement;
        this.app.container.appendChild(play);
        this.app.container.appendChild(stop);
        play.innerText = "Play";
        stop.innerText = "stop";

        play.style.position = stop.style.position = "absolute";
        play.style.height = stop.style.height = "25px";
        play.style.width = stop.style.width = "75px";
        play.style.top = "40px";
        stop.style.top = "80px";
        stop.style.left = play.style.left = "100px"

        play.onclick = (e) => {
            this.playEffect();
        }

        stop.onclick = (e) => {
            this.stopEffect();
        }
    }
    //#endregion

    /** 添加摄像机 */
    private addCamera(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        let objCam = new m4m.framework.transform();
        objCam.name = "camera.";
        objCam.localPosition.z = -10;
        objCam.localPosition.y = 10;
        objCam.localPosition.x = 10;

        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3);
        camera.far = 100;
        this.scene.addChild(objCam);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        objCam.markDirty();
        state.finish = true;
    }
    //#endregion

    /** 加载shader */
    private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.iserror) {
                state.error = true;
            }
            if (s.isfinish)
                state.finish = true;
        });
    }
    //#endregion

    start(app: m4m.framework.application) {
        this.app = app;
        this.scene = app.getScene();
        this.taskMgr.addTaskCall(this.loadShader.bind(this));
        this.taskMgr.addTaskCall(this.addCamera.bind(this));
        this.taskMgr.addTaskCall(this.loadF14Effect.bind(this));
        this.addCtrl();
    }


    update(delta: number) {
        this.taskMgr.move(delta);
    }
}