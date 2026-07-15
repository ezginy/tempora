package com.tempora;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        TaskManager taskManager = new TaskManager();
        taskManager.addTask(new Task(1, "Design login page", "Create UI mockups", Priority.HIGH));
        taskManager.addTask(new Task(2, "Write README", "Add setup instructions", Priority.LOW));

        Gson gson = new Gson();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // GET all tasks, or POST a new task
        server.createContext("/tasks", exchange -> {
            String method = exchange.getRequestMethod();

            if (method.equals("GET")) {
                String response = gson.toJson(taskManager.getAllTasks());

                // send status code 200 (OK) along with the response length
                exchange.sendResponseHeaders(200, response.getBytes().length);

                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();

            } else if (method.equals("POST")) {
                // read the request body (the JSON the client sent)
                InputStream is = exchange.getRequestBody();
                String requestBody = new String(is.readAllBytes());

                Task newTask = gson.fromJson(requestBody, Task.class);

                // validate: title mustn't be missing or empty
                if (newTask.getTitle() == null || newTask.getTitle().isBlank()) {
                    String errorResponse = "{\"error\":\"Title is required\"}";
                    exchange.sendResponseHeaders(400, errorResponse.getBytes().length);

                    OutputStream os = exchange.getResponseBody();
                    os.write(errorResponse.getBytes());
                    os.close();
                    return;  // stop here, don't continue to add the task
                }

                // assign an id ourselves (client doesn't send one) and add it to the manager
                newTask.setId(taskManager.getAllTasks().size() + 1);
                taskManager.addTask(newTask);

                // respond with the created task as confirmation
                String response = gson.toJson(newTask);
                exchange.sendResponseHeaders(201, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();

            } else {
                exchange.sendResponseHeaders(405, -1);
                exchange.close();
            }
        });


        // GET a single task, or PUT to update it (path: /tasks/{id})
        server.createContext("/tasks/", exchange -> {
           String method = exchange.getRequestMethod();

           // get the path, e.g. "/tasks/2", and split it to find the id
            String path = exchange.getRequestURI().getPath();
            String[] parts = path.split("/");
            int id = Integer.parseInt(parts[2]);

            // find the task with the matching id (shared by GET and PUT)
            Task foundTask = null;
            for (Task task : taskManager.getAllTasks()) {
                if (task.getId() == id) {
                    foundTask = task;
                    break;
                }
            }

            if (foundTask == null) {
                String errorResponse = "{\"error\":\"Task not found\"}";
                exchange.sendResponseHeaders(404, errorResponse.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(errorResponse.getBytes());
                os.close();
                return;
            }

            if (method.equals("GET")) {
                String response = gson.toJson(foundTask);
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();

            } else if (method.equals("PUT")) {
                InputStream is = exchange.getRequestBody();
                String requestBody = new String(is.readAllBytes());

                Task newTask = gson.fromJson(requestBody, Task.class);

                foundTask.setTitle(newTask.getTitle());
                foundTask.setDescription(newTask.getDescription());
                foundTask.setPriority(newTask.getPriority());

                String response = gson.toJson(foundTask);
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();

            } else if (method.equals("DELETE")) {
                taskManager.deleteTask(foundTask);

                exchange.sendResponseHeaders(204, -1);
                exchange.close();

            } else {
                exchange.sendResponseHeaders(405, -1);
                exchange.close();
            }
        });

        server.start();

        System.out.println("Tempora backend is running on port 8080...");
    }
}
