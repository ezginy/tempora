package com.tempora;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class TaskListHandler implements HttpHandler {
    private TaskManager taskManager;
    private Gson gson;

    public TaskListHandler(TaskManager taskManager, Gson gson) {
        this.taskManager = taskManager;
        this.gson = gson;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
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
            if (!newTask.isValid()) {
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
    }
}
