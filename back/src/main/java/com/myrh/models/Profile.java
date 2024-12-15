package com.myrh.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "title", nullable = false)
    private String title;

    public Profile() {}

    public Profile(String title) {
        this.title = title;
    }
}
