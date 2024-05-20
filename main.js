document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger-image");
  const menu = document.querySelector(".menu");

  hamburger.addEventListener("click", function () {
    if (menu.classList.contains("show")) {
      menu.classList.remove("show");
    } else {
      menu.classList.add("show");
    }
  });
});
