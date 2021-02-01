package org.example.socket;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class TCPServer {
    public static void main(String[] args) throws IOException {
        ServerSocket socket = new ServerSocket(8848);

        ExecutorService service = new ThreadPoolExecutor(64,64,0L, TimeUnit.MICROSECONDS,new LinkedBlockingDeque<Runnable>());
        for (;;){
            final Socket accept = socket.accept();
            service.submit(()->{
                try( BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(accept.getInputStream()));
                     BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(accept.getOutputStream());
                ) {

                    System.out.printf("地址:%s,内容:%s",accept.getRemoteSocketAddress(),bufferedReader.readLine());
                    System.out.println();

                    byte[] send = "服务器内容bla bla".getBytes(StandardCharsets.UTF_8);
                    bufferedOutputStream.write(send);
                    bufferedOutputStream.flush();

                    // 调用 shutdownOutput , showdownInput 结束等待
                    accept.shutdownOutput();

                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        }

    }
}
