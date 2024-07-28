package com.chatapp.repository;
import com.chatapp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository <User,String> {
}
