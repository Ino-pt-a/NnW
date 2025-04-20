    package ru.kata.spring.boot_security.demo.model;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import org.springframework.security.core.GrantedAuthority;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.transaction.annotation.Transactional;

    import javax.persistence.*;
    import javax.validation.constraints.*;
    import java.util.Collection;
    import java.util.HashSet;
    import java.util.Set;

    @Entity
    @Table(name = "users")
    public class User implements UserDetails {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "username", unique = true)
        @NotEmpty(message = "Username cannot be empty")
        @Pattern(regexp = "^[A-Za-zА-Яа-я\\s]+$", message = "Username should contain only letters")
        private String username;

        @Column(name = "email", unique = true)
        @NotEmpty(message = "Email cannot be empty")
        @Email(message = "Email should be valid")
        private String email;

        @Min(value = 1, message = "Age should be positive")
        private int age;

        @Column(name = "last_name")
        @NotEmpty
        @Pattern(regexp = "^[A-Za-zА-Яа-я\\s]+$")
        private String lastName;


        @Column(name = "password")
        @NotEmpty
        private String password;

        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(name = "users_roles",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "role_id"))
        private Set<Role> roles;


        public User() {
        }

        public User(String name, String email, String lastName, String password, Set<Role> roles) {
            this.username = name;
            this.email = email;
            this.lastName = lastName;
            this.password = password;
            this.roles = roles;
        }

        @Override
        @Transactional
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return getRoles();
        }

        @Override
        public String getUsername() {
            return username;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        @Override
        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public Set<Role> getRoles() {
            return roles;
        }

        public void setRoles(Set<Role> roles) {
            this.roles = roles;
        }
    }