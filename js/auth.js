export class AuthService {
  constructor() {
    this.storageKey = "dashboard_auth_token";
    this.userKey = "dashboard_user";
  }

  async login(email, password) {
    // Simulate API call delay
    await this.delay(500);

    // Mock authentication - in real app, this would call an API
    if (this.validateCredentials(email, password)) {
      const token = this.generateToken();
      localStorage.setItem(this.storageKey, token);
      localStorage.setItem(this.userKey, email);
      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated() {
    const token = localStorage.getItem(this.storageKey);
    return !!token; // In real app, would validate token expiry
  }

  getCurrentUser() {
    return localStorage.getItem(this.userKey);
  }

  validateCredentials(email, password) {
    // Mock validation - accept any valid email and password >= 6 chars
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && password.length >= 6;
  }

  generateToken() {
    // Mock token generation
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
