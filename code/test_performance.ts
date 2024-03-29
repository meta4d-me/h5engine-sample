// 性能测试 
namespace demo
{
    export class test_performance implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        assetMgr:m4m.framework.assetMgr;
        camera: m4m.framework.camera;
        camTran: m4m.framework.transform;
        start(app: m4m.framework.application)
        {
            this.app = app;
            this.scene = app.getScene();
            this.assetMgr = this.app.getAssetMgr();

            // this.camTran = new m4m.framework.transform();
            // this.camTran.name = "Cam";
            // this.scene.addChild(this.camTran);
            // this.camera = this.camTran.gameObject.addComponent("camera") as m4m.framework.camera;
            // this.camera.near = 0.001;
            // this.camera.far = 5000;
            // this.camera.backgroundColor = new m4m.math.color(0.3, 0.3, 0.3);
        }

        cubes : m4m.framework.transform []= []; 
        count = 500 ;
        all = 0;
        /**
         * 尝试添加
         */
        tryadd(){
            let max = 2000; 
            let maxcc = 0;
            let cc = 0;
            let temp :m4m.framework.transform;
            while( maxcc < max){
                let tran = new m4m.framework.transform();
                if(!temp){
                    temp = tran;
                    this.scene.addChild(tran);
                }else{
                    temp.addChild(tran);
                    cc++
                    if(cc >= 10){
                        cc= 0;
                        temp = null;
                    }
                } 
                this.cubes.push(tran);
                maxcc ++;
            }
            this.all += max;
        }

        update(delta: number)
        {
            if(this.count * this.count > this.all){
                this.tryadd();
            }else{
                console.error(` 所有 trans 加載完畢  old  `);
            }

            let c =0;
            while(c< 1000){
                this.randome();
                c++;
            }
        }

        /**
         * 随机一个
         */
        randome(){
            let idx = Math.floor(Math.random() * this.cubes.length);
            let cube = this.cubes[idx];
            //local 
            cube.localTranslate.x += Math.random()  * 10;
            cube.localScale.x = cube.localScale.y;
            cube.localRotate.z = cube.localRotate.x;
            let temp = cube.getWorldTranslate();
            temp.y += Math.random()  * 10;
            //world 
            cube.getWorldScale();
            cube.setWorldPosition(temp);
            cube.localEulerAngles.x = Math.random()  * 10;
            cube.localEulerAngles = cube.localEulerAngles;
            cube.getWorldRotate();
            cube.markDirty();
            
        }

    }

}