    package ru.kata.spring.boot_security.demo.controller;


    import org.springframework.web.bind.annotation.CrossOrigin;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    import ru.kata.spring.boot_security.demo.model.User;
    import ru.kata.spring.boot_security.demo.service.UserService;

    import java.security.Principal;

    @RestController
    @RequestMapping("/api/user")
    @CrossOrigin
    public class UserRestController {

        private final UserService userService;

        public UserRestController(UserService userService)  {
            this.userService = userService;
        }

        @GetMapping
        public User getUser(Principal principal) {
            return userService.findByUsername(principal.getName());
        }

    }
