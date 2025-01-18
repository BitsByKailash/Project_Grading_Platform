/*// Login Page
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard.html';
    } else {
        alert('Invalid login credentials');
    }
});

// Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    const roleMessage = document.getElementById('roleMessage');
    const actionsDiv = document.getElementById('actions');

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const response = await fetch('/auth', {
        method: 'GET',
        headers: { Authorization: 'Bearer ${token}' },
    });

    if (response.ok) {
        const userData = await response.json();
        const userRole = userData.role;

        roleMessage.innerText = 'Welcome, ${userRole}!';

        if (userRole === 'student') {
            actionsDiv.innerHTML = `
                <a href="/upload.html">Upload Assignment</a>
                <a href="/grades.html">View Grades</a>
            `;
        } else if (userRole === 'teaching assistant') {
            actionsDiv.innerHTML = `
                <a href="/grade.html">Grade Assignments</a>
                <a href="/grades.html">View Grades</a>
            `;
        } else if (userRole === 'teacher') {
            actionsDiv.innerHTML = `
                <a href="/verify-grade.html">Verify Grades</a>
                <a href="/grades.html">View All Grades</a>
            `;
        } else if (userRole === 'admin') {
            actionsDiv.innerHTML = `
                <a href="/admin.html">Manage Users</a>
                <a href="/grades.html">View All Grades</a>
            `;
        }
    } else {
        alert('Unauthorized! Redirecting to login.');
        window.location.href = '/';
    }
});

// Logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/';
});

// Login Page
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard.html';
        } else {
            const errorText = await response.text();
            alert(response);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred while logging in. Please try again.');
    }
});

// Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    const roleMessage = document.getElementById('roleMessage');
    const actionsDiv = document.getElementById('actions');

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch('/auth', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            const userData = await response.json();
            const userRole = userData.role;

            roleMessage.innerText = `Welcome, ${userRole}!`;

            if (userRole === 'student') {
                actionsDiv.innerHTML = `
                    <a href="/upload.html">Upload Assignment</a>
                    <a href="/grades.html">View Grades</a>
                `;
            } else if (userRole === 'teaching assistant') {
                actionsDiv.innerHTML = `
                    <a href="/grade.html">Grade Assignments</a>
                    <a href="/grades.html">View Grades</a>
                `;
            } else if (userRole === 'teacher') {
                actionsDiv.innerHTML = `
                    <a href="/verify-grade.html">Verify Grades</a>
                    <a href="/grades.html">View All Grades</a>
                `;
            } else if (userRole === 'admin') {
                actionsDiv.innerHTML = `
                    <a href="/admin.html">Manage Users</a>
                    <a href="/grades.html">View All Grades</a>
                `;
            }
        } else {
            alert('Unauthorized! Redirecting to login.');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while fetching user data. Please try again.');
        window.location.href = '/';
    }
});

// Logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/';
});
*/
// Login Page
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            console.log('Login successful. Redirecting to dashboard...');
            window.location.href = '/dashboard.html';
        } else {
            const errorText = await response.text(); // Get error details from backend
            console.error('Login failed:', errorText);
            alert(`Login failed: ${errorText}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});

// Dashboard Page
document.addEventListener('DOMContentLoaded', async () => {
    const roleMessage = document.getElementById('roleMessage');
    const actionsDiv = document.getElementById('actions');

    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No token found. Redirecting to login page.');
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch('/auth', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            const userData = await response.json();
            const userRole = userData.role;
            console.log(`User role: ${userRole}`);

            roleMessage.innerText = `Welcome, ${userRole}!`;

            // Dynamically populate the actions based on the user's role
            if (userRole === 'student') {
                actionsDiv.innerHTML = `
                    <a href="/upload.html">Upload Assignment</a>
                    <a href="/grades.html">View Grades</a>
                `;
            } else if (userRole === 'teaching assistant') {
                actionsDiv.innerHTML = `
                    <a href="/grade.html">Grade Assignments</a>
                    <a href="/grades.html">View Grades</a>
                `;
            } else if (userRole === 'teacher') {
                actionsDiv.innerHTML = `
                    <a href="/verify-grade.html">Verify Grades</a>
                    <a href="/grades.html">View All Grades</a>
                `;
            } else if (userRole === 'admin') {
                actionsDiv.innerHTML = `
                    <a href="/admin.html">Manage Users</a>
                    <a href="/grades.html">View All Grades</a>
                `;
            }
        } else {
            console.warn('Unauthorized access. Redirecting to login page.');
            alert('You are not authorized to view this page.');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while loading your dashboard. Please try again later.');
        window.location.href = '/';
    }
});

// Logout Functionality
document.getElementById('logoutButton')?.addEventListener('click', () => {
    console.log('Logging out...');
    localStorage.clear();
    window.location.href = '/';
});
