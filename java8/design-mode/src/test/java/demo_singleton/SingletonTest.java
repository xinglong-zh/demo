package demo_singleton;

import org.junit.Test;

import static org.junit.Assert.*;

public class SingletonTest {

    @Test
    public void getInstance() {

        Singleton instance = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        assertEquals(instance,instance2);
    }
}