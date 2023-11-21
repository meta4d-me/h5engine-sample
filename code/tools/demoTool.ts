/** demo 工具 */

class demoTool{
    /**
     * 加载
     * @param url 资源
     * @param astMgr 资源管理器
     * @returns Promise
     */
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


