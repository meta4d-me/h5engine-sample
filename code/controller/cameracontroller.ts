/**
 * 相机控制器
 */
class CameraController {
        private static g_this: CameraController;
        /**
         * 单实例对象
         * @returns CameraController实例
         */
        public static instance() {
            if (CameraController.g_this == null) {
                CameraController.g_this = new CameraController();
            }
            return CameraController.g_this;
        }
        gameObject: m4m.framework.gameObject;
        app: m4m.framework.application;
        target: m4m.framework.camera;
        moveSpeed: number = 10;
        movemul: number = 5;
        wheelSpeed: number = 1;
        rotateSpeed: number = 0.1;
        keyMap: { [id: number]: boolean } = {};
        beRightClick: boolean = false;
        /**
         * 更新
         * @param delta 帧间时间（s）
         */
        update(delta: number) {
            if (this.beRightClick) {
                this.doMove(delta);
            }
        }

        rotAngle: m4m.math.vector3;
        isInit: boolean = false;
        /**
         * 初始化
         * @param app 引擎app 
         * @param target 相机
         */
        init(app: m4m.framework.application, target: m4m.framework.camera) {
            this.isInit = true;
            this.app = app;
            this.target = target;
            this.rotAngle = new m4m.math.vector3();
            m4m.math.quatToEulerAngles(this.target.gameObject.transform.localRotate, this.rotAngle);
            this.app.webgl.canvas.addEventListener("mousedown", (ev: MouseEvent) => {
                this.checkOnRightClick(ev);
            }, false);
            this.app.webgl.canvas.addEventListener("mouseup", (ev: MouseEvent) => {
                this.beRightClick = false;
            }, false);
            this.app.webgl.canvas.addEventListener("mousemove", (ev: MouseEvent) => {
                if (this.beRightClick) {
                    this.doRotate(ev.movementX, ev.movementY);
                }
            }, false);
            this.app.webgl.canvas.addEventListener("keydown", (ev: KeyboardEvent) => {
                this.keyMap[ev.keyCode] = true;
            }, false);
            this.app.webgl.canvas.addEventListener("keyup", (ev: KeyboardEvent) => {
                this.moveSpeed = 10;
                this.keyMap[ev.keyCode] = false;
            }, false);

            if (navigator.userAgent.indexOf('Firefox') >= 0)
            {
                this.app.webgl.canvas.addEventListener("DOMMouseScroll", (ev: WheelEvent) => {
                    this.doMouseWheel(ev,true);
                }, false);

            } else
            {
                this.app.webgl.canvas.addEventListener("mousewheel", (ev: WheelEvent) => {
                    this.doMouseWheel(ev,false);
                }, false);
            }
            this.app.webgl.canvas.addEventListener("mouseout", (ev: WheelEvent) => {
                this.beRightClick = false;
            }, false);
            document.oncontextmenu = (ev) => {
                ev.preventDefault();
            }
        }

