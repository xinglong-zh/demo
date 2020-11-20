package com.demo.nerwork;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * NIO 可以提高服务器的吞吐 TODO: NIO
 */
public class ServerSocketTest {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(5000);
        ExecutorService threadPool = Executors.newFixedThreadPool(2);

        while (true){
            Socket accept = serverSocket.accept();
            Runnable runnable = new Runnable() {
                @Override
                public void run() {
                    try {
                        InputStream inputStream = accept.getInputStream();
                        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                        String str;
                        while ((str=bufferedReader.readLine())!=null){
                            System.out.println(str);
                        }
                        System.out.println(Thread.currentThread().getName());
                        bufferedReader.close();
                        inputStream.close();
                        accept.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            };

            threadPool.submit(runnable);
        }
    }
}
