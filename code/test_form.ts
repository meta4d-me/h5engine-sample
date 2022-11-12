

class test_form implements IState{
    static instance: test_form;
    app: m4m.framework.application;

    
    
    start(app: m4m.framework.application)
    {
        console.log("test_form onStart");
        if (!test_form.instance) test_form.instance = this;
        console.log("test_form onStart");
        //this.app = app;  
        
        

        var request=new XMLHttpRequest();//建立request请求
            
        request.open('post','http://127.0.0.1:81/examples/engineExample/server.php');//发送对象是server.php 发送post
        
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');//请求头 默认即可
        
        var width:number =4;
        var height:number = 210;
        var name:string = "210.data";
        var data:any = [1.0, 2.0, 3.0, 4.0];
        var szParam = "width="+ width + "&height=" + height + "&name=" + name + "&data=" + data;
        request.send(szParam);
        //确认接收消息
        request.onreadystatechange=function () {
            // readyState=4为php收到并返回值 status为返回字段为200火304
            if(request.readyState==4&&(request.status==200||request.status==304)){
                //弹出窗口显示php返回的值
                alert(request.responseText);
            };
        }
    }
    update(delta: number)
    {
        
    }
    

}