//UI 组件样例
class test_UI_Component implements IState {
    fontjson = "方正粗圆_GBK.font.json";
    fontpng = "方正粗圆_GBK.TTF.png";
    emoji = "emoji";
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();
    assetMgr: m4m.framework.assetMgr;
    rooto2d: m4m.framework.overlay2D;
    static temp: m4m.framework.transform2D;
    start(app: m4m.framework.application) {

        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();

        //相机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10;

        //2dUI root
        this.rooto2d = new m4m.framework.overlay2D();
        this.camera.addOverLay(this.rooto2d);


        //任务排队执行系统
        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.loadAtlas.bind(this));
        this.taskmgr.addTaskCall(this.createUI.bind(this));
    }

    private createUI(astState: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        let atlasComp = this.assetMgr.getAssetByName("comp.atlas.json") as m4m.framework.atlas;
        let tex_0 = this.assetMgr.getAssetByName("zg03_256.png") as m4m.framework.texture;
        let emojiAtlas = m4m.framework.sceneMgr.app.getAssetMgr().getAssetByName(`emoji.atlas.json`, `emoji.assetbundle.json`) as m4m.framework.atlas;


        //9宫格拉伸底图
        let bg_t = new m4m.framework.transform2D;
        bg_t.name = "框底图"
        bg_t.width = 800;
        bg_t.height = 260;
        bg_t.pivot.x = 0;
        bg_t.pivot.y = 0;
        //bg_t.localTranslate.x = 100;
        bg_t.localTranslate.y = 100;
        this.rooto2d.addChild(bg_t);
        let bg_i = bg_t.addComponent("image2D") as m4m.framework.image2D;
        bg_i.imageType = m4m.framework.ImageType.Sliced;
        bg_i.sprite = atlasComp.sprites["bg"];
        bg_i.imageBorder.l = 10;
        bg_i.imageBorder.t = 50;
        bg_i.imageBorder.r = 10;
        bg_i.imageBorder.b = 10;
        bg_t.layoutState = 0 | m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.RIGHT | m4m.framework.layoutOption.TOP | m4m.framework.layoutOption.BOTTOM;
        bg_t.setLayoutValue(m4m.framework.layoutOption.LEFT, 60);
        bg_t.setLayoutValue(m4m.framework.layoutOption.TOP, 60);
        bg_t.setLayoutValue(m4m.framework.layoutOption.RIGHT, 60);
        bg_t.setLayoutValue(m4m.framework.layoutOption.BOTTOM, 60);

        let _font = this.assetMgr.getAssetByName(this.fontjson) as m4m.framework.font;
        let lableW = 500;
        let lableH = 40;
        let lableStartX = 80;
        let lableStartY = 280;
        //文本
        let lab_t0 = new m4m.framework.transform2D;
        lab_t0.name = "我是段文本_lable";
        lab_t0.width = lableW;
        lab_t0.height = lableH;
        lab_t0.localTranslate.x = lableStartX;
        lab_t0.localTranslate.y = lableStartY;
        this.rooto2d.addChild(lab_t0);
        let lab_l0 = lab_t0.addComponent("label") as m4m.framework.label;
        test_UI_Component["lab"] = lab_l0;
        lab_l0.font = _font;
        lab_l0.fontsize = 12;
        // lab_l.text = "我是段文本\n换行测试";
        lab_l0.text = `${lab_l0.fontsize}号字体 Innovation in China 中国制造，慧及全球 0123456789`;
        lab_l0.color = new m4m.math.color(0.0, 0.0, 0.0, 1);
        lab_l0.color2 = new m4m.math.color(1.0, 0.0, 0.0, 1);
        test_UI_Component["obj"] = this;

        let lab_t = new m4m.framework.transform2D;
        lab_t.name = "我是段文本_lable";
        lab_t.width = lableW;
        lab_t.height = lableH;
        lab_t.localTranslate.x = lableStartX;
        lab_t.localTranslate.y = lableStartY + lableH;
        this.rooto2d.addChild(lab_t);
        let lab_l = lab_t.addComponent("label") as m4m.framework.label;
        test_UI_Component["lab"] = lab_l;
        lab_l.font = _font;
        lab_l.fontsize = 20;
        // lab_l.text = "我是段文本\n换行测试";
        lab_l.text = `${lab_l.fontsize}号字体 Innovation in China 中国制造，慧及全球 0123456789`;
        lab_l.color = new m4m.math.color(0.0, 0.0, 0.0, 1);
        lab_l.color2 = new m4m.math.color(1.0, 0.0, 0.0, 1);
        test_UI_Component["obj"] = this;

        let lab_t1 = new m4m.framework.transform2D;
        lab_t1.name = "我是段文本_lable";
        lab_t1.width = lableW;
        lab_t1.height = lableH;
        lab_t1.localTranslate.x = lableStartX;
        lab_t1.localTranslate.y = lableStartY + lableH * 2;
        this.rooto2d.addChild(lab_t1);
        let lab_l1 = lab_t1.addComponent("label") as m4m.framework.label;
        test_UI_Component["lab"] = lab_l1;
        lab_l1.font = _font;
        lab_l1.fontsize = 30;
        // lab_l1.text = "我是段文本\n换行测试";
        lab_l1.text = `${lab_l1.fontsize}号字体 Innovation in China 中国制造，慧及全球 0123456789`;
        lab_l1.color = new m4m.math.color(0.0, 0.0, 0.0, 1);
        lab_l1.color2 = new m4m.math.color(1.0, 0.0, 0.0, 1);
        test_UI_Component["obj"] = this;

        let lab_t2 = new m4m.framework.transform2D;
        lab_t2.name = "我是段文本_lable";
        lab_t2.width = lableW;
        lab_t2.height = lableH;
        lab_t2.localTranslate.x = lableStartX;
        lab_t2.localTranslate.y = lableStartY + lableH * 3;
        this.rooto2d.addChild(lab_t2);
        let lab_l2 = lab_t2.addComponent("label") as m4m.framework.label;
        test_UI_Component["lab"] = lab_l2;
        lab_l2.font = _font;
        lab_l2.fontsize = 40;
        // lab_l2.text = "我是段文本\n换行测试";
        lab_l2.text = `${lab_l2.fontsize}号字体 Innovation in China 中国制造，慧及全球 0123456789`;
        lab_l2.color = new m4m.math.color(0.0, 0.0, 0.0, 1);
        lab_l2.color2 = new m4m.math.color(1.0, 0.0, 0.0, 1);
        test_UI_Component["obj"] = this;

        //富文本
        let lab_t3 = new m4m.framework.transform2D;
        lab_t3.name = "lable_richText";
        lab_t3.width = lableW;
        lab_t3.height = lableH * 3;
        lab_t3.localTranslate.x = lableStartX;
        lab_t3.localTranslate.y = lableStartY + lableH * 4;
        this.rooto2d.addChild(lab_t3);
        let lab_l3 = lab_t3.addComponent("label") as m4m.framework.label;
        lab_l3.font = _font;
        lab_l3.fontsize = 30;
        // lab_l2.text = "我是段文本\n换行测试";
        lab_l3.richText = true;
        lab_l3.imageTextAtlas = emojiAtlas;
        lab_l3.text = "富文本:<color=#00ff00ff>红色</color> <color=#ff0000ff>绿色</color> \n<i>斜体文本</i> \n图片字符[happy][happy][like][cool][happy]";
        lab_l3.color = new m4m.math.color(0.0, 0.0, 0.0, 1);
        lab_l3.color2 = new m4m.math.color(0, 0.0, 0.0, 0.5);

        //按鈕
        let btn_t = new m4m.framework.transform2D;
        btn_t.name = "btn_按鈕"
        btn_t.width = 100;
        btn_t.height = 36;
        btn_t.pivot.x = 0;
        btn_t.pivot.y = 0;
        btn_t.localTranslate.x = 10;
        btn_t.localTranslate.y = 70;
        bg_t.addChild(btn_t);
        let btn_b = btn_t.addComponent("button") as m4m.framework.button;
        btn_b.targetImage = btn_t.addComponent("image2D") as m4m.framework.image2D;
        btn_b.targetImage.sprite = atlasComp.sprites["ui_public_button_hits"];
        btn_b.pressedGraphic = atlasComp.sprites["ui_public_button_1"];
        btn_b.pressedColor = new m4m.math.color(1, 1, 1, 1);
        btn_b.transition = m4m.framework.TransitionType.SpriteSwap;

        //关闭按钮
        let closeSce = 0.8;
        let close_bt = new m4m.framework.transform2D;
        close_bt.width = 25 * closeSce;
        close_bt.height = 25 * closeSce;
        close_bt.pivot.x = 0;
        close_bt.pivot.y = 0;
        close_bt.localTranslate.x = 370;
        close_bt.localTranslate.y = 2;
        bg_t.addChild(close_bt);
        let close_b = close_bt.addComponent("button") as m4m.framework.button;
        close_b.targetImage = close_bt.addComponent("image2D") as m4m.framework.image2D;
        close_b.targetImage.sprite = atlasComp.sprites["ui_boundary_close_in"];
        close_b.pressedGraphic = atlasComp.sprites["ui_boundary_close"];
        close_b.transition = m4m.framework.TransitionType.SpriteSwap;
        close_bt.layoutState = 0 | m4m.framework.layoutOption.RIGHT | m4m.framework.layoutOption.TOP;
        close_bt.setLayoutValue(m4m.framework.layoutOption.RIGHT, 5);
        close_bt.setLayoutValue(m4m.framework.layoutOption.TOP, 3);

        //精灵图 数字
        let nums = "45789";
        let scale = 0.6;
        let numIconarr: m4m.framework.image2D[] = [];
        for (var i = 0; i < nums.length; i++) {
            let spt_t = new m4m.framework.transform2D;
            spt_t.width = 32 * scale;
            spt_t.height = 42 * scale;
            spt_t.pivot.x = 0;
            spt_t.pivot.y = 0;
            spt_t.localTranslate.x = spt_t.width * i + 10;
            spt_t.localTranslate.y = 120;
            bg_t.addChild(spt_t);
            let spt = spt_t.addComponent("image2D") as m4m.framework.image2D;
            spt.sprite = atlasComp.sprites["ui_lianji_" + nums[i]];
            numIconarr.push(spt);
        }

        btn_b.addListener(m4m.event.UIEventEnum.PointerClick, () => {
            let temp = "";
            for (var i = 0; i < nums.length; i++) {
                let num = Number(nums[i]);
                num++;
                num = num % 10;
                numIconarr[i].sprite = atlasComp.sprites["ui_lianji_" + num];
                numIconarr[i].transform.markDirty();
                temp += num.toString();
            }
            nums = temp;
        }, this);


        //一个输入框
        let iptFrame_t = new m4m.framework.transform2D;
        iptFrame_t.width = 800;
        iptFrame_t.height = 30;
        iptFrame_t.pivot.x = 0;
        iptFrame_t.pivot.y = 0;
        iptFrame_t.localTranslate.x = 10;
        iptFrame_t.localTranslate.y = 180;
        bg_t.addChild(iptFrame_t);
        let ipt = iptFrame_t.addComponent("inputField") as m4m.framework.inputField;
        ipt.LineType = m4m.framework.lineType.SingleLine;                              //单行输入
        ipt.onTextSubmit = (t) => {
            console.log(`提交文本:${t}`);
        }

        let img_t = new m4m.framework.transform2D;
        img_t.width = iptFrame_t.width;
        img_t.height = iptFrame_t.height;
        iptFrame_t.addChild(img_t);
        ipt.frameImage = img_t.addComponent("image2D") as m4m.framework.image2D;
        ipt.frameImage.sprite = atlasComp.sprites["ui_public_input"];
        ipt.frameImage.imageType = m4m.framework.ImageType.Sliced;
        ipt.frameImage.imageBorder.l = 16;
        ipt.frameImage.imageBorder.t = 14;
        ipt.frameImage.imageBorder.r = 16;
        ipt.frameImage.imageBorder.b = 14;

        let text_t = new m4m.framework.transform2D;
        text_t.width = iptFrame_t.width;
        text_t.height = iptFrame_t.height;
        iptFrame_t.addChild(text_t);
        ipt.TextLabel = text_t.addComponent("label") as m4m.framework.label;
        ipt.TextLabel.font = _font;
        ipt.TextLabel.fontsize = 24
        ipt.TextLabel.color = new m4m.math.color(1, 1, 1, 1);
        text_t.layoutState = 0 | m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
        text_t.setLayoutValue(m4m.framework.layoutOption.H_CENTER, 0);
        text_t.setLayoutValue(m4m.framework.layoutOption.V_CENTER, 0);

        let p_t = new m4m.framework.transform2D;
        p_t.width = iptFrame_t.width;
        p_t.height = iptFrame_t.height;
        iptFrame_t.addChild(p_t);
        ipt.PlaceholderLabel = p_t.addComponent("label") as m4m.framework.label;
        ipt.PlaceholderLabel.text = "SingleLine Enter text...";
        ipt.PlaceholderLabel.font = _font;
        ipt.PlaceholderLabel.fontsize = 24
        ipt.PlaceholderLabel.color = new m4m.math.color(0.6, 0.6, 0.6, 1);

        m4m["he"] = ipt;

        //多行输入框 (回车换行)
        let ipt_mul_t = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.InputField);
        bg_t.addChild(ipt_mul_t);
        ipt_mul_t.width = 300;
        ipt_mul_t.height = 120;
        ipt_mul_t.localTranslate.x = 160;
        ipt_mul_t.localTranslate.y = 40;
        let ipt_mul = ipt_mul_t.getComponent("inputField") as m4m.framework.inputField;
        // ipt_mul.LineType = m4m.framework.lineType.MultiLine;                                        //设置多行输入
        ipt_mul.LineType = m4m.framework.lineType.MultiLine_NewLine;                                   //设置多行输入 ，回车换行
        ipt_mul.PlaceholderLabel.text = "MultiLine Enter text...";                                      //占位文本设置
        ipt_mul.text = `多行文本输入框\n<color=#ff00aa>支持</color><color=#00ffaa><i>富文本</i></color>: [happy][cool][like]\nMultiLine_NewLine模式,输入回车直接换行`;
        //监听 文本提交回调
        ipt_mul.onTextSubmit = (t) => {
            console.log(`提交文本:${t}`);
        }
        m4m.math.colorSet(ipt_mul.frameImage.color, 0.9, 0.9, 0.9, 1);
        //lable set font 
        let ls = ipt_mul_t.getComponentsInChildren("label") as m4m.framework.label[];
        ls.forEach((l) => { l.font = _font; });
        ipt_mul.TextLabel.richText = true;                  //让 textLable 使用富文本
        ipt_mul.TextLabel.imageTextAtlas = emojiAtlas;      //设置 textLable 富文本中的图片字符

        //多行输入框 (回车换行)
        let ipt_mul_t_1 = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.InputField);
        bg_t.addChild(ipt_mul_t_1);
        ipt_mul_t_1.width = 200;
        ipt_mul_t_1.height = 120;
        ipt_mul_t_1.localTranslate.x = 500;
        ipt_mul_t_1.localTranslate.y = 40;
        let ipt_mul_1 = ipt_mul_t_1.getComponent("inputField") as m4m.framework.inputField;
        ipt_mul_1.LineType = m4m.framework.lineType.MultiLine;                                              //设置多行输入 ，回车提交
        ipt_mul_1.PlaceholderLabel.text = "MultiLine Enter text...";                                        //占位文本设置
        ipt_mul_1.text = `多行文本输入框\n<color=#ff00aa>支持</color><color=#00ffaa><i>富文本Text</i></color>: [cool][cool][like][cool]\nMultiLine模式,输入回车直接提交`;
        //监听 文本提交回调
        ipt_mul_1.onTextSubmit = (t) => {
            console.log(`提交文本:${t}`);
        }
        m4m.math.colorSet(ipt_mul_1.frameImage.color, 0.9, 0.9, 0.9, 1);
        //lable set font 
        let ls_1 = ipt_mul_t_1.getComponentsInChildren("label") as m4m.framework.label[];
        ls_1.forEach((l) => { l.font = _font; });
        ipt_mul_1.TextLabel.richText = true;                  //让 textLable 使用富文本
        ipt_mul_1.TextLabel.imageTextAtlas = emojiAtlas;      //设置 textLable 富文本中的图片字符


        //滑动卷轴框
        let scroll_t = new m4m.framework.transform2D;
        scroll_t.width = 200;
        scroll_t.height = 130;
        bg_t.addChild(scroll_t);
        scroll_t.localTranslate.x = 800;
        scroll_t.localTranslate.y = 30;
        let scroll_ = scroll_t.addComponent("scrollRect") as m4m.framework.scrollRect;
        let ct = new m4m.framework.transform2D;
        scroll_t.addChild(ct);
        scroll_.inertia = true;
        ct.width = 300;
        ct.height = 300;
        scroll_.decelerationRate = 0.135;
        scroll_.content = ct;
        scroll_t.isMask = true;
        scroll_.horizontal = true;
        scroll_.vertical = true;

        //卷轴框 raw png
        let raw_t2 = new m4m.framework.transform2D;
        raw_t2.name = "滑动卷轴框png";
        raw_t2.width = 300;
        raw_t2.height = 300;
        let raw_i2 = raw_t2.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        raw_i2.image = tex_0;
        ct.addChild(raw_t2);

        //卷轴框 label
        let s_l_t = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Label);
        s_l_t.width = 180;
        let s_l = s_l_t.getComponent("label") as m4m.framework.label;
        s_l.font = _font;
        s_l.fontsize = 40;
        s_l.verticalOverflow = true;
        s_l.verticalType = m4m.framework.VerticalType.Top;
        s_l.text = "scrollRect \ntry drag \nto move";
        ct.addChild(s_l_t);

        test_UI_Component.temp = iptFrame_t;

        //key dwon test
        let inputMgr = this.app.getInputMgr();

        this.app.webgl.canvas.addEventListener("keydown", (ev: KeyboardEvent) => {
            if (ev.keyCode == 81) {

            }
        }, false);



        state.finish = true;
    }

    private loadTexture(lastState: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        //加载图片资源
        this.assetMgr.load(`${resRootPath}atlas/comp/comp.json.png`, m4m.framework.AssetTypeEnum.Auto, (s) => {
            if (s.isfinish) {
                this.assetMgr.load(`${resRootPath}atlas/comp/comp.atlas.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                    if (s.isfinish) {
                        //加载字体资源
                        this.assetMgr.load(`${resRootPath}font/` + this.fontpng, m4m.framework.AssetTypeEnum.Auto, (s) => {
                            if (s.isfinish) {
                                this.assetMgr.load(`${resRootPath}font/` + this.fontjson, m4m.framework.AssetTypeEnum.Auto, (s) => {
                                    this.assetMgr.load(`${resRootPath}texture/zg03_256.png`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                                        if (s.isfinish) {
                                            state.finish = true;
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    private loadAtlas(lastState: m4m.framework.taskstate, state: m4m.framework.taskstate) {

        let abName = `${this.emoji}.assetbundle.json`;
        let abPath = `${resRootPath}atlas/${this.emoji}/${abName}`;
        this.assetMgr.load(abPath, m4m.framework.AssetTypeEnum.Bundle, (_sta) => {
            if (_sta.isfinish) {
                // let ab = this.assetMgr.getAssetBundle(abName);
                // let atlas = this.assetMgr.getAssetByName(`${emoji}.atlas.json`,abName);
                state.finish = true;
            }
        });
    }

    update(delta: number) {
        this.taskmgr.move(delta); //推进task

    }


    testFun() {
        let lab = test_UI_Component["lab"] as m4m.framework.label;
        let datater = lab["datar"] as number[];
        let frist = new m4m.math.vector2(datater[0], datater[1]);
        let endIdx_0 = datater.length - 13;
        let endIdx_1 = datater.length - 12;
        let end = new m4m.math.vector2(datater[endIdx_0], datater[endIdx_1]);

        let canvas = lab.transform.canvas;
        let temp = new m4m.math.vector2();

        canvas.ModelPosToCanvasPos(frist, temp);
        console.error(`frist:${temp.toString()}`);
        canvas.ModelPosToCanvasPos(end, temp);
        console.error(`end:${temp.toString()}`);

    }
}