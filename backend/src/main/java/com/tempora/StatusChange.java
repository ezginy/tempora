package com.tempora;

import java.sql.Timestamp;

public class StatusChange {
    private Status fromStatus;
    private Status toStatus;
    private Timestamp changedAt;

    public StatusChange(Status fromStatus, Status toStatus, Timestamp changedAt) {
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedAt = changedAt;
    }

    public Status getFromStatus() {
        return fromStatus;
    }

    public Status getToStatus() {
        return toStatus;
    }

    public Timestamp getChangedAt() {
        return changedAt;
    }
}