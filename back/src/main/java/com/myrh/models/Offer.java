package com.myrh.models;

import com.myrh.utils.Enum;
import jakarta.persistence.*;

@Entity
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String location;

    private String degree;

    private Double salary;

    private String profileId;

    private String companyId;

    @Enumerated(EnumType.STRING)
    private Enum.status status; // Enum field

    // Default constructor
    public Offer() {
    }

    // Constructor with arguments
    public Offer(String title, String description, String location, String degree, Double salary, String profileId, String companyId) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.degree = degree;
        this.salary = salary;
        this.profileId = profileId;
        this.companyId = companyId;
        this.status = Enum.status.Pending; // Default status on creation
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getProfileId() {
        return profileId;
    }

    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public Enum.status getStatus() {
        return status;
    }

    public void setStatus(Enum.status status) {
        this.status = status;
    }
}
