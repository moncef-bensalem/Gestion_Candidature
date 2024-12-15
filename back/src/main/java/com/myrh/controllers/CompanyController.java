package com.myrh.controllers;

import com.myrh.dto.RegisterRequest;
import com.myrh.models.Company;
import com.myrh.services.CompanyService;
import com.myrh.utils.RandomCode;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("company")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
public class CompanyController {

    private Company company;
    private int codeVer;
    private final CompanyService companyService;
    private LocalTime setTime;
    private final Logger logger = LoggerFactory.getLogger(CompanyController.class);

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("register")
    public ResponseEntity<?> registration(@Valid @RequestBody RegisterRequest req) {
        try {
            logger.info("Attempting to register company with login: {}", req.getLogin());

            // Validation des champs obligatoires
            if (req.getName() == null || req.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Company name is required"));
            }
            if (req.getLogin() == null || req.getLogin().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Login is required"));
            }
            if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            if (req.getPassword() == null || req.getPassword().length() < 8) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 8 characters long"));
            }

            // Vérifier si le login existe déjà
            if (companyService.getCompanyByLogin(req.getLogin()) != null) {
                logger.warn("Registration failed: Login {} already exists", req.getLogin());
                return ResponseEntity.badRequest().body(Map.of("message", "Login already exists"));
            }

            // Vérifier si l'email existe déjà
            if (companyService.getCompanyByEmail(req.getEmail()) != null) {
                logger.warn("Registration failed: Email {} already exists", req.getEmail());
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }

            company = new Company(
                    req.getName(),
                    req.getLogin(),
                    BCrypt.hashpw(req.getPassword(), BCrypt.gensalt()),
                    req.getEmail(),
                    req.getPhone(),
                    req.getAddress(),
                    req.getImageUrl() != null ? req.getImageUrl() : "default.jpg"
            );

            codeVer = RandomCode.generate();
            setTime = LocalTime.now();

            logger.info("Company registration successful, verification code generated for: {}", req.getLogin());
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful. Please verify your account.",
                "code", codeVer
            ));

        } catch (Exception e) {
            logger.error("Error during company registration: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("verify-code")
    public ResponseEntity<?> verifyRegistration(@RequestBody Map<String, Integer> request) {
        try {
            Integer codeParamVer = request.get("code");
            if (codeParamVer == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Verification code is required"));
            }

            logger.info("Attempting to verify company registration with code: {}", codeParamVer);

            if (company == null) {
                logger.warn("Verification failed: No pending registration found");
                return ResponseEntity.badRequest().body(Map.of("message", "No pending registration found"));
            }

            if (codeParamVer != codeVer) {
                logger.warn("Verification failed: Invalid code");
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification code"));
            }

            if (!isCodeValid()) {
                logger.warn("Verification failed: Code expired");
                return ResponseEntity.badRequest().body(Map.of("message", "Verification code has expired"));
            }

            // Sauvegarder l'entreprise
            companyService.save(company);
            logger.info("Company verified and saved successfully: {}", company.getLogin());

            // Réinitialiser les variables
            company = null;
            codeVer = 0;
            setTime = null;

            return ResponseEntity.ok(Map.of("message", "Company verified successfully"));

        } catch (Exception e) {
            logger.error("Error during company verification: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("message", "Verification failed: " + e.getMessage()));
        }
    }

    @GetMapping("resend-code")
    public ResponseEntity<?> resendVerificationCode() {
        try {
            if (company == null) {
                logger.warn("Code resend failed: No pending registration found");
                return ResponseEntity.badRequest().body(Map.of("error", "No pending registration found"));
            }

            codeVer = RandomCode.generate();
            setTime = LocalTime.now();

            logger.info("New verification code generated successfully");
            return ResponseEntity.ok(Map.of(
                "message", "New verification code generated successfully",
                "code", codeVer
            ));

        } catch (Exception e) {
            logger.error("Error generating new verification code: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to generate new code: " + e.getMessage()));
        }
    }

    @GetMapping("all")
    public ResponseEntity<?> getAllCompanies() {
        try {
            var companies = companyService.listAll();
            logger.info("Retrieved {} companies", companies.size());
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            logger.error("Error retrieving companies: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to retrieve companies: " + e.getMessage()));
        }
    }

    private boolean isCodeValid() {
        return LocalTime.now().isBefore(setTime.plusMinutes(3));
    }
}
