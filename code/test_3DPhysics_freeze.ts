/** 
 * 3d物理 位置 和 旋转冻结
 */
class test_3DPhysics_freeze implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr : m4m.framework.assetMgr;
    iptMgr : m4m.framework.inputMgr;
    mrs : m4m.framework.meshRenderer[] = [];
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

    private targetTran : m4m.framework.transform;
    private boxTran : m4m.framework.transform;
    private cylinderTran : m4m.framework.transform;
    private floor : m4m.framework.transform
    /**
     * 初始化
     */
    init(){
        
        let mat_activated = physics3dDemoTool.mats["activated"];
        let mat_sleeping = physics3dDemoTool.mats["sleeping"];
        let mat_stick = physics3dDemoTool.mats["uvTest"];
        let mat_white = physics3dDemoTool.mats["white"];
        //构建物体-------------------
        //底面
        let trans=new m4m.framework.transform();
        this.floor = trans;
        trans.localScale.x= 20;
        trans.localScale.y= 0.01;
        trans.localScale.z= 20;
        this.scene.addChild(trans);
        physics3dDemoTool.attachMesh(trans , mat_white ,"cube");
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
        this.scene.addChild(trans2);
        let mr = physics3dDemoTool.attachMesh(trans2 , mat_activated ,"cube");

        //sphere
        let trans3=new m4m.framework.transform();
        trans3.name = "sphere";
        trans3.localPosition.y = 15;
        trans3.localPosition.x = -0.2;
        trans3.localPosition.z = 0.2;
        this.scene.addChild(trans3);
        let mr1 = physics3dDemoTool.attachMesh(trans3 , mat_activated ,"sphere");

        //cylinder
        let cylinder_mid =new m4m.framework.transform();
        this.cylinderTran = cylinder_mid;
        cylinder_mid.name = "cylinder"
        cylinder_mid.localPosition.y = 8;
        this.scene.addChild(cylinder_mid);
        let mr2 = physics3dDemoTool.attachMesh(cylinder_mid , mat_stick ,"cylinder");

        //初始化 物理世界-----------------------
        this.scene.enablePhysics(new m4m.math.vector3(0,-9.8,0),new m4m.framework.OimoJSPlugin());
        let groundImpostor= new m4m.framework.PhysicsImpostor(trans, m4m.framework.ImpostorType.PlaneImpostor, { mass: 0, restitution: 0.1 , friction: 0.9});
        // let boxImpostor = new m4m.framework.PhysicsImpostor(trans2, m4m.framework.ImpostorType.BoxImpostor, { mass: 1, restitution: 0.6 ,friction: 0.5});
        let boxImpostor = new m4m.framework.PhysicsImpostor(trans2, m4m.framework.ImpostorType.BoxImpostor, { mass: 2 ,restitution: 0.5 , kinematic : true });
        let sphereImpostor = new m4m.framework.PhysicsImpostor(trans3, m4m.framework.ImpostorType.SphereImpostor, { mass: 0.5, restitution: 0.6 ,friction: 0.5});
        let cylinderImpostor = new m4m.framework.PhysicsImpostor(cylinder_mid, m4m.framework.ImpostorType.CylinderImpostor, { mass: 1 ,friction:0.5});

        this.mrs.push(mr1,mr2);
        //apply Target set
        this.targetTran = this.cylinderTran;

        //Freeze
        let ft = m4m.framework.FreezeType;
        let arr = [ft.Position_x,ft.Position_y,ft.Position_z,ft.Rotation_x,ft.Rotation_y,ft.Rotation_z];
        this.enumArr = arr;
        let opts = [true,false,false,true,true,false];
        arr.forEach((o,i)=>{
            let str = ft[o];
            this.optStrs.push(str);
            this.freezeDic[str] = opts[i];
        });
        
        //this.applyFreezeOpt();

        //鼠标事件
        this.iptMgr.addPointListener(m4m.event.PointEventEnum.PointMove,this.onPonitMove,this);

        //GUI
        this.setGUI();
    }

    private guiMsg = "冻结测试demo ";
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
        //冻结选项
        let folderFreeze = gui.addFolder("Freeze (冻结选项)");
        this.optStrs.forEach(o=>{
            folderFreeze.add(this.freezeDic, o );
        });
        folderFreeze.open();
        //方法
        let folderFun = gui.addFolder("触发方法");
        folderFun.open();
        folderFun.add(this, 'impulseTarget' );
        folderFun.add(this, 'applyFreezeOpt' );
        folderFun.add(this, 'applyReset' );

    }
    /**
     * 重置demo物理状态
     */
    private applyReset(){
        physics3dDemoTool.resetObj(this.mrs);
    }
    
    private enumArr : number[] = [];
    private optStrs: string[] = [];
    private freezeDic : {[opt:string]: boolean} = {};
    /**
     * 执行冻结
     * @returns 
     */
    private applyFreezeOpt(){
        let phy = this.targetTran.physicsImpostor;
        if(!phy) return;
        this.enumArr.forEach((o,i)=>{
            let str = this.optStrs[i];
            let b = this.freezeDic[str];
            phy.setFreeze(o,b);
        });
    }

    /**
     * 对目标施加冲量
     */
    private impulseTarget(){
        this.doImpulse(this.targetTran.physicsImpostor);
    }

    private force = new m4m.math.vector3(-10,0,5);
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

    cachePickInfo = new m4m.framework.pickinfo();
    cacheRota = new m4m.math.quaternion();
    cache_y = 0;
    /**
     * 移动 到射线点
     * @param param0 点坐标
     */
    onPonitMove([x,y]){
        let viewPos = m4m.poolv2();
        viewPos.x = x;
        viewPos.y = y;
        console.log(`x: ${x} ,y :${y}`);
        let ray = this.camera.creatRayByScreen(viewPos,this.app);
        let mf = this.floor.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
        let isinsrt =  mf.mesh.intersects(ray,this.floor.getWorldMatrix(),this.cachePickInfo);
        if(!isinsrt || !this.cachePickInfo || !this.cachePickInfo.hitposition)return;
        let pos = this.cachePickInfo.hitposition;
        console.log(`pos  x: ${pos.x} ,y :${pos.y} , z: ${pos.z}`);

        //同步ctr box 位置
        pos.y += 0.55;
        this.boxTran.physicsImpostor.kinematicSetPosition(pos);  //更新动力学 位置
        m4m.poolv2_del(viewPos);
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