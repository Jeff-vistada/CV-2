// assets/js/contact.js

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");

    if (!form) return;

    const loading = form.querySelector(".loading");
    const error = form.querySelector(".error-message");
    const success = form.querySelector(".sent-message");
    const button = form.querySelector("button[type='submit']");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        // Reset messages
        loading.style.display = "block";
        error.style.display = "none";
        success.style.display = "none";

        button.disabled = true;
        button.textContent = "Sending...";

        emailjs.sendForm(
            "service_mf2fgd7",
            "template_7qgimkm",
            form
        )
        .then(() => {

            loading.style.display = "none";
            success.style.display = "block";

            button.disabled = false;
            button.textContent = "Send Message";

            form.reset();

        })
        .catch((err) => {

            console.error(err);

            loading.style.display = "none";

            error.textContent =
                "Failed to send your message. Please try again.";

            error.style.display = "block";

            button.disabled = false;
            button.textContent = "Send Message";

        });

    });

});