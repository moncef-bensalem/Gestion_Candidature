package com.myrh.controllers;

import com.myrh.dto.AuthRequest;
import com.myrh.dto.AuthResponse;
import com.myrh.models.Agent;
import com.myrh.models.Company;
import com.myrh.services.AgentService;
import com.myrh.services.CompanyService;
import com.myrh.utils.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AgentService agentService;
    private final CompanyService companyService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request) {
        try {
            String login = request.getLogin();
            String password = request.getPassword();
            String userType = request.getType();

            logger.info("Authentication attempt - Login: {}, Type: {}", login, userType);

            // Validation des champs
            if (userType == null || login == null || login.isEmpty() || password == null || password.isEmpty()) {
                logger.error("Invalid request - Missing required fields - Login: {}, Type: {}", login, userType);
                return ResponseEntity.badRequest().body("Tous les champs sont obligatoires");
            }

            // Authentification selon le type d'utilisateur
            if ("company".equalsIgnoreCase(userType)) {
                return authenticateCompany(login, password);
            } else if ("agent".equalsIgnoreCase(userType)) {
                return authenticateAgent(login, password);
            } else {
                logger.error("Invalid user type: {}", userType);
                return ResponseEntity.badRequest().body("Type d'utilisateur invalide");
            }

        } catch (Exception e) {
            logger.error("Authentication error for user: {}", request.getLogin(), e);
            return ResponseEntity.internalServerError()
                    .body("Erreur d'authentification: " + e.getMessage());
        }
    }

    private ResponseEntity<?> authenticateAgent(String login, String password) {
        try {
            logger.info("Attempting agent authentication for login: {}", login);
            
            // Récupérer l'agent
            Agent agent = agentService.getAgentByLogin(login);
            if (agent == null) {
                logger.error("Agent not found with login: {}", login);
                return ResponseEntity.status(401).body(Map.of("message", "Agent non trouvé"));
            }

            logger.info("Agent found, checking password...");
            
            // Vérifier le mot de passe
            if (!passwordEncoder.matches(password, agent.getPassword())) {
                logger.error("Invalid password for agent: {}", login);
                return ResponseEntity.status(401).body(Map.of("message", "Mot de passe incorrect"));
            }

            logger.info("Password verified successfully, generating token...");

            // Générer le token
            String token = jwtUtils.generateToken(agent.getEmail(), "agent");
            logger.info("Agent authentication successful for: {}", login);
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "type", "agent",
                "email", agent.getEmail()
            ));

        } catch (Exception e) {
            logger.error("Error during agent authentication: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("message", "Erreur d'authentification"));
        }
    }

    private ResponseEntity<?> authenticateCompany(String login, String password) {
        try {
            logger.info("Attempting company authentication for login: {}", login);
            
            // Récupérer l'entreprise
            Company company = companyService.getCompanyByLogin(login);
            if (company == null) {
                logger.error("Company not found with login: {}", login);
                return ResponseEntity.status(404).body("Entreprise non trouvée");
            }

            // Vérifier le mot de passe
            if (!companyService.checkPassword(company, password)) {
                logger.error("Invalid password for company: {}", login);
                return ResponseEntity.status(401).body("Mot de passe incorrect");
            }

            // Générer le token
            String token = jwtUtils.generateToken(company.getLogin(), "company");
            logger.info("Company authentication successful for: {}", login);
            
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (Exception e) {
            logger.error("Error during company authentication: {}", login, e);
            throw e;
        }
    }

    @PostMapping("/register/company")
    public ResponseEntity<?> registerCompany(@RequestBody Company company) {
        try {
            logger.info("Company registration attempt - Login: {}", company.getLogin());

            // Vérifier si l'entreprise existe déjà
            if (companyService.getCompanyByLogin(company.getLogin()) != null) {
                logger.error("Company already exists with login: {}", company.getLogin());
                return ResponseEntity.badRequest().body("Cette entreprise existe déjà");
            }

            // Encoder le mot de passe
            company.setPassword(passwordEncoder.encode(company.getPassword()));

            // Sauvegarder l'entreprise
            Company savedCompany = companyService.save(company);
            logger.info("Company registration successful for: {}", company.getLogin());

            // Générer le token
            String token = jwtUtils.generateToken(savedCompany.getLogin(), "company");
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (Exception e) {
            logger.error("Error during company registration: {}", company.getLogin(), e);
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de l'enregistrement: " + e.getMessage());
        }
    }
}