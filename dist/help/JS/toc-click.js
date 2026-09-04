// toc-click.js

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");

  function setActiveLink(targetHref) {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === targetHref);
    });
  }

  // Handle clicks on TOC links
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      // Let the browser handle the scroll (anchor behavior)
      // but we still control the active class
      setActiveLink(href);
    });
  });

  // Optional: if page loads with a hash, set the correct active link
  if (window.location.hash) {
    setActiveLink(window.location.hash);
  }
});