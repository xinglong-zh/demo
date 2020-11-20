package com.demo.nerwork;

import java.io.*;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;


public class SocketTest {
    public static void main(String[] args) throws IOException {
//        Socket socket = new Socket("127.0.0.1",5000);
        Socket socket = new Socket();
        socket.connect(new InetSocketAddress(InetAddress.getLocalHost(),5000),5000);
        // 解决超时问题
        OutputStream outputStream = socket.getOutputStream();
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(outputStream));
        //写入服务器
        bufferedWriter.write("客服端: 客户端写入数据");

        bufferedWriter.close();
        outputStream.close();

    }
}
