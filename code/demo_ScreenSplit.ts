
class demo_ScreenSplit implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    cameraCurseHover:number=0;

    windowRate:number=0.5;
    windowHorizon:boolean=true;
    mouseOver:boolean=false;
    mouseEnter:boolean=false;
    mouseDown:boolean=false;
    mouseMove:boolean=false;
    outcontainer:HTMLDivElement;

    start(app: m4m.framework.application) {
       
        this.app = app;
        this.inputMgr = this.app.getInputMgr();
        this.scene = this.app.getScene();
        Test_CameraController.instance().init(this.app);
        this.outcontainer=document.getElementById("drawarea") as HTMLDivElement;

        let cuber: m4m.framework.meshRenderer;
        console.warn("Finish it.");

        //添加一个盒子
        var cube = new m4m.framework.transform();
        cube.name = "cube";

        cube.localScale.x = 10;
        cube.localScale.y = 0.1;
        cube.localScale.z = 10;
        this.scene.addChild(cube);
        var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

        var smesh = this.app.getAssetMgr().getDefaultMesh("pyramid");
        mesh.mesh = (this.app.getAssetMgr().getDefaultMesh("cube"));
        var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        cube.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;

        cube.markDirty();
        cuber = renderer;

        this.cube = cube;

        {
            this.cube2 = new m4m.framework.transform();
            this.cube2.name = "cube2";
            this.scene.addChild(this.cube2);
            this.cube2.localScale.x = this.cube2.localScale.y = this.cube2.localScale.z = 1;
            this.cube2.localTranslate.x = -5;
            this.cube2.markDirty();
            var mesh = this.cube2.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            mesh.mesh = (smesh);
            var renderer = this.cube2.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            let coll = this.cube2.gameObject.addComponent("spherecollider") as m4m.framework.spherecollider;
            coll.center = new m4m.math.vector3(0, 1, 0);
            coll.radius = 1;

            //---------------------baocuo
            //this.cube2.gameObject.addComponent("frustumculling") as m4m.framework.frustumculling;
        }


        this.cube3 = this.cube2.clone();
        this.scene.addChild(this.cube3);
        {
            this.cube3 = new m4m.framework.transform();
            this.cube3.name = "cube3";
            this.scene.addChild(this.cube3);
            this.cube3.localScale.x = this.cube3.localScale.y = this.cube3.localScale.z = 1;
            this.cube3.localTranslate.x = -5;
            this.cube3.markDirty();
            var mesh = this.cube3.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            mesh.mesh = (smesh);
            var renderer = this.cube3.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            let coll = this.cube3.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
            coll.colliderVisible = true;
        }


        {
            this.cube4 = new m4m.framework.transform();
            this.cube4.name = "cube4";
            this.scene.addChild(this.cube4);
            this.cube4.localScale.x = this.cube4.localScale.y = this.cube4.localScale.z = 1;
            this.cube4.localTranslate.x = 5;
            this.cube4.markDirty();
            var mesh = this.cube4.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            mesh.mesh = (smesh);
            var renderer = this.cube4.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            let coll = this.cube4.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
            coll.colliderVisible = true;
        }
        //添加1号摄像机
        {
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 100;
            //this.camera.backgroundColor=new m4m.math.color(1,0,0,0);
            objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
            objCam.lookat(this.cube);
            this.camera.viewport = new m4m.math.rect(0, 0, 0.5, 1);
            console.log("this camera: "+this.camera.viewport);
            objCam.markDirty();//标记为需要刷新      
        }

        {
            //添加2号摄像机
            var objCam2 = new m4m.framework.transform();
            objCam2.name = "sth2.";
            this.scene.addChild(objCam2);
            var _camera = objCam2.gameObject.addComponent("camera") as m4m.framework.camera;
            
            _camera.near = 0.01;
            _camera.far = 100;
            _camera.clearOption_Color = false;  //因为以clearcolor，上一个camera就白画了，所以不能clear
            _camera.order=2;   //默认oder，order越大的camera就越在后边进行画

            objCam2.localTranslate = new m4m.math.vector3(0, 10, -10);
            objCam2.lookat(this.cube);
            _camera.viewport = new m4m.math.rect (0.5,0, 0.5, 1);
            objCam2.markDirty();//标记为需要刷新
            this.camera1=_camera;

            this.app.webgl.canvas.addEventListener("mousemove",(ev:MouseEvent)=>
            {
                let screenRect = this.outcontainer.getBoundingClientRect();

                let xRate=ev.clientX/screenRect.width;
                let yRate=ev.clientY/screenRect.height;

                console.log("ev.clintY  "+ev.clientY);  //跟浏览器上显示的像素值的匹配
                console.log("this.inputMgr.point.y "+this.inputMgr.point.y); //跟浏览器上显示的像素值不匹配

                if(this.windowHorizon)
                {
                    if(xRate<this.windowRate)
                    {
                        this.targetCamera=this.camera; 
                        this.cameraCurseHover=0;                  
                    } 
                    else
                    {
                        this.targetCamera=_camera;      
                        this.cameraCurseHover=1;             
                    }
                }
                else
                {
                    if(yRate<this.windowRate)
                    {
                        this.targetCamera=this.camera; 
                        this.cameraCurseHover=0;                  
                    } 
                    else
                    {
                        this.targetCamera=_camera;      
                        this.cameraCurseHover=1;             
                    }
                }
               
                Test_CameraController.instance().decideCam(this.targetCamera);               
            });         
        } 

        let boundRect = this.outcontainer.getBoundingClientRect();     //这个跟浏览器显示出来的边框像素是一致的
        console.log("this boundRect width and "+boundRect.width+"  "+boundRect.height) 
     
        {
            //添加分割线             
            var splitline=document.createElement("div");
            this.splitline=splitline;
            

            splitline.style.height= boundRect.height+"px";
            splitline.style.width="6px";
            splitline.style.position="absolute";
            splitline.style.top = "0px";
            splitline.style.left = boundRect.width/2-3+"px";
            splitline.style.zIndex="6";
            splitline.style.background="#cccccc";
            
            this.mouseEnter=false;
            this.mouseDown=false;
            this.mouseMove=false;
            this.mouseOver=false;
  
            splitline.onmouseenter=(e)=>
            {
                this.mouseEnter=true;
                if(this.windowHorizon)
                {
                    splitline.style.cursor="e-resize";
                }
                else
                {
                    splitline.style.cursor="n-resize";
                }
            }

            splitline.onmouseover=(e)=>
            {
                this.mouseOver=true;
            }
            
            splitline.onmouseleave=(e)=>
            {
                this.mouseOver=false;
            }
     
            this.app.container.addEventListener("mousedown",(e:MouseEvent)=>{
                if(this.mouseOver)
                this.mouseDown=true;
            },false);

            this.app.container.addEventListener("mouseup",(e:MouseEvent)=>{
                this.mouseDown=false;
                this.mouseEnter=false;
                this.mouseMove=false;  
            },false);           

            this.app.container.addEventListener("mousemove",(e:MouseEvent)=>{
                this.mouseMove=true;
                if(this.mouseEnter)
                {
                    if(this.mouseDown){                   
                        let screenRect = this.outcontainer.getBoundingClientRect();
    
                        let xRate=e.clientX/screenRect.width;   
                        let yRate=e.clientY/screenRect.height;//YRate 左下角是坐标原点
                        console.log("e.clientY Test"+ e.clientY);
    
                        if(this.windowHorizon)
                        {                       
                            this.splitline.style.left=e.clientX-3+ "px";                                  
                            this.windowRate=xRate;
                            this.camera.viewport=new m4m.math.rect(0,0,this.windowRate,1);
                            this.camera1.viewport=new m4m.math.rect(this.windowRate,0,1-this.windowRate,1);         
                            this.splitline.style.cursor="e-resize";                  
                        }
                        else
                        { 
                            splitline.style.top=e.clientY-3+"px";                                 
                            this.windowRate=yRate;

                            // this.camera.viewport=new m4m.math.rect(0,1-this.windowRate,1,this.windowRate);
                            // this.camera1.viewport=new m4m.math.rect(0,0,1,1-this.windowRate);   

                            this.camera.viewport=new m4m.math.rect(0,1-this.windowRate,1,this.windowRate);
                            this.camera1.viewport=new m4m.math.rect(0,0,1,1-this.windowRate);   
                            this.splitline.style.cursor="n-resize";      
                        }
                    }
                }
              
            },false);        
            
            this.app.container.appendChild(splitline);
        }

        {   
            //添加button
            var button1=document.createElement("button");
            button1.textContent="横屏/竖屏";
            button1.onclick=(e)=>
            {
                let screenRect = this.outcontainer.getBoundingClientRect();

                this.windowHorizon= this.windowHorizon?false:true;
                if(this.windowHorizon)
                {
                    this.splitline.style.height= screenRect.height+"px";
                    this.splitline.style.width="6px"; 
                   
                    this.splitline.style.left=screenRect.width*this.windowRate-3+ "px";    
                    this.splitline.style.top="0px";

                    this.camera.viewport=new m4m.math.rect(0,0,this.windowRate,1);
                    this.camera1.viewport=new m4m.math.rect(this.windowRate,0,1-this.windowRate,1);   
                }
                else
                {          
                    this.splitline.style.height= "6px";
                    this.splitline.style.width=screenRect.width+"px";           

                    this.splitline.style.left="0px";
                    splitline.style.top=screenRect.height*this.windowRate-3+"px";     
                    
                    this.camera.viewport=new m4m.math.rect(0,1-this.windowRate,1,this.windowRate);
                    this.camera1.viewport=new m4m.math.rect(0,0,1,1-this.windowRate);   

                    // this.camera.viewport=new m4m.math.rect(0,1-this.windowRate,1,this.windowRate);
                    // this.camera1.viewport=new m4m.math.rect(0,0,1,1-this.windowRate);   
                }
            };
            button1.style.top="130px";    
            button1.style.position = "absolute";
            this.app.container.appendChild(button1);
        }

this.cube.localTranslate
    }
    
    camera: m4m.framework.camera;
    camera1:m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    cube4: m4m.framework.transform;
    timer: number = 0;
    movetarget: m4m.math.vector3 = new m4m.math.vector3();
    targetCamera:m4m.framework.camera;
    inputMgr: m4m.framework.inputMgr;
    pointDown: boolean = false;
    splitline:HTMLDivElement;

   

    update(delta: number) {

        Test_CameraController.instance().update(delta);

        let screenRect = this.outcontainer.getBoundingClientRect();
        
        if (this.pointDown == false && this.inputMgr.point.touch == true)//pointdown
        {
            var ray:m4m.framework.ray;
            if(this.windowHorizon)
            {
                if(this.cameraCurseHover==0)
                {
                    ray = this.targetCamera.creatRayByScreen(new m4m.math.vector2(this.inputMgr.point.x, this.inputMgr.point.y), this.app);
                }
                else if(this.cameraCurseHover==1)
                {
                    ray = this.targetCamera.creatRayByScreen(new m4m.math.vector2(this.inputMgr.point.x-this.app.webgl.canvas.width *this.windowRate, this.inputMgr.point.y), this.app);
                }
            }
            else
            {
                if(this.cameraCurseHover==0)
                {
                   //第二种，左上角原点 createByscren 
                    ray = this.targetCamera.creatRayByScreen(new m4m.math.vector2(this.inputMgr.point.x, this.inputMgr.point.y), this.app);
                }
                else if(this.cameraCurseHover==1)
                {
                 //第二种，左上角原点
                    ray = this.targetCamera.creatRayByScreen(new m4m.math.vector2(this.inputMgr.point.x, this.inputMgr.point.y-this.app.webgl.canvas.height *this.windowRate), this.app);
                }
            }

            console.log("inputMgr.point: "+new m4m.math.vector2(this.inputMgr.point.x, this.inputMgr.point.y));
            let tempinfo = m4m.math.pool.new_pickInfo();
            var bool = this.scene.pick(ray,tempinfo);
            if (bool) {
                m4m.math.vec3Clone(tempinfo.hitposition,this.movetarget);
                this.timer = 0;
            }   
            m4m.math.pool.delete_pickInfo(tempinfo);
        }
        this.pointDown = this.inputMgr.point.touch;

        var tv = new m4m.math.vector3();
        //m4m.math.vec3SLerp(this.cube2.localTranslate, this.movetarget, this.timer, this.cube2.localTranslate);
        this.cube2.localTranslate = this.movetarget;
        this.cube2.markDirty();

        if ((this.cube3.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider).intersectsTransform(this.cube4)) {
            return;
        }
        this.timer += delta;
        this.cube3.localTranslate.x += delta;
        this.cube3.markDirty();
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        // var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate.x += delta;
        // objCam.markDirty();

        var tv = new m4m.math.vector3();
        m4m.math.vec3SLerp(this.cube2.localTranslate, this.movetarget, this.timer, this.cube2.localTranslate);
        //this.cube2.localTranslate = this.movetarget;
        this.cube2.markDirty();

    }
}