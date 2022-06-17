namespace t {
    export class test_pathAsset implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        start(app: m4m.framework.application) {
            this.app = app;
            this.scene = this.app.getScene();

            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadTexture.bind(this));
            this.taskmgr.addTaskCall(this.loadpath.bind(this));
            this.taskmgr.addTaskCall(this.loadasset.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            this.taskmgr.addTaskCall(this.addbtns.bind(this));
        }
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }

        private loadTexture(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            var texnumber:number=2;
            this.app.getAssetMgr().load("res/rock256.png", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    texnumber--;
                    if(texnumber==0)
                    {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            }
            );
            this.app.getAssetMgr().load("res/sd_hlb_1.png", m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    texnumber--;
                    if(texnumber==0)
                    {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            }
            );
        }

        private loadpath(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
        {
           var pathnumber:number=2;
            this.app.getAssetMgr().load("res/path/circlepath.path.json",m4m.framework.AssetTypeEnum.Auto,(s)=>{
                if (s.isfinish) {
                    pathnumber--;
                    if(pathnumber==0)
                    {
                        state.finish = true;                        
                    }
                }
                else {
                    state.error = true;
                }
            });
                 this.app.getAssetMgr().load("res/path/circlepath_2.path.json",m4m.framework.AssetTypeEnum.Auto,(s)=>{
                if (s.isfinish) {
                    pathnumber--;
                    if(pathnumber==0)
                    {
                        state.finish = true;                        
                    }
                }
                else {
                    state.error = true;
                }
            })
        }
        private loadasset(laststate:m4m.framework.taskstate,state:m4m.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/prefabs/rotatedLongTou/rotatedLongTou.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }
        sh: m4m.framework.shader;
        private initscene(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            var objCam = new m4m.framework.transform();
            objCam.name = "cam_show";
            this.scene.addChild(objCam);
            this.showcamera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.showcamera.order = 0;
            this.showcamera.near = 0.01;
            this.showcamera.far = 1000;
            objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();

            var mat=DBgetMat("rock256.png");
            var trans=DBgetAtrans(mat);
            this.scene.addChild(trans);
            trans.localScale.y=0.1;
            trans.localScale.x=trans.localScale.z=40;
            trans.localTranslate.y=-1;
            trans.markDirty();
            //-----------------------------------------资源----------------------------------------------------------------------
            var longtouprefab=this.app.getAssetMgr().getAssetByName("rotatedLongTou.prefab.json")as m4m.framework.prefab;
            var path=this.app.getAssetMgr().getAssetByName("circlepath.path.json")as m4m.framework.pathasset;
            var path2=this.app.getAssetMgr().getAssetByName("circlepath_2.path.json")as m4m.framework.pathasset;
            //--------------------------------------------------------------------------------------------------------------
            {
                for(var i=0;i<3;i++)
                {
                    var parent=new m4m.framework.transform();
                    parent.gameObject.visible=false;
                    this.scene.addChild(parent);
                    this.parentlist.push(parent);
                    
                    //------------------龙头----------------------------
                    let head=longtouprefab.getCloneTrans();
                    head.localScale.x=head.localScale.y=head.localScale.z=4;
                    parent.addChild(head);
                    this.dragonlist.push(head);
                    var guidp=head.gameObject.addComponent("guidpath")as m4m.framework.guidpath;
                    this.guippaths.push(guidp);

                    //-----------------挂拖尾---------------------------------
                    var trans=new m4m.framework.transform();
                    head.addChild(trans);
                    var trailmat=new m4m.framework.material();
                    //transparent_bothside.shader.json
                    //particles_blend.shader.json
                    var shader=this.app.getAssetMgr().getShader("particles_blend.shader.json");

                    var tex1=this.app.getAssetMgr().getAssetByName("sd_hlb_1.png")as m4m.framework.texture;
                    trailmat.setShader(shader);
                    trailmat.setTexture("_MainTex",tex1);

                    var trailrender=trans.gameObject.addComponent("trailRender")as m4m.framework.trailRender;
                    this.traillist.push(trailrender);
                    trailrender.material=trailmat;
                    trailrender.setWidth(1.0);//调整拖尾宽度
                    trailrender.lookAtCamera=true;
                    trailrender.extenedOneSide=false;
                    trailrender.setspeed(0.25);//拖尾长度，越小越长
                    //--------------开关拖尾---------------------
                    //trailrender.play();

                    //this.trailrender.stop();
                }
                //------------------------------设置路径--------------------------------------------
                this.guippaths[0].setpathasset(path2,50,()=>{
                    //this.parentlist[0].gameObject.visible=false;
                    //this.traillist[0].stop();
                });
                this.guippaths[1].setpathasset(path,50,()=>{
                    this.parentlist[1].gameObject.visible=false;
                    //this.traillist[1].stop();
                });
                this.guippaths[2].setpathasset(path2,50,()=>{
                    //this.parentlist[2].gameObject.visible=false;
                    //this.traillist[2].stop();
                });

            // {
            //     this.parentlist[0].gameObject.visible=true;
            //     var guidp=this.dragonlist[0].gameObject.addComponent("guidpath")as m4m.framework.guidpath;
            //     guidp.setpathasset(path2,50,()=>{
            //         this.parentlist[0].gameObject.visible=false;
            //         this.traillist[0].stop();
            //     });
            //     this.guippaths.push(guidp);
            //     //guidp.play();
            // }
            // {
            //     //---------------在非loop情况下，如果设置了委托，在引导走完后就执行oncomplete---------------------------------------------------------
            //     this.parentlist[1].gameObject.visible=true;
            //     this.parentlist[1].localTranslate.x=-5;
            //     this.parentlist[1].markDirty();
            //     var guidp=this.dragonlist[1].gameObject.addComponent("guidpath")as m4m.framework.guidpath;
            //     guidp.setpathasset(path,50,()=>{
            //         this.parentlist[1].gameObject.visible=false;
            //         this.traillist[1].stop();
            //     });
            //     this.guippaths.push(guidp);
            //     //guidp.play();

            // }
            // {
            //     this.parentlist[2].gameObject.visible=true;
            //     m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up,180,this.parentlist[2].localRotate);
            //     this.parentlist[2].markDirty();
            //     var guidp=this.dragonlist[2].gameObject.addComponent("guidpath")as m4m.framework.guidpath;
            //     guidp.setpathasset(path2,50,()=>{
            //         this.parentlist[2].gameObject.visible=false;
            //         this.traillist[2].stop();
            //     });
            //     guidp.play(2);
            //     this.guippaths.push(guidp);
            // }
            }
            state.finish = true;
        }
        private parentlist:m4m.framework.transform[]=[];
        private dragonlist:m4m.framework.transform[]=[];
        private traillist:m4m.framework.trailRender[]=[];
        private guippaths:m4m.framework.guidpath[]=[];
        private path:m4m.framework.pathasset;
        private showcamera: m4m.framework.camera;

        target: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
        angle: number;
        timer: number=0;

        update(delta: number) {
            this.taskmgr.move(delta);
        }

        private addbtns()
        {
            this.addBtn("play",10,100,()=>{

                for(var i=0;i<this.parentlist.length;i++)
                {
                    this.parentlist[i].gameObject.visible=true;
                }

                for(let i=0;i<this.traillist.length;i++)
                {
                    this.traillist[i].play();
                }
                this.guippaths[0].play(2);
                this.guippaths[1].play();
                this.guippaths[2].play(2);
                
            })
            this.addBtn("stop",10,200,()=>{
                for(var i=0;i<this.parentlist.length;i++)
                {
                    this.parentlist[i].gameObject.visible=false;
                }
                for(let i=0;i<this.guippaths.length;i++)
                {
                    this.traillist[i].stop();
                    this.guippaths[i].stop();
                }
            })
        }
                         

        private addBtn(text: string,x:number,y:number,func: () => void)
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
    }

    export function DBgetAtrans(mat:m4m.framework.material,meshname:string=null):m4m.framework.transform
    {
        var trans=new m4m.framework.transform();
        var meshf=trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHFILTER)as m4m.framework.meshFilter;
        var meshr=trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHRENDER)as m4m.framework.meshRenderer;
        meshr.materials=[];
        meshr.materials.push(mat);

        if(meshname==null)
        {
            var mesh=m4m.framework.sceneMgr.app.getAssetMgr().getDefaultMesh("cube");
            meshf.mesh=mesh;
        }
        else
        {
            var mesh=m4m.framework.sceneMgr.app.getAssetMgr().getAssetByName(meshname)as m4m.framework.mesh;
            meshf.mesh=mesh;
        }
        return trans;
    }
    export function DBgetMat(texname:string=null,shaderstring:string=null):m4m.framework.material
    {
        var mat=new m4m.framework.material();
        if(shaderstring==null)
        {
            shaderstring="diffuse.shader.json";
        }
        var shader=m4m.framework.sceneMgr.app.getAssetMgr().getShader(shaderstring);
        mat.setShader(shader);
        if(texname!=null)
        {
            var tex=m4m.framework.sceneMgr.app.getAssetMgr().getAssetByName(texname)as m4m.framework.texture;
            mat.setTexture("_MainTex",tex);
        }
        return mat;
    }
    
}