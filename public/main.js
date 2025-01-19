document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    if (currentPath === '/index.html' || currentPath === '/') {
        // Login Form Logic: Only active for login page
        document.getElementById("loginForm")?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const passwrd = document.getElementById('password').value;

            if (sessionStorage.getItem('user')) {
                alert('You are already logged in !');
                window.location.href = '/dashboard.html';
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, passwrd }),
                });
                const data = await response.json();
                if (response.ok) {
                    sessionStorage.setItem('user', username);
                    console.log('Login successful. Redirecting to dashboard...');
                    window.location.href = '/dashboard.html'; // Redirect after login
                } else {
                    const errorText = await response.text(); // Get error details from backend
                    alert(`Login failed: ${data.error || errorText}`);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        });
    } else if (currentPath === '/dashboard.html') {
        // Protect dashboard page: Check session validity
        fetch('/auth', { method: 'GET' })
            .then((response) => {
                if (!response.ok) {
                    console.warn('Not authenticated. Redirecting to login...');
                    window.location.href = '/index.html'; // Redirect to login if not authenticated
                }
            })
            .catch((error) => {
                console.error('Auth check error:', error);
                alert('Error validating session. Please log in again.');
                window.location.href = '/index.html';
            });

        // Logout Logic
        document.getElementById('logoutButton')?.addEventListener('click', async () => {
            try {
                const response = await fetch('/logout', { method: 'POST' });
                if (response.ok) {
                    console.log('Logged out successfully');
                    window.location.href = '/';
                } else {
                    console.error('Failed to logout');
                    alert('An error occurred while logging out.');
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        });

        // Dashboard Setup and Role-based Button Configuration
        async function fetchUserRole() {
            try {
                console.log('Fetching user role ...');
                const response = await fetch('/dashboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }
                const data = await response.json();
                console.log('User role fetched successfully:', data.role);
                return data.role;
            } catch (err) {
                console.error('Error fetching user role: ', err.message);
                alert("An error occurred while setting up the dashboard. Please try again later.");
                return null;
            }
        }

        function configureButtons(role) {
            try {
                console.log('Configure buttons for role:', role);
                gradeBtn.style.display = 'none';
                uploadBtn.style.display = 'none';
                gradesBtn.style.display = 'none';
                adminBtn.style.display = 'none';

                if (role === 'student') {
                    gradesBtn.style.display = 'block';
                    uploadBtn.style.display = 'block';
                }
                else if (role === 'ta') {
                    gradeBtn.style.display = 'block';
                    gradesBtn.style.display = 'block';
                }
                else if (role === 'teacher') {
                    gradeBtn.style.display = 'block';
                    gradesBtn.style.display = 'block';
                }
                else if (role === 'administrator') {
                    gradeBtn.style.display = 'block';
                    uploadBtn.style.display = 'block';
                    gradesBtn.style.display = 'block';
                    adminBtn.style.display = 'block';
                }
                else {
                    console.warn('Unknown role or no access: ', role);
                    alert('You do not have access to this page.');
                }
            } catch (err) {
                console.error('Error configuring buttons: ', err.message);
            }
        }

        function attachEventListeners() {
            console.log('Attaching event listeners ...');
            gradesBtn?.addEventListener('click', () => {
                window.location.href = 'public/grades';
            });
            gradeBtn?.addEventListener('click', () => {
                window.location.href = 'public/grade';
            });
            uploadBtn?.addEventListener('click', () => {
                window.location.href = 'public/upload';
            });
            adminBtn?.addEventListener('click', () => {
                window.location.href = 'public/admin';
            });
        }

        async function setUpDashboard() {
            const role = await fetchUserRole();
            if (role) {
                configureButtons(role);
                attachEventListeners();
            }
        }

        setUpDashboard();
    } // End of dashboard logic
}); // Closing DOMContentLoaded
