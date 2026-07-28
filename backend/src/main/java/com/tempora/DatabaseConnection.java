package com.tempora;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.io.InputStream;
import java.util.Scanner;

public class DatabaseConnection {

    private static final String URL = System.getenv("DB_URL");
    private static final String USERNAME = System.getenv("DB_USERNAME");
    private static final String PASSWORD = System.getenv("DB_PASSWORD");

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    public static void runSchema() throws SQLException {
        InputStream is = DatabaseConnection.class.getResourceAsStream("/db/schema.sql");
        Scanner scan = new Scanner(is, "UTF-8").useDelimiter("\\A");
        String sql = scan.hasNext() ? scan.next() : "";

        try (Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
             Statement statement = connection.createStatement()) {
            statement.execute(sql);
        }
    }
}
