class localSave
{
    private static _instance: localSave;
    public static get Instance(): localSave
    {
        if (!this._instance)
        {
            this._instance = new localSave();
        }
        return this._instance;
    }
    public localServerPath: string;// = "http://localhost:25888";

    /**
     * 字符串转 utf8字符数据
     * @param str 字符串转
     * @returns utf8字符数据
     */
    stringToUtf8Array(str: string): number[]
    {
        var bstr: number[] = [];
        for (var i = 0; i < str.length; i++)
        {
            var c = str.charAt(i);
            var cc = c.charCodeAt(0);
            if (cc > 0xFFFF)
            {
                throw new Error("InvalidCharacterError");
            }
            if (cc > 0x80)
            {
                if (cc < 0x07FF)
                {
                    var c1 = (cc >>> 6) | 0xC0;
                    var c2 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2);
                }
                else
                {
                    var c1 = (cc >>> 12) | 0xE0;
                    var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                    var c3 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2, c3);
                }
            }
            else
            {
                bstr.push(cc);
            }
        }
        return bstr;
    }

    /**
     * 文件 字符转串 blob数据
     * @param string 字符转串数据
     * @returns blob数据
     */
    file_str2blob(string: string): Blob
    {
        var u8 = new Uint8Array(this.stringToUtf8Array(string));
        var blob = new Blob([u8]);
        return blob;
    }

    /**
     * 文件 utf8数据 转串 blob数据
     * @param array utf8数据
     * @returns blob数据
     */
    file_u8array2blob(array: Uint8Array): Blob
    {
        var blob = new Blob([array]);
        return blob;
    }

    /**
     * 保存
     * @param path 路径
     * @param file 文件
     * @returns 
     */
    save(path: string, file: Blob | File): number
    {
        var req = new XMLHttpRequest();//ness
        //用同步方法，本地操作
        req.open("POST", this.localServerPath + "/hybirdapi/upload" + "?r=" + Math.random(), false);

        var fdata = new FormData();
        fdata.append("path", path);
        fdata.append("file", file);
        req.send(fdata);
        var json = JSON.parse(req.responseText);
        if (json["code"] != 0)
            throw new Error(json["error"]);
        return json["code"];
    }

    /**
     * 执行开始 Direct模式
     * @param exec exe 字符串
     * @param path 路径
     * @param argc 参数
     */
    startDirect(exec: string, path: string, argc: string): any
    {
        var req = new XMLHttpRequest();//ness
        //用同步方法，本地操作
        req.open("GET", this.localServerPath + "/hybirdapi/startdirect" +
            "?exec=" + exec +
            "&path=" + path +
            "&argc=" + argc +
            "&r=" + Math.random(), false);
        req.send(null);
        var json = req.responseText;
        return json;
    }

    /**
     * 执行开始
     * @param path 路径
     * @returns json
     */
    start(path: string): any
    {
        var req = new XMLHttpRequest();//ness
        //用同步方法，本地操作
        req.open("GET", this.localServerPath + "/hybirdapi/start?path=" + path + "&r=" + Math.random(), false);
        req.send(null);
        var json = req.responseText;
        return json;
    }

    /**
     * 开始 不等待
     * @param path  路径
     * @param fun  回调函数
     */
    startnowait(path: string, fun: (_txt: string, _err: Error) => void = null): any
    {
        var req = new XMLHttpRequest();//ness
        //用同步方法，本地操作
        req.open("GET", this.localServerPath + "/hybirdapi/start?path=" + path + "&r=" + Math.random(), true);
        req.onreadystatechange = (ev) =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    if (fun != null)
                        fun(null, new Error("got a 404:" + path));
                    return;
                }
                if (fun != null)
                    fun(req.responseText, null);
            }
        };
        req.onerror = () =>
        {
            if (fun != null)
                fun(null, new Error("onerr in req:"));
        };
        req.send(null);
    }

    // load(path: string, fun: (_url: string, _txt: string, _err: Error) => void)
    // {
    //     let url = this.localServerPath + "/res/" + path;


    //     let req = new XMLHttpRequest();
    //     req.open("GET", url);
    //     //req.withCredentials = true;
    //     req.onreadystatechange = () =>
    //     {
    //         if (req.readyState == 4)
    //         {
    //             if (req.status == 404)
    //                 fun(url, null, new Error("onerr 404"));
    //             else
    //                 fun(url, req.responseText, null);
    //         }
    //     };
    //     req.onerror = () =>
    //     {
    //         fun(url, null, new Error("onerr in req:"));
    //     };
    //     req.send();
    // }
    /**
     * 立即加载文本
     * @param url url
     * @param fun 回调函数
     */
    loadTextImmediate(url: string, fun: (_txt: string, _err: Error) => void)
    {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        //req.withCredentials = true;
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }
                fun(req.responseText, null);
            }
        };
        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }

    /**
     * 立即加载Blob数据
     * @param url url
     * @param fun 回调函数
     */
    loadBlobImmediate(url: string, fun: (_blob: Blob, _err: Error) => void): void
    {
        var req = new XMLHttpRequest();

        req.open("GET", url);
        req.responseType = "blob";//ie 一定要在open之后修改responseType
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }

                fun(req.response, null);
            }
        };
        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }

}