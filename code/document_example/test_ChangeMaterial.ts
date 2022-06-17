class test_ChangeMaterial implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    cube: m4m.framework.transform;
    camera: m4m.framework.camera;
    isCube: boolean = false;
    timer:number=0;
    material1:m4m.framework.material=new m4m.framework.material();
    material2:m4m.framework.material=new m4m.framework.material();

    taskmgr:m4m.framework.taskMgr=new m4m.framework.taskMgr();

    private loadShader(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {
        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json",m4m.framework.AssetTypeEnum.Auto,(s)=>
        {
            if(s.isfinish)
            {
               state.finish=true;              
            }
        });
    }

    private loadTexture(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {
        let c=0;
        c++;
        this.app.getAssetMgr().load("res/zg256.png",m4m.framework.AssetTypeEnum.Auto,(s)=>
        {
            if(s.isfinish)
            {
                c--;
                if(c==0)
                {
                    state.finish=true;
                }
            }
            else
            {
                state.error=true;
            }
        }
        );

        c++;
        this.app.getAssetMgr().load("res/map_normal.png",m4m.framework.AssetTypeEnum.Auto,(s)=>
        {
            if(s.isfinish)
            {
                c--;
                if(c==0)
                {
                    state.finish=true;
                }
            }
        }
        );
    }


    private addCam(laststate:m4m.framework.taskstate, state:m4m.framework.taskstate)
    {
        //添加一个相机
        var objCam=new m4m.framework.transform;
        objCam.name="Camera";
        this.scene.addChild(objCam);
        this.camera=objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near=0.01;
        this.camera.far=100;
        objCam.localTranslate= new m4m.math.vector3(0,10,-10);
        objCam.lookat(this.cube);
        objCam.markDirty();
        console.log("add camera");
        state.finish=true;
    }

    private addCube(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {
         //添加一个Cube
         var cube = new m4m.framework.transform();
         cube.name = "Cube1";
         cube.localScale.x = cube.localScale.y = cube.localScale.z = 2;
         this.scene.addChild(cube);
         var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
         mesh.mesh = (this.app.getAssetMgr()).getDefaultMesh("cube");
         cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;         
         this.cube = cube;
         cube.markDirty();
         console.log("add cube");
         state.finish=true;
    }

    isMaterial1:boolean=false;

    private addBtn()
    {
        //创建一个button，控制material的切换
        var btn1 = document.createElement("button");
        btn1.textContent = "button1 更换material";
        btn1.onclick = () =>
        {
            let renderer=this.cube.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
           
            if(renderer!=null)
            {
                renderer.materials=[];
                renderer.materials.push(new m4m.framework.material());
                if(this.isMaterial1)
                {
                    renderer.materials[0]=this.material2;    
                    this.isMaterial1=false;
                }
                else
                {
                    renderer.materials[0]=this.material1;     
                    this.isMaterial1=true;
                }
            }    
        }
        btn1.style.top = "128px";
        btn1.style.position = "absolute";
        this.app.container.appendChild(btn1);       
    }


    private setMaterial(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
    {
        let shader1=this.app.getAssetMgr().getShader("diffuse.shader.json");
        if(shader1!=null)
        {
            this.material1.setShader(shader1);
            let texture1=this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
            this.material1.setTexture("_MainTex",texture1);

            this.material2.setShader(shader1);
            let texture2=this.app.getAssetMgr().getAssetByName("map_normal.png") as m4m.framework.texture;
            this.material2.setTexture("_MainTex",texture2);
        }        
        
        state.finish=true;
    }

  
    start(app: m4m.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();        
        //任务排队执行系统        
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.setMaterial.bind(this));
        this.taskmgr.addTaskCall(this.addCube.bind(this));
        this.taskmgr.addTaskCall(this.addCam.bind(this));
        
        this.addBtn();
    }

    zeroPoint=new m4m.math.vector3(0,0,0);

    update(delta: number)
    {
        this.taskmgr.move(delta);

        this.timer += delta;
        if(this.cube!=null)
        {
            //旋转方式一：相机旋转         
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if(this.camera!=null)
            {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new m4m.math.vector3(x2 * 10, 4, -z2 * 10);
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            }

            // //旋转方式二：cube自转
            // let yValue=(this.timer*30)%360;
            // let yRotate=new m4m.math.quaternion();
            // m4m.math.quatFromEulerAngles(0,yValue,0,yRotate);
            // this.cube.localRotate=yRotate;
            // this.cube.markDirty();

        }
    }

}

