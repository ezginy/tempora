package com.tempora;

import java.util.ArrayList;
import java.util.List;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class TaskManager {

    // Adds a new task to the database
    public void addTask(Task task) throws SQLException {
        String sql = "INSERT INTO tasks (title, description, priority, status, estimated_duration) VALUES (?, ?, ?, ?, ?) RETURNING id";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, task.getTitle());
            statement.setString(2, task.getDescription());
            statement.setString(3, task.getPriority().toString());
            statement.setString(4, task.getStatus().toString());
            statement.setObject(5, task.getEstimatedDuration());

            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    task.setId(rs.getInt("id"));
                    recordStatusChange(task.getId(), null, task.getStatus());
                }
            }
        }
    }

    // Deletes the task with the given id
    public void deleteTask(int id) throws SQLException {
        String sql = "DELETE FROM tasks WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);
            statement.executeUpdate();
        }
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
                        Status.valueOf(rs.getString("status")),
                        rs.getObject("estimated_duration", Integer.class),
                        rs.getInt("actual_duration")
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
                            Status.valueOf(rs.getString("status")),
                            rs.getObject("estimated_duration", Integer.class),
                            rs.getInt("actual_duration")
                    );
                }
            }
        }
        return null;
    }

    // Updates an existing task in the database
    public void update(Task task) throws SQLException {
        String sql = "UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, estimated_duration = ? WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, task.getTitle());
            statement.setString(2, task.getDescription());
            statement.setString(3, task.getPriority().toString());
            statement.setString(4, task.getStatus().toString());
            statement.setObject(5, task.getEstimatedDuration());
            statement.setInt(6, task.getId());

            statement.executeUpdate();
        }
    }

    // Records a status change in status_history
    private void recordStatusChange(int taskId, Status fromStatus, Status toStatus) throws SQLException {
        String sql = "INSERT INTO status_history (task_id, from_status, to_status) VALUES (?, ?, ?)";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, taskId);
            statement.setString(2, fromStatus != null ? fromStatus.toString() : null);
            statement.setString(3, toStatus.toString());

            statement.executeUpdate();
        }
    }
}
