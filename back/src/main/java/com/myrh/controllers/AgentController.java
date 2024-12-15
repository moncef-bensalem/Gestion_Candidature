package com.myrh.controllers;

import com.myrh.dto.AgentRegisterRequest;
import com.myrh.models.Agent;
import com.myrh.services.AgentService;
import com.myrh.utils.RandomCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/agent")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
public class AgentController {

    private final AgentService agentService;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(AgentController.class);
    
    private Agent pendingAgent;
    private int verificationCode;
    private LocalTime codeGenerationTime;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AgentRegisterRequest request) {
        logger.info("Received registration request for email: {}", request.getEmail());
        
        // Vérifier si l'email existe déjà
        if (agentService.getAgentByLogin(request.getEmail()) != null) {
            logger.warn("Email already exists: {}", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        // Créer un nouvel agent avec mot de passe encodé
        pendingAgent = new Agent(
            request.getEmail(),
            passwordEncoder.encode(request.getPassword())  // Encoder le mot de passe ici
        );

        // Générer le code de vérification
        verificationCode = RandomCode.generate();
        codeGenerationTime = LocalTime.now();

        logger.info("Generated verification code for email: {}", request.getEmail());
        
        return ResponseEntity.ok(Map.of(
            "message", "Verification code generated successfully",
            "code", verificationCode
        ));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
        int code;
        try {
            code = Integer.parseInt(request.get("code"));
        } catch (NumberFormatException e) {
            logger.warn("Invalid code format");
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid code format"));
        }
        
        logger.info("Received verification code: {}", code);
        
        if (pendingAgent == null) {
            logger.warn("No pending registration found");
            return ResponseEntity.badRequest().body(Map.of("error", "No pending registration found"));
        }

        if (code != verificationCode) {
            logger.warn("Invalid verification code provided");
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid verification code"));
        }

        if (!isCodeValid()) {
            logger.warn("Verification code has expired");
            return ResponseEntity.badRequest().body(Map.of("error", "Verification code has expired"));
        }

        // Sauvegarder l'agent
        try {
            Agent savedAgent = agentService.save(pendingAgent);
            logger.info("Agent registered successfully: {}", savedAgent.getEmail());
            pendingAgent = null;
            return ResponseEntity.ok(Map.of("message", "Agent registered successfully"));
        } catch (Exception e) {
            logger.error("Error saving agent", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error registering agent"));
        }
    }

    @GetMapping("/resend-code")
    public ResponseEntity<?> resendVerificationCode() {
        if (pendingAgent == null) {
            logger.warn("No pending registration found for code resend");
            return ResponseEntity.badRequest().body(Map.of("error", "No pending registration found"));
        }

        verificationCode = RandomCode.generate();
        codeGenerationTime = LocalTime.now();

        logger.info("New verification code generated for: {}", pendingAgent.getEmail());
        
        return ResponseEntity.ok(Map.of(
            "message", "New verification code generated successfully",
            "code", verificationCode
        ));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAgents() {
        try {
            var agents = agentService.listAll();
            logger.info("Retrieved {} agents", agents.size());
            return ResponseEntity.ok(agents);
        } catch (Exception e) {
            logger.error("Error retrieving agents", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error retrieving agents"));
        }
    }

    private boolean isCodeValid() {
        return LocalTime.now().isBefore(codeGenerationTime.plusMinutes(3));
    }
}
