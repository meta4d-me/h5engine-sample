class test_loadCompressUseAssetbundle implements IState{
    

    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application) {       
        console.log("i see you are a dog!");
        this.app = app;
        this.scene = this.app.getScene();
        let url = "res/prefabs/0001_ss_female/";
        let name = "0001_ss_female";
        let end = ".assetbundle.json";
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state)=>{
            if (state.isfinish){
                this.app.getAssetMgr().loadCompressBundle(url + name + end, (s)=>{
                    console.error("compressTextLoaded = " + s.compressTextLoaded);
                    console.error("progress = " + s.progress);
                    console.error("totalByteLength = " + s.totalByteLength);
                    console.error("curByteLength = " + s.curByteLength);
                });
            }
        });
    }


    update(delta: number) {
        
    }


}