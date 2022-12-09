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

    export function loadScnee(assetMgr: m4m.framework.assetMgr, resName: string) {
        return new Promise<m4m.framework.rawscene>((resolve, reject) => {
            assetMgr.load(`${resRootPath}prefab/${resName}/${resName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    let s = assetMgr.getAssetByName(resName + ".scene.json", `${resName}.assetbundle.json`) as m4m.framework.rawscene;
                    resolve(s);
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

    /**
     * 创建一个 aabb 显示框
     * @param node 目标节点
     * @param thickness 框体粗细值
     * @returns 
     */
    export function makeAABBDisplayer(node: m4m.framework.transform, thickness = 0.05) {
        if (!node) return;
        const aabb = node.aabb;
        const assetMgr = m4m.framework.sceneMgr.app.getAssetMgr();
        const lastSize = new m4m.math.vector3();
        const lastCenter = new m4m.math.vector3();
        const frameColor = new m4m.math.vector4(1, 1, 0, 1);

        //创建aabb框模型
        const aabbNode = new m4m.framework.transform();
        aabbNode.name = "aabbDisplay";
        m4m.framework.sceneMgr.scene.addChild(aabbNode);
        const boxs: m4m.framework.transform[] = [];
        //
        for (let i = 0; i < 12; i++) {
            const box = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube);
            // box.gameObject.visible = false;
            const mr = box.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
            mr.materials[0].setShader(assetMgr.getShader("shader/ulit"));
            mr.materials[0].setVector4("_MainColor", frameColor);
            boxs.push(box);
            aabbNode.addChild(box);
            m4m.math.vec3SetAll(box.localScale, thickness);
        }

        // boxs[2].gameObject.visible = true;

        //
        const syncSize = (sizeX: number, sizeY: number, sizeZ: number) => {
            if (aabbNode.gameObject.visible == false) return;
            const h_sizeX = sizeX / 2;
            const h_sizeY = sizeY / 2;
            const h_sizeZ = sizeZ / 2;

            //顶部
            //  前
            m4m.math.vec3Set(boxs[0].localPosition, 0, h_sizeY, h_sizeZ);
            boxs[0].localScale.x = sizeX;
            //  后
            m4m.math.vec3Set(boxs[1].localPosition, 0, h_sizeY, -h_sizeZ);
            boxs[1].localScale.x = sizeX;
            //  左
            m4m.math.vec3Set(boxs[2].localPosition, -h_sizeX, h_sizeY, 0);
            boxs[2].localScale.z = sizeZ;
            //  右
            m4m.math.vec3Set(boxs[3].localPosition, h_sizeX, h_sizeY, 0);
            boxs[3].localScale.z = sizeZ;
            //底部
            //  前
            m4m.math.vec3Set(boxs[4].localPosition, 0, -h_sizeY, h_sizeZ);
            boxs[4].localScale.x = sizeX;
            //  后
            m4m.math.vec3Set(boxs[5].localPosition, 0, -h_sizeY, -h_sizeZ);
            boxs[5].localScale.x = sizeX;
            //  左
            m4m.math.vec3Set(boxs[6].localPosition, -h_sizeX, -h_sizeY, 0);
            boxs[6].localScale.z = sizeZ;
            //  右
            m4m.math.vec3Set(boxs[7].localPosition, h_sizeX, -h_sizeY, 0);
            boxs[7].localScale.z = sizeZ;
            //中间
            //  o
            m4m.math.vec3Set(boxs[8].localPosition, -h_sizeX, 0, h_sizeZ);
            boxs[8].localScale.y = sizeY;
            //  1
            m4m.math.vec3Set(boxs[9].localPosition, h_sizeX, 0, h_sizeZ);
            boxs[9].localScale.y = sizeY;
            //  2
            m4m.math.vec3Set(boxs[10].localPosition, h_sizeX, 0, -h_sizeZ);
            boxs[10].localScale.y = sizeY;
            //  3
            m4m.math.vec3Set(boxs[11].localPosition, -h_sizeX, 0, -h_sizeZ);
            boxs[11].localScale.y = sizeY;

            boxs.forEach((n) => {
                n.localPosition = n.localPosition;
                n.localScale = n.localScale;
            });
        }


        let displayer = {
            node: aabbNode,
            setVisible: (v: boolean) => {
                aabbNode.gameObject.visible = v;
            },
            update: () => {
                //位置同步
                const center = aabb.center;
                const sizeX = aabb.maximum.x - aabb.minimum.x;
                const sizeY = aabb.maximum.y - aabb.minimum.y;
                const sizeZ = aabb.maximum.z - aabb.minimum.z;
                const sizeDirty = sizeX != lastSize.x || sizeY != lastSize.y || sizeZ != lastSize.z;
                if (sizeDirty) {
                    syncSize(sizeX, sizeY, sizeZ);
                    m4m.math.vec3Set(lastSize, sizeX, sizeY, sizeZ);
                }

                const posDirty = !m4m.math.vec3Equal(lastCenter, center);
                if (posDirty) {
                    m4m.math.vec3Clone(center, aabbNode.localPosition);
                    aabbNode.localPosition = aabbNode.localPosition;
                    m4m.math.vec3Clone(center, lastCenter);
                }
            }
        }

        displayer.update();
        return displayer;
    }

}