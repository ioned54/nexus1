
const button = document.getElementById("exploreBtn");
const message = document.getElementById("message");

button.addEventListener("click", function () {
    message.textContent = "Welcome to NEXUS. Your journey starts here!";

    message.style.color = "#00e5ff";
    message.style.marginTop = "25px";

    button.textContent = "Explored!";
});