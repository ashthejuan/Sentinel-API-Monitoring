package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name="notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "endpoint_id")
    private UUID endpointId;

    @Column(nullable = false)
    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
