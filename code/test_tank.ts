enum ShockType {
    Vertical,
    Horizontal,
    Both
}

@m4m.reflect.nodeComponent
class CameraShock implements m4m.framework.INodeComponent {
    gameObject: m4m.framework.gameObject;
    private isPlaying: boolean;
    private fade: boolean;
    private oldTranslate: m4m.math.vector3;
    private shockType: ShockType;
    private strength: number;
    private life: number;
    private ticker: number;
    start() {
        this.isPlaying = false;
    }

    onPlay() {

    }
    play(strength: number = 0.2, life: number = 0.5, fade: boolean = false, shockType: ShockType = ShockType.Both) {
        if (this.oldTranslate == null)
            this.oldTranslate = new m4m.math.vector3();
        m4m.math.vec3Clone(this.gameObject.transform.localTranslate, this.oldTranslate);
        this.isPlaying = true;
        this.strength = strength;
        this.ticker = this.life = life;
        this.fade = fade;
        this.shockType = shockType;
    }
    update(delta: number) {
        if (this.isPlaying) {
            if (this.ticker > 0) {
                this.ticker -= delta;
                let s = this.fade ? this.strength * (this.ticker / this.life) : this.strength;

                if (this.shockType == ShockType.Horizontal || this.shockType == ShockType.Both)
                    this.gameObject.transform.localTranslate.x = this.oldTranslate.x + (Math.random() - 0.5) * s;
                if (this.shockType == ShockType.Vertical || this.shockType == ShockType.Both)
                    this.gameObject.transform.localTranslate.y = this.oldTranslate.y + (Math.random() - 0.5) * s;

                this.gameObject.transform.markDirty();
            }
            else {
                this.gameObject.transform.localTranslate.x = this.oldTranslate.x;
                this.gameObject.transform.localTranslate.y = this.oldTranslate.y;
                this.isPlaying = false;
            }
        }
    }
    remove() {

    }
    clone() {

    }
}

class Joystick {
    app: m4m.framework.application;
    overlay2d: m4m.framework.overlay2D;
    private joystickLeft0: m4m.framework.transform2D;
    private joystickLeft1: m4m.framework.transform2D;
    private joystickRight0: m4m.framework.transform2D;
    private joystickRight1: m4m.framework.transform2D;
    private taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();

    triggerFunc: Function;

    /**
     * 初始化
     * @param app 引擎app
     * @param overlay2d 引擎overlay2D对象
     */
    init(app: m4m.framework.application, overlay2d: m4m.framework.overlay2D) {
        this.app = app;
        this.overlay2d = overlay2d;

        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.addJoystick.bind(this));

