package com.tempora.model;

import java.sql.Timestamp;

public class Task {
    private int id;
    private String title;
    private String description;
    private Priority priority;
    private Status status;
    private Integer estimatedDuration;
    private int actualDuration;
    private Timestamp lastEnteredInProgressAt;

    // Original constructor, still used when duration info isn't relevant yet (defaults to null/0)
    public Task(int id, String title, String description, Priority priority, Status status) {
        this(id, title, description, priority, status, null, 0);
    }

    // Full constructor, used when reading a row back from the database
    public Task(int id, String title, String description, Priority priority, Status status,
                Integer estimatedDuration, int actualDuration) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.estimatedDuration = estimatedDuration;
        this.actualDuration = actualDuration;
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

    public Integer getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(Integer estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public int getActualDuration() {
        return actualDuration;
    }

    public void setActualDuration(int actualDuration) {
        this.actualDuration = actualDuration;
    }

    public Timestamp getLastEnteredInProgressAt() {
        return lastEnteredInProgressAt;
    }

    public void setLastEnteredInProgressAt(Timestamp lastEnteredInProgressAt) {
        this.lastEnteredInProgressAt = lastEnteredInProgressAt;
    }

    // Checks whether this task has the minimum required data (a non-blank title)
    public boolean isValid() {
        return title != null && !title.isBlank();
    }
}
