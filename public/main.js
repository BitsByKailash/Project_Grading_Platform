// document.addEventListener('DOMContentLoaded', () => {
//     const currentPath = window.location.pathname;

//     if (currentPath === '/index.html' || currentPath === '/') {
//         // Login Form Logic: Only active for login page
//         document.getElementById("loginForm")?.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const username = document.getElementById('username').value;
//             const passwrd = document.getElementById('password').value;
//             // console.log('username ',username);
//             // console.log('password ',password);
            
//             if (sessionStorage.getItem('user')) {
//                 alert('You are already logged in !');
//                 window.location.href = '/dashboard.html';
//                 return;
//             }

//             try {
//                 const response = await fetch('/login', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json', },
//                     body: JSON.stringify({ username, passwrd }),
//                 });
//                 const data = await response.json();
//                 if (response.ok) {
//                     sessionStorage.setItem('user',username);
//                     console.log('Login successful. Redirecting to dashboard...');
//                     window.location.href = '/dashboard.html'; // Redirect after login
//                 } else {
//                     const errorText = await response.text(); // Get error details from backend
//                     alert(data.error,`Login failed: ${errorText}`);
//                 }
//             } catch (error) {
//                 console.error('Login error:', error);
//                 alert('An unexpected error occurred. Please try again.');
//             }
//         });
//     } else if (currentPath === '/dashboard.html') {
//         // Protect dashboard page: Check session validity
//         fetch('/auth', { method: 'GET' })
//             .then((response) => {
//                 if (!response.ok) {
//                     console.warn('Not authenticated. Redirecting to login...');
//                     window.location.href = '/index.html'; // Redirect to login if not authenticated
//                 }
//             })
//             .catch((error) => {
//                 console.error('Auth check error:', error);
//                 alert('Error validating session. Please log in again.');
//                 window.location.href = '/index.html';
//             });

//         // Logout Logic
//         document.getElementById('logoutButton')?.addEventListener('click', async () => {
//             try {
//                 const response = await fetch('https://localhost:3000/logout',{method: 'GET'});
//                 if (response.ok) {
//                     console.log('Logged out successfully');
//                     window.location.href = '/';
//                 }
//                 else {
//                     console.error('Failed to logout');
//                     alert('An error occurred while logging out.');
//                 }
//             } catch (error) {
//                 console.error('Logout error: ',error);
//                 alert('An unexpected error occurred. Please try again.');
//             }
            
// });
    
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
    } // End of dashboard logic

}); // Closing DOMContentLoaded
