namespace util
{
    export function loadShader(assetMgr: m4m.framework.assetMgr)
    {
        return new Promise<void>((resolve, reject) =>
        {
            assetMgr.load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    resolve();
                }
            }
            );
        })
    }

    export function loadModel(assetMgr: m4m.framework.assetMgr, modelName: string)
    {
        return new Promise<m4m.framework.prefab>((resolve, reject) =>
        {
            assetMgr.load(`${resRootPath}prefab/${modelName}/${modelName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    let prefab = assetMgr.getAssetByName(modelName + ".prefab.json", `${modelName}.assetbundle.json`) as m4m.framework.prefab;
                    resolve(prefab);
                }
            });
        })
    }

    export function addCamera(scene: m4m.framework.scene)
    {
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

    export function loadTex(url: string, assetMgr: m4m.framework.assetMgr)
    {
        return new Promise<void>((resolve, reject) =>
        {
            assetMgr.load(url, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    resolve();
                }
                else
                {
                    reject()
                }
            })
        })
    }

    export function loadTextures(urls: string[], assetMgr: m4m.framework.assetMgr)
    {
        return Promise.all(urls.map(item => loadTex(item, assetMgr)))
    }

}