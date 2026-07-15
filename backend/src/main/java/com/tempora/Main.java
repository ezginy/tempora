package com.tempora;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        TaskManager taskManager = new TaskManager();
        taskManager.addTask(new Task(1, "Design login page", "Create UI mockups", Priority.HIGH, Status.TODO));
        taskManager.addTask(new Task(2, "Write README", "Add setup instructions", Priority.LOW, Status.IN_PROGRESS));

        Gson gson = new Gson();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // GET all tasks, or POST a new task
        server.createContext("/tasks", new TaskListHandler(taskManager, gson));

        // GET a single task, or PUT to update it, or DELETE to remove it (path: /tasks/{id})
        server.createContext("/tasks/", new TaskDetailHandler(taskManager, gson));

        server.start();

        System.out.println("Tempora backend is running on port 8080...");
    }
}
