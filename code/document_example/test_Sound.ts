
class test_Sound implements IState
{
    app:m4m.framework.application;
    scene:m4m.framework.scene;
    taskmgr:m4m.framework.taskMgr=new m4m.framework.taskMgr();
    camera:m4m.framework.camera;
    cube:m4m.framework.transform;
    time:number=0;

    private loadShader(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json",m4m.framework.AssetTypeEnum.Auto,(_state)=>
        {
            if(_state.isfinish)
            {   
                state.finish=true;
            }
            else
            {
                state.error=true;
            }
        }
        );
    }
    
    private loadTexture(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {   
        this.app.getAssetMgr().load("res/zg256.png",m4m.framework.AssetTypeEnum.Auto,(_state)=>
        {
            if(_state.isfinish)
            {
                state.finish=true;
            }
            else
            {
                state.error=true;
            }
        }
        );
    }

    private addCam(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {
        var objCam=new m4m.framework.transform();
        objCam.name="Main Camera";
        this.scene.addChild(objCam);
        this.camera=objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near=0.01;
        this.camera.far=100;
        objCam.localTranslate=new m4m.math.vector3(0,0,-10);
        objCam.lookat(this.cube);
        objCam.markDirty();   

        state.finish=true;
    }

    private addCube(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {
        var objCube=new m4m.framework.transform();
        objCube.name="Cube";
        this.scene.addChild(objCube);
        objCube.localScale.x=objCube.localScale.y=objCube.localScale.z=1;
        objCube.localTranslate=new m4m.math.vector3(0,0,0);

        var mesh=objCube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        var smesh=this.app.getAssetMgr().getDefaultMesh("cube");
        mesh.mesh=(smesh);
        var render=objCube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        var sh=this.app.getAssetMgr().getShader("diffuse.shader.json");
        if(sh!=null)
        {
            render.materials=[];
            render.materials.push(new m4m.framework.material());
            render.materials[0].setShader(sh);
            let texture0=this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
            render.materials[0].setTexture("_MainTex",texture0);
        }

        this.cube=objCube;    
        this.cube.markDirty();   
        state.finish=true;
    }

    private addBtnLoadSound(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {

    }

    start(app:m4m.framework.application)
    {
        this.app=app;
        this.scene=this.app.getScene();

        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.addCube.bind(this));
        this.taskmgr.addTaskCall(this.addCam.bind(this));
        
    }


    update(delta:number)
    {
        this.taskmgr.move(delta);
        this.time+= delta;

        if(this.cube!=null)
        {

            var cubeTrans=this.cube.gameObject.transform;
            let yRoate=(this.time*30)%360;
            let yQuaternion=m4m.math.pool.new_quaternion();

            m4m.math.quatFromEulerAngles(0,yRoate,0,yQuaternion);
            cubeTrans.localRotate=yQuaternion;
            cubeTrans.markDirty();
            console.log(this.time);
        }     
    }
}