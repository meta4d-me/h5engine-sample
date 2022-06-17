class demoList implements IState{
    private static funArr : any[] = [];

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