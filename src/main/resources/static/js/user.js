
async function loadCurrentUser() {
    try {
        const response = await fetch("/api/user");
        if (!response.ok) {
            throw new Error("Ошибка при загрузке текущего пользователя");
        }
        const user = await response.json();

        document.getElementById("currentUserId").textContent = user.id;
        document.getElementById("currentUserFirstName").textContent = user.username;
        document.getElementById("currentUserLastName").textContent = user.lastName;
        document.getElementById("currentUserAge").textContent = user.age;
        document.getElementById("currentUserEmail").textContent = user.email;
        document.getElementById("currentUserRoles").textContent = user.roles.map(r => r.name.replace("ROLE_", "")).join(", ");

        const navbarInfo = document.getElementById("navbarUserInfo");
        if (navbarInfo) {
            const rolesString = user.roles.map(r => r.name.replace("ROLE_", "")).join(", ");
            navbarInfo.textContent = `${user.username} (${user.email}) with roles: ${rolesString}`;
        }

    } catch (error) {
        console.error("Не удалось загрузить пользователя:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCurrentUser();
});
