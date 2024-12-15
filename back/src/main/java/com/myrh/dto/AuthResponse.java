package com.myrh.dto;

public class AuthResponse {
    private String token;

    // Constructor
    public AuthResponse(String token) {
        this.token = token;
    }

    // Getter for token
    public String getToken() {
        return token;
    }

    // Setter for token (optional)
    public void setToken(String token) {
        this.token = token;
    }
}



