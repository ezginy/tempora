package com.tempora;

import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.List;

public class CorsFilter extends Filter {

    // known frontend addresses allowed to call this API during development
    private static final List<String> ALLOWED_ORIGINS = List.of(
            "http://localhost:5173",
            "http://127.0.0.1:5173"
    );

    @Override
    public String description() {
        return "Adds CORS headers for allowed frontend origins";
    }

    @Override
    public void doFilter(HttpExchange exchange, Chain chain) throws IOException {
        String origin = exchange.getRequestHeaders().getFirst("Origin");

        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", origin);
        }

        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        // handle the browser's preflight check directly, don't pass it to the real handler
        if (exchange.getRequestMethod().equals("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }

        // not a preflight request, let it continue to the actual handler
        chain.doFilter(exchange);
    }
}
