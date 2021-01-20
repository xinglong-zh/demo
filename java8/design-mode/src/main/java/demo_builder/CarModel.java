package demo_builder;

import java.util.ArrayList;

/**
 * 产品类 ,  可以自定义执行顺序  , 或 装配不同零件
 * 同样实现了模板模式
 */
public abstract class CarModel {
    private ArrayList<String> sequence = new ArrayList<>();
    abstract void start();

    abstract void stop();

    abstract void alarm();

    final void run() {
        for (int i=0;i<sequence.size();i++){
            String s = sequence.get(i);
            if("start".equalsIgnoreCase(s)){
                this.start();
            }
            if("stop".equalsIgnoreCase(s)){
                this.stop();
            }
            if("alarm".equalsIgnoreCase(s)){
                this.alarm();
            }
        }
    }

    final void setSequence(ArrayList sequence){
        this.sequence = sequence;
    }

}
