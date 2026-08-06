package com.tempora.db;

import com.tempora.model.Priority;
import com.tempora.model.Status;
import com.tempora.model.StatusChange;
import com.tempora.model.Task;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TaskManager {

    // Adds a new task to the database
    public void addTask(Task task) throws SQLException {
        String sql = "INSERT INTO tasks (title, description, priority, status, estimated_duration, user_id) VALUES (?, ?, ?, ?, ?, ?) RETURNING id";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, task.getTitle());
            statement.setString(2, task.getDescription());
            statement.setString(3, task.getPriority().toString());
            statement.setString(4, task.getStatus().toString());
            statement.setObject(5, task.getEstimatedDuration());
            statement.setObject(6, task.getUserId());

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
        String sql = """
                SELECT tasks.*, latest_entry.changed_at AS last_entered_inprogress_at
                FROM tasks
                LEFT JOIN (
                    SELECT DISTINCT ON (task_id) task_id, changed_at
                    FROM status_history
                    WHERE to_status = 'IN_PROGRESS'
                    ORDER BY task_id, changed_at DESC
                ) AS latest_entry
                ON tasks.id = latest_entry.task_id
                """;

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
                task.setLastEnteredInProgressAt(rs.getTimestamp("last_entered_inprogress_at"));
                taskList.add(task);
            }
        }

        return taskList;
    }

    // Returns the full status change history for a task
    public List<StatusChange> getHistory(int taskId) throws SQLException {
        List<StatusChange> history = new ArrayList<>();
        String sql = "SELECT from_status, to_status, changed_at FROM status_history WHERE task_id = ? ORDER BY changed_at";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, taskId);

            try (ResultSet rs = statement.executeQuery()) {
                while (rs.next()) {
                    String fromStatus = rs.getString("from_status");
                    StatusChange change = new StatusChange(
                            fromStatus != null ? Status.valueOf(fromStatus) : null,
                            Status.valueOf(rs.getString("to_status")),
                            rs.getTimestamp("changed_at")
                    );
                    history.add(change);
                }
            }
        }

        return history;
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
    public void update(Task task, Status oldStatus) throws SQLException {
        if (oldStatus == Status.IN_PROGRESS && task.getStatus() != Status.IN_PROGRESS) {
            int secondsSpent = calculateSecondsSinceLastEntry(task.getId());
            task.setActualDuration(task.getActualDuration() + secondsSpent);
        }

        String sql = "UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, estimated_duration = ?, actual_duration = ? WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, task.getTitle());
            statement.setString(2, task.getDescription());
            statement.setString(3, task.getPriority().toString());
            statement.setString(4, task.getStatus().toString());
            statement.setObject(5, task.getEstimatedDuration());
            statement.setInt(6, task.getActualDuration());
            statement.setInt(7, task.getId());

            statement.executeUpdate();

            if (oldStatus != task.getStatus()) {
                recordStatusChange(task.getId(), oldStatus, task.getStatus());
            }
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

    private int calculateSecondsSinceLastEntry(int taskId) throws SQLException {
        String sql = "SELECT changed_at FROM status_history WHERE task_id = ? AND to_status = 'IN_PROGRESS' ORDER BY changed_at DESC LIMIT 1";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, taskId);

            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    Timestamp enteredAt = rs.getTimestamp("changed_at");
                    long millisElapsed = System.currentTimeMillis() - enteredAt.getTime();
                    return (int) (millisElapsed / 1000);
                }
            }
        }
        return 0;
    }
}
