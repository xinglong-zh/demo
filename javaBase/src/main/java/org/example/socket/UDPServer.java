package org.example.socket;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.nio.charset.StandardCharsets;

/**
 * @author Administrator
 */
public class UDPServer {
    public static void main(String[] args) throws IOException {
        // 创建socket UDP
        DatagramSocket socket = new DatagramSocket(8848);

        while (true) {

            // 创建一个缓冲区
            byte[] buffer = new byte[4096];
            // UDP 数据包
            DatagramPacket datagramPacket = new DatagramPacket(buffer, buffer.length);

            socket.receive(datagramPacket);

            String rev = new String(datagramPacket.getData(), datagramPacket.getOffset(), datagramPacket.getLength(), StandardCharsets.UTF_8);

            System.out.printf("客户端消息:%s,地址:%s", rev,datagramPacket.getSocketAddress());
            System.out.println();
            // 准备数据包

            datagramPacket.setData("ack".toLowerCase().getBytes(StandardCharsets.UTF_8));
            // 服务端发送ack
            socket.send(datagramPacket);
        }

    }
}
