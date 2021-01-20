package demo_singleton;

import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

import static org.junit.Assert.*;

public class SingletonLazyTest {

    @Test
    public void getInstance() {
        SingletonLazy instance = SingletonLazy.getInstance();
        SingletonLazy instance2 = SingletonLazy.getInstance();
        assertEquals(instance,instance2);
    }

}