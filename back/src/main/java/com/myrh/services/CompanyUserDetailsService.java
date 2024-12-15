package com.myrh.services;


import com.myrh.models.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
    public class CompanyUserDetailsService implements UserDetailsService {

        private final CompanyService companyService;

        @Autowired
        public CompanyUserDetailsService(CompanyService companyService) {
            this.companyService = companyService;
        }

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            // Retrieve the company by login (username)
            Company company = companyService.getCompanyByLogin(username);

            // If the company is not found, throw UsernameNotFoundException
            if (company == null) {
                throw new UsernameNotFoundException("Company not found with login: " + username);
            }

            // Return a UserDetails object based on the company details
            return new User(company.getLogin(), company.getPassword(), Collections.singleton(new SimpleGrantedAuthority("ROLE_COMPANY")));
        }


}
