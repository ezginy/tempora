package com.tempora.model;

import java.util.List;

public class User {
    public static final List<String> ALLOWED_AVATARS = List.of(
            "red", "orange", "yellow", "green", "teal", "blue", "purple", "pink"
    );
    
    private int id;
    private String email;
    private String username;
    private String displayName;
    private String avatar;
    private String passwordHash;

    public User(int id, String email, String username, String displayName, String avatar, String passwordHash) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.displayName = displayName;
        this.avatar = avatar;
        this.passwordHash = passwordHash;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}
