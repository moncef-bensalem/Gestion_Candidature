package com.myrh.services;

import com.myrh.utils.Enum;
import com.myrh.models.Agent;
import com.myrh.repositories.AgentRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

@Service
public class AgentService {
    private static final Logger logger = LoggerFactory.getLogger(AgentService.class);
    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;
    private int test;

    public AgentService(AgentRepository agentRepository, PasswordEncoder passwordEncoder) {
        this.agentRepository = agentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Agent save(Agent agent) {
        // Encoder le mot de passe avant de sauvegarder
        agent.setPassword(passwordEncoder.encode(agent.getPassword()));
        return agentRepository.save(agent);
    }

    public List<Agent> listAll() {
        return agentRepository.findAll();
    }

    public UserDetails findByEmail(String login) {
        Agent user = agentRepository.findAll()
                .stream()
                .filter(u -> (u.getEmail()).equals(login))
                .findFirst()
                .orElse(null);
        return user != null ? new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(Enum.role.AGENT.toString()))) : null;
    }

    public Agent getAgentByLogin(String login) {
        return agentRepository.findByEmail(login);
    }

    public boolean checkPassword(Agent agent, String rawPassword) {
        if (agent == null || rawPassword == null) {
            logger.error("Agent or password is null");
            return false;
        }

        String storedPassword = agent.getPassword();
        if (storedPassword == null) {
            logger.error("Stored password is null for agent: {}", agent.getEmail());
            return false;
        }

        try {
            // Vérifier si le mot de passe correspond
            return passwordEncoder.matches(rawPassword, storedPassword);
        } catch (Exception e) {
            logger.error("Error checking password for agent: {}", agent.getEmail(), e);
            return false;
        }
    }
}
