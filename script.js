
// IDEA MATES - JavaScript

// STEP 1: Connect buttons
const connectButtons = document.querySelectorAll(".connect-btn");

connectButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.textContent.trim() === "Connect") {
            button.textContent = "Connected";
            button.classList.add("connected");
        } else {
            button.textContent = "Connect";
            button.classList.remove("connected");
        }
    });
});
