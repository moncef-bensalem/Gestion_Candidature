package com.myrh.config;

import com.myrh.services.AgentService;
import com.myrh.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;

@Configuration
public class ApplicationConfig {

    @Autowired
    private AgentService agentService;

    @Autowired
    private CompanyService companyService;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // First try to find agent
            var agent = agentService.getAgentByLogin(username);
            if (agent != null) {
                return org.springframework.security.core.userdetails.User
                    .withUsername(agent.getEmail())
                    .password(agent.getPassword())
                    .authorities("ROLE_AGENT")
                    .build();
            }
            
            // Then try to find company
            var company = companyService.getCompanyByLogin(username);
            if (company != null) {
                return org.springframework.security.core.userdetails.User
                    .withUsername(company.getEmail())
                    .password(company.getPassword())
                    .authorities("ROLE_COMPANY")
                    .build();
            }
            
            throw new UsernameNotFoundException("User not found with username: " + username);
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
