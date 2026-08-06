package com.tempora.filter;

import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.HttpExchange;
import com.tempora.db.JwtUtil;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

public class AuthFilter extends Filter {

    @Override
    public String description() {
        return "Checks for a valid JWT cookie before allowing access to protected endpoints";
    }

    @Override
    public void doFilter(HttpExchange exchange, Chain chain) throws IOException {
        // let CORS preflight requests through without requiring auth
        if (exchange.getRequestMethod().equals("OPTIONS")) {
            chain.doFilter(exchange);
            return;
        }

        String token = extractTokenFromCookie(exchange);

        if (token == null) {
            sendUnauthorized(exchange);
            return;
        }

        try {
            int userId = JwtUtil.validateTokenAndGetUserId(token);
            exchange.setAttribute("userId", userId);
            chain.doFilter(exchange);
        } catch (Exception e) {
            sendUnauthorized(exchange);
        }
    }

    private String extractTokenFromCookie(HttpExchange exchange) {
        List<String> cookieHeaders = exchange.getRequestHeaders().get("Cookie");
        if (cookieHeaders == null) {
            return null;
        }

        for (String cookieHeader : cookieHeaders) {
            for (String cookie : cookieHeader.split(";")) {
                String[] parts = cookie.trim().split("=", 2);
                if (parts.length == 2 && parts[0].equals("token")) {
                    return parts[1];
                }
            }
        }
        return null;
    }

    private void sendUnauthorized(HttpExchange exchange) throws IOException {
        String errorResponse = "{\"error\":\"Not authenticated\"}";
        exchange.sendResponseHeaders(401, errorResponse.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(errorResponse.getBytes());
        os.close();
    }
}
