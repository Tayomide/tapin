const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '')

const button = document.getElementById("hamburger-menu")
const nav = document.getElementById("sidebar")

function toggleMenu() {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "300px") {
    sidebar.style.width = "0";
  } else {
    sidebar.style.width = "300px";
  }
}

button.addEventListener("click", toggleMenu)

const navLinks = document.querySelectorAll("#sidebar a");

navLinks.forEach(link => {
  const linkPath = link.getAttribute("href").replace(/^\/+|\/+$/g, '');
  if (linkPath === currentPath) {
    link.classList.add("current-page");
  }
});