package com.tempora.util;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {

    // turns a plain text password into a hash, safe to store in the database
    public static String hash(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    // checks if a plain text password matches a stored hash
    public static boolean verify(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}
