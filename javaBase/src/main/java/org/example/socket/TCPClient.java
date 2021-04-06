package org.example.socket;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class TCPClient {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket(InetAddress.getLocalHost(), 8848);
        try (
                OutputStream outputStream = socket.getOutputStream();
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        ) {


            // 输入
            byte[] send = "TCP客户端数据".getBytes(StandardCharsets.UTF_8);
            outputStream.write(send);
            outputStream.flush();

            // 调用 shutdownOutput , showdownInput 结束等待
            socket.shutdownOutput();

            // 输出
            System.out.printf("服务器内容:%s,地址:%s", bufferedReader.readLine(), socket.getRemoteSocketAddress());
            // 调用 shutdownOutput , showdownInput 结束等待
            socket.shutdownInput();
            socket.close();
        }


    }
}
