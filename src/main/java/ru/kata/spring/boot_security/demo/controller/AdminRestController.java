    package ru.kata.spring.boot_security.demo.controller;

    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import ru.kata.spring.boot_security.demo.model.Role;
    import ru.kata.spring.boot_security.demo.model.User;
    import ru.kata.spring.boot_security.demo.service.RoleService;
    import ru.kata.spring.boot_security.demo.service.UserService;

    import java.util.List;

    @RestController
    @RequestMapping("/api/admin")
    @CrossOrigin
    public class AdminRestController {
        private final UserService userService;
        private final RoleService roleService;

        public AdminRestController(UserService userService, RoleService roleService) {
            this.userService = userService;
            this.roleService = roleService;
        }

        @GetMapping
        public List<User> getAllUsers() {
            return userService.findAll();
        }

        @GetMapping("/{id}")
        public User getUser(@PathVariable Long id) {
            return userService.findById(id);
        }

        @GetMapping("/roles")
        public List<Role> getAllRoles() {
            return roleService.findAll();
        }

        @PostMapping
        public void createUser(@RequestBody User user) {
             userService.save(user);
        }

        @PutMapping("/{id}")
        public User updateUser(@PathVariable Long id, @RequestBody User user) {
            return userService.update(id, user);
        }

        @DeleteMapping("/{id}")
        public void deleteUser(@PathVariable Long id) {
            userService.delete(id);
        }
    }