// package com.example.chatapp.controller;
// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.Payload;
// import org.springframework.messaging.handler.annotation.SendTo;
// import org.springframework.stereotype.Controller;
// import com.example.chatapp.model.ChatMessage;
// @Controller
// public class ChatController {
//     @MessageMapping("/chat.sendMessage")
//     @SendTo("/topic/public")
//     public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
//         return chatMessage;
//     }
//     @MessageMapping("/chat.addUser")
//     @SendTo("/topic/public")
//     public ChatMessage addUser(@Payload ChatMessage chatMessage) {
//         return chatMessage;
//     }
//     @MessageMapping("/chat.sendPhoto")
//     @SendTo("/topic/public")
//     public ChatMessage sendPhoto(@Payload ChatMessage chatMessage) {
//         return chatMessage;
//     }
//     @MessageMapping("/chat.sendVoice")
//     @SendTo("/topic/public")
//     public ChatMessage sendVoice(@Payload ChatMessage chatMessage) {
//         return chatMessage;
//     }
// }
package com.example.chatapp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.chatapp.model.ChatMessage;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.removeUser")
    @SendTo("/topic/public")
    public ChatMessage removeUser(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.sendPhoto")
    @SendTo("/topic/public")
    public ChatMessage sendPhoto(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }
}
