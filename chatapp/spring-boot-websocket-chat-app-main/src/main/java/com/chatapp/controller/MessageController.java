package com.chatapp.controller;

import com.chatapp.model.Chat;
import com.chatapp.model.Message;
import com.chatapp.model.User;
import com.chatapp.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


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

                    // Call Ollama API to get the response
                    String ollamaResponse = getOllamaResponse(message.getContent());

                    // Add the response message from Ollama
                    Message response = new Message();
                    response.setId(UUID.randomUUID().toString()); // Set unique ID for the response
                    response.setTimestamp(LocalDateTime.now());
                    response.setSender("Sys");
                    response.setContent(ollamaResponse);  // Use the response from Ollama
                    chat.getMessages().add(response);

                    userRepo.save(user); // Save the updated user with the new messages

                    // Return the response message from Ollama as the response
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

    // Helper method to call Ollama running locally
    private String getOllamaResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:11434/api/generate";  // Local endpoint for Ollama

        // Create headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Prepare the request body
        String requestBody = "{ \"prompt\": \"" + userMessage + "\" , \"model\":\"gemma2\"}";

        // Create HTTP entity with headers and body
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            // Get the raw body
            String rawResponse = response.getBody();

            // Split the response by newlines to get individual JSON objects
            String[] jsonResponses = rawResponse.split("\n");

            StringBuilder combinedResponse = new StringBuilder();

            // Loop through each JSON response string
            for (String jsonString : jsonResponses) {
                if (jsonString.trim().isEmpty()) {
                    continue;  // Skip empty lines
                }

                try {
                    // Parse each JSON object
                    JSONObject jsonResponse = new JSONObject(jsonString);

                    // Append the "response" field to the combined response
                    combinedResponse.append(jsonResponse.getString("response"));

                    // Check if "done" is true, and if so, stop processing
                    if (jsonResponse.getBoolean("done")) {
                        break;
                    }
                } catch (JSONException e) {
                    // Handle any parsing errors (you can log them if needed)
                    System.err.println("Error parsing JSON: " + e.getMessage());
                }
            }

            // Return the combined response
            return combinedResponse.toString().trim();
        } else {
            return "Sorry, I couldn't process your request.";
        }
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
