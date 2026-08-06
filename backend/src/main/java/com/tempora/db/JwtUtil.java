package com.tempora.db;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {
    private static final SecretKey KEY = Keys.hmacShaKeyFor(System.getenv("JWT_SECRET").getBytes());
    private static final long EXPIRATION_MS = 15L * 24 * 60 * 60 * 1000;  // 15 days

    // creates a signed token containing the user's id
    public static String generateToken(int userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(KEY)
                .compact();
    }

    // verifies a token's signature and returns the userId inside it
    public static int validateTokenAndGetUserId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Number userId = claims.get("userId", Number.class);
        return userId.intValue();
    }
}
