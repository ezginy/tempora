package com.tempora;
import java.util.ArrayList;
import java.util.List;

public class TaskManager {

    // Holds all tasks in memory (no database yet)
    private List<Task> tasks;

    // Constructor: starts with an empty task list
    public TaskManager() {
        this.tasks = new ArrayList<>();
    }

    // Adds a new task to the list
    public void addTask(Task task) {
        tasks.add(task);
    }

    // Returns the full list of tasks
    public List<Task> getAllTasks() {
        return tasks;
    }
}
