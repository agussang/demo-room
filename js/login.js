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
      
      // Simple validation
      if (username.trim() === '' || password.trim() === '') {
        alert('Silakan masukkan username dan password');
        return;
      }
      
      // In a real application, you would handle authentication here
      // For demo purposes, we'll just redirect to the dashboard
      window.location.href = 'dashboard/';
    });
  }
});