///// <reference path="../lib/gl-matrix.d.ts" />
//import * as glMatrix from 'gl-matrix'

namespace dome{
    export class testCJ implements IState
    {


        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if(s.isfinish)
                {
                    state.finish = true;
                }
            });
        }
        // testmat:m4m.framework.material;
        // private loadmat(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        // {
            
        // }

        // private loadLongPrefab(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        // {
            //     this.app.getAssetMgr().load("res/prefabs/zs_chuangjue_02/resources/MU1.0----1.9_TeXiao_Guoyichen_Effect_Mesh_Plane_danxiangsuofang_01.FBX_Plane01.mesh.bin", m4m.framework.AssetTypeEnum.Auto, (s) =>
            //     {
                //         if (s.isfinish)
                //         {
                    
                    
                    //         }
                    //     });
                    // }
                    
        dragon:m4m.framework.transform;
        cameraPoint:m4m.framework.transform;
        private loadmesh(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            var name="zs_chuangjue_01";
            //name="Sphere";
            name="gs_chuangjue_01";
            name="0000_fs_female_1024";
            this.app.getAssetMgr().load("res/prefabs/"+name+"/"+name+".assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(name+".prefab.json") as m4m.framework.prefab;
                    this.dragon= _prefab.getCloneTrans();
                    this.dragon.localEulerAngles=new m4m.math.vector3(0,-180,0);
                    this.scene.addChild(this.dragon);
                    this.dragon.markDirty();

                    this.cameraPoint=this.dragon.find("Camera001");
                    state.finish = true;
                    
                }
            });
        }
        private loadweapon(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            var name="Quad";//Bip01Prop1/
            this.app.getAssetMgr().load("res/prefabs/Quad/Quad.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName("Quad.prefab.json") as m4m.framework.prefab;
                    var pp= _prefab.getCloneTrans();
                    pp.localTranslate=new m4m.math.vector3();
                    pp.localEulerAngles=new m4m.math.vector3();
                    //this.dragon.localEulerAngles=new m4m.math.vector3(0,90,0);
                    this.scene.addChild(pp);
                    //this.dragon.markDirty();

                    state.finish = true;
                    
                }
            });
        }
        private test(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            this.dragon=new m4m.framework.transform();
            //this.dragon.localEulerAngles=new m4m.math.vector3(0,90,0);
            var mesh=this.assetMgr.getAssetByName("MU1.0----1.9_TeXiao_Guoyichen_Effect_Mesh_Plane_danxiangsuofang_01.FBX_Plane01.mesh.bin") as m4m.framework.mesh;
            //var mesh=this.assetMgr.getDefaultMesh("quad");
            var mat=this.assetMgr.getAssetByName("WuQi_zhenhong_02.mat.json") as m4m.framework.material;
            var shder=this.assetMgr.getAssetByName("diffuse_bothside.shader.json") as m4m.framework.shader;
            var mattt=new m4m.framework.material();
            mattt.setShader(shder);
            
            var meshf=this.dragon.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHFILTER) as m4m.framework.meshFilter;
            meshf.mesh=mesh;
            var meshr=this.dragon.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHRENDER) as m4m.framework.meshRenderer;
            meshr.materials[0]=mat;
            this.dragon.localScale=new m4m.math.vector3(13,41,21);
            this.dragon.markDirty();
            this.scene.addChild(this.dragon);
            
            state.finish = true;
        }
        camera:m4m.framework.camera;
        private addCamera(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate)
        {
            var tranCam = new m4m.framework.transform();
            tranCam.name = "Cam";
            this.scene.addChild(tranCam);
            //tranCam.localEulerAngles = new m4m.math.vector3(0, -75,-5);
            tranCam.localTranslate =new m4m.math.vector3(0,0,-3);
            this.camera = tranCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.001;
            this.camera.far = 1000;
            this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3);
            // tranCam.lookatPoint(new m4m.math.vector3(0,0,0));
            tranCam.markDirty();
            state.finish = true;
        }

        app:m4m.framework.application;
        scene:m4m.framework.scene;
        taskmgr:m4m.framework.taskMgr;
        assetMgr:m4m.framework.assetMgr;
        start(app: m4m.framework.application) 
        {
            this.app=app;
            this.scene=this.app.getScene();
            this.assetMgr=this.app.getAssetMgr();
            this.taskmgr=new m4m.framework.taskMgr();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.addCamera.bind(this));
            this.taskmgr.addTaskCall(this.loadweapon.bind(this));
            //this.taskmgr.addTaskCall(this.loadmesh.bind(this));            
            //  this.taskmgr.addTaskCall(this.test.bind(this));
            

        }


        trans:m4m.framework.transform;
        time:number=0;
        update(delta: number) {

            this.taskmgr.move(delta);

            // if(this.dragon&&this.camera)
            // {
            //     this.camera.gameObject.transform.lookat(this.dragon);
            // }
            // if(this.cameraPoint)
            // {
            //     this.cameraPoint.addChild(this.camera.gameObject.transform);
            //     this.camera.gameObject.transform.localEulerAngles=new m4m.math.vector3(0,270,0);
            //     this.camera.gameObject.transform.markDirty();
            // }

        }

    }
}