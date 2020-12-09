package demo_template;

public abstract class BenzModel {
    abstract void start();

    abstract void stop();

    abstract void alarm();

    /**
     * hook method  , 外界条件的改变 ,影响模板方法的执行 .
     * @return
     */
    abstract boolean isAlarm();

    /**
     * 模板方法 , 加上final 修饰 , 防止被复写 ,
     * 子类通过 isAlarm 控制了父类的行为
     */
    final void run() {
        start();
        if (this.isAlarm()) {
            alarm();
        }
        stop();
    }
}
