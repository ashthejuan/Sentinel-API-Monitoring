package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.ignoringRequestMatchers("/api/notifications/report"))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/notifications/report").permitAll()
                        .anyRequest().permitAll()
                )
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .build();
    }
}
