export class Router {
  constructor() {
    this.currentRoute = "posts";
  }

  navigateTo(route) {
    this.currentRoute = route;
    this.updateURL(route);
  }

  updateURL(route) {
    const url = route === "posts" ? "#" : `#${route}`;
    window.history.pushState(null, "", url);
  }

  showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
      page.classList.toggle("active", page.id === pageId);
    });
  }

  getCurrentRoute() {
    return this.currentRoute;
  }
}
