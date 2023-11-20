

class test_AnimatedSprite implements IState {

    private spriteMap: Map<string, m4m.framework.sprite[]> = new Map();
    private animation: string = "run";
    private timer: number = 0;
    private index: number = 0;

    private img_1: m4m.framework.image2D;

    start(app: m4m.framework.application) {
        let scene = app.getScene();
        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        camera.near = 0.01;
        camera.far = 10;
        objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
        objCam.markDirty();//标记为需要刷新

        //2dtest overlay
        var o2d = new m4m.framework.overlay2D();
        camera.addOverLay(o2d);

        //单张sprite宽高
        let width: number = 48;
        let height: number = 48;

        //普通显示
        let t2d_1 = new m4m.framework.transform2D();
        t2d_1.width = width;
        t2d_1.height = height;
        t2d_1.localScale = new m4m.math.vector2(10, 10);
        t2d_1.pivot.x = 0;
        t2d_1.pivot.y = 0;
        t2d_1.localTranslate.x = 150;
        t2d_1.localTranslate.y = 150;
        let img_1 = t2d_1.addComponent("image2D") as m4m.framework.image2D;
        img_1.imageType = m4m.framework.ImageType.Simple;
        this.img_1 = img_1;
        o2d.addChild(t2d_1);


        let url = `${resRootPath}sprite/HeavyBandit.png`;
        m4m.io.loadImg(url, (_tex, err) => {
            if (err) {
                console.error("加载失败: ", err);
            } else {
                //构建 texture
                let _texture = new m4m.framework.texture(url.substring(url.lastIndexOf("/") + 1));
                let _textureFormat = m4m.render.TextureFormatEnum.RGBA;//这里需要确定格式

                //原生贴图
                let linear = false;//线性过滤，关了就是点
                let mipmap = false;//mipmap，缩放抗水印，2d一般也不用
                let t2d = new m4m.render.glTexture2D(m4m.framework.sceneMgr.app.webgl, _textureFormat, mipmap, linear);
                t2d.uploadImage(_tex, mipmap, linear, false, false, false); //非2次幂 图 不能显示设置repeat
                _texture.glTexture = t2d;
                _texture.use();


                //idle动画
                this.spriteMap.set("idle", this.getFrames(_texture, 0, 0, width, height, 4));
                //奔跑动画
                this.spriteMap.set("run", this.getFrames(_texture, 0, height, width, height, 8));
                //攻击
                this.spriteMap.set("attack", this.getFrames(_texture, 0, height * 2, width, height, 8));
                //苏醒
                this.spriteMap.set("revive", this.getFrames(_texture, 0, height * 3, width, height, 8));
                //死亡
                this.spriteMap.set("die", this.getFrames(_texture, 0, height * 4, width, height, 4));
            }
        });
    }

    update(delta: number) {
        this.timer += delta;
        if (this.timer > 0.2) {
            this.timer %= 0.2;
            let list = this.spriteMap.get(this.animation);
            if (list != null) {
                this.img_1.sprite = list[this.index];
                this.index++;
                if (this.index >= list.length) {
                    this.index = 0;
                }
            }
        }
    }

    /**
     * 获取 帧动画sprite列表
     * @param texture 纹理
     * @param x x
     * @param y y
     * @param width 宽
     * @param height 高
     * @param frameCount 帧数
     * @returns sprite列表
     */
    private getFrames(texture: m4m.framework.texture, x: number, y: number, width: number, height: number, frameCount: number) {
        let array: m4m.framework.sprite[] = [];
        for (let i = 0; i < frameCount; i++) {
            //构建 sprite
            let _sprite = new m4m.framework.sprite();
            _sprite.texture = texture;
            _sprite.border = new m4m.math.border(0, 0, 0, 0);
            _sprite.rect = new m4m.math.rect(x + width * i, y, width, height);
            array.push(_sprite);
        }
        return array;
    }
}