import "./styles.scss";

// Function to control carousel
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const cards = document.querySelectorAll(".card");
    let currentIndex = 0;
    const gap = 15; // Adjust this to match the actual gap between your cards

    function updateCarousel() {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const shift = currentIndex * (cardWidth + gap);
        carousel.style.transform = `translateX(-${shift}px)`;
        updateButtonVisibility();
    }

    function updateButtonVisibility() {
        const prevButton = document.querySelector(".prev");
        const nextButton = document.querySelector(".next");
        if (cards.length > 1) {
            // Only manage buttons if there are multiple cards
            prevButton.style.visibility =
                currentIndex > 0 ? "visible" : "hidden";
            nextButton.style.visibility =
                currentIndex < cards.length - 1 ? "visible" : "hidden";
        }
    }

    document.querySelector(".prev").addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 1; // Cyclic navigation: go to the last card
        }
        updateCarousel();
    });

    document.querySelector(".next").addEventListener("click", () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Cyclic navigation: return to the first card
        }
        updateCarousel();
    });

    // Initial update to set everything correctly from the start
    updateCarousel();
});

// Function to control form submitting
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const successMessage = document.getElementById("successMessage");

    // Check if the event listener is already added
    if (form.dataset.listenerAttached) {
        return;
    }
    form.dataset.listenerAttached = true;

    // Flag to prevent multiple submissions
    let isSubmitting = false;

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting until it's validated

        if (isSubmitting) {
            return; // If already submitting, do nothing
        }

        let isValid = true;
        const firstName = document.getElementById("first-name");
        const lastName = document.getElementById("last-name");
        const email = document.getElementById("email");
        const companyName = document.getElementById("company");
        const jobTitle = document.getElementById("job-title");
        const msg = document.getElementById("comments");

        // Validate First Name
        if (!firstName.value.trim()) {
            showError(firstName, "First name is required");
            isValid = false;
        } else {
            clearError(firstName);
        }

        // Validate Last Name
        if (!lastName.value.trim()) {
            showError(lastName, "Last name is required");
            isValid = false;
        } else {
            clearError(lastName);
        }

        // Validate Email
        if (!validateEmail(email.value)) {
            showError(email, "Enter a valid email address");
            isValid = false;
        } else {
            clearError(email);
        }

        if (isValid) {
            // Set the flag to true to prevent multiple submissions
            isSubmitting = true;

            // Prepare form data
            const data = {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                companyName: companyName.value,
                jobTitle: jobTitle.value,
                msg: msg.value,
            };

            // Send the form data to the Firebase function
            fetch(
                "https://us-central1-e-square-idan.cloudfunctions.net/sendEmail",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            )
                .then((response) => response.text())
                .then((response) => {
                    console.log("Email sent successfully:", response);
                    successMessage.style.display = "block"; // Show the success message
                    successMessage.textContent =
                        "Thanks for reaching out! We will contact you soon.";

                    // Reset the flag after successful submission
                    isSubmitting = false;
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Error sending email.");

                    // Reset the flag in case of an error
                    isSubmitting = false;
                });
        } else {
            console.log("Form validation failed, not sending data");
        }
    });

    function showError(input, message) {
        const container = input.parentElement;
        const error = container.querySelector(".error-message");
        error.textContent = message;
        error.style.color = "red";
        input.style.borderColor = "red";
    }

    function clearError(input) {
        const container = input.parentElement;
        const error = container.querySelector(".error-message");
        error.textContent = "";
        input.style.borderColor = "";
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

// Function to control hamburger button
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

// Function to generate random square classes
document.addEventListener("DOMContentLoaded", function () {
    const squares = document.querySelectorAll(".small-square");
    const variations = [
        "small-square",
        "small-square-1",
        "small-square-2",
        "small-square-3",
    ];

    squares.forEach((square) => {
        const randomVariation =
            variations[Math.floor(Math.random() * variations.length)];
        square.classList.add(randomVariation);
    });
});

// Function to check if any part of an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

// Debounce function to limit the rate at which a function is called
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to add 'active' class to the menu items based on the viewport
function checkViewport() {
    const menuItems = document.querySelectorAll(".menu li");
    let activeFound = false;

    menuItems.forEach((item) => {
        const section = document.querySelector(
            item.querySelector("a").getAttribute("href")
        );
        if (section && isInViewport(section) && !activeFound) {
            item.classList.add("active");
            activeFound = true;
        } else {
            item.classList.remove("active");
        }
    });
}

// Debounced version of checkViewport
const debouncedCheckViewport = debounce(checkViewport, 100);

// Check viewport on load and on scroll
window.addEventListener("load", debouncedCheckViewport);
window.addEventListener("scroll", debouncedCheckViewport);
window.addEventListener("resize", debouncedCheckViewport);
