package com.chatapp.repository;
import com.chatapp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepo extends MongoRepository <User,String> {
    Optional<User> findByUsername(String Username);

}
