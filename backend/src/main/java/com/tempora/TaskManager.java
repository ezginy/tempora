package com.tempora;

import java.util.ArrayList;
import java.util.List;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class TaskManager {

    private List<Task> tasks;  // still used by addTask/deleteTask for now

    // Constructor: starts with an empty task list
    public TaskManager() {
        this.tasks = new ArrayList<>();
    }

    // Adds a new task to the list
    public void addTask(Task task) {
        tasks.add(task);
    }

    // Remove the task from the list
    public void deleteTask(Task task) {
        tasks.remove(task);
    }

    // Returns the full list of tasks
    public List<Task> getAllTasks() throws SQLException {
        List<Task> taskList = new ArrayList<>();
        String sql = "SELECT * FROM tasks";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet rs = statement.executeQuery()) {

            while (rs.next()) {
                Task task = new Task(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        Priority.valueOf(rs.getString("priority")),
                        Status.valueOf(rs.getString("status"))
                );
                taskList.add(task);
            }
        }

        return taskList;
    }

    // Finds a task by its id, or returns null if no match is found
    public Task findById(int id) throws SQLException {
        String sql = "SELECT * FROM tasks WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    return new Task(
                            rs.getInt("id"),
                            rs.getString("title"),
                            rs.getString("description"),
                            Priority.valueOf(rs.getString("priority")),
                            Status.valueOf(rs.getString("status"))
                    );
                }
            }
        }
        return null;
    }
}
