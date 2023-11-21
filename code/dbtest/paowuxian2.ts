namespace dome {
    /** 炮王项目炮弹 */
    export class paowuxian2 implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        assetmgr: m4m.framework.assetMgr;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        camera: m4m.framework.camera;
        inputMgr: m4m.framework.inputMgr;
        rooto2d: m4m.framework.overlay2D;

        start(app: m4m.framework.application) {
            this.app = app;
            this.scene = app.getScene();
            this.assetmgr = app.getAssetMgr();
            this.inputMgr = this.app.getInputMgr();


            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadmesh.bind(this));
            this.taskmgr.addTaskCall(this.gameInit.bind(this));
        }

        private pointDown = false;
        update(delta: number) {
            if (this.pointDown == false && this.inputMgr.point.touch == true)//pointdown
            {
                this.fire();
            }
            this.pointDown = this.inputMgr.point.touch;

            this.taskmgr.move(delta);
            CameraController.instance().update(delta);

            this.gameupdate(delta);
        }
        /**
         * 加载shader
         * @param laststate 
         * @param state 加载状态
         */
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }

        private targets: m4m.framework.transform[] = [];
        /**
         * 加载mesh
         * @param laststate 
         * @param state 
         */
        private loadmesh(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            var name = "box";
            name = "Map_Castle";
            this.app.getAssetMgr().load(`${resRootPath}prefab/${name}/${name}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json" , `${name}.assetbundle.json`) as m4m.framework.prefab;
                    let item = _prefab.getCloneTrans();
                    this.scene.addChild(item);

                    //---------------showbox
                    let showColider = (trans: m4m.framework.transform) => {
                        let collider = trans.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
                        if (collider != null) {
                            collider.colliderVisible = true;
                            this.targets.push(trans);
                        }
                        if (trans.children != null) {
                            for (let key in trans.children) {
                                showColider(trans.children[key]);
                                // this.targets.push(trans.children[key]);
                            }
                        }
                    }
                    showColider(item);
                    state.finish = true;
                }
            });
        }
        /**
         * 添加相机
         * @param laststate 
         * @param state 状态
         */
        private addcam(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 2000;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new m4m.math.vector3(0, 0, -15);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            let controller = new CameraController();
            CameraController.instance().init(this.app, this.camera);
            state.finish = true;

        }

        //------------------------------------------------------game-----------------------------------------
        paojia: m4m.framework.transform;
        paodan: m4m.framework.transform;
        // target: m4m.framework.transform;

        cam2: m4m.framework.gameObject;
        camctr: camCtr;
        testUI: m4m.framework.transform2D;

        beUIFollow: boolean = false;

        hitPosition: m4m.math.vector3 = new m4m.math.vector3();
        behit: boolean = false;
        middlePos: m4m.math.vector3 = new m4m.math.vector3();
        /**
         * 初始化游戏
         * @param laststate 
         * @param state 状态
         */
        gameInit(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.paojia = this.addcube(new m4m.math.vector3(), new m4m.math.vector3(1, 1.0, 2.0));
            this.paojia.localPosition.y += this.paoheight;
            // m4m.math.quatMultiply(this.lastRotaion.roty,this.lastRotaion.rotx,this.paojia.localRotate);
            this.paojia.markDirty();
            this.paodan = this.addcube(new m4m.math.vector3(), new m4m.math.vector3(0.2, 0.2, 0.2));


            this.addPaoDancam();

            this.addBtn("切换相机", 60, 500, () => {
                this.cam2.visible = !this.cam2.visible;
                this.camera.gameObject.visible = !this.camera.gameObject.visible;
            });

            this.addBtn("UI跟随Paodan", 60, 700, () => {
                this.beUIFollow = !this.beUIFollow;
                if (this.beUIFollow == false) {
                    this.testUI.localTranslate.x = 0;
                    this.testUI.localTranslate.y = 0;
                    this.testUI.markDirty();
                }
            });

            this.floor = this.scene.getRoot().find("Map_Castle_floor");


            // this.onRotEnd=
            state.finish = true;
        }
        //----------------------------------game scene asset------------------------------------------------
        /**
         * 添加炮弹的相机
         */
        addPaoDancam() {
            var objCam = new m4m.framework.transform();
            this.cam2 = objCam.gameObject;
            this.cam2.visible = false;
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            camera.near = 0.01;
            camera.far = 2000;
            camera.fov = Math.PI * 0.3;
            camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new m4m.math.vector3(0, 0, -15);
            objCam.markDirty();//标记为需要刷新
            this.camctr = objCam.gameObject.addComponent("camCtr") as camCtr;

            this.camctr.setTarget(this.paodan, new m4m.math.vector3(0, 0.5, 0));
            this.camctr.setDistanceToTarget(5);
            this.camctr.setRotAngle(0, 30);


            //2dUI root
            this.rooto2d = new m4m.framework.overlay2D();
            this.camera.addOverLay(this.rooto2d);

            //raw png
            let raw_t2 = new m4m.framework.transform2D;
            this.testUI = raw_t2;
            raw_t2.name = "滑动卷轴框png";
            raw_t2.width = 100;
            raw_t2.height = 100;
            let raw_i2 = raw_t2.addComponent("rawImage2D") as m4m.framework.rawImage2D;
            raw_i2.image = this.assetmgr.getDefaultTexture("grid");
            this.rooto2d.addChild(raw_t2);
        }

        //-------------------------------game logic--------------------------------------------------------------------
        private targetPos: m4m.math.vector3 = new m4m.math.vector3();
        private floor: m4m.framework.transform;
        /**
         * 开火
         */
        fire(): void {
            this.pickScene((info) => {
                console.warn("pick point:" + info.hitposition.toString(), info);
                m4m.math.vec3Clone(info.hitposition, this.targetPos);

                let target = this.addcube(this.targetPos);
                this.beforeRotatePaojia();
            });
        }

        private beLaunched: boolean = false;
        private time: number = 0;
        /**
         * 设置泡弹跑的总时间
         */
        private totaltime: number = 5;
        /**
         * 开火发射子弹
         */
        private fireBullet() {
            this.beLaunched = true;
            this.time = 0;
        }

        private temp_pickInfo = m4m.math.pool.new_pickInfo();
        /**
         * 拾取场景
         * @param fuc 
         */
        private pickScene(fuc: (info: m4m.framework.pickinfo) => void) {
            let inputMgr = this.app.getInputMgr();
            let ray = this.camera.creatRayByScreen(new m4m.math.vector2(inputMgr.point.x, inputMgr.point.y), this.app);
            this.rayInstersetScene(ray, (info) => {
                m4m.math.vec3Clone(info.hitposition, this.hitPosition);
                fuc(info);
            });
        }

        /**
         * 游戏更新
         * @param delta 间隔时间
         */
        gameupdate(delta: number) {
            this.updateBullet(delta);
            this.updateUI();
            this.updateRotPaojia(delta);
        }

        private temptPos: m4m.math.vector3 = new m4m.math.vector3();
        private temptdir: m4m.math.vector3 = new m4m.math.vector3();
        private lookpos: m4m.math.vector3 = new m4m.math.vector3();
        private lastPos: m4m.math.vector3 = new m4m.math.vector3();
        private realDIr: m4m.math.vector3 = new m4m.math.vector3();

        private winddisturb: number = 0;
        private gravitydisturb: number = 0;
        /** 碰撞结束 */
        private onEndCollision: (pos: m4m.math.vector3) => {};
        /**
         * 更新子弹
         * @param delta 间隔时间
         */
        private updateBullet(delta: number) {
            if (this.beLaunched) {
                this.time += delta * 4;

                // console.warn("Time:"+this.time.toString());

                let lerp = this.time / this.totaltime;
                m4m.math.vec3Clone(this.paodan.localPosition, this.lastPos);
                let paojiaWorldpos = this.paojia.getWorldPosition();
                this.bessel(paojiaWorldpos, this.middlePos, this.hitPosition, lerp, this.temptPos);

                this.temptPos.x += this.winddisturb * this.time;
                this.temptPos.y -= this.gravitydisturb * this.time;
                this.paodan.lookatPoint(this.temptPos);

                m4m.math.vec3Clone(this.temptPos, this.paodan.localPosition);
                this.paodan.markDirty();

                m4m.math.vec3Subtract(this.temptPos, this.lastPos, this.realDIr);
                if (this.realDIr.y < 0)//调数值无效，把这个判断去掉
                {
                    m4m.math.vec3Normalize(this.realDIr, this.realDIr);
                    let ray = new m4m.framework.ray(this.lastPos, this.realDIr);
                    this.rayInstersetScene(ray, (info) => {
                        let dis = m4m.math.vec3Distance(this.lastPos, this.temptPos);
                        if (info.distance < dis + 0.2)//碰撞出问题，增加0.2数值
                        {
                            this.addcube(info.hitposition);
                            {//炮弹碰撞
                                console.warn("---------------碰到了");
                                this.beLaunched = false;
                                this.time = 0;
                                if (this.onEndCollision) {
                                    this.onEndCollision(info.hitposition);
                                }
                            }
                        }
                    });
                }
            }
        }

        private screenpos: m4m.math.vector2 = new m4m.math.vector2();
        /**
         * 更新GUI
         */
        private updateUI() {
            if (this.beUIFollow && this.paodan) {
                let pos = this.paodan.getWorldPosition();
                this.camera.calcScreenPosFromWorldPos(this.app, pos, this.screenpos);

                m4m.math.vec2Clone(this.screenpos, this.testUI.localTranslate);
                this.testUI.markDirty();
            }
        }
        private targetRotation: m4m.math.quaternion = new m4m.math.quaternion();
        private lastRotaion: m4m.math.quaternion = new m4m.math.quaternion();

        private paoheight: number = 2;
        private paoLen: number = 1;
        private paokouPos: m4m.math.vector3 = new m4m.math.vector3();
        /**
         *  旋转炮角度
         */
        private beforeRotatePaojia() {
            this.adjustMiddlePoint(this.paojia.getWorldPosition(), this.targetPos, this.middlePos);

            let dir = m4m.math.pool.new_vector3();
            m4m.math.vec3Subtract(this.middlePos, this.paojia.getWorldPosition(), dir);
            m4m.math.vec3Normalize(dir, dir);
            m4m.math.quatClone(this.paojia.localRotate, this.lastRotaion);
            this.getRotationByDir(dir, m4m.math.pool.vector3_forward, this.targetRotation);

            m4m.math.vec3Clone(this.paojia.getWorldPosition(), this.paokouPos);
            this.paokouPos.y += this.paoheight;
            this.scaleAndAdd(dir, this.paoLen, this.paokouPos, this.paokouPos);
            this.adjustMiddlePoint(this.paokouPos, this.targetPos, this.middlePos);

            {//---------激活旋转
                this.beActiveRot = true;
                this.rottime = 0;
            }

            m4m.math.pool.delete_vector3(dir);
        }

        /**
         * 当开火前回调
         */
        private onberforeFire: () => void;

        private beActiveRot: boolean = false;
        private rotTotalTime: number = 1;
        private rottime: number = 0;
        /**
         * 当旋转结束
         */
        private onRotEnd: () => void;
        /**
         * 更新旋转炮角度
         * @param delta 
         */
        private updateRotPaojia(delta: number) {
            if (this.beActiveRot && this.rottime < this.rotTotalTime) {
                this.rottime += delta;
                let lerp = this.rottime / this.rotTotalTime;
                lerp = Math.min(lerp, 1.0);
                if (lerp == 1.0) {
                    this.beActiveRot = false;
                    if (this.onRotEnd != null) {
                        this.onRotEnd();
                    }
                    {//-----------发射前重置炮弹位置
                        m4m.math.vec3Clone(this.paojia.localPosition, this.paodan.localPosition);
                        this.paodan.markDirty();
                        if (this.onberforeFire) {
                            this.onberforeFire();
                        }
                        this.fireBullet();
                    }
                }
                m4m.math.quatLerp(this.lastRotaion, this.targetRotation, this.paojia.localRotate, lerp);
                this.paojia.markDirty();
            }
        }

        //-----------------------------game util---------------------------------------------------------------------------------
        /**
         * 缩放和偏移
         * @param from 开始
         * @param scale 缩放
         * @param add 偏移
         * @param out 输出
         */
        private scaleAndAdd(from: m4m.math.vector3, scale: number, add: m4m.math.vector3, out: m4m.math.vector3) {
            out.x = from.x * scale + add.x;
            out.y = from.y * scale + add.y;
            out.z = from.z * scale + add.z;
        }

        /**
         * 用射线检测场景
         * @param ray 射线
         * @param fuc 回调函数
         */
        rayInstersetScene(ray: m4m.framework.ray, fuc: (info: m4m.framework.pickinfo) => void) {
            let bePickMesh = false;
            let infos = this.intersetColliders(ray, this.targets);
            let info = m4m.math.pool.new_pickInfo();
            let distance = Number.MAX_VALUE;
            let temptinfo = m4m.math.pool.new_pickInfo();
            for (let i = 0; i < infos.length; i++) {
                let picked = this.intersetMesh(ray, temptinfo, infos[i].pickedtran);
                if (picked && temptinfo.distance < distance) {
                    bePickMesh = true;
                    distance = temptinfo.distance;
                    info.cloneFrom(temptinfo);
                }
            }
            if (bePickMesh) {
                fuc(info);
            } else {
                if (this.floor) {
                    bePickMesh = this.intersetMesh(ray, info, this.floor);
                    if (bePickMesh) {
                        fuc(info);
                    }
                }

            }
            // this.behit=bePickMesh;

            for (let key in infos) {
                m4m.math.pool.delete_pickInfo(infos[key]);
            }
        }

        /**
         * 检测mesh交叉
         * @param ray 射线
         * @param info 拾取信息
         * @param tran 节点
         * @returns 是否相交
         */
        intersetMesh(ray: m4m.framework.ray, info: m4m.framework.pickinfo, tran: m4m.framework.transform): boolean {
            var meshFilter = tran.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
            if (meshFilter != null) {
                //3d normal mesh
                var mesh = meshFilter.getMeshOutput();
                if (mesh) {
                    let bool = mesh.intersects(ray, tran.getWorldMatrix(), info);
                    return bool;
                }
            }
            return false;
        }

        /**
         * 检测碰撞体交叉
         * @param ray 射线
         * @param trans 节点
         * @returns 所有的拾取点
         */
        intersetColliders(ray: m4m.framework.ray, trans: m4m.framework.transform[]): m4m.framework.pickinfo[] {
            let infos: m4m.framework.pickinfo[] = [];

            let info = m4m.math.pool.new_pickInfo();
            for (let i = 0; i < trans.length; i++) {
                let bepicked = ray.intersectCollider(trans[i], info);
                if (bepicked) {
                    let newinfo = m4m.math.pool.new_pickInfo();
                    newinfo.cloneFrom(info);
                    infos.push(newinfo);
                }
            }
            infos.sort((a, b) => {
                return a.distance - b.distance;
            });
            return infos;
        }

        /**
         * 添加cube
         * @param pos 位置
         * @param scale 缩放
         * @returns cube节点
         */
        addcube(pos: m4m.math.vector3, scale: m4m.math.vector3 = null): m4m.framework.transform {
            let cube4 = new m4m.framework.transform();
            if (scale != null) {
                m4m.math.vec3Clone(scale, cube4.localScale);
            }
            m4m.math.vec3Clone(pos, cube4.localPosition);
            this.scene.addChild(cube4);

            let meshf4 = cube4.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            cube4.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            meshf4.mesh = this.assetmgr.getDefaultMesh("cube");
            return cube4;
        }

        /**
         * 添加GUI按钮
         * @param text 文本 
         * @param x 位置x
         * @param y 位置y
         * @param func 点击回调
         */
        private addBtn(text: string, x: number, y: number, func: () => void) {
            var btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () => {
                func();
            }
            btn.style.top = y + "px";
            btn.style.left = x + "px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
        }

        /**
         * 调整中间的点
         * @param from 开始
         * @param to 结束
         * @param pos 输出位置
         */
        private adjustMiddlePoint(from: m4m.math.vector3, to: m4m.math.vector3, pos: m4m.math.vector3) {
            let dis = m4m.math.vec3Distance(from, to);
            //----lerp
            let lerp = 0.7;
            m4m.math.vec3SLerp(from, to, lerp, pos);
            //---------------up延伸
            // let upy=10;
            pos.y += dis * 0.5;
        }

        /**
         * 计算贝塞尔曲线上的点
         * @param from 开始
         * @param middle 中间
         * @param to 结束
         * @param t 进度值
         * @param out 输出点
         */
        private bessel(from: m4m.math.vector3, middle: m4m.math.vector3, to: m4m.math.vector3, t: number, out: m4m.math.vector3) {
            //out=from*(1-t)^2+middle*2t(1-t)+to*t^2

            let p1 = Math.pow(1 - t, 2);
            let p2 = 2 * t * (1 - t);
            let p3 = Math.pow(t, 2);

            out.x = from.x * p1 + middle.x * p2 + to.x * p3;
            out.y = from.y * p1 + middle.y * p2 + to.y * p3;
            out.z = from.z * p1 + middle.z * p2 + to.z * p3;
        }

        /**
         * 获取贝塞尔的方向
         * @param from  开始
         * @param middle 中间
         * @param to 结束
         * @param t 进度值
         * @param out 输出方向
         */
        private getBeselDir(from: m4m.math.vector3, middle: m4m.math.vector3, to: m4m.math.vector3, t: number, out: m4m.math.vector3) {
            //out=from*2*(1-t)*(-1)+middle*2(1-2t)+to*2t
            let p1 = -1 * 2 * (1 - t);
            let p2 = 2 * (1 - 2 * t);
            let p3 = 2 * t;

            out.x = from.x * p1 + middle.x * p2 + to.x * p3;
            out.y = from.y * p1 + middle.y * p2 + to.y * p3;
            out.z = from.z * p1 + middle.z * p2 + to.z * p3;
        }

        /**
         * 通过方向获取旋转
         * @param dir 方向
         * @param forward 前方
         * @param out 输出
         */
        private getRotationByDir(dir: m4m.math.vector3, forward: m4m.math.vector3, out: m4m.math.quaternion) {
            let tana = dir.y / Math.sqrt(dir.x * dir.x + dir.z * dir.z);
            let _rotx = Math.atan(tana) * 180 / Math.PI;

            dir.y = 0;
            m4m.math.vec3Normalize(dir, dir);
            let _roty = this.fromToRotation(forward, dir, m4m.math.pool.vector3_right);
            m4m.math.quatFromEulerAngles(-1 * _rotx, _roty, 0, out);
        }

        /**
         * 获取旋转角度
         * @param dir 方向
         * @param forward 前方
         * @returns 输出角度
         */
        private getRotAnlge(dir: m4m.math.vector3, forward: m4m.math.vector3): { rotx: number, roty: number } {
            let tana = dir.y / Math.sqrt(dir.x * dir.x + dir.z * dir.z);
            let _rotx = Math.atan(tana) * 180 / Math.PI;

            dir.y = 0;
            m4m.math.vec3Normalize(dir, dir);
            let _roty = this.fromToRotation(forward, dir, m4m.math.pool.vector3_right);
            return { rotx: _rotx, roty: _roty };
        }

        /**
         * 计算从a到b 的旋转
         * @param from a向量
         * @param to b向量
         * @param right 输出
         * @returns 旋转度
         */
        private fromToRotation(from: m4m.math.vector3, to: m4m.math.vector3, right: m4m.math.vector3): number {
            let dir1 = m4m.math.pool.new_vector3();
            let dir2 = m4m.math.pool.new_vector3();

            m4m.math.vec3Normalize(from, dir1);
            m4m.math.vec3Normalize(to, dir2);

            let dot = m4m.math.vec3Dot(dir1, dir2);

            let dot2 = m4m.math.vec3Dot(dir2, right);
            dot2 = Math.acos(dot2) * 180 / Math.PI;
            if (dot2 > 90) {
                dot = -1 * Math.acos(dot) * 180 / Math.PI;
            } else {
                dot = Math.acos(dot) * 180 / Math.PI;
            }

            m4m.math.pool.delete_vector3(dir1);
            m4m.math.pool.delete_vector3(dir2);
            return dot;
        }

    }
}