package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    User save(User user);
    List<User> findAll();
    User findById(Long id);
    void delete(Long id);
    User update(Long id, User user);
    User findByUsername(String username);
}