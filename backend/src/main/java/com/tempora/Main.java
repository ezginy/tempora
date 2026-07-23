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

        // Render gives us the port via an environment variable; fall back to 8080 for local dev
        String portEnv = System.getenv("PORT");
        int port = (portEnv != null) ? Integer.parseInt(portEnv) : 8080;

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // GET all tasks, or POST a new task
        var tasksContext = server.createContext("/tasks", new TaskListHandler(taskManager, gson));
        tasksContext.getFilters().add(new CorsFilter());

        // GET a single task, or PUT to update it, or DELETE to remove it (path: /tasks/{id})
        var taskDetailContext = server.createContext("/tasks/", new TaskDetailHandler(taskManager, gson));
        taskDetailContext.getFilters().add(new CorsFilter());

        server.start();

        System.out.println("Tempora backend is running on port " + port + "...");
    }
}