        document.addEventListener("mousedown", (e) => { this.onMouseDown(e); });
        document.addEventListener("mouseup", (e) => { this.onMouseUp(e); });
        document.addEventListener("mousemove", (e) => { this.onMouseMove(e); });
        document.addEventListener("touchstart", (e) => { this.onTouchStart(e); e.preventDefault(); });
        document.addEventListener("touchend", (e) => { this.onTouchEnd(e); e.preventDefault(); });
        document.addEventListener("touchmove", (e) => { this.onTouchMove(e); e.preventDefault(); });
    }

    /**
     * 加载纹理
     * @param laststate 
     * @param state 状态
     */
    private loadTexture(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        this.app.getAssetMgr().load(`${resRootPath}texture/joystick0.png`, m4m.framework.AssetTypeEnum.Auto, (s0) => {
            if (s0.isfinish) {
                this.app.getAssetMgr().load(`${resRootPath}texture/joystick1.png`, m4m.framework.AssetTypeEnum.Auto, (s1) => {
                    if (s1.isfinish) {
                        state.finish = true;
                    }
                    else {
                        state.error = true;
                    }
                });
            }
            else {
                state.error = true;
            }
        });
    }

    /**
     * 添加控制遥感
     * @param laststate 
     * @param state 状态
     */
    private addJoystick(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
        {//left
            this.joystickLeft0 = new m4m.framework.transform2D();
            this.joystickLeft0.name = "left0";
            this.joystickLeft0.width = 256;
            this.joystickLeft0.height = 256;
            this.joystickLeft0.pivot = new m4m.math.vector2(0.5, 0.5);
            this.joystickLeft0.localTranslate = new m4m.math.vector2(window.innerWidth * 0.16, window.innerHeight * 0.75);
            let img0 = this.joystickLeft0.addComponent("image2D") as m4m.framework.image2D;
            img0.imageType = m4m.framework.ImageType.Simple;
            let tex0 = this.app.getAssetMgr().getAssetByName("joystick0.png") as m4m.framework.texture;
            img0.sprite = this.app.getAssetMgr().getDefaultSprite("grid_sprite");
            this.overlay2d.addChild(this.joystickLeft0);
            this.joystickLeft0.markDirty();

            this.joystickLeft1 = new m4m.framework.transform2D();
            this.joystickLeft1.name = "left1";
            this.joystickLeft1.width = 256;
            this.joystickLeft1.height = 256;
            this.joystickLeft1.pivot = new m4m.math.vector2(0.5, 0.5);
            this.joystickLeft1.localTranslate = new m4m.math.vector2(window.innerWidth * 0.16, window.innerHeight * 0.75);
            let img1 = this.joystickLeft1.addComponent("image2D") as m4m.framework.image2D;
            img1.imageType = m4m.framework.ImageType.Simple;
            let tex1 = this.app.getAssetMgr().getAssetByName("joystick1.png") as m4m.framework.texture;
            img1.sprite = this.app.getAssetMgr().getDefaultSprite("grid_sprite");
            this.overlay2d.addChild(this.joystickLeft1);
            this.joystickLeft1.markDirty();
        }
        {//right
            this.joystickRight0 = new m4m.framework.transform2D();
            this.joystickRight0.name = "right0";
            this.joystickRight0.width = 256;
            this.joystickRight0.height = 256;
            this.joystickRight0.pivot = new m4m.math.vector2(0.5, 0.5);
            this.joystickRight0.localTranslate = new m4m.math.vector2(window.innerWidth * 0.84, window.innerHeight * 0.75);
            let img0 = this.joystickRight0.addComponent("image2D") as m4m.framework.image2D;
            img0.imageType = m4m.framework.ImageType.Simple;
            let tex0 = this.app.getAssetMgr().getAssetByName("joystick0.png") as m4m.framework.texture;
            img0.sprite = this.app.getAssetMgr().getDefaultSprite("grid_sprite");
            this.overlay2d.addChild(this.joystickRight0);
            this.joystickRight0.markDirty();

            this.joystickRight1 = new m4m.framework.transform2D();
            this.joystickRight1.name = "right1";
            this.joystickRight1.width = 256;
            this.joystickRight1.height = 256;
            this.joystickRight1.pivot = new m4m.math.vector2(0.5, 0.5);
            this.joystickRight1.localTranslate = new m4m.math.vector2(window.innerWidth * 0.84, window.innerHeight * 0.75);
            let img1 = this.joystickRight1.addComponent("image2D") as m4m.framework.image2D;
            img1.imageType = m4m.framework.ImageType.Simple;
            let tex1 = this.app.getAssetMgr().getAssetByName("joystick1.png") as m4m.framework.texture;
            img1.sprite = this.app.getAssetMgr().getDefaultSprite("grid_sprite");
            this.overlay2d.addChild(this.joystickRight1);
            this.joystickRight1.markDirty();
        }

        state.finish = true;
    }

    leftAxis: m4m.math.vector2 = new m4m.math.vector2(0, 0);
    rightAxis: m4m.math.vector2 = new m4m.math.vector2(0, 0);
    private maxScale: number = 128;
    private touchLeft: number = 0;
    private touchRight: number = 0;
    private mouseLeft: boolean = false;
    private mouseRight: boolean = false;

    get leftTouching(): boolean {
        return this.touchLeft != 0;
    }

    get rightTouching(): boolean {
        return this.touchRight != 0;
    }

    /**
     * 当鼠标点下
     * @param e 鼠标事件
     */
    private onMouseDown(e: MouseEvent) {
        if (e.clientX <= this.overlay2d.canvas.pixelWidth / 2) {
            this.mouseLeft = true;

            let v = new m4m.math.vector2(e.clientX, e.clientY);
            m4m.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
            if (m4m.math.vec2Length(v) > this.maxScale) {
                m4m.math.vec2Normalize(v, v);
                m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                m4m.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
            }
            else {
                this.joystickLeft1.localTranslate.x = e.clientX;
                this.joystickLeft1.localTranslate.y = e.clientY;
            }
            m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
            this.joystickLeft1.markDirty();
        }
        else {
            this.mouseRight = true;

            let v = new m4m.math.vector2(e.clientX, e.clientY);
            m4m.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
            if (m4m.math.vec2Length(v) > this.maxScale) {
                m4m.math.vec2Normalize(v, v);
                m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                m4m.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
            }
            else {
                this.joystickRight1.localTranslate.x = e.clientX;
                this.joystickRight1.localTranslate.y = e.clientY;
            }
            m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
            this.joystickRight1.markDirty();
        }
    }

    /**
     * 当鼠标点下释放
     * @param e 鼠标事件
     */
    private onMouseUp(e: MouseEvent) {
        if (this.mouseRight) {
            if (this.triggerFunc != null) {
                this.triggerFunc();
            }
        }

        this.mouseLeft = false;
        this.joystickLeft1.localTranslate.x = this.joystickLeft0.localTranslate.x;
        this.joystickLeft1.localTranslate.y = this.joystickLeft0.localTranslate.y;
        this.leftAxis = new m4m.math.vector2(0, 0);
        this.joystickLeft1.markDirty();

        this.mouseRight = false;
        this.joystickRight1.localTranslate.x = this.joystickRight0.localTranslate.x;
        this.joystickRight1.localTranslate.y = this.joystickRight0.localTranslate.y;
        this.rightAxis = new m4m.math.vector2(0, 0);
        this.joystickRight1.markDirty();
    }

    /**
     * 当鼠标移动
     * @param e 鼠标事件
     */
    private onMouseMove(e: MouseEvent) {
        if (this.mouseLeft) {
            let v = new m4m.math.vector2(e.clientX, e.clientY);
            m4m.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
            if (m4m.math.vec2Length(v) > this.maxScale) {
                m4m.math.vec2Normalize(v, v);
                m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                m4m.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
            }
            else {
                this.joystickLeft1.localTranslate.x = e.clientX;
                this.joystickLeft1.localTranslate.y = e.clientY;
            }
            m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
            this.joystickLeft1.markDirty();
        }
        if (this.mouseRight) {
            let v = new m4m.math.vector2(e.clientX, e.clientY);
            m4m.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
            if (m4m.math.vec2Length(v) > this.maxScale) {
                m4m.math.vec2Normalize(v, v);
                m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                m4m.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
            }
            else {
                this.joystickRight1.localTranslate.x = e.clientX;
                this.joystickRight1.localTranslate.y = e.clientY;
            }
            m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
            this.joystickRight1.markDirty();
        }
    }

    /**
     * 当触摸开始
     * @param e 触摸事件
     */
    private onTouchStart(e: TouchEvent) {
        if (e.touches[0].clientX <= this.overlay2d.canvas.pixelWidth / 2) {
            this.touchLeft = e.touches[0].identifier;
            let v = new m4m.math.vector2(e.touches[0].clientX, e.touches[0].clientY);
            m4m.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
            if (m4m.math.vec2Length(v) > this.maxScale) {
                m4m.math.vec2Normalize(v, v);
                m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                m4m.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
            }
            else {
                this.joystickLeft1.localTranslate.x = e.touches[0].clientX;
                this.joystickLeft1.localTranslate.y = e.touches[0].clientY;
            }
            m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
            this.joystickLeft1.markDirty();
        }
        else {
            this.touchRight = e.touches[0].identifier;
            let v = new m4m.math.vector2(e.touches[0].clientX, e.touches[0].clientY);
            m4m.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
            if (m4m.math.vec2Length(v) > this.maxScale) {
                m4m.math.vec2Normalize(v, v);
                m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                m4m.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
            }
            else {
                this.joystickRight1.localTranslate.x = e.touches[0].clientX;
                this.joystickRight1.localTranslate.y = e.touches[0].clientY;
            }
            m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
            this.joystickRight1.markDirty();
        }

        if (e.touches[1] != null && e.touches[1].clientX <= this.overlay2d.canvas.pixelWidth / 2 && this.touchLeft == 0) {
            this.touchLeft = e.touches[1].identifier;
            let v = new m4m.math.vector2(e.touches[1].clientX, e.touches[1].clientY);
            m4m.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
            if (m4m.math.vec2Length(v) > this.maxScale) {
                m4m.math.vec2Normalize(v, v);
                m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                m4m.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
            }
            else {
                this.joystickLeft1.localTranslate.x = e.touches[1].clientX;
                this.joystickLeft1.localTranslate.y = e.touches[1].clientY;
            }
            m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
            this.joystickLeft1.markDirty();
        }
        else if (e.touches[1] != null && e.touches[1].clientX > this.overlay2d.canvas.pixelWidth / 2 && this.touchRight == 0) {
            this.touchRight = e.touches[1].identifier;
            let v = new m4m.math.vector2(e.touches[1].clientX, e.touches[1].clientY);
            m4m.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
            if (m4m.math.vec2Length(v) > this.maxScale) {
                m4m.math.vec2Normalize(v, v);
                m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                m4m.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
            }
            else {
                this.joystickRight1.localTranslate.x = e.touches[1].clientX;
                this.joystickRight1.localTranslate.y = e.touches[1].clientY;
            }
            m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
            this.joystickRight1.markDirty();
        }
    }

    /**
     * 当触摸结束
     * @param e 触摸事件
     */
    private onTouchEnd(e: TouchEvent) {
        if (this.touchLeft) {
            var flag = false;
            for (let i = 0; i < e.touches.length; i++) {
                if (this.touchLeft == e.touches[i].identifier) {
                    flag = true;
                }
            }
            if (!flag) {
                this.touchLeft = 0;

                this.joystickLeft1.localTranslate.x = this.joystickLeft0.localTranslate.x;
                this.joystickLeft1.localTranslate.y = this.joystickLeft0.localTranslate.y;
                this.leftAxis.x = 0;
                this.leftAxis.y = 0;
                this.joystickLeft1.markDirty();
            }
        }

        if (this.touchRight) {
            var flag = false;
            for (let i = 0; i < e.touches.length; i++) {
                if (this.touchRight == e.touches[i].identifier) {
                    flag = true;
                }
            }
            if (!flag) {
                this.touchRight = 0;

                this.joystickRight1.localTranslate.x = this.joystickRight0.localTranslate.x;
                this.joystickRight1.localTranslate.y = this.joystickRight0.localTranslate.y;
                this.rightAxis.x = 0;
                this.rightAxis.y = 0;
                this.joystickRight1.markDirty();

                if (this.triggerFunc != null) {
                    this.triggerFunc();
                }
            }
        }
    }

    /**
     * 当触摸移动
     * @param e 触摸事件
     */
    private onTouchMove(e: TouchEvent) {
        if (this.touchLeft != 0) {
            let index = -1;
            if (this.touchLeft == e.touches[0].identifier) {
                index = 0;
            }
            else if (e.touches[1] != null && this.touchLeft == e.touches[1].identifier) {
                index = 1;
            }
            if (index != -1) {
                let v = new m4m.math.vector2(e.touches[index].clientX, e.touches[index].clientY);
                m4m.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
                if (m4m.math.vec2Length(v) > this.maxScale) {
                    m4m.math.vec2Normalize(v, v);
                    m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                    m4m.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
                }
                else {
                    this.joystickLeft1.localTranslate.x = e.touches[index].clientX;
                    this.joystickLeft1.localTranslate.y = e.touches[index].clientY;
                }
                m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
                this.joystickLeft1.markDirty();
            }
        }
        if (this.touchRight != 0) {
            let index = -1;
            if (this.touchRight == e.touches[0].identifier) {
                index = 0;
            }
            else if (e.touches[1] != null && this.touchRight == e.touches[1].identifier) {
                index = 1;
            }
            if (index != -1) {
                let v = new m4m.math.vector2(e.touches[index].clientX, e.touches[index].clientY);
                m4m.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
                if (m4m.math.vec2Length(v) > this.maxScale) {
                    m4m.math.vec2Normalize(v, v);
                    m4m.math.vec2ScaleByNum(v, this.maxScale, v);
                    m4m.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
                }
                else {
                    this.joystickRight1.localTranslate.x = e.touches[index].clientX;
                    this.joystickRight1.localTranslate.y = e.touches[index].clientY;
                }
                m4m.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
                this.joystickRight1.markDirty();
            }
        }
    }

    /**
     * 更新
     * @param delta 帧间时间
     */
    update(delta: number) {
        this.taskmgr.move(delta);
    }
}

