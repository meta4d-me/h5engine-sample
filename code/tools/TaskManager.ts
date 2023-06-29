/**
 * 任务函数主体
 * @param cb  任务完成回调
 */
 type TaskFun = (cb: Function) => void;

/**
 * 任务 管理器
 * 单个任务 ： Function(cb):void;
 */
class TaskManager {
    // private static onTaskClear() {
    //     console.log(`任务完全清空！`);
    // }

    // public static addTask(task: TaskFun) {
    //     task(this.onTaskClear);
    // }

    /**
     * 创建串行任务
     * @param tasks 任务函数(多参数)
     */
    public static serial(...tasks: TaskFun[]): TaskFun {
        return this.serialArray(tasks);
    }

    /**
     * 创建串行任务
     * @param tasks 任务函数队列  
     */
    public static serialArray(tasks: TaskFun[]): TaskFun {
        let _tasks = tasks.concat();    //copy 一个
        let _cb : Function;
        let result: TaskFun = (cb) => {
            if (!_cb) { _cb = cb; }
            let t = _tasks.shift();
            if (t) {
                t(result);
            } else {
                _cb();
            }
        };
        return result;
    }

    /**
     * 创建并行任务
     * @param tasks 任务函数(多参数)
     */
    public static parallel(...tasks: TaskFun[]): TaskFun {
        return this.parallelArray(tasks);
    }

    /**
     * 创建并行任务
     * @param tasks 任务函数队列
     */
    public static parallelArray(tasks: TaskFun[]): TaskFun {
        let _tasks = tasks.concat();    //copy 一个
        let result: TaskFun = (cb) => {
            let len = _tasks.length;
            let count = 0;
            let counting = () => {
                count++;
                if (count >= len) {
                    cb();
                }
            };

            if (len > 0) {  //并行处理任务
                for (let i = 0; i < len; i++) {
                    let t = tasks[i];
                    t(counting);
                }
            } else {    //任务为空直接跳过
                cb();
            }
        };
        return result;
    }
}