package com.example.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID>{
    List<Notification> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

}