namespace demo {
    export class TankGame implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        postQuad: m4m.framework.cameraPostQueue_Quad;
        light: m4m.framework.light;
        heroTank: m4m.framework.transform;
        heroGun: m4m.framework.transform;
        heroSlot: m4m.framework.transform;
        enemyTank: m4m.framework.transform;
        enemyGun: m4m.framework.transform;
        enemySlot: m4m.framework.transform;
        ground: m4m.framework.transform;
        cubes: m4m.framework.transform[] = [];
        walls: m4m.framework.transform[] = [];
        overlay2d: m4m.framework.overlay2D;
        joystick: Joystick;
        taskmgr: m4m.framework.taskMgr = new m4m.framework.taskMgr();

        tankMoveSpeed: number = 4;
        tankRotateSpeed: m4m.math.vector3 = new m4m.math.vector3(0, 72, 0);
        gunRotateSpeed: m4m.math.vector3 = new m4m.math.vector3(0, 150, 0);
        angleLimit: number = 5;

        colVisible: boolean = false;

        private label: HTMLDivElement;
        /**
         * 加载着色器
         * @param laststate 
         * @param state 状态
         */
        private loadShader(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load(`${resRootPath}shader/shader.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
                }
            });
        }

        /**
         * 加载纹理
         * @param laststate 
         * @param state 状态
         */
        private loadTexture(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.app.getAssetMgr().load(`${resRootPath}texture/zg256.png`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
                }
            });
        }

        /**
         * 加载 模型预制体
         * @param laststate 
         * @param state 状态
         */
        private loadHeroPrefab(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            let resName = "tank01";
            this.app.getAssetMgr().load(`${resRootPath}prefab/${resName}/${resName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(`${resName}.prefab.json`, `${resName}.assetbundle.json`) as m4m.framework.prefab;
                    this.heroTank = _prefab.getCloneTrans();
                    this.scene.addChild(this.heroTank);
                    this.heroTank.localScale = new m4m.math.vector3(4, 4, 4);
                    this.heroTank.localTranslate = new m4m.math.vector3(0, 0, 0);

                    var col = this.heroTank.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
                    col.center = new m4m.math.vector3(0, 0.2, 0);
                    col.size = new m4m.math.vector3(0.46, 0.4, 0.54);
                    col.colliderVisible = this.colVisible;

                    this.heroGun = this.heroTank.find("tank_up");
                    this.heroSlot = this.heroGun.find("slot");

                    state.finish = true;
                }
            });
        }

        /**
         * 加载敌人预制体
         * @param laststate 
         * @param state 状态
         */
        private loadEnemyPrefab(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            let resName = "tank02";
            this.app.getAssetMgr().load(`${resRootPath}prefab/${resName}/${resName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    var _prefab: m4m.framework.prefab = this.app.getAssetMgr().getAssetByName(`${resName}.prefab.json`, `${resName}.assetbundle.json`) as m4m.framework.prefab;
                    this.enemyTank = _prefab.getCloneTrans();
                    this.scene.addChild(this.enemyTank);
                    this.enemyTank.localScale = new m4m.math.vector3(4, 4, 4);
                    this.enemyTank.localTranslate = new m4m.math.vector3(0, 0, -6);

                    var col = this.enemyTank.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
                    col.center = new m4m.math.vector3(0, 0.2, 0);
                    col.size = new m4m.math.vector3(0.46, 0.4, 0.54);
                    col.colliderVisible = this.colVisible;

                    this.enemyGun = this.enemyTank.find("tank_up");
                    this.enemySlot = this.enemyGun.find("slot");

                    state.finish = true;
                }
            });
        }

        /**
         * 加载场景
         * @param laststate 
         * @param state 状态
         */
        private loadScene(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            let resName = "test_scene";
            this.app.getAssetMgr().load(`${resRootPath}prefab/${resName}/${resName}.assetbundle.json`, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    var _scene: m4m.framework.rawscene = this.app.getAssetMgr().getAssetByName(`${resName}.scene.json`, `${resName}.assetbundle.json`) as m4m.framework.rawscene;
                    var _root = _scene.getSceneRoot();
                    this.scene.addChild(_root);
                    _root.localTranslate.y = -0.1;
                    for (var i = 0; i < 8; i++) {
                        var tran = _root.find("wall" + i);
                        var col = tran.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
                        col.colliderVisible = this.colVisible;
                        this.walls.push(tran);
                    }

                    this.app.getScene().lightmaps = [];
                    _scene.useLightMap(this.app.getScene());

                    state.finish = true;
                }
            });
        }

        private cameraShock: CameraShock;
        /**
         * 添加相机
         * @param laststate 
         * @param state 状态
         */
        private addCameraAndLight(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            var tranCam = new m4m.framework.transform();
            tranCam.name = "Cam";
            this.scene.addChild(tranCam);
            this.camera = tranCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.1;
            this.camera.far = 200;
            this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3);
            this.cameraShock = tranCam.gameObject.addComponent("CameraShock") as CameraShock;
            tranCam.localTranslate = new m4m.math.vector3(0, 20, -16);
            tranCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            tranCam.markDirty();

            let list: string[] = [
                "标准",
                "马赛克",
                "径向模糊",
                "旋转扭曲",
                "桶模糊",
                "灰度图",
                "棕褐色调",
                "反色",
                "高斯滤波",
                "均值滤波",
                "锐化",
                "膨胀",
                "腐蚀",
                "HDR"
            ];

            var select = document.createElement("select");
            select.style.top = "240px";
            select.style.right = "0px";
            select.style.position = "absolute";
            this.app.container.appendChild(select);
            for (let i = 0; i < list.length; i++) {
                let op = document.createElement("option");
                op.value = i.toString();
                op.innerText = list[i];
                select.appendChild(op);
            }
            select.onchange = () => {
                this.camera.postQueues = [];

                var color = new m4m.framework.cameraPostQueue_Color();
                color.renderTarget = new m4m.render.glRenderTarget(this.scene.webgl, 2048, 2048, true, false);
                this.camera.postQueues.push(color);
                var textcolor = new m4m.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;

                if (select.value == "0") {
                    this.camera.postQueues = [];
                }
                else if (select.value == "1") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("mosaic.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "2") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("radial_blur.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_Level", 25);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "3") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("contort.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_UD", 120);
                    this.postQuad.material.setFloat("_UR", 0.3);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "4") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("barrel_blur.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_Power", 0.3);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "5") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_FilterType", 1);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "6") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_FilterType", 2);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "7") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_FilterType", 3);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "8") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_FilterType", 4);
                    this.postQuad.material.setFloat("_Step", 2);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "9") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_FilterType", 5);
                    this.postQuad.material.setFloat("_Step", 2);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "10") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_FilterType", 6);
                    this.postQuad.material.setFloat("_Step", 0.1);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "11") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_FilterType", 7);
                    this.postQuad.material.setFloat("_Step", 0.3);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "12") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_FilterType", 8);
                    this.postQuad.material.setFloat("_Step", 0.3);
                    this.camera.postQueues.push(this.postQuad);
                }
                else if (select.value == "13") {
                    this.postQuad = new m4m.framework.cameraPostQueue_Quad();
                    this.postQuad.material.setShader(this.scene.app.getAssetMgr().getShader("hdr_quad.shader.json"));
                    this.postQuad.material.setTexture("_MainTex", textcolor);
                    this.postQuad.material.setFloat("_K", 1.5);
                    this.camera.postQueues.push(this.postQuad);
                }
            };

            var tranLight = new m4m.framework.transform();
            tranLight.name = "light";
            this.scene.addChild(tranLight);
            this.light = tranLight.gameObject.addComponent("light") as m4m.framework.light;
            this.light.type = m4m.framework.LightTypeEnum.Direction;
            tranLight.localTranslate.x = 5;
            tranLight.localTranslate.y = 5;
            tranLight.localTranslate.z = -5;
            tranLight.lookatPoint(new m4m.math.vector3(0, 0, 0));
            tranLight.markDirty();

            state.finish = true;
        }

        /**
         * 添加游戏摇杆
         * @param laststate 
         * @param state 状态
         */
        private addJoystick(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            this.overlay2d = new m4m.framework.overlay2D();
            // this.overlay2d.autoAsp = false;
            this.overlay2d.canvas.pixelWidth = window.innerWidth;
            this.overlay2d.canvas.pixelHeight = window.innerHeight;
            this.camera.addOverLay(this.overlay2d);

            this.joystick = new Joystick();
            this.joystick.init(this.app, this.overlay2d);
            this.joystick.triggerFunc = () => {
                if (this.fireTick >= this.fireStep) {
                    this.fireTick = 0;
                    this.fire();
                }
            };

            state.finish = true;
        }

        /**
         * 添加 场景对象
         * @param laststate 
         * @param state 状态
         */
        private addObject(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate) {
            {//add some puppets
                var n = 2;
                for (var i = 0; i < n; i++) {
                    let cube = new m4m.framework.transform();
                    cube.name = "cube" + i;
                    cube.localScale = new m4m.math.vector3(3, 3, 3);
                    cube.localTranslate = new m4m.math.vector3(-2 * (n - 1) + i * 4, 2, 16);
                    this.scene.addChild(cube);
                    let filter = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
                    let smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    filter.mesh = smesh;
                    let renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                    var shader = this.app.getAssetMgr().getShader("light1.shader.json");
                    if (shader != null) {
                        renderer.materials = [];
                        renderer.materials.push(new m4m.framework.material());
                        renderer.materials[0].setShader(shader);
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                        renderer.materials[0].setTexture("_MainTex", texture);
                    }
                    let col = cube.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
                    // col.size = new m4m.math.vector3(1, 1, 1);
                    col.colliderVisible = this.colVisible;
                    cube.markDirty();
                    this.cubes.push(cube);
                }
            }

            state.finish = true;
        }

        private keyMap: { [id: number]: boolean } = {};
        start(app: m4m.framework.application) {
            this.label = document.getElementById("Label") as HTMLDivElement;

            this.app = app;
            this.scene = app.getScene();

            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadTexture.bind(this));
            this.taskmgr.addTaskCall(this.loadHeroPrefab.bind(this));
            this.taskmgr.addTaskCall(this.loadEnemyPrefab.bind(this));
            this.taskmgr.addTaskCall(this.loadScene.bind(this));
            this.taskmgr.addTaskCall(this.addCameraAndLight.bind(this));
            this.taskmgr.addTaskCall(this.addObject.bind(this));
            this.taskmgr.addTaskCall(this.addJoystick.bind(this));

            document.addEventListener("keydown", (e) => { this.keyMap[e.keyCode] = true; });
        }

        update(delta: number) {
            this.taskmgr.move(delta);
            if (this.joystick != null) {
                this.joystick.update(delta);
            }

            this.tankControl(delta);

            this.updateBullet(delta);

            for (var i = 0; i < this.bulletList.length; i++) {
                let col = this.bulletList[i].transform.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
                for (var j = 0; j < this.cubes.length; j++) {
                    let c = this.cubes[j];
                    if (c != null && col.intersectsTransform(c)) {
                        this.scene.removeChild(c);
                        c.dispose();
                        this.bulletList[i].life = 0;
                        break;
                    }
                }
            }

            this.fireTick += delta;
        }

        /**
         * 坦克与的碰撞检测
         * @param tran 节点
         * @returns 
         */
        testTankCol(tran: m4m.framework.transform): boolean {
            var col = tran.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;

            for (var i = 0; i < this.cubes.length; i++) {
                let c = this.cubes[i].gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
                if (c != null && col.obb.intersects(c.obb)) {
                    return true;
                }
            }
            for (var i = 0; i < this.walls.length; i++) {
                let c = this.walls[i].gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
                if (col.obb.intersects(c.obb)) {
                    return true;
                }
            }
            let c = this.enemyTank.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
            if (col.obb.intersects(c.obb)) {
                return true;
            }
            return false;
        }

        tempTran: m4m.framework.transform;
        /**
         * 坦克遥控
         * @param delta 帧间时间
         */
        tankControl(delta: number) {
            if (this.joystick != null) {
                var targetAngle = new m4m.math.vector3();
                var goForward = true;
                if (m4m.math.vec2Length(this.joystick.leftAxis) > 0.05) {// tank rotate
                    let point = new m4m.math.vector3(this.joystick.leftAxis.x, 0, -this.joystick.leftAxis.y);
                    m4m.math.vec3Add(this.heroTank.getWorldTranslate(), point, point);
                    let quat = new m4m.math.quaternion();
                    m4m.math.quatLookat(this.heroTank.getWorldTranslate(), point, quat);
                    m4m.math.quatToEulerAngles(quat, targetAngle);
                    let rotateSpeed = new m4m.math.vector3();
                    m4m.math.vec3ScaleByNum(this.tankRotateSpeed, delta, rotateSpeed);
                    let d = Math.abs(this.heroTank.localEulerAngles.y - targetAngle.y);
                    if (d > 180) {
                        d = 360 - d;
                    }
                    if (d <= 90) {
                        goForward = true;
                    }
                    else {
                        if (targetAngle.y > 0) {
                            targetAngle.y -= 180;
                        }
                        else {
                            targetAngle.y += 180;
                        }
                        goForward = false;
                    }
                    if (d > rotateSpeed.y) {
                        let vec = new m4m.math.vector3();
                        if (this.heroTank.localEulerAngles.y > targetAngle.y && this.heroTank.localEulerAngles.y - targetAngle.y < 180
                            || targetAngle.y > this.heroTank.localEulerAngles.y && targetAngle.y - this.heroTank.localEulerAngles.y >= 180) {
                            m4m.math.vec3Subtract(this.heroTank.localEulerAngles, rotateSpeed, vec);
                        }
                        else {
                            m4m.math.vec3Add(this.heroTank.localEulerAngles, rotateSpeed, vec);
                        }
                        // var temp = new m4m.math.vector3();
                        // m4m.math.vec3Clone(this.heroTank.localEulerAngles, temp);
                        this.heroTank.localEulerAngles = vec;
                        // if (this.testTankCol(this.heroTank))
                        // {
                        //     this.heroTank.localEulerAngles = temp;
                        // }
                    }
                    else {
                        // var temp = new m4m.math.vector3();
                        // m4m.math.vec3Clone(this.heroTank.localEulerAngles, temp);
                        this.heroTank.localEulerAngles = targetAngle;
                        // if (this.testTankCol(this.heroTank))
                        // {
                        //     this.heroTank.localEulerAngles = temp;
                        // }
                    }
                    this.heroTank.markDirty();
                }
                if (m4m.math.vec2Length(this.joystick.leftAxis) > 0.05) {// tank move
                    let speed = 0;
                    if (Math.abs(this.heroTank.localEulerAngles.y - targetAngle.y) < this.angleLimit) {
                        speed = this.tankMoveSpeed * delta;
                    }
                    else {
                        speed = this.tankMoveSpeed * delta * 0.8;
                    }
                    let v = new m4m.math.vector3();
                    this.heroTank.getForwardInWorld(v);
                    m4m.math.vec3ScaleByNum(v, speed, v);
                    if (!goForward) {
                        m4m.math.vec3ScaleByNum(v, -1, v);
                    }
                    let col = this.heroTank.gameObject.getComponent("boxcollider") as m4m.framework.boxcollider;
                    let f = false;
                    let r = false;
                    let l = false;
                    m4m.math.vec3Add(col.obb.center, v, col.obb.center);
                    f = this.testTankCol(this.heroTank);
                    m4m.math.vec3Subtract(col.obb.center, v, col.obb.center);

                    let q = new m4m.math.quaternion();
                    let v1 = new m4m.math.vector3();
                    m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, 45, q);
                    m4m.math.quatTransformVector(q, v, v1);
                    m4m.math.vec3ScaleByNum(v1, 0.5, v1);
                    m4m.math.vec3Add(col.obb.center, v1, col.obb.center);
                    r = this.testTankCol(this.heroTank);
                    m4m.math.vec3Subtract(col.obb.center, v1, col.obb.center);

                    let v2 = new m4m.math.vector3();
                    m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, -45, q);
                    m4m.math.quatTransformVector(q, v, v2);
                    m4m.math.vec3ScaleByNum(v2, 0.5, v2);
                    m4m.math.vec3Add(col.obb.center, v2, col.obb.center);
                    l = this.testTankCol(this.heroTank);
                    m4m.math.vec3Subtract(col.obb.center, v2, col.obb.center);

                    if (!f) {
                        m4m.math.vec3Add(this.heroTank.localTranslate, v, this.heroTank.localTranslate);
                    }
                    else if (!r && l) {
                        m4m.math.vec3Add(this.heroTank.localTranslate, v1, this.heroTank.localTranslate);
                    }
                    else if (r && !l) {
                        m4m.math.vec3Add(this.heroTank.localTranslate, v2, this.heroTank.localTranslate);
                    }
                    this.heroTank.markDirty();
                }
                if (m4m.math.vec2Length(this.joystick.rightAxis) > 0.2) {// gun rotate
                    let point = new m4m.math.vector3(this.joystick.rightAxis.x, 0, -this.joystick.rightAxis.y);
                    m4m.math.vec3Add(this.heroGun.getWorldTranslate(), point, point);
                    let quat = new m4m.math.quaternion();
                    m4m.math.quatLookat(this.heroGun.getWorldTranslate(), point, quat);
                    let vec = new m4m.math.vector3();
                    m4m.math.quatToEulerAngles(quat, vec);
                    m4m.math.vec3Subtract(vec, this.heroTank.localEulerAngles, vec);
                    if (vec.y > 180) {
                        vec.y -= 360;
                    }
                    if (vec.y < -180) {
                        vec.y += 360;
                    }
                    let rotateSpeed = new m4m.math.vector3();
                    m4m.math.vec3ScaleByNum(this.gunRotateSpeed, delta, rotateSpeed);
                    if (Math.abs(this.heroGun.localEulerAngles.y - vec.y) > rotateSpeed.y) {
                        if (this.heroGun.localEulerAngles.y > vec.y && this.heroGun.localEulerAngles.y - vec.y < 180
                            || vec.y > this.heroGun.localEulerAngles.y && vec.y - this.heroGun.localEulerAngles.y >= 180) {
                            m4m.math.vec3Subtract(this.heroGun.localEulerAngles, rotateSpeed, vec);
                        }
                        else {
                            m4m.math.vec3Add(this.heroGun.localEulerAngles, rotateSpeed, vec);
                        }
                        this.heroGun.localEulerAngles = vec;
                    }
                    else {
                        this.heroGun.localEulerAngles = vec;
                    }
                    this.heroGun.markDirty();
                }

                if (this.camera != null) {
                    this.camera.gameObject.transform.localTranslate.x = this.heroTank.localTranslate.x;
                    this.camera.gameObject.transform.localTranslate.y = this.heroTank.localTranslate.y + 20;
                    this.camera.gameObject.transform.localTranslate.z = this.heroTank.localTranslate.z - 16;
                    this.camera.gameObject.transform.markDirty();
                }

            }

        }

        bulletId = 0;
        bulletList = [];
        bulletSpeed = 30;
        fireStep = 0.5;
        fireTick = 0;
        /**
         * 开火
         */
        private fire() {
            var tran = new m4m.framework.transform();
            tran.name = "bullet" + this.bulletId;
            tran.localScale = new m4m.math.vector3(0.2, 0.2, 0.2);
            tran.localTranslate = this.heroSlot.getWorldTranslate();
            this.scene.addChild(tran);
            var filter = tran.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            var smesh = this.app.getAssetMgr().getDefaultMesh("sphere");
            filter.mesh = smesh;
            var renderer = tran.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            var shader = this.app.getAssetMgr().getShader("light1.shader.json");
            if (shader != null) {
                renderer.materials = [];
                renderer.materials.push(new m4m.framework.material());
                renderer.materials[0].setShader(shader);
                var texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                renderer.materials[0].setTexture("_MainTex", texture);
            }
            var col = tran.gameObject.addComponent("boxcollider") as m4m.framework.boxcollider;
            col.size = new m4m.math.vector3(0.2, 0.2, 0.2);
            col.colliderVisible = this.colVisible;
            tran.markDirty();

            var dir = new m4m.math.vector3();
            this.heroGun.getForwardInWorld(dir);
            let bullet = {
                id: this.bulletId++,
                transform: tran,
                direction: dir,
                life: 3
            };
            this.bulletList.push(bullet);

            // this.cameraShock.play(1, 0.5, true);
        }

        /**
         * 更新子弹
         * @param delta 
         */
        private updateBullet(delta: number) {
            for (var i = 0; i < this.bulletList.length; i++) {
                var b = this.bulletList[i];
                var v = m4m.math.pool.new_vector3();
                var speed = m4m.math.pool.new_vector3();
                m4m.math.vec3ScaleByNum(b.direction, this.bulletSpeed * delta, speed);
                m4m.math.vec3Add(b.transform.localTranslate, speed, v);
                b.transform.localTranslate = v;
                b.transform.markDirty();
                b.life -= delta;

            }
            for (var i = 0; i < this.bulletList.length; i++) {
                var b = this.bulletList[i];
                if (b.life <= 0) {
                    this.bulletList.splice(i, 1);
                    this.scene.removeChild(b.transform);
                    b.transform.dispose();
                }
            }

        }

    }

}