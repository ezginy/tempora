package com.tempora;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class TaskDetailHandler implements HttpHandler {
    private TaskManager taskManager;
    private Gson gson;

    public TaskDetailHandler(TaskManager taskManager, Gson gson) {
        this.taskManager = taskManager;
        this.gson = gson;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
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
    }
}
