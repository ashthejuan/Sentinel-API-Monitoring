package com.example.backend.service;

import com.example.backend.model.Endpoint;
import com.example.backend.repository.EndpointRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;


@Service
public class MonitoringScheduler {
    private final EndpointRepository repository;
    private final StringRedisTemplate redisTemplate;
    private final Map<UUID, Long> lastCheckTimes = new ConcurrentHashMap<>();

    private static final int DEFAULT_INTERVAL_MINUTES = 1;

    public MonitoringScheduler(EndpointRepository repository, StringRedisTemplate redisTemplate){
        this.repository = repository;
        this.redisTemplate = redisTemplate;
    }

    @Scheduled(fixedRate = 10000) // Check every 10 seconds if any endpoint is due
    public void schedulePings(){
        List<Endpoint> activeEndpoints = repository.findAllByIsActiveTrue();
        long now = System.currentTimeMillis();
        int queuedCount = 0;

        for (Endpoint endpoint : activeEndpoints){
            int intervalMinutes = endpoint.getCheckIntervalMinutes() != null 
                ? endpoint.getCheckIntervalMinutes() 
                : DEFAULT_INTERVAL_MINUTES;
            
            long intervalMs = intervalMinutes * 60 * 1000L;
            Long lastCheck = lastCheckTimes.get(endpoint.getId());

            // Queue if never checked or interval has elapsed
            if (lastCheck == null || (now - lastCheck) >= intervalMs) {
                String payload = String.format(
                    "{\"id\":\"%s\", \"url\":\"%s\", \"method\":\"%s\"}", 
                    endpoint.getId(), endpoint.getUrl(), endpoint.getMethod()
                );
                redisTemplate.opsForList().leftPush("ping_tasks", payload);
                lastCheckTimes.put(endpoint.getId(), now);
                queuedCount++;
            }
        }

        // Clean up entries for endpoints that no longer exist
        lastCheckTimes.keySet().removeIf(id -> 
            activeEndpoints.stream().noneMatch(e -> e.getId().equals(id))
        );

        if (queuedCount > 0) {
            System.out.println("Queued " + queuedCount + " tasks to redis");
        }
    }
}

