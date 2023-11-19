namespace dome
{
    export class paowuxian implements IState
    {
        camera: m4m.framework.camera;
        scene: m4m.framework.scene;
        app: m4m.framework.application;
        assetmgr:m4m.framework.assetMgr;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();

        private paoLen:number=0;
        private paojia:m4m.framework.transform;
        private paodan:m4m.framework.transform;
        private guiji:m4m.framework.transform;
        private guanghuan:m4m.framework.transform;

        private orgPos:m4m.math.vector3=new m4m.math.vector3(0,10,-10);
        rotEuler:m4m.math.vector3=new m4m.math.vector3(-30,180,0);
        gravity:number=10;
        speed:number=30;


        dir:m4m.math.vector3=new m4m.math.vector3();
        start(app: m4m.framework.application) {
            this.app=app;
            this.scene=app.getScene();
            this.assetmgr=app.getAssetMgr();

            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadmesh.bind(this));
            this.taskmgr.addTaskCall(this.gamerun.bind(this));
        }

        /**
         * 加载shader
         * @param laststate 
         * @param state 加载状态
         */
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    state.finish = true;
                }
            }
            );
        }

        /**
         * 游戏运行
         * @param laststate 
         * @param state 加载状态
         */
        private gamerun(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.addcam();
            this.addcube();
            this.addUI();
            state.finish=true;

            this.camctr.setTarget(this.paodan);
            this.camctr.setDistanceToTarget(2);
            this.camctr.setRotAngle(180,30);
        }


        private paoKouPos:m4m.math.vector3=new m4m.math.vector3();

        private timer:number=0;
        private forward:m4m.math.vector3=new m4m.math.vector3();

        /**
         * 更新
         * @param delta 帧间间隔时间
         */
        update(delta: number) {
            this.taskmgr.move(delta);
            CameraController.instance().update(delta);

            if(this.paojia)
            {
                this.rotEuler.x= m4m.math.floatClamp(this.rotEuler.x,-90,0);

                this.paojia.localEulerAngles=this.rotEuler;
                this.paojia.markDirty();
    
                this.guiji.localEulerAngles=new m4m.math.vector3(0,this.rotEuler.y,0);
                this.guiji.markDirty();
    
                let meshf=this.guiji.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
                // this.getDirByRotAngle(this.rotEuler,this.dir);
                // m4m.math.vec3Normalize(this.dir,this.dir);
                //------------炮口位置
                //m4m.math.vec3ScaleByNum(this.dir,this.paoLen,this.paoKouPos);

                meshf.mesh=this.getMeshData(-this.rotEuler.x,this.gravity,this.speed,this.paoLen,this.orgPos.y);

                //------------------------
                let mat=this.guiji.getWorldMatrix();
                m4m.math.matrixTransformVector3(this.startPos,mat,this.worldStart);
                m4m.math.matrixTransformVector3(this.hPos,mat,this.worldMiddle);
                m4m.math.matrixTransformVector3(this.endpos,mat,this.worldEnd);


                m4m.math.vec3Clone(this.worldStart,this.startTrans.localTranslate);
                m4m.math.vec3Clone(this.worldMiddle,this.middleTrans.localTranslate);
                this.startTrans.markDirty();
                this.middleTrans.markDirty();

                if(!this.enableWASD)
                {
                    m4m.math.vec3Clone(this.worldEnd,this.endTrans.localTranslate);
                    this.endTrans.markDirty();
                }
                //------------
                let info:m4m.framework.pickinfo=new m4m.framework.pickinfo();
                //------------------障碍物集合
                //炮车集合
                let targets1:m4m.framework.transform[]=[];
                //障碍物集合
                let targets2:m4m.framework.transform[]=[];
                // targets1=targets2;
                this.beNeedRecompute=true;
                if(this.detectTarget_2(this.targets,targets2,info))
                {
                    m4m.math.vec3Clone(info.hitposition,this.guanghuan.localPosition);
                    let axis=new m4m.math.vector3();
                    // let mat=info.pickedtran.getWorldMatrix();
                    // m4m.math.matrixTransformNormal(info.normal,mat,info.normal);
                    
                    m4m.math.vec3Cross(m4m.math.pool.vector3_up,info.normal,axis);
                    m4m.math.vec3Normalize(axis,axis)
                    let dot=m4m.math.vec3Dot(info.normal,m4m.math.pool.vector3_up);
                    let angle=Math.acos(dot)*180/Math.PI;
                    m4m.math.quatFromAxisAngle(axis,angle,this.guanghuan.localRotate);
                    this.guanghuan.markDirty();
                }else
                {
                    // this.guanghuan.localEulerAngles=new m4m.math.vector3();
                    m4m.math.quatIdentity(this.guanghuan.localRotate);
                    m4m.math.vec3Clone(this.worldEnd,this.guanghuan.localPosition);
                    this.guanghuan.markDirty();
                }
            }


            if(this.actived)
            {
                this.timer+=delta*0.1;
                let move=new m4m.math.vector3();
                this.getDirByRotAngle(this.rotEuler,this.dir);
                m4m.math.vec3ScaleByNum(this.dir,this.paoLen,this.paoKouPos);

                m4m.math.vec3ScaleByNum(this.dir,this.speed,move);
                m4m.math.vec3ScaleByNum(move,this.timer,move);
                move.y-=0.5*this.gravity*this.timer*this.timer;


                m4m.math.vec3Add(this.paoKouPos,this.paojia.getWorldPosition(),this.paoKouPos);
                m4m.math.vec3Add(this.paoKouPos,move,this.paodan.localPosition);

                this.paodan.markDirty();

                if(this.paodan.localPosition.y<0)
                {
                    this.actived=false;
                }
            }
        }
        private beNeedRecompute:boolean=true;
        private worldPoints:m4m.math.vector3[]=[];
        private targets:m4m.framework.transform[]=[];
        private worldStart:m4m.math.vector3=new m4m.math.vector3();
        private startTrans:m4m.framework.transform;
        private worldEnd:m4m.math.vector3=new m4m.math.vector3();
        private endTrans:m4m.framework.transform;
        private worldMiddle:m4m.math.vector3=new m4m.math.vector3();
        private middleTrans:m4m.framework.transform;


        /**
         * 检测目标
         * @param targets1 仅仅碰撞 碰撞盒子
         * @param targets2 先碰撞盒子再碰mesh
         * @param info 
         */
        private detectTarget_2(targets1:m4m.framework.transform[],targets2:m4m.framework.transform[],info:m4m.framework.pickinfo):boolean
        {
            let newtargets=[];
            if(this.linedetectcollider(this.worldStart,this.worldMiddle,targets1,newtargets))
            {
                if(this.detectSecond_Colliders(newtargets,info))
                {
                    // console.error("collider:"+info.pickedtran.name);
                    return true;
                }
            }
            newtargets=[];
            if(this.linedetectcollider(this.worldMiddle,this.worldEnd,targets1,newtargets))
            {
                if(this.detectSecond_Colliders(newtargets,info))
                {
                    // console.error("collider:"+info.pickedtran.name);
                    return true;
                }
            }
            newtargets=[];
            if(this.linedetectcollider(this.worldStart,this.worldMiddle,targets2,newtargets))
            {
                if(this.detectSecond_Meshs(newtargets,info))
                {
                    return true;
                }
            }
            newtargets=[];
            if(this.linedetectcollider(this.worldMiddle,this.worldEnd,targets2,newtargets))
            {
                if(this.detectSecond_Meshs(newtargets,info))
                {
                    return true;
                }
            }
            return false;
        }

        // private detectSecond(target:m4m.framework.transform,info:m4m.framework.pickinfo):boolean
        // {
        //     if(this.beNeedRecompute)
        //     {
        //         this.beNeedRecompute=false;
        //         let mat=this.guiji.getWorldMatrix();
        //         for(let i=0;i<this.pointArr.length;i++)
        //         {
        //             m4m.math.matrixTransformVector3(this.pointArr[i],mat,this.pointArr[i]);
        //         }
        //     }
        //     for(let i=0;i<this.pointArr.length-1;i++)
        //     {
        //        if(this.lineDetectMesh(this.pointArr[i],this.pointArr[i+1],target,info))
        //        {
        //            info.pickedtran=target;
        //            return true;
        //        } 
        //     }
        //     return false;
        // }

        /**
         * 检测二次碰撞所有
         * @param target 目标列表
         * @param info 拾取信息
         * @returns 有拾取到？
         */
        private detectSecond_Colliders(target:m4m.framework.transform[],info:m4m.framework.pickinfo):boolean
        {
            let distancc:number=Number.MAX_VALUE;
            let picked=false;
            for(let i=0;i<target.length;i++)
            {
                let _info=new m4m.framework.pickinfo();
                if(this.detectSecond_Collider(target[i],_info))
                {
                    if(_info.distance<distancc)
                    {
                        picked=true;
                        distancc=_info.distance;
                        info.cloneFrom(_info);
                    }
                }
            }
            return picked;
        }

        /**
         * 检测二次碰撞
         * @param target 目标
         * @param info 拾取信息
         * @returns 有拾取到？
         */
        private detectSecond_Collider(target:m4m.framework.transform,info:m4m.framework.pickinfo):boolean
        {
            if(this.beNeedRecompute)
            {
                this.beNeedRecompute=false;
                let mat=this.guiji.getWorldMatrix();
                for(let i=0;i<this.pointArr.length;i++)
                {
                    m4m.math.matrixTransformVector3(this.pointArr[i],mat,this.pointArr[i]);
                }
            }
            if(this.intersectCollider(this.pointArr,target,info))
            {
                info.pickedtran=target;
                return true;
            }
            return false;
        }

        /**
         * 检测二次碰撞 mesh列表
         * @param target 目标列表
         * @param info 拾取信息
         * @returns 有拾取到？
         */
        private detectSecond_Meshs(target:m4m.framework.transform[],info:m4m.framework.pickinfo):boolean
        {
            let distancc:number=Number.MAX_VALUE;
            let picked=false;
            for(let i=0;i<target.length;i++)
            {
                let _info=new m4m.framework.pickinfo();
                if(this.detectSecond_Mesh(target[i],_info))
                {
                    if(_info.distance<distancc)
                    {
                        picked=true;
                        distancc=_info.distance;
                        info.cloneFrom(_info);
                    }
                }
            }
            return picked;
        }

        /**
         * 检测二次碰撞 mesh
         * @param target 目标
         * @param info 拾取信息
         * @returns 有拾取到？
         */
        private detectSecond_Mesh(target:m4m.framework.transform,info:m4m.framework.pickinfo):boolean
        {
            if(this.beNeedRecompute)
            {
                this.beNeedRecompute=false;
                let mat=this.guiji.getWorldMatrix();
                for(let i=0;i<this.pointArr.length;i++)
                {
                    m4m.math.matrixTransformVector3(this.pointArr[i],mat,this.pointArr[i]);
                }
            }
            let meshf=target.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
            let mesh=meshf.getMeshOutput();

            if(meshf!=null&&meshf.mesh!=null)
            {
                if(this.intersects(this.pointArr,meshf.mesh,target.getWorldMatrix(),info))
                {
                    info.pickedtran=target;
                    return true;
                }
            }
            return false;
        }

        /**
         * 检测线与碰撞器的碰撞
         * @param start 线开始点
         * @param end 线结束点
         * @param targets 目标
         * @param newtargets 
         * @returns 是碰撞？
         */
        private linedetectcollider(start:m4m.math.vector3,end:m4m.math.vector3,targets:m4m.framework.transform[],newtargets:m4m.framework.transform[]):boolean
        {
            let dir=new m4m.math.vector3();
            m4m.math.vec3Subtract(end,start,dir);
            let len=m4m.math.vec3Length(dir);
            m4m.math.vec3Normalize(dir,dir);
            let ray=new m4m.framework.ray(start,dir);

            let distance=Number.MAX_VALUE;
            let picked=false;
            //--------------
            for(let key in targets)
            {
                let _info=new m4m.framework.pickinfo();
                if(ray.intersectCollider(targets[key],_info))
                {
                    if(_info.distance<len)
                    {
                        picked=true;
                        newtargets.push(_info.pickedtran);
                    }
                }
            }
            return picked;
        }
        private lineDetectMesh(start:m4m.math.vector3,end:m4m.math.vector3,target:m4m.framework.transform,info:m4m.framework.pickinfo):boolean
        {
            let dir=new m4m.math.vector3();
            m4m.math.vec3Subtract(end,start,dir);
            let len=m4m.math.vec3Length(dir);
            m4m.math.vec3Normalize(dir,dir);
            let ray=new m4m.framework.ray(start,dir);
            
            let meshf=target.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
            let mesh=meshf.getMeshOutput();
            if(mesh!=null)
            {
               if(mesh.intersects(ray,target.getWorldMatrix(),info))
               {
                    if(info.distance<len)
                    {
                        return true;
                    }
               }
            }
        }
        private cam2:m4m.framework.gameObject;
        private camctr:camCtr;
        /**
         * 添加相机
         */
        private addcam()
        {
            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 2000;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new m4m.math.vector3(0,0,-15);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            let controller=new CameraController();
            CameraController.instance().init(this.app,this.camera);


            var objCam = new m4m.framework.transform();
            this.cam2=objCam.gameObject;
            this.cam2.visible=false;
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            camera.near = 0.01;
            camera.far = 2000;
            camera.fov = Math.PI * 0.3;
            camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new m4m.math.vector3(0,0,-15);
            objCam.markDirty();//标记为需要刷新
            this.camctr=objCam.gameObject.addComponent("camCtr") as camCtr;
        }

        /**
         * 添加cube
         */
        private addcube()
        {
            // let cube0=new m4m.framework.transform();
            // cube0.localScale=new m4m.math.vector3(1000,0.01,1000);
            // this.scene.addChild(cube0);
            // let meshf0=cube0.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            // let meshr0=cube0.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            // meshf0.mesh=this.assetmgr.getDefaultMesh("cube");

            let cube1=new m4m.framework.transform();
            this.paojia=cube1;
            cube1.localPosition=this.orgPos;
            cube1.localScale=new m4m.math.vector3(0.5,0.5,this.paoLen*2);
            this.scene.addChild(cube1);
            let meshf1=cube1.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            let meshr1=cube1.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            meshf1.mesh=this.assetmgr.getDefaultMesh("cube");
            
            let cube2=new m4m.framework.transform();
            cube2.localScale=new m4m.math.vector3(0.2,0.2,0.2);
            this.paodan=cube2;
            this.scene.addChild(cube2);
            let meshf2=cube2.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            let meshr2=cube2.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            meshf2.mesh=this.assetmgr.getDefaultMesh("cube");

            let cube3=new m4m.framework.transform();
            this.guiji=cube3;
            cube3.localPosition=this.orgPos;
            this.scene.addChild(cube3);
            let meshf3=cube3.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            let meshr3=cube3.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            let mat=new m4m.framework.material();
            let shader=this.assetmgr.getShader("diffuse_bothside.shader.json");
            mat.setShader(shader);
            meshr3.materials=[mat];
  
            let cube4=new m4m.framework.transform();
            this.guanghuan=cube4;
            cube4.localScale=new m4m.math.vector3(3,0.1,3);
            this.scene.addChild(cube4);
            let meshf4=cube4.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            cube4.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            meshf4.mesh=this.assetmgr.getDefaultMesh("cube");

            this.startTrans= this.addscaledCube(0.3);
            this.middleTrans= this.addscaledCube(0.3);
            this.endTrans= this.addscaledCube(0.3);

        }

        private cubes:m4m.framework.transform[]=[];
        /**
         * 添加缩放的cube
         * @param scale 缩放值
         * @returns 
         */
        private addscaledCube(scale:number):m4m.framework.transform
        {
            let cube4=new m4m.framework.transform();
            this.cubes.push(cube4);
            cube4.localScale=new m4m.math.vector3(scale,scale,scale);
            this.scene.addChild(cube4);
            let meshf4=cube4.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            cube4.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            meshf4.mesh=this.assetmgr.getDefaultMesh("cube");
            return cube4;
        }

        /**
         * 获取方向
         * @param euler 欧拉角
         * @param dir 方向
         */
        getDirByRotAngle(euler:m4m.math.vector3,dir:m4m.math.vector3)
        {
            let rot=new m4m.math.quaternion();
            m4m.math.quatFromEulerAngles(euler.x,euler.y,euler.z,rot);
            m4m.math.quatTransformVector(rot,m4m.math.pool.vector3_forward,dir);

        }

        private mesh:m4m.framework.mesh;
        private lerpCount:number=30;
        private guanghuantoPaoJia:number;

        private pointArr:m4m.math.vector3[];
        private endpos:m4m.math.vector3=new m4m.math.vector3();
        private hPos:m4m.math.vector3=new m4m.math.vector3();
        private startPos:m4m.math.vector3=new m4m.math.vector3();
        /**
         * 获取mesh数据
         * @param anglex 角度
         * @param gravity 重力
         * @param speed 速度
         * @param paoLen 炮长度
         * @param paojiaPosY 炮位置Y
         * @returns mesh
         */
        getMeshData(anglex:number,gravity:number,speed:number,paoLen:number,paojiaPosY:number=0):m4m.framework.mesh
        {
            if(this.mesh==null)
            {
               this.mesh=this.initmesh(anglex,gravity,speed,paoLen,paojiaPosY);
            }else
            {
                anglex=anglex*Math.PI/180;
                let halfwidth:number=1;
                let posarr:m4m.math.vector3[]=[];
                let Middleposarr:m4m.math.vector3[]=[]; 

                let paokouy=paoLen*Math.sin(anglex);
                let paokouz=paoLen*Math.cos(anglex);
                
                let speedy=Math.sin(anglex)*speed;
                let speedz=Math.cos(anglex)*speed;
                let totalTime=speedy/gravity+Math.sqrt(2*(paojiaPosY+paokouy)/gravity+Math.pow(speedy/gravity,2));
                //
                let count=this.lerpCount;
                let deltaTime=totalTime/count;
                for(let i=0;i<=count;i++)
                {
                    let counttime=deltaTime*i;
                    let newpos1=new m4m.math.vector3(halfwidth,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                    let newpos2=new m4m.math.vector3(-halfwidth,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                    posarr.push(newpos1);
                    posarr.push(newpos2);
                    
                    let middlepos=new m4m.math.vector3(0,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                    Middleposarr.push(middlepos);
                    if(i==count)
                    {
                        this.guanghuantoPaoJia=speedz*counttime+paokouz;
                    }
                }
                this.mesh.data.pos=posarr;
                this.pointArr=Middleposarr;
                var vf = m4m.render.VertexFormatMask.Position| m4m.render.VertexFormatMask.UV0;
                var v32 = this.mesh.data.genVertexDataArray(vf);
                this.mesh.glMesh.uploadVertexData(this.app.webgl, v32);

                //-------------------------计算三点---------------------
                this.startPos.y=paokouy;
                this.startPos.z=paokouz;
                let time=speedy/gravity;
                this.hPos.y=speedy*time-0.5*gravity*Math.pow(time,2)+paokouy;
                this.hPos.z=speedz*time+paokouz;
                this.endpos.y=-paojiaPosY;
                this.endpos.z=speedz*totalTime+paokouz;
            }
            
            return this.mesh
        }

        /**
         * 初始化mesh
         * @param anglex 角度
         * @param gravity 重力
         * @param speed 速度
         * @param paoLen 炮长度
         * @param paojiaPosY 炮位置Y
         * @returns mesh
         */
        private initmesh(anglex:number,gravity:number,speed:number,paoLen:number,paojiaPosY:number=0):m4m.framework.mesh
        {
            anglex=anglex*Math.PI/180;
            let halfwidth:number=1;
            let posarr:m4m.math.vector3[]=[];
            let uvArr:m4m.math.vector2[]=[];
            let trisindex: number[]=[];
            let data=new m4m.render.meshData();
            data.pos=posarr;
            data.uv=uvArr;
            data.trisindex=trisindex;

            let paokouy=paoLen*Math.sin(anglex);
            let paokouz=paoLen*Math.cos(anglex);
            
            let speedy=Math.sin(anglex)*speed;
            let speedz=Math.cos(anglex)*speed;
            let totalTime=speedy/gravity+Math.sqrt(2*(paojiaPosY+paokouy)/gravity+Math.pow(speedy/gravity,2));
            //
            let count=this.lerpCount;
            let deltaTime=totalTime/count;
            for(let i=0;i<=count;i++)
            {
                let counttime=deltaTime*i;
                let newpos1=new m4m.math.vector3(halfwidth,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                let newpos2=new m4m.math.vector3(-halfwidth,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                posarr.push(newpos1);
                posarr.push(newpos2);

                let newUv1=new m4m.math.vector2(i/count,0);
                let newUv2=new m4m.math.vector2(i/count,1);
                uvArr.push(newUv1);
                uvArr.push(newUv2);

                trisindex.push();
            }
            for(let i=0;i<count;i++)
            {
                trisindex.push(2*i+0,2*i+2,2*i+1,2*i+1,2*i+2,2*i+3);
            }

            var _mesh: m4m.framework.mesh = new m4m.framework.mesh(".mesh.bin");
            _mesh.data = data;
            var vf = m4m.render.VertexFormatMask.Position| m4m.render.VertexFormatMask.UV0;
            _mesh.data.originVF=vf;
            var v32 = _mesh.data.genVertexDataArray(vf);
            var i16 = _mesh.data.genIndexDataArray();

            _mesh.glMesh = new m4m.render.glMesh();
            _mesh.glMesh.initBuffer(this.app.webgl, vf, _mesh.data.pos.length,m4m.render.MeshTypeEnum.Dynamic);
            _mesh.glMesh.uploadVertexData(this.app.webgl, v32);

            _mesh.glMesh.addIndex(this.app.webgl, i16.length);
            _mesh.glMesh.uploadIndexData(this.app.webgl, 0, i16);
            _mesh.glMesh.initVAO();
            _mesh.submesh = [];

            {
                var sm = new m4m.framework.subMeshInfo();
                sm.matIndex = 0;
                sm.start = 0;
                sm.size = i16.length;
                sm.line = false;
                _mesh.submesh.push(sm);
            }
            return _mesh;
        }
        private actived:boolean=false;
        private enableWASD:boolean=true;

        /**
         * 添加UI
         */
        private addUI()
        {
            let deltaangle:number=3;
            this.addBtn("左转",30,300,()=>{
                this.rotEuler.y-=deltaangle;
            });
            this.addBtn("右转",100,300,()=>{
                this.rotEuler.y+=deltaangle;
            });

            this.addBtn("上转",30,400,()=>{
                this.rotEuler.x-=deltaangle;
            });
            this.addBtn("下转",100,400,()=>{
                this.rotEuler.x+=deltaangle;
            });

            this.addBtn("发射",60,450,()=>{
                this.actived=true;
            });


            this.addBtn("切换相机",60,500,()=>{
                this.cam2.visible=!this.cam2.visible;
                this.camera.gameObject.visible=!this.camera.gameObject.visible;
            });

            this.addBtn("w",30,600,()=>{
                if(this.enableWASD)
                {
                    this.endTrans.localPosition.z+=1;
                    this.endTrans.markDirty();
                    this.apply();
                }
            });
            this.addBtn("s",100,600,()=>{
                if(this.enableWASD)
                {
                    this.endTrans.localPosition.z-=1;
                    this.endTrans.markDirty();
                    this.apply();  
                }
            });

            this.addBtn("a",30,700,()=>{
                if(this.enableWASD)
                {
                    this.endTrans.localPosition.x-=1;
                    this.endTrans.markDirty();
                    this.apply();
                }
            });
            this.addBtn("d",100,700,()=>{
                if(this.enableWASD)
                {
                    this.endTrans.localPosition.x+=1;
                    this.endTrans.markDirty();
                    this.apply();
                }
            });

        }

        /**
         * 应用
         */
        private apply()
        {
            let target=new m4m.math.vector3();
            m4m.math.vec3Subtract(this.endTrans.localPosition,this.guiji.localPosition,target);
            target.y=0;
            let rotinfo=this.getRotAnlge(this.speed,this.orgPos.y,this.gravity,target,m4m.math.pool.vector3_forward);
            this.rotEuler.x=-1*rotinfo.rotx;
            this.rotEuler.y=rotinfo.roty;
        }

        /**
         * 添加按钮
         * @param text 文本 
         * @param x x
         * @param y y
         * @param func 触发函数 
         */
        private addBtn(text: string,x:number,y:number,func:()=>void)
        {
            var btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () =>
            {
                func();
            }
            btn.style.top = y + "px";
            btn.style.left = x + "px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
        }

        /**
         * 加载mesh
         * @param laststate 
         * @param state 加载状态
         */
        private loadmesh(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            var name="box";
            // name="CJ";
            this.app.getAssetMgr().load(`${resRootPath}prefab/${name}/${name}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(name+".prefab.json" , `${name}.assetbundle.json`) as m4m.framework.prefab;
                    let item= _prefab.getCloneTrans();
                    this.scene.addChild(item);

                    //---------------showbox
                    let showColider=(trans:m4m.framework.transform)=>{
                        let collider=trans.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
                        if(collider!=null)
                        {
                            collider.colliderVisible=true;
                            this.targets.push(trans);
                        }
                        if(trans.children!=null)
                        {
                            for(let key in trans.children)
                            {
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
         * 交叉检测
         * @param LinePoints 线上的点
         * @param mesh mesh
         * @param matrix 矩阵
         * @param outInfo 拾取到的信息
         * @returns 是交叉了？
         */
        private intersects(LinePoints:m4m.math.vector3[],mesh:m4m.framework.mesh,matrix: m4m.math.matrix, outInfo:m4m.framework.pickinfo): boolean
        {
            let ishided = false;
            if (!mesh.submesh) return ishided;
            let lastDistance = Number.MAX_VALUE;

            let worldPosArr:m4m.math.vector3[]=[];
            for(let i=0,len=mesh.data.pos.length;i<len;i++)
            {
                let p0 = mesh.data.pos[i];
                let t0 = m4m.math.pool.new_vector3();
                m4m.math.matrixTransformVector3(p0, matrix, t0);
                worldPosArr.push(t0);
            }

            for(let i=0;i<LinePoints.length-1;i++)
            {
                let dir=new m4m.math.vector3();
                m4m.math.vec3Subtract(LinePoints[i+1],LinePoints[i],dir);
                let len=m4m.math.vec3Length(dir);
                m4m.math.vec3Normalize(dir,dir);
                let ray=new m4m.framework.ray(LinePoints[i],dir);
               
                for (let j = 0; j < mesh.submesh.length; j++)
                {
                    let submesh = mesh.submesh[j];
                    for (let index = submesh.start; index < submesh.size; index += 3)
                    {
                        let t0 = worldPosArr[mesh.data.trisindex[index]];
                        let t1 = worldPosArr[mesh.data.trisindex[index+1]];
                        let t2 = worldPosArr[mesh.data.trisindex[index+2]];

                        let tempinfo = m4m.math.pool.new_pickInfo();
                        let bool =ray.intersectsTriangle(t0, t1, t2, tempinfo);
                        if (bool&&tempinfo.distance>0&&tempinfo.distance<=len)
                        {
                            let hitpos=m4m.math.pool.new_vector3();
                            m4m.math.vec3ScaleByNum(ray.direction, tempinfo.distance, hitpos);
                            m4m.math.vec3Add(ray.origin, hitpos, hitpos);
                            let dist=m4m.math.vec3Distance(hitpos,LinePoints[0]);

                            if(dist<lastDistance)
                            {
                                ishided = true;
                                outInfo.cloneFrom(tempinfo);
                                outInfo.faceId = index / 3;
                                outInfo.subMeshId = j;

                                m4m.math.vec3Clone(hitpos,outInfo.hitposition);
                                lastDistance = dist;
                            }
                            m4m.math.pool.delete_vector3(hitpos);
                        }
                        m4m.math.pool.delete_pickInfo(tempinfo);
                    }
                }
            }
            m4m.math.pool.delete_vector3Array(worldPosArr);
            return ishided;
        }

        /**
         * 交叉检测
         * @param LinePoints 线上的点
         * @param target 目标节点
         * @param outInfo 拾取到的信息
         * @returns 是交叉了？
         */
        private intersectCollider(LinePoints:m4m.math.vector3[],target:m4m.framework.transform, outInfo:m4m.framework.pickinfo): boolean
        {
            let ishided = false;
            let lastDistance = Number.MAX_VALUE;

            for(let i=0;i<LinePoints.length-1;i++)
            {
                let dir=new m4m.math.vector3();
                m4m.math.vec3Subtract(LinePoints[i+1],LinePoints[i],dir);
                let len=m4m.math.vec3Length(dir);
                m4m.math.vec3Normalize(dir,dir);
                let ray=new m4m.framework.ray(LinePoints[i],dir);
                let tempinfo=m4m.math.pool.new_pickInfo();
                let bool=ray.intersectCollider(target,tempinfo);
                if (bool)
                {
                    if(tempinfo.distance<=len)
                    {
                        let dist=m4m.math.vec3Distance(tempinfo.hitposition,LinePoints[0]);
                        if(dist<lastDistance)
                        {
                            ishided = true;
                            outInfo.cloneFrom(tempinfo);
                            outInfo.distance=dist;
                            lastDistance = dist;
                        }
                    }
                }
                m4m.math.pool.delete_pickInfo(tempinfo);
            }
            return ishided;
        }

        /**
         * 获取旋转角度
         * @param speed 速度
         * @param h 高
         * @param g 重力
         * @param target 目标点
         * @param forward 前方
         * @returns 旋转角度
         */
        private getRotAnlge(speed:number,h:number,g:number,target:m4m.math.vector3,forward:m4m.math.vector3):{rotx:number,roty:number,canReach:boolean}
        {
            let L=Math.sqrt(target.x*target.x+target.z*target.z);
            let a=0.5*g*L*L/(speed*speed);

            let sqrt=(h-a)/a+Math.pow(L/(2*a),2);
            if(sqrt>0)
            {
                let tana=Math.sqrt(sqrt)+L/(2*a);

                // let cosa=Math.sqrt(0.5*g*L*L/h+0.25*L*L/(h*h))-L*0.5/h;
                let _rotx=Math.atan(tana)*180/Math.PI;
                let _roty=this.fromToRotation(forward,target,m4m.math.pool.vector3_right);
                return {rotx:_rotx,roty:_roty,canReach:true}
            }else
            {
                let tana=L/(2*a);
                let _rotx=Math.atan(tana)*180/Math.PI;
                let _roty=this.fromToRotation(forward,target,m4m.math.pool.vector3_right);
                return {rotx:_rotx,roty:_roty,canReach:true}
            }

        }

        /**
         * a 到 b 的旋转
         * @param from a
         * @param to b
         * @param right r 
         * @returns 旋转
         */
        private fromToRotation(from:m4m.math.vector3,to:m4m.math.vector3,right:m4m.math.vector3):number
        {
            let dir1=m4m.math.pool.new_vector3();
            let dir2=m4m.math.pool.new_vector3();

            m4m.math.vec3Normalize(from,dir1);  
            m4m.math.vec3Normalize(to,dir2);

            let dot=m4m.math.vec3Dot(dir1,dir2);

            let dot2=m4m.math.vec3Dot(dir2,right);
            dot2=Math.acos(dot2)*180/Math.PI;
            if(dot2>90)
            {
                dot=-1*Math.acos(dot)*180/Math.PI;
            }else
            {
                dot=Math.acos(dot)*180/Math.PI;
            }

            return dot;
        }

    }

    @m4m.reflect.nodeComponent
    export class camCtr implements m4m.framework.INodeComponent
    {
        gameObject: m4m.framework.gameObject;
        type:string="camCtr";
        private _target:m4m.framework.transform;
        private _worldOffset:m4m.math.vector3;

        private _distance:number=0;
        private _offset:m4m.math.vector3=new m4m.math.vector3();
        private camrotAgnle:m4m.math.vector3=new m4m.math.vector3();
        /**
         * 设置目标
         * @param target 目标 
         * @param worldOffset 偏移
         */
        setTarget(target:m4m.framework.transform,worldOffset:m4m.math.vector3=null)
        {
            this._target=target;
            this._worldOffset=worldOffset;
        }
        /**
         * 设置旋转角
         * @param yanle 角度y
         * @param xangle 角度x
         */
        setRotAngle(yanle:number,xangle:number)
        {
            this.camrotAgnle.x=xangle;
            this.camrotAgnle.y=yanle;
        }

        /**
         * 设置目标的距离
         * @param distance 距离
         */
        setDistanceToTarget(distance:number)
        {
            this._distance=distance;
        }

        onPlay() {
            
        }
        start() {
            
        }
        private targetpos:m4m.math.vector3=new m4m.math.vector3();
        update(delta: number) {
            if(this._target==null)
            {
                m4m.math.quatFromEulerAngles(this.camrotAgnle.x,this.camrotAgnle.y,0,this.gameObject.transform.localRotate);
                this.gameObject.transform.markDirty();
            }else
            {
                m4m.math.quatFromEulerAngles(this.camrotAgnle.x,this.camrotAgnle.y,0,this.gameObject.transform.localRotate);
                m4m.math.quatTransformVector(this.gameObject.transform.localRotate,m4m.math.pool.vector3_forward,this._offset);
                m4m.math.vec3ScaleByNum(this._offset,this._distance,this._offset);

                if(this._worldOffset!=null)
                {
                    m4m.math.vec3Add(this._target.getWorldPosition(),this._worldOffset,this.targetpos);
                }else
                {
                    m4m.math.vec3Clone(this._target.getWorldPosition(),this.targetpos);
                }
                m4m.math.vec3Subtract(this.targetpos,this._offset,this.gameObject.transform.localPosition);
                this.gameObject.transform.markDirty();
            }
        }
        remove() {
            
        }
        clone() {
            
        }
    }
}