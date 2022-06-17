class testLiChangeMesh implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        var role;
        var role1;

        this.app.getAssetMgr().load("res/shader/Mainshader.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/prefabs/FS_01/FS_01.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName("FS_01.prefab.json") as m4m.framework.prefab;
                        role = _prefab.getCloneTrans();
                        this.scene.addChild(role);
                        role.localScale = new m4m.math.vector3(1, 1, 1);
                        role.localTranslate = new m4m.math.vector3(0, 0, 0);

                        var _aniplayer = role.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;
                        _aniplayer.autoplay = true;

                        this.cube = role;

                        if (role1 != null)
                        {
                            // this.createChangeBtn(role, role1, o2d, "body_01", "body_002");
                            this.createChangeBtn(role, role1, o2d, "feet", "feet");
                            // this.createChangeBtn(role, role1, o2d, "hand_01", "hand_002");
                            // this.createChangeBtn(role, role1, o2d, "head_01", "head_002");
                            // this.createChangeBtn(role, role1, o2d, "Leg_01", "leg_002");
                        }
                    }
                });

                this.app.getAssetMgr().load("res/prefabs/FS_002/FS_002.assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName("FS_002.prefab.json") as m4m.framework.prefab;
                        role1 = _prefab.getCloneTrans();
                        // this.scene.addChild(role1);
                        // role1.localScale = new m4m.math.vector3(1, 1, 1);
                        // role1.localTranslate = new m4m.math.vector3(2, 0, 0);

                        if (role != null)
                        {
                            // this.createChangeBtn(role, role1, o2d, "body_01", "body_002");
                            this.createChangeBtn(role, role1, o2d, "feet", "feet");
                            // this.createChangeBtn(role, role1, o2d, "hand_01", "hand_002");
                            // this.createChangeBtn(role, role1, o2d, "head_01", "head_002");
                            // this.createChangeBtn(role, role1, o2d, "Leg_01", "leg_002");
                        }
                    }
                });
            }
        });

        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(0, 10, -10);


        var o2d = new m4m.framework.overlay2D();
        this.camera.addOverLay(o2d);




    }

    uileft: number = 0;
    createChangeBtn(role: m4m.framework.transform, role1: m4m.framework.transform, o2d: m4m.framework.overlay2D, part: string, part2)
    {
        let t2d_9 = new m4m.framework.transform2D();
        t2d_9.width = 150;
        t2d_9.height = 50;
        t2d_9.pivot.x = 0;
        t2d_9.pivot.y = 0;
        t2d_9.localTranslate.x = this.uileft;
        t2d_9.localTranslate.y = 300;
        let btn = t2d_9.addComponent("button") as m4m.framework.button;
        let img9 = t2d_9.addComponent("image2D") as m4m.framework.image2D;
        img9.imageType = m4m.framework.ImageType.Sliced;
        btn.targetImage = img9;
        btn.transition = m4m.framework.TransitionType.ColorTint;//颜色变换

        let role_part: m4m.framework.skinnedMeshRenderer;
        let role1_part: m4m.framework.skinnedMeshRenderer;
        btn.addListener(m4m.event.UIEventEnum.PointerClick,() =>
        {
            if (role_part == null)
            {
                let role_skinMeshRenders = role.gameObject.getComponentsInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer[];
                let role1_skinMeshRenders = role1.gameObject.getComponentsInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer[];

                for (var key in role_skinMeshRenders)
                {
                    if (role_skinMeshRenders[key].gameObject.getName().indexOf("_" + part) >= 0)
                    {
                        role_part = role_skinMeshRenders[key];
                    }
                }
                for (var key in role1_skinMeshRenders)
                {
                    if (role1_skinMeshRenders[key].gameObject.getName().indexOf("_" + part2) >= 0)
                    {
                        role1_part = role1_skinMeshRenders[key];
                    }
                }
            }

            let role_part_parent = role_part.gameObject.transform.parent;
            role1_part.gameObject.transform.parent.addChild(role_part.gameObject.transform);
            role_part_parent.addChild(role1_part.gameObject.transform);

            let role_part_player =  role_part.player;
            role_part._player = role1_part.player;
            role1_part._player = role_part_player;

        },this);
        o2d.addChild(t2d_9);

        var lab = new m4m.framework.transform2D();
        lab.name = "lab111";
        lab.width = 150;
        lab.height = 50;
        lab.pivot.x = 0;
        lab.pivot.y = 0;
        lab.markDirty();
        var label = lab.addComponent("label") as m4m.framework.label;
        label.text = "换" + part;
        label.fontsize = 25;
        label.color = new m4m.math.color(1, 0, 0, 1);
        t2d_9.addChild(lab);

        this.app.getAssetMgr().load("res/uisprite.png", m4m.framework.AssetTypeEnum.Auto, (s) => 
        {
            if (s.isfinish) 
            {
                let texture = this.app.getAssetMgr().getAssetByName("uisprite.png") as m4m.framework.texture;
                img9.sprite = this.app.getAssetMgr().getDefaultSprite("grid_sprite");
            }
        });

        this.app.getAssetMgr().load("res/STXINGKA.TTF.png", m4m.framework.AssetTypeEnum.Auto, (s) =>
        {
            if (s.isfinish)
            {
                this.app.getAssetMgr().load("res/resources/STXINGKA.font.json", m4m.framework.AssetTypeEnum.Auto, (s1) =>
                {
                    if(s1.isfinish)
                        label.font = this.app.getAssetMgr().getAssetByName("STXINGKA.font.json") as m4m.framework.font;//;
                });
            }
        });
        this.uileft += 150;
    }

    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new m4m.math.vector3(x2 * 5, 2.25, -z2 * 5);
        if (this.cube != null)
        {
            objCam.lookat(this.cube);
            objCam.markDirty();//标记为需要刷新
            objCam.updateWorldTran();
        }
    }
}