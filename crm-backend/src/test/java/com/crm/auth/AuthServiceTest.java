package com.crm.auth;

import com.crm.auth.dto.LoginRequest;
import com.crm.auth.dto.LoginResponse;
import com.crm.auth.dto.RegisterRequest;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("u1");
        user.setEmail("admin@crm.com");
        user.setPassword("encoded_password");
        user.setFullName("Admin User");

        ReflectionTestUtils.setField(authService, "jwtSecret", "Y3JtLWFwcGxpY2F0aW9uLXNlY3JldC1rZXktMjAyNC1zdXBlci1zZWN1cmUtand0LXNpZ25pbmcta2V5");
        ReflectionTestUtils.setField(authService, "jwtExpiration", 3600000L);
    }

    @Test
    void register_ShouldSaveUser() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@crm.com");
        request.setPassword("password");
        request.setFullName("New User");

        when(userRepository.existsByEmail("new@crm.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        authService.register(request);

        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password");
    }

    @Test
    void login_WithCorrectCredentials_ShouldReturnToken() {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@crm.com");
        request.setPassword("password");

        when(userRepository.findByEmail("admin@crm.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encoded_password")).thenReturn(true);

        LoginResponse result = authService.login(request);

        assertNotNull(result);
        assertNotNull(result.getToken());
        assertEquals("admin@crm.com", result.getEmail());
    }

    @Test
    void login_WithWrongPassword_ShouldThrowException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@crm.com");
        request.setPassword("wrong");

        when(userRepository.findByEmail("admin@crm.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded_password")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }
}
