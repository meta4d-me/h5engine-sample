/** demo 工具 */

class demoTool{
     static loadbySync(url:string,astMgr: m4m.framework.assetMgr){
        return new m4m.threading.gdPromise<any>((resolve,reject)=>{
            astMgr.load(url,m4m.framework.AssetTypeEnum.Auto,(state)=>{
                if(state && state.isfinish){
                    resolve();
                }
            });
        });
    }
    
}


