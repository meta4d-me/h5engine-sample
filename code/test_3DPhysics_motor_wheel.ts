/** 
 * 3d物理 车轮马达 motor wheel(hinge2)
 */
class test_3DPhysics_motor_wheel implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr : m4m.framework.assetMgr;
    mrs : m4m.framework.meshRenderer[] = [];
    iptMgr : m4m.framework.inputMgr;
    async start  (app: m4m.framework.application) {
        await physics3dDemoTool.init(app);
        this.app = app;
        this.scene = physics3dDemoTool.scene;
        this.astMgr = physics3dDemoTool.astMgr;
        this.camera = physics3dDemoTool.camera;
        this.init();
        return null;
    }

    private boxTran : m4m.framework.transform;
    init(){
        let mat_activated = physics3dDemoTool.mats["activated"];
        let mat_sleeping = physics3dDemoTool.mats["sleeping"];
        let mat_joint = physics3dDemoTool.mats["uvTest"];
        //构建物体-------------------
        //box
        let trans2=new m4m.framework.transform();
        this.boxTran = trans2;
        trans2.name = "box"
        m4m.math.vec3Set(trans2.localPosition,-this.connectedPivot.x, -this.mainPivot.y,0);
        trans2.localScale.x = 0.5;
        this.scene.addChild(trans2);
        let mr2 =  physics3dDemoTool.attachMesh(trans2,mat_activated,"cube");

        //sphere mid
        let mid_sphere =new m4m.framework.transform();
        mid_sphere.name = "sphere_1"
        mid_sphere.localPosition.y = 8;
        m4m.math.vec3SetAll(mid_sphere.localScale,0.5);
        this.scene.addChild(mid_sphere);
        let mr_cl =  physics3dDemoTool.attachMesh(mid_sphere,mat_joint,"sphere");

        //初始化 物理世界-----------------------
        this.scene.enablePhysics(new m4m.math.vector3(0,0,0),new m4m.framework.OimoJSPlugin());
        let boxImpostor = new m4m.framework.PhysicsImpostor(trans2, m4m.framework.ImpostorType.BoxImpostor, { mass: 2 });
        let cylinderImpostor = new m4m.framework.PhysicsImpostor(mid_sphere, m4m.framework.ImpostorType.CylinderImpostor, { mass: 0 ,friction:0.5});

        this.mrs.push(mr2);

        //Add Joint
        let phyJ = m4m.framework.MotorEnabledJoint;
        let joint1 = new phyJ(phyJ.WheelJoint,{
            mainPivot: this.mainPivot,
            connectedPivot: this.connectedPivot,
            mainAxis: new m4m.math.vector3(0, 1, 0),
            connectedAxis: new m4m.math.vector3(1, 0, 0),
            nativeParams: {
        }
        });
        this.targetMotor = joint1;
        cylinderImpostor.addJoint(boxImpostor , joint1);
        
        joint1.setMotor(1,100);

        //GUI
        this.setGUI();

        //
        this.addDisplayObj();
    }
    private connectedPivot = new m4m.math.vector3(-2, 0, 0);
    private mainPivot = new m4m.math.vector3(0, -1.5, 0);

    private pole : m4m.framework.transform;
    private pole_1 : m4m.framework.transform;
    //辅助显示连接轴
    addDisplayObj(){
        let mat_pole = physics3dDemoTool.mats["purple"];
        let diameter = 0.25;
        let m_y = Math.abs( this.mainPivot.y);
        let m_x = Math.abs( this.connectedPivot.x);
        //横杆
        this.pole =new m4m.framework.transform();
        this.scene.addChild(this.pole);
        let _pole = new m4m.framework.transform();
        this.pole.addChild(_pole);
        m4m.math.vec3Set( _pole.localScale,m_x,diameter,diameter);
        m4m.math.vec3Set( _pole.localPosition, - _pole.localScale.x /2 ,0,0);
        physics3dDemoTool.attachMesh( _pole,mat_pole,"cube");

        //竖杆
        this.pole_1 =new m4m.framework.transform();
        this.scene.addChild(this.pole_1);
        let _pole_1 = new m4m.framework.transform();
        m4m.math.vec3Set(_pole_1.localScale,diameter,m_y,diameter);
        m4m.math.vec3Set(_pole_1.localPosition, 0  , _pole_1.localScale.y/2 , 0);
        this.pole_1.addChild(_pole_1);
        physics3dDemoTool.attachMesh(_pole_1,mat_pole,"cube");
    }

    private tempV3 = new m4m.math.vector3();
    syncDisplayRT(){
        if(!this.boxTran || !this.pole) return;
        let bPos = this.boxTran.localPosition;
        m4m.math.vec3Clone(bPos,this.pole.localPosition);
        //屏蔽x 轴的旋转
        m4m.math.quatClone(this.boxTran.localRotate,this.pole.localRotate);
        this.pole.localPosition = this.pole.localPosition;
        this.pole.localRotate = this.pole.localRotate;
        //
        m4m.math.vec3Set(this.pole_1.localPosition, 0 , bPos.y , 0);
        this.pole_1.localPosition = this.pole_1.localPosition;
    }

    private motorSpeed = 10;
    private targetMotor :  m4m.framework.MotorEnabledJoint;
    private changeMotorSpeed (){
        if(!this.targetMotor) return;
        this.targetMotor.setMotor(this.motorSpeed);
    }

    private guiMsg = "车轮马达测试demo wheel(hinge2)";
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
        gui.add(this , "motorSpeed",1,100);
        let folderFun = gui.addFolder("触发方法");
        folderFun.open();

        folderFun.add(this, 'impulseBox' );
        folderFun.add(this, 'changeMotorSpeed' );
    }

    private impulseBox(){
        this.doImpulse(this.boxTran.physicsImpostor);
    }

    private force = new m4m.math.vector3(0,10,0);
    private contactlocalPoint = new m4m.math.vector3(0,-0.5,0.45);
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

        //同步辅助显示
        this.syncDisplayRT(); 
    }
}