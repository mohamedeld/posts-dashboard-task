export class Utils {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }
  }

  static hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("show");
    }
  }

  static clearErrors(elementIds) {
    elementIds.forEach((id) => this.hideError(id));
  }

  static showToast(message, type = "info") {
    // Create toast element if it doesn't exist
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 24px;
                background: var(--primary-color);
                color: white;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease-in-out;
                font-size: 14px;
                font-weight: 500;
                max-width: 300px;
            `;
      document.body.appendChild(toast);
    }

    // Set background color based on type
    const colors = {
      success: "var(--success-color)",
      error: "var(--error-color)",
      warning: "var(--warning-color)",
      info: "var(--primary-color)",
    };

    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;

    // Show toast
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)";
    });

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
    }, 3000);
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
}
