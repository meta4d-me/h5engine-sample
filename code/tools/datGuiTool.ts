// declare let Promise;
/**
 * datGui 工具类
 * 
 * dat使用教程 @see http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
 */
class datGui
{

    private static _inited = false;
    static async init()
    {
        await this.loadJs();
        this._inited = true;
    }

    //加载 js
    private static loadJs()
    {
        let datUrl = `./lib/dat.gui.js`;
        let p = new m4m.threading.gdPromise<any>((resolve, reason) =>
        {
            m4m.io.loadText(datUrl, (txt) =>
            {
                let isok = eval(txt);
                setTimeout(() =>
                {
                    resolve();
                    console.warn(dat);
                }, 0);
            });
        });
        return p;
    }

    /** 使用样例 */
    static example()
    {
        let FizzyText = function ()
        {
            this.message = 'dat.gui';
            this.speed = 0.8;
            this.displayOutline = false;
            this.explode = function () { console.log(`do explode`) };
            // Define render logic ...
        };

        let text = new FizzyText();
        let gui = new dat.GUI();
        gui.add(text, 'message');
        gui.add(text, 'speed', -5, 5);
        gui.add(text, 'displayOutline');
        gui.add(text, 'explode');
    }

}