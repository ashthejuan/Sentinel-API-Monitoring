package com.example.backend.controller;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import com.example.backend.model.Endpoint;
import com.example.backend.repository.EndpointRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.model.Notification;
import com.example.backend.repository.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationRepository notificationRepository;
    private final EndpointRepository endpointRepository;
    
    public NotificationController(NotificationRepository notificationRepository, EndpointRepository endpointRepository){
        this.notificationRepository = notificationRepository;
        this.endpointRepository = endpointRepository;
    }

    @PostMapping("/report")
    public ResponseEntity<String> reportFailure(@RequestBody Map<String, Object> payload){
        Object endpointValue = payload.get("endpointId");
        if (endpointValue == null) {
            endpointValue = payload.get("endpoint_id");
        }
        if (endpointValue == null || payload.get("message") == null) {
            System.out.println("[Notification] Missing endpoint_id or message in payload");
            return ResponseEntity.badRequest().body("Missing endpoint_id or message");
        }

        UUID endpointId;
        try {
            endpointId = UUID.fromString(endpointValue.toString());
        } catch (IllegalArgumentException e) {
            System.out.println("[Notification] Invalid UUID: " + endpointValue);
            return ResponseEntity.badRequest().body("Invalid endpoint_id format");
        }
        
        Optional<Endpoint> endpointOpt = endpointRepository.findById(endpointId);
        
        if (endpointOpt.isEmpty()) {
            System.out.println("[Notification] Endpoint not found: " + endpointId);
            return ResponseEntity.notFound().build();
        }
        
        Endpoint endpoint = endpointOpt.get();
        
        Notification note = new Notification();
        note.setEndpointId(endpointId);
        note.setUserId(endpoint.getUserId());
        note.setMessage(payload.get("message").toString());
        note.setIsRead(false);
        
        notificationRepository.save(note);
        
        return ResponseEntity.ok("Notification created");
    }
}
