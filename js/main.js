import { AuthService } from "./auth.js";
import { PostsService } from "./posts.js";
import { Router } from "./router.js";
import { Utils } from "./utils.js";

class DashboardApp {
  constructor() {
    this.authService = new AuthService();
    this.postsService = new PostsService();
    this.router = new Router();
    this.currentUser = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAuthAndRoute();
  }

  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", this.handleLogin.bind(this));
    }

    // Logout button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", this.handleLogout.bind(this));
    }

    // Navigation
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const route = link.dataset.route;
        this.router.navigateTo(route);
        this.updateActiveNav(route);
      });
    });

    // Posts controls
    this.setupPostsControls();

    // Post form
    this.setupPostForm();

    // Create post button
    const createPostBtn = document.getElementById("create-post-btn");
    if (createPostBtn) {
      createPostBtn.addEventListener("click", () => {
        this.router.navigateTo("create-post");
        this.updateActiveNav("create-post");
        this.resetPostForm();
      });
    }

    // Back to posts button
    const backToPostsBtn = document.getElementById("back-to-posts");
    if (backToPostsBtn) {
      backToPostsBtn.addEventListener("click", () => {
        this.router.navigateTo("posts");
        this.updateActiveNav("posts");
      });
    }
  }

  setupPostsControls() {
    const searchInput = document.getElementById("search-input");
    const sortField = document.getElementById("sort-field");
    const sortOrder = document.getElementById("sort-order");
    const pageSize = document.getElementById("page-size");
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    const retryBtn = document.getElementById("retry-btn");

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        Utils.debounce(() => {
          this.postsService.setSearch(searchInput.value);
          this.renderPosts();
        }, 300)
      );
    }

    if (sortField) {
      sortField.addEventListener("change", () => {
        this.postsService.setSorting(sortField.value, sortOrder.value);
        this.renderPosts();
      });
    }

    if (sortOrder) {
      sortOrder.addEventListener("change", () => {
        this.postsService.setSorting(sortField.value, sortOrder.value);
        this.renderPosts();
      });
    }

    if (pageSize) {
      pageSize.addEventListener("change", () => {
        this.postsService.setPageSize(parseInt(pageSize.value));
        this.renderPosts();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.postsService.previousPage();
        this.renderPosts();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.postsService.nextPage();
        this.renderPosts();
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this.loadPosts();
      });
    }
  }

  setupPostForm() {
    const postForm = document.getElementById("post-form");
    const resetBtn = document.getElementById("reset-form");
    const cancelBtn = document.getElementById("cancel-form");

    if (postForm) {
      postForm.addEventListener("submit", this.handlePostSubmit.bind(this));

      // Real-time validation
      const titleInput = document.getElementById("post-title");
      const bodyInput = document.getElementById("post-body");

      if (titleInput) {
        titleInput.addEventListener("input", () =>
          this.validateField("title", titleInput.value)
        );
        titleInput.addEventListener("blur", () =>
          this.validateField("title", titleInput.value)
        );
      }

      if (bodyInput) {
        bodyInput.addEventListener("input", () =>
          this.validateField("body", bodyInput.value)
        );
        bodyInput.addEventListener("blur", () =>
          this.validateField("body", bodyInput.value)
        );
      }
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetPostForm());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.router.navigateTo("posts");
        this.updateActiveNav("posts");
      });
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    // Clear previous errors
    Utils.clearErrors(["email-error", "password-error"]);

    // Validate
    let hasErrors = false;
    if (!Utils.validateEmail(email)) {
      Utils.showError("email-error", "Please enter a valid email address");
      hasErrors = true;
    }
    if (password.length < 6) {
      Utils.showError(
        "password-error",
        "Password must be at least 6 characters"
      );
      hasErrors = true;
    }

    if (hasErrors) return;

    // Simulate login
    const success = await this.authService.login(email, password);
    if (success) {
      this.currentUser = email;
      this.showDashboard();
      this.loadPosts();
    }
  }

  handleLogout() {
    this.authService.logout();
    this.currentUser = null;
    this.showLogin();
  }

  async handlePostSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title").trim();
    const body = formData.get("body").trim();

    // Clear previous errors
    Utils.clearErrors(["title-error", "body-error"]);

    // Validate
    let hasErrors = false;
    if (!this.validateField("title", title)) hasErrors = true;
    if (!this.validateField("body", body)) hasErrors = true;

    if (hasErrors) return;

    // Check if editing or creating
    const editingId = document.getElementById("post-form").dataset.editingId;

    if (editingId) {
      // Update existing post
      this.postsService.updatePost(parseInt(editingId), { title, body });
    } else {
      // Create new post
      this.postsService.addPost({ title, body });
    }

    // Navigate back to posts
    this.router.navigateTo("posts");
    this.updateActiveNav("posts");
    this.renderPosts();

    // Show success message
    Utils.showToast(
      `Post ${editingId ? "updated" : "created"} successfully!`,
      "success"
    );
  }

  validateField(field, value) {
    const errorElement = document.getElementById(`${field}-error`);
    let isValid = true;
    let message = "";

    switch (field) {
      case "title":
        if (value.length < 3) {
          message = "Title must be at least 3 characters";
          isValid = false;
        }
        break;
      case "body":
        if (value.length < 10) {
          message = "Content must be at least 10 characters";
          isValid = false;
        }
        break;
    }

    if (isValid) {
      Utils.hideError(`${field}-error`);
    } else {
      Utils.showError(`${field}-error`, message);
    }

    return isValid;
  }

  checkAuthAndRoute() {
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      this.currentUser = this.authService.getCurrentUser();
      this.showDashboard();
      this.loadPosts();
    } else {
      this.showLogin();
    }
  }

  showLogin() {
    this.router.showPage("login-page");
  }

  showDashboard() {
    this.router.showPage("dashboard-page");
    this.updateUserInfo();
    this.router.navigateTo("posts");
    this.updateActiveNav("posts");
  }

  updateUserInfo() {
    const userInfo = document.getElementById("user-info");
    if (userInfo && this.currentUser) {
      userInfo.textContent = `Welcome, ${this.currentUser}`;
    }
  }

  updateActiveNav(activeRoute) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.route === activeRoute);
    });

    const sections = document.querySelectorAll(".content-section");
    sections.forEach((section) => {
      section.classList.remove("active");
    });

    const activeSection = document.getElementById(
      `${activeRoute.replace("-", "-")}-section`
    );
    if (activeSection) {
      activeSection.classList.add("active");
    }
  }

  async loadPosts() {
    this.showLoadingState();

    try {
      await this.postsService.loadPosts();
      this.renderPosts();
    } catch (error) {
      this.showErrorState();
    }
  }

  showLoadingState() {
    const states = [
      "loading-state",
      "error-state",
      "empty-state",
      "posts-table",
    ];
    states.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = id === "loading-state" ? "flex" : "none";
      }
    });
  }

  showErrorState() {
    const states = [
      "loading-state",
      "error-state",
      "empty-state",
      "posts-table",
    ];
    states.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = id === "error-state" ? "flex" : "none";
      }
    });
  }

  renderPosts() {
    const postsData = this.postsService.getCurrentPageData();
    const postsTable = document.getElementById("posts-table");
    const emptyState = document.getElementById("empty-state");
    const loadingState = document.getElementById("loading-state");
    const errorState = document.getElementById("error-state");

    // Hide all states first
    [loadingState, errorState, emptyState].forEach((el) => {
      if (el) el.style.display = "none";
    });

    if (postsData.posts.length === 0) {
      if (emptyState) emptyState.style.display = "flex";
      if (postsTable) postsTable.style.display = "none";
      this.updatePagination(postsData.pagination);
      return;
    }

    // Show posts table
    if (emptyState) emptyState.style.display = "none";
    if (postsTable) {
      postsTable.style.display = "block";
      postsTable.innerHTML = this.generatePostsTable(postsData.posts);
    }

    this.updatePagination(postsData.pagination);
    this.attachPostActions();
  }

  generatePostsTable(posts) {
    return `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${posts
                      .map(
                        (post) => `
                        <tr>
                            <td class="post-id">${post.id}</td>
                            <td class="post-title">${Utils.escapeHtml(
                              post.title
                            )}</td>
                            <td class="post-body">${Utils.escapeHtml(
                              post.body
                            )}</td>
                            <td class="post-actions">
                                <button class="btn btn-secondary edit-post-btn" data-id="${
                                  post.id
                                }">Edit</button>
                                <button class="btn btn-danger delete-post-btn" data-id="${
                                  post.id
                                }">Delete</button>
                            </td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        `;
  }

  attachPostActions() {
    const editBtns = document.querySelectorAll(".edit-post-btn");
    const deleteBtns = document.querySelectorAll(".delete-post-btn");

    editBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const postId = parseInt(btn.dataset.id);
        this.editPost(postId);
      });
    });

    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const postId = parseInt(btn.dataset.id);
        this.deletePost(postId);
      });
    });
  }

  editPost(postId) {
    const post = this.postsService.getPost(postId);
    if (!post) return;

    // Navigate to edit form
    this.router.navigateTo("create-post");
    this.updateActiveNav("create-post");

    // Populate form
    const form = document.getElementById("post-form");
    const titleInput = document.getElementById("post-title");
    const bodyInput = document.getElementById("post-body");
    const formTitle = document.getElementById("form-title");

    if (form) form.dataset.editingId = postId;
    if (titleInput) titleInput.value = post.title;
    if (bodyInput) bodyInput.value = post.body;
    if (formTitle) formTitle.textContent = "Edit Post";
  }

  deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
      this.postsService.deletePost(postId);
      this.renderPosts();
      Utils.showToast("Post deleted successfully!", "success");
    }
  }

  resetPostForm() {
    const form = document.getElementById("post-form");
    const titleInput = document.getElementById("post-title");
    const bodyInput = document.getElementById("post-body");
    const formTitle = document.getElementById("form-title");

    if (form) {
      form.reset();
      delete form.dataset.editingId;
    }
    if (formTitle) formTitle.textContent = "Create New Post";

    // Clear validation errors
    Utils.clearErrors(["title-error", "body-error"]);
  }

  updatePagination(pagination) {
    const pageInfo = document.getElementById("page-info");
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (pageInfo) {
      pageInfo.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages} (${pagination.totalItems} total)`;
    }

    if (prevBtn) {
      prevBtn.disabled = pagination.currentPage <= 1;
    }

    if (nextBtn) {
      nextBtn.disabled = pagination.currentPage >= pagination.totalPages;
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DashboardApp();
});
