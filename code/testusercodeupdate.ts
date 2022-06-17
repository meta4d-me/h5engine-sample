@m4m.reflect.userCode
class testUserCodeUpdate implements m4m.framework.IUserCode
{
    beExecuteInEditorMode: boolean = false;
    trans: m4m.framework.transform;
    timer: number = 0;
    app: m4m.framework.application;
    onStart(app: m4m.framework.application)
    {
        this.app = app;
    }
    onUpdate(delta: number)
    {
        if (this.trans == null || this.trans == undefined)
        {
            this.trans = this.app.getScene().getChildByName("Cube");
        }
        if (this.trans == null || this.trans == undefined)
            return;
        this.timer += delta * 15;
        m4m.math.quatFromAxisAngle(new m4m.math.vector3(0, 1, 0), this.timer, this.trans.localRotate);
        this.trans.markDirty();
    }
    isClosed(): boolean
    {
        return false;
    }
}