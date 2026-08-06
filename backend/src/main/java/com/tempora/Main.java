package com.tempora;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpServer;
import com.tempora.db.DatabaseConnection;
import com.tempora.db.TaskManager;
import com.tempora.db.UserManager;
import com.tempora.filter.CorsFilter;
import com.tempora.filter.AuthFilter;
import com.tempora.handler.AuthHandler;
import com.tempora.handler.TaskDetailHandler;
import com.tempora.handler.TaskListHandler;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.sql.SQLException;

public class Main {

    public static void main(String[] args) throws IOException, SQLException {
        DatabaseConnection.runSchema();

        UserManager userManager = new UserManager();
        TaskManager taskManager = new TaskManager();
        Gson gson = new Gson();

        // Render gives us the port via an environment variable; fall back to 8080 for local dev
        String portEnv = System.getenv("PORT");
        int port = (portEnv != null) ? Integer.parseInt(portEnv) : 8080;

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // POST a new user (register)
        var authContext = server.createContext("/auth/", new AuthHandler(userManager, taskManager, gson));
        authContext.getFilters().add(new CorsFilter());

        // GET all tasks, or POST a new task
        var tasksContext = server.createContext("/tasks", new TaskListHandler(taskManager, gson));
        tasksContext.getFilters().add(new CorsFilter());
        tasksContext.getFilters().add(new AuthFilter());

        // GET a single task, or PUT to update it, or DELETE to remove it (path: /tasks/{id})
        var taskDetailContext = server.createContext("/tasks/", new TaskDetailHandler(taskManager, gson));
        taskDetailContext.getFilters().add(new CorsFilter());
        taskDetailContext.getFilters().add(new AuthFilter());

        server.start();

        System.out.println("Tempora backend is running on port " + port + "...");
    }
}
