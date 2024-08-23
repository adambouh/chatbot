package com.chatapp.controller;

import com.chatapp.dto.AuthenticationResponse;
import com.chatapp.dto.Login;
import com.chatapp.model.User;
import com.chatapp.repository.UserRepo;
import com.chatapp.service.ServiceUser;
import com.chatapp.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ServiceUser serviceUser;

    // Add a new user
    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        //bcrypt password
        return userRepo.save(user);
    }

    // Get a user by ID
    @GetMapping("/{id}")
    public Optional<User> getUser(@PathVariable String id) {
        return userRepo.findById(id);
    }

    // Get all users
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // Handle user login and JWT token generation
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody Login loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        User user = serviceUser.findByUsername(username);

        if (user != null) {
            if (user.getPassword().equals(password)) {
                // Generate JWT token
                String jwt = jwtUtil.generateToken(username);
                AuthenticationResponse authResponse = new AuthenticationResponse(jwt, user.getUsername(), user.getId());

                // Return JWT token and user details in response
                return ResponseEntity.ok(authResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Update a user by ID
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User userDetails) {
        return userRepo.findById(id)
                .map(user -> {
                    user.setUsername(userDetails.getUsername());
                    user.setPassword(userDetails.getPassword());
                    return userRepo.save(user);
                })
                .orElseGet(() -> {
                    userDetails.setId(id);
                    return userRepo.save(userDetails);
                });
    }

    // Delete a user by ID
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepo.deleteById(id);
    }

    // Verify JWT token validity
    @GetMapping("/session/verify")
    public ResponseEntity<String> verifyToken(@RequestHeader("Authorization") String token) {
        System.out.println("Token verification endpoint hit"); // Log to confirm endpoint access

        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            try {
                String username = jwtUtil.extractUsername(jwt);

                if (username != null && jwtUtil.validateToken(jwt, username)) {
                    return ResponseEntity.ok("Token is valid");
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token is invalid or expired");
                }
            } catch (ExpiredJwtException e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token is expired");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token is missing or malformed");
        }
    }

    // Logout is not necessary with JWT, as it’s stateless. However, you can still invalidate the token on the client side.
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // No server-side logic for JWT logout, just inform the client to delete the token
        return ResponseEntity.ok("Logged out successfully");
    }
}
