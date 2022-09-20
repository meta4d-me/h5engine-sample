namespace util {

    /**
     * 异步加载 any 资源
     * @param url 资源url
     */
    export function loadRes<T>(url: string) {
        const mgr = m4m.framework.sceneMgr.app.getAssetMgr();
        return new Promise<T>((res) => {
            mgr.load(url, m4m.framework.AssetTypeEnum.Auto, () => {
                res(mgr.getAssetByName(url.split('/').pop()) as any);
            });
        });
    }

    export function loadShader(assetMgr: m4m.framework.assetMgr) {
        return new Promise<void>((resolve, reject) => {
            assetMgr.load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    resolve();
                }
            }
            );
        })
    }

    export function loadModel(assetMgr: m4m.framework.assetMgr, modelName: string) {
        return new Promise<m4m.framework.prefab>((resolve, reject) => {
            assetMgr.load(`${resRootPath}prefab/${modelName}/${modelName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    let prefab = assetMgr.getAssetByName(modelName + ".prefab.json", `${modelName}.assetbundle.json`) as m4m.framework.prefab;
                    resolve(prefab);
                }
            });
        })
    }

    export function addCamera(scene: m4m.framework.scene) {
        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.near = 0.01;
        camera.far = 120;
        objCam.localTranslate = new m4m.math.vector3(0, 10, 10);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        objCam.markDirty();
        return objCam;
    }

    export function loadTex(url: string, assetMgr: m4m.framework.assetMgr) {
        return new Promise<m4m.framework.texture>((resolve, reject) => {
            assetMgr.load(url, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    let idx = url.lastIndexOf("/");
                    let texFileName = idx != -1 ? url.substring(idx + 1) : url;
                    let tex = assetMgr.getAssetByName(texFileName) as m4m.framework.texture;
                    resolve(tex);
                }
                else {
                    reject()
                }
            })
        })
    }

    export function loadTextures(urls: string[], assetMgr: m4m.framework.assetMgr) {
        return Promise.all(urls.map(item => loadTex(item, assetMgr)))
    }

    /**
     * 运行时 加载 .js 库
     * @param url .js 文件 URL
     */
    export function loadJSLib(url: string): Promise<any> {
        return new Promise<any>((res, rej) => {
            let htmlS = document.createElement("script");
            htmlS.src = url;
            //挂载到doc
            let attParent = document.childNodes[document.childNodes.length - 1];
            attParent.appendChild(htmlS);
            htmlS.onload = () => {
                //code加载完毕
                res(null);
            }
            htmlS.onerror = (err) => {
                rej(`error : ${err}`);
            }
        });
    }

    /**
     * 加载文件 以arrayBuffer 格式
     * @param url 文件URL
     */
    export function loadArrayBuffer(url): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((res, rej) => {
            m4m.io.loadArrayBuffer(url, (_bin, _err, isFail) => {
                if (isFail) {
                    rej(`load fail! URL${url} , err ${_err}`);
                    return;
                }
                //成功
                res(_bin);
            });
        });
    }

}