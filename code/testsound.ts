namespace t
{

    export class test_sound implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.transform;
        once1: AudioBuffer = null;
        once2: AudioBuffer = null;
        /**
         * 加载声音信息
         */
        private loadSoundInfe()
        {
            {
                //接收器
                let listener = this.camera.gameObject.addComponent("AudioListener") as m4m.framework.AudioListener;
                //播放器1
                let tr = new m4m.framework.transform();
                let player: m4m.framework.AudioPlayer = tr.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_AUDIOPLAYER) as m4m.framework.AudioPlayer;
                player.be3DSound = false;
                // this.app.getScene().addChild(tr);
                this.scene.addChild(tr);
                tr.localTranslate = new m4m.math.vector3(0, 0, 0);
                {
                    var button = document.createElement("button");
                    button.textContent = "play once1";
                    button.onclick = () =>
                    {
                        m4m.framework.AudioEx.instance().loadAudioBuffer(`${resRootPath}audio/sound1.mp3`, (buf, err) =>
                        {
                            this.once1 = buf;
                            // player.stop();
                            player.play(this.once1, false, 10);
                        });
                    };
                    button.style.top = "130px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }

                {
                    var button = document.createElement("button");
                    button.textContent = "play once2";
                    button.onclick = () =>
                    {
                        m4m.framework.AudioEx.instance().loadAudioBuffer(`${resRootPath}audio/sound2.mp3`, (buf, err) =>
                        {
                            this.once2 = buf;
                            player.play(this.once2, true, 1);
                        });
                    };
                    button.style.top = "130px";
                    button.style.left = "90px"
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }

                {
                    var button = document.createElement("button");
                    button.textContent = "play loop";
                    button.onclick = () =>
                    {
                        m4m.framework.AudioEx.instance().loadAudioBuffer(`${resRootPath}audio/music1.mp3`, (buf, err) =>
                        {
                            player.play(buf, false, 1);
                        });
                    };

                    button.style.top = "160px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }

                {
                    var button = document.createElement("button");
                    button.textContent = "stop loop";
                    button.onclick = () =>
                    {
                        player.stop();
                    };
                    button.style.top = "160px";
                    button.style.left = "90px"
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    document.body.appendChild(document.createElement("p"));//这句话的作用？
                    var input = document.createElement("input");
                    input.type = "range";
                    input.valueAsNumber = 5;
                    player.volume = input.valueAsNumber / 100;
                    input.oninput = (e) =>
                    {
                        player.volume = input.valueAsNumber / 100;
                    };
                    input.style.top = "190px";
                    input.style.position = "absolute";
                    this.app.container.appendChild(input);
                }

            }
        }

        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            this.camera = util.addCamera(this.scene)
            this.loadSoundInfe();
            m4m.framework.AudioEx.instance().clickInit();
        }

        update(delta: number)
        {
        }
    }

}