package com.myrh.services;

import com.myrh.utils.Enum;
import com.myrh.models.Company;
import com.myrh.repositories.CompanyRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    public CompanyService(CompanyRepository companyRepository,PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Company save(Company company){
        return companyRepository.save(company);
    }

    public List<Company> listAll(){
        return companyRepository.findAll();
    }

    public UserDetails findByEmail(String login) {
        // Directly fetch the company by login from the repository
        Company company = companyRepository.findByLogin(login);

        // If company is not found, throw an exception
        if (company == null) {
            throw new UsernameNotFoundException("User not found with login: " + login);
        }

        // Return a UserDetails object with company details
        return new User(
                company.getLogin(),
                company.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(Enum.role.COMPANY.toString()))
        );
    }

    public Company getCompanyByLogin(String login) {
        return companyRepository.findByLogin(login);
    }

    public Company getCompanyByEmail(String email) {
        return companyRepository.findByEmail(email);
    }

    public boolean checkPassword(Company company, String password) {
        return passwordEncoder.matches(password, company.getPassword());
    }
}
