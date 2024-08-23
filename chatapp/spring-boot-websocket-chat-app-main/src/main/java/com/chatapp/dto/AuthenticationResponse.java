package com.chatapp.dto;

import lombok.Getter;

@Getter
public class AuthenticationResponse {
    private final String jwt, username, Id;

    public AuthenticationResponse(String jwt, String username, String Id) {
        this.jwt = jwt;
        this.username = username;
        this.Id = Id;
    }

}
