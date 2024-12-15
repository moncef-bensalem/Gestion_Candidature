package com.myrh.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class AuthRequest {
    private String login;
    private String password;
    private String type; // Either "company" or "agent"
}
