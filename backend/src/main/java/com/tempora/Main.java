package com.tempora;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        TaskManager taskManager = new TaskManager();
        taskManager.addTask(new Task(1, "Design login page", "Create UI mockups", Priority.HIGH));
        taskManager.addTask(new Task(2, "Write README", "Add setup instructions", Priority.LOW));

        Gson gson = new Gson();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // define what happens when a request hits "/tasks"
        server.createContext("/tasks", exchange -> {

            String response = gson.toJson(taskManager.getAllTasks());

            // send status code 200 (OK) along with the response length
            exchange.sendResponseHeaders(200, response.getBytes().length);

            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        });

        server.start();

        System.out.println("Tempora backend is running on port 8080...");
    }
}
