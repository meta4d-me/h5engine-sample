class test_uimove implements IState
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(0, 10, -10);
        // objCam.lookat(cube);
        objCam.markDirty();//标记为需要刷新
        this.test();
    }


    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
    }

    private test()
    {
        let parentRect: Rect = new Rect();
        parentRect.width = 600;
        parentRect.height = 400;
        parentRect.children = [];

        let childRect: Rect = new Rect();
        childRect.width = 300;
        childRect.height = 200;
        parentRect.children.push(childRect);
        childRect["_parent"] = parentRect;
        childRect.alignType = AlignType.CENTER;
        parentRect.layout();


        childRect.localEulerAngles = new m4m.math.vector3(0, 90, 0);
        let matrix = m4m.math.pool.new_matrix();
        let qua = m4m.math.pool.new_quaternion();
        let vec = m4m.math.pool.new_vector3();
        
        m4m.math.quatFromEulerAngles(childRect.localEulerAngles.x, childRect.localEulerAngles.y, childRect.localEulerAngles.z, qua);
        m4m.math.vec3Add(childRect.localTranslate, childRect.alignPos, vec);
        m4m.math.matrixMakeTransformRTS(vec, childRect.localScale, qua, matrix);
        m4m.math.pool.delete_vector3(vec);
        m4m.math.pool.delete_quaternion(qua);
        console.log(matrix.toString());
        for (let i = 0; i < childRect.points.length; i++)
        {
            console.log(i + " before: " + childRect.points[i]);
            m4m.math.matrixTransformVector3(childRect.points[i], matrix, childRect.points[i]);
            console.log(i + " after: " + childRect.points[i]);
        }
        m4m.math.pool.delete_matrix(matrix);
        console.log(matrix.toString());
    }
}

class Rect extends m4m.framework.transform
{
    public width: number;
    public height: number;
    public offset: m4m.math.vector3 = new m4m.math.vector3();
    public get bParent(){ return (this.parent as Rect)}
    public children: Rect[] = [];
    public alignType: AlignType = AlignType.NONE;
    public points: m4m.math.vector3[] = [];

    public alignPos: m4m.math.vector3 = new m4m.math.vector3();

    public layout(): void
    {
        if (this.parent != null && this.alignType != null)
        {
            switch (this.alignType)
            {
                case AlignType.CENTER:
                    // this.alignPos = new m4m.math.vector3((this.parent.width - this.width) / 2, (this.parent.height - this.height) / 2);
                    this.alignPos = new m4m.math.vector3(0, 0, 0);
                    break;
                case AlignType.LEFT:
                    this.alignPos = new m4m.math.vector3(0, (this.bParent.height - this.height) / 2);
                    break;
                case AlignType.RIGHT:
                    this.alignPos = new m4m.math.vector3(this.bParent.width - this.width, (this.bParent.height - this.height) / 2);
                    break;
                case AlignType.TOP:
                    this.alignPos = new m4m.math.vector3((this.bParent.width - this.width) / 2, 0);
                    break;
                case AlignType.BOTTOM:
                    this.alignPos = new m4m.math.vector3((this.bParent.width - this.width) / 2, this.bParent.height - this.height);
                    break;
                case AlignType.TOP_LEFT:
                    this.alignPos = new m4m.math.vector3(0, 0);
                    break;
                case AlignType.BOTTOM_LEFT:
                    this.alignPos = new m4m.math.vector3(0, this.bParent.height - this.height);
                    break;
                case AlignType.TOP_RIGHT:
                    this.alignPos = new m4m.math.vector3(this.bParent.width - this.width, 0);
                    break;
                case AlignType.BOTTOM_RIGHT:
                    this.alignPos = new m4m.math.vector3(this.bParent.width - this.width, this.bParent.height - this.height);
                    break;

            }
        }
        let pos: m4m.math.vector3 = m4m.math.pool.new_vector3();
        m4m.math.vec3Add(this.alignPos, this.localTranslate, pos);
        this.points[0] = new m4m.math.vector3(pos.x - this.width / 2, pos.y + this.height / 2, pos.z);
        this.points[1] = new m4m.math.vector3(pos.x - this.width / 2, pos.y - this.height / 2, pos.z);
        this.points[2] = new m4m.math.vector3(pos.x + this.width / 2, pos.y - this.height / 2, pos.z);
        this.points[3] = new m4m.math.vector3(pos.x + this.width / 2, pos.y - this.height / 2, pos.z);

        for (var i: number = 0; i < this.children.length; i++)
        {
            this.children[i].layout();
        }
    }
}

enum AlignType
{
    NONE,
    CENTER,
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
    TOP_LEFT,
    BOTTOM_LEFT,
    TOP_RIGHT,
    BOTTOM_RIGHT
}