package demo01;

/**
 * 单一职责实例 ,电话
 * @author xinglong
 */
public interface Phone {
    /** 打电话功能
     * @param No 电话号码
     * */
    void markCall(String  No);

    /**
     * 交谈
     */
     void chat();

    /**
     * 挂断电话
     */
     void hangup();
}
