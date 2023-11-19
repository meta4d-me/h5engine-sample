class demoList implements IState{
    private static funArr : any[] = [];
    /**
     * 添加按钮
     * @param title 按钮标签 
     * @param demo 执行函数
     */
    static addBtn(title:string, demo: Function){
        if(!title || !demo) return;
        let p = [title,demo];
        this.funArr.push(p);
    }
   
    start(app){
        demoList.funArr.forEach(element => {
            main.instance.addBtn(element[0],element[1]);
        });
    }
    update(){

    }
}