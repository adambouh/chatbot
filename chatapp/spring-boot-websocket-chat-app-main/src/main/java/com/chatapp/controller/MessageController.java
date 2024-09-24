package com.chatapp.controller;

import com.chatapp.model.Chat;
import com.chatapp.model.Message;
import com.chatapp.model.User;
import com.chatapp.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private UserRepo userRepo;
    @PostMapping("/{userId}/{chatId}/add")
    public ResponseEntity<Message> addMessage(@PathVariable String userId, @PathVariable String chatId, @RequestBody Message message) {
        Optional<User> optionalUser = userRepo.findById(userId);

        if (optionalUser.isPresent()) {
            if (message.getSender().equals(userId)) {
                User user = optionalUser.get();
                Optional<Chat> optionalChat = user.getChats().stream()
                        .filter(chat -> chat.getId().equals(chatId))
                        .findFirst();

                if (optionalChat.isPresent()) {
                    Chat chat = optionalChat.get();

                    // Set message details
                    message.setId(UUID.randomUUID().toString()); // Set unique ID for the message
                    message.setTimestamp(LocalDateTime.now());
                    chat.getMessages().add(message);

                    // Add a system response message
                    Message response = new Message();
                    response.setId(UUID.randomUUID().toString()); // Set unique ID for the response
                    response.setTimestamp(LocalDateTime.now());
                    response.setSender("Sys");
                    response.setContent("hh jawab");
                    chat.getMessages().add(response);

                    userRepo.save(user); // Save the updated user with the new messages

                    // Return the original message as the response
                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Chat not found
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Message sender mismatch
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // User not found
    }


    @GetMapping("/{userId}/{chatId}/{messageId}")
    public Optional<Message> getMessage(@PathVariable String userId, @PathVariable String chatId, @PathVariable String messageId) {
        Optional<User> optionalUser = userRepo.findById(userId);
        return optionalUser.flatMap(user -> user.getChats().stream()
                .filter(chat -> chat.getId().equals(chatId))
                .flatMap(chat -> chat.getMessages().stream())
                .filter(message -> message.getId().equals(messageId))
                .findFirst());
    }
    @GetMapping("/{userId}/{chatId}")
    public ResponseEntity<List<Message>> getAllMessages(@PathVariable String userId, @PathVariable String chatId) {
        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Chat> optionalChat = user.getChats().stream()
                    .filter(chat -> chat.getId().equals(chatId))
                    .findFirst();
            if (optionalChat.isPresent()) {
                Chat chat = optionalChat.get();
                return ResponseEntity.ok(chat.getMessages());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{userId}/{chatId}/update/{messageId}")
    public void updateMessage(@PathVariable String userId, @PathVariable String chatId, @PathVariable String messageId, @RequestBody Message messageDetails) {
        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.getChats().stream()
                    .filter(chat -> chat.getId().equals(chatId))
                    .flatMap(chat -> chat.getMessages().stream())
                    .filter(message -> message.getId().equals(messageId))
                    .findFirst()
                    .ifPresent(message -> {
                        message.setContent(messageDetails.getContent());
                        message.setSender(messageDetails.getSender());
                        userRepo.save(user);
                    });
        }
    }

    @DeleteMapping("/{userId}/{chatId}/delete/{messageId}")
    public void deleteMessage(@PathVariable String userId, @PathVariable String chatId, @PathVariable String messageId) {
        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.getChats().stream()
                    .filter(chat -> chat.getId().equals(chatId))
                    .findFirst()
                    .ifPresent(chat -> {
                        chat.getMessages().removeIf(message -> message.getId().equals(messageId));
                        userRepo.save(user);
                    });
        }
    }
}
