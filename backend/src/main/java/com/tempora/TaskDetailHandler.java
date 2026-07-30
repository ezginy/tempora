package com.tempora;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;

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

        boolean isHistoryRequest = parts.length > 3 && parts[3].equals("history");

        try {
            Task foundTask = taskManager.findById(id);

            if (foundTask == null) {
                String errorResponse = "{\"error\":\"Task not found\"}";
                exchange.sendResponseHeaders(404, errorResponse.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(errorResponse.getBytes());
                os.close();
                return;
            }

            switch (method) {
                case "GET" -> {
                    String response;
                    if (isHistoryRequest) {
                        response = gson.toJson(taskManager.getHistory(id));
                    } else {
                        response = gson.toJson(foundTask);
                    }
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();

                }
                case "PUT" -> {
                    InputStream is = exchange.getRequestBody();
                    String requestBody = new String(is.readAllBytes());

                    Task taskUpdates = gson.fromJson(requestBody, Task.class);
                    Status oldStatus = foundTask.getStatus();

                    if (taskUpdates.getTitle() != null) {
                        foundTask.setTitle(taskUpdates.getTitle());
                    }
                    if (taskUpdates.getDescription() != null) {
                        foundTask.setDescription(taskUpdates.getDescription());
                    }
                    if (taskUpdates.getPriority() != null) {
                        foundTask.setPriority(taskUpdates.getPriority());
                    }
                    if (taskUpdates.getStatus() != null) {
                        foundTask.setStatus(taskUpdates.getStatus());
                    }

                    taskManager.update(foundTask, oldStatus);

                    String response = gson.toJson(foundTask);
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();

                }
                case "DELETE" -> {
                    taskManager.deleteTask(id);

                    exchange.sendResponseHeaders(204, -1);
                    exchange.close();
                }
                default -> {
                    exchange.sendResponseHeaders(405, -1);
                    exchange.close();
                }
            }
        } catch (SQLException e) {
            String errorResponse = "{\"error\":\"Database error\"}";
            exchange.sendResponseHeaders(500, errorResponse.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(errorResponse.getBytes());
            os.close();
        }
    }
}
