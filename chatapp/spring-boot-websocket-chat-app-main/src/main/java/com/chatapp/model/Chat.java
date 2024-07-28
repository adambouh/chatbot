package com.chatapp.model;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Chat {
    @Id
    private String Id;
    private String name;
    private ArrayList <Message> messages;
}
