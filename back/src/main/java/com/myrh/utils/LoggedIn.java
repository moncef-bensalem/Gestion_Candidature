package com.myrh.utils;

import com.myrh.models.Agent;
import com.myrh.models.Company;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoggedIn {

    private Company company;
    private Agent agent;
    private String token;
    private String role;
	public Company getCompany() {
		return company;
	}
	public void setCompany(Company company) {
		this.company = company;
	}
	public Agent getAgent() {
		return agent;
	}
	public void setAgent(Agent agent) {
		this.agent = agent;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}

}
