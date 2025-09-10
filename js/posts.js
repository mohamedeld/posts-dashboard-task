export class PostsService {
  constructor() {
    this.posts = [];
    this.filteredPosts = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.searchQuery = "";
    this.sortField = "id";
    this.sortOrder = "asc";
    this.nextId = 1000; // For new posts
  }

  async loadPosts() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.posts = await response.json();
      this.applyFiltersAndSort();
    } catch (error) {
      console.error("Failed to load posts:", error);
      throw error;
    }
  }

  setSearch(query) {
    this.searchQuery = query.toLowerCase();
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  setSorting(field, order) {
    this.sortField = field;
    this.sortOrder = order;
    this.applyFiltersAndSort();
  }

  setPageSize(size) {
    this.pageSize = size;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredPosts.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const posts = this.filteredPosts.slice(startIndex, endIndex);

    return {
      posts,
      pagination: {
        currentPage: this.currentPage,
        totalPages: Math.ceil(this.filteredPosts.length / this.pageSize),
        totalItems: this.filteredPosts.length,
        pageSize: this.pageSize,
      },
    };
  }

  applyFiltersAndSort() {
    // Apply search filter
    this.filteredPosts = this.posts.filter((post) => {
      if (!this.searchQuery) return true;

      return (
        post.title.toLowerCase().includes(this.searchQuery) ||
        post.body.toLowerCase().includes(this.searchQuery)
      );
    });

    // Apply sorting
    this.filteredPosts.sort((a, b) => {
      let aVal = a[this.sortField];
      let bVal = b[this.sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (this.sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }

  addPost(postData) {
    const newPost = {
      id: this.nextId++,
      userId: 1,
      title: postData.title,
      body: postData.body,
    };

    this.posts.unshift(newPost); // Add to beginning
    this.applyFiltersAndSort();
    this.currentPage = 1; // Go to first page to see new post
  }

  updatePost(id, postData) {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index !== -1) {
      this.posts[index] = {
        ...this.posts[index],
        title: postData.title,
        body: postData.body,
      };
      this.applyFiltersAndSort();
    }
  }

  deletePost(id) {
    this.posts = this.posts.filter((post) => post.id !== id);
    this.applyFiltersAndSort();

    // Adjust current page if necessary
    const totalPages = Math.ceil(this.filteredPosts.length / this.pageSize);
    if (this.currentPage > totalPages && totalPages > 0) {
      this.currentPage = totalPages;
    }
  }

  getPost(id) {
    return this.posts.find((post) => post.id === id);
  }
}
