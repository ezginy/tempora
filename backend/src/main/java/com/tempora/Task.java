package com.tempora;

public class Task {
    private int id;
    private String title;
    private String description;
    private Priority priority;
    private Status status;

    public Task(int id, String title, String description, Priority priority, Status status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
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

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    // Checks whether this task has the minimum required data (a non-blank title)
    public boolean isValid() {
        return title != null && !title.isBlank();
    }
}
