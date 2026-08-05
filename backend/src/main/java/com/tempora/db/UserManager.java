package com.tempora.db;

import com.tempora.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserManager {

    // Adds a new user to the database, returns the generated id
    public int addUser(String email, String passwordHash, String username, String displayName) throws SQLException {
        String sql = "INSERT INTO users (email, password_hash, username, display_name) VALUES (?, ?, ?, ?) RETURNING id";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, email);
            statement.setString(2, passwordHash);
            statement.setString(3, username);
            statement.setString(4, displayName);

            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        }
        return 0;
    }

    // Finds a user by email, or returns null if no match is found
    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, email);

            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    return new User(
                            rs.getInt("id"),
                            rs.getString("email"),
                            rs.getString("username"),
                            rs.getString("display_name"),
                            rs.getString("avatar"),
                            rs.getString("password_hash")
                    );
                }
            }
        }
        return null;
    }
}
