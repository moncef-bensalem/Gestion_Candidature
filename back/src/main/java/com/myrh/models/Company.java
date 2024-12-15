package com.myrh.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    // Constructeurs
    public Company() {}

    public Company(String name, String login, String password, String email, String phone, String address, String imageUrl) {
        this.name = name;
        this.login = login;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.imageUrl = imageUrl;
    }
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

	public String getPassword() {
		return password;
	}
	public void setPassword(String password ) {
		this.password=password;
	}

	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email=email;
	}

}
