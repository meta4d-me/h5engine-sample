namespace PhysicDemo{
    export class physic_01 implements IState {
        scene:m4m.framework.scene;
        camera:m4m.framework.camera;

        start(app: m4m.framework.application)
        {
            this.scene=app.getScene();


            let trans=new m4m.framework.transform();
            trans.localScale.x=10;
            trans.localScale.z=10;
            
            this.scene.addChild(trans);
            let mf=trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHFILTER) as m4m.framework.meshFilter;
            let mr=trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHRENDER) as m4m.framework.meshRenderer;
            mf.mesh=app.getAssetMgr().getDefaultMesh("cube");

            let trans2=new m4m.framework.transform();
            trans2.localPosition.y=5;
            this.scene.addChild(trans2);
            let mf2=trans2.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHFILTER) as m4m.framework.meshFilter;
            let mr2=trans2.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHRENDER) as m4m.framework.meshRenderer;
            mf2.mesh=app.getAssetMgr().getDefaultMesh("cube");

            this.scene.enablePhysics(new m4m.math.vector3(0,-9.8,0));

            let groundImpostor= new m4m.framework.PhysicsImpostor(trans, m4m.framework.ImpostorType.BoxImpostor, { mass: 0, restitution: 0.9});
            let boxImpostor = new m4m.framework.PhysicsImpostor(trans2, m4m.framework.ImpostorType.BoxImpostor, { mass: 1, restitution: 0.9 });
        

            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 2000;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new m4m.math.vector3(0,15,-15);   
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            // let controller=new CameraController();
            CameraController.instance().init(app,this.camera);

        }        
        
        update(delta: number) 
        {
            CameraController.instance().update(delta);
        }
    }
}