        private moveVector: m4m.math.vector3 = new m4m.math.vector3(0, 0, 1);
        /**
         * 执行移动
         * @param delta  帧间时间（s）
         */
        doMove(delta: number) {
            if (this.target == null)
                return;
            //w
            if ((this.keyMap[m4m.framework.NumberUtil.KEY_W] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_W])
                || (this.keyMap[m4m.framework.NumberUtil.KEY_w] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_w])) {
                this.moveSpeed += this.movemul * delta;
                this.target.gameObject.transform.getForwardInWorld(this.moveVector);
                m4m.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
                m4m.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
            }
            //s
            if ((this.keyMap[m4m.framework.NumberUtil.KEY_S] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_S])
                || (this.keyMap[m4m.framework.NumberUtil.KEY_s] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_s])) {
                this.moveSpeed += this.movemul * delta;
                this.target.gameObject.transform.getForwardInWorld(this.moveVector);
                m4m.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
                m4m.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
            }

            //a
            if ((this.keyMap[m4m.framework.NumberUtil.KEY_A] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_A])
                || (this.keyMap[m4m.framework.NumberUtil.KEY_a] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_a])) {
                this.moveSpeed += this.movemul * delta;
                this.target.gameObject.transform.getRightInWorld(this.moveVector);
                m4m.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
                m4m.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
            }
            //d
            if ((this.keyMap[m4m.framework.NumberUtil.KEY_D] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_D])
                || (this.keyMap[m4m.framework.NumberUtil.KEY_d] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_d])) {
                this.moveSpeed += this.movemul * delta;
                this.target.gameObject.transform.getRightInWorld(this.moveVector);
                m4m.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
                m4m.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
            }

            //q
            if ((this.keyMap[m4m.framework.NumberUtil.KEY_Q] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_Q])
                || (this.keyMap[m4m.framework.NumberUtil.KEY_q] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_q]))
            {
                this.moveSpeed += this.movemul * delta;
                this.target.gameObject.transform.getUpInWorld(this.moveVector);
                m4m.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
                m4m.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
            }
            //e
            if ((this.keyMap[m4m.framework.NumberUtil.KEY_E] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_E])
                || (this.keyMap[m4m.framework.NumberUtil.KEY_e] != undefined && this.keyMap[m4m.framework.NumberUtil.KEY_e]))
            {
                this.moveSpeed += this.movemul * delta;
                this.target.gameObject.transform.getUpInWorld(this.moveVector);
                m4m.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
                m4m.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
            }

            this.target.gameObject.transform.markDirty();
        }
        /**
         * 执行旋转
         * @param rotateX 旋转x 
         * @param rotateY 旋转y
         */
        doRotate(rotateX: number, rotateY: number) {
            this.rotAngle.x += rotateY * this.rotateSpeed;
            this.rotAngle.y += rotateX * this.rotateSpeed;

            this.rotAngle.x %= 360;
            this.rotAngle.y %= 360;

            m4m.math.quatFromEulerAngles(this.rotAngle.x, this.rotAngle.y, this.rotAngle.z, this.target.gameObject.transform.localRotate);
        }

        /**
         * 执行注视
         * @param trans 注视目标
         */
        lookat(trans: m4m.framework.transform) {
            this.target.gameObject.transform.lookat(trans);
            this.target.gameObject.transform.markDirty();

            m4m.math.quatToEulerAngles(this.target.gameObject.transform.localRotate, this.rotAngle);
        }

        /**
         * 检查 当鼠标右键点击
         * @param mouseEvent 鼠标事件
         * @returns 是点击？
         */
        checkOnRightClick(mouseEvent: MouseEvent) {
            var value = mouseEvent.button;
            if (value == 2) {
                //alert('点击的是鼠标右键');
                this.beRightClick = true;
                return true;
            } else if (value == 0) {
                this.beRightClick = false;
                //alert('点击的是鼠标左键');
                return false;
            }
        }

        /**
         * 执行鼠标中间滚轮滚动
         * @param ev 中间滚轮事件
         * @param isFirefox 是Firefox？
         */
        private doMouseWheel(ev: WheelEvent, isFirefox: boolean) {
            if (!this.target)
                return;
            if (this.target.opvalue == 0) {
                //正交相机
            }
            else //if (this.target.opvalue == 1)
            {
                //透视相机
                this.target.gameObject.transform.getForwardInWorld(this.moveVector);
                if (isFirefox)
                {
                    m4m.math.vec3ScaleByNum(this.moveVector, this.wheelSpeed * (ev.detail * (-0.5)), this.moveVector);
                } else
                {
                    m4m.math.vec3ScaleByNum(this.moveVector, this.wheelSpeed * ev.deltaY * (-0.01), this.moveVector);
                }
                m4m.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
                this.target.gameObject.transform.markDirty();

            }
        }
        /**
         * 移除
         */
        remove() {

        }

    }