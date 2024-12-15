package com.myrh.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Setter
@Getter
@NoArgsConstructor
public class RegisterRequest {

	@NotBlank(message = "Name is required.")
	private String name;

	@NotBlank(message = "Login is required.")
	private String login;

	@Email(message = "Email should be valid.")
	@NotBlank(message = "Email is required.")
	private String email;

	@Size(min = 8, message = "Password must be at least 8 characters long.")
	@NotBlank(message = "Password is required.")
	private String password;

	private String phone;
	private String address;
	private String imageUrl;
}
