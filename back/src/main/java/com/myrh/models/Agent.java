package com.myrh.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Basic
    @Column(name = "password", nullable = false)
    private String password;

    // Default constructor
    public Agent() {}

    // Constructor with email and password
    public Agent(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Optionally, if you want to manually define the getter methods
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
