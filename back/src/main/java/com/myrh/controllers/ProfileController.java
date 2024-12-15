package com.myrh.controllers;

import com.myrh.services.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllProfiles() {
        try {
            var profiles = profileService.listAll();
            System.out.println("Returning " + profiles.size() + " profiles");
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            System.err.println("Error getting profiles: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error getting profiles: " + e.getMessage());
        }
    }
}
