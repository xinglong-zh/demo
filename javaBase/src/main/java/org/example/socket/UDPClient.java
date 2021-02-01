package org.example.socket;

import java.io.IOException;
import java.net.*;
import java.nio.charset.StandardCharsets;

public class UDPClient {
    public static void main(String[] args) throws IOException {
        DatagramSocket datagramSocket = new DatagramSocket();
        datagramSocket.setSoTimeout(1000);

        datagramSocket.connect(InetAddress.getByName("localhost"),8848);

        byte[] send = "hello-ack".getBytes(StandardCharsets.UTF_8);
        DatagramPacket datagramPacket = new DatagramPacket(send,send.length);

        datagramSocket.send(datagramPacket);

        byte[] recv = new byte[4096];

        DatagramPacket p = new DatagramPacket(recv, recv.length);
        datagramSocket.receive(p);
        String s = new String(p.getData(),p.getOffset(), p.getLength());
        System.out.printf("服务端消息:%s",s);
        datagramSocket.close();
    }
}
