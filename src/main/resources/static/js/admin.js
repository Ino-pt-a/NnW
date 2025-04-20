document.addEventListener('DOMContentLoaded', function() {
    // Загрузка текущего пользователя
    loadCurrentUser();

    // Загрузка списка пользователей
    loadUsers();

    // Загрузка списка ролей
    loadRoles();

    // Настройка обработчиков событий
    setupEventHandlers();
});

function loadCurrentUser() {
    axios.get('/api/user')
        .then(response => {
            const user = response.data;
            document.getElementById('currentUsername').textContent = user.username;

            const rolesContainer = document.getElementById('currentUserRoles');
            rolesContainer.innerHTML = '';

             user.roles.forEach(role => {
                const roleName = role.name || role.authority || role; // поддержка разных форматов
                const roleBadge = document.createElement('span');
                roleBadge.className = roleName === 'ROLE_ADMIN' ? 'role-badge admin' : 'role-badge user';
                roleBadge.textContent = roleName;
                rolesContainer.appendChild(roleBadge);
            });
        })
        .catch(error => {
            console.error('Error loading current user:', error);
        });
}

function loadUsers() {
    axios.get('/api/admin')
        .then(response => {
            const users = response.data;
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td id="roles-${user.id}"></td>
                    <td>
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                data-user-id="${user.id}"
                                onclick="loadUserData(this)">Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);

                // Добавляем роли для пользователя
                const rolesCell = document.getElementById(`roles-${user.id}`);
                user.roles.forEach(role => {
                    const roleBadge = document.createElement('span');
                    roleBadge.className = role.name === 'ROLE_ADMIN' ? 'role-badge admin' : 'role-badge user';
                    roleBadge.textContent = role.name;
                    rolesCell.appendChild(roleBadge);
                });
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });
}

function loadRoles() {
    axios.get('/api/admin/roles')
        .then(response => {
            const roles = response.data;
            const addRolesSelect = document.getElementById('newRoles');
            const editRolesSelect = document.getElementById('editRoles');

            // Очищаем select'ы
            addRolesSelect.innerHTML = '';
            editRolesSelect.innerHTML = '';

            // Заполняем options
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;

                // Клонируем option для второго select'а
                const editOption = option.cloneNode(true);

                addRolesSelect.appendChild(option);
                editRolesSelect.appendChild(editOption);
            });
        })
        .catch(error => {
            console.error('Error loading roles:', error);
        });
}

function setupEventHandlers() {
    // Обработчик формы добавления пользователя
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const selectedRoles = Array.from(document.getElementById('newRoles').selectedOptions)
            .map(option => ({ id: parseInt(option.value) }));

        const formData = {
            username: document.getElementById('addUsername').value,
            lastName: document.getElementById('addLastName').value,
            age: document.getElementById('addAge').value,
            email: document.getElementById('addEmail').value,
            password: document.getElementById('addPassword').value,
            roles: selectedRoles
        };

        axios.post('/api/admin', formData)
            .then(() => {
                alert('User added successfully');
                loadUsers();
                this.reset();

                // Сбрасываем выбор ролей
                Array.from(document.getElementById('newRoles').options).forEach(option => {
                    option.selected = false;
                });

                // Переключаем на вкладку со списком пользователей
                const tab = new bootstrap.Tab(document.getElementById('users-tab'));
                tab.show();
            })
            .catch(error => {
                console.error('Error adding user:', error);
                alert('Error adding user: ' + (error.response?.data?.message || error.message));
            });
    });

    // Обработчик формы редактирования пользователя
    document.getElementById('editUserForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const userId = document.getElementById('editId').value;
        const selectedRoles = Array.from(document.getElementById('editRoles').selectedOptions)
            .map(option => ({ id: parseInt(option.value) }));

        const formData = {
            username: document.getElementById('editUsername').value,
            lastName: document.getElementById('editLastName').value,
            age: document.getElementById('editAge').value,
            email: document.getElementById('editEmail').value,
            password: document.getElementById('editPassword').value || undefined,
            roles: selectedRoles
        };

        axios.put(`/api/admin/${userId}`, formData)
            .then(() => {
                alert('User updated successfully');
                loadUsers();

                // Закрываем модальное окно
                const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                modal.hide();
            })
            .catch(error => {
                console.error('Error updating user:', error);
                alert('Error updating user: ' + (error.response?.data?.message || error.message));
            });
    });

    // Обработчик выхода из системы
    document.getElementById('logoutForm').addEventListener('submit', function(e) {
        e.preventDefault();

        axios.post('/logout')
            .then(() => {
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('Error logging out:', error);
                window.location.href = '/login';
            });
    });
}

function loadUserData(button) {
    const userId = button.getAttribute('data-user-id');

    axios.get(`/api/admin/${userId}`)
        .then(response => {
            const user = response.data;

            document.getElementById('editId').value = user.id;
            document.getElementById('editUsername').value = user.username;
            document.getElementById('editLastName').value = user.lastName;
            document.getElementById('editAge').value = user.age;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editPassword').value = '';

            // Устанавливаем выбранные роли
            const editRolesSelect = document.getElementById('editRoles');
            Array.from(editRolesSelect.options).forEach(option => {
                option.selected = user.roles.some(role => role.id === parseInt(option.value));
            });
        })
        .catch(error => {
            console.error('Error loading user data:', error);
            alert('Error loading user data: ' + (error.response?.data?.message || error.message));
        });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        axios.delete(`/api/admin/${userId}`)
            .then(() => {
                alert('User deleted successfully');
                loadUsers();
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Error deleting user: ' + (error.response?.data?.message || error.message));
            });
    }
}