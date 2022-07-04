class testReload implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    //资源放置位置
    resRoot = `${resRootPath}prefab/`;
    //关心的 部位
    careSubList = ["body", "face", "handL", "handR", "head", "leg"];
    //模型名字
    r_a_Name = "fs";
    r_b_Name = "0001_shengyi_male";

    async start(app: m4m.framework.application) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10000;
        objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
        //相机控制
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 10;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0);


        let o2d = new m4m.framework.overlay2D();
        this.camera.addOverLay(o2d);

        // await demoTool.loadbySync(`${resRootPath}shader/MainShader.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${resRootPath}shader/MainShader.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${resRootPath}font/STXINGKA.TTF.png`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${resRootPath}font/STXINGKA.font.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${this.resRoot}${this.r_a_Name}/${this.r_a_Name}.assetbundle.json`, this.app.getAssetMgr());
        await demoTool.loadbySync(`${this.resRoot}${this.r_b_Name}/${this.r_b_Name}.assetbundle.json`, this.app.getAssetMgr());

        //布置模型
        let _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(`${this.r_a_Name}.prefab.json`, `${this.r_a_Name}.assetbundle.json`) as m4m.framework.prefab;
        let r_a = _prefab.getCloneTrans();
        r_a.localScale = new m4m.math.vector3(1, 1, 1);
        r_a.localTranslate = new m4m.math.vector3(0, 0, 0);
        this.scene.addChild(r_a);

        _prefab = this.app.getAssetMgr().getAssetByName(`${this.r_b_Name}.prefab.json`, `${this.r_b_Name}.assetbundle.json`) as m4m.framework.prefab;
        let r_b = _prefab.getCloneTrans();

        //获取 动画组件
        let _aniplayer = r_a.gameObject.getComponent("aniplayer") as m4m.framework.aniplayer;
        _aniplayer.autoplay = true;

        //查找 共同的 部件
        // 布置按钮
        this.careSubList.forEach((v, i) => {
            this.createChangeBtn(r_a, r_b, o2d, v);
        });
    }

    uileft: number = 0;
    createChangeBtn(role: m4m.framework.transform, role1: m4m.framework.transform, o2d: m4m.framework.overlay2D, part: string) {
        //设置UI
        let t2d_9 = new m4m.framework.transform2D();
        t2d_9.width = 120;
        t2d_9.height = 30;
        t2d_9.pivot.x = 0;
        t2d_9.pivot.y = 0;
        t2d_9.localTranslate.x = this.uileft;
        t2d_9.localTranslate.y = 0;
        let btn = t2d_9.addComponent("button") as m4m.framework.button;
        let img9 = t2d_9.addComponent("image2D") as m4m.framework.image2D;
        img9.imageType = m4m.framework.ImageType.Sliced;
        btn.targetImage = img9;
        btn.transition = m4m.framework.TransitionType.ColorTint;//颜色变换

        o2d.addChild(t2d_9);
        var lab = new m4m.framework.transform2D();
        let opt = m4m.framework.layoutOption;
        lab.layoutState = opt.H_CENTER | opt.V_CENTER;
        lab.name = "lab111";
        lab.width = 150;
        lab.height = 50;
        lab.markDirty();
        var label = lab.addComponent("label") as m4m.framework.label;
        label.text = "换" + part;
        label.fontsize = 25;
        label.color = new m4m.math.color(1, 0, 0, 1);
        // label.verticalOverflow = false;
        label.horizontalOverflow = false;
        t2d_9.addChild(lab);
        img9.sprite = this.app.getAssetMgr().getDefaultSprite("white_sprite");
        label.font = this.app.getAssetMgr().getAssetByName("STXINGKA.font.json") as m4m.framework.font;//;
        this.uileft += 130;

        //事件简体
        let r_a_part: m4m.framework.skinnedMeshRenderer;
        let r_b_part: m4m.framework.skinnedMeshRenderer;
        let role_skinMeshRenders = role.gameObject.getComponentsInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer[];
        let role1_skinMeshRenders = role1.gameObject.getComponentsInChildren("skinnedMeshRenderer") as m4m.framework.skinnedMeshRenderer[];

        btn.addListener(m4m.event.UIEventEnum.PointerClick, () => {
            r_a_part = null;
            r_b_part = null;
            for (var key in role_skinMeshRenders) {
                let name = role_skinMeshRenders[key].gameObject.getName();
                if (name.toLowerCase().indexOf(part.toLowerCase()) != -1) {
                    r_a_part = role_skinMeshRenders[key];
                    break;
                }
            }
            for (var key in role1_skinMeshRenders) {
                let name = role1_skinMeshRenders[key].gameObject.getName();
                if (name.toLowerCase().indexOf(part.toLowerCase()) != -1) {
                    r_b_part = role1_skinMeshRenders[key];
                    break;
                }
            }

            if (!r_a_part || !r_b_part) {
                console.warn(`更换节点 ${part.toLowerCase()} 更换失败 ！ 检查一下 this.careSubList 中 是否包含  `);
                return;
            }

            this.excangeSub(r_a_part, r_b_part);
        }, this);
    }

    excangeSub(r_a_part: m4m.framework.skinnedMeshRenderer, r_b_part: m4m.framework.skinnedMeshRenderer) {
        //交换位置
        let role_part_parent = r_a_part.gameObject.transform.parent;
        r_b_part.gameObject.transform.parent.addChild(r_a_part.gameObject.transform);
        role_part_parent.addChild(r_b_part.gameObject.transform);
        let role_part_player = r_a_part.player;
        r_a_part._player = r_b_part.player;
        r_b_part._player = role_part_player;
    }

    camera: m4m.framework.camera;
    timer: number = 0;
    update(delta: number) {

    }
}