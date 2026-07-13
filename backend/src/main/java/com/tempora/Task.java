package com.tempora;

public class Task {
    private int id;
    private String title;
    private String description;
    private Priority taskPriority;

    public Task(int id, String title, String description, Priority taskPriority) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.taskPriority = taskPriority;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Priority getTaskPriority() {
        return taskPriority;
    }

    public void setTaskPriority(Priority taskPriority) {
        this.taskPriority = taskPriority;
    }
}
