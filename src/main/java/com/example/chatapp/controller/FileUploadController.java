package com.example.chatapp.controller;

import java.io.IOException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.chatapp.model.ChatMessage;

@RestController
public class FileUploadController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/uploadPhoto")
    public void uploadPhoto(@RequestParam("file") MultipartFile file, @RequestParam("username") String username) throws IOException {
        String base64Content = Base64.getEncoder().encodeToString(file.getBytes());
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(username);
        chatMessage.setContent(base64Content);
        chatMessage.setType(ChatMessage.MessageType.PHOTO);
        messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }

  
}