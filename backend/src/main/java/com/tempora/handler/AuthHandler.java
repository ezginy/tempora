package com.tempora.handler;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.tempora.db.PasswordUtil;
import com.tempora.db.JwtUtil;
import com.tempora.db.TaskManager;
import com.tempora.db.UserManager;
import com.tempora.model.Priority;
import com.tempora.model.Status;
import com.tempora.model.Task;
import com.tempora.model.User;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.Random;

public class AuthHandler implements HttpHandler {
    private UserManager userManager;
    private TaskManager taskManager;
    private Gson gson;

    public AuthHandler(UserManager userManager, TaskManager taskManager, Gson gson) {
        this.userManager = userManager;
        this.taskManager = taskManager;
        this.gson = gson;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.equals("/auth/register") && method.equals("POST")) {
            handleRegister(exchange);
        } else if (path.equals("/auth/login") && method.equals("POST")) {
            handleLogin(exchange);
        } else if (path.equals("/auth/me") && method.equals("GET")) {
            handleMe(exchange);
        } else {
            exchange.sendResponseHeaders(404, -1);
            exchange.close();
        }
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        String requestBody = new String(is.readAllBytes());

        RegisterRequest data = gson.fromJson(requestBody, RegisterRequest.class);

        try {
            // check if email is already taken
            if (userManager.findByEmail(data.email) != null) {
                sendError(exchange, 409, "Email already registered");
                return;
            }

            String avatar = data.avatar;
            if (avatar == null || !User.ALLOWED_AVATARS.contains(avatar)) {
                avatar = User.ALLOWED_AVATARS.get(new Random().nextInt(User.ALLOWED_AVATARS.size()));
            }

            // hash password and create the user
            String hashedPassword = PasswordUtil.hash(data.password);
            int userId = userManager.addUser(data.email, hashedPassword, data.username, data.displayName, avatar);

            // create the welcome task
            Task welcomeTask = new Task(
                    0,
                    "Welcome to Tempora! 👋",
                    "This is your first task — try dragging it to In Progress, then Done, to see how time tracking works.",
                    Priority.LOW,
                    Status.TODO
            );
            welcomeTask.setUserId(userId);
            taskManager.addTask(welcomeTask);

            // issue a token and set it as a cookie
            String token = JwtUtil.generateToken(userId);
            exchange.getResponseHeaders().add("Set-Cookie",
                    "token=" + token + "; HttpOnly; Path=/; Max-Age=1296000");

            UserResponse userResponse = new UserResponse(userId, data.email, data.username, data.displayName, avatar);
            String response = gson.toJson(userResponse);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(201, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();

        } catch (SQLException e) {
            sendError(exchange, 500, "Something went wrong while creating your account");
        }
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        String requestBody = new String(is.readAllBytes());

        LoginRequest data = gson.fromJson(requestBody, LoginRequest.class);

        try {
            User user = userManager.findByEmail(data.email);

            if (user == null || !PasswordUtil.verify(data.password, user.getPasswordHash())) {
                sendError(exchange, 401, "Invalid email or password");
                return;
            }

            String token = JwtUtil.generateToken(user.getId());
            exchange.getResponseHeaders().add("Set-Cookie",
                    "token=" + token + "; HttpOnly; Path=/; Max-Age=1296000");

            String response = "{\"message\":\"Logged in successfully\"}";
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();

        } catch (SQLException e) {
            sendError(exchange, 500, "Something went wrong while logging in");
        }
    }

    private void handleMe(HttpExchange exchange) throws IOException {
        int userId = (int) exchange.getAttribute("userId");

        try {
            User user = userManager.findById(userId);

            if (user == null) {
                sendError(exchange, 401, "Not authenticated");
                return;
            }

            UserResponse userResponse = new UserResponse(
                    user.getId(), user.getEmail(), user.getUsername(), user.getDisplayName(), user.getAvatar()
            );
            String response = gson.toJson(userResponse);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
            
        } catch (SQLException e) {
            sendError(exchange, 500, "Something went wrong");
        }
    }

    private void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        String errorResponse = "{\"error\":\"" + message + "\"}";
        exchange.sendResponseHeaders(statusCode, errorResponse.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(errorResponse.getBytes());
        os.close();
    }

    private static class RegisterRequest {
        String email;
        String password;
        String username;
        String displayName;
        String avatar;
    }

    private static class LoginRequest {
        String email;
        String password;
    }

    private static class UserResponse {
        int id;
        String email;
        String username;
        String displayName;
        String avatar;

        UserResponse(int id, String email, String username, String displayName, String avatar) {
            this.id = id;
            this.email = email;
            this.username = username;
            this.displayName = displayName;
            this.avatar = avatar;
        }
    }
}
