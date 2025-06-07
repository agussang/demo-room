// Simple login form validation logic
document.addEventListener('DOMContentLoaded', function() {
  // Get the login form
  const loginForm = document.querySelector('form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      // Prevent the default form submission
      event.preventDefault();
      
      // Get form input values
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('remember')?.checked || false;
      
      // Simple validation
      if (username.trim() === '' || password.trim() === '') {
        alert('Silakan masukkan username dan password');
        return;
      }
      
      // In a real application, you would handle authentication here
      // For demo purposes, use these credentials
      if ((username === 'admin' && password === 'admin123') || (username === 'user' && password === 'password')) {
        // Save username if remember me is checked
        if (rememberMe) {
          localStorage.setItem('userName', username);
        }
        
        // Redirect to welcome page - use absolute path for better compatibility
        window.location.href = '/welcome.html';
      } else {
        // Show error message if element exists
        const errorEl = document.getElementById('login-error');
        if (errorEl) {
          errorEl.style.display = 'block';
          
          // Hide error message after 3 seconds
          setTimeout(function() {
            errorEl.style.display = 'none';
          }, 3000);
        } else {
          alert('Username atau password salah. Silakan coba lagi.');
        }
      }
    });
  }
});