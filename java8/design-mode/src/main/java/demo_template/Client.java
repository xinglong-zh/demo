package demo_template;

public class Client {
    public static void main(String[] args) {
        BenzModel benzH1Model = new BenzH1Model();
        benzH1Model.run();
        BenzH2Model benzH2Model = new BenzH2Model();
        benzH2Model.run();
    }
}
