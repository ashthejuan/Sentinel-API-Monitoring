package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;


@Entity
@Table(name="endpoints")
@Data
public class Endpoint {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    private String name;
    private String url;
    private String method;

    @Column(name = "expected_status")
    private Integer expectedStatus;

    @Column(name = "check_interval_minutes")
    private Integer checkIntervalMinutes;

    @Column(name = "is_active")
    private boolean isActive;
}
