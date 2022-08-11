/// <reference path="../lib/dat.gui.d.ts" />

namespace m4m.math {
    export interface color {
        "__class__"?: "m4m.math.color"
    }

    export interface vector3 {
        "__class__"?: "m4m.math.vector3"
    }
}

/** 
 * 粒子系統示例
 */
class test_ParticleSystem implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;

    private _particles = ["ParticleAdditive", "fastshell_ps", "Particle_Sweat_Disable", "Particle_Dust_Disable", "ParticleAlphaBlended", "ps_inheritVelocity", "ParticleSystem", "ps_noise", "Fire", "Flames", "shark-levelup"];
    private _particle: m4m.framework.transform;

    private _isMove = false;
    private _particleStartPosition = new m4m.math.vector3();
    private _particleCurrentPosition = new m4m.math.vector3();
    private _moveRadius = 5;
    private _moveAngle = 0;
    private _moveAngleSpeed = 1;

    async start(app: m4m.framework.application) {
        this.app = app;
        var scene = this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();

        //雾效
        // scene.fog = new m4m.framework.Fog();
        // scene.fog._Start = 1;
        // scene.fog._End = 150;
        // // scene.fog._Color = new m4m.math.vector4(52 / 255, 137 / 255, 155 / 255, 0.75);// new m4m.math.vector4(0 / 255, 152 / 255, 160 / 255, 1);
        // scene.fog._Color = new m4m.math.vector4(5 / 255, 166 / 255, 182 / 255, 1);

        m4m.framework.assetMgr.openGuid = false;

        await demoTool.loadbySync(`${resRootPath}shader/shader.assetbundle.json`, this.astMgr);
        await datGui.init();

        //
        this.setGUI();
        //
        this.init();
    }

    setGUI() {
        if (!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'particleName', this._particles);
        gui.add(this, '_isMove');
        gui.add(this, '_moveRadius', 1, 50, 1);
        gui.add(this, '_moveAngleSpeed', -10, 10, 0.2);
        gui.add(this, 'play');
        gui.add(this, 'stop');
    }

    play() {
        this._particle.gameObject.getComponentsInChildren("ParticleSystem").forEach(v => {
            var ps: m4m.framework.ParticleSystem = <any>v;
            ps.play();

            ps.addListener("particleCompleted", (ps) => {
                console.log("粒子系统播放完成！");
            }, this);

        })
    }

    stop() {
        this._particle.gameObject.getComponentsInChildren("ParticleSystem").forEach(v => {
            var ps: m4m.framework.ParticleSystem = <any>v;
            ps.stop();
        })
    }

    private get particleName() {
        return this._particleName;
    }
    private set particleName(v) {
        this._showParticle(v);
        this._particleName = v;
    }
    private _particleName: string = "ps_inheritVelocity";

    private init() {
        //相机-----------------------------------
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 1000;
        this.camera.fov = Math.PI * 2 / 3;
        this.camera.backgroundColor = new m4m.math.color(0.2784, 0.2784, 0.2784, 1);
        objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 10;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0)

        this._showParticle(this._particles[0]);
        // this.initParticleSystem();
    }

    private async _showParticle(res: string) {
        if (this._particle) {
            this.scene.removeChild(this._particle);
            this._particle = null;
        }

        await demoTool.loadbySync(`${resRootPath}particleSystem/${res}/${res}.assetbundle.json`, this.astMgr);

        let cubeP = this.astMgr.getAssetByName(`${res}.prefab.json`, `${res}.assetbundle.json`) as m4m.framework.prefab;
        let cubeTran = cubeP.getCloneTrans();

        this._particle = new m4m.framework.transform();
        this._particle.addChild(cubeTran);

        this.scene.addChild(this._particle);

        this._particleStartPosition = new m4m.math.vector3();
        m4m.math.vec3Clone(this._particle.localPosition, this._particleStartPosition);

        this.play();
    }

    update(delta: number) {
        if (!this._particle) return;

        if (this._isMove) {
            var offsetX = Math.cos(this._moveAngle / 180 * Math.PI) * this._moveRadius;
            var offsetZ = Math.sin(this._moveAngle / 180 * Math.PI) * this._moveRadius;

            // this._particleCurrentPosition.x = this._particleStartPosition.x + offsetX;
            this._particleCurrentPosition.y = this._particleStartPosition.y;
            this._particleCurrentPosition.z = this._particleStartPosition.z + offsetZ;

            this._particle.localPosition = this._particleCurrentPosition;

            this._moveAngle += this._moveAngleSpeed;
        } else {
            this._particle.localPosition = this._particleStartPosition;
        }
    }
}