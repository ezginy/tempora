package com.tempora.util;

import java.util.regex.Pattern;

public class ValidationUtil {
    // compiled once as a constant instead of every call — cheaper and the industry-standard way to reuse a regex
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-z0-9._]{6,12}$");
    private static final Pattern EMAIL_SHAPE_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^\\S{8,28}$");

    public static boolean isValidDisplayName(String displayName) {
        // reject if the field wasn't sent at all
        if (displayName == null) return false;

        String trimmed = displayName.trim();

        // reject empty or whitespace-only names
        if (trimmed.isBlank()) return false;

        // length must be between 1 and 20 characters
        return trimmed.length() <= 20;
    }

    public static boolean isValidUsername(String username) {
        if (username == null) return false;

        // no trim here on purpose — the pattern already rejects any whitespace,
        // so a leading/trailing space correctly fails instead of being silently stripped
        return USERNAME_PATTERN.matcher(username).matches();
    }

    public static boolean isValidEmail(String email) {
        if (email == null) return false;

        int length = email.length();
        if (length < 6 || length > 55) return false;

        return EMAIL_SHAPE_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPassword(String password) {
        if (password == null) return false;

        // no trim — a password with a leading/trailing space should be rejected,
        // not silently cleaned up, same reasoning as isValidUsername
        return PASSWORD_PATTERN.matcher(password).matches();
    }
}
