package com.tempora;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {

        // listening on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // define what happens when a request hits "/tasks"
        server.createContext("/tasks", exchange -> {
            String response = "Hello from Tempora backend!";

            // send status code 200 (OK) along with the response length
            exchange.sendResponseHeaders(200, response.length());

            // write the response body and close the stream
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        });

        server.start();

        System.out.println("Tempora backend is running on port 8080...");
    }
}
