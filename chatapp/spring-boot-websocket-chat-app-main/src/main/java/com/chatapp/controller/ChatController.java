package com.chatapp.controller;

import com.chatapp.model.Chat;
import com.chatapp.model.User;
import com.chatapp.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/{userId}/add")
    public void addChat(@PathVariable String userId, @RequestBody Chat chat) {
        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            chat.setId(UUID.randomUUID().toString()); // Set unique ID for the chat
            user.getChats().add(chat);
            userRepo.save(user);
        }
    }
    @GetMapping("/{userId}/")
    public ResponseEntity<List<Chat>> getUserChats(@PathVariable String userId) {
        Optional<User> userOptional = userRepo.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseEntity.ok(user.getChats());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/{userId}/{chatId}")
    public Optional<Chat> getChat(@PathVariable String userId, @PathVariable String chatId) {
        Optional<User> optionalUser = userRepo.findById(userId);
        return optionalUser.flatMap(user -> user.getChats().stream().filter(chat -> chat.getId().equals(chatId)).findFirst());
    }
    @PutMapping("/{userId}/update/{chatId}")
    public ResponseEntity<Chat> updateChat(@PathVariable String userId, @PathVariable String chatId, @RequestBody Chat chatDetails) {
        Optional<User> optionalUser = userRepo.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Chat> optionalChat = user.getChats().stream()
                    .filter(chat -> chat.getId().equals(chatId))
                    .findFirst();

            if (optionalChat.isPresent()) {
                Chat chat = optionalChat.get();
                chat.setName(chatDetails.getName());
                chat.setMessages(chatDetails.getMessages());
                userRepo.save(user);
                return ResponseEntity.ok(chat);
            } else {
                System.out.println("Chat not found with ID: " + chatId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            System.out.println("User not found with ID: " + userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{userId}/delete/{chatId}")
    public void deleteChat(@PathVariable String userId, @PathVariable String chatId) {
        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.getChats().removeIf(chat -> chat.getId().equals(chatId));
            userRepo.save(user);
        }
    }
}
