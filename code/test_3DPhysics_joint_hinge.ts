/** 
 * 3d物理 铰链关节 joint hinge
 */
class test_3DPhysics_joint_hinge implements IState {
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
    /**
     * 初始化
     */
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
        trans2.localScale.z = 2;
        trans2.localScale.y = 3;
        this.scene.addChild(trans2);
        let mr = physics3dDemoTool.attachMesh(trans2 , mat_activated ,"cube");

        //sphere
        let trans3=new m4m.framework.transform();
        trans3.name = "sphere";
        trans3.localPosition.y = 8;
        trans3.localPosition.x = -3;
        this.scene.addChild(trans3);
        let mr1 = physics3dDemoTool.attachMesh(trans3 , mat_activated ,"sphere");

        //cylinder
        let cylinder_mid =new m4m.framework.transform();
        cylinder_mid.name = "cylinder"
        cylinder_mid.localPosition.y = 8;
        this.scene.addChild(cylinder_mid);
        physics3dDemoTool.attachMesh(cylinder_mid , mat_stick ,"cylinder");

        //初始化 物理世界-----------------------
        this.scene.enablePhysics(new m4m.math.vector3(0,0,0),new m4m.framework.OimoJSPlugin());
        // let boxImpostor = new m4m.framework.PhysicsImpostor(trans2, m4m.framework.ImpostorType.BoxImpostor, { mass: 1, restitution: 0.6 ,friction: 0.5});
        let boxImpostor = new m4m.framework.PhysicsImpostor(trans2, m4m.framework.ImpostorType.BoxImpostor, { mass: 2 });
        let sphereImpostor = new m4m.framework.PhysicsImpostor(trans3, m4m.framework.ImpostorType.SphereImpostor, { mass: 0.5, restitution: 0.6 ,friction: 0.5});
        let cylinderImpostor = new m4m.framework.PhysicsImpostor(cylinder_mid, m4m.framework.ImpostorType.CylinderImpostor, { mass: 0 ,friction:0.5});

        this.mrs.push(mr,mr1);


        //Add Joint
        let jointData = {
            mainPivot: new m4m.math.vector3(0, 0, 0),
            connectedPivot: new m4m.math.vector3(0, -2, 0),
            mainAxis: new m4m.math.vector3(0, 0, 1),
            connectedAxis: new m4m.math.vector3(0, 0, 0),
            nativeParams: {}
            };

        let phyJ = m4m.framework.PhysicsJoint;
        let joint1 = new phyJ(phyJ.HingeJoint,jointData);
        // let joint1 = new m4m.framework.HingeJoint({
        //     mainPivot: new m4m.math.vector3(0, 0, 0),
        //     connectedPivot: new m4m.math.vector3(0, -2, 0),
        //     mainAxis: new m4m.math.vector3(0, 0, 1),
        //     connectedAxis: new m4m.math.vector3(0, 0, 0),
        //     nativeParams: {
        //     }
        // });
        cylinderImpostor.addJoint(boxImpostor , joint1);

        //圆柱朝向
        m4m.math.quatFromEulerAngles(90,0,0,cylinder_mid.localRotate);

        //GUI
        this.setGUI();
    }

    private guiMsg = "铰链关节测试demo hinge";
    /**
     * 设置 调试GUI 
     */
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

    /**
     * 重置demo物理状态
     */
    private applyReset(){
        physics3dDemoTool.resetObj(this.mrs);
    }

    /**
     * 对目标施加冲量
     */
    private impulseBox(){
        this.doImpulse(this.boxTran.physicsImpostor);
    }

    private force = new m4m.math.vector3(-50,0,0);
    private contactlocalPoint = new m4m.math.vector3(0,0,0);
    private tempV3 = new m4m.math.vector3();
    /**
     * 标施加冲量
     * @param phyImpostor 物理代理
     */
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