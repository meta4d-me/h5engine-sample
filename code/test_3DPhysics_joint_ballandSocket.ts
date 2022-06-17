/** 
 * 3d物理 球嵌套关节 joint ballandSocket
 */
class test_3DPhysics_joint_ballandSocket implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    astMgr : m4m.framework.assetMgr;
    mrs : m4m.framework.meshRenderer[] = [];
    iptMgr : m4m.framework.inputMgr;
    async start  (app: m4m.framework.application) {
        await physics3dDemoTool.init(app);
        this.app = app;
        this.scene = physics3dDemoTool.scene;
        this.astMgr = physics3dDemoTool.astMgr;
        this.iptMgr = physics3dDemoTool.iptMgr;
        this.camera = physics3dDemoTool.camera;
        this.init();
        return null;
    }

    private boxTran : m4m.framework.transform;
    init(){
        let mat_activated = physics3dDemoTool.mats["activated"];
        let mat_sleeping = physics3dDemoTool.mats["sleeping"];
        let mat_stick = physics3dDemoTool.mats["uvTest"];
        //构建物体-------------------
        // //底面
        // let trans=new m4m.framework.transform();
        // trans.localScale.x= 20;
        // trans.localScale.y= 0.01;
        // trans.localScale.z= 20;
        // this.scene.addChild(trans);
        // let mf=trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHFILTER) as m4m.framework.meshFilter;
        // let mr=trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHRENDER) as m4m.framework.meshRenderer;
        // mr.materials[0] = mat_floor;
        // mf.mesh=this.astMgr.getDefaultMesh("cube");

        //box
        let trans2=new m4m.framework.transform();
        this.boxTran = trans2;
        trans2.name = "box"
        trans2.localPosition.y=5;
        trans2.localPosition.x= -0.3;
        trans2.localPosition.z=0.3;
        trans2.localScale.y = 3;
        this.scene.addChild(trans2);
        let mr = physics3dDemoTool.attachMesh(trans2 , mat_activated ,"cube");

        //sphere
        let trans3=new m4m.framework.transform();
        trans3.name = "sphere";
        trans3.localPosition.y = 8;
        trans3.localPosition.x = -3;
        m4m.math.vec3SetAll(trans3.localScale,0.5);
        this.scene.addChild(trans3);
        let mr1 = physics3dDemoTool.attachMesh(trans3 , mat_activated ,"sphere");

        //sphere mid
        let mid_sphere =new m4m.framework.transform();
        mid_sphere.name = "sphere_1"
        mid_sphere.localPosition.y = 8;
        m4m.math.vec3SetAll(mid_sphere.localScale,0.5);
        this.scene.addChild(mid_sphere);
        physics3dDemoTool.attachMesh(mid_sphere , mat_stick ,"sphere");

        //初始化 物理世界-----------------------
        this.scene.enablePhysics(new m4m.math.vector3(0,0,0),new m4m.framework.OimoJSPlugin());
        // let boxImpostor = new m4m.framework.PhysicsImpostor(trans2, m4m.framework.ImpostorType.BoxImpostor, { mass: 1, restitution: 0.6 ,friction: 0.5});
        let boxImpostor = new m4m.framework.PhysicsImpostor(trans2, m4m.framework.ImpostorType.BoxImpostor, { mass: 2 });
        let sphereImpostor = new m4m.framework.PhysicsImpostor(trans3, m4m.framework.ImpostorType.SphereImpostor, { mass: 0.5, restitution: 0.6 ,friction: 0.5});
        let cylinderImpostor = new m4m.framework.PhysicsImpostor(mid_sphere, m4m.framework.ImpostorType.CylinderImpostor, { mass: 0 ,friction:0.5});

        this.mrs.push(mr,mr1);

        //Add Joint
        let phyJ = m4m.framework.PhysicsJoint;
        let joint1 = new phyJ(phyJ.BallAndSocketJoint,{
            mainPivot:  new m4m.math.vector3(0, 0, 0),
            connectedPivot:new m4m.math.vector3(0, -2, 0),
        });
        cylinderImpostor.addJoint(boxImpostor , joint1);

        //GUI
        this.setGUI();
    }

    private guiMsg = "球嵌套关节测试demo ballandSocket";
    setGUI(){
        if(!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'guiMsg');
        //force
        let folderF = gui.addFolder("force (冲量)");
        let limitf = 100;
        folderF.add(this.force, 'x', -limitf, limitf);
        folderF.add(this.force, 'y', -limitf, limitf);
        folderF.add(this.force, 'z', -limitf, limitf);
        let folderC = gui.addFolder("contactPoint (施加点)");
        let limitc = 3;
        folderC.add(this.contactlocalPoint, 'x', -limitc, limitc);
        folderC.add(this.contactlocalPoint, 'y', -limitc, limitc);
        folderC.add(this.contactlocalPoint, 'z', -limitc, limitc);
        let folderFun = gui.addFolder("触发方法");
        folderFun.open();
        folderFun.add(this, 'impulseBox' );
        folderFun.add(this, 'applyReset' );
    }

    //重置
    private applyReset(){
        physics3dDemoTool.resetObj(this.mrs);
    }

    private impulseBox(){
        this.doImpulse(this.boxTran.physicsImpostor);
    }

    private force = new m4m.math.vector3(-50,0,-3);
    private contactlocalPoint = new m4m.math.vector3(0,0,0);
    private tempV3 = new m4m.math.vector3();
    private doImpulse(phyImpostor : m4m.framework.PhysicsImpostor){
        let pos = this.tempV3;
        m4m.math.vec3Add(phyImpostor.object.getWorldPosition(),this.contactlocalPoint,pos);
        phyImpostor.applyImpulse(this.force, pos);
    }

    private tcount = 0;
    private time = 0.5;
    update(delta: number) {
        this.tcount += delta;
        if(this.tcount > this.time){
            physics3dDemoTool.ckBodySleeped(this.mrs);
            this.tcount = 0;
        }

    }
}