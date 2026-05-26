// ===================================
// Authentication JavaScript
// ===================================

// Password validation
function validatePassword(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const strength = Object.values(requirements).filter(Boolean).length;
  
  return {
    requirements,
    strength, // 0-5
    isValid: strength >= 4
  };
}

// Password strength meter
function updatePasswordStrength(password, meterElement) {
  if (!meterElement) return;
  
  const { strength } = validatePassword(password);
  
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  
  meterElement.style.width = `${(strength / 5) * 100}%`;
  meterElement.style.background = colors[strength - 1] || colors[0];
  meterElement.dataset.label = labels[strength - 1] || labels[0];
}

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Form validation helpers
function showFieldError(inputElement, errorElement, message) {
  inputElement.classList.add('error');
  inputElement.classList.remove('success');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function showFieldSuccess(inputElement, errorElement) {
  inputElement.classList.remove('error');
  inputElement.classList.add('success');
  if (errorElement) {
    errorElement.classList.remove('show');
  }
}

// Login form validation
function validateLoginForm(email, password) {
  const errors = [];
  
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  
  return errors;
}

// Register form validation
function validateRegisterForm(name, email, password, confirmPassword) {
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }
  
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  const passwordValidation = validatePassword(password);
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!passwordValidation.isValid) {
    errors.push({ field: 'password', message: 'Password does not meet requirements' });
  }
  
  if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }
  
  return errors;
}

// Forgot password validation
function validateForgotPassword(email) {
  if (!email) {
    return [{ field: 'email', message: 'Email is required' }];
  } else if (!isValidEmail(email)) {
    return [{ field: 'email', message: 'Please enter a valid email address' }];
  }
  return [];
}

// Auth state management
const auth = {
  isAuthenticated() {
    return localStorage.getItem('mediahub_auth_token') !== null;
  },
  
  getUser() {
    const user = localStorage.getItem('mediahub_user');
    return user ? JSON.parse(user) : null;
  },
  
  login(token, userData) {
    localStorage.setItem('mediahub_auth_token', token);
    localStorage.setItem('mediahub_user', JSON.stringify(userData));
  },
  
  logout() {
    localStorage.removeItem('mediahub_auth_token');
    localStorage.removeItem('mediahub_user');
    window.location.href = 'login.html';
  },
  
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
    }
  }
};

// Protect pages that require authentication
function protectPage() {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
  }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validatePassword,
    updatePasswordStrength,
    isValidEmail,
    showFieldError,
    showFieldSuccess,
    validateLoginForm,
    validateRegisterForm,
    validateForgotPassword,
    auth,
    protectPage
  };
}
