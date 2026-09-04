const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll("nav a");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + id
          );
        });
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach(section => observer.observe(section));