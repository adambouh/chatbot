package com.chatapp.service;

import com.chatapp.model.User;
import com.chatapp.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceUser implements UserDetailsService {
    @Autowired
    private  UserRepo userRepo;

    public  User findByUsername(String username) {
        List<User> users = userRepo.findAll();
        for (User user : users) {
            System.out.println(users);
            if (user.getUsername().equals(username)) {
                return user;
            }
        }
        return null; // Or throw an exception if preferred
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), user.getAuthorities());
    }
}
