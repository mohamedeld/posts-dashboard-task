# 📊 Vanilla JS Dashboard - Posts Manager

A small dashboard web app built with **HTML, CSS (Flexbox/Grid), and modern JavaScript (ES6+) only** – no frameworks.  
The app manages and visualizes posts fetched from the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/posts).  

---

## 🚀 Features

### 🔐 Authentication (Mocked)
- Login page with **email + password**.  
- Client-side validation:  
  - Valid email format.  
  - Password length ≥ 6 characters.  
- On successful login, an **auth token** is stored in `localStorage/sessionStorage`.  
- **Route guarding**:  
  - Authenticated users can access the Dashboard.  
  - Unauthenticated users are redirected to Login.  
- Logout clears the token and redirects back to Login.  

### 🖥 Dashboard Layout
- Responsive shell using **CSS Grid / Flexbox**.  
- Includes:  
  - Header with app title + logout.  
  - Sidebar navigation.  
  - Main content area.  

### 📑 Posts Table
- Fetches posts from JSONPlaceholder.  
- Vanilla JS table/list with:  
  - 🔎 **Search** by title/body (client-side).  
  - ↕️ **Sort** by ID or Title (ASC/DESC).  
  - 📄 **Pagination** with page size selector + Next/Prev controls.  
  - Displays **loading**, **error**, and **empty** states.  

### ✍️ Create & Edit Posts
- Create a new post or edit an existing one (in memory only – no API writes).  
- Form fields:  
  - **Title** (required, ≥ 3 chars).  
  - **Body** (required, ≥ 10 chars).  
- Client-side validation with error messages.  
- Updates reflected immediately in the table.  
- Supports **Cancel** and **Reset** actions.  

---

## 📂 Project Structure
